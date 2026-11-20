import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const isSidebarCollapsed = ref(false);
  const activeParentItem = ref('Dashboard');
  const isSecondaryPanelOpen = ref(false);
  const isDashboardTourOpen = ref(false);

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

  function startDashboardTour() {
    isDashboardTourOpen.value = true;
  }

  function closeDashboardTour() {
    isDashboardTourOpen.value = false;
  }

  function toggleDashboardTour() {
    isDashboardTourOpen.value = !isDashboardTourOpen.value;
  }

  return {
    isSidebarCollapsed,
    activeParentItem,
    isSecondaryPanelOpen,
    isDashboardTourOpen,
    toggleSidebar,
    setActiveParent,
    closeSecondaryPanel,
    startDashboardTour,
    closeDashboardTour,
    toggleDashboardTour,
  };
});
