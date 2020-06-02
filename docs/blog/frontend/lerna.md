---
group:
  title: '前端'
  order: 2
---

# Lerna 配置详解

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## 背景

一个体系庞大的代码库拆分成多个单独的具有独立版本的 package，对于开发时期的代码共享非常有用。数量较少的时候，多个仓库维护不会有太大问题， 但是当独立 package 数量越来越多的时候，就会暴露出很多开发困扰的问题

- 跨很多代码存储库，修改代码很麻烦
- issue 难以统一追踪，管理，因为其分散在独立的 repo 里
- 跨存储库的代码测试非常复杂
- 多个 package 之间相互依赖，对于互相引用的版本号依赖维护成本非常高，开发人员不得不使用 [npm link](https://www.jianshu.com/p/aaa7db89a5b2) 的方式去引用依赖。

为了解决上面这些问题，一些项目会将其代码库统一组织到多包存储库中，我们称之为 `monorepos`。像 Babel，React，Angular， Ember，Meteor，Jest 之类的项目以及许多其他项目都在单个存储库中开发所有软件包。

lerna 的特性：

1. 自动解决 packages 之间的依赖关系
2. 通过 git 检测文件改动，自动发布
3. 根据 git 提交记录，自动生成 CHANGELOG

lerna 不负责构建，测试等任务，它提出了一种集中管理 package 的目录模式，提供了一套自动化管理程序，让开发者不必再深耕到具体的组件里维护内容，在项目根目录就可以全局掌控，基于 npm scripts，可以很好地完成组件构建，代码格式化等操作，并在最后，用 lerna 统一变更 package 版本，将其发布上传至远端。

## 使用介绍

### Lerna 快速入门

可以全局安装 lerna

```bash
npm install lerna -g
lerna init
```

也可使用 npx 的方式 快速初始化 `monorepo` 项目

```bash
npx lerna init
```

初始化的目录结构

```
lerna-demo/
    packages/  # 用来存放各个独立代码库的目录
    lerna.json # lerna的全局配置
    package.json # 全局依赖
```

### Lerna 多包版本管理机制

Lerna 允许两种方式来管理所有包的版本控制

- 固定模式 （默认）
  Lerna 默认以全局的 `lerna.json` 版本号 `version` 为准，当使用 `lerna publish` 发布应用的新版本时，会自动将所有的 package 版本好同步到最新的版本

  > 注意：如果您的主要版本为零，则所有更新均视为中断

- 独立模式  
   创建项目的时候 可以通过 `lerna init --independent` 命令，启用独立模式管理软件包。  
   独立模式 Lerna 项目允许维护者彼此独立地增加软件包的版本，每个 package 在每次 publish 时，您都将得到一个提示符，提示每个已更改的包，以指定是补丁、次要更改、主要更改还是自定义更改。
  > 注意: 也可以修改 `lerna.json` 的 `version` 字段，修改为 `independent`, 用来开启独立模式

### lerna.json 配置介绍

```json
{
  "version": "1.1.1",
  "npmClient": "yarn",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish %s",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
```

- `version`：当前存储库的版本，当为 `independent` 时，开启独立模式

- `npmClient`：一个选项，用于指定运行命令的特定客户端。 可更改为 `yarn` 或者 `cnpm`

- `packages`：用作包装位置的 glob 数组， 默认为 `["packages/*"]`, 也可以修改为其他目录

- `command.publish.ignoreChanges`: 接受一组 glob 数组，忽略不必要的更改发布新版本，例如 md 修改

- `command.publish.message`: 执行发布版本时自动会 commit 一条指定记录，当消息记录里包含 `%s` 将会替换为 `v1.1.1`, 如果是 `%v` 则直接替换为 `1.1.1`，如果是 `independent` 模式则会独立更新每个包的版本, 具体请查看 [@lerna/json](https://github.com/lerna/lerna/tree/master/commands/version#--message-msg)

- `command.publish.registry`: 设置要发布到的自定义地址

- `command.bootstrap.ignore`: 接收一个 glob 数组， 指定运行 lerna bootstrap 命令时需要忽略的目录

- `command.bootstrap.npmClientArg`: 接收一个字符串数组， 将参数直接传递给 npm install

- `command.bootstrap.scope`: 一组 glob，用于限制在运行 lerna bootstrap 命令时将 包含的软件包。

### Lerna 命令介绍

- `lerna init` ：  
   初始化 `monorepo` 工程项目

  - 支持 `--independent, -i` 开启独立模式管理版本,
  - 支持 `--exact` 固定模式，不需要传递该参数也可以，加上这个参数，会精确添加到 `lerna.json` 配置里，强制固定模式， 类似于 `npm install --save-dev` 一样的意义，添加后的配置文件如下  
     `json { "version": "0.0.0", "command": { "init": { "exact": true } }, }`
    具体源码实现可以查看 [@lerna/init](https://github.com/lerna/lerna/tree/master/commands/init#readme)

- `lerna create <PackageName> [loc]`:
  创建 `lerna-managed` 模块, 自动在 packages 文件夹下，初始化一个名为指定`PackageName`的模块文件

  - `loc` 可选配置，支持自定义包位置，默认为 `lerna.json` 的 `packages` 第一个配置的包位置
    ```bash
    lerna create module components
    ```
  - `--access` 配置参数 支持选项 `['public', 'restricted']`, set publishConfig.access value, 如果安装 scope npm 包需要配置此属性，也可以直接在 package.json 里配置对应属性

    > 经实践，--access=public 并没有自动添加到 package.json 配置里，有无效果待具体实践

  - `--bin` 标记当前包是可执行的软件包，并自动生成相关文件和配置

  - `--es-module` 初始化生成的代码 es6 模块

- `lerna bootstrap`：自动构建项目，将本地软件包链接在一起并安装剩余的软件包依赖项  
   运行这个命令相当于运行以下命令

  - npm install 每个软件包的所有外部依赖项。
  - 将所有 packages 相互依赖的 Lerna 链接在一起。
  - npm run prepublish 在所有 bootstrapped 软件包中（除非--ignore-prepublish 通过）。
  - npm run prepare 在所有 bootstrapped 软件包中

  支持的配置参数有：

  - `--hoist [glob]` 将 glob 匹配的所有依赖想提升至根目录，以便于所有包都可以用，如果选项存在但未给定 glob，则默认为\*\*（提升所有内容）。关于该配置的更多说明即优缺点可以 查看 [hoist documentation](https://github.com/lerna/lerna/blob/master/doc/hoist.md)

  - `--strict` 当和 `--hoist` 同时使用是，构建过程出现异常或者警告将会停止引导

  - `--nohoist [glob]` 将 glob 匹配的依赖不会被提升至 根目录

  - `--ignore [glob]` 忽略构建的软件包

  - `--ignore-scripts` 忽略构建时的生命周期 `prepare` `prepublish` 等

  - `--npm-client <client>` 默认为 `npm` 可以替换为 其他安装程序 例如 `yarn` ,`cnpm` 等

  - `--use-workspaces` 数组中的值是 Lerna 将操作委托给 Yarn 的命令

- `lerna list`：列出当前项目所有包  
   支持简介命令

  - `lerna ls` 等价于直接`lerna list` 显示列表
  - `lerna ll` 等价于`lerna list -l` 显示长信息列表
  - `lerna la` 等价于 `lerna list -la` 显示所有包列表信息 包括私有包

  可配置参数

  - `--json` json 展示信息
  - `--ndjson` 单行 json 展示信息
  - `--graph` 全展开 json 信息
  - `--all, -a` 展示所有包，包含 private 包
  - `--long, -l` 长信息输出
  - `--parseable, -p` 显示可分析的输出，而不是列化视图。默认情况下，输出的每一行都是包的绝对路径

- `lerna clean`：清理所有 package 的 node_modules 文件夹

- `leran add <PackageName>`：相当于 npm install 某个依赖, 默认所有包同时安装依赖， 也可以接收一个参数 --scope=PackageName, 可以只针对该包安装对应依赖  
   将本地或远程 package 作为依赖项添加到当前 Lerna 存储库中的软件包。和 `yarn add` 和 `npm install` 不同，一次只能添加一个软件包  
   使用方法:

  ```bash
  $ lerna add <package>[@version] [--dev] [--exact] [--peer]
  ```

  可选参数：

  - `--dev` 安装开发依赖
  - `--exact` 固定版本安装依赖
  - `--peer` 安装 `peerDependencies`

- `lerna version`：更改 Lerna 管理的包版本  
   使用方式：

  ```bash
  lerna version 1.0.1
  lerna version [major | minor | patch | premajor | preminor | prepatch | prerelease]
  lerna version // 从prompt 中选择
  ```

  > Tips: 发布版本前需要 commit 本地的 更新

  发布版本发生的操作：

  1. 标识自上一个标记版本以来已更新的软件包。
  2. 提示输入新版本。
  3. 修改软件包元数据以反映新版本，并在根目录和每个软件包中运行适当的生命周期脚本。
  4. 提交那些更改并标记提交。
  5. 推送到 git 遥控器。

  常用的可选配置：

  - `--allow-branch`: 接受一个 `glob` 数组, 标记发布版本允许的分支，默认只有 `master` 分支
  - `--amend`: 跳过自动提交
  - `--conventional-commits`: 发布一个常规版本的同时 生成 `CHANGELOG.md`, 该提交方式是直接中版本号发生变化，不支持小版本变化
  - `--conventional-prerelease`: 强制当前版本为预发布版本，而不是主版本。不添加这个参数， `--conventional-commits`只会在当前版本是预发布版本 才会默认提交为 预发布
  - `--conventional-graduate`： 强制预发布版本，升级为发布版本
  - `--force-publish`：跳过检查 `lerna checked` 和 `git diff`, 强制发布一个版本
  - `--git-remote`: 替换提交的远端地址
  - `--ignore-changes`: 接受一个 `glob` 数组，发布版本忽略匹配的文件变动发生的更新
  - `--message, -m <msg>`: 相当于 `git commit -m <msg>`, 提交的内容 `%s` 表示带 v 的版本号， `%dv` 表示版本号,
    > Tips: `Indepenedent` 模式`%s %d`实践貌似无效，待证明
  - `--no-push`: 不 push 内容到 git
  - `--preid`: 创建 `next` 版本

  script 生命周期：

  ```bash
  # preversion:  Run BEFORE bumping the package version.
  # version:     Run AFTER bumping the package version, but BEFORE commit.
  # postversion: Run AFTER bumping the package version, and AFTER commit.
  ```

- `lerna changed`：列出自上一个标记版本以来已更改的本地软件包, `lerna changed`的输出将是下一个 `lerna version` 或者 `lerna publish` 的软件包列表

  > Tips: `lerna.json`配置`lerna publish` 和 `lerna version`也影响 `lerna changed`，如`command.publish.ignoreChanges`

- `lerna diff [package]`：可以 diff 所有包或者指定的某个包。检查文件变化

- `lerna exec`：在 Lerna 管理的包中执行任意命令  
   使用方法：

  ```bash
  $ lerna exec -- <command> [..args] # runs the command in all packages
  $ lerna exec -- rm -rf ./node_modules
  ```

  执行命令时期，会传递几个上下文环境变量：

  - `LERNA_PACKAGE_NAME`: 当前包名
    ```bash
    lerna exec -- echo '${LERNA_PACKAGE_NAME}'
    ```
  - `LERNA_ROOT_PATH`: 当前 lerna 项目根路径
    `bash lerna exec -- echo '${LERNA_ROOT_PATH}'`
    可选配置：
  - `--scope` 限制执行范围
    ```bash
    lerna exec --scope my-component -- ls -la
    ```
  - `--concurrency <num>`：指定并发执行数量 当 `num` 为 `1` 的 时候，命令会一个一个执行

  - `--stream`: 控制并发子进程立即输出内容，并带有包名前缀， 这样就可以交错来自不同程序包的输出

  - `--parallel`: 和 `--stream` 功能类似， 但是完全不考虑 并发和 排序关系，在所有带有前缀流输出的匹配包中立即运行给定命令或脚本

    > Tips: 官方建议 限制 执行范围，因为产生数十个子进程可能会损害 Shell 的可靠性

  - `--no-bail`: 默认子进程运行时产生非 0 错误 code 退出码 ，会自动退出当前进程，该配置参数可以忽略这个行为，即使产生 错误，也会继续执行下去

  - `--no-prefix` 在输出流式传输（`--stream` 或 `--parallel`）时禁用包名称前缀,当将结果传递到其他过程（例如编辑器插件）时，此选项可能有用。

  - `--profile` 对命令执行生成性能概要文件，默认输出文件位置为项目根目录, 生成的 `.json` 文件 可以在 <devtools://devtools/bundled/devtools_app.html> 的 `performace` 选项里上传该文件即可检查性能

  - `--profile-location <location>` 指定 `--profile` 生成的文件位置

- `lerna run`：在 Lerna 管理的每个软件包中运行一个 npm 脚本， 功能和 配置参数和 exec 基本相同，唯一不同的是直接执行 npm 脚本对应的命令  
   使用方式：

  ```bash
  $ lerna run build --stream --profile --profile-location=logs/profile/
  ```

- `lerna import`：将带有至少一次提交历史记录的包导入到`monorepo`中  
   可选配置：

  - `--flatten` 导入具有合并提交冲突的存储库时，import 将无法尝试应用所有提交。用户可以使用该标志请求导入“固定”历史记录，即，将每次合并提交作为引入合并的单个更改。

  - `--dest` 指定输出目录， 默认为 packages 目录
  - `--preserve-commit`： 每个 git 提交都有一个作者和一个提交者，`lerna import`从外部存储库重新创建每个提交，因此提交者将成为当前的 git 用户, 这是正确的，但可能是不希望的。 启用此选项将保留原始提交者（和提交日期），以避免此类问题。

- `lerna link`： 将所有相互依赖的软件包符号链接在一起
  可配置项：

  - `--force-local`: 该参数使 link 命令始终符号链接本地依赖项，而不管匹配的版本范围如何。

  - `publishConfig.directory`: 该非标准字段允许您自定义符号链接子目录，该目录将成为符号链接的源目录，就像将使用已发布的程序包一样。

  ```json
  "publishConfig": {
      "directory": "dist"
  }
  ```

  在此示例中，当链接此程序包时，该 dist 目录将是源目录（例如 package-1/dist => node_modules/package-1）

- `lerna info`: 打印本地环境信息  
   输出内容类似以下内容：
  ```bash
  Environment Info:
  System:
      OS: macOS 10.15.4
      CPU: (8) x64 Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz
  Binaries:
      Node: 11.15.0 - /usr/local/bin/node
      Yarn: 1.7.0 - /usr/local/bin/yarn
      npm: 6.7.0 - /usr/local/bin/npm
  Utilities:
      Git: 2.17.1 - /usr/local/bin/git
  npmPackages:
      lerna: ^3.20.2 => 3.22.0
  ```
- `lerna publish`：当前 Lerna 项目发版  
   使用方式：

  ```bash
  lerna publish               ＃发布自上一个发行版以来发生更改的软件包
  lerna publish from-git      ＃显式发布当前提交中标记的软件包
  lerna publish from-package  ＃显式发布注册表中没有最新版本的软件包
  ```

  当运行这个命令的时候执行了以下操作

  - 将从上次 release 后发生的更新发版 （调用 `lerna version`）
  - 发布当前更新提交 tag 版本 （from-git）
  - 发布上次 release 版本不一致的 npm 注册表 （from-package）
  - 发布在上一次提交中更新的包（及其依赖项）的非版本化“canary”版本。
    > Tips: Lerna 不会发布标记为 `private` 字段的软件包

  可选命令：

  - `from-git`：适用于当 手动调用 `lerna version` 后，再 `lerna publis` 会提示没有发现有更新的包需要更新，该命令从 git 远端获取最新提交，如果发现和本地版本不一致 则发版本，

  - `from-package`：适用于 npm 注册表远端没有该软件包或者软件包版本不一致时，该命令会强制发布当前版本，场景有当以前的 lerna 发布无法将所有包发布到注册表时，造成本地和远端版本不一致时，可以使用该命令

  可选选项：

  - `--canary`： 当使用此标志运行时，lerna publish 以更细粒度的方式发布包。在发布到 npm 之前，它通过获取当前版本、将其转发到下一个次要版本、添加提供的元后缀（默认为 alpha）并附加当前 git sha（例如：1.0.0 变为 1.1.0-alpha.0+81e3b443）来创建新的版本标记。

    > Tips: 如果您已从 CI 中的多个活动开发分支发布了 Canary 版本，则建议在每个分支的基础上自定义--preid 和--dist-tag <tag>，以避免版本冲突。

    ```bash
    lerna publish --canary
    # 1.0.0 => 1.0.1-alpha.0+${SHA} of packages changed since the previous commit
    # a subsequent canary publish will yield 1.0.1-alpha.1+${SHA}, etc

    lerna publish --canary --preid beta
    # 1.0.0 => 1.0.1-beta.0+${SHA}

    # The following are equivalent:
    lerna publish --canary minor
    lerna publish --canary preminor
    # 1.0.0 => 1.1.0-alpha.0+${SHA}
    ```

  - `--contents <dir>`: 指定要发布的子目录，应用于所有 Lerna 管理的包含 `package.json` 文件的软件包，程序包生命周期仍将在原始目录中运行

    ```bash
    lerna publish --content dist
    ＃发布每个由Lerna管理的软件包的“ dist”子文件夹
    ```

    > Tips:
    >
    > 1. 可以使用（`prepare`，`prepublishOnly`，或 `prepack`）生命周期中的一个来创建子目录或诸如此类的操作
    > 2. 可以使用 `postpack` 生命周期清理发布时期生成的子目录

  - `--dist-tag <tag>`: 指定 npm 发布的 `dist-tag`, 默认为 `latest`, 此选项可用于发布 `prerelease` 或 `beta` 版本 latest

    > Tips: 非 `latest` 的 `dist-tag` 版本 安装方式为 `npm install my-package@beta`

  - `--git-head <sha>`: 显式 SHA 在打包 tarballs 时设置为清单上的 gitHead, 只允许在 `from package` 下使用。 例如，从 AWS CodeBuild 发布时（git 不可用），可以使用此选项传递要用于此包元数据的适当环境变量：
    ```bash
    lerna publish from-package --git-head ${CODEBUILD_RESOLVED_SOURCE_VERSION}
    ```
  - `--graph-type <all|dependencies>` ： 指定构建软件包时需要指定的依赖，默认值为 `dependencies`, `package.json` 构建后将只包含 `dependencies` 指定的依赖，如果需要指定其他依赖，可以使用 `all` 来包含 `devDependencies` 和 `peerDependencies`
    ```bash
    lerna publish --graph-type all
    ```
  - `--ignore-scripts`: 忽略 `lerna publish` 期间运行的 生命周期脚本命令

  - `--legacy-auth`：发布要求身份验证的软件包时， 这与 NPM 发布\_auth 标志相同。

    ```bash
    lerna publish --legacy-auth aGk6bW9t
    ```

  - `--yes`: 将跳过所有确认提示, 使用默认值方式执行发布

  > Tips: 发布 `scope package` 例如 `@dking/component` , 你必须在`package.json`中设置 `publishConfig.access` 权限, 像下面配置意义
  >
  > ```json
  > {
  >   "publishConfig": {
  >     "access": "public",
  >     "registry": "http://my-awesome-registry.com/",
  >     "directory": "dist"
  >   }
  > }
  > ```

  发布期间发生生命周期脚本命令

  ```bash
  # prepublish:      Run BEFORE the package is packed and published.
  # prepare:         Run BEFORE the package is packed and published, AFTER prepublish, BEFORE prepublishOnly.
  # prepublishOnly:  Run BEFORE the package is packed and published, ONLY on npm publish.
  # prepack:     Run BEFORE a tarball is packed.
  # postpack:    Run AFTER the tarball has been generated and moved to its final destination.
  # publish:     Run AFTER the package is published.
  # postpublish: Run AFTER the package is published.
  ```

### Lerna 全局配置

- `--concurrency`: Lerna 并行执行任务时要使用多少个线程（默认为逻辑 CPU 内核数）

- `--loglevel <silent|error|warn|success|info|verbose|silly>`: 要报告的日志级别。失败时，所有日志都将写入当前工作目录中的`lerna-debug.log`。 默认值 为 `info`

- `--max-buffer <bytes>`: 为每个基础流程调用设置最大缓冲区长度, 当 使用 `lerna import` 导入具有大量提交的存储库时，可能会出现内置缓冲区长度不足的问题，可以设置该选项解决这个问题

- `--no-progress`: 禁用进度条， 在 CI 环境中，情况总是如此。

- `--no-sort`: 默认情况下，所有任务都按照拓扑排序的顺序在程序包上执行，该选项可以禁用排序，以最大的并发性以任意顺序执行任务。

- `--reject-cycles`: 循环引用立即报错

### Lerna 过滤配置

- `--scope <glob>`: 仅包括名称与给定 glob 匹配的软件包。限制 lerna 命令执行范围
  ```bash
  $ lerna exec --scope my-component -- ls -la
  $ lerna run --scope toolbar-* test
  $ lerna run --scope package-1 --scope *-2 lint
  ```
- `--ignore <glob>`： 忽略 glob 匹配的软件包

  ```bash
  $ lerna exec --ignore package-{1,2,5}  -- ls -la
  $ lerna run --ignore package-1  test
  $ lerna run --ignore package-@(1|2) --ignore package-3 lint
  ```

- `--since [ref]`: 仅包括自指定 ref 分支以来已更改的软件包

  ```bash
  # List the contents of packages that have changed since the latest tag
  $ lerna exec --since -- ls -la

  # Run the tests for all packages that have changed since `master`
  $ lerna run test --since master

  # List all packages that have changed since `some-branch`
  $ lerna ls --since some-branch
  ```
