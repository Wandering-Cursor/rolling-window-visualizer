<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h2>{{ t('home.explanationSection.title') }}</h2>
  <p v-for="value in t('home.explanationSection.description').split('\n')" :key="value">
    {{ value }}
  </p>
</template>

<style scoped></style>
