<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="border-b border-gray-200 dark:border-border pb-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Roles & Permissions</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Define role templates, select global permission levels, and manage user access policies.</p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-medium text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
        >
          <Plus class="w-3.5 h-3.5" /> Create Custom Role
        </button>
      </div>
    </div>

    <!-- Main List and Details Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Roles List Card (Left pane) -->
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-xs overflow-hidden lg:col-span-1">
        <div class="p-4 border-b border-gray-200 dark:border-border flex items-center justify-between bg-gray-50/50 dark:bg-muted/30">
          <span class="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest">Workspace Roles</span>
          <span class="text-[10px] text-gray-400">{{ roles.length }} total</span>
        </div>

        <div class="divide-y divide-gray-150 dark:divide-border p-2 space-y-1.5">
          <div
            v-for="role in roles"
            :key="role.name"
            @click="activeRole = role"
            class="w-full text-left p-4 rounded-xl transition-all cursor-pointer group relative flex flex-col justify-between border"
            :class="[
              activeRole.name === role.name 
                ? 'bg-primary/5 dark:bg-primary/10 border-primary shadow-sm' 
                : 'bg-white dark:bg-card border-gray-200 dark:border-border hover:bg-gray-50/55 dark:hover:bg-muted/30'
            ]"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span
                  class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full"
                  :class="[role.colorBg, role.colorText]"
                >
                  {{ role.name }}
                </span>
                
                <!-- Delete Custom Role -->
                <button
                  v-if="!isSystemRole(role.name)"
                  @click.stop="confirmDelete(role)"
                  class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-all cursor-pointer"
                  title="Delete Custom Role"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <p class="text-xs text-gray-450 dark:text-gray-350 leading-relaxed">{{ role.description || 'No description provided.' }}</p>
            </div>

            <!-- Role footer info -->
            <div class="flex items-center justify-between border-t border-gray-100 dark:border-border/30 mt-3 pt-2 text-[10px] text-gray-400">
              <span>{{ getRoleUsersCount(role.name) }} members assigned</span>
              <span class="font-bold text-primary">{{ getRoleActivePermsCount(role) }}/{{ role.permissions ? role.permissions.length : 12 }} perms</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Permission Matrix Details (Right Pane) -->
      <div v-if="activeRole" class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-xs overflow-hidden lg:col-span-2">
        <div class="p-4 sm:p-5 border-b border-gray-200 dark:border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-muted/20">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-extrabold text-sm text-gray-900 dark:text-white">Access Permissions for:</h3>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="[activeRole.colorBg, activeRole.colorText]">
                {{ activeRole.name }}
              </span>
            </div>
            <p class="text-[10.5px] text-gray-400 mt-1">Changes applied here will update the default access configuration for all agents with this role.</p>
          </div>
          
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button
              @click="toggleAllRolePerms(true)"
              class="px-2.5 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
            >
              Enable All
            </button>
            <button
              @click="toggleAllRolePerms(false)"
              class="px-2.5 py-1.5 bg-gray-100 dark:bg-muted text-gray-650 dark:text-gray-300 text-[10px] font-bold rounded-lg cursor-pointer hover:bg-gray-250 dark:hover:bg-muted/70 transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>

        <!-- Matrix Body -->
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
                @click="toggleRolePermission(perm)"
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
          <div class="flex items-center gap-1">
            <span class="font-bold text-gray-700 dark:text-gray-300">{{ getRoleUsersCount(activeRole.name) }} agents</span>
            <span>will be affected by saving.</span>
          </div>
          <button
            @click="saveRolePermissions"
            class="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
          >
            Apply & Save Role Policy
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════ MODAL: CREATE CUSTOM ROLE ════════════════ -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white dark:bg-card rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-border overflow-hidden animate-scale-up">
        <header class="px-6 py-4 border-b border-gray-150 dark:border-border flex items-center justify-between bg-gray-50 dark:bg-muted/40">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-primary" /> Create Custom Role
          </h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer font-bold">✕</button>
        </header>
        
        <form @submit.prevent="submitCreateRole" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Role Name</label>
            <input
              type="text"
              v-model="createForm.name"
              placeholder="e.g. Outsourced Sales Rep"
              required
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Description</label>
            <input
              type="text"
              v-model="createForm.description"
              placeholder="e.g. Standard rep access with limited export controls."
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-505 dark:text-gray-300 uppercase mb-1">Inherit Permissions From</label>
            <select
              v-model="createForm.inheritFrom"
              class="w-full text-xs bg-white dark:bg-muted border border-gray-200 dark:border-border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:text-white"
            >
              <option v-for="r in roles" :key="r.name" :value="r.name">{{ r.name }}</option>
            </select>
          </div>

          <div class="pt-4 border-t border-gray-150 dark:border-border flex justify-end gap-2 bg-white dark:bg-card">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 border border-gray-200 dark:border-border text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-primary/10"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ShieldAlert, ShieldCheck, Plus, Trash2 } from 'lucide-vue-next';

interface UserPermission {
  name: string;
  desc: string;
  category: string;
  value: boolean;
}

interface WorkspaceUser {
  id: number;
  name: string;
  role: string;
  permissions: UserPermission[];
}

interface WorkspaceRole {
  name: string;
  description?: string;
  colorBg: string;
  colorText: string;
  permissions: UserPermission[];
}

const props = defineProps<{
  roles: WorkspaceRole[];
  users: WorkspaceUser[];
}>();

const emit = defineEmits<{
  (e: 'update:roles', value: WorkspaceRole[]): void;
  (e: 'update:users', value: WorkspaceUser[]): void;
  (e: 'toast', title: string, message: string, type: 'success' | 'warning'): void;
}>();

const systemRolesList = ['Workspace Admin', 'Senior Sales Rep', 'Sales Rep', 'Junior Rep'];

const permCategories = [
  { name: 'CRM Access' },
  { name: 'AI & Training' },
  { name: 'Billing & Admin' },
  { name: 'Channels' },
  { name: 'Reporting' },
];

const activeRole = ref<WorkspaceRole>(props.roles[0]);

const showCreateModal = ref(false);
const createForm = ref({
  name: '',
  description: '',
  inheritFrom: 'Sales Rep'
});

function isSystemRole(roleName: string) {
  return systemRolesList.includes(roleName);
}

function getRoleUsersCount(roleName: string) {
  return props.users.filter(u => u.role === roleName).length;
}

function getRoleActivePermsCount(role: WorkspaceRole) {
  if (!role.permissions) return 0;
  return role.permissions.filter(p => p.value).length;
}

function getPermissionsByCategory(catName: string) {
  if (!activeRole.value || !activeRole.value.permissions) return [];
  return activeRole.value.permissions.filter(p => p.category === catName);
}

function toggleRolePermission(perm: UserPermission) {
  perm.value = !perm.value;
  emit('toast', 'Permission Toggled', `[${perm.name}] is now default ${perm.value ? 'enabled' : 'disabled'} for ${activeRole.value.name}.`, 'success');
}

function toggleAllRolePerms(val: boolean) {
  if (!activeRole.value) return;
  activeRole.value.permissions.forEach(p => p.value = val);
  emit('toast', 'Permissions Reset', `All permissions default ${val ? 'enabled' : 'disabled'} for ${activeRole.value.name}.`, 'success');
}

function toggleRolePermissions(perm: any) {
  perm.value = !perm.value;
}

function saveRolePermissions() {
  if (!activeRole.value) return;
  
  // Propagate changes to all users holding this role
  const updatedUsers = props.users.map(u => {
    if (u.role === activeRole.value.name) {
      // Map all permissions to match role settings
      return {
        ...u,
        permissions: activeRole.value.permissions.map(p => ({ ...p }))
      };
    }
    return u;
  });

  emit('update:users', updatedUsers);
  emit('toast', 'Role Policies Saved', `Updated access permissions for all ${getRoleUsersCount(activeRole.value.name)} users holding the "${activeRole.value.name}" role.`, 'success');
}

function openCreateModal() {
  createForm.value = {
    name: '',
    description: '',
    inheritFrom: props.roles.length ? props.roles[0].name : 'Sales Rep'
  };
  showCreateModal.value = true;
}

function submitCreateRole() {
  const roleName = createForm.value.name.trim();
  if (!roleName) return;

  if (props.roles.some(r => r.name.toLowerCase() === roleName.toLowerCase())) {
    emit('toast', 'Error Creating Role', `A role named "${roleName}" already exists.`, 'warning');
    return;
  }

  // Get permissions structure to inherit
  const inheritSource = props.roles.find(r => r.name === createForm.value.inheritFrom) || props.roles[0];
  const permissions = inheritSource.permissions.map(p => ({ ...p }));

  const colorOptions = [
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' }
  ];
  const color = colorOptions[props.roles.length % colorOptions.length];

  const newRole: WorkspaceRole = {
    name: roleName,
    description: createForm.value.description || 'Custom defined role.',
    colorBg: color.bg,
    colorText: color.text,
    permissions
  };

  const newRolesList = [...props.roles, newRole];
  emit('update:roles', newRolesList);
  emit('toast', 'Role Created', `Custom role "${roleName}" created. Default permissions copied from ${createForm.value.inheritFrom}.`, 'success');
  
  showCreateModal.value = false;
  activeRole.value = newRole;
}

function confirmDelete(role: WorkspaceRole) {
  const usersCount = getRoleUsersCount(role.name);
  if (usersCount > 0) {
    emit(
      'toast',
      'Cannot Delete Role',
      `There are currently ${usersCount} member(s) assigned to "${role.name}". Reassign them first.`,
      'warning'
    );
    return;
  }

  if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
    const newRolesList = props.roles.filter(r => r.name !== role.name);
    emit('update:roles', newRolesList);
    emit('toast', 'Role Deleted', `"${role.name}" successfully deleted.`, 'warning');
    
    if (activeRole.value.name === role.name) {
      activeRole.value = props.roles[0];
    }
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
