<template>
  <div class="space-y-6">
    <!-- Header (Fixed Height Anchor for Rock-Solid Stability) -->
    <div class="min-h-[72px] shrink-0">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Tell us about your team and industry
      </h2>
      <p class="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
        This helps us tailor your pipeline stages and templates.
      </p>
    </div>

    <!-- Form Fields -->
    <div class="space-y-5">
      <!-- Team Size -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700">
          Team Size
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            v-for="size in teamSizes"
            :key="size"
            type="button"
            @click="agentSize = size"
            :class="[
              'h-11 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none',
              agentSize === size
                ? 'border-[#23B750] bg-emerald-50/50 text-emerald-900 ring-2 ring-[#23B750]/15 shadow-xs'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50/60'
            ]"
          >
            {{ size }} people
          </button>
        </div>
      </div>

      <!-- Industry Tags -->
      <div class="space-y-2">
        <div class="flex items-baseline justify-between">
          <label class="block text-xs font-semibold text-gray-700">
            Industry
          </label>
          <span class="text-[11px] text-gray-400">Select all that apply</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ind in industryList"
            :key="ind"
            type="button"
            @click="toggleIndustry(ind)"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none',
              isIndustrySelected(ind)
                ? 'bg-[#23B750] text-white border-[#23B750] shadow-2xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            <Check v-if="isIndustrySelected(ind)" class="w-3.5 h-3.5 stroke-[3]" />
            <span>{{ ind }}</span>
          </button>
        </div>

        <!-- Custom Industry Text Input (when "Others" is selected) -->
        <div v-if="isOtherSelected" class="pt-2 animate-in fade-in duration-200 space-y-1.5">
          <label for="otherIndustry" class="block text-xs font-semibold text-gray-700">
            Specify Other Industry
          </label>
          <input
            ref="otherInputRef"
            id="otherIndustry"
            v-model="otherIndustry"
            type="text"
            placeholder="e.g. Agriculture, Renewable Energy, Legal Services"
            class="w-full h-11 px-3.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] transition-all shadow-2xs"
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
