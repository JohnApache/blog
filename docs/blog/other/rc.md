# 配置国内镜像 rc 文件

## yarnrc

项目根目录创建 `.yarnrc` 文件

```r
registry "https://registry.npm.taobao.org"
disturl "https://npm.taobao.org/dist"
nvm_nodejs_org_mirror "http://npm.taobao.org/mirrors/node"
NODEJS_ORG_MIRROR "http://npm.taobao.org/mirrors/node"
sass_binary_site "http://npm.taobao.org/mirrors/node-sass"
electron_mirror "http://npm.taobao.org/mirrors/electron/"
SQLITE3_BINARY_SITE "http://npm.taobao.org/mirrors/sqlite3"
profiler_binary_host_mirror "http://npm.taobao.org/mirrors/node-inspector/"
node_inspector_cdnurl "https://npm.taobao.org/mirrors/node-inspector"
selenium_cdnurl "http://npm.taobao.org/mirrors/selenium"
puppeteer_download_host "https://npm.taobao.org/mirrors"
chromedriver_cdnurl "https://npm.taobao.org/mirrors/chromedriver"
operadriver_cdnurl "https://npm.taobao.org/mirrors/operadriver"
phantomjs_cdnurl "https://npm.taobao.org/mirrors/phantomjs"
fse_binary_host_mirror "https://npm.taobao.org/mirrors/fsevents"
```

下载路径 <https://assets.cjw.design/rc/.yarnrc>

## npmrc

项目根目录创建 `.npmrc` 文件

```ini
# package-lock=false
registry="https://registry.npm.taobao.org"
disturl="https://npm.taobao.org/dist"
nvm_nodejs_org_mirror="http://npm.taobao.org/mirrors/node"
nodejs_org_mirror="http://npm.taobao.org/mirrors/node"
sass_binary_site="http://npm.taobao.org/mirrors/node-sass"
electron_mirror="http://npm.taobao.org/mirrors/electron/"
SQLITE3_BINARY_SITE="http://npm.taobao.org/mirrors/sqlite3"
profiler_binary_host_mirror="http://npm.taobao.org/mirrors/node-inspector/"
node_inspector_cdnurl="https://npm.taobao.org/mirrors/node-inspector"
selenium_cdnurl="http://npm.taobao.org/mirrors/selenium"
puppeteer_download_host="https://npm.taobao.org/mirrors"
chromedriver_cdnurl="https://npm.taobao.org/mirrors/chromedriver"
operadriver_cdnurl="https://npm.taobao.org/mirrors/operadriver"
phantomjs_cdnurl="https://npm.taobao.org/mirrors/phantomjs"
fse_binary_host_mirror="https://npm.taobao.org/mirrors/fsevents"
```

下载路径 <https://assets.cjw.design/rc/.npmrc>
