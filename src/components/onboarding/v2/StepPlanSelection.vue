<template>
  <div class="space-y-4 max-w-6xl mx-auto w-full">
    <!-- Section Header & Billing Switcher (Compact Viewport Height & Polished Typography) -->
    <div class="text-center max-w-xl mx-auto space-y-1.5 shrink-0">
      <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Choose your plan
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Transparent pricing built to scale with your sales team. Switch or cancel anytime.
      </p>

      <!-- Billing Cycle Toggle -->
      <div class="pt-1.5 inline-flex items-center">
        <div class="inline-flex items-center p-1 bg-muted rounded-xl border border-border text-xs shadow-2xs">
          <button
            type="button"
            @click="billingCycle = 'monthly'"
            :class="[
              'px-3.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs',
              billingCycle === 'monthly'
                ? 'bg-card text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
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
                ? 'bg-card text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            <span>Yearly</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground font-bold tracking-wide shadow-2xs">
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
          'rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden bg-card group select-none',
          selectedPlan === plan.id
            ? 'border-primary ring-2 ring-primary/20 shadow-md -translate-y-1'
            : 'border-border hover:border-foreground/30 hover:shadow-md hover:-translate-y-1'
        ]"
      >
        <!-- Top Colored Header Block -->
        <div :class="[plan.headerBg, 'px-4 py-3.5 text-primary-foreground shrink-0 flex flex-col justify-between relative min-h-[102px]']">
          <!-- Title & Badges (Font weight reduced from bold to semibold) -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-semibold tracking-tight text-primary-foreground">{{ plan.name }}</h3>
              <span
                v-if="plan.popularBadge"
                class="text-[10px] font-semibold tracking-wide bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-full backdrop-blur-xs"
              >
                {{ plan.popularBadge }}
              </span>
            </div>
          </div>

          <!-- Price & Annual Billing Subtext (Price font weight reduced from extrabold to bold, dynamic 25% off per month value) -->
          <div class="mt-2">
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl sm:text-3xl font-bold tracking-tight leading-none text-primary-foreground tabular-nums">
                {{ billingCycle === 'yearly' ? plan.yearlyMonthlyPrice : plan.monthlyPrice }}
              </span>
              <span v-if="plan.period" class="text-xs text-primary-foreground/85 font-medium">
                {{ plan.period }}
              </span>
            </div>

            <div class="text-[11px] text-primary-foreground/90 font-medium mt-1 leading-snug">
              <template v-if="billingCycle === 'yearly' && plan.yearlyDiscounted">
                Billed annually:
                <span class="line-through opacity-75">{{ plan.yearlyOriginal }}</span>
                <span class="font-bold ml-1 text-primary-foreground">{{ plan.yearlyDiscounted }}</span>
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
            <div class="text-xs font-semibold text-foreground tracking-wide">
              {{ plan.targetAudience }}
            </div>

            <!-- Bullet Features -->
            <div class="space-y-2 text-xs text-muted-foreground">
              <div
                v-for="(feat, fIdx) in plan.features"
                :key="fIdx"
                class="flex items-start gap-2 leading-relaxed"
              >
                <Check class="w-3.5 h-3.5 text-primary stroke-[3] shrink-0 mt-0.5" />
                <span v-html="feat"></span>
              </div>
            </div>
          </div>

          <!-- Bottom AI Feature Micro-Chips -->
          <div class="pt-2.5 border-t border-border">
            <div v-if="plan.aiBadges && plan.aiBadges.length" class="flex flex-wrap gap-1.5">
              <div
                v-for="badge in plan.aiBadges"
                :key="badge.label"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-info/10 border border-info/20 text-[11px] font-semibold text-info"
              >
                <component :is="badge.icon" class="w-3 h-3 text-info shrink-0" />
                <span>{{ badge.label }}</span>
              </div>
            </div>
            <div v-else class="text-[11px] text-muted-foreground italic py-0.5">
              Standard automations included
            </div>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="px-4 pb-4 pt-0.5">
          <button
            type="button"
            class="w-full py-2 rounded-xl text-xs font-bold tracking-wide text-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
            :class="[
              selectedPlan === plan.id
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:text-foreground'
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
    headerBg: 'bg-gradient-to-b from-primary to-primary/80',
    popularBadge: '',
    monthlyPrice: 'RM 200',
    yearlyMonthlyPrice: 'RM 150',
    period: '/Month',
    yearlyOriginal: 'RM 2,400',
    yearlyDiscounted: 'RM 1,800',
    subtext: 'Billed monthly',
    targetAudience: 'For Startups',
    features: [
      '<strong class="font-semibold text-foreground">2</strong> Team Members',
      '<strong class="font-semibold text-foreground">500</strong> Monthly Conversations',
      '<strong class="font-semibold text-foreground">3x</strong> Channels (1WA, FB, 1IG)',
      '<strong class="font-semibold text-foreground">2x</strong> Kanban Boards',
      'Email Support',
      'Lead Assignment',
    ],
    aiBadges: [],
  },
  {
    id: 'growth',
    name: 'Growth',
    headerBg: 'bg-gradient-to-b from-tag-6 to-tag-6-foreground',
    popularBadge: 'Most Popular',
    monthlyPrice: 'RM 450',
    yearlyMonthlyPrice: 'RM 350',
    period: '/Month',
    yearlyOriginal: 'RM 5,400',
    yearlyDiscounted: 'RM 4,200',
    subtext: 'Billed monthly',
    targetAudience: 'For SMEs & Growing Teams',
    features: [
      '<strong class="font-semibold text-foreground">5</strong> Team Members',
      '<strong class="font-semibold text-foreground">2,000</strong> Monthly Conversations',
      '<strong class="font-semibold text-foreground">5x</strong> Any Channels',
      '<strong class="font-semibold text-foreground">5x</strong> Kanban Boards',
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
    headerBg: 'bg-gradient-to-b from-tag-1 to-tag-1-foreground',
    popularBadge: 'High Growth',
    monthlyPrice: 'RM 950',
    yearlyMonthlyPrice: 'RM 750',
    period: '/Month',
    yearlyOriginal: 'RM 11,400',
    yearlyDiscounted: 'RM 9,000',
    subtext: 'Billed monthly',
    targetAudience: 'For Mid-size & High Growth',
    features: [
      '<strong class="font-semibold text-foreground">10</strong> Team Members',
      '<strong class="font-semibold text-foreground">5,000</strong> Monthly Conversations',
      '<strong class="font-semibold text-foreground">10x</strong> Any Channels',
      '<strong class="font-semibold text-foreground">10x</strong> Kanban Boards',
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
    headerBg: 'bg-gradient-to-b from-tag-2 to-tag-2-foreground',
    popularBadge: '',
    monthlyPrice: 'Upon Request',
    yearlyMonthlyPrice: 'Upon Request',
    period: '',
    yearlyOriginal: '',
    yearlyDiscounted: '',
    subtext: 'Custom terms and scaling',
    targetAudience: 'For Large / Multiple Departments',
    features: [
      '<strong class="font-semibold text-foreground">Custom</strong> Team Members',
      '<strong class="font-semibold text-foreground">Custom</strong> Monthly Conversations',
      'Channels — <strong class="font-semibold text-foreground">Unlimited</strong>',
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
