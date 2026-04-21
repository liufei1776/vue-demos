<template>
  <div class="chat-message" :class="{ user: role === 'user', bot: role === 'bot' }">
    <div class="chat-message__content">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    role: 'user' | 'bot';
    content: string;
  }>();
</script>

<style scoped>
  .chat-message {
    display: flex;
  }

  .chat-message + .chat-message {
    margin-top: 20px;
  }

  .chat-message.user {
    justify-content: flex-end;
  }

  .chat-message.role {
    justify-content: flex-start;
  }

  .chat-message__content {
    max-width: 60%;
    padding: 10px;
    background-color: aliceblue;
    border-radius: 8px;
    font-size: 14px;
  }

  .chat-message.bot .chat-message__content {
    background-color: rgb(240, 249, 235);
  }
</style>
