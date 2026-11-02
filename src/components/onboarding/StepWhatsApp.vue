<template>
  <div class="space-y-3.5 animate-in fade-in-50 duration-300">
    <!-- Header -->
    <div class="text-left">
      <h2 class="text-base sm:text-lg font-bold text-foreground tracking-tight">Connect WhatsApp</h2>
      <p class="text-xs text-muted-foreground mt-0.5 leading-normal">Link your company number so your team can reply to customer messages in one shared inbox.</p>
    </div>

    <!-- Sub-step Pills -->
    <div class="flex items-center p-0.5 bg-muted rounded-lg max-w-xs mx-auto text-xs border border-border shadow-2xs">
      <button
        type="button"
        @click="subStep = 1"
        :class="[
          'flex-1 py-1 px-2.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer',
          subStep === 1 ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold" :class="subStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">1</span>
        <span class="text-[11px]">Method</span>
      </button>
      <button
        type="button"
        @click="subStep = 2"
        :class="[
          'flex-1 py-1 px-2.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer',
          subStep === 2 ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold" :class="subStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">2</span>
        <span class="text-[11px]">Link Phone</span>
      </button>
      <button
        type="button"
        @click="subStep = 3"
        :class="[
          'flex-1 py-1 px-2.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer',
          subStep === 3 ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold" :class="subStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">3</span>
        <span class="text-[11px]">Assign</span>
      </button>
    </div>

    <!-- SUB-STEP 1: METHOD SELECTION -->
    <div v-if="subStep === 1" class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- QR Code Option -->
        <div
          @click="data.connectionMethod = 'qr'; subStep = 2"
          :class="[
            'p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group',
            data.connectionMethod === 'qr'
              ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-2xs text-card-foreground'
              : 'border-border bg-card hover:border-border text-card-foreground'
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-success/20 text-success flex items-center justify-center shadow-2xs">
                <QrCode class="w-4 h-4" />
              </div>
              <span class="px-2 py-0.5 bg-success/20 text-success font-bold text-[9px] rounded-full uppercase tracking-wide">
                Quickest
              </span>
            </div>
            <div>
              <h3 class="text-xs font-bold text-foreground">QR Code Link</h3>
              <p class="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                Scan with WhatsApp on your phone, just like WhatsApp Web. Fast and simple.
              </p>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] font-semibold text-primary">
            <span>Ready in under 1 min</span>
            <span class="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>

        <!-- Official Cloud API Option -->
        <div
          @click="data.connectionMethod = 'cloud_api'; subStep = 2"
          :class="[
            'p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group',
            data.connectionMethod === 'cloud_api'
              ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-2xs text-card-foreground'
              : 'border-border bg-card hover:border-border text-card-foreground'
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-info/20 text-info flex items-center justify-center shadow-2xs">
                <MessageSquare class="w-4 h-4" />
              </div>
              <span class="px-2 py-0.5 bg-info/20 text-info font-bold text-[9px] rounded-full uppercase tracking-wide">
                Official API
              </span>
            </div>
            <div>
              <h3 class="text-xs font-bold text-foreground">WhatsApp Cloud API</h3>
              <p class="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                Connect via Meta Business Manager for high-volume broadcasts and verified green tick.
              </p>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] font-semibold text-info">
            <span>High-volume teams</span>
            <span class="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SUB-STEP 2: SCAN QR / CONNECT -->
    <div v-else-if="subStep === 2" class="space-y-3.5 text-left">
      <!-- Inbox Name Input -->
      <div>
        <label class="block text-xs font-semibold text-foreground mb-1">
          Inbox Name <span class="text-destructive font-normal ml-0.5">*</span>
        </label>
        <input
          v-model="data.inboxName"
          type="text"
          placeholder="e.g. Sales Team WhatsApp"
          class="w-full h-9 px-3 bg-muted/40 hover:bg-card focus:bg-card border border-input hover:border-border rounded-xl text-xs font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary shadow-2xs transition-all"
        />
      </div>

      <!-- QR Card Container -->
      <div class="p-3.5 sm:p-4 bg-card border border-border rounded-xl shadow-2xs text-center space-y-3 text-card-foreground">
        <!-- Connected Success State -->
        <div v-if="data.isConnected" class="py-3 space-y-2">
          <div class="w-10 h-10 rounded-xl bg-success/20 text-success mx-auto flex items-center justify-center shadow-xs animate-in zoom-in-95 duration-300">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-foreground">WhatsApp Connected!</h3>
            <p class="text-xs text-muted-foreground max-w-sm mx-auto leading-normal">
              Linked as <strong class="text-foreground font-medium">+60 12-345 6789 ({{ data.inboxName || 'Primary' }})</strong>. Messages will sync directly.
            </p>
          </div>
          <div class="pt-1.5 flex justify-center gap-2.5">
            <button
              type="button"
              @click="data.isConnected = false"
              class="text-[11px] text-muted-foreground hover:text-destructive font-medium cursor-pointer"
            >
              Disconnect
            </button>
            <button
              type="button"
              @click="subStep = 3"
              class="h-8 px-3 bg-primary text-primary-foreground rounded-lg text-xs font-semibold shadow-xs hover:bg-primary/90 cursor-pointer transition-colors"
            >
              Assign Team Members →
            </button>
          </div>
        </div>

        <!-- Awaiting Scan State -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <!-- Left QR Code simulation -->
          <div class="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-xl border border-border">
            <h4 class="text-xs font-semibold text-foreground mb-2">Scan with WhatsApp</h4>

            <!-- QR Frame -->
            <div class="p-2 bg-card rounded-lg border border-border shadow-2xs">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=https://rakansales.com/auth-device-session"
                alt="WhatsApp QR Code"
                class="w-24 h-24 rounded"
              />
            </div>

            <!-- Status Indicator -->
            <div class="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20">
              <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
              <span>Ready to scan</span>
            </div>

            <!-- Interactive Demo Simulator Action -->
            <button
              type="button"
              @click="simulateConnection"
              :disabled="simulating"
              class="mt-2.5 h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Smartphone class="w-3 h-3" />
              <span>{{ simulating ? 'Connecting...' : 'Simulate Scan & Connect' }}</span>
            </button>
          </div>

          <!-- Right Step-by-Step Instructions -->
          <div class="text-left space-y-2">
            <h4 class="text-[11px] font-bold text-foreground uppercase tracking-wider">How to connect:</h4>
            <ol class="space-y-1.5 text-[11px] text-muted-foreground">
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-[10px] shrink-0 border border-primary/20">1</span>
                <span>Open WhatsApp on your phone</span>
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
                <span>Scan the QR code on your screen</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- SUB-STEP 3: ASSIGN AGENTS -->
    <div v-else-if="subStep === 3" class="space-y-3 text-left">
      <div class="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary flex items-center gap-2">
        <Info class="w-3.5 h-3.5 text-primary shrink-0" />
        <span>Select team members who can reply to chats on this WhatsApp number.</span>
      </div>

      <div class="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-0.5">
        <div
          v-for="agent in agentList"
          :key="agent.name"
          class="flex items-center justify-between p-2.5 bg-card border border-border rounded-xl text-xs hover:border-border transition-colors shadow-2xs text-card-foreground"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] border border-primary/20">
              {{ agent.initials }}
            </div>
            <div>
              <div class="font-bold text-foreground leading-none">{{ agent.name }}</div>
              <div class="text-muted-foreground text-[10px] leading-none mt-0.5">{{ agent.role }} · {{ agent.email }}</div>
            </div>
          </div>

          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="data.assignedAgents.includes(agent.email)"
              @change="toggleAgent(agent.email)"
              class="sr-only peer"
            />
            <div class="w-8 h-4.5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary shadow-2xs"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QrCode, MessageSquare, CheckCircle2, Smartphone, Info } from 'lucide-vue-next';

interface WhatsAppData {
  connectionMethod: 'qr' | 'cloud_api';
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
const simulating = ref(false);

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const agentList = [
  { name: 'Justin (You)', email: 'justin@veecotech.com', role: 'Administrator', initials: 'JU' },
  { name: 'Ahmad Faizal', email: 'ahmad@veecotech.com', role: 'Sales Agent', initials: 'AF' },
  { name: 'Sarah Chen', email: 'sarah@veecotech.com', role: 'Sales Lead', initials: 'SC' },
];

function simulateConnection() {
  simulating.value = true;
  setTimeout(() => {
    data.value.isConnected = true;
    simulating.value = false;
  }, 1000);
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
