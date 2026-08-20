<template>
  <div class="space-y-4">
    <!-- Page Header & Primary Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
      <div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Automations
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Automate routing, assignments, tagging, and notifications based on CRM events.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg cursor-pointer shadow-2xs transition-colors"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Automation</span>
        </button>
      </div>
    </div>

    <!-- Navigation Sub-tabs & Clean Status Metrics -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
      <div class="flex items-center gap-1">
        <button
          @click="activeSubTab = 'workflows'"
          class="px-3 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
          :class="activeSubTab === 'workflows'
            ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
        >
          Rules ({{ filteredAutomations.length }})
        </button>
        <button
          @click="activeSubTab = 'history'"
          class="px-3 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
          :class="activeSubTab === 'history'
            ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
        >
          Execution Logs ({{ executionLogs.length }})
        </button>
      </div>

      <!-- Muted Summary Numbers -->
      <div class="flex items-center gap-2.5 text-xs text-slate-400 pb-1">
        <span><strong>{{ automations.filter(a => a.active).length }}</strong> active</span>
        <span>•</span>
        <span><strong>{{ automations.filter(a => !a.active).length }}</strong> paused</span>
        <span>•</span>
        <span><strong>142</strong> runs today</span>
      </div>
    </div>

    <!-- ══════════════ SUB-TAB 1: AUTOMATIONS LIST ══════════════ -->
    <div v-if="activeSubTab === 'workflows'" class="space-y-3">
      
      <!-- Minimal Filter Bar: Search, Status, Sort & Tag Filter Pills -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <!-- Search input -->
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search automations by name, condition, or tag (Press '/' to focus)..."
            class="w-full pl-8 pr-10 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400"
          />
          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; searchInputRef?.focus()"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
            >
              ✕
            </button>
            <kbd v-else class="hidden sm:inline-flex items-center px-1 text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded select-none">
              /
            </kbd>
          </div>
        </div>

        <!-- Tag Filters & Status Dropdown -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Tag Filter Pills (Muted Monochrome) -->
          <div class="flex items-center gap-1">
            <button
              @click="selectedTag = 'all'"
              class="px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
              :class="selectedTag === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'"
            >
              All
            </button>
            <button
              v-for="tag in availableTags"
              :key="tag.name"
              @click="selectedTag = selectedTag === tag.name ? 'all' : tag.name"
              class="px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
              :class="selectedTag === tag.name
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'"
            >
              {{ tag.name }}
            </button>
          </div>

          <div class="h-4 w-px bg-slate-200 dark:border-slate-800 hidden sm:block"></div>

          <!-- Status & Mode Filter Dropdown -->
          <select
            v-model="selectedStatus"
            class="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg focus:outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">All Rules</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
            <option value="auto">Automations (Events)</option>
            <option value="manual">Macros (Manual)</option>
          </select>
        </div>
      </div>

      <!-- Automations List Container -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
        <div v-if="filteredAutomations.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="auto in filteredAutomations"
            :key="auto.id"
            class="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group relative"
          >
            <div class="flex items-start justify-between gap-4">
              
              <!-- Left: Title, Clean Natural Logic String, Metadata -->
              <div class="space-y-1 flex-1 min-w-0">
                <!-- Title Row: Name, Macro badge (if manual), Neutral Tag Pills -->
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-semibold text-sm text-slate-900 dark:text-white truncate tracking-tight">
                    {{ auto.name }}
                  </h3>

                  <!-- Manual Macro Badge (Only shown if manual mode) -->
                  <span
                    v-if="auto.executionMode === 'manual'"
                    class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50"
                  >
                    Macro
                  </span>

                  <!-- Neutral Monochrome Tag Pills -->
                  <span
                    v-for="tag in auto.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: getTagDotColor(tag) }"></span>
                    {{ tag }}
                  </span>
                </div>

                <!-- Clean Single-Line Natural Logic Summary -->
                <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                  {{ formatRuleSentence(auto) }}
                </p>

                <!-- Clean Footer Metadata -->
                <div class="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                  <span>Created {{ auto.dateCreated }}</span>
                  <span>•</span>
                  <span>{{ auto.executionCount || 0 }} runs</span>
                  <span v-if="auto.lastRun">• Last run {{ auto.lastRun }}</span>
                </div>
              </div>

              <!-- Right: Hover-Revealed Actions & Always-Visible Active Switch -->
              <div class="flex items-center gap-1.5 shrink-0 self-center">
                <!-- Secondary Actions (Revealed on Hover) -->
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    @click="testAutomation(auto)"
                    class="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Test Run"
                  >
                    <Play class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="cloneAutomation(auto)"
                    class="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Clone Rule"
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="openEditModal(auto)"
                    class="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Edit Rule"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="confirmDelete(auto)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
                    title="Delete Rule"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>

                <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5"></div>

                <!-- Always-Visible Active Toggle Switch -->
                <div class="flex items-center gap-1.5 pl-1">
                  <button
                    @click="toggleActive(auto)"
                    class="relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="auto.active ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'"
                    :title="auto.active ? 'Active (Click to Pause)' : 'Paused (Click to Activate)'"
                  >
                    <span
                      class="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="auto.active ? 'translate-x-3' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center space-y-2">
          <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">No matching automations</div>
          <p class="text-xs text-slate-400">
            {{ searchQuery || selectedTag !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search filter.'
              : 'Create your first automation rule.'
            }}
          </p>
        </div>
      </div>

    </div>

    <!-- ══════════════ SUB-TAB 2: EXECUTION LOGS ══════════════ -->
    <div v-if="activeSubTab === 'history'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
      <div class="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h3 class="font-semibold text-slate-900 dark:text-white text-xs">Execution Audit Trail</h3>
          <p class="text-[11px] text-slate-400">Log of evaluated events and executed actions.</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative w-44">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              v-model="historySearchQuery"
              type="text"
              placeholder="Filter..."
              class="w-full pl-8 pr-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <button
            v-if="executionLogs.length > 0"
            @click="executionLogs = []; $emit('toast', 'Logs Cleared', 'History wiped.', 'warning')"
            class="text-[11px] text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <div v-if="filteredLogs.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="p-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-xs transition-colors"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-1.5 h-1.5 rounded-full" :class="log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-400'"></div>
            <div>
              <div class="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {{ log.automationName }}
                <span class="text-xs font-normal text-slate-400">on <span class="font-mono text-slate-600 dark:text-slate-300">{{ log.source }}</span></span>
              </div>
              <div class="text-xs text-slate-400 mt-0.5">
                <span>Result: {{ log.actionResult }}</span>
                <span class="mx-1">•</span>
                <span>{{ log.duration || '12ms' }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-400 font-mono">{{ log.time }}</span>
          </div>
        </div>
      </div>
      <div v-else class="p-8 text-center text-slate-400 text-xs">
        {{ historySearchQuery ? 'No matching logs.' : 'No execution history recorded yet.' }}
      </div>
    </div>

    <!-- ══════════════ MODAL: NEW / EDIT AUTOMATION WORKFLOW BUILDER ══════════════ -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto animate-fade-in"
      @click.self="showModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-xl w-full mx-auto overflow-hidden animate-scale-up flex flex-col max-h-[88vh]">
        
        <!-- Modal Header -->
        <header class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">
              {{ isEditing ? 'Edit Automation' : isCloning ? 'Clone Automation' : 'New Automation' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Merges what used to be separate Macros and Automations into one rule
            </p>
          </div>
          <button
            @click="showModal = false"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </header>

        <!-- Modal Form -->
        <form @submit.prevent="saveForm" class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          
          <!-- 1. Rule Name -->
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Rule Name
            </label>
            <input
              type="text"
              v-model="form.name"
              placeholder="Enter rule name"
              required
              class="w-full text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <!-- 2. Description (optional) -->
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description (optional)
            </label>
            <input
              type="text"
              v-model="form.description"
              placeholder="Enter rule description"
              class="w-full text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <!-- ══════ SECTION 1: WHEN SHOULD THIS RUN? ══════ -->
          <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 class="font-bold text-xs text-slate-900 dark:text-white">When should this run?</h4>
                <p class="text-[11px] text-slate-400">Choose whether it runs by itself, or only when an agent clicks it</p>
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
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'"
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
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'"
              >
                <Sparkles class="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
                Manually
              </button>
            </div>

            <!-- When in Manually mode: Show Macro helper callout banner (Matching screenshot) -->
            <div
              v-if="form.executionMode === 'manual'"
              class="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 animate-fade-in leading-relaxed"
            >
              This becomes a button agents can click from inside a conversation — the same as today's Macros. No event or conditions needed.
            </div>

            <!-- When in Automatically mode: Show Run when & Only if condition engine -->
            <template v-else>
              <!-- Run when (Trigger Event Dropdown) -->
              <div class="space-y-1 animate-fade-in">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Run when
                </label>
                <select
                  v-model="form.triggerEvent"
                  class="w-full text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white cursor-pointer"
                >
                  <option v-for="trig in triggerOptions" :key="trig" :value="trig">{{ trig }}</option>
                </select>
              </div>

              <!-- Only if (Filter Conditions) -->
              <div class="space-y-2.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Only if
                  </label>
                  <p class="text-[11px] text-slate-400">
                    All conditions below must be true (AND). Leave this empty to run for every conversation that matches the event above.
                  </p>
                </div>

                <!-- Conditions List -->
                <div class="space-y-2">
                  <div
                    v-for="(cond, index) in form.conditions"
                    :key="index"
                    class="flex items-center gap-1.5 flex-wrap sm:flex-nowrap"
                  >
                    <span class="text-xs text-slate-400 w-10 shrink-0">
                      {{ index === 0 ? 'Where' : 'And' }}
                    </span>

                    <!-- Condition Field -->
                    <select
                      v-model="cond.field"
                      class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white flex-1 min-w-[120px]"
                    >
                      <option v-for="f in conditionFieldOptions" :key="f" :value="f">{{ f }}</option>
                    </select>

                    <!-- Condition Operator -->
                    <select
                      v-model="cond.operator"
                      class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white flex-1 min-w-[100px]"
                    >
                      <option value="Equal to">Equal to</option>
                    <option value="Not equal to">Not equal to</option>
                    <option value="Contains">Contains</option>
                    <option value="Greater than">Greater than</option>
                    <option value="Less than">Less than</option>
                    <option value="Is present">Is present</option>
                    <option value="Is not present">Is not present</option>
                  </select>

                  <!-- Condition Value Input / Select -->
                  <input
                    v-if="['Email Subject', 'Country', 'Phone Number', 'Referrer Link', 'Email', 'Hp 2'].includes(cond.field)"
                    type="text"
                    v-model="cond.value"
                    placeholder="Enter value..."
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white flex-1 min-w-[110px]"
                  />
                  <select
                    v-else-if="cond.field === 'Status'"
                    v-model="cond.value"
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white flex-1 min-w-[110px]"
                  >
                    <option value="Open">Open</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Snoozed">Snoozed</option>
                  </select>
                  <select
                    v-else-if="cond.field === 'Priority'"
                    v-model="cond.value"
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white flex-1 min-w-[110px]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <select
                    v-else-if="cond.field === 'Inbox'"
                    v-model="cond.value"
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white flex-1 min-w-[110px]"
                  >
                    <option value="WhatsApp Support">WhatsApp Support</option>
                    <option value="General Sales">General Sales</option>
                    <option value="Live Chat">Live Chat</option>
                    <option value="Email Helpdesk">Email Helpdesk</option>
                  </select>
                  <input
                    v-else
                    type="text"
                    v-model="cond.value"
                    placeholder="Select or enter value..."
                    class="text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white flex-1 min-w-[110px]"
                  />

                  <!-- Remove Condition Button -->
                  <button
                    type="button"
                    @click="removeCondition(index)"
                    class="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
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
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                <Plus class="w-3.5 h-3.5" /> Add a condition
              </button>
            </div>
          </template>

        </div>

          <!-- ══════ SECTION 2: THEN DO THIS ══════ -->
          <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            
            <div class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 class="font-bold text-xs text-slate-900 dark:text-white">Then do this</h4>
                <p class="text-[11px] text-slate-400">Steps run in order, top to bottom. Click the clock on any step to add a wait before it runs.</p>
              </div>
            </div>

            <!-- Steps List -->
            <div class="space-y-3">
              <div
                v-for="(step, stepIndex) in form.actionSteps"
                :key="stepIndex"
                class="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/20 space-y-2.5"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {{ stepIndex + 1 }}
                    </span>

                    <!-- Action Selector with all 17 actions -->
                    <select
                      v-model="step.type"
                      class="text-xs font-semibold bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-900 dark:text-white flex-1"
                    >
                      <option v-for="act in actionTypeOptions" :key="act" :value="act">{{ act }}</option>
                    </select>
                  </div>

                  <!-- Step Actions: Wait Badge / Add Wait & Delete Step -->
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      @click="step.wait.isEditing = !step.wait.isEditing"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border"
                      :class="step.wait.enabled
                        ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'"
                    >
                      <Clock class="w-3.5 h-3.5" />
                      <span>{{ step.wait.enabled ? `${step.wait.value} ${step.wait.unit}` : 'Add wait' }}</span>
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

                <!-- Step Dynamic Payload Details -->
                <div>
                  <!-- 1. Send a Message / Send AI Message / Private Note -->
                  <div v-if="['Send a Message', 'Send AI Personalized Message', 'Add a Private Note'].includes(step.type)" class="space-y-1.5">
                    <textarea
                      v-model="step.payload"
                      rows="3"
                      :placeholder="step.type === 'Add a Private Note' ? 'Enter private internal note...' : 'Enter your message here'"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400 resize-y"
                    ></textarea>
                    <div class="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>Insert:</span>
                      <button type="button" @click="step.payload += ' {{contact.name}}'" class="underline hover:text-slate-600 cursor-pointer">&#123;&#123;contact.name&#125;&#125;</button>
                      <button type="button" @click="step.payload += ' {{company.name}}'" class="underline hover:text-slate-600 cursor-pointer">&#123;&#123;company.name&#125;&#125;</button>
                    </div>
                  </div>

                  <!-- 2. Assign to Agent -->
                  <div v-else-if="step.type === 'Assign to Agent'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Sarah (Senior Sales Rep)">Sarah (Senior Sales Rep)</option>
                      <option value="Justin (Admin)">Justin (Admin)</option>
                      <option value="David (Sales Rep)">David (Sales Rep)</option>
                      <option value="Emma (Junior Rep)">Emma (Junior Rep)</option>
                      <option value="Round Robin (All Reps)">Round Robin (All Reps)</option>
                    </select>
                  </div>

                  <!-- 3. Assign a Team -->
                  <div v-else-if="step.type === 'Assign a Team'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Sales Team">Sales Team</option>
                      <option value="Support Team">Support Team</option>
                      <option value="Enterprise Team">Enterprise Team</option>
                      <option value="VIP Triage">VIP Triage</option>
                    </select>
                  </div>

                  <!-- 4. Add / Remove Label -->
                  <div v-else-if="['Add a Label', 'Remove a Label'].includes(step.type)">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="VIP Client">VIP Client</option>
                      <option value="Hot Lead">Hot Lead</option>
                      <option value="Partner">Partner</option>
                      <option value="High Priority">High Priority</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>

                  <!-- 5. Change Priority -->
                  <div v-else-if="step.type === 'Change Priority'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <!-- 6. Add SLA -->
                  <div v-else-if="step.type === 'Add SLA'">
                    <select
                      v-model="step.target"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Standard Response (1 Hour)">Standard Response (1 Hour)</option>
                      <option value="VIP Priority (15 Mins)">VIP Priority (15 Mins)</option>
                      <option value="Critical Escalation (5 Mins)">Critical Escalation (5 Mins)</option>
                    </select>
                  </div>

                  <!-- 7. Webhook or Custom Target -->
                  <div v-else-if="step.type === 'Send Webhook Event'">
                    <input
                      type="url"
                      v-model="step.target"
                      placeholder="https://api.yourdomain.com/webhook"
                      class="w-full text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>

                  <div v-else class="text-[11px] text-slate-400 italic">
                    Executes state transition: {{ step.type }}
                  </div>
                </div>

                <!-- Step Wait Configuration Panel (Expandable - Matching Screenshot 4) -->
                <div
                  v-if="step.wait.isEditing"
                  class="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 animate-fade-in"
                >
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="duration"
                        v-model="step.wait.type"
                        class="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Wait a set amount of time before this step
                      </span>
                    </label>

                    <div v-if="step.wait.type === 'duration'" class="flex items-center gap-2 pl-5">
                      <input
                        type="number"
                        min="1"
                        v-model.number="step.wait.value"
                        class="w-16 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                      />
                      <select
                        v-model="step.wait.unit"
                        class="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white cursor-pointer"
                      >
                        <option value="minutes">minutes</option>
                        <option value="hours">hours</option>
                        <option value="days">days</option>
                        <option value="weeks">weeks</option>
                      </select>
                    </div>

                    <label class="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="radio"
                        value="specific_time"
                        v-model="step.wait.type"
                        class="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Run at a specific date & time instead
                      </span>
                    </label>

                    <div v-if="step.wait.type === 'specific_time'" class="pl-5 pt-1">
                      <input
                        type="datetime-local"
                        v-model="step.wait.specificTime"
                        class="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <!-- Done and Remove Actions -->
                  <div class="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      @click="step.wait.enabled = true; step.wait.isEditing = false"
                      class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md cursor-pointer flex items-center gap-1"
                    >
                      <Check class="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                    <button
                      type="button"
                      @click="step.wait.enabled = false; step.wait.isEditing = false"
                      class="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium cursor-pointer"
                    >
                      ✕ Remove wait
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <!-- + Add a step Button -->
            <button
              type="button"
              @click="addStep"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5" /> Add a step
            </button>

          </div>

          <!-- ══════ SECTION 3: IF IT DOESN'T WORK, DO SOMETHING ELSE ══════ -->
          <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-xs text-slate-900 dark:text-white">If it doesn't work, do something else</h4>
                <p class="text-[11px] text-slate-400">Optional — for reminders and follow-ups when there's no reply</p>
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

            <!-- Fallback Branch Pipeline (Apparent only when toggled ON) -->
            <div
              v-if="form.hasFallback"
              class="p-4 rounded-xl border border-amber-300/70 bg-amber-50/20 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3 animate-fade-in shadow-2xs"
            >
              <!-- Wait line (Matching Screenshot 5: "Wait up to [ 2 ] [ days ] for a reply. If none comes, run:") -->
              <div class="flex items-center gap-1.5 flex-wrap text-xs text-slate-700 dark:text-slate-300">
                <span>Wait up to</span>
                <input
                  type="number"
                  min="1"
                  v-model.number="form.fallbackTimeout"
                  class="w-14 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md focus:outline-none text-slate-800 dark:text-white font-medium"
                />
                <select
                  v-model="form.fallbackTimeoutUnit"
                  class="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md focus:outline-none text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="minutes">minutes</option>
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                </select>
                <span>for a reply. If none comes, run:</span>
              </div>

              <!-- Fallback Action Steps List -->
              <div class="space-y-2.5">
                <div
                  v-for="(fStep, fIdx) in form.fallbackSteps"
                  :key="fIdx"
                  class="border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-900 space-y-2 shadow-2xs"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 flex-1">
                      <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {{ fIdx + 1 }}
                      </span>
                      <select
                        v-model="fStep.type"
                        class="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md focus:outline-none text-slate-900 dark:text-white flex-1"
                      >
                        <option v-for="act in actionTypeOptions" :key="act" :value="act">{{ act }}</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      @click="form.fallbackSteps.splice(fIdx, 1)"
                      class="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <!-- Fallback Step Payload -->
                  <div v-if="['Send a Message', 'Send AI Personalized Message', 'Add a Private Note'].includes(fStep.type)">
                    <textarea
                      v-model="fStep.payload"
                      rows="2"
                      placeholder="Enter your message here"
                      class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-md focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 resize-y"
                    ></textarea>
                  </div>
                  <div v-else-if="fStep.type === 'Assign to Agent'">
                    <select
                      v-model="fStep.target"
                      class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Sarah (Senior Sales Rep)">Sarah (Senior Sales Rep)</option>
                      <option value="Justin (Admin)">Justin (Admin)</option>
                    </select>
                  </div>
                  <div v-else-if="fStep.type === 'Assign a Team'">
                    <select
                      v-model="fStep.target"
                      class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Sales Team">Sales Team</option>
                      <option value="Support Team">Support Team</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- + Add a fallback step button -->
              <button
                type="button"
                @click="addFallbackStep"
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium text-xs rounded-lg transition-colors cursor-pointer border border-emerald-200/60 dark:border-emerald-800/60"
              >
                <Plus class="w-3.5 h-3.5" /> Add a fallback step
              </button>
            </div>
          </div>

        </form>

        <!-- Modal Footer -->
        <footer class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
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
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {{ form.active ? 'Active' : 'Paused' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="showModal = false"
              class="px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="saveForm"
              :disabled="!form.name.trim()"
              class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-2xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {{ isEditing ? 'Save changes' : 'Save automation' }}
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
  Zap, Plus, Search, Play, Copy, Pencil, Trash2,
  Clock, Check, X, Sparkles
} from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'toast', title: string, message: string, type?: 'success' | 'warning'): void;
}>();

// Available Category Tags
export interface AutomationTag {
  name: string;
  dotColor: string;
}

const availableTags = ref<AutomationTag[]>([
  { name: 'Lead Routing', dotColor: '#3B82F6' },
  { name: 'Escalations', dotColor: '#EF4444' },
  { name: 'VIP Clients', dotColor: '#A855F7' },
  { name: 'SLA Alert', dotColor: '#F59E0B' },
  { name: 'Deals', dotColor: '#10B981' },
  { name: 'WhatsApp', dotColor: '#22C55E' },
]);

// Trigger Events (Screenshot 1)
const triggerOptions = [
  'Conversation Created',
  'Conversation Updated',
  'Message Created',
  'Conversation Resolved',
  'Conversation Opened',
  'Private Note Created',
  'Deal Created',
  'Ticket Created',
  'Contact Owner Assigned',
  'Conversation Owner Assigned',
];

// Filter Condition Fields (Screenshot 2)
const conditionFieldOptions = [
  'Status',
  'Browser Language',
  'Email Subject',
  'Country',
  'Phone Number',
  'Referrer Link',
  'Email',
  'Inbox',
  'Conversation Language',
  'Priority',
  'Labels',
  'Contact Custom Attributes',
  'Lead Temperature',
  'Sales Motion',
  'Hp 2',
  'Lead Type',
  'Lead Source',
];

// Step Action Types (Screenshot 3)
const actionTypeOptions = [
  'Assign to Agent',
  'Assign a Team',
  'Add a Label',
  'Remove a Label',
  'Send a Message',
  'Add a Private Note',
  'Send an Email to Team',
  'Send Attachment',
  'Send Webhook Event',
  'Change Priority',
  'Send AI Personalized Message',
  'Send an Email Transcript',
  'Mute Conversation',
  'Snooze Conversation',
  'Resolve Conversation',
  'Open conversation',
  'Add SLA',
];

export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export interface WaitConfig {
  enabled: boolean;
  type: 'duration' | 'specific_time';
  value: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks';
  specificTime?: string;
  isEditing?: boolean;
}

export interface ActionStep {
  type: string;
  target?: string;
  payload?: string;
  wait: WaitConfig;
}

export interface FallbackStep {
  type: string;
  target?: string;
  payload?: string;
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
  fallbackTimeout?: number;
  fallbackTimeoutUnit?: string;
  fallbackSteps?: FallbackStep[];
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
    action: 'Assign to Agent [Sarah (Senior Sales Rep)]',
    conditions: [
      { field: 'Lead Temperature', operator: 'Equal to', value: 'Hot' },
      { field: 'Status', operator: 'Equal to', value: 'Open' },
    ],
    actionSteps: [
      { type: 'Assign to Agent', target: 'Sarah (Senior Sales Rep)', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
      { type: 'Add a Label', target: 'VIP Client', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
    ],
    hasFallback: true,
    fallbackTimeout: 2,
    fallbackTimeoutUnit: 'days',
    fallbackSteps: [
      { type: 'Send an Email to Team', payload: 'Follow-up needed for Hot Lead' }
    ],
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
    action: 'Add a Label [Partner]',
    conditions: [
      { field: 'Email', operator: 'Contains', value: '@enterprise.com' },
    ],
    actionSteps: [
      { type: 'Add a Label', target: 'Partner', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
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
    action: 'Send an Email to Team [Justin]',
    conditions: [
      { field: 'Status', operator: 'Equal to', value: 'Pending' },
    ],
    actionSteps: [
      { type: 'Change Priority', target: 'Urgent', wait: { enabled: true, type: 'duration', value: 1, unit: 'hours' } },
      { type: 'Assign to Agent', target: 'Justin (Admin)', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
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
    action: 'Assign a Team [Sales Team]',
    conditions: [
      { field: 'Inbox', operator: 'Equal to', value: 'WhatsApp Support' },
    ],
    actionSteps: [
      { type: 'Assign a Team', target: 'Sales Team', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
      { type: 'Send a Message', payload: 'Hello {{contact.name}}, thanks for reaching out!', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
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
    action: 'Change Priority [Urgent] & Assign a Team [Enterprise]',
    conditions: [
      { field: 'Priority', operator: 'Equal to', value: 'High' },
    ],
    actionSteps: [
      { type: 'Change Priority', target: 'Urgent', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
      { type: 'Assign a Team', target: 'Enterprise Team', wait: { enabled: false, type: 'duration', value: 2, unit: 'days' } },
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
  { id: 3, automationName: 'VIP High Urgency Ticket Triage', source: 'Lead: Global Horizon LLC', actionResult: 'Priority set to Urgent', time: '1h ago', status: 'success', duration: '18ms' },
  { id: 4, automationName: 'Escalate unread conversation after 24h', source: 'Conversation #2201', actionResult: 'Email delivered to Justin', time: '5h ago', status: 'success', duration: '22ms' },
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

// Format Rule Sentence cleanly
function formatRuleSentence(auto: AutomationRule): string {
  const parts: string[] = [];
  const event = auto.triggerEvent || 'Conversation Created';
  parts.push(`When ${event.toLowerCase()}`);

  if (auto.conditions && auto.conditions.length > 0) {
    const condStr = auto.conditions.map(c => `${c.field.toLowerCase()} ${c.operator.toLowerCase()} ${c.value}`).join(' and ');
    parts.push(`if ${condStr}`);
  } else if (auto.trigger) {
    parts.push(`if ${auto.trigger.toLowerCase()}`);
  }

  let actionStr = '';
  if (auto.actionSteps && auto.actionSteps.length > 0) {
    actionStr = auto.actionSteps.map(s => {
      const waitPart = s.wait && s.wait.enabled ? ` (wait ${s.wait.value} ${s.wait.unit})` : '';
      return s.target ? `${s.type} [${s.target}]${waitPart}` : `${s.type}${waitPart}`;
    }).join(' → ');
  } else {
    actionStr = auto.action || 'Execute action';
  }

  return `${parts.join(' ')} → ${actionStr}`;
}

// Tag dot color helper
function getTagDotColor(tagName: string): string {
  const tag = availableTags.value.find(t => t.name === tagName);
  return tag ? tag.dotColor : '#94A3B8';
}

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

  // Status & Mode filter
  if (selectedStatus.value === 'active') {
    list = list.filter(a => a.active);
  } else if (selectedStatus.value === 'paused') {
    list = list.filter(a => !a.active);
  } else if (selectedStatus.value === 'auto') {
    list = list.filter(a => a.executionMode !== 'manual');
  } else if (selectedStatus.value === 'manual') {
    list = list.filter(a => a.executionMode === 'manual');
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
    {
      type: 'Send a Message',
      payload: '',
      target: '',
      wait: { enabled: false, type: 'duration' as const, value: 2, unit: 'days' as const, isEditing: false }
    }
  ] as ActionStep[],
  hasFallback: false,
  fallbackTimeout: 2,
  fallbackTimeoutUnit: 'days',
  fallbackSteps: [
    { type: 'Send a Message', payload: '', target: '' }
  ] as FallbackStep[],
  active: true,
});

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
    type: 'Assign to Agent',
    target: 'Sarah (Senior Sales Rep)',
    payload: '',
    wait: { enabled: false, type: 'duration', value: 2, unit: 'days', isEditing: false }
  });
}

function removeStep(index: number) {
  form.value.actionSteps.splice(index, 1);
}

function addFallbackStep() {
  form.value.fallbackSteps.push({
    type: 'Send a Message',
    payload: '',
    target: ''
  });
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
      {
        type: 'Send a Message',
        payload: 'Enter your message here',
        target: '',
        wait: { enabled: false, type: 'duration', value: 2, unit: 'days', isEditing: false }
      }
    ],
    hasFallback: false,
    fallbackTimeout: 2,
    fallbackTimeoutUnit: 'days',
    fallbackSteps: [
      { type: 'Send a Message', payload: '', target: '' }
    ],
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
      : [{
          type: 'Assign to Agent',
          target: 'Sarah (Senior Sales Rep)',
          payload: '',
          wait: { enabled: false, type: 'duration', value: 2, unit: 'days', isEditing: false }
        }],
    hasFallback: !!auto.hasFallback,
    fallbackTimeout: auto.fallbackTimeout || 2,
    fallbackTimeoutUnit: auto.fallbackTimeoutUnit || 'days',
    fallbackSteps: auto.fallbackSteps && auto.fallbackSteps.length > 0
      ? JSON.parse(JSON.stringify(auto.fallbackSteps))
      : [{ type: 'Send a Message', payload: '', target: '' }],
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
    fallbackTimeout: auto.fallbackTimeout,
    fallbackTimeoutUnit: auto.fallbackTimeoutUnit,
    fallbackSteps: auto.fallbackSteps ? JSON.parse(JSON.stringify(auto.fallbackSteps)) : undefined,
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
    ? `${form.value.actionSteps[0].type} [${form.value.actionSteps[0].target || 'Custom'}]`
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
      item.fallbackTimeout = form.value.fallbackTimeout;
      item.fallbackTimeoutUnit = form.value.fallbackTimeoutUnit;
      item.fallbackSteps = JSON.parse(JSON.stringify(form.value.fallbackSteps));
      item.tags = [...form.value.tags];
      item.active = form.value.active;
      emit('toast', 'Automation Updated', `Saved "${item.name}".`, 'success');
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
      fallbackTimeout: form.value.fallbackTimeout,
      fallbackTimeoutUnit: form.value.fallbackTimeoutUnit,
      fallbackSteps: JSON.parse(JSON.stringify(form.value.fallbackSteps)),
      tags: form.value.tags.length > 0 ? [...form.value.tags] : ['Lead Routing'],
      dateCreated: currentDate,
      active: form.value.active,
      executionCount: 0,
    };
    automations.value.unshift(newAuto);
    emit('toast', 'Automation Created', `"${newAuto.name}" created.`, 'success');
  }

  showModal.value = false;
}

function toggleActive(auto: AutomationRule) {
  auto.active = !auto.active;
  emit(
    'toast',
    auto.active ? 'Automation Activated' : 'Automation Paused',
    `"${auto.name}" is now ${auto.active ? 'active' : 'paused'}.`,
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

  emit('toast', 'Test Run Successful', `Executed "${auto.name}".`, 'success');
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
