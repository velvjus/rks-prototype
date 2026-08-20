<template>
  <div class="h-full flex flex-col bg-gray-50 overflow-hidden text-sm">
    <div class="flex-1 flex overflow-hidden">

      <!-- ═══════════════════ MAIN CONTENT CANVAS ═══════════════════ -->
      <main class="flex-1 overflow-y-auto bg-gray-50">
        <div class="max-w-5xl mx-auto px-6 py-8 space-y-8">

          <!-- ══════════════ TAB: AI TRAINING HUB ══════════════ -->
          <div v-if="activeTab === 'ai-training'" class="space-y-6">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
                  <Sparkles class="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  AI Training Hub
                </h1>
                <p class="text-sm text-gray-400 mt-0.5">Train your AI on product guides, pricing sheets, and internal SOPs.</p>
              </div>
              <button
                @click="loadDemoFiles"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white font-bold text-xs rounded-lg shadow transition-all cursor-pointer opacity-0 pointer-events-none"
              >
                <Play class="w-3.5 h-3.5 fill-current" />
                Simulate Demo Upload
              </button>
            </div>

            <!-- Knowledge Base Table -->
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 class="font-bold text-gray-900 text-xs uppercase tracking-wider">Knowledge Base Documents</h3>
                  <p class="text-[10px] text-gray-400 mt-0.5">{{ knowledgeDocs.length }} documents • Model version {{ aiModelVersion }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="aiModelVersion !== 'v0.0'" class="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">Active Model</span>
                  <button @click="showAddDocModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors">
                    <Plus class="w-3.5 h-3.5" /> Add Document
                  </button>
                </div>
              </div>
              <div v-if="knowledgeDocs.length > 0" class="divide-y divide-gray-100">
                <div v-for="doc in knowledgeDocs" :key="doc.id" class="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="doc.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'">
                      <FileText class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="font-bold text-xs text-gray-900">{{ doc.name }}</div>
                      <div class="text-[10px] text-gray-400 mt-0.5">{{ doc.size }} • Added {{ doc.date }} • <span :class="doc.status === 'Trained' ? 'text-primary font-semibold' : 'text-yellow-600 font-semibold'">{{ doc.status }}</span></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="retrainDoc(doc)" class="px-2 py-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold text-[10px] rounded cursor-pointer border border-yellow-200">Re-Train</button>
                    <button @click="editDocName(doc)" class="p-1.5 text-gray-400 hover:text-primary rounded cursor-pointer"><Pencil class="w-3.5 h-3.5" /></button>
                    <button @click="removeDoc(doc.id)" class="p-1.5 text-gray-400 hover:text-red-500 rounded cursor-pointer"><Trash2 class="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
              <div v-else class="p-8 text-center text-gray-400 text-xs">No documents added. Drop files below to begin training.</div>
            </div>

            <!-- Training Progress (Switched positions!) -->
            <div v-if="filesList.length > 0" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-gray-900 text-xs uppercase tracking-wider">Training Progress</h3>
                <span class="text-xs font-bold" :class="trainingProgress === 100 ? 'text-primary' : 'text-gray-500'">
                  {{ trainingProgress === 100 ? '✓ AI Trained & Deployed' : `${trainingProgress}% complete` }}
                </span>
              </div>
              <div v-for="file in filesList" :key="file.name" class="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/55">
                <div class="flex items-center gap-3">
                  <FileText class="w-7 h-7 text-primary" />
                  <div>
                    <div class="font-semibold text-xs text-gray-900">{{ file.name }}</div>
                    <div class="text-[10px] text-gray-400 mt-0.5">{{ file.size }} • {{ file.status }}</div>
                  </div>
                </div>
                <div v-if="file.progress < 100" class="w-20">
                  <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-primary h-full transition-all duration-100" :style="{ width: `${file.progress}%` }"></div>
                  </div>
                </div>
                <CheckCircle2 v-else class="w-5 h-5 text-primary shrink-0" />
              </div>
              <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-emerald-400 h-full transition-all duration-300 rounded-full" :style="{ width: `${trainingProgress}%` }"></div>
              </div>
              <div class="flex items-center gap-1.5 text-[11px] text-gray-550">
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
              class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[180px] bg-white shadow-sm cursor-pointer"
              :class="isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Upload class="w-6 h-6" />
              </div>
              <h3 class="font-bold text-gray-900 text-sm">Drag & drop knowledge files here</h3>
              <p class="text-xs text-gray-400 mt-1 max-w-sm">Supports PDF, DOCX, TXT up to 25MB each</p>
              <input type="file" ref="fileInput" class="hidden" multiple @change="handleFileSelect" />
              <button @click="triggerFileInput" class="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg cursor-pointer">Browse Files</button>
            </div>
          </div>

          <!-- ══════════════ TAB: AI TRAINING HISTORY ══════════════ -->
          <div v-if="activeTab === 'training-history'" class="space-y-6">
            <div>
              <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
                <History class="w-6 h-6 text-yellow-500 animate-pulse" />
                AI Model Training History
              </h1>
              <p class="text-sm text-gray-400 mt-0.5">Audit log of all LLM training runs, document indexings, and deployment states.</p>
            </div>

            <!-- Training History Log -->
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                <h3 class="font-bold text-gray-900 text-xs uppercase tracking-wider">Training Runs Audit Log</h3>
                <button v-if="trainingHistory.length > 0" @click="trainingHistory = []" class="text-[10px] text-gray-400 hover:text-red-500 cursor-pointer font-bold">Clear All History</button>
              </div>
              <div v-if="trainingHistory.length > 0" class="divide-y divide-gray-100">
                <div v-for="entry in trainingHistory" :key="entry.id" class="px-4 py-3.5 flex items-center justify-between text-xs hover:bg-gray-50/50 transition-colors">
                   <div class="flex items-center gap-3">
                     <div class="w-2.5 h-2.5 rounded-full bg-[#23B750]" :class="entry.success ? 'animate-pulse' : 'bg-red-400'"></div>
                     <div>
                       <span class="font-bold text-gray-800">{{ entry.action }}</span>
                       <span class="text-gray-400 ml-1.5">Model build version: <strong class="text-gray-700 font-mono">{{ entry.model }}</strong></span>
                     </div>
                   </div>
                   <div class="flex items-center gap-4">
                     <span class="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-100">Success</span>
                     <span class="text-[10px] text-gray-400 font-mono">{{ entry.time }}</span>
                   </div>
                </div>
              </div>
              <div v-else class="p-8 text-center text-gray-400 text-xs">No training runs recorded yet.</div>
            </div>
          </div>

          <!-- ══════════════ TAB: INBOXES ══════════════ -->
          <div v-if="activeTab === 'inboxes'" class="space-y-6">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Inbox Integrations</h1>
                <p class="text-sm text-gray-400 mt-0.5">Connect business channels to your unified inbox for AI-powered routing.</p>
              </div>
              <button v-if="activeInboxSubTab === 'channels'" @click="openAddChannelWizard" class="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg cursor-pointer shadow">
                <Plus class="w-3.5 h-3.5" /> Add Channel
              </button>
            </div>

            <!-- Sub Tabs Navigation -->
            <div class="flex border-b border-gray-200 pb-px">
              <button
                @click="activeInboxSubTab = 'channels'"
                class="px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
                :class="activeInboxSubTab === 'channels' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'"
              >
                Connected Channels
              </button>
              <button
                @click="activeInboxSubTab = 'rules'"
                class="px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors"
                :class="activeInboxSubTab === 'rules' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'"
              >
                Inbox Routing Rules
              </button>
            </div>

            <!-- Sub Tab 1: Connected Channels -->
            <div v-if="activeInboxSubTab === 'channels'" class="space-y-6 animate-fade-in">
              <!-- Connected Inboxes Table -->
              <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/30">
                  <h3 class="font-bold text-gray-900 text-xs uppercase tracking-wider">Connected Channels</h3>
                  <span class="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">{{ connectedInboxes.filter(i => i.active).length }} Active</span>
                </div>
                <div class="divide-y divide-gray-100">
                  <div v-for="inbox in connectedInboxes" :key="inbox.id" class="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="inbox.colorBg">
                        <component :is="inbox.icon" class="w-5 h-5" :class="inbox.colorText" />
                      </div>
                      <div>
                        <div class="font-bold text-xs text-gray-900 flex items-center gap-2">
                          {{ inbox.name }}
                          <span v-if="inbox.isDefault" class="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold">Default</span>
                        </div>
                        <div class="text-[10px] text-gray-400 mt-0.5">{{ inbox.details }} • {{ inbox.type }} • Routed to: <span class="text-gray-600 font-semibold">{{ inbox.assignedTeam }}</span></div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button @click="testInboxConnection(inbox)" class="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] rounded cursor-pointer border border-blue-200 transition-all">Test</button>
                      <button @click="editInbox(inbox)" class="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-primary rounded cursor-pointer transition-all"><Pencil class="w-3.5 h-3.5" /></button>
                      <button
                        @click="inbox.active = !inbox.active"
                        class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
                        :class="inbox.active ? 'bg-primary' : 'bg-gray-200'"
                      >
                        <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200" :class="inbox.active ? 'translate-x-4' : 'translate-x-0'"></span>
                      </button>
                      <button @click="removeInbox(inbox.id)" class="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 rounded cursor-pointer transition-all"><Trash2 class="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub Tab 2: Routing Rules Panel -->
            <div v-if="activeInboxSubTab === 'rules'" class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
              <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-bold text-gray-900 text-xs uppercase tracking-wider">Inbox Routing Rules</h3>
                <button @click="addToast('Routing Rule Added', 'New routing condition applied across inbox channels.', 'success')" class="text-[10px] text-primary font-bold hover:underline cursor-pointer">+ Add Rule</button>
              </div>
              <div class="divide-y divide-gray-100">
                <div v-for="rule in routingRules" :key="rule.id" class="p-4 flex items-center justify-between hover:bg-gray-50/50">
                  <div class="flex items-center gap-2 text-xs">
                    <span class="font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">IF {{ rule.condition }}</span>
                    <span class="text-gray-400">→</span>
                    <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px]">{{ rule.action }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="rule.active = !rule.active" class="relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors" :class="rule.active ? 'bg-primary' : 'bg-gray-200'">
                      <span class="inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-200" :class="rule.active ? 'translate-x-4' : 'translate-x-0'"></span>
                    </button>
                    <button @click="routingRules = routingRules.filter(r => r.id !== rule.id)" class="text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 class="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════ TAB: CUSTOM TAGS & LABELS ══════════════ -->
          <div v-if="activeTab === 'labels'" class="space-y-6">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Custom Tags & Labels</h1>
                <p class="text-sm text-gray-400 mt-0.5">Color-coded tags for deal profiling, lead sorting, and macro triggers.</p>
              </div>
              <div class="flex items-center gap-2">
                <button @click="addToast('Tags Exported', 'Label library exported as tags.json.', 'success')" class="px-3 py-1.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-lg cursor-pointer hover:bg-gray-50">Export</button>
                <button @click="showCreateTagModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer">
                  <Plus class="w-3.5 h-3.5" /> New Tag
                </button>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="tagSearch" type="text" placeholder="Search labels..." class="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <!-- Tags by Group -->
            <div v-for="group in tagGroups" :key="group.name" class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/30">
                <h3 class="font-bold text-gray-900 text-xs uppercase tracking-wider">{{ group.name }}</h3>
                <span class="text-[10px] text-gray-400 font-semibold">{{ filteredLabelsByGroup(group.name).length }} tags</span>
              </div>
              <div class="p-4">
                <div v-if="filteredLabelsByGroup(group.name).length === 0" class="text-[11px] text-gray-400 italic mb-2">No tags in this group.</div>
                
                <div class="flex flex-wrap items-center gap-2.5">
                  <div
                    v-for="label in filteredLabelsByGroup(group.name)"
                    :key="label.name"
                    class="inline-flex items-center gap-1.5 pl-3 pr-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-gray-150 group relative select-none hover:pr-10 transition-all duration-200"
                    :style="{ backgroundColor: label.colorBg, color: label.colorText }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: label.colorText }"></span>
                    <span class="truncate">{{ label.name }}</span>
                    <span class="text-[9px] opacity-60 shrink-0">{{ label.usageCount }} uses</span>
                    
                    <!-- Hover Actions Overlay -->
                    <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 rounded-full px-1 py-0.5 border border-gray-200 shadow-xs">
                      <button @click.stop="editLabel(label)" class="text-gray-500 hover:text-primary cursor-pointer hover:scale-110 active:scale-95 transition-transform" title="Edit Tag">
                        <Pencil class="w-2.5 h-2.5" />
                      </button>
                      <button @click.stop="removeLabel(label.name)" class="text-gray-500 hover:text-red-500 cursor-pointer hover:scale-110 active:scale-95 transition-transform font-bold text-[9px] px-0.5" title="Delete Tag">✕</button>
                    </div>
                  </div>

                  <!-- Inline Add Tag Input / Trigger -->
                  <div class="inline-block">
                    <button
                      v-if="inlineAddGroup !== group.name"
                      @click="startInlineAdd(group.name)"
                      class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-gray-300 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors shadow-sm"
                    >
                      <Plus class="w-3.5 h-3.5" />
                      Add Tag
                    </button>
                    <div v-else class="flex items-center gap-1.5">
                      <input
                        type="text"
                        v-model="inlineTagName"
                        placeholder="Tag name..."
                        class="text-xs px-3 py-1 border border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-primary w-32 bg-white"
                        @keydown.enter="submitInlineTag(group.name)"
                        @keydown.escape="inlineAddGroup = null"
                        v-focus
                      />
                      <button @click="submitInlineTag(group.name)" class="text-xs text-primary font-bold hover:underline cursor-pointer">Add</button>
                      <button @click="inlineAddGroup = null" class="text-xs text-gray-400 hover:text-gray-650 cursor-pointer">✕</button>
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
          <div v-if="activeTab === 'web-forms'" class="space-y-6">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Web Forms</h1>
                <p class="text-sm text-gray-400 mt-0.5">Manage lead capture forms with AI-powered field generation and easy embedding.</p>
              </div>
              <button @click="showCreateFormModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow">
                <Plus class="w-3.5 h-3.5" /> Create Form
              </button>
            </div>

            <!-- Forms Stats KPI Row -->
            <div class="grid grid-cols-4 gap-4">
              <div v-for="kpi in formKpis" :key="kpi.label" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{{ kpi.label }}</div>
                <div class="text-2xl font-extrabold text-gray-900 mt-1">{{ kpi.value }}</div>
                <div class="text-[10px] mt-1" :class="kpi.positive ? 'text-primary' : 'text-gray-400'">{{ kpi.change }}</div>
              </div>
            </div>

            <!-- Full width Table Format of Web Forms -->
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <th class="p-4">Form Name</th>
                      <th class="p-4 text-center">Fields</th>
                      <th class="p-4 text-center">Leads Captured</th>
                      <th class="p-4 text-center">Conv. Rate</th>
                      <th class="p-4 text-center">Source Type</th>
                      <th class="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 font-medium">
                    <tr v-for="form in activeWebforms" :key="form.id" class="hover:bg-gray-50/50 transition-colors">
                      <td class="p-4">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-gray-900 text-xs">{{ form.name }}</span>
                          <span class="text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0" :class="form.active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'">{{ form.active ? 'Active' : 'Paused' }}</span>
                        </div>
                        <div class="text-[10px] text-gray-400 font-normal mt-0.5 max-w-sm leading-normal">{{ form.desc }}</div>
                      </td>
                      <td class="p-4 text-center text-gray-700">{{ form.fields.length }} fields</td>
                      <td class="p-4 text-center text-gray-900 font-bold">{{ form.leadsCount }}</td>
                      <td class="p-4 text-center text-primary font-bold">{{ form.convRate }}%</td>
                      <td class="p-4 text-center whitespace-nowrap">
                        <span v-if="form.desc.toLowerCase().includes('ai') || form.name.toLowerCase().includes('enterprise')" class="bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded text-[9px] inline-flex items-center gap-1 border border-yellow-250 animate-pulse">
                          <Sparkles class="w-2.5 h-2.5 fill-current" /> AI Generated
                        </span>
                        <span v-else class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px]">Standard</span>
                      </td>
                      <td class="p-4 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-1.5">
                          <button
                            @click="form.active = !form.active; addToast(form.active ? 'Form Activated' : 'Form Paused', `${form.name} status updated.`, 'success')"
                            class="px-2 py-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded border border-gray-200 bg-white font-bold cursor-pointer transition-colors"
                            :title="form.active ? 'Pause Form' : 'Activate Form'"
                          >
                            {{ form.active ? 'Pause' : 'Activate' }}
                          </button>
                          <button
                            @click="showFormEmbedCode(form)"
                            class="px-2 py-1 text-primary hover:bg-primary/5 rounded border border-primary/20 bg-white font-bold cursor-pointer transition-colors"
                          >
                            Embed Code
                          </button>
                          <button
                            @click="duplicateForm(form)"
                            class="p-1 text-gray-400 hover:text-primary hover:bg-gray-100 rounded cursor-pointer transition-colors"
                            title="Duplicate"
                          >
                            <Copy class="w-3.5 h-3.5" />
                          </button>
                          <button
                            @click="removeWebform(form.id)"
                            class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-55 rounded cursor-pointer transition-colors"
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

        </div><!-- /max-w-5xl -->
      </main>
    </div>

    <!-- ═══ MODALS ═══ -->

    <!-- Embed Code Modal -->
    <div v-if="embedModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
        <header class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
            <FileText class="w-4 h-4 text-primary" /> Embed Web Form: {{ embedModal.formName }}
          </h3>
          <button @click="embedModal.show = false" class="text-gray-400 hover:text-gray-600 cursor-pointer"><X class="w-4 h-4" /></button>
        </header>
        <div class="p-6 space-y-4">
          <p class="text-xs text-gray-500">Copy the script or HTML embed code below to place this form on your website or portal.</p>
          
          <div class="bg-gray-950 text-xs text-green-400 font-mono p-4 rounded-xl border border-gray-800 overflow-x-auto space-y-2 select-all">
            <div class="text-gray-500">/* HTML Snippet with script loader */</div>
            <div>&lt;script src="https://forms.rakansales.com/embed.js" async&gt;&lt;/script&gt;</div>
            <div>&lt;div data-rks-form="{{ embedModal.formId }}" data-theme="light"&gt;&lt;/div&gt;</div>
          </div>

          <div class="flex justify-between items-center pt-2">
            <span class="text-[10px] text-gray-400 italic">Embed automatically tracks and creates leads in Real Time</span>
            <div class="flex gap-2">
              <button @click="embedModal.show = false" class="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-lg cursor-pointer">Close</button>
              <button @click="copyEmbedSnippet" class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow">Copy Snippet</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- ══════ MODAL: Add Channel Guided Stepper Wizard (BASED ON DESIGN) ══════ -->
    <div v-if="showAddInboxModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 flex overflow-hidden min-h-[520px]">
        
        <!-- Wizard Left Sidebar (Guided Flow steps list) -->
        <div class="w-64 bg-gray-50 border-r border-gray-150 p-6 flex flex-col justify-between shrink-0 select-none">
          <div class="space-y-6 relative">
            <div class="absolute left-[15px] top-[10px] bottom-[10px] w-0.5 bg-gray-200 z-0"></div>

            <div v-for="step in wizardSteps" :key="step.number" class="flex items-start gap-4 relative z-10">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                :class="addChannelStep === step.number
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : addChannelStep > step.number
                    ? 'bg-primary/20 text-primary'
                    : 'bg-white border border-gray-300 text-gray-400'"
              >
                <Check v-if="addChannelStep > step.number" class="w-4 h-4" />
                <span v-else>{{ step.number }}</span>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold transition-colors" :class="addChannelStep === step.number ? 'text-primary' : 'text-gray-505'">{{ step.title }}</div>
                <div class="text-[9px] text-gray-400 mt-0.5 leading-relaxed">{{ step.desc }}</div>
              </div>
            </div>
          </div>
          
          <div class="text-[9px] text-gray-400">RakanSales Integration Agent</div>
        </div>

        <!-- Wizard Right Content Pane -->
        <div class="flex-1 p-6 flex flex-col justify-between min-h-[480px]">
          
          <!-- STEP 1: CHOOSE PROVIDER -->
          <div v-if="addChannelStep === 1" class="space-y-4">
            <div class="border-b border-gray-100 pb-3">
              <h3 class="font-bold text-base text-gray-900">Choose Channel</h3>
              <p class="text-xs text-gray-400 mt-0.5">Select the channel provider you want to integrate with Rakansales.</p>
            </div>
            
            <div class="grid grid-cols-3 gap-3 overflow-y-auto max-h-[340px] pr-1">
              <div
                v-for="provider in channelProviders"
                :key="provider.name"
                @click="selectChannelProvider(provider)"
                class="border-2 rounded-xl p-4 flex flex-col items-start text-left cursor-pointer transition-all hover:border-primary/45 hover:shadow-sm"
                :class="selectedChannelProvider === provider.name
                  ? 'border-primary bg-primary/5 shadow-inner'
                  : 'border-gray-150 bg-white'"
              >
                <div class="w-9 h-9 flex items-center justify-center mb-3 shrink-0 bg-transparent">
                  <template v-if="provider.name === 'Website'">
                    <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </template>
                  <template v-else-if="provider.name === 'SMS'">
                    <svg class="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </template>
                  <template v-else-if="provider.name === 'API'">
                    <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </template>
                  <template v-else>
                    <img :src="provider.logoUrl" class="w-7 h-7 object-contain" :alt="provider.name" />
                  </template>
                </div>
                <div class="font-bold text-xs text-gray-900">{{ provider.name }}</div>
                <div class="text-[10px] text-gray-400 mt-1 leading-snug">{{ provider.desc }}</div>
              </div>
            </div>
          </div>

          <!-- STEP 2: CREATE INBOX -->
          <div v-if="addChannelStep === 2" class="space-y-4">
            <template v-if="selectedChannelProvider === 'WhatsApp'">
              <!-- Sub-step 2.1: Select your API provider -->
              <div v-if="whatsappStep === 1" class="space-y-4">
                <div class="border-b border-gray-100 pb-3">
                  <h3 class="font-bold text-base text-gray-900">Select your API provider</h3>
                  <p class="text-xs text-gray-400 mt-0.5">Choose your WhatsApp provider. You can connect directly through Meta which requires no setup, or connect through Twilio using your account credentials.</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Connect Through QR Code -->
                  <div
                    @click="whatsappStep = 2"
                    class="border-2 border-gray-150 hover:border-primary/45 rounded-xl p-5 flex flex-col items-start text-left cursor-pointer transition-all bg-white hover:shadow-sm"
                  >
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4 shrink-0 text-gray-700">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.372a9.954 9.954 0 0 0 4.777 1.22h.005c5.505 0 9.989-4.478 9.99-9.985A9.998 9.998 0 0 0 12.012 2zm5.728 14.103c-.25.706-1.442 1.3-1.977 1.385-.49.078-1.13.147-3.268-.737-2.734-1.132-4.5-3.905-4.636-4.087-.137-.182-1.11-1.478-1.11-2.817 0-1.338.702-1.995.952-2.26.25-.263.543-.329.724-.329.18 0 .362.002.52.009.164.007.385-.026.594.494.21.52.723 1.76.786 1.892.062.13.104.282.018.451-.085.17-.129.277-.257.43-.129.15-.271.337-.387.452-.13.129-.267.27-.116.53.151.26.67 1.103 1.432 1.78.98.874 1.8-1.144 2.056-1.01.256.133 1.62.763 1.9.903.28.14.467.21.536.328.07.12.07.69-.18 1.396z"/>
                      </svg>
                    </div>
                    <div class="font-bold text-sm text-gray-900">Connect Through QR Code</div>
                    <div class="text-xs text-gray-400 mt-1 leading-relaxed">Scan QR code to connect your WhatsApp instantly</div>
                  </div>
                  <!-- Connect Through Meta -->
                  <div
                    @click="addToast('Meta Integration', 'Meta Cloud API login screen simulation.')"
                    class="border-2 border-gray-150 hover:border-primary/45 rounded-xl p-5 flex flex-col items-start text-left cursor-pointer transition-all bg-white hover:shadow-sm"
                  >
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4 shrink-0 text-gray-700">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.372a9.954 9.954 0 0 0 4.777 1.22h.005c5.505 0 9.989-4.478 9.99-9.985A9.998 9.998 0 0 0 12.012 2zm5.728 14.103c-.25.706-1.442 1.3-1.977 1.385-.49.078-1.13.147-3.268-.737-2.734-1.132-4.5-3.905-4.636-4.087-.137-.182-1.11-1.478-1.11-2.817 0-1.338.702-1.995.952-2.26.25-.263.543-.329.724-.329.18 0 .362.002.52.009.164.007.385-.026.594.494.21.52.723 1.76.786 1.892.062.13.104.282.018.451-.085.17-.129.277-.257.43-.129.15-.271.337-.387.452-.13.129-.267.27-.116.53.151.26.67 1.103 1.432 1.78.98.874 1.8-1.144 2.056-1.01.256.133 1.62.763 1.9.903.28.14.467.21.536.328.07.12.07.69-.18 1.396z"/>
                      </svg>
                    </div>
                    <div class="font-bold text-sm text-gray-900">Connect Through Meta</div>
                    <div class="text-xs text-gray-400 mt-1 leading-relaxed">Quick setup through Meta Login</div>
                  </div>
                </div>
              </div>

              <!-- Sub-step 2.2: WhatsApp Integration details form -->
              <div v-else-if="whatsappStep === 2" class="space-y-4 animate-fade-in">
                <div class="p-4 border border-gray-200 bg-gray-50/50 rounded-xl space-y-2.5 text-xs text-gray-650">
                  <div class="font-bold text-sm text-gray-900">WhatsApp Integration</div>
                  <p class="text-xs text-gray-405">Connect your WhatsApp account to start receiving and sending messages.</p>
                  <ul class="list-disc pl-4 space-y-1 text-gray-400">
                    <li>Enter a name for your WhatsApp inbox</li>
                    <li>Click "Generate QR Code" to create a new session</li>
                    <li>Scan the QR code with your WhatsApp mobile app</li>
                    <li>You'll be automatically redirected once connected</li>
                  </ul>
                </div>

                <div class="space-y-3.5 max-w-md">
                  <div>
                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Inbox Name</label>
                    <input type="text" v-model="newInboxName" placeholder="Please enter an inbox name" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <button
                    type="button"
                    @click="startSimulatedQR"
                    :disabled="!newInboxName"
                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow disabled:opacity-50"
                  >
                    Generate QR Code
                  </button>
                </div>
              </div>

              <!-- Sub-step 2.3: Scan QR Code screen -->
              <div v-else-if="whatsappStep === 3 || whatsappStep === 4" class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-2xl bg-white shadow-xs max-w-md mx-auto space-y-4 text-center animate-fade-in">
                <div class="font-bold text-sm text-gray-900">Scan QR Code with WhatsApp</div>
                
                <div class="relative p-4 border border-gray-150 rounded-xl bg-white shadow-inner flex flex-col items-center justify-center">
                  <!-- Simulated QR Code placeholder -->
                  <div class="w-44 h-44 flex items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden">
                    <img src="/rakansales_qr_code.png" class="w-40 h-40 object-contain" alt="WhatsApp QR Code" />
                    <div v-if="whatsappStep === 4" class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center text-emerald-600 animate-fade-in">
                      <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2 shadow-inner">
                        <CheckCircle2 class="w-7 h-7" />
                      </div>
                      <div class="text-xs font-bold">Successfully Connected!</div>
                    </div>
                  </div>

                  <div v-if="whatsappStep !== 4" class="text-xs text-gray-405 mt-3 font-semibold">
                    <span class="font-mono text-gray-700">{{ qrTimerFormatted }}</span> remaining
                  </div>

                  <!-- Status Dot Indicator -->
                  <div class="flex items-center gap-1.5 mt-2">
                    <span class="w-2.5 h-2.5 rounded-full" :class="whatsappStep === 4 ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-450 animate-pulse'"></span>
                    <span class="text-[10px] font-bold text-gray-550">
                      {{ whatsappStep === 4 ? 'Device linked successfully!' : 'Waiting for connection...' }}
                    </span>
                  </div>
                </div>

                <div class="text-left text-xs space-y-1.5 text-gray-600 w-full px-2 border-t border-gray-100 pt-3">
                  <div class="font-bold text-gray-800 text-[11px]">How to scan:</div>
                  <ol class="list-decimal pl-4 space-y-1 text-gray-400 text-[10px]">
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
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Inbox Name</label>
                  <input type="text" v-model="newInboxName" placeholder="e.g. Sales WhatsApp" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {{ selectedChannelProvider === 'Email' ? 'Email Address' : selectedChannelProvider === 'SMS' ? 'Phone Number' : 'Domain / Widget URL' }}
                  </label>
                  <input type="text" v-model="newInboxDetails" :placeholder="selectedChannelProvider === 'Email' ? 'info@company.com' : selectedChannelProvider === 'SMS' ? '+60 12-345 6789' : 'mysite.com'" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Routing Team</label>
                  <select v-model="newInboxAssigned" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
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
            <div class="border-b border-gray-100 pb-3">
              <h3 class="font-bold text-base text-gray-900">Add Agents</h3>
              <p class="text-xs text-gray-400 mt-0.5">Choose agents who will have access to handle messages in this inbox.</p>
            </div>

            <div class="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              <div
                v-for="user in workspaceUsers"
                :key="user.id"
                class="flex items-center justify-between p-2.5 border border-gray-150 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200">
                    <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center font-bold text-xs text-white" :class="user.avatarBg">
                      {{ user.name.charAt(0) }}
                    </div>
                  </div>
                  <div>
                    <div class="font-bold text-xs text-gray-800">{{ user.name }}</div>
                    <div class="text-[9px] text-gray-450">{{ user.role }}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  :id="`agent-select-${user.id}`"
                  :value="user.id"
                  v-model="inboxSelectedAgents"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- STEP 4: VOILÀ! SUCCESS -->
          <div v-if="addChannelStep === 4" class="flex flex-col items-center justify-center text-center py-6 space-y-4">
            <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100/30">
              <CheckCircle2 class="w-8 h-8 animate-bounce" />
            </div>
            <div class="space-y-1 max-w-sm">
              <h3 class="font-bold text-lg text-gray-900">Voilà! You are all set!</h3>
              <p class="text-xs text-gray-400 leading-relaxed">
                Your new <strong>{{ selectedChannelProvider }}</strong> inbox channel ({{ newInboxName }}) has been successfully integrated and authenticated.
              </p>
            </div>
            
            <div class="border border-gray-150 rounded-xl p-4 bg-gray-50/80 text-left text-[11px] space-y-1.5 w-full max-w-xs shadow-inner">
              <div><span class="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Channel:</span> {{ newInboxName }}</div>
              <div><span class="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Address:</span> {{ newInboxDetails }}</div>
              <div><span class="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Routing:</span> {{ newInboxAssigned }}</div>
              <div><span class="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Assigned Agents:</span> {{ inboxSelectedAgents.length }} Members</div>
            </div>
          </div>

          <!-- Footer Buttons -->
          <footer class="pt-4 border-t border-gray-100 flex justify-between items-center bg-white">
            <button
              v-if="addChannelStep > 1 && addChannelStep < 4"
              @click="wizardBack"
              class="px-4 py-2 border border-gray-200 text-gray-650 hover:bg-gray-50 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft class="w-3.5 h-3.5" /> Back
            </button>
            <div v-else></div>

            <div class="flex gap-2">
              <button @click="closeAddChannelWizard" class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs rounded-lg cursor-pointer">
                Cancel
              </button>
              <button
                v-if="addChannelStep < 3"
                @click="wizardNext"
                :disabled="
                  (addChannelStep === 1 && !selectedChannelProvider) ||
                  (addChannelStep === 2 && selectedChannelProvider === 'WhatsApp' && whatsappStep !== 4)
                "
                class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50 shadow"
              >
                Next Step
              </button>
              <button
                v-else-if="addChannelStep === 3"
                @click="submitAddChannel"
                class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow"
              >
                Create Channel
              </button>
              <button
                v-else-if="addChannelStep === 4"
                @click="finishAddChannel"
                class="px-5 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow"
              >
                Finish
              </button>
            </div>
          </footer>

        </div>
      </div>
    </div>

    <!-- ══════ MODAL: Add Document ══════ -->
    <div v-if="showAddDocModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
        <header class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
            <FileText class="w-4 h-4 text-primary" /> Add Knowledge Document
          </h3>
          <button @click="showAddDocModal = false" class="text-gray-400 hover:text-gray-600 cursor-pointer"><X class="w-4 h-4" /></button>
        </header>
        <form @submit.prevent="submitAddDoc" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Document Name</label>
            <input type="text" v-model="newDocName" placeholder="e.g. Product_Catalog_2026.pdf" required class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Document Type</label>
            <select v-model="newDocType" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="pdf">PDF Document</option>
              <option value="docx">Word Document (.docx)</option>
              <option value="txt">Plain Text (.txt)</option>
              <option value="csv">Spreadsheet (.csv)</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">File Size (simulated)</label>
            <select v-model="newDocSize" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
              <option>512 KB</option>
              <option>1.1 MB</option>
              <option>2.4 MB</option>
              <option>5.8 MB</option>
              <option>12.3 MB</option>
            </select>
          </div>
          <div class="p-3 bg-yellow-50 border border-yellow-250 rounded-lg flex items-start gap-2">
            <Sparkles class="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p class="text-[10px] text-yellow-800 font-medium">This document will be queued for AI training. The model will re-index with the new knowledge source.</p>
          </div>
          <footer class="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button type="button" @click="showAddDocModal = false" class="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow">Add & Queue Training</button>
          </footer>
        </form>
      </div>
    </div>

    <!-- ══════ MODAL: Edit Document Name ══════ -->
    <div v-if="editDocModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100">
        <header class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-sm text-gray-900">Rename Document</h3>
          <button @click="editDocModal.show = false" class="text-gray-400 hover:text-gray-600 cursor-pointer"><X class="w-4 h-4" /></button>
        </header>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Document Name</label>
            <input type="text" v-model="editDocModal.name" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div class="flex justify-end gap-2">
            <button @click="editDocModal.show = false" class="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
            <button @click="saveDocName" class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow">Save Name</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════ MODAL: Create Custom Tag (Popup modal from top New Tag) ══════ -->
    <div v-if="showCreateTagModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <header class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2"><Tag class="w-4 h-4 text-primary" /> Create Custom Tag</h3>
          <button @click="showCreateTagModal = false" class="text-gray-400 hover:text-gray-600 cursor-pointer"><X class="w-4 h-4" /></button>
        </header>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tag Name</label>
                <input type="text" v-model="newTagName" placeholder="e.g. Lead Score 80+" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tag Group</label>
                <select v-model="newTagGroup" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                  <option v-for="group in tagGroups" :key="group.name" :value="group.name">{{ group.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Color Option</label>
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="color in tagColors" :key="color.name"
                    @click="selectedTagColor = color"
                    class="h-8 rounded-lg cursor-pointer transition-all border-2"
                    :style="{ backgroundColor: color.bg, borderColor: selectedTagColor.name === color.name ? color.text : 'transparent' }"
                  ></button>
                </div>
              </div>
            </div>
            <div class="border rounded-xl p-5 bg-gray-50 space-y-3 flex flex-col items-center justify-center min-h-[180px]">
              <h4 class="font-bold text-xs text-gray-500 uppercase tracking-wider">Live Badge Preview</h4>
              <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow border"
                :style="{ backgroundColor: selectedTagColor.bg, color: selectedTagColor.text, borderColor: selectedTagColor.text + '30' }">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: selectedTagColor.text }"></span>
                {{ newTagName || 'Tag Name' }}
              </span>
              <p class="text-[10px] text-gray-400 text-center">Placed in: {{ newTagGroup }}</p>
            </div>
          </div>
          <footer class="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button @click="showCreateTagModal = false" class="px-4 py-2 border border-gray-200 text-gray-650 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
            <button @click="createCustomTagFromModal" :disabled="!newTagName" class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow disabled:opacity-50">Create Tag</button>
          </footer>
        </div>
      </div>
    </div>

    <!-- ══════ MODAL: Edit Tag ══════ -->
    <div v-if="editTagModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100">
        <header class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2"><Tag class="w-4 h-4 text-primary" /> Edit Tag</h3>
          <button @click="editTagModal.show = false" class="text-gray-400 hover:text-gray-600 cursor-pointer"><X class="w-4 h-4" /></button>
        </header>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tag Name</label>
            <input type="text" v-model="editTagModal.name" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Color</label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="color in tagColors" :key="color.name"
                @click="editTagModal.colorBg = color.bg; editTagModal.colorText = color.text"
                class="h-8 rounded-lg cursor-pointer transition-all border-2"
                :style="{ backgroundColor: color.bg, borderColor: editTagModal.colorBg === color.bg ? color.text : 'transparent' }"
              ></button>
            </div>
          </div>
          <div class="flex justify-center py-2">
            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow border"
              :style="{ backgroundColor: editTagModal.colorBg, color: editTagModal.colorText, borderColor: editTagModal.colorText + '30' }">
              <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: editTagModal.colorText }"></span>
              {{ editTagModal.name }}
            </span>
          </div>
          <div class="flex justify-end gap-2">
            <button @click="editTagModal.show = false" class="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
            <button @click="saveEditTag" class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow">Save Changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════ MODAL: Edit Inbox ══════ -->
    <div v-if="editInboxModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100">
        <header class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-sm text-gray-900">Edit Channel</h3>
          <button @click="editInboxModal.show = false" class="text-gray-400 hover:text-gray-600 cursor-pointer"><X class="w-4 h-4" /></button>
        </header>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Channel Name</label>
            <input type="text" v-model="editInboxModal.name" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Assign to Team</label>
            <select v-model="editInboxModal.team" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Sales Team</option>
              <option>Support Team</option>
              <option>Enterprise Team</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button @click="editInboxModal.show = false" class="px-4 py-2 border border-gray-200 text-gray-655 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
            <button @click="saveEditInbox" class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow">Save Changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════ MODAL: Create Web Form ══════ -->
    <div v-if="showCreateFormModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
        <header class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 class="font-bold text-sm text-gray-900">Create New Web Form</h3>
          <button @click="showCreateFormModal = false" class="text-gray-400 hover:text-gray-600 cursor-pointer"><X class="w-4 h-4" /></button>
        </header>
        <form @submit.prevent="createWebForm" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Form Name</label>
            <input type="text" v-model="newFormName" placeholder="e.g. Enterprise Lead Capture" required class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
            <input type="text" v-model="newFormDesc" placeholder="Collects enterprise inquiry details" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Post-Submit Redirect URL</label>
            <input type="text" v-model="newFormRedirect" placeholder="https://yoursite.com/thank-you" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Assign Leads To</label>
            <select v-model="newFormAgent" class="w-full text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Justin (Admin)</option>
              <option>Sarah (Senior Rep)</option>
              <option>David (Rep)</option>
              <option>Round Robin (All)</option>
            </select>
          </div>
          <footer class="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button type="button" @click="showCreateFormModal = false" class="px-4 py-2 border border-gray-200 text-gray-650 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-primary text-white font-bold text-xs rounded-lg cursor-pointer shadow">Create Form</button>
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
          class="pointer-events-auto w-full border border-gray-100 rounded-xl p-4 bg-white shadow-2xl flex items-start gap-3"
          :class="toast.type === 'success' ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-yellow-500'"
        >
          <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" :class="toast.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-yellow-100 text-yellow-600'">
            <CheckCircle2 class="w-3.5 h-3.5" />
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-xs text-gray-900">{{ toast.title }}</h4>
            <p class="text-[10px] text-gray-500 mt-0.5">{{ toast.message }}</p>
          </div>
          <button @click="closeToast(toast.id)" class="text-gray-400 hover:text-gray-600 cursor-pointer">×</button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue';
import { useRoute } from 'vue-router';
import AgentsTab from '../components/settings/AgentsTab.vue';
import TeamsTab from '../components/settings/TeamsTab.vue';
import RolesTab from '../components/settings/RolesTab.vue';
import AutomationTab from '../components/settings/AutomationTab.vue';
import {
  Settings, Sparkles, FileText, Upload, CheckCircle2, Play, Pause,
  Mail, MessageSquare, Tag, Zap, Shield, Users, Smartphone,
  Loader2, Plus, Pencil, Trash2, X, Search, GripVertical, Copy,
  Globe, Terminal, Check, ArrowLeft, Send, Instagram
} from 'lucide-vue-next';

const route = useRoute();
const fileInput = ref<HTMLInputElement | null>(null);
function triggerFileInput() { loadDemoFiles(); }

// Focus directive helper for inline input
const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus()
};

// ═══════════════════ TOAST SYSTEM ═══════════════════
interface Toast { id: number; title: string; message: string; type: 'success' | 'warning'; }
const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;
function addToast(title: string, message: string, type: 'success' | 'warning' = 'success') {
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

// ═══════════════════ TAB 2: INBOXES & GUIDED WIZARD ═══════════════════
const activeTab = ref('inboxes');
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string') {
    if (newTab === 'permissions') activeTab.value = 'agents';
    else if (newTab === 'macros' || newTab === 'automation') activeTab.value = 'automation';
    else activeTab.value = newTab;
  }
}, { immediate: true });

interface Inbox { id: number; name: string; type: string; icon: Component; colorBg: string; colorText: string; details: string; assignedTeam: string; active: boolean; isDefault?: boolean; }
const connectedInboxes = ref<Inbox[]>([
  { id: 1, name: 'Support Email', type: 'Email', icon: Mail, colorBg: 'bg-blue-100', colorText: 'text-blue-600', details: 'support@rakansales.com', assignedTeam: 'Support Team', active: true, isDefault: true },
  { id: 2, name: 'Website Live Chat', type: 'Live Chat', icon: MessageSquare, colorBg: 'bg-violet-100', colorText: 'text-violet-600', details: 'rakansales.com widget', assignedTeam: 'Sales Team', active: true },
  { id: 3, name: 'Sales WhatsApp', type: 'WhatsApp', icon: Smartphone, colorBg: 'bg-emerald-100', colorText: 'text-emerald-600', details: '+60 12-555 0001', assignedTeam: 'Sales Team', active: false },
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
  { name: 'Website', desc: 'Create a live-chat widget', icon: Globe, logoUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/globe.svg', colorBg: 'bg-blue-100', colorText: 'text-blue-600' },
  { name: 'Facebook', desc: 'Connect your Facebook page', icon: MessageSquare, logoUrl: 'https://cdn.simpleicons.org/facebook/1877F2', colorBg: 'bg-indigo-100', colorText: 'text-indigo-600' },
  { name: 'WhatsApp', desc: 'Support your customers on WhatsApp', icon: Smartphone, logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366', colorBg: 'bg-emerald-100', colorText: 'text-emerald-600' },
  { name: 'SMS', desc: 'Integrate SMS channel with Twilio or bandwidth', icon: Smartphone, logoUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/mail.svg', colorBg: 'bg-teal-100', colorText: 'text-teal-655' },
  { name: 'Email', desc: 'Connect with Gmail, Outlook, or other providers', icon: Mail, logoUrl: 'https://cdn.simpleicons.org/gmail/EA4335', colorBg: 'bg-sky-100', colorText: 'text-sky-600' },
  { name: 'API', desc: 'Make a custom channel using our API', icon: Terminal, logoUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/code.svg', colorBg: 'bg-gray-150', colorText: 'text-gray-700' },
  { name: 'Telegram', desc: 'Configure Telegram channel using Bot token', icon: Send, logoUrl: 'https://cdn.simpleicons.org/telegram/0088cc', colorBg: 'bg-cyan-100', colorText: 'text-cyan-600' },
  { name: 'Line', desc: 'Integrate your Line channel', icon: MessageSquare, logoUrl: 'https://cdn.simpleicons.org/line/06C755', colorBg: 'bg-green-100', colorText: 'text-green-600' },
  { name: 'Instagram', desc: 'Connect your instagram account', icon: Instagram, logoUrl: 'https://cdn.simpleicons.org/instagram/E1306C', colorBg: 'bg-pink-100', colorText: 'text-pink-655' },
  { name: 'TikTok', desc: 'Connect your TikTok Business inbox', icon: MessageSquare, logoUrl: 'https://cdn.simpleicons.org/tiktok/000000', colorBg: 'bg-black/5', colorText: 'text-black' },
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
  { name: 'Partner', colorBg: '#F3E8FF', colorText: '#7E22CE', group: 'Sales', usageCount: 12 },
  { name: 'Enterprise', colorBg: '#DBEAFE', colorText: '#1D4ED8', group: 'Sales', usageCount: 34 },
  { name: 'Warm Lead', colorBg: '#D1FAE5', colorText: '#047857', group: 'Marketing', usageCount: 56 },
  { name: 'Trade Show Lead', colorBg: '#FEF3C7', colorText: '#B45309', group: 'Marketing', usageCount: 8 },
  { name: 'VIP Client', colorBg: '#FFE4E6', colorText: '#BE123C', group: 'Sales', usageCount: 5 },
  { name: 'Bug Report', colorBg: '#FEE2E2', colorText: '#991B1B', group: 'Support', usageCount: 23 },
  { name: 'Feature Request', colorBg: '#EDE9FE', colorText: '#6D28D9', group: 'Support', usageCount: 17 },
]);
const showCreateTagModal = ref(false);
const tagColors = [
  { name: 'Emerald', bg: '#D1FAE5', text: '#047857' },
  { name: 'Blue', bg: '#DBEAFE', text: '#1D4ED8' },
  { name: 'Purple', bg: '#F3E8FF', text: '#7E22CE' },
  { name: 'Amber', bg: '#FEF3C7', text: '#B45309' },
  { name: 'Rose', bg: '#FFE4E6', text: '#BE123C' },
  { name: 'Teal', bg: '#CCFBF1', text: '#0F766E' },
  { name: 'Orange', bg: '#FFEDD5', text: '#C2410C' },
  { name: 'Indigo', bg: '#EEF2FF', text: '#4338CA' },
  { name: 'Gray', bg: '#F3F4F6', text: '#374151' },
  { name: 'Cyan', bg: '#CFFAFE', text: '#0E7490' },
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
  { id: 2, name: 'Sarah', role: 'Senior Sales Rep', avatarBg: 'bg-pink-100 text-pink-700', avatar: '/avatars/agent_18_malay_female_hijab_rose.png', online: true, lastSeen: '', active: true, dealCount: 34, convCount: 142, permissions: [
    ...makeDefaultPerms(false).map(p => p.name === 'View All Deals' || p.name === 'Edit Deals' || p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
  ]},
  { id: 3, name: 'David', role: 'Sales Rep', avatarBg: 'bg-blue-100 text-blue-700', avatar: '/avatars/agent_12_indian_male_lavender.png', online: false, lastSeen: '2h ago', active: true, dealCount: 18, convCount: 64, permissions: [
    ...makeDefaultPerms(false).map(p => p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
  ]},
  { id: 4, name: 'Emma', role: 'Junior Rep', avatarBg: 'bg-amber-100 text-amber-700', avatar: '/avatars/agent_11_chinese_female_mint.png', online: false, lastSeen: 'Yesterday', active: true, dealCount: 7, convCount: 23, permissions: makeDefaultPerms(false) },
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
  { name: 'Senior Sales Rep', colorBg: 'bg-pink-100', colorText: 'text-pink-700', description: 'Access to deals, CRM controls, analytics reports, and channel configurations.', permissions: [
    ...makeDefaultPerms(false).map(p => p.name === 'View All Deals' || p.name === 'Edit Deals' || p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
  ]},
  { name: 'Sales Rep', colorBg: 'bg-blue-100', colorText: 'text-blue-700', description: 'Standard sales rep access to deals, contacts, and messaging inboxes.', permissions: [
    ...makeDefaultPerms(false).map(p => p.name === 'View Analytics' || p.name === 'Add Inbox Channels' ? { ...p, value: true } : p)
  ]},
  { name: 'Junior Rep', colorBg: 'bg-amber-100', colorText: 'text-amber-700', description: 'Basic workspace access for ticket response, lead capture, and read-only reports.', permissions: makeDefaultPerms(false) },
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
</style>
