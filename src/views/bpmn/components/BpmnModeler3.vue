<template>
  <nav class="operations-bar">
    <span class="btn" @click="handleNew">新建</span>
    <label>
      <span class="btn">导入XML</span>
      <input type="file" accept=".bpmn,.xml" style="display: none" @change="handleImport" />
    </label>
    <span class="btn" @click="handleExportXML">导出XML</span>
    <span class="btn" @click="handleExportSVG">导出SVG</span>
  </nav>

  <div class="bpmn-canvas" ref="bpmn-canvas"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
import type Canvas from 'diagram-js/lib/core/Canvas';

// 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

const canvasRef = useTemplateRef<HTMLDivElement>('bpmn-canvas');
let modeler: Modeler | null = null;

const initModeler = async () => {
  if (!canvasRef.value) return;

  modeler = new Modeler({ container: canvasRef.value });
  await modeler.createDiagram();
  fitCanvas();
};

const destoryModeler = () => {
  modeler?.destroy();
  modeler = null;
};

const fitCanvas = () => {
  modeler?.get<Canvas>('canvas').zoom('fit-viewport');
};

/**
 * 新建画布
 */
const handleNew = () => {
  modeler?.createDiagram();
  fitCanvas();
};

/**
 * 导入 xml
 */
const handleImport = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const text = await file.text();
  await modeler?.importXML(text);
  fitCanvas();
};

/**
 * 基础函数 下载
 */
const download = (filename: string, data: string, mime: string) => {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  let a: HTMLAnchorElement | null = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  a = null;
  URL.revokeObjectURL(url);
};

/**
 * 导出 xml
 */
const handleExportXML = async () => {
  if (!modeler) return;
  const { xml } = await modeler.saveXML({ format: true });
  download('diagram.bpmn', xml as string, 'application/xml');
};

/**
 * 导出 SVG
 */
const handleExportSVG = async () => {
  if (!modeler) return;
  const { svg } = await modeler.saveSVG();
  download('diagram.svg', svg, 'image/svg+xml');
};

onMounted(() => {
  initModeler();
});

onBeforeUnmount(() => {
  destoryModeler();
});
</script>

<style scoped>
.operations-bar {
  height: 50px;
  padding: 0 10px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.btn {
  padding: 6px 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.bpmn-canvas {
  height: 600px;
  border: 1px solid #ccc;
}
</style>
