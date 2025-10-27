import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(window.__MICRO_APP_BASE_ROUTE__ || import.meta.env.BASE_URL),
  routes,
});

export default router;
