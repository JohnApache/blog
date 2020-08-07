# Puppeteer 通用 SSR 服务端渲染

`Puppeteer` 是一个 `Node` 库，它提供了一个高级 API 来通过 `DevTools` 协议控制 `Chromium` 或 `Chrome`。`Puppeteer` 默认以 `headless` 模式运行，但是可以通过修改配置文件运行“有头”模式。

你可以在浏览器中手动执行的绝大多数操作都可以使用 Puppeteer 来完成！ 下面是一些示例：

1. 生成页面 PDF。
2. 抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
3. 自动提交表单，进行 UI 测试，键盘输入等。
4. 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的 Chrome 中执行测试。
5. 捕获网站的 timeline trace，用来帮助分析性能问题。
6. 测试浏览器扩展。

本文主要介绍 用 `Puppeteer` 做通用服务端渲染 ，可以适用于任何 `SPA` 应用

## 安装 Puppeteer

`puppeteer`含有两个包`puppeteer` 和 `puppeteer-core`,它们的区别是

- `puppeteer-core` 在安装时不会自动下载 `Chromium`。
- `puppeteer-core` 忽略所有的 `PUPPETEER_*` env 变量.

官方推荐使用 `puppeteer`,

```bash
$ npm install puppeteer
$ yarn add puppeteer
```

主要介绍 `Linux` 下安装过程的几个问题

1. 安装 `Chromium` 失败
   安装 `puppeteer`结束后，会自动安装 `Chromium`, 由于下载地址容易被墙，安装失败，可以使用 配置 `.npmrc` 或者 `.yarnrc` 国内资源地址镜像 `puppeteer_download_host`, 配置如下

   ```ini
   # .npmrc
   puppeteer_download_host="https://npm.taobao.org/mirrors"
   puppeteer_chromium_revision="768783"
   ```

   `puppeteer_chromium_revision` 该配置当安装出现 `404` 未找到资源的错误时，(国内没有该版本镜像资源)，此时可以手动指定 `chromium` 版本, 具体有哪些版本可以查看 <https://npm.taobao.org/mirrors>

2. **Error while loading shared libraries: libpangocairo-1.0.so.0: cannot open shared object file: No such file or directory**  
   这样的错误，提示你缺少的是一个`so`文件，你可以在执行文件目录下执行这个命令进行查看缺少哪些依赖： `ldd chrome` | `grep not` 命令执行后会显示你当前缺少的依赖
   也可以直接安装所有相关依赖

   ```bash
   #依赖库
   yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 nss.x86_64 -y
   ```

3. linux 截图字体乱码  
   linux 环境缺少相关字体文件，可以下载安装所有字体文件

   ```bash
   #字体
   yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
   ```

4. **Error: spawn /home/card-spider/node_modules/puppeteer/.local-chromium/linux-706915/chrome-linux/chrome EACCES**  
   **权限问题**，添加`chromium` 权限即可, 找到`node_modules` 对应的`chrome`文件

   ```bash
   sudo chmod -R 777 /node_modules/puppeteer/.local-chromium/linux-768783/chrome-linux/chrome
   ```

5. **No usable sandbox**  
   **沙箱问题**, 正常应该将`chrome`运行在一个沙盒中，但是你没配置，对应的网址和 puppeteer 的文档中有写怎么操作创建沙盒 <https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox>.  
   另一个方案直接在启动配置中添加 `--no-sandbox`配置参数

   ```js
   import puppeteer from 'puppeteer';
   (async () => {
     const browser = await puppeteer.launch({
       args: ['--no-sandbox', '--disable-setuid-sandbox'],
     });
   })();
   ```

6. **Running as root without --no-sandbox is not supported**
   Linux 环境下不允许用户运行沙箱模式 `chromium`，解决方案有两种，

   - 不使用 `root` 用户，切换到普通用户即可，
   - 在启动配置中添加 `--no-sandbox`配置参数

   第二种方案配置方法 同 **方案 5**

7. **超时问题**  
   启动超时，延长 `timeout` 即可,

   `goto`方法加载一个页面默认超时是 30 秒，你可以更改，也可以直接写 0 代表一直等待, 设置 `{waitUntil: "networkidle0"}`, 某些情况导致页面很慢才加载结束, 使用 `page.on('requestfailed')`方法看看什么资源阻滞了页面跳转，`page.on('request')`方法拦截对应的请求`abort()`掉

8) **自定义 Chromium 版本安装后 启动没有自动寻找 npmrc 配置的版本号 Chromium**
   这个是在自定义下载 Chrome 版本后才会发生的事情，可以使用两种方案，

   - 添加运行时环境变量

     ```
     PUPPETEER_CHROMIUM_REVISION=768783 node index.js
     ```

     > 个人没有使用过，觉得设置环境变量再运行比较麻烦

   - 代码中配置指定版本  
      通过 `brwoserFetcher` 工具方法 `revisionInfo`，可以获取指定版本的 `Chrome` 在不同系统环境下的目录位置 `executablePath`，再配置到 启动配置参数中即可

     ```js
     const browserFetcher = await puppeteer.createBrowserFetcher();

     const PUPPETEER_CHROMIUM_REVISION = '768783';

     const revisionInfo = browserFetcher.revisionInfo(
       PUPPETEER_CHROMIUM_REVISION,
     );

     (async () => {
       const browser = await puppeteer.launch({
         executablePath: revisionInfo.executablePath,
         args: ['--no-sandbox', '--disable-setuid-sandbox'],
       });
     })();
     ```

## 完整代码示例

我这里使用的 `Egg.js` + `Puppeteer` + `redis` + `nginx`, `redis` 用来缓存页面, `nginx` 重定向爬虫请求到 `ssr` 通用服务中

`service`文件

```ts
// SSRService 文件
import { Service, Context } from 'egg';
import puppeteer from 'puppeteer';
import { UNKNOWN_EXCEPTION } from '../constant/error';

const isValidPageUrl = (pageUrl: string) => /^https?:\/\/.+\..+$/.test(pageUrl);
const urlExcludeArgs = (url: string) => {
  let result = url;
  const searchIndex = url.indexOf('?');
  if (searchIndex !== -1) {
    result = result.slice(0, searchIndex);
  }
  const anchorIndex = url.indexOf('#');
  if (anchorIndex !== -1) {
    result = result.slice(0, anchorIndex);
  }
  return result;
};

const PUPPETEER_CHROMIUM_REVISION = '768783';
const WHITE_LIST_RESOURE_TYPE = ['document', 'xhr', 'fetch', 'script'];

// 你如果正在页面上使用分析工具，那么要小心了。预渲染的页面可能会造成 PV 出现膨胀。具体来说，打点数据将会提升2倍，一半是在无头 Chrome 渲染时，另一半出现在用户浏览器渲染时。
// 谷歌百度统计相关请求屏蔽
const BLACK_LIST_REQUEST_URL = [
  'www.google-analytics.com',
  '/gtag/js',
  'ga.js',
  'analytics.js',
  'hm.baidu.com',
  'hm.js',
];
const MAX_CACHE_TIME = 60 * 60 * 1000;
const MAX_SSR_HTML_LOG_LENGTH = 100;
const MAX_AUTO_RESATRT_BROWSER_TIME_NUMBER = 60 * 60 * 1000 * 2; // 自动重启浏览器时间数字格式

class PuppeteerSSRService extends Service {
  constructor(ctx: Context) {
    super(ctx);
  }
  public async renderBlog() {
    const query = this.ctx.request.query;
    if (!query || !query.pageUrl || !isValidPageUrl(query.pageUrl)) {
      return '<h1>Page Not Found</h1>';
    }

    // 全局浏览器进程不存在时（可能在重启），返回错误码
    if (!this.app.Puppeteer_Browser_Instance) {
      this.ctx.logger.error('can not find Puppeteer_Browser_Instance');
      return '<h1>Server Error</h1>';
    }

    try {
      // 排除参数干扰缓存
      const finalUrl = urlExcludeArgs(query.pageUrl);
      const html = await this.ssr('blog', finalUrl);
      return html;
    } catch (error) {
      this.ctx.logger.error(error);
      return '<h1>Server Error</h1>';
    }
  }

  private async ssr(key: string, pageUrl: string) {
    const cacheHtml = await this.app.redis.get(
      `puppeteerSSR:${key}:pageUrl:${pageUrl}`,
    );
    if (cacheHtml) return cacheHtml;

    const browserWSEndpoint = await this.createBrowserWSEndpoint();
    const browser = await puppeteer.connect({ browserWSEndpoint });
    const page = await browser.newPage();

    // 开启浏览器缓存
    await page.setCacheEnabled(true);

    // 开启请求拦截器功能
    await page.setRequestInterception(true);
    page.on('request', req => {
      /* 非白名单资源请求直接抛弃 */
      if (!WHITE_LIST_RESOURE_TYPE.includes(req.resourceType())) {
        return req.abort();
      }

      /* 黑名单请求，例如统计代码抛弃 */
      if (BLACK_LIST_REQUEST_URL.some(url => req.url().includes(url))) {
        return req.abort();
      }

      /* 其他请求正常运行 */
      req.continue();
    });

    const response = await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    const html = await page.content();
    await page.close();

    // 非正常请求不缓存内容
    if (response?.ok()) {
      await this.app.redis.set(
        `puppeteerSSR:${key}:pageUrl:${pageUrl}`,
        html,
        'PX',
        MAX_CACHE_TIME,
      );
    }
    return html;
  }

  private async createBrowserWSEndpoint() {
    const cacheBrowserWSEndpoint = await this.app.redis.get(
      `puppeteerSSR:browserWSEndpoint`,
    );
    if (cacheBrowserWSEndpoint) return cacheBrowserWSEndpoint;
    const browserWSEndpoint = await this.createBrowser();
    return browserWSEndpoint;
  }

  public async createBrowser() {
    // 创建新的浏览器进程前，先销毁上一次的 browser 进程并重启
    if (this.app.Puppeteer_Browser_Instance) {
      this.app.Puppeteer_Browser_Instance.close();
      delete this.app.Puppeteer_Browser_Instance;

      // 删除 old wsEndpoint
      await this.app.redis.del(`puppeteerSSR:browserWSEndpoint`);
    }

    const browserFetcher = await puppeteer.createBrowserFetcher();
    const revisionInfo = browserFetcher.revisionInfo(
      PUPPETEER_CHROMIUM_REVISION,
    );

    // 启动配置参数优化
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      executablePath: revisionInfo.executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // 创建临时文件共享内存
        '--disable-accelerated-2d-canvas', // canvas渲染
        '--disable-gpu', // GPU硬件加速
        '--no-zygote', // 禁止zygote进程fork子进程
        '--single-process', // 单进程
      ],
    });

    const browserWSEndpoint = await browser.wsEndpoint();
    // 复用 browserWSEndpoint，减少重启
    await this.app.redis.set(
      `puppeteerSSR:browserWSEndpoint`,
      browserWSEndpoint,
      'PX',
      MAX_CACHE_TIME,
    );

    // 全局保存最新的浏览器进程
    this.app.Puppeteer_Browser_Instance = browser;

    return browserWSEndpoint;
  }
}
export default PuppeteerSSRService;
```

`controller`文件

```ts
// SSRController
import { Controller } from 'egg';

export default class SSRController extends Controller {
  public async blog() {
    const page = await this.ctx.service.puppeteerSSR.renderBlog();
    this.ctx.body = page;
  }
}
```

`router`文件

```ts
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/api/ssr/blog', controller.ssr.blog);
};
```

`schedule` 定时任务添加文件 `AutoRestartPuppeteerBrowser`

> Tips： 一个 `browser` 进程长时间运行容易卡住，这里做了定时任务，每隔一段时间重启一下浏览器

```ts
import { Subscription } from 'egg';

const MAX_AUTO_RESTART_BRWOSER_TIME = '2h'; // 自动重启浏览器时间

class AutoRestartPuppeteerBrowser extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: MAX_AUTO_RESTART_BRWOSER_TIME, // 5h间隔
      type: 'worker', // 这里只需任意一个 worker 要执行一次即可
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    this.ctx.logger.info('restarting puppeteer browser ...');
    try {
      await this.ctx.service.puppeteerSSR.createBrowser();
      this.ctx.logger.info('restart puppeteer browser succeed!');
    } catch (error) {
      this.ctx.logger.error('restart puppeteer browser failed!');
      this.ctx.logger.error(error);
    }
  }
}

export default AutoRestartPuppeteerBrowser;
```

`app.js`启动入口文件

```ts
import { Application } from 'egg';

export default (app: Application) => {
  app.beforeStart(async () => {
    // 保证应用启动监听端口前数据已经准备好了
    // 后续数据的更新由定时任务自动触发
    // 开机先启动浏览器一波
    await app.runSchedule('AutoRestartPuppeteerBrowser');
  });
};
```

下面是配置 `nginx`文件

```nginx
server {
    listen 80;
    server_name blog.cjw.design;

    root /usr/share/nginx/html;

    location / {
        # 重定向 UA 带有爬虫标记的 请求
        if ($http_user_agent ~* "qihoobot|Baiduspider|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|Adsbot-Google|Feedfetcher-Google|Yahoo! Slurp|Yahoo! Slurp China|YoudaoBot|Sosospider|Sogou spider|Sogou web spider|MSNBot|ia_archiver|Tomato Bot") {
             proxy_pass https://api.cjw.design/api/ssr/blog?pageUrl=$scheme://$host$request_uri;
        }

        index  index.html;
        try_files $uri /index.html;
    }

}
```

## 效果体验

```bash
# 普通访问
curl https://blog.cjw.design/blog/frontend/puppeteer-ssr

# 带有爬虫ua的访问
curl -A 'Baiduspider' https://blog.cjw.design/blog/frontend/puppeteer-ssr
```

## Linux 下 Puppeteer 的相关优化

1. 添加启动配置优化参数
   ```ts
   // 启动配置参数优化
   const browser = await puppeteer.launch({
     headless: true,
     devtools: false,
     executablePath: revisionInfo.executablePath,
     args: [
       '--no-sandbox',
       '--disable-setuid-sandbox',
       '--disable-dev-shm-usage', // 创建临时文件共享内存
       '--disable-accelerated-2d-canvas', // canvas渲染
       '--disable-gpu', // GPU硬件加速
       '--no-zygote', // 禁止zygote进程fork子进程
       '--single-process', // 单进程
     ],
   });
   ```
2. 通过 `redis` 缓存 `browserWSEndpoint`，减少重启浏览器, 全局只启动一个浏览器进程，进程实例 `Puppeteer_Browser_Instance` 挂载在全局 `Application` 对象上，方便多个 `worker` 可以使用同一个实例

3. 定时重启浏览器进程, 添加了一个定时任务 `schedule` ，定时重新创建浏览器，挂载到 全局 `Application` 上， 并关闭之前的浏览器进程

## 总结

综上是我总结的 用 `Puppeteer` 做 `SSR` 服务，后续也有可能会有其他内容的补充， `Puppeteer` 做 `SSR` 服务的性能可能比不上 直接写 服务端渲染, 但是它提供了一种新的可能性，而且最大的优势，对前端代码无任何改动，可以写作通用的 `SPA` 服务端渲染， 这个优势还是很大的
