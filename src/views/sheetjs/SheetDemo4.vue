<template>
  <div>在这里你将学习 sheetjs </div>
  <button @click="exportExcel">点击下载</button>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';

const exportExcel = () => {
  // 1. 准备数据
  const data = [
    { name: '张三', age: 25, city: '北京' },
    { name: '李四', age: 30, city: '上海' },
  ];

  // 2. 创建 Worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 改变 B2 的 显示
  if (worksheet['B2']) {
    worksheet['B2'].z = '0"岁"';
  }

  // 设置列宽 (wch 代表 character width，大概是一个字符的宽度)
  worksheet['!cols'] = [
    { wch: 10 }, // 第一列 (A列) 宽度
    { wch: 30 }, // 第二列 (B列) 宽度
    { wch: 20 }, // 第三列 (C列) 宽度
  ];

  // 3. 创建 Workbook，并把 Worksheet 放入其中
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '用户列表');

  // 4. 导出文件
  XLSX.writeFile(workbook, 'UserInfo.xlsx');
};
</script>
