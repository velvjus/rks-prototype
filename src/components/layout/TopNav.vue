<template>
  <header class="h-[52px] bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-[60]">
    <!-- Left Cluster -->
    <div class="flex items-center gap-3 w-[202px]">
      <button
        @click="ui.toggleSidebar"
        class="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        <Menu class="w-4.5 h-4.5" />
      </button>
      <div class="flex items-center gap-2">
        <img :src="logomarkColoredUrl" class="w-6 h-6 flex-shrink-0" alt="RakanSales Logomark" />
        <span class="text-white font-bold text-base tracking-tight select-none">
          <span class="text-[#23B750]">Rakan</span><span class="text-[#62D816]">Sales</span>
        </span>
      </div>
    </div>

    <!-- Center Cluster: Search -->
    <div class="flex-1 max-w-sm mx-4">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-3.5 w-3.5 text-gray-400" />
        </div>
        <input
          ref="searchInput"
          type="text"
          class="block w-full pl-9 pr-12 py-1.5 bg-gray-800 border-transparent rounded-full text-xs text-white placeholder-gray-400 focus:border-gray-600 focus:bg-gray-700 focus:ring-0 outline-none transition-colors"
          placeholder="Search..."
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span class="text-[10px] text-gray-500 font-medium tracking-widest">{{ isMac ? '⌘K' : 'Ctrl+K' }}</span>
        </div>
      </div>
    </div>

    <!-- Right Cluster -->
    <div class="flex items-center gap-2 w-[202px] justify-end">
      <!-- Notification Utility -->
      <button class="relative p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
        <Bell class="w-[18px] h-[18px]" />
        <span class="absolute top-1 right-1 block w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-gray-950"></span>
      </button>

      <!-- User Profile -->
      <button class="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-full hover:bg-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
        <div class="relative">
          <div class="w-7 h-7 rounded-full bg-pink-200 text-pink-700 font-medium text-xs flex items-center justify-center">
            J
          </div>
          <span class="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-primary ring-2 ring-gray-950"></span>
        </div>
        <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, Search, Bell, ChevronDown, Layers } from 'lucide-vue-next';
import { useUIStore } from '@/stores/ui';
import logomarkColoredUrl from '@/assets/logo/RKS Logomark 01.svg';

const ui = useUIStore();
const searchInput = ref<HTMLInputElement | null>(null);
const isMac = typeof window !== 'undefined' && window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

function handleKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.value?.focus();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
