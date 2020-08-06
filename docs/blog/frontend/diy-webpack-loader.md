# 手写 Webpack Loader

## 前置知识概述

`webpack loader` 和 `plugin` 的区别是什么

- `Loader`:  
   用于对模块源码的转换，`loader`描述了 `webpack` 如何处理非 javascript 模块，并且在代码中引入这些依赖。`loader` 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或者将内联图像转换为 data URL。比如说：CSS-Loader，Style-Loader 等。

- `Plugin`:  
   是用来扩展 `Webpack` 功能的, 目的在于解决`loader`无法实现的其他事，通过在构建流程里注入钩子实现，它给 `Webpack` 带来了很大的灵活性。 通过`plugin`（插件）`webpack`可以实 `loader` 所不能完成的复杂功能，使用 `plugin` 丰富的自定义 `API` 以及生命周期事件，可以控制 `webpack` 打包流程的每个环节，实现对 `webpack` 的自定义功能扩展。。

## Loader 的基本结构

`Loader` 就是一个函数接受输入数据，并返回输出数据

```js
module.exports = function(source) {
  return source;
};
```

> Tips: `Loader` 函数不要使用箭头函数，很多 Loader 内部方法都需要通过 `this` 调用, 例如 `this.async()`, `this.cacheable()` 等等

## 加载 Loader 基本的方式

1. **path.resolve**

```js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            //这里写 loader 的路径
            loader: path.resolve(__dirname, 'loaders/test-loader.js'),
            options: {},
          },
        ],
      },
    ],
  },
};
```

2. **resolveLoader**

个人觉得没必要配置这个，，，

```js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            //这里写 loader 的路径
            loader: 'test-loader.',
            options: {},
          },
        ],
      },
    ],
  },
  resolveLoader: {
    // 告诉 webpack 该去那个目录下找 loader 模块
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
};
```

## 开发 Loader 的实用工具包

1. `loader-utils`: 它提供了很多有用的工具，最常用的一个就是获取传入 `loader` 的 `options`, 具体其他方法可以查看 [loader-utils](https://www.npmjs.com/package/loader-utils)

2. `schema-utils`: 可以用 `schema-utils` 提供的工具，获取用于校验 `options` 的 `JSON Schema` 常量，从而校验 `loader options`。 具体其他方法可以查看 [loader-utils](https://www.npmjs.com/package/schema-utils), `schema` 的规则使用的是 [avj-schema 规则](https://github.com/ajv-validator/ajv)

```js
const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');

const TestLoaderOptionsSchema = {
  type: 'object',
  properties: {
    minimize: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
};

module.exports = function(source) {
  const options = getOptions(this);
  validateOptions(TestLoaderOptionsSchema, options, {
    name: 'TestLoader',
    baseDataPath: 'options',
  });
  return source;
};
```

## this.cacheable() 缓存加速

在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。

为此，`Webpack` 会`默认缓存`所有 `Loader` 的处理结果，也就是说在需要被处理的文件或者其依赖的文件没有发生变化时， 是不会重新调用对应的 `Loader` 去执行转换操作的。 相当于默认调用 `this.cacheable(true)`

如果你想让 `Webpack` 不缓存该 `Loader` 的处理结果，可以 `this.cacheable(false)`

```js
module.exports = function(source) {
  this.cacheable(false); // 强制不缓存
  return source;
};
```

## this.async() 处理异步进程

`Loader` 有同步和异步之分，上面介绍的 `Loader` 都是同步的 `Loader`，因为它们的转换流程都是同步的，转换完成后再返回结果。

但在有些场景下转换的步骤只能是异步完成的，例如你需要通过网络请求才能得出结果，如果采用同步的方式网络请求就会阻塞整个构建，导致构建非常缓慢。

此时可以使用 `this.async()`, 将当前 `Loader` 标记为异步 `Loader`, 在 `this.async()` 返回值 `callback` 中返回`Loader`数据转换结果

```js
module.exports = function(source) {
  this.cacheable(); // 强制不缓存
  const callback = this.async();
  setTimeout(() => {
    callback(source);
  }, 2000);
};
```

## Loader 接受 Buffer 数据流

在默认的情况下，`Webpack` 传给 `Loader` 的原内容都是 `UTF-8` 格式编码的字符串。

但有些场景下 `Loader` 不是处理文本文件，而是处理二进制文件，例如 `file-loader`，就需要 `Webpack` 给 `Loader` 传入二进制格式的数据。

此时可以通过 `exports.raw` 属性告诉 `Webpack` 该 `Loader` 是否需要二进制数据

```js
module.exports = function(source) {
  if (!Buffer.isBuffer(source)) {
    //...Todo
  }
  return source;
};

// 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
module.exports.raw = true;
```

> Tips: `Loader` 返回的类型也可以是 `Buffer` 类型的, 在 `exports.raw !== true` 时，`Loader` 也可以返回 `Buffer` 类型的结果

## 编写一个 MarkdownLoader 实践

`Markdown` 相关功能模块

```js
// md.js
const MarkdownIt = require('markdown-it');

// 内置插件列表
const MarkdownItPluginsList = [
  'markdown-it-sup',
  'markdown-it-sub',
  'markdown-it-mark',
  'markdown-it-kbd',
  'markdown-it-kbd',
  'markdown-it-underline',
  'markdown-it-deflist',
  'markdown-it-checkbox',
  'markdown-it-emoji',
  'markdown-it-task-checkbox',
  'markdown-it-container',
  'markdown-it-anchor',
  'markdown-it-table-of-contents',
  'markdown-it-footnote',
  'markdown-it-imsize',
  'markdown-it-implicit-figures',
  'markdown-it-attrs',
  'markdown-it-math',
  'markdown-it-plantuml',
  'markdown-it-ins',
  'markdown-it-abbr',
  'markdown-it-smartarrows',
];

// 默认markdown 配置
const DEFAULT_MARKDOWN_OPTIONS = {
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: '',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight: null,
  plugins: [],
  disable: [],
};

const createMd = (options = {}) => {
  const finalOptions = Object.assign({}, DEFAULT_MARKDOWN_OPTIONS, options);
  const { plugins, disable } = finalOptions;

  delete finalOptions.plugins;
  delete finalOptions.disable;
  delete finalOptions.enable;

  const md = new MarkdownIt(finalOptions);

  // 启动自定义插件
  plugins.forEach(plugName => {
    if (MarkdownItPluginsList.includes(plugName)) return;
    MarkdownItPluginsList.push(plugName);
  });

  MarkdownItPluginsList.forEach(plugName => {
    const plug = require(plugName);
    md.use(plug);
  });

  // 找不到不会报错
  md.disable(disable, true);

  return md;
};

module.exports = createMd;
```

`Loader` 功能模块

```js
const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');
const createMd = require('./md');

/**
 * options 校验
 */
const MarkdownLoaderOptionsSchema = {
  type: 'object',
  properties: {
    html: { type: 'boolean' },
    xhtmlOut: { type: 'boolean' },
    breaks: { type: 'boolean' },
    langPrefix: { type: 'string' },
    linkify: { type: 'boolean' },
    typographer: { type: 'boolean' },
    quotes: {
      anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    highlight: { instanceof: 'Function' },
    plugins: { type: 'array', items: { type: 'string' } },
    disable: { type: 'array', items: { type: 'string' } },
  },
  additionalProperties: false,
};

module.exports = function(source) {
  this.cacheable();
  const options = getOptions(this);
  validateOptions(MarkdownLoaderOptionsSchema, options, {
    name: 'MarkdownLoader',
    baseDataPath: 'options',
  });
  const md = createMd(options);
  return md.render(source);
};
```

该示例完整代码仓库地址 <https://github.com/JohnApache/markdown-webpack-loader>

可以安装测试

```bash
$ npm i @dking/markdown-webpack-loader --dev
$ yarn add @dking/markdown-webpack-loader -D
```

使用方式

```js
// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /.md$/,
        use: [
          { loader: 'html-loader' },
          {
            loader: '@dking/markdown-webpack-loader',
            options: {
              html: true,
              plugins: [],
              disable: [],
            },
          },
        ],
      },
    ],
  },
};
```

该 `markdown-webpack-loader` 的 `options` 除了支持所有的 `markdown-it` 初始化参数外，还额外支持 `plugins`, 添加额外本地插件，以及 `disable`, 禁用某些插件功能
