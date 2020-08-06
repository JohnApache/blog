# 手写 Webpack 插件

当前文档对应的 `webpack` 版本

```json
{
  "webpack": "^4.44.1",
  "webpack-cli": "^3.3.12"
}
```

## Webpack 插件的基础结构

```js
class TestPlugin {
  constructor(options = {}) {
    // 获取外部参数
    this.options = options;
  }

  apply(compiler) {
    //...todo
  }
}

module.exports = TestPlugin;
```

插件初始化接受一个插件配置参数 `options`, 插件包含一个 `apply` 方法，并接受一个 `compiler` 对象参数，该结构即为 `webpack` 插件的基础结构

`Webpack` 启动后，在读取配置的过程中会先执行 `new TestPlugin(options)` 初始化一个 `TestPlugin` 获得其实例。  
在初始化 `compiler` 对象后，再调用 `TestPlugin.apply(compiler)` 给插件实例传入 `compiler` 对象。  
插件实例在获取到 `compiler` 对象后，就可以通过 `compiler` 监听到 `Webpack` 广播出来的事件。并且可以通过 `compiler` 对象去操作 `Webpack`.

## Compiler 和 Compilation

在开发 `webpack-plugin` 时最常用的两个对象就是 `Compiler` 和 `Compilation`，它们是 `Plugin` 和 `Webpack` 之间的桥梁。

- `Compiler` 对象包含了 `Webpack` 环境所有的的配置信息，包含 `options`，`loaders`，`plugins` 这些信息，这个对象在 `Webpack` 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 `Webpack` 实例；  
  `Compiler` 中设置了一系列的事件钩子和各种配置参数，并定义了 `webpack` 诸如启动编译、观测文件变动、将编译结果文件写入本地等一系列核心方法。在 `plugin` 执行的相应工作中我们肯定会需要通过 `Compiler` 拿到 `webpack` 的各种信息。

- `Compilation` 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创建。`Compilation` 对象也提供了很多事件回调供插件做扩展。通过 `Compilation` 也能读取到 `Compiler` 对象。

`Compiler` 和 `Compilation` 的区别在于：`Compiler` 代表了整个 `Webpack` 从启动到关闭的生命周期，而 `Compilation` 只是代表了一次新的编译。

## 插件的常用对象简介

| **对象**         | **钩子**                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `Compiler`       | `run`,`compile`,`compilation`,`make`,`emit`,`done`                                                |
| `Compilation`    | `buildModule`,`normalModuleLoader`,`succeedModule`,`finishModules`,`seal`,`optimize`,`after-seal` |
| `Module Factory` | `beforeResolver`,`afterResolver`,`module`,`parser`                                                |
| `Module`         |                                                                                                   |
| `Parser`         | `program`,`statement`,`call`,`expression`                                                         |
| `Template`       | `hash`,`bootstrap`,`localVars`,`render`                                                           |

> 写插件的话 一般只涉及到 `Compiler` 和 `Compilation`

## 插件常用方法介绍

插件可以用来修改输出文件、增加输出文件、甚至可以提升 `Webpack` 性能、等等，总之插件通过调用 `Webpack` 提供的 `API` 能完成很多事情。

1. **读取输出资源、代码块、模块及其依赖**

当 `Compiler` 触发 `emit` 事件钩子的时候，可以通过 `Compilation` 获取到 `Webpack` 的处理结果， 在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容

```js
class TestPlugin {
  constructor(options = {}) {
    // 获取外部参数
    this.options = options;
  }

  apply(compiler) {
    //...todo
    compiler.hooks.emit.tap('TestPlugin', compilation => {
      // compilation.chunks 存放所有代码块，是一个数组
      const chunks = compilation.chunks || [];
      chunks.forEach(chunk => {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(module => {
          // module 代表一个模块
          // module.dependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.dependencies.forEach(dep => {
            // dep 是一个依赖， dep.module 是当前模块
          });
        });
      });
    });
  }
}

module.exports = TestPlugin;
```

> Tips: `compiler.plugin('emit', (compilation, callback) => {})` 该种写法已经废弃 ，最新绑定方式使用 `compiler.hooks.emit.tap('TestPlugin', compilation => {})`

2. **监听文件变化**  
   在开发插件时经常需要知道是哪个文件发生变化导致了新的 `Compilation`, 为此可以使用如下代码

```js
class TestPlugin {
  constructor(options = {}) {
    // 获取外部参数
    this.options = options;
  }

  apply(compiler) {
    //...todo
    compiler.hooks.watchRun.tap('TestPlugin', compiler => {
      // 获取发生变化的文件列表
      const changedFiles = compiler.watchFileSystem.watcher.mtimes;
      // changedFiles 格式为键值对，键为发生变化的文件路径。
      // 文件路径为全路径
      if (changedFiles[this.options.filePath] !== undefined) {
        // filePath 对应的文件发生了变化
      }
    });
  }
}

module.exports = TestPlugin;
```

默认情况下 `Webpack` 只会监视入口和其依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个 `HTML` 文件。  
由于 `JavaScript` 文件不会去导入 `HTML` 文件，`Webpack` 就不会监听 `HTML` 文件的变化，编辑 `HTML` 文件时就不会重新触发新的 `Compilation`.  
为了监听 `HTML` 文件的变化，我们需要把 `HTML` 文件加入到依赖列表中，为此可以使用如下代码

```js
class TestPlugin {
  constructor(options = {}) {
    // 获取外部参数
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterCompile.tap('GzipPlugin', compilation => {
      // compilation.fileDependencies 是一个 Set 集合
      // 把 要额外监视的 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
      compilation.fileDependencies.add(this.options.filePath);
    });
  }
}

module.exports = TestPlugin;
```

3. **修改输出资源文件**

有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听 `emit` 事件，因为发生 `emit` 事件时所有模块的转换和代码块对应的文件已经生成好，
需要输出的资源即将输出，因此 `emit` 事件是修改 `Webpack` 输出资源的最后时机

所有需要输出的资源会存放在 `compilation.assets` 中，`compilation.assets` 是一个键值对，`key`为需要输出的文件名称，`value`为文件对应的内容。

下面是一个生成列出所有资源文件的 demo:

```js
class TestPlugin {
  constructor(options = {}) {
    // 获取外部参数
    this.options = options;
    this.fileName = options.fileName || 'FileList.md';
  }

  apply(compiler) {
    compiler.hooks.emit.tap('TestPlugin', compilation => {
      // compilation.assets 是一个键值对，key 为需要输出的文件名称，value为文件对应的内容。
      const assets = compilation.assets;
      let fileContent = `打包资源列表：\n`;
      Object.keys(assets).forEach(filename => {
        fileContent += `- ${filename} \n`;
        // 读取名称为 fileName 的输出资源
        const asset = assets[filename];
        // 获取输出资源的内容
        console.log(asset.source());
        // 获取输出资源的文件大小
        console.log(asset.size());
      });

      // 设置名称为 fileName 的输出资源
      compilation.assets[this.fileName] = {
        // 返回文件内容
        source: () => {
          // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
          return fileContent;
        },
        // 返回文件大小
        size: () => {
          // return Buffer.byteLength(fileContent, 'utf8');
          return fileContent.length;
        },
      };
    });
  }
}

module.exports = TestPlugin;
```

## 编写一个 支持 Gzip 和 Brotli 压缩插件实践

压缩核心功能依赖 Node `zlib` 模块处理编译后的资源即可

```js
const zlib = require('zlib');

const DEFAULT_COMPRESS_OPTIONS = {
  deleteOriginalAssets: false, // 是否删除压缩前的文件，看情况配置
  algorithm: 'gzip', // 压缩算法，默认就是gzip
  test: /./, // 所有文件都压缩
  threshold: 1000, // 只处理比这个值大的资源。按字节计算
  minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
};

class CompressPlugin {
  constructor(options = {}) {
    this.options = {
      ...DEFAULT_COMPRESS_OPTIONS,
      ...options,
    };
  }

  compressSync(buf) {
    const { algorithm } = this.options;
    switch (algorithm.toLowerCase()) {
      case 'brotli':
        return zlib.brotliCompressSync(buf);
      case 'gzip':
        return zlib.gzipSync(buf);
      default:
        return buf;
    }
  }

  getComporessedName(filename) {
    const { algorithm } = this.options;
    switch (algorithm.toLowerCase()) {
      case 'brotli':
        return `${filename}.br`;
      case 'gzip':
        return `${filename}.gz`;
      default:
        return filename;
    }
  }

  apply(compiler) {
    const { deleteOriginalAssets, test, threshold, minRatio } = this.options;

    compiler.hooks.emit.tap('CompressPlugin', compilation => {
      const assets = compilation.assets;
      Object.keys(assets).forEach(filename => {
        // 按文件名过滤，默认不过滤
        if (!test.test(filename)) return;
        const asset = assets[filename];

        // 只处理比这个值大的资源。按字节计算
        if (asset.size() <= threshold) return;

        // 不支持的压缩方式不处理
        const compressedAssetName = this.getComporessedName(filename);
        if (filename === compressedAssetName) return;
        const compressedAsset = this.compressSync(asset.source());

        // 返回文件大小， 按字节算
        const compressedAssetSize = Buffer.isBuffer(compressedAsset)
          ? Buffer.byteLength(compressedAsset, 'utf8')
          : compressedAsset.length;

        // 只有压缩率比这个值小的资源才会被处理
        if (compressedAssetSize / asset.size() >= minRatio) return;

        assets[compressedAssetName] = {
          // 返回文件内容
          source: () =>
            // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
            compressedAsset,
          // 返回文件大小， 按字节算
          size: () => compressedAssetSize,
        };
        // 是否删除压缩前的文件，看情况配置
        if (deleteOriginalAssets) {
          delete assets[filename];
        }
      });
    });
  }
}

module.exports = CompressPlugin;
```

该示例完整代码仓库地址 <https://github.com/JohnApache/compress-webpack-plugin>

可以安装测试

```bash
$ npm i @dking/webpack-compress-plugin --dev
$ yarn add @dking/webpack-compress-plugin -D
```

使用方式

```js
// webpack.config.js
const path = require('path');
const CompressPlugin = require('@dking/compress-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CompressPlugin({
      deleteOriginalAssets: true, // 是否删除压缩前的文件，看情况配置, 默认false
      algorithm: 'brotli', // 压缩算法，默认就是gzip
    }),
  ],
};
```

> Tips: 不建议生产环境使用，该示例仅为 demo
