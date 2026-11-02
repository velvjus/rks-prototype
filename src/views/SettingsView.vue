<template>
 <div class="h-full flex flex-col bg-background overflow-hidden text-sm">
 <div class="flex-1 flex overflow-hidden">

 <!-- ═══════════════════ FIXED LIGHT SETTINGS SIDEBAR ═══════════════════ -->
 <aside class="w-64 bg-card border-r border-border flex flex-col shrink-0 h-full select-none z-10 shadow-xs">
 <!-- Sidebar Header -->
 <div class="px-5 py-4 border-b border-border flex items-center">
 <h2 class="text-sm font-semibold text-foreground tracking-tight">Settings</h2>
 </div>

 <!-- Sidebar Navigation List -->
 <div class="flex-1 overflow-y-auto p-3 space-y-4 custom-settings-scrollbar">
 <!-- Overview & Search Item -->
 <div>
 <button
 @click="switchTab('search')"
 class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left"
 :class="activeTab === 'search' ? 'bg-primary/10 text-primary font-bold shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
 >
 <Search class="w-4 h-4 text-muted-foreground" :class="{ 'text-primary': activeTab === 'search' }" />
 <span class="flex-1">Search Settings</span>
 <span class="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono">⌘K</span>
 </button>
 </div>

 <!-- Groups 1 to 4 -->
 <div v-for="group in settingsGroups" :key="group.id" class="space-y-1">
 <h3 class="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
 {{ group.title }}
 </h3>
 <button
 v-for="item in group.items"
 :key="item.id"
 @click="switchTab(item.id)"
 class="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left"
 :class="activeTab === item.id ? 'bg-primary/10 text-primary font-bold shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'"
 >
 <component
 :is="item.icon"
 class="w-4 h-4 text-muted-foreground shrink-0 transition-colors"
 :class="{ 'text-primary': activeTab === item.id }"
 />
 <span class="flex-1 truncate">{{ item.name }}</span>
 <span v-if="item.badge" class="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
 {{ item.badge }}
 </span>
 </button>
 </div>
 </div>
 </aside>

 <!-- ═══════════════════ MAIN CONTENT CANVAS ═══════════════════ -->
 <main class="flex-1 overflow-y-auto bg-background">
 <div class="max-w-5xl mx-auto px-8 py-8 space-y-6">

 <!-- ══════════════ TAB: SETTINGS SEARCH & DIRECTORY (DEFAULT LANDING) ══════════════ -->
 <div v-if="activeTab === 'search'" class="py-12 max-w-2xl mx-auto space-y-6 animate-fade-in">
 <!-- Center Header -->
 <div class="text-center space-y-1.5 pb-2">
 <h1 class="text-2xl font-semibold text-foreground tracking-tight">Settings Directory</h1>
 <p class="text-xs text-muted-foreground">Quickly find and jump to any workspace configuration or tool.</p>
 </div>

 <!-- Centered Search Bar in Middle -->
 <div class="relative w-full">
 <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
 <input
 v-model="settingsSearchQuery"
 type="text"
 placeholder="Search settings (e.g. WhatsApp, Quotas, SLAs, Webhooks, Billing)..."
 class="w-full pl-11 pr-10 py-3.5 bg-card border border-border rounded-2xl text-xs font-medium text-foreground placeholder:text-muted-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
 v-focus
 />
 <button
 v-if="settingsSearchQuery"
 @click="settingsSearchQuery = ''"
 class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
 >
 <X class="w-4 h-4" />
 </button>
 </div>

 <!-- Live Search Results (When query is present) -->
 <div v-if="settingsSearchQuery.trim()" class="space-y-3 pt-2">
 <div class="flex items-center justify-between">
 <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
 Matching Results ({{ filteredSettingsItems.length }})
 </span>
 <button @click="settingsSearchQuery = ''" class="text-xs font-semibold text-primary hover:underline cursor-pointer">
 Clear search
 </button>
 </div>

 <div v-if="filteredSettingsItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div
 v-for="res in filteredSettingsItems"
 :key="res.id"
 @click="switchTab(res.id)"
 class="p-4 bg-card border border-border hover:border-primary/50 hover:shadow-sm rounded-2xl transition-all cursor-pointer group flex items-start gap-3.5"
 >
 <div class="w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
 <component :is="res.icon" class="w-4 h-4" />
 </div>
 <div class="flex-1 min-w-0">
 <div class="flex items-center justify-between gap-2">
 <h3 class="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
 {{ res.name }}
 </h3>
 <span class="text-[9px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
 {{ res.categoryName }}
 </span>
 </div>
 <p class="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
 {{ res.description }}
 </p>
 </div>
 </div>
 </div>

 <div v-else class="p-10 text-center bg-card border border-border rounded-2xl shadow-xs">
 <Search class="w-8 h-8 text-muted-foreground mx-auto mb-2" />
 <h4 class="text-xs font-semibold text-foreground">No settings found matching "{{ settingsSearchQuery }}"</h4>
 <p class="text-[11px] text-muted-foreground mt-1">Try keywords like 'agents', 'whatsapp', 'rules', 'sla', or 'billing'.</p>
 </div>
 </div>

 <!-- Recently Visited Below Search Bar (When query is empty) -->
 <div v-else class="space-y-3 pt-4">
 <h3 class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Recently Visited</h3>
 <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <button
 v-for="item in [
 { id: 'inboxes', name: 'Inboxes', icon: Inbox, desc: 'Channels & WhatsApp' },
 { id: 'agents', name: 'Agents', icon: User, desc: 'Team & seat roles' },
 { id: 'ai-behaviour', name: 'AI Behaviour', icon: Bot, desc: 'Guardrails & prompts' },
 { id: 'account-settings', name: 'Account Settings', icon: Building, desc: 'General info' }
 ]"
 :key="item.id"
 @click="switchTab(item.id)"
 class="p-4 bg-card border border-border hover:border-primary/50 hover:shadow-xs rounded-2xl text-left cursor-pointer transition-all group"
 >
 <component :is="item.icon" class="w-4 h-4 text-primary mb-2.5" />
 <div class="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{{ item.name }}</div>
 <div class="text-[10px] text-muted-foreground mt-0.5 truncate">{{ item.desc }}</div>
 </button>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: AI ASSISTANTS ══════════════ -->
 <div v-if="activeTab === 'ai-assistants'" class="space-y-6">
 <AIAssistantsTab @toast="addToast" />
 </div>

 <!-- ══════════════ TAB: AI TRAINING HUB ══════════════ -->
 <div v-if="activeTab === 'ai-training'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">AI Training Hub</h1>
 <p class="text-xs text-muted-foreground mt-1">Train your AI on product guides, pricing sheets, and internal SOPs.</p>
 </div>
 <button
 @click="loadDemoFiles"
 class="inline-flex items-center gap-2 px-3 py-1.5 bg-warning/100 text-primary-foreground font-medium text-xs rounded-lg opacity-0 pointer-events-none"
 >
 <Play class="w-3.5 h-3.5 fill-current" />
 Simulate Demo Upload
 </button>
 </div>
 </div>

 <!-- Knowledge Base Table -->
 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <div class="p-4 border-b border-border flex items-center justify-between bg-muted/40">
 <div>
 <h3 class="font-bold text-foreground text-xs uppercase tracking-wider">Knowledge Base Documents</h3>
 <p class="text-[10px] text-muted-foreground mt-0.5">{{ knowledgeDocs.length }} documents • Model version {{ aiModelVersion }}</p>
 </div>
 <div class="flex items-center gap-2">
 <span v-if="aiModelVersion !== 'v0.0'" class="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">Active Model</span>
 <button @click="showAddDocModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors">
 <Plus class="w-3.5 h-3.5" /> Add Document
 </button>
 </div>
 </div>
 <div v-if="knowledgeDocs.length > 0" class="divide-y divide-border">
 <div v-for="doc in knowledgeDocs" :key="doc.id" class="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
 <div class="flex items-center gap-3">
 <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="doc.type === 'pdf' ? 'bg-destructive/10 text-destructive' : 'bg-info/10 text-info'">
 <FileText class="w-5 h-5" />
 </div>
 <div>
 <div class="font-bold text-xs text-foreground">{{ doc.name }}</div>
 <div class="text-[10px] text-muted-foreground mt-0.5">{{ doc.size }} • Added {{ doc.date }} • <span :class="doc.status === 'Trained' ? 'text-primary font-semibold' : 'text-warning font-semibold'">{{ doc.status }}</span></div>
 </div>
 </div>
 <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <button @click="retrainDoc(doc)" class="px-2 py-1 bg-warning/10 hover:bg-warning/20 text-warning font-bold text-[10px] rounded cursor-pointer border border-warning/20">Re-Train</button>
 <button @click="editDocName(doc)" class="p-1.5 text-muted-foreground hover:text-primary rounded cursor-pointer"><Pencil class="w-3.5 h-3.5" /></button>
 <button @click="removeDoc(doc.id)" class="p-1.5 text-muted-foreground hover:text-destructive rounded cursor-pointer"><Trash2 class="w-3.5 h-3.5" /></button>
 </div>
 </div>
 </div>
 <div v-else class="p-8 text-center text-muted-foreground text-xs">No documents added. Drop files below to begin training.</div>
 </div>

 <!-- Training Progress (Switched positions!) -->
 <div v-if="filesList.length > 0" class="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
 <div class="flex items-center justify-between">
 <h3 class="font-bold text-foreground text-xs uppercase tracking-wider">Training Progress</h3>
 <span class="text-xs font-bold" :class="trainingProgress === 100 ? 'text-primary' : 'text-muted-foreground'">
 {{ trainingProgress === 100 ? '✓ AI Trained & Deployed' : `${trainingProgress}% complete` }}
 </span>
 </div>
 <div v-for="file in filesList" :key="file.name" class="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
 <div class="flex items-center gap-3">
 <FileText class="w-7 h-7 text-primary" />
 <div>
 <div class="font-semibold text-xs text-foreground">{{ file.name }}</div>
 <div class="text-[10px] text-muted-foreground mt-0.5">{{ file.size }} • {{ file.status }}</div>
 </div>
 </div>
 <div v-if="file.progress < 100" class="w-20">
 <div class="w-full bg-muted h-1.5 rounded-full overflow-hidden">
 <div class="bg-primary h-full transition-all duration-100" :style="{ width: `${file.progress}%` }"></div>
 </div>
 </div>
 <CheckCircle2 v-else class="w-5 h-5 text-primary shrink-0" />
 </div>
 <div class="w-full bg-muted h-2.5 rounded-full overflow-hidden">
 <div class="bg-primary h-full transition-all duration-300 rounded-full" :style="{ width: `${trainingProgress}%` }"></div>
 </div>
 <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
 <Loader2 v-if="trainingProgress < 100" class="w-3.5 h-3.5 text-primary animate-spin" />
 <CheckCircle2 v-else class="w-3.5 h-3.5 text-primary" />
 {{ trainingStatus }}
 </div>
 </div>

 <!-- Upload Area (Switched positions!) -->
 <div
 @dragover.prevent="isDragging = true"
 @dragleave.prevent="isDragging = false"
 @drop.prevent="handleFileDrop"
 class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[180px] bg-card shadow-sm cursor-pointer"
 :class="isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-border'"
 >
 <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
 <Upload class="w-6 h-6" />
 </div>
 <h3 class="font-bold text-foreground text-sm">Drag & drop knowledge files here</h3>
 <p class="text-xs text-muted-foreground mt-1 max-w-sm">Supports PDF, DOCX, TXT up to 25MB each</p>
 <input type="file" ref="fileInput" class="hidden" multiple @change="handleFileSelect" />
 <button @click="triggerFileInput" class="mt-4 px-4 py-2 bg-muted hover:bg-muted text-foreground font-semibold text-xs rounded-lg cursor-pointer">Browse Files</button>
 </div>
 </div>

 <!-- ══════════════ TAB: AI TRAINING HISTORY ══════════════ -->
 <div v-if="activeTab === 'training-history'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <h1 class="text-xl font-semibold text-foreground tracking-tight">AI Model Training History</h1>
 <p class="text-xs text-muted-foreground mt-1">Audit log of all LLM training runs, document indexings, and deployment states.</p>
 </div>

 <!-- Training History Log -->
 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <div class="p-4 border-b border-border flex items-center justify-between bg-muted/40">
 <h3 class="font-bold text-foreground text-xs uppercase tracking-wider">Training Runs Audit Log</h3>
 <button v-if="trainingHistory.length > 0" @click="trainingHistory = []" class="text-[10px] text-muted-foreground hover:text-destructive cursor-pointer font-bold">Clear All History</button>
 </div>
 <div v-if="trainingHistory.length > 0" class="divide-y divide-border">
 <div v-for="entry in trainingHistory" :key="entry.id" class="px-4 py-3.5 flex items-center justify-between text-xs hover:bg-muted/50 transition-colors">
 <div class="flex items-center gap-3">
 <div class="w-2.5 h-2.5 rounded-full" :class="entry.success ? 'bg-primary animate-pulse' : 'bg-destructive'"></div>
 <div>
 <span class="font-bold text-foreground">{{ entry.action }}</span>
 <span class="text-muted-foreground ml-1.5">Model build version: <strong class="text-foreground font-mono">{{ entry.model }}</strong></span>
 </div>
 </div>
 <div class="flex items-center gap-4">
 <span class="text-[10px] bg-success/10 text-success font-extrabold px-2 py-0.5 rounded-full border border-success/20">Success</span>
 <span class="text-[10px] text-muted-foreground font-mono">{{ entry.time }}</span>
 </div>
 </div>
 </div>
 <div v-else class="p-8 text-center text-muted-foreground text-xs">No training runs recorded yet.</div>
 </div>
 </div>

 <!-- ══════════════ TAB: INBOXES ══════════════ -->
 <div v-if="activeTab === 'inboxes'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Inbox Integrations</h1>
 <p class="text-xs text-muted-foreground mt-1">Connect business channels to your unified inbox for AI-powered routing.</p>
 </div>
 <button
 v-if="activeInboxSubTab === 'channels'"
 @click="openAddChannelWizard"
 class="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
 >
 <Plus class="w-3.5 h-3.5" /> Add Channel
 </button>
 </div>
 </div>

 <!-- Sub Tabs Navigation -->
 <div class="flex border-b border-border pb-px">
 <button
 @click="activeInboxSubTab = 'channels'"
 class="px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
 :class="activeInboxSubTab === 'channels' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'"
 >
 Connected Channels
 </button>
 <button
 @click="activeInboxSubTab = 'rules'"
 class="px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
 :class="activeInboxSubTab === 'rules' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'"
 >
 Inbox Routing Rules
 </button>
 </div>

 <!-- Sub Tab 1: Connected Channels -->
 <div v-if="activeInboxSubTab === 'channels'" class="space-y-6 animate-fade-in">
 <!-- Connected Inboxes Table -->
 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <div class="p-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-foreground text-xs uppercase tracking-wider">Connected Channels</h3>
 <span class="text-xs bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded-full">{{ connectedInboxes.filter(i => i.active).length }} Active</span>
 </div>
 <div class="divide-y divide-border">
 <div v-for="inbox in connectedInboxes" :key="inbox.id" class="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="inbox.colorBg">
 <component :is="inbox.icon" class="w-5 h-5" :class="inbox.colorText" />
 </div>
 <div>
 <div class="font-bold text-xs text-foreground flex items-center gap-2">
 {{ inbox.name }}
 <span v-if="inbox.isDefault" class="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-bold">Default</span>
 </div>
 <div class="text-[10px] text-muted-foreground mt-0.5">{{ inbox.details }} • {{ inbox.type }} • Routed to: <span class="text-muted-foreground font-semibold">{{ inbox.assignedTeam }}</span></div>
 </div>
 </div>
 <div class="flex items-center gap-2">
 <button @click="testInboxConnection(inbox)" class="opacity-0 group-hover:opacity-100 px-2 py-1 bg-info/10 hover:bg-info/20 text-info font-bold text-[10px] rounded cursor-pointer border border-info/20 transition-all">Test</button>
 <button @click="editInbox(inbox)" class="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-primary rounded cursor-pointer transition-all"><Pencil class="w-3.5 h-3.5" /></button>
 <button
 @click="inbox.active = !inbox.active"
 class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
 :class="inbox.active ? 'bg-primary' : 'bg-muted'"
 >
 <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-card shadow ring-0 transition duration-200" :class="inbox.active ? 'translate-x-4' : 'translate-x-0'"></span>
 </button>
 <button @click="removeInbox(inbox.id)" class="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive rounded cursor-pointer transition-all"><Trash2 class="w-3.5 h-3.5" /></button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Sub Tab 2: Routing Rules Panel -->
 <div v-if="activeInboxSubTab === 'rules'" class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-fade-in">
 <div class="p-4 border-b border-border flex items-center justify-between">
 <h3 class="font-bold text-foreground text-xs uppercase tracking-wider">Inbox Routing Rules</h3>
 <button @click="addToast('Routing Rule Added', 'New routing condition applied across inbox channels.', 'success')" class="text-[10px] text-primary font-bold hover:underline cursor-pointer">+ Add Rule</button>
 </div>
 <div class="divide-y divide-border">
 <div v-for="rule in routingRules" :key="rule.id" class="p-4 flex items-center justify-between hover:bg-muted/50">
 <div class="flex items-center gap-2 text-xs">
 <span class="font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px]">IF {{ rule.condition }}</span>
 <span class="text-muted-foreground">→</span>
 <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px]">{{ rule.action }}</span>
 </div>
 <div class="flex items-center gap-2">
 <button @click="rule.active = !rule.active" class="relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors" :class="rule.active ? 'bg-primary' : 'bg-muted'">
 <span class="inline-block h-3 w-3 transform rounded-full bg-card shadow transition duration-200" :class="rule.active ? 'translate-x-4' : 'translate-x-0'"></span>
 </button>
 <button @click="routingRules = routingRules.filter(r => r.id !== rule.id)" class="text-muted-foreground hover:text-destructive cursor-pointer"><Trash2 class="w-3.5 h-3.5" /></button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: CUSTOM TAGS & LABELS ══════════════ -->
 <div v-if="activeTab === 'labels'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Custom Tags & Labels</h1>
 <p class="text-xs text-muted-foreground mt-1">Color-coded tags for deal profiling, lead sorting, and macro triggers.</p>
 </div>
 <div class="flex items-center gap-2">
 <button @click="addToast('Tags Exported', 'Label library exported as tags.json.', 'success')" class="px-3.5 py-2 border border-border hover:bg-muted text-foreground font-medium text-xs rounded-xl cursor-pointer transition-colors">Export</button>
 <button @click="showCreateTagModal = true" class="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl cursor-pointer shadow-xs transition-colors">
 <Plus class="w-3.5 h-3.5" /> New Tag
 </button>
 </div>
 </div>
 </div>

 <!-- Search Bar -->
 <div class="relative">
 <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
 <input v-model="tagSearch" type="text" placeholder="Search labels..." class="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>

 <!-- Tags by Group -->
 <div v-for="group in tagGroups" :key="group.name" class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <div class="p-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-foreground text-xs uppercase tracking-wider">{{ group.name }}</h3>
 <span class="text-[10px] text-muted-foreground font-semibold">{{ filteredLabelsByGroup(group.name).length }} tags</span>
 </div>
 <div class="p-4">
 <div v-if="filteredLabelsByGroup(group.name).length === 0" class="text-[11px] text-muted-foreground italic mb-2">No tags in this group.</div>
 
 <div class="flex flex-wrap items-center gap-2.5">
 <div
 v-for="label in filteredLabelsByGroup(group.name)"
 :key="label.name"
 class="inline-flex items-center gap-1.5 pl-3 pr-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-border group relative select-none hover:pr-10 transition-all duration-200"
 :style="{ backgroundColor: label.colorBg, color: label.colorText }"
 >
 <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: label.colorText }"></span>
 <span class="truncate">{{ label.name }}</span>
 <span class="text-[9px] opacity-60 shrink-0">{{ label.usageCount }} uses</span>
 
 <!-- Hover Actions Overlay -->
 <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/95 rounded-full px-1 py-0.5 border border-border shadow-xs">
 <button @click.stop="editLabel(label)" class="text-muted-foreground hover:text-primary cursor-pointer hover:scale-110 active:scale-95 transition-transform" title="Edit Tag">
 <Pencil class="w-2.5 h-2.5" />
 </button>
 <button @click.stop="removeLabel(label.name)" class="text-muted-foreground hover:text-destructive cursor-pointer hover:scale-110 active:scale-95 transition-transform font-bold text-[9px] px-0.5" title="Delete Tag">✕</button>
 </div>
 </div>

 <!-- Inline Add Tag Input / Trigger -->
 <div class="inline-block">
 <button
 v-if="inlineAddGroup !== group.name"
 @click="startInlineAdd(group.name)"
 class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-sm"
 >
 <Plus class="w-3.5 h-3.5" />
 Add Tag
 </button>
 <div v-else class="flex items-center gap-1.5">
 <input
 type="text"
 v-model="inlineTagName"
 placeholder="Tag name..."
 class="text-xs px-3 py-1 border border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-primary w-32 bg-card"
 @keydown.enter="submitInlineTag(group.name)"
 @keydown.escape="inlineAddGroup = null"
 v-focus
 />
 <button @click="submitInlineTag(group.name)" class="text-xs text-primary font-bold hover:underline cursor-pointer">Add</button>
 <button @click="inlineAddGroup = null" class="text-xs text-muted-foreground hover:text-muted-foreground cursor-pointer">✕</button>
 </div>
 </div>

 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: AUTOMATION ══════════════ -->
 <div v-if="activeTab === 'automation' || activeTab === 'macros'" class="space-y-6">
 <AutomationTab @toast="addToast" />
 </div>

 <!-- ══════════════ TAB: AGENTS ══════════════ -->
 <div v-if="activeTab === 'agents'" class="space-y-6">
 <AgentsTab
 v-model:users="workspaceUsers"
 :roles="workspaceRoles"
 @toast="addToast"
 />
 </div>

 <!-- ══════════════ TAB: TEAMS ══════════════ -->
 <div v-if="activeTab === 'teams'" class="space-y-6">
 <TeamsTab
 v-model:teams="workspaceTeams"
 :users="workspaceUsers"
 @toast="addToast"
 />
 </div>

 <!-- ══════════════ TAB: ROLES ══════════════ -->
 <div v-if="activeTab === 'roles'" class="space-y-6">
 <RolesTab
 v-model:roles="workspaceRoles"
 v-model:users="workspaceUsers"
 @toast="addToast"
 />
 </div>

 <!-- ══════════════ TAB: WEB FORMS ══════════════ -->
 <div v-if="activeTab === 'web-forms'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Web Forms</h1>
 <p class="text-xs text-muted-foreground mt-1">Manage lead capture forms with AI-powered field generation and easy embedding.</p>
 </div>
 <button
 @click="showCreateFormModal = true"
 class="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
 >
 <Plus class="w-3.5 h-3.5" /> Create Form
 </button>
 </div>
 </div>

 <!-- Forms Stats KPI Row -->
 <div class="grid grid-cols-4 gap-4">
 <div v-for="kpi in formKpis" :key="kpi.label" class="bg-card border border-border rounded-xl p-4 shadow-sm">
 <div class="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{{ kpi.label }}</div>
 <div class="text-2xl font-extrabold text-foreground mt-1">{{ kpi.value }}</div>
 <div class="text-[10px] mt-1" :class="kpi.positive ? 'text-primary' : 'text-muted-foreground'">{{ kpi.change }}</div>
 </div>
 </div>

 <!-- Full width Table Format of Web Forms -->
 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <div class="overflow-x-auto">
 <table class="w-full text-left border-collapse text-xs">
 <thead>
 <tr class="border-b border-border bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
 <th class="p-4">Form Name</th>
 <th class="p-4 text-center">Fields</th>
 <th class="p-4 text-center">Leads Captured</th>
 <th class="p-4 text-center">Conv. Rate</th>
 <th class="p-4 text-center">Source Type</th>
 <th class="p-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border font-medium">
 <tr v-for="form in activeWebforms" :key="form.id" class="hover:bg-muted/50 transition-colors">
 <td class="p-4">
 <div class="flex items-center gap-2">
 <span class="font-bold text-foreground text-xs">{{ form.name }}</span>
 <span class="text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0" :class="form.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'">{{ form.active ? 'Active' : 'Paused' }}</span>
 </div>
 <div class="text-[10px] text-muted-foreground font-normal mt-0.5 max-w-sm leading-normal">{{ form.desc }}</div>
 </td>
 <td class="p-4 text-center text-foreground">{{ form.fields.length }} fields</td>
 <td class="p-4 text-center text-foreground font-bold">{{ form.leadsCount }}</td>
 <td class="p-4 text-center text-primary font-bold">{{ form.convRate }}%</td>
 <td class="p-4 text-center whitespace-nowrap">
 <span v-if="form.desc.toLowerCase().includes('ai') || form.name.toLowerCase().includes('enterprise')" class="bg-warning/15 text-warning font-bold px-2 py-0.5 rounded text-[9px] inline-flex items-center gap-1 border border-warning/20 animate-pulse">
 <Sparkles class="w-2.5 h-2.5 fill-current" /> AI Generated
 </span>
 <span v-else class="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[9px]">Standard</span>
 </td>
 <td class="p-4 text-right whitespace-nowrap">
 <div class="flex items-center justify-end gap-1.5">
 <button
 @click="form.active = !form.active; addToast(form.active ? 'Form Activated' : 'Form Paused', `${form.name} status updated.`, 'success')"
 class="px-2 py-1 text-muted-foreground hover:text-primary hover:bg-muted rounded border border-border bg-card font-bold cursor-pointer transition-colors"
 :title="form.active ? 'Pause Form' : 'Activate Form'"
 >
 {{ form.active ? 'Pause' : 'Activate' }}
 </button>
 <button
 @click="showFormEmbedCode(form)"
 class="px-2 py-1 text-primary hover:bg-primary/5 rounded border border-primary/20 bg-card font-bold cursor-pointer transition-colors"
 >
 Embed Code
 </button>
 <button
 @click="duplicateForm(form)"
 class="p-1 text-muted-foreground hover:text-primary hover:bg-muted rounded cursor-pointer transition-colors"
 title="Duplicate"
 >
 <Copy class="w-3.5 h-3.5" />
 </button>
 <button
 @click="removeWebform(form.id)"
 class="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded cursor-pointer transition-colors"
 title="Delete"
 >
 <Trash2 class="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: ACCOUNT SETTINGS ══════════════ -->
 <div v-if="activeTab === 'account-settings'" class="space-y-6 animate-fade-in">
 <!-- Header matching screenshot: General info -->
 <div class="border-b border-border pb-5">
 <h1 class="text-xl font-semibold text-foreground tracking-tight">General info</h1>
 <p class="text-xs text-muted-foreground mt-1">Change general Workspace-level settings.</p>
 </div>

 <!-- Form Card -->
 <div class="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 w-full">
 <!-- Workspace Name -->
 <div class="space-y-1.5">
 <label class="block text-xs font-semibold text-foreground">Workspace Name</label>
 <input
 v-model="workspaceName"
 type="text"
 class="w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
 />
 </div>

 <!-- User Inactivity Timeout -->
 <div class="space-y-1.5">
 <div class="flex items-center gap-1.5">
 <label class="block text-xs font-semibold text-foreground">User Inactivity Timeout</label>
 <Info class="w-3.5 h-3.5 text-muted-foreground" title="Minutes of inactivity before logging out an idle session" />
 </div>
 <input
 v-model.number="inactivityTimeout"
 type="number"
 class="w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
 />
 </div>

 <!-- Time Zone -->
 <div class="space-y-1.5">
 <div class="flex items-center gap-1.5">
 <label class="block text-xs font-semibold text-foreground">Time Zone</label>
 <Info class="w-3.5 h-3.5 text-muted-foreground" title="Primary operating timezone for SLAs and business hours" />
 </div>
 <div class="relative">
 <select
 v-model="timeZone"
 class="w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-xs font-medium text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
 >
 <option value="(GMT+08:00) Asia/Kuala_Lumpur">(GMT+08:00) Asia/Kuala_Lumpur</option>
 <option value="(GMT+08:00) Asia/Singapore">(GMT+08:00) Asia/Singapore</option>
 <option value="(GMT+07:00) Asia/Jakarta">(GMT+07:00) Asia/Jakarta</option>
 <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
 <option value="(GMT-05:00) America/New_York">(GMT-05:00) America/New_York</option>
 </select>
 <ChevronRight class="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
 </div>
 </div>

 <!-- Weekly Recap Email Box -->
 <div class="border border-border rounded-xl p-5 space-y-4 bg-muted/50">
 <div class="flex items-start justify-between gap-4">
 <div>
 <h3 class="text-xs font-bold text-foreground">Weekly Recap Email</h3>
 <p class="text-[11px] text-muted-foreground mt-0.5 max-w-lg leading-relaxed">
 Choose whether you'd like to receive a weekly email summary of your Conversations and Lifecycle performance every Monday.
 </p>
 </div>
 <!-- Switch Toggle -->
 <button
 type="button"
 @click="weeklyRecapEnabled = !weeklyRecapEnabled"
 class="w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none shrink-0"
 :class="weeklyRecapEnabled ? 'bg-primary' : 'bg-muted'"
 >
 <div
 class="w-4 h-4 rounded-full bg-card transition-transform duration-200 ease-in-out shadow-xs"
 :class="weeklyRecapEnabled ? 'translate-x-5' : 'translate-x-0'"
 ></div>
 </button>
 </div>

 <!-- Recipient(s) -->
 <div v-if="weeklyRecapEnabled" class="space-y-2 pt-2 border-t border-border">
 <label class="block text-[11px] font-semibold text-foreground">Recipient(s)</label>
 <div class="flex flex-wrap items-center gap-2">
 <span
 v-for="rec in recapRecipients"
 :key="rec"
 class="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-border rounded-lg text-xs text-foreground shadow-2xs font-medium"
 >
 <span>{{ rec }}</span>
 <button
 type="button"
 @click="removeRecipient(rec)"
 class="text-muted-foreground hover:text-foreground cursor-pointer"
 >
 <X class="w-3 h-3" />
 </button>
 </span>

 <!-- Add chip -->
 <div v-if="showAddRecipientInput" class="inline-flex items-center gap-1">
 <input
 v-model="newRecipientName"
 @keydown.enter.prevent="addRecipient"
 type="text"
 placeholder="Name or Email"
 class="px-2 py-1 text-xs border border-primary rounded-lg focus:outline-none w-32"
 v-focus
 />
 <button @click="addRecipient" class="p-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-[10px] font-bold">Add</button>
 <button @click="showAddRecipientInput = false" class="p-1 text-muted-foreground hover:text-foreground"><X class="w-3.5 h-3.5" /></button>
 </div>
 <button
 v-else
 type="button"
 @click="showAddRecipientInput = true"
 class="w-7 h-7 rounded-lg border border-dashed border-border hover:border-border flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold transition-colors cursor-pointer"
 >
 <Plus class="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 <!-- Save Changes Button -->
 <div class="pt-2 flex justify-end">
 <button
 type="button"
 @click="addToast('Settings Saved', 'General workspace configuration updated.', 'success')"
 class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
 >
 Save Changes
 </button>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: CANNED RESPONSES (MACROS) ══════════════ -->
 <div v-if="activeTab === 'canned-responses'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Canned Responses & Macros</h1>
 <p class="text-xs text-muted-foreground mt-1">Pre-saved message templates with dynamic shortcut triggers (e.g. /pricing, /welcome).</p>
 </div>
 <button
 @click="showAddCannedModal = true"
 class="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
 >
 <Plus class="w-3.5 h-3.5" /> New Canned Response
 </button>
 </div>
 </div>

 <!-- Filters -->
 <div class="flex items-center justify-between gap-4 bg-card p-3 border border-border rounded-xl shadow-xs">
 <div class="flex items-center gap-1 bg-muted p-1 rounded-lg">
 <button
 v-for="cat in ['All', 'Sales', 'General', 'Finance']"
 :key="cat"
 @click="cannedCategory = cat"
 class="px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer"
 :class="cannedCategory === cat ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'"
 >
 {{ cat }}
 </button>
 </div>
 <div class="relative w-64">
 <Search class="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 v-model="cannedSearch"
 type="text"
 placeholder="Filter snippets or shortcuts..."
 class="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
 />
 </div>
 </div>

 <!-- Cards List -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div
 v-for="snippet in filteredCannedResponses"
 :key="snippet.id"
 class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-border transition-colors"
 >
 <div class="space-y-2">
 <div class="flex items-center justify-between">
 <div class="flex items-center gap-2">
 <span class="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
 {{ snippet.shortcut }}
 </span>
 <span class="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
 {{ snippet.category }}
 </span>
 </div>
 <span class="text-[10px] text-muted-foreground font-medium">{{ snippet.uses }} times used</span>
 </div>
 <h3 class="text-xs font-bold text-foreground">{{ snippet.title }}</h3>
 <p class="text-xs text-muted-foreground leading-relaxed font-sans bg-muted/50 p-3 rounded-xl border border-border">
 {{ snippet.content }}
 </p>
 </div>

 <div class="flex items-center justify-end gap-2 pt-3 border-t border-border mt-4">
 <button
 @click="addToast('Snippet Copied', `Shortcut ${snippet.shortcut} ready to paste.`, 'success')"
 class="p-1 text-muted-foreground hover:text-primary rounded cursor-pointer"
 title="Copy Content"
 >
 <Copy class="w-3.5 h-3.5" />
 </button>
 <button
 @click="cannedResponses = cannedResponses.filter(c => c.id !== snippet.id); addToast('Snippet Deleted', 'Macro removed.', 'warning')"
 class="p-1 text-muted-foreground hover:text-destructive rounded cursor-pointer"
 title="Delete"
 >
 <Trash2 class="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: CUSTOM ATTRIBUTES ══════════════ -->
 <div v-if="activeTab === 'custom-attributes'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Custom Attributes</h1>
 <p class="text-xs text-muted-foreground mt-1">Extend standard CRM records with custom data fields for Contacts, Companies, and Deals.</p>
 </div>
 <button
 @click="addToast('Attribute Builder', 'Custom field definition ready.', 'success')"
 class="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
 >
 <Plus class="w-3.5 h-3.5" /> Add Attribute
 </button>
 </div>
 </div>

 <div class="flex items-center gap-1 bg-card p-2 border border-border rounded-xl shadow-xs w-fit">
 <button
 v-for="ent in ['All', 'Contact', 'Company', 'Deal']"
 :key="ent"
 @click="attributeEntityFilter = ent"
 class="px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
 :class="attributeEntityFilter === ent ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
 >
 {{ ent }}s
 </button>
 </div>

 <!-- Table -->
 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <table class="w-full text-left border-collapse text-xs">
 <thead>
 <tr class="border-b border-border bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
 <th class="p-4">Attribute Name</th>
 <th class="p-4">Field Key</th>
 <th class="p-4">Target Entity</th>
 <th class="p-4">Data Type</th>
 <th class="p-4 text-center">Required</th>
 <th class="p-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border font-medium">
 <tr v-for="attr in filteredCustomAttributes" :key="attr.id" class="hover:bg-muted/50">
 <td class="p-4 font-bold text-foreground">{{ attr.name }}</td>
 <td class="p-4 font-mono text-[11px] text-muted-foreground">{{ attr.key }}</td>
 <td class="p-4">
 <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-muted text-foreground">
 {{ attr.entity }}
 </span>
 </td>
 <td class="p-4">
 <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold border border-border text-muted-foreground">
 {{ attr.type }}
 </span>
 </td>
 <td class="p-4 text-center">
 <span v-if="attr.required" class="text-[10px] text-destructive bg-destructive/10 px-2 py-0.5 rounded font-bold">Yes</span>
 <span v-else class="text-[10px] text-muted-foreground">Optional</span>
 </td>
 <td class="p-4 text-right">
 <button class="p-1 text-muted-foreground hover:text-primary rounded cursor-pointer mr-1"><Pencil class="w-3.5 h-3.5" /></button>
 <button @click="customAttributesList = customAttributesList.filter(a => a.id !== attr.id); addToast('Attribute Removed', `${attr.name} deleted.`, 'warning')" class="p-1 text-muted-foreground hover:text-destructive rounded cursor-pointer"><Trash2 class="w-3.5 h-3.5" /></button>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- ══════════════ TAB: SLA POLICIES ══════════════ -->
 <div v-if="activeTab === 'sla'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Service Level Agreements (SLA)</h1>
 <p class="text-xs text-muted-foreground mt-1">Define response benchmarks, resolution targets, and automatic escalation pathways.</p>
 </div>
 <button
 @click="addToast('SLA Saved', 'Service Level Agreement targets updated.', 'success')"
 class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
 >
 Save SLA Settings
 </button>
 </div>
 </div>

 <!-- Priority Tiers -->
 <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div
 v-for="policy in slaPolicies"
 :key="policy.id"
 class="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4"
 >
 <div class="flex items-center justify-between">
 <span class="text-xs font-black uppercase px-2.5 py-0.5 rounded border" :class="policy.badgeColor">
 {{ policy.priority }} Priority
 </span>
 <span class="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
 </div>

 <div class="space-y-3 pt-2">
 <div>
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">First Response Target</label>
 <input v-model="policy.firstResponse" type="text" class="w-full text-xs font-bold text-foreground border border-border bg-muted/40 px-3 py-1.5 rounded-lg" />
 </div>
 <div>
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Resolution Target</label>
 <input v-model="policy.resolveTime" type="text" class="w-full text-xs font-bold text-foreground border border-border bg-muted/40 px-3 py-1.5 rounded-lg" />
 </div>
 <div>
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Breach Escalation</label>
 <input v-model="policy.escalation" type="text" class="w-full text-xs text-foreground border border-border bg-muted/40 px-3 py-1.5 rounded-lg" />
 </div>
 </div>
 </div>
 </div>

 <!-- Business Hours Schedule -->
 <div class="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
 <h3 class="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
 <Clock class="w-4 h-4 text-primary" />
 Operational Business Hours
 </h3>
 <p class="text-xs text-muted-foreground">SLA timers pause automatically outside of defined operational business hours.</p>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
 <div>
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Operating Days</label>
 <div class="flex flex-wrap gap-2">
 <span v-for="d in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="d" class="px-2.5 py-1 text-xs rounded-lg font-bold cursor-pointer transition-colors" :class="d !== 'Sat' && d !== 'Sun' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'">
 {{ d }}
 </span>
 </div>
 </div>
 <div class="flex items-center gap-3">
 <div class="flex-1">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Start Time</label>
 <input v-model="businessHoursStart" type="time" class="w-full text-xs border border-border rounded-lg p-2 font-sans font-medium" />
 </div>
 <div class="flex-1">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">End Time</label>
 <input v-model="businessHoursEnd" type="time" class="w-full text-xs border border-border rounded-lg p-2 font-sans font-medium" />
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: REVENUE TARGETS ══════════════ -->
 <div v-if="activeTab === 'revenue-targets'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Revenue Targets & Pipeline Quotas</h1>
 <p class="text-xs text-muted-foreground mt-1">Assign sales quotas, track closed-won attainment percentages, and monitor team benchmarks.</p>
 </div>
 <button
 @click="addToast('Quotas Updated', 'Monthly targets saved across all agents.', 'success')"
 class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
 >
 Save Quotas
 </button>
 </div>
 </div>

 <!-- KPI Row -->
 <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div class="bg-card border border-border rounded-2xl p-5 shadow-xs">
 <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Monthly Team Goal</span>
 <div class="text-2xl font-bold text-foreground mt-1 font-sans tabular-nums">RM {{ monthlyRevenueTarget.toLocaleString() }}</div>
 <div class="text-[10px] text-muted-foreground mt-1">Target for September 2026</div>
 </div>
 <div class="bg-card border border-border rounded-2xl p-5 shadow-xs">
 <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Closed Revenue So Far</span>
 <div class="text-2xl font-bold text-success mt-1 font-sans tabular-nums">RM {{ currentAchievedRevenue.toLocaleString() }}</div>
 <div class="text-[10px] text-success font-bold mt-1">✔ 26 deals closed this month</div>
 </div>
 <div class="bg-card border border-border rounded-2xl p-5 shadow-xs">
 <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Attainment</span>
 <div class="text-2xl font-bold text-primary mt-1 font-sans tabular-nums">73.8%</div>
 <div class="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
 <div class="bg-primary h-full rounded-full" style="width: 73.8%"></div>
 </div>
 </div>
 </div>

 <!-- Agent Quota Breakdown Table -->
 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <div class="p-4 border-b border-border bg-muted/40">
 <h3 class="text-xs font-bold text-foreground uppercase tracking-wider">Agent Quota Breakdown</h3>
 </div>
 <table class="w-full text-left border-collapse text-xs">
 <thead>
 <tr class="border-b border-border bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
 <th class="p-4">Sales Agent</th>
 <th class="p-4">Monthly Quota</th>
 <th class="p-4">Closed Revenue</th>
 <th class="p-4 text-center">Deals Won</th>
 <th class="p-4">Quota Attainment</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border font-medium">
 <tr v-for="agent in agentQuotas" :key="agent.id" class="hover:bg-muted/50">
 <td class="p-4">
 <div class="flex items-center gap-2.5">
 <img :src="agent.avatar" class="w-7 h-7 rounded-full object-cover border border-border shadow-2xs" />
 <span class="font-bold text-foreground">{{ agent.agent }}</span>
 </div>
 </td>
 <td class="p-4 font-sans font-semibold text-foreground tabular-nums">RM {{ agent.quota.toLocaleString() }}</td>
 <td class="p-4 font-sans font-bold text-success tabular-nums">RM {{ agent.closed.toLocaleString() }}</td>
 <td class="p-4 text-center font-semibold text-foreground tabular-nums">{{ agent.deals }}</td>
 <td class="p-4">
 <div class="flex items-center gap-3">
 <div class="w-28 bg-muted h-2 rounded-full overflow-hidden">
 <div class="bg-primary h-full rounded-full" :style="{ width: `${Math.min(100, Math.round((agent.closed / agent.quota) * 100))}%` }"></div>
 </div>
 <span class="font-sans text-xs font-semibold text-foreground tabular-nums">
 {{ Math.round((agent.closed / agent.quota) * 100) }}%
 </span>
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- ══════════════ TAB: AI BEHAVIOUR ══════════════ -->
 <div v-if="activeTab === 'ai-behaviour'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">AI Behaviour & Guardrails</h1>
 <p class="text-xs text-muted-foreground mt-1">Control how your AI copilot persona responds, qualifies leads, and complies with safety policies.</p>
 </div>
 <button
 @click="addToast('AI Guardrails Updated', 'System prompt and policies saved.', 'success')"
 class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
 >
 Save Behaviour
 </button>
 </div>
 </div>

 <div class="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 w-full">
 <!-- Persona Name -->
 <div class="space-y-1.5">
 <label class="block text-xs font-bold text-foreground uppercase tracking-wider">AI Persona Name</label>
 <input v-model="aiPersonaName" type="text" class="w-full text-xs font-bold px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>

 <!-- System Instructions -->
 <div class="space-y-1.5">
 <div class="flex items-center justify-between">
 <label class="block text-xs font-bold text-foreground uppercase tracking-wider">System Instructions & Prompt</label>
 <span class="text-[10px] text-muted-foreground font-mono">{{ aiSystemInstructions.length }} characters</span>
 </div>
 <textarea
 v-model="aiSystemInstructions"
 rows="4"
 class="w-full p-3 text-xs text-foreground border border-border rounded-xl leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary font-sans"
 ></textarea>
 </div>

 <!-- Tone of Voice -->
 <div class="space-y-1.5">
 <label class="block text-xs font-bold text-foreground uppercase tracking-wider">Tone of Voice</label>
 <div class="grid grid-cols-3 gap-3">
 <button
 v-for="t in ['Professional & Consultative', 'Friendly & Warm', 'Direct & Concise']"
 :key="t"
 @click="aiTone = t"
 class="p-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all"
 :class="aiTone === t ? 'border-primary bg-primary/10 text-primary shadow-xs' : 'border-border text-muted-foreground hover:bg-muted'"
 >
 {{ t }}
 </button>
 </div>
 </div>

 <!-- Guardrails -->
 <div class="space-y-4 pt-4 border-t border-border">
 <h3 class="text-xs font-bold text-foreground uppercase tracking-wider">Operational Guardrails</h3>
 
 <div class="flex items-center justify-between p-3.5 bg-muted/50 rounded-xl border border-border">
 <div>
 <div class="text-xs font-bold text-foreground">Maximum Allowed Discount Limit</div>
 <div class="text-[10px] text-muted-foreground">AI will refuse to offer concessions beyond this percentage threshold.</div>
 </div>
 <div class="flex items-center gap-1">
 <input v-model.number="maxDiscountAllowed" type="number" class="w-16 text-xs text-right font-bold border border-border rounded-lg p-1.5 bg-card" />
 <span class="text-xs font-bold text-muted-foreground">%</span>
 </div>
 </div>

 <div class="flex items-center justify-between p-3.5 bg-muted/50 rounded-xl border border-border">
 <div>
 <div class="text-xs font-bold text-foreground">Escalate Angry or Hostile Sentiment</div>
 <div class="text-[10px] text-muted-foreground">Instantly release conversation from AI bot to on-duty human supervisor.</div>
 </div>
 <button
 type="button"
 @click="escalateAngrySentiment = !escalateAngrySentiment"
 class="w-10 h-6 rounded-full p-1 transition-colors cursor-pointer"
 :class="escalateAngrySentiment ? 'bg-primary' : 'bg-muted'"
 >
 <div class="w-4 h-4 rounded-full bg-card transition-transform" :class="escalateAngrySentiment ? 'translate-x-4' : 'translate-x-0'"></div>
 </button>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: AI INBOXES ══════════════ -->
 <div v-if="activeTab === 'ai-inboxes'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">AI Inboxes Enablement</h1>
 <p class="text-xs text-muted-foreground mt-1">Toggle automated AI responses or suggestion draft modes per connected channel.</p>
 </div>
 <button
 @click="addToast('Inboxes Updated', 'Channel AI copilot settings saved.', 'success')"
 class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
 >
 Save Settings
 </button>
 </div>
 </div>

 <div class="space-y-4 w-full">
 <div
 v-for="inb in aiInboxConfigs"
 :key="inb.id"
 class="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4"
 >
 <div class="flex items-center gap-3.5">
 <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="inb.color">
 <component :is="inb.icon" class="w-5 h-5" />
 </div>
 <div>
 <h3 class="text-xs font-bold text-foreground">{{ inb.name }}</h3>
 <div class="text-[11px] text-muted-foreground mt-0.5">Mode: <span class="font-semibold text-foreground">{{ inb.mode }}</span> • Min confidence: {{ inb.threshold }}%</div>
 </div>
 </div>

 <div class="flex items-center gap-4">
 <select v-model="inb.mode" class="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-muted/50 font-medium">
 <option value="Auto-Pilot (Direct Replies)">Auto-Pilot (Direct)</option>
 <option value="Copilot (Draft Suggestions Only)">Copilot (Drafts)</option>
 <option value="Disabled">Disabled</option>
 </select>
 <button
 type="button"
 @click="inb.enabled = !inb.enabled"
 class="w-10 h-6 rounded-full p-1 transition-colors cursor-pointer"
 :class="inb.enabled ? 'bg-primary' : 'bg-muted'"
 >
 <div class="w-4 h-4 rounded-full bg-card transition-transform" :class="inb.enabled ? 'translate-x-4' : 'translate-x-0'"></div>
 </button>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: AI PLAYGROUND ══════════════ -->
 <div v-if="activeTab === 'ai-playground'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">AI Testing Playground</h1>
 <p class="text-xs text-muted-foreground mt-1">Test knowledge retrieval, inspect citations, and verify model answers in a sandbox.</p>
 </div>
 <button
 @click="playgroundMessages = []"
 class="px-3.5 py-2 border border-border hover:bg-muted text-foreground font-medium text-xs rounded-xl cursor-pointer transition-colors"
 >
 Clear Chat
 </button>
 </div>
 </div>

 <!-- Chat Preview Canvas -->
 <div class="bg-card border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px] w-full">
 <!-- Messages -->
 <div class="flex-1 p-5 overflow-y-auto space-y-4 bg-muted/50">
 <div v-if="playgroundMessages.length === 0" class="text-center text-muted-foreground text-xs py-20">
 Send a test query below to simulate knowledgebase answer generation.
 </div>
 <div
 v-for="msg in playgroundMessages"
 :key="msg.id"
 class="flex flex-col"
 :class="msg.role === 'user' ? 'items-end' : 'items-start'"
 >
 <div
 class="max-w-md p-3.5 rounded-2xl text-xs leading-relaxed"
 :class="msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-xs' : 'bg-card border border-border text-foreground shadow-2xs rounded-bl-xs'"
 >
 <p>{{ msg.text }}</p>
 <div v-if="msg.citations" class="mt-2.5 pt-2 border-t border-border flex flex-wrap gap-1">
 <span class="text-[9px] text-muted-foreground font-bold uppercase block w-full">Citations:</span>
 <span v-for="c in msg.citations" :key="c" class="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded font-mono font-medium">
 {{ c }}
 </span>
 </div>
 </div>
 <span v-if="msg.latency" class="text-[9px] text-muted-foreground font-mono mt-1">Latency: {{ msg.latency }} • Confidence: {{ msg.confidence }}%</span>
 </div>

 <div v-if="isPlaygroundThinking" class="flex items-center gap-2 text-xs text-muted-foreground p-2">
 <Loader2 class="w-4 h-4 animate-spin text-primary" /> Generating consultative reply...
 </div>
 </div>

 <!-- Input bar -->
 <div class="p-3 border-t border-border bg-card flex items-center gap-2">
 <input
 v-model="playgroundQuery"
 @keydown.enter="sendPlaygroundMessage"
 type="text"
 placeholder="Ask anything (e.g. 'What is our refund window for enterprise clients?')..."
 class="flex-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
 />
 <button
 @click="sendPlaygroundMessage"
 :disabled="!playgroundQuery.trim() || isPlaygroundThinking"
 class="p-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-xl cursor-pointer"
 >
 <Send class="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: INTEGRATIONS ══════════════ -->
 <div v-if="activeTab === 'integrations'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Integrations & Connected Apps</h1>
 <p class="text-xs text-muted-foreground mt-1">Connect external platforms to synchronize contacts, orders, payments, and calendar bookings.</p>
 </div>
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 <div
 v-for="app in integrationsCatalog"
 :key="app.id"
 class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
 >
 <div class="space-y-3">
 <div class="flex items-center justify-between">
 <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs" :class="app.iconBg">
 {{ app.name.slice(0, 2).toUpperCase() }}
 </div>
 <span
 class="text-[10px] font-bold px-2 py-0.5 rounded-full"
 :class="app.connected ? 'bg-success/10 text-success border border-success/20' : 'bg-muted text-muted-foreground'"
 >
 {{ app.connected ? 'Connected' : 'Available' }}
 </span>
 </div>
 <div>
 <h3 class="text-xs font-bold text-foreground">{{ app.name }}</h3>
 <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">{{ app.desc }}</p>
 </div>
 </div>

 <div class="pt-4 border-t border-border mt-4 flex items-center justify-between">
 <span class="text-[9px] font-semibold text-muted-foreground uppercase">{{ app.category }}</span>
 <button
 @click="app.connected = !app.connected; addToast(app.connected ? 'App Connected' : 'App Disconnected', `${app.name} integration updated.`, 'success')"
 class="text-xs font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer"
 :class="app.connected ? 'border-border text-muted-foreground hover:bg-muted' : 'bg-primary text-primary-foreground border-primary'"
 >
 {{ app.connected ? 'Configure' : 'Connect' }}
 </button>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: WEBHOOKS ══════════════ -->
 <div v-if="activeTab === 'webhooks'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Webhooks</h1>
 <p class="text-xs text-muted-foreground mt-1">Send real-time HTTP event payloads to external servers when conversations or deals change.</p>
 </div>
 <button
 @click="addToast('Webhook Endpoint', 'New webhook endpoint registered.', 'success')"
 class="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
 >
 <Plus class="w-3.5 h-3.5" /> Add Webhook
 </button>
 </div>
 </div>

 <div class="space-y-4 w-full">
 <div
 v-for="wh in webhooksList"
 :key="wh.id"
 class="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3"
 >
 <div class="flex items-center justify-between">
 <div class="flex items-center gap-2">
 <span class="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
 <h3 class="text-xs font-bold text-foreground">{{ wh.name }}</h3>
 <span class="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded font-bold">{{ wh.successRate }} Delivery</span>
 </div>
 <div class="flex items-center gap-2">
 <button
 @click="addToast('Test Ping Dispatched', `Payload sent to ${wh.name}. 200 OK received.`, 'success')"
 class="px-2.5 py-1 text-xs border border-border hover:bg-muted rounded-lg text-muted-foreground font-bold cursor-pointer"
 >
 Test Ping
 </button>
 <button
 @click="webhooksList = webhooksList.filter(w => w.id !== wh.id); addToast('Webhook Deleted', 'Endpoint removed.', 'warning')"
 class="p-1 text-muted-foreground hover:text-destructive cursor-pointer"
 >
 <Trash2 class="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 <div class="font-mono text-xs text-foreground bg-muted/50 p-2.5 rounded-xl border border-border truncate">
 {{ wh.url }}
 </div>

 <div class="flex items-center gap-2 pt-1">
 <span class="text-[10px] font-bold text-muted-foreground uppercase">Subscribed Events:</span>
 <span v-for="ev in wh.events" :key="ev" class="text-[10px] bg-muted text-foreground px-2 py-0.5 rounded-md font-mono">
 {{ ev }}
 </span>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: MARKETPLACE ══════════════ -->
 <div v-if="activeTab === 'marketplace'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Marketplace</h1>
 <p class="text-xs text-muted-foreground mt-1">Discover vetted add-on apps, power tools, and community plugins.</p>
 </div>
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div
 v-for="mp in marketplaceApps"
 :key="mp.id"
 class="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-start justify-between gap-4"
 >
 <div class="space-y-2 flex-1">
 <div class="flex items-center gap-2">
 <h3 class="text-xs font-bold text-foreground">{{ mp.name }}</h3>
 <span class="text-[10px] text-warning bg-warning/10 px-1.5 py-0.2 rounded font-bold">★ {{ mp.rating }}</span>
 </div>
 <p class="text-[11px] text-muted-foreground leading-relaxed">{{ mp.desc }}</p>
 <div class="text-[10px] text-muted-foreground">By {{ mp.author }}</div>
 </div>
 <button
 @click="mp.installed = !mp.installed; addToast(mp.installed ? 'App Installed' : 'App Removed', `${mp.name} updated.`, 'success')"
 class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
 :class="mp.installed ? 'border border-border text-muted-foreground bg-muted/50' : 'bg-primary text-primary-foreground shadow-xs'"
 >
 {{ mp.installed ? 'Installed' : 'Install' }}
 </button>
 </div>
 </div>
 </div>

 <!-- ══════════════ TAB: AUDIT LOGS ══════════════ -->
 <div v-if="activeTab === 'audit-logs'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Security & Audit Logs</h1>
 <p class="text-xs text-muted-foreground mt-1">Immutable record of administrative actions, data exports, permissions, and security logins.</p>
 </div>
 <button
 @click="addToast('Audit Export', 'CSV security log generated.', 'success')"
 class="px-3.5 py-2 border border-border hover:bg-muted text-foreground font-medium text-xs rounded-xl cursor-pointer transition-colors"
 >
 Export CSV
 </button>
 </div>
 </div>

 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <table class="w-full text-left border-collapse text-xs">
 <thead>
 <tr class="border-b border-border bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
 <th class="p-4">User</th>
 <th class="p-4">Action</th>
 <th class="p-4">Details</th>
 <th class="p-4">Timestamp</th>
 <th class="p-4">IP Address</th>
 <th class="p-4 text-center">Status</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border font-medium">
 <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-muted/50">
 <td class="p-4 font-bold text-foreground">{{ log.user }}</td>
 <td class="p-4 font-semibold text-foreground">{{ log.action }}</td>
 <td class="p-4 text-muted-foreground">{{ log.details }}</td>
 <td class="p-4 font-sans tabular-nums text-[11px] text-muted-foreground">{{ log.time }}</td>
 <td class="p-4 font-sans tabular-nums text-[11px] text-muted-foreground">{{ log.ip }}</td>
 <td class="p-4 text-center">
 <span class="text-[10px] bg-success/10 text-success font-bold px-2 py-0.5 rounded-full">
 {{ log.status }}
 </span>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- ══════════════ TAB: BILLING ══════════════ -->
 <div v-if="activeTab === 'billing'" class="space-y-6 animate-fade-in">
 <div class="border-b border-border pb-5">
 <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 class="text-xl font-semibold text-foreground tracking-tight">Billing & Subscriptions</h1>
 <p class="text-xs text-muted-foreground mt-1">Manage your active subscription plan, seats count, payment cards, and download invoices.</p>
 </div>
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
 <!-- Plan Card -->
 <div class="bg-gradient-to-br from-card to-muted text-primary-foreground rounded-2xl p-6 shadow-md md:col-span-2 space-y-4">
 <div class="flex items-center justify-between">
 <span class="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">Active Plan</span>
 <span class="text-xs text-muted-foreground">Renews {{ billingPlan.renewalDate }}</span>
 </div>
 <div>
 <h3 class="text-xl font-bold">{{ billingPlan.name }}</h3>
 <div class="text-2xl font-bold mt-1 text-primary-foreground font-sans tabular-nums">{{ billingPlan.price }} <span class="text-xs text-muted-foreground font-sans font-normal">/ month</span></div>
 </div>
 <div class="pt-2 border-t border-border flex items-center justify-between">
 <div class="text-xs text-muted-foreground">
 <span class="font-bold text-primary-foreground">{{ billingPlan.activeSeats }}</span> of {{ billingPlan.totalSeats }} seats in use
 </div>
 <button @click="addToast('Seat Upgrade', 'Additional agent seats unlocked.', 'success')" class="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs rounded-xl cursor-pointer">
 Upgrade Seats
 </button>
 </div>
 </div>

 <!-- Payment Method -->
 <div class="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-3 flex flex-col justify-between">
 <div class="space-y-2">
 <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Method</span>
 <div class="flex items-center gap-2.5 pt-1">
 <CreditCard class="w-5 h-5 text-primary" />
 <span class="text-xs font-bold text-foreground">{{ billingPlan.card }}</span>
 </div>
 <div class="text-[10px] text-muted-foreground">Expires {{ billingPlan.cardExp }}</div>
 </div>
 <button class="w-full py-2 border border-border hover:bg-muted text-xs font-medium text-foreground rounded-xl cursor-pointer">
 Update Card
 </button>
 </div>
 </div>

 <!-- Invoices Table -->
 <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
 <div class="p-4 border-b border-border bg-muted/40">
 <h3 class="text-xs font-bold text-foreground uppercase tracking-wider">Invoice History</h3>
 </div>
 <table class="w-full text-left border-collapse text-xs">
 <thead>
 <tr class="border-b border-border bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
 <th class="p-4">Invoice ID</th>
 <th class="p-4">Billing Date</th>
 <th class="p-4">Amount</th>
 <th class="p-4 text-center">Status</th>
 <th class="p-4 text-right">Receipt</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border font-medium">
 <tr v-for="inv in billingInvoices" :key="inv.id" class="hover:bg-muted/50">
 <td class="p-4 font-sans font-semibold text-foreground tabular-nums">{{ inv.id }}</td>
 <td class="p-4 text-muted-foreground">{{ inv.date }}</td>
 <td class="p-4 font-sans font-semibold text-foreground tabular-nums">{{ inv.amount }}</td>
 <td class="p-4 text-center">
 <span class="text-[10px] bg-success/10 text-success font-bold px-2 py-0.5 rounded-full">
 {{ inv.status }}
 </span>
 </td>
 <td class="p-4 text-right">
 <button @click="addToast('Downloading Invoice', `${inv.id} PDF saved.`, 'success')" class="text-xs font-bold text-primary hover:underline cursor-pointer">
 Download PDF
 </button>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 </div><!-- /max-w-5xl -->
 </main>
 </div>

 <!-- ═══ MODALS ═══ -->

 <!-- Embed Code Modal -->
 <div v-if="embedModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <div class="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border overflow-hidden">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-sm text-foreground flex items-center gap-2">
 <FileText class="w-4 h-4 text-primary" /> Embed Web Form: {{ embedModal.formName }}
 </h3>
 <button @click="embedModal.show = false" class="text-muted-foreground hover:text-foreground cursor-pointer"><X class="w-4 h-4" /></button>
 </header>
 <div class="p-6 space-y-4">
 <p class="text-xs text-muted-foreground">Copy the script or HTML embed code below to place this form on your website or portal.</p>
 
 <div class="bg-card text-xs text-success font-mono p-4 rounded-xl border border-border overflow-x-auto space-y-2 select-all">
 <div class="text-muted-foreground">/* HTML Snippet with script loader */</div>
 <div>&lt;script src="https://forms.rakansales.com/embed.js" async&gt;&lt;/script&gt;</div>
 <div>&lt;div data-rks-form="{{ embedModal.formId }}" data-theme="light"&gt;&lt;/div&gt;</div>
 </div>

 <div class="flex justify-between items-center pt-2">
 <span class="text-[10px] text-muted-foreground italic">Embed automatically tracks and creates leads in Real Time</span>
 <div class="flex gap-2">
 <button @click="embedModal.show = false" class="px-4 py-2 border border-border text-muted-foreground font-bold text-xs rounded-lg cursor-pointer">Close</button>
 <button @click="copyEmbedSnippet" class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow">Copy Snippet</button>
 </div>
 </div>
 </div>
 </div>
 </div>


 <!-- ══════ MODAL: Add Channel Guided Stepper Wizard (BASED ON DESIGN) ══════ -->
 <div v-if="showAddInboxModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
 <div class="bg-card rounded-2xl w-full max-w-4xl shadow-2xl border border-border flex overflow-hidden min-h-[520px]">
 
 <!-- Wizard Left Sidebar (Guided Flow steps list) -->
 <div class="w-64 bg-muted/50 border-r border-border p-6 flex flex-col justify-between shrink-0 select-none">
 <div class="space-y-6 relative">
 <div class="absolute left-[15px] top-[10px] bottom-[10px] w-0.5 bg-muted z-0"></div>

 <div v-for="step in wizardSteps" :key="step.number" class="flex items-start gap-4 relative z-10">
 <div
 class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0"
 :class="addChannelStep === step.number
 ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
 : addChannelStep > step.number
 ? 'bg-primary/20 text-primary'
 : 'bg-card border border-border text-muted-foreground'"
 >
 <Check v-if="addChannelStep > step.number" class="w-4 h-4" />
 <span v-else>{{ step.number }}</span>
 </div>
 <div class="min-w-0">
 <div class="text-xs font-bold transition-colors" :class="addChannelStep === step.number ? 'text-primary' : 'text-muted-foreground'">{{ step.title }}</div>
 <div class="text-[9px] text-muted-foreground mt-0.5 leading-relaxed">{{ step.desc }}</div>
 </div>
 </div>
 </div>
 
 <div class="text-[9px] text-muted-foreground">RakanSales Integration Agent</div>
 </div>

 <!-- Wizard Right Content Pane -->
 <div class="flex-1 p-6 flex flex-col justify-between min-h-[480px]">
 
 <!-- STEP 1: CHOOSE PROVIDER -->
 <div v-if="addChannelStep === 1" class="space-y-4">
 <div class="border-b border-border pb-3">
 <h3 class="font-bold text-base text-foreground">Choose Channel</h3>
 <p class="text-xs text-muted-foreground mt-0.5">Select the channel provider you want to integrate with Rakansales.</p>
 </div>
 
 <div class="grid grid-cols-3 gap-3 overflow-y-auto max-h-[340px] pr-1">
 <div
 v-for="provider in channelProviders"
 :key="provider.name"
 @click="selectChannelProvider(provider)"
 class="border-2 rounded-xl p-4 flex flex-col items-start text-left cursor-pointer transition-all hover:border-primary/45 hover:shadow-sm"
 :class="selectedChannelProvider === provider.name
 ? 'border-primary bg-primary/5 shadow-inner'
 : 'border-border bg-card'"
 >
 <div class="w-9 h-9 flex items-center justify-center mb-3 shrink-0 bg-transparent">
 <template v-if="provider.name === 'Website'">
 <svg class="w-7 h-7 text-info" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10"></circle>
 <line x1="2" y1="12" x2="22" y2="12"></line>
 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
 </svg>
 </template>
 <template v-else-if="provider.name === 'SMS'">
 <svg class="w-7 h-7 text-tag-3-foreground" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
 <polyline points="22,6 12,13 2,6"></polyline>
 </svg>
 </template>
 <template v-else-if="provider.name === 'API'">
 <svg class="w-7 h-7 text-tag-1-foreground" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
 <polyline points="16 18 22 12 16 6"></polyline>
 <polyline points="8 6 2 12 8 18"></polyline>
 </svg>
 </template>
 <template v-else>
 <img :src="provider.logoUrl" class="w-7 h-7 object-contain" :alt="provider.name" />
 </template>
 </div>
 <div class="font-bold text-xs text-foreground">{{ provider.name }}</div>
 <div class="text-[10px] text-muted-foreground mt-1 leading-snug">{{ provider.desc }}</div>
 </div>
 </div>
 </div>

 <!-- STEP 2: CREATE INBOX -->
 <div v-if="addChannelStep === 2" class="space-y-4">
 <template v-if="selectedChannelProvider === 'WhatsApp'">
 <!-- Sub-step 2.1: Select your API provider -->
 <div v-if="whatsappStep === 1" class="space-y-4">
 <div class="border-b border-border pb-3">
 <h3 class="font-bold text-base text-foreground">Select your API provider</h3>
 <p class="text-xs text-muted-foreground mt-0.5">Choose your WhatsApp provider. You can connect directly through Meta which requires no setup, or connect through Twilio using your account credentials.</p>
 </div>
 <div class="grid grid-cols-2 gap-4">
 <!-- Connect Through QR Code -->
 <div
 @click="whatsappStep = 2"
 class="border-2 border-border hover:border-primary/45 rounded-xl p-5 flex flex-col items-start text-left cursor-pointer transition-all bg-card hover:shadow-sm"
 >
 <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4 shrink-0 text-foreground">
 <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
 <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.372a9.954 9.954 0 0 0 4.777 1.22h.005c5.505 0 9.989-4.478 9.99-9.985A9.998 9.998 0 0 0 12.012 2zm5.728 14.103c-.25.706-1.442 1.3-1.977 1.385-.49.078-1.13.147-3.268-.737-2.734-1.132-4.5-3.905-4.636-4.087-.137-.182-1.11-1.478-1.11-2.817 0-1.338.702-1.995.952-2.26.25-.263.543-.329.724-.329.18 0 .362.002.52.009.164.007.385-.026.594.494.21.52.723 1.76.786 1.892.062.13.104.282.018.451-.085.17-.129.277-.257.43-.129.15-.271.337-.387.452-.13.129-.267.27-.116.53.151.26.67 1.103 1.432 1.78.98.874 1.8-1.144 2.056-1.01.256.133 1.62.763 1.9.903.28.14.467.21.536.328.07.12.07.69-.18 1.396z"/>
 </svg>
 </div>
 <div class="font-bold text-sm text-foreground">Connect Through QR Code</div>
 <div class="text-xs text-muted-foreground mt-1 leading-relaxed">Scan QR code to connect your WhatsApp instantly</div>
 </div>
 <!-- Connect Through Meta -->
 <div
 @click="addToast('Meta Integration', 'Meta Cloud API login screen simulation.')"
 class="border-2 border-border hover:border-primary/45 rounded-xl p-5 flex flex-col items-start text-left cursor-pointer transition-all bg-card hover:shadow-sm"
 >
 <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4 shrink-0 text-foreground">
 <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
 <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.372a9.954 9.954 0 0 0 4.777 1.22h.005c5.505 0 9.989-4.478 9.99-9.985A9.998 9.998 0 0 0 12.012 2zm5.728 14.103c-.25.706-1.442 1.3-1.977 1.385-.49.078-1.13.147-3.268-.737-2.734-1.132-4.5-3.905-4.636-4.087-.137-.182-1.11-1.478-1.11-2.817 0-1.338.702-1.995.952-2.26.25-.263.543-.329.724-.329.18 0 .362.002.52.009.164.007.385-.026.594.494.21.52.723 1.76.786 1.892.062.13.104.282.018.451-.085.17-.129.277-.257.43-.129.15-.271.337-.387.452-.13.129-.267.27-.116.53.151.26.67 1.103 1.432 1.78.98.874 1.8-1.144 2.056-1.01.256.133 1.62.763 1.9.903.28.14.467.21.536.328.07.12.07.69-.18 1.396z"/>
 </svg>
 </div>
 <div class="font-bold text-sm text-foreground">Connect Through Meta</div>
 <div class="text-xs text-muted-foreground mt-1 leading-relaxed">Quick setup through Meta Login</div>
 </div>
 </div>
 </div>

 <!-- Sub-step 2.2: WhatsApp Integration details form -->
 <div v-else-if="whatsappStep === 2" class="space-y-4 animate-fade-in">
 <div class="p-4 border border-border bg-muted/40 rounded-xl space-y-2.5 text-xs text-muted-foreground">
 <div class="font-bold text-sm text-foreground">WhatsApp Integration</div>
 <p class="text-xs text-muted-foreground">Connect your WhatsApp account to start receiving and sending messages.</p>
 <ul class="list-disc pl-4 space-y-1 text-muted-foreground">
 <li>Enter a name for your WhatsApp inbox</li>
 <li>Click "Generate QR Code" to create a new session</li>
 <li>Scan the QR code with your WhatsApp mobile app</li>
 <li>You'll be automatically redirected once connected</li>
 </ul>
 </div>

 <div class="space-y-3.5 max-w-md">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Inbox Name</label>
 <input type="text" v-model="newInboxName" placeholder="Please enter an inbox name" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <button
 type="button"
 @click="startSimulatedQR"
 :disabled="!newInboxName"
 class="px-4 py-2 bg-success hover:bg-success text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow disabled:opacity-50"
 >
 Generate QR Code
 </button>
 </div>
 </div>

 <!-- Sub-step 2.3: Scan QR Code screen -->
 <div v-else-if="whatsappStep === 3 || whatsappStep === 4" class="flex flex-col items-center justify-center p-4 border border-border rounded-2xl bg-card shadow-xs max-w-md mx-auto space-y-4 text-center animate-fade-in">
 <div class="font-bold text-sm text-foreground">Scan QR Code with WhatsApp</div>
 
 <div class="relative p-4 border border-border rounded-xl bg-card shadow-inner flex flex-col items-center justify-center">
 <!-- Simulated QR Code placeholder -->
 <div class="w-44 h-44 flex items-center justify-center bg-muted/50 rounded-lg relative overflow-hidden">
 <img src="/rakansales_qr_code.png" class="w-40 h-40 object-contain" alt="WhatsApp QR Code" />
 <div v-if="whatsappStep === 4" class="absolute inset-0 bg-card/95 flex flex-col items-center justify-center text-success animate-fade-in">
 <div class="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mb-2 shadow-inner">
 <CheckCircle2 class="w-7 h-7" />
 </div>
 <div class="text-xs font-bold">Successfully Connected!</div>
 </div>
 </div>

 <div v-if="whatsappStep !== 4" class="text-xs text-muted-foreground mt-3 font-semibold">
 <span class="font-sans font-semibold text-foreground tabular-nums">{{ qrTimerFormatted }}</span> remaining
 </div>

 <!-- Status Dot Indicator -->
 <div class="flex items-center gap-1.5 mt-2">
 <span class="w-2.5 h-2.5 rounded-full" :class="whatsappStep === 4 ? 'bg-success animate-pulse' : 'bg-warning animate-pulse'"></span>
 <span class="text-[10px] font-bold text-muted-foreground">
 {{ whatsappStep === 4 ? 'Device linked successfully!' : 'Waiting for connection...' }}
 </span>
 </div>
 </div>

 <div class="text-left text-xs space-y-1.5 text-muted-foreground w-full px-2 border-t border-border pt-3">
 <div class="font-bold text-foreground text-[11px]">How to scan:</div>
 <ol class="list-decimal pl-4 space-y-1 text-muted-foreground text-[10px]">
 <li>Open WhatsApp on your phone</li>
 <li>Go to Settings → Linked Devices</li>
 <li>Tap "Link a Device"</li>
 <li>Point your phone at this QR code</li>
 </ol>
 </div>
 </div>
 </template>

 <template v-else>
 <!-- Normal Creation Form for non-WhatsApp channels -->
 <div class="space-y-3.5 max-w-md animate-fade-in">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Inbox Name</label>
 <input type="text" v-model="newInboxName" placeholder="e.g. Sales WhatsApp" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
 {{ selectedChannelProvider === 'Email' ? 'Email Address' : selectedChannelProvider === 'SMS' ? 'Phone Number' : 'Domain / Widget URL' }}
 </label>
 <input type="text" v-model="newInboxDetails" :placeholder="selectedChannelProvider === 'Email' ? 'info@company.com' : selectedChannelProvider === 'SMS' ? '+60 12-345 6789' : 'mysite.com'" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Routing Team</label>
 <select v-model="newInboxAssigned" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
 <option>Sales Team</option>
 <option>Support Team</option>
 <option>Enterprise Team</option>
 </select>
 </div>
 </div>
 </template>
 </div>

 <!-- STEP 3: ADD AGENTS -->
 <div v-if="addChannelStep === 3" class="space-y-4">
 <div class="border-b border-border pb-3">
 <h3 class="font-bold text-base text-foreground">Add Agents</h3>
 <p class="text-xs text-muted-foreground mt-0.5">Choose agents who will have access to handle messages in this inbox.</p>
 </div>

 <div class="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
 <div
 v-for="user in workspaceUsers"
 :key="user.id"
 class="flex items-center justify-between p-2.5 border border-border rounded-xl bg-muted/40 hover:bg-muted transition-colors"
 >
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border">
 <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
 <div v-else class="w-full h-full flex items-center justify-center font-bold text-xs text-primary-foreground" :class="user.avatarBg">
 {{ user.name.charAt(0) }}
 </div>
 </div>
 <div>
 <div class="font-bold text-xs text-foreground">{{ user.name }}</div>
 <div class="text-[9px] text-muted-foreground">{{ user.role }}</div>
 </div>
 </div>
 <input
 type="checkbox"
 :id="`agent-select-${user.id}`"
 :value="user.id"
 v-model="inboxSelectedAgents"
 class="w-4 h-4 text-primary border-border rounded focus:ring-primary cursor-pointer"
 />
 </div>
 </div>
 </div>

 <!-- STEP 4: VOILÀ! SUCCESS -->
 <div v-if="addChannelStep === 4" class="flex flex-col items-center justify-center text-center py-6 space-y-4">
 <div class="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center text-success shadow-lg shadow-sm">
 <CheckCircle2 class="w-8 h-8 animate-pulse" />
 </div>
 <div class="space-y-1 max-w-sm">
 <h3 class="font-bold text-lg text-foreground">Voilà! You are all set!</h3>
 <p class="text-xs text-muted-foreground leading-relaxed">
 Your new <strong>{{ selectedChannelProvider }}</strong> inbox channel ({{ newInboxName }}) has been successfully integrated and authenticated.
 </p>
 </div>
 
 <div class="border border-border rounded-xl p-4 bg-muted/50 text-left text-[11px] space-y-1.5 w-full max-w-xs shadow-inner">
 <div><span class="text-muted-foreground font-bold uppercase tracking-wider text-[8px]">Channel:</span> {{ newInboxName }}</div>
 <div><span class="text-muted-foreground font-bold uppercase tracking-wider text-[8px]">Address:</span> {{ newInboxDetails }}</div>
 <div><span class="text-muted-foreground font-bold uppercase tracking-wider text-[8px]">Routing:</span> {{ newInboxAssigned }}</div>
 <div><span class="text-muted-foreground font-bold uppercase tracking-wider text-[8px]">Assigned Agents:</span> {{ inboxSelectedAgents.length }} Members</div>
 </div>
 </div>

 <!-- Footer Buttons -->
 <footer class="pt-4 border-t border-border flex justify-between items-center bg-card">
 <button
 v-if="addChannelStep > 1 && addChannelStep < 4"
 @click="wizardBack"
 class="px-4 py-2 border border-border text-muted-foreground hover:bg-muted font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
 >
 <ArrowLeft class="w-3.5 h-3.5" /> Back
 </button>
 <div v-else></div>

 <div class="flex gap-2">
 <button @click="closeAddChannelWizard" class="px-4 py-2 border border-border text-muted-foreground hover:bg-muted font-bold text-xs rounded-lg cursor-pointer">
 Cancel
 </button>
 <button
 v-if="addChannelStep < 3"
 @click="wizardNext"
 :disabled="
 (addChannelStep === 1 && !selectedChannelProvider) ||
 (addChannelStep === 2 && selectedChannelProvider === 'WhatsApp' && whatsappStep !== 4)
 "
 class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50 shadow"
 >
 Next Step
 </button>
 <button
 v-else-if="addChannelStep === 3"
 @click="submitAddChannel"
 class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow"
 >
 Create Channel
 </button>
 <button
 v-else-if="addChannelStep === 4"
 @click="finishAddChannel"
 class="px-5 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow"
 >
 Finish
 </button>
 </div>
 </footer>

 </div>
 </div>
 </div>

 <!-- ══════ MODAL: Add Document ══════ -->
 <div v-if="showAddDocModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <div class="bg-card rounded-2xl w-full max-w-md shadow-2xl border border-border">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-sm text-foreground flex items-center gap-2">
 <FileText class="w-4 h-4 text-primary" /> Add Knowledge Document
 </h3>
 <button @click="showAddDocModal = false" class="text-muted-foreground hover:text-foreground cursor-pointer"><X class="w-4 h-4" /></button>
 </header>
 <form @submit.prevent="submitAddDoc" class="p-6 space-y-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Document Name</label>
 <input type="text" v-model="newDocName" placeholder="e.g. Product_Catalog_2026.pdf" required class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Document Type</label>
 <select v-model="newDocType" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
 <option value="pdf">PDF Document</option>
 <option value="docx">Word Document (.docx)</option>
 <option value="txt">Plain Text (.txt)</option>
 <option value="csv">Spreadsheet (.csv)</option>
 </select>
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">File Size (simulated)</label>
 <select v-model="newDocSize" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
 <option>512 KB</option>
 <option>1.1 MB</option>
 <option>2.4 MB</option>
 <option>5.8 MB</option>
 <option>12.3 MB</option>
 </select>
 </div>
 <div class="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
 <Sparkles class="w-4 h-4 text-warning shrink-0 mt-0.5" />
 <p class="text-[10px] text-warning font-medium">This document will be queued for AI training. The model will re-index with the new knowledge source.</p>
 </div>
 <footer class="pt-4 border-t border-border flex justify-end gap-2">
 <button type="button" @click="showAddDocModal = false" class="px-4 py-2 border border-border text-muted-foreground font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
 <button type="submit" class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow">Add & Queue Training</button>
 </footer>
 </form>
 </div>
 </div>

 <!-- ══════ MODAL: Edit Document Name ══════ -->
 <div v-if="editDocModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <div class="bg-card rounded-2xl w-full max-w-sm shadow-2xl border border-border">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-sm text-foreground">Rename Document</h3>
 <button @click="editDocModal.show = false" class="text-muted-foreground hover:text-foreground cursor-pointer"><X class="w-4 h-4" /></button>
 </header>
 <div class="p-6 space-y-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Document Name</label>
 <input type="text" v-model="editDocModal.name" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div class="flex justify-end gap-2">
 <button @click="editDocModal.show = false" class="px-4 py-2 border border-border text-muted-foreground font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
 <button @click="saveDocName" class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow">Save Name</button>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════ MODAL: Create Custom Tag (Popup modal from top New Tag) ══════ -->
 <div v-if="showCreateTagModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <div class="bg-card rounded-2xl w-full max-w-2xl shadow-2xl border border-border overflow-hidden">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-sm text-foreground flex items-center gap-2"><Tag class="w-4 h-4 text-primary" /> Create Custom Tag</h3>
 <button @click="showCreateTagModal = false" class="text-muted-foreground hover:text-foreground cursor-pointer"><X class="w-4 h-4" /></button>
 </header>
 <div class="p-6 space-y-6">
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
 <div class="space-y-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Tag Name</label>
 <input type="text" v-model="newTagName" placeholder="e.g. Lead Score 80+" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Tag Group</label>
 <select v-model="newTagGroup" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
 <option v-for="group in tagGroups" :key="group.name" :value="group.name">{{ group.name }}</option>
 </select>
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Color Option</label>
 <div class="grid grid-cols-6 gap-2">
 <button
 v-for="color in tagColors" :key="color.name"
 @click="selectedTagColor = color"
 class="h-8 rounded-lg cursor-pointer transition-all border-2"
 :style="{ backgroundColor: color.bg, borderColor: selectedTagColor.name === color.name ? color.text : 'transparent' }"
 ></button>
 </div>
 </div>
 </div>
 <div class="border border-border rounded-xl p-5 bg-muted/50 space-y-3 flex flex-col items-center justify-center min-h-[180px]">
 <h4 class="font-bold text-xs text-muted-foreground uppercase tracking-wider">Live Badge Preview</h4>
 <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow border border-border"
 :style="{ backgroundColor: selectedTagColor.bg, color: selectedTagColor.text }">
 <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: selectedTagColor.text }"></span>
 {{ newTagName || 'Tag Name' }}
 </span>
 <p class="text-[10px] text-muted-foreground text-center">Placed in: {{ newTagGroup }}</p>
 </div>
 </div>
 <footer class="pt-4 border-t border-border flex justify-end gap-2">
 <button @click="showCreateTagModal = false" class="px-4 py-2 border border-border text-muted-foreground font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
 <button @click="createCustomTagFromModal" :disabled="!newTagName" class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow disabled:opacity-50">Create Tag</button>
 </footer>
 </div>
 </div>
 </div>

 <!-- ══════ MODAL: Edit Tag ══════ -->
 <div v-if="editTagModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <div class="bg-card rounded-2xl w-full max-w-sm shadow-2xl border border-border">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-sm text-foreground flex items-center gap-2"><Tag class="w-4 h-4 text-primary" /> Edit Tag</h3>
 <button @click="editTagModal.show = false" class="text-muted-foreground hover:text-foreground cursor-pointer"><X class="w-4 h-4" /></button>
 </header>
 <div class="p-6 space-y-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Tag Name</label>
 <input type="text" v-model="editTagModal.name" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Color</label>
 <div class="grid grid-cols-6 gap-2">
 <button
 v-for="color in tagColors" :key="color.name"
 @click="editTagModal.colorBg = color.bg; editTagModal.colorText = color.text"
 class="h-8 rounded-lg cursor-pointer transition-all border-2"
 :style="{ backgroundColor: color.bg, borderColor: editTagModal.colorBg === color.bg ? color.text : 'transparent' }"
 ></button>
 </div>
 </div>
 <div class="flex justify-center py-2">
 <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow border border-border"
 :style="{ backgroundColor: editTagModal.colorBg, color: editTagModal.colorText }">
 <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: editTagModal.colorText }"></span>
 {{ editTagModal.name }}
 </span>
 </div>
 <div class="flex justify-end gap-2">
 <button @click="editTagModal.show = false" class="px-4 py-2 border border-border text-muted-foreground font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
 <button @click="saveEditTag" class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow">Save Changes</button>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════ MODAL: Edit Inbox ══════ -->
 <div v-if="editInboxModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <div class="bg-card rounded-2xl w-full max-w-sm shadow-2xl border border-border">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-sm text-foreground">Edit Channel</h3>
 <button @click="editInboxModal.show = false" class="text-muted-foreground hover:text-foreground cursor-pointer"><X class="w-4 h-4" /></button>
 </header>
 <div class="p-6 space-y-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Channel Name</label>
 <input type="text" v-model="editInboxModal.name" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Assign to Team</label>
 <select v-model="editInboxModal.team" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
 <option>Sales Team</option>
 <option>Support Team</option>
 <option>Enterprise Team</option>
 </select>
 </div>
 <div class="flex justify-end gap-2 pt-2">
 <button @click="editInboxModal.show = false" class="px-4 py-2 border border-border text-muted-foreground font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
 <button @click="saveEditInbox" class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow">Save Changes</button>
 </div>
 </div>
 </div>
 </div>

 <!-- ══════ MODAL: Create Web Form ══════ -->
 <div v-if="showCreateFormModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <div class="bg-card rounded-2xl w-full max-w-md shadow-2xl border border-border">
 <header class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
 <h3 class="font-bold text-sm text-foreground">Create New Web Form</h3>
 <button @click="showCreateFormModal = false" class="text-muted-foreground hover:text-foreground cursor-pointer"><X class="w-4 h-4" /></button>
 </header>
 <form @submit.prevent="createWebForm" class="p-6 space-y-4">
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Form Name</label>
 <input type="text" v-model="newFormName" placeholder="e.g. Enterprise Lead Capture" required class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Description</label>
 <input type="text" v-model="newFormDesc" placeholder="Collects enterprise inquiry details" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Post-Submit Redirect URL</label>
 <input type="text" v-model="newFormRedirect" placeholder="https://yoursite.com/thank-you" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
 </div>
 <div>
 <label class="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Assign Leads To</label>
 <select v-model="newFormAgent" class="w-full text-xs bg-card border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
 <option>Justin (Admin)</option>
 <option>Sarah (Senior Rep)</option>
 <option>David (Rep)</option>
 <option>Round Robin (All)</option>
 </select>
 </div>
 <footer class="pt-4 border-t border-border flex justify-end gap-2">
 <button type="button" @click="showCreateFormModal = false" class="px-4 py-2 border border-border text-muted-foreground font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
 <button type="submit" class="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg cursor-pointer shadow">Create Form</button>
 </footer>
 </form>
 </div>
 </div>

 <!-- Toast Notifications -->
 <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
 <transition-group enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-3 scale-95" leave-active-class="transition duration-200 ease-in" leave-to-class="opacity-0 translate-y-2 scale-95">
 <div
 v-for="toast in toasts"
 :key="toast.id"
 class="pointer-events-auto w-full border rounded-xl p-4 bg-card shadow-2xl flex items-start gap-3"
 :class="toast.type === 'success' ? 'border-primary/25 shadow-primary/5' : 'border-warning/30 shadow-warning/5'"
 >
 <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" :class="toast.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-warning/15 text-warning'">
 <CheckCircle2 class="w-3.5 h-3.5" />
 </div>
 <div class="flex-1">
 <h4 class="font-bold text-xs text-foreground">{{ toast.title }}</h4>
 <p class="text-[10px] text-muted-foreground mt-0.5">{{ toast.message }}</p>
 </div>
 <button @click="closeToast(toast.id)" class="text-muted-foreground hover:text-foreground cursor-pointer">×</button>
 </div>
 </transition-group>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AgentsTab from '../components/settings/AgentsTab.vue';
import TeamsTab from '../components/settings/TeamsTab.vue';
import RolesTab from '../components/settings/RolesTab.vue';
import AutomationTab from '../components/settings/AutomationTab.vue';
import AIAssistantsTab from '../components/settings/AIAssistantsTab.vue';
import {
 Settings, Sparkles, FileText, Upload, CheckCircle2, Play, Pause,
 Mail, MessageSquare, Tag, Zap, Shield, Users, Smartphone,
 Loader2, Plus, Pencil, Trash2, X, Search, GripVertical, Copy,
 Globe, Terminal, Check, ArrowLeft, Send, Instagram,
 Bot, Clock, Target, MessageSquareQuote, Sliders, Webhook,
 ShoppingBag, Building, CreditCard, History, BookOpen, Layers,
 ExternalLink, Inbox, User, HelpCircle, ArrowUpRight, ChevronRight,
 AlertCircle, Info, RefreshCw, Cpu
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
function triggerFileInput() { loadDemoFiles(); }

// Focus directive helper for inline input
const vFocus = {
 mounted: (el: HTMLInputElement) => el.focus()
};

// ═══════════════════ TOAST SYSTEM ═══════════════════
interface Toast { id: number; title: string; message: string; type: 'success' | 'warning' | 'info'; }
const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;
function addToast(title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') {
 const id = ++toastIdCounter;
 toasts.value.push({ id, title, message, type });
 setTimeout(() => closeToast(id), 4000);
}
function closeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id); }

// ═══════════════════ TAB 1: AI TRAINING HUB ═══════════════════
const isDragging = ref(false);
const trainingProgress = ref(0);
const trainingStatus = ref('Awaiting documents...');
const aiModelVersion = ref('v0.0');
const showAddDocModal = ref(false);
const newDocName = ref('');
const newDocType = ref('pdf');
const newDocSize = ref('2.4 MB');
const editDocModal = ref({ show: false, id: 0, name: '' });

interface KnowledgeDoc { id: number; name: string; size: string; type: string; date: string; status: string; progress: number; }
const knowledgeDocs = ref<KnowledgeDoc[]>([
 { id: 1, name: 'Company_SOPs.docx', size: '1.1 MB', type: 'docx', date: 'Jun 10, 2026', status: 'Trained', progress: 100 },
]);

let docIdCounter = 10;
function removeDoc(id: number) {
 knowledgeDocs.value = knowledgeDocs.value.filter(d => d.id !== id);
 addToast('Document Removed', 'Knowledge base updated. Re-train to apply changes.', 'warning');
}
function editDocName(doc: KnowledgeDoc) {
 editDocModal.value = { show: true, id: doc.id, name: doc.name };
}
function saveDocName() {
 const doc = knowledgeDocs.value.find(d => d.id === editDocModal.value.id);
 if (doc) { doc.name = editDocModal.value.name; addToast('Document Renamed', `File renamed to ${doc.name}.`, 'success'); }
 editDocModal.value.show = false;
}
function submitAddDoc() {
 const ext = newDocType.value === 'docx' ? '.docx' : newDocType.value === 'txt' ? '.txt' : newDocType.value === 'csv' ? '.csv' : '.pdf';
 const name = newDocName.value.includes('.') ? newDocName.value : newDocName.value + ext;
 knowledgeDocs.value.push({ id: ++docIdCounter, name, size: newDocSize.value, type: newDocType.value, date: 'Today', status: 'Queued', progress: 0 });
 addToast('Document Queued', `${name} added to training queue.`, 'success');
 showAddDocModal.value = false; newDocName.value = ''; newDocType.value = 'pdf';
 // Start training after brief delay
 setTimeout(() => {
 const d = knowledgeDocs.value.find(d => d.name === name);
 if (d) { d.status = 'Training...'; setTimeout(() => { if (d) { d.status = 'Trained'; d.progress = 100; addToast('Document Trained', `${d.name} has been indexed.`, 'success'); } }, 2500); }
 }, 500);
}
function retrainDoc(doc: KnowledgeDoc) {
 doc.status = 'Re-training...';
 setTimeout(() => { doc.status = 'Trained'; addToast('Re-trained', `${doc.name} successfully re-indexed.`, 'success'); }, 2000);
}

interface TrainingHistoryEntry { id: number; action: string; model: string; time: string; success: boolean; }
const trainingHistory = ref<TrainingHistoryEntry[]>([
 { id: 1, action: 'Initial training (Company_SOPs.docx)', model: 'v0.1', time: 'Jun 10, 10:24 AM', success: true }
]);
const activeAITrainingSubTab = ref('kb');

interface KnowledgeFile { name: string; size: string; progress: number; status: string; }
const filesList = ref<KnowledgeFile[]>([]);
const activeFeatureTab = ref('webform');
const aiFeatures = [
 { id: 'webform', label: 'Auto-Generated Webform' },
 { id: 'campaign', label: 'Email Campaign' },
 { id: 'inbox', label: 'Inbox Copilot' }
];
const aiReplyText = ref('');

function loadDemoFiles() {
 filesList.value = [
 { name: '2026_Pricing_Guide.pdf', size: '2.4 MB', progress: 0, status: 'Uploading...' },
 { name: 'Sales_Training_Manual.docx', size: '1.5 MB', progress: 0, status: 'Uploading...' }
 ];
 startTrainingProgress();
}

function startTrainingProgress() {
 trainingProgress.value = 0;
 trainingStatus.value = 'Uploading file buffers...';
 const interval = setInterval(() => {
 if (trainingProgress.value < 20) {
 trainingProgress.value += 4;
 filesList.value.forEach(f => f.progress = trainingProgress.value * 2.5);
 } else if (trainingProgress.value < 50) {
 trainingStatus.value = 'Parsing PDF structures...';
 trainingProgress.value += 6;
 filesList.value.forEach(f => { f.progress = Math.min(100, trainingProgress.value * 2); f.status = 'Ingesting...'; });
 } else if (trainingProgress.value < 85) {
 trainingStatus.value = 'Building vector embeddings...';
 trainingProgress.value += 5;
 filesList.value.forEach(f => { f.progress = 100; f.status = 'Parsed'; });
 } else if (trainingProgress.value < 100) {
 trainingStatus.value = 'Optimizing LLM response models...';
 trainingProgress.value += 3;
 } else {
 trainingProgress.value = 100;
 trainingStatus.value = 'AI model trained and deployed.';
 aiModelVersion.value = 'v1.1';
 clearInterval(interval);
 addToast('AI Trained!', 'Model v1.1 active across all channels.', 'success');
 trainingHistory.value.unshift({ id: Date.now(), action: 'Full training (2 documents)', model: 'v1.1', time: new Date().toLocaleTimeString(), success: true });
 // Add auto-generated webform
 if (!activeWebforms.value.some(wf => wf.name === '2026 Enterprise Inquiry')) {
 const newId = Date.now();
 activeWebforms.value.push({
 id: newId, name: '2026 Enterprise Inquiry', desc: 'AI-generated from pricing guide', active: true,
 fields: [
 { label: 'Company Name', type: 'Text', required: true },
 { label: 'Contact Email', type: 'Email', required: true },
 { label: 'Package Tier', type: 'Dropdown', required: true },
 { label: 'Seat Count', type: 'Text', required: false },
 ],
 leadsCount: 0, convRate: 0,
 submissions: [],
 });
 }
 // Add PDF to knowledge docs
 if (!knowledgeDocs.value.some(d => d.name === '2026_Pricing_Guide.pdf')) {
 knowledgeDocs.value.push({ id: ++docIdCounter, name: '2026_Pricing_Guide.pdf', size: '2.4 MB', type: 'pdf', date: 'Today', status: 'Trained', progress: 100 });
 }
 if (!knowledgeDocs.value.some(d => d.name === 'Sales_Training_Manual.docx')) {
 knowledgeDocs.value.push({ id: ++docIdCounter, name: 'Sales_Training_Manual.docx', size: '1.5 MB', type: 'docx', date: 'Today', status: 'Trained', progress: 100 });
 }
 // Add DOCX to knowledge docs
 if (!knowledgeDocs.value.some(d => d.name === 'Employee_Handbook.docx')) {
 knowledgeDocs.value.push({ id: ++docIdCounter, name: 'Employee_Handbook.docx', size: '1.5 MB', type: 'docx', date: 'Today', status: 'Trained', progress: 100 });
 }
 }
 }, 150);
}

function handleFileDrop(e: DragEvent) {
 isDragging.value = false;
 if (e.dataTransfer?.files?.length) loadDemoFiles();
}
function handleFileSelect() { loadDemoFiles(); }
function simulateAIReply() {
 const fullText = `Based on the 2026 Pricing Guide, Enterprise is $2,499/mo (up to 50 seats).\n\nPer SOP section 4.2:\n- Dedicated Senior Rep routing.\n- 15-minute guaranteed response SLA.`;
 aiReplyText.value = '';
 let index = 0;
 const t = setInterval(() => {
 if (index < fullText.length) { aiReplyText.value += fullText.charAt(index); index++; }
 else { clearInterval(t); addToast('AI Draft Ready', 'Matches 2026 guidelines at 99.4%.', 'success'); }
 }, 10);
}
function applyAIReply() { addToast('Reply Applied', 'AI draft applied to composer.', 'success'); }

// ═══════════════════ SETTINGS ARCHITECTURE & ROUTING ═══════════════════
const activeTab = ref('search');
const settingsSearchQuery = ref('');

function switchTab(tabId: string) {
 activeTab.value = tabId;
 router.push({ path: '/settings', query: tabId === 'search' ? {} : { tab: tabId } });
}

watch(() => route.query.tab, (newTab) => {
 if (newTab && typeof newTab === 'string') {
 if (newTab === 'permissions') activeTab.value = 'agents';
 else if (newTab === 'macros') activeTab.value = 'canned-responses';
 else activeTab.value = newTab;
 } else {
 activeTab.value = 'search';
 }
}, { immediate: true });

interface SettingsItemDef {
 id: string;
 name: string;
 category: string;
 categoryName: string;
 description: string;
 icon: Component;
 keywords: string[];
 badge?: string;
}

interface SettingsGroupDef {
 id: string;
 title: string;
 items: SettingsItemDef[];
}

const settingsGroups: SettingsGroupDef[] = [
 {
 id: 'team-workspace',
 title: 'Team & Workspace',
 items: [
 { id: 'inboxes', name: 'Inboxes', category: 'team-workspace', categoryName: 'Team & Workspace', description: 'Omnichannel communication inboxes (WhatsApp QR, Web Chat, Email, SMS, API).', icon: Inbox, keywords: ['whatsapp', 'qr', 'chat', 'email', 'sms', 'meta', 'channels'] },
 { id: 'teams', name: 'Teams', category: 'team-workspace', categoryName: 'Team & Workspace', description: 'Department and squad groupings with dedicated routing and assignment rules.', icon: Users, keywords: ['groups', 'departments', 'squads', 'routing', 'sales team'] },
 { id: 'agents', name: 'Agents', category: 'team-workspace', categoryName: 'Team & Workspace', description: 'User accounts, permissions, colorful profile avatars, seat status, and invites.', icon: User, keywords: ['reps', 'users', 'members', 'staff', 'seats', 'avatars'] },
 { id: 'roles', name: 'Roles', category: 'team-workspace', categoryName: 'Team & Workspace', description: 'Role-based access control matrix with fine-grained granular permissions.', icon: Shield, keywords: ['permissions', 'access control', 'admin', 'manager', 'policies'] },
 { id: 'custom-attributes', name: 'Custom Attributes', category: 'team-workspace', categoryName: 'Team & Workspace', description: 'Custom data fields and properties for Contacts, Companies, and Deals.', icon: Sliders, keywords: ['fields', 'custom fields', 'properties', 'data model', 'attributes'] },
 { id: 'labels', name: 'Labels', category: 'team-workspace', categoryName: 'Team & Workspace', description: 'Color-coded tags and classification markers for conversations and leads.', icon: Tag, keywords: ['tags', 'categories', 'markers', 'badges', 'classification'] },
 ]
 },
 {
 id: 'workflows-productivity',
 title: 'Workflows & Productivity',
 items: [
 { id: 'automation', name: 'Automation', category: 'workflows-productivity', categoryName: 'Workflows & Productivity', description: 'Event triggers, smart conditions, and automated conversation routing actions.', icon: Zap, keywords: ['rules', 'triggers', 'workflow', 'auto assignment', 'bots'] },
 { id: 'canned-responses', name: 'Canned Responses', category: 'workflows-productivity', categoryName: 'Workflows & Productivity', description: 'Reusable message templates and keyboard macro shortcuts (e.g. /pricing, /welcome).', icon: MessageSquareQuote, keywords: ['macros', 'templates', 'snippets', 'quick replies', 'shortcuts'] },
 { id: 'sla', name: 'SLA', category: 'workflows-productivity', categoryName: 'Workflows & Productivity', description: 'Service level agreement policies, first-response targets, and breach escalations.', icon: Clock, keywords: ['service level', 'response time', 'resolution', 'breach', 'escalation'] },
 { id: 'revenue-targets', name: 'Revenue Targets', category: 'workflows-productivity', categoryName: 'Workflows & Productivity', description: 'Pipeline quotas, quarterly targets, and closed-won commission goals per agent.', icon: Target, keywords: ['quotas', 'pipeline goals', 'sales targets', 'commissions', 'attainment'] },
 { id: 'web-forms', name: 'Web Forms', category: 'workflows-productivity', categoryName: 'Workflows & Productivity', description: 'Lead generation forms with embed codes, field builders, and conversion tracking.', icon: FileText, keywords: ['forms', 'lead capture', 'embed', 'landing page', 'inquiry'] },
 ]
 },
 {
 id: 'ai-assistant',
 title: 'AI Assistant',
 items: [
 { id: 'ai-assistants', name: 'AI Assistants', category: 'ai-assistant', categoryName: 'AI Assistant', description: 'Build separate assistants for different jobs — one for sales, one for support — each with its own knowledge, rules, and inbox.', icon: Bot, badge: 'New', keywords: ['assistants', 'agents', 'copilot', 'bot', 'knowledge', 'veecotech', 'sales', 'support'] },
 { id: 'ai-behaviour', name: 'AI Behaviour', category: 'ai-assistant', categoryName: 'AI Assistant', description: 'System prompts, tone of voice, guardrails, compliance rules, and topic filters.', icon: Sliders, keywords: ['persona', 'prompt', 'guardrails', 'rules', 'instructions', 'tone'] },
 { id: 'ai-inboxes', name: 'AI Inboxes', category: 'ai-assistant', categoryName: 'AI Assistant', description: 'Enable or disable AI copilot draft suggestions and autonomous auto-pilot by channel.', icon: Cpu, keywords: ['autopilot', 'copilot', 'channel enable', 'threshold', 'handover'] },
 { id: 'ai-playground', name: 'Playground', category: 'ai-assistant', categoryName: 'AI Assistant', description: 'Interactive testing sandbox to simulate conversations and verify response quality.', icon: Terminal, keywords: ['sandbox', 'test', 'simulation', 'chat test', 'prompt debug'] },
 { id: 'ai-training', name: 'Knowledgebase', category: 'ai-assistant', categoryName: 'AI Assistant', description: 'Document indexing, PDF upload training, vector embeddings, and training logs.', icon: BookOpen, keywords: ['knowledge base', 'sops', 'pdf', 'documents', 'training', 'embeddings'] },
 ]
 },
 {
 id: 'ecosystem-system',
 title: 'Ecosystem & System',
 items: [
 { id: 'integrations', name: 'Integrations', category: 'ecosystem-system', categoryName: 'Ecosystem & System', description: 'Pre-built connectors for Shopify, HubSpot, Stripe, Google Calendar, and Zapier.', icon: Layers, keywords: ['shopify', 'hubspot', 'stripe', 'zapier', 'apps', 'connect'] },
 { id: 'webhooks', name: 'Webhooks', category: 'ecosystem-system', categoryName: 'Ecosystem & System', description: 'Outbound HTTP webhooks subscribed to message, lead, and pipeline events.', icon: Webhook, keywords: ['api', 'rest', 'events', 'payloads', 'endpoints', 'post'] },
 { id: 'marketplace', name: 'Marketplace', category: 'ecosystem-system', categoryName: 'Ecosystem & System', description: 'Browse and install vetted community add-on apps, themes, and extensions.', icon: ShoppingBag, keywords: ['store', 'plugins', 'addons', 'apps', 'extensions'] },
 { id: 'account-settings', name: 'Account Settings', category: 'ecosystem-system', categoryName: 'Ecosystem & System', description: 'General workspace info, inactivity timeouts, timezone, and weekly recap digests.', icon: Building, keywords: ['workspace', 'general', 'timezone', 'email recap', 'timeout', 'company'] },
 { id: 'audit-logs', name: 'Audit Logs', category: 'ecosystem-system', categoryName: 'Ecosystem & System', description: 'Immutable activity log recording user logins, role changes, exports, and edits.', icon: History, keywords: ['security', 'audit trail', 'compliance', 'activity', 'logs'] },
 { id: 'billing', name: 'Billing', category: 'ecosystem-system', categoryName: 'Ecosystem & System', description: 'Subscription tier, seat management, credit card on file, and invoice download history.', icon: CreditCard, keywords: ['subscription', 'plan', 'invoices', 'payment', 'receipts', 'seats'] },
 ]
 }
];

const allSettingsItems = computed(() => {
 return settingsGroups.flatMap(g => g.items);
});

const filteredSettingsItems = computed(() => {
 const q = settingsSearchQuery.value.trim().toLowerCase();
 if (!q) return allSettingsItems.value;
 return allSettingsItems.value.filter(item => {
 return item.name.toLowerCase().includes(q) ||
 item.description.toLowerCase().includes(q) ||
 item.categoryName.toLowerCase().includes(q) ||
 item.keywords.some(k => k.toLowerCase().includes(q));
 });
});

// ═══════════════════ NEW TAB MOCK STATES ═══════════════════
// Account Settings
const workspaceName = ref('Content Team (Live-respond.io test)');
const inactivityTimeout = ref(10);
const timeZone = ref('(GMT+08:00) Asia/Kuala_Lumpur');
const weeklyRecapEnabled = ref(true);
const recapRecipients = ref(['Naima', 'Joshua Lim', 'Leon Lam', 'Content Team', 'Petrina Jo', 'Ryan Tan', 'Nabilah Salleh']);
const showAddRecipientInput = ref(false);
const newRecipientName = ref('');

function addRecipient() {
 if (newRecipientName.value.trim()) {
 recapRecipients.value.push(newRecipientName.value.trim());
 newRecipientName.value = '';
 showAddRecipientInput.value = false;
 addToast('Recipient Added', 'Weekly recap recipients updated.', 'success');
 }
}

function removeRecipient(name: string) {
 recapRecipients.value = recapRecipients.value.filter(r => r !== name);
 addToast('Recipient Removed', `${name} removed from recap list.`, 'warning');
}

// Canned Responses
interface CannedResponse { id: number; shortcut: string; title: string; content: string; category: string; uses: number; }
const cannedResponses = ref<CannedResponse[]>([
 { id: 1, shortcut: '/pricing', title: 'Standard Pricing Tiers', content: 'Hi {{contact.name}}, here is our 2026 pricing schedule: Starter at RM199/mo, Pro at RM499/mo, Enterprise custom.', category: 'Sales', uses: 342 },
 { id: 2, shortcut: '/welcome', title: 'New Customer Welcome', content: 'Welcome to RakanSales, {{contact.name}}! Our customer success team is here to assist you 24/7.', category: 'General', uses: 890 },
 { id: 3, shortcut: '/bank-details', title: 'Bank Wire Details', content: 'Please remit payment to: Maybank Account 5140-1234-5678 (VeecoTech RakanSales Sdn Bhd).', category: 'Finance', uses: 175 },
 { id: 4, shortcut: '/meeting', title: 'Schedule Product Demo', content: 'Would you be open for a 15-minute product walk-through this week? You can book directly: rakansales.com/demo/{{agent.name}}', category: 'Sales', uses: 512 },
 { id: 5, shortcut: '/followup', title: 'Post-Demo Followup', content: 'Thanks for attending our demo session earlier, {{contact.name}}! Attached is the summary deck and next steps.', category: 'Sales', uses: 220 },
]);
const cannedSearch = ref('');
const cannedCategory = ref('All');
const showAddCannedModal = ref(false);
const newCannedShortcut = ref('');
const newCannedTitle = ref('');
const newCannedContent = ref('');
const newCannedCat = ref('Sales');

const filteredCannedResponses = computed(() => {
 return cannedResponses.value.filter(c => {
 const matchCat = cannedCategory.value === 'All' || c.category === cannedCategory.value;
 const matchSearch = !cannedSearch.value || c.shortcut.toLowerCase().includes(cannedSearch.value.toLowerCase()) || c.title.toLowerCase().includes(cannedSearch.value.toLowerCase()) || c.content.toLowerCase().includes(cannedSearch.value.toLowerCase());
 return matchCat && matchSearch;
 });
});

function saveCannedResponse() {
 if (!newCannedShortcut.value || !newCannedTitle.value || !newCannedContent.value) return;
 cannedResponses.value.unshift({
 id: Date.now(),
 shortcut: newCannedShortcut.value.startsWith('/') ? newCannedShortcut.value : `/${newCannedShortcut.value}`,
 title: newCannedTitle.value,
 content: newCannedContent.value,
 category: newCannedCat.value,
 uses: 0
 });
 showAddCannedModal.value = false;
 newCannedShortcut.value = '';
 newCannedTitle.value = '';
 newCannedContent.value = '';
 addToast('Canned Response Created', 'New macro template is ready for use.', 'success');
}

// Custom Attributes
interface CustomAttribute { id: number; name: string; key: string; entity: 'Contact' | 'Company' | 'Deal'; type: string; required: boolean; }
const customAttributesList = ref<CustomAttribute[]>([
 { id: 1, name: 'Industry Sector', key: 'contact.industry', entity: 'Contact', type: 'Dropdown', required: true },
 { id: 2, name: 'Annual Revenue (MYR)', key: 'company.annual_revenue', entity: 'Company', type: 'Number', required: false },
 { id: 3, name: 'Contract Renewal Date', key: 'deal.renewal_date', entity: 'Deal', type: 'Date', required: true },
 { id: 4, name: 'Decision Maker Confirmed', key: 'contact.is_decision_maker', entity: 'Contact', type: 'Boolean', required: false },
 { id: 5, name: 'Lead Source Detail', key: 'contact.source_detail', entity: 'Contact', type: 'Text', required: false },
 { id: 6, name: 'Tax ID / SST Reg', key: 'company.tax_id', entity: 'Company', type: 'Text', required: false },
]);
const attributeEntityFilter = ref('All');
const filteredCustomAttributes = computed(() => {
 if (attributeEntityFilter.value === 'All') return customAttributesList.value;
 return customAttributesList.value.filter(a => a.entity === attributeEntityFilter.value);
});

// SLA Policies
const slaPolicies = ref([
 { id: 1, priority: 'Urgent', firstResponse: '15 mins', resolveTime: '2 hours', escalation: 'Notify Squad Lead via WhatsApp & Slack', badgeColor: 'bg-destructive/10 text-destructive border-destructive/20' },
 { id: 2, priority: 'High', firstResponse: '1 hour', resolveTime: '8 hours', escalation: 'Auto-reassign to next available Senior Rep', badgeColor: 'bg-warning/10 text-warning border-warning/20' },
 { id: 3, priority: 'Normal', firstResponse: '4 hours', resolveTime: '24 hours', escalation: 'Flag in manager morning daily review', badgeColor: 'bg-info/10 text-info border-info/20' },
]);
const businessHoursDays = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
const businessHoursStart = ref('09:00');
const businessHoursEnd = ref('18:00');

// Revenue Targets
const monthlyRevenueTarget = ref(250000);
const currentAchievedRevenue = ref(184500);
const agentQuotas = ref([
 { id: 1, agent: 'Sarah Tan', quota: 60000, closed: 52000, deals: 8, avatar: '/avatars/agent_1_female_hijab_teal.png' },
 { id: 2, agent: 'Alex Wong', quota: 50000, closed: 43500, deals: 6, avatar: '/avatars/agent_3_chinese_male_navy.png' },
 { id: 3, agent: 'Farah Azman', quota: 50000, closed: 38000, deals: 5, avatar: '/avatars/agent_2_malay_female_rose.png' },
 { id: 4, agent: 'Marcus Lee', quota: 45000, closed: 31000, deals: 4, avatar: '/avatars/agent_4_chinese_male_emerald.png' },
 { id: 5, agent: 'Priya Nair', quota: 45000, closed: 20000, deals: 3, avatar: '/avatars/agent_5_indian_female_purple.png' },
]);

// AI Behaviour
const aiPersonaName = ref('RakanSales Commercial Copilot');
const aiSystemInstructions = ref(`You are an expert consultative sales and support AI assistant for RakanSales. Always be helpful, concise, and professional. Proactively qualify inbound customer needs before proposing pricing.`);
const aiTone = ref('Professional & Consultative');
const maxDiscountAllowed = ref(15);
const escalateAngrySentiment = ref(true);
const bannedTopics = ref(['Internal server architecture', 'Unreleased roadmap dates', 'Competitor defamatory remarks']);

// AI Inboxes
const aiInboxConfigs = ref([
 { id: 1, name: 'Sales WhatsApp (+60 12-555 0001)', enabled: true, mode: 'Auto-Pilot (Direct Replies)', threshold: 85, icon: Smartphone, color: 'text-success bg-success/10' },
 { id: 2, name: 'Website Live Chat (rakansales.com)', enabled: true, mode: 'Copilot (Draft Suggestions Only)', threshold: 75, icon: MessageSquare, color: 'text-tag-1-foreground bg-tag-1' },
 { id: 3, name: 'Support Email (support@rakansales.com)', enabled: false, mode: 'Disabled', threshold: 90, icon: Mail, color: 'text-info bg-info/10' },
]);

// AI Playground
const playgroundQuery = ref('');
const isPlaygroundThinking = ref(false);
const playgroundMessages = ref([
 { id: 1, role: 'user', text: 'What is your enterprise package pricing and SLA commitment?' },
 { id: 2, role: 'assistant', text: 'Our Enterprise package starts at RM 2,499/month for up to 50 seats. It includes a 15-minute guaranteed first-response SLA, dedicated senior account manager, and custom webhook integrations.', citations: ['2026_Pricing_Guide.pdf (Page 3)', 'Company_SOPs.docx (Section 4.2)'], latency: '420ms', confidence: 98 }
]);

function sendPlaygroundMessage() {
 if (!playgroundQuery.value.trim() || isPlaygroundThinking.value) return;
 const q = playgroundQuery.value.trim();
 playgroundMessages.value.push({ id: Date.now(), role: 'user', text: q });
 playgroundQuery.value = '';
 isPlaygroundThinking.value = true;
 setTimeout(() => {
 isPlaygroundThinking.value = false;
 playgroundMessages.value.push({
 id: Date.now() + 1,
 role: 'assistant',
 text: `Based on your Knowledgebase documents, RakanSales supports multi-channel assignment with round-robin priority and real-time webhook sync for "${q.slice(0, 30)}...".`,
 citations: ['2026_Pricing_Guide.pdf', 'Employee_Handbook.docx'],
 latency: '380ms',
 confidence: 96
 });
 }, 900);
}

// Integrations
const integrationsCatalog = ref([
 { id: 1, name: 'Shopify', desc: 'Sync customer orders, abandoned carts, and live product catalog.', connected: true, category: 'E-Commerce', iconBg: 'bg-primary/10 text-primary' },
 { id: 2, name: 'HubSpot CRM', desc: 'Two-way sync for deal pipelines, stages, and customer contacts.', connected: true, category: 'CRM', iconBg: 'bg-tag-3 text-tag-3-foreground' },
 { id: 3, name: 'Stripe Payments', desc: 'Generate secure payment links in chat and track invoice payments.', connected: true, category: 'Payments', iconBg: 'bg-tag-1 text-tag-1-foreground' },
 { id: 4, name: 'Google Calendar', desc: 'Auto-schedule product demos and booking meeting slots.', connected: false, category: 'Productivity', iconBg: 'bg-info/15 text-info' },
 { id: 5, name: 'WooCommerce', desc: 'Real-time order notifications and customer inquiry lookup.', connected: false, category: 'E-Commerce', iconBg: 'bg-tag-1 text-tag-1-foreground' },
 { id: 6, name: 'Zapier', desc: 'Connect RakanSales to over 5,000+ third-party business apps.', connected: false, category: 'Automation', iconBg: 'bg-warning/15 text-warning' },
]);

// Webhooks
const webhooksList = ref([
 { id: 1, name: 'ERP Inbound Sync', url: 'https://api.internal-erp.com/v1/rakansales-events', secret: 'whsec_89df2...a19', events: ['conversation.created', 'deal.won'], active: true, successRate: '99.8%' },
 { id: 2, name: 'Slack Alerts Bot', url: 'https://hooks.slack.com/services/T00/B00/XXXX', secret: 'whsec_410bb...e32', events: ['lead.vip_created', 'sla.breached'], active: true, successRate: '100%' }
]);

// Marketplace
const marketplaceApps = ref([
 { id: 1, name: 'WhatsApp Broadcast Pro', desc: 'High-volume segmented campaign sender with opt-out handling.', installed: true, rating: '4.9', author: 'VeecoTech Official' },
 { id: 2, name: 'AI Sentiment Classifier', desc: 'Real-time tone & urgency detector with automatic supervisor alerts.', installed: false, rating: '4.8', author: 'RakanLabs' },
 { id: 3, name: 'Commission Calculator', desc: 'Auto-calculate monthly agent commissions based on closed deals.', installed: false, rating: '4.7', author: 'SalesMetrics' },
 { id: 4, name: 'Multi-Currency Live Rate', desc: 'Automatic quotation conversions in USD, SGD, and MYR.', installed: false, rating: '4.9', author: 'FinSync' },
]);

// Audit Logs
const auditLogs = ref([
 { id: 1, user: 'Sarah Tan', action: 'Exported customer data', details: 'Exported 420 contact records to CSV', time: '12 mins ago', ip: '175.143.12.88', status: 'Success' },
 { id: 2, user: 'Alex Wong', action: 'Modified SLA Policy', details: 'Updated Urgent first-response target from 30m to 15m', time: '1 hour ago', ip: '115.164.55.21', status: 'Success' },
 { id: 3, user: 'System Bot', action: 'Refreshed WhatsApp Session', details: 'Multi-device QR session handshake verified', time: '3 hours ago', ip: '10.0.4.12', status: 'Success' },
 { id: 4, user: 'Sarah Tan', action: 'Promoted Agent Role', details: 'Promoted Marcus Lee to Senior Sales Rep', time: 'Yesterday', ip: '175.143.12.88', status: 'Success' },
 { id: 5, user: 'Farah Azman', action: 'Created Canned Response', details: 'Added new macro shortcut "/meeting"', time: '2 days ago', ip: '60.50.12.99', status: 'Success' },
]);

// Billing
const billingPlan = ref({
 name: 'RakanSales Growth Suite',
 price: 'RM 499',
 billingCycle: 'monthly',
 activeSeats: 12,
 totalSeats: 20,
 renewalDate: 'Oct 01, 2026',
 card: 'Visa ending in 4242',
 cardExp: '12/28'
});
const billingInvoices = ref([
 { id: 'INV-2026-009', date: 'Sep 01, 2026', amount: 'RM 499.00', status: 'Paid' },
 { id: 'INV-2026-008', date: 'Aug 01, 2026', amount: 'RM 499.00', status: 'Paid' },
 { id: 'INV-2026-007', date: 'Jul 01, 2026', amount: 'RM 499.00', status: 'Paid' },
]);

// ═══════════════════ EXISTING INBOXES & GUIDED WIZARD ═══════════════════

interface Inbox { id: number; name: string; type: string; icon: Component; colorBg: string; colorText: string; details: string; assignedTeam: string; active: boolean; isDefault?: boolean; }
const connectedInboxes = ref<Inbox[]>([
 { id: 1, name: 'Support Email', type: 'Email', icon: Mail, colorBg: 'bg-info/15', colorText: 'text-info', details: 'support@rakansales.com', assignedTeam: 'Support Team', active: true, isDefault: true },
 { id: 2, name: 'Website Live Chat', type: 'Live Chat', icon: MessageSquare, colorBg: 'bg-tag-1', colorText: 'text-tag-1-foreground', details: 'rakansales.com widget', assignedTeam: 'Sales Team', active: true },
 { id: 3, name: 'Sales WhatsApp', type: 'WhatsApp', icon: Smartphone, colorBg: 'bg-success/15', colorText: 'text-success', details: '+60 12-555 0001', assignedTeam: 'Sales Team', active: false },
]);

let inboxIdCounter = 10;
const activeInboxSubTab = ref('channels');
const showAddInboxModal = ref(false);
const addChannelStep = ref(1);
const selectedChannelProvider = ref('');
const newInboxName = ref('');
const newInboxDetails = ref('');
const newInboxAssigned = ref('Sales Team');
const inboxSelectedAgents = ref<number[]>([]);
const whatsappStep = ref(1);
const qrSecondsRemaining = ref(299);
let qrTimerInterval: any = null;
const qrTimerFormatted = computed(() => {
 const m = Math.floor(qrSecondsRemaining.value / 60);
 const s = qrSecondsRemaining.value % 60;
 return `${m}:${s.toString().padStart(2, '0')}`;
});

const wizardSteps = [
 { number: 1, title: 'Choose Channel', desc: 'Choose the provider you want to integrate with Rakansales.' },
 { number: 2, title: 'Create Inbox', desc: 'Authenticate your account and create an inbox.' },
 { number: 3, title: 'Add Agents', desc: 'Add agents to the created inbox.' },
 { number: 4, title: 'Voilà!', desc: 'You are all set to go!' }
];

const channelProviders = [
 { name: 'Website', desc: 'Create a live-chat widget', icon: Globe, logoUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/globe.svg', colorBg: 'bg-info/15', colorText: 'text-info' },
 { name: 'Facebook', desc: 'Connect your Facebook page', icon: MessageSquare, logoUrl: 'https://cdn.simpleicons.org/facebook/1877F2', colorBg: 'bg-tag-1', colorText: 'text-tag-1-foreground' },
 { name: 'WhatsApp', desc: 'Support your customers on WhatsApp', icon: Smartphone, logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366', colorBg: 'bg-success/15', colorText: 'text-success' },
 { name: 'SMS', desc: 'Integrate SMS channel with Twilio or bandwidth', icon: Smartphone, logoUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/mail.svg', colorBg: 'bg-tag-2', colorText: 'text-tag-2-foreground' },
 { name: 'Email', desc: 'Connect with Gmail, Outlook, or other providers', icon: Mail, logoUrl: 'https://cdn.simpleicons.org/gmail/EA4335', colorBg: 'bg-info/15', colorText: 'text-info' },
 { name: 'API', desc: 'Make a custom channel using our API', icon: Terminal, logoUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/code.svg', colorBg: 'bg-muted', colorText: 'text-foreground' },
 { name: 'Telegram', desc: 'Configure Telegram channel using Bot token', icon: Send, logoUrl: 'https://cdn.simpleicons.org/telegram/0088cc', colorBg: 'bg-tag-2', colorText: 'text-tag-2-foreground' },
 { name: 'Line', desc: 'Integrate your Line channel', icon: MessageSquare, logoUrl: 'https://cdn.simpleicons.org/line/06C755', colorBg: 'bg-success/15', colorText: 'text-success' },
 { name: 'Instagram', desc: 'Connect your instagram account', icon: Instagram, logoUrl: 'https://cdn.simpleicons.org/instagram/E1306C', colorBg: 'bg-tag-3', colorText: 'text-tag-3-foreground' },
 { name: 'TikTok', desc: 'Connect your TikTok Business inbox', icon: MessageSquare, logoUrl: 'https://cdn.simpleicons.org/tiktok/000000', colorBg: 'bg-muted', colorText: 'text-foreground' },
];

function openAddChannelWizard() {
 selectedChannelProvider.value = '';
 newInboxName.value = '';
 newInboxDetails.value = '';
 newInboxAssigned.value = 'Sales Team';
 inboxSelectedAgents.value = [];
 addChannelStep.value = 1;
 whatsappStep.value = 1;
 showAddInboxModal.value = true;
}
function selectChannelProvider(provider: any) {
 selectedChannelProvider.value = provider.name;
 newInboxName.value = `${provider.name} Inbox`;
 if (provider.name === 'Email') newInboxDetails.value = 'sales@company.com';
 else if (provider.name === 'Website') newInboxDetails.value = 'company.com';
 else if (provider.name === 'WhatsApp' || provider.name === 'SMS') newInboxDetails.value = '+60 12-345 6789';
 else newInboxDetails.value = 'api-key-928420';
}
function startSimulatedQR() {
 whatsappStep.value = 3;
 qrSecondsRemaining.value = 299;
 addToast('Simulating Connection', 'Waiting for WhatsApp QR code scan...');
 
 if (qrTimerInterval) clearInterval(qrTimerInterval);
 qrTimerInterval = window.setInterval(() => {
 if (qrSecondsRemaining.value > 0) {
 qrSecondsRemaining.value--;
 }
 }, 1000);

 setTimeout(() => {
 whatsappStep.value = 4;
 if (qrTimerInterval) {
 clearInterval(qrTimerInterval);
 qrTimerInterval = null;
 }
 addToast('WhatsApp Connected', 'Multi-device session initialized successfully.', 'success');
 }, 3500);
}
function wizardNext() {
 if (addChannelStep.value === 2 && selectedChannelProvider.value === 'WhatsApp' && whatsappStep.value !== 4) {
 addToast('Authentication Required', 'Please connect your WhatsApp account first.', 'warning');
 return;
 }
 addChannelStep.value++;
}
function wizardBack() {
 if (qrTimerInterval) {
 clearInterval(qrTimerInterval);
 qrTimerInterval = null;
 }
 if (addChannelStep.value === 2 && selectedChannelProvider.value === 'WhatsApp') {
 if (whatsappStep.value > 1) {
 whatsappStep.value = 1;
 return;
 }
 }
 if (addChannelStep.value === 3 && selectedChannelProvider.value === 'WhatsApp') {
 whatsappStep.value = 4;
 }
 addChannelStep.value--;
}
function submitAddChannel() {
 addChannelStep.value = 4;
}
function finishAddChannel() {
 const provider = channelProviders.find(p => p.name === selectedChannelProvider.value) || channelProviders[0];
 connectedInboxes.value.push({
 id: ++inboxIdCounter,
 name: newInboxName.value,
 type: selectedChannelProvider.value,
 icon: provider.icon,
 colorBg: provider.colorBg,
 colorText: provider.colorText,
 details: newInboxDetails.value,
 assignedTeam: newInboxAssigned.value,
 active: true
 });
 showAddInboxModal.value = false;
 addToast('Channel Integrated', `"${newInboxName.value}" is now active.`, 'success');
}
function closeAddChannelWizard() {
 if (qrTimerInterval) {
 clearInterval(qrTimerInterval);
 qrTimerInterval = null;
 }
 showAddInboxModal.value = false;
}

interface RoutingRule { id: number; condition: string; action: string; active: boolean; }
const routingRules = ref<RoutingRule[]>([
 { id: 1, condition: 'tag = Enterprise', action: 'Route to Enterprise Team', active: true },
 { id: 2, condition: 'lead score > 80', action: 'Assign to Senior Rep', active: true },
 { id: 3, condition: 'channel = WhatsApp', action: 'Apply tag [WhatsApp Lead]', active: false },
]);

function removeInbox(id: number) { connectedInboxes.value = connectedInboxes.value.filter(i => i.id !== id); addToast('Channel Removed', 'Channel disconnected.', 'warning'); }
function testInboxConnection(inbox: Inbox) { addToast('Connection OK', `${inbox.name} responded with status 200.`, 'success'); }
const editInboxModal = ref({ show: false, id: 0, name: '', team: '' });
function editInbox(inbox: Inbox) {
 editInboxModal.value = { show: true, id: inbox.id, name: inbox.name, team: inbox.assignedTeam };
}
function saveEditInbox() {
 const inbox = connectedInboxes.value.find(i => i.id === editInboxModal.value.id);
 if (inbox) { inbox.name = editInboxModal.value.name; inbox.assignedTeam = editInboxModal.value.team; addToast('Channel Updated', `${inbox.name} settings saved.`, 'success'); }
 editInboxModal.value.show = false;
}

// ═══════════════════ TAB 3: CUSTOM TAGS & LABELS ═══════════════════
interface TagLabel { name: string; colorBg: string; colorText: string; group: string; usageCount: number; }
const tagSearch = ref('');
const tagGroups = [
 { name: 'Marketing' },
 { name: 'Sales' },
 { name: 'Support' },
];
const activeLabels = ref<TagLabel[]>([
  { name: 'Partner', colorBg: 'var(--tag-4)', colorText: 'var(--tag-4-foreground)', group: 'Sales', usageCount: 12 },
  { name: 'Enterprise', colorBg: 'var(--tag-1)', colorText: 'var(--tag-1-foreground)', group: 'Sales', usageCount: 34 },
  { name: 'Warm Lead', colorBg: 'var(--tag-2)', colorText: 'var(--tag-2-foreground)', group: 'Marketing', usageCount: 56 },
  { name: 'Trade Show Lead', colorBg: 'var(--tag-3)', colorText: 'var(--tag-3-foreground)', group: 'Marketing', usageCount: 8 },
  { name: 'VIP Client', colorBg: 'var(--tag-5)', colorText: 'var(--tag-5-foreground)', group: 'Sales', usageCount: 5 },
  { name: 'Bug Report', colorBg: 'var(--tag-5)', colorText: 'var(--tag-5-foreground)', group: 'Support', usageCount: 23 },
  { name: 'Feature Request', colorBg: 'var(--tag-4)', colorText: 'var(--tag-4-foreground)', group: 'Support', usageCount: 17 },
]);
const showCreateTagModal = ref(false);
const tagColors = [
  { name: 'Emerald', bg: 'var(--tag-2)', text: 'var(--tag-2-foreground)' },
  { name: 'Blue', bg: 'var(--tag-1)', text: 'var(--tag-1-foreground)' },
  { name: 'Purple', bg: 'var(--tag-4)', text: 'var(--tag-4-foreground)' },
  { name: 'Amber', bg: 'var(--tag-3)', text: 'var(--tag-3-foreground)' },
  { name: 'Rose', bg: 'var(--tag-5)', text: 'var(--tag-5-foreground)' },
  { name: 'Cyan', bg: 'var(--tag-6)', text: 'var(--tag-6-foreground)' },
];
const newTagName = ref('');
const newTagGroup = ref('Marketing');
const selectedTagColor = ref(tagColors[3]);

const inlineAddGroup = ref<string | null>(null);
const inlineTagName = ref('');

function startInlineAdd(groupName: string) {
 inlineAddGroup.value = groupName;
 inlineTagName.value = '';
}
function submitInlineTag(groupName: string) {
 const cleanName = inlineTagName.value.trim();
 if (!cleanName) {
 inlineAddGroup.value = null;
 return;
 }
 const color = tagColors[Math.floor(Math.random() * tagColors.length)];
 activeLabels.value.push({
 name: cleanName,
 colorBg: color.bg,
 colorText: color.text,
 group: groupName,
 usageCount: 0
 });
 addToast('Tag Created', `[${cleanName}] added to ${groupName}.`, 'success');
 inlineAddGroup.value = null;
 inlineTagName.value = '';
}

function filteredLabelsByGroup(group: string) {
 return activeLabels.value.filter(l => l.group === group && (tagSearch.value === '' || l.name.toLowerCase().includes(tagSearch.value.toLowerCase())));
}
function createCustomTagFromModal() {
 if (!newTagName.value.trim()) return;
 activeLabels.value.push({
 name: newTagName.value.trim(),
 colorBg: selectedTagColor.value.bg,
 colorText: selectedTagColor.value.text,
 group: newTagGroup.value,
 usageCount: 0
 });
 addToast('Tag Created', `[${newTagName.value.trim()}] added to ${newTagGroup.value}.`, 'success');
 newTagName.value = '';
 showCreateTagModal.value = false;
}
function removeLabel(name: string) { activeLabels.value = activeLabels.value.filter(l => l.name !== name); addToast('Tag Removed', `Label [${name}] deleted.`, 'warning'); }
const editTagModal = ref({ show: false, originalName: '', name: '', colorBg: '', colorText: '' });
function editLabel(label: TagLabel) {
 editTagModal.value = { show: true, originalName: label.name, name: label.name, colorBg: label.colorBg, colorText: label.colorText };
}
function saveEditTag() {
 const label = activeLabels.value.find(l => l.name === editTagModal.value.originalName);
 if (label) { label.name = editTagModal.value.name; label.colorBg = editTagModal.value.colorBg; label.colorText = editTagModal.value.colorText; addToast('Tag Updated', `[${label.name}] updated successfully.`, 'success'); }
 editTagModal.value.show = false;
}

// ═══════════════════ TAB 4: AUTOMATION & MACROS ═══════════════════
// Handled by AutomationTab.vue component

// ═══════════════════ TAB 5: USER PERMISSIONS (WITH REAL AVATARS) ═══════════════════
interface UserPermission { name: string; desc: string; category: string; value: boolean; }
interface WorkspaceUser { id: number; name: string; role: string; avatarBg: string; avatar: string; online: boolean; lastSeen: string; active: boolean; dealCount: number; convCount: number; permissions: UserPermission[]; }

const permCategories = [
 { name: 'CRM Access' },
 { name: 'AI & Training' },
 { name: 'Billing & Admin' },
 { name: 'Channels' },
 { name: 'Reporting' },
];

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

const workspaceUsers = ref<WorkspaceUser[]>([
 { id: 1, name: 'Justin', role: 'Workspace Admin', avatarBg: 'bg-primary/20 text-primary', avatar: '/avatars/agent_14_chinese_male_skyblue.png', online: true, lastSeen: '', active: true, dealCount: 12, convCount: 87, permissions: makeDefaultPerms(true) },
 { id: 2, name: 'Sarah', role: 'Senior Sales Rep', avatarBg: 'bg-tag-3 text-tag-3-foreground', avatar: '/avatars/agent_18_malay_female_hijab_rose.png', online: true, lastSeen: '', active: true, dealCount: 34, convCount: 142, permissions: [
 ...makeDefaultPerms(false).map(p => p.name === 'View All Deals' || p.name === 'Edit Deals' || p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
 ]},
 { id: 3, name: 'David', role: 'Sales Rep', avatarBg: 'bg-info/15 text-info', avatar: '/avatars/agent_12_indian_male_lavender.png', online: false, lastSeen: '2h ago', active: true, dealCount: 18, convCount: 64, permissions: [
 ...makeDefaultPerms(false).map(p => p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
 ]},
 { id: 4, name: 'Emma', role: 'Junior Rep', avatarBg: 'bg-warning/15 text-warning', avatar: '/avatars/agent_11_chinese_female_mint.png', online: false, lastSeen: 'Yesterday', active: true, dealCount: 7, convCount: 23, permissions: makeDefaultPerms(false) },
]);

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

const workspaceRoles = ref<any[]>([
 { name: 'Workspace Admin', colorBg: 'bg-primary/10', colorText: 'text-primary', description: 'Full administrative access to settings, billing, team setup, and reporting.', permissions: makeDefaultPerms(true) },
 { name: 'Senior Sales Rep', colorBg: 'bg-tag-3', colorText: 'text-tag-3-foreground', description: 'Access to deals, CRM controls, analytics reports, and channel configurations.', permissions: [
 ...makeDefaultPerms(false).map(p => p.name === 'View All Deals' || p.name === 'Edit Deals' || p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
 ]},
 { name: 'Sales Rep', colorBg: 'bg-info/15', colorText: 'text-info', description: 'Standard sales rep access to deals, contacts, and messaging inboxes.', permissions: [
 ...makeDefaultPerms(false).map(p => p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
 ]},
 { name: 'Junior Rep', colorBg: 'bg-warning/15', colorText: 'text-warning', description: 'Basic workspace access for ticket response, lead capture, and read-only reports.', permissions: makeDefaultPerms(false) },
]);

const workspaceTeams = ref<WorkspaceTeam[]>([
 {
 id: 1,
 name: 'Sales Team',
 description: 'Handles general inbound inquiries, WhatsApp follow-ups, and active deals.',
 iconName: 'MessageSquare',
 color: 'emerald',
 members: [1, 2, 3], // Justin, Sarah, David
 channels: ['Website Live Chat', 'Sales WhatsApp'],
 routingStrategy: 'round-robin',
 },
 {
 id: 2,
 name: 'Support Team',
 description: 'Resolves technical requests, billing issues, and support SLAs.',
 iconName: 'Inbox',
 color: 'blue',
 members: [1, 4], // Justin, Emma
 channels: ['Support Email'],
 routingStrategy: 'least-busy',
 },
 {
 id: 3,
 name: 'Enterprise Team',
 description: 'Exclusive team for VIP pricing, SLA compliance, and high-value partnerships.',
 iconName: 'Shield',
 color: 'violet',
 members: [2, 3], // Sarah, David
 channels: [],
 routingStrategy: 'broadcast',
 },
]);

// ═══════════════════ TAB 6: WEB FORMS ═══════════════════
interface FormField { label: string; type: string; required: boolean; }
interface FormSubmission { id: number; name: string; email: string; date: string; }
interface WebForm { id: number; name: string; desc: string; active: boolean; fields: FormField[]; leadsCount: number; convRate: number; submissions: FormSubmission[]; }

const activeWebforms = ref<WebForm[]>([
 {
 id: 1, name: 'General Lead Capture', desc: 'Main site inquiry form', active: true,
 fields: [
 { label: 'Full Name', type: 'Text', required: true },
 { label: 'Email', type: 'Email', required: true },
 { label: 'Company Name', type: 'Text', required: false },
 { label: 'How did you hear?', type: 'Dropdown', required: false },
 ],
 leadsCount: 142, convRate: 18,
 submissions: [
 { id: 1, name: 'James Torres', email: 'james@acmecorp.com', date: 'Jul 6, 09:12' },
 { id: 2, name: 'Priya Singh', email: 'priya@techstart.io', date: 'Jul 5, 14:30' },
 { id: 3, name: 'Leo Nguyen', email: 'leo@finbridge.co', date: 'Jul 4, 11:05' },
 ]
 },
 {
 id: 2, name: 'Newsletter Signup', desc: 'Email list opt-in widget', active: true,
 fields: [
 { label: 'Email Address', type: 'Email', required: true },
 { label: 'First Name', type: 'Text', required: false },
 ],
 leadsCount: 356, convRate: 42,
 submissions: [
 { id: 4, name: 'Clara Webb', email: 'clara@growthco.com', date: 'Jul 6, 08:45' },
 { id: 5, name: 'Marcus Hill', email: 'marcus@b2bgroup.io', date: 'Jul 5, 16:20' },
 ]
 },
 {
 id: 3, name: 'Trade Show Demo Request', desc: 'Event-specific capture form', active: false,
 fields: [
 { label: 'Name', type: 'Text', required: true },
 { label: 'Business Email', type: 'Email', required: true },
 { label: 'Company Size', type: 'Dropdown', required: true },
 { label: 'Preferred Time Slot', type: 'Dropdown', required: true },
 ],
 leadsCount: 28, convRate: 65,
 submissions: [
 { id: 6, name: 'Sofia Reyes', email: 'sofia@innovation.co', date: 'Jun 30, 11:00' },
 ]
 },
 {
 id: 4, name: 'Enterprise Pricing Request', desc: 'Detailed corporate pricing inquiry', active: true,
 fields: [
 { label: 'Full Name', type: 'Text', required: true },
 { label: 'Work Email', type: 'Email', required: true },
 { label: 'Company Size', type: 'Dropdown', required: true },
 { label: 'Budget Range', type: 'Dropdown', required: true },
 { label: 'Message Details', type: 'Text', required: false },
 ],
 leadsCount: 89, convRate: 24,
 submissions: [
 { id: 7, name: 'Ethan Hunt', email: 'ethan@impossible.org', date: 'Jul 6, 12:40' },
 { id: 8, name: 'Diana Prince', email: 'diana@themyscira.gov', date: 'Jul 5, 09:15' },
 ]
 },
 {
 id: 5, name: 'Partner Program Application', desc: 'Affiliate and reseller signup form', active: true,
 fields: [
 { label: 'Company Name', type: 'Text', required: true },
 { label: 'Contact Person', type: 'Text', required: true },
 { label: 'Contact Email', type: 'Email', required: true },
 { label: 'Partner Type', type: 'Dropdown', required: true },
 ],
 leadsCount: 45, convRate: 15,
 submissions: [
 { id: 9, name: 'Bruce Wayne', email: 'bruce@waynecorp.com', date: 'Jul 5, 23:50' },
 ]
 },
 {
 id: 6, name: 'Product Feedback Survey', desc: 'Beta tester insights and requests', active: true,
 fields: [
 { label: 'Rating (1-5)', type: 'Dropdown', required: true },
 { label: 'Primary Use Case', type: 'Text', required: true },
 { label: 'Email (Optional)', type: 'Email', required: false },
 ],
 leadsCount: 112, convRate: 38,
 submissions: [
 { id: 10, name: 'Clark Kent', email: 'clark@dailyplanet.com', date: 'Jul 6, 10:30' },
 ]
 },
]);

const formKpis = computed(() => [
 { label: 'Total Forms', value: activeWebforms.value.length, change: `${activeWebforms.value.filter(f => f.active).length} active`, positive: true },
 { label: 'Total Leads', value: activeWebforms.value.reduce((a, f) => a + f.leadsCount, 0), change: '+23 this week', positive: true },
 { label: 'Avg. Conversion', value: (activeWebforms.value.reduce((a, f) => a + f.convRate, 0) / activeWebforms.value.length).toFixed(1) + '%', change: '↑ 4.2% vs last month', positive: true },
 { label: 'AI-Generated', value: activeWebforms.value.filter(f => f.desc.includes('AI') || f.name.includes('Enterprise')).length, change: 'From training files', positive: true },
]);

const embedModal = ref({ show: false, formId: 0, formName: '' });
const showCreateFormModal = ref(false);
const newFormName = ref('');
const newFormDesc = ref('');
const newFormRedirect = ref('');
const newFormAgent = ref('Round Robin (All)');
let formIdCounter = 10;

function showFormEmbedCode(form: WebForm) {
 embedModal.value = { show: true, formId: form.id, formName: form.name };
}
function copyEmbedSnippet() {
 addToast('Code Copied', 'Form embed script copied to clipboard.', 'success');
 embedModal.value.show = false;
}

function createWebForm() {
 const newForm: WebForm = {
 id: ++formIdCounter, name: newFormName.value, desc: newFormDesc.value || 'Custom lead capture form',
 active: true, fields: [
 { label: 'Full Name', type: 'Text', required: true },
 { label: 'Email Address', type: 'Email', required: true },
 ],
 leadsCount: 0, convRate: 0, submissions: []
 };
 activeWebforms.value.push(newForm);
 showCreateFormModal.value = false;
 newFormName.value = ''; newFormDesc.value = ''; newFormRedirect.value = '';
 addToast('Form Created', `"${newForm.name}" is now ready.`, 'success');
}
function duplicateForm(form: WebForm) {
 const copy: WebForm = { ...form, id: ++formIdCounter, name: `${form.name} (Copy)`, leadsCount: 0, submissions: [], fields: form.fields.map(f => ({ ...f })) };
 activeWebforms.value.push(copy);
 addToast('Form Duplicated', `"${copy.name}" created successfully.`, 'success');
}
function removeWebform(id: number) {
 activeWebforms.value = activeWebforms.value.filter(f => f.id !== id);
 addToast('Form Deleted', 'Web form removed.', 'warning');
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

.custom-settings-scrollbar::-webkit-scrollbar {
 width: 4px;
}
.custom-settings-scrollbar::-webkit-scrollbar-track {
 background: transparent;
}
.custom-settings-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
 border-radius: 4px;
}
.custom-settings-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
</style>
