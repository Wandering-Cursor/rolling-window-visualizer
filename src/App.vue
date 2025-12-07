<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
</script>

<template>
  <div class="app">
    <MainHeader class="item" />
    <RouterView class="item" />
  </div>
</template>

<style scoped>
.item {
  padding: 1rem;
}
</style>
