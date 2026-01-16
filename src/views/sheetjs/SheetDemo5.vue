<template>
  <div>在这里你将学习 sheetjs </div>
  <button @click="fetchExcel">从远程获取数据并输出</button>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';

const readAsExcel = async (data: ArrayBuffer) => {
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(rawData);
};

const fetchExcel = async () => {
  const url = 'https://docs.sheetjs.com/PortfolioSummary.xls';
  const res = await fetch(url);
  const data = await res.arrayBuffer();

  readAsExcel(data);
};
</script>
