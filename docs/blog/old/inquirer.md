# Inquirer 终端交互详解

> 引用官方的一句话，inquirer 是一个常用的交互式终端用户界面集合。
> 简单来说 **inquirer** 是可以让我们很方便的做各种终端交互行为的一个库

## 安装

```js
npm install inquirer
```

一个简单的使用 demo

```js
const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'string',
      name: 'username',
      message: '请输入用户名',
    },
    {
      type: 'number',
      message: '请输入您的年龄',
      name: 'age',
    },
  ])
  .then(answers => {
    console.log(answers.age);
    console.log(answers.username);
  });
```

**inquirer** 的整个交互流程主要包含三个内容 **inquirer** 提供 **method** 去注册终端的 **question** 然后再通过**method**的回调返回用户的指定输出 **answers**。下面依次介绍三个内容

### inquirer 方法介绍

inquirer 主要提供了三个方法方便我们注册问题

- **prompt(questions) => promise**
  该方法就是 终端交互的核心方法，运行 prompt 方法即告诉终端启动 交互式命令界面。 - prompt 方法需要传入一个 **questions** 数组, questions 数组包含对象形式的各个 question. question 的具体结构字段含义在后文介绍。 - prompt 方法的返回值是一个 promise 对象，promise.then 接收的返回值是 **answers** 对象，answers 对象包含前面所有问题回答的数据结果。 **answer**的具体结构字段含义在后文介绍

```js
inquirer
  .prompt([
    {
      type: 'string',
      name: 'username',
      message: '请输入用户名',
    },
    //...otherquestions
  ]) // => promise
  .then(answers => {
    console.log(answers.username);
  });
```

- **registerPrompt(name, prompt)**
  该方法主要提供 inquirer 注册其他符合 prompt 规范插件的功能，该方法的具体使用方法会在后文介绍插件的时候具体介绍。 - name
  参数类型：String
  指该插件 prompt 的 name，用于指向 question 的 name 字段 - prompt
  参数类型：Object
  指传入的插件 prompt 自身。

```shell
npm install inquirer-autocomplete-prompt
```

```js
const inquirer = require('inquirer');
const autocomplete = require('inquirer-autocomplete-prompt');
inquirer
    .registerPrompt(
        'autocomplete',
        autocomplete
    )
inquirer
    .prompt([
        {
          type: 'autocomplete',
          ...
        }
    ])
```

- **createPromptModule() => prompt function**
  该方法返回 inquirer 的 prompt 方法。该方法是一个自包含的模块，如果在开发时 需要重载 或者 添加新的 prompt 类型时，但是又不希望影响到其他依赖 requirer 的库，可以通过该方法 返回一个独立的 prompt 方法，而不影响到全局

### question 对象介绍

question 是传递给 prompt 的 questions 数组的每一项。
question 是一个对象数据，它包含了 终端交互时界面展示的询问信息字段和其他相关属性。 下面介绍一下 question 的主要内容

- **type**
  参数类型:String
  默认值 'input'，当不匹配任意类型则为 input
  可选值：input, number, confirm, list, rawlist, expand, checkbox, password, editor
  该属性表示了该 prompt 询问的类型，不同的 type 会显示不同的终端交互, 返回值 answer 也会根据不同值 返回不同 type 的结果。但是不同字段 也依赖于 其他字段配置支持。

- **name**
  参数类型: String
  该属性指向返回结果 answers 对象，存储对应 prompt 结果的 key 值。如果 name 是包含".",即 "info.age"这种类型的字符串，在存储该字段的时候 会 在 answers 指定路径下 存储结果, 即 answers.info.age

- **message**
  参数类型: String | Function
  默认值: question 指定的 "name" 字段 + ":"
  该属性表示当前 prompt 会显示在终端界面内容的问题。
  当该选项是一个函数时, 函数的返回值即为显示在终端界面内容的问题，并且函数会接收一个参数，该参数返回当前 answers 对象，可以通过 answers 在此时取得当前 prompt 之前的答案，可以很方便的在终端中展示包含前面回答结果的问题

- **default**
  参数类型: String | Number | Boolean | Array | Function
  该属性表示当前 prompt 如果未输出任何内容，直接 enter 时，会给当前 prompt 提供 default 指定的内容，作为当前 prompt 的结果
  如果 default 是一个函数，该函数的返回值即为当前 prompt 的结果，并该函数还会接收一个参数，该参数返回的是当前 answers 对象，可以通 message 一样，获取到之前回答的结果

- **choices**
  参数类型: Array | Function
  该属性表示可选择的列表数组，在 type 为 list 或者 expand 等等属性时，提供终端可选择的交互，当该值为 function 类型时返回值 也必须是一个数组, 并且该函数接收一个参数可以获取当前 answers 对象。
  choice 的每一项 可以是 Number |String | Object 类型的数据， 当为 Object 类型时，必须要有 name 字段，显示在终端 list 上， 还要有 value 字段 对应当前的选项的真正的值，类似于 select 的 option 和 value 的关系，除此之外，object 还可以 包含其他 任意属性，用于 在不同 type 类型下 需要提供不同的额外属性，例如 expand 需要提供一个 key 字段。

- **validate**
  参数类型: Function
  该属性是一个校验函数，用户回答问题后的结果，会经过该函数校验，校验函数接收 当前的 input 的值，以及 当前 answers 对象，函数的返回值为 true | false | Error，当返回 true 的时候 表示校验通过，返回 false 表示校验不通过, 默认 终端界面展示 会让用户重新输入，如果返回 Error 也是表示校验不通过，且界面会展示 当前 error 信息，直到校验函数返回 true 的时候 问题 才会继续下去，否则校验不通过会一直重复回答

- **filter**
  参数类型：Function
  该属性是一个过滤函数，用来过滤 answer，用户回答的结果可以经过过滤函数处理并返回过滤后的结果 作为 answers 存储的值.
  该函数 也接收两个参数值，第一个为当前的 input 的值，第二个位当前的 answers 对象

- **transformer**
  参数类型: Function
  该属性本质上也是一个过滤函数，但是它是用来过滤 当前 input 的值。即用户终端界面 当前展示输入的值，会经过 transformer 过滤后展示在终端界面上，该函数只会影响到终端界面的展示， 真实输入的内容 并没有发生改变。内部 answers 存储的结果 还是原始值。
  该函数 接收三个参数值。第一个参数为当前的真实输入的原始值， 第二个参数为当前 answers 对象，第三个 参数是一个 option 对象，我使用的时候 只看到里面 有一个 isFinal 字段，表示当前问题是不是最后一个问题，在其他场景会不会新增字段暂时不了解.

- **when**
  参数类型: Function | Boolean
  该属性是一个条件函数，它表示当前问题是否该被提问，如果函数返回 false 或者 when 值为 false，则当前问题会被跳过，自动跳到下一个问题，或者直接结束结果，当 when 值是一个函数时，它的返回值必须是 true 或者 false。
  when 为函数时，会接收一个参数值，参数值为当前 answers 对象。

- **pageSize**
  参数类型: Number
  默认值： 7
  该参数选项只有在 prompt 类型为 list | rawList | expand | checkbox 时 才有效果，在终端界面的表现就是 控制一次性渲染多少条问题数据

- **prefix**
  参数类型: String
  该选项为 显示在 message 前面固定的内容，类似于 label

- **suffix**
  参数类型: String
  该选项为 显示在 message 后面固定的内容，类似于 label

**注意**：
default, choices, validate, filter， when 都可以调用异步函数。有两种方法 可以支持异步等待执行

- 返回一个 promise ,inquirer 在处理流程时遇到 promise，会默认等待执行

```js
const inquirer = require('inquirer');
inquirer.prompt([
  {
    type: 'checkbox',
    filter(input) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(input + 'async');
        }, 3000);
      });
    },
    validate(input) {
      return input.indexOf('async') !== -1;
    },
  },
]);
```

- 使用 this.async() 方法 去获得一个回调函数，inquirer 在处理流程时遇到该方法时 会默认等待直到该方法执行.
  回调函数接收两个参数，第一个参数 为 error 信息，描述错误原因，不传为 null 即可（个人实践，当 error 不为空时会整个崩溃）。第二个参数为需要等待的最终值。

```js
const inquirer = require('inquirer');
inquirer.prompt([
  {
    type: 'checkbox',
    filter(input) {
      const done = this.async();
      setTimeout(() => {
        done(input + 'async');
      }, 3000);
    },
    validate(input) {
      return input.indexOf('async') !== -1;
    },
  },
]);
```

### answer 对象介绍

answer 是 inquirer prompt 返回的最终回答结果，实际上也是一个 key/value 类型的 hash 对象，存储着前面问题的所有结果。

- Key: 为前面每个 question 注册的 name 选项
- Value: 为前面每个 question 存储的答案结果,针对不同类型 type 的 question，value 存储类型也不相同
  - confirm: 返回值为 Boolean
  - input : 如果没有经过 filter 特殊处理，返回值为 String
  - number: 如果没有经过 filter 特殊处理，返回值为 Number
  - rawlist, list : 如果没有经过 filter 特殊处理，返回值为 choices 选中的 value, 或者没有指定 value 时取的 name 字段
  - checkbox: 如果没有经过 filter 处理，默认返回值为选中的 choices 所有选中的值，返回值类型为数组类型

### separator 分割线介绍

separator 可以被插入在 choices 的任意位置，在终端界面上显示为分割线的效果，且分割线时不会被当作选项选中的，适宜给列表分组时使用
inquirer 包含分割线的构造函数，创建分割线方法为

```js
new inquirer.Separator();
```

在日常使用中的场景

```js
const inquirer = require('inquirer');
inquirer.prompt([
  {
    type: 'list',
    name: 'lists',
    choices() {
      const lists = [];
      for (let i = 0; i < 100; i++) {
        if (i % 3 === 0) {
          list.push(new inquirer.Separator());
        }
        list.push('item' + (i + 1));
      }
      return lists;
    },
  },
]);
```

构造函数可以传入一个 String 类型的分隔符，会在终端展示列表时显示出来，如果不传入值，默认会使用 ‘--------’作为分隔符.
separator 实例属性包含 type 字段，type 为 ‘separator’， 这使得 inquirer 可以检测列表里的 separator。

### prompt types 介绍

这里主要介绍 prompt 方法传入的 question 对象不同的 type, 依赖的 不同必填选项值和可选选项值，还有每一种 type 的界面形象，图片参考官方。

- **list**
  必填选项：type, name, message, choices
  可选选项：default, filter
  注意：default 选项的值必须是 choices 在数组中对应的 index， 或者对应的 choice value
  终端展示界面参考
  ![list终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/1.png 'list终端展示图片')

- **rawlist**
  必填选项：type, name, message, choices
  可选选项：default, filter
  注意：default 选项的值必须是 choices 在数组中的 index.
  终端展示界面参考
  ![rawlist终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/2.png 'rawlist终端展示图片')

- **expand**
  必填选项：type, name, message, choices
  可选选项：default
  注意：

1. default 选项的值必须是 choices 在数组中对应的 index.如果没有提供 default 默认值，用户也没有选中任何选项直接 enter 时，默认会显示 help 帮助信息，展示在终端界面所有选择选项
2. expand 提供的 choice 选项,除了 name, value 每一个对象必须提供额外的选项 key， key 必须是单个字符，且为小写字符, 或者是单个数字, 且 prompt 会默认提供 一个 “h” key 作为帮助选项，该 key 不应该被我们使用。
   终端展示界面参考
   ![expand终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/3.png 'expand终端展示图片')
   ![expand终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/4.png 'expand终端展示图片')

- **checkbox**
  必填选项：type, name, message, choices
  可选选项：filter, validate, default
  注意：

1. default 选项的值必须是 choices 中 对应的 choice value 与前面的 index 索引不相同
2. choices 每一个选项，除了 name, value ，还可以选择性提供一个 额外的参数 "checked"， 当标记为 checked: true 的 choice 在终端界面中展示初始是默认选中的状态
   3.choises 还提供了一个 额外选项属性，"disabled", disabled 可以是 一个 Boolean 值，当为 true 是 该选项 不可选择，且选项旁边会有标注(Disabled); disabled 也可以是一个 字符串，此时该选项被禁用，且 选项旁边的标注 替换为 disabled 字符串的值; disabled 还可以是一个函数，当为函数时，可以接收一个参数， 当前的 answers 对象，并且函数的返回值 需要是一个 String 或者 Boolean。
   终端展示界面参考
   ![checkbox终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/5.png 'checkbox终端展示图片')

- **confirm**
  必填选项：type, name, message
  可选选项：default
  注意: default 值需要时一个 Boolean 类型的值
  终端展示界面参考
  ![confirm终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/6.png 'confirm终端展示图片')

- **input**
  必填选项：type, name, message
  可选选项：default, filter, validate, transformer
  终端展示界面参考
  ![input终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/7.png 'input终端展示图片')

- **number**
  必填选项：type, name, message
  可选选项：default, filter, validate, transformer
  终端展示界面参考 同 input 效果相同

- **password**
  必填选项：type, name, message, mask
  可选选项：default, filter, validate
  注意：mask 是一个 String 值 该选项是用来隐藏用户真实输入, 在界面中展示的效果为 用户输入的任意单个 字符都会被替换成 mask 对应的 string, 可以做掩码。 如果不传 mask 或者 mask 为空时，终端界面就不会显示任何输出.
  终端展示界面参考
  ![password终端展示图片](https://github.com/JohnApache/inquirer-usage-doc/blob/master/8.png 'password终端展示图片')

- **editor**
  必填选项：type, name, message
  可选选项：default, filter, validate
  注意：在临时文件上启动用户首选编辑器的实例。用户退出编辑器后，将读入临时文件的内容作为结果。要使用的编辑器是通过读取$ VISUAL或$ EDITOR 环境变量来确定的。如果这些都不存在，则使用记事本（在 Windows 上）或 vim（Linux 或 Mac）。
  终端展示效果 会 提示使用 enter 键，进入默认编辑器，并将当前结果存储。

### bottom bar

inquirer 提供了一些基础的文本 ui
eg. **inquirer.ui.BottomBar**
此 UI 在自由文本区域的底部显示固定文本。这对于在较高部分输出命令输出时将消息保持在屏幕底部非常有用。
引用官方的例子，个人很少需要使用到这个

```js
const ui = new inquirer.ui.BottomBar();

// pipe a Stream to the log zone
outputStream.pipe(ui.log);

// Or simply write output
ui.log.write('something just happened.');
ui.log.write('Almost over, standby!');

// During processing, update the bottom bar content to display a loader
// or output a progress bar, etc
ui.updateBottomBar('new bottom bar content');
```

### 完整实践

```js
const inquirer = require('inquirer');
const seperator = new inquirer.Separator('============');
(async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'author',
      message: '请输入作者名称',
      default: 'author',
      filter(input) {
        return input.trim();
      },
      validate(input) {
        return input.length > 0;
      },
      transformer(input) {
        if (input.length > 0) {
          return '大神' + input;
        }
        return input;
      },
    },
    {
      type: 'number',
      name: 'age',
      message(answers) {
        return `大神${answers.author}请输入您的年龄`;
      },
      filter(input) {
        let num = parseInt(input);
        if (Number.isNaN(num) || num <= 0 || num > 100) return '';
        return num;
      },
      validate(input) {
        let num = parseInt(input);
        if (Number.isNaN(num) || num <= 0 || num >= 100) {
          console.log(input);
          return new Error('请输入合法的年龄');
        }
        return true;
      },
      transformer(input, answers) {
        return `大神${answers.author}今年  ${input}  岁`;
      },
    },
    {
      type: 'password',
      name: 'pwd',
      message(answers) {
        return `大神${answers.author}请输入您的密码`;
      },
      mask: '*',
    },
    {
      type: 'confirm',
      name: 'isRoot',
      default: true,
      message: '当前目录是根目录',
    },
    {
      type: 'list',
      name: 'favorFruits',
      message: '选择你最喜欢的水果',
      default: 3,
      pageSize: 4,
      filter(input) {
        return input.slice(6);
      },
      choices() {
        return new Array(100).fill(0).map((v, i) => {
          if (i % 4 === 0) {
            return seperator;
          }
          return {
            name: `fruit_${i}`,
            value: `fruit_${i}`,
          };
        });
      },
    },
    {
      type: 'rawlist',
      name: 'favorSport',
      message: '选择你最喜欢的运动',
      default: 3,
      pageSize: 5,
      when(answers) {
        return answers.favorFruits > 10 && answers.isRoot;
      },
      choices() {
        return new Promise(resolve => {
          const result = new Array(100).fill(0).map((v, i) => {
            if (i % 4 === 0) {
              return seperator;
            }
            return {
              name: `sport_${i}`,
              value: `sport_${i}`,
            };
          });
          setTimeout(() => {
            resolve(result);
          }, 1000);
        });
      },
    },
    {
      type: 'expand',
      name: 'opera',
      message: '选择您的操作',
      default: 3,
      choices() {
        return new Promise(resolve => {
          const result = new Array(10).fill(0).map((v, i) => {
            return {
              name: `opera_${i}`,
              value: `opera_${i}`,
              key: `${i}`,
            };
          });
          setTimeout(() => {
            resolve(result);
          }, 1000);
        });
      },
    },
    {
      type: 'checkbox',
      name: 'hobby',
      message: '选择您的爱好，至少12个',
      validate(input) {
        return input.length >= 12;
      },
      choices() {
        return new Array(100).fill(0).map((v, i) => {
          if (i % 7 === 0) return seperator;
          return {
            name: `hobby_${i}`,
            value: `hobby_${i}`,
            checked: i % 9 === 0,
            disabled: i % 8 === 0,
          };
        });
      },
    },
  ]);

  console.log(answers);
})();
```
