<template>
  <div class="space-y-3.5 animate-in fade-in-50 duration-300">
    <!-- Header -->
    <div class="text-left">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Connect WhatsApp</h2>
      <p class="text-xs text-gray-500 mt-0.5 leading-normal">Link your company number so your team can reply to customer messages in one shared inbox.</p>
    </div>

    <!-- Sub-step Pills -->
    <div class="flex items-center p-0.5 bg-gray-100 rounded-lg max-w-xs mx-auto text-xs border border-gray-200/60 shadow-2xs">
      <button
        type="button"
        @click="subStep = 1"
        :class="[
          'flex-1 py-1 px-2.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer',
          subStep === 1 ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-900 font-medium'
        ]"
      >
        <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold" :class="subStep === 1 ? 'bg-[#23B750] text-white' : 'bg-gray-200 text-gray-600'">1</span>
        <span class="text-[11px]">Method</span>
      </button>
      <button
        type="button"
        @click="subStep = 2"
        :class="[
          'flex-1 py-1 px-2.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer',
          subStep === 2 ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-900 font-medium'
        ]"
      >
        <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold" :class="subStep === 2 ? 'bg-[#23B750] text-white' : 'bg-gray-200 text-gray-600'">2</span>
        <span class="text-[11px]">Link Phone</span>
      </button>
      <button
        type="button"
        @click="subStep = 3"
        :class="[
          'flex-1 py-1 px-2.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer',
          subStep === 3 ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-900 font-medium'
        ]"
      >
        <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold" :class="subStep === 3 ? 'bg-[#23B750] text-white' : 'bg-gray-200 text-gray-600'">3</span>
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
              ? 'border-[#23B750] bg-emerald-50/40 ring-1 ring-[#23B750] shadow-2xs'
              : 'border-gray-200/90 bg-white hover:border-gray-300'
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                <QrCode class="w-4 h-4" />
              </div>
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded-full uppercase tracking-wide">
                Quickest
              </span>
            </div>
            <div>
              <h3 class="text-xs font-bold text-gray-900">QR Code Link</h3>
              <p class="text-[11px] text-gray-500 mt-0.5 leading-normal">
                Scan with WhatsApp on your phone, just like WhatsApp Web. Fast and simple.
              </p>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
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
              ? 'border-[#23B750] bg-emerald-50/40 ring-1 ring-[#23B750] shadow-2xs'
              : 'border-gray-200/90 bg-white hover:border-gray-300'
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shadow-2xs">
                <MessageSquare class="w-4 h-4" />
              </div>
              <span class="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[9px] rounded-full uppercase tracking-wide">
                Official API
              </span>
            </div>
            <div>
              <h3 class="text-xs font-bold text-gray-900">WhatsApp Cloud API</h3>
              <p class="text-[11px] text-gray-500 mt-0.5 leading-normal">
                Connect via Meta Business Manager for high-volume broadcasts and verified green tick.
              </p>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-blue-700">
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
        <label class="block text-xs font-semibold text-gray-700 mb-1">
          Inbox Name <span class="text-red-500 font-normal ml-0.5">*</span>
        </label>
        <input
          v-model="data.inboxName"
          type="text"
          placeholder="e.g. Sales Team WhatsApp"
          class="w-full h-9 px-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] shadow-2xs transition-all"
        />
      </div>

      <!-- QR Card Container -->
      <div class="p-3.5 sm:p-4 bg-white border border-gray-200/90 rounded-xl shadow-2xs text-center space-y-3">
        <!-- Connected Success State -->
        <div v-if="data.isConnected" class="py-3 space-y-2">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-[#23B750] mx-auto flex items-center justify-center shadow-xs animate-in zoom-in-95 duration-300">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-gray-900">WhatsApp Connected!</h3>
            <p class="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
              Linked as <strong class="text-gray-800 font-medium">+60 12-345 6789 ({{ data.inboxName || 'Primary' }})</strong>. Messages will sync directly.
            </p>
          </div>
          <div class="pt-1.5 flex justify-center gap-2.5">
            <button
              type="button"
              @click="data.isConnected = false"
              class="text-[11px] text-gray-400 hover:text-red-500 font-medium cursor-pointer"
            >
              Disconnect
            </button>
            <button
              type="button"
              @click="subStep = 3"
              class="h-8 px-3 bg-[#23B750] text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-[#1fa347] cursor-pointer transition-colors"
            >
              Assign Team Members →
            </button>
          </div>
        </div>

        <!-- Awaiting Scan State -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <!-- Left QR Code simulation -->
          <div class="flex flex-col items-center justify-center p-3 bg-gray-50/70 rounded-xl border border-gray-200/80">
            <h4 class="text-xs font-semibold text-gray-700 mb-2">Scan with WhatsApp</h4>

            <!-- QR Frame -->
            <div class="p-2 bg-white rounded-lg border border-gray-200 shadow-2xs">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=https://rakansales.com/auth-device-session"
                alt="WhatsApp QR Code"
                class="w-24 h-24 rounded"
              />
            </div>

            <!-- Status Indicator -->
            <div class="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span>
              <span>Ready to scan</span>
            </div>

            <!-- Interactive Demo Simulator Action -->
            <button
              type="button"
              @click="simulateConnection"
              :disabled="simulating"
              class="mt-2.5 h-8 px-3 bg-[#23B750] hover:bg-[#1fa347] text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Smartphone class="w-3 h-3" />
              <span>{{ simulating ? 'Connecting...' : 'Simulate Scan & Connect' }}</span>
            </button>
          </div>

          <!-- Right Step-by-Step Instructions -->
          <div class="text-left space-y-2">
            <h4 class="text-[11px] font-bold text-gray-800 uppercase tracking-wider">How to connect:</h4>
            <ol class="space-y-1.5 text-[11px] text-gray-600">
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-50 text-emerald-800 font-semibold flex items-center justify-center text-[10px] shrink-0 border border-emerald-200">1</span>
                <span>Open WhatsApp on your phone</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-50 text-emerald-800 font-semibold flex items-center justify-center text-[10px] shrink-0 border border-emerald-200">2</span>
                <span>Go to <strong>Settings</strong> or tap <strong>Menu (⋮)</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-50 text-emerald-800 font-semibold flex items-center justify-center text-[10px] shrink-0 border border-emerald-200">3</span>
                <span>Tap <strong>Linked Devices</strong> → <strong>Link a Device</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-50 text-emerald-800 font-semibold flex items-center justify-center text-[10px] shrink-0 border border-emerald-200">4</span>
                <span>Scan the QR code on your screen</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- SUB-STEP 3: ASSIGN AGENTS -->
    <div v-else-if="subStep === 3" class="space-y-3 text-left">
      <div class="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
        <Info class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
        <span>Select team members who can reply to chats on this WhatsApp number.</span>
      </div>

      <div class="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-0.5">
        <div
          v-for="agent in agentList"
          :key="agent.name"
          class="flex items-center justify-between p-2.5 bg-white border border-gray-200/90 rounded-xl text-xs hover:border-gray-300 transition-colors shadow-2xs"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-[10px] border border-emerald-200/60">
              {{ agent.initials }}
            </div>
            <div>
              <div class="font-bold text-gray-900 leading-none">{{ agent.name }}</div>
              <div class="text-gray-500 text-[10px] leading-none mt-0.5">{{ agent.role }} · {{ agent.email }}</div>
            </div>
          </div>

          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="data.assignedAgents.includes(agent.email)"
              @change="toggleAgent(agent.email)"
              class="sr-only peer"
            />
            <div class="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#23B750] shadow-2xs"></div>
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
