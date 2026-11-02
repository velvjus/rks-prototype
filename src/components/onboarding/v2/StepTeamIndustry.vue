<template>
  <div class="space-y-6">
    <!-- Header (Fixed Height Anchor for Rock-Solid Stability) -->
    <div class="min-h-[72px] shrink-0">
      <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Tell us about your team and industry
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
        This helps us tailor your pipeline stages and templates.
      </p>
    </div>

    <!-- Form Fields -->
    <div class="space-y-5">
      <!-- Team Size -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-foreground">
          Team Size
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            v-for="size in teamSizes"
            :key="size"
            type="button"
            @click="agentSize = size"
            :class="[
              'h-11 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              agentSize === size
                ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/15 shadow-xs'
                : 'border-border bg-card hover:border-border text-foreground hover:bg-muted/50'
            ]"
          >
            {{ size }} people
          </button>
        </div>
      </div>

      <!-- Industry Tags -->
      <div class="space-y-2">
        <div class="flex items-baseline justify-between">
          <label class="block text-xs font-semibold text-foreground">
            Industry
          </label>
          <span class="text-[11px] text-muted-foreground">Select all that apply</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ind in industryList"
            :key="ind"
            type="button"
            @click="toggleIndustry(ind)"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              isIndustrySelected(ind)
                ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                : 'bg-card text-foreground border-border hover:border-border hover:bg-muted/50'
            ]"
          >
            <Check v-if="isIndustrySelected(ind)" class="w-3.5 h-3.5 stroke-[3]" />
            <span>{{ ind }}</span>
          </button>
        </div>

        <!-- Custom Industry Text Input (when "Others" is selected) -->
        <div v-if="isOtherSelected" class="pt-2 animate-in fade-in duration-200 space-y-1.5">
          <label for="otherIndustry" class="block text-xs font-semibold text-foreground">
            Specify Other Industry
          </label>
          <input
            ref="otherInputRef"
            id="otherIndustry"
            v-model="otherIndustry"
            type="text"
            placeholder="e.g. Agriculture, Renewable Energy, Legal Services"
            class="w-full h-11 px-3.5 bg-card border border-input hover:border-border rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary caret-primary transition-all shadow-2xs"
            @keydown.enter.prevent="$emit('continue')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { Check } from 'lucide-vue-next';

interface Props {
  modelValue: {
    agentSize: string;
    industries: string[];
    otherIndustry?: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: Props['modelValue']): void;
  (e: 'continue'): void;
}>();

const otherInputRef = ref<HTMLInputElement | null>(null);

const agentSize = computed({
  get: () => props.modelValue.agentSize,
  set: (val: string) => emit('update:modelValue', { ...props.modelValue, agentSize: val }),
});

const industries = computed({
  get: () => props.modelValue.industries,
  set: (val: string[]) => emit('update:modelValue', { ...props.modelValue, industries: val }),
});

const otherIndustry = computed({
  get: () => props.modelValue.otherIndustry || '',
  set: (val: string) => emit('update:modelValue', { ...props.modelValue, otherIndustry: val }),
});

const isOtherSelected = computed(() => industries.value.includes('Others'));

function isIndustrySelected(name: string): boolean {
  return industries.value.includes(name);
}

const teamSizes = ['1–5', '6–20', '21–50', '50+'];

const industryList = [
  'Real Estate',
  'Automotive',
  'Financial Services',
  'Insurance',
  'Education',
  'Healthcare',
  'Retail & E-commerce',
  'Professional Services',
  'Technology & SaaS',
  'Home Services',
  'Others',
];

function toggleIndustry(name: string) {
  const current = [...props.modelValue.industries];
  const idx = current.indexOf(name);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(name);
    if (name === 'Others') {
      nextTick(() => {
        otherInputRef.value?.focus();
      });
    }
  }
  emit('update:modelValue', {
    ...props.modelValue,
    industries: current,
  });
}
</script>
