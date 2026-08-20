<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWebFormsStore, CATEGORIES, DEPARTMENTS, OWNERS, getLabel } from '@/stores/webforms'
import type { FormTemplate } from '@/types/webforms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Layers,
  MoreHorizontal,
  Check,
  ChevronLeft,
  ArrowUpDown,
  FileText,
  Building2,
  UserCheck,
  Tag as TagIcon,
  Trash2,
  Edit2,
  Copy,
  Archive,
  Filter,
  ArrowLeft
} from 'lucide-vue-next'

const router = useRouter()
const store = useWebFormsStore()

const activeView = ref<'Active' | 'Drafts' | 'Archived'>('Active')
const stateFilter = ref<'All' | 'Published' | 'Unpublished'>('All')
const categoryFilter = ref<string>('All')
const tabFilter = ref<'All templates' | 'My templates'>('All templates')
const searchQuery = ref<string>('')
const sortBy = ref<'Last updated' | 'Name'>('Last updated')

const selectedTemplateIds = ref<string[]>([])
const isCreateTemplateModalOpen = ref(false)

const newTempName = ref('')
const newTempCat = ref('General')
const newTempDept = ref('Product')

// Template list mapped with governance fields
const templateList = computed(() => {
  return store.templates.map(t => ({
    ...t,
    state: t.state || (t.id === 'contact' || t.id === 'demo' || t.id === 'lead' ? 'Published' : t.id === 'feedback' ? 'Draft' : 'Unpublished'),
    department: t.department || (t.category === 'Support' ? 'Customer Success' : t.category === 'Marketing' ? 'Marketing' : 'Product'),
    owner: t.owner || 'Alex Rivera',
    lastUpdated: t.lastUpdated || '2026-04-28'
  }))
})

const filteredTemplates = computed(() => {
  return templateList.value.filter(t => {
    // View filter
    if (activeView.value === 'Drafts' && t.state !== 'Draft') return false
    if (activeView.value === 'Archived' && t.state !== 'Archived') return false
    if (activeView.value === 'Active' && t.state === 'Archived') return false

    // State filter
    if (stateFilter.value === 'Published' && t.state !== 'Published') return false
    if (stateFilter.value === 'Unpublished' && t.state !== 'Unpublished') return false

    // Category filter
    if (categoryFilter.value !== 'All' && t.category !== categoryFilter.value) return false

    // Tab filter
    if (tabFilter.value === 'My templates' && t.owner !== 'Alex Rivera') return false

    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchName = t.name.toLowerCase().includes(q)
      const matchCat = t.category.toLowerCase().includes(q)
      const matchDept = t.department.toLowerCase().includes(q)
      const matchOwner = t.owner.toLowerCase().includes(q)
      if (!matchName && !matchCat && !matchDept && !matchOwner) return false
    }

    return true
  }).sort((a, b) => {
    if (sortBy.value === 'Name') return a.name.localeCompare(b.name)
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  })
})

const publishedCount = computed(() => templateList.value.filter(t => t.state === 'Published').length)
const unpublishedCount = computed(() => templateList.value.filter(t => t.state === 'Unpublished').length)
const draftsCount = computed(() => templateList.value.filter(t => t.state === 'Draft').length)

function toggleSelectAll() {
  if (selectedTemplateIds.value.length === filteredTemplates.value.length) {
    selectedTemplateIds.value = []
  } else {
    selectedTemplateIds.value = filteredTemplates.value.map(t => t.id)
  }
}

function toggleSelect(id: string) {
  if (selectedTemplateIds.value.includes(id)) {
    selectedTemplateIds.value = selectedTemplateIds.value.filter(i => i !== id)
  } else {
    selectedTemplateIds.value.push(id)
  }
}

function handleUseTemplate(templateId: string) {
  const newForm = store.createFormFromTemplate(templateId)
  router.push(`/web-forms/builder/${newForm.id}`)
}

function handleCreateNewTemplate() {
  if (!newTempName.value.trim()) return
  const created = store.cloneFormToTemplate({
    id: `custom-${Date.now()}`,
    name: newTempName.value,
    status: 'Draft',
    lastUpdated: new Date().toISOString().split('T')[0],
    views: 0,
    starts: 0,
    submissions: 0,
    tags: ['Custom'],
    department: newTempDept.value,
    owner: 'Alex Rivera',
    starred: false,
    description: 'Custom web form blueprint.'
  })
  created.category = newTempCat.value
  isCreateTemplateModalOpen.value = false
  newTempName.value = ''
}
</script>

<template>
  <div class="space-y-6 text-foreground">
    
    <!-- TOP PAGE HEADER (Matching Main Web Forms Styling) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border shadow-xs">
      <div class="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          @click="router.push('/web-forms')"
          class="gap-1.5 font-bold text-xs cursor-pointer hover:bg-muted"
        >
          <ArrowLeft class="w-4 h-4 text-emerald-600" />
          Back to Web Forms
        </Button>

        <div class="h-6 w-px bg-border"></div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Layers class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl font-extrabold tracking-tight text-foreground">Manage Templates</h1>
            <p class="text-xs text-muted-foreground">Create, organize, and publish reusable web form templates</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <Button
          size="sm"
          @click="isCreateTemplateModalOpen = true"
          class="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xs cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Create Template
        </Button>
      </div>
    </div>

    <!-- MAIN BODY GRID (Matching Main Web Forms Layout) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- LEFT SIDEBAR FILTERS (Matching Main Web Forms Styling) -->
      <aside class="lg:col-span-3 space-y-4">
        <div class="bg-card border border-border rounded-2xl p-4 space-y-5 shadow-xs">
          
          <!-- Views Section -->
          <div>
            <h3 class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Views</h3>
            <div class="space-y-1">
              <button
                @click="activeView = 'Active'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  activeView === 'Active' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Layers class="w-4 h-4" />
                  <span>All Active Templates</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ templateList.filter(t => t.state !== 'Archived').length }}
                </Badge>
              </button>

              <button
                @click="activeView = 'Drafts'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  activeView === 'Drafts' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <FileText class="w-4 h-4" />
                  <span>Drafts</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ draftsCount }}
                </Badge>
              </button>

              <button
                @click="activeView = 'Archived'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  activeView === 'Archived' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Archive class="w-4 h-4" />
                  <span>Archived</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  1
                </Badge>
              </button>
            </div>
          </div>

          <!-- Browse By State Section -->
          <div>
            <h3 class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Browse By State</h3>
            <div class="space-y-1">
              <button
                @click="stateFilter = stateFilter === 'Published' ? 'All' : 'Published'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  stateFilter === 'Published' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Check class="w-4 h-4 text-emerald-600" />
                  <span>Published</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ publishedCount }}
                </Badge>
              </button>

              <button
                @click="stateFilter = stateFilter === 'Unpublished' ? 'All' : 'Unpublished'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  stateFilter === 'Unpublished' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Unpublished</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ unpublishedCount }}
                </Badge>
              </button>
            </div>
          </div>

          <!-- Categories Section -->
          <div>
            <h3 class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Categories</h3>
            <div class="space-y-1">
              <button
                v-for="cat in ['General', 'Marketing', 'Sales', 'Support', 'HR / Admin']"
                :key="cat"
                @click="categoryFilter = categoryFilter === cat ? 'All' : cat"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  categoryFilter === cat ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <TagIcon class="w-4 h-4 opacity-70" />
                  <span>{{ cat }}</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </aside>

      <!-- MAIN CONTENT TABLE (Matching Main Web Forms Table) -->
      <main class="lg:col-span-9 space-y-4">
        
        <!-- SEARCH & TOOLBAR (Matching Main Web Forms Controls) -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border shadow-xs">
          
          <div class="relative flex-1 w-full max-w-md">
            <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Search templates by name, tag, owner, or category..."
              class="pl-10 h-10 text-xs bg-muted/50 rounded-xl"
            />
          </div>

          <div class="flex items-center gap-3 flex-wrap w-full sm:w-auto">
            <!-- TAB SWITCHER: ALL TEMPLATES / MY TEMPLATES -->
            <div class="flex items-center bg-muted p-1 rounded-xl">
              <button
                @click="tabFilter = 'All templates'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  tabFilter === 'All templates' ? 'bg-card shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                All templates
              </button>
              <button
                @click="tabFilter = 'My templates'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  tabFilter === 'My templates' ? 'bg-card shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                My templates
              </button>
            </div>
          </div>

        </div>

        <!-- GOVERNANCE DATA TABLE -->
        <div class="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
          <Table>
            <TableHeader class="bg-muted/40">
              <TableRow>
                <TableHead class="w-10">
                  <Checkbox
                    :checked="selectedTemplateIds.length === filteredTemplates.length && filteredTemplates.length > 0"
                    @update:checked="toggleSelectAll"
                  />
                </TableHead>
                <TableHead>Template Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="tpl in filteredTemplates"
                :key="tpl.id"
                class="hover:bg-muted/20 cursor-pointer"
                @click="handleUseTemplate(tpl.id)"
              >
                <TableCell @click.stop>
                  <Checkbox
                    :checked="selectedTemplateIds.includes(tpl.id)"
                    @update:checked="() => toggleSelect(tpl.id)"
                  />
                </TableCell>
                <TableCell>
                  <div class="font-bold text-foreground">{{ tpl.name }}</div>
                  <div class="text-[11px] text-muted-foreground">Updated {{ tpl.lastUpdated }}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    :class="[
                      'text-[10px] font-bold',
                      tpl.state === 'Published' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                    ]"
                  >
                    {{ tpl.state }}
                  </Badge>
                </TableCell>
                <TableCell class="text-xs text-muted-foreground">{{ tpl.category }}</TableCell>
                <TableCell class="text-xs text-muted-foreground">{{ tpl.department }}</TableCell>
                <TableCell class="text-xs font-medium">{{ tpl.owner }}</TableCell>
                <TableCell class="text-right" @click.stop>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8 cursor-pointer">
                        <MoreHorizontal class="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleUseTemplate(tpl.id)" class="cursor-pointer text-xs">
                        <Plus class="w-3.5 h-3.5 mr-2 text-emerald-600" /> Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleUseTemplate(tpl.id)" class="cursor-pointer text-xs">
                        <Copy class="w-3.5 h-3.5 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer text-xs text-destructive">
                        <Trash2 class="w-3.5 h-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredTemplates.length === 0">
                <TableCell colspan="7" class="py-12 text-center text-muted-foreground">
                  <FileText class="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p class="font-medium text-sm">No template blueprints found</p>
                  <p class="text-xs text-muted-foreground mt-1">Try adjusting search query or filters</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

      </main>

    </div>

    <!-- CREATE NEW TEMPLATE MODAL -->
    <Dialog :open="isCreateTemplateModalOpen" @update:open="(val) => isCreateTemplateModalOpen = val">
      <DialogContent class="max-w-md p-6 space-y-4">
        <DialogHeader>
          <DialogTitle class="text-base font-bold">New Form Blueprint Template</DialogTitle>
        </DialogHeader>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-foreground mb-1">Template Name</label>
            <Input v-model="newTempName" placeholder="e.g. Executive Inquiry Intake" class="text-xs" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-foreground mb-1">Category</label>
              <select v-model="newTempCat" class="w-full px-3 py-2 bg-muted border border-input rounded-md text-xs text-foreground">
                <option v-for="c in ['General', 'Marketing', 'Sales', 'Support', 'HR / Admin']" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-foreground mb-1">Department</label>
              <select v-model="newTempDept" class="w-full px-3 py-2 bg-muted border border-input rounded-md text-xs text-foreground">
                <option v-for="d in ['Product', 'Customer Success', 'Marketing', 'Sales']" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter class="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" @click="isCreateTemplateModalOpen = false" class="text-xs">Cancel</Button>
          <Button size="sm" @click="handleCreateNewTemplate" class="bg-primary text-primary-foreground font-bold text-xs">
            Create Blueprint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>
