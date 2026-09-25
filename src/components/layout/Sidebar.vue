<template>
  <nav
    class="bg-gray-950 flex flex-col h-full border-r border-gray-800 shrink-0 transition-all duration-200 z-[60]"
    :class="ui.isSidebarCollapsed ? 'w-[58px]' : 'w-[210px]'"
  >
    <!-- Sidebar Items -->
    <div class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
      <SidebarItem
        v-for="item in topNavItems"
        :key="item.label"
        :item="item"
        :selected="isItemSelected(item)"
        :is-collapsed="ui.isSidebarCollapsed"
        @click="handleItemClick(item)"
      />

      <div class="my-1.5 border-t border-gray-800"></div>

      <SidebarItem
        v-for="item in bottomNavItems"
        :key="item.label"
        :item="item"
        :selected="isItemSelected(item)"
        :is-collapsed="ui.isSidebarCollapsed"
        @click="handleItemClick(item)"
      />

      <!-- Secret Hidden Navigation Item right below Settings -->
      <div :class="ui.activeParentItem === hiddenNavItem.label && ui.isSecondaryPanelOpen ? 'opacity-100' : 'opacity-0 hover:opacity-100 transition-opacity duration-200'">
        <SidebarItem
          :item="hiddenNavItem"
          :selected="ui.activeParentItem === hiddenNavItem.label && ui.isSecondaryPanelOpen"
          :is-collapsed="ui.isSidebarCollapsed"
          @click="handleItemClick(hiddenNavItem)"
        />
      </div>

      <!-- Secret Hidden Navigation Item: Partners (only appears on hover or when active) -->
      <div :class="isItemSelected(partnersNavItem) || (ui.activeParentItem === partnersNavItem.label && ui.isSecondaryPanelOpen) ? 'opacity-100' : 'opacity-0 hover:opacity-100 transition-opacity duration-200'">
        <SidebarItem
          :item="partnersNavItem"
          :selected="isItemSelected(partnersNavItem)"
          :is-collapsed="ui.isSidebarCollapsed"
          @click="handleItemClick(partnersNavItem)"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import {
  Layers,
  MessageSquare,
  Users,
  Building2,
  Briefcase,
  Ticket,
  Calendar,
  CalendarDays,
  Megaphone,
  BarChart2,
  Book,
  Settings,
  LayoutGrid,
  FileText,
  Puzzle,
  EyeOff,
  Handshake,
} from 'lucide-vue-next';
import SidebarItem from './SidebarItem.vue';

const ui = useUIStore();
const router = useRouter();
const route = useRoute();

interface NavItem {
  label: string;
  icon: Component;
  hasSubmenu: boolean;
  badge?: string;
  route?: string;
}

const topNavItems: NavItem[] = [
  { label: 'Dashboard', icon: Layers, hasSubmenu: false, route: '/dashboard' },
  { label: 'Conversations', icon: MessageSquare, hasSubmenu: true },
  { label: 'Contacts', icon: Users, hasSubmenu: true },
  { label: 'Companies', icon: Building2, hasSubmenu: false, route: '/companies' },
  { label: 'Add-ons', icon: Puzzle, hasSubmenu: false, route: '/addons' },
  { label: 'Deals', icon: Briefcase, hasSubmenu: false, route: '/deals' },
  { label: 'Tickets', icon: Ticket, hasSubmenu: false },
  { label: 'Events', icon: CalendarDays, hasSubmenu: false, route: '/events' },
  { label: 'Appointments', icon: Calendar, hasSubmenu: true },
];

const bottomNavItems: NavItem[] = [
  { label: 'Campaigns', icon: Megaphone, hasSubmenu: true },
  { label: 'Reports', icon: BarChart2, hasSubmenu: true },
  { label: 'Help Center', icon: Book, hasSubmenu: true },
  { label: 'Settings', icon: Settings, hasSubmenu: false, route: '/settings' },
];

const hiddenNavItem: NavItem = {
  label: 'Hidden',
  icon: EyeOff,
  hasSubmenu: true,
};

const partnersNavItem: NavItem = {
  label: 'Partners',
  icon: Handshake,
  hasSubmenu: true,
};

function isItemSelected(item: NavItem) {
  if (item.route && route.path === item.route) return true;
  if (item.label === 'Partners' && route.path.startsWith('/partner')) return true;
  return ui.activeParentItem === item.label;
}

function handleItemClick(item: NavItem) {
  ui.setActiveParent(item.label, item.hasSubmenu);
  if (item.route) {
    router.push(item.route);
  }
}
</script>
