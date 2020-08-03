import CompressionPlugin from 'compression-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';

export default {
  exportStatic: {}, // 预渲染
  hash: true,
  headScripts: [
    // 百度统计
    `var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?1892a2f98b208487e5a1baefae81d387";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();`,
    // 谷歌统计
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-174261313-1',
      async: true,
    },
    `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-174261313-1');`,
  ],
  chainWebpack(config) {
    config.plugin('compression-webpack').use(CompressionPlugin, [
      {
        deleteOriginalAssets: false, // 是否删除压缩前的文件，看情况配置
        algorithm: 'gzip', // 压缩算法，默认就是gzip
        test: /./, // 所有文件都压缩
        threshold: 1000, // 只处理比这个值大的资源。按字节计算
        minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
      },
    ]);

    config.plugin('brotli-webpack').use(BrotliPlugin, [
      {
        deleteOriginalAssets: false, // 是否删除压缩前的文件，看情况配置
        test: /./, // 所有文件都压缩
        threshold: 1000, // 只处理比这个值大的资源。按字节计算
        minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
      },
    ]);
  },
};
