<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { initialEvents, type CalendarEvent } from '@/data/calendarMock';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Trash2,
  Calendar as CalendarIcon
} from 'lucide-vue-next';

// State
const events = ref<CalendarEvent[]>([]);
const searchQuery = ref('');
const activeTab = ref('all');
const searchInputRef = ref<HTMLInputElement | null>(null);

// Modal visibility state
const showAddModal = ref(false);
const showEditModal = ref(false);
const showMoreModal = ref(false);

// Date state
const currentViewDate = ref(new Date(2027, 0, 8)); // Defaults to January 2027 (mockup style)
const selectedDate = ref(new Date(2027, 0, 8));    // Defaults to January 8, 2027

// Modal contexts
const moreEventsDay = ref<any>(null);
const eventForm = ref({
  id: '',
  title: '',
  date: '',
  time: '',
  category: 'work' as CalendarEvent['category'],
  sharing: 'shared' as CalendarEvent['sharing'],
  description: ''
});
const eventTime24 = ref('09:00');

// Load events from LocalStorage
onMounted(() => {
  const stored = localStorage.getItem('rakansales_calendar_events');
  if (stored) {
    try {
      events.value = JSON.parse(stored);
    } catch (e) {
      events.value = [...initialEvents];
    }
  } else {
    events.value = [...initialEvents];
    saveEventsToStorage();
  }
  
  // Register Cmd+K / Ctrl+K search hotkey
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

// Storage saver
function saveEventsToStorage() {
  localStorage.setItem('rakansales_calendar_events', JSON.stringify(events.value));
}

// Global Search keyboard listener
function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    focusSearch();
  }
}

function focusSearch() {
  if (searchInputRef.value) {
    searchInputRef.value.focus();
    searchInputRef.value.select();
  }
}

// Traversal Helpers
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = computed(() => currentViewDate.value.getFullYear());
const currentMonth = computed(() => currentViewDate.value.getMonth());

const monthLabel = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`;
});

const weekLabel = computed(() => {
  const date = selectedDate.value;
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  // Adjust dayOfWeek (Sunday=0 -> Offset=6, Monday=1 -> Offset=0, etc.)
  const adjustedOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const day = date.getDate();
  const weekNumber = Math.ceil((day + adjustedOffset) / 7);
  return `Week ${weekNumber}`;
});

const dateRangeLabel = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startMonthAbbr = monthNames[month].substring(0, 3);
  return `${startMonthAbbr} 1, ${year} – ${startMonthAbbr} ${lastDay}, ${year}`;
});

const selectedDateMonthAbbr = computed(() => {
  const month = selectedDate.value.getMonth();
  return monthNames[month].substring(0, 3).toUpperCase();
});

const selectedDateDayNumber = computed(() => {
  return selectedDate.value.getDate();
});

// Month navigation
function navigateMonth(direction: number) {
  const current = currentViewDate.value;
  const newDate = new Date(current.getFullYear(), current.getMonth() + direction, 1);
  currentViewDate.value = newDate;
  
  // Set selected date to 1st of that month
  selectedDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
}

function goToToday() {
  const today = new Date();
  currentViewDate.value = today;
  selectedDate.value = today;
}

function selectDay(day: CalendarDay) {
  selectedDate.value = day.date;
  if (!day.isCurrentMonth) {
    currentViewDate.value = day.date;
  }
}

// Filtering
function matchesFilters(evt: CalendarEvent): boolean {
  if (activeTab.value === 'shared' && evt.sharing !== 'shared') return false;
  if (activeTab.value === 'public' && evt.sharing !== 'public') return false;
  if (activeTab.value === 'archived' && evt.sharing !== 'archived') return false;
  
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase();
    const titleMatch = evt.title.toLowerCase().includes(q);
    const descMatch = evt.description?.toLowerCase().includes(q) || false;
    return titleMatch || descMatch;
  }
  return true;
}

// Time sorting & conversions
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

function sortEventsByTime(evtList: CalendarEvent[]): CalendarEvent[] {
  return [...evtList].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
}

function convert24toAMPM(time24: string): string {
  if (!time24) return '09:00 AM';
  const parts = time24.split(':');
  let hours = parseInt(parts[0]);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

function convertAMPMto24(timeAMPM: string): string {
  if (!timeAMPM) return '09:00';
  const match = timeAMPM.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '09:05';
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

function formatEventTimeShort(timeStr: string): string {
  // Returns e.g. "9:00 AM" -> "9:00 AM"
  return timeStr;
}

// Calendar day builder
interface CalendarDay {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
}

function formatDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function createDayObject(d: Date, isCurrentMonth: boolean): CalendarDay {
  const dateStr = formatDateString(d);
  const isSelected = dateStr === formatDateString(selectedDate.value);
  
  const filteredEvents = events.value.filter(evt => {
    return evt.date === dateStr && matchesFilters(evt);
  });
  
  return {
    date: d,
    dateString: dateStr,
    dayNumber: d.getDate(),
    isCurrentMonth,
    isToday: dateStr === formatDateString(new Date()),
    isSelected,
    events: sortEventsByTime(filteredEvents)
  };
}

const calendarDays = computed(() => {
  const days: CalendarDay[] = [];
  const year = currentYear.value;
  const month = currentMonth.value;
  
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  // Convert Sunday=0 -> 6 index, Mon=1 -> 0 index, etc.
  const daysBefore = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // trailing previous month days
  for (let i = daysBefore; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push(createDayObject(d, false));
  }
  
  // current month days
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push(createDayObject(d, true));
  }
  
  // leading next month days
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push(createDayObject(d, false));
  }
  
  return days;
});

// Category classes mapping
function getCategoryClasses(cat: CalendarEvent['category']): string {
  switch (cat) {
    case 'work':
      return 'bg-pink-50 text-pink-700 border-pink-500 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-850';
    case 'personal':
      return 'bg-emerald-50 text-emerald-700 border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-850';
    case 'design':
      return 'bg-blue-50 text-blue-700 border-blue-500 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-850';
    case 'marketing':
      return 'bg-purple-50 text-purple-700 border-purple-500 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-850';
    case 'client':
      return 'bg-orange-50 text-orange-700 border-orange-500 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-850';
    case 'team':
    default:
      return 'bg-gray-50 text-gray-700 border-gray-400 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-600';
  }
}

// Modal actions
function openAddModal(dateStr?: string) {
  const d = dateStr || formatDateString(selectedDate.value);
  eventForm.value = {
    id: '',
    title: '',
    date: d,
    time: '09:00 AM',
    category: 'work',
    sharing: 'shared',
    description: ''
  };
  eventTime24.value = '09:00';
  showAddModal.value = true;
}

function handleAddEvent() {
  if (!eventForm.value.title.trim()) return;
  
  const newEvent: CalendarEvent = {
    id: 'evt-' + Date.now(),
    title: eventForm.value.title,
    date: eventForm.value.date,
    time: convert24toAMPM(eventTime24.value),
    category: eventForm.value.category,
    sharing: eventForm.value.sharing,
    description: eventForm.value.description
  };
  
  events.value.push(newEvent);
  saveEventsToStorage();
  showAddModal.value = false;
}

function openEditModal(evt: CalendarEvent) {
  eventForm.value = {
    id: evt.id,
    title: evt.title,
    date: evt.date,
    time: evt.time,
    category: evt.category,
    sharing: evt.sharing,
    description: evt.description || ''
  };
  eventTime24.value = convertAMPMto24(evt.time);
  showEditModal.value = true;
}

function handleUpdateEvent() {
  const index = events.value.findIndex(e => e.id === eventForm.value.id);
  if (index !== -1) {
    events.value[index] = {
      ...events.value[index],
      title: eventForm.value.title,
      date: eventForm.value.date,
      time: convert24toAMPM(eventTime24.value),
      category: eventForm.value.category,
      sharing: eventForm.value.sharing,
      description: eventForm.value.description
    };
    saveEventsToStorage();
  }
  showEditModal.value = false;
}

function handleDeleteEvent() {
  events.value = events.value.filter(e => e.id !== eventForm.value.id);
  saveEventsToStorage();
  showEditModal.value = false;
}

function openMoreModal(day: CalendarDay) {
  moreEventsDay.value = day;
  showMoreModal.value = true;
}

function handleMoreEventClick(evt: CalendarEvent) {
  showMoreModal.value = false;
  openEditModal(evt);
}

function formatDateFriendly(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const y = parseInt(parts[0]);
  const m = parseInt(parts[1]) - 1;
  const d = parseInt(parts[2]);
  const date = new Date(y, m, d);
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Search Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Calendar</h1>
      </div>
      <!-- Search Input with command K shortcut visual -->
      <div class="relative w-full sm:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref="searchInputRef"
          type="text"
          v-model="searchQuery"
          placeholder="Search events..."
          class="w-full pl-9 pr-14 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all shadow-sm"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200/80 font-mono select-none">
          ⌘K
        </span>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="flex border-b border-gray-200 pb-px">
      <div class="flex space-x-1 bg-gray-150 p-1 rounded-xl border border-gray-200/50">
        <button
          v-for="tab in ['all', 'shared', 'public', 'archived']"
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all"
          :class="activeTab === tab ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'"
        >
          {{ tab === 'all' ? 'All events' : tab }}
        </button>
      </div>
    </div>

    <!-- Calendar Card Box -->
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <!-- Toolbar Header -->
      <div class="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 bg-white">
        <!-- Date Badge & Labels -->
        <div class="flex items-center gap-4">
          <!-- Calendar Date Badge Widget -->
          <div class="w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-sm">
            <div class="text-[9px] font-bold text-gray-400 tracking-wider pt-1 uppercase">
              {{ selectedDateMonthAbbr }}
            </div>
            <div class="text-xl font-extrabold text-emerald-600 pb-1">
              {{ selectedDateDayNumber }}
            </div>
          </div>

          <!-- Labels -->
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-gray-900">{{ monthLabel }}</h2>
              <span class="bg-gray-150 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-gray-200/50">
                {{ weekLabel }}
              </span>
            </div>
            <p class="text-xs text-gray-500 font-medium mt-0.5">
              {{ dateRangeLabel }}
            </p>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            @click="focusSearch"
            class="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 shadow-sm bg-white"
            title="Search events"
          >
            <Search class="w-4 h-4" />
          </button>

          <!-- Prev/Today/Next -->
          <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <button
              @click="navigateMonth(-1)"
              class="p-2 hover:bg-gray-50 transition-colors text-gray-600 border-r border-gray-200 cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              @click="goToToday"
              class="px-4 py-2 text-xs font-bold hover:bg-gray-50 transition-colors text-gray-700 border-r border-gray-200 cursor-pointer"
            >
              Today
            </button>
            <button
              @click="navigateMonth(1)"
              class="p-2 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer"
              title="Next month"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>

          <!-- Dropdown placeholder -->
          <div class="relative">
            <button class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 flex items-center gap-2 shadow-sm bg-white">
              Month view
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          <!-- Add Event Button -->
          <Button variant="primary" @click="openAddModal()" class="gap-1.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-4 text-xs font-semibold cursor-pointer">
            <Plus class="w-4 h-4" />
            Add event
          </Button>
        </div>
      </div>

      <!-- Calendar Monthly Grid -->
      <div class="flex-1 grid grid-cols-7 text-center select-none bg-gray-100 gap-px">
        <!-- Weekday Labels -->
        <div
          v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :key="day"
          class="bg-white py-3 text-xs font-bold text-gray-400 border-b border-gray-100"
        >
          {{ day }}
        </div>

        <!-- Monthly day cells -->
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          class="bg-white min-h-[130px] p-2.5 flex flex-col items-stretch text-left group relative border-b border-r border-gray-100 cursor-pointer transition-all hover:bg-slate-50/50"
          :class="[
            !day.isCurrentMonth ? 'bg-gray-50/30 text-gray-300' : 'text-gray-900',
            day.isSelected ? 'ring-1 ring-emerald-500/30 bg-emerald-50/5' : ''
          ]"
          @click="selectDay(day)"
        >
          <!-- Day Cell Header -->
          <div class="flex justify-between items-center mb-1.5">
            <!-- Day Number Indicator -->
            <div
              class="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all"
              :class="[
                day.isSelected 
                  ? 'bg-emerald-600 text-white font-extrabold' 
                  : day.isToday 
                    ? 'border border-emerald-500 text-emerald-600 font-extrabold' 
                    : 'text-gray-700 group-hover:text-gray-950'
              ]"
            >
              {{ day.dayNumber }}
            </div>
            
            <!-- Quick Add Action shortcut -->
            <button
              @click.stop="openAddModal(day.dateString)"
              class="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-emerald-600 rounded hover:bg-gray-100 transition-all cursor-pointer"
              title="Add event to this day"
            >
              <Plus class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Cell Event Stack list -->
          <div class="flex-1 space-y-1 overflow-y-auto max-h-[88px] pr-0.5 custom-scrollbar">
            <!-- Slice at 3 events for visual layout cleanliness -->
            <div
              v-for="evt in day.events.slice(0, 3)"
              :key="evt.id"
              @click.stop="openEditModal(evt)"
              class="px-2 py-1 rounded text-[10px] font-semibold border-l-4 leading-tight truncate transition-all hover:brightness-95 hover:translate-x-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center justify-between"
              :class="getCategoryClasses(evt.category)"
            >
              <span class="truncate pr-1">
                <span v-if="evt.category === 'personal' || evt.category === 'client'" class="mr-0.5 text-[8px]">●</span>
                {{ evt.title }}
              </span>
              <span class="text-[9px] font-normal opacity-85 shrink-0 ml-1 font-mono">
                {{ formatEventTimeShort(evt.time) }}
              </span>
            </div>

            <!-- More indicator -->
            <div
              v-if="day.events.length > 3"
              @click.stop="openMoreModal(day)"
              class="text-[10px] font-bold text-gray-500 hover:text-emerald-600 transition-colors pl-1.5 py-0.5 rounded hover:bg-gray-100 cursor-pointer font-sans"
            >
              {{ day.events.length - 3 }} more...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DIALOG 1: Add Event Modal -->
    <Dialog v-model:open="showAddModal">
      <DialogContent class="sm:max-w-md bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader class="space-y-1.5 pb-3 border-b border-gray-100">
          <DialogTitle class="text-gray-900 font-extrabold text-lg flex items-center gap-2">
            <CalendarIcon class="w-5 h-5 text-emerald-600" />
            Add Event
          </DialogTitle>
          <DialogDescription class="text-xs text-gray-500">
            Create a new event appointment in your schedule.
          </DialogDescription>
        </DialogHeader>
        
        <form @submit.prevent="handleAddEvent" class="space-y-4 py-3">
          <!-- Event Title -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Event Title</label>
            <input
              v-model="eventForm.title"
              type="text"
              placeholder="e.g. Weekly Design Feedback Sync"
              required
              class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
            />
          </div>

          <!-- Date & Time Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Date</label>
              <input
                v-model="eventForm.date"
                type="date"
                required
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Start Time</label>
              <input
                v-model="eventTime24"
                type="time"
                required
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>
          </div>

          <!-- Category and Sharing -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Category</label>
              <select
                v-model="eventForm.category"
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="work">Work (Pink)</option>
                <option value="personal">Personal (Green)</option>
                <option value="design">Design (Blue)</option>
                <option value="marketing">Marketing (Purple)</option>
                <option value="client">Client (Orange)</option>
                <option value="team">Team (Gray)</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Sharing Visibility</label>
              <select
                v-model="eventForm.sharing"
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="shared">Shared (Team)</option>
                <option value="public">Public (Everyone)</option>
                <option value="archived">Archived</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Description (Optional)</label>
            <textarea
              v-model="eventForm.description"
              rows="3"
              placeholder="Provide a brief outline of the calendar entry..."
              class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-xs font-bold cursor-pointer"
            >
              Save Event
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- DIALOG 2: Edit Event Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="sm:max-w-md bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader class="space-y-1.5 pb-3 border-b border-gray-100">
          <DialogTitle class="text-gray-900 font-extrabold text-lg flex items-center gap-2">
            <CalendarIcon class="w-5 h-5 text-emerald-600" />
            Edit Event
          </DialogTitle>
          <DialogDescription class="text-xs text-gray-500">
            Update or delete this calendar entry.
          </DialogDescription>
        </DialogHeader>
        
        <form @submit.prevent="handleUpdateEvent" class="space-y-4 py-3">
          <!-- Event Title -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Event Title</label>
            <input
              v-model="eventForm.title"
              type="text"
              required
              class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
            />
          </div>

          <!-- Date & Time Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Date</label>
              <input
                v-model="eventForm.date"
                type="date"
                required
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Start Time</label>
              <input
                v-model="eventTime24"
                type="time"
                required
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>
          </div>

          <!-- Category and Sharing -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Category</label>
              <select
                v-model="eventForm.category"
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="work">Work (Pink)</option>
                <option value="personal">Personal (Green)</option>
                <option value="design">Design (Blue)</option>
                <option value="marketing">Marketing (Purple)</option>
                <option value="client">Client (Orange)</option>
                <option value="team">Team (Gray)</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Sharing Visibility</label>
              <select
                v-model="eventForm.sharing"
                class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="shared">Shared (Team)</option>
                <option value="public">Public (Everyone)</option>
                <option value="archived">Archived</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Description (Optional)</label>
            <textarea
              v-model="eventForm.description"
              rows="3"
              class="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <button
              type="button"
              @click="handleDeleteEvent"
              class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5 border border-rose-250/20 cursor-pointer"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Delete
            </button>
            <div class="flex gap-2">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-xs font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- DIALOG 3: "More Events" Modal -->
    <Dialog v-model:open="showMoreModal">
      <DialogContent class="sm:max-w-md bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader class="space-y-1 pb-3 border-b border-gray-100">
          <DialogTitle class="text-gray-900 font-extrabold text-lg flex items-center gap-2">
            <CalendarIcon class="w-5 h-5 text-emerald-600" />
            Events for {{ formatDateFriendly(moreEventsDay?.dateString) }}
          </DialogTitle>
          <DialogDescription class="text-xs text-gray-500">
            Showing all scheduled entries for this day. Click any item to edit.
          </DialogDescription>
        </DialogHeader>
        
        <div class="py-3 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          <div
            v-for="evt in moreEventsDay?.events"
            :key="evt.id"
            @click="handleMoreEventClick(evt)"
            class="p-3.5 rounded-xl border-l-4 leading-tight cursor-pointer transition-all hover:translate-x-0.5 hover:brightness-95 shadow-sm border border-gray-150 flex items-center justify-between"
            :class="getCategoryClasses(evt.category)"
          >
            <div>
              <div class="font-bold text-xs flex items-center gap-1">
                <span v-if="evt.category === 'personal' || evt.category === 'client'" class="mr-0.5 text-[8px]">●</span>
                {{ evt.title }}
              </div>
              <p v-if="evt.description" class="text-[10px] opacity-75 mt-0.5 line-clamp-1 font-medium">
                {{ evt.description }}
              </p>
            </div>
            <div class="text-[10px] font-mono shrink-0 bg-white/70 px-1.5 py-0.5 rounded border border-black/5 font-semibold">
              {{ evt.time }}
            </div>
          </div>
          
          <div v-if="!moreEventsDay?.events.length" class="text-center py-6 text-sm text-slate-400 italic">
            No events scheduled.
          </div>
        </div>

        <DialogFooter class="border-t border-gray-100 pt-3">
          <button
            type="button"
            @click="showMoreModal = false"
            class="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 cursor-pointer"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
