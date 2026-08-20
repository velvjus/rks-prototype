<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWebFormsStore, DEPARTMENTS, OWNERS, CATEGORIES, PINNED_TAGS, getLabel } from '@/stores/webforms'
import type { Form, AppliedFilters } from '@/types/webforms'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

import {
  Plus,
  Search,
  Filter,
  Star,
  Archive,
  MoreHorizontal,
  Edit2,
  Play,
  Pause,
  Trash2,
  X,
  FileText,
  Layout,
  Check,
  Eye,
  Inbox,
  Sparkles,
  Layers,
  Share2,
  ExternalLink,
  ArrowRight,
  ArrowUpDown,
  Tag as TagIcon,
  ChevronDown
} from 'lucide-vue-next'

const router = useRouter()
const store = useWebFormsStore()

const selectedTemplateId = ref<string>('contact')
const templateSearch = ref<string>('')
const templateCategory = ref<string>('All templates')

// Sorting States (from C2)
const sortBy = ref<'Last updated' | 'Form name' | 'Status' | 'Most submissions' | 'Most views' | 'Highest conversion' | 'Owner'>('Last updated')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Pinned Tags Customization (from C2)
const pinnedTags = ref<string[]>([...PINNED_TAGS])
const isPinDropdownOpen = ref(false)

const filteredTemplates = computed(() => {
  return store.templates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(templateSearch.value.toLowerCase()) ||
                        t.description.toLowerCase().includes(templateSearch.value.toLowerCase())
    const matchCategory = templateCategory.value === 'All templates' || t.category === templateCategory.value
    return matchSearch && matchCategory
  })
})

const currentTemplate = computed(() => {
  return store.templates.find(t => t.id === selectedTemplateId.value) || store.templates[0]
})

// Sorted forms based on C2 sort options
const sortedForms = computed(() => {
  const list = [...store.filteredForms]
  list.sort((a, b) => {
    let valA: any, valB: any
    if (sortBy.value === 'Last updated') {
      valA = new Date(a.lastUpdated).getTime()
      valB = new Date(b.lastUpdated).getTime()
    } else if (sortBy.value === 'Form name') {
      valA = a.name.toLowerCase()
      valB = b.name.toLowerCase()
    } else if (sortBy.value === 'Status') {
      valA = a.status.toLowerCase()
      valB = b.status.toLowerCase()
    } else if (sortBy.value === 'Most submissions') {
      valA = a.submissions
      valB = b.submissions
    } else if (sortBy.value === 'Most views') {
      valA = a.views
      valB = b.views
    } else if (sortBy.value === 'Highest conversion') {
      valA = a.starts > 0 ? a.submissions / a.starts : 0
      valB = b.starts > 0 ? b.submissions / b.starts : 0
    } else if (sortBy.value === 'Owner') {
      valA = a.owner.toLowerCase()
      valB = b.owner.toLowerCase()
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  return list
})

// All available tags across all forms
const allAvailableTags = computed(() => {
  const set = new Set<string>([...PINNED_TAGS])
  store.forms.forEach(f => f.tags.forEach(t => set.add(t)))
  return Array.from(set)
})

// Computed array for active filters
const activeFiltersList = computed(() => {
  const list: { key: keyof AppliedFilters; label: string; value: string }[] = []
  if (store.appliedFilters.status) {
    list.push({ key: 'status', label: 'Status', value: getLabel(store.appliedFilters.status) })
  }
  if (store.appliedFilters.owner) {
    list.push({ key: 'owner', label: 'Owner', value: getLabel(store.appliedFilters.owner) })
  }
  if (store.appliedFilters.department) {
    list.push({ key: 'department', label: 'Department', value: getLabel(store.appliedFilters.department) })
  }
  if (store.appliedFilters.tag) {
    list.push({ key: 'tag', label: 'Tag', value: getLabel(store.appliedFilters.tag) })
  }
  if (store.appliedFilters.dateRange && store.appliedFilters.dateRange !== 'all') {
    const valLabel = store.appliedFilters.dateRange === 'week' ? 'Past 7 Days' : 'Past 30 Days'
    list.push({ key: 'dateRange', label: 'Date Range', value: valLabel })
  }
  return list
})

function handleCreateForm() {
  const newForm = store.createFormFromTemplate(selectedTemplateId.value)
  store.isCreateModalOpen = false
  router.push(`/web-forms/builder/${newForm.id}`)
}

function handleViewFormDetail(form: Form) {
  store.setFormToEdit(form.id)
  router.push(`/web-forms/detail/${form.id}`)
}

function handleEditForm(form: Form) {
  store.setFormToEdit(form.id)
  router.push(`/web-forms/builder/${form.id}`)
}

function handleViewSubmissions(form: Form) {
  router.push(`/web-forms/submissions?formId=${form.id}`)
}

function togglePinTag(tag: string) {
  if (pinnedTags.value.includes(tag)) {
    pinnedTags.value = pinnedTags.value.filter(t => t !== tag)
  } else {
    pinnedTags.value.push(tag)
  }
}

function getStatusBadgeClass(status: Form['status']) {
  switch (status) {
    case 'Published':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'Paused':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Archived':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  }
}
</script>

<template>
  <div class="space-y-6 text-foreground">
    <!-- TOP HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border shadow-xs">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <FileText class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-xl font-extrabold tracking-tight text-foreground">Web Forms</h1>
          <p class="text-xs text-muted-foreground">Design, build, map CRM lead outcomes, and publish web capture forms</p>
        </div>
      </div>

      <!-- Quick Nav Links & CTA -->
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex items-center bg-muted p-1 rounded-xl">
          <button
            @click="store.activeTab = 'All active'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
              store.activeTab === 'All active' ? 'bg-card shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            All active
          </button>
          <button
            @click="store.activeTab = 'My forms'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
              store.activeTab === 'My forms' ? 'bg-card shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            My forms
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          @click="router.push('/web-forms/templates')"
          class="gap-1.5 cursor-pointer text-xs font-semibold"
        >
          <Layers class="w-3.5 h-3.5" />
          Templates
        </Button>

        <Button
          size="sm"
          @click="store.isCreateModalOpen = true"
          class="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xs cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Create Form
        </Button>
      </div>
    </div>

    <!-- MAIN BODY GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- SIDEBAR FILTERS -->
      <aside class="lg:col-span-3 space-y-4">
        <div class="bg-card border border-border rounded-2xl p-4 space-y-5 shadow-xs">
          <!-- Views Section -->
          <div>
            <h3 class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Views</h3>
            <div class="space-y-1">
              <button
                @click="store.activeView = 'Active'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.activeView === 'Active' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Layout class="w-4 h-4" />
                  <span>All Active Forms</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ store.counts.active }}
                </Badge>
              </button>

              <button
                @click="store.activeView = 'Starred'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.activeView === 'Starred' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Star class="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Starred</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ store.counts.starred }}
                </Badge>
              </button>

              <button
                @click="store.activeView = 'Archived'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.activeView === 'Archived' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Archive class="w-4 h-4" />
                  <span>Archived</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ store.counts.archived }}
                </Badge>
              </button>
            </div>
          </div>

          <!-- Status Section -->
          <div>
            <h3 class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Status Filter</h3>
            <div class="space-y-1">
              <button
                @click="store.appliedFilters.status = store.appliedFilters.status === 'Draft' ? null : 'Draft'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.appliedFilters.status === 'Draft' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Edit2 class="w-3.5 h-3.5" />
                  <span>Drafts</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ store.counts.draft }}
                </Badge>
              </button>

              <button
                @click="store.appliedFilters.status = store.appliedFilters.status === 'Published' ? null : 'Published'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.appliedFilters.status === 'Published' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Play class="w-3.5 h-3.5 text-emerald-500" />
                  <span>Published</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ store.counts.published }}
                </Badge>
              </button>

              <button
                @click="store.appliedFilters.status = store.appliedFilters.status === 'Paused' ? null : 'Paused'"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.appliedFilters.status === 'Paused' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <Pause class="w-3.5 h-3.5 text-amber-500" />
                  <span>Paused</span>
                </div>
                <Badge variant="secondary" class="text-[10px] px-2 py-0.5">
                  {{ store.counts.paused }}
                </Badge>
              </button>
            </div>
          </div>

          <!-- Pinned Tags Section (from C2) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pinned Tags</h3>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button class="text-primary hover:text-primary/80 text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Plus class="w-3 h-3" /> Pin
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48 p-2">
                  <div class="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase border-b border-border mb-1">Pin / Unpin Tags</div>
                  <div v-for="tag in allAvailableTags" :key="tag" class="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      :checked="pinnedTags.includes(tag)"
                      @change="togglePinTag(tag)"
                      class="rounded text-primary"
                    />
                    <span>{{ tag }}</span>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div class="space-y-1">
              <button
                v-for="tag in pinnedTags"
                :key="tag"
                @click="store.appliedFilters.tag = store.appliedFilters.tag === tag ? null : tag"
                :class="[
                  'w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.appliedFilters.tag === tag ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <span class="flex items-center gap-2">
                  <TagIcon class="w-3 h-3" /> {{ tag }}
                </span>
              </button>
            </div>
          </div>

          <!-- Department Section -->
          <div>
            <h3 class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Departments</h3>
            <div class="space-y-1">
              <button
                v-for="dept in DEPARTMENTS"
                :key="getLabel(dept)"
                @click="store.appliedFilters.department = store.appliedFilters.department === dept ? null : dept"
                :class="[
                  'w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  store.appliedFilters.department === dept ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
              >
                <span class="truncate">{{ getLabel(dept) }}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- TABLE AREA -->
      <main class="lg:col-span-9 space-y-4">
        <!-- SEARCH & SORT CONTROLS -->
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="relative flex-1 max-w-lg min-w-[240px]">
            <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="store.searchQuery"
              placeholder="Search forms by title, owner, or tags..."
              class="pl-10 text-xs bg-card"
            />
          </div>

          <!-- Sort Dropdown (from C2) -->
          <div class="flex items-center gap-2">
            <div class="flex items-center bg-card border border-border rounded-md px-2 py-1">
              <ArrowUpDown class="w-3.5 h-3.5 text-muted-foreground mr-1.5" />
              <select v-model="sortBy" class="bg-transparent text-xs text-foreground font-medium focus:outline-none cursor-pointer">
                <option value="Last updated">Sort: Last updated</option>
                <option value="Form name">Sort: Form name</option>
                <option value="Status">Sort: Status</option>
                <option value="Most submissions">Sort: Most submissions</option>
                <option value="Most views">Sort: Most views</option>
                <option value="Highest conversion">Sort: Highest conversion</option>
                <option value="Owner">Sort: Owner</option>
              </select>
              <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="ml-1 text-muted-foreground hover:text-foreground">
                <span class="text-[10px] font-bold uppercase">{{ sortOrder }}</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              @click="store.isFilterModalOpen = true"
              class="gap-2 cursor-pointer text-xs font-semibold bg-card"
            >
              <Filter class="w-3.5 h-3.5 text-muted-foreground" />
              Filters
              <Badge v-if="activeFiltersList.length > 0" variant="default" class="w-4 h-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                {{ activeFiltersList.length }}
              </Badge>
            </Button>
          </div>
        </div>

        <!-- ACTIVE FILTER TAGS -->
        <div v-if="activeFiltersList.length > 0" class="flex flex-wrap items-center gap-2">
          <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active:</span>
          <Badge
            v-for="item in activeFiltersList"
            :key="item.key"
            variant="secondary"
            class="gap-1.5 text-xs py-1 px-2.5 font-medium"
          >
            <span class="text-muted-foreground capitalize">{{ item.label }}:</span>
            <span class="font-semibold">{{ item.value }}</span>
            <button @click="store.removeFilter(item.key)" class="hover:text-destructive cursor-pointer ml-1">
              <X class="w-3 h-3" />
            </button>
          </Badge>

          <button @click="store.resetFilters" class="text-xs font-semibold text-primary hover:underline px-2 cursor-pointer">
            Clear All
          </button>
        </div>

        <!-- FORMS DATA TABLE -->
        <div class="bg-card border border-border rounded-2xl shadow-xs overflow-hidden relative">
          <!-- FLOATING BULK TOOLBAR -->
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="-translate-y-4 opacity-0" enter-to-class="translate-y-0 opacity-100">
            <div
              v-if="store.selectedIds.length > 0"
              class="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-950 text-white px-5 py-2.5 rounded-2xl shadow-2xl z-30 flex items-center gap-4 border border-gray-800"
            >
              <span class="text-xs font-bold">{{ store.selectedIds.length }} Selected</span>
              <div class="h-4 w-px bg-gray-800"></div>
              <div class="flex items-center gap-2">
                <Button size="xs" variant="default" @click="store.updateStatus(store.selectedIds, 'Published')" class="bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                  Publish
                </Button>
                <Button size="xs" variant="secondary" @click="store.updateStatus(store.selectedIds, 'Paused')" class="bg-amber-600 hover:bg-amber-500 text-white cursor-pointer">
                  Pause
                </Button>
                <Button size="xs" variant="outline" @click="store.updateStatus(store.selectedIds, 'Archived')" class="border-gray-700 text-gray-300 hover:text-white cursor-pointer">
                  Archive
                </Button>
                <Button size="xs" variant="destructive" @click="store.deleteForms(store.selectedIds)" class="cursor-pointer">
                  Delete
                </Button>
              </div>
              <button @click="store.selectedIds = []" class="text-gray-400 hover:text-white cursor-pointer ml-2">
                <X class="w-4 h-4" />
              </button>
            </div>
          </transition>

          <Table>
            <TableHeader class="bg-muted/40">
              <TableRow class="hover:bg-transparent">
                <TableHead class="w-10">
                  <Checkbox
                    :checked="store.selectedIds.length === sortedForms.length && sortedForms.length > 0"
                    @update:checked="(checked: boolean) => store.toggleSelectAll(checked)"
                  />
                </TableHead>
                <TableHead class="w-8"></TableHead>
                <TableHead>Form Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead class="text-right">Views</TableHead>
                <TableHead class="text-right">Submissions</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead class="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="form in sortedForms"
                :key="form.id"
                class="hover:bg-muted/30 transition-colors cursor-pointer"
                @click="handleViewFormDetail(form)"
              >
                <TableCell @click.stop>
                  <Checkbox
                    :checked="store.selectedIds.includes(form.id)"
                    @update:checked="() => store.toggleSelect(form.id)"
                  />
                </TableCell>

                <TableCell @click.stop>
                  <button
                    @click="store.toggleStar(form.id)"
                    class="text-gray-300 dark:text-gray-600 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Star
                      :class="['w-4 h-4', form.starred ? 'text-amber-400 fill-amber-400' : '']"
                    />
                  </button>
                </TableCell>

                <TableCell class="font-medium">
                  <div class="flex flex-col">
                    <span class="hover:text-primary transition-colors font-bold text-foreground text-xs">
                      {{ form.name }}
                    </span>
                    <div class="flex items-center gap-1.5 mt-1">
                      <Badge
                        v-for="tag in form.tags"
                        :key="getLabel(tag)"
                        variant="secondary"
                        class="text-[10px] px-1.5 py-0 font-normal"
                      >
                        {{ getLabel(tag) }}
                      </Badge>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    :class="['text-[11px] font-medium border', getStatusBadgeClass(form.status)]"
                  >
                    {{ form.status }}
                  </Badge>
                </TableCell>

                <TableCell class="text-muted-foreground text-xs">
                  {{ getLabel(form.department) }}
                </TableCell>

                <TableCell class="text-right font-mono text-xs text-muted-foreground">
                  {{ form.views.toLocaleString() }}
                </TableCell>

                <TableCell class="text-right font-mono text-xs font-bold text-foreground">
                  {{ form.submissions.toLocaleString() }}
                </TableCell>

                <TableCell class="text-muted-foreground text-xs">
                  {{ form.lastUpdated }}
                </TableCell>

                <TableCell class="text-muted-foreground text-xs">
                  {{ form.owner }}
                </TableCell>

                <TableCell class="text-right" @click.stop>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer">
                        <MoreHorizontal class="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-44">
                      <DropdownMenuItem @click="handleViewFormDetail(form)" class="cursor-pointer text-xs">
                        <Eye class="w-3.5 h-3.5 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleEditForm(form)" class="cursor-pointer text-xs">
                        <Edit2 class="w-3.5 h-3.5 mr-2" /> Edit Builder
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleViewSubmissions(form)" class="cursor-pointer text-xs">
                        <Inbox class="w-3.5 h-3.5 mr-2" /> View Submissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem v-if="form.status !== 'Published'" @click="store.updateStatus([form.id], 'Published')" class="cursor-pointer text-xs text-emerald-600">
                        <Play class="w-3.5 h-3.5 mr-2" /> Publish Form
                      </DropdownMenuItem>
                      <DropdownMenuItem v-if="form.status === 'Published'" @click="store.updateStatus([form.id], 'Paused')" class="cursor-pointer text-xs text-amber-600">
                        <Pause class="w-3.5 h-3.5 mr-2" /> Pause Form
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="store.deleteForms([form.id])" class="cursor-pointer text-xs text-destructive">
                        <Trash2 class="w-3.5 h-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <TableRow v-if="sortedForms.length === 0">
                <TableCell colspan="10" class="py-12 text-center text-muted-foreground">
                  <FileText class="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p class="font-medium text-sm">No web forms found</p>
                  <p class="text-xs text-muted-foreground mt-1">Try adjusting search query or status filters</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </main>
    </div>

    <!-- CREATE FORM DIALOG MATCHING DESIGN MOCKUP -->
    <Dialog :open="store.isCreateModalOpen" @update:open="(val) => store.isCreateModalOpen = val">
      <DialogContent class="max-w-5xl max-h-[90vh] h-[620px] flex flex-col p-0 overflow-hidden border-border/60 rounded-2xl shadow-2xl bg-card">
        <!-- HEADER (Optimized Padding) -->
        <DialogHeader class="px-6 py-4 border-b border-border/70 text-left shrink-0">
          <DialogTitle class="text-xl font-extrabold tracking-tight text-foreground">
            Create New Web Form
          </DialogTitle>
          <DialogDescription class="text-xs text-muted-foreground mt-0.5 font-normal">
            Start from a blank form or choose a template.
          </DialogDescription>
        </DialogHeader>

        <!-- MAIN SPLIT CONTENT -->
        <div class="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 divide-x divide-border/70 overflow-hidden">
          
          <!-- LEFT SIDE: TEMPLATES LIST & FILTERS (7 cols) -->
          <div class="md:col-span-7 p-5 overflow-y-auto space-y-3.5 bg-card flex flex-col min-h-0">
            
            <!-- SEARCH INPUT -->
            <div class="relative">
              <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="templateSearch"
                placeholder="Search templates..."
                class="pl-10 h-9 text-xs bg-background border-border/80 rounded-xl shadow-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              />
            </div>

            <!-- CATEGORY FILTER PILLS -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
              <button
                v-for="cat in CATEGORIES"
                :key="getLabel(cat)"
                @click="templateCategory = cat"
                :class="[
                  'px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                  templateCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                ]"
              >
                {{ getLabel(cat) }}
              </button>
            </div>

            <!-- TEMPLATE CARDS GRID (2 Columns) -->
            <div class="grid grid-cols-2 gap-3 pt-1 overflow-y-auto pr-1 flex-1">
              <div
                v-for="tpl in filteredTemplates"
                :key="tpl.id"
                @click="selectedTemplateId = tpl.id"
                :class="[
                  'p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-start space-y-3 relative text-left group',
                  selectedTemplateId === tpl.id
                    ? 'border-2 border-emerald-500 bg-white dark:bg-zinc-900 shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-border/70 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
                ]"
              >
                <!-- ICON CONTAINER -->
                <div
                  :class="[
                    'w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0',
                    selectedTemplateId === tpl.id
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  ]"
                >
                  <Plus v-if="tpl.id === 'blank'" class="w-4 h-4 stroke-[2.5]" />
                  <FileText v-else class="w-4 h-4 stroke-[2]" />
                </div>

                <!-- CARD TITLE & SUBTITLE -->
                <div>
                  <h4 class="font-bold text-xs text-foreground tracking-tight leading-snug">{{ tpl.name }}</h4>
                  <p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{{ tpl.description }}</p>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT SIDE: LIVE TEMPLATE PREVIEW & STICKY CTA (5 cols) -->
          <div class="md:col-span-5 p-5 bg-slate-50/70 dark:bg-zinc-950/60 flex flex-col justify-between overflow-hidden min-h-0">
            
            <!-- PREVIEW CONTAINER WITH OWN SCROLLBAR -->
            <div class="flex-1 flex flex-col min-h-0 overflow-hidden space-y-3">
              <!-- PREVIEW TITLE -->
              <h3 class="font-extrabold text-xs text-foreground tracking-tight shrink-0">
                {{ currentTemplate.name }} Preview
              </h3>

              <!-- SCROLLABLE PREVIEW CARD CONTAINER -->
              <div class="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[360px]">
                <div class="bg-white dark:bg-zinc-900 border border-border/60 rounded-2xl p-4 shadow-xs space-y-3">
                  <div>
                    <h4 class="font-extrabold text-sm text-foreground tracking-tight">{{ currentTemplate.title }}</h4>
                    <p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{{ currentTemplate.intro }}</p>
                  </div>

                  <div class="space-y-2.5 pt-1">
                    <div v-for="fLabel in currentTemplate.fields" :key="getLabel(fLabel)" class="space-y-1">
                      <label class="block text-[10px] font-extrabold tracking-wider uppercase text-muted-foreground/80">
                        {{ getLabel(fLabel) }}
                      </label>
                      <div class="h-8 w-full rounded-lg bg-gray-50/90 dark:bg-zinc-950 border border-gray-200/80 dark:border-zinc-800 px-3 flex items-center">
                        <span class="text-[11px] text-muted-foreground/40 font-mono">Input...</span>
                      </div>
                    </div>

                    <div class="pt-2">
                      <div class="w-full bg-emerald-500 text-white font-bold rounded-xl py-2 text-xs text-center shadow-xs cursor-default">
                        Submit Form
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- BOTTOM STICKY ACTIONS -->
            <div class="pt-3 space-y-1.5 shrink-0 border-t border-border/60 mt-2 bg-slate-50/70 dark:bg-zinc-950/60">
              <Button
                @click="handleCreateForm"
                class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-10 text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {{ currentTemplate.id === 'blank' ? 'Create Blank Form' : 'Use Template' }}
              </Button>
              <button
                @click="store.isCreateModalOpen = false"
                class="w-full text-center text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer block"
              >
                Cancel
              </button>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>

    <!-- FILTER DIALOG -->
    <Dialog :open="store.isFilterModalOpen" @update:open="(val) => store.isFilterModalOpen = val">
      <DialogContent class="max-w-md p-6 space-y-5">
        <DialogHeader>
          <DialogTitle class="text-base font-bold">Filter Web Forms</DialogTitle>
        </DialogHeader>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-foreground mb-1.5">Status</label>
            <select v-model="store.appliedFilters.status" class="w-full px-3 py-2 bg-muted border border-input rounded-md text-xs text-foreground">
              <option :value="null">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-foreground mb-1.5">Owner</label>
            <select v-model="store.appliedFilters.owner" class="w-full px-3 py-2 bg-muted border border-input rounded-md text-xs text-foreground">
              <option :value="null">All Owners</option>
              <option v-for="owner in OWNERS" :key="getLabel(owner)" :value="owner">{{ getLabel(owner) }}</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-foreground mb-1.5">Department</label>
            <select v-model="store.appliedFilters.department" class="w-full px-3 py-2 bg-muted border border-input rounded-md text-xs text-foreground">
              <option :value="null">All Departments</option>
              <option v-for="dept in DEPARTMENTS" :key="getLabel(dept)" :value="dept">{{ getLabel(dept) }}</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-foreground mb-1.5">Date Range</label>
            <select v-model="store.appliedFilters.dateRange" class="w-full px-3 py-2 bg-muted border border-input rounded-md text-xs text-foreground">
              <option value="all">All Time</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
            </select>
          </div>
        </div>

        <DialogFooter class="flex items-center justify-between pt-3">
          <Button variant="ghost" size="sm" @click="store.resetFilters" class="text-xs text-primary font-bold">
            Reset All
          </Button>
          <Button size="sm" @click="store.isFilterModalOpen = false" class="bg-primary text-primary-foreground font-bold">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
