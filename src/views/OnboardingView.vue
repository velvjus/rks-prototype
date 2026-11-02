<template>
  <div class="h-full w-full bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary text-foreground overflow-hidden relative">
    <!-- Top Step Progress Bar (Clean Floating Stepper, No Headerbar) -->
    <OnboardingTopStepper
      v-if="currentStep <= 4 && !isProvisioning"
      :current-step="currentStep"
      :completed-steps="completedSteps"
      @change-step="goToStep"
    />

    <!-- Main Content Canvas (Single Continuous Flow, Pure & Unboxed, Vertically Centered & Friendly) -->
    <main class="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
      <Transition name="step-transition" mode="out-in">
        <!-- Steps 1–3: Fixed Stage Height (Anchor Title & Buttons in Exact Place) -->
        <div
          v-if="currentStep <= 3"
          key="form-stage"
          class="w-full max-w-xl mx-auto px-6 py-4 sm:py-6 my-auto flex flex-col justify-center"
        >
          <div class="w-full min-h-[460px] sm:h-[480px] flex flex-col justify-between">
            <!-- Step Form Area with Inner Crossfade -->
            <div class="flex-1 flex flex-col justify-start">
              <Transition name="inner-step" mode="out-in">
                <!-- Step 1: Company Name & Type -->
                <StepCompanyNameType
                  v-if="currentStep === 1"
                  key="step-1"
                  v-model="formData.business"
                  @continue="nextAction"
                />

                <!-- Step 2: Country & Currency -->
                <StepCountryCurrency
                  v-else-if="currentStep === 2"
                  key="step-2"
                  v-model="formData.business"
                  @continue="nextAction"
                />

                <!-- Step 3: Team Size & Industry -->
                <StepTeamIndustry
                  v-else-if="currentStep === 3"
                  key="step-3"
                  v-model="formData.business"
                  @continue="nextAction"
                />
              </Transition>
            </div>

            <!-- Footer Navigation for Steps 1–3 (Locked at bottom of stage) -->
            <footer class="pt-5 border-t border-border flex items-center justify-between shrink-0">
              <button
                type="button"
                @click="prevAction"
                :disabled="currentStep === 1"
                :class="[
                  'text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer',
                  currentStep === 1 ? 'opacity-0 pointer-events-none' : ''
                ]"
              >
                <ArrowLeft class="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                @click="nextAction"
                :disabled="!isValid"
                :class="[
                  'h-11 px-6 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-ring',
                  isValid
                    ? 'bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                ]"
              >
                <span>{{ continueText }}</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </footer>
          </div>
        </div>

        <!-- Step 4: Choose Plan (Viewport-Fitted 4-Card Grid, Buttons Kept in max-w-xl Place) -->
        <div
          v-else-if="currentStep === 4 && !isProvisioning"
          key="plan-stage"
          class="w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-5 my-auto flex flex-col justify-center"
        >
          <div class="space-y-4">
            <StepPlanSelection
              v-model="formData.plan"
              :currency="formData.business.currency"
              @continue="nextAction"
            />

            <!-- Footer Navigation for Step 4 (Constrained to max-w-xl so buttons don't run off!) -->
            <footer class="pt-5 border-t border-border max-w-xl mx-auto w-full flex items-center justify-between shrink-0">
              <button
                type="button"
                @click="prevAction"
                class="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft class="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                @click="nextAction"
                :disabled="!isValid"
                :class="[
                  'h-11 px-6 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-ring',
                  isValid
                    ? 'bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                ]"
              >
                <span>Complete Setup & Launch</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </footer>
          </div>
        </div>

        <!-- 2-Second Workspace Provisioning Loading Stage -->
        <div
          v-else-if="isProvisioning"
          key="provisioning-stage"
          class="w-full max-w-xl mx-auto px-6 py-16 my-auto flex flex-col items-center justify-center text-center animate-in fade-in-50 duration-300"
        >
          <div class="space-y-6 flex flex-col items-center">
            <!-- Animated Spinner Container -->
            <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              <Loader2 class="w-7 h-7 animate-spin text-primary" />
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Setting up your workspace...
              </h2>
              <p class="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Configuring pipeline stages, templates, and team settings for
                <strong class="text-foreground font-semibold">{{ formData.business.businessName || 'your team' }}</strong>.
              </p>
            </div>

            <!-- Soft 2-second progress bar indicator -->
            <div class="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full animate-progress"></div>
            </div>
          </div>
        </div>

        <!-- Step 5: Final Success Screen (Simple Clean, Vertically Centered) -->
        <div
          v-else-if="currentStep === 5"
          key="success-stage"
          class="w-full max-w-md mx-auto px-6 py-16 my-auto flex flex-col justify-center text-center animate-in fade-in-50 duration-300"
        >
          <div class="space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-sm">
              <Check class="w-8 h-8 stroke-[3]" />
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                You're all set!
              </h2>
              <p class="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Your RakanSales workspace has been created for
                <strong class="text-foreground font-semibold">{{ formData.business.businessName || 'your company' }}</strong>
                on the
                <strong class="text-primary font-semibold">{{ selectedPlanName }}</strong> plan.
              </p>
            </div>

            <!-- Primary & Secondary Launch CTAs: Launch Dashboard & Complete Setting Up -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                @click="launchDashboard"
                class="w-full sm:w-auto h-11 px-6 bg-card hover:bg-muted active:scale-[0.99] text-foreground border border-border text-xs font-bold rounded-xl transition-all shadow-2xs inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutDashboard class="w-4 h-4 text-muted-foreground" />
                <span>Launch Dashboard</span>
              </button>

              <button
                type="button"
                @click="completeSettingUp"
                class="w-full sm:w-auto h-11 px-7 bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>Complete Setting Up</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Check, Loader2, LayoutDashboard } from 'lucide-vue-next';

import OnboardingTopStepper from '@/components/onboarding/v2/OnboardingTopStepper.vue';
import StepCompanyNameType from '@/components/onboarding/v2/StepCompanyNameType.vue';
import StepCountryCurrency from '@/components/onboarding/v2/StepCountryCurrency.vue';
import StepTeamIndustry from '@/components/onboarding/v2/StepTeamIndustry.vue';
import StepPlanSelection from '@/components/onboarding/v2/StepPlanSelection.vue';

const router = useRouter();

// Continuous single flow steps:
// 1 = Company (Name & Type)
// 2 = Location (Country & Currency)
// 3 = Team (Size & Industry)
// 4 = Plan (Choose Plan)
// 5 = Success Screen
const currentStep = ref(1);
const completedSteps = ref<number[]>([]);
const isProvisioning = ref(false);

const formData = reactive({
  business: {
    businessName: '',
    companyType: '',
    country: '',
    currency: '',
    agentSize: '',
    industries: [] as string[],
    otherIndustry: '',
  },
  plan: {
    selectedPlan: '',
    billingCycle: 'yearly' as 'monthly' | 'yearly',
    prepopulateDemoData: false,
  },
});

const isValid = computed(() => {
  if (currentStep.value === 1) {
    return formData.business.businessName.trim().length > 0 && !!formData.business.companyType;
  }
  if (currentStep.value === 2) {
    return !!formData.business.country && !!formData.business.currency;
  }
  if (currentStep.value === 3) {
    if (!formData.business.agentSize || formData.business.industries.length === 0) {
      return false;
    }
    if (formData.business.industries.includes('Others')) {
      return (formData.business.otherIndustry || '').trim().length > 0;
    }
    return true;
  }
  if (currentStep.value === 4) {
    return !!formData.plan.selectedPlan;
  }
  return true;
});

const continueText = computed(() => {
  if (currentStep.value === 1) return 'Continue to Location';
  if (currentStep.value === 2) return 'Continue to Team';
  if (currentStep.value === 3) return 'Continue to Plan';
  if (currentStep.value === 4) return 'Complete Setup & Launch';
  return 'Continue';
});

const selectedPlanName = computed(() => {
  const map: Record<string, string> = {
    basic: 'Basic',
    growth: 'Growth',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };
  return map[formData.plan.selectedPlan] || formData.plan.selectedPlan || 'Pro';
});

function markStepComplete(stepNum: number) {
  if (!completedSteps.value.includes(stepNum)) {
    completedSteps.value.push(stepNum);
  }
}

function nextAction() {
  if (!isValid.value) return;
  markStepComplete(currentStep.value);
  if (currentStep.value < 4) {
    currentStep.value++;
  } else {
    // 2-second workspace provisioning loading before entering success screen
    isProvisioning.value = true;
    setTimeout(() => {
      isProvisioning.value = false;
      currentStep.value = 5;
      fireConfetti();
    }, 2000);
  }
}

/**
 * Resolves CSS token custom properties from the DOM and converts them to hex colors
 * for canvas-confetti particle cannons.
 */
function getConfettiColors(): string[] {
  if (typeof window === 'undefined') {
    return ['#23B750', '#10B981', '#3B82F6', '#F59E0B'];
  }
  const temp = document.createElement('div');
  temp.style.display = 'none';
  document.body.appendChild(temp);

  const tokens = ['--primary', '--brand-secondary', '--success', '--info', '--warning'];
  const hexColors: string[] = [];

  for (const token of tokens) {
    temp.style.color = `var(${token})`;
    const computed = getComputedStyle(temp).color;
    const match = computed.match(/\d+/g);
    if (match && match.length >= 3) {
      const [r, g, b] = match.map(Number);
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      hexColors.push(hex);
    }
  }

  document.body.removeChild(temp);
  return hexColors.length > 0 ? hexColors : ['#23B750', '#10B981', '#3B82F6', '#F59E0B'];
}

function fireConfetti() {
  const colors = getConfettiColors();
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
  }, 250);
}

function prevAction() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function goToStep(stepNum: number) {
  currentStep.value = stepNum;
  if (stepNum === 5) {
    fireConfetti();
  }
}

function launchDashboard() {
  localStorage.setItem('rakansales_has_sample_data', 'true');
  router.push('/dashboard');
}

function completeSettingUp() {
  localStorage.setItem('rakansales_has_sample_data', 'true');
  router.push('/setup-wizard');
}
</script>

<style scoped>
/* Smooth step transition (e.g. step 3 -> step 4) */
.step-transition-enter-active {
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.step-transition-leave-active {
  transition: opacity 140ms ease-in, transform 140ms ease-in;
}
.step-transition-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.step-transition-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Inner step crossfade for steps 1, 2, and 3 */
.inner-step-enter-active {
  transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
.inner-step-leave-active {
  transition: opacity 100ms ease-in;
}
.inner-step-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.inner-step-leave-to {
  opacity: 0;
}

/* 2-second progress bar fill */
@keyframes progress {
  0% {
    width: 0%;
  }
  60% {
    width: 75%;
  }
  100% {
    width: 100%;
  }
}
.animate-progress {
  animation: progress 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .step-transition-enter-active,
  .step-transition-leave-active,
  .inner-step-enter-active,
  .inner-step-leave-active {
    transition: opacity 80ms linear !important;
    transform: none !important;
  }
}
</style>
