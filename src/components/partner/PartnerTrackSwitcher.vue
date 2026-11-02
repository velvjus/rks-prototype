<template>
  <div class="absolute bottom-5 left-5 z-40 select-none">
    <div
      class="inline-flex items-center p-1 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg text-xs"
      role="tablist"
      aria-label="Partner track switcher"
    >
      <button
        type="button"
        role="tab"
        :aria-selected="partnerStore.activeTrack === 'referral'"
        @click="partnerStore.setTrack('referral')"
        :class="[
          'px-2.5 py-1 rounded-lg font-semibold text-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info',
          partnerStore.activeTrack === 'referral'
            ? 'bg-info text-info-foreground shadow-2xs'
            : 'text-muted-foreground hover:text-foreground'
        ]"
        title="Switch to Referral Partner Track (Affiliate)"
      >
        <Link2 class="w-3.5 h-3.5" />
        <span>Referral</span>
      </button>

      <button
        type="button"
        role="tab"
        :aria-selected="partnerStore.activeTrack === 'sales'"
        @click="partnerStore.setTrack('sales')"
        :class="[
          'px-2.5 py-1 rounded-lg font-semibold text-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          partnerStore.activeTrack === 'sales'
            ? 'bg-brand text-brand-foreground shadow-2xs'
            : 'text-muted-foreground hover:text-foreground'
        ]"
        title="Switch to Sales Partner Track (B2B Reseller)"
      >
        <Briefcase class="w-3.5 h-3.5" />
        <span>Sales</span>
      </button>
    </div>

    <!-- Floating Toast Notification on Track Switch -->
    <teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="partnerStore.toastMessage"
          class="fixed bottom-6 right-6 z-[100] max-w-sm bg-popover/95 text-popover-foreground border border-border rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 backdrop-blur-xl animate-in fade-in"
        >
          <div
            class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            :class="partnerStore.activeTrack === 'sales' ? 'bg-brand/20 text-brand' : 'bg-info/20 text-info'"
          >
            <component :is="partnerStore.activeTrack === 'sales' ? Briefcase : Link2" class="w-3.5 h-3.5" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-foreground">{{ partnerStore.toastMessage }}</p>
          </div>
          <button
            @click="partnerStore.toastMessage = null"
            class="text-muted-foreground hover:text-foreground text-xs p-1 cursor-pointer"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { usePartnerStore } from '@/stores/partner';
import { Briefcase, Link2 } from 'lucide-vue-next';

const partnerStore = usePartnerStore();
</script>
