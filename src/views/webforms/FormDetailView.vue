<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebFormsStore, DEPARTMENTS, OWNERS, getLabel } from '@/stores/webforms'
import type { Form } from '@/types/webforms'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  Edit2,
  Eye,
  Play,
  Pause,
  Copy,
  ExternalLink,
  Trash2,
  Archive,
  BarChart3,
  User,
  Building2,
  Tag as TagIcon,
  CheckCircle2,
  Zap,
  Share2,
  Check,
  FileText,
  Clock,
  Inbox,
  MoreHorizontal,
  Sliders,
  Sparkles
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useWebFormsStore()

const isPreviewModalOpen = ref(false)
const copySuccess = ref(false)

const formId = computed(() => route.params.id as string)
const currentForm = computed(() => {
  return store.forms.find(f => f.id === formId.value) || store.activeForm || store.forms[0]
})

onMounted(() => {
  if (formId.value) {
    store.setFormToEdit(formId.value)
  }
})

const shareUrl = computed(() => `https://forms.rakansales.com/f/${currentForm.value?.id || 'demo'}`)

// Mock recent submissions matching mockup
const recentSubmissions = computed(() => [
  { id: '1', respondent: 'John Doe', email: 'john@example.com', outcome: 'CRM LEAD', submittedAt: '2 mins ago' },
  { id: '2', respondent: 'Jane Smith', email: 'jane@example.com', outcome: 'CRM LEAD', submittedAt: '1 hour ago' },
  { id: '3', respondent: 'Robert Brown', email: 'robert@example.com', outcome: 'SUPPORT TICKET', submittedAt: '3 hours ago' },
  { id: '4', respondent: 'Sarah Wilson', email: 'sarah@example.com', outcome: 'CRM LEAD', submittedAt: '5 hours ago' },
  { id: '5', respondent: 'Michael Chen', email: 'michael@example.com', outcome: 'NEWSLETTER', submittedAt: '1 day ago' },
])

// Activity Log matching mockup
const activityTimeline = computed(() => [
  { id: '1', action: 'Published changes', user: 'Alex Rivera', time: '2 days ago' },
  { id: '2', action: 'Updated logic rules', user: 'Sam Chen', time: '3 days ago' },
  { id: '3', action: 'Modified styling', user: 'Alex Rivera', time: '4 days ago' },
  { id: '4', action: 'Form created', user: 'Jordan Smith', time: '2 weeks ago' },
])

function handleCopyUrl() {
  navigator.clipboard.writeText(shareUrl.value)
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}

function navigateToBuilder(tab: string) {
  if (!currentForm.value) return
  router.push(`/web-forms/builder/${currentForm.value.id}?tab=${tab}`)
}
</script>

<template>
  <div v-if="currentForm" class="space-y-6 text-foreground">
    
    <!-- TOP NAVIGATION HEADER (Matching Mockup) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80 shadow-xs">
      <div class="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          @click="router.push('/web-forms')"
          class="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer rounded-xl"
        >
          <ArrowLeft class="w-4 h-4" />
        </Button>

        <div class="h-6 w-px bg-border/70"></div>

        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-extrabold tracking-tight text-foreground">{{ currentForm.name }}</h1>
            <span
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold',
                currentForm.status === 'Published'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              ]"
            >
              <span
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  currentForm.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                ]"
              ></span>
              {{ currentForm.status }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span class="flex items-center gap-1"><User class="w-3.5 h-3.5 opacity-70" /> {{ currentForm.owner }}</span>
            <span>•</span>
            <span class="flex items-center gap-1"><Building2 class="w-3.5 h-3.5 opacity-70" /> {{ getLabel(currentForm.department) }}</span>
          </div>
        </div>
      </div>

      <!-- HEADER ACTIONS -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          @click="navigateToBuilder('Build')"
          class="gap-1.5 cursor-pointer text-xs font-semibold rounded-xl border-border/80"
        >
          <Edit2 class="w-3.5 h-3.5" />
          Edit Form
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="isPreviewModalOpen = true"
          class="gap-1.5 cursor-pointer text-xs font-semibold rounded-xl border-border/80"
        >
          <Eye class="w-3.5 h-3.5" />
          Preview
        </Button>

        <Button
          v-if="currentForm.status === 'Published'"
          size="sm"
          @click="store.updateStatus([currentForm.id], 'Paused')"
          class="bg-amber-500 hover:bg-amber-600 text-white font-bold gap-1.5 shadow-xs cursor-pointer rounded-xl text-xs px-4"
        >
          <Pause class="w-3.5 h-3.5 fill-current" />
          Pause
        </Button>

        <Button
          v-else
          size="sm"
          @click="store.updateStatus([currentForm.id], 'Published')"
          class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-xs cursor-pointer rounded-xl text-xs px-4"
        >
          <Play class="w-3.5 h-3.5 fill-current" />
          Publish
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon" class="h-9 w-9 rounded-xl border-border/80 cursor-pointer">
              <MoreHorizontal class="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-40 text-xs">
            <DropdownMenuItem @click="handleCopyUrl" class="cursor-pointer">
              <Copy class="w-3.5 h-3.5 mr-2" /> Duplicate Form
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer">
              <Archive class="w-3.5 h-3.5 mr-2" /> Archive Form
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer text-destructive">
              <Trash2 class="w-3.5 h-3.5 mr-2" /> Move to Trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- MAIN BODY SPLIT GRID (8 Cols Left / 4 Cols Right Matching Mockup) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- LEFT MAIN CONTENT AREA (8 Cols) -->
      <main class="lg:col-span-8 space-y-6">
        
        <!-- FORM TITLE & OVERVIEW BANNER CARD -->
        <div class="bg-card border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-1 max-w-xl">
            <h2 class="text-2xl font-black tracking-tight text-foreground">{{ currentForm.name }}</h2>
            <p class="text-xs text-muted-foreground leading-relaxed">
              {{ currentForm.description || 'Primary intake form for enterprise prospects.' }}
            </p>
          </div>

          <div class="shrink-0 text-left sm:text-right">
            <span class="text-[9px] font-extrabold text-muted-foreground/70 uppercase tracking-widest block mb-1.5">TAGS</span>
            <div class="flex items-center gap-1.5 flex-wrap justify-start sm:justify-end">
              <span
                v-for="t in (currentForm.tags && currentForm.tags.length ? currentForm.tags : ['SALES', 'HIGH INTENT'])"
                :key="getLabel(t)"
                class="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider"
              >
                {{ getLabel(t) }}
              </span>
            </div>
          </div>
        </div>

        <!-- PERFORMANCE SNAPSHOT CARD (Matching Mockup) -->
        <div class="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold tracking-wider uppercase text-foreground flex items-center gap-2">
              <span class="text-emerald-500 font-extrabold">📊</span> PERFORMANCE SNAPSHOT
            </h3>
            <button @click="router.push(`/web-forms/submissions?formId=${currentForm.id}`)" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
              View Full Analytics ↗
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Submissions -->
            <div class="bg-gray-50/70 dark:bg-zinc-950/50 border border-border/60 rounded-2xl p-4 space-y-1">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 block">TOTAL SUBMISSIONS</span>
              <div class="text-2xl font-black text-foreground">{{ currentForm.submissions || 150 }}</div>
              <span class="text-[10px] font-semibold text-emerald-600 block mt-1">+12.5% vs prev period</span>
            </div>

            <!-- Conversion Rate -->
            <div class="bg-gray-50/70 dark:bg-zinc-950/50 border border-border/60 rounded-2xl p-4 space-y-1">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 block">CONVERSION RATE</span>
              <div class="text-2xl font-black text-foreground">7.1%</div>
              <span class="text-[10px] font-medium text-muted-foreground block mt-1">Avg. completion time: 2m 45s</span>
            </div>

            <!-- Views -->
            <div class="bg-gray-50/70 dark:bg-zinc-950/50 border border-border/60 rounded-2xl p-4 space-y-1">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 block">VIEWS</span>
              <div class="text-2xl font-black text-foreground">{{ currentForm.views || 3200 }}</div>
              <span class="text-[10px] font-medium text-muted-foreground block mt-1">Last 30 days</span>
            </div>

            <!-- Last Submission -->
            <div class="bg-gray-50/70 dark:bg-zinc-950/50 border border-border/60 rounded-2xl p-4 space-y-1">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 block">LAST SUBMISSION</span>
              <div class="text-base font-extrabold text-foreground mt-1">2 mins ago</div>
              <span class="text-[10px] font-medium text-muted-foreground block truncate mt-1">John Doe (CRM Lead)</span>
            </div>
          </div>
        </div>

        <!-- DISTRIBUTION & SHARING CARD (Matching Mockup) -->
        <div class="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold tracking-wider uppercase text-foreground flex items-center gap-2">
              <Share2 class="w-4 h-4 text-emerald-500" /> Distribution & Sharing
            </h3>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="navigateToBuilder('Share')"
                class="gap-1.5 text-xs font-bold rounded-xl border-border/80 cursor-pointer"
              >
                <ExternalLink class="w-3.5 h-3.5" /> Open Live Link
              </Button>
              <Button
                size="sm"
                @click="navigateToBuilder('Share')"
                class="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-white font-bold gap-1.5 rounded-xl text-xs cursor-pointer shadow-xs"
              >
                <Share2 class="w-3.5 h-3.5" /> Share & Embed
              </Button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 mb-1.5">
              STANDALONE LINK
            </label>
            <div class="flex items-center gap-2">
              <Input
                readonly
                :value="shareUrl"
                class="font-mono text-xs bg-gray-50/80 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-xl h-10 flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                @click="handleCopyUrl"
                class="gap-1.5 text-xs font-semibold rounded-xl h-10 border-border/80 cursor-pointer"
              >
                <Copy class="w-3.5 h-3.5" />
                {{ copySuccess ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
          </div>
        </div>

        <!-- RECENT SUBMISSIONS TABLE CARD (Matching Mockup) -->
        <div class="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-foreground">Recent Submissions</h3>
            <button @click="router.push(`/web-forms/submissions?formId=${currentForm.id}`)" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
              View All Submissions
            </button>
          </div>

          <div class="border border-border/60 rounded-xl overflow-hidden">
            <Table>
              <TableHeader class="bg-gray-50/70 dark:bg-zinc-950/60 border-b border-border/60">
                <TableRow class="hover:bg-transparent">
                  <TableHead class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">RESPONDENT</TableHead>
                  <TableHead class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">OUTCOME</TableHead>
                  <TableHead class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">SUBMITTED</TableHead>
                  <TableHead class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody class="divide-y divide-border/60 text-xs">
                <TableRow v-for="sub in recentSubmissions" :key="sub.id" class="hover:bg-muted/30 transition-colors">
                  <TableCell class="py-3">
                    <div class="font-extrabold text-foreground">{{ sub.respondent }}</div>
                    <div class="text-[11px] text-muted-foreground mt-0.5">{{ sub.email }}</div>
                  </TableCell>
                  <TableCell>
                    <span class="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {{ sub.outcome }}
                    </span>
                  </TableCell>
                  <TableCell class="font-medium text-muted-foreground">
                    {{ sub.submittedAt }}
                  </TableCell>
                  <TableCell class="text-right">
                    <button @click="router.push(`/web-forms/submissions?formId=${currentForm.id}`)" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
                      View
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- CONFIGURATION SUMMARY GRID (Matching Mockup) -->
        <div class="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 class="text-xs font-extrabold tracking-wider uppercase text-foreground flex items-center gap-2">
            <Sliders class="w-4 h-4 text-emerald-500" /> CONFIGURATION SUMMARY
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Build & Logic -->
            <div class="bg-gray-50/70 dark:bg-zinc-950/50 border border-border/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <h4 class="font-extrabold text-sm text-foreground">Build & Logic</h4>
                <ul class="text-xs text-muted-foreground space-y-1.5 font-medium">
                  <li>• 12 Fields</li>
                  <li>• 3 Sections</li>
                  <li>• 2 Logic Rules</li>
                </ul>
              </div>
              <button @click="navigateToBuilder('Build')" class="text-[11px] font-extrabold text-muted-foreground hover:text-foreground uppercase tracking-wider text-left cursor-pointer transition-colors">
                EDIT BUILD
              </button>
            </div>

            <!-- Submission Behavior -->
            <div class="bg-gray-50/70 dark:bg-zinc-950/50 border border-border/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <h4 class="font-extrabold text-sm text-foreground">Submission Behavior</h4>
                <ul class="text-xs text-muted-foreground space-y-1.5 font-medium">
                  <li>• CRM Outcome: Lead</li>
                  <li>• Show Success Message</li>
                  <li>• Email Notifications On</li>
                </ul>
              </div>
              <button @click="navigateToBuilder('Submit')" class="text-[11px] font-extrabold text-muted-foreground hover:text-foreground uppercase tracking-wider text-left cursor-pointer transition-colors">
                EDIT SUBMIT
              </button>
            </div>

            <!-- Visual Style -->
            <div class="bg-gray-50/70 dark:bg-zinc-950/50 border border-border/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <h4 class="font-extrabold text-sm text-foreground">Visual Style</h4>
                <ul class="text-xs text-muted-foreground space-y-1.5 font-medium">
                  <li>• Modern Theme</li>
                  <li>• Brand Green (#23B750)</li>
                  <li>• Inter Sans-Serif</li>
                </ul>
              </div>
              <button @click="navigateToBuilder('Style')" class="text-[11px] font-extrabold text-muted-foreground hover:text-foreground uppercase tracking-wider text-left cursor-pointer transition-colors">
                EDIT STYLE
              </button>
            </div>
          </div>
        </div>

      </main>

      <!-- RIGHT SIDEBAR COLUMN (4 Cols Matching Mockup) -->
      <aside class="lg:col-span-4 space-y-5">
        
        <!-- STATUS & HEALTH CARD -->
        <div class="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">STATUS & HEALTH</span>

          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <Check class="w-3 h-3 stroke-[3]" />
              </div>
              <div class="space-y-0.5">
                <h4 class="font-extrabold text-xs text-foreground leading-snug">Accepting Submissions</h4>
                <p class="text-[11px] text-muted-foreground leading-relaxed">Form is live and connected to your CRM endpoints.</p>
              </div>
            </div>

            <div class="divide-y divide-border/60 pt-2 text-xs">
              <div class="flex items-center justify-between py-2">
                <span class="text-muted-foreground font-medium">Unpublished Changes</span>
                <span class="font-extrabold text-foreground">None</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-muted-foreground font-medium">Embed Health</span>
                <span class="font-extrabold text-emerald-600 flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Optimal
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- QUICK ACTIONS CARD -->
        <div class="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">QUICK ACTIONS</span>

          <div class="space-y-1 text-xs">
            <button
              @click="router.push(`/web-forms/submissions?formId=${currentForm.id}`)"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-semibold cursor-pointer text-left"
            >
              <Inbox class="w-4 h-4 opacity-70" />
              <span>View Submissions</span>
            </button>

            <button
              @click="handleCopyUrl"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-semibold cursor-pointer text-left"
            >
              <Copy class="w-4 h-4 opacity-70" />
              <span>Duplicate Form</span>
            </button>

            <button
              @click="navigateToBuilder('Share')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-semibold cursor-pointer text-left"
            >
              <ExternalLink class="w-4 h-4 opacity-70" />
              <span>Open Standalone Link</span>
            </button>

            <button
              @click="handleCopyUrl"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-semibold cursor-pointer text-left"
            >
              <Share2 class="w-4 h-4 opacity-70" />
              <span>Copy Share URL</span>
            </button>

            <button
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-semibold cursor-pointer text-left pt-2 border-t border-border/60"
            >
              <Archive class="w-4 h-4" />
              <span>Archive Form</span>
            </button>

            <button
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-semibold cursor-pointer text-left"
            >
              <Trash2 class="w-4 h-4" />
              <span>Move to Trash</span>
            </button>
          </div>
        </div>

        <!-- METADATA CARD -->
        <div class="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">METADATA</span>

          <div class="divide-y divide-border/60 text-xs">
            <div class="flex items-center justify-between py-2">
              <span class="text-muted-foreground font-medium flex items-center gap-2">
                <User class="w-3.5 h-3.5 opacity-60" /> Owner
              </span>
              <span class="font-extrabold text-foreground">{{ currentForm.owner || 'Sam Chen' }}</span>
            </div>

            <div class="flex items-center justify-between py-2">
              <span class="text-muted-foreground font-medium flex items-center gap-2">
                <Building2 class="w-3.5 h-3.5 opacity-60" /> Department
              </span>
              <span class="font-extrabold text-foreground">{{ getLabel(currentForm.department) || 'Sales' }}</span>
            </div>

            <div class="flex items-center justify-between py-2">
              <span class="text-muted-foreground font-medium flex items-center gap-2">
                <User class="w-3.5 h-3.5 opacity-60" /> Created By
              </span>
              <span class="font-extrabold text-foreground">Alex Rivera</span>
            </div>

            <div class="flex items-center justify-between py-2">
              <span class="text-muted-foreground font-medium flex items-center gap-2">
                <Clock class="w-3.5 h-3.5 opacity-60" /> Created On
              </span>
              <span class="font-extrabold text-foreground">Mar 12, 2026</span>
            </div>

            <div class="flex items-center justify-between py-2">
              <span class="text-muted-foreground font-medium flex items-center gap-2">
                <FileText class="w-3.5 h-3.5 opacity-60" /> Template
              </span>
              <span class="font-extrabold text-foreground">Lead Gen - Enterprise</span>
            </div>
          </div>
        </div>

        <!-- RECENT ACTIVITY CARD -->
        <div class="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">RECENT ACTIVITY</span>

          <div class="space-y-3 text-xs">
            <div v-for="act in activityTimeline" :key="act.id" class="flex items-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5 text-[10px]">
                ▶
              </div>
              <div>
                <p class="font-bold text-foreground leading-snug">{{ act.action }}</p>
                <p class="text-[10px] text-muted-foreground mt-0.5">{{ act.user }} • {{ act.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- PRO TIP CALLOUT CARD (Matching Mockup Green Card) -->
        <div class="bg-emerald-700 dark:bg-emerald-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
          <div class="flex items-center gap-2 font-extrabold text-sm">
            <Zap class="w-4 h-4 text-emerald-300 fill-emerald-300" />
            <span>Pro Tip</span>
          </div>
          <p class="text-xs text-emerald-50 leading-relaxed font-medium">
            You can connect this form to multiple CRM workflows in the Submission tab. Changes take effect instantly upon clicking Update.
          </p>
          <div class="pt-1">
            <button
              @click="navigateToBuilder('Submit')"
              class="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer text-center block"
            >
              Learn More
            </button>
          </div>
        </div>

      </aside>

    </div>

    <!-- PREVIEW FORM DIALOG -->
    <Dialog :open="isPreviewModalOpen" @update:open="(val) => isPreviewModalOpen = val">
      <DialogContent class="max-w-lg p-6 space-y-4">
        <DialogHeader>
          <DialogTitle class="text-base font-bold flex items-center gap-2">
            <Eye class="w-5 h-5 text-emerald-600" /> Live Form Preview - {{ currentForm.name }}
          </DialogTitle>
        </DialogHeader>

        <div class="p-5 bg-card border border-border/80 rounded-2xl shadow-xs space-y-4 text-xs">
          <div>
            <h3 class="font-extrabold text-base text-foreground">{{ currentForm.name }}</h3>
            <p class="text-xs text-muted-foreground mt-1">{{ currentForm.description || 'Fill in the details below.' }}</p>
          </div>

          <div class="space-y-3 pt-2 border-t border-border/60">
            <div v-for="f in store.editorFields" :key="f.id" class="space-y-1">
              <label class="block font-bold text-foreground">
                {{ getLabel(f.label) }} <span v-if="f.required" class="text-destructive">*</span>
              </label>
              <Input disabled :placeholder="f.placeholder || 'Enter value...'" class="bg-muted/40 text-xs rounded-xl" />
            </div>

            <Button disabled class="w-full bg-emerald-600 text-white font-bold text-xs mt-3 rounded-xl">
              Submit Form Response
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  </div>
</template>
