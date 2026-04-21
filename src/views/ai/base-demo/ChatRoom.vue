<template>
  <div class="ai-chat-container">
    <div class="message-box" ref="message-box">
      <ChatMessage v-for="(msg, index) in messages" :key="index" :role="msg.role" :content="msg.content" />
      <ChatMessage role="bot" content="思考中..." v-if="loading" />
    </div>

    <form class="chat-ask" @submit.prevent="handleSubmit">
      <input name="ask-content" placeholder="请输入问题" autocomplete="off" v-model.trim="askContent" />
      <button type="submit">发送</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, useTemplateRef, nextTick } from 'vue';
  import ChatMessage from './ChatMessage.vue';

  interface Message {
    role: 'user' | 'bot';
    content: string;
  }

  const askContent = ref('');
  const messages = ref<Message[]>([]); // 用户问题 和 模型回答内容
  const loading = ref(false); // 等待模型输出
  const messageBox = useTemplateRef<HTMLDivElement>('message-box');

  const scrollToBottom = () => {
    messageBox.value?.scrollTo({
      top: messageBox.value?.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async () => {
    if (!askContent.value) return;

    const question = askContent.value;
    // 用户问题 插入到 messages 中
    messages.value.push({ role: 'user', content: question });

    askContent.value = ''; // 清空问题
    loading.value = true;

    await nextTick(); // DOM最新状态
    scrollToBottom();

    // 发送问题
    const response = await fetch('/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    // 将模型回复内容也放入messages中
    messages.value.push({ role: 'bot', content: data.answer });

    loading.value = false;

    await nextTick();
    scrollToBottom();
  };
</script>

<style scoped>
  .ai-chat-container {
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message-box {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .chat-ask {
    height: 50px;
    padding: 0 10px;
    background-color: aliceblue;

    display: flex;
    align-items: center;
    gap: 20px;
  }

  .chat-ask > input[name='ask-content'] {
    flex: 1;
    min-width: 0;

    box-sizing: border-box;
    padding: 0 10px;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .chat-ask > button {
    flex: 0 0 auto;
    margin-left: auto;

    height: 40px;
    width: 50px;
    background-color: #1777ff;
    border: none;
    border-radius: 4px;

    color: white;
    font-size: 16px;
  }
</style>
