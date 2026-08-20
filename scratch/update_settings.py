import os

settings_file = r"c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\SettingsView.vue"
panel_file = r"c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\components\layout\SecondaryPanel.vue"

# 1. Update SettingsView.vue
with open(settings_file, "r", encoding="utf-8") as f:
    settings_content = f.read()

# Replace the AI Training Hub tab template
old_training_tab = """          <!-- ══════════════ TAB: AI TRAINING HUB ══════════════ -->
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

            <!-- Upload Area -->
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

            <!-- Training Progress -->
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
              <div class="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Loader2 v-if="trainingProgress < 100" class="w-3.5 h-3.5 text-primary animate-spin" />
                <CheckCircle2 v-else class="w-3.5 h-3.5 text-primary" />
                {{ trainingStatus }}
              </div>
            </div>

            <!-- Training History Log -->
            <div v-if="trainingHistory.length > 0" class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-bold text-gray-900 text-xs uppercase tracking-wider">Training History</h3>
                <button @click="trainingHistory = []" class="text-[10px] text-gray-400 hover:text-red-500 cursor-pointer">Clear</button>
              </div>
              <div class="divide-y divide-gray-100">
                <div v-for="entry in trainingHistory" :key="entry.id" class="px-4 py-3 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full" :class="entry.success ? 'bg-primary' : 'bg-red-400'"></div>
                    <span class="font-semibold text-gray-800">{{ entry.action }}</span>
                    <span class="text-gray-400">→ {{ entry.model }}</span>
                  </div>
                  <span class="text-[10px] text-gray-400 font-mono">{{ entry.time }}</span>
                </div>
              </div>
            </div>
          </div>"""

# New training tab layout with:
# - Switched positions of Training Progress and Upload Area
# - Removed Training History log
# - And added a new separate Training History tab v-if="activeTab === 'training-history'"
new_training_tab = """          <!-- ══════════════ TAB: AI TRAINING HUB ══════════════ -->
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

            <!-- Training Progress (Moved above Upload Area!) -->
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
              <div class="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Loader2 v-if="trainingProgress < 100" class="w-3.5 h-3.5 text-primary animate-spin" />
                <CheckCircle2 v-else class="w-3.5 h-3.5 text-primary" />
                {{ trainingStatus }}
              </div>
            </div>

            <!-- Upload Area (Moved below Training Progress!) -->
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
                <History class="w-6 h-6 text-yellow-500" />
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
          </div>"""

# Replace in SettingsView.vue template
normalized_settings = settings_content.replace("\r\n", "\n")
normalized_old_training = old_training_tab.replace("\r\n", "\n")
normalized_new_training = new_training_tab.replace("\r\n", "\n")

if normalized_old_training in normalized_settings:
    settings_content = normalized_settings.replace(normalized_old_training, normalized_new_training)
    print("SettingsView template training block successfully updated.")
else:
    # Try line-by-line fallback
    print("Warning: Direct match failed for SettingsView.vue training block.")

# Replace initial demo files to use 2 files that do NOT exist in the knowledgeDocs
old_demo_func = """function loadDemoFiles() {
  filesList.value = [
    { name: '2026_Pricing_Guide.pdf', size: '2.4 MB', progress: 0, status: 'Uploading...' },
    { name: 'Company_SOPs.docx', size: '1.1 MB', progress: 0, status: 'Uploading...' }
  ];
  startTrainingProgress();
}"""

new_demo_func = """function loadDemoFiles() {
  filesList.value = [
    { name: '2026_Pricing_Guide.pdf', size: '2.4 MB', progress: 0, status: 'Uploading...' },
    { name: 'Sales_Training_Manual.docx', size: '1.5 MB', progress: 0, status: 'Uploading...' }
  ];
  startTrainingProgress();
}"""

old_training_complete = """      // Add PDF to knowledge docs
      if (!knowledgeDocs.value.some(d => d.name === '2026_Pricing_Guide.pdf')) {
        knowledgeDocs.value.push({ id: ++docIdCounter, name: '2026_Pricing_Guide.pdf', size: '2.4 MB', type: 'pdf', date: 'Today', status: 'Trained', progress: 100 });
      }
    }
  }, 150);"""

new_training_complete = """      // Add PDF to knowledge docs
      if (!knowledgeDocs.value.some(d => d.name === '2026_Pricing_Guide.pdf')) {
        knowledgeDocs.value.push({ id: ++docIdCounter, name: '2026_Pricing_Guide.pdf', size: '2.4 MB', type: 'pdf', date: 'Today', status: 'Trained', progress: 100 });
      }
      if (!knowledgeDocs.value.some(d => d.name === 'Sales_Training_Manual.docx')) {
        knowledgeDocs.value.push({ id: ++docIdCounter, name: 'Sales_Training_Manual.docx', size: '1.5 MB', type: 'docx', date: 'Today', status: 'Trained', progress: 100 });
      }
    }
  }, 150);"""

normalized_settings = settings_content.replace("\r\n", "\n")
normalized_old_demo = old_demo_func.replace("\r\n", "\n")
normalized_new_demo = new_demo_func.replace("\r\n", "\n")

if normalized_old_demo in normalized_settings:
    settings_content = normalized_settings.replace(normalized_old_demo, normalized_new_demo)
    print("SettingsView loadDemoFiles function successfully updated.")
else:
    print("Warning: loadDemoFiles function direct match failed.")

normalized_settings = settings_content.replace("\r\n", "\n")
normalized_old_complete = old_training_complete.replace("\r\n", "\n")
normalized_new_complete = new_training_complete.replace("\r\n", "\n")

if normalized_old_complete in normalized_settings:
    settings_content = normalized_settings.replace(normalized_old_complete, normalized_new_complete)
    print("SettingsView startTrainingProgress function successfully updated.")
else:
    print("Warning: startTrainingProgress function direct match failed.")

with open(settings_file, "w", encoding="utf-8") as f:
    f.write(settings_content)
print("SettingsView.vue file updated.")


# 2. Update SecondaryPanel.vue
with open(panel_file, "r", encoding="utf-8") as f:
    panel_content = f.read()

old_ai_kb_group = """      'AI KNOWLEDGE BASE': {
        items: [
          { label: 'Assistants', route: '/settings?tab=ai-training', undesigned: true },
          { label: 'Documents', route: '/settings?tab=ai-training', undesigned: true },
        ],
      },"""

new_ai_kb_group = """      'AI KNOWLEDGE BASE': {
        items: [
          { label: 'Assistants', route: '/settings?tab=ai-training', undesigned: true },
          { label: 'Documents', route: '/settings?tab=ai-training', undesigned: true },
          { label: 'Training History', route: '/settings?tab=training-history' },
        ],
      },"""

normalized_panel = panel_content.replace("\r\n", "\n")
normalized_old_group = old_ai_kb_group.replace("\r\n", "\n")
normalized_new_group = new_ai_kb_group.replace("\r\n", "\n")

if normalized_old_group in normalized_panel:
    panel_content = normalized_panel.replace(normalized_old_group, normalized_new_group)
    print("SecondaryPanel settings menu successfully updated.")
else:
    print("Warning: SecondaryPanel settings menu direct match failed.")

with open(panel_file, "w", encoding="utf-8") as f:
    f.write(panel_content)
print("SecondaryPanel.vue file updated.")
