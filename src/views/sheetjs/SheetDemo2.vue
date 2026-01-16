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

  // 2. 创建 Worksheet, 但自定义表头
  // const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: true, origin: 'A2' }); // 1. 跳过英文表头
  // XLSX.utils.sheet_add_aoa(worksheet, [['姓名', '年龄', '城市']], { origin: 'A1' }); // 2. 在 A1 位置插入中文表头

  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.sheet_add_aoa(worksheet, [['姓名', '年龄', '城市']], { origin: 'A1' });

  // 3. 创建 Workbook，并把 Worksheet 放入其中
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '用户列表');

  // 4. 导出文件
  XLSX.writeFile(workbook, 'UserInfo.xlsx');
};
</script>
