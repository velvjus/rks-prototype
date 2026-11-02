<template>
 <div class="space-y-4">
 <!-- Page Header & Primary Action -->
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">
 Automations
 </h1>
 <p class="text-xs text-muted-foreground mt-1">
 Automate routing, assignments, tagging, and notifications based on CRM events.
 </p>
 </div>
 <div class="flex items-center gap-2">
 <button
 @click="openCreateModal"
 class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
 >
 <Plus class="w-3.5 h-3.5" />
 <span>New Automation</span>
 </button>
 </div>
 </div>
 </div>

 <!-- Navigation Sub-tabs & Clean Status Metrics -->
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-px">
 <div class="flex items-center gap-1">
 <button
 @click="activeSubTab = 'workflows'"
 class="px-3 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
 :class="activeSubTab === 'workflows'
 ? 'border-primary text-primary'
 : 'border-transparent text-muted-foreground hover:text-foreground'"
 >
 Rules ({{ filteredAutomations.length }})
 </button>
 <button
 @click="activeSubTab = 'history'"
 class="px-3 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
 :class="activeSubTab === 'history'
 ? 'border-primary text-primary'
 : 'border-transparent text-muted-foreground hover:text-foreground'"
 >
 Execution Logs ({{ executionLogs.length }})
 </button>
 </div>

 <!-- Muted Summary Numbers -->
 <div class="flex items-center gap-2.5 text-xs text-muted-foreground pb-1">
 <span><strong>{{ automations.filter(a => a.active).length }}</strong> active</span>
 <span>•</span>
 <span><strong>{{ automations.filter(a => !a.active).length }}</strong> paused</span>
 <span>•</span>
 <span><strong>142</strong> runs today</span>
 </div>
 </div>

 <!-- ══════════════ SUB-TAB 1: AUTOMATIONS LIST ══════════════ -->
 <div v-if="activeSubTab === 'workflows'" class="space-y-3">
 
 <!-- Minimal Filter Bar: Search, Status, & Multi-select Tag Filter -->
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <!-- Search input -->
 <div class="relative flex-1 max-w-md">
 <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
 <input
 ref="searchInputRef"
 v-model="searchQuery"
 type="text"
 placeholder="Search automations by name, condition, or tag (Press '/' to focus)..."
 class="w-full pl-8 pr-10 py-1.5 bg-card border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
 />
 <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
 <button
 v-if="searchQuery"
 @click="searchQuery = ''; searchInputRef?.focus()"
 class="text-muted-foreground hover:text-muted-foreground text-xs cursor-pointer"
 >
 ✕
 </button>
 <kbd v-else class="hidden sm:inline-flex items-center px-1 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded select-none">
 /
 </kbd>
 </div>
 </div>

 <!-- Tag Filter Button & Status Dropdown -->
 <div class="flex items-center gap-2 flex-wrap">
 <!-- Filter by Tag Dropdown Button with Checkboxes -->
 <div class="relative" ref="tagFilterRef">
 <button
 @click.stop="showTagFilterDropdown = !showTagFilterDropdown"
 class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer"
 :class="selectedTags.length > 0
 ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-2xs'
 : 'bg-card text-foreground border border-border hover:bg-muted font-medium'"
 >
 <Filter class="w-3.5 h-3.5" />
 <span>
 {{
 selectedTags.length === 0
 ? 'Filter by Tag'
 : selectedTags.length === 1
 ? selectedTags[0]
 : `Tags (${selectedTags.length})`
 }}
 </span>
 <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showTagFilterDropdown }" />
 </button>

 <!-- Tag Multi-select Checkbox Popover Menu -->
 <div
 v-if="showTagFilterDropdown"
 class="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-xl z-30 divide-y divide-border animate-scale-up overflow-hidden"
 >
 <!-- Header / Reset Action -->
 <div class="p-2 flex items-center justify-between text-xs bg-muted/40">
 <span class="font-semibold text-foreground text-[11px] uppercase tracking-wider">Filter by tags</span>
 <button
 v-if="selectedTags.length > 0"
 @click="clearTagFilters"
 class="text-[11px] text-primary hover:text-primary font-medium cursor-pointer"
 >
 Reset
 </button>
 </div>

 <!-- Checkbox List -->
 <div class="p-1.5 space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar">
 <label
 v-for="tag in availableTags"
 :key="tag.name"
 class="w-full px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer select-none hover:bg-muted/70"
 >
 <div class="flex items-center gap-2 min-w-0">
 <input
 type="checkbox"
 :checked="selectedTags.includes(tag.name)"
 @change="toggleTagFilter(tag.name)"
 class="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer accent-primary"
 />
 <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: tag.dotColor }"></span>
 <span class="truncate text-foreground" :class="{ 'font-semibold text-foreground': selectedTags.includes(tag.name) }">
 {{ tag.name }}
 </span>
 </div>
 <span class="text-[10px] text-muted-foreground ml-1">
 {{ automations.filter(a => a.tags.includes(tag.name)).length }}
 </span>
 </label>
 </div>
 </div>
 </div>

 <div class="h-4 w-px bg-muted hidden sm:block"></div>

 <!-- Status & Mode Filter Dropdown -->
 <select
 v-model="selectedStatus"
 class="text-xs bg-card border border-border px-2 py-1 rounded-lg focus:outline-none text-foreground cursor-pointer"
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
 <div class="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
 <div v-if="filteredAutomations.length > 0" class="divide-y divide-border">
 <div
 v-for="auto in filteredAutomations"
 :key="auto.id"
 class="p-4 hover:bg-muted/40 transition-colors group relative"
 >
 <div class="flex items-start justify-between gap-4">
 
 <!-- Left: Title, Clean Natural Logic String, Metadata -->
 <div class="space-y-1 flex-1 min-w-0">
 <!-- Title Row: Name, Macro badge (if manual), Neutral Tag Pills -->
 <div class="flex items-center gap-2 flex-wrap">
 <h3 class="font-semibold text-sm text-foreground truncate tracking-tight">
 {{ auto.name }}
 </h3>

 <!-- Manual Macro Badge (Only shown if manual mode) -->
 <span
 v-if="auto.executionMode === 'manual'"
 class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tag-1 text-tag-1-foreground border border-tag-1-foreground/20"
 >
 Macro
 </span>

 <!-- Neutral Monochrome Tag Pills (Faded by default, prominent on hover) -->
 <span
 v-for="tag in auto.tags"
 :key="tag"
 class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity duration-200"
 >
 <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: getTagDotColor(tag) }"></span>
 {{ tag }}
 </span>
 </div>

 <!-- Line 2: Default Context Metadata (Created, Runs, Last run) replaced by Automation Rule on Hover -->
 <div class="relative min-h-[18px] flex items-center pt-0.5">
 <!-- Default: Context (Created, runs, last run) -->
 <div class="text-xs text-muted-foreground flex items-center gap-1.5 group-hover:hidden">
 <span>Created {{ auto.dateCreated }}</span>
 <span>•</span>
 <span>{{ auto.executionCount || 0 }} runs</span>
 <span v-if="auto.lastRun">• Last run {{ auto.lastRun }}</span>
 </div>

 <!-- Hover: Replaced by Automation Rule Logic (Matching Context Metadata Color) -->
 <p class="text-xs text-muted-foreground line-clamp-1 hidden group-hover:block animate-fade-in">
 {{ formatRuleSentence(auto) }}
 </p>
 </div>
 </div>

 <!-- Right: Hover-Revealed Actions & Always-Visible Active Switch -->
 <div class="flex items-center gap-1.5 shrink-0 self-center">
 <!-- Secondary Actions (Revealed on Hover) -->
 <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
 <button
 @click="testAutomation(auto)"
 class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
 title="Test Run"
 >
 <Play class="w-3.5 h-3.5" />
 </button>

 <button
 @click="cloneAutomation(auto)"
 class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
 title="Clone Rule"
 >
 <Copy class="w-3.5 h-3.5" />
 </button>

 <button
 @click="openEditModal(auto)"
 class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
 title="Edit Rule"
 >
 <Pencil class="w-3.5 h-3.5" />
 </button>

 <button
 @click="confirmDelete(auto)"
 class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
 title="Delete Rule"
 >
 <Trash2 class="w-3.5 h-3.5" />
 </button>
 </div>

 <div class="h-4 w-px bg-muted mx-0.5"></div>

 <!-- Always-Visible Active Toggle Switch -->
 <div class="flex items-center gap-1.5 pl-1">
 <button
 @click="toggleActive(auto)"
 class="relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
 :class="auto.active ? 'bg-primary' : 'bg-muted '"
 :title="auto.active ? 'Active (Click to Pause)' : 'Paused (Click to Activate)'"
 >
 <span
 class="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out"
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
 <div class="text-xs font-semibold text-foreground">No matching automations</div>
 <p class="text-xs text-muted-foreground">
 {{ searchQuery || selectedTags.length > 0 || selectedStatus !== 'all'
 ? 'Try adjusting your search filter.'
 : 'Create your first automation rule.'
 }}
 </p>
 </div>
 </div>

 </div>

 <!-- ══════════════ SUB-TAB 2: EXECUTION LOGS ══════════════ -->
 <div v-if="activeSubTab === 'history'" class="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
 <div class="p-3.5 border-b border-border flex items-center justify-between gap-3 bg-muted/50 ">
 <div>
 <h3 class="font-semibold text-foreground text-xs">Execution Audit Trail</h3>
 <p class="text-[11px] text-muted-foreground">Log of evaluated events and executed actions.</p>
 </div>
 <div class="flex items-center gap-2">
 <div class="relative w-44">
 <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
 <input
 v-model="historySearchQuery"
 type="text"
 placeholder="Filter..."
 class="w-full pl-8 pr-3 py-1 bg-card border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
 />
 </div>
 <button
 v-if="executionLogs.length > 0"
 @click="executionLogs = []; $emit('toast', 'Logs Cleared', 'History wiped.', 'warning')"
 class="text-[11px] text-muted-foreground hover:text-destructive font-medium cursor-pointer"
 >
 Clear
 </button>
 </div>
 </div>

 <div v-if="filteredLogs.length > 0" class="divide-y divide-border">
 <div
 v-for="log in filteredLogs"
 :key="log.id"
 class="p-3 flex items-center justify-between hover:bg-muted/50 text-xs transition-colors"
 >
 <div class="flex items-center gap-2.5">
 <div class="w-1.5 h-1.5 rounded-full" :class="log.status === 'success' ? 'bg-success' : 'bg-destructive'"></div>
 <div>
 <div class="font-semibold text-sm text-foreground ">
 {{ log.automationName }}
 <span class="text-xs font-normal text-muted-foreground">on <span class="font-mono text-muted-foreground ">{{ log.source }}</span></span>
 </div>
 <div class="text-xs text-muted-foreground mt-0.5">
 <span>Result: {{ log.actionResult }}</span>
 <span class="mx-1">•</span>
 <span>{{ log.duration || '12ms' }}</span>
 </div>
 </div>
 </div>
 <div class="flex items-center gap-2">
 <span class="text-[10px] text-muted-foreground font-sans tabular-nums">{{ log.time }}</span>
 </div>
 </div>
 </div>
 <div v-else class="p-8 text-center text-muted-foreground text-xs">
 {{ historySearchQuery ? 'No matching logs.' : 'No execution history recorded yet.' }}
 </div>
 </div>

 <!-- ══════════════ REDESIGNED STEPPER MODAL: CREATE / EDIT AUTOMATION ══════════════ -->
 <div
 v-if="showModal"
 class="fixed inset-0 bg-background/80 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto animate-fade-in"
 @click.self="showModal = false"
 >
 <div class="bg-card rounded-2xl shadow-2xl border border-border max-w-4xl w-full mx-auto overflow-hidden animate-scale-up flex flex-col h-[660px] max-h-[90vh]">
 
 <!-- Modal Head -->
 <header class="px-6 py-4 border-b border-border flex items-start justify-between bg-card shrink-0">
 <div>
 <h2 class="text-lg font-bold text-foreground tracking-tight">
 {{ isEditing ? `Edit Automation: "${form.name || 'Untitled'}"` : isCloning ? 'Clone Automation' : 'New Automation' }}
 </h2>
 <p class="text-xs text-muted-foreground mt-0.5">
 One flow for what used to be separate Macros and Automations.
 </p>
 </div>
 <button
 @click="showModal = false"
 class="text-muted-foreground hover:text-muted-foreground p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
 >
 <X class="w-4 h-4" />
 </button>
 </header>

 <!-- Modal Body: Left Stepper Sidebar + Right Content Panel -->
 <div class="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
 
 <!-- Stepper Navigation (Left Sidebar) -->
 <div class="w-full md:w-48 p-4 md:p-5 border-b md:border-b-0 md:border-r border-border bg-muted/50 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
 
 <!-- Step 1: Trigger -->
 <button
 type="button"
 @click="goToStep(1)"
 class="flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer w-full group relative"
 :class="currentStep === 1
 ? 'bg-card shadow-2xs'
 : 'hover:bg-muted/70 '"
 >
 <div
 class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
 :class="currentStep === 1
 ? 'bg-primary text-primary-foreground shadow-2xs'
 : currentStep > 1
 ? 'bg-primary/90 text-primary-foreground'
 : 'bg-muted text-muted-foreground'"
 >
 1
 </div>
 <div class="min-w-0 pr-1 hidden sm:block">
 <div class="text-xs font-bold" :class="currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'">
 Trigger
 </div>
 <div class="text-[10px] text-muted-foreground truncate">Name &amp; timing</div>
 </div>
 <!-- Vertical Line -->
 <div class="hidden md:block absolute left-5 top-8 w-0.5 h-6 bg-muted -z-0"></div>
 </button>

 <!-- Step 2: Conditions (Skipped if Manual mode) -->
 <button
 type="button"
 v-if="form.executionMode !== 'manual'"
 @click="goToStep(2)"
 class="flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer w-full group relative z-10"
 :class="currentStep === 2
 ? 'bg-card shadow-2xs'
 : 'hover:bg-muted/70 '"
 >
 <div
 class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
 :class="currentStep === 2
 ? 'bg-primary text-primary-foreground shadow-2xs'
 : currentStep > 2
 ? 'bg-primary/90 text-primary-foreground'
 : 'bg-muted text-muted-foreground'"
 >
 2
 </div>
 <div class="min-w-0 pr-1 hidden sm:block">
 <div class="text-xs font-bold" :class="currentStep === 2 ? 'text-foreground' : 'text-muted-foreground'">
 Conditions
 </div>
 <div class="text-[10px] text-muted-foreground truncate">Who it applies to</div>
 </div>
 <!-- Vertical Line -->
 <div class="hidden md:block absolute left-5 top-8 w-0.5 h-6 bg-muted -z-0"></div>
 </button>

 <!-- Step 3: Actions -->
 <button
 type="button"
 @click="goToStep(3)"
 class="flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer w-full group relative z-10"
 :class="currentStep === 3
 ? 'bg-card shadow-2xs'
 : 'hover:bg-muted/70 '"
 >
 <div
 class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
 :class="currentStep === 3
 ? 'bg-primary text-primary-foreground shadow-2xs'
 : currentStep > 3
 ? 'bg-primary/90 text-primary-foreground'
 : 'bg-muted text-muted-foreground'"
 >
 {{ form.executionMode === 'manual' ? '2' : '3' }}
 </div>
 <div class="min-w-0 pr-1 hidden sm:block">
 <div class="text-xs font-bold" :class="currentStep === 3 ? 'text-foreground' : 'text-muted-foreground'">
 Actions
 </div>
 <div class="text-[10px] text-muted-foreground truncate">What happens</div>
 </div>
 <!-- Vertical Line -->
 <div class="hidden md:block absolute left-5 top-8 w-0.5 h-6 bg-muted -z-0"></div>
 </button>

 <!-- Step 4: Review -->
 <button
 type="button"
 @click="goToStep(4)"
 class="flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer w-full group relative z-10"
 :class="currentStep === 4
 ? 'bg-card shadow-2xs'
 : 'hover:bg-muted/70 '"
 >
 <div
 class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
 :class="currentStep === 4
 ? 'bg-primary text-primary-foreground shadow-2xs'
 : 'bg-muted text-muted-foreground'"
 >
 {{ form.executionMode === 'manual' ? '3' : '4' }}
 </div>
 <div class="min-w-0 pr-1 hidden sm:block">
 <div class="text-xs font-bold" :class="currentStep === 4 ? 'text-foreground' : 'text-muted-foreground'">
 Review
 </div>
 <div class="text-[10px] text-muted-foreground truncate">Check &amp; save</div>
 </div>
 </button>

 </div>

 <!-- Step Content Panel (Right Panel) -->
 <div class="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
 
 <!-- ══════════════ PANE 1: TRIGGER ══════════════ -->
 <div v-show="currentStep === 1" class="space-y-4 animate-fade-in">
 <div>
 <h3 class="text-base font-bold text-foreground">Name it, then choose when it runs</h3>
 <p class="text-xs text-muted-foreground mt-0.5">
 Give your team a name they'll recognise in the conversation list.
 </p>
 </div>

 <!-- Rule Name -->
 <div class="space-y-1">
 <label class="block text-xs font-semibold text-foreground">
 Rule name <span class="text-destructive">*</span>
 </label>
 <input
 type="text"
 v-model="form.name"
 placeholder="e.g. Welcome new leads"
 required
 class="w-full text-xs bg-card border border-border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground"
 />
 </div>

 <!-- Description -->
 <div class="space-y-1">
 <label class="block text-xs font-semibold text-foreground">
 Description <span class="text-muted-foreground font-normal">(optional)</span>
 </label>
 <input
 type="text"
 v-model="form.description"
 placeholder="What is this rule for?"
 class="w-full text-xs bg-card border border-border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground"
 />
 </div>

 <!-- Category Tags Picker -->
 <div class="space-y-1.5">
 <label class="block text-xs font-semibold text-foreground">
 Tags <span class="text-muted-foreground font-normal">(optional)</span>
 </label>
 <div class="flex items-center gap-1.5 flex-wrap">
 <button
 v-for="tag in availableTags"
 :key="tag.name"
 type="button"
 @click="toggleModalTag(tag.name)"
 class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer"
 :class="form.tags.includes(tag.name)
 ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
 : 'bg-muted text-muted-foreground border-border hover:bg-muted'"
 >
 <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: tag.dotColor }"></span>
 <span>{{ tag.name }}</span>
 </button>
 </div>
 </div>

 <!-- When should this run? Big Picker Cards -->
 <div class="space-y-2 pt-2 border-t border-border">
 <label class="block text-xs font-semibold text-foreground">
 When should this run?
 </label>
 
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <!-- Option A: Automatically -->
 <button
 type="button"
 @click="setMode('auto')"
 class="p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between"
 :class="form.executionMode === 'auto'
 ? 'border-primary bg-primary/10 shadow-2xs'
 : 'border-border hover:border-border bg-card/40'"
 >
 <div>
 <span class="text-xl block mb-2">⚡</span>
 <strong class="text-xs font-bold text-foreground block mb-1">
 Automatically
 </strong>
 <p class="text-[11px] text-muted-foreground leading-relaxed">
 Runs by itself when something happens — like a new conversation starting.
 </p>
 </div>
 </button>

 <!-- Option B: Manually (When an agent clicks it) -->
 <button
 type="button"
 @click="setMode('manual')"
 class="p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between"
 :class="form.executionMode === 'manual'
 ? 'border-primary bg-primary/10 shadow-2xs'
 : 'border-border hover:border-border bg-card/40'"
 >
 <div>
 <span class="text-xl block mb-2">👆</span>
 <strong class="text-xs font-bold text-foreground block mb-1">
 When an agent clicks it
 </strong>
 <p class="text-[11px] text-muted-foreground leading-relaxed">
 Shows up as a button inside a conversation. Nothing runs until someone taps it.
 </p>
 </div>
 </button>
 </div>
 </div>

 <!-- Run when (Event Selector for Auto mode) -->
 <div v-if="form.executionMode === 'auto'" class="space-y-1 animate-fade-in pt-1">
 <label class="block text-xs font-semibold text-foreground">
 Run when
 </label>
 <select
 v-model="form.triggerEvent"
 class="w-full text-xs bg-card border border-border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground cursor-pointer"
 >
 <option v-for="trig in triggerOptions" :key="trig" :value="trig">{{ trig }}</option>
 </select>
 </div>

 <!-- Manual Notice Helper (For Manual mode) -->
 <div
 v-else
 class="p-3.5 bg-muted/50 border border-border rounded-xl text-xs text-muted-foreground leading-relaxed animate-fade-in flex items-start gap-2"
 >
 <span>💡</span>
 <span>This becomes a button agents can click from inside a conversation — no conditions needed, so we'll skip that step for you.</span>
 </div>
 </div>

 <!-- ══════════════ PANE 2: CONDITIONS ══════════════ -->
 <div v-show="currentStep === 2 && form.executionMode !== 'manual'" class="space-y-4 animate-fade-in">
 <div>
 <h3 class="text-base font-bold text-foreground">Who should this apply to?</h3>
 <p class="text-xs text-muted-foreground mt-0.5">
 Narrow it down, or leave it open to run for every matching conversation.
 </p>
 </div>

 <!-- Every conversation vs Only if match toggle pills -->
 <div class="flex items-center gap-2">
 <button
 type="button"
 @click="condAll = true"
 class="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border"
 :class="condAll
 ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
 : 'bg-card text-muted-foreground border-border hover:bg-muted/50'"
 >
 Every conversation
 </button>
 <button
 type="button"
 @click="condAll = false"
 class="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border"
 :class="!condAll
 ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
 : 'bg-card text-muted-foreground border-border hover:bg-muted/50'"
 >
 Only if conditions match
 </button>
 </div>

 <!-- Conditions List -->
 <div v-if="!condAll" class="space-y-2.5 animate-fade-in pt-1">
 <div
 v-for="(cond, index) in form.conditions"
 :key="index"
 class="flex items-center gap-2 flex-wrap sm:flex-nowrap p-2.5 bg-muted/40 rounded-xl border border-border/80 "
 >
 <span class="text-xs font-semibold text-muted-foreground w-11 shrink-0">
 {{ index === 0 ? 'Where' : 'And' }}
 </span>

 <!-- Field Selector -->
 <select
 v-model="cond.field"
 class="text-xs bg-card border border-border px-2 py-1.5 rounded-lg focus:outline-none text-foreground flex-1 min-w-[120px]"
 >
 <option v-for="f in conditionFieldOptions" :key="f" :value="f">{{ f }}</option>
 </select>

 <!-- Operator Selector -->
 <select
 v-model="cond.operator"
 class="text-xs bg-card border border-border px-2 py-1.5 rounded-lg focus:outline-none text-foreground flex-1 min-w-[100px]"
 >
 <option value="Equal to">Equal to</option>
 <option value="Not equal to">Not equal to</option>
 <option value="Contains">Contains</option>
 <option value="Greater than">Greater than</option>
 <option value="Less than">Less than</option>
 <option value="Is present">Is present</option>
 <option value="Is not present">Is not present</option>
 </select>

 <!-- Value Input / Select -->
 <select
 v-if="cond.field === 'Status'"
 v-model="cond.value"
 class="text-xs bg-card border border-border px-2 py-1.5 rounded-lg focus:outline-none text-foreground flex-1 min-w-[110px]"
 >
 <option value="Open">Open</option>
 <option value="Pending">Pending</option>
 <option value="Resolved">Resolved</option>
 <option value="Snoozed">Snoozed</option>
 </select>
 <select
 v-else-if="cond.field === 'Priority'"
 v-model="cond.value"
 class="text-xs bg-card border border-border px-2 py-1.5 rounded-lg focus:outline-none text-foreground flex-1 min-w-[110px]"
 >
 <option value="Low">Low</option>
 <option value="Medium">Medium</option>
 <option value="High">High</option>
 <option value="Urgent">Urgent</option>
 </select>
 <select
 v-else-if="cond.field === 'Inbox'"
 v-model="cond.value"
 class="text-xs bg-card border border-border px-2 py-1.5 rounded-lg focus:outline-none text-foreground flex-1 min-w-[110px]"
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
 placeholder="Enter value..."
 class="text-xs bg-card border border-border px-2 py-1.5 rounded-lg focus:outline-none text-foreground flex-1 min-w-[110px]"
 />

 <!-- Delete Condition -->
 <button
 type="button"
 @click="removeCondition(index)"
 class="p-1 text-muted-foreground hover:text-destructive rounded cursor-pointer shrink-0"
 title="Remove condition"
 >
 ✕
 </button>
 </div>

 <!-- Add Condition Button -->
 <button
 type="button"
 @click="addCondition"
 class="w-full text-left py-2 px-3 border border-dashed border-border rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1.5"
 >
 <Plus class="w-3.5 h-3.5" />
 <span>Add another condition (must also be true)</span>
 </button>
 </div>
 </div>

 <!-- ══════════════ PANE 3: ACTIONS ══════════════ -->
 <div v-show="currentStep === 3" class="space-y-4 animate-fade-in">
 <div>
 <h3 class="text-base font-bold text-foreground">Then do this</h3>
 <p class="text-xs text-muted-foreground mt-0.5">
 Steps run in order, top to bottom. Click the clock on any step to add a wait before it runs.
 </p>
 </div>

 <!-- Action Step Timeline -->
 <div class="space-y-3 relative">
 <div
 v-for="(step, stepIndex) in form.actionSteps"
 :key="stepIndex"
 class="flex items-start gap-3 relative group"
 >
 <!-- Step Number Bubble & Connector Line (Fully Connected) -->
 <div class="relative flex flex-col items-center shrink-0 self-stretch">
 <div class="w-6 h-6 rounded-full bg-card text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs z-10">
 {{ stepIndex + 1 }}
 </div>
 <div
 v-if="stepIndex < form.actionSteps.length - 1"
 class="w-0.5 absolute top-6 bottom-[-16px] left-1/2 -translate-x-1/2 bg-muted z-0"
 ></div>
 </div>

 <!-- Step Content Box -->
 <div class="flex-1 bg-card/80 border border-border rounded-xl p-3.5 space-y-2.5 shadow-2xs">
 <div class="flex items-center justify-between gap-2">
 <!-- Action Selector -->
 <select
 v-model="step.type"
 class="text-xs font-bold bg-muted border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground flex-1"
 >
 <option v-for="act in actionTypeOptions" :key="act" :value="act">{{ act }}</option>
 </select>

 <!-- Action Step Toolbar -->
 <div class="flex items-center gap-1.5 shrink-0">
 <!-- Add/Edit Wait Button -->
 <button
 type="button"
 @click="step.wait.isEditing = !step.wait.isEditing"
 class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border"
 :class="step.wait.enabled
 ? 'bg-warning/10 text-warning border-warning/20 '
 : 'bg-card text-muted-foreground border-border hover:bg-muted'"
 >
 <Clock class="w-3.5 h-3.5" />
 <span>{{ step.wait.enabled ? `${step.wait.value} ${step.wait.unit}` : 'Wait' }}</span>
 </button>

 <!-- Delete Step -->
 <button
 type="button"
 @click="removeStep(stepIndex)"
 class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
 title="Remove step"
 >
 <Trash2 class="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 <!-- Dynamic Payload Editor based on action type -->
 <div class="pt-0.5">
 <!-- Message / AI Message / Note -->
 <div v-if="['Send a Message', 'Send AI Personalized Message', 'Add a Private Note'].includes(step.type)" class="space-y-1.5">
 <textarea
 v-model="step.payload"
 rows="2"
 :placeholder="step.type === 'Add a Private Note' ? 'Enter internal note...' : 'Enter message template...'"
 class="w-full text-xs bg-muted/50 border border-border p-2.5 rounded-lg focus:outline-none text-foreground placeholder:text-muted-foreground resize-y"
 ></textarea>
 <div class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
 <span>Tokens:</span>
 <button type="button" @click="step.payload += ' {{contact.name}}'" class="underline hover:text-muted-foreground cursor-pointer">&#123;&#123;contact.name&#125;&#125;</button>
 <button type="button" @click="step.payload += ' {{company.name}}'" class="underline hover:text-muted-foreground cursor-pointer">&#123;&#123;company.name&#125;&#125;</button>
 </div>
 </div>

 <!-- Assign to Agent -->
 <div v-else-if="step.type === 'Assign to Agent'">
 <select
 v-model="step.target"
 class="w-full text-xs bg-muted/50 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground"
 >
 <option value="Sarah (Senior Sales Rep)">Sarah (Senior Sales Rep)</option>
 <option value="Justin (Admin)">Justin (Admin)</option>
 <option value="David (Sales Rep)">David (Sales Rep)</option>
 <option value="Emma (Junior Rep)">Emma (Junior Rep)</option>
 <option value="Round Robin (All Reps)">Round Robin (All Reps)</option>
 </select>
 </div>

 <!-- Assign a Team -->
 <div v-else-if="step.type === 'Assign a Team'">
 <select
 v-model="step.target"
 class="w-full text-xs bg-muted/50 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground"
 >
 <option value="Sales Team">Sales Team</option>
 <option value="Support Team">Support Team</option>
 <option value="Enterprise Team">Enterprise Team</option>
 <option value="VIP Triage">VIP Triage</option>
 </select>
 </div>

 <!-- Add / Remove Label -->
 <div v-else-if="['Add a Label', 'Remove a Label'].includes(step.type)">
 <select
 v-model="step.target"
 class="w-full text-xs bg-muted/50 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground"
 >
 <option value="VIP Client">VIP Client</option>
 <option value="Hot Lead">Hot Lead</option>
 <option value="Partner">Partner</option>
 <option value="High Priority">High Priority</option>
 <option value="Enterprise">Enterprise</option>
 </select>
 </div>

 <!-- Change Priority -->
 <div v-else-if="step.type === 'Change Priority'">
 <select
 v-model="step.target"
 class="w-full text-xs bg-muted/50 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground"
 >
 <option value="Low">Low</option>
 <option value="Medium">Medium</option>
 <option value="High">High</option>
 <option value="Urgent">Urgent</option>
 </select>
 </div>

 <!-- Add SLA -->
 <div v-else-if="step.type === 'Add SLA'">
 <select
 v-model="step.target"
 class="w-full text-xs bg-muted/50 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground"
 >
 <option value="Standard Response (1 Hour)">Standard Response (1 Hour)</option>
 <option value="VIP Priority (15 Mins)">VIP Priority (15 Mins)</option>
 <option value="Critical Escalation (5 Mins)">Critical Escalation (5 Mins)</option>
 </select>
 </div>

 <!-- Send Webhook -->
 <div v-else-if="step.type === 'Send Webhook Event'">
 <input
 type="url"
 v-model="step.target"
 placeholder="https://api.yourdomain.com/webhook"
 class="w-full text-xs bg-muted/50 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground"
 />
 </div>
 </div>

 <!-- Step Wait Editor Popup -->
 <div
 v-if="step.wait.isEditing"
 class="p-3 bg-muted/50 border border-border rounded-xl space-y-2.5 animate-fade-in"
 >
 <div class="space-y-2">
 <label class="flex items-center gap-2 cursor-pointer">
 <input
 type="radio"
 value="duration"
 v-model="step.wait.type"
 class="text-primary focus:ring-primary"
 />
 <span class="text-xs font-medium text-foreground">
 Wait a set amount of time before this step
 </span>
 </label>

 <div v-if="step.wait.type === 'duration'" class="flex items-center gap-2 pl-5">
 <input
 type="number"
 min="1"
 v-model.number="step.wait.value"
 class="w-16 text-xs bg-card border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground"
 />
 <select
 v-model="step.wait.unit"
 class="text-xs bg-card border border-border px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground cursor-pointer"
 >
 <option value="minutes">minutes</option>
 <option value="hours">hours</option>
 <option value="days">days</option>
 <option value="weeks">weeks</option>
 </select>
 </div>
 </div>

 <div class="flex items-center gap-2 pt-1 border-t border-border">
 <button
 type="button"
 @click="step.wait.enabled = true; step.wait.isEditing = false"
 class="px-2.5 py-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-md cursor-pointer flex items-center gap-1"
 >
 <Check class="w-3.5 h-3.5" />
 <span>Done</span>
 </button>
 <button
 type="button"
 @click="step.wait.enabled = false; step.wait.isEditing = false"
 class="px-2 py-1 text-muted-foreground hover:text-foreground text-xs font-medium cursor-pointer"
 >
 ✕ Remove wait
 </button>
 </div>
 </div>

 </div>
 </div>
 </div>

 <!-- + Add a Step Button -->
 <button
 type="button"
 @click="addStep"
 class="w-full text-left py-2 px-3 border border-dashed border-border rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1.5"
 >
 <Plus class="w-3.5 h-3.5" />
 <span>Add a step</span>
 </button>

 <!-- Advanced Collapsible Fallback Branch -->
 <div class="pt-3 border-t border-border space-y-3">
 <div class="flex items-center justify-between">
 <div>
 <h4 class="font-bold text-xs text-foreground">If it doesn't work, do something else</h4>
 <p class="text-[11px] text-muted-foreground">Optional — for reminders and follow-ups when there's no reply</p>
 </div>

 <button
 type="button"
 @click="form.hasFallback = !form.hasFallback"
 class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
 :class="form.hasFallback ? 'bg-primary' : 'bg-muted '"
 >
 <span
 class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out"
 :class="form.hasFallback ? 'translate-x-4' : 'translate-x-0'"
 ></span>
 </button>
 </div>

 <div
 v-if="form.hasFallback"
 class="p-4 rounded-xl border border-warning/30 bg-warning/10 space-y-3 animate-fade-in shadow-2xs"
 >
 <div class="flex items-center gap-1.5 flex-wrap text-xs text-foreground">
 <span>Wait up to</span>
 <input
 type="number"
 min="1"
 v-model.number="form.fallbackTimeout"
 class="w-14 text-xs bg-card border border-border px-2 py-1 rounded-md focus:outline-none text-foreground font-medium"
 />
 <select
 v-model="form.fallbackTimeoutUnit"
 class="text-xs bg-card border border-border px-2 py-1 rounded-md focus:outline-none text-foreground cursor-pointer"
 >
 <option value="minutes">minutes</option>
 <option value="hours">hours</option>
 <option value="days">days</option>
 <option value="weeks">weeks</option>
 </select>
 <span>for a reply. If none comes, run:</span>
 </div>

 <!-- Fallback steps list -->
 <div class="space-y-2">
 <div
 v-for="(fStep, fIdx) in form.fallbackSteps"
 :key="fIdx"
 class="border border-border rounded-lg p-2.5 bg-card space-y-2 shadow-2xs"
 >
 <div class="flex items-center justify-between gap-2">
 <div class="flex items-center gap-2 flex-1">
 <span class="w-5 h-5 rounded-full bg-card text-primary-foreground font-bold text-[10px] flex items-center justify-center shrink-0">
 {{ fIdx + 1 }}
 </span>
 <select
 v-model="fStep.type"
 class="text-xs font-semibold bg-muted border border-border px-2 py-1 rounded-md focus:outline-none text-foreground flex-1"
 >
 <option v-for="act in actionTypeOptions" :key="act" :value="act">{{ act }}</option>
 </select>
 </div>

 <button
 type="button"
 @click="form.fallbackSteps.splice(fIdx, 1)"
 class="p-1 text-muted-foreground hover:text-destructive rounded cursor-pointer"
 >
 <Trash2 class="w-3.5 h-3.5" />
 </button>
 </div>

 <div v-if="['Send a Message', 'Send AI Personalized Message', 'Add a Private Note'].includes(fStep.type)">
 <textarea
 v-model="fStep.payload"
 rows="2"
 placeholder="Enter backup message..."
 class="w-full text-xs bg-muted border border-border p-2 rounded-md focus:outline-none text-foreground placeholder:text-muted-foreground resize-y"
 ></textarea>
 </div>
 </div>
 </div>

 <button
 type="button"
 @click="addFallbackStep"
 class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary font-medium text-xs rounded-lg transition-colors cursor-pointer border border-primary/20 "
 >
 <Plus class="w-3.5 h-3.5" /> Add a fallback step
 </button>
 </div>
 </div>

 </div>

 <!-- ══════════════ PANE 4: REVIEW ══════════════ -->
 <div v-show="currentStep === 4" class="space-y-4 animate-fade-in">
 <div>
 <h3 class="text-base font-bold text-foreground">Review &amp; save</h3>
 <p class="text-xs text-muted-foreground mt-0.5">
 Here's the plain-English version of what you've built.
 </p>
 </div>

 <!-- Review Card -->
 <div class="bg-muted/40 border border-border rounded-2xl p-5 space-y-3 text-xs leading-relaxed">
 <div class="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
 <span class="text-muted-foreground font-semibold">Name</span>
 <span class="sm:col-span-3 font-bold text-foreground">{{ form.name || 'Untitled rule' }}</span>
 </div>

 <div class="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
 <span class="text-muted-foreground font-semibold">Runs</span>
 <span class="sm:col-span-3 text-foreground ">
 {{ form.executionMode === 'auto' ? `Automatically when "${form.triggerEvent}"` : 'Manually — when an agent clicks it inside a conversation' }}
 </span>
 </div>

 <div v-if="form.executionMode === 'auto'" class="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
 <span class="text-muted-foreground font-semibold">Applies to</span>
 <span class="sm:col-span-3 text-foreground ">
 {{ condAll ? 'Every conversation' : form.conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(' and ') }}
 </span>
 </div>

 <div class="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
 <span class="text-muted-foreground font-semibold">Actions</span>
 <div class="sm:col-span-3 space-y-1 text-foreground ">
 <div v-for="(step, sIdx) in form.actionSteps" :key="sIdx" class="flex items-center gap-1.5">
 <span class="font-bold text-muted-foreground">{{ sIdx + 1 }}.</span>
 <span>{{ step.type }}</span>
 <span v-if="step.target" class="text-muted-foreground font-mono text-[11px]">[{{ step.target }}]</span>
 <span v-if="step.wait.enabled" class="text-warning font-medium text-[11px]">(wait {{ step.wait.value }} {{ step.wait.unit }})</span>
 </div>
 </div>
 </div>

 <div v-if="form.hasFallback" class="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
 <span class="text-muted-foreground font-semibold">Fallback</span>
 <span class="sm:col-span-3 text-warning ">
 If no reply after {{ form.fallbackTimeout }} {{ form.fallbackTimeoutUnit }}, run {{ form.fallbackSteps.map(s => s.type).join(', then ') }}
 </span>
 </div>

 <div class="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
 <span class="text-muted-foreground font-semibold">Status</span>
 <span class="sm:col-span-3 inline-flex items-center gap-1.5">
 <span class="w-2 h-2 rounded-full" :class="form.active ? 'bg-success' : 'bg-muted-foreground'"></span>
 <span class="font-bold" :class="form.active ? 'text-success' : 'text-muted-foreground'">{{ form.active ? 'Active' : 'Paused' }}</span>
 </span>
 </div>
 </div>
 </div>

 </div>

 </div>

 <!-- Signature Live Sentence Summary Strip (Pinned above footer) -->
 <div class="px-6 py-2.5 bg-primary/10 border-t border-primary/20 text-xs text-primary flex items-baseline gap-2 shrink-0">
 <span class="px-1.5 py-0.5 rounded bg-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary shrink-0">
 Summary
 </span>
 <span class="line-clamp-1">
 {{ liveSummaryText }}
 </span>
 </div>

 <!-- Modal Footer -->
 <footer class="px-6 py-3.5 border-t border-border flex items-center justify-between bg-card shrink-0">
 <!-- Active Switch -->
 <div class="flex items-center gap-2">
 <button
 type="button"
 @click="form.active = !form.active"
 class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
 :class="form.active ? 'bg-primary' : 'bg-muted '"
 >
 <span
 class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out"
 :class="form.active ? 'translate-x-4' : 'translate-x-0'"
 ></span>
 </button>
 <span class="text-xs font-semibold text-foreground">
 {{ form.active ? 'Active' : 'Paused' }}
 </span>
 </div>

 <!-- Wizard Navigation Action Buttons -->
 <div class="flex items-center gap-2">
 <button
 v-if="currentStep > 1"
 type="button"
 @click="goStep(-1)"
 class="px-3.5 py-1.5 text-muted-foreground hover:text-foreground text-xs font-medium cursor-pointer border border-border rounded-lg hover:bg-muted"
 >
 Back
 </button>

 <button
 type="button"
 @click="showModal = false"
 class="px-3.5 py-1.5 text-muted-foreground hover:text-foreground text-xs font-medium cursor-pointer"
 >
 Cancel
 </button>

 <button
 v-if="currentStep < 4"
 type="button"
 @click="goStep(1)"
 :disabled="!form.name.trim()"
 class="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-lg shadow-2xs cursor-pointer disabled:opacity-50 transition-colors"
 >
 Continue →
 </button>

 <button
 v-else
 type="button"
 @click="saveForm"
 :disabled="!form.name.trim()"
 class="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-lg shadow-2xs cursor-pointer disabled:opacity-50 transition-colors"
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
 Plus, Search, Play, Copy, Pencil, Trash2,
 Clock, Check, X, Filter, ChevronDown
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
 { name: 'Lead Routing', dotColor: 'hsl(var(--info))' },
 { name: 'Escalations', dotColor: 'hsl(var(--destructive))' },
 { name: 'VIP Clients', dotColor: 'hsl(var(--tag-1))' },
 { name: 'SLA Alert', dotColor: 'hsl(var(--warning))' },
 { name: 'Deals', dotColor: 'hsl(var(--primary))' },
 { name: 'WhatsApp', dotColor: 'hsl(var(--success))' },
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
const selectedTags = ref<string[]>([]);
const selectedStatus = ref('all');
const sortBy = ref('created_desc');

// Tag Filter Popover state
const showTagFilterDropdown = ref(false);
const tagFilterRef = ref<HTMLElement | null>(null);

function toggleTagFilter(tagName: string) {
 const index = selectedTags.value.indexOf(tagName);
 if (index > -1) {
 selectedTags.value.splice(index, 1);
 } else {
 selectedTags.value.push(tagName);
 }
}

function clearTagFilters() {
 selectedTags.value = [];
}

function handleClickOutside(e: MouseEvent) {
 if (tagFilterRef.value && !tagFilterRef.value.contains(e.target as Node)) {
 showTagFilterDropdown.value = false;
 }
}

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
 window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
 window.removeEventListener('keydown', handleKeydown);
 window.removeEventListener('click', handleClickOutside);
});

// Format Rule Sentence cleanly
function formatRuleSentence(auto: AutomationRule): string {
 const parts: string[] = [];
 const event = auto.triggerEvent || 'Conversation Created';
 
 if (auto.executionMode === 'manual') {
 parts.push(`When an agent clicks ${auto.name}`);
 } else {
 parts.push(`When ${event.toLowerCase()}`);
 if (auto.conditions && auto.conditions.length > 0) {
 const condStr = auto.conditions.map(c => `${c.field.toLowerCase()} ${c.operator.toLowerCase()} ${c.value}`).join(' and ');
 parts.push(`if ${condStr}`);
 } else if (auto.trigger) {
 parts.push(`if ${auto.trigger.toLowerCase()}`);
 }
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
  return tag ? tag.dotColor : 'hsl(var(--muted-foreground))';
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

 // Tag filter (multi-select checkbox support)
 if (selectedTags.value.length > 0) {
 list = list.filter(a => a.tags.some(t => selectedTags.value.includes(t)));
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

// ═══════════════════ MODAL & STEPPER STATE ═══════════════════
const showModal = ref(false);
const isEditing = ref(false);
const isCloning = ref(false);
const editingId = ref<number | null>(null);

const currentStep = ref<number>(1);
const condAll = ref<boolean>(false);

const form = ref({
 name: '',
 description: '',
 executionMode: 'auto' as 'auto' | 'manual',
 triggerEvent: 'Conversation Created',
 tags: ['Lead Routing'] as string[],
 conditions: [
 { field: 'Status', operator: 'Equal to', value: 'Open' }
 ] as FilterCondition[],
 actionSteps: [
 {
 type: 'Assign to Agent',
 payload: '',
 target: 'Sarah (Senior Sales Rep)',
 wait: { enabled: false, type: 'duration' as const, value: 2, unit: 'days' as const, isEditing: false }
 }
 ] as ActionStep[],
 hasFallback: false,
 fallbackTimeout: 2,
 fallbackTimeoutUnit: 'days',
 fallbackSteps: [
 { type: 'Send an Email to Team', payload: 'Follow up required', target: 'Sales Team' }
 ] as FallbackStep[],
 active: true,
});

function setMode(m: 'auto' | 'manual') {
 form.value.executionMode = m;
}

function goToStep(s: number) {
 if (form.value.executionMode === 'manual' && s === 2) return;
 currentStep.value = s;
}

function goStep(dir: number) {
 let next = currentStep.value + dir;
 if (form.value.executionMode === 'manual' && next === 2) {
 next = dir > 0 ? 3 : 1;
 }
 if (next >= 1 && next <= 4) {
 currentStep.value = next;
 }
}

function toggleModalTag(tagName: string) {
 const idx = form.value.tags.indexOf(tagName);
 if (idx > -1) {
 form.value.tags.splice(idx, 1);
 } else {
 form.value.tags.push(tagName);
 }
}

function addCondition() {
 form.value.conditions.push({
 field: 'Priority',
 operator: 'Equal to',
 value: 'High',
 });
}

function removeCondition(index: number) {
 form.value.conditions.splice(index, 1);
 if (form.value.conditions.length === 0) {
 condAll.value = true;
 }
}

function addStep() {
 form.value.actionSteps.push({
 type: 'Send a Message',
 target: '',
 payload: 'Thanks for contacting us! An agent will be with you shortly.',
 wait: { enabled: false, type: 'duration', value: 2, unit: 'days', isEditing: false }
 });
}

function removeStep(index: number) {
 if (form.value.actionSteps.length > 1) {
 form.value.actionSteps.splice(index, 1);
 } else {
 emit('toast', 'Action Required', 'An automation must have at least 1 action step.', 'warning');
 }
}

function addFallbackStep() {
 form.value.fallbackSteps.push({
 type: 'Send a Message',
 payload: 'Friendly reminder: following up on your inquiry.',
 target: ''
 });
}

// Live sentence preview
const liveSummaryText = computed(() => {
 const name = form.value.name.trim() || 'This rule';
 let txt = '';
 if (form.value.executionMode === 'auto') {
 const ev = form.value.triggerEvent ? form.value.triggerEvent.toLowerCase() : 'a conversation is created';
 txt += `When ${ev}`;
 if (!condAll.value && form.value.conditions.length > 0) {
 const parts = form.value.conditions.map(c => `${c.field.toLowerCase()} ${c.operator.toLowerCase()} "${c.value}"`);
 txt += `, only if ${parts.join(' and ')}`;
 }
 } else {
 txt += `When an agent clicks "${name}"`;
 }

 const actions = form.value.actionSteps.map(s => {
 const waitPart = s.wait && s.wait.enabled ? ` (wait ${s.wait.value} ${s.wait.unit})` : '';
 return s.target ? `${s.type} [${s.target}]${waitPart}` : `${s.type}${waitPart}`;
 });
 if (actions.length) {
 txt += ` → ${actions.join(', then ')}`;
 }

 if (form.value.hasFallback && form.value.fallbackSteps.length > 0) {
 txt += ` | If no reply after ${form.value.fallbackTimeout} ${form.value.fallbackTimeoutUnit} → ${form.value.fallbackSteps.map(s => s.type).join(', then ')}`;
 }

 return txt;
});

function openCreateModal() {
 isEditing.value = false;
 isCloning.value = false;
 editingId.value = null;
 currentStep.value = 1;
 condAll.value = false;

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
 type: 'Assign to Agent',
 payload: '',
 target: 'Sarah (Senior Sales Rep)',
 wait: { enabled: false, type: 'duration', value: 2, unit: 'days', isEditing: false }
 },
 {
 type: 'Send a Message',
 payload: 'Hi {{contact.name}}! Thanks for reaching out — our team will assist you shortly.',
 target: '',
 wait: { enabled: false, type: 'duration', value: 2, unit: 'days', isEditing: false }
 }
 ],
 hasFallback: false,
 fallbackTimeout: 2,
 fallbackTimeoutUnit: 'days',
 fallbackSteps: [
 { type: 'Send an Email to Team', payload: 'Follow up required', target: 'Sales Team' }
 ],
 active: true,
 };
 showModal.value = true;
}

function openEditModal(auto: AutomationRule) {
 isEditing.value = true;
 isCloning.value = false;
 editingId.value = auto.id;
 currentStep.value = 1;
 condAll.value = !auto.conditions || auto.conditions.length === 0;

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
 : [{ type: 'Send an Email to Team', payload: 'Follow up required', target: 'Sales Team' }],
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

 const savedConditions = condAll.value ? [] : JSON.parse(JSON.stringify(form.value.conditions));

 if (isEditing.value && editingId.value) {
 const item = automations.value.find(a => a.id === editingId.value);
 if (item) {
 item.name = form.value.name;
 item.description = form.value.description;
 item.executionMode = form.value.executionMode;
 item.triggerEvent = form.value.triggerEvent;
 item.conditions = savedConditions;
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
 conditions: savedConditions,
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
 background: hsl(var(--border));
 border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
 background: hsl(var(--muted-foreground));
}
</style>
