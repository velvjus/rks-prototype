<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logomarkColoredUrl from '@/assets/logo/RKS Logomark 01.svg'
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Puzzle,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Scan,
  UserCheck,
  FileText,
  Layers,
  Inbox,
  Briefcase,
  Sparkles,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// --- Outer Rail expand/collapse ---
const isRailExpanded = ref(true)
const railWidth = computed(() => isRailExpanded.value ? 'w-56' : 'w-16')

// --- Inner Sidebar visibility ---
const isInnerSidebarOpen = ref(true)
const hasInnerSidebar = computed(() => route.path !== '/omnichannel')

// --- Global theme state via centralized useTheme ---
import { useTheme } from '@/composables/useTheme'
const { isDark, toggleTheme: toggleDark } = useTheme()

// --- Dynamic breadcrumb from route ---
const routeLabels: Record<string, string> = {
  '/omnichannel':            'Omnichannel',
  '/companies':              'Companies',
  '/contacts':               'Contacts',
  '/contacts/scan-namecard': 'Scan Name Card Simulation',
  '/web-forms':              'Web Forms',
  '/web-forms/templates':    'Form Templates Repository',
  '/web-forms/submissions':  'Form Submissions',
  '/deals':                  'Deals',
  '/design-system':          'Design System',
  '/addons':                 'Add-ons',
  '/guidelines':             'Guidelines',
  '/onboarding':             'Onboarding Wizard v2',
  '/onboarding-v2':          'Onboarding Wizard v2',
  '/onboarding-v1':          'Onboarding Wizard v1 (Classic)',
  '/partner/register':       'Partner Registration',
  '/partner/overview':       'Partner Portal',
  '/partner/program':        'Partner Program',
  '/partner/referrals':      'My Referral',
  '/partner/commissions':    'Commissions',
  '/partner/earnings':       'Commissions',
  '/partner/withdrawal':     'Partner Withdrawal',
  '/setup-wizard':           'Setup Wizard',
  '/settings':               'Settings',
  '/settings/ai-assistants': 'AI Assistants',
}
const pageTitle = computed(() => {
  if (route.path.startsWith('/web-forms/builder')) return 'Form Builder'
  return routeLabels[route.path] ?? 'RakanSales'
})

// Contacts & Web Forms sub-menu expanded state
const isContactsExpanded = ref(true)
const isWebFormsExpanded = ref(true)

// Toggle sub-menus
const toggleContactsMenu = () => {
  isContactsExpanded.value = !isContactsExpanded.value
}
const toggleWebFormsMenu = () => {
  isWebFormsExpanded.value = !isWebFormsExpanded.value
}

const navItems = [
  { to: '/omnichannel',   icon: MessageSquare,   label: 'Omnichannel' },
  { to: '/companies',     icon: Building2,        label: 'Companies' },
  { 
    to: '/contacts',      
    icon: Users,            
    label: 'Contacts',
    subItems: [
      { to: '/contacts', label: 'All Contacts', icon: UserCheck },
      { to: '/contacts/scan-namecard', label: 'Scan Name Card Simulation', icon: Scan }
    ]
  },
  { to: '/deals',         icon: Briefcase,        label: 'Deals' },
  { to: '/addons',        icon: Puzzle,           label: 'Add-ons' },
  { to: '/onboarding',    icon: Sparkles,         label: 'Onboarding Wizard v2' },
]
</script>

<template>
  <div class="flex h-screen w-full bg-background overflow-hidden text-sm">

    <!-- ═══════════════════════════════════════════════
         OUTER RAIL (Dark, expandable)
    ════════════════════════════════════════════════ -->
    <aside
      :class="[
        'h-full bg-rail flex flex-col items-center py-4 flex-shrink-0 z-20 transition-all duration-250 ease-in-out',
        railWidth
      ]"
    >
      <!-- Logo Mark -->
      <div class="flex items-center gap-2 mb-6 px-3.5 w-full overflow-hidden">
        <img :src="logomarkColoredUrl" class="w-8 h-8 flex-shrink-0" alt="RakanSales Logomark" />
        <span
          v-if="isRailExpanded"
          class="text-rail-foreground font-bold text-sm tracking-tight leading-none whitespace-nowrap overflow-hidden transition-all duration-200"
        >
          RakanSales
        </span>
      </div>

      <!-- App Navigation -->
      <nav class="flex flex-col gap-1 w-full px-2 flex-1">
        <template v-for="item in navItems" :key="item.to">
          <!-- Standard nav item -->
          <div v-if="!item.subItems">
            <RouterLink
              :to="item.to"
              :title="isRailExpanded ? undefined : item.label"
              :class="[
                'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden',
                isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
              ]"
              active-class="!text-primary bg-rail-active"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span
                v-if="isRailExpanded"
                class="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200"
              >
                {{ item.label }}
              </span>
            </RouterLink>
          </div>

          <!-- Expandable Contacts item -->
          <div v-else class="flex flex-col relative group">
            <!-- Whole row button: clicking opens/toggles sub-menu, does not navigate -->
            <button
              @click="toggleContactsMenu"
              :class="[
                'rounded-md transition-all duration-150 flex items-center justify-between overflow-hidden w-full cursor-pointer',
                isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
                route.path.startsWith('/contacts') ? '!text-primary bg-rail-active font-semibold' : 'text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active'
              ]"
              :title="isRailExpanded ? undefined : item.label"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span
                  v-if="isRailExpanded"
                  class="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200"
                >
                  {{ item.label }}
                </span>
              </div>

              <!-- Chevron indicator -->
              <ChevronRight
                v-if="isRailExpanded"
                :class="['w-4 h-4 transition-transform duration-200 ml-1 text-rail-muted-foreground', isContactsExpanded ? 'rotate-90 text-rail-foreground' : '']"
              />
            </button>

            <!-- Collapsed Rail Hover Flyout Menu -->
            <div
              v-if="!isRailExpanded"
              class="absolute left-full top-0 ml-2 w-48 bg-rail border border-rail-border rounded-lg p-2 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 flex flex-col gap-1"
            >
              <div class="px-2 py-1 text-[10px] font-bold text-rail-muted-foreground uppercase tracking-wider">
                Contacts
              </div>
              <RouterLink
                v-for="sub in item.subItems"
                :key="sub.to"
                :to="sub.to"
                :class="[
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                  route.path === sub.to ? 'text-primary bg-rail-active font-semibold' : 'text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active/50'
                ]"
              >
                <component :is="sub.icon" class="w-3.5 h-3.5 flex-shrink-0" />
                <span class="truncate">{{ sub.label }}</span>
              </RouterLink>
            </div>

            <!-- Expanded Rail Accordion Sub-items -->
            <div v-if="isRailExpanded && isContactsExpanded" class="ml-4 pl-3 border-l border-rail-border mt-1 flex flex-col gap-1">
              <RouterLink
                v-for="sub in item.subItems"
                :key="sub.to"
                :to="sub.to"
                :class="[
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                  route.path === sub.to ? 'text-primary bg-rail-active/80 font-semibold' : 'text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active/50'
                ]"
              >
                <component :is="sub.icon" class="w-3.5 h-3.5 flex-shrink-0" />
                <span class="truncate">{{ sub.label }}</span>
              </RouterLink>
            </div>
          </div>
        </template>
      </nav>

      <!-- Bottom Controls -->
      <div class="w-full px-2 flex flex-col gap-1">

        <!-- Inner sidebar toggle -->
        <button
          v-if="hasInnerSidebar"
          @click="isInnerSidebarOpen = !isInnerSidebarOpen"
          :title="isInnerSidebarOpen ? 'Close side panel' : 'Open side panel'"
          :class="[
            'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden w-full',
            isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
          ]"
        >
          <component
            :is="isInnerSidebarOpen ? PanelLeftClose : PanelLeftOpen"
            class="w-5 h-5 flex-shrink-0"
          />
          <span v-if="isRailExpanded" class="text-sm font-medium whitespace-nowrap overflow-hidden">
            {{ isInnerSidebarOpen ? 'Close Panel' : 'Open Panel' }}
          </span>
        </button>

        <!-- Dark mode toggle -->
        <button
          @click="toggleDark"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          :class="[
            'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden w-full',
            isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
          ]"
        >
          <component :is="isDark ? Sun : Moon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="isRailExpanded" class="text-sm font-medium whitespace-nowrap overflow-hidden">
            {{ isDark ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </button>

        <!-- Settings -->
        <button
          :class="[
            'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden w-full',
            isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
          ]"
          title="Settings"
        >
          <Settings class="w-5 h-5 flex-shrink-0" />
          <span v-if="isRailExpanded" class="text-sm font-medium whitespace-nowrap overflow-hidden">
            Settings
          </span>
        </button>

        <!-- Hidden Design System item right below Settings -->
        <RouterLink
          to="/design-system"
          :title="isRailExpanded ? undefined : 'Design System'"
          :class="[
            'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden w-full opacity-0 hover:opacity-100',
            isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
          ]"
          active-class="!text-primary bg-rail-active opacity-100"
        >
          <LayoutDashboard class="w-5 h-5 flex-shrink-0" />
          <span
            v-if="isRailExpanded"
            class="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200"
          >
            Design System
          </span>
        </RouterLink>

        <!-- Rail expand/collapse toggle -->
        <button
          @click="isRailExpanded = !isRailExpanded"
          :title="isRailExpanded ? 'Collapse rail' : 'Expand rail'"
          :class="[
            'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden w-full mt-1 border-t border-rail-border pt-3',
            isRailExpanded ? 'px-3 py-2' : 'p-2 justify-center',
          ]"
        >
          <component
            :is="isRailExpanded ? ChevronLeft : ChevronRight"
            class="w-4 h-4 flex-shrink-0"
          />
          <span v-if="isRailExpanded" class="text-xs font-medium whitespace-nowrap overflow-hidden text-rail-muted-foreground">
            Collapse
          </span>
        </button>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════════
         INNER SIDEBAR (Light, closeable)
    ════════════════════════════════════════════════ -->
    <transition
      enter-active-class="transition-all duration-250 ease-in-out"
      enter-from-class="opacity-0 -translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in-out"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
    >
      <aside
        v-if="hasInnerSidebar && isInnerSidebarOpen"
        class="w-60 h-full bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0 z-10"
      >
        <!-- Sidebar Header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <h2 class="font-semibold text-sidebar-foreground text-sm">{{ pageTitle }}</h2>
          <button
            @click="isInnerSidebarOpen = false"
            title="Close side panel"
            class="p-1.5 rounded-md text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
        </div>

        <div class="p-3">
          <!-- Search -->
          <div class="relative mb-4">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rail-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              class="w-full pl-9 pr-3 py-1.5 bg-sidebar-accent/50 border border-sidebar-border rounded-md text-xs text-sidebar-foreground placeholder:text-rail-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <nav v-if="route.path.startsWith('/contacts')" class="space-y-1 text-sm font-medium">
            <button
              @click="isContactsExpanded = !isContactsExpanded"
              class="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-rail-muted-foreground uppercase tracking-wider hover:text-sidebar-foreground transition-colors cursor-pointer"
            >
              <span>Contacts Menu</span>
              <ChevronDown :class="['w-3.5 h-3.5 transition-transform duration-200', isContactsExpanded ? 'rotate-180' : '']" />
            </button>
            
            <div v-if="isContactsExpanded" class="space-y-1 pt-1">
              <RouterLink
                to="/contacts"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/contacts' ? 'bg-sidebar-accent text-sidebar-foreground font-semibold' : 'text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                ]"
              >
                <UserCheck class="w-4 h-4 flex-shrink-0" />
                All Contacts
              </RouterLink>
              <RouterLink
                to="/contacts/scan-namecard"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/contacts/scan-namecard' ? 'bg-sidebar-accent text-sidebar-foreground font-semibold' : 'text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                ]"
              >
                <Scan class="w-4 h-4 flex-shrink-0" />
                Scan Name Card Simulation
              </RouterLink>
            </div>
          </nav>

          <nav v-else-if="route.path.startsWith('/web-forms')" class="space-y-1 text-sm font-medium">
            <button
              @click="isWebFormsExpanded = !isWebFormsExpanded"
              class="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-rail-muted-foreground uppercase tracking-wider hover:text-sidebar-foreground transition-colors cursor-pointer"
            >
              <span>Web Forms Menu</span>
              <ChevronDown :class="['w-3.5 h-3.5 transition-transform duration-200', isWebFormsExpanded ? 'rotate-180' : '']" />
            </button>
            
            <div v-if="isWebFormsExpanded" class="space-y-1 pt-1">
              <RouterLink
                to="/web-forms"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/web-forms' ? 'bg-sidebar-accent text-sidebar-foreground font-semibold' : 'text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                ]"
              >
                <FileText class="w-4 h-4 flex-shrink-0" />
                All Web Forms
              </RouterLink>
              <RouterLink
                to="/web-forms/templates"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/web-forms/templates' ? 'bg-sidebar-accent text-sidebar-foreground font-semibold' : 'text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                ]"
              >
                <Layers class="w-4 h-4 flex-shrink-0" />
                Templates Repository
              </RouterLink>
              <RouterLink
                to="/web-forms/submissions"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/web-forms/submissions' ? 'bg-sidebar-accent text-sidebar-foreground font-semibold' : 'text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                ]"
              >
                <Inbox class="w-4 h-4 flex-shrink-0" />
                Submissions
              </RouterLink>
            </div>
          </nav>

          <nav v-else class="space-y-1 text-sm font-medium">
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-primary">
              <span class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              All Records
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
              <span class="w-2 h-2 rounded-full bg-rail-muted-foreground/30 flex-shrink-0"></span>
              Recently Viewed
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-rail-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
              <span class="w-2 h-2 rounded-full bg-rail-muted-foreground/30 flex-shrink-0"></span>
              Favorites
            </a>
          </nav>
        </div>
      </aside>
    </transition>

    <!-- ═══════════════════════════════════════════════
         MAIN CONTENT AREA
    ════════════════════════════════════════════════ -->
    <main class="flex-1 h-full flex flex-col min-w-0">

      <!-- Top Header -->
      <header class="h-16 bg-rail border-b border-rail-border flex items-center justify-between px-6 flex-shrink-0">
        <div class="font-medium text-rail-foreground flex items-center gap-2">
          <!-- Re-open inner sidebar (shown when closed on routes that have one) -->
          <button
            v-if="hasInnerSidebar && !isInnerSidebarOpen"
            @click="isInnerSidebarOpen = true"
            title="Open side panel"
            class="p-1.5 rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-colors cursor-pointer mr-1"
          >
            <PanelLeftOpen class="w-4 h-4" />
          </button>
          <!-- Dynamic breadcrumb -->
          <span class="text-xs text-rail-muted-foreground font-normal hidden sm:inline">RakanSales</span>
          <span class="text-xs text-rail-muted-foreground font-normal hidden sm:inline">/</span>
          <span class="text-sm font-semibold text-rail-foreground">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="relative text-rail-muted-foreground hover:text-rail-foreground transition-colors">
            <Bell class="w-5 h-5" />
            <span class="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-rail"></span>
          </button>
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30">
            JS
          </div>
        </div>
      </header>

      <!-- Scrollable Canvas -->
      <div :class="[
        'flex-1 min-w-0 min-h-0',
        route.path === '/omnichannel' ? 'overflow-hidden p-0 bg-background' : 'overflow-auto bg-background p-4 lg:p-6'
      ]">
        <RouterView />
      </div>
    </main>

  </div>
</template>
