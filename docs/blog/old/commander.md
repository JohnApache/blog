# Commander 命令行操作

> 引用官方的一句话，commander 是 nodejs 命令行操作的完整解决方案

### 安装

```shell
npm install commander
```

### 声明 program 变量

1. commander 默认导出的是一个方便快速使用的全局对象

```js
const program = require('commander');
program.version('1.0.0');
program.parse(process.argv);
```

2. 如果考虑大型项目，commander 的使用方式可能有很多种，此时可以创建 commander 对象实例

```js
const commander = require('commander');
const program = new commander.Command();
program.version('1.0.0');
program.parse(process.argv);
```

### program.option 选项介绍

commander 提供的 options 选项可以快捷定义命令行参数，并生成对应的参数配置文档 在--help 命令中展示。
options 可以接收多个参数

- 第一个参数 flags,必填参数。 表示命令行选项的具体使用方式，每一个选项 都可以提供一个短标志（单个字符） 和一个长名称，两个标志之间用逗号隔开

```js
const program = require('commander');
program.option('-s, --source').option('-t --transform');
```

flags 的结尾还可以提供参数选项, 一般使用`<type> [type]`, 表示该命令选项 需要提供的参数值。

> 注意 program 获取命令行参数值 options 只能接受一个可选参数 或 一个必填参数，如果需要接收多个参数, 可以通过处理函数处理连写的参数

当没有提供该结尾选项的时候， 命令行显示调用 flag 默认为 true
当提供了该结尾选项的时候 ，<> 表示必填参数， []表示可选参数。可以在现实调用 flag 的时候传入自定义参数

- 第二个参数 是一个可选参数，该参数表示作用的一个描述，该描述还会在--help 文档中展示

```js
const program = require('commander');
program
  .option('-s, --source', 'this is a source')
  .option('-t --transform', 'this is a transform');
```

- 第三个参数是一个可选参数，可以传入一个函数 或者一个字符串
  - 当传入的是一个函数的时候，表示的 flag 命令行参数具体值的处理函数，命令行参数 会被当作该函数的调用参数执行，该函数的返回结果被当作该命令传入的值
  ```js
  const program = require('commander');
  program.option('-s, --source', 'this is a source', v => {
    // 这里的v 就是传入的命令行参数
    return v + '-source';
  });
  program.parse(process.argv);
  ```
  - 当传入的是一个字符串的时候，表示的是命令行参数默认值，flags 提供结尾参数选项的时候 才有效果, 当提供默认值时，即使<>必填参数，也可以不传值
- 第四个参数是只有当第三个参数是一个处理函数的时候，才有效果， 该参数选项表示的是处理函数的绑定参数，和 flag 命令行参数的传入顺序是 先传入命令行传入的参数 ，然后才是第四个参数的绑定值,如果没有传入命令行传入的参数，第四个参数就直接作为该命令选项的默认值了
  ```js
  const program = require('commander');
  program.option(
    '-s, --source',
    'this is a source',
    (v, n) => {
      // 这里的v 就是传入的命令行参数
      // n 就是第四个参数
      return v + '-source' + n;
    },
    '-map', // 当不调用该命令选项时 直接返回第四个参数的值
  );

  program.parse(process.argv);
  ```

program.parse(process.argv) 解析命令行参数，调用了这个方法 就可以通过 program 变量 获得命令行参数的具体对应值了，在获取命令行参数对应值的时候 需要注意几点。

- 如果 flags 包含长命令方式，对应的 program 获取参数值就是长命令的名称,如果长命令内部包含"-"连接符会自动识别成驼峰写法。

  ```js
  const program = require('commander');
  program
    .option('-s, --source', 'this is a source')
    .option('-o, --output-file', 'this is output file');
  program.parse(process.argv);

  console.log(program.source); // 直接获取
  console.log(program.outputFile); // 驼峰获取
  ```

- 如果 flags 只有短命令方式，对应的 program 获取方式就是，短命令的大写方式

  ```js
  const program = require('commander');
  program.option('-s', 'this is a source');
  program.parse(process.argv);

  console.log(program.S); // 短命令大写获取
  ```

- 如果 flags 是用 --no-some 形式的长命令，对应的 program 只会获取 "no-" 后面的内容作为命令参数值，并且，当该选项没有参数选项的时候，命令参数值 是对应结果的反值

  ```js
  const program = require('commander');
  program.option('--no-source', 'this is disable source');
  program.parse(process.argv);

  console.log(program.source); // 长命令获取
  // 不传该命令选项的时候 该值 为true，传入该选项则为false
  ```

其他细节注意点

1. 可以通过调用 **program.opts()** 获取所参数值
2. 短命令如果都是 boolean 类型的 可以连写, -a -b -c === -abc, 并且连写传入参数的话默认作为最后一个短命令的参数

### program.version 创建版本号

- program.version 方法添加具体版本号，该选项的默认调用 flag 为 -V, --version

  ```js
  const program = require('commander');
  program.version('0.0.1');
  program.parse(process.argv);

  // shell
  // index.js -V => 0.0.1
  ```

- 也可以自定义修改设置版本号的 flags，program.version()方法的第二个和第三个参数即可,分别对应版本号的 flags 和 description

  ```js
  const program = require('commander');
  program.version('0.0.1', '-v, --vers', 'output the current version');
  program.parse(process.argv);

  // shell
  // index.js -v, --vers => 0.0.1
  ```

### program.command 创建子命令

commander 提供了 program.command 函数创建子级命令，使用 program.command 的方法有两种

- 使用 command 的 action 处理字级命令
  ```js
  const program = require('commander');
  program
    .command('init <templateName> [otherTemplate...]')
    .description('初始化一个模版项目')
    .action((templateName, otherTemplates) => {
      console.log(templateName);
      otherTemplates.forEach(v => {
        console.log(v);
      });
    });
  ```
  - **command** 函数的第一个参数 指定一个 命令名称 以及执行命令所需要的参数。参数类型<> 是必填参数，[]可选参数，并且最后一个参数的个数可以是动态变化的 通过 “...” 语法
  - command 支持 alias 方法链式调用，可以给当前命令取别名
  ```js
  const program = require('commander');
  program
    .version('0.0.1')
    .command('update <env>')
    .alias('u')
    .options('-e, --exec', 'this is exec option')
    .command('install <dir>')
    .alias('i')
    .parse(process.argv);
  ```
  - 除了 command 方法，program 还支持了**arguments**函数语法，也是通过 action 处理子级命令。
  ```js
  const program = require('commander');
  program
    .version('0.0.1')
    .arguments('<cmd> [envs...]')
    .action((cmd, envs) => {
      if (cmd === 'install') {
        installAction(envs);
      }
    });
  ```
  > arguments 方法本质上就是抽象的 command 方法，可以支持 任意的 命令进入 action，并针对不同的 cmd，做不同的处理，而且 不会与 command 方法冲突， 当有定义 command 对应的命令的时候 会优先使用 command 执行的 action。
  - command 方法还支持提供 option 选项，actions 可以获取到每一个传入的参数外，还可以额外获得 command 命令对象本身，可以从该对象获取到 option 配置，该对象作为 action 的最后一个参数传入
  ```js
  const program = require('commander');
  program
    .command('remove <dir> [otherDirs...]')
    .option('-r, --rescurive', 'remove recursively')
    .option('-j, --jsource', 'this is source')
    .option('-l, --ldev', 'this is dev')
    .description('删除目录')
    .action((dir, otherDirs, cmdObj) => {
      console.log(dir);
      console.log(otherDirs);
      console.log(cmdObj.opts(), cmdObj.rescurive, cmdObj.ldev);
    });
  program.parse(process.argv);
  ```
- 使用单独的 可执行文件
  当 command 函数传入第二个参数 description 参数，commander 就会默认认为这是使用单独的可执行文件方式执行子命令。commander 会自动检索当前脚本文件的相对应名称的文件执行子命令.
  `js // ./lib/pm.js const program = require('commander'); program .command('install <name>', 'this is a git style command') program.parse(program.argv);`
  ```js
  // ./lib/pm-install.js
  const program = require('commander');
  program.parse(program.argv);
  if(program.args.length <= 0) {
  console.error('need params');
  process.exit(1);
  }

      program.args.forEach(arg => {
          console.log(arg);
      })
      ```
      执行单独的可执行文件时，command方法第三个参数接收一个配置选项。
      - noHelp， 当为true的时候 --help 将不会展示该选项
          ```js
          const program = require('commander');
          program
              .command('install <name>', 'this is a git style command', { noHelp: true })

          program.parse(program.argv);
          ```
      - isDefault 当执行的命令的时候没有指定任意命令，可以通过该选项 默认指向一个命令(默认的isDefualt是 --help)
          ```js
          const program = require('commander');
          program
              .command('install <name>', 'this is a git style command', { noHelp: true })
              .command('list', 'show list', { isDefault: true })// 不指定任何命令会执行该命令

          program.parse(program.argv);
          ```
      - executableFile 显示指定可执行文件的名称，执行可执行文件命令会使用这个文件
           ```js
          const program = require('commander');
          program
              .command('update', 'update', { executableFile: 'updatePm' })

          program.parse(program.argv);
          ```
      需要注意几点：
      - 当使用单独的可执行文件时不能继续使用action，否则可能会报错（我自己实践发现，只是可执行文件program.args 多个了一个位置参数传入，且action 不会执行,且执行其他命令会执行到action 反正行为很异常）
      - arguments 方法也不能使用，因为它匹配所有的方法，和传入action一样的效果，都会在单独的可执行文件中增加一个未知的参数传入('[object Object]')
      - 如果没有配置executableFile 选项，当执行单独的可执行文件默认的搜索文件规则是，当前文件名，加上command名，在当前脚本文件中搜索。例如当前脚本文件是 index.js ,注册的命令是install 可执行文件方式的command，那么，在当前目录下对应的的可执行文件名字叫 index-install.js, 如果命令是 search 即为index-search.js
      - program 匹配命令时 是自上而下执行的，会执行 所有匹配上的命令， 注意git style command配置选项 isDefault: true 时默认命令会和command 同时匹配, command 不和 arguments 不会同时匹配 但是在处理 没有注册的命令时 arguments 会和 默认命令同时匹配。
      - 命令程序多个匹配 只会发生在非链式调用中， commander 的一个链式调用 表示 一组命令，这一组命令 只会匹配一个， 只有多个链式调用之间 会存在同时匹配的情况

### help 方法的介绍

- 自定义 help 方法
  通过事件监听的方式,监听 help 触发，并在 help 输出之后跟随输出自定的内容
  `js const program = require('commander'); // 必须在program.parse 之前执行, 因为node emit help 是瞬间就执行完的 program.on('--help', function(){ console.log('') console.log('Examples:'); console.log(' $ custom-help --help'); console.log(' $ custom-help -h'); }); program.parse(process.argv);`
- outputHelp(cb) 方法
  可以输出 help 信息，并不退出当前进程，提供一个回调函数, program 允许函数在显示 help 文档之前执行预处理  
   `js const program = require('commander'); const colors = require('colors'); program.parse(process.argv); if(program.argv.slice(2).length <= 0) { program.outputHelp(make_red); } const make_red = (text) => { return colors.red(text); // 用红色字体显示help 文档 }`
- helpOption(flags, description)  
  覆盖修改 help 默认 flags 和 description
  `js program .helpOption('-e, --HELP', 'read more information');`

- help(cb) 方法
  可以输出 help 文档，并立即退出当前进程，提供一个回调函数， program 允许函数在显示 help 文档之前执行预处理  
   `js const program = require('commander'); const colors = require('colors'); program.parse(process.argv); if(program.argv.slice(2).length <= 0) { program.help(make_red); } const make_red = (text) => { return colors.red(text); // 用红色字体显示help 文档 }`

### 自定义事件监听

commander 允许监听 命令 command 或者 选项设置 option 来执行一些自定义操作.

```js
const program = require('commander');
// 监听某一个已经注册的flag
program.on('option:flag', () => {
  console.log(this.flag);
});

// 匹配空执行
if (!process.argv.slice(2).length) {
  program.help(); // 输出help 文档并立即退出
}

// 监听command
program.on('command:*', cmdObj => {
  const [cmd, envs, command] = cmdObj;
  if (gitStyleCommands.indexOf(cmd) === -1) {
    program.outputHelp();
    console.log(`${chalk.red('Unknown command')} ${chalk.yellow(cmd)}.`);
    process.exit(1);
  }
});
```

注意:

1. 只能监听已经注册的 flag,
2. 监听 command 回调函数传入的 对象是一个数组 包括 cmd 命令 传入参数数组， 以及 commander 对象
3. command 的事件 不会和 command action 注册的事件同时触发，但是会和 git style command 风格的命令同时触发

## 完整实践

```js
const program = require('commander');
const chalk = require('chalk');
program.version('1.0.1'); // 程序的版本设置

program
  .option('-a, --absolute', 'this is absolute option') // 普通option
  .option('-b, --backend <dir>', 'this is backend option') // option 接收一个必填参数
  .option('-c, --callback <dir>', 'this is callback option', 'prod') // option 接收一个必填参数，如果不传会给一个默认值 prod
  .option('-d, --divide [env]', 'this is divide option') // option 接收一个选填参数
  .option('-e, --eval <num>', 'this is eval option', parseInt) // option 接收一个必填，并添加参数处理函数 parseInt 将字符串转为数字
  .option(
    '-f, --found <num>',
    'this is found option',
    function(num, baseNum) {
      return parseInt(num) + baseNum;
    },
    2,
  ) // option 接收一个必填参数，并添加参数处理函数，以及处理函数默认值
  .option('-g, --grace-template', 'this is graceTemplate option') // 连写长命令 取 对应属性值的时候 使用驼峰名取 program.graceTemplate
  .option('--no-happy', 'this is no happy option') // --no-[some] 类型的长命令。取对应的属性值。为no- 之后的名称 即 program.happy 。且当不设置任何参数时，使用该长命令获取的是 false， 不设置则反之为true
  .option('-i', 'this is a I option') // 只有短命令是 获取对应的属性值 取的是 大写名称，program.I
  .parse(process.argv);

console.log(program.opts());
console.log(program.absolute);
console.log(program.backend);
console.log(program.callback);
console.log(program.divide);
console.log(program.eval);
console.log(program.graceTemplate);
console.log(program.happy);
console.log(program.I);
program.on('option:verbose', kiss => {
  console.log('option:graceTemplate', kiss);
});

program
  .command('init <templateName> [envs...]') // 创建命令 <> 必填参数 [] 选填参数 ... 可接收多个
  .alias('i') // 命令取别名
  .description('this is a init command') // 命令的描述
  .option('-j, --jade', 'this is a jade option') // 该命令相关的选项配置
  .action((templateName, envs, cmdObj) => {
    console.log(templateName);
    console.log(envs); // 如果有命令两个参数 第二个参数就是该变量。 如果没有第二个参数 且包含 option 选项配置的时候 第二个参数就是 command 本身
    console.log(cmdObj.opts()); // 如果有两个参数 且包含option  ，第三个参数就是command本身
  });

program
  .arguments('<cmd> [envs...]') // 匹配任意 命令 且, 命令即参数被当作参数传入 action
  .action((cmd, envs) => {
    console.log(cmd); // 命令
    console.log(envs); // 参数
  }); // 当执行 已经注册的命令时 不会进入 arugments 通配命令中，只会执行对应的命令action

// git style command
program
  .command('install <templateName>', 'this is git style command') // 默认查找 当前目录的 相关文件 [当前文件名]-install exec-install.js 并执行
  .command('publish <name>', 'this is git style command', {
    excutableFile: 'execPublish',
  }) // 当提供配置选项的时候 会执行 excutableFile 指定的文件
  .command('default <name>', 'this is git style command', { isDefault: true }); // 当不传入命令的时候 或没有匹配到任意，命令时 会搜索 exec-defualt.js 并执行,

// 自定义监听已经注册的 option 选项
program.on('option:eval', eval => {
  console.log('option:eval', eval);
});

program.on('option:graceTemplate', graceTemplate => {
  console.log('option:graceTemplate', graceTemplate);
});

const gitStyleCommands = ['install', 'publish', 'default'];
// 自定义监听命令
program.on('command:*', cmdObj => {
  const [cmd, envs, command] = cmdObj;
  console.log(cmd, envs);
  if (gitStyleCommands.indexOf(cmd) === -1) {
    program.outputHelp();
    console.log(`${chalk.red('Unknown command')} ${chalk.yellow(cmd)}.`);
    process.exit(1);
  }
});

// 匹配空执行
if (!process.argv.slice(2).length) {
  program.help();
}

program.parse(process.argv);
```
