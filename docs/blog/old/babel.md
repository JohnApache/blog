---
group:
  title: 旧文档迁移
  order: 9
---

# Babel 配置详解

## 前言

> 引用 babel 官方的介绍，Babel 是一个工具链，主要用于将 ECMAScript 2015+代码转换为当前和旧版浏览器或环境中的向后兼容版本的 JavaScript。

> 我自己的理解 babel 其实本质上就是一个 js 语言的**编译器**，通过将高版本的 js 语法解析成**ast 语法树**，再通过可插拔的插件机制，让每个插件都会对 ast 语法树做不同的处理，这样的插件集合组成了一个工具链，将 js 代码编译成向后兼容的 JavaScript。

我这里主要整理的是 babel-7.5+ 版本的内容

### babel 的快速使用

babel 的使用方式 有很多种，常用的 主要有命令行操作和基于配置文件的操作

- **命令行操作**
  babel 支持的命令行参数有很多，这里主要列举几个比较常用的
  - npx babel index.js 没有任何参数的，会编译指定文件并输出到控制台
  - npx babel index.js **--out-file, -o** ./dist/index.js 将 babel 的输出内容输出到指定的一个文件里, 源文件也可以是一个目录，babel 会把目录里的所有 js 都打包进 目标文件里
  - npx babel ./src **--out-dir, -d** 将指定的源目录的内容通过 babel 编译再输出到指定目标目录里，文件名不变
  - npx babel src --out-dir lib **--copy-files,-D** copyfile 将会复制文件从源目录到目标目录，不经过编译
  - npx babel src --out-dir lib **--ignore** "src/\*.spec.js","src/\*.test.js"，编译的源目录会按照 ignore 的参数会忽略匹配路经的文件
  - npx babel index.js -o index-c.js **--plugins**=@babel/proposal-class-properties,@babel/transform-modules-amd 插件参数提供了 babel 编译额外处理功能。所有的源 js 的 ast 树都会通过插件处理
  - npx babel index.js -o index-c.js **--presets**=@babel/preset-env,@babel/flow 预设参数，本质上就是多个插件参数的集合，都会提供 babel 编译额外处理功能
  - npx babel **--no-babelrc** script.js -o script-compiled.js --presets=react 忽略项目中的.babelrc 文件配置只使用 cli 的配置
  - npx babel **--rootMode=upward** script.js -o script-compiled.js 这个配置会让 babel 向上查找 babel 的全局配置，并确定项目根目录
    使用的完整命令行 demo
  ```shell
  npx babel --no-babelrc src -d lib --ignore "*.test.js", "*.spec.js" --presets=@babel/preset-env --plugins=@babel/transform-modules-amd
  ```
- **通过配置文件**
  关于 babel 的配置文件详情介绍可以[查看这里](#config_file)
  ```js
  // babel.config.js
  module.exports = {
    babelrc: false,
    presets: ['mininfy', '@babel/env'],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
        },
      ],
    ],
    ignore: [/^.+\.test\.js$/, /^.+\.spec\.js$/, './src/test'],
  };
  ```
  通过创建 babel.config.js 在项目的根目录，并在项目根目录运行 npx babel， 默认操作可以让 babel 编译通过这个配置文件编译内容了

### babel 的主要模块简介

> babel 现在的架构方式，已经将很多功能拆成不同的模块，这里主要介绍的模块 有 @babel/core, @babel/cli, @babel/node, @babel/polyfill, @babel/runtime, @babel/register

- **@babel/core** 这个是 babel 的核心库，本质上就是一个解析器，这个库提供了很多 api，可以将普通 js 解析成 ast 语法树

  ```js
  // @babel/core 使用api用例
  const babel = require('@babel-core');
  babel.transform('code()', (err, result) => {
    const {
      code, // 源代码
      map, // sourcemap
      ast, // ast语法树
    } = result;
  });
  ```

  模块详细介绍可查看下面的[babel 配置文件详析](#config_file)

- **@babel/cli** 提供 babel 命令行操作的能力，可以在本地计算机上全局安装 babel，不同命令的 script 入口文件都在@babel/cli/bin, 里面主要提供了 babel-cli 可执行脚本 babel.js 和 工具脚本 babel-external-helpers.js,模块详细介绍可查看[@babel/cli 介绍](#babel_cli)
  > e.g. npx babel ./src --out-dir dist
- **@babel/node** 是一个与 nodejs cli 完全相同的 cli，可以直接在终端中运行执行 js 代码，相比 nodejs，这个模块可以提供额外的 babel 预设和插件的处理编译，提供了支持 es6 的 repl(read-eval-print-loop)环境，但是对 es6 import export 模块加载并不支持,详细介绍可查看[@babel/node 介绍](#babel_node)
  > e.g. npx @babel/node -e "class Test { }"
- **@babel/polyfil** 该软件包实际上已经被弃用了，现在这个包其实就是是 core-js 的别名，它的主要作用就是提供对 es 高版本浏览器的一个补丁，用来兼容原本一些浏览器不支持的属性和方法，详细使用方法介绍可以查看[@babel/polyfill 介绍](#babel_polyfill)
- **@babel/runtime** 运行时插件，它可以重用那些 babel 编译时 es 代码注入的一些 polyfill 辅助代码，能够节省很大的编译代码体积。详细使用方法介绍可以查看[@babel/runtime](#babel_runtime)。

  > 注意：@babel/runtime 在 babel 7.4 版本以前使用的**core-js@2**， 不能支持 es 新增的实例方法 例如[].instance, 这些实例方法不能通过 runtime 去 polyfill，要完全 polyfill 的话只能使用 preset-enve + useBuiltIns 配置。 但是在 babel 7.4 之后版本，babel 提供了**core-js@3**，可以提供 runtime 支持实例方法的 polyfill。

- **@babel/register** 这个插件提供了 babel 的另一只使用方式，通过 require 钩子将 babel 方法绑定到 node require 模块上，这样所有 require 的文件都会通过 babel/register 进行运行时编译，具体介绍可以查看[@babel/register](#babel_register)。

### 具体使用方法

#### babel 的配置文件详析

\<span id="config_file"\> </span\>

###### 配置文件的类型

- 项目范围的配置（全局配置）
  - babel.config.js
- 文件相关配置 (局部配置)
  - .babelrc/.babelrc.js
  - package.json 带有"babel"属性

###### 项目范围的配置（全局配置）

babel 具有"根"的概念，默认根路径即为当前工作目录(path.resolve(process.cwd(),"babel.config.js"))，对于项目范围的配置，babel 默认会搜索根路径下的 **babel.config.js** , 也可以通过 npx babel --config-file 修改默认搜索配置文件的路径。
项目范围的配置与文件配置的物理位置是区分开的，项目范围配置非常适用于统一配置，在同一个工作目录下甚至可以允许插件和预设应用于"node_modules"下的文件。

> 注意：node_modules 下面的模块一般都是编译好的，所以尽量配置 exclude 剔除编译过程。如真的必要，可以把个例加到 babelrcRoots 中。

##### 文件关联配置(局部配置)

.babelrc/.babelrc.js/package.json#babel，与 babel.config.js 不同，它仅适用于当前自己包中的文件，当 babel 搜索目录的时候遇到 package.json 文件 会立即停止。

> 因此文件配置是一个单包的局部配置，除非设置 babelrcRoots,否则 babel 编译的时候会跳过这些非 root 的包

#### 配置文件的加载关系

新版本 Babel7.x 后引入了 babe.config.js 配置，与原来的 babelrc 共存，多个配置的加载关系也变得复杂了许多，下面我们来剖析一下他们的关系。

首先引用官方的一句话，babel7 真正所解决的痛点 [monorepo 类型的项目] ，这个 monorepo 是一个自造词，它表示的是一个大项目包含很多子项目的一种项目结构。

```js
|- packageA
  |-package.json
  |-.babelrc.js
|- packageB
  |-package.json
  |-.babelrc.js
|- packageC
  |-package.json
  |-.babelrc.js
|- node_modules
|- config.js
|- babel.config.js
|-.babelrc.js
|- package.json
```

这样的目录结构就是比较典型的 monorepo, 因为这个项目有一个根目录，它包含很多子项目或者子包。
这样的目录结构 babel 是怎么加载的呢？

1. 首先 babel 会加载根节点的 babel.config.js,这个是一个作用于整个项目甚至 node_modules 的 babel 配置
2. 全局配置中如果没有配置 babelrcRoots 字段，默认不会加载任何子模块的 babelrc 配置
3. 如果全局配置里添加了 babelrcRoots: ['.', './packageA', './packageB'];这样的配置，当 babel 编译到 packageA 和 packageB,会允许使用当前目录的 babelrc 配置以及全局配置去编译包里面的内容
4. 根节点的.babelrc 一般不需要，如果配置了的话 ，默认也是可用的

> 综上，我们可以利用 babel 7.x 的全局配置,配合子项目的.babelrc 配置， 将包含多个子模块的项目很好的编译

> 注意： 这里有一个问题，babel.config.js 全局配置是依赖于当前工作目录的。所以当 babel 的运行环境不 不是在根目录，例如 packageA 子包编译脚本可能是放在 packaageA 目录下的一个独立编译，这种情况 packageA 就无法加载到全局 babel 配置了。针对这种特殊情况，babel 提供了一个可配置命令选项，**--rootMode=upward**, 在子包运行 babel 的时候可以使用 npx
> babel --rootMode=upward, 这样 babel 会自动向上寻找全局配置，并确定项目的根目录

#### 总结 配置文件加载逻辑

1. babel.config.js 是全局配置，对整个项目都是有效果的，但是 babel 的执行环境需要注意，在子模块的 babel 需要配置 rootMode 参数向上查找全局配置
2. .babelrc 是对待编译文件生效的配置，只生效于当前包，另外子模块的 babelrc 想加载还需要全局配置 添加 babelrcRoots 配置选项
3. node_modules 下面的模块一般都是编译好的，除了特殊需要，一般是需要排除编译的，全局配置 exclude 选项

### babel 常用配置选项详解

- ##### babelrc
  参数类型：Boolean
  默认值： true
  当该配置选项为 true 的时候，允许 babel.config.js 加载 babelrc 的配置文件，配合 babelrcRoots 可以加载子包的 babel 配置，当为 false 的时候就完全禁止加载 babelrc 配置，整个项目只会有 babel.config.js 全局配置
- ##### babelrcRoots
  参数类型：boolean | MatchPattern | MatchPattern[]
  默认参数 opts.root
  babel 默认只会使用项目根节点的.babelrc 配置文件，如果需要使用子包的.babelrc 可以配置该参数允许加载子包的
- ##### root
  参数类型：String
  默认值：process.cwd();
  用来确定当前 babel 执行环境的的根目录位置，默认就是项目的根目录
- ##### rootMode
  参数类型："root" | "upward" | "upward-optional"
  默认： "root"
  这个配置选项，和 root 配置选项是关联的，定义了 babel 如何选择项目的根目录，通过传入不同参数可以选择 babel 不同的处理 root 值，以获得最终项目的根目录
  - "root" 传递原 root 值不变
  - "upward" 让 babel 从 root 的上级目录查找 babel.config.js 全局配置，如果没有会报错
  - "upward-optional" 让 babel 从 root 的上级目录查找 babel.config.js ,如果没有找到就回退到当前目录作为 babel 的根目录
    > 当 babel 构建的项目是 monorepo 结构的项目，需要基于每个子包运行构建测试的时候，babel 的执行环境在子包的环境，并没有 babel.config.js 全局配置，这个时候可以加入 roomMode: 'upward'参数，让 babel 从 root 上一级找全局配置合并当前 babelrc 的配置来构建当前项目目录的内容
- ##### plugins
  参数类型： String[] | [String, Options][]
  默认值：[]
  该选项配置包含了，当 babel 启动的时候要激活的 babel 插件数组
- ##### presets
  参数类型： String[] | [String, Options][]
  默认值：[]
  预设本质就是插件的集合，该配置表示 babel 处理文件要激活的预设插件数组.
- ##### extends
  参数类型：String
  该选项参数不能放置在 presets 选项配置上.
  该选项允许继承其他配置文件的配置，extends 选项在当前配置文件配置范围将会合并继承 extends 指向的配置文件的相同配置范围的配置内容，当前配置文件覆盖在继承文件配置之上
- ##### overrides
  参数类型：Options[]
  该选项参数不允许放置在嵌套的 overrides 配置和 env 配置里.
  该选项参数允许用户提供一个覆盖当前配置文件的配置内容的配置数组.使用实例
  ```js
  module.exports = {
    overrides: [
      {
        exclude: ['./lib/*', './utils/*'],
        test: /^.+\.js$/,
        compact: true,
      },
    ],
  };
  ```
  此功能经常配置 "test", "include", "exclude" 选项一起使用，可以提供 babel 覆盖当前全局配置的条件
- ##### envName

  参数类型 String
  默认值 process.env.BABEL_ENV || process.env.NODE_ENV || "development"
  只允许在 babel 编程选项中使用，不允许手动配置。
  该选项配置可以配合 env 选项配置参数，允许 babel 在加载配置期间 process.env.BABEL_ENV 指向 babel 的环境变量，通过不同的环境变量 让 babel 加载不同环境下的配置文件，该选项也可以 通过 **api.env()** 功能在 配置函数，插件和预设中使用

- ##### env
  参数类型：{ [envKey: string]: Options }
  该配置不允许放置在另一个 env 配置块里面使用
  该配置配合 babelName 环境变量 允许 babel 在不同环境变量下加载不同配置，envKey 指向的就是 envName 所代表的值
  > 注意：env[envKey] 的配置选项只会合并在当前 babel 根配置对象指定的选项上
  ```js
  module.exports = {
    presets: ['@babel/env'],
    development: {
      exclude: ['./lib/**'],
    },
    production: {
      include: ['node_modules/**'],
      presets: ['minify'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  };
  ```
- ##### test
  参数类型：`MatchPattern | Array<MatchPattern>`
  该选项配置是一个匹配规则或者规则列表，如果 babel 当前编译的文件和配置规则都不符合，则 babel 编译的时候会将该文件忽略，该选项经常配合 overrides 一起使用，让 babel 做配置文件条件输出，而且该选项可以放在配置文件的任何位置
- ##### include
  该选项配置是"test"选项的的别名
- ##### exclude
  参数类型：`MatchPattern | Array<MatchPattern>`
  与 include 配置相反，该配置表示的是当任意一个的匹配规则列表符合匹配当前编译文件的，babel 都会忽略该文件，该选项经常配合 overrides 一起使用，让 babel 做配置文件条件输出，而且该选项还可以放在配置文件的任何位置
  > 注意：test/include/exclude 配置文件会在 babel 准备合并配置之前就预先考虑到 test 选项，所以在 babel 切换不同的配置文件加载选项的时候，该选项已经被提前设置好了
- ##### ignore
  参数类型：`Array<MatchPattern>`
  该选项参数不允许放置在"presets"配置内
  功能与"exclude"类似，当 babel 编译的时候匹配到任意符合匹配规则列表的内容时，会立即中止当前所有的 babel 处理。完全禁用 babel 的其他处理
- ##### only
  参数类型：`Array<MatchPattern>`
  该选项参数不允许放置在"presets"配置内
  功能与 test/include 相似，明确让 babel 只编译 匹配规则列表的内容，禁用其他所有文件的内容处理
- ##### sourceMaps / sourceMap

  参数类型：boolean | "inline" | "both"
  默认值：false
  babel 创建 sourceMap， + true 为编译文件创建一个 sourceMap + inline 将 map 作为 data:url 直接内嵌到文件里 + both 既创建 map 也内嵌
  注意：该配置选项我自己实验的时候 只能在命令行中使用，在配置文件里配置无效,而@babel/cli 会将 map 写入到 **.map**后缀的格式文件内

- ##### sourceType
  参数类型："script" | "module" | "unambiguous"
  默认值："module"
  该选项配置参数主要引导 babel 的文件解析是否转换 import 或者 require，babel 默认处理模块是 es 模块，默认使用 import
  - script 使用 ECMAScript Script 语法解析文件。不允许 import/ export 语句，文件不是严格模式。
  - module 使用 ECMAScript Module 语法解析文件。并且允许 import/ export 语句，文件是严格模式。
  - unambiguous 如果当前文件有 import/export 则视为"module"， 否则将视为 "script"
    unambiguous 在类型未知的上下文中非常有用，但它可能导致错误匹配，因为 module 文件可能并没有使用 import/ export 语法。
- ##### compact
  参数类型：Boolean | "auto"
  默认值："auto"
  该配置选项引导 babel 是否开启紧凑模式，紧凑模式会省略所有可选的换行符和空格.
  当配置选项是”auto“的时候，babel 会根据文件的字符数判断，当字符长度 code.length > 50,000 时 会开启紧凑模式
- ##### minified
  参数类型：Boolean
  默认值：false
  该配置选项为 ture 的时候， 相当于 compact:true 基础上,还省略了块级作用域末尾的分号，以及其他很多地方省略，babel 尽可能的压缩代码，比 compact 更短的输出
- ##### comments
  参数类型：Boolean
  默认值：true
  **shouldPrintComment** 配置选项如果没有给出相应的注释函数，则提供默认的注释状态，当为 false 的时候就不展示注释
- ##### shouldPrintComment
      Type: (value: string) => boolean
  Default without minified: (val) => opts.comments || /@license|@preserve/.test(val)
  Default with minified: () => opts.comments
  该选项配置参数，是一个函数，可以让 babel 决定是否以怎样的规则展示注释 > 综上，可以判断出，预设插件 babel-preset-minify 的压缩效果其实等价于 配置 minified: true + commments: false  
   `js module.exports = { presets: [ 'minify', //预设插件 ], comments: false, minified: true, // { // minified: true, // commments: false // } === babel-preset-minify }`
  当忽略处理 node_modules 目录时，minify 插件或者 minfied 配置都对 node_modules 目录引入的东西不会压缩，实际上一般也建议压缩这一操作应该放在工程操作的最外层，例如 webpack 层 或者 rollup 层去压缩代码

### polyfill 详解

> @babel-polyfill 在 7.4 版本的时候就已经被弃用了，分化成 corejs + regenerator-runtime，现在的@babel/polyfill 只是 corejs2 的一个别名. 但是我这里主要讲要介绍这个包的应用，而是如何利用 babel 配置 polyfill ECMAScript，让我们可以在开发中使用很多新的功能，实例，静态方法等

- 使用@babel/presets-env 预设 + useBuiltIns + corejs 选项，
  ```js
  module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage', // 'usage', ‘entry’, false
          corejs: 3,
        },
      ],
    ],
  };
  ```
  需要注意的有几点
  - 当 useBuiltIns 有配置的时候，corejs 选项必须设置，我这里安装的是 core-js@3 所以配置成 3 ，如果安装的是@babel/polyfill 或者 core-js@2 ，corejs 选项就是 2
  - useBuiltIns 选项为 entry 的时候,在入口文件顶部引入@babel/polyfill,或者 core-js ,babel 会自动将所有的 polyfill 加载进来，非常鸡肋的功能。。
  - useBuiltIns 选项为 usage 的时候，就不需要在入口文件引入 @babel/polyfill,或者 core-js,引用 也会被 babel 删除，并在控制台打出警告。usage 会按需只加载文件中用到的 polyfill，
  - useBuiltIns 配置是覆盖 polyfill，会污染全局的 polyfill，如果不想污染全局，可以使用 transform-runtime 插件，当使用 corejs@2 或者 @babel/polyfill ，将不能支持实例方法的 polyfill，例如[].includes(),不过在 core-js@3 版本 已经可以支持了

### transform-runtime 运行时详解

这里主要需要介绍的插件就是@babel/plugin-transform-runtime,这是一个辅助程序，帮助 babel 重复使用在 babel 编译时 polyfill 注入的 helper 程序代码。和 useBuiltInstd 的 polyfill 最大的不同是，它不会污染全局变量。

> 注意：针对于实例方法的例如 [].includes()，只能通过@babel/runtime-corejs3,进行运行时 polyfill，或者单独引入 corejs 或者使用 useBuiltIns 选项以替代，运行时 polyfill。

- 安装方法

```shell
npm install @babel/plugin-transform-runtime --save-dev
npm install @babel/runtime-corejs3 --save
```

```js
module.exports = {
  presets: ['@babel/env'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
};
```

> 需要注意的有以下几点

- transform-runtime 运行时插件是依赖于 @babel/runtime 插件的，这里的运行时插件配置选项 corejs 为 3 ，所以需要安装@babael/runtime-corejs3 在生产依赖中。
- 插件@babel/plugin-transform-runtime 通常和预设 @babel/preset-env 并存的，当配置运行时插件的时候，预设 preset-env 就不需要配置 useBuiltIns 选项了

#### @babel/plugin-transform-runtime 的常用可配置参数详解

- **corejs**
  参数类型：false | 2 | 3 | { version: 2 | 3, proposals: Boolean }
  默认值：false
  该配置选项的主要作用就是让插件决定使用什么 corejs 版本作运行时 polyfill。 > 需要注意的几点 + 当 corejs 等于 2 的时候 或者 对象形式 version 为 2 的时候，仅支持全局变量(Map,Promise)和静态属性(Array.from())的 polyfill。 + 当 corejs 等于 3 的时候还可以支持实例属性([].includes())的 polyfill。 + 默认情况下 该插件不会 polyfill 还在提案中的方法，如果你想支持提案方法的 polyfill, 需要添加 corejs: {version:3, proposals: true}, + 针对不同的 corejs 配置还需要安装不同的 @babel/runtime 插件来支持运行时 polyfill - corejs: false 需要 npm install @babel/runtime --save - corejs: 2 需要 npm install @babel/runtime-corejs2 --save - corejs: 3 需要 npm install @babel/runtime-corejs3 --save

- **helpers**
  参数类型：Boolean
  默认值：true
  该配置参数让运行时插件决定，当调用模块的时候是否需要生产辅助程序代码(classCallCheck, extends, etc.) 替换 helpers。
  不建议修改此参数，通常 Babel 会在文件顶部放置帮助程序来执行常见任务，以避免在当前文件中复制代码，运行时插件就是通过该配置，可以重复使用相同模块的代码

- **regenerator**
  参数类型：Boolean
  默认值：true
  该配置参数让插件决定 polyfill 的代码，是否生成不会污染全局变量的函数。不建议修改此参数

- **useESModules**
  参数类型：Boolean
  默认值：false
  当为 true 的时候 该配置选项就不会运行@babel/plugin-transform-modules-commonjs，将 ES6 代码转化为 commonjs,.(不是很清楚这个配置参数有什么用，默认为 false 即可以)

### 细节配置问题

- **presets 预设列表和 plugins 插件列表的执行顺序**
  - 插件 plugins 的运行时机是在 预设 presets 之前的
  - 插件 plugins 列表的运行顺序是正序的，即从第一个到结尾依次执行
  - presets 预设列表的运行时机相反，倒叙执行，babel 时从最后一个执行到第一个
- **presets 和 plugins 的字符串命名问题**
  - presets 预设值是一个数组，数组的具体预设项命名规范是 babel-preset-[name], 这种包名称可以使用简写，babel 会自动从 node_modules 目录里寻找该插件，这个值也可以缩写为 babel/preset-[name] => [name]. 它也可以适用于范围包 @babel/babel-preset-[name] => @babel/[name], e.g.
    ```js
    module.exports = {
      presets: [
        'minify', // === 'babel-preset-minify'
        '@babel/env', // === '@babel/babel-preset-env',
        [
          '@babel/babel-preset-react', // === @babel/react
        ],
      ],
    };
    ```
  - plugins 插件值也是一个数组，他的命名规范同 presets 相同，只是 preset 替换成 plugin 而已。e.g.
    ```js
    module.exports = {
      plugins: [
        'myPlugin', // === 'babel-plugin-myPlugin'
        '@babel/myPlugin', // === '@babel/babel-plugin-myPlugin',同样适用于范围包
      ],
    };
    ```

## 工程实践

### Rollup + Babel 工程实践

这里 rollup 使用的是 1.19.x 版本

- **安装依赖**
  - 安装 rollup
  ```shell
  npm install rollup -D
  ```
  - 安装 rollup 插件 rollup-plugin-node-resolve, rollup-plugin-commonjs, rollup-plugin-babel
  ```shell
  npm install rollup-plugin-node-resolve rollup-plugin-commonjs rollup-plugin-babel -D
  ```
  - 安装 babel
  ```shell
  npm install @babel/core @babel/cli -D
  ```
  - 安装 babel 相关预设，@babel/preset 插件@babel/plugin-transform-runtime 以及@babel/runtime-corejs3 生产环境依赖
  ```shell
  npm install @babel/preset @babel/plugin-transform-runtime -D
  npm install @babel/runtime-corejs3 -S
  ```
- **构建配置**

  - 根目录创建 rollup.config.js

  ```js
  // rollup.config.js
  // rollup 支持es语法
  import path from 'path';
  import commonjs from 'rollup-plugin-commonjs';
  import resolve from 'rollup-plugin-node-resolve';
  import babel from 'rollup-plugin-babel';
  export default {
    input: path.resolve(__dirname, './src', 'index.js'),
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
        exclude: [],
      }),
      babel({
        runtimeHelpers: true, // 这个配置一定要设置，否则不能启用运行时 polyfill 插件，
        // 配置建议外置 其他配置放在babel.config.js内配置
      }),
    ],
    output: {
      dir: path.resolve(__dirname, 'dist/'),
      format: 'cjs',
    },
  };
  ```

  根目录创建 babel.config.js

  ```js
  // babel.config.js
  // babel 不支持es语法
  module.exports = {
    presets: ['@babel/env'],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
        },
      ],
    ],
    ignore: ['node_modules/**'],
  };
  ```

  其他 rollup 具体配置可以参考 [rollup 使用教程](https://github.com/JohnApache/rollup-usage-doc)

- 运行命令

```shell
npx rollup -c
```

### Gulp + Babel 工程实践

这里使用的 gulp 4.x 版本，新增了 series parallel 等 api

- 安装依赖
  - 安装 gulp
  ```shell
  npm install gulp --save-dev
  ```
  - 安装 gulp 工程需要的插件 gulp-babel gulp-uglify del 等的
  ```shell
  npm install gulp-babel gulp-uglify del --save-dev
  ```
  - 安装 babel
  ```shell
  npm install @babel/core @babel/cli -D
  ```
  - 安装 babel 相关预设，@babel/preset 插件@babel/plugin-transform-runtime 以及@babel/runtime-corejs3 生产环境依赖
  ```shell
  npm install @babel/preset @babel/plugin-transform-runtime -D
  npm install @babel/runtime-corejs3 -S
  ```
  - 安装@babel/register 使得 gulpfile 可以用 import/export 语法
  ```shell
  npm install @babel/register
  ```
- 构建配置

  - 因为使用的@babel/register，替换原本的 gulpfile.js，在根目录创建创建 gulpfile.babel.js

  ```js
  // gulpfile.babel.js
  import gulp from 'gulp';
  import babel from 'gulp-babel';
  import uglify from 'gulp-uglify';
  import del from 'del';

  const paths = {
    scripts: {
      src: 'src/**/*.js',
      dest: 'dist/',
    },
  };

  const clean = () => del(['dist']);

  const scripts = () => {
    return gulp
      .src(paths.scripts.src, {
        sourcemaps: true,
      })
      .pipe(babel())
      .pipe(uglify())
      .pipe(gulp.dest(paths.scripts.dest));
  };

  const build = gulp.series(clean, gulp.parallel(scripts));

  export default build;
  ```

  - 根目录创建 babel.config.js

  ```js
  const presets = ['@babel/env'];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ];

  const ignore = ['node_modules/**'];

  module.exports = {
    presets,
    plugins,
    ignore,
  };
  ```

- 运行命令

```shell
npx gulp
```

### Webpack + Babel 工程实践

- 安装依赖
  - 安装 webpack
  ```shell
  npm install webpack webpakc-cli -D
  ```
  - 安装 webpack babel 插件 babel-loader
  ```js
  npm install babel-loader -D
  ```
  - 安装 babel
  ```shell
  npm install @babel/core @babel/cli -D
  ```
  - 安装 babel 相关预设，@babel/preset 插件@babel/plugin-transform-runtime 以及@babel/runtime-corejs3 生产环境依赖
  ```shell
  npm install @babel/preset @babel/plugin-transform-runtime -D
  npm install @babel/runtime-corejs3 -S
  ```
- 构建配置

  - 根目录创建 webpack.config.js

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
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            // options: {
            //   presets: ['@babel/preset-env'],
            //   plugins: ['@babel/plugin-transform-runtime']
            // } 配置可以放在外面 也可以放在里面
          },
        },
      ],
    },
  };
  ```

  - 根目录创建 babel.config.js，如果 babel 配置写在 webpack 里面，就可以省略创建 该配置文件

  ```js
  const presets = ['@babel/env'];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ];

  const ignore = ['node_modules/**'];

  module.exports = {
    presets,
    plugins,
    ignore,
  };
  ```

- 运行命令

```shell
npx webpack
```

---

## 总结

以上就是全部我自己对 babel 的内容的一个大的整理

### Todo

- babel 插件开发
- babel 预设开发
