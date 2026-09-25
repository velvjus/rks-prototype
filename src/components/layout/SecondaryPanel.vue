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
              class="w-full flex items-center px-2.5 py-1 text-[13px] rounded-md transition-colors group text-left cursor-pointer"
              :class="[
                item.route && route.path === item.route
                  ? 'bg-emerald-950/60 text-[#23B750] font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                item.undesigned ? 'opacity-80' : ''
              ]"
            >
              <component
                v-if="item.icon"
                :is="item.icon"
                :class="[
                  'w-[15px] h-[15px] mr-1.5 shrink-0',
                  item.route && route.path === item.route ? 'text-[#23B750]' : 'text-gray-500 group-hover:text-gray-300'
                ]"
              />
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
import { useRouter, useRoute } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import {
  Minus, Mail, MessageSquare, Instagram, Globe,
  Calendar, Layout, Clock, Settings as SettingsIcon,
  BarChart2, PieChart, User, Users, Inbox, Tag, Bot,
  Megaphone, Plus, Cpu,
  Book, Grid, LayoutGrid,
  Briefcase, CreditCard, Contact, Shield, MessageSquareQuote, FileText, Terminal, Zap, Clipboard, History,
  Scan, UserCheck, Sparkles, Award, UserPlus, Coins, HandCoins, Banknote, Bookmark, Package,
} from 'lucide-vue-next';

const ui = useUIStore();
const router = useRouter();
const route = useRoute();

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
  'Hidden': {
    groups: {
      'Default': {
        items: [
          { label: 'Setup Wizard', icon: Sparkles, route: '/setup-wizard', badge: 'Wizard' },
          { label: 'Partner Registration', icon: Award, route: '/partner/register', badge: 'New' },
          { label: 'Onboarding Wizard v2', icon: Sparkles, route: '/onboarding-v2', badge: 'v2' },
          { label: 'Onboarding Wizard v1', icon: Sparkles, route: '/onboarding-v1', badge: 'v1' },
          { label: 'Auth & Signup Flow', icon: UserCheck, route: '/auth', badge: 'New' },
          { label: 'Design System', icon: LayoutGrid, route: '/design-system' },
          { label: 'Guidelines', icon: FileText, route: '/guidelines' },
        ],
      },
    },
  },
  'hidden': {
    groups: {
      'Default': {
        items: [
          { label: 'Setup Wizard', icon: Sparkles, route: '/setup-wizard', badge: 'Wizard' },
          { label: 'Partner Registration', icon: Award, route: '/partner/register', badge: 'New' },
          { label: 'Onboarding Wizard v2', icon: Sparkles, route: '/onboarding-v2', badge: 'v2' },
          { label: 'Onboarding Wizard v1', icon: Sparkles, route: '/onboarding-v1', badge: 'v1' },
          { label: 'Auth & Signup Flow', icon: UserCheck, route: '/auth', badge: 'New' },
          { label: 'Design System', icon: LayoutGrid, route: '/design-system' },
          { label: 'Guidelines', icon: FileText, route: '/guidelines' },
        ],
      },
    },
  },
  'Partners': {
    groups: {
      'Dashboard': {
        items: [
          { label: 'Overview', icon: LayoutGrid, route: '/partner/overview' },
          { label: 'Partner Program', icon: Bookmark, route: '/partner/program', badge: 'Upgrade' },
          { label: 'My Referral', icon: UserPlus, route: '/partner/referrals' },
        ],
      },
      'Finance': {
        items: [
          { label: 'Commissions', icon: HandCoins, route: '/partner/commissions' },
          { label: 'Withdrawal', icon: Banknote, route: '/partner/withdrawal' },
        ],
      },
      'Resources': {
        items: [
          { label: 'Partner Kit', icon: Package, route: '/partner/kit', badge: 'New' },
        ],
      },
    },
  },
  'partners': {
    groups: {
      'Dashboard': {
        items: [
          { label: 'Overview', icon: LayoutGrid, route: '/partner/overview' },
          { label: 'Partner Program', icon: Bookmark, route: '/partner/program', badge: 'Upgrade' },
          { label: 'My Referral', icon: UserPlus, route: '/partner/referrals' },
        ],
      },
      'Finance': {
        items: [
          { label: 'Commissions', icon: HandCoins, route: '/partner/commissions' },
          { label: 'Withdrawal', icon: Banknote, route: '/partner/withdrawal' },
        ],
      },
      'Resources': {
        items: [
          { label: 'Partner Kit', icon: Package, route: '/partner/kit', badge: 'New' },
        ],
      },
    },
  },
};

function handleItemClick(item: MenuItem) {
  if (item.route) {
    if (item.route.startsWith('/partner')) {
      ui.setActiveParent('Partners', false);
    } else {
      ui.setActiveParent(item.label, false);
    }
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
