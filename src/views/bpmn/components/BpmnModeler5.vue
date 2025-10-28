<template>
  <div class="bpmn-modeler-container" ref="bpmn-modeler-container"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import type EventBus from 'diagram-js/lib/core/EventBus';
import { xmlStr } from './mock';

// 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

const modelerContainer = useTemplateRef<HTMLDivElement>('bpmn-modeler-container');
let modeler: BpmnModeler | null = null;

const initEventBus = () => {
  if (!modeler) return;
  const events = ['element.click', 'element.changed'];
  const eventBus = modeler.get<EventBus>('eventBus');

  events.forEach((event) => {
    eventBus.on(event, (e: any) => {
      if (e.element.type === 'bpmn:Process') return; // 根元素是bpmn:Process
      console.log(e.type);

      const elementRegistry = modeler!.get<ElementRegistry>('elementRegistry');
      const shape = elementRegistry.get(e.element.id); // 传递id进去
      console.log(shape);
    });
  });
};

const fitCanvas = () => {
  if (!modeler) return;
  modeler.get<Canvas>('canvas').zoom('fit-viewport');
};

const initModeler = async () => {
  if (!modelerContainer.value) return;
  modeler = new BpmnModeler({ container: modelerContainer.value });
  await modeler.importXML(xmlStr);

  initEventBus();
  fitCanvas();
};

onMounted(() => {
  initModeler();
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
