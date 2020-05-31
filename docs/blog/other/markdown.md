---
group:
  title: 工具
  order: 6
---

# Markdown 语法介绍

Markdown 是一种纯文本格式的标记语言。通过简单的标记语法，它可以使普通文本内容具有一定的格式。本博客使用的也是 Makrdown 编写的，所以统一整理了下语法。

## 代码

如果只想高亮某个代码关键词可以使用 `some_keywords` 的语法实现效果
如果需要展示代码片段，并希望能适配合适的高亮方法 可以使用 ` ```lang ` 语法， 包裹一段代码

<pre>
```js
console.log('Hello Markdown')
```
</pre>

markdown 支持的语言:`1c, abnf, accesslog, actionscript, ada, apache, applescript, arduino, armasm, asciidoc, aspectj, autohotkey, autoit, avrasm, awk, axapta, bash, basic, bnf, brainfuck, cal, capnproto, ceylon, clean, clojure, clojure-repl, cmake, coffeescript, coq, cos, cpp, crmsh, crystal, cs, csp, css, d, dart, delphi, diff, django, dns, dockerfile, dos, dsconfig, dts, dust, ebnf, elixir, elm, erb, erlang, erlang-repl, excel, fix, flix, fortran, fsharp, gams, gauss, gcode, gherkin, glsl, go, golo, gradle, groovy, haml, handlebars, haskell, haxe, hsp, htmlbars, http, hy, inform7, ini, irpf90, java, javascript, json, julia, kotlin, lasso, ldif, leaf, less, lisp, livecodeserver, livescript, llvm, lsl, lua, makefile, markdown, mathematica, matlab, maxima, mel, mercury, mipsasm, mizar, mojolicious, monkey, moonscript, n1ql, nginx, nimrod, nix, nsis, objectivec, ocaml, openscad, oxygene, parser3, perl, pf, php, pony, powershell, processing, profile, prolog, protobuf, puppet, purebasic, python, q, qml, r, rib, roboconf, rsl, ruby, ruleslanguage, rust, scala, scheme, scilab, scss, smali, smalltalk, sml, sqf, sql, stan, stata, step21, stylus, subunit, swift, taggerscript, tap, tcl, tex, thrift, tp, twig, typescript, vala, vbnet, vbscript, vbscript-html, verilog, vhdl, vim, x86asm, xl, xml, xquery, yaml, zephir`, 基本包含了所有我们需要的语言格式.

也可以使用 四个空格缩进 实现相同的 代码片段效果

<pre>
    console.log('Hello Markdown')
</pre>

不需要代码高亮的时候可以 使用 ` ```nohighlight ` 语法禁用高亮

<pre>
```nohighlight
```
</pre>

## 标题

- 比较常见的标题写法
  示例：

  ```nohighlight
  # H1
  ## H2
  ### H3
  #### H4
  ##### H5
  ###### H6
  ```

  效果：

  # H1

  ## H2

  ### H3

  #### H4

  ##### H5

  ###### H6

- 另一种写法  
   示例：

  ```nohighlight
  标题1
  ======
  标题2
  ------
  ## 大标题 ##
  ### 小标题 ###
  ```

  效果：

  # 标题 1

  标题 2

  ***

  ## 大标题

  ### 小标题

## 字体

`*这是斜体*`： _这是斜体_  
`_这也是斜体_`：_这也是斜体_  
`**这是粗体**`： **这是粗体**  
`__这也是粗体__`：**这也是粗体**  
`***这是加粗斜体***`：**_这是加粗斜体_**  
`___这也是加粗斜体___`：**_这也是加粗斜体_**  
`~~这是删除线~~`：~~这是删除线~~

## 超链接

- 常用链接技巧

  `[链接文字](链接网址 "title")`  
   示例：

  ```
  文字链接 [Google](https://google.com "谷歌")
  网址链接 <https://google.com>
  ```

  效果：

  文字链接 [Google](https://google.com '谷歌')  
   网址链接 <https://google.com>

- 高级链接技巧  
   示例：

  ```
  // 定义网址变量
  [abc]: http://www.google.com/
  [yahoo]: http://www.yahoo.com/

  使用google网址变量, [Google][abc]
  使用yahoo网址变量，[Yahoo!][yahoo]

  ```

  效果：

  [abc]: http://www.google.com/
  [yahoo]: http://www.yahoo.com/

  使用 google 网址变量, [Google][abc]  
   使用 yahoo 网址变量，[Yahoo][yahoo]

## 分割线

`*` 或者 `-` 单独一行超过 3 个即是分割线，中间允许空格  
示例：

```
***
* * *
---
------
```

效果：

---

---

---

---

## 换行符

文末两个以上的 `空格` 或者 `回车` 即可换行，也可以使用标签 `<br/>`换行  
示例：

```
dddd<br>ddd
eeee
ee

```

效果：  
dddd<br/>ddd<br/>
eeee  
ee

## 列表

- 无序列表  
   示例：

  ```
  * 无序列表项 一
  - 无序列表项 二
  + 无序列表项 三
  ```

  效果：

  - 无序列表项 一

  * 无序列表项 二

  - 无序列表项 三

- 有序列表
  示例：

  ```
  1. 无序列表项 一
  2. 无序列表项 二
  3. 无序列表项 三
  ```

  效果：

  1. 无序列表项 一
  2. 无序列表项 二
  3. 无序列表项 三

- 包含多行段落的列表  
   示例：

  ```
  *   轻轻的我走了， 正如我轻轻的来； 我轻轻的招手， 作别西天的云彩。
  那河畔的金柳， 是夕阳中的新娘； 波光里的艳影， 在我的心头荡漾。
  软泥上的青荇， 油油的在水底招摇； 在康河的柔波里， 我甘心做一条水草！

      那榆荫下的一潭， 不是清泉， 是天上虹； 揉碎在浮藻间， 沉淀着彩虹似的梦。
  寻梦？撑一支长篙， 向青草更青处漫溯； 满载一船星辉， 在星辉斑斓里放歌。
  但我不能放歌， 悄悄是别离的笙箫； 夏虫也为我沉默， 沉默是今晚的康桥！

  *    悄悄的我走了， 正如我悄悄的来； 我挥一挥衣袖， 不带走一片云彩。
  ```

  效果：

  - 轻轻的我走了， 正如我轻轻的来； 我轻轻的招手， 作别西天的云彩。
    那河畔的金柳， 是夕阳中的新娘； 波光里的艳影， 在我的心头荡漾。
    软泥上的青荇， 油油的在水底招摇； 在康河的柔波里， 我甘心做一条水草！

    那榆荫下的一潭， 不是清泉， 是天上虹； 揉碎在浮藻间， 沉淀着彩虹似的梦。

    寻梦？撑一支长篙， 向青草更青处漫溯； 满载一船星辉， 在星辉斑斓里放歌。
    但我不能放歌， 悄悄是别离的笙箫； 夏虫也为我沉默， 沉默是今晚的康桥！

  - 悄悄的我走了， 正如我悄悄的来； 我挥一挥衣袖， 不带走一片云彩。

## 引用

- 普通引用  
   示例：

  ```
  > 这是一句引用
  ```

  效果：

  > 这是一句引用

- 嵌套引用
  示例：

  ```
  > 这是一句引用
  >> 这是嵌套引用
  >>> 这是嵌套三层
  ```

  效果：

  > 这是一句引用
  >
  > > 这是嵌套引用
  > >
  > > > 这是嵌套三层

- 引用嵌套列表  
   示例：

  ```
  > - 列表1
  > - 列表2
  >   * 列表 2 - 1
  >   * 列表 2 - 2
  ```

  效果：

  > - 列表 1
  > - 列表 2
  >   - 列表 2 - 1
  >   - 列表 2 - 2

- 引用嵌套代码块
  示例：
  ````
  > ```js
  > console.log('Hello Markdown');
  > ```
  ````
  效果：
  > ```js
  > console.log('Hello Markdown');
  > ```

## 图片

跟链接的方法区别在于前面加了个感叹号 `!` ，而且和超链接一样也有两种写法，行内式和参考式写法。

- 行内式  
   `![图片名称](图片网址 "alt")`  
   示例：

  ```
  ![火箭](https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png)

  ![其他](https://abc.png "404")
  ```

  效果：  
   ![两个](https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png)

  ![404](https://abc.png '404')

- 参考式  
   示例：

  ```
  [rocket]: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png

  ![火箭][rocket]
  ```

  效果：

  [rocket]: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png

  ![火箭][rocket]

## 注脚

语法：`文字[^注脚名字]`

经测试注脚与注脚之间必须空一行，不然会失效。成功后会发现，即使你没有把注脚写在文末，经 Markdown 转换后，也会自动归类到文章的最后。  
示例：

```
这是一个用markdown[^1]写的blog[^你好]
[^1]: markdown是一种纯文本标记语言
[^你好]: blog记录日常生活
```

效果：

这是一个用 markdown[^1]写的 blog[^2]

[^1]: markdown 是一种纯文本标记语言
[^2]: blog 记录日常生活

## 表格

第一行为表头，第二行分隔表头和主体部分，第三行开始每一行为一个表格行。 列于列之间用管道符|隔开。原生方式的表格每一行的两边也要有管道符。 第二行还可以为不同的列指定对齐方向。默认为左对齐，在-右边加上:就右对齐。  
示例：

```
ID|昵称|性别
-|-|-
1|Mike｜男
2|Lucy|nv


ID|昵称|性别
:-|-:|:-
1|Mike｜男
2|Lucy|nv
```

效果：

| ID  | 用户姓名 | 性别 |
| --- | -------- | ---- |
| 1   | Mike     | 男   |
| 2   | Lucy     | 女   |

<br/>

| ID  | 用户姓名 | 性别 |
| :-- | -------: | ---: |
| 1   |     Mike |   男 |
| 2   |     Lucy |   女 |

## HTML 原始码

在代码里面， & 、 < 和 > 会自动转成 HTML 实体, 行内 HTML 元素 还包括 `<kbd> <b> <i> <em> <sup> <sub> <br>`等  
使用 `<pre></pre>` 也可以生成代码块
示例：

```
<a href='#' class="anchor">
这是一个超链接
</a>
<kbd>Ctrl</kbd> + <kbd>Enter</kbd>
```

<a href='#' class="anchor">
这是一个超链接
</a>

<kbd>Ctrl</kbd> + <kbd>Enter</kbd>

## 数学 公式

> 有的平台不支持

- \$ 表示行内公式：  
   示例：

  ```
  质能守恒方程可以用一个很简洁的方程式 $E=mc^2$ 来表达。
  ```

  效果：  
   质能守恒方程可以用一个很简洁的方程式 $E=mc^2$ 来表达。

- \$\$ 表示整行公式：  
   示例：

  ```
  $$\sum_{i=1}^n a_i=0$$
  $$f(x_1,x_x,\ldots,x_n) = x_1^2 + x_2^2 + \cdots + x_n^2 $$
  $$\sum^{j-1}_{k=0}{\widehat{\gamma}_{kj} z_k}$$

  ```

  效果：  
  $$\sum_{i=1}^n a_i=0$$

  $$f(x_1,x_x,\ldots,x_n) = x_1^2 + x_2^2 + \cdots + x_n^2$$

  $$\sum^{j-1}_{k=0}{\widehat{\gamma}_{kj} z_k}$$

## TodoList

> 有的平台不支持，
> 示例：

```
- [ ] Eat
- [x] Code
  - [x] HTML
  - [x] CSS
  - [x] JavaScript
- [ ] Sleep
```

效果：

- [ ] Eat
- [x] Code
  - [x] HTML
  - [x] CSS
  - [x] JavaScript
- [ ] Sleep

## 扩展

支持 jsfiddle、gist、runjs、优酷视频，直接填写 url，在其之后会自动添加预览点击会展开相关内容。

> 有的平台不支持

示例：

```
http://{url_of_the_fiddle}/embedded/[{tabs}/[{style}]]/
https://gist.github.com/{gist_id}
http://runjs.cn/detail/{id}
http://v.youku.com/v_show/id_{video_id}.html
```

示例：

https://v.youku.com/v_show/id_XNDY5MjU1Mzk0OA==.html

> 大多数不支持
