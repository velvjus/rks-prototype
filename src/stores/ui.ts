import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const isSidebarCollapsed = ref(false);
  const activeParentItem = ref('Dashboard');
  const isSecondaryPanelOpen = ref(false);

  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  }

  function setActiveParent(label: string, hasSubmenu = false) {
    activeParentItem.value = label;
    if (hasSubmenu) {
      isSecondaryPanelOpen.value = true;
    } else {
      isSecondaryPanelOpen.value = false;
    }
  }

  function closeSecondaryPanel() {
    isSecondaryPanelOpen.value = false;
  }

  return {
    isSidebarCollapsed,
    activeParentItem,
    isSecondaryPanelOpen,
    toggleSidebar,
    setActiveParent,
    closeSecondaryPanel,
  };
});
