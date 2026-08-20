<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebFormsStore, getLabel } from '@/stores/webforms'
import type { FormField, LogicRule } from '@/types/webforms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Check,
  Save,
  Play,
  Monitor,
  Smartphone,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Settings,
  Palette,
  Sliders,
  Share2,
  CheckCircle2,
  Sparkles,
  Layers,
  Code,
  Globe,
  X,
  Type,
  Mail,
  Phone,
  AlignLeft,
  Hash,
  ListFilter,
  CheckSquare,
  Radio,
  Calendar,
  Paperclip,
  Heading,
  Minus,
  Zap,
  UserCheck,
  Building2,
  Target,
  MessageSquare,
  Briefcase,
  Ticket,
  Split,
  FileCode,
  AlertCircle,
  AlertTriangle,
  Maximize2,
  GripVertical,
  SlidersHorizontal,
  Send,
  Search,
  Clock,
  MapPin,
  ListPlus,
  Info,
  Archive,
  Shield,
  Tag
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useWebFormsStore()

const saveToast = ref<string>('')
const isTemplateModalOpen = ref(false)
const leftTab = ref<'fields' | 'outline'>('fields')
const blockSearch = ref<string>('')

// Style Tab State & Presets
const styleNavTab = ref<'Quick Style' | 'Typography' | 'Inputs' | 'Buttons' | 'Spacing' | 'Container' | 'Background' | 'Success State'>('Quick Style')
const stylePreviewView = ref<'Form View' | 'Success State'>('Form View')
const activeThemePreset = ref<string>('Clean')

// Submit Tab State (Matching Design Mockup)
const submitNavTab = ref<'Success Experience' | 'Submission Outcomes' | 'Duplicate Handling' | 'Ownership & Tags' | 'Respondent Notifications' | 'Field Mapping'>('Success Experience')

// Logic Tab State (Matching Design Mockup)
const logicLeftTab = ref<'rules' | 'objects'>('rules')
const selectedRuleId = ref<string>('1')

const activeRule = computed(() => {
  return store.logicRules.find(r => r.id === selectedRuleId.value) || store.logicRules[0]
})

// Settings Tab State & Handlers
const tagInput = ref<string>('')

function addTag() {
  const val = tagInput.value.trim()
  if (val && store.activeForm) {
    if (!store.activeForm.tags) store.activeForm.tags = []
    if (!store.activeForm.tags.includes(val)) {
      store.activeForm.tags.push(val)
    }
    tagInput.value = ''
  }
}

function removeTag(tag: string) {
  if (store.activeForm && store.activeForm.tags) {
    store.activeForm.tags = store.activeForm.tags.filter(t => t !== tag)
  }
}

function handleDuplicateForm() {
  if (store.activeForm) {
    const copyForm = store.createFormFromTemplate('blank')
    copyForm.name = `${store.activeForm.name} (Copy)`
    triggerSaveToast('Form duplicated successfully!')
  }
}

function handleArchiveForm() {
  if (store.activeForm) {
    store.activeForm.status = 'Archived'
    triggerSaveToast('Form archived!')
  }
}

function handleMoveToTrash() {
  if (store.activeForm) {
    store.deleteForms([store.activeForm.id])
    router.push('/webforms/dashboard')
  }
}

function applyThemePreset(presetName: string) {
  activeThemePreset.value = presetName
  if (presetName === 'Clean') {
    store.formStyles.primaryColor = '#23B750'
    store.formStyles.radius = '12px'
    store.formStyles.fontFamily = 'Inter, sans-serif'
    store.formStyles.containerShadow = 'Medium'
  } else if (presetName === 'Rounded') {
    store.formStyles.primaryColor = '#3B82F6'
    store.formStyles.radius = '20px'
    store.formStyles.fontFamily = 'Inter, sans-serif'
    store.formStyles.containerShadow = 'Large'
  } else if (presetName === 'Minimal') {
    store.formStyles.primaryColor = '#18181B'
    store.formStyles.radius = '6px'
    store.formStyles.fontFamily = 'Inter, sans-serif'
    store.formStyles.containerShadow = 'None'
  } else if (presetName === 'Bold') {
    store.formStyles.primaryColor = '#8B5CF6'
    store.formStyles.radius = '12px'
    store.formStyles.fontFamily = 'Inter, sans-serif'
    store.formStyles.containerShadow = 'Large'
  } else if (presetName === 'Corporate') {
    store.formStyles.primaryColor = '#0284C7'
    store.formStyles.radius = '6px'
    store.formStyles.fontFamily = 'Georgia, serif'
    store.formStyles.containerShadow = 'Small'
  }
}

function resetAllStyles() {
  applyThemePreset('Clean')
  triggerSaveToast('Styles reset to default!')
}

onMounted(() => {
  const formId = route.params.id as string
  if (formId) {
    store.setFormToEdit(formId)
  }
})

const selectedField = computed(() => {
  return store.editorFields.find(f => f.id === store.selectedElementId) || null
})

function triggerSaveToast(msg: string) {
  saveToast.value = msg
  setTimeout(() => {
    saveToast.value = ''
  }, 2500)
}

function handleSaveDraft() {
  if (store.activeForm) {
    store.activeForm.status = 'Draft'
    store.activeForm.lastUpdated = new Date().toISOString().split('T')[0]
  }
  triggerSaveToast('Draft saved successfully')
}

function handlePublish() {
  if (store.activeForm) {
    store.activeForm.status = 'Published'
    store.activeForm.lastUpdated = new Date().toISOString().split('T')[0]
  }
  triggerSaveToast('Form published successfully!')
}

function addOptionToSelectedField() {
  if (selectedField.value) {
    if (!selectedField.value.options) selectedField.value.options = []
    const count = selectedField.value.options.length + 1
    selectedField.value.options.push({ label: `Option ${count}`, value: `Option ${count}` })
  }
}

function removeOptionFromSelectedField(idx: number) {
  if (selectedField.value && selectedField.value.options) {
    selectedField.value.options.splice(idx, 1)
  }
}

function getOptionLabel(opt: any): string {
  if (!opt) return ''
  if (typeof opt === 'string') return opt
  if (typeof opt === 'object') return opt.label || opt.value || opt.name || JSON.stringify(opt)
  return String(opt)
}

function updateOptionLabel(idx: number, newLabel: string) {
  if (selectedField.value && selectedField.value.options) {
    selectedField.value.options[idx] = { label: newLabel, value: newLabel }
  }
}

function addLogicRule() {
  const newRule: LogicRule = {
    id: Date.now().toString(),
    target: getLabel(store.editorFields[0]?.label || 'Field'),
    trigger: getLabel(store.editorFields[1]?.label || 'Trigger'),
    condition: 'is',
    comparison: '',
    action: 'Show field',
    active: true
  }
  store.logicRules.push(newRule)
}

function removeLogicRule(id: string) {
  store.logicRules = store.logicRules.filter(r => r.id !== id)
}

const copySuccessMsg = ref<string>('')
function copyCode(text: string, type: string) {
  navigator.clipboard.writeText(text)
  copySuccessMsg.value = type
  setTimeout(() => {
    copySuccessMsg.value = ''
  }, 2000)
}

// Embed Code Snippets
const shareUrl = computed(() => `https://app.rakansales.com/f/${store.activeForm?.id || 'demo'}`)
const iframeWidth = ref<string>('100%')
const iframeHeight = ref<string>('600')

const dynamicIframeSnippet = computed(() => `<iframe src="${shareUrl.value}" width="${iframeWidth.value}" height="${iframeHeight.value}px" frameborder="0" style="border:0; border-radius:12px;"><\/iframe>`)
const iframeSnippet = computed(() => `<iframe src="${shareUrl.value}" width="100%" height="600" frameborder="0" style="border:0; border-radius:12px;"><\/iframe>`)
const jsPopupSnippet = computed(() => `<script src="https://cdn.rakansales.com/form-popup.js" data-form-id="${store.activeForm?.id || 'demo'}"><\/script>`)
const rawHtmlSnippet = computed(() => `<form action="${shareUrl.value}/submit" method="POST">\n` +
  store.editorFields.map(f => `  <label>${getLabel(f.label)}</label>\n  <input type="${f.type}" name="${f.id}" ${f.required ? 'required' : ''} />`).join('\n') +
  `\n  <button type="submit">Submit</button>\n</form>`)

function handleSaveTemplate() {
  if (store.activeForm) {
    store.cloneFormToTemplate(store.activeForm)
    isTemplateModalOpen.value = false
    triggerSaveToast('Saved to Form Templates repository!')
  }
}
</script>

<template>
  <div class="h-[calc(100vh-6rem)] flex flex-col space-y-3 -m-4 lg:-m-6 p-4 lg:p-6 bg-background text-foreground">
    <!-- TOP BUILDER HEADER MATCHING MOCKUP DESIGN -->
    <header class="bg-card border border-border/80 rounded-2xl px-5 py-2.5 flex items-center justify-between shadow-xs shrink-0 relative gap-4">
      
      <!-- LEFT SECTION: BACK LINK | FORM TITLE & STATUS -->
      <div class="flex items-center gap-3 min-w-0">
        <button
          @click="router.push('/web-forms')"
          class="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft class="w-4 h-4" />
          <span>Web Forms</span>
        </button>

        <div class="h-4 w-px bg-border/80 shrink-0"></div>

        <div class="flex flex-col justify-center min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm text-foreground tracking-tight truncate">
              {{ store.activeForm?.name || 'Contact Us' }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-muted-foreground shrink-0"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              {{ store.activeForm?.status || 'Draft' }}
            </span>
          </div>
          <span class="text-[10px] text-muted-foreground font-normal leading-tight">
            Last saved Just now
          </span>
        </div>
      </div>

      <!-- CENTER SECTION: INTEGRATED SEGMENTED NAVIGATION TABS -->
      <div class="flex items-center bg-gray-100/90 dark:bg-zinc-900/90 p-1 rounded-2xl border border-border/40 shadow-xs overflow-x-auto">
        <button
          v-for="tab in ['Build', 'Logic', 'Style', 'Submit', 'Share', 'Settings'] as const"
          :key="tab"
          @click="store.editorTab = tab"
          :class="[
            'px-4 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap',
            store.editorTab === tab
              ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground font-semibold'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- RIGHT SECTION: PREVIEW & PUBLISH CTAS -->
      <div class="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          @click="handleSaveDraft"
          class="h-9 px-3.5 rounded-xl border-border/80 bg-background text-foreground font-bold text-xs gap-1.5 shadow-xs cursor-pointer hover:bg-muted/50"
        >
          <ExternalLink class="w-3.5 h-3.5 text-muted-foreground" />
          Preview
        </Button>

        <Button
          size="sm"
          @click="handlePublish"
          class="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs gap-1.5 shadow-xs cursor-pointer border-0"
        >
          <Sparkles class="w-3.5 h-3.5" />
          Publish
        </Button>
      </div>

    </header>

    <!-- SAVE TOAST INDICATOR -->
    <transition enter-active-class="transition duration-200" enter-from-class="-translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100">
      <div v-if="saveToast" class="fixed top-20 right-8 bg-gray-950 text-white px-4 py-2 rounded-xl shadow-2xl text-xs font-semibold z-50 flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-400" />
        {{ saveToast }}
      </div>
    </transition>

    <!-- MAIN BUILDER CANVAS / EDITING CONTAINER -->
    <div class="flex-1 min-h-0 relative overflow-hidden bg-card border border-border rounded-2xl shadow-xs">
      
      <!-- ═══════════════════════════════════════════════
           TAB 1: BUILD (FIELD PALETTE + LIVE CANVAS + PROPERTIES INSPECTOR MATCHING MOCKUP)
      ════════════════════════════════════════════════ -->
      <div v-if="store.editorTab === 'Build'" class="h-full grid grid-cols-1 lg:grid-cols-12 divide-x divide-border overflow-hidden">
        
        <!-- LEFT SIDEBAR: FIELD PALETTE -->
        <aside class="lg:col-span-3 p-4 overflow-y-auto space-y-4 bg-card">
          
          <!-- FIELDS | OUTLINE TAB SWITCHER -->
          <div class="flex items-center bg-muted/60 p-1 rounded-2xl border border-border/40">
            <button
              @click="leftTab = 'fields'"
              :class="[
                'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
                leftTab === 'fields' ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              ]"
            >
              FIELDS
            </button>
            <button
              @click="leftTab = 'outline'"
              :class="[
                'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
                leftTab === 'outline' ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              ]"
            >
              OUTLINE
            </button>
          </div>

          <div v-if="leftTab === 'fields'" class="space-y-4">
            <!-- Search Blocks -->
            <div class="relative">
              <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                v-model="blockSearch"
                placeholder="Search blocks..."
                class="pl-9 h-8 text-xs bg-gray-50/70 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl"
              />
            </div>

            <!-- STRUCTURE CATEGORY -->
            <div class="space-y-2">
              <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">STRUCTURE</span>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="store.addField('step')"
                  class="p-3 bg-white dark:bg-zinc-900 border border-border/80 rounded-xl hover:border-emerald-500 transition-all text-center space-y-1 group cursor-pointer shadow-xs"
                >
                  <Layers class="w-4 h-4 mx-auto text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                  <span class="block text-[11px] font-bold text-foreground">Step</span>
                </button>
                <button
                  @click="store.addField('section')"
                  class="p-3 bg-white dark:bg-zinc-900 border border-border/80 rounded-xl hover:border-emerald-500 transition-all text-center space-y-1 group cursor-pointer shadow-xs"
                >
                  <ListFilter class="w-4 h-4 mx-auto text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                  <span class="block text-[11px] font-bold text-foreground">Section</span>
                </button>
              </div>
            </div>

            <!-- BASIC FIELDS CATEGORY -->
            <div class="space-y-2">
              <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">BASIC FIELDS</span>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="b in [
                    { type: 'text', label: 'Short Text', icon: Type },
                    { type: 'longtext', label: 'Long Text', icon: AlignLeft },
                    { type: 'email', label: 'Email', icon: Mail },
                    { type: 'phone', label: 'Phone', icon: Phone },
                    { type: 'number', label: 'Number', icon: Hash },
                    { type: 'date', label: 'Date', icon: Calendar },
                    { type: 'time', label: 'Time', icon: Clock },
                    { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
                    { type: 'radio', label: 'Radio Buttons', icon: Radio },
                    { type: 'dropdown', label: 'Dropdown', icon: ListFilter },
                    { type: 'multiselect', label: 'Multi-select', icon: ListPlus }
                  ] as const"
                  :key="b.type"
                  @click="store.addField(b.type)"
                  :class="[
                    'p-3 bg-white dark:bg-zinc-900 border rounded-xl transition-all text-center space-y-1 group cursor-pointer shadow-xs',
                    b.type === 'longtext' ? 'border-zinc-900 dark:border-white ring-1 ring-zinc-900 dark:ring-white' : 'border-border/80 hover:border-emerald-500'
                  ]"
                >
                  <component :is="b.icon" class="w-4 h-4 mx-auto text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                  <span class="block text-[11px] font-bold text-foreground">{{ b.label }}</span>
                </button>
              </div>
            </div>

            <!-- BUSINESS CATEGORY -->
            <div class="space-y-2">
              <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">BUSINESS</span>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="biz in [
                    { type: 'company', label: 'Company', icon: Building2 },
                    { type: 'website', label: 'Website', icon: Globe },
                    { type: 'address', label: 'Address', icon: MapPin },
                    { type: 'country', label: 'Country', icon: Globe }
                  ] as const"
                  :key="biz.type"
                  @click="store.addField(biz.type)"
                  class="p-3 bg-white dark:bg-zinc-900 border border-border/80 rounded-xl hover:border-emerald-500 transition-all text-center space-y-1 group cursor-pointer shadow-xs"
                >
                  <component :is="biz.icon" class="w-4 h-4 mx-auto text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                  <span class="block text-[11px] font-bold text-foreground">{{ biz.label }}</span>
                </button>
              </div>
            </div>

          </div>

          <!-- OUTLINE TAB VIEW -->
          <div v-else class="space-y-2 text-xs">
            <div
              v-for="f in store.editorFields"
              :key="f.id"
              @click="store.selectedElementId = f.id"
              :class="[
                'p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors',
                store.selectedElementId === f.id ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 font-bold' : 'border-border/60 hover:bg-muted/40'
              ]"
            >
              <div class="flex items-center gap-2 truncate">
                <GripVertical class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span class="truncate">{{ getLabel(f.label) }}</span>
              </div>
              <Badge variant="outline" class="text-[9px] uppercase font-mono">{{ f.type }}</Badge>
            </div>
          </div>

        </aside>

        <!-- CENTER MAIN: LIVE CANVAS PREVIEW WITH TOP VIEWPORT SWITCHER -->
        <main class="lg:col-span-6 p-6 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/60 flex flex-col justify-start items-center relative min-h-0 space-y-5">
          
          <!-- TOP VIEWPORT SWITCHER (Matching Mockup) -->
          <div class="inline-flex items-center bg-card border border-border/80 p-1 rounded-2xl shadow-xs shrink-0 z-10">
            <button
              @click="store.viewportMode = 'desktop'"
              :class="[
                'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                store.viewportMode === 'desktop'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground font-semibold'
              ]"
            >
              <Monitor class="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              @click="store.viewportMode = 'mobile'"
              :class="[
                'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                store.viewportMode === 'mobile'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground font-semibold'
              ]"
            >
              <Smartphone class="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>

          <!-- CENTER FORM CANVAS CONTAINER -->
          <div
            :class="[
              'w-full transition-all duration-300 rounded-2xl p-8 shadow-lg border border-border/60 bg-white dark:bg-zinc-900 space-y-6 border-t-4',
              store.viewportMode === 'mobile' ? 'max-w-sm' : 'max-w-xl'
            ]"
            :style="{
              borderRadius: store.formStyles.radius,
              fontFamily: store.formStyles.fontFamily,
              borderTopColor: store.formStyles.primaryColor
            }"
          >
            <!-- Header -->
            <div class="text-center space-y-1.5 pb-2 border-b border-border/40">
              <h1 class="text-2xl font-extrabold text-foreground tracking-tight">
                {{ store.activeForm?.name || 'Contact Our Team' }}
              </h1>
              <p class="text-xs text-muted-foreground">
                {{ store.activeForm?.description || 'Have a question? We typically respond within 24 hours.' }}
              </p>
            </div>

            <!-- Form Elements List -->
            <div class="space-y-4">
              <div
                v-for="field in store.editorFields"
                :key="field.id"
                @click="store.selectedElementId = field.id"
                :class="[
                  'relative transition-all rounded-xl p-3 cursor-pointer',
                  store.selectedElementId === field.id
                    ? 'border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
                    : 'border border-transparent hover:border-border/80'
                ]"
              >
                <!-- EDITING BADGE ON ACTIVE FIELD -->
                <div v-if="store.selectedElementId === field.id" class="absolute -top-2.5 right-3 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase shadow-xs">
                  EDITING
                </div>

                <template v-if="field.type === 'step'">
                  <div class="bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl border border-border/60 flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    <Layers class="w-4 h-4 text-emerald-600" />
                    <span>STEP: {{ field.label || 'STEP' }}</span>
                  </div>
                </template>

                <template v-else-if="field.type === 'section'">
                  <div class="border-b border-border pb-1 text-sm font-extrabold text-foreground">
                    {{ field.label }}
                  </div>
                </template>

                <template v-else>
                  <label class="block text-xs font-bold text-foreground mb-1.5">
                    {{ getLabel(field.label) }}
                    <span v-if="field.required" class="text-destructive">*</span>
                  </label>

                  <Textarea
                    v-if="field.type === 'longtext'"
                    disabled
                    :placeholder="field.placeholder || 'Enter long text...'"
                    class="text-xs bg-gray-50/70 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl"
                    :style="{ borderRadius: store.formStyles.radius }"
                  />
                  <select
                    v-else-if="field.type === 'dropdown'"
                    disabled
                    class="w-full px-3 py-2 bg-gray-50/70 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-muted-foreground rounded-xl"
                    :style="{ borderRadius: store.formStyles.radius }"
                  >
                    <option v-for="opt in field.options" :key="getOptionLabel(opt)">{{ getOptionLabel(opt) }}</option>
                  </select>
                  <div v-else-if="field.type === 'checkbox' || field.type === 'radio'" class="space-y-1.5 pt-1">
                    <div v-for="opt in field.options" :key="getOptionLabel(opt)" class="flex items-center gap-2 text-xs text-foreground">
                      <input :type="field.type" disabled class="rounded text-emerald-600" />
                      <span>{{ getOptionLabel(opt) }}</span>
                    </div>
                  </div>
                  <div v-else-if="field.type === 'file'" class="border border-dashed border-border p-4 text-center text-xs text-muted-foreground bg-gray-50/70 dark:bg-zinc-950 rounded-xl">
                    <Paperclip class="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span>Click or drag file attachment to upload</span>
                  </div>
                  <Input
                    v-else
                    disabled
                    :placeholder="field.placeholder || 'Type here...'"
                    class="h-10 text-xs bg-gray-50/70 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl"
                    :style="{ borderRadius: store.formStyles.radius }"
                  />
                </template>
              </div>

              <!-- Submit Button Preview -->
              <div class="pt-2">
                <button
                  disabled
                  class="w-full h-11 text-white font-extrabold text-xs rounded-xl shadow-md cursor-not-allowed opacity-95 transition-all"
                  :style="{
                    backgroundColor: store.formStyles.primaryColor,
                    borderRadius: store.formStyles.radius
                  }"
                >
                  Submit
                </button>
              </div>
            </div>

          </div>

        </main>

        <!-- RIGHT SIDEBAR: PROPERTIES INSPECTOR (Matching Mockup) -->
        <aside class="lg:col-span-3 p-5 overflow-y-auto space-y-5 bg-card">
          
          <div class="flex items-center justify-between border-b border-border/60 pb-3">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">PROPERTIES</span>
            <button @click="store.selectedElementId = null" class="text-muted-foreground hover:text-foreground p-1 rounded-lg">
              <X class="w-4 h-4" />
            </button>
          </div>

          <template v-if="selectedField">
            <!-- LABEL -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-foreground">LABEL</label>
              <Input v-model="selectedField.label" class="h-9 text-xs bg-white dark:bg-zinc-900 border-border/80" />
            </div>

            <!-- WIDTH -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-foreground">WIDTH</label>
              <div class="flex items-center bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl border border-border/40">
                <button
                  @click="selectedField.width = 'full'"
                  :class="[
                    'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                    selectedField.width === 'full' ? 'bg-zinc-900 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  ]"
                >
                  Full Width
                </button>
                <button
                  @click="selectedField.width = 'half'"
                  :class="[
                    'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                    selectedField.width === 'half' ? 'bg-zinc-900 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  ]"
                >
                  Half Width
                </button>
              </div>
            </div>

            <!-- VALIDATION -->
            <div class="space-y-1.5 pt-1">
              <label class="block text-xs font-bold text-foreground">VALIDATION</label>
              <div class="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-gray-50/50 dark:bg-zinc-950">
                <span class="text-xs font-semibold text-foreground">Required Field</span>
                <Checkbox v-model="selectedField.required" />
              </div>
            </div>

            <!-- PLACEHOLDER -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-foreground">PLACEHOLDER</label>
              <Input v-model="selectedField.placeholder" placeholder="Enter placeholder..." class="h-9 text-xs bg-white dark:bg-zinc-900 border-border/80" />
            </div>

            <!-- DELETE BUTTON -->
            <div class="pt-4 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                @click="store.removeField(selectedField.id)"
                class="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 font-bold text-xs h-9 rounded-xl gap-1.5 cursor-pointer"
              >
                <Trash2 class="w-3.5 h-3.5" />
                Delete Element
              </Button>
            </div>
          </template>

          <template v-else>
            <div class="py-12 text-center text-xs text-muted-foreground space-y-2">
              <Sliders class="w-6 h-6 mx-auto opacity-40" />
              <p>Select any element on the canvas to configure its properties.</p>
            </div>
          </template>

        </aside>

      </div>

      <!-- ═══════════════════════════════════════════════
           TAB 2: LOGIC (RULE BUILDER MATCHING SECOND MOCKUP)
      ════════════════════════════════════════════════ -->
      <div v-else-if="store.editorTab === 'Logic'" class="h-full grid grid-cols-1 lg:grid-cols-12 divide-x divide-border overflow-hidden">
        
        <!-- LEFT SIDEBAR: RULES | OBJECTS NAVIGATION -->
        <aside class="lg:col-span-3 p-4 overflow-y-auto space-y-4 bg-card flex flex-col justify-between h-full">
          
          <div class="space-y-4">
            <!-- RULES | OBJECTS TAB SWITCHER -->
            <div class="flex items-center bg-muted/60 p-1 rounded-2xl border border-border/40">
              <button
                @click="logicLeftTab = 'rules'"
                :class="[
                  'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
                  logicLeftTab === 'rules' ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                RULES
              </button>
              <button
                @click="logicLeftTab = 'objects'"
                :class="[
                  'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
                  logicLeftTab === 'objects' ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                OBJECTS
              </button>
            </div>

            <!-- RULES LIST -->
            <div v-if="logicLeftTab === 'rules'" class="space-y-2">
              <div
                v-for="rule in store.logicRules"
                :key="rule.id"
                @click="selectedRuleId = rule.id"
                :class="[
                  'p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1',
                  selectedRuleId === rule.id
                    ? 'border-2 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                    : 'border-border/80 hover:bg-muted/40'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="font-extrabold text-xs text-foreground">{{ rule.action }} {{ rule.target }}</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p class="text-[11px] text-muted-foreground">
                  When {{ rule.trigger }} {{ rule.condition }} {{ rule.comparison }}
                </p>
              </div>
            </div>

            <div v-else class="py-8 text-center text-xs text-muted-foreground">
              <p>Object routing and conditional logic options.</p>
            </div>
          </div>

          <!-- CREATE RULE BUTTON AT BOTTOM -->
          <div class="pt-4 border-t border-border/60">
            <button
              @click="addLogicRule()"
              class="w-full py-2.5 px-4 bg-background border border-border/80 hover:bg-muted font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus class="w-4 h-4 text-emerald-600" />
              Create Rule
            </button>
          </div>

        </aside>

        <!-- CENTER MAIN: RULE BUILDER CARD -->
        <main class="lg:col-span-6 p-6 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/60 flex flex-col justify-start items-center min-h-0 space-y-5">
          
          <!-- RULE BUILDER HEADER -->
          <div class="w-full max-w-xl text-left space-y-1">
            <h2 class="text-xl font-extrabold text-foreground tracking-tight">Rule Builder</h2>
            <p class="text-xs text-muted-foreground">Configure conditional behavior using simple statements.</p>
          </div>

          <template v-if="activeRule">
            <!-- RULE SUMMARY BANNER (Matching Mockup) -->
            <div class="w-full max-w-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex items-center gap-3 text-xs shadow-xs">
              <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Zap class="w-4 h-4" />
              </div>
              <div class="text-amber-900 dark:text-amber-300 font-semibold">
                <span class="text-[10px] font-extrabold uppercase tracking-wider block text-amber-700 dark:text-amber-400 mb-0.5">RULE SUMMARY</span>
                When <strong class="font-extrabold">{{ activeRule.trigger || 'Inquiry Type' }}</strong> is <strong class="font-extrabold">"{{ activeRule.comparison || 'Support' }}"</strong>, then <strong class="font-extrabold">{{ activeRule.action.toLowerCase() }} {{ activeRule.target }}</strong>.
              </div>
            </div>

            <!-- RULE CONFIG CARD (Matching Mockup) -->
            <div class="w-full max-w-xl bg-white dark:bg-zinc-900 border border-border/60 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              
              <!-- TARGET ROW -->
              <div class="grid grid-cols-12 gap-3 items-center">
                <div class="col-span-3">
                  <span class="inline-block px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-muted-foreground font-extrabold text-[10px] uppercase rounded-lg">TARGET</span>
                </div>
                <div class="col-span-4">
                  <select class="w-full px-3 py-2 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground">
                    <option>Field</option>
                    <option>Section</option>
                  </select>
                </div>
                <div class="col-span-5">
                  <select v-model="activeRule.target" class="w-full px-3 py-2 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground">
                    <option v-for="f in store.editorFields" :key="f.id" :value="getLabel(f.label)">{{ getLabel(f.label) }}</option>
                  </select>
                </div>
              </div>

              <!-- WHEN ROW -->
              <div class="grid grid-cols-12 gap-3 items-center">
                <div class="col-span-3">
                  <span class="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-extrabold text-[10px] uppercase rounded-lg">WHEN</span>
                </div>
                <div class="col-span-9">
                  <select v-model="activeRule.trigger" class="w-full px-3 py-2 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground">
                    <option v-for="f in store.editorFields" :key="f.id" :value="getLabel(f.label)">{{ getLabel(f.label) }}</option>
                  </select>
                </div>
              </div>

              <!-- CONDITION ROW -->
              <div class="grid grid-cols-12 gap-3 items-center">
                <div class="col-span-3">
                  <span class="inline-block px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-muted-foreground font-extrabold text-[10px] uppercase rounded-lg">CONDITION</span>
                </div>
                <div class="col-span-4">
                  <select v-model="activeRule.condition" class="w-full px-3 py-2 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground">
                    <option value="is">is</option>
                    <option value="is_not">is not</option>
                    <option value="contains">contains</option>
                    <option value="filled">is filled</option>
                  </select>
                </div>
                <div class="col-span-5">
                  <Input v-model="activeRule.comparison" placeholder="Support" class="h-9 text-xs bg-gray-50/80 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl" />
                </div>
              </div>

              <!-- THEN ROW -->
              <div class="grid grid-cols-12 gap-3 items-center">
                <div class="col-span-3">
                  <span class="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-extrabold text-[10px] uppercase rounded-lg">THEN</span>
                </div>
                <div class="col-span-9">
                  <select v-model="activeRule.action" class="w-full px-3 py-2 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground">
                    <option value="Show field">Show field</option>
                    <option value="Hide field">Hide field</option>
                    <option value="Require field">Require field</option>
                  </select>
                </div>
              </div>

            </div>
          </template>

        </main>

        <!-- RIGHT SIDEBAR: RULE SETTINGS (Matching Mockup) -->
        <aside class="lg:col-span-3 p-5 overflow-y-auto space-y-5 bg-card">
          
          <div class="flex items-center justify-between border-b border-border/60 pb-3">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">RULE SETTINGS</span>
            <button class="text-muted-foreground hover:text-foreground p-1 rounded-lg">
              <X class="w-4 h-4" />
            </button>
          </div>

          <template v-if="activeRule">
            <!-- STATUS -->
            <div class="space-y-2">
              <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">STATUS</span>
              <div class="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-gray-50/50 dark:bg-zinc-950">
                <span class="text-xs font-semibold text-foreground">Enable Rule</span>
                <Checkbox v-model="activeRule.active" />
              </div>
            </div>

            <!-- VALIDATION -->
            <div class="space-y-2">
              <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">VALIDATION</span>
              <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3.5 rounded-xl text-xs text-blue-900 dark:text-blue-300 font-medium flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Rule is valid. No conflicts detected.</span>
              </div>
            </div>

            <!-- DELETE RULE BUTTON -->
            <div class="pt-4 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                @click="removeLogicRule(activeRule.id)"
                class="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 font-bold text-xs h-9 rounded-xl gap-1.5 cursor-pointer"
              >
                <Trash2 class="w-3.5 h-3.5" />
                Delete Rule
              </Button>
            </div>
          </template>

        </aside>

      </div>

      <!-- ═══════════════════════════════════════════════
           TAB 3: STYLE (3-COLUMN BRAND & PREVIEW CUSTOMIZER MATCHING DESIGN)
      ════════════════════════════════════════════════ -->
      <div v-else-if="store.editorTab === 'Style'" class="h-full grid grid-cols-1 lg:grid-cols-12 divide-x divide-border overflow-hidden">
        
        <!-- LEFT COLUMN: STYLE NAVIGATION SIDEBAR -->
        <aside class="lg:col-span-3 p-4 overflow-y-auto space-y-4 bg-card flex flex-col justify-between">
          <div class="space-y-3">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">STYLE NAVIGATION</span>
            
            <nav class="space-y-1 text-xs">
              <button
                v-for="item in ['Quick Style', 'Typography', 'Inputs', 'Buttons', 'Spacing', 'Container', 'Background', 'Success State'] as const"
                :key="item"
                @click="styleNavTab = item"
                :class="[
                  'w-full text-left px-3 py-2 rounded-xl font-semibold transition-all flex items-center justify-between cursor-pointer',
                  styleNavTab === item
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                ]"
              >
                <span>{{ item }}</span>
                <ChevronRight v-if="styleNavTab === item" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </nav>
          </div>

          <!-- Bottom Action: Reset All Styles -->
          <div class="pt-4 border-t border-border">
            <button
              @click="resetAllStyles"
              class="w-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Reset All Styles</span>
            </button>
          </div>
        </aside>

        <!-- CENTER COLUMN: LIVE FORM CANVAS PREVIEW IN THE MIDDLE -->
        <main class="lg:col-span-6 p-6 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/60 flex flex-col justify-start items-center relative min-h-0">
          
          <!-- TOP TOOLBAR: VIEWPORT TOGGLE (LEFT) & FORM/SUCCESS STATE TOGGLE (RIGHT) -->
          <div class="flex items-center justify-between w-full max-w-2xl mb-5">
            <!-- Viewport Switcher -->
            <div class="inline-flex items-center bg-card border border-border/80 p-1 rounded-2xl shadow-xs">
              <button
                @click="store.viewportMode = 'desktop'"
                :class="[
                  'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                  store.viewportMode === 'desktop'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground font-semibold'
                ]"
              >
                <Monitor class="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                @click="store.viewportMode = 'mobile'"
                :class="[
                  'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                  store.viewportMode === 'mobile'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground font-semibold'
                ]"
              >
                <Smartphone class="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            <!-- Form View vs Success State View Toggle -->
            <div class="inline-flex items-center bg-card border border-border/80 p-1 rounded-2xl shadow-xs">
              <button
                @click="stylePreviewView = 'Form View'"
                :class="[
                  'px-3.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  stylePreviewView === 'Form View'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground font-semibold'
                ]"
              >
                Form View
              </button>
              <button
                @click="stylePreviewView = 'Success State'"
                :class="[
                  'px-3.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  stylePreviewView === 'Success State'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground font-semibold'
                ]"
              >
                Success State
              </button>
            </div>
          </div>

          <!-- CENTERED LIVE FORM PREVIEW CARD -->
          <div
            :class="[
              'w-full transition-all duration-300 rounded-2xl p-8 shadow-lg border border-border/60 bg-white dark:bg-zinc-900 space-y-6 border-t-4',
              store.viewportMode === 'mobile' ? 'max-w-sm' : 'max-w-xl'
            ]"
            :style="{
              borderRadius: store.formStyles.radius,
              fontFamily: store.formStyles.fontFamily,
              borderTopColor: store.formStyles.primaryColor
            }"
          >
            <!-- FORM VIEW MODE -->
            <template v-if="stylePreviewView === 'Form View'">
              <!-- Header -->
              <div class="text-center space-y-1.5 pb-2 border-b border-border/40">
                <h1 class="text-2xl font-extrabold text-foreground tracking-tight">
                  {{ store.activeForm?.name || 'Contact Our Team' }}
                </h1>
                <p class="text-xs text-muted-foreground">
                  {{ store.activeForm?.description || 'Have a question? We typically respond within 24 hours.' }}
                </p>
              </div>

              <!-- Form Elements List -->
              <div class="space-y-4">
                <div
                  v-for="field in store.editorFields"
                  :key="field.id"
                  @click="store.selectedElementId = field.id"
                  :class="[
                    'relative transition-all rounded-xl p-3 cursor-pointer',
                    store.selectedElementId === field.id
                      ? 'border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
                      : 'border border-transparent hover:border-border/80'
                  ]"
                >
                  <!-- EDITING BADGE ON ACTIVE FIELD -->
                  <div v-if="store.selectedElementId === field.id" class="absolute -top-2.5 right-3 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase shadow-xs">
                    EDITING
                  </div>

                  <template v-if="field.type === 'step'">
                    <div class="bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl border border-border/60 flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      <Layers class="w-4 h-4 text-emerald-600" />
                      <span>STEP: {{ field.label || 'STEP' }}</span>
                    </div>
                  </template>

                  <template v-else-if="field.type === 'section'">
                    <div class="border-b border-border pb-1 text-sm font-extrabold text-foreground">
                      {{ field.label }}
                    </div>
                  </template>

                  <template v-else>
                    <label class="block text-xs font-bold text-foreground mb-1.5">
                      {{ getLabel(field.label) }}
                      <span v-if="field.required" class="text-destructive">*</span>
                    </label>

                    <Textarea
                      v-if="field.type === 'longtext'"
                      disabled
                      :placeholder="field.placeholder || 'Enter long text...'"
                      class="text-xs bg-gray-50/70 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl"
                      :style="{ borderRadius: store.formStyles.radius }"
                    />
                    <select
                      v-else-if="field.type === 'dropdown'"
                      disabled
                      class="w-full px-3 py-2 bg-gray-50/70 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-muted-foreground rounded-xl"
                      :style="{ borderRadius: store.formStyles.radius }"
                    >
                      <option v-for="opt in field.options" :key="getOptionLabel(opt)">{{ getOptionLabel(opt) }}</option>
                    </select>
                    <div v-else-if="field.type === 'checkbox' || field.type === 'radio'" class="space-y-1.5 pt-1">
                      <div v-for="opt in field.options" :key="getOptionLabel(opt)" class="flex items-center gap-2 text-xs text-foreground">
                        <input :type="field.type" disabled class="rounded text-emerald-600" />
                        <span>{{ getOptionLabel(opt) }}</span>
                      </div>
                    </div>
                    <div v-else-if="field.type === 'file'" class="border border-dashed border-border p-4 text-center text-xs text-muted-foreground bg-gray-50/70 dark:bg-zinc-950 rounded-xl">
                      <Paperclip class="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      <span>Click or drag file attachment to upload</span>
                    </div>
                    <Input
                      v-else
                      disabled
                      :placeholder="field.placeholder || 'Type here...'"
                      class="h-10 text-xs bg-gray-50/70 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl"
                      :style="{ borderRadius: store.formStyles.radius }"
                    />
                  </template>
                </div>

                <!-- Submit Button Preview -->
                <div class="pt-2">
                  <button
                    disabled
                    class="w-full h-11 text-white font-extrabold text-xs rounded-xl shadow-md cursor-not-allowed opacity-95 transition-all"
                    :style="{
                      backgroundColor: store.formStyles.primaryColor,
                      borderRadius: store.formStyles.radius
                    }"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </template>

            <!-- SUCCESS STATE MODE -->
            <template v-else>
              <div class="py-8 text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-foreground">Submission Received!</h3>
                <p class="text-xs text-muted-foreground max-w-sm mx-auto">
                  Thank you for filling out this form. We have logged your response and will follow up shortly.
                </p>
                <div class="pt-2">
                  <button
                    disabled
                    :style="{
                      backgroundColor: store.formStyles.primaryColor,
                      borderRadius: store.formStyles.radius
                    }"
                    class="px-5 py-2 text-white font-bold text-xs rounded-xl cursor-not-allowed"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- FLOATING HELPER TOAST BANNER AT BOTTOM RIGHT -->
          <div class="absolute bottom-4 right-4 bg-zinc-950 text-white p-3.5 rounded-2xl shadow-2xl max-w-xs text-xs space-y-1 border border-zinc-800 flex items-start gap-2.5 z-20">
            <div class="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Check class="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <p class="text-[11px] text-zinc-300 leading-relaxed font-medium">
              Choose a preset to style your form quickly, or fine-tune each category in Advanced Style.
            </p>
          </div>

        </main>

        <!-- RIGHT COLUMN: QUICK STYLE SETTINGS INSPECTOR -->
        <aside class="lg:col-span-3 p-5 overflow-y-auto space-y-6 bg-card">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-border pb-3">
            <h3 class="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">QUICK STYLE SETTINGS</h3>
            <button
              @click="resetAllStyles"
              class="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg cursor-pointer"
              title="Reset Settings"
            >
              <RotateCcw class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- THEME PRESETS -->
          <div class="space-y-2.5">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">THEME PRESETS</span>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="preset in ['Clean', 'Rounded', 'Minimal', 'Bold', 'Corporate']"
                :key="preset"
                @click="applyThemePreset(preset)"
                :class="[
                  'py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center',
                  activeThemePreset === preset
                    ? 'border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                    : 'border border-border/80 text-muted-foreground hover:text-foreground bg-background'
                ]"
              >
                {{ preset }}
              </button>
            </div>
          </div>

          <!-- BRAND COLOR -->
          <div class="space-y-2.5 pt-2 border-t border-border/60">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">BRAND COLOR</span>
            <div class="flex items-center gap-2.5">
              <button
                v-for="color in ['#23B750', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']"
                :key="color"
                @click="store.formStyles.primaryColor = color"
                :style="{ backgroundColor: color }"
                :class="[
                  'w-8 h-8 rounded-full transition-all cursor-pointer shrink-0',
                  store.formStyles.primaryColor === color ? 'ring-2 ring-emerald-500 ring-offset-2 scale-110' : 'hover:scale-105'
                ]"
              ></button>
              
              <!-- Custom color picker -->
              <div class="relative w-8 h-8 rounded-full overflow-hidden border border-border flex items-center justify-center shrink-0 cursor-pointer">
                <input
                  type="color"
                  v-model="store.formStyles.primaryColor"
                  class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div class="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 via-pink-500 to-amber-400"></div>
              </div>
            </div>
          </div>

          <!-- TYPOGRAPHY -->
          <div class="space-y-2.5 pt-2 border-t border-border/60">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">TYPOGRAPHY</span>
            <select
              v-model="store.formStyles.fontFamily"
              class="w-full px-3 py-2 bg-background border border-border/80 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Inter, sans-serif">Inter (Default)</option>
              <option value="System-ui, sans-serif">System UI</option>
              <option value="Georgia, serif">Serif / Editorial</option>
              <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
            </select>
          </div>

          <!-- CORNERS -->
          <div class="space-y-2.5 pt-2 border-t border-border/60">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">CORNERS</span>
            <div class="flex items-center bg-gray-100 dark:bg-zinc-900 p-1 rounded-2xl border border-border/40">
              <button
                @click="store.formStyles.radius = '0px'"
                :class="[
                  'flex-1 py-1.5 rounded-xl text-xs transition-all cursor-pointer text-center',
                  store.formStyles.radius === '0px'
                    ? 'bg-zinc-900 text-white font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground font-semibold'
                ]"
              >
                None
              </button>
              <button
                @click="store.formStyles.radius = '12px'"
                :class="[
                  'flex-1 py-1.5 rounded-xl text-xs transition-all cursor-pointer text-center',
                  store.formStyles.radius === '12px'
                    ? 'bg-zinc-900 text-white font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground font-semibold'
                ]"
              >
                Rounded
              </button>
              <button
                @click="store.formStyles.radius = '20px'"
                :class="[
                  'flex-1 py-1.5 rounded-xl text-xs transition-all cursor-pointer text-center',
                  store.formStyles.radius === '20px'
                    ? 'bg-zinc-900 text-white font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground font-semibold'
                ]"
              >
                Full
              </button>
            </div>
          </div>

        </aside>
      </div>

      <!-- ═══════════════════════════════════════════════
           TAB 4: SUBMIT (3-COLUMN SUBMISSION SETUP & CRM OUTCOMES MATCHING DESIGN)
      ════════════════════════════════════════════════ -->
      <div v-else-if="store.editorTab === 'Submit'" class="h-full grid grid-cols-1 lg:grid-cols-12 divide-x divide-border overflow-hidden">
        
        <!-- LEFT SIDEBAR: SUBMISSION SETUP NAVIGATION -->
        <aside class="lg:col-span-3 p-4 overflow-y-auto space-y-4 bg-card">
          <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">SUBMISSION SETUP</span>

          <nav class="space-y-1 text-xs">
            <button
              v-for="subTab in [
                'Success Experience',
                'Submission Outcomes',
                'Duplicate Handling',
                'Ownership & Tags',
                'Respondent Notifications',
                'Field Mapping'
              ] as const"
              :key="subTab"
              @click="submitNavTab = subTab"
              :class="[
                'w-full text-left px-3.5 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-between cursor-pointer',
                submitNavTab === subTab
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              ]"
            >
              <span>{{ subTab }}</span>

              <!-- Status Icons -->
              <span class="flex items-center gap-1">
                <template v-if="subTab === 'Submission Outcomes' && !store.submitConfig.primaryOutcome">
                  <AlertTriangle class="w-3.5 h-3.5 text-amber-500" />
                </template>
                <template v-else-if="subTab === 'Field Mapping' && Object.keys(store.submitConfig.fieldMappings || {}).length < store.editorFields.length">
                  <AlertTriangle class="w-3.5 h-3.5 text-amber-500" />
                </template>
                <template v-else>
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500/80 opacity-80" />
                </template>
              </span>
            </button>
          </nav>
        </aside>

        <!-- CENTER MAIN: CONFIGURATION CARD & PREVIEW -->
        <main class="lg:col-span-6 p-6 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/60 flex flex-col justify-start items-center min-h-0 space-y-5">
          
          <!-- SUB-TAB HEADER -->
          <div class="w-full max-w-xl text-left space-y-1">
            <h2 class="text-xl font-extrabold text-foreground tracking-tight">{{ submitNavTab }}</h2>
            <p class="text-xs text-muted-foreground">
              <template v-if="submitNavTab === 'Success Experience'">Define what the visitor sees after submitting the form.</template>
              <template v-else-if="submitNavTab === 'Submission Outcomes'">Specify primary CRM object and secondary outcomes created on submission.</template>
              <template v-else-if="submitNavTab === 'Duplicate Handling'">Configure duplicate contact detection and strategy.</template>
              <template v-else-if="submitNavTab === 'Ownership & Tags'">Assign form lead owner, team routing, and CRM tags.</template>
              <template v-else-if="submitNavTab === 'Respondent Notifications'">Setup email confirmation receipts and staff alerts.</template>
              <template v-else-if="submitNavTab === 'Field Mapping'">Map web form fields to CRM contact and deal properties.</template>
            </p>
          </div>

          <!-- CONFIG CARD -->
          <div class="w-full max-w-xl bg-white dark:bg-zinc-900 border border-border/60 rounded-2xl p-6 shadow-sm space-y-5">
            
            <!-- 1. SUCCESS EXPERIENCE -->
            <template v-if="submitNavTab === 'Success Experience'">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-foreground">Success Action</label>
                <select
                  v-model="store.submitConfig.successMode"
                  class="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="message">Show a thank-you message</option>
                  <option value="redirect">Redirect to another URL</option>
                  <option value="message_cta">Show message with CTA button</option>
                </select>
              </div>

              <!-- Message Content Section -->
              <div v-if="store.submitConfig.successMode !== 'redirect'" class="bg-gray-50/70 dark:bg-zinc-950/80 p-4 rounded-xl space-y-3.5 border border-border/40">
                <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">MESSAGE CONTENT</span>
                
                <div class="space-y-1">
                  <label class="block text-[11px] font-bold text-foreground">Headline</label>
                  <Input v-model="store.submitConfig.successTitle" class="h-9 text-xs bg-white dark:bg-zinc-900" />
                </div>

                <div class="space-y-1">
                  <label class="block text-[11px] font-bold text-foreground">Body Text</label>
                  <Textarea v-model="store.submitConfig.successBody" rows="3" class="text-xs bg-white dark:bg-zinc-900" />
                </div>
              </div>

              <!-- Redirect Settings Section -->
              <div v-else class="bg-gray-50/70 dark:bg-zinc-950/80 p-4 rounded-xl space-y-3.5 border border-border/40">
                <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">REDIRECT SETTINGS</span>
                
                <div class="space-y-1">
                  <label class="block text-[11px] font-bold text-foreground">Redirect URL</label>
                  <Input v-model="store.submitConfig.redirectUrl" placeholder="https://example.com/thank-you" class="h-9 text-xs bg-white dark:bg-zinc-900" />
                </div>

                <div class="space-y-1">
                  <label class="block text-[11px] font-bold text-foreground">Redirect Delay (Seconds)</label>
                  <Input v-model="store.submitConfig.redirectDelay" type="number" class="h-9 text-xs bg-white dark:bg-zinc-900" />
                </div>
              </div>

              <!-- Live Preview Section -->
              <div class="space-y-2 pt-2 border-t border-border/60">
                <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">LIVE PREVIEW</span>
                <div class="bg-white dark:bg-zinc-950 border border-border/60 rounded-xl p-6 text-center space-y-2.5">
                  <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <Check class="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h4 class="font-extrabold text-base text-foreground tracking-tight">{{ store.submitConfig.successTitle || 'Thank you!' }}</h4>
                  <p class="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    {{ store.submitConfig.successBody || 'We have received your submission and will be in touch shortly.' }}
                  </p>
                </div>
              </div>
            </template>

            <!-- 2. SUBMISSION OUTCOMES -->
            <template v-else-if="submitNavTab === 'Submission Outcomes'">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-foreground">Primary CRM Outcome Object</label>
                <select
                  v-model="store.submitConfig.primaryOutcome"
                  class="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">-- Select Primary Outcome --</option>
                  <option value="Contact">Create / Update Contact</option>
                  <option value="Lead">Create Lead Record</option>
                  <option value="Company">Create Company Record</option>
                </select>
              </div>

              <div class="space-y-3 pt-2 border-t border-border/60">
                <label class="block text-xs font-bold text-foreground">Linked Secondary Outcomes</label>
                <div class="space-y-2 text-xs">
                  <label class="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors">
                    <input type="checkbox" value="Conversation" v-model="store.submitConfig.linkedOutcomes" class="rounded text-emerald-600" />
                    <div>
                      <span class="font-bold text-foreground block">Open Inbox Conversation</span>
                      <span class="text-[11px] text-muted-foreground">Start an omnichannel message thread automatically</span>
                    </div>
                  </label>
                  <label class="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors">
                    <input type="checkbox" value="Deal" v-model="store.submitConfig.linkedOutcomes" class="rounded text-emerald-600" />
                    <div>
                      <span class="font-bold text-foreground block">Create Sales Deal Opportunity</span>
                      <span class="text-[11px] text-muted-foreground">Log a new deal in the default pipeline stage</span>
                    </div>
                  </label>
                  <label class="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors">
                    <input type="checkbox" value="Ticket" v-model="store.submitConfig.linkedOutcomes" class="rounded text-emerald-600" />
                    <div>
                      <span class="font-bold text-foreground block">Create Support Ticket</span>
                      <span class="text-[11px] text-muted-foreground">Generate helpdesk ticket for customer service reps</span>
                    </div>
                  </label>
                </div>
              </div>
            </template>

            <!-- 3. DUPLICATE HANDLING -->
            <template v-else-if="submitNavTab === 'Duplicate Handling'">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-foreground">Duplicate Strategy</label>
                <select
                  v-model="store.submitConfig.duplicateStrategy"
                  class="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="new_flag">Create new record with duplicate flag</option>
                  <option value="always_new">Always create new record</option>
                  <option value="link_existing">Merge into existing contact record</option>
                  <option value="admin_rule">Block submission & show duplicate error</option>
                </select>
              </div>

              <div class="space-y-2 pt-2 border-t border-border/60 text-xs">
                <span class="font-bold text-foreground block">Unique Matching Key</span>
                <p class="text-muted-foreground">By default, submissions match existing CRM records via <strong class="text-foreground font-mono">Email Address</strong>.</p>
              </div>
            </template>

            <!-- 4. OWNERSHIP & TAGS -->
            <template v-else-if="submitNavTab === 'Ownership & Tags'">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-foreground">Assign Form Owner</label>
                <select
                  v-model="store.submitConfig.owner"
                  class="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Alex Rivera">Alex Rivera</option>
                  <option value="Sam Chen">Sam Chen</option>
                  <option value="Jordan Smith">Jordan Smith</option>
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-foreground">Routing Team</label>
                <select
                  v-model="store.submitConfig.team"
                  class="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Sales East">Sales East</option>
                  <option value="Enterprise Sales">Enterprise Sales</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
              </div>
            </template>

            <!-- 5. RESPONDENT NOTIFICATIONS -->
            <template v-else-if="submitNavTab === 'Respondent Notifications'">
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-gray-50/50 dark:bg-zinc-950">
                  <div>
                    <span class="font-bold text-xs text-foreground block">Email Receipt to Respondent</span>
                    <span class="text-[11px] text-muted-foreground">Send submission copy to visitor's email</span>
                  </div>
                  <Checkbox checked />
                </div>

                <div class="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-gray-50/50 dark:bg-zinc-950">
                  <div>
                    <span class="font-bold text-xs text-foreground block">Internal Staff Alert</span>
                    <span class="text-[11px] text-muted-foreground">Notify team when a response is submitted</span>
                  </div>
                  <Checkbox checked />
                </div>
              </div>
            </template>

            <!-- 6. FIELD MAPPING -->
            <template v-else-if="submitNavTab === 'Field Mapping'">
              <div class="space-y-3">
                <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">MAPPING MATRIX</span>
                <div class="border border-border/60 rounded-xl overflow-hidden text-xs">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-gray-50 dark:bg-zinc-950 border-b border-border/60 font-bold text-muted-foreground text-[11px]">
                        <th class="p-2.5">Form Field</th>
                        <th class="p-2.5">Target Object</th>
                        <th class="p-2.5">CRM Property</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                      <tr v-for="field in store.editorFields" :key="field.id">
                        <td class="p-2.5 font-bold text-foreground">{{ getLabel(field.label) }}</td>
                        <td class="p-2.5 text-muted-foreground">Contact</td>
                        <td class="p-2.5">
                          <Input :placeholder="getLabel(field.label)" class="h-8 text-xs bg-white dark:bg-zinc-900" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

          </div>

        </main>

        <!-- RIGHT SIDEBAR: CONFIGURATION SUMMARY MATCHING DESIGN -->
        <aside class="lg:col-span-3 p-5 overflow-y-auto space-y-5 bg-card">
          
          <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">CONFIGURATION SUMMARY</span>

          <!-- SUBMISSION SUMMARY CARD -->
          <div class="bg-muted/40 border border-border/70 rounded-2xl p-4 space-y-3 text-xs">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block border-b border-border/60 pb-2">
              SUBMISSION SUMMARY
            </span>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Success Mode</span>
                <span class="font-bold text-foreground">
                  {{ store.submitConfig.successMode === 'redirect' ? 'Redirect' : 'Message' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Duplicate Strategy</span>
                <span class="font-bold text-foreground">
                  {{ store.submitConfig.duplicateStrategy === 'new_flag' ? 'New Flag' : 'Create New' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Owner / Team</span>
                <span class="font-bold text-foreground">
                  {{ store.submitConfig.owner || 'None' }} / {{ store.submitConfig.team || 'None' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Notifications</span>
                <span class="font-bold text-foreground">Enabled</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Mapped Fields</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">
                  {{ Object.keys(store.submitConfig.fieldMappings || {}).length }}/{{ store.editorFields.length }}
                </span>
              </div>
            </div>
          </div>

          <!-- ACTION REQUIRED CARD -->
          <div class="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl space-y-2 text-xs text-amber-900 dark:text-amber-300">
            <div class="flex items-center gap-2 font-extrabold">
              <AlertTriangle class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Action Required</span>
            </div>

            <ul class="space-y-1 text-[11px] pl-1 font-medium">
              <li v-if="!store.submitConfig.primaryOutcome" class="text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <span>• Select a Primary Outcome</span>
              </li>
              <li v-if="Object.keys(store.submitConfig.fieldMappings || {}).length < store.editorFields.length" class="text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <span>• Map all form fields</span>
              </li>
              <li v-if="store.submitConfig.primaryOutcome && Object.keys(store.submitConfig.fieldMappings || {}).length >= store.editorFields.length" class="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                <Check class="w-3.5 h-3.5" /> All setup requirements complete
              </li>
            </ul>
          </div>

        </aside>

      </div>

      <!-- ═══════════════════════════════════════════════
           TAB 5: SHARE (SHARE & EMBED WITH STATUS & PREVIEW MATCHING DESIGN)
      ════════════════════════════════════════════════ -->
      <div v-else-if="store.editorTab === 'Share'" class="h-full grid grid-cols-1 lg:grid-cols-12 divide-x divide-border overflow-hidden">
        
        <!-- LEFT / MAIN SECTION: SHARE & EMBED CONFIGURATION -->
        <main class="lg:col-span-8 p-6 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/60">
          
          <div class="max-w-3xl mx-auto space-y-6">
            <!-- PAGE HEADER -->
            <div class="space-y-1">
              <h2 class="text-2xl font-extrabold text-foreground tracking-tight">Share & Embed</h2>
              <p class="text-xs text-muted-foreground">Get the link or embed code to distribute your form.</p>
            </div>

            <!-- PUBLISH DRAFT WARNING BANNER (Matching Mockup) -->
            <div v-if="store.activeForm?.status === 'Draft'" class="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-5 rounded-2xl flex items-start gap-4 shadow-xs">
              <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle class="w-5 h-5" />
              </div>
              <div class="space-y-2 text-xs flex-1">
                <div>
                  <h4 class="font-extrabold text-sm text-amber-900 dark:text-amber-300">Publish before sharing</h4>
                  <p class="text-amber-800 dark:text-amber-400 mt-0.5 leading-relaxed">
                    This form is still in draft. Publish it before sharing with your audience.
                  </p>
                </div>
                <Button size="sm" @click="handlePublish" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-8 px-4 rounded-xl shadow-xs cursor-pointer">
                  Publish Form
                </Button>
              </div>
            </div>

            <!-- BLOCK 1: STANDALONE LINK (Matching Mockup) -->
            <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Globe class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="font-bold text-sm text-foreground">Standalone link</h3>
                  <p class="text-xs text-muted-foreground">Use this link to share the form directly.</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Input readonly :value="shareUrl" class="font-mono text-xs bg-gray-50/80 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 h-10 rounded-xl" />
                
                <Button variant="outline" size="sm" @click="copyCode(shareUrl, 'link')" class="h-10 px-4 font-bold text-xs gap-1.5 rounded-xl border-border/80 cursor-pointer">
                  <Copy class="w-3.5 h-3.5" />
                  {{ copySuccessMsg === 'link' ? 'Copied!' : 'Copy' }}
                </Button>

                <a :href="shareUrl" target="_blank" class="h-10 w-10 border border-border/80 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0">
                  <ExternalLink class="w-4 h-4" />
                </a>
              </div>
            </div>

            <!-- BLOCK 2: IFRAME EMBED (Matching Mockup) -->
            <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Code class="w-4 h-4" />
                  </div>
                  <div>
                    <h3 class="font-bold text-sm text-foreground">iFrame embed</h3>
                    <p class="text-xs text-muted-foreground">Paste this snippet into your website where you want the form to appear.</p>
                  </div>
                </div>

                <!-- WIDTH & HEIGHT CONTROLS -->
                <div class="flex items-center gap-3 text-xs shrink-0">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] font-extrabold text-muted-foreground uppercase">WIDTH</span>
                    <Input v-model="iframeWidth" class="w-16 h-8 text-xs font-mono text-center bg-gray-50/80 dark:bg-zinc-950" />
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] font-extrabold text-muted-foreground uppercase">HEIGHT</span>
                    <Input v-model="iframeHeight" class="w-16 h-8 text-xs font-mono text-center bg-gray-50/80 dark:bg-zinc-950" />
                  </div>
                </div>
              </div>

            <!-- CODE SNIPPET BOX -->
            <div class="relative bg-zinc-950 text-zinc-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-zinc-800">
              <Button
                size="xs"
                @click="copyCode(dynamicIframeSnippet, 'iframe')"
                class="absolute right-3 top-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-[11px] gap-1 px-3 py-1 rounded-lg cursor-pointer z-10"
              >
                <Copy class="w-3 h-3" />
                {{ copySuccessMsg === 'iframe' ? 'Copied!' : 'Copy Code' }}
              </Button>

              <pre class="pr-24 leading-relaxed text-zinc-300">{{ dynamicIframeSnippet }}</pre>
            </div>

            <p class="text-[11px] text-muted-foreground italic">
              * The iFrame method is recommended for most websites. It ensures the form styling remains consistent regardless of your site's CSS.
            </p>
          </div>

          <!-- BLOCK 3: ADDITIONAL EMBED MODES (JS POPUP & RAW HTML FROM C2) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-5 shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-emerald-600" />
                  <span class="font-bold text-xs text-foreground">JS Popup Modal</span>
                </div>
                <Button size="xs" variant="outline" @click="copyCode(jsPopupSnippet, 'js')" class="text-[11px] font-semibold cursor-pointer">
                  {{ copySuccessMsg === 'js' ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
              <pre class="p-3 bg-zinc-950 text-zinc-300 rounded-xl font-mono text-[10px] overflow-x-auto">{{ jsPopupSnippet }}</pre>
            </div>

            <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-5 shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <FileCode class="w-4 h-4 text-emerald-600" />
                  <span class="font-bold text-xs text-foreground">Raw HTML Export</span>
                </div>
                <Button size="xs" variant="outline" @click="copyCode(rawHtmlSnippet, 'raw')" class="text-[11px] font-semibold cursor-pointer">
                  {{ copySuccessMsg === 'raw' ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
              <pre class="p-3 bg-zinc-950 text-zinc-300 rounded-xl font-mono text-[10px] overflow-x-auto max-h-24">{{ rawHtmlSnippet }}</pre>
            </div>
          </div>

          <!-- BLOCK 4: SHARING GUIDANCE (Matching Mockup) -->
          <div class="bg-gray-50/70 dark:bg-zinc-950 border border-border/60 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <span class="font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" /> Form Updates
              </span>
              <p class="text-muted-foreground text-[11px] leading-relaxed">
                Changes made in the editor update automatically across all share links and embeds once published.
              </p>
            </div>

            <div class="space-y-1">
              <span class="font-bold text-foreground flex items-center gap-2">
                <Monitor class="w-4 h-4 text-emerald-600" /> Responsive Design
              </span>
              <p class="text-muted-foreground text-[11px] leading-relaxed">
                Your form is fully responsive. The iFrame will adapt to different screen sizes within its container.
              </p>
            </div>
          </div>

        </div>

      </main>

        <!-- RIGHT SIDEBAR: STATUS & PREVIEW (Matching Mockup) -->
        <aside class="lg:col-span-4 p-5 overflow-y-auto space-y-5 bg-card">
          
          <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">STATUS & PREVIEW</span>

          <!-- STATUS SUMMARY CARD -->
          <div class="bg-muted/40 border border-border/70 rounded-2xl p-4 space-y-3 text-xs">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block border-b border-border/60 pb-2">
              STATUS SUMMARY
            </span>

            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground font-semibold">Form Status</span>
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-muted-foreground">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  {{ store.activeForm?.status || 'Draft' }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase text-muted-foreground">LAST PUBLISHED</span>
                <span class="font-semibold text-foreground">
                  {{ store.activeForm?.status === 'Published' ? store.activeForm?.lastUpdated : 'Not published' }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-border/60">
                <span class="font-semibold text-foreground">Sharing Active</span>
                <span v-if="store.activeForm?.status === 'Published'" class="text-emerald-600 font-bold flex items-center gap-1">
                  <Check class="w-3.5 h-3.5" /> Yes
                </span>
                <span v-else class="text-muted-foreground font-medium flex items-center gap-1">
                  <X class="w-3.5 h-3.5" /> No
                </span>
              </div>
            </div>
          </div>

          <!-- DISTRIBUTION NOTES -->
          <div class="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl space-y-1.5 text-xs text-blue-900 dark:text-blue-300">
            <span class="text-[10px] font-extrabold uppercase tracking-wider block">DISTRIBUTION NOTES</span>
            <p class="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300 font-medium">
              Draft forms should be published before sharing to ensure all elements are visible to respondents.
            </p>
          </div>

          <!-- LIVE PREVIEW CARD -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">LIVE PREVIEW</span>
              <Badge variant="outline" class="text-[9px] font-bold">
                <Monitor class="w-3 h-3 mr-1" /> Desktop
              </Badge>
            </div>

            <div class="bg-white dark:bg-zinc-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-sm text-left space-y-3">
              <h4 class="font-extrabold text-sm text-foreground">{{ store.activeForm?.name || 'Contact Us' }}</h4>
              
              <div class="space-y-2">
                <div class="h-6 w-full rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"></div>
                <div class="h-6 w-full rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"></div>
                <div class="w-full bg-emerald-500 text-white font-bold rounded-lg py-1.5 text-center text-[10px] shadow-xs">
                  Submit
                </div>
              </div>
            </div>
          </div>

        </aside>

      </div>

      <!-- ═══════════════════════════════════════════════
           TAB 6: SETTINGS (FORM SETTINGS MATCHING DESIGN MOCKUP)
      ════════════════════════════════════════════════ -->
      <div v-else-if="store.editorTab === 'Settings'" class="h-full grid grid-cols-1 lg:grid-cols-12 divide-x divide-border overflow-hidden">
        
        <!-- CENTER / MAIN SECTION: FORM CONFIGURATION -->
        <main class="lg:col-span-8 p-6 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/60">
          
          <div class="max-w-3xl mx-auto space-y-6">
            <!-- PAGE HEADER -->
            <div class="space-y-1">
              <h2 class="text-2xl font-extrabold text-foreground tracking-tight">Form Settings</h2>
              <p class="text-xs text-muted-foreground">Manage metadata, ownership, and administrative lifecycle actions.</p>
            </div>

            <!-- CARD 1: FORM DETAILS (Matching Mockup) -->
            <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 class="font-bold text-sm text-foreground">Form Details</h3>

              <!-- Internal Form Name -->
              <div class="space-y-1">
                <label class="block text-xs font-bold text-foreground">
                  Internal Form Name <span class="text-destructive">*</span>
                </label>
                <p class="text-[11px] text-muted-foreground">Used by team members inside RakanSales. Does not change the public title.</p>
                <Input v-if="store.activeForm" v-model="store.activeForm.name" class="h-10 text-xs bg-gray-50/80 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl" />
              </div>

              <!-- Description -->
              <div class="space-y-1">
                <label class="block text-xs font-bold text-foreground">Description</label>
                <Textarea v-if="store.activeForm" v-model="store.activeForm.description" rows="3" class="text-xs bg-gray-50/80 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl" />
              </div>

              <!-- Tags -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-foreground">Tags</label>
                <div class="flex items-center gap-2 p-2 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl min-h-[42px] flex-wrap">
                  <span
                    v-for="t in store.activeForm?.tags || ['General']"
                    :key="t"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 border border-border/80 text-foreground shadow-2xs"
                  >
                    {{ getLabel(t) }}
                    <button @click="removeTag(t)" class="text-muted-foreground hover:text-foreground cursor-pointer">
                      <X class="w-3 h-3" />
                    </button>
                  </span>

                  <input
                    v-model="tagInput"
                    @keydown.enter.prevent="addTag"
                    placeholder="Add tag and press Enter..."
                    class="flex-1 min-w-[140px] bg-transparent text-xs outline-none px-1 text-foreground placeholder:text-muted-foreground"
                  />

                  <button @click="addTag" class="p-1 rounded-lg hover:bg-muted text-emerald-600 dark:text-emerald-400 cursor-pointer">
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            <!-- CARD 2: OWNERSHIP & CLASSIFICATION (Matching Mockup) -->
            <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 class="font-bold text-sm text-foreground">Ownership & Classification</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="space-y-1.5">
                  <label class="block font-bold text-foreground">Department</label>
                  <select v-if="store.activeForm" v-model="store.activeForm.department" class="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="General">General</option>
                    <option value="Product">Product</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="block font-bold text-foreground">Owner</label>
                  <select v-if="store.activeForm" v-model="store.activeForm.owner" class="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="Alex Rivera">Alex Rivera</option>
                    <option value="Sam Chen">Sam Chen</option>
                    <option value="Jordan Smith">Jordan Smith</option>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- CARD 3: TEMPLATE & DUPLICATE ACTIONS (Matching Mockup) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <!-- SAVE AS TEMPLATE -->
              <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-sm text-foreground">Save as Template</h4>
                  <p class="text-muted-foreground text-[11px] mt-0.5">Convert this form into a reusable starting point.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  @click="handleSaveTemplate"
                  class="w-full font-bold text-xs h-9 rounded-xl border-border/80 gap-1.5 cursor-pointer"
                >
                  <Layers class="w-3.5 h-3.5" />
                  Save as Template
                </Button>
              </div>

              <!-- DUPLICATE FORM -->
              <div class="bg-white dark:bg-zinc-900 border border-border/70 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-sm text-foreground">Duplicate Form</h4>
                  <p class="text-muted-foreground text-[11px] mt-0.5">Create a new independent draft with copied structure, logic, and style.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  @click="handleDuplicateForm"
                  class="w-full font-bold text-xs h-9 rounded-xl border-border/80 gap-1.5 cursor-pointer"
                >
                  <Copy class="w-3.5 h-3.5" />
                  Duplicate Form
                </Button>
              </div>
            </div>

            <!-- CARD 4: DANGER ZONE (Matching Mockup) -->
            <div class="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900/50 border-l-4 border-l-rose-500 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
              <div>
                <h4 class="font-extrabold text-sm text-rose-600 dark:text-rose-400">Lifecycle Actions (Danger Zone)</h4>
                <p class="text-muted-foreground text-[11px] mt-0.5">These are administrative actions that affect the availability of the form.</p>
              </div>

              <!-- ARCHIVE FORM -->
              <div class="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-gray-50/50 dark:bg-zinc-950">
                <div>
                  <span class="font-bold text-foreground block text-xs">Archive Form</span>
                  <span class="text-[11px] text-muted-foreground">Remove from active workflows. History is preserved.</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  @click="handleArchiveForm"
                  class="font-bold text-xs h-8 px-4 rounded-xl border-border/80 gap-1.5 cursor-pointer"
                >
                  <Archive class="w-3.5 h-3.5" />
                  Archive
                </Button>
              </div>

              <!-- MOVE TO TRASH -->
              <div class="flex items-center justify-between p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60">
                <div>
                  <span class="font-bold text-rose-900 dark:text-rose-300 block text-xs">Move to Trash</span>
                  <span class="text-[11px] text-rose-700 dark:text-rose-400">Move this form to trash. Intended for removal.</span>
                </div>
                <Button
                  size="sm"
                  @click="handleMoveToTrash"
                  class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-8 px-4 rounded-xl shadow-xs gap-1.5 cursor-pointer border-0"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                  Move to Trash
                </Button>
              </div>
            </div>

          </div>

        </main>

        <!-- RIGHT SIDEBAR: STATUS & CONTEXT (Matching Mockup) -->
        <aside class="lg:col-span-4 p-5 overflow-y-auto space-y-5 bg-card">
          
          <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">STATUS & CONTEXT</span>

          <!-- FORM STATUS SUMMARY CARD -->
          <div class="bg-muted/40 border border-border/70 rounded-2xl p-4 space-y-3 text-xs">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block border-b border-border/60 pb-2">
              FORM STATUS SUMMARY
            </span>

            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground font-semibold">Status</span>
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-muted-foreground">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  {{ store.activeForm?.status || 'Draft' }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground font-semibold">Owner</span>
                <span class="font-semibold text-foreground">{{ store.activeForm?.owner || 'Alex Rivera' }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground font-semibold">Department</span>
                <span class="font-semibold text-foreground">{{ store.activeForm?.department || 'General' }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground font-semibold">Last Updated</span>
                <span class="font-semibold text-foreground">{{ store.activeForm?.lastUpdated || 'Just now' }}</span>
              </div>
            </div>
          </div>

          <!-- ADMINISTRATIVE NOTES CARD -->
          <div class="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl space-y-2.5 text-xs text-blue-900 dark:text-blue-300">
            <span class="text-[10px] font-extrabold uppercase tracking-wider block">ADMINISTRATIVE NOTES</span>
            
            <div class="space-y-2 text-[11px] leading-relaxed">
              <div class="flex items-start gap-2">
                <Info class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p>Internal naming does not affect the public title shown in the Build tab.</p>
              </div>
              <div class="flex items-start gap-2">
                <Layers class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p>Templates saved from this form remain independent; future changes to this form won't update the template.</p>
              </div>
            </div>
          </div>

          <!-- PERMISSIONS CARD -->
          <div class="bg-muted/40 border border-border/70 rounded-2xl p-4 space-y-2 text-xs">
            <span class="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block border-b border-border/60 pb-2">
              PERMISSIONS
            </span>

            <div class="space-y-1">
              <span class="text-[11px] font-bold text-muted-foreground block">Who can manage this form?</span>
              <ul class="space-y-1 text-[11px] font-semibold text-foreground pl-1">
                <li class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span>• Admins</span>
                </li>
                <li class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span>• Form Owners</span>
                </li>
                <li class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span>• Marketing Leads</span>
                </li>
              </ul>
            </div>
          </div>

        </aside>

      </div>
    </div>
  </div>
</template>
