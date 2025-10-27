<template>
  <div class="app">
    <Wheel ref="wheelRef" />
    <SpeedController />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import Wheel from './components/Wheel.vue';
import SpeedController from './components/SpeedController.vue';

const wheelRef = ref(null);

// 提供修改速度的方法给子组件
const updateSpeed = (newSpeed) => {
  if (newSpeed === 0) {
    wheelRef.value.toggleSpin(); // 停止旋转
  } else {
    wheelRef.value.speed = newSpeed;
  }
};

// 依赖注入
provide('wheelRef', wheelRef);
provide('updateSpeed', updateSpeed);
</script>
