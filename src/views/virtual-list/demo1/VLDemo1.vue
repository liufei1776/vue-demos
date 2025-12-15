<template>
  <div
    class="scroll-container"
    ref="scroll-container"
    @scroll="handleScroll"
    :style="{
      '--container-height': containerHeight + 'px',
      '--item-height': itemHeight + 'px',
    }"
  >
    <div class="phantom"></div>
    <div class="content" :style="{ transform: `translateY(${startOffset}px)` }">
      <div v-for="item in renderedItems" :key="item" class="item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<{
    data: number[];
    itemHeight: number; // 每个项目的高度
    containerHeight: number; // 容器高度
    buffer?: number;
  }>(),
  {
    buffer: 2,
  },
);

const scrollContainer = useTemplateRef<HTMLDivElement>('scroll-container');
const scrollTop = ref(0); // 滚动距离

// 占位区域的总高度 = 总项数 * 每项高度
const phantomHeight = computed(() => `${props.data.length * props.itemHeight}px`);

// 可视区域能看到的项目数量
const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight));

// 【核心】根据滚动距离，计算项目的起始索引（从哪个item开始）
const startIndex = computed(() => {
  // 假设 scrollTop 是1250，item高度是50，那么是第25个item
  const index = Math.floor(scrollTop.value / props.itemHeight);
  // 算法 buffer，提前渲染一些，避免滚动时空白
  const start = index - props.buffer;
  // 处理边界值
  return Math.max(0, start);
});

// 【核心】同理，计算项目的结束索引
const endIndex = computed(() => {
  // 结束索引 =  buffer +  开始 + 可见数量 + buffer
  const end = startIndex.value + visibleCount.value + props.buffer * 2;
  // 边界值处理
  return Math.min(props.data.length, end);
});

// 【核心】：内容便宜量
const startOffset = computed(() => startIndex.value * props.itemHeight);

const renderedItems = computed(() => props.data.slice(startIndex.value, endIndex.value));

const handleScroll = () => {
  scrollTop.value = scrollContainer.value?.scrollTop ?? 0;
};
</script>

<style scoped>
.scroll-container {
  height: var(--container-height);
  border: 1px solid #e0e0e0;
  overflow-y: auto;
  position: relative;
}

.phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  height: v-bind('phantomHeight');
  background-color: aliceblue;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.item {
  box-sizing: border-box;
  height: var(--item-height);
  border-bottom: 1px solid #f0f0f0;
  background-color: bisque;

  display: flex;
  align-items: center;
  justify-content: center;
}

.item + .item {
  margin-top: 5px;
}
</style>
