<template>
  <div class="space-y-6">
    <!-- Header (Fixed Height Anchor for Rock-Solid Stability) -->
    <div class="min-h-[72px] shrink-0">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Where is your business based?
      </h2>
      <p class="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
        Choose your operating location and default currency for deals and reports.
      </p>
    </div>

    <!-- Form Fields -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Country Selection -->
      <div class="space-y-1.5">
        <label for="countrySelect" class="block text-xs font-semibold text-gray-700">
          Country
        </label>
        <div class="relative">
          <select
            id="countrySelect"
            :value="country"
            @change="onCountryChange(($event.target as HTMLSelectElement).value)"
            class="w-full h-11 pl-3.5 pr-9 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] transition-all shadow-2xs appearance-none cursor-pointer"
          >
            <option value="" disabled>Select your country</option>
            <option v-for="c in countryOptions" :key="c.name" :value="c.name">
              {{ c.flag }} {{ c.name }}
            </option>
          </select>
          <ChevronDown class="w-4 h-4 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <!-- Currency Selection -->
      <div class="space-y-1.5">
        <label for="currencySelect" class="block text-xs font-semibold text-gray-700">
          Currency
        </label>
        <div class="relative">
          <select
            id="currencySelect"
            :value="currency"
            @change="emit('update:modelValue', { ...props.modelValue, currency: ($event.target as HTMLSelectElement).value })"
            class="w-full h-11 pl-3.5 pr-9 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] transition-all shadow-2xs appearance-none cursor-pointer"
          >
            <option value="" disabled>Select your currency</option>
            <option v-for="cur in currencyOptions" :key="cur.code" :value="cur.code">
              {{ cur.code }} ({{ cur.symbol }}) — {{ cur.name }}
            </option>
          </select>
          <ChevronDown class="w-4 h-4 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>

    <!-- Friendly reassurance caption -->
    <div class="pt-1 flex items-start gap-2 text-xs text-gray-500">
      <Globe class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
      <span class="leading-relaxed text-gray-500">
        Currency defaults apply to your pipeline deals and invoices. You can customize exchange rates and regional formats anytime in Settings.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronDown, Globe } from 'lucide-vue-next';

interface Props {
  modelValue: {
    country: string;
    currency: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: Props['modelValue']): void;
  (e: 'continue'): void;
}>();

const country = computed(() => props.modelValue.country);
const currency = computed(() => props.modelValue.currency);

const countryOptions = [
  { name: 'Malaysia', flag: '🇲🇾', defaultCurrency: 'MYR' },
  { name: 'Singapore', flag: '🇸🇬', defaultCurrency: 'SGD' },
  { name: 'Indonesia', flag: '🇮🇩', defaultCurrency: 'IDR' },
  { name: 'Thailand', flag: '🇹🇭', defaultCurrency: 'THB' },
  { name: 'Philippines', flag: '🇵🇭', defaultCurrency: 'PHP' },
  { name: 'Vietnam', flag: '🇻🇳', defaultCurrency: 'VND' },
  { name: 'United States', flag: '🇺🇸', defaultCurrency: 'USD' },
  { name: 'United Kingdom', flag: '🇬🇧', defaultCurrency: 'GBP' },
  { name: 'Australia', flag: '🇦🇺', defaultCurrency: 'AUD' },
];

const currencyOptions = [
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

function onCountryChange(newCountry: string) {
  const match = countryOptions.find((c) => c.name === newCountry);
  const updatedCurrency = match ? match.defaultCurrency : props.modelValue.currency;
  emit('update:modelValue', {
    ...props.modelValue,
    country: newCountry,
    currency: updatedCurrency,
  });
}
</script>
