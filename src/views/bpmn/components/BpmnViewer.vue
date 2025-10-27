<template>
  <div class="bpmn-viewer-container" ref="bpmn-viewer-container"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import BpmnViewer from 'bpmn-js/lib/viewer';
import type Canvas from 'diagram-js/lib/core/Canvas';
import { xmlStr } from './mock';

const viewerContainer = useTemplateRef<HTMLDivElement>('bpmn-viewer-container');
let viewer: BpmnViewer | null = null;

onMounted(async () => {
  if (!viewerContainer.value) return;
  viewer = new BpmnViewer({ container: viewerContainer.value });
  await viewer.importXML(xmlStr);
  const canvas = viewer.get<Canvas>('canvas');
  canvas.zoom('fit-viewport');
});

onBeforeUnmount(() => {
  viewer?.destroy();
  viewer = null;
});
</script>

<style scoped>
.bpmn-viewer-container {
  width: 100%;
  aspect-ratio: 2 / 1;
  border: 1px solid #ccc;
}
</style>
