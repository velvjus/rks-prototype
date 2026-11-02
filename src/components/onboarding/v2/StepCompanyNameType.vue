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

      <!-- Company Type Selection -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-foreground">
          Company Type
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            v-for="type in companyTypes"
            :key="type.id"
            type="button"
            @click="companyType = type.id"
            :class="[
              'p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              companyType === type.id
                ? 'border-primary bg-primary/10 ring-2 ring-primary/15 shadow-xs'
                : 'border-border bg-card hover:border-border hover:bg-muted/50'
            ]"
          >
            <div
              :class="[
                'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                companyType === type.id
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground'
              ]"
            >
              <component
                :is="type.icon"
                class="w-4.5 h-4.5"
              />
            </div>
            <div>
              <div class="text-xs font-semibold text-foreground">{{ type.label }}</div>
              <p class="text-[11px] text-muted-foreground mt-0.5 leading-snug">{{ type.desc }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Store, Building2, Landmark } from 'lucide-vue-next';

interface Props {
  modelValue: {
    businessName: string;
    companyType: string;
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

const companyType = computed({
  get: () => props.modelValue.companyType,
  set: (val: string) => emit('update:modelValue', { ...props.modelValue, companyType: val }),
});

const companyTypes = [
  { id: 'sme', label: 'SME / Agency', desc: 'Growing business or consultancy', icon: Store },
  { id: 'enterprise', label: 'Enterprise', desc: 'Large multi-team organisation', icon: Building2 },
  { id: 'government', label: 'Gov / Corporate', desc: 'Public sector or regulated', icon: Landmark },
];
</script>
