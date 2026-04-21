<template>
  <div class="page-layout">
    <aside class="aside">
      <SideMenu />
    </aside>

    <section class="main">
      <header class="main-header"></header>
      <main class="main-body">
        <slot></slot>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
  import SideMenu from '@/components/menu/SideMenu.vue';
</script>

<style scoped>
  .page-layout {
    min-width: 800px;
    height: 100vh;
    display: flex;
  }

  .aside {
    flex: 0 0 200px;
    background-color: aliceblue;
  }

  .main {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
  }

  .main-header {
    flex: 0 0 64px;
    background-color: azure;
  }

  .main-body {
    flex: 1;
    min-height: 0;
    padding: 10px;
  }
</style>
