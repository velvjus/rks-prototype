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
  Briefcase
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// --- Outer Rail expand/collapse ---
const isRailExpanded = ref(true)
const railWidth = computed(() => isRailExpanded.value ? 'w-56' : 'w-16')

// --- Inner Sidebar visibility ---
const isInnerSidebarOpen = ref(true)
const hasInnerSidebar = computed(() => route.path !== '/omnichannel')

// --- Global dark mode (class-based, persisted to localStorage) ---
const isDark = ref(localStorage.getItem('rks-dark') === 'true')

const applyDark = (val: boolean) => {
  if (val) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('rks-dark', String(val))
}

// Apply on mount
applyDark(isDark.value)

const toggleDark = () => {
  isDark.value = !isDark.value
  applyDark(isDark.value)
}

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
]
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 dark:bg-background overflow-hidden text-sm">

    <!-- ═══════════════════════════════════════════════
         OUTER RAIL (Dark, expandable)
    ════════════════════════════════════════════════ -->
    <aside
      :class="[
        'h-full bg-gray-900 flex flex-col items-center py-4 flex-shrink-0 z-20 transition-all duration-250 ease-in-out',
        railWidth
      ]"
    >
      <!-- Logo Mark -->
      <div class="flex items-center gap-2 mb-6 px-3.5 w-full overflow-hidden">
        <img :src="logomarkColoredUrl" class="w-8 h-8 flex-shrink-0" alt="RakanSales Logomark" />
        <span
          v-if="isRailExpanded"
          class="text-white font-bold text-sm tracking-tight leading-none whitespace-nowrap overflow-hidden transition-all duration-200"
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
                'rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden',
                isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
              ]"
              active-class="!text-primary bg-gray-800"
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
                route.path.startsWith('/contacts') ? '!text-primary bg-gray-800 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
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
                :class="['w-4 h-4 transition-transform duration-200 ml-1 text-gray-400', isContactsExpanded ? 'rotate-90 text-white' : '']"
              />
            </button>

            <!-- Collapsed Rail Hover Flyout Menu -->
            <div
              v-if="!isRailExpanded"
              class="absolute left-full top-0 ml-2 w-48 bg-gray-900 border border-gray-800 rounded-lg p-2 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 flex flex-col gap-1"
            >
              <div class="px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Contacts
              </div>
              <RouterLink
                v-for="sub in item.subItems"
                :key="sub.to"
                :to="sub.to"
                :class="[
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                  route.path === sub.to ? 'text-primary bg-gray-800 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                ]"
              >
                <component :is="sub.icon" class="w-3.5 h-3.5 flex-shrink-0" />
                <span class="truncate">{{ sub.label }}</span>
              </RouterLink>
            </div>

            <!-- Expanded Rail Accordion Sub-items -->
            <div v-if="isRailExpanded && isContactsExpanded" class="ml-4 pl-3 border-l border-gray-800 mt-1 flex flex-col gap-1">
              <RouterLink
                v-for="sub in item.subItems"
                :key="sub.to"
                :to="sub.to"
                :class="[
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                  route.path === sub.to ? 'text-primary bg-gray-800/80 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
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
            'rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden w-full',
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
            'rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden w-full',
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
            'rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden w-full',
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
            'rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden w-full opacity-0 hover:opacity-100',
            isRailExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center',
          ]"
          active-class="!text-primary bg-gray-800 opacity-100"
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
            'rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden w-full mt-1 border-t border-gray-800 pt-3',
            isRailExpanded ? 'px-3 py-2' : 'p-2 justify-center',
          ]"
        >
          <component
            :is="isRailExpanded ? ChevronLeft : ChevronRight"
            class="w-4 h-4 flex-shrink-0"
          />
          <span v-if="isRailExpanded" class="text-xs font-medium whitespace-nowrap overflow-hidden text-gray-500">
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
        class="w-60 h-full bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col flex-shrink-0 z-10"
      >
        <!-- Sidebar Header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-border">
          <h2 class="font-semibold text-gray-800 dark:text-foreground text-sm">{{ pageTitle }}</h2>
          <button
            @click="isInnerSidebarOpen = false"
            title="Close side panel"
            class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
        </div>

        <div class="p-3">
          <!-- Search -->
          <div class="relative mb-4">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              class="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <nav v-if="route.path.startsWith('/contacts')" class="space-y-1 text-sm font-medium">
            <button
              @click="isContactsExpanded = !isContactsExpanded"
              class="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer"
            >
              <span>Contacts Menu</span>
              <ChevronDown :class="['w-3.5 h-3.5 transition-transform duration-200', isContactsExpanded ? 'rotate-180' : '']" />
            </button>
            
            <div v-if="isContactsExpanded" class="space-y-1 pt-1">
              <RouterLink
                to="/contacts"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/contacts' ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted'
                ]"
              >
                <UserCheck class="w-4 h-4 flex-shrink-0" />
                All Contacts
              </RouterLink>
              <RouterLink
                to="/contacts/scan-namecard"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/contacts/scan-namecard' ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted'
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
              class="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer"
            >
              <span>Web Forms Menu</span>
              <ChevronDown :class="['w-3.5 h-3.5 transition-transform duration-200', isWebFormsExpanded ? 'rotate-180' : '']" />
            </button>
            
            <div v-if="isWebFormsExpanded" class="space-y-1 pt-1">
              <RouterLink
                to="/web-forms"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/web-forms' ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted'
                ]"
              >
                <FileText class="w-4 h-4 flex-shrink-0" />
                All Web Forms
              </RouterLink>
              <RouterLink
                to="/web-forms/templates"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/web-forms/templates' ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted'
                ]"
              >
                <Layers class="w-4 h-4 flex-shrink-0" />
                Templates Repository
              </RouterLink>
              <RouterLink
                to="/web-forms/submissions"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  route.path === '/web-forms/submissions' ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted'
                ]"
              >
                <Inbox class="w-4 h-4 flex-shrink-0" />
                Submissions
              </RouterLink>
            </div>
          </nav>

          <nav v-else class="space-y-1 text-sm font-medium">
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100 dark:bg-muted text-primary">
              <span class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              All Records
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">
              <span class="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
              Recently Viewed
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">
              <span class="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
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
      <header class="h-16 bg-white dark:bg-card border-b border-gray-200 dark:border-border flex items-center justify-between px-6 flex-shrink-0">
        <div class="font-medium text-gray-800 dark:text-foreground flex items-center gap-2">
          <!-- Re-open inner sidebar (shown when closed on routes that have one) -->
          <button
            v-if="hasInnerSidebar && !isInnerSidebarOpen"
            @click="isInnerSidebarOpen = true"
            title="Open side panel"
            class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-muted transition-colors cursor-pointer mr-1"
          >
            <PanelLeftOpen class="w-4 h-4" />
          </button>
          <!-- Dynamic breadcrumb -->
          <span class="text-xs text-muted-foreground font-normal hidden sm:inline">RakanSales</span>
          <span class="text-xs text-muted-foreground font-normal hidden sm:inline">/</span>
          <span class="text-sm font-semibold text-gray-800 dark:text-foreground">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="relative text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground transition-colors">
            <Bell class="w-5 h-5" />
            <span class="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-white dark:border-card"></span>
          </button>
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30">
            JS
          </div>
        </div>
      </header>

      <!-- Scrollable Canvas -->
      <div :class="[
        'flex-1 min-w-0 min-h-0',
        route.path === '/omnichannel' ? 'overflow-hidden p-0 bg-white dark:bg-background' : 'overflow-auto bg-gray-50 dark:bg-background p-4 lg:p-6'
      ]">
        <RouterView />
      </div>
    </main>

  </div>
</template>
