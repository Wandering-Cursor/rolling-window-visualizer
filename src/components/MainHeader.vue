<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import { Locales, LanguagePairs } from '@/i18n'

const { t } = useI18n()
const localeStore = useLocaleStore()

const currentLocale = computed({
  get: () => localeStore.locale,
  set: (value) => localeStore.setLocale(value as Locales),
})
</script>

<template>
  <header class="header">
    <h1>{{ t('title') }}</h1>
    <div class="language-switcher">
      <label for="locale-select">{{ t('language') }}: </label>
      <select id="locale-select" v-model="currentLocale">
        <option :value="key" v-for="(value, key) in LanguagePairs" :key="key">{{ value }}</option>
      </select>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #bbb;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
