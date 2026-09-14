<template>
  <div class="space-y-3.5 animate-in fade-in-50 duration-300">
    <!-- Header -->
    <div class="text-left">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Live chat widget</h2>
      <p class="text-xs text-gray-500 mt-0.5 leading-normal">Let website visitors start conversations directly with your sales team.</p>
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
        <span class="text-[11px]">Customize</span>
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
        <span class="text-[11px]">Assign</span>
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
        <span class="text-[11px]">Install</span>
      </button>
    </div>

    <!-- SUB-STEP 1: CONFIGURE & REAL-TIME PREVIEW -->
    <div v-if="subStep === 1" class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Left Inputs -->
      <div class="lg:col-span-6 space-y-2.5 text-left">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Website Name</label>
          <input
            v-model="data.websiteName"
            type="text"
            placeholder="e.g. Acme Corp Official"
            class="w-full h-8.5 px-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] shadow-2xs transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Website Address</label>
          <input
            v-model="data.websiteDomain"
            type="text"
            placeholder="e.g. www.acme.com"
            class="w-full h-8.5 px-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] shadow-2xs transition-all"
          />
        </div>

        <!-- Color Palette -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Theme Color</label>
          <div class="flex items-center gap-2">
            <button
              type="button"
              v-for="color in colorPalette"
              :key="color.hex"
              @click="data.widgetColor = color.hex"
              :class="[
                'w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer shadow-2xs',
                data.widgetColor === color.hex ? 'border-gray-900 ring-2 ring-gray-900/20 scale-110' : 'border-transparent hover:scale-105'
              ]"
              :style="{ backgroundColor: color.hex }"
              :title="color.name"
            >
              <Check v-if="data.widgetColor === color.hex" class="w-3 h-3 text-white stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Greeting Title</label>
          <input
            v-model="data.welcomeHeading"
            type="text"
            placeholder="e.g. Welcome! How can we help?"
            class="w-full h-8.5 px-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] shadow-2xs transition-all"
          />
        </div>

        <!-- Auto Greeting Toggle -->
        <div class="p-2.5 bg-gray-50/70 border border-gray-200/80 rounded-xl flex items-center justify-between shadow-2xs">
          <div class="text-xs">
            <div class="font-semibold text-gray-800 leading-tight">Auto-show greeting bubble</div>
            <div class="text-gray-500 text-[10px] leading-tight mt-0.5">Show welcome prompt automatically</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              v-model="data.autoGreeting"
              class="sr-only peer"
            />
            <div class="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#23B750] shadow-2xs"></div>
          </label>
        </div>
      </div>

      <!-- Right Interactive Live Widget Preview Frame -->
      <div class="lg:col-span-6 flex flex-col">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Preview</span>
          <span class="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#23B750] animate-pulse"></span>
            Live
          </span>
        </div>

        <!-- Browser Mockup Window (Compact Height) -->
        <div class="flex-1 bg-white border border-gray-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col h-[200px] max-h-[220px] relative">
          <!-- Browser Top Bar -->
          <div class="bg-gray-100/90 px-3 py-1.5 border-b border-gray-200/80 flex items-center gap-2 text-xs text-gray-500">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-[#FF5F56]"></span>
              <span class="w-2 h-2 rounded-full bg-[#FFBD2E]"></span>
              <span class="w-2 h-2 rounded-full bg-[#27C93F]"></span>
            </div>
            <div class="flex-1 bg-white px-2 py-0.2 rounded text-[10px] text-gray-600 truncate text-center border border-gray-200/70 shadow-2xs">
              https://{{ data.websiteDomain || 'www.yourwebsite.com' }}
            </div>
          </div>

          <!-- Mock Website Content Canvas -->
          <div class="p-3.5 flex-1 bg-gradient-to-b from-gray-50/40 to-gray-100/20 flex flex-col justify-between relative overflow-hidden">
            <div class="space-y-2 opacity-60">
              <div class="h-3 bg-gray-300 rounded w-1/3"></div>
              <div class="h-2 bg-gray-200 rounded w-3/4"></div>
              <div class="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>

            <!-- The Live Floating Chat Widget & Bubble -->
            <div class="absolute bottom-3 right-3 flex flex-col items-end space-y-1.5 max-w-[200px]">
              <!-- Greeting popup bubble -->
              <div
                v-if="data.autoGreeting"
                class="p-2.5 rounded-xl bg-white border border-gray-200/90 shadow-md text-left text-xs space-y-0.5 animate-in slide-in-from-bottom-2 duration-300"
              >
                <div class="flex items-center gap-1 font-bold text-gray-900 text-[11px]">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: data.widgetColor }"></span>
                  <span class="truncate">{{ data.welcomeHeading || 'Welcome!' }}</span>
                </div>
                <p class="text-[10px] text-gray-500 leading-snug line-clamp-2">
                  {{ data.welcomeTagline || 'Hi! Looking for pricing or a demo? Chat here.' }}
                </p>
              </div>

              <!-- Main Floating Button -->
              <button
                type="button"
                :style="{ backgroundColor: data.widgetColor }"
                class="w-9 h-9 rounded-full text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <MessageSquare class="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SUB-STEP 2: ASSIGN AGENTS -->
    <div v-else-if="subStep === 2" class="space-y-3 text-left">
      <div class="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
        <Info class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
        <span>Select team members who will receive live chats from this website widget.</span>
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

    <!-- SUB-STEP 3: INSTALL CODE -->
    <div v-else-if="subStep === 3" class="space-y-3 text-left">
      <div class="p-4 bg-white border border-gray-200/90 rounded-xl space-y-2.5 shadow-2xs">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-bold text-gray-900">Add to your website</h3>
            <p class="text-[11px] text-gray-500 mt-0.5">Paste this snippet before your closing &lt;/body&gt; tag.</p>
          </div>
          <button
            type="button"
            @click="copySnippet"
            class="px-3 py-1 bg-[#23B750] hover:bg-[#1fa347] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Copy class="w-3 h-3" />
            <span>{{ codeCopied ? 'Copied!' : 'Copy Code' }}</span>
          </button>
        </div>

        <div class="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 overflow-x-auto select-all leading-relaxed">
          &lt;script src="https://app.rakansales.com/widget.js" data-token="{{ widgetToken }}" defer&gt;&lt;/script&gt;
        </div>
      </div>

      <div class="p-3 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs text-gray-600 flex items-center justify-between gap-3 shadow-2xs">
        <div class="flex items-center gap-2">
          <Mail class="w-3.5 h-3.5 text-gray-500" />
          <span class="text-[11px]">Need your developer or webmaster to install it?</span>
        </div>
        <button
          type="button"
          @click="emailSnippet"
          class="px-2.5 py-1 bg-white border border-gray-200/90 hover:bg-gray-50 rounded-lg font-medium text-gray-700 transition-colors cursor-pointer text-xs shadow-2xs flex items-center gap-1"
        >
          <Mail class="w-3 h-3 text-gray-500" />
          <span>Email Developer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessageSquare, Copy, Info, Check, Mail } from 'lucide-vue-next';

interface WidgetData {
  websiteName: string;
  websiteDomain: string;
  widgetColor: string;
  welcomeHeading: string;
  welcomeTagline: string;
  autoGreeting: boolean;
  assignedAgents: string[];
}

const props = defineProps<{
  modelValue: WidgetData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: WidgetData): void;
}>();

const subStep = ref(1);
const codeCopied = ref(false);
const widgetToken = 'rks_live_' + Math.random().toString(36).substring(2, 10);

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const colorPalette = [
  { name: 'Brand Green', hex: '#23B750' },
  { name: 'Deep Emerald', hex: '#059669' },
  { name: 'Ocean Blue', hex: '#2563EB' },
  { name: 'Electric Violet', hex: '#7C3AED' },
  { name: 'Midnight Charcoal', hex: '#1E293B' },
];

const agentList = [
  { name: 'Justin (You)', email: 'justin@veecotech.com', role: 'Administrator', initials: 'JU' },
  { name: 'Ahmad Faizal', email: 'ahmad@veecotech.com', role: 'Sales Agent', initials: 'AF' },
  { name: 'Sarah Chen', email: 'sarah@veecotech.com', role: 'Sales Lead', initials: 'SC' },
];

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

function copySnippet() {
  const code = `<script src="https://app.rakansales.com/widget.js" data-token="${widgetToken}" defer></` + `script>`;
  navigator.clipboard.writeText(code);
  codeCopied.value = true;
  setTimeout(() => {
    codeCopied.value = false;
  }, 2000);
}

function emailSnippet() {
  alert('Instructions and widget script snippet sent to your email!');
}
</script>
