# Typescript 配置文件详解

### tsconfig.json

tsconfig.json 目录中存在文件表明该目录是 TypeScript 项目的根目录。该 tsconfig.json 文件指定编译项目所需的根文件和编译器选项

### 使用 tsconfig.json

- 终端调用 tsc 命令 没有指定 tsconfig.json file 时，这种情况下，编译器将会从 当前目录向上级逐层 查找 tsconfig.json 文件
- 终端调用 tsc 命令 没有指定 tsconfig.json file 时 但是使用 --project/-p 命令来指定 tsconfig.json 文件所在的目录，或者直接指向 有效 json 文件配置的文件路径

### tsconfig 配置选项属性详解

- **files**
  类型：Array
  该属性是一个 相对路径 或者 绝对路径的 文件 列表,它显示指定了 tsc 编译器需要编译的文件列表

- **include**
  类型：Array
  该属性也是一个列表 ，指定 ts 需要检查的文件 路径， 和 files 不同的是，列表的每一个值是 采用 glob 通配符匹配支持的扩展名文件，include 支持的 glob 通配符有三种：

  - “\*” 匹配零个或多个字符（不包括目录分隔符）
  - “?” 匹配任何一个字符（不包括目录分隔符）
  - “\*\*/” 递归匹配任何子目录

- **exclude**
  类型: Array
  同 include 一样的 glob-like 数组列表，指定 排除 检查的 文件路径，可以排除 include 包含的 文件路径，但是 不能排除 files 直接指定的文件，"exclude"属性默认为不包括 node_modules，

  > 注意 ：
  >
  > > 1.  如果"files"和"include"两者都未指定， ts 就会使用默认搜索条件检查文件.
  > > 2.  如果指定了"files"或"include"属性，则编译器将包含这两个属性包含的文件的并集
  > > 3.  ts 支持搜索检查的文件 扩展名 有 .ts，.tsx 和.d.ts 文件， 如果配置了 **allowJs** 选项还会包括 .js / .jsx 文件

  具体配置使用 demo 如下；

  ```json
  {
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "./dist-test",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true
    },
    "files": ["./src/enum.ts", "./src/namespace/n1.ts"],
    "include": ["src/namespace/*", "src/module/*"],
    "exclude": ["src/namespace/n2.ts", "src/module/m11.ts"]
  }
  ```

- **typeRoots**
  类型: `Array<string>`
  该选项是 compilerOption 选项下的一个属性， 该配置属性是一个 路径数组，指定 ts 举要查询的 “@type” 包的位置
  默认情况下 所有可见的， 所有可见的 “@types”包都包含在您的编译中。node_modules/@types 任何封闭文件夹中的包都被认为是可见的;
  如果 typeRoots 指定，则仅包括 typeRoots 下面的包
  ```json
  {
      "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "./dist-test",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true,
      "typeRoots": [
          "./node_modules/@types",
          "./src/module",
          "./src/namespace"
      ],
  }
  ```
- **types**
  类型: `Array<string>`
  该选项是 compilerOption 选项下的一个配置属性，该选项是一个 “@types”包名称数组。
  指定 types 属性 怎配置文件 将仅检索指定名称的 @types 包，

  ```json
  {
      "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "./dist-test",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true,
      "types": [
          "mocha",
          "node"
      ],
  }
  ```

  当 types = [] 时，则表示 禁止任何自动包含 @types 包。

  > 注意：
  >
  > > 只用当你使用了全局环境声明的时候，自动包含 才重要，如果没有用到 全局声明的时候，就可以不需要自动包含 @types 全局声明,使用 import "module" 的时候，ts 仍然会自动插叙 node_modules＆node_modules/@types 文件夹 查找对应声明包。

- **extends**
  类型: string
  tsconfig.json 文件可以使用该 extends 属性从另一个文件继承配置，该选项属性值是一个字符串,表示的是另一个配置文件的访问路径
  配置选项使用 demo 如下
  tsconfig/tsconfig-base.json
  ```json
  {
      "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "./dist-test",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true,
  }
  ```
  tsconfig/tsconfig-file.json
  ```json
  {
    "extends": "./tsconfig-base",
    "files": ["../src/enum.ts", "../src/namespace/n1.ts"],
    "include": ["../src/namespace/*", "../src/module/*"],
    "exclude": ["../src/namespace/n2.ts", "../src/module/m11.ts"]
  }
  ```
  tsconfig/tsconfig-nostrict.json
  ```json
  {
    "extends": "./tsconfig-test",
    "compilerOptions": {
      "strictNullChecks": false,
      "strict": false
    }
  }
  ```
- **compileOnSave**  
   类型: Boolean
  该属性是 tsconfig.json 的顶级属性，当为 true 的时候，ide 会在用户保存的时候 按照当前的 tsconfig.json 文件 规则编译文件,

  ```json
  {
    "extends": "./tsconfig-base",
    "compileOnSave": true
  }
  ```

  实验证明 并不是很好用，输出位置不是按照我们想要的规则输出

- **allowJs**
  类型: Boolean
  默认值: false
  该配置选项表示是否 编译 .js 或者 .jsx 文件

  ```json
  {
    "extends": "./tsconfig-base",
    "compilerOptions": {
      "allowJs": true
    }
  }
  ```

- **allowSyntheticDefaultImports**
  类型：Boolean
  默认值: module === "system" 或设置了 --esModuleInterop
  允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。 具体含义 [查看这里](https://segmentfault.com/a/1190000018249137)

- **allowUmdGlobalAccess**
  类型：Boolean
  默认值: false
  允许从模块访问 UMD 全局变量。
  ```json
  {
    "extends": "./tsconfig-base",
    "compilerOptions": {
      "allowUmdGlobalAccess": false //禁止模块文件中使用UMD全局变量
    }
  }
  ```
  n5.d.ts
  ```ts
  export const a: number = 1;
  export as namespace Hello;
  ```
  n6.ts
  ```ts
  export const b: string = 'abc';
  // console.log(Hello.a); // Error  模块文件中无法使用UMD全局变量
  ```
- **allowUnreachableCode**
  类型: Boolean
  默认值: false
  不报告执行不到的代码错误。(不建议修改此选项)
- **allowUnusedLabels**  
   类型: Boolean
  默认值: false
  不报告未使用的标签错误.
- **alwaysStrict**  
   类型: Boolean
  默认值: false
  以严格模式解析并为每个源文件生成 "use strict"语句
- **baseUrl**
  类型: String
  默认值 无
  解析非相对模块名的基准目录。查看 [模块解析文档](https://www.tslang.cn/docs/handbook/module-resolution.html#base-url) 了解详情。
  个人实践结果 当 ts 中 import 引用非相对路径的模块，例如 import "foo",ts 会首先查询 node_modules 目录，如果没有查找到需要的 会根据 baseUrl 设置的 路径目录下 查找 该模块。

- **charset**
  类型: String,
  默认值: "utf8",
  输入文件的字符集。
- **checkJs**
  类型: Boolean
  默认值: false,
  报告.js 文件中的错误。与 **allowJs** 配置 一起使用。
- **composite**  
   类型: Boolean
  默认值: true
  确保 TypeScript 可以确定在哪里可以找到引用项目的输出以编译项目。
- **declaration**
  类型: Boolean
  默认值: false
  构建 ts 文件时 生成相应的 .d.ts 文件
- **declarationDir**
  类型: String
  默认值: 默认输出路径为生产的目标文件相同位置
  生成.d.ts 声明文件的输出路径。
- **declarationMap**  
   类型: Boolean
  默认值: false,
  为每个相应的“ .d.ts”文件生成一个源映射。
- **diagnostics**  
   类型: Boolean
  默认值: false,
  tsc --diagnostics 显示诊断信息。输出内容类似下面
  ```shell
  Files:           124
  Lines:         50004
  Nodes:        203608
  Identifiers:   67676
  Symbols:       64490
  Types:         20190
  Memory used: 115938K
  I/O read:      0.03s
  I/O write:     0.04s
  Parse time:    0.74s
  Bind time:     0.35s
  Check time:    1.77s
  Emit time:     0.29s
  Total time:    3.15s
  ```
- **disableSizeLimit**
  类型: Boolean
  默认值: false
  禁用 JavaScript 工程体积大小的限制
- **downlevelIteration**
  类型: Boolean
  默认值: false
  当 target 为“ES5”或“ES3”时，为“for-of”、“spread”和“destructuring”中的迭代器提供完全支持。
- **emitBOM**
  类型: Boolean
  默认值: false
  在输出文件的开头加入 BOM 头（UTF-8 Byte Order Mark）。
- **emitDeclarationOnly**
  类型: Boolean
  默认值: false
  仅发出“.d.ts”声明文件。
- **emitDecoratorMetadata**  
   类型: Boolean
  默认值: false
  实验性选项 配置，给源码里的装饰器声明加上设计类型元数据。查看 issue #2577 了解更多信息。
- **esModuleInterop**  
   类型: Boolean
  默认值: false
  发出 **importStar 和**importDefault 帮助程序代码 用于运行时 Babel 生态系统兼容性，并实现--allowSyntheticDefaultImports 类型系统兼容性。
- **experimentalDecorators**
  类型: Boolean
  默认值: false
  实验性选项配置, 为 ES 装饰器启用实验性支持。
- **extendedDiagnostics**
  类型: Boolean
  默认值: false
  显示详细的诊断信息, 输出内容类似如下
  ```shell
  Files:                        124
  Lines:                      50004
  Nodes:                     203608
  Identifiers:                67676
  Symbols:                    64490
  Types:                      20190
  Memory used:              117670K
  Assignability cache size:   37456
  Identity cache size:            4
  Subtype cache size:            10
  I/O Read time:              0.08s
  Parse time:                 0.52s
  Program time:               0.75s
  Bind time:                  0.36s
  Check time:                 1.76s
  transformTime time:         0.11s
  commentTime time:           0.03s
  I/O Write time:             0.04s
  Source Map time:            0.00s
  printTime time:             0.29s
  Emit time:                  0.29s
  Total time:                 3.16s
  ```
- **forceConsistentCasingInFileNames**
  类型: Boolean
  默认值: false
  禁止对同一文件使用大小写不一致的引用。
- **importHelpers**  
   类型: Boolean
  默认值: false
  从 tslib 导入辅助工具函数（比如 **extends， **rest 等）；
  tslib 是 typescript 运行时库, 其中包含所有 TypeScript 辅助函数。需要安装 tslib 依赖
- **incremental**
  类型: Boolean
  默认值: 当 **composite** 为 true 时 则为 true， 否则 为 false
  通过将先前编译中的信息读/写到磁盘上的文件来启用增量编译。该文件由--tsBuildInfoFile 标志控制。

- **inlineSourceMap**
  类型: Boolean
  默认值: false
  生成单个 sourcemaps 文件，而不是将每 sourcemaps 生成不同的文件
- **inlineSources**
  类型: Boolean
  默认值: false
  将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性。

- **isolatedModules**
  类型: Boolean
  默认值: false
  将每个文件作为单独的模块（与“ts.transpileModule”类似）。

- **jsx**
  类型: "react"|"preserve"|"react-native"
  默认值: "preserve"
  在 .tsx 文件里支持 JSX： "react"或 "preserve" 或 "react-native"
  > 区别:preserve 模式将 JSX 保留为输出的一部分，以供其他转换步骤（例如 Babel）进一步使用。此外，输出将具有.jsx 文件扩展名。该 react 模式将发出 React.createElement，不需要使用之前进行 JSX 转换，并且输出将具有.js 文件扩展名。该 react-native 模式等效 preserve 于保留所有 JSX，但是输出将具有.js 文件扩展名

| 模式         | 输入内容 | 输出内容                   | 输出文件格式 |
| ------------ | -------- | -------------------------- | ------------ |
| preserve     | <div />  | <div />                    | .jsx         |
| react        | <div />  | React.createElement("div") | .js          |
| react-native | <div />  | <div />                    | .js          |

- **jsxFactory**
  类型: String
  默认值: "React.createElement"
  指定生成目标为 "react"模式 JSX 时，使用的 JSX 工厂函数，比如 React.createElement 或 h。配合 **jsx** 属性一起用

- **keyofStringsOnly**
  类型: Boolean
  默认值: false
  设置 ts 的 keyof 关键字 仅解析字符串值的属性名称(不解析 数字 或 symbol 属性)；
- **lib**
  类型: Array[]
  默认值： **target** 为 es5 时 [DOM,ES5,ScriptHost], es6 时 [DOM,ES6,DOM.Iterable,ScriptHost]
  要包含在编译中的库文件列表。
  可能的值有：
  ► ES5
  ► ES6
  ► ES2015
  ► ES7
  ► ES2016
  ► ES2017
  ► ES2018
  ► ESNext
  ► DOM
  ► DOM.Iterable
  ► WebWorker
  ► ScriptHost
  ► ES2015.Core
  ► ES2015.Collection
  ► ES2015.Generator
  ► ES2015.Iterable
  ► ES2015.Promise
  ► ES2015.Proxy
  ► ES2015.Reflect
  ► ES2015.Symbol
  ► ES2015.Symbol.WellKnown
  ► ES2016.Array.Include
  ► ES2017.object
  ► ES2017.Intl
  ► ES2017.SharedMemory
  ► ES2017.String
  ► ES2017.TypedArrays
  ► ES2018.Intl
  ► ES2018.Promise
  ► ES2018.RegExp
  ► ESNext.AsyncIterable
  ► ESNext.Array
  ► ESNext.Intl
  ► ESNext.Symbol

- **listEmittedFiles**
  类型: Boolean
  默认值: false
  在编译过程中打印生成文件的名称。
- **listFiles**
  类型: Boolean
  默认值: false
  打印文件名称的一部分。

- **locale**
  类型: String
  默认值: 特定于环境
  用于显示错误消息的语言环境，例如 zh-CN。
  可能的值为：
  ► 英语（美国）：en
  ► 捷克语：cs
  ► 德语：de
  ► 西班牙语：es
  ► 法语：fr
  ► 意大利语：it
  ► 日语：ja
  ► 韩语：ko
  ► 波兰语：pl
  ► 葡萄牙语（巴西）：pt-BR
  ► 俄语：ru
  ► 土耳其语：tr
  ► 简体中文：zh-CN
  ► 繁体中文：zh-TW
- **mapRoot**
  类型: String
  默认值: 无
  为调试器指定指定 sourcemap 文件的路径，而不是使用生成时的路径。当 .map 文件是在运行时指定的，并不同于 js 文件的地址时使用这个标记。指定的路径会嵌入到 sourceMap 里告诉调试器到哪里去找它们

- **maxNodeModuleJsDepth**
  类型: Number
  默认值: 0
  node_modules 依赖的最大搜索深度并加载 JavaScript 文件。仅适用于 **allowJs**选项配置后。
- **module**  
   类型: String
  默认值: target === "ES6" ? "ES6" : "commonjs"
  指定模块代码生成："None"，"CommonJS"，"AMD"，"System"，"UMD"，"ES6"，"ES2015"或"ESNext"。

  1. 只有"AMD"和"System"可与结合使用--outFile
  2. "ES6"和 "ES2015"可使用在目标输出为 "ES5"或更低的情况下

- **moduleResolution**
  类型: String
  默认值: module === "AMD" or "System" or "ES6" ? "Classic" : "Node"
  决定如何处理模块。或者是"Node"对于 Node.js/io.js，或者是"Classic"模式。查看[模块解析](https://www.tslang.cn/docs/handbook/module-resolution.html)了解详情。

- **newLine**
  类型: String
  默认值: 特定于平台
  当生成文件时指定行结束符： "crlf"（windows）或 "lf"（unix）。

- **noEmit**
  类型: Boolean
  默认值: false
  不生成输出文件。

- **noEmitHelpers**
  类型: Boolean
  默认值: false
  不在输出文件中生成用户自定义的帮助函数代码，如 \_\_extends。

- **noEmitOnError**
  类型: Boolean
  默认值: false
  报错时不生成输出文件。
- **noErrorTruncation**
  类型: Boolean
  默认值: false
  不截断错误消息。

- **noFallthroughCasesInSwitch**
  类型: Boolean
  默认值: false
  报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

- **noImplicitAny**
  类型: Boolean
  默认值: false
  在表达式和声明上有隐含的 any 类型时报错。

- **noImplicitReturns**
  类型: Boolean
  默认值: false
  当函数的所有返回路径代码都没有返回值时报错。

- **noImplicitThis**
  类型: Boolean
  默认值: false
  当 this 表达式的值为 any 类型的时候，生成一个错误。

- **noImplicitUseStrict**
  类型: Boolean
  默认值: false
  模块输出中不包含 "use strict"指令。

- **noLib**
  类型: Boolean
  默认值: false
  不包含默认的库文件（ lib.d.ts）

- **noResolve**
  类型: Boolean
  默认值: false
  不把 /// <reference``>或模块导入的文件加到编译文件列表。
- **noStrictGenericChecks**
  类型: Boolean
  默认值: false  
   禁用在函数类型里对泛型签名进行严格检查。

- **noUnusedLocals**
  类型: Boolean
  默认值: false
  报告未使用的本地错误。
- **noUnusedParameters**
  类型: Boolean
  默认值: false
  报告未使用的本地错误。

- **out** (已经废弃 被 outFile 替代)
- **outDir**
  类型: String
  默认值: 目标文件当前位置
  将输出结构重定向到指定目录

- **outFile**
  类型: String
  默认值: 无
  将输出文件合并为一个文件。合并的顺序是根据传入编译器的文件顺序和 ///<reference``>和 import 的文件顺序决定的。查看输出文件顺序文件了解详情。
- **paths**
  类型: Object
  默认值: {}
  模块名到基于 baseUrl 的路径映射的列表。查看 [模块解析文档](https://www.tslang.cn/docs/handbook/module-resolution.html#path-mapping) 了解详情。

- **preserveConstEnums**
  类型: Boolean
  默认值: false
  保留 const enum = {}声明。查看 [const enums documentation](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#9.4)了解详情。主要是因为 整个 const enum 声明会在 ts 构建后被 消除直接替换成具体的值。使用这个 配置属性可以禁止 ts 的该行为
- **preserveSymlinks**
  类型: Boolean
  默认值: false
  不把符号链接解析为其真实路径；将符号链接文件视为真正的文件。

- **preserveWatchOutput**
  类型: Boolean
  默认值: false
  保留 watch 模式下过时的控制台输出。

- **pretty**
  类型: Boolean
  默认值: true 除非管道传输到另一个程序或将输出重定向到文件
  使用颜色和上下文样式化错误和消息。

- **project**
  类型: String
  默认值: 无
  编译指定目录下的项目。这个目录应该包含一个 tsconfig.json 文件来管理编译。查看 [tsconfig.json 文档](https://www.tslang.cn/docs/handbook/tsconfig-json.html) 了解更多信息
- **reactNamespace** (已废弃)
  类型: String
  默认值: "React"
  当目标为生成 "react" JSX 时，指定 createElement 和 \_\_spread 的调用对象
- **removeComments**
  类型: String
  默认值: false
  删除所有注释，除了以 /!\*开头的版权信息。

- **resolveJsonModule**
  类型: Boolean
  默认值: false
  模块导入 import 可以导入 .json 文件
- **rootDir**
  类型: String
  默认值: 公共根路径 是基于 input 传入的文件列表计算来的
  指定输入文件的根目录。仅**outDir**用于通过来控制输出目录结构

- **rootDirs**
  类型: `Array<String>`
  默认值: 无
  根（root）文件夹列表，表示运行时组合工程结构的内容。查看 [模块解析文档](https://www.tslang.cn/docs/handbook/module-resolution.html#virtual-directories-with-rootdirs)了解详情

- **showConfig**
  类型: Boolean
  默认值: false
  在输出中显示最终的配置文件。包含隐藏配置等的，而不仅是本地的文件配置
- **skipLibCheck**
  类型: Boolean
  默认值: false
  跳过所有声明文件的类型检查（\*.d.ts）

- **sourceMap**
  类型: Boolean
  默认值: false
  生成相应的 .map 文件。
- **sourceRoot**
  类型: Boolean
  默认值: false
  指定 TypeScript 源文件的路径，以便调试器定位。当 TypeScript 文件的位置是在运行时指定时使用此标记。路径信息会被加到 sourceMap 里。
- **strict**
  类型: Boolean
  默认值: false
  启用所有严格类型检查选项。
  启用 --strict 相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict，--strictBindCallApply, --strictNullChecks 和 --strictFunctionTypes 和 --strictPropertyInitialization

- **strictBindCallApply**
  类型: Boolean
  默认值: false
  启用的更严格的检查 bind，call 以及 apply 对功能的方法。

- **strictFunctionTypes**
  类型: Boolean
  默认值: false
  禁用函数类型的双向协变检查
- **strictPropertyInitialization**
  类型: Boolean
  默认值: false
  确保在构造函数中初始化未定义的类属性.--strictNullChecks 必须启用此选项才能生效。

- **strictNullChecks**
  类型: Boolean
  默认值: false
  在严格的 null 检查模式下，null 和 undefined 值不在其他任何类型的域中，并且只能分配给它们自己 any（undefined 也可以分配给 void）。

- **suppressExcessPropertyErrors**
  类型: Boolean
  默认值: false
  阻止对对象字面量的额外属性检查
- **suppressImplicitAnyIndexErrors**
  类型: Boolean
  默认值: false
  阻止 --noImplicitAny 对缺少索引签名的索引对象报错。查看 [issue #1232](https://github.com/Microsoft/TypeScript/issues/1232#issuecomment-64510362)了解详情。
- **target**
  类型: String
  默认值: "ES3"
  指定 ECMAScript 的目标版本：
  ► "ES3"（默认值）
  ► "ES5"
  ► "ES6"/ "ES2015"
  ► "ES2016"
  ► "ES2017"
  ► "ES2018"
  ► "ES2019"
  ► "ES2020"
  ► "ESNext"

  注："ESNext"为最新的支持[ES 建议功能](https://github.com/tc39/proposals)。

- **traceResolution**
  类型: Boolean
  默认值: false
  报告模块解析日志消息。

- **tsBuildInfoFile**
  类型: String
  默认值: .tsbuildinfo
  指定要在其中存储增量构建信息的文件。配合--incremental 一起使用

- **version**
  打印编译器的版本。
- **watch**
  在监视模式下运行编译器。会监视输出文件，在它们改变时重新编译。监视文件和目录的具体实现可以通过环境变量进行配置。详情请看配置 [Watch](https://www.tslang.cn/docs/handbook/configuring-watch.html)。

### 完整 tsconfig.json 实践

```json
{
  "compilerOptions": {
    "incremental": true,
    "target": "es5",
    "module": "commonjs",
    "allowJs": true,
    "checkJs": true,
    "jsx": "preserve",
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "removeComments": false,
    "noEmit": false,
    "importHelpers": true,
    "downlevelIteration": true,
    "strict": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    "moduleResolution": "node",
    "baseUrl": "./",
    "types": ["mocha"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowUmdGlobalAccess": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "files": ["./src/enum.ts", "./src/namespace/n1.ts"],
  "include": ["./src/namespace/*", "./src/module/*"],
  "exclude": [
    "./src/namespace/n2.ts",
    "./src/module/m11.ts",
    "./dist-test",
    "./node_modules"
  ],
  "compileOnSave": false
}
```
