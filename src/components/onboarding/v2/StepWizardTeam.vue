<template>
  <div class="h-full flex flex-col justify-between space-y-3.5 text-left">
    <!-- Header (Constant Top Position) -->
    <div class="shrink-0 space-y-1">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Invite your sales team
      </h2>
      <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
        Add colleagues to collaborate on customer conversations and manage deals together.
      </p>
    </div>

    <!-- Multi-Email Invite Section -->
    <div class="shrink-0 space-y-1.5 pt-0.5">
      <label class="block text-xs font-semibold text-gray-700">
        Invite by Email
      </label>

      <!-- Multi-Email Field + Role + Invite Button -->
      <div class="space-y-1.5">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
          <!-- Multi-email container box -->
          <div
            class="flex-1 min-h-[44px] px-3 py-1.5 bg-white border border-gray-200 rounded-xl flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-[#23B750]/20 focus-within:border-[#23B750] transition-all shadow-2xs"
            @click="focusEmailInput"
          >
            <!-- Pending Email Chips -->
            <span
              v-for="(email, idx) in pendingEmails"
              :key="email"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-xs font-medium animate-in fade-in-50 duration-150"
            >
              <span>{{ email }}</span>
              <button
                type="button"
                @click.stop="removePendingEmail(idx)"
                class="text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full p-0.5 transition-colors cursor-pointer"
                title="Remove email"
              >
                <X class="w-3 h-3" />
              </button>
            </span>

            <!-- Clean Text input -->
            <input
              ref="emailInputRef"
              v-model="currentEmailInput"
              @keydown="handleKeyDown"
              @paste="handlePaste"
              type="text"
              :placeholder="pendingEmails.length === 0 ? 'name@company.com' : 'Add another...'"
              class="flex-1 min-w-[140px] h-7 bg-transparent text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <!-- Role Selector for New Invites -->
          <div class="relative w-full sm:w-36 shrink-0">
            <select
              v-model="selectedRole"
              class="w-full h-11 px-3 pr-8 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750] appearance-none cursor-pointer shadow-2xs"
            >
              <option value="Agent">Sales Agent</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Administrator</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <ChevronDown class="w-4 h-4" />
            </div>
          </div>

          <!-- Submit Invites Button -->
          <button
            type="button"
            @click="commitInvites"
            :disabled="totalPendingCount === 0"
            class="h-11 px-5 bg-[#23B750] hover:bg-[#1a943e] disabled:opacity-40 disabled:hover:bg-[#23B750] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>{{ totalPendingCount > 1 ? `Invite (${totalPendingCount})` : 'Invite' }}</span>
          </button>
        </div>

        <!-- Minimal Invite Link Option directly below email field -->
        <div class="flex items-center justify-between text-xs pt-0.5 px-0.5">
          <span class="text-gray-400 text-[11px]">Or share direct invitation link with your team</span>
          <button
            type="button"
            @click="copyInviteLink"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#23B750] hover:text-[#1a943e] cursor-pointer transition-colors"
          >
            <Link2 class="w-3.5 h-3.5" />
            <span>{{ linkCopied ? 'Copied link!' : 'Copy invite link' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Workspace Members Container with Background (Fills available height) -->
    <div class="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 flex-1 flex flex-col min-h-0 space-y-2.5 shadow-2xs">
      <div class="flex items-center justify-between text-xs shrink-0">
        <span class="font-bold text-gray-800 text-xs">Workspace Members</span>
        <span class="text-[11px] font-semibold text-gray-500">{{ data.members.length + 1 }} active member{{ data.members.length > 0 ? 's' : '' }}</span>
      </div>

      <!-- Scrollable Inner List Expanding to Fill Container -->
      <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[140px]">
        <!-- You (Owner) -->
        <div class="flex items-center justify-between p-3 bg-white border border-gray-200/90 rounded-xl text-xs shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#23B750] text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
              YOU
            </div>
            <div>
              <div class="font-bold text-gray-900 leading-none">
                You
              </div>
              <span class="text-gray-400 text-[11px] mt-1 block leading-none">Workspace Administrator</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold text-xs">Owner</span>
        </div>

        <!-- Added Teammates (with Direct In-line Role Editing) -->
        <div
          v-for="(member, idx) in data.members"
          :key="member.email"
          class="flex items-center justify-between p-3 bg-white border border-gray-200/90 rounded-xl text-xs group hover:border-gray-300 transition-colors shadow-2xs"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-[10px] border border-emerald-200/70 shrink-0">
              {{ member.email.slice(0, 2).toUpperCase() }}
            </div>
            <div class="min-w-0">
              <div class="font-bold text-gray-900 leading-none truncate">{{ member.email }}</div>
              <div class="text-[11px] text-gray-500 leading-none mt-1">Role: {{ member.role }}</div>
            </div>
          </div>

          <!-- Direct In-line Role Editing + Delete -->
          <div class="flex items-center gap-2 shrink-0">
            <div class="relative">
              <select
                v-model="member.role"
                class="h-7 pl-2.5 pr-6 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750] appearance-none cursor-pointer transition-colors"
                :title="`Edit role for ${member.email}`"
              >
                <option value="Agent">Agent</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <ChevronDown class="w-3 h-3 text-gray-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              @click="removeMember(idx)"
              class="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title="Remove invite"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown, Plus, Trash2, Link2, X } from 'lucide-vue-next';

interface TeamMember {
  email: string;
  role: 'Agent' | 'Manager' | 'Admin';
}

interface TeamData {
  members: TeamMember[];
}

const props = defineProps<{
  modelValue: TeamData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: TeamData): void;
}>();

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const currentEmailInput = ref('');
const pendingEmails = ref<string[]>([]);
const selectedRole = ref<'Agent' | 'Manager' | 'Admin'>('Agent');
const linkCopied = ref(false);
const emailInputRef = ref<HTMLInputElement | null>(null);

function focusEmailInput() {
  emailInputRef.value?.focus();
}

function isValidEmail(val: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

const totalPendingCount = computed(() => {
  let count = pendingEmails.value.length;
  if (isValidEmail(currentEmailInput.value)) {
    count++;
  }
  return count;
});

function addEmailToPending(val: string) {
  const cleaned = val.trim().toLowerCase();
  if (
    isValidEmail(cleaned) &&
    !pendingEmails.value.includes(cleaned) &&
    !data.value.members.some((m) => m.email === cleaned)
  ) {
    pendingEmails.value.push(cleaned);
  }
}

function removePendingEmail(idx: number) {
  pendingEmails.value.splice(idx, 1);
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
    e.preventDefault();
    if (currentEmailInput.value.trim()) {
      addEmailToPending(currentEmailInput.value);
      currentEmailInput.value = '';
    }
  } else if (e.key === 'Backspace' && currentEmailInput.value === '' && pendingEmails.value.length > 0) {
    pendingEmails.value.pop();
  }
}

function handlePaste(e: ClipboardEvent) {
  const paste = e.clipboardData?.getData('text') || '';
  if (paste.includes(',') || paste.includes(' ') || paste.includes('\n')) {
    e.preventDefault();
    const split = paste.split(/[\s,\n]+/);
    split.forEach((em) => {
      if (em.trim()) addEmailToPending(em);
    });
    currentEmailInput.value = '';
  }
}

function commitInvites() {
  if (currentEmailInput.value.trim()) {
    addEmailToPending(currentEmailInput.value);
    currentEmailInput.value = '';
  }

  pendingEmails.value.forEach((email) => {
    if (!data.value.members.some((m) => m.email === email)) {
      data.value.members.push({
        email,
        role: selectedRole.value,
      });
    }
  });

  pendingEmails.value = [];
}

function removeMember(idx: number) {
  data.value.members.splice(idx, 1);
}

function copyInviteLink() {
  navigator.clipboard.writeText('https://rakansales.com/join/workspace-invite-8371');
  linkCopied.value = true;
  setTimeout(() => {
    linkCopied.value = false;
  }, 2000);
}
</script>
