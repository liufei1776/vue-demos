<template>
  <el-menu router>
    <MenuItem v-for="route in availableRoutes" :key="route.path" :route="route" />
  </el-menu>
</template>

<script setup lang="ts">
import { ElMenu } from 'element-plus';
import MenuItem from './MenuItem.vue';
import routes from '@/router/routes';
import { filterRoutesByPermissions } from '@/utils/routes';

const permissions = [
  'home',
  'system-permission',
  /*'wheel', */
  'upload-demo',
  /*'wang-editor',*/
  /* 'bpmn', */
  /*'logic-flow', */
  'relation-graph',
  'virtual-list',
];
const availableRoutes = filterRoutesByPermissions(routes, permissions);
</script>

<style>
/* .el-menu {
  border-right: none;
} */
</style>
