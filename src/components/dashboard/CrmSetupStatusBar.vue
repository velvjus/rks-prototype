<template>
  <div class="crm-setup-bar-wrapper shrink-0 select-none">
    <!-- 1-Line Top Status Bar in Solid Blue with White Text -->
    <div
      @click="isModalOpen = true"
      class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 border-b border-blue-700 dark:border-blue-500 px-4 py-2 sm:px-6 transition-colors cursor-pointer group text-white"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        
        <!-- Left: Settings Icon & Body Text in White -->
        <div class="flex items-center gap-2.5 min-w-0">
          <Settings class="w-3.5 h-3.5 text-white/90 group-hover:text-white shrink-0 group-hover:rotate-45 transition-all duration-300" />
          
          <span class="font-medium text-white truncate">
            {{ allCompleted ? 'All setup tasks complete! Workspace is fully active.' : `${remainingTasksText} to finish activating your workspace.` }}
          </span>
        </div>

        <!-- Right: Progress Indicator -->
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-20 bg-black/20 dark:bg-black/30 ring-1 ring-white/25 h-1.5 rounded-full overflow-hidden hidden sm:block">
            <div
              class="bg-white h-full transition-all duration-500 rounded-full"
              :style="{ width: completionPercentage + '%' }"
            ></div>
          </div>
          <span class="text-[11px] font-bold text-white tabular-nums">
            {{ completedCount }}/3 completed
          </span>
        </div>

      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════
         DISTILLED SETUP MODAL (Header Banner Image + Hover/Click Expand)
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      @click.self="isModalOpen = false"
    >
      <div
        class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <!-- Modal Top Header Banner with Attached Robot Image -->
        <div class="relative w-full h-36 sm:h-44 bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-gray-200/70 dark:border-gray-800">
          <img
            src="/images/setup-wizard-robot.png"
            alt="Setup Assistant Robot"
            class="w-full h-full object-cover object-center"
          />
          <button
            type="button"
            @click="isModalOpen = false"
            class="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all cursor-pointer shadow-sm hover:scale-105"
            aria-label="Close modal"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Content Container -->
        <div class="p-5 sm:p-6 space-y-4 sm:space-y-5">
          <!-- Modal Header Title & Subtitle -->
          <div>
            <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Let's Complete your Setup!
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Follow these 3 steps to activate leads, channels, and team collaboration.
            </p>
          </div>

          <!-- Progress Bar Strip -->
          <div class="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div
              class="bg-[#23B750] h-full transition-all duration-500 rounded-full"
              :style="{ width: completionPercentage + '%' }"
            ></div>
          </div>

          <!-- The 3 Distilled Minimizable Boxes (Closed by default, 1s hover / click expand, 2s leave collapse) -->
          <div class="space-y-2.5">
            
            <!-- Box 1: Sales Team -->
            <div
              @mouseenter="handleMouseEnter('team')"
              @mouseleave="handleMouseLeave('team')"
              class="rounded-xl border transition-all duration-200 overflow-hidden"
              :class="setupTasks.team.completed
                ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/60'
                : 'bg-gray-50/60 dark:bg-gray-800/30 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
            >
              <!-- Minimizable Header Row -->
              <div
                @click="handleBoxClick('team')"
                class="px-3.5 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                :class="setupTasks.team.completed
                  ? 'hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30'
                  : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Check Icon Container with Drawing Circular Line Indicator -->
                  <div class="relative w-8 h-8 flex items-center justify-center shrink-0">
                    <!-- Progressively drawing circle line: draws 0% to 100% in 1 second then disappears -->
                    <svg
                      v-if="hoverPending.team"
                      class="absolute -inset-1 w-10 h-10 pointer-events-none text-[#23B750] animate-in fade-in duration-100 -rotate-90 origin-center"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <!-- Faint orbital guide track -->
                      <circle
                        cx="20"
                        cy="20"
                        r="16.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-opacity="0.2"
                      />
                      <!-- Line that draws full circle from 0% to 100% -->
                      <circle
                        cx="20"
                        cy="20"
                        r="16.5"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        pathLength="100"
                        class="draw-circle-line"
                      />
                    </svg>

                    <!-- Larger Lucide Check Icon Button -->
                    <button
                      type="button"
                      @click.stop="toggleTask('team', $event)"
                      class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 z-10"
                      :class="setupTasks.team.completed
                        ? 'bg-[#23B750] hover:bg-[#1da044] text-white shadow-2xs scale-105'
                        : 'border border-gray-300 dark:border-gray-600 bg-gray-50/70 dark:bg-gray-800/70 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:border-gray-400'"
                      :title="setupTasks.team.completed ? 'Mark as incomplete' : 'Mark as complete'"
                    >
                      <Check class="w-4 h-4 stroke-[2.75]" />
                    </button>
                  </div>

                  <span
                    class="text-sm font-bold truncate"
                    :class="setupTasks.team.completed ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'"
                  >
                    Set up Sales Team
                  </span>
                </div>

                <ChevronDown
                  class="w-4 h-4 transition-transform duration-200 shrink-0"
                  :class="[
                    { 'rotate-180': !isMinimized.team },
                    setupTasks.team.completed ? 'text-emerald-700/70 dark:text-emerald-400/70' : 'text-gray-400'
                  ]"
                />
              </div>

              <!-- Expanded Body -->
              <div
                v-if="!isMinimized.team"
                class="px-3.5 pb-3.5 pt-1 space-y-3 text-xs border-t border-gray-150/60 dark:border-gray-800/60 animate-in fade-in duration-150"
              >
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                  Invite colleagues, assign sales squads, and grant permissions to route deals automatically.
                </p>
                <div>
                  <router-link
                    to="/settings?tab=agents"
                    @click="isModalOpen = false"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#23B750] hover:bg-[#1a943e] text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <Users class="w-3.5 h-3.5" />
                    <span>Invite Team Members</span>
                    <ArrowRight class="w-3 h-3" />
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Box 2: WhatsApp Business -->
            <div
              @mouseenter="handleMouseEnter('whatsapp')"
              @mouseleave="handleMouseLeave('whatsapp')"
              class="rounded-xl border transition-all duration-200 overflow-hidden"
              :class="setupTasks.whatsapp.completed
                ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/60'
                : 'bg-gray-50/60 dark:bg-gray-800/30 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
            >
              <!-- Minimizable Header Row -->
              <div
                @click="handleBoxClick('whatsapp')"
                class="px-3.5 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                :class="setupTasks.whatsapp.completed
                  ? 'hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30'
                  : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Check Icon Container with Drawing Circular Line Indicator -->
                  <div class="relative w-8 h-8 flex items-center justify-center shrink-0">
                    <!-- Progressively drawing circle line: draws 0% to 100% in 1 second then disappears -->
                    <svg
                      v-if="hoverPending.whatsapp"
                      class="absolute -inset-1 w-10 h-10 pointer-events-none text-[#23B750] animate-in fade-in duration-100 -rotate-90 origin-center"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <!-- Faint orbital guide track -->
                      <circle
                        cx="20"
                        cy="20"
                        r="16.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-opacity="0.2"
                      />
                      <!-- Line that draws full circle from 0% to 100% -->
                      <circle
                        cx="20"
                        cy="20"
                        r="16.5"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        pathLength="100"
                        class="draw-circle-line"
                      />
                    </svg>

                    <!-- Larger Lucide Check Icon Button -->
                    <button
                      type="button"
                      @click.stop="toggleTask('whatsapp', $event)"
                      class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 z-10"
                      :class="setupTasks.whatsapp.completed
                        ? 'bg-[#23B750] hover:bg-[#1da044] text-white shadow-2xs scale-105'
                        : 'border border-gray-300 dark:border-gray-600 bg-gray-50/70 dark:bg-gray-800/70 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:border-gray-400'"
                      :title="setupTasks.whatsapp.completed ? 'Mark as incomplete' : 'Mark as complete'"
                    >
                      <Check class="w-4 h-4 stroke-[2.75]" />
                    </button>
                  </div>

                  <span
                    class="text-sm font-bold truncate"
                    :class="setupTasks.whatsapp.completed ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'"
                  >
                    Connect WhatsApp Business
                  </span>
                </div>

                <ChevronDown
                  class="w-4 h-4 transition-transform duration-200 shrink-0"
                  :class="[
                    { 'rotate-180': !isMinimized.whatsapp },
                    setupTasks.whatsapp.completed ? 'text-emerald-700/70 dark:text-emerald-400/70' : 'text-gray-400'
                  ]"
                />
              </div>

              <!-- Expanded Body -->
              <div
                v-if="!isMinimized.whatsapp"
                class="px-3.5 pb-3.5 pt-1 space-y-3 text-xs border-t border-gray-150/60 dark:border-gray-800/60 animate-in fade-in duration-150"
              >
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                  Link your WhatsApp Cloud API or scan QR to receive chats in your unified team inbox.
                </p>
                <div>
                  <router-link
                    to="/settings?tab=inboxes"
                    @click="isModalOpen = false"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#23B750] hover:bg-[#1a943e] text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <MessageCircle class="w-3.5 h-3.5" />
                    <span>Connect Channel</span>
                    <ArrowRight class="w-3 h-3" />
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Box 3: Website LiveChat -->
            <div
              @mouseenter="handleMouseEnter('livechat')"
              @mouseleave="handleMouseLeave('livechat')"
              class="rounded-xl border transition-all duration-200 overflow-hidden"
              :class="setupTasks.livechat.completed
                ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/60'
                : 'bg-gray-50/60 dark:bg-gray-800/30 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
            >
              <!-- Minimizable Header Row -->
              <div
                @click="handleBoxClick('livechat')"
                class="px-3.5 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                :class="setupTasks.livechat.completed
                  ? 'hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30'
                  : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Check Icon Container with Drawing Circular Line Indicator -->
                  <div class="relative w-8 h-8 flex items-center justify-center shrink-0">
                    <!-- Progressively drawing circle line: draws 0% to 100% in 1 second then disappears -->
                    <svg
                      v-if="hoverPending.livechat"
                      class="absolute -inset-1 w-10 h-10 pointer-events-none text-[#23B750] animate-in fade-in duration-100 -rotate-90 origin-center"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <!-- Faint orbital guide track -->
                      <circle
                        cx="20"
                        cy="20"
                        r="16.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-opacity="0.2"
                      />
                      <!-- Line that draws full circle from 0% to 100% -->
                      <circle
                        cx="20"
                        cy="20"
                        r="16.5"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        pathLength="100"
                        class="draw-circle-line"
                      />
                    </svg>

                    <!-- Larger Lucide Check Icon Button -->
                    <button
                      type="button"
                      @click.stop="toggleTask('livechat', $event)"
                      class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 z-10"
                      :class="setupTasks.livechat.completed
                        ? 'bg-[#23B750] hover:bg-[#1da044] text-white shadow-2xs scale-105'
                        : 'border border-gray-300 dark:border-gray-600 bg-gray-50/70 dark:bg-gray-800/70 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:border-gray-400'"
                      :title="setupTasks.livechat.completed ? 'Mark as incomplete' : 'Mark as complete'"
                    >
                      <Check class="w-4 h-4 stroke-[2.75]" />
                    </button>
                  </div>

                  <span
                    class="text-sm font-bold truncate"
                    :class="setupTasks.livechat.completed ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'"
                  >
                    Install Website LiveChat
                  </span>
                </div>

                <ChevronDown
                  class="w-4 h-4 transition-transform duration-200 shrink-0"
                  :class="[
                    { 'rotate-180': !isMinimized.livechat },
                    setupTasks.livechat.completed ? 'text-emerald-700/70 dark:text-emerald-400/70' : 'text-gray-400'
                  ]"
                />
              </div>

              <!-- Expanded Body -->
              <div
                v-if="!isMinimized.livechat"
                class="px-3.5 pb-3.5 pt-1 space-y-3 text-xs border-t border-gray-150/60 dark:border-gray-800/60 animate-in fade-in duration-150"
              >
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                  Paste the lightweight JavaScript snippet before &lt;/body&gt; to capture website visitors.
                </p>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="copySnippet"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#23B750] hover:bg-[#1a943e] text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <Check v-if="copiedSnippet" class="w-3.5 h-3.5" />
                    <Copy v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedSnippet ? 'Copied Code!' : 'Copy Embed Snippet' }}</span>
                  </button>

                  <router-link
                    to="/settings?tab=inboxes"
                    @click="isModalOpen = false"
                    class="text-[11px] font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 px-2 py-1 transition-colors"
                  >
                    Configure
                  </router-link>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer: Open Setup Wizard & I'll do it later -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-150 dark:border-gray-800 text-xs">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              I'll do it later
            </button>

            <button
              type="button"
              @click="openSetupWizard"
              class="px-5 py-2 bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Open Setup Wizard</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import {
  Settings,
  Users,
  MessageCircle,
  X,
  Copy,
  Check,
  ChevronDown,
  ArrowRight
} from 'lucide-vue-next';

const router = useRouter();

function openSetupWizard() {
  isModalOpen.value = false;
  router.push('/setup-wizard');
}

const emit = defineEmits<{
  (e: 'toast', message: string): void;
}>();

const isModalOpen = ref(false);

// Minimizable state for each box - default all closed
const isMinimized = reactive({
  team: true,
  whatsapp: true,
  livechat: true
});

// Timers for hover expand (1s)
type BoxKey = 'team' | 'whatsapp' | 'livechat';
const BOX_KEYS: BoxKey[] = ['team', 'whatsapp', 'livechat'];

const hoverTimers: Record<BoxKey, ReturnType<typeof setTimeout> | null> = {
  team: null,
  whatsapp: null,
  livechat: null
};

// Pending hover expansion indicator state
const hoverPending = reactive<Record<BoxKey, boolean>>({
  team: false,
  whatsapp: false,
  livechat: false
});

function clearBoxTimers(key: BoxKey) {
  hoverPending[key] = false;
  if (hoverTimers[key]) {
    clearTimeout(hoverTimers[key]!);
    hoverTimers[key] = null;
  }
}

// Ensure only one card is open at a time
function openCard(key: BoxKey) {
  BOX_KEYS.forEach((k) => {
    if (k !== key) {
      isMinimized[k] = true;
      clearBoxTimers(k);
    }
  });
  isMinimized[key] = false;
  hoverPending[key] = false;
}

function handleMouseEnter(key: BoxKey) {
  // If already expanded, nothing to schedule
  if (!isMinimized[key]) return;

  // Show revolving circular line indicator around check icon
  hoverPending[key] = true;

  // Schedule expansion after 1 second (1000ms, matching 1 full rotation of the revolving line)
  if (!hoverTimers[key]) {
    hoverTimers[key] = setTimeout(() => {
      openCard(key);
      hoverTimers[key] = null;
    }, 1000);
  }
}

function handleMouseLeave(key: BoxKey) {
  // Cancel pending hover expand timer if user leaves before 1s
  clearBoxTimers(key);
}

function handleBoxClick(key: BoxKey) {
  clearBoxTimers(key);
  // Toggle: if currently closed, open this card and close all others; if currently open, close it
  const willOpen = isMinimized[key];
  if (willOpen) {
    openCard(key);
  } else {
    isMinimized[key] = true;
  }
}

watch(isModalOpen, (isOpen) => {
  if (!isOpen) {
    (['team', 'whatsapp', 'livechat'] as BoxKey[]).forEach(clearBoxTimers);
  }
});

onUnmounted(() => {
  (['team', 'whatsapp', 'livechat'] as BoxKey[]).forEach(clearBoxTimers);
});

// Persistent state
const STORAGE_KEY = 'rakansales_crm_setup_checklist_v5';

interface TaskState {
  completed: boolean;
}

const setupTasks = reactive<{
  team: TaskState;
  whatsapp: TaskState;
  livechat: TaskState;
}>({
  team: { completed: false },
  whatsapp: { completed: false },
  livechat: { completed: false }
});

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.team !== undefined) setupTasks.team.completed = !!parsed.team;
      if (parsed.whatsapp !== undefined) setupTasks.whatsapp.completed = !!parsed.whatsapp;
      if (parsed.livechat !== undefined) setupTasks.livechat.completed = !!parsed.livechat;
    }
  } catch (e) {
    console.error('Failed to load setup state', e);
  }
});

watch(
  () => ({
    team: setupTasks.team.completed,
    whatsapp: setupTasks.whatsapp.completed,
    livechat: setupTasks.livechat.completed
  }),
  (state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save setup state', e);
    }
  },
  { deep: true }
);

const completedCount = computed(() => {
  let count = 0;
  if (setupTasks.team.completed) count++;
  if (setupTasks.whatsapp.completed) count++;
  if (setupTasks.livechat.completed) count++;
  return count;
});

const completionPercentage = computed(() => {
  return Math.round((completedCount.value / 3) * 100);
});

const allCompleted = computed(() => completedCount.value === 3);

const remainingTasksText = computed(() => {
  const pending: string[] = [];
  if (!setupTasks.team.completed) pending.push('team');
  if (!setupTasks.whatsapp.completed) pending.push('WhatsApp');
  if (!setupTasks.livechat.completed) pending.push('LiveChat');
  
  if (pending.length === 3) return 'Set up team, WhatsApp, and LiveChat';
  if (pending.length === 2) return `Set up ${pending.join(' and ')}`;
  if (pending.length === 1) return `Set up ${pending[0]}`;
  return 'All tasks finished';
});

// Confetti Particle Explosion
function triggerConfetti(event?: MouseEvent) {
  let origin = { x: 0.5, y: 0.5 };
  if (event && window.innerWidth > 0 && window.innerHeight > 0) {
    origin = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight
    };
  }

  confetti({
    particleCount: 65,
    spread: 60,
    origin,
    colors: ['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B']
  });

  if (allCompleted.value) {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#23B750', '#62D816', '#10B981', '#F59E0B', '#EC4899']
      });
    }, 250);
  }
}

function toggleTask(key: 'team' | 'whatsapp' | 'livechat', event?: MouseEvent) {
  setupTasks[key].completed = !setupTasks[key].completed;
  const isDone = setupTasks[key].completed;
  const name = key === 'team' ? 'Sales Team' : key === 'whatsapp' ? 'WhatsApp Channel' : 'LiveChat Widget';
  emit('toast', isDone ? `${name} completed!` : `${name} marked as incomplete.`);
  
  if (isDone) {
    triggerConfetti(event);
  }
}

// 1-Click Copy Snippet
const copiedSnippet = ref(false);
function copySnippet() {
  const snippet = '<script src="https://cdn.rakansales.com/widget.js" data-site-id="rks_live_9942" async><\/script>';
  navigator.clipboard?.writeText(snippet);
  copiedSnippet.value = true;
  setTimeout(() => {
    copiedSnippet.value = false;
  }, 2000);
  emit('toast', 'LiveChat snippet copied to clipboard.');
}
</script>

<style scoped>
.crm-setup-bar-wrapper {
  font-family: inherit;
}

@keyframes drawCircleLine {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.draw-circle-line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawCircleLine 1000ms linear forwards;
}
</style>
