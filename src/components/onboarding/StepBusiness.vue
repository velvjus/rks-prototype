<template>
  <div class="space-y-4 animate-in fade-in-50 duration-300">
    <!-- Header -->
    <div class="text-left">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Tell us about your company</h2>
      <p class="text-xs text-gray-500 mt-0.5 leading-normal">Let's personalize your workspace to match how your team works.</p>
    </div>

    <!-- Main Form Fields -->
    <div class="space-y-3 text-left">
      <!-- Field 1: Business Name -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1">
          Company Name <span class="text-red-500 font-normal ml-0.5">*</span>
        </label>
        <input
          v-model="data.businessName"
          type="text"
          placeholder="e.g. Acme Corporation"
          class="w-full h-9 px-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] transition-all shadow-2xs"
        />
      </div>

      <!-- Field 2: Company Type -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5">Company Type</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            v-for="type in companyTypes"
            :key="type.id"
            @click="data.companyType = type.id"
            :class="[
              'p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col items-start gap-1.5 relative cursor-pointer group',
              data.companyType === type.id
                ? 'border-[#23B750] bg-emerald-50/50 ring-1 ring-[#23B750] shadow-2xs'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            ]"
          >
            <div class="flex items-center justify-between w-full">
              <div
                :class="[
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                  data.companyType === type.id
                    ? 'bg-[#23B750] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200/70'
                ]"
              >
                <component :is="type.icon" class="w-3.5 h-3.5" />
              </div>
              <span
                v-if="data.companyType === type.id"
                class="w-4 h-4 rounded-full bg-[#23B750] text-white flex items-center justify-center text-[10px]"
              >
                <Check class="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-900">{{ type.label }}</div>
              <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ type.desc }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Field 3: Country & Currency (2 Column) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Country -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">
            Country <span class="text-red-500 font-normal ml-0.5">*</span>
          </label>
          <div class="relative">
            <select
              v-model="data.country"
              class="w-full h-9 px-3 pr-8 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] transition-all shadow-2xs appearance-none cursor-pointer"
            >
              <option value="Malaysia">🇲🇾 Malaysia</option>
              <option value="Singapore">🇸🇬 Singapore</option>
              <option value="Indonesia">🇮🇩 Indonesia</option>
              <option value="Thailand">🇹🇭 Thailand</option>
              <option value="Philippines">🇵🇭 Philippines</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
              <option value="Australia">🇦🇺 Australia</option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <!-- Currency -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Default Currency</label>
          <div class="relative">
            <select
              v-model="data.currency"
              class="w-full h-9 px-3 pr-8 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] transition-all shadow-2xs appearance-none cursor-pointer"
            >
              <option value="MYR">MYR (RM) — Malaysian Ringgit</option>
              <option value="SGD">SGD (S$) — Singapore Dollar</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="IDR">IDR (Rp) — Indonesian Rupiah</option>
              <option value="THB">THB (฿) — Thai Baht</option>
              <option value="EUR">EUR (€) — Euro</option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <!-- Field 4: Sales Team Size -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5">Team Size</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            v-for="size in teamSizes"
            :key="size"
            @click="data.agentSize = size"
            :class="[
              'h-8 px-2.5 rounded-lg border text-xs font-medium transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs',
              data.agentSize === size
                ? 'border-[#23B750] bg-emerald-50 text-[#008236] font-semibold ring-1 ring-[#23B750]'
                : 'border-gray-200 bg-gray-50/40 hover:bg-white hover:border-gray-300 text-gray-700'
            ]"
          >
            {{ size }} people
          </button>
        </div>
      </div>

      <!-- Field 5: Industry Tags -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5">Industry</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            type="button"
            v-for="ind in industryList"
            :key="ind"
            @click="toggleIndustry(ind)"
            :class="[
              'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1 shadow-2xs',
              data.industries.includes(ind)
                ? 'bg-[#23B750] text-white border-[#23B750] font-semibold shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50/80'
            ]"
          >
            <Check v-if="data.industries.includes(ind)" class="w-2.5 h-2.5 stroke-[2.5]" />
            {{ ind }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Building2, Landmark, Store, Check, ChevronDown } from 'lucide-vue-next';

interface BusinessData {
  businessName: string;
  companyType: string;
  country: string;
  currency: string;
  agentSize: string;
  industries: string[];
}

const props = defineProps<{
  modelValue: BusinessData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: BusinessData): void;
}>();

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const companyTypes = [
  { id: 'sme', label: 'SME / Agency', desc: 'Growing business or boutique agency', icon: Store },
  { id: 'enterprise', label: 'Enterprise', desc: 'Large multi-department company', icon: Building2 },
  { id: 'government', label: 'Gov / Corporate', desc: 'Public sector or regulated industry', icon: Landmark },
];

const teamSizes = ['1–5', '6–20', '21–50', '50+'];

const industryList = [
  'Real Estate',
  'Automotive',
  'Financial Services',
  'Insurance',
  'Education',
  'Healthcare',
  'Retail & E-commerce',
  'Recruitment',
  'Professional Services',
  'Home Services',
];

function toggleIndustry(ind: string) {
  const current = [...data.value.industries];
  const idx = current.indexOf(ind);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(ind);
  }
  data.value.industries = current;
}
</script>
