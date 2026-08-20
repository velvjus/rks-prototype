<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

export type InboxFilterType = 'All' | 'Mine' | 'Unassigned' | 'Participating' | 'Resolved' | 'Archived'

const props = defineProps<{
  selectedInbox: InboxFilterType
  customerSearchQuery: string
}>()

const emit = defineEmits<{
  (e: 'select', value: InboxFilterType): void
  (e: 'update:customerSearchQuery', value: string): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref({ top: '0px', left: '0px' })

onClickOutside(containerRef, () => {
  isOpen.value = false
}, { ignore: [buttonRef] })

const updateDropdownPosition = () => {
  if (buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + 6}px`,
      left: `${rect.left}px`
    }
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

watch(isOpen, (newVal) => {
  if (newVal) {
    updateDropdownPosition()
    window.addEventListener('scroll', closeDropdown, { capture: true, passive: true })
    window.addEventListener('resize', closeDropdown)
  } else {
    window.removeEventListener('scroll', closeDropdown, { capture: true })
    window.removeEventListener('resize', closeDropdown)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', closeDropdown, { capture: true })
  window.removeEventListener('resize', closeDropdown)
})

const handleSelect = (val: InboxFilterType) => {
  emit('select', val)
  isOpen.value = false
}
</script>

<template>
  <div ref="containerRef" class="relative flex-shrink-0">
    <button 
      ref="buttonRef"
      type="button"
      @click.stop="isOpen = !isOpen"
      :class="[ 
        'flex items-center gap-1.5 px-3 h-7 transition-all duration-200 cursor-pointer outline-none rounded-full text-[11px] font-medium whitespace-nowrap border select-none', 
        selectedInbox !== 'All' 
          ? 'border-green-250 bg-green-50 text-[#23B750] hover:bg-green-100/50 font-bold' 
          : 'border-gray-250 bg-gray-50 text-gray-700 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300' 
      ]"
    >
      <svg class="w-3.5 h-3.5 flex-shrink-0" :class="[selectedInbox !== 'All' ? 'text-[#23B750]' : 'text-gray-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
      <span>{{ 
        selectedInbox === 'All' ? 'All' : 
        selectedInbox === 'Mine' ? 'Mine' : 
        selectedInbox === 'Unassigned' ? 'Unassigned' :
        selectedInbox === 'Participating' ? 'Participating' :
        selectedInbox === 'Resolved' ? 'Resolved' :
        'Archived'
      }}</span>
      <svg class="w-3 h-3 transition-transform duration-250 flex-shrink-0 ml-0.5" :class="[isOpen ? 'rotate-180 text-[#23B750]' : 'text-gray-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- Interactive Inbox Dropdown overlay -->
    <teleport to="body">
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="transform scale-95 opacity-0 -translate-y-1"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 -translate-y-1"
      >
        <div 
          v-if="isOpen"
          :style="dropdownStyle"
          class="fixed w-52 bg-white border border-gray-200 rounded-2xl z-[999] py-2 shadow-lg focus:outline-none select-none"
        >
          <div class="px-3.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Quick Filter
          </div>
          
          <div class="mt-1">
            <!-- All Conversations -->
            <button 
              type="button"
              @click="handleSelect('All')"
              class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="[selectedInbox === 'All' ? 'text-[#23B750] font-bold bg-green-50/30' : 'text-gray-700']"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full border border-gray-300 bg-white"></span>
                <span>All</span>
              </div>
              <svg v-if="selectedInbox === 'All'" class="w-4 h-4 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <!-- Mine -->
            <button 
              type="button"
              @click="handleSelect('Mine')"
              class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="[selectedInbox === 'Mine' ? 'text-[#23B750] font-bold bg-green-50/30' : 'text-gray-700']"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
                <span>Mine</span>
              </div>
              <svg v-if="selectedInbox === 'Mine'" class="w-4 h-4 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <!-- Participating -->
            <button 
              type="button"
              @click="handleSelect('Participating')"
              class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="[selectedInbox === 'Participating' ? 'text-[#23B750] font-bold bg-green-50/30' : 'text-gray-700']"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>Participating</span>
              </div>
              <svg v-if="selectedInbox === 'Participating'" class="w-4 h-4 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <!-- Unassigned -->
            <button 
              type="button"
              @click="handleSelect('Unassigned')"
              class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="[selectedInbox === 'Unassigned' ? 'text-[#23B750] font-bold bg-green-50/30' : 'text-gray-700']"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                <span>Unassigned</span>
              </div>
              <svg v-if="selectedInbox === 'Unassigned'" class="w-4 h-4 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <!-- Divider -->
            <div class="my-1.5 border-t border-gray-150 mx-3.5"></div>

            <!-- Resolved -->
            <button 
              type="button"
              @click="handleSelect('Resolved')"
              class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="[selectedInbox === 'Resolved' ? 'text-[#23B750] font-bold bg-green-50/30' : 'text-gray-700']"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Resolved</span>
              </div>
              <svg v-if="selectedInbox === 'Resolved'" class="w-4 h-4 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <!-- Archived -->
            <button 
              type="button"
              @click="handleSelect('Archived')"
              class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="[selectedInbox === 'Archived' ? 'text-[#23B750] font-bold bg-green-50/30' : 'text-gray-700']"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Archived</span>
              </div>
              <svg v-if="selectedInbox === 'Archived'" class="w-4 h-4 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
