<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="border-b border-gray-200 dark:border-border pb-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Teams</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Organize agents into collaborative divisions and manage message routing rules.</p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-medium text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
        >
          <Plus class="w-3.5 h-3.5" /> Create Team
        </button>
      </div>
    </div>

    <!-- Teams Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="team in teams"
        :key="team.id"
        class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-250 flex flex-col justify-between group relative"
      >
        <div class="space-y-4">
          <!-- Top row (Title + Icon) -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="getColorClasses(team.color).bg">
                <component :is="getIconComponent(team.iconName)" class="w-5 h-5" :class="getColorClasses(team.color).text" />
              </div>
              <div>
                <h3 class="font-extrabold text-sm text-gray-900 dark:text-white">{{ team.name }}</h3>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ team.members.length }} members</p>
              </div>
            </div>
            
            <!-- Card Actions -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="openEditModal(team)"
                class="p-1.5 text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-muted rounded-lg transition-colors cursor-pointer"
                title="Edit Team"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                @click="confirmDelete(team)"
                class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                title="Delete Team"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs text-gray-450 dark:text-gray-300 leading-relaxed min-h-[32px]">{{ team.description || 'No description provided.' }}</p>

          <!-- Members Avatars -->
          <div class="space-y-1.5">
            <div class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Members</div>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2 overflow-hidden">
                <div
                  v-for="member in getTeamMembers(team)"
                  :key="member.id"
                  class="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-card overflow-hidden bg-gray-100 shrink-0 select-none relative group/avatar"
                >
                  <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full object-cover" />
                  <div v-else class="h-full w-full flex items-center justify-center text-[10px] font-bold text-white bg-primary">
                    {{ member.name.charAt(0) }}
                  </div>
                  <!-- Tooltip -->
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/avatar:block bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-50">
                    {{ member.name }}
                  </div>
                </div>
                
                <div v-if="team.members.length === 0" class="text-xs text-gray-400 italic">No members assigned</div>
              </div>
            </div>
          </div>

          <!-- Routed Channels -->
          <div class="space-y-1.5">
            <div class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Routed Inbox Channels</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="channel in team.channels"
                :key="channel"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-muted text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-border"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                {{ channel }}
              </span>
              <span v-if="!team.channels || team.channels.length === 0" class="text-[10px] text-gray-400 italic">No channels assigned</span>
            </div>
          </div>
        </div>

        <!-- Footer Card Row (Routing Strategy) -->
        <div class="border-t border-gray-100 dark:border-border mt-5 pt-3.5 flex items-center justify-between text-[10px]">
          <div class="flex items-center gap-1.5">
            <span class="text-gray-400 font-bold uppercase tracking-wider">Routing:</span>
            <span class="font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md text-[9px]">
              {{ team.routingStrategy === 'round-robin' ? 'Round Robin' : team.routingStrategy === 'least-busy' ? 'Least Busy' : 'Broadcast' }}
            </span>
          </div>
          <span class="text-gray-400 font-medium">Auto-Assign</span>
        </div>
      </div>

      <!-- Add Team Card Placeholder -->
      <button
        @click="openCreateModal"
        class="border-2 border-dashed border-gray-250 dark:border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer group"
      >
        <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-muted group-hover:bg-primary/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors mb-3">
          <Plus class="w-5 h-5" />
        </div>
        <div class="font-bold text-sm text-gray-700 dark:text-gray-300">Create New Team</div>
        <p class="text-xs text-gray-400 mt-1 max-w-[200px]">Group agents and configure automated assignments.</p>
      </button>
    </div>

    <!-- ════════════════ MODAL: CREATE / EDIT TEAM ════════════════ -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white dark:bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-border overflow-hidden animate-scale-up">
        <header class="px-6 py-4 border-b border-gray-150 dark:border-border flex items-center justify-between bg-gray-50 dark:bg-muted/40">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Users2 class="w-4 h-4 text-primary" />
            {{ isEditing ? 'Edit Team Details' : 'Create New Team' }}
          </h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer font-bold">✕</button>
        </header>
        
        <form @submit.prevent="saveTeam" class="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          <!-- Team Name & Description -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Team Name</label>
              <input
                type="text"
                v-model="form.name"
                placeholder="e.g. Sales Team"
                required
                class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Color Palette</label>
              <div class="flex items-center gap-2 h-10">
                <button
                  v-for="colorOpt in colorOptions"
                  :key="colorOpt"
                  type="button"
                  @click="form.color = colorOpt"
                  class="w-6 h-6 rounded-full cursor-pointer border-2 transition-transform"
                  :class="[
                    getColorClasses(colorOpt).dot,
                    form.color === colorOpt ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'
                  ]"
                ></button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Description</label>
            <input
              type="text"
              v-model="form.description"
              placeholder="e.g. Handles sales conversion and custom leads"
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            />
          </div>

          <!-- Icon & Routing -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Team Icon</label>
              <select
                v-model="form.iconName"
                class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
              >
                <option value="MessageSquare">Message Dialog</option>
                <option value="Inbox">Inbox Container</option>
                <option value="Shield">Security Shield</option>
                <option value="Target">Bullseye Target</option>
                <option value="Zap">Zap Flash</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase mb-1">Routing Strategy</label>
              <select
                v-model="form.routingStrategy"
                class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
              >
                <option value="round-robin">Round Robin (Distribute Equally)</option>
                <option value="least-busy">Least Busy (By Ticket Count)</option>
                <option value="broadcast">Broadcast (Notify All)</option>
              </select>
            </div>
          </div>

          <!-- Select Members (Tags Input / Combobox) -->
          <div ref="comboboxRef" class="space-y-1.5 relative">
            <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase">Select Team Members</label>
            
            <div 
              class="w-full min-h-[42px] p-2 bg-white dark:bg-muted border border-gray-200 dark:border-border rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary flex flex-wrap gap-1.5 items-center cursor-text"
              @click="focusMemberInput"
            >
              <!-- Tag Pills -->
              <span
                v-for="userId in form.members"
                :key="userId"
                class="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 select-none"
              >
                {{ getUserName(userId) }}
                <button
                  type="button"
                  @click.stop="removeMember(userId)"
                  class="text-primary hover:text-red-650 rounded-sm hover:bg-primary/20 transition-all p-0.5 cursor-pointer"
                >
                  <X class="w-3 h-3" />
                </button>
              </span>
              
              <input
                ref="memberInputRef"
                type="text"
                v-model="searchMemberQuery"
                placeholder="Type name to add agent..."
                class="flex-1 min-w-[120px] text-xs bg-transparent border-none outline-none focus:ring-0 p-0.5 dark:text-white"
                @focus="showMembersDropdown = true"
                @click.stop="showMembersDropdown = true"
                @keydown.backspace="handleBackspace"
              />
            </div>

            <!-- Autocomplete Popover Dropdown -->
            <div 
              v-if="showMembersDropdown" 
              class="absolute z-[110] left-0 right-0 mt-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl shadow-xl max-h-[160px] overflow-y-auto custom-scrollbar"
            >
              <div v-if="filteredMembersToSelect.length > 0" class="p-1 space-y-0.5">
                <button
                  v-for="user in filteredMembersToSelect"
                  :key="user.id"
                  type="button"
                  @click="addMember(user.id)"
                  class="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-muted dark:text-white transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{{ user.name }}</span>
                  <span class="text-[10px] text-gray-400 font-semibold">{{ user.online ? 'Online' : 'Offline' }}</span>
                </button>
              </div>
              <div v-else class="p-3 text-center text-xs text-gray-405 italic">
                No matching agents to select
              </div>
            </div>
          </div>

          <!-- Select Routed Inboxes -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase">Connect Inbox Channels</label>
            <div class="border border-gray-200 dark:border-border rounded-xl p-3 bg-gray-50/50 dark:bg-muted/10 grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar">
              <div v-for="inbox in inboxList" :key="inbox" class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :id="`team-channel-${inbox}`"
                  :value="inbox"
                  v-model="form.channels"
                  class="w-4 h-4 rounded text-primary border-gray-350 focus:ring-primary cursor-pointer"
                />
                <label :for="`team-channel-${inbox}`" class="text-xs text-gray-750 dark:text-gray-300 cursor-pointer select-none truncate">
                  {{ inbox }}
                </label>
              </div>
            </div>
          </div>

          <footer class="pt-4 border-t border-gray-150 dark:border-border flex justify-end gap-2 bg-white dark:bg-card">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border border-gray-200 dark:border-border text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-primary/10 animate-fade-in"
            >
              {{ isEditing ? 'Save Changes' : 'Create Team' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Users2, Plus, Pencil, Trash2, X,
  MessageSquare, Inbox, Shield, Target, Zap
} from 'lucide-vue-next';

interface WorkspaceUser {
  id: number;
  name: string;
  avatarBg?: string;
  avatar?: string;
  online: boolean;
}

interface WorkspaceTeam {
  id: number;
  name: string;
  description: string;
  iconName: string;
  color: 'emerald' | 'blue' | 'violet' | 'amber' | 'rose';
  members: number[];
  channels: string[];
  routingStrategy: 'round-robin' | 'least-busy' | 'broadcast';
}

const props = defineProps<{
  teams: WorkspaceTeam[];
  users: WorkspaceUser[];
}>();

const emit = defineEmits<{
  (e: 'update:teams', value: WorkspaceTeam[]): void;
  (e: 'toast', title: string, message: string, type: 'success' | 'warning'): void;
}>();

// Available list of inboxes in the workspace (can map dynamically if needed, or hardcode for demo completeness)
const inboxList = ['Support Email', 'Website Live Chat', 'Sales WhatsApp'];

const colorOptions: ('emerald' | 'blue' | 'violet' | 'amber' | 'rose')[] = [
  'emerald', 'blue', 'violet', 'amber', 'rose'
];

const showModal = ref(false);
const isEditing = ref(false);
const activeTeamId = ref<number | null>(null);

const form = ref<Omit<WorkspaceTeam, 'id'>>({
  name: '',
  description: '',
  iconName: 'MessageSquare',
  color: 'emerald',
  members: [],
  channels: [],
  routingStrategy: 'round-robin',
});

function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'Inbox': return Inbox;
    case 'Shield': return Shield;
    case 'Target': return Target;
    case 'Zap': return Zap;
    default: return MessageSquare;
  }
}

function getColorClasses(colorName: string) {
  switch (colorName) {
    case 'blue':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-600 dark:text-blue-400',
        dot: 'bg-blue-500'
      };
    case 'violet':
      return {
        bg: 'bg-violet-50 dark:bg-violet-950/40',
        text: 'text-violet-600 dark:text-violet-400',
        dot: 'bg-violet-500'
      };
    case 'amber':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-600 dark:text-amber-400',
        dot: 'bg-amber-500'
      };
    case 'rose':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-600 dark:text-rose-400',
        dot: 'bg-rose-500'
      };
    default: // emerald
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-primary dark:text-primary',
        dot: 'bg-primary'
      };
  }
}

function getTeamMembers(team: WorkspaceTeam) {
  return props.users.filter(u => team.members.includes(u.id));
}

function openCreateModal() {
  isEditing.value = false;
  activeTeamId.value = null;
  form.value = {
    name: '',
    description: '',
    iconName: 'MessageSquare',
    color: 'emerald',
    members: [],
    channels: [],
    routingStrategy: 'round-robin',
  };
  showModal.value = true;
}

function openEditModal(team: WorkspaceTeam) {
  isEditing.value = true;
  activeTeamId.value = team.id;
  form.value = {
    name: team.name,
    description: team.description,
    iconName: team.iconName,
    color: team.color,
    members: [...team.members],
    channels: [...team.channels],
    routingStrategy: team.routingStrategy,
  };
  showModal.value = true;
}

function saveTeam() {
  let newTeamsList = [...props.teams];
  
  if (isEditing.value && activeTeamId.value !== null) {
    newTeamsList = newTeamsList.map(t => {
      if (t.id === activeTeamId.value) {
        return {
          ...t,
          ...form.value
        };
      }
      return t;
    });
    emit('toast', 'Team Updated', `Successfully updated settings for ${form.value.name}.`, 'success');
  } else {
    const newTeam: WorkspaceTeam = {
      id: Date.now(),
      ...form.value
    };
    newTeamsList.push(newTeam);
    emit('toast', 'Team Created', `Team "${form.value.name}" has been successfully added.`, 'success');
  }
  
  emit('update:teams', newTeamsList);
  showModal.value = false;
}

function confirmDelete(team: WorkspaceTeam) {
  if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
    const newTeamsList = props.teams.filter(t => t.id !== team.id);
    emit('update:teams', newTeamsList);
    emit('toast', 'Team Deleted', `"${team.name}" was successfully removed.`, 'warning');
  }
}

// ══════════════ MEMBER COMBOBOX STATE & FUNCTIONS ══════════════
const searchMemberQuery = ref('');
const showMembersDropdown = ref(false);
const comboboxRef = ref<HTMLElement | null>(null);
const memberInputRef = ref<HTMLInputElement | null>(null);

function focusMemberInput() {
  memberInputRef.value?.focus();
  showMembersDropdown.value = true;
}

function handleOutsideClick(e: MouseEvent) {
  if (comboboxRef.value && !comboboxRef.value.contains(e.target as Node)) {
    showMembersDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

function getUserName(userId: number) {
  const user = props.users.find(u => u.id === userId);
  return user ? user.name : 'Unknown';
}

function addMember(userId: number) {
  if (!form.value.members.includes(userId)) {
    form.value.members.push(userId);
  }
  searchMemberQuery.value = '';
  showMembersDropdown.value = false;
}

function removeMember(userId: number) {
  form.value.members = form.value.members.filter(id => id !== userId);
}

function handleBackspace(e: KeyboardEvent) {
  if (!searchMemberQuery.value && form.value.members.length > 0) {
    form.value.members.pop();
  }
}

const filteredMembersToSelect = computed(() => {
  return props.users.filter(user => {
    const isNotSelected = !form.value.members.includes(user.id);
    const matchesSearch = user.name.toLowerCase().includes(searchMemberQuery.value.toLowerCase());
    return isNotSelected && matchesSearch;
  });
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
