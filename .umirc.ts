import { defineConfig } from 'dumi';
import CompressionPlugin from 'compression-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';
export default {
  // ssr: {
  //   devServerRender: true,
  //   mode: 'stream', // 流式渲染
  // },
  exportStatic: {}, // 预渲染
  hash: true,
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
  ...defineConfig({
    mode: 'site',
    title: 'JohnApache',
    // description: 'JohnApache',
    // logo: '',
    locales: [], // 不需要多语言
    // menus: {}, // 约定式 侧边导航
    favicon: '/favicon.ico',
    navs: [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      {
        title: 'GitHub',
        path: 'https://github.com/JohnApache',
      },
    ],
    // more config: https://d.umijs.org/config
  }),
};
