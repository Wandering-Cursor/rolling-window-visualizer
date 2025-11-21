import { createI18n } from 'vue-i18n'

enum Locales {
  en = 'en',
  uk = 'uk'
}

enum LanguageNames {
  en = 'English',
  uk = 'Українська'
}

const LanguagePairs = {
  [Locales.en]: LanguageNames.en,
  [Locales.uk]: LanguageNames.uk
}

const messages = {
  [Locales.en]: {
    title: 'Rolling Window Visualizer',
    language: 'Language',
    home: {
      explanationSection: {
        title: 'What is this?',
        description: `This application allows you to visualize the concept of a rolling window, commonly used in time series analysis and data processing.`
      }
    }
  },
  [Locales.uk]: {
    title: 'Візуалізатор Змінного Вікна',
    language: 'Мова'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
export { Locales, LanguageNames, LanguagePairs }
