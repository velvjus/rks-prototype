<template>
  <button
    class="w-full flex items-center py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 group outline-none relative"
    :class="[
      selected
        ? 'bg-gray-800 text-white'
        : 'text-gray-300 hover:bg-gray-800/60 hover:text-white focus-visible:ring-2 focus-visible:ring-gray-400',
      isCollapsed ? 'px-0 justify-center' : 'px-2.5',
    ]"
    @click="$emit('click')"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :title="isCollapsed ? item.label : ''"
  >
    <component
      :is="item.icon"
      class="w-[18px] h-[18px] transition-colors shrink-0"
      :class="[
        selected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300',
        isCollapsed ? '' : 'mr-2',
      ]"
      aria-hidden="true"
    />

    <template v-if="!isCollapsed">
      <span
        class="flex-1 text-left truncate transition-opacity duration-200"
        :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
      >
        {{ item.label }}
      </span>

      <!-- Optional Badge -->
      <span
        v-if="item.badge"
        class="ml-2 px-1.5 py-0.5 text-[10px] bg-gray-800 rounded-full text-gray-300 group-hover:text-white"
        :class="selected ? 'text-white' : ''"
      >
        {{ item.badge }}
      </span>

      <!-- Chevron for Submenu -->
      <ChevronRight v-if="item.hasSubmenu && !selected" class="w-4 h-4 ml-auto text-gray-500 transition-transform duration-150" />
      <ChevronDown v-if="item.hasSubmenu && selected" class="w-4 h-4 ml-auto text-white transition-transform duration-150" />
    </template>

    <!-- Collapsed Tooltip -->
    <div
      v-if="isCollapsed && isHovered"
      class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
    >
      {{ item.label }}
      <span v-if="item.badge" class="ml-1 opacity-70">({{ item.badge }})</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, type Component } from 'vue';
import { ChevronRight, ChevronDown } from 'lucide-vue-next';

interface NavItem {
  label: string;
  icon: Component;
  hasSubmenu: boolean;
  badge?: string;
}

defineProps<{
  item: NavItem;
  selected?: boolean;
  isCollapsed?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();

const isHovered = ref(false);
</script>
