<template>
  <aside class="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 p-6 lg:p-8 flex flex-col justify-between shrink-0 h-full">
    <div class="space-y-8">
      <!-- Section Context Header -->
      <div>
        <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Workspace Setup
        </div>
        <h2 class="text-base font-bold text-gray-900 mt-1">
          {{ currentSection === 1 ? '1. Company Details' : currentSection === 2 ? '2. Choose Plan' : 'Workspace Ready' }}
        </h2>
      </div>

      <!-- Stepper Navigation -->
      <nav aria-label="Steps" class="space-y-6">
        <!-- Section 1: Company Details -->
        <div class="space-y-3">
          <button
            type="button"
            @click="onSectionClick(1)"
            class="flex items-center gap-3 w-full text-left transition-colors cursor-pointer group"
          >
            <!-- Node Icon -->
            <div
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all',
                isSectionCompleted(1)
                  ? 'bg-[#008236] text-white'
                  : currentSection === 1
                  ? 'border-2 border-[#008236] text-[#008236] bg-white ring-4 ring-emerald-50'
                  : 'border border-gray-300 text-gray-400 bg-white group-hover:border-gray-400'
              ]"
            >
              <Check v-if="isSectionCompleted(1)" class="w-3.5 h-3.5 stroke-[2.5]" />
              <span v-else>1</span>
            </div>

            <div class="flex-1 min-w-0">
              <span
                :class="[
                  'text-sm transition-colors block',
                  currentSection === 1
                    ? 'font-bold text-gray-900'
                    : isSectionCompleted(1)
                    ? 'font-medium text-gray-700'
                    : 'text-gray-400 group-hover:text-gray-600'
                ]"
              >
                Company Details
              </span>
            </div>
          </button>

          <!-- Requirement Indicators (Progress Bars / Pips without text names) -->
          <div class="ml-10 space-y-1.5">
            <div class="flex items-center gap-1.5">
              <button
                v-for="subId in 3"
                :key="subId"
                type="button"
                @click="onSubStepClick(subId)"
                :title="`Requirement ${subId} of 3`"
                class="flex-1 h-1.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-none"
                :class="[
                  completedSubSteps.includes(subId)
                    ? 'bg-[#008236]'
                    : currentSection === 1 && currentSubStep === subId
                    ? 'bg-[#23B750] ring-2 ring-emerald-100'
                    : 'bg-gray-200 hover:bg-gray-300'
                ]"
              ></button>
            </div>
            <div class="text-[11px] text-gray-400">
              <template v-if="isSectionCompleted(1)">
                Completed (3/3)
              </template>
              <template v-else-if="currentSection === 1">
                Requirement {{ currentSubStep }} of 3
              </template>
              <template v-else>
                3 requirements
              </template>
            </div>
          </div>
        </div>

        <!-- Section 2: Choose Plan (Final Step) -->
        <div class="space-y-2">
          <button
            type="button"
            @click="onSectionClick(2)"
            class="flex items-center gap-3 w-full text-left transition-colors cursor-pointer group"
          >
            <!-- Node Icon -->
            <div
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all',
                isSectionCompleted(2)
                  ? 'bg-[#008236] text-white'
                  : currentSection === 2
                  ? 'border-2 border-[#008236] text-[#008236] bg-white ring-4 ring-emerald-50'
                  : 'border border-gray-300 text-gray-400 bg-white group-hover:border-gray-400'
              ]"
            >
              <Check v-if="isSectionCompleted(2)" class="w-3.5 h-3.5 stroke-[2.5]" />
              <span v-else>2</span>
            </div>

            <div class="flex-1 min-w-0">
              <span
                :class="[
                  'text-sm transition-colors block',
                  currentSection === 2
                    ? 'font-bold text-gray-900'
                    : isSectionCompleted(2)
                    ? 'font-medium text-gray-700'
                    : 'text-gray-400 group-hover:text-gray-600'
                ]"
              >
                Choose Plan
              </span>
              <span class="text-[11px] text-gray-400 block mt-0.5">
                Final Step
              </span>
            </div>
          </button>
        </div>
      </nav>
    </div>

    <!-- Quiet Progress Note -->
    <div class="pt-6 border-t border-gray-100 hidden lg:block text-xs text-gray-400">
      {{ currentSection === 3 ? 'Setup Completed' : `Step ${currentSection} of 2` }}
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next';

interface Props {
  currentSection: number;
  currentSubStep: number;
  completedSections: number[];
  completedSubSteps: number[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'changeSection', section: number): void;
  (e: 'changeSubStep', subStep: number): void;
}>();

function isSectionCompleted(sec: number) {
  return props.completedSections.includes(sec);
}

function onSectionClick(sec: number) {
  emit('changeSection', sec);
}

function onSubStepClick(subStep: number) {
  emit('changeSubStep', subStep);
}
</script>
