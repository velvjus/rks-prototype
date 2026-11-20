<template>
  <div class="space-y-6">
    <!-- Header (Fixed Height Anchor for Rock-Solid Stability) -->
    <div class="min-h-[72px] shrink-0">
      <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        What is your company name?
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
        We'll use this to set up your team's workspace.
      </p>
    </div>

    <!-- Fields -->
    <div class="space-y-5">
      <!-- Company Name Input -->
      <div class="space-y-1.5">
        <label for="companyName" class="block text-xs font-semibold text-foreground">
          Company Name
        </label>
        <input
          id="companyName"
          v-model="businessName"
          type="text"
          placeholder="e.g. Acme Corporation"
          class="w-full h-11 px-3.5 bg-card border border-input rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all shadow-2xs"
          @keydown.enter.prevent="$emit('continue')"
        />
      </div>

      <!-- Primary Use Case Selection -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-foreground">
          How will your company use RakanSales?
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="option in useCaseOptions"
            :key="option.id"
            type="button"
            @click="useCase = option.id"
            :aria-pressed="useCase === option.id"
            :class="[
              'p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col gap-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              useCase === option.id
                ? 'border-primary bg-primary/10 ring-2 ring-primary/15 shadow-xs'
                : 'border-border bg-card hover:border-border hover:bg-muted/50'
            ]"
          >
            <div class="flex items-start justify-between gap-2 w-full">
              <div
                :class="[
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0',
                  useCase === option.id
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
                ]"
              >
                <component
                  :is="option.icon"
                  class="w-4.5 h-4.5"
                />
              </div>

              <span
                :class="[
                  'w-4.5 h-4.5 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5',
                  useCase === option.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-input bg-background'
                ]"
              >
                <Check v-if="useCase === option.id" class="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div>
              <div class="text-xs font-semibold text-foreground">{{ option.label }}</div>
              <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">{{ option.desc }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Referral Code (Optional) -->
      <div class="space-y-1.5">
        <label for="referralCode" class="block text-xs font-semibold text-foreground">
          Referral Code
          <span class="text-muted-foreground font-normal">(if any)</span>
        </label>
        <input
          id="referralCode"
          v-model="referralCode"
          type="text"
          placeholder="e.g. RKS-PARTNER20"
          class="w-full h-11 px-3.5 bg-card border border-input rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all shadow-2xs"
          @keydown.enter.prevent="$emit('continue')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TrendingUp, Headset, Check } from 'lucide-vue-next';

interface Props {
  modelValue: {
    businessName: string;
    useCase: string;
    referralCode: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: Props['modelValue']): void;
  (e: 'continue'): void;
}>();

const businessName = computed({
  get: () => props.modelValue.businessName,
  set: (val: string) => emit('update:modelValue', { ...props.modelValue, businessName: val }),
});

const useCase = computed({
  get: () => props.modelValue.useCase,
  set: (val: string) => emit('update:modelValue', { ...props.modelValue, useCase: val }),
});

const referralCode = computed({
  get: () => props.modelValue.referralCode,
  set: (val: string) => emit('update:modelValue', { ...props.modelValue, referralCode: val }),
});

const useCaseOptions = [
  {
    id: 'sales',
    label: 'Sales & Lead Management',
    desc: 'Track prospects, manage your pipeline, and close deals from WhatsApp conversations.',
    icon: TrendingUp,
  },
  {
    id: 'support',
    label: 'Customer & Service Support',
    desc: 'Manage incoming customer queries, assign to agents, and resolve issues faster with automation.',
    icon: Headset,
  },
];
</script>
