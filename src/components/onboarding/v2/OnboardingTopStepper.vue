<template>
  <nav aria-label="Onboarding Progress" class="w-full bg-transparent pt-6 sm:pt-8 pb-3 px-6 shrink-0">
    <div class="max-w-xl mx-auto space-y-2">
      <!-- Top Text Row: Step Counter, Subtitle & Discreet Exit -->
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-[#23B750] tracking-wider uppercase text-[11px]">
          Step {{ currentStep }} of 4
        </span>
        <div class="flex items-center gap-2.5">
          <span class="text-gray-400 font-medium text-xs">
            {{ currentStepSubtitle }}
          </span>
          <span class="text-gray-300 select-none">·</span>
          <router-link
            to="/dashboard"
            class="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            Exit
          </router-link>
        </div>
      </div>

      <!-- Segmented Progress Bar -->
      <div
        class="grid grid-cols-4 gap-2.5"
        role="progressbar"
        :aria-valuenow="currentStep"
        aria-valuemin="1"
        aria-valuemax="4"
      >
        <button
          v-for="s in 4"
          :key="s"
          type="button"
          @click="onStepClick(s)"
          :disabled="!isClickable(s)"
          class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
          :class="[
            currentStep >= s ? 'bg-[#23B750]' : 'bg-gray-200/80',
            isClickable(s) ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
          ]"
          :title="`Go to step ${s}`"
        ></button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentStep: number;
  completedSteps: number[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'changeStep', step: number): void;
}>();

const subtitles: Record<number, string> = {
  1: 'Company details & business type',
  2: 'Country & operating currency',
  3: 'Team size & primary industry',
  4: 'Select subscription plan',
};

const currentStepSubtitle = computed(() => {
  return subtitles[props.currentStep] || 'Workspace setup';
});

function isCompleted(id: number) {
  return props.completedSteps.includes(id);
}

function isClickable(id: number) {
  return isCompleted(id) || id <= props.currentStep;
}

function onStepClick(id: number) {
  if (isClickable(id)) {
    emit('changeStep', id);
  }
}
</script>
