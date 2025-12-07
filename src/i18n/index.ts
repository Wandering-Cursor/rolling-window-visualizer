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
    },
    calendar: {
      windowSizeLabel: 'Window Size (days)',
      allowanceLabel: 'Allowance (days)',
      anchorDateLabel: 'Anchor Date',
      addPeriodButton: 'Add Period',
      exportButton: 'Export Data',
      importButton: 'Import Data',
      importFileLabel: 'Choose JSON File',
      invalidImportAlert: 'Invalid data format. Import failed.',
      usedLabel: 'Used',
      remainingLabel: 'Remaining',
      instructions: 'Left-click twice to select a period. Right-click period to remove. Right-click empty day to set Window Anchor.',
      weekDays: {
        0: 'Sun',
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat'
      },
      months: {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
      }
    }
  },
  [Locales.uk]: {
    title: 'Візуалізатор Змінного Вікна',
    language: 'Мова',
    home: {
      explanationSection: {
        title: 'Що це таке?',
        description: `Цей додаток дозволяє візуалізувати концепцію змінного вікна, що часто використовується в аналізі часових рядів та обробці даних.`
      }
    },
    calendar: {
      windowSizeLabel: 'Розмір Вікна (днів)',
      allowanceLabel: 'Макс. днів у періоді',
      anchorDateLabel: 'Опорна Дата',
      addPeriodButton: 'Додати Період',
      exportButton: 'Експортувати Дані',
      importButton: 'Імпортувати Дані',
      importFileLabel: 'Виберіть JSON Файл',
      invalidImportAlert: 'Невірний формат даних. Імпорт не вдався.',
      usedLabel: 'Використано',
      remainingLabel: 'Залишок',
      instructions: 'Лівий клік двічі, щоб вибрати період. Правий клік по періоду, щоб видалити. Правий клік по порожньому дню, щоб встановити опорну дату.',
      weekDays: {
        0: 'Нд',
        1: 'Пн',
        2: 'Вт',
        3: 'Ср',
        4: 'Чт',
        5: 'Пт',
        6: 'Сб'
      },
      months: {
        0: 'Січень',
        1: 'Лютий',
        2: 'Березень',
        3: 'Квітень',
        4: 'Травень',
        5: 'Червень',
        6: 'Липень',
        7: 'Серпень',
        8: 'Вересень',
        9: 'Жовтень',
        10: 'Листопад',
        11: 'Грудень'
      }
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
export { Locales, LanguageNames, LanguagePairs }
