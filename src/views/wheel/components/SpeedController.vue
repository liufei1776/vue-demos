<script setup>
import { onMounted, inject } from 'vue';

// 观察者实现
const observer = {
  update(payload) {
    if (payload.speed < 1000) {
      // 修改父组件的速度（需通过 inject 获取方法）
      updateSpeed(payload.speed + 100);
    } else {
      updateSpeed(0); // 停止
    }
  },
};

// 通过依赖注入获取父组件方法
const updateSpeed = inject('updateSpeed');

// 注册到转盘组件
const wheelRef = inject('wheelRef');
onMounted(() => {
  wheelRef.value.addObserver(observer);
});
</script>

<template><!-- 纯逻辑组件，无模板 --></template>
