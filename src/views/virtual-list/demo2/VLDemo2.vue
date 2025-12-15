<template>
  <div
    class="scroll-container"
    ref="scroll-container"
    @scroll="handleScroll"
    :style="{
      '--container-height': containerHeight + 'px',
      '--phantom-height': phantomHeight + 'px',
    }"
  >
    <div class="phantom"></div>
    <div class="content" :style="{ transform: `translateY(${startOffset}px)` }">
      <div v-for="item in renderedItems" :key="item.id" class="item" :data-index="item._index" ref="item-elems">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef, onMounted, nextTick, onUpdated } from 'vue';
import type { Position } from './types';

const props = withDefaults(
  defineProps<{
    data: Array<{ id: number; content: string }>;
    esitmatedItemHeight: number; // 每个项目的预估高度
    containerHeight: number; // 容器高度
    buffer?: number;
  }>(),
  {
    buffer: 0,
  },
);

const scrollContainer = useTemplateRef<HTMLDivElement>('scroll-container');
const itemElems = useTemplateRef<HTMLDivElement[]>('item-elems');

const scrollTop = ref(0);

// 位置缓存
const positions = ref<Position[]>([]);

// 1. 初始化位置缓存
const initPositions = () => {
  positions.value = props.data.map((_, index) => ({
    index,
    height: props.esitmatedItemHeight,
    top: index * props.esitmatedItemHeight,
    bottom: (index + 1) * props.esitmatedItemHeight,
  }));
};

// 2. 计算占位区域总高度
const phantomHeight = computed(() => {
  if (!positions.value.length) return 0;
  // 最后一个项目的bottom就是总高度
  return positions.value[positions.value.length - 1].bottom;
});

// 3. 二分查找找到起始索引
const binarySearch = (scrollTop: number) => {
  let left = 0,
    right = positions.value.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midBottom = positions.value[mid].bottom;

    if (midBottom === scrollTop) {
      return mid + 1; // 正好在边界，从下一个开始
    } else if (midBottom < scrollTop) {
      left = mid + 1; // 向右找
    } else {
      right = mid - 1; // 向左找
    }
  }

  return left;
};

// 4. 获取起始索引（考虑buffer）
const getStartIndex = (scrollTop: number) => {
  const index = binarySearch(scrollTop);
  return Math.max(0, index - props.buffer);
};

// 5. 获取结束索引
const getEndIndex = (startIndex: number) => {
  // 需要计算容器能显示多少项
  // 由于高度不固定，我们用预估高度估算
  const estimatedVisibleCount = Math.ceil(props.containerHeight / props.esitmatedItemHeight);
  const endIndex = startIndex + estimatedVisibleCount + props.buffer * 2;
  return Math.min(props.data.length, endIndex);
};

// 6. 计算实际渲染的项目
const renderedItems = computed(() => {
  const start = getStartIndex(scrollTop.value);
  const end = getEndIndex(start);
  return props.data.slice(start, end).map((item, i) => ({
    ...item,
    _index: start + i, // 记录原始索引
  }));
});

// 7. 计算偏移量
const startOffset = computed(() => {
  const startIndex = getStartIndex(scrollTop.value);
  if (startIndex <= 0) return 0;

  // 起始偏移 = 起始项目前一个项目的bottom
  return positions.value[startIndex - 1].bottom;
});

// 8. 渲染后更新位置
const updatePositions = async () => {
  await nextTick();
  if (!itemElems.value) return;

  itemElems.value.forEach((el: HTMLDivElement) => {
    const index = Number.parseInt(el.dataset.index!);
    const realHeight = el.offsetHeight;

    if (positions.value[index] && positions.value[index].height !== realHeight) {
      // 1. 更新当前项目
      positions.value[index].height = realHeight;
      positions.value[index].bottom = positions.value[index].top + realHeight;

      // 2. 更新后续所有项目的位置
      for (let i = index + 1; i < positions.value.length; i++) {
        positions.value[i].top = positions.value[i - 1].bottom;
        positions.value[i].bottom = positions.value[i].top + positions.value[i].height;
      }
    }
  });
};

const handleScroll = () => {
  scrollTop.value = scrollContainer.value?.scrollTop ?? 0;
};

onMounted(() => {
  initPositions();
});

onUpdated(() => {
  // 组件更新后更新位置
  if (props.data.length !== positions.value.length) {
    initPositions();
  }

  updatePositions();
});
</script>

<style scoped>
.scroll-container {
  width: 300px;
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
  height: var(--phantom-height);
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
  border-bottom: 1px solid #f0f0f0;
  background-color: bisque;

  display: flex;
  align-items: center;
}

.item + .item {
  margin-top: 5px;
}
</style>
