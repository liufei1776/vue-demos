import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/PageIndex.vue'),
    meta: {
      title: '主页',
    },
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统管理',
    },
    children: [
      {
        path: 'tenant',
        name: 'system-tenant',
        component: () => import('@/views/system/tenant/PageIndex.vue'),
        meta: {
          title: '租户管理',
        },
      },
      {
        path: 'permission',
        name: 'system-permission',
        component: () => import('@/views/system/permission/PageIndex.vue'),
        meta: {
          title: '权限管理',
        },
      },
    ],
  },
  {
    path: '/wheel',
    name: 'wheel',
    component: () => import('@/views/wheel/PageIndex.vue'),
    meta: {
      title: '转盘',
    },
  },
  {
    path: '/upload-demo',
    name: 'upload-demo',
    component: () => import('@/views/upload-demo/PageIndex.vue'),
    meta: {
      title: '大文件上传',
    },
  },
  {
    path: '/wang-editor',
    name: 'wang-editor',
    component: () => import('@/views/wang-editor/PageIndex.vue'),
    meta: {
      title: 'Wang Editor',
    },
  },
  {
    path: '/bpmn',
    name: 'bpmn',
    component: () => import('@/views/bpmn/PageIndex.vue'),
    meta: {
      title: 'BPMN',
    },
  },
];

export default routes;
