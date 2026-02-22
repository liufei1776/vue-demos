<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" name="username" v-model="username" />
    <input type="password" name="password" v-model="password" />
    <button type="submit">登录</button>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const emits = defineEmits<{
    (e: 'login', payload: { username: string; password: string }): void;
  }>();

  const username = ref('');
  const password = ref('');

  const handleSubmit = () => {
    if (username.value && password.value) {
      emits('login', { username: username.value, password: password.value });
    }
  };
</script>
