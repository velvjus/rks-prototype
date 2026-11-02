<template>
  <div class="space-y-4 text-left">
    <!-- Header (Constant Top Position) -->
    <div class="shrink-0 space-y-1">
      <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Let's complete your setup
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Acknowledge pending tasks to activate incoming leads, messaging channels, and team collaboration.
      </p>
    </div>

    <!-- Progress Meter Strip -->
    <div class="space-y-1.5 pt-1">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground font-medium text-[11px]">Workspace setup progress</span>
        <span class="font-bold text-foreground text-xs">{{ completedCount }}/3 completed</span>
      </div>
      <div class="w-full bg-muted h-1.5 rounded-full overflow-hidden">
        <div
          class="bg-primary h-full transition-all duration-500 rounded-full"
          :style="{ width: completionPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- 3 Checklist Items Styled with Onboarding v2 Card Language -->
    <div class="space-y-2.5 pt-1">
      <!-- Item 1: Sales Team -->
      <button
        type="button"
        @click="$emit('goToStep', 2)"
        :class="[
          'w-full p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 text-left group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          taskStatus.team
            ? 'border-primary bg-primary/10 ring-1 ring-primary/20 shadow-2xs text-card-foreground'
            : 'border-border bg-card hover:border-border hover:bg-muted/50 shadow-2xs text-card-foreground'
        ]"
      >
        <div class="flex items-center gap-3.5 min-w-0">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
              taskStatus.team ? 'bg-primary text-primary-foreground shadow-2xs' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
            ]"
          >
            <Check v-if="taskStatus.team" class="w-5 h-5 stroke-[2.5]" />
            <Users v-else class="w-5 h-5" />
          </div>

          <div class="min-w-0">
            <div class="text-sm font-semibold text-foreground">
              1. Sales Team
            </div>
            <p class="text-xs text-muted-foreground mt-0.5 leading-snug">
              Invite reps, assign sales squads, and grant routing permissions.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1 text-xs font-semibold text-primary shrink-0 group-hover:translate-x-0.5 transition-transform">
          <span>{{ taskStatus.team ? 'Review' : 'Set up' }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </div>
      </button>

      <!-- Item 2: WhatsApp Business -->
      <button
        type="button"
        @click="$emit('goToStep', 3)"
        :class="[
          'w-full p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 text-left group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          taskStatus.whatsapp
            ? 'border-primary bg-primary/10 ring-1 ring-primary/20 shadow-2xs text-card-foreground'
            : 'border-border bg-card hover:border-border hover:bg-muted/50 shadow-2xs text-card-foreground'
        ]"
      >
        <div class="flex items-center gap-3.5 min-w-0">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
              taskStatus.whatsapp ? 'bg-primary text-primary-foreground shadow-2xs' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
            ]"
          >
            <Check v-if="taskStatus.whatsapp" class="w-5 h-5 stroke-[2.5]" />
            <MessageCircle v-else class="w-5 h-5" />
          </div>

          <div class="min-w-0">
            <div class="text-sm font-semibold text-foreground">
              2. WhatsApp Channel
            </div>
            <p class="text-xs text-muted-foreground mt-0.5 leading-snug">
              Connect WhatsApp QR or Cloud API for unified customer chat.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1 text-xs font-semibold text-primary shrink-0 group-hover:translate-x-0.5 transition-transform">
          <span>{{ taskStatus.whatsapp ? 'Review' : 'Connect' }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </div>
      </button>

      <!-- Item 3: Website LiveChat -->
      <button
        type="button"
        @click="$emit('goToStep', 4)"
        :class="[
          'w-full p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 text-left group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          taskStatus.livechat
            ? 'border-primary bg-primary/10 ring-1 ring-primary/20 shadow-2xs text-card-foreground'
            : 'border-border bg-card hover:border-border hover:bg-muted/50 shadow-2xs text-card-foreground'
        ]"
      >
        <div class="flex items-center gap-3.5 min-w-0">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
              taskStatus.livechat ? 'bg-primary text-primary-foreground shadow-2xs' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
            ]"
          >
            <Check v-if="taskStatus.livechat" class="w-5 h-5 stroke-[2.5]" />
            <MessageSquareCode v-else class="w-5 h-5" />
          </div>

          <div class="min-w-0">
            <div class="text-sm font-semibold text-foreground">
              3. LiveChat Widget
            </div>
            <p class="text-xs text-muted-foreground mt-0.5 leading-snug">
              Customize theme colors and embed website JavaScript snippet.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1 text-xs font-semibold text-primary shrink-0 group-hover:translate-x-0.5 transition-transform">
          <span>{{ taskStatus.livechat ? 'Review' : 'Install' }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Users,
  MessageCircle,
  MessageSquareCode,
  Check,
  ArrowRight,
} from 'lucide-vue-next';

interface TaskStatus {
  team: boolean;
  whatsapp: boolean;
  livechat: boolean;
}

const props = defineProps<{
  taskStatus: TaskStatus;
}>();

defineEmits<{
  (e: 'goToStep', step: number): void;
}>();

const completedCount = computed(() => {
  let count = 0;
  if (props.taskStatus.team) count++;
  if (props.taskStatus.whatsapp) count++;
  if (props.taskStatus.livechat) count++;
  return count;
});

const completionPercentage = computed(() => {
  return Math.round((completedCount.value / 3) * 100);
});
</script>
