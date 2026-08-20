<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebFormsStore, getLabel } from '@/stores/webforms'
import type { Submission } from '@/types/webforms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import {
  Inbox,
  Search,
  Download,
  Eye,
  ArrowLeft,
  X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useWebFormsStore()

const statusFilter = ref<string>('All')
const selectedFormId = ref<string>('All')
const searchQuery = ref<string>('')

const activeFormId = computed(() => route.query.formId as string | undefined)
const currentForm = computed(() => {
  if (!activeFormId.value) return null
  return store.forms.find(f => f.id === activeFormId.value) || null
})

onMounted(() => {
  if (route.query.formId) {
    selectedFormId.value = route.query.formId as string
  }
})

const filteredSubmissions = computed(() => {
  return store.submissions.filter(sub => {
    if (statusFilter.value !== 'All' && sub.status !== statusFilter.value) return false
    if (selectedFormId.value !== 'All' && sub.formId !== selectedFormId.value) return false

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchName = sub.respondent.toLowerCase().includes(q)
      const matchEmail = sub.email.toLowerCase().includes(q)
      const matchId = sub.id.toLowerCase().includes(q)
      if (!matchName && !matchEmail && !matchId) return false
    }

    return true
  }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
})

const activeSubmission = ref<Submission | null>(null)

function handleBackNavigation() {
  if (activeFormId.value) {
    router.push(`/web-forms/detail/${activeFormId.value}`)
  } else {
    router.push('/web-forms')
  }
}

function exportCSV() {
  const headers = ['Submission ID', 'Form Name', 'Respondent', 'Email', 'Submitted At', 'Status', 'Outcome']
  const rows = filteredSubmissions.value.map(s => [
    s.id, s.formName, s.respondent, s.email, s.submittedAt, s.status, s.createdOutcome
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `webform_submissions_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getStatusBadgeClass(status: Submission['status']) {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'Duplicate Flagged':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Processing Failed':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    default:
      return 'bg-gray-500/10 text-gray-600'
  }
}

function formatAnswerValue(val: any): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'string') return val
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  if (Array.isArray(val)) return val.map(v => getLabel(v)).join(', ')
  if (typeof val === 'object') {
    return Object.entries(val).map(([k, v]) => `${k}: ${getLabel(v)}`).join(' | ')
  }
  return String(val)
}
</script>

<template>
  <div class="space-y-6 text-foreground">
    <!-- TOP HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border shadow-xs">
      <div class="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          @click="handleBackNavigation"
          class="gap-1.5 font-bold text-xs cursor-pointer hover:bg-muted shrink-0"
        >
          <ArrowLeft class="w-4 h-4 text-emerald-600" />
          {{ currentForm ? `Back to ${currentForm.name}` : 'Back to Forms' }}
        </Button>

        <div class="h-6 w-px bg-border/70"></div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Inbox class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl font-extrabold tracking-tight text-foreground">
              {{ currentForm ? `${currentForm.name} - Submissions Log` : 'Form Submissions Log' }}
            </h1>
            <p class="text-xs text-muted-foreground">
              {{ currentForm ? `Individual intake responses and CRM outcome logs for ${currentForm.name}` : 'Track intake responses, duplicate lead detection, and CRM outcome logs' }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <Button variant="outline" size="sm" @click="exportCSV" class="gap-2 cursor-pointer text-xs font-semibold">
          <Download class="w-4 h-4" />
          Export CSV
        </Button>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
      <div class="relative flex-1 max-w-md w-full">
        <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search by respondent name, email, or submission ID..."
          class="pl-10 text-xs bg-muted/50"
        />
      </div>

      <div class="flex items-center gap-3 flex-wrap w-full sm:w-auto">
        <select
          v-model="selectedFormId"
          class="px-3 py-2 bg-muted border border-input rounded-md text-xs focus:outline-none text-foreground"
        >
          <option value="All">All Web Forms</option>
          <option v-for="f in store.forms" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>

        <select
          v-model="statusFilter"
          class="px-3 py-2 bg-muted border border-input rounded-md text-xs focus:outline-none text-foreground"
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Duplicate Flagged">Duplicate Flagged</option>
          <option value="Processing Failed">Processing Failed</option>
        </select>
      </div>
    </div>

    <!-- SUBMISSIONS TABLE -->
    <div class="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <Table>
        <TableHeader class="bg-muted/40">
          <TableRow>
            <TableHead>Submission ID</TableHead>
            <TableHead>Form Name</TableHead>
            <TableHead>Respondent</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Outcome</TableHead>
            <TableHead class="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="sub in filteredSubmissions"
            :key="sub.id"
            @click="activeSubmission = sub"
            class="hover:bg-muted/20 transition-colors cursor-pointer"
          >
            <TableCell class="font-mono font-bold text-foreground">
              {{ sub.id }}
            </TableCell>
            <TableCell class="font-semibold text-foreground">
              {{ sub.formName }}
            </TableCell>
            <TableCell>
              <div class="font-bold text-foreground">{{ sub.respondent }}</div>
              <div class="text-[11px] text-muted-foreground">{{ sub.email }}</div>
            </TableCell>
            <TableCell class="text-muted-foreground text-xs">
              {{ new Date(sub.submittedAt).toLocaleString() }}
            </TableCell>
            <TableCell>
              <Badge :class="['text-[11px] border', getStatusBadgeClass(sub.status)]">
                {{ sub.status }}
              </Badge>
            </TableCell>
            <TableCell class="font-bold text-primary text-xs">
              {{ sub.createdOutcome }}
            </TableCell>
            <TableCell class="text-right">
              <Button
                variant="ghost"
                size="icon"
                @click="activeSubmission = sub"
                class="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                title="View Submission Details"
              >
                <Eye class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>

          <TableRow v-if="filteredSubmissions.length === 0">
            <TableCell colspan="7" class="py-12 text-center text-muted-foreground">
              <Inbox class="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p class="font-medium">No submission responses found for this form</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- SUBMISSION DETAIL SHEET / DRAWER -->
    <Sheet :open="activeSubmission !== null" @update:open="(val) => { if(!val) activeSubmission = null }">
      <SheetContent v-if="activeSubmission" class="w-full sm:max-w-md p-6 space-y-6 overflow-y-auto">
        <SheetHeader class="border-b border-border pb-4">
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-primary font-mono uppercase">{{ activeSubmission.id }}</span>
            <SheetTitle class="text-lg font-bold">{{ activeSubmission.respondent }}</SheetTitle>
          </div>
        </SheetHeader>

        <div class="space-y-4 text-xs">
          <div class="p-4 bg-muted/40 rounded-xl space-y-2 border border-border">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Form:</span>
              <span class="font-semibold text-foreground">{{ activeSubmission.formName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Submitted At:</span>
              <span class="font-semibold text-foreground">{{ new Date(activeSubmission.submittedAt).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-muted-foreground">Status:</span>
              <Badge :class="['text-[10px] border', getStatusBadgeClass(activeSubmission.status)]">
                {{ activeSubmission.status }}
              </Badge>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Created Outcome:</span>
              <span class="font-bold text-primary">{{ activeSubmission.createdOutcome }}</span>
            </div>
          </div>

          <!-- Submitted Form Answers -->
          <div class="space-y-3">
            <h4 class="font-bold text-foreground uppercase tracking-wider text-[10px]">Form Response Answers</h4>
            <div class="space-y-2">
              <div
                v-for="(val, key) in activeSubmission.answers"
                :key="key"
                class="p-3 bg-card border border-border rounded-xl space-y-1"
              >
                <div class="font-bold text-foreground capitalize">{{ getLabel(String(key)) }}</div>
                <div class="text-muted-foreground font-mono text-[11px] whitespace-pre-wrap">{{ formatAnswerValue(val) }}</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
