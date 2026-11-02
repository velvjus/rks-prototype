<template>
  <div class="space-y-4 text-left flex-1 flex flex-col min-h-0">
    <!-- Header (Constant Top Position, Left Aligned matching Steps 1-3) -->
    <div class="shrink-0 space-y-1">
      <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Configure website LiveChat
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Customize your chat widget appearance and install the embed snippet on your website.
      </p>
    </div>

    <!-- Strictly 1-Line Sub-step Switcher Pills (No Wrapping, Perfectly Aligned) -->
    <div class="flex items-center p-1 bg-muted rounded-xl w-full max-w-sm mx-auto text-xs border border-border shadow-2xs select-none">
      <button
        type="button"
        @click="subStep = 1"
        :class="[
          'flex-1 h-8 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0',
          subStep === 1 ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" :class="subStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">1</span>
        <span class="text-xs">Customize</span>
      </button>

      <button
        type="button"
        @click="subStep = 2"
        :class="[
          'flex-1 h-8 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0',
          subStep === 2 ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'
        ]"
      >
        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" :class="subStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'">2</span>
        <span class="text-xs">Assign</span>
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
        <span class="text-xs">Install</span>
      </button>
    </div>

    <!-- SUB-STEP 1: CONFIGURE & REAL-TIME PREVIEW (Fits max-w-xl Stage) -->
    <div v-if="subStep === 1" class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
      <!-- Left Inputs Column -->
      <div class="space-y-3">
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-foreground">Website Name</label>
          <input
            v-model="data.websiteName"
            type="text"
            placeholder="e.g. Acme Corp"
            class="w-full h-10 px-3.5 bg-card border border-input rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary shadow-2xs transition-all"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-semibold text-foreground">Domain</label>
          <input
            v-model="data.websiteDomain"
            type="text"
            placeholder="e.g. www.acme.com"
            class="w-full h-10 px-3.5 bg-card border border-input rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary shadow-2xs transition-all"
          />
        </div>

        <!-- Brand Accent Color with Presets & Custom Plus Button -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-foreground">Brand Accent Color</label>
            <span class="text-[11px] font-mono text-muted-foreground">{{ data.widgetColor }}</span>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Default Swatches (Missing colors added, duplicates removed) -->
            <button
              type="button"
              v-for="color in defaultColors"
              :key="color.hex"
              @click="setWidgetColor(color.hex)"
              :class="[
                'w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer shadow-2xs',
                data.widgetColor.toLowerCase() === color.hex.toLowerCase() ? 'border-foreground ring-2 ring-foreground/20 scale-110' : 'border-border hover:scale-105'
              ]"
              :style="{ backgroundColor: color.hex }"
              :title="color.name"
            >
              <Check v-if="data.widgetColor.toLowerCase() === color.hex.toLowerCase()" class="w-3 h-3 text-primary-foreground stroke-[2.5]" />
            </button>

            <!-- Custom Color Plus Button -->
            <button
              type="button"
              @click="toggleCustomInput"
              :class="[
                'w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer shadow-2xs',
                isCustomColorActive
                  ? 'border-foreground ring-2 ring-foreground/20 scale-110'
                  : showCustomInput
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/10 text-primary'
                    : 'border-dashed border-border hover:border-foreground/30 bg-card text-muted-foreground hover:text-foreground hover:scale-105'
              ]"
              :style="isCustomColorActive ? { backgroundColor: data.widgetColor } : {}"
              :title="isCustomColorActive ? `Custom: ${data.widgetColor}` : 'Add custom color'"
            >
              <Check v-if="isCustomColorActive && !showCustomInput" class="w-3 h-3 text-primary-foreground stroke-[2.5]" />
              <Plus v-else class="w-3.5 h-3.5 stroke-[2.5]" :class="isCustomColorActive ? 'text-primary-foreground' : ''" />
            </button>

            <!-- Only Hex Code Entry Appears for Custom Colors -->
            <div
              v-if="showCustomInput || isCustomColorActive"
              class="flex items-center h-7 px-2 bg-card border border-input rounded-lg text-xs font-mono text-foreground shadow-2xs focus-within:ring-1 focus-within:ring-ring focus-within:border-primary animate-in fade-in zoom-in-95 duration-150"
            >
              <span class="text-muted-foreground text-xs mr-0.5">#</span>
              <input
                ref="hexInputRef"
                type="text"
                v-model="hexInput"
                @input="onHexInputChange"
                placeholder="23B750"
                maxlength="6"
                class="w-14 bg-transparent outline-none uppercase font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-semibold text-foreground">Greeting Heading</label>
          <input
            v-model="data.welcomeHeading"
            type="text"
            placeholder="e.g. Welcome! How can we help?"
            class="w-full h-10 px-3.5 bg-card border border-input rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary shadow-2xs transition-all"
          />
        </div>

        <!-- Auto Greeting Toggle -->
        <div class="p-2.5 bg-card border border-border rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <div class="text-xs font-semibold text-foreground">Auto-show greeting bubble</div>
            <div class="text-[10px] text-muted-foreground">Show welcome prompt to visitors</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              v-model="data.autoGreeting"
              class="sr-only peer"
            />
            <div class="w-9 h-5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-2xs"></div>
          </label>
        </div>
      </div>

      <!-- Right Interactive Live Preview Mockup -->
      <div class="flex flex-col">
        <div class="text-xs font-semibold text-muted-foreground mb-1">
          <span>Live Appearance Preview</span>
        </div>

        <!-- Browser Mockup Window -->
        <div class="flex-1 bg-card border border-border rounded-2xl shadow-2xs overflow-hidden flex flex-col h-full min-h-[250px] relative">
          <!-- Browser Bar -->
          <div class="bg-muted px-3 py-1.5 border-b border-border flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-destructive"></span>
              <span class="w-2 h-2 rounded-full bg-warning"></span>
              <span class="w-2 h-2 rounded-full bg-success"></span>
            </div>
            <div class="flex-1 bg-card px-2 py-0.5 rounded-md text-[10px] text-muted-foreground truncate text-center border border-border shadow-2xs font-mono">
              https://{{ data.websiteDomain || 'www.yourwebsite.com' }}
            </div>
          </div>

          <!-- Website Canvas -->
          <div class="p-3.5 flex-1 bg-gradient-to-b from-muted/30 to-muted/10 flex flex-col justify-between relative overflow-hidden">
            <div class="space-y-1.5 opacity-50">
              <div class="h-2.5 bg-muted-foreground/30 rounded w-1/3"></div>
              <div class="h-2 bg-muted rounded w-3/4"></div>
              <div class="h-2 bg-muted rounded w-1/2"></div>
            </div>

            <!-- Floating LiveChat Widget -->
            <div class="absolute bottom-2.5 right-2.5 flex flex-col items-end space-y-1.5 max-w-[190px]">
              <!-- Greeting Bubble -->
              <div
                v-if="data.autoGreeting"
                class="p-2 rounded-xl bg-card border border-border shadow-md text-left text-xs space-y-0.5 animate-in slide-in-from-bottom-2 duration-200"
              >
                <div class="flex items-center gap-1 font-bold text-foreground text-[11px]">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: data.widgetColor }"></span>
                  <span class="truncate">{{ data.welcomeHeading || 'Welcome!' }}</span>
                </div>
                <p class="text-[9px] text-muted-foreground leading-tight line-clamp-2">
                  {{ data.welcomeTagline || 'Hi! Looking for pricing or a demo? Chat here.' }}
                </p>
              </div>

              <!-- Main Button -->
              <button
                type="button"
                :style="{ backgroundColor: data.widgetColor }"
                class="w-9 h-9 rounded-full text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <MessageSquare class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Proceed to Next Tab Button (Align middle) -->
      <div class="col-span-full pt-1.5 flex justify-center">
        <button
          type="button"
          @click="subStep = 2"
          class="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <span>Continue to Assign Reps</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- SUB-STEP 2: ASSIGN AGENTS (WITH FULL-HEIGHT CONTAINER) -->
    <div v-else-if="subStep === 2" class="space-y-3 pt-1 text-left flex-1 flex flex-col min-h-0">
      <div class="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary flex items-center gap-2 shrink-0">
        <Info class="w-4 h-4 text-primary shrink-0" />
        <span>Select team members who will receive incoming live chats from this website widget.</span>
      </div>

      <!-- Assignees Container Filling Available Height -->
      <div class="bg-muted/40 border border-border rounded-2xl p-3.5 sm:p-4 flex-1 flex flex-col min-h-0 space-y-2.5 shadow-2xs">
        <div class="flex items-center justify-between text-xs shrink-0">
          <span class="font-bold text-foreground text-xs">Widget Chat Reps</span>
          <span class="text-[11px] font-semibold text-muted-foreground">{{ data.assignedAgents.length }} of {{ agentList.length }} assigned</span>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[140px]">
          <div
            v-for="agent in agentList"
            :key="agent.name"
            class="flex items-center justify-between p-3 bg-card border border-border rounded-xl text-xs hover:border-foreground/30 transition-colors shadow-2xs"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] border border-primary/20 shrink-0">
                {{ agent.initials }}
              </div>
              <div>
                <div class="font-bold text-foreground leading-none">{{ agent.name }}</div>
                <div class="text-muted-foreground text-[11px] leading-none mt-1">{{ agent.role }} · {{ agent.email }}</div>
              </div>
            </div>

            <label class="relative inline-flex items-center cursor-pointer shrink-0">
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

      <!-- Proceed to Install Code Button (Align middle) -->
      <div class="pt-1.5 flex justify-center shrink-0">
        <button
          type="button"
          @click="subStep = 3"
          class="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <span>Continue to Install Code</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- SUB-STEP 3: INSTALL CODE -->
    <div v-else-if="subStep === 3" class="space-y-3 pt-1 text-left">
      <div class="p-3.5 bg-card border border-border rounded-2xl space-y-2.5 shadow-2xs">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-bold text-foreground">Add to your website HTML</h3>
            <p class="text-[11px] text-muted-foreground mt-0.5">Paste this lightweight snippet before your closing &lt;/body&gt; tag.</p>
          </div>
          <button
            type="button"
            @click="copySnippet"
            class="h-8.5 px-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>{{ codeCopied ? 'Copied!' : 'Copy Code' }}</span>
          </button>
        </div>

        <div class="p-2.5 bg-muted/50 border border-border rounded-xl text-xs font-mono text-foreground overflow-x-auto select-all leading-relaxed">
          &lt;script src="https://app.rakansales.com/widget.js" data-token="{{ widgetToken }}" defer&gt;&lt;/script&gt;
        </div>
      </div>

      <div class="p-3 bg-card border border-border rounded-xl text-xs text-muted-foreground flex items-center justify-between gap-3 shadow-2xs">
        <div class="flex items-center gap-2">
          <Mail class="w-4 h-4 text-muted-foreground" />
          <span class="text-xs">Need your developer or webmaster to install it?</span>
        </div>
        <button
          type="button"
          @click="emailSnippet"
          class="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-lg font-semibold text-secondary-foreground transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
        >
          <Mail class="w-3.5 h-3.5 text-muted-foreground" />
          <span>Email Developer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { MessageSquare, Copy, Info, Check, Mail, Plus, ArrowRight } from 'lucide-vue-next';

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
const widgetToken = 'rks_live_9942';

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// Non-duplicate distinct spectrum colors (Teal, Pink, Red, Orange added; duplicate green removed)
const defaultColors = [
  { name: 'Brand Green', hex: '#23B750' },
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Ocean Blue', hex: '#2563EB' },
  { name: 'Royal Purple', hex: '#7C3AED' },
  { name: 'Rose Pink', hex: '#EC4899' },
  { name: 'Crimson Red', hex: '#EF4444' },
  { name: 'Sunset Orange', hex: '#F97316' },
  { name: 'Amber Yellow', hex: '#F59E0B' },
  { name: 'Midnight Charcoal', hex: '#18181B' },
];

const hexInput = ref(props.modelValue.widgetColor.replace('#', ''));
const hexInputRef = ref<HTMLInputElement | null>(null);
const showCustomInput = ref(false);

const isCustomColorActive = computed(() => {
  const current = (data.value.widgetColor || '').toLowerCase();
  return !defaultColors.some((c) => c.hex.toLowerCase() === current);
});

function toggleCustomInput() {
  showCustomInput.value = !showCustomInput.value;
  if (showCustomInput.value) {
    nextTick(() => {
      hexInputRef.value?.focus();
    });
  }
}

function setWidgetColor(hex: string) {
  data.value.widgetColor = hex;
  hexInput.value = hex.replace('#', '');
  showCustomInput.value = false;
}

function onHexInputChange() {
  let cleaned = hexInput.value.replace('#', '').trim();
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    data.value.widgetColor = '#' + cleaned;
  }
}

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
  alert('Instructions and LiveChat widget snippet emailed to your inbox!');
}
</script>
