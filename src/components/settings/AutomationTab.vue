<template>
  <div class="space-y-5">
    <!-- Page Header & Primary Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
      <div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Zap class="w-5 h-5 text-amber-500 fill-amber-500" />
          Automation Setting
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Automate routing, status transitions, tagging, and notifications based on CRM trigger events.
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg cursor-pointer shadow-xs transition-colors"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Automation</span>
        </button>
      </div>
    </div>

    <!-- Navigation Sub-tabs & Quick Metrics Summary -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-px">
      <div class="flex items-center gap-1">
        <button
          @click="activeSubTab = 'workflows'"
          class="px-3.5 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5"
          :class="activeSubTab === 'workflows'
            ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span>Rules ({{ filteredAutomations.length }})</span>
        </button>
        <button
          @click="activeSubTab = 'history'"
          class="px-3.5 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5"
          :class="activeSubTab === 'history'
            ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
        >
          <History class="w-3.5 h-3.5" />
          <span>Execution Logs ({{ executionLogs.length }})</span>
        </button>
      </div>

      <!-- Compact Quick Status Summary -->
      <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span class="inline-flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span><strong>{{ automations.filter(a => a.active).length }}</strong> Active</span>
        </span>
        <span class="text-slate-300 dark:text-slate-700">•</span>
        <span><strong>{{ automations.filter(a => !a.active).length }}</strong> Paused</span>
        <span class="text-slate-300 dark:text-slate-700">•</span>
        <span><strong>142</strong> Executions Today</span>
      </div>
    </div>

    <!-- ══════════════ SUB-TAB 1: AUTOMATIONS LIST ══════════════ -->
    <div v-if="activeSubTab === 'workflows'" class="space-y-3">
      
      <!-- Filter Bar: Search, Status, Sort & Tag Chips -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div class="flex flex-col sm:flex-row items-center gap-2.5">
          <!-- Search input -->
          <div class="relative flex-1 w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search automations by name, trigger, action, or tag (Press '/' to focus)..."
              class="w-full pl-9 pr-14 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all"
            />
            <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; searchInputRef?.focus()"
                class="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 flex items-center justify-center text-[10px] cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
              <kbd v-else class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded select-none">
                /
              </kbd>
            </div>
          </div>

          <!-- Status & Sort Selectors -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <select
              v-model="selectedStatus"
              class="text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-2 rounded-lg focus:outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">All Status ({{ automations.length }})</option>
              <option value="active">Active Only ({{ automations.filter(a => a.active).length }})</option>
              <option value="paused">Paused Only ({{ automations.filter(a => !a.active).length }})</option>
            </select>

            <select
              v-model="sortBy"
              class="text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-2 rounded-lg focus:outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="created_desc">Created: Newest</option>
              <option value="created_asc">Created: Oldest</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="last_run">Recently Run</option>
            </select>
          </div>
        </div>

        <!-- Tag Filter Chips -->
        <div class="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
          <span class="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Tag class="w-3 h-3 text-slate-400" />
            Tags:
          </span>
          <button
            @click="selectedTag = 'all'"
            class="px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
            :class="selectedTag === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
          >
            All ({{ automations.length }})
          </button>
          <button
            v-for="tag in availableTags"
            :key="tag.name"
            @click="selectedTag = selectedTag === tag.name ? 'all' : tag.name"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer border"
            :style="selectedTag === tag.name
              ? { backgroundColor: tag.colorBg, color: tag.colorText, borderColor: tag.colorText }
              : { backgroundColor: 'transparent', color: tag.colorText, borderColor: tag.colorText + '40' }"
          >
            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: tag.colorText }"></span>
            {{ tag.name }}
            <span class="opacity-75 text-[10px]">({{ getTagCount(tag.name) }})</span>
          </button>
        </div>
      </div>

      <!-- Automations List -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
        <div v-if="filteredAutomations.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="auto in filteredAutomations"
            :key="auto.id"
            class="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
              
              <!-- Left Content Details -->
              <div class="space-y-1.5 flex-1 min-w-0">
                <!-- Title row + status badge + mode + tags + date -->
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {{ auto.name }}
                  </h3>

                  <!-- Active/Paused pill -->
                  <span
                    class="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                    :class="auto.active
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="auto.active ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                    {{ auto.active ? 'Active' : 'Paused' }}
                  </span>

                  <!-- Mode Badge -->
                  <span
                    class="text-[10px] font-medium px-1.5 py-0.5 rounded border"
                    :class="auto.executionMode === 'manual'
                      ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300'
                      : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'"
                  >
                    {{ auto.executionMode === 'manual' ? 'Manual' : 'Automatic' }}
                  </span>

                  <!-- Tag Pills -->
                  <span
                    v-for="tag in auto.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border"
                    :style="getTagStyle(tag)"
                  >
                    {{ tag }}
                  </span>

                  <!-- Date Created -->
                  <span class="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar class="w-3 h-3 text-slate-400" />
                    <span>{{ auto.dateCreated }}</span>
                  </span>
                </div>

                <!-- Optional Description -->
                <p v-if="auto.description" class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {{ auto.description }}
                </p>

                <!-- Natural logic statement -->
                <div class="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    <span class="text-slate-400 uppercase text-[10px]">When</span>
                    <span>{{ auto.triggerEvent || 'Conversation Created' }}</span>
                  </span>

                  <template v-if="auto.conditions && auto.conditions.length > 0">
                    <span
                      v-for="(c, cIdx) in auto.conditions"
                      :key="cIdx"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-100 dark:border-blue-900/30"
                    >
                      <span class="text-blue-400 uppercase text-[10px]">{{ cIdx === 0 ? 'If' : 'And' }}</span>
                      <span>{{ c.field }} {{ c.operator }} {{ c.value }}</span>
                    </span>
                  </template>

                  <span class="text-slate-300 dark:text-slate-600 font-bold">→</span>

                  <template v-if="auto.actionSteps && auto.actionSteps.length > 0">
                    <span
                      v-for="(act, actIdx) in auto.actionSteps"
                      :key="actIdx"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-100 dark:border-emerald-900/30"
                    >
                      <span class="opacity-70 text-[10px]">Step {{ actIdx + 1 }}:</span>
                      <span>{{ act.type }}</span>
                      <span v-if="act.waitDuration" class="text-[10px] text-emerald-800 dark:text-emerald-200">
                        ({{ act.waitDuration }})
                      </span>
                    </span>
                  </template>
                  <template v-else>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                      <span>{{ auto.action }}</span>
                    </span>
                  </template>
                </div>

                <!-- Last run info -->
                <div class="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                  <span v-if="auto.lastRun">Last run {{ auto.lastRun }}</span>
                  <span v-else class="italic">Never triggered</span>
                  <span>•</span>
                  <span>{{ auto.executionCount || 0 }} runs</span>
                </div>
              </div>

              <!-- Right Actions: Run Test, Clone, Edit, Active Toggle, Delete -->
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  @click="testAutomation(auto)"
                  class="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                  title="Run Test"
                >
                  <Play class="w-3 h-3 fill-current text-slate-500" />
                  <span class="hidden sm:inline">Test</span>
                </button>

                <button
                  @click="cloneAutomation(auto)"
                  class="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200 dark:border-slate-700 font-medium text-xs"
                  title="Clone Automation"
                >
                  <Copy class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Clone</span>
                </button>

                <button
                  @click="openEditModal(auto)"
                  class="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Rule"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>

                <!-- Active Toggle Switch -->
                <button
                  @click="toggleActive(auto)"
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="auto.active ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'"
                  :title="auto.active ? 'Click to Pause' : 'Click to Activate'"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="auto.active ? 'translate-x-4' : 'translate-x-0'"
                  ></span>
                </button>

                <button
                  @click="confirmDelete(auto)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Automation"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-10 text-center space-y-2">
          <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Zap class="w-5 h-5" />
          </div>
          <div class="text-xs font-bold text-slate-800 dark:text-white">No automation rules found</div>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            {{ searchQuery || selectedTag !== 'all' || selectedStatus !== 'all'
              ? 'Try resetting your search filter.'
              : 'Create your first automation workflow.'
            }}
          </p>
          <button
            v-if="searchQuery || selectedTag !== 'all' || selectedStatus !== 'all'"
            @click="resetFilters"
            class="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

    </div>

    <!-- ══════════════ SUB-TAB 2: EXECUTION LOGS ══════════════ -->
    <div v-if="activeSubTab === 'history'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
      <div class="p-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h3 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Execution Audit Logs</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Real-time audit log of rule evaluations and triggered actions.</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative w-48 sm:w-56">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              v-model="historySearchQuery"
              type="text"
              placeholder="Filter logs..."
              class="w-full pl-8 pr-6 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <button
            v-if="executionLogs.length > 0"
            @click="executionLogs = []; $emit('toast', 'Logs Cleared', 'Execution history log wiped.', 'warning')"
            class="text-[11px] text-slate-400 hover:text-rose-600 font-medium cursor-pointer px-2 py-1"
          >
            Clear
          </button>
        </div>
      </div>

      <div v-if="filteredLogs.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="p-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-xs transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full" :class="log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-400'"></div>
            <div>
              <div class="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                {{ log.automationName }}
                <span class="text-[11px] text-slate-400">on <strong class="text-slate-600 dark:text-slate-300 font-mono">{{ log.source }}</strong></span>
              </div>
              <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Result: {{ log.actionResult }}</span>
                <span>•</span>
                <span>Duration: {{ log.duration || '12ms' }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <span class="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/40">
              {{ log.status === 'success' ? 'Passed' : 'Failed' }}
            </span>
            <span class="text-[11px] font-mono text-slate-400">{{ log.time }}</span>
          </div>
        </div>
      </div>
      <div v-else class="p-8 text-center text-slate-400 text-xs">
        {{ historySearchQuery ? 'No execution logs match your filter.' : 'No execution logs recorded yet.' }}
      </div>
    </div>

    <!-- ══════════════ MODAL: NEW / EDIT AUTOMATION WORKFLOW BUILDER ══════════════ -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto animate-fade-in"
      @click.self="showModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full mx-auto overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        
        <!-- Modal Header -->
        <header class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">
              {{ isEditing ? 'Edit Automation' : isCloning ? 'Clone Automation' : 'New Automation' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Configure trigger conditions and multi-step action execution pipelines.
            </p>
          </div>
          <button
            @click="showModal = false"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </header>

        <!-- Modal Scrollable Content Form -->
        <form @submit.prevent="saveForm" class="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          <!-- 1. Rule Name -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Rule Name
            </label>
            <input
              type="text"
              v-model="form.name"
              placeholder="Enter rule name"
              required
              class="w-full text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all"
            />
          </div>

          <!-- 2. Description (optional) -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Description (optional)
            </label>
            <input
              type="text"
              v-model="form.description"
              placeholder="Enter rule description"
              class="w-full text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all"
            />
          </div>

          <!-- 3. Category Tags Selection -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Organization Tags
            </label>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                v-for="tag in availableTags"
                :key="tag.name"
                @click="toggleTagSelection(tag.name)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors"
                :style="form.tags.includes(tag.name)
                  ? { backgroundColor: tag.colorBg, color: tag.colorText, borderColor: tag.colorText }
                  : { backgroundColor: 'transparent', color: '#64748B', borderColor: '#CBD5E1' }"
              >
                <Check v-if="form.tags.includes(tag.name)" class="w-3 h-3" />
                <span v-else class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: tag.colorText }"></span>
                {{ tag.name }}
              </button>

              <!-- Inline Add Custom Tag -->
              <div v-if="isAddingCustomTag" class="inline-flex items-center gap-1">
                <input
                  v-model="customTagInput"
                  type="text"
                  placeholder="New tag..."
                  @keydown.enter.prevent="addCustomTag"
                  class="text-xs px-2.5 py-1 border border-emerald-500 rounded-md focus:outline-none w-24 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  @click="addCustomTag"
                  class="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  @click="isAddingCustomTag = false"
                  class="text-xs text-slate-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <button
                v-else
                type="button"
                @click="isAddingCustomTag = true"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-dashed border-slate-300 text-slate-500 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 cursor-pointer"
              >
                <Plus class="w-3 h-3" /> Custom Tag
              </button>
            </div>
          </div>

          <!-- ══════ SECTION 1: WHEN SHOULD THIS RUN? ══════ -->
          <div class="space-y-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 class="font-bold text-xs text-slate-900 dark:text-white">When should this run?</h4>
                <p class="text-[11px] text-slate-400">Choose whether it runs automatically by event, or manually when an agent triggers it.</p>
              </div>
            </div>

            <!-- Execution Mode Segmented Toggle: Automatically vs Manually -->
            <div class="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                @click="form.executionMode = 'auto'"
                class="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                :class="form.executionMode === 'auto'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
              >
                <Zap class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Automatically
              </button>
              <button
                type="button"
                @click="form.executionMode = 'manual'"
                class="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                :class="form.executionMode === 'manual'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
              >
                <Sparkles class="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
                Manually
              </button>
            </div>

            <!-- Run when (Trigger Event Dropdown) -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Run when
              </label>
              <select
                v-model="form.triggerEvent"
                class="w-full text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Conversation Created">Conversation Created</option>
                <option value="Conversation Updated">Conversation Updated</option>
                <option value="Message Created">Message Created</option>
                <option value="Lead Score Changed">Lead Score Changed</option>
                <option value="Deal Stage Changed">Deal Stage Changed</option>
                <option value="Contact Created">Contact Created</option>
                <option value="Ticket Status Changed">Ticket Status Changed</option>
              </select>
            </div>

            <!-- Only if (Filter Conditions) -->
            <div class="space-y-2.5">
              <div>
                <label class="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Only if
                </label>
                <p class="text-[11px] text-slate-400">
                  All conditions below must match (AND). Leave empty to execute on all matching events.
                </p>
              </div>

              <!-- Conditions List -->
              <div class="space-y-2">
                <div
                  v-for="(cond, index) in form.conditions"
                  :key="index"
                  class="flex items-center gap-2 flex-wrap sm:flex-nowrap"
                >
                  <span class="text-xs font-medium text-slate-400 w-10 shrink-0">
                    {{ index === 0 ? 'Where' : 'And' }}
                  </span>

                  <!-- Condition Field -->
                  <select
                    v-model="cond.field"
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white flex-1 min-w-[110px]"
                  >
                    <option value="Status">Status</option>
                    <option value="Channel">Channel</option>
                    <option value="Lead Score">Lead Score</option>
                    <option value="Assigned Team">Assigned Team</option>
                    <option value="Priority">Priority</option>
                    <option value="Tag">Tag</option>
                    <option value="Unread Time">Unread Time</option>
                  </select>

                  <!-- Condition Operator -->
                  <select
                    v-model="cond.operator"
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white flex-1 min-w-[100px]"
                  >
                    <option value="Equal to">Equal to</option>
                    <option value="Not equal to">Not equal to</option>
                    <option value="Contains">Contains</option>
                    <option value="Greater than">Greater than</option>
                    <option value="Less than">Less than</option>
                    <option value="Is present">Is present</option>
                  </select>

                  <!-- Condition Value Input / Select -->
                  <input
                    v-if="cond.field === 'Lead Score' || cond.field === 'Unread Time'"
                    type="text"
                    v-model="cond.value"
                    placeholder="e.g. 80"
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white flex-1 min-w-[100px]"
                  />
                  <select
                    v-else
                    v-model="cond.value"
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white flex-1 min-w-[100px]"
                  >
                    <option value="Open">Open</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Live Chat">Live Chat</option>
                    <option value="VIP Client">VIP Client</option>
                    <option value="Partner">Partner</option>
                    <option value="High Priority">High Priority</option>
                  </select>

                  <!-- Remove Condition Button -->
                  <button
                    type="button"
                    @click="removeCondition(index)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Remove condition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- + Add a condition Button -->
              <button
                type="button"
                @click="addCondition"
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                <Plus class="w-3.5 h-3.5" /> Add condition
              </button>
            </div>

          </div>

          <!-- ══════ SECTION 2: THEN DO THIS ══════ -->
          <div class="space-y-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 class="font-bold text-xs text-slate-900 dark:text-white">Then do this</h4>
                <p class="text-[11px] text-slate-400">Actions execute in sequence from top to bottom.</p>
              </div>
            </div>

            <!-- Steps List -->
            <div class="space-y-2.5">
              <div
                v-for="(step, stepIndex) in form.actionSteps"
                :key="stepIndex"
                class="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/20 space-y-2.5"
              >
                <div class="flex items-center justify-between gap-2.5">
                  <div class="flex items-center gap-2 flex-1">
                    <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {{ stepIndex + 1 }}
                    </span>

                    <select
                      v-model="step.type"
                      class="text-xs font-semibold bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-900 dark:text-white flex-1"
                    >
                      <option value="Send a Message">Send a Message</option>
                      <option value="Assign to Team">Assign to Team</option>
                      <option value="Assign to User">Assign to User</option>
                      <option value="Apply Tag">Apply Tag</option>
                      <option value="Remove Tag">Remove Tag</option>
                      <option value="Update Stage">Update Pipeline Stage</option>
                      <option value="Send Email Template">Send Email Template</option>
                      <option value="Send WhatsApp Template">Send WhatsApp Template</option>
                      <option value="Set Urgency Level">Set Urgency Level</option>
                    </select>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      @click="toggleStepWait(step)"
                      class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer border"
                      :class="step.waitDuration
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'"
                      title="Set wait delay"
                    >
                      <Clock class="w-3 h-3" />
                      <span>{{ step.waitDuration ? `${step.waitDuration}` : 'Wait' }}</span>
                    </button>

                    <button
                      type="button"
                      @click="removeStep(stepIndex)"
                      class="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Delete step"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Payload Area -->
                <div>
                  <div v-if="step.type === 'Send a Message'" class="space-y-1.5">
                    <textarea
                      v-model="step.payload"
                      rows="2"
                      placeholder="Enter message template..."
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400 resize-y"
                    ></textarea>
                    <div class="flex items-center gap-1 text-[10px] text-slate-400 flex-wrap">
                      <span>Insert:</span>
                      <button type="button" @click="step.payload += ' {{contact.name}}'" class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer">&#123;&#123;contact.name&#125;&#125;</button>
                      <button type="button" @click="step.payload += ' {{company.name}}'" class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer">&#123;&#123;company.name&#125;&#125;</button>
                    </div>
                  </div>

                  <div v-else-if="step.type === 'Assign to User'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Sarah (Senior Sales Rep)">Sarah (Senior Sales Rep)</option>
                      <option value="Justin (Admin)">Justin (Admin)</option>
                      <option value="David (Sales Rep)">David (Sales Rep)</option>
                      <option value="Emma (Junior Rep)">Emma (Junior Rep)</option>
                    </select>
                  </div>

                  <div v-else-if="step.type === 'Assign to Team'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Sales Team">Sales Team</option>
                      <option value="Support Team">Support Team</option>
                      <option value="Enterprise Team">Enterprise Team</option>
                    </select>
                  </div>

                  <div v-else-if="step.type === 'Apply Tag' || step.type === 'Remove Tag'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Partner">Partner Tag</option>
                      <option value="Hot Lead">Hot Lead Tag</option>
                      <option value="VIP Client">VIP Client Tag</option>
                      <option value="High Priority">High Priority Tag</option>
                    </select>
                  </div>

                  <div v-else-if="step.type === 'Update Stage'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Qualified">Qualified</option>
                      <option value="Demo Scheduled">Demo Scheduled</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed Won">Closed Won</option>
                    </select>
                  </div>

                  <div v-else>
                    <input
                      type="text"
                      v-model="step.target"
                      placeholder="Target parameter..."
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- + Add a step Button -->
            <button
              type="button"
              @click="addStep"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5" /> Add step
            </button>

          </div>

          <!-- ══════ SECTION 3: FALLBACK / ESCALATION ══════ -->
          <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/40 dark:bg-slate-800/20 space-y-2.5">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-xs text-slate-900 dark:text-white">If it doesn't work, do something else</h4>
                <p class="text-[11px] text-slate-400">Optional fallback reminder or escalation branch</p>
              </div>

              <!-- Fallback Toggle -->
              <button
                type="button"
                @click="form.hasFallback = !form.hasFallback"
                class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="form.hasFallback ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'"
              >
                <span
                  class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="form.hasFallback ? 'translate-x-4' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Fallback Branch -->
            <div v-if="form.hasFallback" class="pt-2.5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs animate-fade-in">
              <div>
                <label class="block text-[10px] font-semibold text-slate-400 uppercase mb-1">If no response after</label>
                <select
                  v-model="form.fallbackWait"
                  class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                >
                  <option value="15 minutes">15 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="24 hours">24 hours</option>
                  <option value="3 days">3 days</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Then execute</label>
                <select
                  v-model="form.fallbackAction"
                  class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                >
                  <option value="Escalate to Senior Rep">Escalate to Senior Rep</option>
                  <option value="Send Notification to Admin">Send Notification to Admin</option>
                  <option value="Apply Tag [Follow-up Required]">Apply Tag [Follow-up Required]</option>
                </select>
              </div>
            </div>
          </div>

        </form>

        <!-- Sticky Modal Footer -->
        <footer class="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="form.active = !form.active"
              class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="form.active ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="form.active ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
            <span class="text-xs font-semibold" :class="form.active ? 'text-slate-800 dark:text-white' : 'text-slate-400'">
              {{ form.active ? 'Active' : 'Paused' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="showModal = false"
              class="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="saveForm"
              :disabled="!form.name.trim()"
              class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-2xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {{ isEditing ? 'Save Changes' : isCloning ? 'Clone Automation' : 'Save Automation' }}
            </button>
          </div>
        </footer>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Zap, Plus, Search, Tag, Calendar, Play, Copy, Pencil, Trash2,
  Clock, Check, X, SlidersHorizontal, History, Sparkles
} from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'toast', title: string, message: string, type?: 'success' | 'warning'): void;
}>();

// Available Category Tags
export interface AutomationTag {
  name: string;
  colorBg: string;
  colorText: string;
}

const availableTags = ref<AutomationTag[]>([
  { name: 'Lead Routing', colorBg: '#EFF6FF', colorText: '#1D4ED8' },
  { name: 'Escalations', colorBg: '#FEF2F2', colorText: '#DC2626' },
  { name: 'VIP Clients', colorBg: '#FAF5FF', colorText: '#7E22CE' },
  { name: 'SLA Alert', colorBg: '#FFFBEB', colorText: '#D97706' },
  { name: 'Deals', colorBg: '#ECFDF5', colorText: '#059669' },
  { name: 'WhatsApp', colorBg: '#F0FDF4', colorText: '#15803D' },
]);

export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export interface ActionStep {
  type: string;
  target?: string;
  payload?: string;
  waitDuration?: string;
}

export interface AutomationRule {
  id: number;
  name: string;
  description?: string;
  executionMode?: 'auto' | 'manual';
  triggerEvent?: string;
  trigger?: string;
  action?: string;
  conditions?: FilterCondition[];
  actionSteps?: ActionStep[];
  hasFallback?: boolean;
  fallbackWait?: string;
  fallbackAction?: string;
  tags: string[];
  dateCreated: string;
  active: boolean;
  lastRun?: string;
  executionCount?: number;
}

export interface ExecutionLog {
  id: number;
  automationName: string;
  source: string;
  actionResult: string;
  time: string;
  status: 'success' | 'failed';
  duration?: string;
}

// Initial automations
const automations = ref<AutomationRule[]>([
  {
    id: 1,
    name: 'Route hot leads to Sarah',
    description: 'Auto-routes enterprise leads with score > 80 directly to Senior Sales Director',
    executionMode: 'auto',
    triggerEvent: 'Conversation Created',
    trigger: 'Lead Score > 80',
    action: 'Assign to User [Sarah (Senior Sales Rep)]',
    conditions: [
      { field: 'Lead Score', operator: 'Greater than', value: '80' },
      { field: 'Status', operator: 'Equal to', value: 'Open' },
    ],
    actionSteps: [
      { type: 'Assign to User', target: 'Sarah (Senior Sales Rep)' },
      { type: 'Apply Tag', target: 'VIP Client' },
    ],
    hasFallback: true,
    fallbackWait: '24 hours',
    fallbackAction: 'Escalate to Senior Rep',
    tags: ['Lead Routing', 'Deals'],
    dateCreated: '12 Jan 2026',
    active: true,
    lastRun: '2 mins ago',
    executionCount: 58,
  },
  {
    id: 2,
    name: 'Apply Partner label on domain match',
    description: 'Auto-tags enterprise accounts based on recognized email domain',
    executionMode: 'auto',
    triggerEvent: 'Contact Created',
    trigger: 'Email Domain = *.enterprise.com',
    action: 'Apply Tag [Partner]',
    conditions: [
      { field: 'Tag', operator: 'Equal to', value: 'VIP Client' },
    ],
    actionSteps: [
      { type: 'Apply Tag', target: 'Partner' },
    ],
    tags: ['VIP Clients', 'Deals'],
    dateCreated: '18 Jan 2026',
    active: false,
    lastRun: '3 days ago',
    executionCount: 14,
  },
  {
    id: 3,
    name: 'Escalate unread conversation after 24h',
    description: 'Sends alert to Admin team if ticket remains unread past SLA threshold',
    executionMode: 'auto',
    triggerEvent: 'Conversation Updated',
    trigger: 'Unread Duration > 24h',
    action: 'Send Notification [Justin (Admin)]',
    conditions: [
      { field: 'Unread Time', operator: 'Greater than', value: '24' },
      { field: 'Status', operator: 'Equal to', value: 'Pending' },
    ],
    actionSteps: [
      { type: 'Set Urgency Level', target: 'Urgent' },
      { type: 'Assign to User', target: 'Justin (Admin)', waitDuration: '1 hour' },
    ],
    tags: ['Escalations', 'SLA Alert'],
    dateCreated: '02 Feb 2026',
    active: true,
    lastRun: '5 hrs ago',
    executionCount: 89,
  },
  {
    id: 4,
    name: 'Auto-assign inbound WhatsApp chats',
    description: 'Routes WhatsApp chat inquiries to the active sales team round-robin',
    executionMode: 'auto',
    triggerEvent: 'Message Created',
    trigger: 'Channel Source = WhatsApp',
    action: 'Assign to Team [Sales Team]',
    conditions: [
      { field: 'Channel', operator: 'Equal to', value: 'WhatsApp' },
    ],
    actionSteps: [
      { type: 'Assign to Team', target: 'Sales Team' },
      { type: 'Send a Message', payload: 'Hello {{contact.name}}, thanks for reaching out!' },
    ],
    tags: ['WhatsApp', 'Lead Routing'],
    dateCreated: '14 Feb 2026',
    active: true,
    lastRun: '12 mins ago',
    executionCount: 210,
  },
  {
    id: 5,
    name: 'VIP High Urgency Ticket Triage',
    description: 'Manual macro button to trigger instant VIP ticket triage and escalation',
    executionMode: 'manual',
    triggerEvent: 'Conversation Updated',
    trigger: 'Tag Applied = VIP Client',
    action: 'Set Urgency Level [High Urgency (Urgent)]',
    conditions: [
      { field: 'Priority', operator: 'Equal to', value: 'High Priority' },
    ],
    actionSteps: [
      { type: 'Set Urgency Level', target: 'High Urgency (Urgent)' },
      { type: 'Assign to Team', target: 'Enterprise Team' },
    ],
    tags: ['VIP Clients', 'Escalations'],
    dateCreated: '19 Feb 2026',
    active: true,
    lastRun: '1 hr ago',
    executionCount: 32,
  },
]);

// Initial execution audit logs
const executionLogs = ref<ExecutionLog[]>([
  { id: 1, automationName: 'Route hot leads to Sarah', source: 'Deal #4821 (Acme Global)', actionResult: 'Assigned to Sarah', time: '2m ago', status: 'success', duration: '14ms' },
  { id: 2, automationName: 'Auto-assign inbound WhatsApp chats', source: 'WhatsApp +60 12-882 1993', actionResult: 'Routed to Sales Team', time: '12m ago', status: 'success', duration: '9ms' },
  { id: 3, automationName: 'VIP High Urgency Ticket Triage', source: 'Lead: Global Horizon LLC', actionResult: 'Urgency set to High', time: '1h ago', status: 'success', duration: '18ms' },
  { id: 4, automationName: 'Escalate unread conversation after 24h', source: 'Conversation #2201', actionResult: 'Notification delivered to Justin', time: '5h ago', status: 'success', duration: '22ms' },
  { id: 5, automationName: 'Route hot leads to Sarah', source: 'Deal #4799 (TechFlow Inc)', actionResult: 'Assigned to Sarah', time: 'Yesterday', status: 'success', duration: '11ms' },
]);

// Sub-tab navigation
const activeSubTab = ref<'workflows' | 'history'>('workflows');

// Filters and Search state
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const historySearchQuery = ref('');
const selectedTag = ref('all');
const selectedStatus = ref('all');
const sortBy = ref('created_desc');

// Quick keyboard shortcut "/" to focus search
function handleKeydown(e: KeyboardEvent) {
  if (
    e.key === '/' &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
  ) {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// Filtered Automations computed
const filteredAutomations = computed(() => {
  let list = [...automations.value];

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q)) ||
      (a.trigger && a.trigger.toLowerCase().includes(q)) ||
      (a.action && a.action.toLowerCase().includes(q)) ||
      (a.triggerEvent && a.triggerEvent.toLowerCase().includes(q)) ||
      (a.conditions && a.conditions.some(c => c.field.toLowerCase().includes(q) || c.value.toLowerCase().includes(q))) ||
      (a.actionSteps && a.actionSteps.some(s => s.type.toLowerCase().includes(q) || (s.target && s.target.toLowerCase().includes(q)))) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Tag filter
  if (selectedTag.value !== 'all') {
    list = list.filter(a => a.tags.includes(selectedTag.value));
  }

  // Status filter
  if (selectedStatus.value === 'active') {
    list = list.filter(a => a.active);
  } else if (selectedStatus.value === 'paused') {
    list = list.filter(a => !a.active);
  }

  // Sort
  if (sortBy.value === 'created_desc') {
    list.sort((a, b) => b.id - a.id);
  } else if (sortBy.value === 'created_asc') {
    list.sort((a, b) => a.id - b.id);
  } else if (sortBy.value === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'last_run') {
    list.sort((a, b) => (b.executionCount || 0) - (a.executionCount || 0));
  }

  return list;
});

// Filtered Execution Logs computed
const filteredLogs = computed(() => {
  if (!historySearchQuery.value.trim()) return executionLogs.value;
  const q = historySearchQuery.value.toLowerCase().trim();
  return executionLogs.value.filter(log =>
    log.automationName.toLowerCase().includes(q) ||
    log.source.toLowerCase().includes(q) ||
    log.actionResult.toLowerCase().includes(q)
  );
});

function getTagCount(tagName: string): number {
  return automations.value.filter(a => a.tags.includes(tagName)).length;
}

function getTagStyle(tagName: string) {
  const tag = availableTags.value.find(t => t.name === tagName);
  if (tag) {
    return {
      backgroundColor: tag.colorBg,
      color: tag.colorText,
      borderColor: tag.colorText + '30',
    };
  }
  return {
    backgroundColor: '#F8FAFC',
    color: '#475569',
    borderColor: '#E2E8F0',
  };
}

function resetFilters() {
  searchQuery.value = '';
  selectedTag.value = 'all';
  selectedStatus.value = 'all';
  sortBy.value = 'created_desc';
}

// ═══════════════════ MODAL & FORM STATE ═══════════════════
const showModal = ref(false);
const isEditing = ref(false);
const isCloning = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  name: '',
  description: '',
  executionMode: 'auto' as 'auto' | 'manual',
  triggerEvent: 'Conversation Created',
  tags: [] as string[],
  conditions: [
    { field: 'Status', operator: 'Equal to', value: 'Open' }
  ] as FilterCondition[],
  actionSteps: [
    { type: 'Send a Message', payload: '', target: '', waitDuration: '' }
  ] as ActionStep[],
  hasFallback: false,
  fallbackWait: '24 hours',
  fallbackAction: 'Escalate to Senior Rep',
  active: true,
});

const isAddingCustomTag = ref(false);
const customTagInput = ref('');

function toggleTagSelection(tagName: string) {
  const idx = form.value.tags.indexOf(tagName);
  if (idx > -1) {
    form.value.tags.splice(idx, 1);
  } else {
    form.value.tags.push(tagName);
  }
}

function addCustomTag() {
  const name = customTagInput.value.trim();
  if (!name) {
    isAddingCustomTag.value = false;
    return;
  }
  if (!availableTags.value.some(t => t.name.toLowerCase() === name.toLowerCase())) {
    const defaultColors = [
      { bg: '#EFF6FF', text: '#1D4ED8' },
      { bg: '#FDF2F8', text: '#BE185D' },
      { bg: '#FAF5FF', text: '#7E22CE' },
      { bg: '#FFFBEB', text: '#B45309' },
    ];
    const picked = defaultColors[availableTags.value.length % defaultColors.length];
    availableTags.value.push({
      name,
      colorBg: picked.bg,
      colorText: picked.text,
    });
  }
  if (!form.value.tags.includes(name)) {
    form.value.tags.push(name);
  }
  customTagInput.value = '';
  isAddingCustomTag.value = false;
}

function addCondition() {
  form.value.conditions.push({
    field: 'Status',
    operator: 'Equal to',
    value: 'Open',
  });
}

function removeCondition(index: number) {
  form.value.conditions.splice(index, 1);
}

function addStep() {
  form.value.actionSteps.push({
    type: 'Assign to User',
    target: 'Sarah (Senior Sales Rep)',
    payload: '',
    waitDuration: '',
  });
}

function removeStep(index: number) {
  form.value.actionSteps.splice(index, 1);
}

function toggleStepWait(step: ActionStep) {
  if (step.waitDuration) {
    step.waitDuration = '';
  } else {
    step.waitDuration = '15 mins';
  }
}

function openCreateModal() {
  isEditing.value = false;
  isCloning.value = false;
  editingId.value = null;
  form.value = {
    name: '',
    description: '',
    executionMode: 'auto',
    triggerEvent: 'Conversation Created',
    tags: ['Lead Routing'],
    conditions: [
      { field: 'Status', operator: 'Equal to', value: 'Open' }
    ],
    actionSteps: [
      { type: 'Send a Message', payload: 'Hello {{contact.name}}, thanks for reaching out to us!', target: '', waitDuration: '' }
    ],
    hasFallback: false,
    fallbackWait: '24 hours',
    fallbackAction: 'Escalate to Senior Rep',
    active: true,
  };
  showModal.value = true;
}

function openEditModal(auto: AutomationRule) {
  isEditing.value = true;
  isCloning.value = false;
  editingId.value = auto.id;
  
  form.value = {
    name: auto.name,
    description: auto.description || '',
    executionMode: auto.executionMode || 'auto',
    triggerEvent: auto.triggerEvent || 'Conversation Created',
    tags: [...auto.tags],
    conditions: auto.conditions && auto.conditions.length > 0
      ? JSON.parse(JSON.stringify(auto.conditions))
      : [{ field: 'Status', operator: 'Equal to', value: 'Open' }],
    actionSteps: auto.actionSteps && auto.actionSteps.length > 0
      ? JSON.parse(JSON.stringify(auto.actionSteps))
      : [{ type: 'Assign to User', target: 'Sarah (Senior Sales Rep)', payload: '', waitDuration: '' }],
    hasFallback: !!auto.hasFallback,
    fallbackWait: auto.fallbackWait || '24 hours',
    fallbackAction: auto.fallbackAction || 'Escalate to Senior Rep',
    active: auto.active,
  };
  showModal.value = true;
}

function cloneAutomation(auto: AutomationRule) {
  const newId = Date.now();
  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  
  const cloned: AutomationRule = {
    id: newId,
    name: `${auto.name} (Copy)`,
    description: auto.description ? `${auto.description} (Cloned)` : undefined,
    executionMode: auto.executionMode || 'auto',
    triggerEvent: auto.triggerEvent || 'Conversation Created',
    trigger: auto.trigger,
    action: auto.action,
    conditions: auto.conditions ? JSON.parse(JSON.stringify(auto.conditions)) : undefined,
    actionSteps: auto.actionSteps ? JSON.parse(JSON.stringify(auto.actionSteps)) : undefined,
    hasFallback: auto.hasFallback,
    fallbackWait: auto.fallbackWait,
    fallbackAction: auto.fallbackAction,
    tags: [...auto.tags],
    dateCreated: currentDate,
    active: false,
    lastRun: undefined,
    executionCount: 0,
  };

  automations.value.unshift(cloned);
  emit('toast', 'Automation Cloned', `Created duplicate "${cloned.name}".`, 'success');
}

function saveForm() {
  if (!form.value.name.trim()) return;

  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const primaryActionSummary = form.value.actionSteps.length > 0
    ? `${form.value.actionSteps[0].type} [${form.value.actionSteps[0].target || 'Custom payload'}]`
    : 'Custom execution';

  if (isEditing.value && editingId.value) {
    const item = automations.value.find(a => a.id === editingId.value);
    if (item) {
      item.name = form.value.name;
      item.description = form.value.description;
      item.executionMode = form.value.executionMode;
      item.triggerEvent = form.value.triggerEvent;
      item.conditions = JSON.parse(JSON.stringify(form.value.conditions));
      item.actionSteps = JSON.parse(JSON.stringify(form.value.actionSteps));
      item.action = primaryActionSummary;
      item.hasFallback = form.value.hasFallback;
      item.fallbackWait = form.value.fallbackWait;
      item.fallbackAction = form.value.fallbackAction;
      item.tags = [...form.value.tags];
      item.active = form.value.active;
      emit('toast', 'Automation Updated', `Saved changes to "${item.name}".`, 'success');
    }
  } else {
    const newAuto: AutomationRule = {
      id: Date.now(),
      name: form.value.name,
      description: form.value.description,
      executionMode: form.value.executionMode,
      triggerEvent: form.value.triggerEvent,
      conditions: JSON.parse(JSON.stringify(form.value.conditions)),
      actionSteps: JSON.parse(JSON.stringify(form.value.actionSteps)),
      action: primaryActionSummary,
      hasFallback: form.value.hasFallback,
      fallbackWait: form.value.fallbackWait,
      fallbackAction: form.value.fallbackAction,
      tags: form.value.tags.length > 0 ? [...form.value.tags] : ['Lead Routing'],
      dateCreated: currentDate,
      active: form.value.active,
      executionCount: 0,
    };
    automations.value.unshift(newAuto);
    emit('toast', 'Automation Created', `"${newAuto.name}" is now configured.`, 'success');
  }

  showModal.value = false;
}

function toggleActive(auto: AutomationRule) {
  auto.active = !auto.active;
  emit(
    'toast',
    auto.active ? 'Automation Activated' : 'Automation Paused',
    `"${auto.name}" is now ${auto.active ? 'active and listening' : 'paused'}.`,
    'success'
  );
}

function confirmDelete(auto: AutomationRule) {
  automations.value = automations.value.filter(a => a.id !== auto.id);
  emit('toast', 'Automation Deleted', `Removed "${auto.name}".`, 'warning');
}

function testAutomation(auto: AutomationRule) {
  auto.lastRun = 'Just now';
  auto.executionCount = (auto.executionCount || 0) + 1;
  
  const stepSummary = auto.actionSteps && auto.actionSteps.length > 0
    ? auto.actionSteps.map(s => s.type).join(' → ')
    : auto.action || 'Executed';

  executionLogs.value.unshift({
    id: Date.now(),
    automationName: auto.name,
    source: 'Manual Test Execution',
    actionResult: stepSummary,
    time: 'Just now',
    status: 'success',
    duration: '8ms',
  });

  emit('toast', 'Test Run Successful', `Executed "${auto.name}" with status OK.`, 'success');
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
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
