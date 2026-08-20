<script setup lang="ts">
interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'warning'
}

defineProps<{
  toasts: Toast[]
}>()
</script>

<template>
  <!-- Centered bottom stack — white bg, colored left border per type -->
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80 pointer-events-none select-none">
    <transition-group
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-800 overflow-hidden"
        :class="{
          'border-l-4 border-l-[#23B750]': toast.type === 'success',
          'border-l-4 border-l-[#3B82F6]': toast.type === 'info',
          'border-l-4 border-l-[#F59E0B]': toast.type === 'warning',
        }"
      >
        <!-- Type icon -->
        <span v-if="toast.type === 'success'" class="flex-shrink-0">
          <svg class="w-4 h-4 text-[#23B750]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        <span v-else-if="toast.type === 'info'" class="flex-shrink-0">
          <svg class="w-4 h-4 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </span>
        <span v-else-if="toast.type === 'warning'" class="flex-shrink-0">
          <svg class="w-4 h-4 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </span>
        <span class="flex-1 leading-snug">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>
