# Webpack 配置详解

> 全文基于 webpack **v4.41.0**版本

## 使用指南

#### 安装

安装 webpack

```shell
npm install webpack --save-dev
yarn add webpack -D
```

如果你使用 webpack 4+ 版本，你还需要安装 CLI。

```shell
npm install webpack-cli --save-dev
yarn add webpack-cli -D
```

#### 基本使用

入口文件 src/index.js

```js
import _ from 'lodash';
const createHelloWorld = () => {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
};

document.getElementById('root').appendChild(createHelloWorld());
```

创建 webpack 配置文件 webpack.config.js

```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

执行打包命令

```shell
npx webpack
```

可以看到 index.js 和 lodash.js 一起被打包到 dist 目录下的 main.js 文件中了

#### 管理资源

正常 webpack 只可以加载普通的 js 文件 如果需要加载 不同的文件，webpack 需要添加不同 loader 来支持加载不同格式文件

- 加载 css 资源文件
  为了能从 js 模块中加载 css 文件需要在 webpack 配置文件 的 moudule 配置中添加 style-loader 和 css-loader
  ```shell
  npm install style-loader css-loader --save-dev
  yarn add style-loader css-loader -D
  ```
  webpack 配置文件添加 module 配置 和 rules 规则
  ```js
  const path = require('path');
  module.exports = {
    input: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, './dist'),
    },
    module: {
      rules: [
        {
          test: /\.css$/, // 匹配规则
          use: [
            'style-loader',
            'css-loader', // style-loader 一定要放在css-loader 之前
          ],
        },
      ],
    },
  };
  ```
  这样就可以在 js 中使用 import './styles/index.css'加载 css 了, css 会被注入到 index.html 顶部 style 标签样式内联
  ```html
  <html>
    <head>
      ...
      <style>
        #root {
          background-color: #000;
          color: #fff;
        }
      </style>
    </head>
  </html>
  ```
  > 请注意，在多数情况下，你也可以进行 CSS 分离，以便在生产环境中节省加载时间。最重要的是，现有的 loader 可以支持任何你可以想到的 CSS 处理器风格 - postcss, sass 和 less 等。
- 加载图片和字体文件  
   通过 file-loader 可以 让 webpack 在 js 中加载图片 和字体文件，如果安装了 css-loader 和 html-loader 还可以在 html 和 css 文件中加载 字体图标 和 图片
  安装依赖
  ```shell
  yarn add file-loader -D
  ```
  修改配置
  ```js
  const path = require('path');
  module.exports = {
      input: './src/index.js',
      output: {
         filename: 'main.js',
         path: path.resolve(__dirname, './dist')
      }，
      module: {
          rules: [
              {
                 test: /\.(png|jpg|gif|svg)$/,
                 use: [
                     'file-loader'
                 ]
              },
              {
                  test: /\.(woff|otf|woff2|eot|ttf)/,
                  use: [
                      'file-loader'
                  ]
              }
          ]
      }
  }
  ```
  > url-loader 功能 和 file-loader 差不多，不过 url-loader 可以将小图片 替换成 base64 格式的 url
- 加载数据资源
  nodejs 内置支持加载 json 文件, 但是 xml, csv, tsv 等文件 需要添加 额外的 loader 配置 xml-loader csv-loader
  安装依赖
  ```shell
  yarn add csv-loader xml-loader -D
  ```
  修改配置
  ```js
   const path = require('path');
  module.exports = {
      input: './src/index.js',
      output: {
         filename: 'main.js',
         path: path.resolve(__dirname, './dist')
      }，
      module: {
          rules: [
              {
                 test: /\.xml$/,
                 use: [
                     'xml-loader'
                 ]
              },
              {
                  test: /\.(csv|tsv)/,
                  use: [
                      'csv-loader'
                  ]
              }
          ]
      }
  }
  ```

#### 管理输出

- 多入口文件管理
  通过修改 webpack.config.js 的 input 配置 可以添加 webpack 多入口文件
  ```js
  const path = require('path');
  module.exports = {
    input: {
      main: './src/index.js',
      some: './src/some.js',
    },
    output: {
      filename: '[name]-[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
  ```
- HtmlWebpackPlguin 的使用
  当有多入口文件管理的存在时，我们不得不，一直修改 index.html 文件来引入 webpack 打包后的多个文件, 这可以使用 html-webpack-plguin 插件解决这个问题
  安装依赖

  ```shell
  yarn add html-webpack-plugin -D
  ```

  修改配置

  ```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = {
    input: {
      main: './src/index.js',
      some: './src/some.js',
    },
    output: {
      filename: '[name]-[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hello World' + new Date(),
        template: './index.html',
        hash: true,
      }),
    ],
  };
  ```

  具体的 html-webpack-plugin 配置可以参考 [这里](https://www.npmjs.com/package/html-webpack-plugin#)
  html-webpack-plugin 可以帮助我们生成一个 index.html，即使之前 dist 包含 html 也会覆盖上去,动态生成的 html 会自动引入所需要的依赖

- CleanWebpackPlugin 的使用
  webpack 每次构建时不会自动清理目标路径的 文件，现在可以使用 clean-webpack-plugin 来帮助我们自动清理文件
  新版的 clean-webpack-plugin 不需要手动传入目标路径，它会自动根据上下文环境配置 读取到 输出目录 output.path, 并清空该目录
  安装依赖
  ```shell
  yarn add clean-webpack-plugin -D
  ```
  修改配置,该插件 放在其他插件之前执行
  ```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = reuqire('clean-webpack-plugin');
  module.exports = {
    input: {
      main: './src/index.js',
      some: './src/some.js',
    },
    output: {
      filename: '[name]-[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Hello World' + new Date(),
        template: './index.html',
        hash: true,
      }),
    ],
  };
  ```
  具体 CleanWebpackPlugin 的相关配置 可以 [在这里查看](https://www.npmjs.com/package/clean-webpack-plugin)
- WebpackManifestPlugin 使用
  有时候你可能会感兴趣，webpack 及其插件似乎“知道”应该哪些文件生成。答案是，通过 manifest，webpack 能够对「你的模块映射到输出 bundle 的过程」保持追踪。
  安装依赖
  ```shell
  yarn add webpack-manifest-plugin -D
  ```
  修改配置
  ```js
  const path = require('path');
  const WebpackMainfestPlugin = require('webpack-manifest-plugin');
  module.exports = {
    input: {
      main: './src/index.js',
      some: './src/some.js',
    },
    output: {
      filename: '[name]-[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new WebpackMainfestPlugin()],
  };
  ```

#### 构建开发环境

- 使用 sourcemap
  配置 devtool 属性即可以 生成对应文件的 sourcemap，具体 devtool 的属性可选配置 可以[查看这里](https://webpack.js.org/configuration/devtool/)
  ```js
  module.exports = {
    entry: './index.js',
    output: {
      filename: '[name]-[contenthash].js',
      path: './dist',
    },
    devtool: 'source-map',
  };
  ```
- 使用观察模式

  ```shell
  webpack --watch
  ```

  webpack 将会监视所有依赖关系图中的文件，当文件发生改变 会自动触发重新构建，唯一的缺点是您必须刷新浏览器才能查看更改，这里使用 webpack-dev-server 可以帮助我们实现这一点

- 使用 webpack-dev-server
  webpack-dev-server 提供了一个简单的 Web 服务器以及使用实时重新加载的功能
  安装依赖
  ```js
  yarn add webpack-dev-server -D
  ```
  修改 webpack.config.js 配置
  ```js
  module.exports = {
      entry: './src/index.js',
      output: {
          filename: '[name]-[contenthash].js',
          path: './dist'
      },
      devtool: 'source-map',
      devServer: {
          contentBase: './dist',
          port: 9000,
          publicPath:
      }
  }
  ```
  > webpack-dev-server 编译后不写入任何输出文件。相反，它将捆绑文件保存在内存中，并像在服务器根路径上挂载的真实文件一样提供它们。如果您的页面希望在其他路径上找到捆绑文件，则可以使用**publicPath**开发服务器的配置中的选项进行更改。
  > 启动 weback-dev-server, 会自动打开浏览器 并实时刷新
  ```shell
  webpack-dev-server --open
  ```
- 使用 webpack-dev-middleware
  webpack-dev-middleware 是一个包装程序，它将由 webpack 处理的文件发送到服务器。它在 webpack-dev-server 内部使用，但是如果需要，它可以作为单独的软件包使用，以允许进行更多自定义设置
  koa 使用实例

  ```js
  import Koa from 'koa';
  import webpack from 'webpack';
  import webpackDevMiddleware from 'koa-webpack-dev-middleware';
  import webpackConfig from './webpack.config.js';

  const compiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compiler, {
      host: 'localhost',
      contentBase: './dist',
    }),
  );

  app.listen(9999, () => {
    console.log('server run in port 9999!');
  });
  ```

#### 代码分割

代码拆分是 webpack 最引人注目的功能之一。此功能使您可以将代码分成多个捆绑包，然后可以按需或并行加载。它可用于实现较小的捆绑包并控制资源负载优先级，如果正确使用，则会对负载时间产生重大影响。

- webpack 提供三种方式实现代码分割

  - 配置 webpack.config.js 的 文件入口点 entry 配置, 配置多个入口手动拆分代码
  - 防止重复，webpack 内部使用了 splitChunksPlugin 来删除重复引用的代码并将代码单独拆分
  - 动态导入，通过模块内的内联函数调用拆分代码。

- entry 多入口文件拆分代码
  这是拆分代码的最简单，最直观的方法

  ```js
  const path = require('path');
  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
  ```

  该方法存在一点问题，多个入口文件的 重复模块代码，会同时包含在每个入口文件里，而且这种方法不能用于通过核心应用程序逻辑动态拆分代码。

- 使用 splitChunksPlugin 防止重复
  splitChunksPlugin 允许我们将重复的依赖提取到一个现有的模块或一个全新的模块中，通过配置 optimization.splitChunks 使用该功能

  ```js
  const path = require('path');
  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      runtimeChunk: 'single',

      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /\/node_modules\//,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
  ```

  optimization.splitChunks 的具体配置可以[查看这里](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks)

- 动态导入分割代码
  有两种方法可让 webpack 动态分割代码，

  1. import() 语法 (推荐)
  2. require.ensure 传统方法

  import()呼叫在内部使用 Promise。如果您使用 import()较旧的浏览器，请记住 Promise 使用诸如 es6-promise 或 promise- polyfill 之类的 polyfill 进行填充。
  注意还需要在 output 配置上添加一个配置 **chunkFilename** ，他可以确定非输入模块文件的名称, 可以作用于动态导入单独分割的模块，不配置该属性，默认动态分割的模块名称是 0,1,2

  ```js
  const createElement = async () => {
    const { default: _ } = await import(/* webpackPreload: true */ 'lodash');
    const element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
  };

  (async () => {
    document.getElementById('root').appendChild(await createElement());
  })();
  ```

  我们需要 default 的原因是，从 webpack 4 开始，当导入 CommonJS 模块时，导入将不再解析为的值 module.exports

- prefetch 和 preload 模块
  webpack 4.6.0+增加了对预取和预加载的支持。
  - prefetch: 浏览器通常会在空闲状态取得这些资源，在取得资源之后搁在 HTTP 缓存以便于实现将来的请求。如果有多个‘预请求提示’则会在浏览器空闲时排队执行。当浏览器离开空闲状态时正好在‘预请求’资源，那么浏览器会取消任何正在进行中的请求（同时会将部分响应数据放置在缓存中，而在 Header 中继续使用 Content-Range 字段 ）并停止处理‘预请求’队列。
    在闲置时获取资源
  - preload: 这种“资源提示” 告诉浏览器这是一种在这次导航中必须的资源，只是会在之后才会被使用， chrome 甚至会在资源加载后 3 秒没有被使用时打印一个警告， 浏览器通常以中等优先级（非布局阻塞）获取此资源。
    正常获取，及早发现
    Preload 用于更早地发现资源并避免发起类似瀑布一样的请求。 它可以将页面加载降低到 2 次往返（1. HTML，2。所有其他资源）。 使用它不会花费额外的带宽。
    prefetch 用于使用浏览器的空闲时间来加速将来的导航。 当用户未执行预期的未来导航时，使用它可能会花费额外的带宽。
    具体文档可以[查看这里](https://www.zcfy.cc/article/link-rel-prefetch-preload-in-webpack)
    prefetch 实例
  ```js
  import(/* webpackPrefetch: true */ 'LoginModal');
  ```
  这将导致将<link rel="prefetch" href="login-modal-chunk.js">其附加在页面的开头，这将指示浏览器在空闲时间预取 login-modal-chunk.js 文件。
  preload 实例
  ```js
  import(/* webpackPreload: true */ 'ChartingLibrary');
  ```
  请求 charting-library-chunk 通过 <link rel="preload">

#### 缓存

- 输出文件名
  可以使用 output.filename 替换设置来定义输出文件的名称，webpack 提供了一种使用方括号括起来的字符串来替代文件名的方法.

  [contenthash] 表示的是资源文件内容唯一的哈希，当文件发生改变时 contenthash 就会发生变化,
  [name] 表示资源文件名称
  [hash] 随意哈希值
  [chunkhash]
  使用实例如下

  ```js
  const path = require('path');
  module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
  ```

- 提取样版
  webpack 提供了一种优化功能，可以使用该 optimization.runtimeChunk 选项将运行时代码分成单独的块。对其进行设置 single 以为所有块创建单个运行时捆绑包, 'single' 是 {name: 'runtime'} 的别名
  ```js
  const path = require('path');
  module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      //runtimeChunk: {
      //    name: 'runtime'
      //}
      runtimeChunk: 'single',
    },
  };
  ```
  optimization.runtimeChunk 该配置的 详细使用说明 [查看这里](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk)
  webpack 还可以将第三方库（例如 lodash 或）提取 react 到单独的 vendor 块中，通过配置 optimization.splitChunks.cacheGroups 选项
  ```js
  const path = require('path');
  module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /\/node_modules\//,
            chunks: 'all',
          },
        },
      },
    },
  };
  ```
  模块标识符， webpack 打包的时候，每个模块的 module.id 默认情况下，每个值都会根据解析顺序递增。意思是当解决顺序改变时，ID 也将改变。因此，让我们使用 optimization.moduleIds = 'hashed'选项，可以解决这个问题
  ```js
  const path = require('path');
  module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      moduleIds: 'hashed',
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /\/node_modules\//,
            chunks: 'all',
          },
        },
      },
    },
  };
  ```

#### 使用 webpack 构建库

- 使用实例
  ```js
  const path = require('path');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  module.exports = {
    mode: 'development',
    entry: './lib/index.js',
    output: {
      filename: 'util.js',
      path: path.resolve(__dirname, './lib-dist'),
      library: 'util',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    externals: {
      lodash: {
        root: '_',
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
      },
    },
    plugins: [new CleanWebpackPlugin()],
  };
  ```

#### 使用 webpack 环境变量

使用 webpack 命令行环境选项 --env，可以往 webpack.config.js 中传入 env 对象. 此时配置文件导出的应该是一个函数 接收 env 对象

- 修改配置文件

  ```js
  const path = require('path');

  module.exports = env => {
    console.log('CCC: ', env.CCC); // 'local'
    console.log('AAA: ', env.AAA); // true

    return {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
    };
  };
  ```

- 运行构建命令
  ```shell
  webpack --env.AAA=111 --env.CCC=2
  ```

#### 模块热更新替换

热模块更换（或 HMR）是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需完全刷新

- 启用 webpack-de-server 的 hmr 热更新
  启用 webpack-dev-server 热更新模式很简单不需要安装 额外的插件，只需更新 webpack.config.js 的配置即可,添加 devServer.hot = ture;

  ```js
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    devServer: {
      contentBase: './dist',
      port: 9000,
      hot: true,
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
  ```

  现在，让我们更新 index.js 文件，以便在检测到内部 print.js 更改时告诉 Webpack 接受更新的模块。

  ```js
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
      printMe();
    });
  }
  ```

- 通过自定义服务器 koa 为例 做 热 hmr
  有的时候 我们需要 更灵活的配置 webpack-dev-server 的所有配置都封装在 webpack.config.js 中，但是我们可以自己搭建服务器，通过 webpack-dev-middleware 和 webpack-hot-middleware 中间件做热更新，这两个插件是居于

  ```js
  const Koa = require('koa');
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.js');
  const webpackDevMiddle = require('webpack-dev-middleware');
  const webpackHotMiddle = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  // express 中间件 转 koa中间件
  const applyExpressMiddleware = (expressMiddleware, req, res) => {
    const _send = res.send;
    return new Promise((resolve, reject) => {
      try {
        res.send = (...params) => {
          _send && _send.apply(res, params) && resolve(false);
        };
        expressMiddleware(req, res, () => resolve(true));
      } catch (error) {
        reject(error);
      }
    });
  };
  // 封装koa-webpack-dev-middleware
  const KoaWebpackDevMiddleWare = (compiler, options) => {
    const middleware = webpackDevMiddleware(compiler, options);
    return async (ctx, next) => {
      const hasNext = await applyExpressMiddleware(middleware, ctx.req, {
        ...ctx.res,
        send(content) {
          return (ctx.body = content);
        },
        setHeader(...params) {
          ctx.set.apply(ctx, params);
        },
      });
      hasNext && next();
    };
  };

  // 封装koa-webpack-hot-middleware
  const KoaWebpackHotMiddleware = (compiler, options) => {
    const middleware = webpackHotMiddleware(compiler, options);
    return async (ctx, next) => {
      const hasNext = await applyExpressMiddleware(
        middleware,
        ctx.req,
        ctx.res,
      );
      hasNext && (await next());
    };
  };

  const app = new Koa();

  app.use(
    KoaWebpackDevMiddleware(compiler, {
      host: 'localhost',
      contentBase: './dist',
      log: false,
      stats: {
        colors: true, // webpack编译输出日志带上颜色，相当于命令行 webpack –colors
        process: true,
      },
    }),
  );

  app.use(
    KoaWebpackHotMiddleware(compiler, {
      log: false,
      path: '/__webpack_hmr',
      heartbeat: 2000,
    }),
  );

  app.listen(9999, () => {
    console.log('server runnint on 9999 port!');
  });
  ```

- hmr 修改 style
  借助于 style-loader 的帮助，CSS 的模块热替换实际上是相当简单的。当更新 CSS 依赖模块时，此 loader 在后台使用 module.hot.accept 来修补 `<style>` 标签。不需要做额外的操作

#### tree shaking

- 将文件标记为无副作用(side-effect-free)
  在一个纯粹的 ESM 模块世界中，识别出哪些文件有副作用很简单。然而，我们的项目无法达到这种纯度，所以，此时有必要向 webpack 的 compiler 提供提示哪些代码是“纯粹部分”。
  这种方式是通过 package.json 的 "sideEffects" 属性来实现的。
  ```json
  {
    "name": "your-project",
    "sideEffects": false
  }
  ```
  如同上面提到的，如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 false，来告知 webpack，它可以安全地删除未用到的 export 导出。
  > 「副作用」的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export
  > 如果你的代码确实有一些副作用，那么可以改为提供一个数组：
  ```json
  {
    "name": "your-project",
    "sideEffects": ["./src/some-side-effectful-file.js", "*.css"]
  }
  ```
- 压缩输出
  通过如上方式，我们已经可以通过 import 和 export 语法，找出那些需要删除的“未使用代码(dead code)”，然而，我们不只是要找出，还需要在 bundle 中删除它们。为此，我们将使用 -p(production) 这个 webpack 编译标记，来启用 uglifyjs 压缩插件
  从 webpack 4 开始，也可以通过 "mode" 配置选项轻松切换到压缩输出，只需设置为 "production"。
  ```js
  const path = require('path');
  module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
  ```

#### 构建生产环境

#### shimming

- shimming 全局变量
  webpack 可以在全局环境填充全局变量, 使用 providePlugin 可以实现向全局环境提供变量的功能，我们还可以使用，ProvidePlugin 通过使用“数组路径”（例如[module, child, ...children?]）配置模块来公开模块的单个导出。
  ```js
  const path = require('path');
  const webpack = require('webpack');
  module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        _: 'lodash',
        _join: ['lodash', 'join'], // 单个模块的导出
      }),
    ],
  };
  ```
- 细粒度 shimming
  一些传统的模块依赖的 this 指向的是 window 对象。在接下来的用例中，调整我们的 index.js：
  ```js
  const path = require('path');
  const webpack = require('webpack');
  module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: require.resolve('./src/alert.js'),
          use: ['imports-loader?this=>window'],
        },
      ],
    },
  };
  ```
  需要注意的是 alert.js 必须是 module.exports 导出变量 否则 会报错
- 全局 exports
  你可能从来没有在自己的源码中做过这些事情，但是你也许遇到过一个老旧的库(library)，和上面所展示的代码类似。在这个用例中，我们可以使用 exports-loader，将一个全局变量作为一个普通的模块来导出
  创建一个 gloabl.js

  ```js
  const username = 'JohnApache';
  const fn = () => {
    console.log('fn');
  };
  const ddd = {
    test: () => console.log('test'),
    exec: () => console.log('exec'),
  };
  ```

  修改 webpack.config.js 配置

  ```js
  const path = require('path');
  const webpack = require('webpack');
  module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: require.resolve('./src/global.js'),
          use: ['exports-loader?username,fn,exec=ddd.exec'],
        },
      ],
    },
  };
  ```

  现在，从我们的输入脚本（即 src/index.js）中，我们可以 import { username, fn, exec } from './global.js';并且所有模块都应该顺利运行。

- polyfill
  具体优化方式 参考[babel-usage-doc](https://github.com/JohnApache/babel-usage-doc)

#### TypeScript

- 基础安装
  首先，执行以下命令，安装 TypeScript 编译器(compiler)和 loader：
  ```shell
  yarn add typescript ts-loader -D
  ```
  创建 tsconfig.json tsc --init
  ```json
  {
    "compilerOptions": {
      "outDir": "./dist/",
      "noImplicitAny": true,
      "module": "es6",
      "target": "es5",
      "allowJs": true,
      "source-map": true
    },
    "include": ["./src/**"]
  }
  ```
  修改 webpack.config.js
  ```js
  const path = require('path');
  module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: ['ts-loader'],
        },
      ],
    },
  };
  ```

#### 渐进式网络应用 PWA

渐进式网络应用程序(Progressive Web Application - PWA)，是一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app)。PWA 可以用来做很多事。其中最重要的是，在离线(offline)时应用程序能够继续运行功能。这是通过使用名为 Service Workers 的网络技术来实现的。

- 添加 workbox
  添加 workbox-webpack-plugin 插件，

  ```shell
  yarn add workbox-webpack-plugin -D
  ```

  调整 webpack.config.js 文件：

  ```js
  const path = require('path');
  const WorkboxPlugin = require('workbox-webpack-plugin');
  module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new WorkboxPlugin.GenerateSW({
        cacheId: 'seed-cache',
        importWorkboxFrom: 'cdn', // 可填`cdn`,`local`,`disabled`,

        skipWaiting: true, //跳过waiting状态
        clientsClaim: true, //通知让新的sw立即在页面上取得控制权
        cleanupOutdatedCaches: true, //删除过时、老版本的缓存

        //最终生成的service worker地址，这个地址和webpack的output地址有关
        // swDest: '../workboxServiceWorker.js',
        // include: [

        // ],
        //缓存规则，可用正则匹配请求，进行缓存
        //这里将js、css、还有图片资源分开缓存，可以区分缓存时间(虽然这里没做区分。。)
        //由于种子农场此站点较长时间不更新，所以缓存时间可以稍微长一些
        runtimeCaching: [
          {
            urlPattern: /.*\.js.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'seed-js',
              expiration: {
                maxEntries: 20, //最多缓存20个，超过的按照LRU原则删除
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /.*css.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'seed-css',
              expiration: {
                maxEntries: 30, //最多缓存30个，超过的按照LRU原则删除
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /.*(png|svga).*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'seed-image',
              expiration: {
                maxEntries: 30, //最多缓存30个，超过的按照LRU原则删除
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      }),
    ],
  };
  ```

  构建后 生成了 2 个额外的文件：sw.js 和体积很大的 precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js。sw.js 是 Service Worker 文件，precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js 是 sw.js 引用的文件，所以它也可以运行。可能在你本地生成的文件会有所不同；但是你那里应该会有一个 sw.js 文件。

- 注册 service-worker.js

  ```js
  import _ from 'lodash';
  import printMe from './print.js';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
  ```

  如果浏览器能够支持 Service Worker，你应该可以看到你的应用程序还在正常运行。然而，服务器已经停止了服务，此刻是 Service Worker 在提供服务。
