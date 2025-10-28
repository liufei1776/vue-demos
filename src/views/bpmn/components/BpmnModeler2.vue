<template>
  <div class="container">
    <div class="canvas" ref="canvas"></div>
    <div class="prop-panel" id="prop-panel"></div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
import type Canvas from 'diagram-js/lib/core/Canvas';
// @ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';

// 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
// 加入属性控制面板的样式
import '@bpmn-io/properties-panel/assets/properties-panel.css';

const canvasRef = useTemplateRef<HTMLDivElement>('canvas');
let modeler: Modeler | null = null;

const initModeler = async () => {
  if (!canvasRef.value) return;

  modeler = new Modeler({
    container: canvasRef.value,
    // 添加控制板
    propertiesPanel: {
      parent: '#prop-panel',
    },
    additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
  });

  await modeler.createDiagram(); // 创建一个空图表

  // 创建画布
  const canvas = modeler.get<Canvas>('canvas');
  canvas.zoom('fit-viewport');
};

const destoryModeler = () => {
  modeler?.destroy();
  modeler = null;
};

onMounted(() => {
  initModeler();
});
onBeforeUnmount(() => {
  destoryModeler();
});
</script>

<style scoped>
.container {
  height: 600px;
  position: relative;
  border: 1px solid #ccc;
}

.canvas {
  width: 100%;
  height: 100%;
}

.prop-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>
