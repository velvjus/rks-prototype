<template>
  <div class="space-y-3.5 animate-in fade-in-50 duration-300">
    <!-- Header -->
    <div class="text-left">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Invite your team</h2>
      <p class="text-xs text-gray-500 mt-0.5 leading-normal">Add colleagues to collaborate on messages and manage sales pipeline together.</p>
    </div>

    <!-- Invite Input Bar -->
    <div class="p-3.5 sm:p-4 bg-white border border-gray-200/90 rounded-xl space-y-3 shadow-2xs text-left">
      <label class="block text-xs font-semibold text-gray-700">Invite by Email</label>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div class="relative flex-1">
          <input
            v-model="newEmail"
            @keydown.enter.prevent="addMember"
            type="email"
            placeholder="colleague@company.com"
            class="w-full h-9 px-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] transition-all shadow-2xs"
          />
        </div>

        <div class="relative w-full sm:w-36">
          <select
            v-model="newRole"
            class="w-full h-9 px-3 pr-7 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750] appearance-none cursor-pointer shadow-2xs"
          >
            <option value="Agent">Sales Agent</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Administrator</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown class="w-3.5 h-3.5" />
          </div>
        </div>

        <button
          type="button"
          @click="addMember"
          :disabled="!isValidEmail"
          class="h-9 px-4 bg-[#23B750] hover:bg-[#1fa347] disabled:opacity-40 disabled:hover:bg-[#23B750] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer shrink-0"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Invite</span>
        </button>
      </div>

      <!-- Current Invited Members List -->
      <div class="pt-3 border-t border-gray-100 space-y-1.5">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Workspace Members ({{ data.members.length + 1 }})
        </div>

        <div class="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-0.5">
          <!-- You (Admin) -->
          <div class="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50/70 rounded-lg text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-6.5 h-6.5 rounded-full bg-[#23B750] text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                ME
              </div>
              <div>
                <div class="font-bold text-gray-900 flex items-center gap-1.5 leading-none">
                  <span>You</span>
                  <span class="px-1 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">Owner</span>
                </div>
                <span class="text-gray-400 text-[10px] leading-none">Workspace Administrator</span>
              </div>
            </div>
            <span class="text-[11px] font-medium text-gray-400">Owner</span>
          </div>

          <!-- Added Teammates -->
          <div
            v-for="(member, idx) in data.members"
            :key="member.email"
            class="flex items-center justify-between p-2 sm:p-2.5 bg-white border border-gray-200/90 rounded-lg text-xs group hover:border-gray-300 transition-colors shadow-2xs"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-6.5 h-6.5 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-[10px] border border-emerald-200/60">
                {{ member.email.slice(0, 2).toUpperCase() }}
              </div>
              <div>
                <div class="font-bold text-gray-900 leading-none">{{ member.email }}</div>
                <div class="text-[10px] text-gray-500 leading-none mt-0.5">Invited as {{ member.role }}</div>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium text-[10px]">
                {{ member.role }}
              </span>
              <button
                type="button"
                @click="removeMember(idx)"
                class="p-1 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                title="Remove invite"
              >
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Share Invite Link Box -->
    <div class="p-2.5 bg-gray-50/70 border border-gray-200/80 rounded-xl flex items-center justify-between gap-2 text-xs text-left">
      <div class="flex items-center gap-1.5 text-gray-600">
        <Link2 class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
        <span class="font-medium">Share link:</span>
        <span class="text-gray-500 text-[10px] truncate max-w-[200px] hidden sm:inline">
          rakansales.com/join/workspace-invite-8371
        </span>
      </div>
      <button
        type="button"
        @click="copyInviteLink"
        class="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 rounded-lg font-medium text-[11px] transition-all shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
      >
        <Copy class="w-3 h-3" />
        <span>{{ linkCopied ? 'Copied!' : 'Copy Link' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown, Plus, Trash2, Link2, Copy } from 'lucide-vue-next';

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

const newEmail = ref('');
const newRole = ref<'Agent' | 'Manager' | 'Admin'>('Agent');
const linkCopied = ref(false);

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value.trim());
});

function addMember() {
  if (!isValidEmail.value) return;
  const email = newEmail.value.trim().toLowerCase();
  if (data.value.members.some((m) => m.email === email)) return;

  data.value.members.push({
    email,
    role: newRole.value,
  });

  newEmail.value = '';
  newRole.value = 'Agent';
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
