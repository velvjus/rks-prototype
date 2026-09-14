<template>
  <div class="space-y-3.5 animate-in fade-in-50 duration-300">
    <!-- Header -->
    <div class="text-left">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Choose your plan</h2>
          <p class="text-xs text-gray-500 mt-0.5 leading-normal">Start with a 14-day free trial of Pro. Change or cancel anytime.</p>
        </div>

        <!-- Monthly / Annual Toggle -->
        <div class="inline-flex items-center bg-gray-100 p-0.5 rounded-lg self-start sm:self-auto border border-gray-200/60 shadow-2xs">
          <button
            type="button"
            @click="data.billingCycle = 'monthly'"
            :class="[
              'px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer',
              data.billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-xs font-semibold'
                : 'text-gray-500 hover:text-gray-900 font-medium'
            ]"
          >
            Monthly
          </button>
          <button
            type="button"
            @click="data.billingCycle = 'yearly'"
            :class="[
              'px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer flex items-center gap-1',
              data.billingCycle === 'yearly'
                ? 'bg-[#23B750] text-white shadow-xs font-semibold'
                : 'text-gray-600 hover:text-gray-900 font-medium'
            ]"
          >
            <span>Yearly</span>
            <span :class="data.billingCycle === 'yearly' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'" class="text-[9px] px-1 py-0.2 rounded font-bold">
              -20%
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Plan Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <div
        v-for="plan in plans"
        :key="plan.id"
        @click="data.selectedPlan = plan.id"
        :class="[
          'relative rounded-xl p-3 sm:p-3.5 border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group',
          data.selectedPlan === plan.id
            ? 'border-[#23B750] bg-white ring-1 ring-[#23B750] shadow-2xs'
            : 'border-gray-200/90 bg-white hover:border-gray-300'
        ]"
      >
        <!-- Top Badge if featured -->
        <div v-if="plan.featured" class="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span class="bg-[#23B750] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-xs">
            14-Day Free Trial
          </span>
        </div>

        <div>
          <!-- Plan Header -->
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-gray-900">{{ plan.name }}</h3>
            <div
              :class="[
                'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                data.selectedPlan === plan.id
                  ? 'bg-[#23B750] text-white shadow-2xs'
                  : 'border border-gray-300 text-transparent'
              ]"
            >
              <Check v-if="data.selectedPlan === plan.id" class="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
          </div>
          <p class="text-[10px] text-gray-500 mt-0.5 leading-tight line-clamp-1">{{ plan.tagline }}</p>

          <!-- Pricing -->
          <div class="mt-2.5 pb-2.5 border-b border-gray-100">
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-bold text-gray-900 tracking-tight">
                {{ data.billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice }}
              </span>
              <span class="text-[10px] text-gray-400 font-medium">/mo</span>
            </div>
            <p v-if="data.billingCycle === 'yearly'" class="text-[10px] text-emerald-700 font-medium mt-0.5">
              Save {{ plan.savings }}
            </p>
            <p v-else class="text-[10px] text-gray-400 font-medium mt-0.5">
              Billed monthly
            </p>
          </div>

          <!-- Feature List -->
          <div class="mt-2.5 space-y-1.5">
            <div class="flex items-center gap-1.5 text-[11px] text-gray-700">
              <Users class="w-3 h-3 text-[#23B750] shrink-0" />
              <span class="font-medium"><strong>{{ plan.agents }}</strong> Team Members</span>
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-gray-700">
              <MessageSquare class="w-3 h-3 text-[#23B750] shrink-0" />
              <span class="font-medium"><strong>{{ plan.inboxes }}</strong> Inboxes</span>
            </div>
            <div v-for="feat in plan.features" :key="feat" class="flex items-center gap-1.5 text-[11px] text-gray-600">
              <Check class="w-2.5 h-2.5 text-emerald-700 stroke-[2.5] shrink-0" />
              <span class="truncate">{{ feat }}</span>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2">
          <div
            :class="[
              'w-full py-1.5 rounded-lg text-xs font-semibold text-center transition-all',
              data.selectedPlan === plan.id
                ? 'bg-[#23B750] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200/80'
            ]"
          >
            {{ data.selectedPlan === plan.id ? 'Selected' : 'Select Plan' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Data Switch -->
    <div class="p-2.5 sm:p-3 bg-gray-50/80 border border-gray-200/80 rounded-xl flex items-center justify-between gap-3 text-left">
      <div class="space-y-0.5">
        <div class="flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-[#23B750]" />
          <span class="text-xs font-semibold text-gray-900">Include sample CRM data (Recommended)</span>
        </div>
        <p class="text-[11px] text-gray-500">
          Load sample contacts, pipeline deals, and chats so you can explore immediately.
        </p>
      </div>

      <label class="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          v-model="data.prepopulateDemoData"
          class="sr-only peer"
        />
        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#23B750] shadow-2xs"></div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Users, MessageSquare, Check, Sparkles } from 'lucide-vue-next';

interface PlanData {
  selectedPlan: string;
  billingCycle: 'monthly' | 'yearly';
  prepopulateDemoData: boolean;
}

const props = defineProps<{
  modelValue: PlanData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: PlanData): void;
}>();

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Great for solo founders and small boutique sales teams.',
    monthlyPrice: 'RM 49',
    yearlyPrice: 'RM 39',
    savings: 'RM 120/yr',
    agents: '3',
    inboxes: '1',
    featured: false,
    features: [
      '1 shared WhatsApp inbox',
      'Visual sales pipeline & deals',
      'Contact tagging & quick notes',
      'Standard email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Best for growing sales teams closing high-velocity leads.',
    monthlyPrice: 'RM 149',
    yearlyPrice: 'RM 119',
    savings: 'RM 360/yr',
    agents: '15',
    inboxes: '5',
    featured: true,
    features: [
      'Everything in Starter',
      'Official WhatsApp API & QR link',
      'AI auto-replies & follow-up reminders',
      'Smart lead assignment to team',
      'Website live chat widget',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For larger organizations needing dedicated setup and scale.',
    monthlyPrice: 'RM 399',
    yearlyPrice: 'RM 319',
    savings: 'RM 960/yr',
    agents: 'Unlimited',
    inboxes: 'Unlimited',
    featured: false,
    features: [
      'Everything in Pro',
      'Unlimited WhatsApp inboxes',
      'Custom AI product knowledge base',
      'Dedicated onboarding manager',
      'Custom role permissions',
      '24/7 VIP SLA support',
    ],
  },
];
</script>
