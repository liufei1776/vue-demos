<template>
  <div>在这里你将学习 sheetjs </div>
  <input type="file" hidden ref="input-file" />
  <button @click="importExcel">点击上传Excel</button>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as XLSX from 'xlsx';

const inputFileRef = useTemplateRef<HTMLInputElement>('input-file');

const readAsExcel = async () => {
  const file = inputFileRef.value?.files?.[0];
  if (!file) return; // 用户去取消了选择

  const data = await file.arrayBuffer(); // arrayBuffer 是 blob 的一个方法
  const workbook = XLSX.read(data, { type: 'array' });

  // 拿到 workbook 后，通常我们会读取第一个表
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // 关键一步：转回前端熟悉的 JSON
  const jsonRes = XLSX.utils.sheet_to_json(worksheet, {
    header: ['name', 'age', 'city'],
    range: 1,
  });
  console.log(jsonRes);
};

const importExcel = () => {
  inputFileRef.value?.click();
  inputFileRef.value?.addEventListener('change', readAsExcel, { once: true });
};
</script>
