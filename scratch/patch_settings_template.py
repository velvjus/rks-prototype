import os

settings_file = r"c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\SettingsView.vue"

with open(settings_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace template block using comment bounds
start_marker = "<!-- ══════════════ TAB: AI TRAINING HUB ══════════════ -->"
end_marker = "<!-- ══════════════ TAB: INBOXES ══════════════ -->"

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Error: Could not find template start marker.")
    exit(1)

end_idx = content.find(end_marker, start_idx)
if end_idx == -1:
    print("Error: Could not find template end marker.")
    exit(1)

new_template_section = """<!-- ══════════════ TAB: AI TRAINING HUB ══════════════ -->
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

          """

content = content[:start_idx] + new_template_section + content[end_idx:]


# 2. Replace loadDemoFiles function block
# We can search for the start and end of loadDemoFiles function:
demo_func_start = content.find("function loadDemoFiles(")
if demo_func_start == -1:
    print("Error: Could not find loadDemoFiles function.")
    exit(1)
demo_func_end = content.find("}", demo_func_start) + 1

new_demo_func = """function loadDemoFiles() {
  filesList.value = [
    { name: '2026_Pricing_Guide.pdf', size: '2.4 MB', progress: 0, status: 'Uploading...' },
    { name: 'Sales_Training_Manual.docx', size: '1.5 MB', progress: 0, status: 'Uploading...' }
  ];
  startTrainingProgress();
}"""

content = content[:demo_func_start] + new_demo_func + content[demo_func_end:]


# 3. Replace startTrainingProgress function block
# In startTrainingProgress:
# We look for adding '2026_Pricing_Guide.pdf' to knowledgeDocs:
# let's replace the block where pricing guide is pushed:
old_complete_pattern = """      if (!knowledgeDocs.value.some(d => d.name === '2026_Pricing_Guide.pdf')) {
        knowledgeDocs.value.push({ id: ++docIdCounter, name: '2026_Pricing_Guide.pdf', size: '2.4 MB', type: 'pdf', date: 'Today', status: 'Trained', progress: 100 });
      }"""

new_complete_pattern = """      if (!knowledgeDocs.value.some(d => d.name === '2026_Pricing_Guide.pdf')) {
        knowledgeDocs.value.push({ id: ++docIdCounter, name: '2026_Pricing_Guide.pdf', size: '2.4 MB', type: 'pdf', date: 'Today', status: 'Trained', progress: 100 });
      }
      if (!knowledgeDocs.value.some(d => d.name === 'Sales_Training_Manual.docx')) {
        knowledgeDocs.value.push({ id: ++docIdCounter, name: 'Sales_Training_Manual.docx', size: '1.5 MB', type: 'docx', date: 'Today', status: 'Trained', progress: 100 });
      }"""

# Since spacing might differ, let's normalize line endings and replace:
content_normalized = content.replace("\r\n", "\n")
old_complete_normalized = old_complete_pattern.replace("\r\n", "\n")
new_complete_normalized = new_complete_pattern.replace("\r\n", "\n")

if old_complete_normalized in content_normalized:
    content = content_normalized.replace(old_complete_normalized, new_complete_normalized)
    print("Training progress complete function successfully updated.")
else:
    # Try another spacing pattern
    lines = content_normalized.splitlines()
    found_idx = -1
    for i, line in enumerate(lines):
        if "2026_Pricing_Guide.pdf" in line and "push" in lines[i+1]:
            found_idx = i
            break
    if found_idx != -1:
        # We will insert it after the closing bracket of the if statement
        # lines[found_idx] is: if (!knowledgeDocs.value.some(d => d.name === '2026_Pricing_Guide.pdf')) {
        # lines[found_idx+1] is: knowledgeDocs.value.push(...)
        # lines[found_idx+2] is: }
        indent = "      "
        new_push = [
            indent + "if (!knowledgeDocs.value.some(d => d.name === 'Sales_Training_Manual.docx')) {",
            indent + "  knowledgeDocs.value.push({ id: ++docIdCounter, name: 'Sales_Training_Manual.docx', size: '1.5 MB', type: 'docx', date: 'Today', status: 'Trained', progress: 100 });",
            indent + "}"
        ]
        lines = lines[:found_idx+3] + new_push + lines[found_idx+3:]
        content = "\n".join(lines)
        print("Training progress complete function successfully patched with line-by-line locator.")
    else:
        print("Warning: Could not find target inside startTrainingProgress to push Sales_Training_Manual.docx")

with open(settings_file, "w", encoding="utf-8") as f:
    f.write(content)
print("SettingsView.vue template and scripts patched successfully.")
