<template>
  <div class="wheel">
    <div :class="['wheel-body', { 'wheel-spinning': spinning }]">{{ speed }}</div>
    <button @click="toggleSpin">{{ spinning ? '停止' : '开始' }}旋转</button>
    <p>当前速度: {{ speed }}ms/圈</p>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useSubject } from '../hooks/subject';

const { addObserver, notify } = useSubject();

// 转盘状态
const speed = ref(100);
const spinning = ref(false);
let timer = null;

// 转盘样式（根据速度动态变化）
const wheelStyle = computed(() => ({
  transition: `transform ${speed.value * 2}ms ease-out`,
}));

// 开始/停止旋转
const toggleSpin = () => {
  spinning.value = !spinning.value;
  speed.value = 100;
  if (spinning.value) run();
  else clearTimeout(timer);
};

// 旋转逻辑
const run = () => {
  if (!spinning.value) return;

  timer = setTimeout(() => {
    notify({ speed: speed.value }); // 通知观察者当前速度
    run();
  }, speed.value);
};

// 组件卸载时清理
onUnmounted(() => clearTimeout(timer));

// 暴露接口供父组件注册观察者
defineExpose({ addObserver, speed, toggleSpin });
</script>

<style scoped>
.wheel-body {
  width: 100px;
  height: 100px;
  border: 4px solid #333;
  border-radius: 50%;
  background: conic-gradient(red, orange, yellow, green, blue);
  margin: 20px auto;

  display: flex;
  justify-content: center;
  align-items: center;
}

.wheel-spinning {
  animation: rotate linear infinite;
  animation-duration: v-bind('speed + "ms"'); /* 动态绑定动画速度 */
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
