/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 扩展window对象
declare interface Window {
  __MICRO_APP_BASE_ROUTE__: string; // 子应用的基础路径
  __MICRO_APP_NAME__: string; // 应用名称
  __MICRO_APP_ENVIRONMENT__: boolean; // 判断应用是否在微前端环境中
  unmount: () => void;
}

declare module '@wangeditor/editor-for-vue' {
  export const Editor: any;
  export const Toolbar: any;
}
