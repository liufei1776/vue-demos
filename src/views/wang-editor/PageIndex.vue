<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorInstance"
      mode="simple"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
  <button @click="viewEditorInfo">查看editor信息</button>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import { ref, shallowRef, onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor';

const editorInstance = shallowRef<IDomEditor | null>(null);
const valueHtml = ref('');

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['undo', 'redo', 'fullScreen', 'codeBlock', 'image', 'insertVideo', 'uploadVideo'],
};
const editorConfig = { placeholder: '请输入内容' };

// 记录 editor 实例
const handleCreated = (editor: IDomEditor) => {
  editorInstance.value = editor;
  // console.log(editor.getAllMenuKeys()); // 查看所有
};

onBeforeUnmount(() => {
  editorInstance.value?.destroy();
  console.log('editor destroyed');
});

const viewEditorInfo = () => {
  console.log(editorInstance.value?.children);
  console.log(editorInstance.value?.getHtml());
  console.log(editorInstance.value?.getText());
  console.log(editorInstance.value?.getElemsByType('table'));
  console.log(editorInstance.value?.getElemsByType('table-cell'));
};
</script>
