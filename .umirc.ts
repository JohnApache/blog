import { defineConfig } from 'dumi';

export default {
  // ssr: {
  //   devServerRender: true,
  //   mode: 'stream', // 流式渲染
  // },
  // exportStatic: {}, // 预渲染
  ...defineConfig({
    mode: 'site',
    title: 'JohnApache',
    // description: 'JohnApache',
    // logo: '',
    locales: [], // 不需要多语言
    // menus: {}, // 约定式 侧边导航
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
