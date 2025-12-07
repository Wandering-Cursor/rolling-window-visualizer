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

  // Export current store as a plain object
  const exportData = () => {
    return {
      periods: periods.value,
      windowSize: windowSize.value,
      allowance: allowance.value,
      anchorDate: anchorDate.value,
    }
  }

  // Import and replace state from a plain object (with validation)
  const importData = (data: any) => {
    if (!data || typeof data !== 'object') return false

    try {
      // Validate and assign periods
      if (Array.isArray(data.periods)) {
        const validPeriods: Period[] = data.periods
          .filter((p: any) => p && typeof p.start === 'string' && typeof p.end === 'string')
          .map((p: any) => ({ start: p.start, end: p.end }))
        periods.value = validPeriods
      }

      // Validate windowSize
      if (typeof data.windowSize === 'number' && isFinite(data.windowSize) && data.windowSize > 0) {
        windowSize.value = data.windowSize
      }

      // Validate allowance
      if (typeof data.allowance === 'number' && isFinite(data.allowance) && data.allowance >= 0) {
        allowance.value = data.allowance
      }

      // Validate anchorDate
      if (typeof data.anchorDate === 'string') {
        const d = new Date(data.anchorDate)
        if (!isNaN(d.getTime())) {
          anchorDate.value = d.toISOString()
        }
      }

      return true
    } catch (e) {
      console.error('Failed to import calendar data', e)
      return false
    }
  }

  return {
    periods,
    windowSize,
    allowance,
    anchorDate,
    addPeriod,
    removePeriod,
    setAnchorDate,
    exportData,
    importData,
  }
})
