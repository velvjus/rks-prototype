<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Users class="w-6 h-6 text-primary" />
          Agents
        </h1>
        <p class="text-sm text-gray-400 mt-0.5">Manage team members, roles, and granular workspace access controls.</p>
      </div>
      <button
        @click="showInviteModal = true"
        class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-200"
      >
        <Plus class="w-4 h-4" /> Invite User
      </button>
    </div>

    <!-- Stats & Filters row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-4 shadow-xs">
        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Agents</div>
        <div class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{{ users.length }}</div>
        <div class="text-[10px] text-gray-450 mt-1">{{ users.filter(u => u.online).length }} currently online</div>
      </div>
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-4 shadow-xs">
        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Seats</div>
        <div class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{{ users.filter(u => u.active).length }}</div>
        <div class="text-[10px] text-gray-455 mt-1">{{ users.filter(u => !u.active).length }} inactive / suspended</div>
      </div>
      
      <!-- Filters (colspan-2) -->
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-4 shadow-xs md:col-span-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div class="relative w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search agents by name or email..."
            class="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white"
          />
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <select
            v-model="roleFilter"
            class="w-full sm:w-32 text-xs bg-white dark:bg-card border border-gray-200 dark:border-border px-2 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
          >
            <option value="">All Roles</option>
            <option v-for="role in roles" :key="role.name" :value="role.name">{{ role.name }}</option>
          </select>
          <select
            v-model="statusFilter"
            class="w-full sm:w-32 text-xs bg-white dark:bg-card border border-gray-200 dark:border-border px-2 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="online">Online Only</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main List and Matrix side by side -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Agents List Pane -->
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-xs overflow-hidden lg:col-span-1">
        <div class="p-4 border-b border-gray-200 dark:border-border flex items-center justify-between bg-gray-50/50 dark:bg-muted/30">
          <span class="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest">Team Members</span>
          <span class="text-[10px] text-gray-400">{{ filteredUsers.length }} showing</span>
        </div>

        <div class="divide-y divide-gray-150 dark:divide-border max-h-[500px] overflow-y-auto custom-scrollbar">
          <button
            v-for="user in filteredUsers"
            :key="user.id"
            @click="activeUser = user"
            class="w-full text-left p-4 flex items-start gap-3 transition-all hover:bg-gray-50 dark:hover:bg-muted/40 cursor-pointer group relative"
            :class="activeUser?.id === user.id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary pl-3' : ''"
          >
            <!-- Avatar -->
            <div class="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-255 dark:border-border bg-gray-100 flex items-center justify-center relative">
              <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-xs text-white" :class="user.avatarBg || 'bg-primary'">
                {{ user.name.charAt(0) }}
              </div>
              <!-- Online status badge -->
              <span
                class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-card"
                :class="user.online ? 'bg-primary' : 'bg-gray-300'"
              ></span>
            </div>

            <!-- Profile Info -->
            <div class="flex-1 min-w-0">
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                {{ user.name }}
                <span v-if="!user.active" class="text-[8px] bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 px-1.5 py-0.2 rounded font-extrabold">Suspended</span>
              </div>
              <div class="text-[10px] text-gray-400 mt-0.5 truncate">{{ user.email || `${user.name.toLowerCase()}@rakansales.com` }}</div>
              <div class="text-[9px] text-gray-500 mt-1 font-semibold flex items-center gap-1.5">
                <span class="bg-gray-100 dark:bg-muted px-1.5 py-0.5 rounded text-gray-650 dark:text-gray-300">{{ user.role }}</span>
                <span v-if="user.team" class="text-gray-400">• {{ user.team }}</span>
              </div>
            </div>

            <!-- Actions button -->
            <button
              @click.stop="openEditModal(user)"
              class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-muted rounded-md transition-all self-center cursor-pointer"
              title="Edit Member Details"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
          </button>

          <div v-if="filteredUsers.length === 0" class="p-8 text-center text-gray-400 italic text-xs">
            No agents found matching criteria.
          </div>
        </div>

        <div class="p-3 border-t border-gray-150 dark:border-border bg-gray-50/20 dark:bg-card">
          <button
            @click="showInviteModal = true"
            class="w-full py-2 border border-dashed border-gray-350 dark:border-border text-gray-450 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-primary hover:bg-primary/5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" /> Invite New Member
          </button>
        </div>
      </div>

      <!-- Permission matrix Pane -->
      <div v-if="activeUser" class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-xs overflow-hidden lg:col-span-2">
        <div class="p-4 sm:p-5 border-b border-gray-200 dark:border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-muted/20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-250 dark:border-border bg-gray-100 flex items-center justify-center">
              <img v-if="activeUser.avatar" :src="activeUser.avatar" :alt="activeUser.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-sm text-white" :class="activeUser.avatarBg || 'bg-primary'">
                {{ activeUser.name.charAt(0) }}
              </div>
            </div>
            <div>
              <h3 class="font-bold text-sm text-gray-900 dark:text-white">{{ activeUser.name }}</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] text-gray-400 font-semibold bg-gray-100 dark:bg-muted px-2 py-0.5 rounded">{{ activeUser.role }}</span>
                <span class="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-extrabold">
                  {{ activeUser.permissions ? activeUser.permissions.filter(p => p.value).length : 0 }}/{{ activeUser.permissions ? activeUser.permissions.length : 0 }} enabled
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button
              @click="toggleAllUserPerms(true)"
              class="px-2.5 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
            >
              Enable All
            </button>
            <button
              @click="toggleAllUserPerms(false)"
              class="px-2.5 py-1.5 bg-gray-100 dark:bg-muted text-gray-650 dark:text-gray-300 text-[10px] font-bold rounded-lg cursor-pointer hover:bg-gray-250 dark:hover:bg-muted/70 transition-colors"
            >
              Disable All
            </button>
            <button
              @click="toggleActiveStatus"
              class="px-2.5 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
              :class="activeUser.active ? 'bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 hover:bg-red-100' : 'bg-primary/10 text-primary hover:bg-primary/20'"
            >
              {{ activeUser.active ? 'Suspend' : 'Reactivate' }}
            </button>
          </div>
        </div>

        <!-- Matrix body -->
        <div class="divide-y divide-gray-150 dark:divide-border max-h-[460px] overflow-y-auto custom-scrollbar">
          <div v-for="category in permCategories" :key="category.name">
            <div class="px-5 py-2.5 bg-gray-50/70 dark:bg-muted/40 border-b border-gray-100 dark:border-border">
              <span class="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-wider">{{ category.name }}</span>
            </div>
            
            <div
              v-for="perm in getPermissionsByCategory(category.name)"
              :key="perm.name"
              class="px-5 py-3.5 flex items-center justify-between hover:bg-gray-55/40 dark:hover:bg-muted/20 transition-colors"
            >
              <div class="space-y-0.5 pr-4">
                <div class="font-bold text-xs text-gray-800 dark:text-gray-200">{{ perm.name }}</div>
                <div class="text-[10px] text-gray-405 leading-relaxed">{{ perm.desc }}</div>
              </div>
              <button
                @click="toggleSinglePermission(perm)"
                class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                :class="perm.value ? 'bg-primary' : 'bg-gray-200 dark:bg-muted'"
              >
                <span
                  class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"
                  :class="perm.value ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/10 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-4">
            <span>Deals Assigned: <strong class="text-gray-800 dark:text-gray-200">{{ activeUser.dealCount || 0 }}</strong></span>
            <span>Conversations: <strong class="text-gray-800 dark:text-gray-200">{{ activeUser.convCount || 0 }}</strong></span>
          </div>
          <button
            @click="savePermissions"
            class="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
          >
            Save Access Changes
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════ MODAL: INVITE USER ════════════════ -->
    <div v-if="showInviteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white dark:bg-card rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-border overflow-hidden animate-scale-up">
        <header class="px-6 py-4 border-b border-gray-150 dark:border-border flex items-center justify-between bg-gray-50 dark:bg-muted/40">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Users class="w-4 h-4 text-primary" /> Invite Team Member
          </h3>
          <button @click="showInviteModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer font-bold">✕</button>
        </header>
        <form @submit.prevent="submitInvite" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Full Name</label>
            <input
              type="text"
              v-model="inviteForm.name"
              placeholder="e.g. Alice Johnson"
              required
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase mb-1">Email Address</label>
            <input
              type="email"
              v-model="inviteForm.email"
              placeholder="alice@rakansales.com"
              required
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase mb-1">Assign Role</label>
              <select
                v-model="inviteForm.role"
                required
                class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
              >
                <option v-for="role in roles" :key="role.name" :value="role.name">{{ role.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase mb-1">Assign Team</label>
              <select
                v-model="inviteForm.team"
                class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
              >
                <option value="">No Team</option>
                <option v-for="t in teamList" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
          
          <div class="pt-4 border-t border-gray-150 dark:border-border flex justify-end gap-2">
            <button
              type="button"
              @click="showInviteModal = false"
              class="px-4 py-2 border border-gray-200 dark:border-border text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-primary/10"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ════════════════ MODAL: EDIT AGENT DETAILS ════════════════ -->
    <div v-if="showEditModalState" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white dark:bg-card rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-border overflow-hidden animate-scale-up">
        <header class="px-6 py-4 border-b border-gray-150 dark:border-border flex items-center justify-between bg-gray-50 dark:bg-muted/40">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Pencil class="w-4 h-4 text-primary" /> Edit Agent Profile
          </h3>
          <button @click="showEditModalState = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer font-bold">✕</button>
        </header>
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-3 bg-gray-50 dark:bg-muted/20 p-3 rounded-xl border border-gray-150 dark:border-border">
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
              {{ editingUser.name.charAt(0) }}
            </div>
            <div>
              <div class="font-bold text-xs text-gray-900 dark:text-white">{{ editingUser.name }}</div>
              <div class="text-[10px] text-gray-400 mt-0.5">{{ editingUser.email || 'no-email@rakansales.com' }}</div>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Full Name</label>
            <input
              type="text"
              v-model="editingUser.name"
              required
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase mb-1">Email Address</label>
            <input
              type="email"
              v-model="editingUser.email"
              required
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase mb-1">Role Type</label>
              <select
                v-model="editingUser.role"
                required
                class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
              >
                <option v-for="role in roles" :key="role.name" :value="role.name">{{ role.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-550 dark:text-gray-300 uppercase mb-1">Team Assignment</label>
              <select
                v-model="editingUser.team"
                class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
              >
                <option value="">No Team</option>
                <option v-for="t in teamList" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 border border-gray-150 dark:border-border rounded-xl bg-gray-50/50 dark:bg-muted/10">
            <div>
              <div class="font-bold text-xs text-gray-800 dark:text-gray-200">Account Access</div>
              <p class="text-[9px] text-gray-400 mt-0.5">Toggle whether this user can log into the workspace.</p>
            </div>
            <button
              @click="editingUser.active = !editingUser.active"
              class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
              :class="editingUser.active ? 'bg-primary' : 'bg-gray-250'"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="editingUser.active ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>

          <div class="pt-4 border-t border-gray-150 dark:border-border flex justify-end gap-2">
            <button
              @click="showEditModalState = false"
              class="px-4 py-2 border border-gray-200 dark:border-border text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="saveEditAgent"
              class="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-primary/10"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Users, Plus, Pencil, Search } from 'lucide-vue-next';

interface UserPermission {
  name: string;
  desc: string;
  category: string;
  value: boolean;
}

interface WorkspaceUser {
  id: number;
  name: string;
  email?: string;
  role: string;
  team?: string;
  avatarBg?: string;
  avatar?: string;
  online: boolean;
  lastSeen: string;
  active: boolean;
  dealCount: number;
  convCount: number;
  permissions: UserPermission[];
}

interface WorkspaceRole {
  name: string;
  colorBg: string;
  colorText: string;
}

const props = defineProps<{
  users: WorkspaceUser[];
  roles: WorkspaceRole[];
}>();

const emit = defineEmits<{
  (e: 'update:users', value: WorkspaceUser[]): void;
  (e: 'toast', title: string, message: string, type: 'success' | 'warning'): void;
}>();

const teamList = ['Sales Team', 'Support Team', 'Enterprise Team'];

const permCategories = [
  { name: 'CRM Access' },
  { name: 'AI & Training' },
  { name: 'Billing & Admin' },
  { name: 'Channels' },
  { name: 'Reporting' },
];

const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');

const activeUser = ref<WorkspaceUser | null>(props.users.length ? props.users[0] : null);

// Keep activeUser sync'd if parent prop changes
watch(() => props.users, (newUsers) => {
  if (newUsers.length && (!activeUser.value || !newUsers.some(u => u.id === activeUser.value?.id))) {
    activeUser.value = newUsers[0];
  }
}, { deep: true });

// Modal state
const showInviteModal = ref(false);
const showEditModalState = ref(false);

const inviteForm = ref({
  name: '',
  email: '',
  role: props.roles.length ? props.roles[0].name : 'Sales Rep',
  team: 'Sales Team',
});

const editingUser = ref<WorkspaceUser>({
  id: 0,
  name: '',
  email: '',
  role: '',
  team: '',
  online: false,
  lastSeen: '',
  active: true,
  dealCount: 0,
  convCount: 0,
  permissions: [],
});

// Computed filtering
const filteredUsers = computed(() => {
  return props.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    const matchesRole = !roleFilter.value || user.role === roleFilter.value;
    
    let matchesStatus = true;
    if (statusFilter.value === 'active') matchesStatus = user.active;
    else if (statusFilter.value === 'inactive') matchesStatus = !user.active;
    else if (statusFilter.value === 'online') matchesStatus = user.online;

    return matchesSearch && matchesRole && matchesStatus;
  });
});

function getPermissionsByCategory(catName: string) {
  if (!activeUser.value || !activeUser.value.permissions) return [];
  return activeUser.value.permissions.filter(p => p.category === catName);
}

function toggleSinglePermission(perm: UserPermission) {
  perm.value = !perm.value;
  emit('toast', 'Permission Toggled', `Changed [${perm.name}] status to ${perm.value ? 'enabled' : 'disabled'}.`, 'success');
}

function toggleAllUserPerms(val: boolean) {
  if (!activeUser.value) return;
  activeUser.value.permissions.forEach(p => p.value = val);
  emit('toast', 'Permissions Reset', `All permissions ${val ? 'enabled' : 'disabled'} for ${activeUser.value.name}.`, 'success');
}

function toggleActiveStatus() {
  if (!activeUser.value) return;
  activeUser.value.active = !activeUser.value.active;
  emit(
    'toast', 
    activeUser.value.active ? 'Agent Restored' : 'Agent Suspended', 
    `${activeUser.value.name}'s account status has been updated.`, 
    activeUser.value.active ? 'success' : 'warning'
  );
}

function savePermissions() {
  if (!activeUser.value) return;
  emit('toast', 'Permissions Saved', `Access policies saved successfully for ${activeUser.value.name}.`, 'success');
}

function makeDefaultPerms(isAdmin: boolean): UserPermission[] {
  return [
    { name: 'View All Deals', desc: 'Access to full deal pipeline across all users.', category: 'CRM Access', value: isAdmin },
    { name: 'Edit Deals', desc: 'Can create, update, and delete deals.', category: 'CRM Access', value: isAdmin },
    { name: 'Bulk Export Contacts', desc: 'Export full contact list as CSV/Excel.', category: 'CRM Access', value: isAdmin },
    { name: 'AI Model Training', desc: 'Upload docs and trigger AI re-training.', category: 'AI & Training', value: isAdmin },
    { name: 'AI Feature Config', desc: 'Configure AI-powered replies and campaigns.', category: 'AI & Training', value: isAdmin },
    { name: 'Billing Controls', desc: 'Modify subscription plan and seat count.', category: 'Billing & Admin', value: isAdmin },
    { name: 'Workspace Settings', desc: 'Access and modify workspace configuration.', category: 'Billing & Admin', value: isAdmin },
    { name: 'Invite Users', desc: 'Send invitations to new team members.', category: 'Billing & Admin', value: isAdmin },
    { name: 'Add Inbox Channels', desc: 'Connect new email, WhatsApp, or chat channels.', category: 'Channels', value: true },
    { name: 'Configure Routing', desc: 'Set up inbox routing rules and assignments.', category: 'Channels', value: isAdmin },
    { name: 'View Analytics', desc: 'Access workspace-level performance reports.', category: 'Reporting', value: true },
    { name: 'Export Reports', desc: 'Download analytics data and MRR reports.', category: 'Reporting', value: isAdmin },
  ];
}

function submitInvite() {
  const newUserList = [...props.users];
  const colorMap = ['bg-teal-105 text-teal-700', 'bg-rose-100 text-rose-700', 'bg-lime-100 text-lime-700', 'bg-violet-100 text-violet-750'];
  const avatarMap = [
    '/avatars/agent_10_malay_male_coral.png',
    '/avatars/agent_13_malay_female_hijab_peach.png',
    '/avatars/agent_15_indian_female_yellow.png',
    '/avatars/agent_16_malay_male_teal.png',
    '/avatars/agent_17_chinese_female_sand.png'
  ];
  const nextId = Date.now();
  const avatarIndex = newUserList.length % avatarMap.length;
  const colorIndex = newUserList.length % colorMap.length;

  const newUser: WorkspaceUser = {
    id: nextId,
    name: inviteForm.value.name,
    email: inviteForm.value.email,
    role: inviteForm.value.role,
    team: inviteForm.value.team || undefined,
    avatarBg: colorMap[colorIndex],
    avatar: avatarMap[avatarIndex],
    online: false,
    lastSeen: 'Invited',
    active: true,
    dealCount: 0,
    convCount: 0,
    permissions: makeDefaultPerms(inviteForm.value.role === 'Workspace Admin')
  };

  newUserList.push(newUser);
  emit('update:users', newUserList);
  emit('toast', 'Invitation Sent', `${inviteForm.value.name} has been invited as ${inviteForm.value.role}.`, 'success');
  
  // Reset form
  inviteForm.value.name = '';
  inviteForm.value.email = '';
  showInviteModal.value = false;

  // Set active user to newly created user
  activeUser.value = newUser;
}

function openEditModal(user: WorkspaceUser) {
  editingUser.value = {
    ...user,
    permissions: user.permissions ? user.permissions.map(p => ({ ...p })) : []
  };
  showEditModalState.value = true;
}

function saveEditAgent() {
  const newUserList = props.users.map(u => {
    if (u.id === editingUser.value.id) {
      // If role changed, make sure they get updated default permission set if necessary
      const roleChanged = u.role !== editingUser.value.role;
      const permissions = roleChanged ? makeDefaultPerms(editingUser.value.role === 'Workspace Admin') : editingUser.value.permissions;
      return {
        ...u,
        name: editingUser.value.name,
        email: editingUser.value.email,
        role: editingUser.value.role,
        team: editingUser.value.team || undefined,
        active: editingUser.value.active,
        permissions
      };
    }
    return u;
  });

  emit('update:users', newUserList);
  emit('toast', 'Agent Updated', `Saved profile details for ${editingUser.value.name}.`, 'success');
  showEditModalState.value = false;

  // Refresh activeUser reference
  const updatedUser = newUserList.find(u => u.id === editingUser.value.id);
  if (updatedUser) {
    activeUser.value = updatedUser;
  }
}
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
