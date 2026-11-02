<template>
  <aside class="w-full lg:w-72 bg-card border-b lg:border-b-0 lg:border-r border-border p-6 lg:p-8 flex flex-col justify-between shrink-0 h-full">
    <div class="space-y-8">
      <!-- Section Context Header -->
      <div>
        <div class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Workspace Setup
        </div>
        <h2 class="text-base font-bold text-foreground mt-1">
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
                  ? 'bg-primary text-primary-foreground'
                  : currentSection === 1
                  ? 'border-2 border-primary text-primary bg-card ring-4 ring-primary/20'
                  : 'border border-border text-muted-foreground bg-card group-hover:border-foreground/30'
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
                    ? 'font-bold text-foreground'
                    : isSectionCompleted(1)
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
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
                    ? 'bg-primary'
                    : currentSection === 1 && currentSubStep === subId
                    ? 'bg-primary ring-2 ring-primary/30'
                    : 'bg-muted hover:bg-muted-foreground/30'
                ]"
              ></button>
            </div>
            <div class="text-[11px] text-muted-foreground">
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
                  ? 'bg-primary text-primary-foreground'
                  : currentSection === 2
                  ? 'border-2 border-primary text-primary bg-card ring-4 ring-primary/20'
                  : 'border border-border text-muted-foreground bg-card group-hover:border-foreground/30'
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
                    ? 'font-bold text-foreground'
                    : isSectionCompleted(2)
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                ]"
              >
                Choose Plan
              </span>
              <span class="text-[11px] text-muted-foreground block mt-0.5">
                Final Step
              </span>
            </div>
          </button>
        </div>
      </nav>
    </div>

    <!-- Quiet Progress Note -->
    <div class="pt-6 border-t border-border hidden lg:block text-xs text-muted-foreground">
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
