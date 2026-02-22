<template>
  <div class="card">
    <slot :user="user" :is-logged-in="isLoggedIn"></slot>
  </div>
</template>

<script setup lang="ts">
  const user = { name: 'xiaoming', age: 25 };
  const isLoggedIn = true;
</script>
