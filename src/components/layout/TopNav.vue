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
      <!-- Circle Help Utility (Question Mark Icon) -->
      <DropdownMenu v-model:open="isHelpDropdownOpen">
        <DropdownMenuTrigger as-child>
          <button
            class="relative p-1.5 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400 cursor-pointer"
            :class="isHelpDropdownOpen ? 'text-white bg-gray-800 ring-1 ring-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
            :title="`Help for ${pageContext.name}`"
            aria-label="Help and resources"
          >
            <CircleHelp class="w-[18px] h-[18px]" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          :side-offset="8"
          class="w-72 bg-white border border-gray-200 text-gray-800 shadow-xl rounded-xl p-1.5 z-[70]"
        >
          <!-- Current Page Context Header -->
          <div class="px-2.5 py-2 border-b border-gray-100 mb-1">
            <div class="flex items-center justify-between gap-1.5">
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Page Assistance</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                {{ pageContext.name }}
              </span>
            </div>
            <p class="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {{ pageContext.summary }}
            </p>
          </div>

          <!-- Options -->
          <div class="space-y-0.5">
            <!-- 1. Open Wiki -->
            <DropdownMenuItem
              @click="handleOpenWiki"
              class="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-800 transition-colors"
            >
              <BookOpen class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-gray-900">Open Wiki</span>
                  <ExternalLink class="w-3 h-3 text-gray-400" />
                </div>
                <p class="text-[11px] text-gray-500">Browse general knowledge base & user guides</p>
              </div>
            </DropdownMenuItem>

            <!-- 2. How to use page -->
            <DropdownMenuItem
              @click="handleHowToUse"
              class="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-800 transition-colors"
            >
              <FileQuestion class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-gray-900">How to use page</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">Article</span>
                </div>
                <p class="text-[11px] text-gray-500">View quick article guide & walkthrough</p>
              </div>
            </DropdownMenuItem>

            <!-- 3. Page Tour -->
            <DropdownMenuItem
              @click="handlePageTour"
              class="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-800 transition-colors"
            >
              <Compass class="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-gray-900">Page Tour</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-100">Tour</span>
                </div>
                <p class="text-[11px] text-gray-500">Replay onboarding tour for this page</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator class="my-1 bg-gray-100" />

            <!-- 4. Ask RakanAI -->
            <DropdownMenuItem
              @click="handleAskAI"
              class="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-emerald-50/70 focus:bg-emerald-50/70 text-gray-800 transition-colors group"
            >
              <Sparkles class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-emerald-800">Ask RakanAI</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">AI</span>
                </div>
                <p class="text-[11px] text-gray-500">Ask questions relevant to this page</p>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

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

    <!-- How To Use Modal Popup Dialog -->
    <Dialog :open="isHowToUseOpen" @update:open="isHowToUseOpen = $event">
      <DialogContent class="max-w-md bg-white border border-gray-200 text-gray-900 p-6 rounded-2xl shadow-2xl z-[80]">
        <DialogHeader>
          <div class="flex items-center gap-2 mb-1">
            <span class="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <BookOpen class="w-4 h-4" />
            </span>
            <span class="text-[10px] uppercase tracking-wider font-bold text-gray-500">Page Documentation</span>
          </div>
          <DialogTitle class="text-base font-bold text-gray-900 flex items-center justify-between">
            <span>How to use {{ pageContext.name }}</span>
          </DialogTitle>
          <DialogDescription class="text-xs text-gray-500">
            Guide and key actions for the {{ pageContext.name }} workspace.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-3.5 my-2">
          <!-- Overview Card -->
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs text-gray-700 leading-relaxed">
            {{ pageContext.articleOverview }}
          </div>

          <!-- Key Highlights -->
          <div>
            <h4 class="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">Key Highlights</h4>
            <ul class="space-y-1.5 text-xs text-gray-600">
              <li v-for="(tip, i) in pageContext.tips" :key="i" class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold mt-0.5 text-xs">✓</span>
                <span class="text-gray-700">{{ tip }}</span>
              </li>
            </ul>
          </div>

          <!-- Prototype Notice -->
          <div class="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg flex items-center gap-2 text-[11px] text-blue-700">
            <Sparkles class="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Interactive prototype. Real documentation is synced with your RakanSales Wiki.</span>
          </div>
        </div>

        <DialogFooter class="flex sm:justify-between items-center gap-2 pt-3 border-t border-gray-100 mt-2">
          <button
            @click="openWikiFromModal"
            class="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
          >
            <span>Open directly in Wiki</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </button>
          <button
            @click="isHowToUseOpen = false"
            class="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Got it
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  CircleHelp,
  BookOpen,
  ExternalLink,
  FileQuestion,
  Compass,
  Sparkles,
} from 'lucide-vue-next';
import { useUIStore } from '@/stores/ui';
import logomarkColoredUrl from '@/assets/logo/RKS Logomark 01.svg';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'vue-sonner';

const ui = useUIStore();
const route = useRoute();
const searchInput = ref<HTMLInputElement | null>(null);
const isMac = typeof window !== 'undefined' && window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const isHelpDropdownOpen = ref(false);
const isHowToUseOpen = ref(false);

interface PageContextInfo {
  name: string;
  summary: string;
  articleOverview: string;
  tips: string[];
  wikiSlug: string;
}

const pageContext = computed<PageContextInfo>(() => {
  const path = route.path;

  if (path.startsWith('/web-forms/builder')) {
    return {
      name: 'Form Builder',
      summary: 'Design, configure, and publish dynamic forms.',
      articleOverview: 'The Form Builder allows you to drag and drop form fields, customize question validation, configure lead routing, and publish shareable links or embeds.',
      tips: [
        'Add custom fields matching your CRM schema',
        'Configure redirection or thank-you notices after submission',
        'Test field logic in the interactive preview mode'
      ],
      wikiSlug: 'web-forms-builder'
    };
  }

  if (path.startsWith('/web-forms/templates')) {
    return {
      name: 'Form Templates',
      summary: 'Manage reusable web form blueprints and presets.',
      articleOverview: 'Form Templates provide ready-to-use layouts for contact forms, event signups, and customer surveys.',
      tips: [
        'Preview template layouts before deploying',
        'Clone templates to rapidly spin up campaign-specific variants',
        'Standardize field definitions across teams'
      ],
      wikiSlug: 'web-forms-templates'
    };
  }

  if (path.startsWith('/web-forms/submissions')) {
    return {
      name: 'Form Submissions',
      summary: 'Inspect submitted responses and captured lead data.',
      articleOverview: 'Review all incoming responses from published forms with submission timelines, metadata, and export capabilities.',
      tips: [
        'Filter responses by form title or submission date range',
        'Inspect raw answers and lead contact conversion status',
        'Export submissions to CSV for offline analysis'
      ],
      wikiSlug: 'web-forms-submissions'
    };
  }

  if (path.startsWith('/web-forms')) {
    return {
      name: 'Web Forms',
      summary: 'Manage lead generation forms and submissions.',
      articleOverview: 'Web Forms collect visitor inquiries and automatically convert them into CRM contacts, companies, or pipeline deals based on your routing rules.',
      tips: [
        'View form performance and conversion rates',
        'Export submissions or browse detailed response histories',
        'Duplicate form templates to accelerate campaign creation'
      ],
      wikiSlug: 'web-forms'
    };
  }

  if (path.startsWith('/omnichannel')) {
    return {
      name: 'Conversations',
      summary: 'Unified customer messaging across channels.',
      articleOverview: 'The Conversations module consolidates inquiries from WhatsApp, Support Email, Instagram, and Website Chat into a single triage inbox.',
      tips: [
        'Assign conversations to team agents or automated bots',
        'Use canned responses for repetitive customer inquiries',
        'Apply labels and SLA timers to track inquiry resolution'
      ],
      wikiSlug: 'conversations'
    };
  }

  if (path.startsWith('/contacts/scan-namecard')) {
    return {
      name: 'Scan Name Card',
      summary: 'Simulate business card scanning & OCR extraction.',
      articleOverview: 'Upload or simulate camera capture of printed business cards to automatically extract contact names, phone numbers, and company affiliations.',
      tips: [
        'Verify extracted fields before saving to CRM contacts',
        'Automatically link newly detected company names',
        'Trigger follow-up greeting templates'
      ],
      wikiSlug: 'scan-namecard'
    };
  }

  if (path.startsWith('/contacts')) {
    return {
      name: 'Contacts',
      summary: 'Manage customer contacts and relationships.',
      articleOverview: 'The Contacts directory aggregates all individual stakeholders, phone numbers, email histories, activity timelines, and custom attributes.',
      tips: [
        'Quickly simulate or upload name card scans',
        'Filter contacts by custom tags, status, or lead stage',
        'View linked deals, companies, and interaction notes'
      ],
      wikiSlug: 'contacts'
    };
  }

  if (path.startsWith('/companies')) {
    return {
      name: 'Companies',
      summary: 'Track corporate accounts and organizations.',
      articleOverview: 'Organize target accounts and business organizations. Associate multiple contacts, track deal sizes, and monitor company-level engagement.',
      tips: [
        'Associate primary decision makers with the company account',
        'Track total contract values across all associated deals',
        'Store corporate identification and billing addresses'
      ],
      wikiSlug: 'companies'
    };
  }

  if (path.startsWith('/deals')) {
    return {
      name: 'Deals',
      summary: 'Monitor pipeline stages and sales progress.',
      articleOverview: 'The Deals board offers Kanban and list perspectives to visualize sales momentum, stage transition rules, and forecasted close dates.',
      tips: [
        'Drag deals across stages to update status and probability',
        'Filter pipeline by team member or expected closing month',
        'Review stage velocity and deal value totals'
      ],
      wikiSlug: 'deals'
    };
  }

  if (path.startsWith('/events')) {
    return {
      name: 'Events',
      summary: 'Coordinate team events and demonstrations.',
      articleOverview: 'Schedule and manage client presentations, sales demos, and team milestones with calendar integration and attendee tracking.',
      tips: [
        'Synchronize schedules with your external calendars',
        'Attach linked contacts and deal records to calendar events',
        'Set automated reminders for upcoming milestones'
      ],
      wikiSlug: 'events'
    };
  }

  if (path.startsWith('/appointments')) {
    return {
      name: 'Appointments',
      summary: 'Manage online bookings and booking pages.',
      articleOverview: 'Enable leads and clients to schedule meetings directly based on your team availability and buffer preferences.',
      tips: [
        'Configure working hours and buffer intervals between sessions',
        'Share customized booking links with clients',
        'Review upcoming and past appointment bookings'
      ],
      wikiSlug: 'appointments'
    };
  }

  if (path.startsWith('/settings')) {
    return {
      name: 'Settings',
      summary: 'Configure workspace, inboxes, and AI bots.',
      articleOverview: 'Manage global workspace preferences including omnichannel inboxes, agent assignments, security roles, and AI training history.',
      tips: [
        'Configure inboxes for WhatsApp, email, and web chat',
        'Review audit logs and member security roles',
        'Manage AI training documents and assistant behavior'
      ],
      wikiSlug: 'settings'
    };
  }

  if (path.startsWith('/design-system')) {
    return {
      name: 'Design System',
      summary: 'RakanSales component library and UI tokens.',
      articleOverview: 'Explore all UI components, color palettes, typography scales, buttons, and design tokens used throughout RakanSales.',
      tips: [
        'Preview theme variants and interactive controls',
        'Inspect typography and spacing standards',
        'Check accessible contrast and icon implementations'
      ],
      wikiSlug: 'design-system'
    };
  }

  if (path.startsWith('/guidelines')) {
    return {
      name: 'Guidelines',
      summary: 'Operational and styling standards documentation.',
      articleOverview: 'Review company design and architecture guidelines, workflow patterns, and user experience conventions.',
      tips: [
        'Consult UI/UX best practices and patterns',
        'Review navigation and layout rules',
        'Follow prototype implementation standards'
      ],
      wikiSlug: 'guidelines'
    };
  }

  return {
    name: 'Dashboard',
    summary: 'Executive overview of workspace metrics and KPIs.',
    articleOverview: 'The Dashboard gives a bird-eye view of your sales performance, live conversations, active deals, and recent lead activities.',
    tips: [
      'Monitor key performance indicators in real time',
      'Jump directly to high-priority conversations or deals',
      'Filter metrics across selectable date ranges'
    ],
    wikiSlug: 'dashboard'
  };
});

function handleOpenWiki() {
  isHelpDropdownOpen.value = false;
  toast.info('Open Wiki', {
    description: 'Opening the general RakanSales Wiki & Knowledge Base (/wiki).',
  });
}

function handleHowToUse() {
  isHelpDropdownOpen.value = false;
  isHowToUseOpen.value = true;
}

function openWikiFromModal() {
  isHowToUseOpen.value = false;
  toast.info('Opening Wiki', {
    description: `Opening direct wiki article: /wiki/${pageContext.value.wikiSlug}`,
  });
}

function handlePageTour() {
  isHelpDropdownOpen.value = false;
  toast.success('Page Tour', {
    description: `Replaying interactive onboarding tour for "${pageContext.value.name}".`,
  });
}

function handleAskAI() {
  isHelpDropdownOpen.value = false;
  toast('RakanAI Assistant', {
    description: `RakanAI activated with context for "${pageContext.value.name}". Ask any question!`,
  });
}

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
