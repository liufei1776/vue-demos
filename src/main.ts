import './style.css';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { i18n } from './locales';

import microApp from '@micro-zoe/micro-app';

microApp.start();

const app = createApp(App);

// if (window.__MICRO_APP_BASE_ROUTE__) {
//   const appName = `micro-app-${window.__MICRO_APP_NAME__}`;
//   // @ts-ignore
//   window[appName] = {
//     mount() {
//       console.log('子应用挂载');
//       app.use(router);
//       app.use(i18n);
//       app.mount('#app');
//     },
//     unmount() {
//       app.unmount();
//     },
//   };
// } else {
//   console.log('非微前端环境直接启动');
//   app.use(router);
//   app.use(i18n);
//   app.mount('#app');
// }

app.use(router);
app.use(i18n);
app.mount('#app');

if (window.__MICRO_APP_ENVIRONMENT__)
  window.unmount = () => {
    app.unmount();
  };
