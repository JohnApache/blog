import { defineConfig } from 'dumi';

export default {
  // ssr: {
  //   devServerRender: true,
  //   mode: 'stream', // 流式渲染
  // },
  //  exportStatic: {}, // 预渲染
  hash: true,
  metas: [
    {
      name: 'keywords',
      content:
        'blog, dumi, 前端博客, 面试题, 算法, 运维, 算法, 数据结构, 前端全栈, 技术文档',
    },
    {
      name: 'description',
      content: '关注前端技术学习交流，记录与分享自己前端学习历程',
    },
  ],
  ...defineConfig({
    mode: 'site',
    title: `JohnApache`,
    dynamicImport: {
      // loading: ''
    }, // 启用按需加载
    // description: 'JohnApache',
    // logo: '',
    locales: [], // 不需要多语言
    // menus: {}, // 约定式 侧边导航
    favicon: '/favicon.ico',
    navs: [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      {
        title: 'GitHub',
        path: 'https://github.com/JohnApache/blog',
      },
    ],
    // more config: https://d.umijs.org/config
  }),
};
