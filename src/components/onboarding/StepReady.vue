<template>
  <div class="space-y-3.5 animate-in fade-in-50 duration-300">
    <!-- Milestone Celebration Header -->
    <div class="text-center space-y-1.5 py-1">
      <div class="w-12 h-12 rounded-xl bg-emerald-100 text-[#23B750] mx-auto flex items-center justify-center shadow-xs ring-6 ring-emerald-50/80 animate-in zoom-in-95 duration-300">
        <Sparkles class="w-6 h-6" />
      </div>
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">You're all set!</h2>
      <p class="text-xs text-gray-500 max-w-md mx-auto leading-normal">
        Your <strong class="text-gray-900 font-semibold">{{ summary.business.businessName || 'RakanSales' }}</strong> workspace is ready. You can start chatting with leads and closing sales now.
      </p>
    </div>

    <!-- Core Setup Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left max-w-xl mx-auto">
      <!-- Plan -->
      <div class="p-2.5 sm:p-3 bg-white border border-gray-200/90 rounded-xl space-y-0.5 shadow-2xs hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-semibold text-gray-900">
            <div class="w-6 h-6 rounded-md bg-emerald-50 text-[#23B750] flex items-center justify-center">
              <CreditCard class="w-3.5 h-3.5" />
            </div>
            <span>Pro Plan Active</span>
          </div>
          <span class="w-4 h-4 rounded-full bg-emerald-100 text-[#23B750] flex items-center justify-center text-[10px]">
            <Check class="w-2.5 h-2.5 stroke-[2.5]" />
          </span>
        </div>
        <p class="text-[11px] text-gray-500 pl-8">14-day trial with Pro features unlocked</p>
      </div>

      <!-- Business Profile -->
      <div class="p-2.5 sm:p-3 bg-white border border-gray-200/90 rounded-xl space-y-0.5 shadow-2xs hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-semibold text-gray-900">
            <div class="w-6 h-6 rounded-md bg-emerald-50 text-[#23B750] flex items-center justify-center">
              <Building2 class="w-3.5 h-3.5" />
            </div>
            <span>Company Profile</span>
          </div>
          <span class="w-4 h-4 rounded-full bg-emerald-100 text-[#23B750] flex items-center justify-center text-[10px]">
            <Check class="w-2.5 h-2.5 stroke-[2.5]" />
          </span>
        </div>
        <p class="text-[11px] text-gray-500 pl-8">
          {{ summary.business.country }} · {{ summary.business.currency }}
        </p>
      </div>

      <!-- Team -->
      <div class="p-2.5 sm:p-3 bg-white border border-gray-200/90 rounded-xl space-y-0.5 shadow-2xs hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-semibold text-gray-900">
            <div class="w-6 h-6 rounded-md bg-emerald-50 text-[#23B750] flex items-center justify-center">
              <Users class="w-3.5 h-3.5" />
            </div>
            <span>Team Workspace</span>
          </div>
          <span class="w-4 h-4 rounded-full bg-emerald-100 text-[#23B750] flex items-center justify-center text-[10px]">
            <Check class="w-2.5 h-2.5 stroke-[2.5]" />
          </span>
        </div>
        <p class="text-[11px] text-gray-500 pl-8">{{ summary.team.members.length + 1 }} member(s) ready</p>
      </div>

      <!-- WhatsApp & Live Chat -->
      <div class="p-2.5 sm:p-3 bg-white border border-gray-200/90 rounded-xl space-y-0.5 shadow-2xs hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-semibold text-gray-900">
            <div class="w-6 h-6 rounded-md bg-emerald-50 text-[#23B750] flex items-center justify-center">
              <MessageSquare class="w-3.5 h-3.5" />
            </div>
            <span>Sales Channels</span>
          </div>
          <span
            v-if="summary.whatsapp.isConnected"
            class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]"
          >
            <Check class="w-2.5 h-2.5 stroke-[2.5]" />
          </span>
          <span
            v-else
            class="w-4 h-4 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold"
          >
            ✓
          </span>
        </div>
        <p class="text-[11px] text-gray-500 pl-8">
          {{ summary.whatsapp.isConnected ? 'WhatsApp connected' : 'Channels configured' }}
        </p>
      </div>
    </div>

    <!-- Helpful Tip Box -->
    <div class="max-w-xl mx-auto p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-left flex items-start gap-2.5">
      <div class="w-6 h-6 rounded-md bg-emerald-100 text-[#23B750] flex items-center justify-center shrink-0 mt-0.5">
        <Zap class="w-3.5 h-3.5" />
      </div>
      <div class="text-xs text-emerald-950 leading-normal">
        <span class="font-bold">Next tip:</span> Check your Omnichannel Inbox to see incoming conversations or view the Deals pipeline.
      </div>
    </div>

    <!-- Bottom Launch Actions -->
    <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
      <button
        type="button"
        @click="$emit('launch-crm')"
        class="w-full sm:w-auto h-10 px-6 bg-[#23B750] hover:bg-[#1fa347] active:bg-[#1b8e3e] text-white font-semibold text-xs rounded-xl shadow-[0_3px_10px_rgba(35,183,80,0.25)] hover:shadow-[0_4px_14px_rgba(35,183,80,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>Open Omnichannel Inbox</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        @click="$emit('launch-dashboard')"
        class="w-full sm:w-auto h-10 px-5 bg-gray-100/90 hover:bg-gray-200/80 text-gray-700 font-medium text-xs rounded-xl transition-all cursor-pointer border border-gray-200/60"
      >
        View Analytics Dashboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Sparkles,
  CreditCard,
  Building2,
  Users,
  MessageSquare,
  Zap,
  ArrowRight,
  Check,
} from 'lucide-vue-next';

defineProps<{
  summary: {
    business: any;
    plan: any;
    team: any;
    whatsapp: any;
    widget: any;
  };
}>();

defineEmits<{
  (e: 'launch-crm'): void;
  (e: 'launch-dashboard'): void;
}>();
</script>
