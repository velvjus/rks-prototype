<template>
  <div class="h-full flex flex-col justify-between space-y-3.5 text-left">
    <!-- Header (Constant Top Position) -->
    <div class="shrink-0 space-y-1">
      <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Connect WhatsApp Business
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Link your company phone number so your team can reply to customer messages in one shared inbox.
      </p>
    </div>

    <!-- Strictly 1-Line Sub-step Switcher Pills (No Wrapping, Perfectly Aligned) -->
    <div class="shrink-0 flex items-center p-1 bg-muted rounded-xl w-full max-w-sm mx-auto text-xs border border-border shadow-2xs select-none">
      <button
        type="button"
        @click="subStep = 1"
        :class="[
          'flex-1 h-8 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0',
          subStep === 1 ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" :class="subStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">1</span>
        <span class="text-xs">Method</span>
      </button>

      <button
        type="button"
        @click="goToLinkPhone"
        :class="[
          'flex-1 h-8 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0',
          subStep === 2 ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" :class="subStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">2</span>
        <span class="text-xs">Link Phone</span>
      </button>

      <button
        type="button"
        @click="subStep = 3"
        :class="[
          'flex-1 h-8 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0',
          subStep === 3 ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" :class="subStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">3</span>
        <span class="text-xs">Assign Team</span>
      </button>
    </div>

    <!-- SUB-STEP 1: METHOD SELECTION -->
    <div v-if="subStep === 1" class="space-y-3 pt-1 flex-1 flex flex-col justify-start">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- QR Code Option -->
        <button
          type="button"
          @click="data.connectionMethod = 'qr'"
          :class="[
            'p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            data.connectionMethod === 'qr'
              ? 'border-primary bg-primary/10 ring-2 ring-primary/15 shadow-xs'
              : 'border-border bg-card hover:border-border hover:bg-muted/50 shadow-2xs'
          ]"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  data.connectionMethod === 'qr' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                ]"
              >
                <QrCode class="w-5 h-5" />
              </div>
              <span class="px-2 py-0.5 bg-success/20 text-success font-bold text-[9px] rounded-full uppercase tracking-wider">
                Fastest
              </span>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-foreground">QR Code Link</h3>
              <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Scan with WhatsApp on your phone, just like WhatsApp Web. Fast and simple.
              </p>
            </div>
          </div>
          <div class="mt-4 pt-2.5 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
            <span>Ready in under 1 min</span>
            <span class="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </button>

        <!-- Official Cloud API Option -->
        <button
          type="button"
          @click="data.connectionMethod = 'cloud_api'"
          :class="[
            'p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            data.connectionMethod === 'cloud_api'
              ? 'border-primary bg-primary/10 ring-2 ring-primary/15 shadow-xs'
              : 'border-border bg-card hover:border-border hover:bg-muted/50 shadow-2xs'
          ]"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  data.connectionMethod === 'cloud_api' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                ]"
              >
                <MessageSquare class="w-5 h-5" />
              </div>
              <span class="px-2 py-0.5 bg-info/20 text-info font-bold text-[9px] rounded-full uppercase tracking-wider">
                Official API
              </span>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-foreground">WhatsApp Cloud API</h3>
              <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Connect via Meta Business Manager for high-volume broadcasts and verified green tick.
              </p>
            </div>
          </div>
          <div class="mt-4 pt-2.5 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground group-hover:text-foreground">
            <span>High-volume teams</span>
            <span class="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </button>
      </div>

      <!-- Proceed to Link Phone Button once an option is picked (Aligned Middle) -->
      <div class="pt-2 flex justify-center">
        <button
          type="button"
          @click="goToLinkPhone"
          :disabled="!data.connectionMethod"
          class="h-9 px-4 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <span>Continue to Link Phone</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- SUB-STEP 2: COMPLETE MOCK PROCESS (GENERATION -> SCANNING -> LINKING -> CONNECTED) -->
    <div v-else-if="subStep === 2" class="space-y-3 pt-1 flex-1 flex flex-col justify-start">
      <!-- Inbox Channel Name -->
      <div class="space-y-1 shrink-0">
        <label class="block text-xs font-semibold text-foreground">
          Inbox Channel Name <span class="text-destructive">*</span>
        </label>
        <input
          v-model="data.inboxName"
          type="text"
          placeholder="e.g. VeecoTech Sales WhatsApp"
          class="w-full h-10 px-3.5 bg-card border border-input rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary shadow-2xs transition-all"
        />
      </div>

      <!-- State 1: Generating QR Code (Mock Progress) -->
      <div
        v-if="qrFlowState === 'generating'"
        class="p-6 bg-card border border-border rounded-2xl shadow-2xs text-center space-y-3 animate-in fade-in-50 duration-200"
      >
        <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-xs">
          <Loader2 class="w-6 h-6 animate-spin text-primary" />
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-foreground">Generating Encrypted QR Session...</h3>
          <p class="text-xs text-muted-foreground">Creating a secure Webhook handshake for your workspace.</p>
        </div>
        <div class="w-36 h-1 bg-muted rounded-full mx-auto overflow-hidden">
          <div class="w-full h-full bg-primary animate-pulse"></div>
        </div>
      </div>

      <!-- State 2: QR Ready to Scan (Interactive Mock Process) -->
      <div
        v-else-if="qrFlowState === 'ready' && !data.isConnected"
        class="p-4 sm:p-5 bg-card border border-border rounded-2xl shadow-2xs text-center space-y-3 animate-in fade-in-50 duration-200"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div class="flex flex-col items-center justify-center p-3.5 bg-muted/50 rounded-xl border border-border">
            <h4 class="text-xs font-semibold text-foreground mb-2">Scan with WhatsApp</h4>

            <!-- Dynamic QR Image Frame -->
            <div class="p-2 bg-card rounded-xl border border-border shadow-2xs relative group">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=https://rakansales.com/auth-device-session"
                alt="WhatsApp QR Code"
                class="w-24 h-24 rounded-lg"
              />
            </div>

            <!-- Mock Action: Simulate Phone Scan -->
            <button
              type="button"
              @click="startLinkingSimulation"
              class="mt-3 h-9 px-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone class="w-3.5 h-3.5" />
              <span>Simulate Scan from Phone</span>
            </button>
          </div>

          <!-- Step Instructions -->
          <div class="text-left space-y-2 text-xs">
            <h4 class="text-[11px] font-bold text-foreground uppercase tracking-wider">How to scan:</h4>
            <ol class="space-y-1.5 text-muted-foreground text-[11px]">
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-[10px] shrink-0 border border-primary/20">1</span>
                <span>Open WhatsApp on your mobile phone</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-[10px] shrink-0 border border-primary/20">2</span>
                <span>Go to <strong>Settings</strong> or tap <strong>Menu (⋮)</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-[10px] shrink-0 border border-primary/20">3</span>
                <span>Tap <strong>Linked Devices</strong> → <strong>Link a Device</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-[10px] shrink-0 border border-primary/20">4</span>
                <span>Point your camera at the QR code</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- State 3: Linking in Progress (Simulation Animation) -->
      <div
        v-else-if="qrFlowState === 'linking'"
        class="p-6 bg-card border border-border rounded-2xl shadow-2xs text-center space-y-3 animate-in zoom-in-95 duration-200"
      >
        <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-xs">
          <Smartphone class="w-6 h-6 animate-pulse text-primary" />
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-foreground">Pairing Device +60 12-345 6789...</h3>
          <p class="text-xs text-muted-foreground">Syncing chat history and registering WhatsApp Web session token.</p>
        </div>
        <div class="w-40 h-1.5 bg-muted rounded-full mx-auto overflow-hidden">
          <div class="w-full h-full bg-primary animate-pulse"></div>
        </div>
      </div>

      <!-- State 4: Successfully Linked -->
      <div v-else-if="data.isConnected" class="space-y-3 animate-in zoom-in-95 duration-200">
        <div
          class="p-5 bg-card border border-success/30 rounded-2xl shadow-2xs text-center space-y-3"
        >
          <div class="w-12 h-12 rounded-2xl bg-success/10 text-success mx-auto flex items-center justify-center shadow-xs border border-success/20">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-foreground">WhatsApp Number Connected!</h3>
            <p class="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Linked as <strong class="text-foreground font-semibold">+60 12-345 6789</strong> ({{ data.inboxName || 'Sales Team WhatsApp' }}). Incoming customer messages will sync to your shared inbox.
            </p>
          </div>
          <div class="pt-1 flex justify-center">
            <button
              type="button"
              @click="disconnectWhatsApp"
              class="text-xs text-muted-foreground hover:text-destructive font-medium cursor-pointer transition-colors"
            >
              Disconnect / Re-link
            </button>
          </div>
        </div>

        <!-- Outside Card: Assign Team Reps Button -->
        <div class="pt-1 flex justify-center">
          <button
            type="button"
            @click="subStep = 3"
            class="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <span>Assign Team Reps</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- SUB-STEP 3: ASSIGN AGENTS (WITH DISPLAYED PHONE NUMBER + FULL-HEIGHT CONTAINER) -->
    <div v-else-if="subStep === 3" class="space-y-3 pt-1 flex-1 flex flex-col min-h-0">
      <!-- Phone Number Header Banner -->
      <div class="shrink-0 p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-2.5 text-xs shadow-2xs">
        <div class="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-2xs">
          <MessageCircle class="w-4.5 h-4.5" />
        </div>
        <div class="min-w-0">
          <div class="font-bold text-foreground text-xs leading-none">+60 12-345 6789</div>
          <span class="text-muted-foreground text-[11px] truncate block mt-1 leading-none">{{ data.inboxName || 'Sales Team WhatsApp' }}</span>
        </div>
      </div>

      <!-- Agent List Container Filling Available Height (Matching Step 2) -->
      <div class="bg-muted/40 border border-border rounded-2xl p-3.5 sm:p-4 flex-1 flex flex-col min-h-0 space-y-2.5 shadow-2xs">
        <div class="flex items-center justify-between text-xs shrink-0">
          <span class="font-bold text-foreground text-xs">Assigned Team Reps</span>
          <span class="text-[11px] font-semibold text-muted-foreground">{{ data.assignedAgents.length }} of {{ agentList.length }} assigned</span>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[140px]">
          <div
            v-for="agent in agentList"
            :key="agent.name"
            class="flex items-center justify-between p-3 bg-card border border-border rounded-xl text-xs hover:border-foreground/30 transition-colors shadow-2xs"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] border border-primary/20">
                {{ agent.initials }}
              </div>
              <div>
                <div class="font-bold text-foreground leading-none">{{ agent.name }}</div>
                <div class="text-muted-foreground text-[11px] leading-none mt-1">{{ agent.role }} · {{ agent.email }}</div>
              </div>
            </div>

            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="data.assignedAgents.includes(agent.email)"
                @change="toggleAgent(agent.email)"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-2xs"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  QrCode,
  MessageSquare,
  MessageCircle,
  CheckCircle2,
  Smartphone,
  Loader2,
  ArrowRight,
  Check,
} from 'lucide-vue-next';

interface WhatsAppData {
  connectionMethod: '' | 'qr' | 'cloud_api';
  inboxName: string;
  isConnected: boolean;
  assignedAgents: string[];
}

const props = defineProps<{
  modelValue: WhatsAppData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: WhatsAppData): void;
}>();

const subStep = ref(props.modelValue.isConnected ? 2 : 1);
const qrFlowState = ref<'generating' | 'ready' | 'linking' | 'connected'>(
  props.modelValue.isConnected ? 'connected' : 'ready'
);

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const agentList = [
  { name: 'Justin (You)', email: 'justin@veecotech.com', role: 'Administrator', initials: 'JU' },
  { name: 'Ahmad Faizal', email: 'ahmad@veecotech.com', role: 'Sales Agent', initials: 'AF' },
  { name: 'Sarah Chen', email: 'sarah@veecotech.com', role: 'Sales Lead', initials: 'SC' },
];

function goToLinkPhone() {
  subStep.value = 2;
  if (!data.value.isConnected) {
    qrFlowState.value = 'generating';
    setTimeout(() => {
      qrFlowState.value = 'ready';
    }, 900);
  }
}

function startLinkingSimulation() {
  qrFlowState.value = 'linking';
  setTimeout(() => {
    data.value.isConnected = true;
    qrFlowState.value = 'connected';
  }, 1400);
}

function disconnectWhatsApp() {
  data.value.isConnected = false;
  qrFlowState.value = 'generating';
  setTimeout(() => {
    qrFlowState.value = 'ready';
  }, 900);
}

function toggleAgent(email: string) {
  const list = [...data.value.assignedAgents];
  const idx = list.indexOf(email);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(email);
  }
  data.value.assignedAgents = list;
}
</script>
