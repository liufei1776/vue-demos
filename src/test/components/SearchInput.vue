<template>
  <input type="text" v-model="searchText" @input="handleInput" placeholder="搜索..." />
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const emits = defineEmits<{
    (e: 'search', value: string): void;
    (e: 'clear'): void;
  }>();

  const searchText = ref('');

  const handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    emits('search', value);
  };

  const clear = () => {
    searchText.value = '';
    emits('clear');
  };

  defineExpose({ clear });
</script>
