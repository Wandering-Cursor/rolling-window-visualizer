<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import { storeToRefs } from 'pinia'

interface CalendarDay {
  date: Date
  dayName: string
  dayNumber: number
  monthName: string
  year: number
  isoString: string
  isPeriod: boolean
  inWindow: boolean
  isInactive: boolean
  isSelectionStart: boolean
}

const days = ref<CalendarDay[]>([])
const containerRef = ref<HTMLElement | null>(null)
const lastGeneratedDate = ref<Date>(new Date())
const firstGeneratedDate = ref<Date>(new Date())

// Store
const calendarStore = useCalendarStore()
const { periods, windowSize, allowance, anchorDate: storeAnchorDate } = storeToRefs(calendarStore)

// Computed wrapper for anchorDate to work with Date objects locally
const anchorDate = computed({
  get: () => new Date(storeAnchorDate.value),
  set: (val: Date) => calendarStore.setAnchorDate(val),
})

// State
const selectionStart = ref<string | null>(null) // ISO string

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Stats
const daysUsed = computed(() => {
  // Calculate total days used within the active window
  const windowEnd = new Date(anchorDate.value)
  windowEnd.setHours(23, 59, 59, 999)

  const windowStart = new Date(windowEnd)
  windowStart.setDate(windowStart.getDate() - windowSize.value + 1)
  windowStart.setHours(0, 0, 0, 0)

  let count = 0

  // We need to calculate overlap between each period and the window
  periods.value.forEach((period) => {
    const pStart = new Date(period.start)
    const pEnd = new Date(period.end)

    // Intersection of [pStart, pEnd] and [windowStart, windowEnd]
    const start = pStart > windowStart ? pStart : windowStart
    const end = pEnd < windowEnd ? pEnd : windowEnd

    if (start <= end) {
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      count += diffDays
    }
  })

  return count
})

const daysRemaining = computed(() => allowance.value - daysUsed.value)

const getIsoDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isDateInPeriod = (isoDate: string) => {
  if (!isoDate) return false
  return periods.value.some((p) => isoDate >= p.start && isoDate <= p.end)
}

const updateDayStates = () => {
  const windowEnd = new Date(anchorDate.value)
  windowEnd.setHours(23, 59, 59, 999)

  const windowStart = new Date(windowEnd)
  windowStart.setDate(windowStart.getDate() - windowSize.value + 1)
  windowStart.setHours(0, 0, 0, 0)

  const wStartIso = getIsoDate(windowStart)
  const wEndIso = getIsoDate(windowEnd)

  days.value.forEach((day) => {
    const dayIso = getIsoDate(day.date)

    // Window Logic
    day.inWindow = dayIso >= wStartIso && dayIso <= wEndIso
    day.isInactive = !day.inWindow

    // Period Logic
    day.isPeriod = isDateInPeriod(dayIso)

    // Selection Logic
    day.isSelectionStart = selectionStart.value === dayIso
  })
}

// Watchers to update states when config changes
watch(
  [anchorDate, periods, selectionStart, windowSize],
  () => {
    updateDayStates()
  },
  { deep: true },
)

const createDayObject = (date: Date): CalendarDay => {
  const dayObj = {
    date: new Date(date),
    dayName: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
    dayNumber: date.getDate(),
    monthName: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
    year: date.getFullYear(),
    isoString: date.toISOString(),
    isPeriod: false,
    inWindow: false,
    isInactive: false,
    isSelectionStart: false,
  }

  // Apply initial state
  const dayIso = getIsoDate(dayObj.date)
  const windowEnd = new Date(anchorDate.value)
  const windowStart = new Date(windowEnd)
  windowStart.setDate(windowStart.getDate() - windowSize.value + 1)

  dayObj.inWindow = dayObj.date >= windowStart && dayObj.date <= windowEnd
  dayObj.isInactive = !dayObj.inWindow
  dayObj.isPeriod = isDateInPeriod(dayIso)

  return dayObj
}

const appendDays = (count: number) => {
  const tempDays: CalendarDay[] = []
  const currentDate = new Date(lastGeneratedDate.value)

  for (let i = 0; i < count; i++) {
    tempDays.push(createDayObject(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  days.value.push(...tempDays)
  lastGeneratedDate.value = currentDate
  updateDayStates() // Ensure consistency
}

const prependDays = async (count: number) => {
  if (!containerRef.value) return

  const tempDays: CalendarDay[] = []
  const currentDate = new Date(firstGeneratedDate.value)

  // Move back to the start of the new batch
  const startDate = new Date(currentDate)
  startDate.setDate(startDate.getDate() - count)

  const iteratorDate = new Date(startDate)

  for (let i = 0; i < count; i++) {
    tempDays.push(createDayObject(iteratorDate))
    iteratorDate.setDate(iteratorDate.getDate() + 1)
  }

  // Capture scroll height before update
  const oldScrollHeight = containerRef.value.scrollHeight
  const oldScrollTop = containerRef.value.scrollTop

  days.value.unshift(...tempDays)
  firstGeneratedDate.value = startDate
  updateDayStates() // Ensure consistency

  // Wait for DOM update to adjust scroll position
  await nextTick()

  if (containerRef.value) {
    const newScrollHeight = containerRef.value.scrollHeight
    const heightDifference = newScrollHeight - oldScrollHeight
    // Adjust scroll position to maintain visual stability
    containerRef.value.scrollTop = oldScrollTop + heightDifference
  }
}

const initCalendar = async () => {
  // Align start date to the previous Monday to ensure grid alignment
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const day = start.getDay() // 0=Sun, 1=Mon...
  // Calculate difference to get to Monday (1)
  // If Sun(0), diff is -6. If Mon(1), diff is 0. If Tue(2), diff is -1.
  const diff = day === 0 ? -6 : 1 - day

  const currentWeekStart = new Date(start)
  currentWeekStart.setDate(start.getDate() + diff)

  // Start 3 weeks before the current week
  const pastWeeks = 3
  const startDate = new Date(currentWeekStart)
  startDate.setDate(startDate.getDate() - pastWeeks * 7)

  lastGeneratedDate.value = new Date(startDate)
  firstGeneratedDate.value = new Date(startDate)

  // Generate past weeks + initial 3 months (approx 90 days)
  appendDays(pastWeeks * 7 + 90)

  await nextTick()

  // Scroll to the current week
  if (containerRef.value) {
    // The current week starts after the past weeks
    // pastWeeks * 7 is the index of the first day of the current week
    const currentWeekIndex = pastWeeks * 7
    const dayElements = containerRef.value.children

    if (dayElements.length > currentWeekIndex) {
      const targetElement = dayElements[currentWeekIndex] as HTMLElement
      // Use scrollIntoView to jump to the current week
      targetElement.scrollIntoView({ block: 'start' })
    }
  }
}

const handleDayClick = (day: CalendarDay) => {
  const dayIso = getIsoDate(day.date)
  if (!dayIso) return

  if (selectionStart.value) {
    // Complete selection
    const start = selectionStart.value
    const end = dayIso

    // Ensure start <= end
    const newPeriod = start <= end ? { start, end } : { start: end, end: start }

    calendarStore.addPeriod(newPeriod)

    selectionStart.value = null
  } else {
    // Start selection
    selectionStart.value = dayIso
  }
}

const handleDayRightClick = (e: MouseEvent, day: CalendarDay) => {
  e.preventDefault()
  const dayIso = getIsoDate(day.date)
  if (!dayIso) return

  // Check if clicking on a period
  const periodIndex = periods.value.findIndex((p) => dayIso >= p.start && dayIso <= p.end)

  if (periodIndex !== -1) {
    // Remove period
    calendarStore.removePeriod(periodIndex)
  } else {
    // Set anchor date
    anchorDate.value = new Date(day.date)
  }
}

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement

  // Check if scrolled near bottom (within 100px)
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
    appendDays(28) // Generate 4 more weeks
  }

  // Check if scrolled near top (within 50px)
  if (target.scrollTop < 50) {
    prependDays(28) // Generate 4 previous weeks
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!containerRef.value) return

  const scrollAmount = 100

  if (e.key === 'ArrowDown') {
    containerRef.value.scrollBy({ top: scrollAmount, behavior: 'smooth' })
    e.preventDefault()
  } else if (e.key === 'ArrowUp') {
    containerRef.value.scrollBy({ top: -scrollAmount, behavior: 'smooth' })
    e.preventDefault()
  }
}

onMounted(() => {
  initCalendar()
})
</script>

<template>
  <div class="calendar-wrapper">
    <div class="controls">
      <div class="control-group">
        <label>Window Size (days):</label>
        <input type="number" v-model="windowSize" />
      </div>
      <div class="control-group">
        <label>Allowance (days):</label>
        <input type="number" v-model="allowance" />
      </div>
      <div class="stats">
        <div class="stat-item">
          <span class="label">Used:</span>
          <span class="value">{{ daysUsed }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Remaining:</span>
          <span class="value" :class="{ 'text-danger': daysRemaining < 0 }">{{
            daysRemaining
          }}</span>
        </div>
      </div>
    </div>

    <div class="week-header">
      <div v-for="day in weekDays" :key="day" class="header-cell">{{ day }}</div>
    </div>
    <div
      class="calendar-container"
      ref="containerRef"
      tabindex="0"
      @keydown="handleKeydown"
      @scroll="handleScroll"
    >
      <div
        v-for="(day, index) in days"
        :key="day.isoString"
        class="calendar-day"
        :class="{
          'is-period': day.isPeriod,
          'in-window': day.inWindow,
          'is-inactive': day.isInactive,
          'selection-start': day.isSelectionStart,
          'is-today': day.date.toDateString() == new Date().toDateString(),
        }"
        @click="handleDayClick(day)"
        @contextmenu="(e) => handleDayRightClick(e, day)"
      >
        <div class="day-content">
          <span class="month-label" v-if="day.dayNumber === 1 || index === 0">{{
            day.monthName
          }}</span>
          <span class="day-number">{{ day.dayNumber }}</span>
        </div>
      </div>
    </div>
    <div class="instructions">
      <small
        >Left-click twice to select a period. Right-click period to remove. Right-click empty day to
        set Window Anchor.</small
      >
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 800px;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group input {
  width: 60px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-left: auto;
}

.stat-item {
  font-weight: bold;
}

.text-danger {
  color: #dc3545;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
  color: #555;
}

.calendar-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  overflow-y: auto;
  padding: 10px;
  flex-grow: 1;
  outline: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.calendar-container:focus {
  border-color: #666;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.calendar-day {
  aspect-ratio: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border: 1px solid transparent;
}

/* Inactive (Outside Window) */
.calendar-day.is-inactive {
  background-color: #e9ecef;
  color: #adb5bd;
  opacity: 0.7;
}

/* In Window (Active) */
.calendar-day.in-window {
  background-color: rgba(40, 167, 69, 0.1); /* Light green tint */
}

/* Selected Period */
.calendar-day.is-period {
  background-color: #007bff !important;
  color: white;
  border-color: #0056b3;
}

/* Selection Start (Pending) */
.calendar-day.selection-start {
  border: 2px dashed #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

/* Today */
.calendar-day.is-today {
  border: 2px solid #28a745;
}

.calendar-day:hover {
  transform: scale(1.02);
  z-index: 1;
}

.calendar-day::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.calendar-day:hover::after {
  opacity: 1;
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.month-label {
  font-size: 0.7rem;
  color: #dc3545;
  font-weight: bold;
  position: absolute;
  top: 4px;
  left: 6px;
}

.day-number {
  font-size: 1.2rem;
  font-weight: 500;
  color: inherit;
}

.instructions {
  margin-top: 10px;
  text-align: center;
  color: #666;
}
</style>
