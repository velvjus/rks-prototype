<template>
 <div class="space-y-6">
 <!-- Header -->
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Teams</h1>
 <p class="text-xs text-muted-foreground mt-1">Organize agents into collaborative divisions and manage message routing rules.</p>
 </div>
 <button
 @click="openCreateModal"
 class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
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
 class="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-250 flex flex-col justify-between group relative"
 >
 <div class="space-y-4">
 <!-- Top row (Title + Icon) -->
 <div class="flex items-start justify-between">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="getColorClasses(team.color).bg">
 <component :is="getIconComponent(team.iconName)" class="w-5 h-5" :class="getColorClasses(team.color).text" />
 </div>
 <div>
 <h3 class="font-extrabold text-sm text-foreground">{{ team.name }}</h3>
 <p class="text-[10px] text-muted-foreground mt-0.5">{{ team.members.length }} members</p>
 </div>
 </div>
 
 <!-- Card Actions -->
 <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 @click="openEditModal(team)"
 class="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors cursor-pointer"
 title="Edit Team"
 >
 <Pencil class="w-3.5 h-3.5" />
 </button>
 <button
 @click="confirmDelete(team)"
 class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
 title="Delete Team"
 >
 <Trash2 class="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 <!-- Description -->
 <p class="text-xs text-muted-foreground leading-relaxed min-h-[32px]">{{ team.description || 'No description provided.' }}</p>

 <!-- Members Avatars -->
 <div class="space-y-1.5">
 <div class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Members</div>
 <div class="flex items-center gap-2">
 <div class="flex -space-x-2 overflow-hidden">
 <div
 v-for="member in getTeamMembers(team)"
 :key="member.id"
 class="inline-block h-7 w-7 rounded-full ring-2 ring-card overflow-hidden bg-muted shrink-0 select-none relative group/avatar"
 >
 <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full object-cover" />
 <div v-else class="h-full w-full flex items-center justify-center text-[10px] font-bold text-primary-foreground bg-primary">
 {{ member.name.charAt(0) }}
 </div>
 <!-- Tooltip -->
 <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/avatar:block bg-popover text-popover-foreground text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-50">
 {{ member.name }}
 </div>
 </div>
 
 <div v-if="team.members.length === 0" class="text-xs text-muted-foreground italic">No members assigned</div>
 </div>
 </div>
 </div>

 <!-- Routed Channels -->
 <div class="space-y-1.5">
 <div class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Routed Inbox Channels</div>
 <div class="flex flex-wrap gap-1">
 <span
 v-for="channel in team.channels"
 :key="channel"
 class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted text-muted-foreground border border-border"
 >
 <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
 {{ channel }}
 </span>
 <span v-if="!team.channels || team.channels.length === 0" class="text-[10px] text-muted-foreground italic">No channels assigned</span>
 </div>
 </div>
 </div>

 <!-- Footer Card Row (Routing Strategy) -->
 <div class="border-t border-border mt-5 pt-3.5 flex items-center justify-between text-[10px]">
 <div class="flex items-center gap-1.5">
 <span class="text-muted-foreground font-bold uppercase tracking-wider">Routing:</span>
 <span class="font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md text-[9px]">
 {{ team.routingStrategy === 'round-robin' ? 'Round Robin' : team.routingStrategy === 'least-busy' ? 'Least Busy' : 'Broadcast' }}
 </span>
 </div>
 <span class="text-muted-foreground font-medium">Auto-Assign</span>
 </div>
 </div>

 <!-- Add Team Card Placeholder -->
 <button
 @click="openCreateModal"
 class="border-2 border-dashed border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer group"
 >
 <div class="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors mb-3">
 <Plus class="w-5 h-5" />
 </div>
 <div class="font-bold text-sm text-muted-foreground">Create New Team</div>
 <p class="text-xs text-muted-foreground mt-1 max-w-[200px]">Group agents and configure automated assignments.</p>
 </button>
 </div>

 <!-- ════════════════ MODAL: CREATE / EDIT TEAM ════════════════ -->
 <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-fade-in">
 <div class="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border overflow-hidden animate-scale-up">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
 <h3 class="font-bold text-sm text-foreground flex items-center gap-2">
 <Users2 class="w-4 h-4 text-primary" />
 {{ isEditing ? 'Edit Team Details' : 'Create New Team' }}
 </h3>
 <button @click="showModal = false" class="text-muted-foreground hover:text-foreground cursor-pointer font-bold">✕</button>
 </header>
 
 <form @submit.prevent="saveTeam" class="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
 <!-- Team Name & Description -->
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Team Name</label>
 <input
 type="text"
 v-model="form.name"
 placeholder="e.g. Sales Team"
 required
 class="w-full text-xs bg-card border border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary "
 />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Color Palette</label>
 <div class="flex items-center gap-2 h-10">
 <button
 v-for="colorOpt in colorOptions"
 :key="colorOpt"
 type="button"
 @click="form.color = colorOpt"
 class="w-6 h-6 rounded-full cursor-pointer border-2 transition-transform"
 :class="[
 getColorClasses(colorOpt).dot,
 form.color === colorOpt ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
 ]"
 ></button>
 </div>
 </div>
 </div>

 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Description</label>
 <input
 type="text"
 v-model="form.description"
 placeholder="e.g. Handles sales conversion and custom leads"
 class="w-full text-xs bg-card border border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary "
 />
 </div>

 <!-- Icon & Routing -->
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Team Icon</label>
 <select
 v-model="form.iconName"
 class="w-full text-xs bg-card border border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary "
 >
 <option value="MessageSquare">Message Dialog</option>
 <option value="Inbox">Inbox Container</option>
 <option value="Shield">Security Shield</option>
 <option value="Target">Bullseye Target</option>
 <option value="Zap">Zap Flash</option>
 </select>
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Routing Strategy</label>
 <select
 v-model="form.routingStrategy"
 class="w-full text-xs bg-card border border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary "
 >
 <option value="round-robin">Round Robin (Distribute Equally)</option>
 <option value="least-busy">Least Busy (By Ticket Count)</option>
 <option value="broadcast">Broadcast (Notify All)</option>
 </select>
 </div>
 </div>

 <!-- Select Members (Tags Input / Combobox) -->
 <div ref="comboboxRef" class="space-y-1.5 relative">
 <label class="block text-[10px] font-bold text-muted-foreground uppercase">Select Team Members</label>
 
 <div 
 class="w-full min-h-[42px] p-2 bg-card border border-border rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary flex flex-wrap gap-1.5 items-center cursor-text"
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
 class="text-primary hover:text-destructive rounded-sm hover:bg-primary/20 transition-all p-0.5 cursor-pointer"
 >
 <X class="w-3 h-3" />
 </button>
 </span>
 
 <input
 ref="memberInputRef"
 type="text"
 v-model="searchMemberQuery"
 placeholder="Type name to add agent..."
 class="flex-1 min-w-[120px] text-xs bg-transparent border-none outline-none focus:ring-0 p-0.5 "
 @focus="showMembersDropdown = true"
 @click.stop="showMembersDropdown = true"
 @keydown.backspace="handleBackspace"
 />
 </div>

 <!-- Autocomplete Popover Dropdown -->
 <div 
 v-if="showMembersDropdown" 
 class="absolute z-[110] left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl max-h-[160px] overflow-y-auto custom-scrollbar"
 >
 <div v-if="filteredMembersToSelect.length > 0" class="p-1 space-y-0.5">
 <button
 v-for="user in filteredMembersToSelect"
 :key="user.id"
 type="button"
 @click="addMember(user.id)"
 class="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center justify-between"
 >
 <span>{{ user.name }}</span>
 <span class="text-[10px] text-muted-foreground font-semibold">{{ user.online ? 'Online' : 'Offline' }}</span>
 </button>
 </div>
 <div v-else class="p-3 text-center text-xs text-muted-foreground italic">
 No matching agents to select
 </div>
 </div>
 </div>

 <!-- Select Routed Inboxes -->
 <div class="space-y-1.5">
 <label class="block text-[10px] font-bold text-muted-foreground uppercase">Connect Inbox Channels</label>
 <div class="border border-border rounded-xl p-3 bg-muted/10 grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar">
 <div v-for="inbox in inboxList" :key="inbox" class="flex items-center gap-2">
 <input
 type="checkbox"
 :id="`team-channel-${inbox}`"
 :value="inbox"
 v-model="form.channels"
 class="w-4 h-4 rounded text-primary border-border focus:ring-primary cursor-pointer"
 />
 <label :for="`team-channel-${inbox}`" class="text-xs text-foreground cursor-pointer select-none truncate">
 {{ inbox }}
 </label>
 </div>
 </div>
 </div>

 <footer class="pt-4 border-t border-border flex justify-end gap-2 bg-card">
 <button
 type="button"
 @click="showModal = false"
 class="px-4 py-2 border border-border text-muted-foreground hover:bg-muted font-bold text-xs rounded-xl cursor-pointer"
 >
 Cancel
 </button>
 <button
 type="submit"
 class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-primary/10 animate-fade-in"
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
 bg: 'bg-info/10',
 text: 'text-info',
 dot: 'bg-info'
 };
 case 'violet':
 return {
 bg: 'bg-tag-1',
 text: 'text-tag-1-foreground',
 dot: 'bg-tag-1-foreground'
 };
 case 'amber':
 return {
 bg: 'bg-warning/10',
 text: 'text-warning',
 dot: 'bg-warning'
 };
 case 'rose':
 return {
 bg: 'bg-destructive/10',
 text: 'text-destructive',
 dot: 'bg-destructive'
 };
 default: // emerald
 return {
 bg: 'bg-primary/10',
 text: 'text-primary',
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
 background: hsl(var(--border));
 border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
 background: hsl(var(--muted-foreground));
}
</style>
