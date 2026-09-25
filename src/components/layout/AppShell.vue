<template>
  <div v-if="route.meta.standalone" class="h-screen w-full overflow-y-auto bg-gray-50 font-sans">
    <slot></slot>
  </div>

  <div v-else class="h-screen w-full flex flex-col bg-gray-50 overflow-hidden font-sans">
    <TopNav />

    <div class="flex-1 flex overflow-hidden relative">
      <Sidebar />

      <!-- Click-outside backdrop -->
      <div
        v-if="ui.isSecondaryPanelOpen"
        class="fixed inset-0 z-30"
        @click="ui.closeSecondaryPanel"
      ></div>

      <!-- Secondary Panel -->
      <SecondaryPanel
        :is-open="ui.isSecondaryPanelOpen"
        :title="ui.activeParentItem"
        @close="ui.closeSecondaryPanel"
      />

      <!-- Main Content Area -->
      <main :class="['flex-1 bg-gray-50 transition-all duration-200', route.meta.fullWidth ? 'overflow-hidden h-full max-h-full flex flex-col min-h-0' : 'overflow-y-auto [scrollbar-gutter:stable]']">
        <div v-if="!route.meta.fullWidth" class="px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto w-full">
          <slot></slot>
        </div>
        <slot v-else></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import TopNav from './TopNav.vue';
import Sidebar from './Sidebar.vue';
import SecondaryPanel from './SecondaryPanel.vue';

const ui = useUIStore();
const route = useRoute();

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && ui.isSecondaryPanelOpen) {
    ui.closeSecondaryPanel();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
