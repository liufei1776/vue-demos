<template>
  <button :class="{ 'is-disabled': disabled }" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: 'click'): void;
}>();

const handleClick = () => {
  if (!props.disabled) emits('click');
};
</script>
