<template>
  <div class="h-full w-full bg-[#f9fafb] flex flex-col font-sans selection:bg-[#23B750]/20 selection:text-emerald-900 text-slate-800 overflow-hidden relative">
    <!-- Secret Reset Button (Hidden by default, appears only on hover at top-left) -->
    <div class="absolute top-3 left-3 sm:top-4 sm:left-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-200">
      <button
        type="button"
        @click="resetAllSteps"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-gray-50 text-gray-400 hover:text-rose-600 border border-gray-200/90 shadow-2xs text-[11px] font-semibold transition-colors cursor-pointer"
        title="Reset all setup steps to empty"
      >
        <RotateCcw class="w-3 h-3" />
        <span>Reset Wizard</span>
      </button>
    </div>

    <!-- Top Step Progress Bar (Clean Floating Stepper matching Onboarding v2) -->
    <SetupWizardTopStepper
      v-if="currentStep <= 4 && !isProvisioning"
      :current-step="currentStep"
      :completed-steps="completedSteps"
      @change-step="goToStep"
    />

    <!-- Main Content Canvas (Top-anchored title & content, bottom-anchored footer controls, single viewport fit) -->
    <main class="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 sm:px-6 pt-1 sm:pt-2 pb-4 sm:pb-5 min-h-0">
      <Transition name="step-transition" mode="out-in">
        <!-- Steps 1–4: Consistent Stage Width (max-w-xl) & Locked Top Alignment -->
        <div
          v-if="currentStep <= 4 && !isProvisioning"
          key="form-stage"
          class="w-full max-w-xl mx-auto flex-1 flex flex-col justify-between min-h-0"
        >
          <!-- Step Form Area with Inner Crossfade -->
          <div class="flex-1 flex flex-col justify-start min-h-0">
            <Transition name="inner-step" mode="out-in">
              <!-- Step 1: Acknowledging Incomplete Setup Checklist -->
              <StepSetupChecklist
                v-if="currentStep === 1"
                key="step-1"
                :task-status="taskStatus"
                @go-to-step="goToStep"
              />

              <!-- Step 2: Team Setup -->
              <StepWizardTeam
                v-else-if="currentStep === 2"
                key="step-2"
                v-model="formData.team"
                @continue="nextAction"
              />

              <!-- Step 3: WhatsApp Setup -->
              <StepWizardWhatsApp
                v-else-if="currentStep === 3"
                key="step-3"
                v-model="formData.whatsapp"
                @continue="nextAction"
              />

              <!-- Step 4: Website LiveChat -->
              <StepWizardLiveChat
                v-else-if="currentStep === 4"
                key="step-4"
                v-model="formData.widget"
                @continue="nextAction"
              />
            </Transition>
          </div>

          <!-- Footer Navigation for Steps 1–4 (Locked at bottom of viewport) -->
          <footer class="pt-3.5 border-t border-gray-200/70 flex items-center justify-between shrink-0 mt-3">
            <button
              type="button"
              @click="prevAction"
              :disabled="currentStep === 1"
              :class="[
                'text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer',
                currentStep === 1 ? 'opacity-0 pointer-events-none' : ''
              ]"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div class="flex items-center gap-2">
              <button
                v-if="currentStep >= 2 && currentStep <= 4"
                type="button"
                @click="showSkipConfirmModal = true"
                class="text-xs font-medium text-gray-400 hover:text-gray-700 px-2.5 py-1.5 cursor-pointer transition-colors"
              >
                Skip step
              </button>

              <button
                type="button"
                @click="handleContinueClick"
                :class="[
                  'h-10 px-6 active:scale-[0.99] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750]',
                  (currentStep === 1 || isCurrentStepConfigured)
                    ? 'bg-[#23B750] hover:bg-[#1a943e] text-white shadow-xs'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-2xs'
                ]"
              >
                <span>{{ continueText }}</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </footer>
        </div>

        <!-- 1.5-Second Workspace Provisioning Loading Stage -->
        <div
          v-else-if="isProvisioning"
          key="provisioning-stage"
          class="w-full max-w-xl mx-auto px-6 py-16 my-auto flex flex-col items-center justify-center text-center animate-in fade-in-50 duration-300"
        >
          <div class="space-y-6 flex flex-col items-center">
            <!-- Animated Spinner Container -->
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#23B750] shadow-sm">
              <Loader2 class="w-7 h-7 animate-spin text-[#23B750]" />
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Setting up your workspace...
              </h2>
              <p class="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Activating WhatsApp routing, LiveChat embed keys, and team permissions for
                <strong class="text-gray-900 font-semibold">your workspace</strong>.
              </p>
            </div>

            <!-- Soft progress bar indicator -->
            <div class="w-48 h-1.5 bg-gray-200/80 rounded-full overflow-hidden">
              <div class="h-full bg-[#23B750] rounded-full animate-progress"></div>
            </div>
          </div>
        </div>

        <!-- Step 5: Final Ready / Success Screen (Simple Clean, Vertically Centered) -->
        <div
          v-else-if="currentStep === 5"
          key="success-stage"
          class="w-full max-w-md mx-auto px-6 py-16 my-auto flex flex-col justify-center text-center animate-in fade-in-50 duration-300"
        >
          <div class="space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#23B750] flex items-center justify-center mx-auto shadow-sm">
              <Check class="w-8 h-8 stroke-[3]" />
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                You're all set!
              </h2>
              <p class="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Your RakanSales setup is complete. Your sales channels and team permissions are active.
              </p>
            </div>

            <!-- Primary & Secondary Launch CTAs -->
            <div class="pt-4 space-y-3">
              <button
                type="button"
                @click="launchDashboard"
                class="h-11 px-8 bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750]"
              >
                <span>Launch Dashboard</span>
                <ArrowRight class="w-4 h-4" />
              </button>

              <div class="pt-1">
                <router-link
                  to="/omnichannel"
                  class="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Or go directly to Omnichannel Conversations →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </main>

    <!-- Skip Confirmation Pop-up Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showSkipConfirmModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        @click.self="cancelSkip"
      >
        <div
          class="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-200/90 shadow-xl space-y-4 animate-in zoom-in-95 duration-150 text-left"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-gray-900">
                Skip {{ currentStepTitle }}?
              </h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                {{ skipWarningMessage }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              @click="cancelSkip"
              class="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-colors cursor-pointer"
            >
              Keep Configuring
            </button>
            <button
              type="button"
              @click="confirmSkipAnyway"
              class="px-3.5 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Skip Anyway
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Check, Loader2, RotateCcw, AlertTriangle } from 'lucide-vue-next';

import SetupWizardTopStepper from '@/components/onboarding/v2/SetupWizardTopStepper.vue';
import StepSetupChecklist from '@/components/onboarding/StepSetupChecklist.vue';
import StepWizardTeam from '@/components/onboarding/v2/StepWizardTeam.vue';
import StepWizardWhatsApp from '@/components/onboarding/v2/StepWizardWhatsApp.vue';
import StepWizardLiveChat from '@/components/onboarding/v2/StepWizardLiveChat.vue';

const router = useRouter();

const currentStep = ref(1);
const completedSteps = ref<number[]>([]);
const isProvisioning = ref(false);
const showSkipConfirmModal = ref(false);

const STORAGE_KEY = 'rakansales_crm_setup_checklist_v5';

const taskStatus = reactive({
  team: false,
  whatsapp: false,
  livechat: false,
});

const formData = reactive({
  team: {
    members: [] as { email: string; role: 'Agent' | 'Manager' | 'Admin' }[],
  },
  whatsapp: {
    connectionMethod: '' as '' | 'qr' | 'cloud_api',
    inboxName: '',
    isConnected: false,
    assignedAgents: [] as string[],
  },
  widget: {
    websiteName: '',
    websiteDomain: '',
    widgetColor: '#23B750',
    welcomeHeading: 'Welcome!',
    welcomeTagline: 'Chat with our sales team or get a quick quotation.',
    autoGreeting: true,
    assignedAgents: [] as string[],
  },
});

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.team !== undefined) taskStatus.team = !!parsed.team;
      if (parsed.whatsapp !== undefined) {
        taskStatus.whatsapp = !!parsed.whatsapp;
        formData.whatsapp.isConnected = !!parsed.whatsapp;
      }
      if (parsed.livechat !== undefined) taskStatus.livechat = !!parsed.livechat;
    }
  } catch (e) {
    console.error('Failed to load setup checklist state', e);
  }
});

const continueText = computed(() => {
  if (currentStep.value === 1) return 'Continue to Team';
  if (currentStep.value === 2) return 'Continue to WhatsApp';
  if (currentStep.value === 3) return 'Continue to LiveChat';
  if (currentStep.value === 4) return 'Complete Setup & Launch';
  return 'Continue';
});

const isCurrentStepConfigured = computed(() => {
  if (currentStep.value === 1) return true;
  if (currentStep.value === 2) {
    return formData.team.members.length > 0 || taskStatus.team;
  }
  if (currentStep.value === 3) {
    return formData.whatsapp.isConnected || taskStatus.whatsapp;
  }
  if (currentStep.value === 4) {
    return formData.widget.websiteDomain.trim().length > 0 || taskStatus.livechat;
  }
  return true;
});

const currentStepTitle = computed(() => {
  if (currentStep.value === 2) return 'Team Setup';
  if (currentStep.value === 3) return 'WhatsApp Setup';
  if (currentStep.value === 4) return 'LiveChat Setup';
  return '';
});

const skipWarningMessage = computed(() => {
  if (currentStep.value === 2) {
    return 'You have not added any team members yet. Are you sure you want to proceed without inviting your team?';
  }
  if (currentStep.value === 3) {
    return 'WhatsApp is not connected yet. Incoming customer messages will not sync until linked. Are you sure you want to skip?';
  }
  if (currentStep.value === 4) {
    return 'Your website LiveChat widget has not been configured yet. Website visitors will not see the chat bubble. Are you sure you want to skip?';
  }
  return 'Are you sure you want to skip this setup step?';
});

function handleContinueClick() {
  if (currentStep.value === 1) {
    nextAction();
    return;
  }

  if (isCurrentStepConfigured.value) {
    nextAction();
  } else {
    showSkipConfirmModal.value = true;
  }
}

function confirmSkipAnyway() {
  showSkipConfirmModal.value = false;
  nextAction();
}

function cancelSkip() {
  showSkipConfirmModal.value = false;
}

function markStepComplete(stepNum: number) {
  if (!completedSteps.value.includes(stepNum)) {
    completedSteps.value.push(stepNum);
  }
}

function persistState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        team: taskStatus.team,
        whatsapp: taskStatus.whatsapp,
        livechat: taskStatus.livechat,
      })
    );
  } catch (e) {
    console.error('Failed to persist setup checklist state', e);
  }
}

function nextAction() {
  markStepComplete(currentStep.value);

  if (currentStep.value === 2) {
    taskStatus.team = true;
    persistState();
  } else if (currentStep.value === 3) {
    taskStatus.whatsapp = true;
    formData.whatsapp.isConnected = true;
    persistState();
  } else if (currentStep.value === 4) {
    taskStatus.livechat = true;
    persistState();
  }

  if (currentStep.value < 4) {
    currentStep.value++;
  } else {
    taskStatus.team = true;
    taskStatus.whatsapp = true;
    taskStatus.livechat = true;
    persistState();

    isProvisioning.value = true;
    setTimeout(() => {
      isProvisioning.value = false;
      currentStep.value = 5;
      fireConfetti();
    }, 1500);
  }
}

function fireConfetti() {
  // Center celebration cannon
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors: ['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B'],
  });

  // Dual side cannons
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#23B750', '#10B981', '#3B82F6', '#F59E0B'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#23B750', '#10B981', '#3B82F6', '#F59E0B'],
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
  router.push('/dashboard');
}

function resetAllSteps() {
  currentStep.value = 1;
  completedSteps.value = [];
  isProvisioning.value = false;

  taskStatus.team = false;
  taskStatus.whatsapp = false;
  taskStatus.livechat = false;

  formData.team.members = [];
  formData.whatsapp.isConnected = false;
  formData.whatsapp.inboxName = '';
  formData.whatsapp.connectionMethod = '';
  formData.whatsapp.assignedAgents = [];

  formData.widget.websiteName = '';
  formData.widget.websiteDomain = '';
  formData.widget.welcomeHeading = 'Welcome!';
  formData.widget.welcomeTagline = '';
  formData.widget.widgetColor = '#23B750';
  formData.widget.autoGreeting = true;
  formData.widget.assignedAgents = [];

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        team: false,
        whatsapp: false,
        livechat: false,
      })
    );
  } catch (e) {
    console.error('Failed to reset setup checklist state', e);
  }
}
</script>

<style scoped>
/* Smooth step transition matching Onboarding v2 */
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

/* 1.5-second progress bar fill matching v2 */
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
  animation: progress 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 150ms ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .step-transition-enter-active,
  .step-transition-leave-active,
  .inner-step-enter-active,
  .inner-step-leave-active,
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 80ms linear !important;
    transform: none !important;
  }
}
</style>
