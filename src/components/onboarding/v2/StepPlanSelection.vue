<template>
  <div class="space-y-4 max-w-6xl mx-auto w-full">
    <!-- Section Header & Billing Switcher (Compact Viewport Height & Polished Typography) -->
    <div class="text-center max-w-xl mx-auto space-y-1.5 shrink-0">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Choose your plan
      </h2>
      <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
        Transparent pricing built to scale with your sales team. Switch or cancel anytime.
      </p>

      <!-- Billing Cycle Toggle -->
      <div class="pt-1.5 inline-flex items-center">
        <div class="inline-flex items-center p-1 bg-gray-100/90 rounded-xl border border-gray-200/80 text-xs shadow-2xs">
          <button
            type="button"
            @click="billingCycle = 'monthly'"
            :class="[
              'px-3.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs',
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            Monthly
          </button>
          <button
            type="button"
            @click="billingCycle = 'yearly'"
            :class="[
              'px-3.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 text-xs',
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <span>Yearly</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold tracking-wide shadow-2xs">
              Save up to 25%
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- 4 Plan Cards Grid (Balanced Typographic Hierarchy & Tactile Hover States) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch w-full">
      <div
        v-for="plan in planList"
        :key="plan.id"
        @click="selectedPlan = plan.id"
        :class="[
          'rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden bg-white group select-none',
          selectedPlan === plan.id
            ? 'border-[#23B750] ring-2 ring-[#23B750]/20 shadow-md -translate-y-1'
            : 'border-gray-200/90 hover:border-gray-400/80 hover:shadow-md hover:-translate-y-1'
        ]"
      >
        <!-- Top Colored Header Block -->
        <div :class="[plan.headerBg, 'px-4 py-3.5 text-white shrink-0 flex flex-col justify-between relative min-h-[102px]']">
          <!-- Title & Badges (Font weight reduced from bold to semibold) -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-semibold tracking-tight text-white">{{ plan.name }}</h3>
              <span
                v-if="plan.popularBadge"
                class="text-[10px] font-semibold tracking-wide bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs"
              >
                {{ plan.popularBadge }}
              </span>
            </div>
          </div>

          <!-- Price & Annual Billing Subtext (Price font weight reduced from extrabold to bold, dynamic 25% off per month value) -->
          <div class="mt-2">
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl sm:text-3xl font-bold tracking-tight leading-none text-white tabular-nums">
                {{ billingCycle === 'yearly' ? plan.yearlyMonthlyPrice : plan.monthlyPrice }}
              </span>
              <span v-if="plan.period" class="text-xs text-white/85 font-medium">
                {{ plan.period }}
              </span>
            </div>

            <div class="text-[11px] text-white/90 font-medium mt-1 leading-snug">
              <template v-if="billingCycle === 'yearly' && plan.yearlyDiscounted">
                Billed annually:
                <span class="line-through opacity-75">{{ plan.yearlyOriginal }}</span>
                <span class="font-bold ml-1 text-white">{{ plan.yearlyDiscounted }}</span>
              </template>
              <template v-else>
                {{ plan.subtext }}
              </template>
            </div>
          </div>
        </div>

        <!-- Card Body Content -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3.5">
          <div class="space-y-2.5">
            <!-- Audience Label -->
            <div class="text-xs font-semibold text-gray-700 tracking-wide">
              {{ plan.targetAudience }}
            </div>

            <!-- Bullet Features -->
            <div class="space-y-2 text-xs text-gray-600">
              <div
                v-for="(feat, fIdx) in plan.features"
                :key="fIdx"
                class="flex items-start gap-2 leading-relaxed"
              >
                <Check class="w-3.5 h-3.5 text-[#23B750] stroke-[3] shrink-0 mt-0.5" />
                <span v-html="feat"></span>
              </div>
            </div>
          </div>

          <!-- Bottom AI Feature Micro-Chips -->
          <div class="pt-2.5 border-t border-gray-100">
            <div v-if="plan.aiBadges && plan.aiBadges.length" class="flex flex-wrap gap-1.5">
              <div
                v-for="badge in plan.aiBadges"
                :key="badge.label"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50/90 border border-sky-200/60 text-[11px] font-semibold text-sky-700"
              >
                <component :is="badge.icon" class="w-3 h-3 text-sky-600 shrink-0" />
                <span>{{ badge.label }}</span>
              </div>
            </div>
            <div v-else class="text-[11px] text-gray-400 italic py-0.5">
              Standard automations included
            </div>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="px-4 pb-4 pt-0.5">
          <button
            type="button"
            class="w-full py-2 rounded-xl text-xs font-bold tracking-wide text-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750]"
            :class="[
              selectedPlan === plan.id
                ? 'bg-[#23B750] hover:bg-[#1a943e] text-white shadow-xs'
                : 'bg-gray-100 group-hover:bg-gray-200 text-gray-700 group-hover:text-gray-900'
            ]"
          >
            {{ selectedPlan === plan.id ? '✓ Plan Selected' : 'Select Plan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Check, Bot, Sparkles } from 'lucide-vue-next';

interface PlanData {
  selectedPlan: string;
  billingCycle: 'monthly' | 'yearly';
  prepopulateDemoData: boolean;
}

interface Props {
  modelValue: PlanData;
  currency?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'MYR',
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: PlanData): void;
  (e: 'continue'): void;
}>();

const selectedPlan = computed({
  get: () => props.modelValue.selectedPlan,
  set: (val: string) => emit('update:modelValue', { ...props.modelValue, selectedPlan: val }),
});

const billingCycle = computed({
  get: () => props.modelValue.billingCycle,
  set: (val: 'monthly' | 'yearly') => emit('update:modelValue', { ...props.modelValue, billingCycle: val }),
});

const planList = [
  {
    id: 'basic',
    name: 'Basic',
    headerBg: 'bg-gradient-to-b from-[#23B750] to-[#108F37]', // 0%: #23B750, 100%: #108F37
    popularBadge: '',
    monthlyPrice: 'RM 200',
    yearlyMonthlyPrice: 'RM 150',
    period: '/Month',
    yearlyOriginal: 'RM 2,400',
    yearlyDiscounted: 'RM 1,800',
    subtext: 'Billed monthly',
    targetAudience: 'For Startups',
    features: [
      '<strong class="font-semibold text-gray-900">2</strong> Team Members',
      '<strong class="font-semibold text-gray-900">500</strong> Monthly Conversations',
      '<strong class="font-semibold text-gray-900">3x</strong> Channels (1WA, FB, 1IG)',
      '<strong class="font-semibold text-gray-900">2x</strong> Kanban Boards',
      'Email Support',
      'Lead Assignment',
    ],
    aiBadges: [],
  },
  {
    id: 'growth',
    name: 'Growth',
    headerBg: 'bg-gradient-to-b from-[#4DC7C7] to-[#059898]', // 0%: #4DC7C7, 100%: #059898
    popularBadge: 'Most Popular',
    monthlyPrice: 'RM 450',
    yearlyMonthlyPrice: 'RM 350',
    period: '/Month',
    yearlyOriginal: 'RM 5,400',
    yearlyDiscounted: 'RM 4,200',
    subtext: 'Billed monthly',
    targetAudience: 'For SMEs & Growing Teams',
    features: [
      '<strong class="font-semibold text-gray-900">5</strong> Team Members',
      '<strong class="font-semibold text-gray-900">2,000</strong> Monthly Conversations',
      '<strong class="font-semibold text-gray-900">5x</strong> Any Channels',
      '<strong class="font-semibold text-gray-900">5x</strong> Kanban Boards',
      'Email and Chat Support',
      'Lead Assignment',
    ],
    aiBadges: [
      { label: 'AI Chatbot', icon: Bot },
      { label: 'AI Sales Reply', icon: Sparkles },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    headerBg: 'bg-gradient-to-b from-[#3A9EF2] to-[#225B8C]', // 0%: #3A9EF2, 100%: #225B8C
    popularBadge: 'High Growth',
    monthlyPrice: 'RM 950',
    yearlyMonthlyPrice: 'RM 750',
    period: '/Month',
    yearlyOriginal: 'RM 11,400',
    yearlyDiscounted: 'RM 9,000',
    subtext: 'Billed monthly',
    targetAudience: 'For Mid-size & High Growth',
    features: [
      '<strong class="font-semibold text-gray-900">10</strong> Team Members',
      '<strong class="font-semibold text-gray-900">5,000</strong> Monthly Conversations',
      '<strong class="font-semibold text-gray-900">10x</strong> Any Channels',
      '<strong class="font-semibold text-gray-900">10x</strong> Kanban Boards',
      'Priority Support',
      'Lead Assignment',
    ],
    aiBadges: [
      { label: 'AI Chatbot', icon: Bot },
      { label: 'AI Sales Reply', icon: Sparkles },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    headerBg: 'bg-gradient-to-b from-[#115E2E] to-[#003916]', // 0%: #115E2E, 100%: #003916
    popularBadge: '',
    monthlyPrice: 'Upon Request',
    yearlyMonthlyPrice: 'Upon Request',
    period: '',
    yearlyOriginal: '',
    yearlyDiscounted: '',
    subtext: 'Custom terms and scaling',
    targetAudience: 'For Large / Multiple Departments',
    features: [
      '<strong class="font-semibold text-gray-900">Custom</strong> Team Members',
      '<strong class="font-semibold text-gray-900">Custom</strong> Monthly Conversations',
      'Channels — <strong class="font-semibold text-gray-900">Unlimited</strong>',
      'Custom Kanban Boards',
      'Priority Support',
      'Lead Assignment',
    ],
    aiBadges: [
      { label: 'AI Chatbot', icon: Bot },
      { label: 'AI Sales Reply', icon: Sparkles },
    ],
  },
];
</script>
