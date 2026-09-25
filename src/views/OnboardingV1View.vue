<template>
  <div class="h-full bg-[#FAFAFA] flex flex-col font-sans selection:bg-[#23B750]/20 selection:text-emerald-900 overflow-hidden">
    <!-- Clean, Compact Header Banner (Hidden for now) -->
    <header v-if="showHeader" class="bg-white border-b border-gray-100 px-5 py-2.5 shrink-0 shadow-2xs">
      <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-[#23B750] flex items-center justify-center font-bold text-xs shrink-0">
            <Sparkles class="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 class="text-sm sm:text-base font-bold text-gray-900 leading-tight">
              Welcome to RakanSales
            </h1>
            <p class="text-[11px] text-gray-400 leading-none">Set up your workspace in just a few minutes</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Step {{ currentStep }} of 6
          </span>
          <router-link
            to="/omnichannel"
            class="text-[11px] font-medium text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
          >
            Skip for now →
          </router-link>
        </div>
      </div>
    </header>

    <!-- Compact Stepper Navigation -->
    <nav aria-label="Onboarding Steps" class="bg-white border-b border-gray-100 py-2 px-4 shrink-0 overflow-x-auto">
      <div class="max-w-3xl mx-auto flex items-center justify-between min-w-[480px] px-2">
        <div
          v-for="(step, idx) in steps"
          :key="step.id"
          class="flex-1 flex flex-col items-center relative group"
        >
          <!-- Connector line segment -->
          <div
            v-if="idx > 0"
            class="absolute top-3.5 -left-1/2 right-1/2 h-[2px] -translate-y-1/2 transition-colors duration-200"
            :class="currentStep >= idx + 1 ? 'bg-[#23B750]' : 'bg-gray-100'"
            aria-hidden="true"
          ></div>
          <div
            v-if="idx < steps.length - 1"
            class="absolute top-3.5 left-1/2 -right-1/2 h-[2px] -translate-y-1/2 transition-colors duration-200"
            :class="currentStep > idx + 1 ? 'bg-[#23B750]' : 'bg-gray-100'"
            aria-hidden="true"
          ></div>

          <!-- Step Button Node -->
          <button
            type="button"
            @click="goToStep(idx + 1)"
            :aria-current="currentStep === idx + 1 ? 'step' : undefined"
            class="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none rounded-lg p-0.5"
          >
            <!-- Circle Node -->
            <div
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-200',
                currentStep > idx + 1
                  ? 'bg-[#23B750] text-white shadow-2xs'
                  : currentStep === idx + 1
                  ? 'bg-white border-2 border-[#23B750] text-[#23B750] ring-3 ring-emerald-50 shadow-2xs'
                  : 'bg-gray-50 border border-gray-200 text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600'
              ]"
            >
              <Check v-if="currentStep > idx + 1" class="w-3 h-3 stroke-[2.5]" />
              <span v-else>{{ idx + 1 }}</span>
            </div>

            <!-- Label -->
            <span
              :class="[
                'mt-1 text-[11px] transition-colors',
                currentStep === idx + 1
                  ? 'font-semibold text-gray-900'
                  : currentStep > idx + 1
                  ? 'font-medium text-emerald-800'
                  : 'text-gray-400 group-hover:text-gray-600'
              ]"
            >
              {{ step.title }}
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Step Card Container (Compact & Fit to View) -->
    <main class="flex-1 px-3 py-2.5 sm:px-4 sm:py-3.5 flex items-center justify-center overflow-y-auto custom-scrollbar min-h-0">
      <div class="w-full max-w-3xl bg-white border border-gray-100 rounded-2xl shadow-xs px-5 py-4 sm:px-6 sm:py-5 flex flex-col justify-between transition-all my-auto">
        <!-- Step View Rendered Here -->
        <div class="flex-1">
          <StepBusiness
            v-if="currentStep === 1"
            v-model="formData.business"
          />

          <StepPlan
            v-else-if="currentStep === 2"
            v-model="formData.plan"
          />

          <StepTeam
            v-else-if="currentStep === 3"
            v-model="formData.team"
          />

          <StepWhatsApp
            v-else-if="currentStep === 4"
            v-model="formData.whatsapp"
          />

          <StepWebsiteWidget
            v-else-if="currentStep === 5"
            v-model="formData.widget"
          />

          <StepReady
            v-else-if="currentStep === 6"
            :summary="formData"
            @launch-crm="launchCRM"
            @launch-dashboard="launchDashboard"
          />
        </div>

        <!-- Bottom Wizard Footer Controls (Steps 1-5) -->
        <footer
          v-if="currentStep < 6"
          class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0"
        >
          <!-- Back Button -->
          <button
            type="button"
            @click="prevStep"
            :disabled="currentStep === 1"
            :class="[
              'h-9 px-3.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer',
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200/80'
            ]"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-2">
            <button
              v-if="currentStep === 3 || currentStep === 4 || currentStep === 5"
              type="button"
              @click="nextStep"
              class="text-xs font-medium text-gray-400 hover:text-gray-700 px-2.5 py-1.5 cursor-pointer transition-colors"
            >
              Skip step
            </button>

            <button
              type="button"
              @click="nextStep"
              class="h-9 px-4.5 bg-[#23B750] hover:bg-[#1fa347] active:bg-[#1b8e3e] text-white text-xs font-semibold rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{{ currentStep === 5 ? 'Finish & Preview' : 'Continue' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div>
    </main>

    <!-- Bottom Simple Footer -->
    <footer class="py-1.5 text-center text-[11px] text-gray-400 border-t border-gray-100 bg-white shrink-0">
      RakanSales CRM · Need help? <a href="#" class="text-emerald-700 hover:underline">Contact support</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Check, ArrowRight, ArrowLeft, Sparkles } from 'lucide-vue-next';
import StepBusiness from '@/components/onboarding/StepBusiness.vue';
import StepPlan from '@/components/onboarding/StepPlan.vue';
import StepTeam from '@/components/onboarding/StepTeam.vue';
import StepWhatsApp from '@/components/onboarding/StepWhatsApp.vue';
import StepWebsiteWidget from '@/components/onboarding/StepWebsiteWidget.vue';
import StepReady from '@/components/onboarding/StepReady.vue';

const router = useRouter();
const currentStep = ref(1);
const showHeader = ref(false);

const progressPercent = computed(() => {
  return Math.round(((currentStep.value - 1) / (steps.length - 1)) * 100);
});

const steps = [
  { id: 1, title: 'Company' },
  { id: 2, title: 'Plan' },
  { id: 3, title: 'Team' },
  { id: 4, title: 'WhatsApp' },
  { id: 5, title: 'Live Chat' },
  { id: 6, title: 'Ready' },
];

const formData = reactive({
  business: {
    businessName: 'VeecoTech Solutions',
    companyType: 'sme',
    country: 'Malaysia',
    currency: 'MYR',
    agentSize: '6–20',
    industries: ['Real Estate', 'Automotive'],
  },
  plan: {
    selectedPlan: 'pro',
    billingCycle: 'yearly' as 'monthly' | 'yearly',
    prepopulateDemoData: true,
  },
  team: {
    members: [
      { email: 'ahmad.faizal@veecotech.com', role: 'Agent' as const },
      { email: 'sarah.chen@veecotech.com', role: 'Manager' as const },
    ],
  },
  whatsapp: {
    connectionMethod: 'qr' as 'qr' | 'cloud_api',
    inboxName: 'VeecoTech Sales WhatsApp',
    isConnected: false,
    assignedAgents: ['justin@veecotech.com', 'ahmad.faizal@veecotech.com'],
  },
  widget: {
    websiteName: 'VeecoTech Official',
    websiteDomain: 'www.veecotech.com.my',
    widgetColor: '#23B750',
    welcomeHeading: 'Welcome to VeecoTech!',
    welcomeTagline: 'Chat with our sales engineers in real-time or get a quick quotation.',
    autoGreeting: true,
    assignedAgents: ['justin@veecotech.com'],
  },
});

function nextStep() {
  if (currentStep.value < 6) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function goToStep(step: number) {
  currentStep.value = step;
}

function launchCRM() {
  router.push('/omnichannel');
}

function launchDashboard() {
  router.push('/dashboard');
}
</script>
