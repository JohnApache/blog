import CompressionPlugin from 'compression-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';

export default {
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
};
