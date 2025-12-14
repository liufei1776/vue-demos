<template>
  <VLDemo1 :data="data" :item-height="50" :container-height="200" />
</template>

<script setup lang="ts">
import VLDemo1 from './VLDemo1.vue';

const data = Array(100)
  .fill(1)
  .map((item, index) => item + index);
</script>
