<template>
  <div class="container" ref="container"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue';
import LogicFlow from '@logicflow/core';
import '@logicflow/core/lib/style/index.css';
import { renderData } from './data';

const containerDom = useTemplateRef<HTMLDivElement>('container');

const initLogicFlow = () => {
  if (containerDom.value) {
    const lf = new LogicFlow({
      container: containerDom.value,
      grid: true,
    });
    lf.render(renderData);
  }
};

onMounted(() => {
  initLogicFlow();
});
</script>

<style scoped>
.container {
  height: 600px;
  border: 1px solid #ccc;
}
</style>
