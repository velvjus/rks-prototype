<template>
  <div class="space-y-3.5 animate-in fade-in-50 duration-300">
    <!-- Header -->
    <div class="text-left">
      <h2 class="text-base sm:text-lg font-bold text-foreground tracking-tight">Invite your team</h2>
      <p class="text-xs text-muted-foreground mt-0.5 leading-normal">Add colleagues to collaborate on messages and manage sales pipeline together.</p>
    </div>

    <!-- Invite Input Bar -->
    <div class="p-3.5 sm:p-4 bg-card border border-border rounded-xl space-y-3 shadow-2xs text-left text-card-foreground">
      <label class="block text-xs font-semibold text-foreground">Invite by Email</label>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div class="relative flex-1">
          <input
            v-model="newEmail"
            @keydown.enter.prevent="addMember"
            type="email"
            placeholder="colleague@company.com"
            class="w-full h-9 px-3 bg-muted/40 hover:bg-card focus:bg-card border border-input hover:border-border rounded-xl text-xs font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all shadow-2xs"
          />
        </div>

        <div class="relative w-full sm:w-36">
          <select
            v-model="newRole"
            class="w-full h-9 px-3 pr-7 bg-muted/40 hover:bg-card focus:bg-card border border-input hover:border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary appearance-none cursor-pointer shadow-2xs"
          >
            <option value="Agent">Sales Agent</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Administrator</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
            <ChevronDown class="w-3.5 h-3.5" />
          </div>
        </div>

        <button
          type="button"
          @click="addMember"
          :disabled="!isValidEmail"
          class="h-9 px-4 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary text-primary-foreground text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer shrink-0"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Invite</span>
        </button>
      </div>

      <!-- Current Invited Members List -->
      <div class="pt-3 border-t border-border space-y-1.5">
        <div class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Workspace Members ({{ data.members.length + 1 }})
        </div>

        <div class="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-0.5">
          <!-- You (Admin) -->
          <div class="flex items-center justify-between p-2 sm:p-2.5 bg-muted/50 rounded-lg text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-6.5 h-6.5 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-[10px] shadow-2xs">
                ME
              </div>
              <div>
                <div class="font-bold text-foreground flex items-center gap-1.5 leading-none">
                  <span>You</span>
                  <span class="px-1 py-0.2 bg-success/20 text-success text-[9px] font-bold rounded">Owner</span>
                </div>
                <span class="text-muted-foreground text-[10px] leading-none">Workspace Administrator</span>
              </div>
            </div>
            <span class="text-[11px] font-medium text-muted-foreground">Owner</span>
          </div>

          <!-- Added Teammates -->
          <div
            v-for="(member, idx) in data.members"
            :key="member.email"
            class="flex items-center justify-between p-2 sm:p-2.5 bg-card border border-border rounded-lg text-xs group hover:border-border transition-colors shadow-2xs text-card-foreground"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-6.5 h-6.5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] border border-primary/20">
                {{ member.email.slice(0, 2).toUpperCase() }}
              </div>
              <div>
                <div class="font-bold text-foreground leading-none">{{ member.email }}</div>
                <div class="text-[10px] text-muted-foreground leading-none mt-0.5">Invited as {{ member.role }}</div>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium text-[10px]">
                {{ member.role }}
              </span>
              <button
                type="button"
                @click="removeMember(idx)"
                class="p-1 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
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
    <div class="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between gap-2 text-xs text-left">
      <div class="flex items-center gap-1.5 text-foreground">
        <Link2 class="w-3.5 h-3.5 text-primary shrink-0" />
        <span class="font-medium">Share link:</span>
        <span class="text-muted-foreground text-[10px] truncate max-w-[200px] hidden sm:inline">
          rakansales.com/join/workspace-invite-8371
        </span>
      </div>
      <button
        type="button"
        @click="copyInviteLink"
        class="px-2.5 py-1 bg-card hover:bg-muted text-foreground border border-border rounded-lg font-medium text-[11px] transition-all shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
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
