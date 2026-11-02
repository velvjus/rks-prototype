<template>
  <div class="h-full flex flex-col min-h-0 bg-background text-foreground font-sans transition-colors duration-200">
    <!-- Top Sticky Header -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-3 min-w-0">
        <router-link
          to="/partner/program"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
          title="Return to Partner Program"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Partner Program</span>
        </router-link>

        <div class="h-4 w-px bg-border"></div>

        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Partner Enablement Kit
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
              Official Assets
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            Co-marketing materials, sales battlecards, pitch decks, and brand lockups
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="downloadAll"
          class="px-3.5 py-1.5 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Download All (.ZIP)</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 min-h-0 overflow-y-auto w-full [scrollbar-gutter:stable]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">

        <!-- Banner Card -->
        <div class="relative bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border shadow-xl overflow-hidden">
          <div class="absolute -top-24 -right-24 w-80 h-80 bg-brand/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 max-w-2xl space-y-2">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success/15 text-success border border-success/30">
              <Package class="w-3 h-3 text-brand" />
              <span>Partner Toolkit 2026</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight">Everything You Need to Introduce & Close Deals</h2>
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Equip your advisory meetings and outreach campaigns with verified product decks, WhatsApp outreach templates, customer objection battlecards, and official vector logos.
            </p>
          </div>
        </div>

        <!-- Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            v-for="filter in ['All', 'Decks', 'Scripts', 'Brand', 'Battlecards']"
            :key="filter"
            @click="activeCategory = filter"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeCategory === filter
                ? 'bg-brand text-brand-foreground shadow-xs'
                : 'bg-card text-muted-foreground border border-border hover:bg-muted'
            ]"
          >
            {{ filter }}
          </button>
        </div>

        <!-- Asset Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="asset in filteredAssets"
            :key="asset.id"
            class="bg-card border border-border rounded-2xl p-5 shadow-xs hover:border-brand/50 transition-all flex flex-col justify-between group space-y-4"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-muted text-foreground">
                  {{ asset.format }} · {{ asset.size }}
                </span>
                <span class="text-[11px] font-semibold text-muted-foreground">
                  {{ asset.category }}
                </span>
              </div>

              <div>
                <h3 class="text-sm font-bold text-foreground group-hover:text-brand transition-colors">
                  {{ asset.title }}
                </h3>
                <p class="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {{ asset.description }}
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-border flex items-center justify-between">
              <span class="text-[11px] text-muted-foreground">Updated March 2026</span>
              <button
                @click="downloadAsset(asset.title)"
                class="px-3 py-1.5 text-xs font-semibold text-foreground bg-muted hover:bg-brand hover:text-brand-foreground rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Download class="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Notification Toast -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="toastMessage"
        class="fixed top-4 right-4 z-50 bg-popover text-popover-foreground px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-border"
      >
        <span class="w-2 h-2 rounded-full bg-brand"></span>
        <span>{{ toastMessage }}</span>
        <button @click="toastMessage = ''" class="ml-2 text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Dismiss toast">✕</button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePartnerStore } from '@/stores/partner';
import { ArrowLeft, Download, Package, Shield, FileText } from 'lucide-vue-next';

const partnerStore = usePartnerStore();
const activeCategory = ref('All');
const toastMessage = ref('');
let toastTimer: number | null = null;

function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
}

function downloadAsset(title: string) {
  showToast(`Downloading "${title}"...`);
}

function downloadAll() {
  showToast('Packaging all enablement assets into a .ZIP archive...');
}

const referralAssets = [
  {
    id: 1,
    title: 'Referral Partner Quickstart Deck 2026',
    category: 'Decks',
    format: 'PDF',
    size: '14.2 MB',
    description: 'Executive slides highlighting CRM ROI, omnichannel WhatsApp capabilities, and e-Invoicing compliance.'
  },
  {
    id: 2,
    title: 'Brand Assets & Social Badges Kit',
    category: 'Brand',
    format: 'ZIP',
    size: '28.5 MB',
    description: 'High-resolution SVGs, dark/light lockups, badges, and co-branding guidelines.'
  },
  {
    id: 3,
    title: 'WhatsApp Referral Scripts & Follow-ups',
    category: 'Scripts',
    format: 'DOCX',
    size: '1.8 MB',
    description: 'Battle-tested WhatsApp message templates proven to convert SME inbound inquiries.'
  },
  {
    id: 4,
    title: 'CRM Competitive Battlecard (Summary)',
    category: 'Battlecards',
    format: 'PDF',
    size: '4.1 MB',
    description: 'Feature-by-feature comparison against HubSpot, Salesforce, and Zoho for Malaysian SMEs.'
  },
  {
    id: 5,
    title: 'One-Page Product Solution Brief',
    category: 'Decks',
    format: 'PDF',
    size: '2.4 MB',
    description: 'Print-ready PDF overview detailing pricing tiers, onboarding timelines, and customer success.'
  },
  {
    id: 6,
    title: 'Email Sequence Templates for Affiliates',
    category: 'Scripts',
    format: 'DOCX',
    size: '1.2 MB',
    description: '5-part nurturing email sequence for introducing RakanSales to existing corporate clients.'
  }
];

const salesAssets = [
  {
    id: 101,
    title: 'Enterprise Reseller Pitch Deck (Customizable)',
    category: 'Decks',
    format: 'PPTX',
    size: '24.8 MB',
    description: 'Full 38-slide sales presentation with ROI modeling, WhatsApp CRM automation, and Malaysian e-Invoicing workflows.'
  },
  {
    id: 102,
    title: 'Enterprise CRM Battlecard: RakanSales vs HubSpot & Salesforce',
    category: 'Battlecards',
    format: 'PDF',
    size: '5.6 MB',
    description: 'Comprehensive objection handling, feature matrix, and TCO cost justification tailored for ASEAN B2B.'
  },
  {
    id: 103,
    title: 'PDPA Compliance & Cloud Security Technical Whitepaper',
    category: 'Decks',
    format: 'PDF',
    size: '8.4 MB',
    description: 'Essential compliance documentation for enterprise IT procurement, data sovereignty, and encryption standards.'
  },
  {
    id: 104,
    title: 'Reseller Commercial Terms & 20% Margin Schedule',
    category: 'Brand',
    format: 'PDF',
    size: '3.1 MB',
    description: 'Official partner contract parameters, 120-day domain registration rules, and tier advancement criteria.'
  },
  {
    id: 105,
    title: 'Technical Discovery & Webhook RFP Questionnaire',
    category: 'Scripts',
    format: 'XLSX',
    size: '2.2 MB',
    description: 'Client scoping template to assess ERP integration requirements, WhatsApp Business API numbers, and seat count.'
  },
  {
    id: 106,
    title: 'Enterprise Closing Playbook & Objection Handling Guide',
    category: 'Scripts',
    format: 'PDF',
    size: '4.7 MB',
    description: 'Battle-tested negotiation frameworks, competitive comparisons against HubSpot & Salesforce, and procurement closing scripts.'
  }
];

const filteredAssets = computed(() => {
  const currentList = partnerStore.activeTrack === 'sales' ? salesAssets : referralAssets;
  if (activeCategory.value === 'All') return currentList;
  return currentList.filter(a => a.category === activeCategory.value);
});
</script>
