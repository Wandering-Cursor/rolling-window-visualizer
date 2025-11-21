<script setup lang="ts">
import CalendarSection from '@/components/Home/CalendarSection.vue'
import ExplanationSection from '@/components/Home/ExplanationSection.vue'
</script>

<template>
  <div class="vertical-container">
    <ExplanationSection />
    <CalendarSection />
  </div>
</template>

<style scoped>
.vertical-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
