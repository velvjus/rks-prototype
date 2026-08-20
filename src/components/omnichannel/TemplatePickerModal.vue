<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import PlatformIcon from './PlatformIcon.vue'
import { 
  type CrmTemplate, 
  defaultCrmTemplates, 
  resolveTemplateVariables 
} from '@/data/crmTemplates'

export type { CrmTemplate }

const props = defineProps<{
  modelValue: boolean
  activeContact?: {
    name: string
    firstName?: string
    company?: string
    phone?: string
    email?: string
    platform?: string
  }
  agentName?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'select', text: string, template: CrmTemplate): void
  (e: 'send', text: string, template: CrmTemplate): void
  (e: 'manage'): void
}>()

// Search and filter states
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const previewMode = ref<'resolved' | 'raw'>('resolved')
const isVariablesExpanded = ref(false)

// Default Templates Library
const templates = ref<CrmTemplate[]>([...defaultCrmTemplates])

// Selected template
const selectedTemplateId = ref<string>('tpl-1')

const selectedTemplate = computed(() => {
  return templates.value.find(t => t.id === selectedTemplateId.value) || filteredTemplates.value[0] || templates.value[0]
})

// Custom variable overrides
const customVariables = ref<Record<string, string>>({})

// Dynamic context resolution
const dynamicContext = computed(() => {
  const c = props.activeContact || { name: 'Customer', company: 'Company' }
  const fullName = c.name || 'Valued Customer'
  const firstName = c.firstName || fullName.split(' ')[0] || 'Valued Customer'
  const company = c.company || 'Your Organization'
  const agent = props.agentName || 'Olivia Rhye'
  const agentFirst = agent.split(' ')[0] || 'Olivia'
  
  return {
    'contact.name': customVariables.value['contact.name'] ?? fullName,
    'contact.first_name': customVariables.value['contact.first_name'] ?? firstName,
    'company.name': customVariables.value['company.name'] ?? company,
    'contact.phone': customVariables.value['contact.phone'] ?? (c.phone || '+6012 3456 7890'),
    'contact.email': customVariables.value['contact.email'] ?? (c.email || 'customer@domain.com'),
    'agent.name': customVariables.value['agent.name'] ?? agent,
    'agent.first_name': customVariables.value['agent.first_name'] ?? agentFirst,
    'meeting.link': customVariables.value['meeting.link'] ?? 'https://cal.rakansales.com/discovery',
    'today.date': customVariables.value['today.date'] ?? new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  }
})

// Categories
const categories = ['all', 'Sales', 'Support', 'Scheduling', 'Billing', 'WhatsApp HSM']

// Filtered templates
const filteredTemplates = computed(() => {
  let list = templates.value

  if (selectedCategory.value !== 'all') {
    list = list.filter(t => t.category === selectedCategory.value)
  }

  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    list = list.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.shortcut.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
  }

  return list
})

// Resolve text placeholders
const resolveContent = (rawText: string): string => {
  let text = rawText
  const ctx = dynamicContext.value as Record<string, string>
  for (const [key, val] of Object.entries(ctx)) {
    const reg = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    text = text.replace(reg, val)
  }
  return text
}

// Highlight tokens for preview
const highlightedContent = computed(() => {
  if (!selectedTemplate.value) return ''
  const content = selectedTemplate.value.content
  return content.replace(/{{\s*([\w.]+)\s*}}/g, (match, token) => {
    const val = (dynamicContext.value as Record<string, string>)[token]
    if (previewMode.value === 'resolved' && val) {
      return `<span class="bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-200/60">${val}</span>`
    }
    return `<span class="bg-amber-50 text-amber-900 font-mono text-[11px] px-1.5 py-0.5 rounded border border-amber-200/70">${match}</span>`
  })
})

const toggleFavorite = (id: string, e: Event) => {
  e.stopPropagation()
  const t = templates.value.find(item => item.id === id)
  if (t) {
    t.isFavorite = !t.isFavorite
  }
}

const handleInsert = () => {
  if (!selectedTemplate.value) return
  const text = resolveContent(selectedTemplate.value.content)
  emit('select', text, selectedTemplate.value)
  emit('update:modelValue', false)
}

const handleSendImmediately = () => {
  if (!selectedTemplate.value) return
  const text = resolveContent(selectedTemplate.value.content)
  emit('send', text, selectedTemplate.value)
  emit('update:modelValue', false)
}

const copyToClipboard = () => {
  if (!selectedTemplate.value) return
  const text = resolveContent(selectedTemplate.value.content)
  navigator.clipboard.writeText(text)
}

const resetCustomVariables = () => {
  customVariables.value = {}
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.modelValue) return
  if (e.key === 'Escape') {
    emit('update:modelValue', false)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
    resetCustomVariables()
    isVariablesExpanded.value = false
    if (filteredTemplates.value.length > 0 && !filteredTemplates.value.some(t => t.id === selectedTemplateId.value)) {
      selectedTemplateId.value = filteredTemplates.value[0].id
    }
  }
})
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-150"
    enter-from-class="opacity-0 scale-[0.98]"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-[0.98]"
  >
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none"
      @click.self="emit('update:modelValue', false)"
    >
      <div class="bg-white rounded-2xl max-w-3xl w-full h-[540px] border border-gray-200/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        
        <!-- CALM MINIMAL HEADER WITH SEARCH & RECIPIENT -->
        <header class="px-5 py-3 border-b border-gray-150 flex items-center justify-between gap-4 bg-white shrink-0">
          <!-- Integrated Search -->
          <div class="relative flex-1 max-w-md">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search templates or type /shortcut..." 
              class="w-full pl-9 pr-7 py-1.5 text-xs bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23B750] focus:border-[#23B750] font-medium text-gray-800 placeholder:text-gray-400 transition-all"
              autofocus
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''" 
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer text-xs font-bold"
            >
              ×
            </button>
          </div>

          <!-- Manage Templates Action & Close -->
          <div class="flex items-center gap-2 shrink-0">
            <button 
              type="button"
              @click="emit('manage')"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors cursor-pointer outline-none select-none"
              title="Manage and create templates"
            >
              <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Manage Templates</span>
            </button>

            <button 
              @click="emit('update:modelValue', false)"
              class="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer outline-none"
              title="Close (Esc)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- CATEGORIES CLEAN TAB STRIP -->
        <div class="px-5 py-2 border-b border-gray-100 flex items-center gap-1 overflow-x-auto scrollbar-none bg-gray-50/40 shrink-0">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap outline-none"
            :class="[
              selectedCategory === cat 
                ? 'bg-white text-gray-900 shadow-2xs border border-gray-200 font-bold' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
            ]"
          >
            {{ cat === 'all' ? 'All Templates' : cat }}
          </button>
        </div>

        <!-- MAIN SPLIT WORKSPACE: Sleek 2-Column Minimal Layout -->
        <div class="flex-1 flex min-h-0 overflow-hidden">
          
          <!-- LEFT PANE: Distilled List -->
          <div class="w-5/12 border-r border-gray-150 flex flex-col bg-white overflow-hidden">
            <div class="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              <div 
                v-for="tpl in filteredTemplates" 
                :key="tpl.id"
                @click="selectedTemplateId = tpl.id"
                class="p-2.5 rounded-lg transition-all cursor-pointer flex flex-col gap-1 text-left select-none"
                :class="[
                  selectedTemplateId === tpl.id 
                    ? 'bg-green-50/70 border border-green-200/80 shadow-2xs' 
                    : 'hover:bg-gray-50 border border-transparent'
                ]"
              >
                <!-- Title & Shortcut Row -->
                <div class="flex items-center justify-between gap-1.5">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span 
                      v-if="tpl.isHsmApproved" 
                      class="px-1 py-0.2 rounded text-[8px] font-bold uppercase bg-emerald-100 text-emerald-800 shrink-0"
                    >
                      HSM
                    </span>
                    <h4 
                      class="text-xs font-bold truncate leading-tight"
                      :class="selectedTemplateId === tpl.id ? 'text-emerald-950' : 'text-gray-800'"
                    >
                      {{ tpl.title }}
                    </h4>
                  </div>

                  <span class="text-[10px] font-mono text-gray-400 shrink-0 font-medium">
                    {{ tpl.shortcut }}
                  </span>
                </div>

                <!-- 1-line Quiet Snippet -->
                <p class="text-[11px] text-gray-500 line-clamp-1 leading-normal font-normal">
                  {{ tpl.content }}
                </p>
              </div>

              <div v-if="filteredTemplates.length === 0" class="py-12 text-center text-gray-400 text-xs">
                No templates matching search
              </div>
            </div>
          </div>

          <!-- RIGHT PANE: Clean Document Canvas -->
          <div class="w-7/12 flex flex-col bg-white overflow-hidden">
            
            <div v-if="selectedTemplate" class="flex-1 flex flex-col overflow-y-auto p-5 space-y-3.5 scrollbar-thin">
              
              <!-- Clean Title & Badges Bar -->
              <div class="flex items-center justify-between gap-2 pb-1">
                <div class="flex items-center gap-2 min-w-0">
                  <h3 class="text-sm font-bold text-gray-900 truncate">
                    {{ selectedTemplate.title }}
                  </h3>
                </div>

                <!-- Preview Mode Segmented Switch -->
                <div class="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[10px] font-bold shrink-0">
                  <button 
                    @click="previewMode = 'resolved'"
                    class="px-2 py-0.5 rounded transition-all cursor-pointer"
                    :class="previewMode === 'resolved' ? 'bg-white text-emerald-950 font-bold shadow-2xs' : 'text-gray-500 hover:text-gray-800'"
                  >
                    Resolved
                  </button>
                  <button 
                    @click="previewMode = 'raw'"
                    class="px-2 py-0.5 rounded transition-all cursor-pointer font-mono"
                    :class="previewMode === 'raw' ? 'bg-white text-amber-950 font-bold shadow-2xs' : 'text-gray-500 hover:text-gray-800'"
                  >
                    <span>&#123;&#123; variables &#125;&#125;</span>
                  </button>
                </div>
              </div>

              <!-- Subject Line if Present -->
              <div v-if="selectedTemplate.subject" class="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-150 flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase text-gray-400 shrink-0">Subject</span>
                <span class="font-medium text-gray-800 truncate">{{ resolveContent(selectedTemplate.subject) }}</span>
              </div>

              <!-- Clean Message Canvas (No nested cards) -->
              <div 
                class="p-4 rounded-xl bg-gray-50/70 border border-gray-200 text-xs font-normal text-gray-800 leading-relaxed whitespace-pre-line select-text"
                v-html="highlightedContent"
              ></div>

              <!-- Progressive Disclosure: Variable Customizer -->
              <div class="pt-1">
                <button 
                  @click="isVariablesExpanded = !isVariablesExpanded"
                  class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-medium cursor-pointer transition-colors outline-none"
                >
                  <svg 
                    class="w-3.5 h-3.5 transition-transform" 
                    :class="isVariablesExpanded ? 'rotate-90 text-[#23B750]' : 'text-gray-400'" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    stroke-width="2.5"
                  >
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <span>Customize variables ({{ selectedTemplate.variables.length }})</span>
                </button>

                <!-- Expanded Variables Form -->
                <div v-if="isVariablesExpanded" class="mt-2.5 grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in duration-150">
                  <div 
                    v-for="varName in selectedTemplate.variables" 
                    :key="varName"
                    class="flex flex-col gap-0.5"
                  >
                    <span class="text-[10px] font-mono text-gray-400">&#123;&#123;{{ varName }}&#125;&#125;</span>
                    <input 
                      v-model="customVariables[varName]"
                      :placeholder="(dynamicContext as Record<string, string>)[varName] || 'Default'"
                      type="text" 
                      class="w-full text-xs px-2 py-1 bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#23B750] font-medium text-gray-800"
                    />
                  </div>
                </div>
              </div>

            </div>

            <!-- ACTION FOOTER BAR: Clean & Calm -->
            <footer class="px-5 py-3 border-t border-gray-150 bg-white flex items-center justify-between gap-3 shrink-0">
              <button 
                @click="copyToClipboard"
                class="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 cursor-pointer outline-none transition-colors"
                title="Copy to clipboard"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span>Copy</span>
              </button>

              <div class="flex items-center gap-2">
                <button 
                  @click="emit('update:modelValue', false)"
                  class="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer outline-none"
                >
                  Cancel
                </button>

                <button 
                  @click="handleSendImmediately"
                  class="px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all cursor-pointer active:scale-95 outline-none"
                  title="Send directly without draft"
                >
                  Send Immediately
                </button>

                <button 
                  @click="handleInsert"
                  class="px-4 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa346] rounded-lg transition-all cursor-pointer shadow-xs active:scale-95 outline-none"
                >
                  Insert Draft
                </button>
              </div>
            </footer>

          </div>
        </div>

      </div>
    </div>
  </transition>
</template>
