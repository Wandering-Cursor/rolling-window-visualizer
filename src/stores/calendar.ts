import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

interface Period {
  start: string // ISO string YYYY-MM-DD
  end: string   // ISO string YYYY-MM-DD
}

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const periods = ref<Period[]>([])
  const windowSize = ref(180)
  const allowance = ref(90)
  const anchorDate = ref<string>(new Date().toISOString()) // Store as ISO string

  // Load from localStorage
  const init = () => {
    const stored = localStorage.getItem('calendar-store')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.periods) periods.value = data.periods
        if (data.windowSize) windowSize.value = data.windowSize
        if (data.allowance) allowance.value = data.allowance
        if (data.anchorDate) anchorDate.value = data.anchorDate
      } catch (e) {
        console.error('Failed to parse calendar store', e)
      }
    }
  }

  // Initialize immediately
  init()

  // Watch and Save
  watch(
    [periods, windowSize, allowance, anchorDate],
    () => {
      localStorage.setItem(
        'calendar-store',
        JSON.stringify({
          periods: periods.value,
          windowSize: windowSize.value,
          allowance: allowance.value,
          anchorDate: anchorDate.value,
        })
      )
    },
    { deep: true }
  )

  // Actions
  const addPeriod = (period: Period) => {
    periods.value.push(period)
  }

  const removePeriod = (index: number) => {
    periods.value.splice(index, 1)
  }

  const setAnchorDate = (date: Date) => {
    anchorDate.value = date.toISOString()
  }

  return {
    periods,
    windowSize,
    allowance,
    anchorDate,
    addPeriod,
    removePeriod,
    setAnchorDate
  }
})
