<template>
  <el-menu-item v-if="!hasChildren" :index="route.path">
    <span>{{ route.meta?.title }}</span>
  </el-menu-item>
  <el-sub-menu v-else :index="route.path">
    <template #title>
      <span>{{ route.meta?.title }}</span>
    </template>
    <MenuItem v-for="child in route.children" :key="child.path" :route="child" />
  </el-sub-menu>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { ElMenuItem, ElSubMenu } from 'element-plus';
import { useRouter, type RouteRecordRaw } from 'vue-router';

const props = defineProps<{
  route: RouteRecordRaw
}>();

const router = useRouter();

const hasChildren = computed(() => props.route.children && props.route.children.length > 0)

const navigateTo = () => {
  router.push({ name: props.route.name });
};
</script>