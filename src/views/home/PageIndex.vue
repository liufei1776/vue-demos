<template>
  <div>
    <header>{{ t('header') }}</header>
    <p>{{ t('main', 10) }}</p>
    <p>{{ d(new Date(), 'short', 'en') }}</p>
    <footer>{{ t('footer') }}</footer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t, d } = useI18n();
</script>
