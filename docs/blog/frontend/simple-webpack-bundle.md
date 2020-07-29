# 手写仿 Webpack 的简易模块加载器

## 分析 Webpack 打包后文件

```js
(function(modules) {
  function __webpack_require__(moduleId) {
    var module = {
      exports: {},
    };
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__,
    );
    return module.exports;
  }
  return __webpack_require__('./example/entry.js');
})({
  './example/entry.js': function(
    module,
    __webpack_exports__,
    __webpack_require__,
  ) {
    // code...
  },
});
```

生成的代码结构如下：

- 最外层由一个自执行函数所包裹。
- 自执行函数会传递一个 `modules` 参数，这个参数是一个对象，{key: 文件路径,value: 函数}`value` 中的函数内部是打包前模块的 js 代码。
- 内部自定义一个 `require` 执行器，用来执行导入的文件，并导出 `exports。`
- 执行入口 `entry` 文件，在内部会递归执行所有依赖的文件，并将结果挂载到 `exports` 对象上。

## 整体流程分析

1. 读取入口文件 `entry`。
2. 将内容转换成 `ast` 语法树。
3. 深度遍历语法树，找到所有的依赖，并加入到一个数组中。
4. 将 `ast` 代码转换为可执行的 `js` 代码。
5. 编写 `require` 函数，根据入口文件，自动执行完所有的依赖。

代码解析相关的部分使用 `babel` 来解析即可，安装 `@babel/core`;

## 代码分层

- `createAsset`: 处理单个资源，并解析该文件相关联的依赖，返回资源对象
- `createGraph`: 处理入口文件，并递归循环遍历文件相关依赖，生成所有资源对象数组。
- `bundle`: 封装 require 函数，生成代码外壳包裹 将资源对象数组递归遍历， 实现依赖注入

## createAsset

创建资源：将一个单独的文件模块，处理成我们需要的对象。

- 使用 `ast` 语法树处理对应的依赖关系。
- 使用 `@babel/core` 将 `ast` 代码转换成可执行的代码。

```js
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
// 标识文件的id
let id = 0;
const createAsset = (filePath = '') => {
  // 解析读取文件，如果没有文件后缀尝试使用js 或者 jsx解析
  const extname = path.extname(filePath);
  if (!extname) {
    if (fs.existsSync(`${filePath}.js`)) {
      filePath = `${filePath}.js`;
    } else if (fs.existsSync(`${filePath}.jsx`)) {
      filePath = `${filePath}.jsx`;
    }
  }
  const code = fs.readFileSync(filePath, 'utf-8');
  // sourceType: module表示的是在严格模式下解析并且允许模块定义（即能识别import和expor语法）；script识别不了。
  const ast = babel.parseSync(code, {
    sourceType: 'module',
  });
  // 当前文件的 import 依赖, 去除重复依赖
  const dependencies = new Set();
  babel.traverse(ast, {
    ImportDeclaration({ node }) {
      // 只有 import 声明会进入该回调函数
      dependencies.add(node.source.value);
    },
  });
  // ast 转 code，并使用preset-envs插件
  const result = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env'],
  });
  return {
    id: id++,
    filePath: filePath,
    code: result.code,
    dependencies,
    mapping: {},
  };
};
```

## createGraph

根据入口文件，遍历所有依赖的资源对象，输出一个包含所有资源对象的数组。

```js
const createGraph = (entryPath = '') => {
  const dir = path.dirname(entryPath);
  const entryAsset = createAsset(entryPath);
  const modules = [entryAsset];
  let pos = 0;
  while (modules[pos]) {
    const asset = modules[pos];
    const dependencies = asset.dependencies;
    dependencies.forEach(depFilePath => {
      // 读取文件路径的真实路径是基于当前文件路径出发查找的
      const realPath = path.join(dir, depFilePath);
      const childAsset = createAsset(realPath);
      // mapping 是为了后续require文件名，查找对应的文件模块id
      asset.mapping[depFilePath] = childAsset.id;
      modules.push(childAsset);
    });
    pos++;
  }
  return modules;
};
```

## bundle

封装自执行函数，创建 require 方法，处理文件相互依赖。

```js
const bundle = (modules = []) => {
  let modulesCode = '{';
  modules.forEach(item => {
    // 通过资源Id 为key 查找对应的资源对象
    modulesCode += `
            ${item.id}: {
                fn: function(module, exports, require) {
                    ${item.code}
                },
                mapping: ${JSON.stringify(item.mapping)}
            },
       `;
  });
  modulesCode += '}';

  return `(function(modules){
        console.log(modules)
        const require = function(id) {
            const graph = modules[id];
            console.log(graph, id, modules);
            const { fn, mapping } = graph;
            const module = { exports: {} }
            const __webpack__require = function(filePath) {
                return require(mapping[filePath]);
            }
            fn(module, module.exports, __webpack__require);
            return module.exports;
        }
        require(0);
    })(${modulesCode})`;
};
```

## 完整代码

```js
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
// 标识文件的id
let id = 0;
const createAsset = (filePath = '') => {
  // 解析读取文件，如果没有文件后缀尝试使用js 或者 jsx解析
  const extname = path.extname(filePath);
  if (!extname) {
    if (fs.existsSync(`${filePath}.js`)) {
      filePath = `${filePath}.js`;
    } else if (fs.existsSync(`${filePath}.jsx`)) {
      filePath = `${filePath}.jsx`;
    }
  }
  const code = fs.readFileSync(filePath, 'utf-8');
  // sourceType: module表示的是在严格模式下解析并且允许模块定义（即能识别import和expor语法）；script识别不了。
  const ast = babel.parseSync(code, {
    sourceType: 'module',
  });
  // 当前文件的 import 依赖, 去除重复依赖
  const dependencies = new Set();
  babel.traverse(ast, {
    ImportDeclaration({ node }) {
      // 只有 import 声明会进入该回调函数
      dependencies.add(node.source.value);
    },
  });
  // ast 转 code，并使用preset-envs插件
  const result = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env'],
  });
  return {
    id: id++,
    filePath: filePath,
    code: result.code,
    dependencies,
    mapping: {},
  };
};

const createGraph = (entryPath = '') => {
  const dir = path.dirname(entryPath);
  const entryAsset = createAsset(entryPath);
  const modules = [entryAsset];
  let pos = 0;
  while (modules[pos]) {
    const asset = modules[pos];
    const dependencies = asset.dependencies;
    dependencies.forEach(depFilePath => {
      // 读取文件路径的真实路径是基于当前文件路径出发查找的
      const realPath = path.join(dir, depFilePath);
      const childAsset = createAsset(realPath);
      // mapping 是为了后续require文件名，查找对应的文件模块id
      asset.mapping[depFilePath] = childAsset.id;
      modules.push(childAsset);
    });
    pos++;
  }
  return modules;
};

const bundle = (modules = []) => {
  let modulesCode = '{';
  modules.forEach(item => {
    // 通过资源Id 为key 查找对应的资源对象
    modulesCode += `
            ${item.id}: {
                fn: function(module, exports, require) {
                    ${item.code}
                },
                mapping: ${JSON.stringify(item.mapping)}
            },
       `;
  });
  modulesCode += '}';

  return `(function(modules){
        console.log(modules)
        const require = function(id) {
            const graph = modules[id];
            console.log(graph, id, modules);
            const { fn, mapping } = graph;
            const module = { exports: {} }
            const __webpack__require = function(filePath) {
                return require(mapping[filePath]);
            }
            fn(module, module.exports, __webpack__require);
            return module.exports;
        }
        require(0);
    })(${modulesCode})`;
};

// 生成代码正常且可执行
const bundleCode = bundle(createGraph('./a'));
eval(bundleCode);
```

## 总结

本文实现了一个非常精简的打包工具。打包后的文件和源生 webpack 保持了一致，但剔除了 `loader` ， `plugin` 机制，以保持项目简洁。
