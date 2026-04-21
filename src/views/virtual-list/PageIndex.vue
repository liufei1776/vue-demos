<template>
  <VLDemo1 :data="data" :item-height="30" :container-height="300" />
  <!-- <VLDemo2 :data="data" :esitmated-item-height="50" :container-height="200" /> -->
</template>

<script setup lang="ts">
  import VLDemo1 from './demo1/VLDemo1.vue';
  import { data } from './demo1/data';
  // import VLDemo2 from './demo2/VLDemo2.vue';
  // import { data } from './demo2/data';
</script>
