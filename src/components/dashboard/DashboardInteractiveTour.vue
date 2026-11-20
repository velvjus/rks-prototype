<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="rks-tour-root"
      role="region"
      aria-label="Interactive dashboard walkthrough"
    >
      <!-- ═══════════════════════════════════════════════════════════
           PHASE 1: WELCOME COVER CARD (Minimal Pill + Title + Description)
           ═══════════════════════════════════════════════════════════ -->
      <Transition name="tour-fade">
        <div
          v-if="phase === 'welcome'"
          class="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-tour-scrim backdrop-blur-[2px]"
          @click.self="closeTour"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-welcome-title"
            class="w-full max-w-[420px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground tour-card-enter"
          >
            <div class="p-6 space-y-3">
              <div class="flex items-center justify-between">
                <div class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                  <Play class="w-3 h-3 fill-current" />
                  <span>Interactive Walkthrough · ~1 min</span>
                </div>
                <button
                  type="button"
                  @click="closeTour"
                  class="p-1.5 -mr-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Close walkthrough"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <div class="space-y-1.5">
                <h2 id="tour-welcome-title" class="text-lg font-bold tracking-tight text-foreground">
                  Master the RakanSales Dashboard
                </h2>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Follow live click prompts right on your real workspace. Filter metrics, switch revenue views, nudge stale deals, and message an opportunity inline.
                </p>
              </div>
            </div>

            <div class="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-center">
              <button
                type="button"
                @click="startAtStep(0)"
                class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Start Tour</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ═══════════════════════════════════════════════════════════
           PHASE 2: ACTIVE GUIDED SPOTLIGHT + INTERACTIVE HOTSPOT
           ═══════════════════════════════════════════════════════════ -->
      <template v-if="phase === 'active' && currentStep">
        <!-- Layer 1: SVG Scrim Overlay with Smooth Morphing Cutout (pointer-events-none) -->
        <svg
          class="fixed inset-0 w-full h-full z-[90] pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <mask id="rks-tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                v-if="spotlightRect"
                class="tour-cutout-rect"
                :x="spotlightRect.left"
                :y="spotlightRect.top"
                :width="spotlightRect.width"
                :height="spotlightRect.height"
                :rx="spotlightRadius"
                :ry="spotlightRadius"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="var(--tour-scrim)"
            mask="url(#rks-tour-spotlight-mask)"
          />
        </svg>

        <!-- Layer 2: 4 Invisible Click-Guard Shields around the Cutout (keeps target 100% clickable!) -->
        <template v-if="spotlightRect">
          <!-- Top Guard -->
          <div
            class="fixed left-0 right-0 top-0 z-[91]"
            :style="{ height: `${Math.max(0, spotlightRect.top)}px` }"
            @click="handleOutsideClick"
          ></div>
          <!-- Bottom Guard -->
          <div
            class="fixed left-0 right-0 bottom-0 z-[91]"
            :style="{ top: `${Math.min(viewport.height, spotlightRect.top + spotlightRect.height)}px` }"
            @click="handleOutsideClick"
          ></div>
          <!-- Left Guard -->
          <div
            class="fixed left-0 z-[91]"
            :style="{
              top: `${Math.max(0, spotlightRect.top)}px`,
              height: `${Math.max(0, spotlightRect.height)}px`,
              width: `${Math.max(0, spotlightRect.left)}px`
            }"
            @click="handleOutsideClick"
          ></div>
          <!-- Right Guard -->
          <div
            class="fixed right-0 z-[91]"
            :style="{
              top: `${Math.max(0, spotlightRect.top)}px`,
              height: `${Math.max(0, spotlightRect.height)}px`,
              left: `${Math.min(viewport.width, spotlightRect.left + spotlightRect.width)}px`
            }"
            @click="handleOutsideClick"
          ></div>
        </template>

        <!-- Layer 3: Crisp Animated Spotlight Ring -->
        <div
          v-if="spotlightRect"
          class="fixed z-[92] pointer-events-none tour-spotlight-ring border-2 border-primary"
          :class="{ 'tour-nudge-ring': isNudging }"
          :style="{
            top: `${spotlightRect.top}px`,
            left: `${spotlightRect.left}px`,
            width: `${spotlightRect.width}px`,
            height: `${spotlightRect.height}px`,
            borderRadius: `${spotlightRadius}px`
          }"
        ></div>

        <!-- Layer 3b: Storylane / Supademo Pulsing Hotspot Beacon (Positioned Beside Target) -->
        <div
          v-if="hotspotPoint && currentStep.mode === 'click'"
          class="fixed z-[93] pointer-events-none -translate-x-1/2 -translate-y-1/2 tour-beacon-transition"
          :style="{
            top: `${hotspotPoint.y}px`,
            left: `${hotspotPoint.x}px`
          }"
        >
          <div v-if="stepCompletedFlash" class="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg tour-pop-in">
            <Check class="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div v-else class="relative flex items-center justify-center w-7 h-7">
            <span class="tour-beacon-ripple absolute inset-0 rounded-full bg-primary/45"></span>
            <span class="tour-beacon-ripple-delayed absolute inset-0 rounded-full bg-primary/30"></span>
            <span class="relative w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-card shadow-md flex items-center justify-center">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-foreground"></span>
            </span>
          </div>
        </div>

        <!-- Layer 4: Minimal High-Contrast Floating Callout Card (Black in Light Mode, White in Dark Mode) -->
        <div
          v-if="calloutStyleReady"
          ref="calloutRef"
          role="dialog"
          aria-live="polite"
          :aria-labelledby="`tour-step-title-${currentStep.id}`"
          class="fixed z-[95] w-[328px] max-w-[calc(100vw-24px)] bg-tour-callout text-tour-callout-foreground border border-tour-callout-border rounded-2xl shadow-2xl tour-callout-transition"
          :class="{ 'tour-nudge-card': isNudging }"
          :style="calloutPosition.style"
        >
          <!-- Directional Arrow Pointer -->
          <div
            v-if="calloutPosition.arrowVisible"
            class="absolute w-3 h-3 bg-tour-callout border-tour-callout-border rotate-45 pointer-events-none"
            :class="calloutPosition.arrowBorderClass"
            :style="calloutPosition.arrowStyle"
          ></div>

          <div class="relative p-4 space-y-3">
            <!-- Title & Close -->
            <div class="flex items-start justify-between gap-3">
              <h3 :id="`tour-step-title-${currentStep.id}`" class="text-sm font-bold text-tour-callout-foreground leading-snug">
                {{ currentStep.title }}
              </h3>
              <button
                type="button"
                @click="closeTour"
                class="p-1 -mr-1 -mt-0.5 rounded-md text-tour-callout-muted hover:text-tour-callout-foreground hover:bg-tour-callout-foreground/10 transition-colors cursor-pointer shrink-0"
                title="Exit tour (Esc)"
                aria-label="Exit walkthrough"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Concise Description -->
            <p class="text-xs text-tour-callout-muted leading-relaxed">
              {{ currentStep.description }}
            </p>

            <!-- Clean Footer: Back Arrow + Step Counter (clickable to go back) & Next -->
            <div class="pt-2.5 border-t border-tour-callout-border flex items-center justify-between gap-2">
              <button
                type="button"
                :disabled="currentStepIndex === 0"
                @click="prevStep"
                class="inline-flex items-center gap-1.5 px-2 py-1 -ml-1 rounded-lg text-xs font-semibold tabular-nums transition-colors"
                :class="currentStepIndex === 0
                  ? 'text-tour-callout-muted/60 cursor-default'
                  : 'text-tour-callout-muted hover:text-tour-callout-foreground hover:bg-tour-callout-foreground/10 cursor-pointer'"
                :title="currentStepIndex === 0 ? 'Step 1' : 'Go back one step'"
                :aria-label="currentStepIndex === 0 ? `Step ${currentStepIndex + 1} of ${steps.length}` : `Go back to step ${currentStepIndex}`"
              >
                <ArrowLeft class="w-3.5 h-3.5 shrink-0" />
                <span>{{ currentStepIndex + 1 }} / {{ steps.length }}</span>
              </button>

              <button
                type="button"
                @click="nextStep"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <span>{{ isLastStep ? 'Finish' : 'Next' }}</span>
                <Check v-if="isLastStep" class="w-3.5 h-3.5" />
                <ArrowRight v-else class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Layer 5: Minimal Floating Progress Dock -->
        <div
          class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[95] max-w-[calc(100vw-24px)]"
        >
          <div class="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-xl text-xs">
            <!-- Interactive Step Scrubber with Custom Hover Tooltips -->
            <div class="flex items-center gap-0.5" role="tablist" aria-label="Walkthrough steps">
              <button
                v-for="(step, idx) in steps"
                :key="step.id"
                type="button"
                @click="jumpToStep(idx)"
                :aria-label="`Step ${idx + 1}: ${step.title}`"
                :aria-current="idx === currentStepIndex ? 'step' : undefined"
                class="group relative py-2 px-1 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                <span
                  class="block h-1.5 rounded-full transition-all duration-200"
                  :class="[
                    idx === currentStepIndex
                      ? 'w-7 bg-primary'
                      : idx < currentStepIndex
                        ? 'w-3 bg-primary/60 group-hover:bg-primary'
                        : 'w-3 bg-muted-foreground/25 group-hover:bg-muted-foreground/55'
                  ]"
                ></span>

                <!-- Step Hover / Focus Tooltip -->
                <span
                  role="tooltip"
                  class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-tour-callout text-tour-callout-foreground border border-tour-callout-border shadow-lg text-[11px] font-medium whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-150 flex items-center gap-1.5"
                >
                  <span class="font-bold text-primary tabular-nums">{{ idx + 1 }}.</span>
                  <span>{{ step.title }}</span>
                </span>
              </button>
            </div>

            <!-- Restart & Exit Controls -->
            <div class="flex items-center gap-1 pl-2 border-l border-border">
              <button
                type="button"
                @click="restartTour"
                class="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Restart walkthrough"
                aria-label="Restart walkthrough"
              >
                <RotateCcw class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                @click="closeTour"
                class="px-2 py-1 rounded-full text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Exit tour (Esc)"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ═══════════════════════════════════════════════════════════
           PHASE 3: SIMPLE COMPLETION CARD
           ═══════════════════════════════════════════════════════════ -->
      <Transition name="tour-fade">
        <div
          v-if="phase === 'complete'"
          class="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-tour-scrim backdrop-blur-[2px]"
          @click.self="finishAndClose"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-complete-title"
            class="w-full max-w-[390px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground tour-card-enter"
          >
            <div class="p-6 text-center space-y-3">
              <div class="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center mx-auto">
                <CheckCircle2 class="w-5 h-5" />
              </div>

              <div class="space-y-1.5">
                <h2 id="tour-complete-title" class="text-lg font-bold tracking-tight text-foreground">
                  You're ready to run the floor
                </h2>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  You've walked through live revenue KPIs, funnel revenue views, one-click stale deal follow-ups, and inline WhatsApp messaging.
                </p>
              </div>
            </div>

            <div class="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-between gap-2">
              <button
                type="button"
                @click="restartTour"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
              <button
                type="button"
                @click="finishAndClose"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Back to Dashboard</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import confetti from 'canvas-confetti';
import {
  Play,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  RotateCcw,
} from 'lucide-vue-next';

export interface DashboardTourController {
  getActiveTab: () => string;
  setActiveTab: (tab: 'overview' | 'pipeline' | 'marketing' | 'support') => void;
  hasSampleData: () => boolean;
  ensureSampleData: () => void;
  openDateMenu: () => void;
  closeDateMenu: () => void;
  selectDatePreset: (presetId: string) => void;
  setFunnelMode: (mode: 'Count' | 'Value') => void;
  nudgeStaleDeals: () => void;
  openFirstOpportunity: () => void;
  closeOpportunityDrawer: () => void;
  sendDrawerMessage: () => void;
  closeKebabMenu: () => void;
}

type CalloutSide = 'bottom' | 'top' | 'left' | 'right';
type HotspotSide = 'outside-left' | 'outside-right' | 'outside-top' | 'outside-bottom';

interface TourStep {
  id: string;
  chapterLabel: string;
  title: string;
  description: string;
  mode: 'click' | 'explain';
  /** Element framed by the spotlight cutout */
  targetSelector: string;
  /** Optional narrower element inside the spotlight where the click + pulsing beacon sit */
  clickSelector?: string;
  /** Preferred side for the floating callout card */
  preferredSide: CalloutSide;
  /** Padding around target rect in px */
  padding?: number;
  /** Corner radius of spotlight cutout in px */
  radius?: number;
  /** Beacon position beside the target so it never overlaps text/icons */
  hotspotSide?: HotspotSide;
  /** Delay before measuring target after prepare() (e.g. tab switch or drawer render) */
  enterDelayMs?: number;
  /** Brief pause after user clicks so they see the live UI reaction before advancing */
  advanceDelayMs?: number;
  /** Ensure dashboard state makes the target visible */
  prepare: () => void;
  /** Execute the step's action when the user clicks "Next" */
  performAction?: () => void;
}

const props = defineProps<{
  open: boolean;
  controller: DashboardTourController;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

type TourPhase = 'welcome' | 'active' | 'complete';

const phase = ref<TourPhase>('welcome');
const currentStepIndex = ref(0);
const stepCompletedFlash = ref(false);
const isNudging = ref(false);
const calloutRef = ref<HTMLElement | null>(null);
const calloutStyleReady = ref(false);

const viewport = ref({
  width: typeof window !== 'undefined' ? window.innerWidth : 1280,
  height: typeof window !== 'undefined' ? window.innerHeight : 800,
});

interface RectBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const spotlightRect = ref<RectBox | null>(null);
const hotspotPoint = ref<{ x: number; y: number } | null>(null);
/** Locked side for the active step so the card travels in one direct vector without flipping mid-scroll */
const lockedSide = ref<CalloutSide | null>(null);

const steps: TourStep[] = [
  {
    id: 'kpi-strip',
    chapterLabel: 'Executive Pulse',
    title: 'Track revenue, pipeline & response SLA',
    description:
      'These four KPIs track closed-won revenue, open pipeline value, win conversion, and first-response speed. Hover any info badge to inspect its formula.',
    mode: 'explain',
    targetSelector: '[data-tour="kpi-strip"]',
    preferredSide: 'bottom',
    padding: 8,
    radius: 16,
    enterDelayMs: 60,
    prepare: () => {
      props.controller.ensureSampleData();
      props.controller.closeDateMenu();
      props.controller.closeKebabMenu();
      props.controller.closeOpportunityDrawer();
      props.controller.setActiveTab('overview');
    },
  },
  {
    id: 'date-range-btn',
    chapterLabel: 'Executive Pulse',
    title: 'Open the reporting window picker',
    description:
      'Filter every KPI, chart, and leaderboard simultaneously by switching your active date range.',
    mode: 'click',
    targetSelector: '[data-tour="date-range-btn"]',
    preferredSide: 'bottom',
    padding: 6,
    radius: 10,
    hotspotSide: 'outside-left',
    enterDelayMs: 60,
    advanceDelayMs: 180,
    prepare: () => {
      props.controller.closeDateMenu();
      props.controller.closeKebabMenu();
      props.controller.closeOpportunityDrawer();
      props.controller.setActiveTab('overview');
    },
    performAction: () => {
      props.controller.openDateMenu();
    },
  },
  {
    id: 'date-preset-last7',
    chapterLabel: 'Executive Pulse',
    title: 'Apply a live 7-day preset',
    description:
      'Choose "Last 7 Days" to narrow the dashboard to this week\'s momentum. Your active range stays synced across all tabs.',
    mode: 'click',
    targetSelector: '[data-tour="date-preset-last7"]',
    preferredSide: 'left',
    padding: 4,
    radius: 10,
    hotspotSide: 'outside-right',
    enterDelayMs: 90,
    advanceDelayMs: 120,
    prepare: () => {
      props.controller.setActiveTab('overview');
      props.controller.openDateMenu();
    },
    performAction: () => {
      props.controller.selectDatePreset('last7');
    },
  },
  {
    id: 'funnel-value-btn',
    chapterLabel: 'Analytics & Action',
    title: 'Switch the funnel to RM value',
    description:
      'Toggle "Deal Value" to see total RM revenue sitting in each qualification stage instead of raw deal count.',
    mode: 'click',
    targetSelector: '[data-tour="funnel-value-btn"]',
    preferredSide: 'left',
    padding: 6,
    radius: 8,
    hotspotSide: 'outside-right',
    enterDelayMs: 80,
    advanceDelayMs: 460,
    prepare: () => {
      props.controller.closeDateMenu();
      props.controller.closeOpportunityDrawer();
      props.controller.setActiveTab('overview');
      props.controller.setFunnelMode('Count');
    },
    performAction: () => {
      props.controller.setFunnelMode('Value');
    },
  },
  {
    id: 'stale-deals-btn',
    chapterLabel: 'Analytics & Action',
    title: 'Re-engage stale deals in one click',
    description:
      'Queue automated WhatsApp follow-ups for deals inactive over 3 days directly from the pipeline health bar.',
    mode: 'click',
    targetSelector: '[data-tour="stale-deals-btn"]',
    preferredSide: 'bottom',
    padding: 6,
    radius: 10,
    hotspotSide: 'outside-left',
    enterDelayMs: 80,
    advanceDelayMs: 480,
    prepare: () => {
      props.controller.closeDateMenu();
      props.controller.closeOpportunityDrawer();
      props.controller.setActiveTab('overview');
    },
    performAction: () => {
      props.controller.nudgeStaleDeals();
    },
  },
  {
    id: 'tab-pipeline',
    chapterLabel: 'Pipeline Deep-Dive',
    title: 'Switch to Pipeline Velocity',
    description:
      'Inspect stage durations, lost-deal root causes, and every active opportunity in one dedicated view.',
    mode: 'click',
    targetSelector: '[data-tour="tab-pipeline"]',
    preferredSide: 'bottom',
    padding: 6,
    radius: 10,
    hotspotSide: 'outside-top',
    enterDelayMs: 80,
    advanceDelayMs: 220,
    prepare: () => {
      props.controller.closeDateMenu();
      props.controller.closeOpportunityDrawer();
      props.controller.setActiveTab('overview');
    },
    performAction: () => {
      props.controller.setActiveTab('pipeline');
    },
  },
  {
    id: 'first-opportunity-row',
    chapterLabel: 'Pipeline Deep-Dive',
    title: 'Open any opportunity inline',
    description:
      'Select an active deal row to open its quick-action drawer—review deal context and follow up without leaving the dashboard.',
    mode: 'click',
    targetSelector: '[data-tour="first-opportunity-row"]',
    preferredSide: 'top',
    padding: 4,
    radius: 10,
    hotspotSide: 'outside-left',
    enterDelayMs: 120,
    advanceDelayMs: 260,
    prepare: () => {
      props.controller.ensureSampleData();
      props.controller.closeOpportunityDrawer();
      props.controller.setActiveTab('pipeline');
    },
    performAction: () => {
      props.controller.openFirstOpportunity();
    },
  },
  {
    id: 'opportunity-drawer',
    chapterLabel: 'Pipeline Deep-Dive',
    title: 'Send a contextual WhatsApp message',
    description:
      'Adjust the pre-filled follow-up template if needed, then send it straight to the client from the slide-over drawer.',
    mode: 'click',
    targetSelector: '[data-tour="opportunity-drawer"]',
    clickSelector: '[data-tour="drawer-send-btn"]',
    preferredSide: 'left',
    padding: 0,
    radius: 0,
    hotspotSide: 'outside-left',
    enterDelayMs: 140,
    advanceDelayMs: 160,
    prepare: () => {
      props.controller.ensureSampleData();
      props.controller.setActiveTab('pipeline');
      props.controller.openFirstOpportunity();
    },
    performAction: () => {
      props.controller.sendDrawerMessage();
    },
  },
  {
    id: 'header-actions',
    chapterLabel: 'Export & Workspace',
    title: 'Export CSVs & manage sample data',
    description:
      'Download executive CSV reports anytime, or use the three-dot menu to clear demo sample data once your live CRM feeds are active.',
    mode: 'explain',
    targetSelector: '[data-tour="header-actions"]',
    preferredSide: 'bottom',
    padding: 6,
    radius: 10,
    enterDelayMs: 100,
    prepare: () => {
      props.controller.closeOpportunityDrawer();
      props.controller.closeDateMenu();
      props.controller.closeKebabMenu();
    },
  },
];

const currentStep = computed(() => steps[currentStepIndex.value] ?? null);
const isLastStep = computed(() => currentStepIndex.value === steps.length - 1);
const spotlightRadius = computed(() => currentStep.value?.radius ?? 12);

// ═════════════════════════════════════════════════════════
// TARGET MEASUREMENT, SMOOTH SCROLL & CLICK DETECTION
// ═════════════════════════════════════════════════════════
let activeTargetEl: HTMLElement | null = null;
let activeClickEl: HTMLElement | null = null;
let resizeObserver: ResizeObserver | null = null;
let rafSyncId: number | null = null;
let rafStopTimer: ReturnType<typeof setTimeout> | null = null;
let advanceTimer: ReturnType<typeof setTimeout> | null = null;
let nudgeTimer: ReturnType<typeof setTimeout> | null = null;
let isAdvancing = false;
let isTransitioning = false;
let activationSeq = 0;

function clearTimers() {
  if (rafSyncId !== null) {
    cancelAnimationFrame(rafSyncId);
    rafSyncId = null;
  }
  if (rafStopTimer) {
    clearTimeout(rafStopTimer);
    rafStopTimer = null;
  }
  if (advanceTimer) {
    clearTimeout(advanceTimer);
    advanceTimer = null;
  }
  if (nudgeTimer) {
    clearTimeout(nudgeTimer);
    nudgeTimer = null;
  }
}

function disconnectObservers() {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  activeTargetEl = null;
  activeClickEl = null;
}

function findScrollContainer(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    if (/(auto|scroll)/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

function computeBestSide(rect: RectBox, preferred: CalloutSide, cardW: number, cardH: number): CalloutSide {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 18;
  const edgeMargin = 14;
  const bottomDockReserve = 78;

  const spaceAbove = rect.top - edgeMargin;
  const spaceBelow = vh - bottomDockReserve - (rect.top + rect.height);
  const spaceLeft = rect.left - edgeMargin;
  const spaceRight = vw - edgeMargin - (rect.left + rect.width);

  const canPlace: Record<CalloutSide, boolean> = {
    bottom: spaceBelow >= cardH + gap,
    top: spaceAbove >= cardH + gap,
    left: spaceLeft >= cardW + gap,
    right: spaceRight >= cardW + gap,
  };

  const fallbackOrder: CalloutSide[] = [preferred, 'bottom', 'top', 'left', 'right'];
  const picked = fallbackOrder.find((s) => canPlace[s]);
  if (picked) return picked;

  const spaces: Array<[CalloutSide, number]> = [
    ['bottom', spaceBelow],
    ['top', spaceAbove],
    ['left', spaceLeft],
    ['right', spaceRight],
  ];
  spaces.sort((a, b) => b[1] - a[1]);
  return spaces[0][0];
}

function computeSpotlightFromDom(step: TourStep, targetEl: HTMLElement): RectBox {
  const rect = targetEl.getBoundingClientRect();
  const pad = step.padding ?? 6;
  const top = Math.max(0, rect.top - pad);
  const left = Math.max(0, rect.left - pad);
  const right = Math.min(window.innerWidth, rect.right + pad);
  const bottom = Math.min(window.innerHeight, rect.bottom + pad);
  return {
    top,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

function computeHotspotPoint(
  step: TourStep,
  clickEl: HTMLElement,
  spotRect: RectBox
): { x: number; y: number } {
  // Beacon outer diameter is 28px (w-7 h-7).
  // Placing center 10% of diameter (2.8px) outside the box edge creates an exact 40% overlap into the box.
  const beaconDiameter = 28;
  const edgeOffset = beaconDiameter * 0.1;
  const side = step.hotspotSide ?? 'outside-left';

  // Anchor to the spotlight box edge (or the inner click button rect when clickSelector is set)
  const anchor = step.clickSelector
    ? (() => {
        const r = clickEl.getBoundingClientRect();
        return { top: r.top, left: r.left, width: r.width, height: r.height };
      })()
    : spotRect;

  let hx = anchor.left - edgeOffset;
  let hy = anchor.top + anchor.height / 2;

  if (side === 'outside-right') {
    hx = anchor.left + anchor.width + edgeOffset;
    hy = anchor.top + anchor.height / 2;
  } else if (side === 'outside-top') {
    hx = anchor.left + anchor.width / 2;
    hy = anchor.top - edgeOffset;
  } else if (side === 'outside-bottom') {
    hx = anchor.left + anchor.width / 2;
    hy = anchor.top + anchor.height + edgeOffset;
  }

  // Clamp cleanly inside viewport edges
  hx = Math.min(Math.max(16, hx), window.innerWidth - 16);
  hy = Math.min(Math.max(16, hy), window.innerHeight - 16);
  return { x: hx, y: hy };
}

function measureForStep(step: TourStep) {
  viewport.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const targetEl = document.querySelector(step.targetSelector) as HTMLElement | null;
  const clickEl = (
    step.clickSelector
      ? document.querySelector(step.clickSelector)
      : targetEl
  ) as HTMLElement | null;

  activeTargetEl = targetEl;
  activeClickEl = clickEl;

  if (!targetEl) {
    // Keep the previous spotlightRect intact during transient DOM unmounts (e.g. closing menus/drawers)
    // so the callout card never jumps to center-screen before gliding to the next step.
    hotspotPoint.value = null;
    return;
  }

  const spotRect = computeSpotlightFromDom(step, targetEl);
  spotlightRect.value = spotRect;

  if (clickEl && step.mode === 'click') {
    hotspotPoint.value = computeHotspotPoint(step, clickEl, spotRect);
  } else {
    hotspotPoint.value = null;
  }
}

function measureCurrentTarget() {
  if (isTransitioning) return;
  const step = currentStep.value;
  if (!step || phase.value !== 'active') {
    spotlightRect.value = null;
    hotspotPoint.value = null;
    return;
  }
  measureForStep(step);
}

function startSmoothTracking(durationMs = 520) {
  if (rafSyncId !== null) cancelAnimationFrame(rafSyncId);
  if (rafStopTimer) clearTimeout(rafStopTimer);

  const tick = () => {
    measureCurrentTarget();
    rafSyncId = requestAnimationFrame(tick);
  };
  rafSyncId = requestAnimationFrame(tick);

  rafStopTimer = setTimeout(() => {
    if (rafSyncId !== null) {
      cancelAnimationFrame(rafSyncId);
      rafSyncId = null;
    }
    measureCurrentTarget();
  }, durationMs);
}

async function activateStep(index: number) {
  if (index < 0 || index >= steps.length) return;

  const seq = ++activationSeq;
  isTransitioning = true;
  clearTimers();
  disconnectObservers();
  stepCompletedFlash.value = false;
  isAdvancing = false;

  const nextStepDef = steps[index];

  // 1. Prepare dashboard state FIRST without mutating currentStepIndex yet,
  //    so the callout card NEVER jumps to the new side of the old spotlight!
  nextStepDef.prepare();
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, nextStepDef.enterDelayMs ?? 80));

  if (seq !== activationSeq || !props.open) {
    isTransitioning = false;
    return;
  }

  const targetEl = document.querySelector(nextStepDef.targetSelector) as HTMLElement | null;
  const cardW = Math.min(328, window.innerWidth - 24);
  const cardH = calloutRef.value?.offsetHeight || 156;

  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const safeTop = 82;
    const safeBottom = window.innerHeight - 110;
    const needsScroll = nextStepDef.padding !== 0 && (rect.top < safeTop || rect.bottom > safeBottom);

    let scrollDeltaY = 0;
    let scrollContainer: HTMLElement | null = null;
    let targetScrollTop = 0;

    if (needsScroll) {
      scrollContainer = findScrollContainer(targetEl);
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const desiredTop = containerRect.top + (containerRect.height - rect.height) / 2;
        const rawDelta = rect.top - desiredTop;
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        targetScrollTop = Math.min(Math.max(0, scrollContainer.scrollTop + rawDelta), maxScroll);
        scrollDeltaY = targetScrollTop - scrollContainer.scrollTop;
      }
    }

    // Predict final post-scroll rect and lock the callout side ONCE so it never flips mid-scroll
    const pad = nextStepDef.padding ?? 6;
    const predictedRect: RectBox = {
      top: Math.max(0, rect.top - scrollDeltaY - pad),
      left: Math.max(0, rect.left - pad),
      width: Math.max(0, rect.width + pad * 2),
      height: Math.max(0, rect.height + pad * 2),
    };

    // 2. If the target requires scrolling, scroll smoothly first while keeping the previous
    //    spotlight & card locked in place (no null-rect flash or double-jump)
    if (needsScroll && scrollContainer && Math.abs(scrollDeltaY) > 8) {
      scrollContainer.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      await new Promise((resolve) => setTimeout(resolve, 320));
      if (seq !== activationSeq || !props.open) {
        isTransitioning = false;
        return;
      }
    } else if (needsScroll) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      await new Promise((resolve) => setTimeout(resolve, 320));
      if (seq !== activationSeq || !props.open) {
        isTransitioning = false;
        return;
      }
    }

    // 3. Commit lockedSide, currentStepIndex, spotlightRect, and hotspotPoint ATOMICALLY in one tick
    isTransitioning = false;
    const settledRect = computeSpotlightFromDom(nextStepDef, targetEl);
    lockedSide.value = computeBestSide(settledRect, nextStepDef.preferredSide, cardW, cardH);
    currentStepIndex.value = index;
    phase.value = 'active';
    measureForStep(nextStepDef);
    calloutStyleReady.value = true;

    resizeObserver = new ResizeObserver(() => {
      if (!isTransitioning) measureCurrentTarget();
    });
    resizeObserver.observe(targetEl);
    startSmoothTracking(220);
  } else {
    isTransitioning = false;
    lockedSide.value = nextStepDef.preferredSide;
    currentStepIndex.value = index;
    phase.value = 'active';
    measureForStep(nextStepDef);
    calloutStyleReady.value = true;
  }
}

// Listen for genuine user clicks on the active target element
function handleGlobalClick(e: MouseEvent) {
  if (!props.open || phase.value !== 'active' || isAdvancing) return;
  const step = currentStep.value;
  if (!step || step.mode !== 'click') return;

  const clickTarget = activeClickEl ?? activeTargetEl;
  if (!clickTarget) return;

  const clickedNode = e.target as Node | null;
  if (clickedNode && clickTarget.contains(clickedNode)) {
    isAdvancing = true;
    isTransitioning = true;
    clearTimers();
    disconnectObservers();
    stepCompletedFlash.value = true;
    const delay = step.advanceDelayMs ?? 280;
    advanceTimer = setTimeout(() => {
      advanceAfterCurrent();
    }, delay);
  }
}

function handleOutsideClick() {
  isNudging.value = false;
  requestAnimationFrame(() => {
    isNudging.value = true;
    if (nudgeTimer) clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(() => {
      isNudging.value = false;
    }, 420);
  });
}

function advanceAfterCurrent() {
  if (currentStepIndex.value < steps.length - 1) {
    activateStep(currentStepIndex.value + 1);
  } else {
    enterCompletePhase();
  }
}

function runStepAndAdvance() {
  if (isAdvancing) return;
  const step = currentStep.value;
  if (!step) return;

  isAdvancing = true;
  isTransitioning = true;
  clearTimers();
  disconnectObservers();
  step.performAction?.();
  stepCompletedFlash.value = true;
  const delay = step.advanceDelayMs ?? 240;
  advanceTimer = setTimeout(() => {
    advanceAfterCurrent();
  }, delay);
}

function nextStep() {
  if (isAdvancing) return;
  const step = currentStep.value;
  if (!step) return;

  if (step.mode === 'click' && step.performAction) {
    runStepAndAdvance();
    return;
  }
  advanceAfterCurrent();
}

function prevStep() {
  if (currentStepIndex.value <= 0) return;
  activateStep(currentStepIndex.value - 1);
}

function jumpToStep(index: number) {
  activateStep(index);
}

function startAtStep(index: number) {
  props.controller.ensureSampleData();
  calloutStyleReady.value = false;
  activateStep(index);
}

function restartTour() {
  props.controller.ensureSampleData();
  calloutStyleReady.value = false;
  activateStep(0);
}

function resolveThemeHexColor(cssVar: string, fallbackVar: string): string {
  if (typeof window === 'undefined') return '';
  const styles = getComputedStyle(document.documentElement);
  const direct = styles.getPropertyValue(cssVar).trim();
  if (direct) return direct;
  return styles.getPropertyValue(fallbackVar).trim();
}

function fireCompletionConfetti() {
  try {
    const c1 = resolveThemeHexColor('--rks-green', '--primary');
    const c2 = resolveThemeHexColor('--rks-lime', '--brand-secondary');
    const palette = [c1, c2].filter(Boolean);

    confetti({
      particleCount: 55,
      spread: 68,
      origin: { x: 0.5, y: 0.48 },
      ...(palette.length ? { colors: palette } : {}),
    });
  } catch {
    // Non-critical visual flourish
  }
}

function enterCompletePhase() {
  activationSeq++;
  isTransitioning = false;
  clearTimers();
  disconnectObservers();
  spotlightRect.value = null;
  hotspotPoint.value = null;
  lockedSide.value = null;
  calloutStyleReady.value = false;
  props.controller.closeDateMenu();
  props.controller.closeOpportunityDrawer();
  phase.value = 'complete';
  fireCompletionConfetti();
}

function closeTour() {
  activationSeq++;
  isTransitioning = false;
  clearTimers();
  disconnectObservers();
  lockedSide.value = null;
  calloutStyleReady.value = false;
  props.controller.closeDateMenu();
  props.controller.closeOpportunityDrawer();
  emit('close');
}

function finishAndClose() {
  props.controller.setActiveTab('overview');
  closeTour();
}

// ═════════════════════════════════════════════════════════
// SMART FLOATING CALLOUT POSITIONING (LOCKED SIDE + CLAMP)
// ═════════════════════════════════════════════════════════
const calloutPosition = computed(() => {
  const rect = spotlightRect.value;
  const vw = viewport.value.width;
  const vh = viewport.value.height;
  const cardW = Math.min(328, vw - 24);
  const cardH = calloutRef.value?.offsetHeight || 156;
  const gap = 18;
  const edgeMargin = 14;
  const bottomDockReserve = 78;

  if (!rect) {
    return {
      style: {
        top: `${Math.max(edgeMargin, (vh - cardH) / 2)}px`,
        left: `${Math.max(edgeMargin, (vw - cardW) / 2)}px`,
      },
      arrowVisible: false,
      arrowBorderClass: '',
      arrowStyle: {},
    };
  }

  const side: CalloutSide =
    lockedSide.value ??
    computeBestSide(rect, currentStep.value?.preferredSide ?? 'bottom', cardW, cardH);

  const targetCenterX = rect.left + rect.width / 2;
  const targetCenterY = rect.top + rect.height / 2;

  let top = 0;
  let left = 0;

  if (side === 'bottom') {
    top = rect.top + rect.height + gap;
    left = targetCenterX - cardW / 2;
  } else if (side === 'top') {
    top = rect.top - cardH - gap;
    left = targetCenterX - cardW / 2;
  } else if (side === 'left') {
    left = rect.left - cardW - gap;
    top = targetCenterY - cardH / 2;
  } else {
    left = rect.left + rect.width + gap;
    top = targetCenterY - cardH / 2;
  }

  // Clamp cleanly inside viewport (leaving room for bottom progress dock)
  const clampedLeft = Math.min(Math.max(edgeMargin, left), vw - cardW - edgeMargin);
  const clampedTop = Math.min(Math.max(edgeMargin, top), vh - cardH - bottomDockReserve);

  // Compute pointer arrow position anchored toward the target center
  let arrowBorderClass = '';
  let arrowStyle: Record<string, string> = {};

  if (side === 'bottom') {
    const ax = Math.min(Math.max(22, targetCenterX - clampedLeft), cardW - 22);
    arrowBorderClass = 'border-t border-l';
    arrowStyle = { top: '-6px', left: `${ax - 6}px` };
  } else if (side === 'top') {
    const ax = Math.min(Math.max(22, targetCenterX - clampedLeft), cardW - 22);
    arrowBorderClass = 'border-b border-r';
    arrowStyle = { bottom: '-6px', left: `${ax - 6}px` };
  } else if (side === 'left') {
    const ay = Math.min(Math.max(22, targetCenterY - clampedTop), cardH - 22);
    arrowBorderClass = 'border-t border-r';
    arrowStyle = { right: '-6px', top: `${ay - 6}px` };
  } else {
    const ay = Math.min(Math.max(22, targetCenterY - clampedTop), cardH - 22);
    arrowBorderClass = 'border-b border-l';
    arrowStyle = { left: '-6px', top: `${ay - 6}px` };
  }

  return {
    style: {
      top: `${Math.round(clampedTop)}px`,
      left: `${Math.round(clampedLeft)}px`,
    },
    arrowVisible: true,
    arrowBorderClass,
    arrowStyle,
  };
});

// ═════════════════════════════════════════════════════════
// GLOBAL EVENT LISTENERS & LIFECYCLE
// ═════════════════════════════════════════════════════════
function handleResize() {
  if (!props.open || phase.value !== 'active' || !currentStep.value || isTransitioning) return;
  measureCurrentTarget();
  if (spotlightRect.value) {
    const cardW = Math.min(328, window.innerWidth - 24);
    const cardH = calloutRef.value?.offsetHeight || 156;
    lockedSide.value = computeBestSide(spotlightRect.value, currentStep.value.preferredSide, cardW, cardH);
  }
}

function handleScroll() {
  if (!props.open || phase.value !== 'active' || isTransitioning) return;
  measureCurrentTarget();
}

function handleKeyDown(e: KeyboardEvent) {
  if (!props.open) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeTour();
    return;
  }

  if (phase.value === 'welcome' && e.key === 'Enter') {
    e.preventDefault();
    startAtStep(0);
    return;
  }

  if (phase.value === 'active') {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextStep();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevStep();
    }
  }
}

function attachListeners() {
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', handleGlobalClick, true);
}

function detachListeners() {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', handleGlobalClick, true);
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      activationSeq++;
      isTransitioning = false;
      phase.value = 'welcome';
      currentStepIndex.value = 0;
      spotlightRect.value = null;
      hotspotPoint.value = null;
      lockedSide.value = null;
      calloutStyleReady.value = false;
      attachListeners();
    } else {
      activationSeq++;
      isTransitioning = false;
      clearTimers();
      disconnectObservers();
      detachListeners();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  activationSeq++;
  clearTimers();
  disconnectObservers();
  detachListeners();
});
</script>

<style scoped>
.tour-cutout-rect {
  transition:
    x 300ms cubic-bezier(0.22, 1, 0.36, 1),
    y 300ms cubic-bezier(0.22, 1, 0.36, 1),
    width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    height 300ms cubic-bezier(0.22, 1, 0.36, 1),
    rx 220ms ease;
}

.tour-spotlight-ring {
  transition:
    top 300ms cubic-bezier(0.22, 1, 0.36, 1),
    left 300ms cubic-bezier(0.22, 1, 0.36, 1),
    width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    height 300ms cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 220ms ease;
  box-shadow: 0 0 0 4px color-mix(in oklch, var(--primary) 18%, transparent);
}

.tour-callout-transition {
  transition:
    top 300ms cubic-bezier(0.22, 1, 0.36, 1),
    left 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tour-beacon-transition {
  transition:
    top 300ms cubic-bezier(0.22, 1, 0.36, 1),
    left 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes tourBeaconRipple {
  0% {
    transform: scale(0.55);
    opacity: 0.85;
  }
  75% {
    transform: scale(1.75);
    opacity: 0;
  }
  100% {
    transform: scale(1.75);
    opacity: 0;
  }
}

.tour-beacon-ripple {
  animation: tourBeaconRipple 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
}

.tour-beacon-ripple-delayed {
  animation: tourBeaconRipple 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.55s infinite;
}

@keyframes tourCardEnter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.tour-card-enter {
  animation: tourCardEnter 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes tourPopIn {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  70% {
    transform: scale(1.12);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.tour-pop-in {
  animation: tourPopIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes tourNudgeRing {
  0%, 100% {
    box-shadow: 0 0 0 4px color-mix(in oklch, var(--primary) 18%, transparent);
  }
  50% {
    box-shadow: 0 0 0 10px color-mix(in oklch, var(--primary) 34%, transparent);
  }
}

.tour-nudge-ring {
  animation: tourNudgeRing 380ms ease-out;
}

@keyframes tourNudgeCard {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.tour-nudge-card {
  animation: tourNudgeCard 320ms ease-out;
}

.tour-fade-enter-active,
.tour-fade-leave-active {
  transition: opacity 180ms ease;
}

.tour-fade-enter-from,
.tour-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tour-cutout-rect,
  .tour-spotlight-ring,
  .tour-callout-transition,
  .tour-beacon-transition {
    transition: none;
  }
  .tour-beacon-ripple,
  .tour-beacon-ripple-delayed,
  .tour-card-enter,
  .tour-pop-in,
  .tour-nudge-ring,
  .tour-nudge-card {
    animation: none;
  }
}
</style>
