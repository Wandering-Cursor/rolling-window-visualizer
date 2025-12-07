import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'
import { Locales } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref(localStorage.getItem('locale') || 'en')

  function setLocale(newLocale: Locales) {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale);
    if (i18n.global.locale.value !== newLocale) {
      i18n.global.locale.value = newLocale;
    }
  }

  return { locale, setLocale }
})
