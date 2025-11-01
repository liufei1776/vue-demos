<template>
  <div class="bpmn-modeler-container" ref="bpmn-modeler-container"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import type Canvas from 'diagram-js/lib/core/Canvas';
import { xmlStr } from './mock';
import customModule from './custom';

// 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

const modelerContainer = useTemplateRef<HTMLDivElement>('bpmn-modeler-container');
let modeler: BpmnModeler | null = null;

onMounted(async () => {
  if (!modelerContainer.value) return;
  modeler = new BpmnModeler({ container: modelerContainer.value, additionalModules: [customModule] });
  await modeler.importXML(xmlStr);
  const canvas = modeler.get<Canvas>('canvas');
  canvas.zoom('fit-viewport');
});

onBeforeUnmount(() => {
  modeler?.destroy();
  modeler = null;
});
</script>

<style scoped>
.bpmn-modeler-container {
  width: 100%;
  aspect-ratio: 2 / 1;
  border: 1px solid #ccc;
}
</style>
