<template>
  <div class="h-full flex flex-col min-h-0 bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
    <!-- Top Sticky Header -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-3 min-w-0">
        <router-link
          to="/partner/program"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          title="Return to Partner Program"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Partner Program</span>
        </router-link>

        <div class="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>

        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Partner Enablement Kit
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] border border-emerald-200/60 dark:border-emerald-800/60">
              Official Assets
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Co-marketing materials, sales battlecards, pitch decks, and brand lockups
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="downloadAll"
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
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
        <div class="relative bg-gradient-to-br from-gray-900 via-[#0E131F] to-gray-900 text-white rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-xl overflow-hidden">
          <div class="absolute -top-24 -right-24 w-80 h-80 bg-[#23B750]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 max-w-2xl space-y-2">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              <Package class="w-3 h-3 text-[#23B750]" />
              <span>Partner Toolkit 2026</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight">Everything You Need to Introduce & Close Deals</h2>
            <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
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
                ? 'bg-[#23B750] text-white shadow-xs'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
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
            class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-5 shadow-xs hover:border-[#23B750]/50 transition-all flex flex-col justify-between group space-y-4"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {{ asset.format }} &bull; {{ asset.size }}
                </span>
                <span class="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                  {{ asset.category }}
                </span>
              </div>

              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#23B750] transition-colors">
                  {{ asset.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {{ asset.description }}
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span class="text-[11px] text-gray-400 dark:text-gray-500">Updated March 2026</span>
              <button
                @click="downloadAsset(asset.title)"
                class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-[#23B750] hover:text-white dark:hover:bg-[#23B750] dark:hover:text-white rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
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
        class="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-gray-700"
      >
        <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
        <span>{{ toastMessage }}</span>
        <button @click="toastMessage = ''" class="ml-2 text-gray-400 hover:text-white cursor-pointer" aria-label="Dismiss toast">✕</button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeft, Download, Package } from 'lucide-vue-next';

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

const assets = [
  {
    id: 1,
    title: 'Partner Pitch Deck 2026',
    category: 'Decks',
    format: 'PDF',
    size: '14.2 MB',
    description: 'Executive slides highlighting CRM ROI, omnichannel WhatsApp capabilities, and e-Invoicing compliance.'
  },
  {
    id: 2,
    title: 'Brand Assets & Logo Kit',
    category: 'Brand',
    format: 'ZIP',
    size: '28.5 MB',
    description: 'High-resolution SVGs, dark/light lockups, badges, and co-branding guidelines.'
  },
  {
    id: 3,
    title: 'WhatsApp Sales Scripts & Follow-ups',
    category: 'Scripts',
    format: 'DOCX',
    size: '1.8 MB',
    description: 'Battle-tested WhatsApp message templates proven to convert SME inbound inquiries.'
  },
  {
    id: 4,
    title: 'CRM Competitive Battlecard',
    category: 'Battlecards',
    format: 'PDF',
    size: '4.1 MB',
    description: 'Feature-by-feature comparison against HubSpot, Salesforce, and Zoho for Malaysian SMEs.'
  },
  {
    id: 5,
    title: 'One-Page Executive Solution Brief',
    category: 'Decks',
    format: 'PDF',
    size: '2.4 MB',
    description: 'Print-ready PDF overview detailing pricing tiers, onboarding timelines, and customer success.'
  },
  {
    id: 6,
    title: 'Email Sequence Templates',
    category: 'Scripts',
    format: 'DOCX',
    size: '1.2 MB',
    description: '5-part nurturing email sequence for introducing RakanSales to existing corporate clients.'
  }
];

const filteredAssets = computed(() => {
  if (activeCategory.value === 'All') return assets;
  return assets.filter(a => a.category === activeCategory.value);
});
</script>
