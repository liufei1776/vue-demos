<template>
  <div class="ai-chat-container">
    <div class="message-box" ref="message-box">
      <ChatMessage v-for="(msg, index) in messages" :key="index" :role="msg.role" :content="msg.content" />
      <ChatMessage role="assistant" content="思考中..." v-if="loading" />
    </div>

    <form class="chat-ask" @submit.prevent="handleSubmit">
      <input name="ask-content" placeholder="请输入问题" autocomplete="off" v-model.trim="askContent" />
      <button type="submit">发送</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, useTemplateRef, nextTick, reactive } from 'vue';
  import ChatMessage from './ChatMessage.vue';

  interface Message {
    role: 'user' | 'assistant';
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

    // 现在拿到的是 流
    const reader = response.body?.getReader();
    if (!reader) {
      loading.value = false;
      return;
    }

    const botMessage = reactive<Message>({ role: 'assistant', content: '' });
    messages.value.push(botMessage);

    const decoder = new TextDecoder('utf-8');
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((item) => item.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            // 只要有数据了，就取消loading
            if (loading.value) {
              loading.value = false;
            }

            botMessage.content += data.response;
          }
        } catch {
          console.error('json解析失败');
        }
      }
    }

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
