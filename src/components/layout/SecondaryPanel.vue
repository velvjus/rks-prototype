<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 -translate-x-4"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 -translate-x-4"
  >
    <aside
      v-if="isOpen"
      class="absolute top-0 bottom-0 bg-gray-950 border-r border-gray-800 flex flex-col z-40 shadow-2xl transition-all duration-200"
      :class="ui.isSidebarCollapsed ? 'left-[58px]' : 'left-[210px]'"
      style="width: 220px"
    >
      <!-- Panel Header -->
      <div class="h-10 px-3 flex items-center justify-between border-b border-gray-800 shrink-0">
        <h2 class="text-xs font-bold text-white uppercase tracking-wider">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="p-1 text-gray-400 hover:text-white rounded transition-colors"
          title="Close panel"
        >
          <Minus class="w-4 h-4" />
        </button>
      </div>

      <!-- Panel Content -->
      <div class="flex-1 overflow-y-auto p-1.5 custom-scrollbar">
        <div v-if="currentMenu" class="space-y-3.5">
          <div v-for="(group, groupName) in currentMenu.groups" :key="groupName" class="space-y-0.5">
            <!-- Group Header (if not default) -->
            <h3
              v-if="groupName !== 'Default'"
              class="px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between"
            >
              {{ groupName }}
              <span v-if="group.badge" class="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[8px]">
                {{ group.badge }}
              </span>
            </h3>

            <!-- Group Items -->
            <button
              v-for="item in group.items"
              :key="item.label"
              @click="handleItemClick(item)"
              class="w-full flex items-center px-2.5 py-1 text-[13px] text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors group text-left"
              :class="item.undesigned ? 'opacity-80' : ''"
            >
              <component v-if="item.icon" :is="item.icon" class="w-[15px] h-[15px] mr-1.5 text-gray-500 group-hover:text-gray-300" />
              <span class="flex-1 truncate">{{ item.label }}</span>
              <span v-if="item.badge" class="ml-2 bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[8px]">
                {{ item.badge }}
              </span>
            </button>
          </div>
        </div>

        <!-- No content state -->
        <div v-else class="p-4 text-gray-500 text-sm italic">
          No submenu configuration for {{ title }}.
        </div>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRouter } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import {
  Minus, Mail, MessageSquare, Instagram, Globe,
  Calendar, Layout, Clock, Settings as SettingsIcon,
  BarChart2, PieChart, User, Users, Inbox, Tag, Bot,
  Megaphone, Plus, Cpu,
  Book, Grid,
  Briefcase, CreditCard, Contact, Shield, MessageSquareQuote, FileText, Terminal, Zap, Clipboard, History,
  Scan, UserCheck,
} from 'lucide-vue-next';

const ui = useUIStore();
const router = useRouter();

const props = defineProps<{
  isOpen: boolean;
  title?: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

interface MenuItem {
  label: string;
  icon?: Component;
  badge?: string;
  route?: string;
  undesigned?: boolean;
}

interface MenuGroup {
  badge?: string;
  items: MenuItem[];
}

interface MenuConfig {
  groups: Record<string, MenuGroup>;
}

const menuConfigs: Record<string, MenuConfig> = {
  'Web Forms': {
    groups: {
      'Default': {
        items: [
          { label: 'All Web Forms', icon: FileText, route: '/web-forms' },
          { label: 'Form Templates', icon: Layout, route: '/web-forms/templates' },
          { label: 'Form Submissions', icon: Inbox, route: '/web-forms/submissions' },
        ],
      },
    },
  },
  'Contacts': {
    groups: {
      'Default': {
        items: [
          { label: 'All Contacts', icon: UserCheck, route: '/contacts' },
          { label: 'Scan Name Card Simulation', icon: Scan, route: '/contacts/scan-namecard' },
        ],
      },
    },
  },
  'Conversations': {
    groups: {
      'Default': {
        items: [
          { label: 'All Conversations', route: '/omnichannel' },
          { label: 'Assigned to Me' },
          { label: 'Unassigned' },
          { label: 'Mentions' },
        ],
      },
      'Channels': {
        badge: '23',
        items: [
          { label: 'Support Email', icon: Mail },
          { label: 'WhatsApp Business', icon: MessageSquare },
          { label: 'Instagram Direct', icon: Instagram },
          { label: 'Website Chat', icon: Globe },
        ],
      },
    },
  },
  'Appointments': {
    groups: {
      'Default': {
        items: [
          { label: 'Calendar', icon: Calendar, route: '/appointments/calendar' },
          { label: 'Booking Pages', icon: Layout, route: '/appointments/booking-pages' },
          { label: 'Availability', icon: Clock },
          { label: 'Settings', icon: SettingsIcon },
        ],
      },
    },
  },
  'Reports': {
    groups: {
      'Default': {
        items: [
          { label: 'Overview', icon: BarChart2 },
          { label: 'Sales', icon: PieChart },
          { label: 'Conversations', icon: MessageSquare },
          { label: 'Tickets', icon: Inbox },
          { label: 'Campaigns', icon: Megaphone },
          { label: 'Agents', icon: User },
          { label: 'Teams', icon: Users },
          { label: 'Inboxes', icon: Inbox },
          { label: 'Labels', icon: Tag },
          { label: 'SLA', icon: Clock },
          { label: 'CSAT', icon: MessageSquareQuote },
          { label: 'Bots', icon: Bot },
        ],
      },
    },
  },
  'Campaigns': {
    groups: {
      'Overview': {
        items: [{ label: 'All Campaigns', icon: Megaphone }],
      },
      'Create': {
        items: [{ label: 'Create Campaign', icon: Plus }],
      },
      'Messaging': {
        items: [
          { label: 'Live Chat', icon: MessageSquare },
          { label: 'WhatsApp', icon: MessageSquare },
          { label: 'SMS', icon: MessageSquare },
        ],
      },
      'Email': {
        items: [
          { label: 'Email Campaigns', icon: Mail },
          { label: 'Email Templates', icon: FileText },
          { label: 'Email Providers', icon: Globe },
        ],
      },
      'Artificial Intelligence': {
        items: [
          { label: 'AI Campaigns', icon: Cpu },
          { label: 'Create AI Campaign', icon: Plus },
        ],
      },
    },
  },
  'Help Center': {
    groups: {
      'Default': {
        items: [
          { label: 'Articles', icon: Book },
          { label: 'Categories', icon: Grid },
          { label: 'Locales', icon: Globe },
          { label: 'Help Center Settings', icon: SettingsIcon },
        ],
      },
    },
  },
  'Settings': {
    groups: {
      'WORKSPACE SETUP': {
        items: [
          { label: 'Inboxes', route: '/settings?tab=inboxes' },
          { label: 'Teams', route: '/settings?tab=teams' },
          { label: 'Agents', route: '/settings?tab=agents' },
          { label: 'Roles', route: '/settings?tab=roles' },
        ],
      },
      'CUSTOMER DATA': {
        items: [
          { label: 'Labels', route: '/settings?tab=labels' },
          { label: 'Custom Attributes', route: '/settings?tab=labels', undesigned: true },
          { label: 'Web Forms', route: '/web-forms' },
        ],
      },
      'AUTOMATION & AI': {
        items: [
          { label: 'Automation', route: '/settings?tab=automation' },
          { label: 'Agent Bots', route: '/settings?tab=ai-training' },
          { label: 'Canned Responses', route: '/settings?tab=ai-training', undesigned: true },
        ],
      },
      'PERFORMANCE & CONTROL': {
        items: [
          { label: 'SLA', route: '/settings?tab=agents', undesigned: true },
          { label: 'Audit Logs', route: '/settings?tab=agents', undesigned: true },
        ],
      },
      'ACCOUNT & SYSTEM': {
        items: [
          { label: 'Account Settings', route: '/settings?tab=agents', undesigned: true },
          { label: 'Billing', route: '/settings?tab=agents', undesigned: true },
        ],
      },
      'AI KNOWLEDGE BASE': {
        items: [
          { label: 'Assistants', route: '/settings?tab=ai-training', undesigned: true },
          { label: 'Documents', route: '/settings?tab=ai-training', undesigned: true },
          { label: 'Training History', route: '/settings?tab=training-history' },
        ],
      },
    },
  },
};

function handleItemClick(item: MenuItem) {
  if (item.route) {
    router.push(item.route);
    ui.closeSecondaryPanel();
  }
}

const currentMenu = computed(() => {
  if (!props.title) return null;
  return menuConfigs[props.title] ?? null;
});

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1f2937;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #374151;
}
</style>
