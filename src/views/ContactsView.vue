<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { generateMockContacts, type Contact, type Activity } from '@/data/contactsData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Calendar,
  Sparkles,
  Check,
  X,
  Building2,
  Send,
  PhoneCall,
  PlusCircle,
  RefreshCw,
  XCircle,
  Edit2,
  Info,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next'

// --- Core Data State ---
const contacts = ref<Contact[]>([])
const isInitialized = ref(false)

// Initialization
const initContacts = () => {
  contacts.value = generateMockContacts(2500)
  isInitialized.value = true
}
initContacts()

// --- Toast System (Custom lightweight implementation for maximum design consistency) ---
interface Toast {
  id: number
  message: string
  type: 'success' | 'info' | 'error'
}
const toasts = ref<Toast[]>([])
let toastIdSeq = 0
const showToast = (message: string, type: Toast['type'] = 'success') => {
  const id = ++toastIdSeq
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4000)
}

// --- Filtering & Search State ---
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedLifecycle = ref('all')
const selectedCompany = ref('all')
const selectedRole = ref('all')

// Reset all filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedLifecycle.value = 'all'
  selectedCompany.value = 'all'
  selectedRole.value = 'all'
  showToast('All filters have been reset', 'info')
}

// Unique list of companies & roles in data for dropdown filtering
const uniqueCompanies = computed(() => {
  const companies = contacts.value.map(c => c.company)
  return ['all', ...Array.from(new Set(companies))].sort()
})

const uniqueRoles = computed(() => {
  const roles = contacts.value.map(c => c.role)
  return ['all', ...Array.from(new Set(roles))].sort()
})

// --- Sorting State ---
const sortBy = ref<keyof Contact>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const handleSort = (field: keyof Contact) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

// --- Selected Contacts State (Bulk Actions) ---
const selectedIds = ref<string[]>([])
const selectAllMode = ref<'page' | 'all' | 'none'>('none')

const isAllFilteredSelected = computed(() => {
  if (filteredAndSortedContacts.value.length === 0) return false
  return selectedIds.value.length === filteredAndSortedContacts.value.length
})

const isCurrentPageAllSelected = computed(() => {
  if (paginatedContacts.value.length === 0) return false
  return paginatedContacts.value.every(c => selectedIds.value.includes(c.id))
})

const handleHeaderCheckboxChange = (checked: boolean) => {
  if (checked) {
    // Select current page first
    const pageIds = paginatedContacts.value.map(c => c.id)
    pageIds.forEach(id => {
      if (!selectedIds.value.includes(id)) {
        selectedIds.value.push(id)
      }
    })
    selectAllMode.value = 'page'
  } else {
    // Deselect current page items
    const pageIds = paginatedContacts.value.map(c => c.id)
    selectedIds.value = selectedIds.value.filter(id => !pageIds.includes(id))
    selectAllMode.value = 'none'
  }
}

const selectAllFiltered = () => {
  selectedIds.value = filteredAndSortedContacts.value.map(c => c.id)
  selectAllMode.value = 'all'
  showToast(`Selected all ${filteredAndSortedContacts.value.length} contacts`, 'success')
}

const clearSelection = () => {
  selectedIds.value = []
  selectAllMode.value = 'none'
}

const toggleSelectContact = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
  
  if (selectedIds.value.length === 0) {
    selectAllMode.value = 'none'
  } else if (selectedIds.value.length === filteredAndSortedContacts.value.length) {
    selectAllMode.value = 'all'
  } else {
    selectAllMode.value = 'page'
  }
}

// --- Pagination State ---
const currentPage = ref(1)
const pageSize = ref(10)

watch([searchQuery, selectedStatus, selectedLifecycle, selectedCompany, selectedRole, pageSize], () => {
  currentPage.value = 1
  clearSelection()
})

// --- Filtering & Sorting Operations ---
const filteredAndSortedContacts = computed(() => {
  // 1. Filtering
  let result = contacts.value.filter(contact => {
    // Search query match
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !q || 
      contact.name.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.phone.toLowerCase().includes(q) ||
      contact.company.toLowerCase().includes(q) ||
      contact.role.toLowerCase().includes(q)

    // Status filter
    const matchesStatus = selectedStatus.value === 'all' || contact.status === selectedStatus.value

    // Lifecycle filter
    const matchesLifecycle = selectedLifecycle.value === 'all' || contact.lifecycleStage === selectedLifecycle.value

    // Company filter
    const matchesCompany = selectedCompany.value === 'all' || contact.company === selectedCompany.value

    // Role filter
    const matchesRole = selectedRole.value === 'all' || contact.role === selectedRole.value

    return matchesSearch && matchesStatus && matchesLifecycle && matchesCompany && matchesRole
  })

  // 2. Sorting
  result.sort((a, b) => {
    let valA = a[sortBy.value]
    let valB = b[sortBy.value]

    // Handle string conversion or nested types if any
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

// Paginated view of contacts
const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAndSortedContacts.value.slice(start, end)
})

// Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedContacts.value.length / pageSize.value) || 1
})

// Dynamic pagination numbers to display
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const pages: (number | string)[] = []
  pages.push(1)
  
  if (current > 3) {
    pages.push('...')
  }
  
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (current < total - 2) {
    pages.push('...')
  }
  
  pages.push(total)
  return pages
})

// --- Stats Cards Values ---
const stats = computed(() => {
  const total = contacts.value.length
  const leads = contacts.value.filter(c => c.status === 'Lead').length
  const active = contacts.value.filter(c => c.status === 'Active').length
  
  // New this week: dateAdded within last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const newThisWeek = contacts.value.filter(c => new Date(c.dateAdded) >= sevenDaysAgo).length

  // Activity rate: percentage of contacts that have been contacted (status not Inactive)
  const contactedCount = contacts.value.filter(c => c.status !== 'Inactive').length
  const activityRate = total > 0 ? Math.round((contactedCount / total) * 100) : 0

  return {
    total,
    leads,
    active,
    newThisWeek,
    activityRate
  }
})

// --- Quick View Drawer State (Detail Panel) ---
const activeContact = ref<Contact | null>(null)
const isDrawerOpen = ref(false)

const openContactDrawer = (contact: Contact) => {
  // Load full contact details
  activeContact.value = JSON.parse(JSON.stringify(contact)) // Deep copy for drawer local updates
  isDrawerOpen.value = true
}

const updateContactInDatabase = (updated: Contact) => {
  const idx = contacts.value.findIndex(c => c.id === updated.id)
  if (idx > -1) {
    contacts.value[idx] = { ...updated }
    // Update local drawer state too
    activeContact.value = { ...updated }
  }
}

// Log new activity timeline event
const logActivityType = ref<'call' | 'email' | 'meeting' | 'note'>('call')
const logActivityTitle = ref('')
const logActivityDesc = ref('')
const isLoggingActivity = ref(false)

const addActivityLog = () => {
  if (!activeContact.value) return
  if (!logActivityTitle.value.trim() || !logActivityDesc.value.trim()) {
    showToast('Please enter both a title and details', 'error')
    return
  }

  const newAct: Activity = {
    id: `act-new-${Date.now()}`,
    type: logActivityType.value,
    title: logActivityTitle.value,
    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    description: logActivityDesc.value
  }

  const updatedContact = { ...activeContact.value }
  updatedContact.activities = [newAct, ...updatedContact.activities]
  
  updateContactInDatabase(updatedContact)
  
  // Clear activity form
  logActivityTitle.value = ''
  logActivityDesc.value = ''
  isLoggingActivity.value = false
  showToast('Activity logged successfully')
}

// Auto-save Notes inside Drawer
const saveDrawerNotes = () => {
  if (!activeContact.value) return
  updateContactInDatabase(activeContact.value)
  showToast('Notes saved successfully')
}

// Directly change status in drawer
const handleDrawerStatusChange = (val: Contact['status']) => {
  if (!activeContact.value) return
  activeContact.value.status = val
  updateContactInDatabase(activeContact.value)
  showToast(`Status updated to ${val}`)
}

const handleDrawerLifecycleChange = (val: Contact['lifecycleStage']) => {
  if (!activeContact.value) return
  activeContact.value.lifecycleStage = val
  updateContactInDatabase(activeContact.value)
  showToast(`Lifecycle stage updated to ${val}`)
}

// --- Add & Edit Dialog Form State ---
const isAddEditOpen = ref(false)
const isEditing = ref(false)
const formState = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  status: 'Lead' as Contact['status'],
  lifecycleStage: 'Lead' as Contact['lifecycleStage'],
  notes: '',
  tagsString: ''
})

const openAddDialog = () => {
  isEditing.value = false
  formState.id = ''
  formState.name = ''
  formState.email = ''
  formState.phone = ''
  formState.company = ''
  formState.role = ''
  formState.status = 'Lead'
  formState.lifecycleStage = 'Lead'
  formState.notes = ''
  formState.tagsString = ''
  isAddEditOpen.value = true
}

const openEditDialog = (contact: Contact) => {
  isEditing.value = true
  formState.id = contact.id
  formState.name = contact.name
  formState.email = contact.email
  formState.phone = contact.phone
  formState.company = contact.company
  formState.role = contact.role
  formState.status = contact.status
  formState.lifecycleStage = contact.lifecycleStage
  formState.notes = contact.notes || ''
  formState.tagsString = contact.tags.join(', ')
  isAddEditOpen.value = true
}

const submitContactForm = () => {
  // Basic validation
  if (!formState.name.trim() || !formState.email.trim() || !formState.phone.trim()) {
    showToast('Name, Email, and Phone number are required', 'error')
    return
  }

  // Parse tags
  const tags = formState.tagsString
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  if (isEditing.value) {
    // Edit existing contact
    const oldContact = contacts.value.find(c => c.id === formState.id)
    if (!oldContact) return

    const updated: Contact = {
      ...oldContact,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      company: formState.company,
      role: formState.role,
      status: formState.status,
      lifecycleStage: formState.lifecycleStage,
      notes: formState.notes,
      tags
    }
    updateContactInDatabase(updated)
    isAddEditOpen.value = false
    showToast(`Contact "${formState.name}" updated successfully`)
  } else {
    // Create new contact
    const newIdNum = contacts.value.length + 1
    const newId = `C${String(newIdNum).padStart(4, '0')}`

    const newContact: Contact = {
      id: newId,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      company: formState.company,
      role: formState.role,
      status: formState.status,
      lifecycleStage: formState.lifecycleStage,
      lastContact: 'Today',
      dateAdded: new Date().toISOString().split('T')[0],
      avatar: formState.name.split(' ').map(n => n[0]).join(''),
      notes: formState.notes || `Notes for ${formState.name}.`,
      tags: tags.length ? tags : ['New Lead'],
      activities: [
        {
          id: `act-new-${Date.now()}`,
          type: 'note',
          title: 'Contact Created',
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          description: 'Contact record initialized in database.'
        }
      ]
    }

    contacts.value.unshift(newContact) // Put on top so user sees it
    isAddEditOpen.value = false
    showToast(`Contact "${formState.name}" added successfully`)
  }
}

const deleteContact = (id: string, name: string) => {
  if (confirm(`Are you sure you want to delete contact "${name}"?`)) {
    contacts.value = contacts.value.filter(c => c.id !== id)
    selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id)
    if (activeContact.value?.id === id) {
      isDrawerOpen.value = false
    }
    showToast(`Contact "${name}" has been deleted`)
  }
}

// --- Bulk Operations Actions ---
const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedIds.value.length} selected contacts?`)) {
    const idsToRemove = new Set(selectedIds.value)
    contacts.value = contacts.value.filter(c => !idsToRemove.has(c.id))
    clearSelection()
    showToast('Selected contacts deleted successfully')
  }
}

const bulkExport = () => {
  const selectedContacts = contacts.value.filter(c => selectedIds.value.includes(c.id))
  
  // Format CSV content
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Role', 'Status', 'Lifecycle Stage', 'Date Added']
  const csvRows = [headers.join(',')]

  for (const c of selectedContacts) {
    const row = [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.email,
      c.phone,
      `"${c.company.replace(/"/g, '""')}"`,
      `"${c.role.replace(/"/g, '""')}"`,
      c.status,
      c.lifecycleStage,
      c.dateAdded
    ]
    csvRows.push(row.join(','))
  }

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `rakansales_contacts_export_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showToast(`Successfully exported ${selectedContacts.length} contacts to CSV`)
}

const bulkUpdateStatus = (val: Contact['status']) => {
  const idsToUpdate = new Set(selectedIds.value)
  contacts.value = contacts.value.map(c => {
    if (idsToUpdate.has(c.id)) {
      return { ...c, status: val }
    }
    return c
  })
  clearSelection()
  showToast(`Updated status for selected contacts to ${val}`)
}
</script>

<template>
  <div class="relative space-y-6">
    <!-- Custom Toast Notifications Overlay -->
    <TransitionGroup
      name="toast"
      tag="div"
      class="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'p-4 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-3 animate-slide-in pointer-events-auto bg-white/95 dark:bg-card/95 backdrop-blur-md transition-all duration-300',
          toast.type === 'success' ? 'border-emerald-200 text-emerald-800 dark:border-emerald-900/50 dark:text-emerald-400' : '',
          toast.type === 'info' ? 'border-blue-200 text-blue-800 dark:border-blue-900/50 dark:text-blue-400' : '',
          toast.type === 'error' ? 'border-red-200 text-red-800 dark:border-red-900/50 dark:text-red-400' : ''
        ]"
      >
        <span class="w-2 h-2 rounded-full" :class="[
          toast.type === 'success' ? 'bg-[#23B750]' : '',
          toast.type === 'info' ? 'bg-blue-500' : '',
          toast.type === 'error' ? 'bg-red-500' : ''
        ]"></span>
        <p>{{ toast.message }}</p>
      </div>
    </TransitionGroup>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-foreground">Contacts Database</h1>
        <p class="text-xs text-muted-foreground mt-0.5">Manage and analyze your CRM network, leads, and customer lifecycles.</p>
      </div>
      <Button variant="primary" class="gap-2 shadow-sm rounded-xl cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all" @click="openAddDialog">
        <Plus class="w-4 h-4" />
        Add Contact
      </Button>
    </div>

    <!-- Statistics Dashboard (Glassmorphism Cards) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Contacts Card -->
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-primary group-hover:scale-110 transition-transform">
          <Building2 class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Network</span>
          <div class="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-[#23B750]">
            <CheckCircle class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">{{ stats.total.toLocaleString() }}</span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Sparkles class="w-3 h-3 text-yellow-500" />
          Active pipeline records
        </p>
      </div>

      <!-- Active Leads Card -->
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-purple-500 group-hover:scale-110 transition-transform">
          <Award class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Leads</span>
          <div class="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-500">
            <Sparkles class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">{{ stats.leads.toLocaleString() }}</span>
          <span class="text-xs font-medium text-purple-600 bg-purple-50 dark:bg-purple-950/30 px-1.5 py-0.5 rounded-md">
            {{ Math.round((stats.leads / stats.total) * 100) }}%
          </span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Clock class="w-3 h-3 text-purple-400" />
          Nurturing lifecycle stage
        </p>
      </div>

      <!-- New Contacts Card -->
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-blue-500 group-hover:scale-110 transition-transform">
          <Calendar class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New This Week</span>
          <div class="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500">
            <Info class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">+{{ stats.newThisWeek.toLocaleString() }}</span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Clock class="w-3 h-3 text-blue-400" />
          Onboarded within last 7 days
        </p>
      </div>

      <!-- Activity Rate Card -->
      <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-amber-500 group-hover:scale-110 transition-transform">
          <RefreshCw class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Engagement</span>
          <div class="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-500">
            <Send class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">{{ stats.activityRate }}%</span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <CheckCircle class="w-3 h-3 text-emerald-500" />
          Engaged in past 30 days
        </p>
      </div>
    </div>

    <!-- Filters & Query Workspace (CRM Toolbar) -->
    <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-4 rounded-2xl shadow-sm space-y-4">
      <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <!-- Search bar -->
        <div class="relative flex-1 max-w-lg">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, phone, company, role..."
            class="pl-10 pr-4 py-2 border-gray-200 dark:border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary w-full bg-gray-50/50 dark:bg-muted/30 text-sm"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <XCircle class="w-4 h-4" />
          </button>
        </div>

        <!-- Filters controls toggles -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Status Select -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-1">Status</span>
            <Select v-model="selectedStatus">
              <SelectTrigger class="w-[130px] rounded-xl border-gray-200 dark:border-border text-xs bg-gray-50/50 dark:bg-muted/30 h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent class="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Lifecycle Stage Select -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-1">Stage</span>
            <Select v-model="selectedLifecycle">
              <SelectTrigger class="w-[140px] rounded-xl border-gray-200 dark:border-border text-xs bg-gray-50/50 dark:bg-muted/30 h-9">
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent class="rounded-xl">
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Subscriber">Subscriber</SelectItem>
                <SelectItem value="Opportunity">Opportunity</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Company Filter -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-1">Company</span>
            <Select v-model="selectedCompany">
              <SelectTrigger class="w-[160px] rounded-xl border-gray-200 dark:border-border text-xs bg-gray-50/50 dark:bg-muted/30 h-9 truncate">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent class="rounded-xl max-h-[300px]">
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem v-for="c in uniqueCompanies.filter(x => x !== 'all')" :key="c" :value="c">
                  {{ c }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Role Filter -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-1">Role</span>
            <Select v-model="selectedRole">
              <SelectTrigger class="w-[150px] rounded-xl border-gray-200 dark:border-border text-xs bg-gray-50/50 dark:bg-muted/30 h-9 truncate">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent class="rounded-xl max-h-[300px]">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem v-for="r in uniqueRoles.filter(x => x !== 'all')" :key="r" :value="r">
                  {{ r }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Reset Button -->
          <div class="flex flex-col justify-end h-full mt-5">
            <Button
              v-if="searchQuery || selectedStatus !== 'all' || selectedLifecycle !== 'all' || selectedCompany !== 'all' || selectedRole !== 'all'"
              variant="ghost"
              size="sm"
              class="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl h-9"
              @click="resetFilters"
            >
              <X class="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <!-- Bulk Selection Banner (Appears when items are selected) -->
      <div
        v-if="selectedIds.length > 0"
        class="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-in"
      >
        <div class="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-[#23B750] text-white text-[10px] font-bold">
            {{ selectedIds.length }}
          </span>
          contacts selected.
          <button
            v-if="selectAllMode === 'page' && filteredAndSortedContacts.length > selectedIds.length"
            class="underline text-emerald-600 dark:text-emerald-300 hover:text-emerald-800 font-bold ml-1 cursor-pointer"
            @click="selectAllFiltered"
          >
            Select all {{ filteredAndSortedContacts.length }} filtered contacts
          </button>
          <span v-if="selectAllMode === 'all'" class="font-normal text-emerald-600 dark:text-emerald-300">
            (Selected all {{ filteredAndSortedContacts.length }} contacts in search)
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Bulk actions dropdown/buttons -->
          <Button variant="outline" size="xs" class="text-xs border-emerald-200 hover:bg-emerald-100/50 dark:border-emerald-900 text-gray-700 dark:text-foreground cursor-pointer rounded-lg bg-white dark:bg-background" @click="bulkExport">
            <Download class="w-3 h-3 mr-1" />
            CSV Export
          </Button>

          <!-- Update status bulk -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="xs" class="text-xs border-emerald-200 hover:bg-emerald-100/50 dark:border-emerald-900 text-gray-700 dark:text-foreground cursor-pointer rounded-lg bg-white dark:bg-background">
                Update Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="rounded-xl">
              <DropdownMenuItem @click="bulkUpdateStatus('Active')">Active</DropdownMenuItem>
              <DropdownMenuItem @click="bulkUpdateStatus('Lead')">Lead</DropdownMenuItem>
              <DropdownMenuItem @click="bulkUpdateStatus('Pending')">Pending</DropdownMenuItem>
              <DropdownMenuItem @click="bulkUpdateStatus('Inactive')">Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="xs" class="text-xs border-red-200 text-red-600 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer rounded-lg bg-white dark:bg-background" @click="bulkDelete">
            <Trash2 class="w-3 h-3 mr-1" />
            Delete Selected
          </Button>

          <Button variant="ghost" size="xs" class="text-xs text-gray-500 hover:text-gray-700" @click="clearSelection">
            Cancel
          </Button>
        </div>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto min-h-[300px]">
        <Table class="w-full border-collapse">
          <TableHeader class="bg-gray-50/50 dark:bg-muted/30 border-b border-gray-200 dark:border-border">
            <TableRow>
              <TableHead class="w-10 pl-4 py-3">
                <Checkbox
                  :model-value="isCurrentPageAllSelected"
                  @update:model-value="handleHeaderCheckboxChange"
                  class="cursor-pointer"
                />
              </TableHead>
              <TableHead class="font-bold text-gray-700 dark:text-foreground py-3 text-xs w-[220px]">
                <button @click="handleSort('name')" class="flex items-center gap-1 hover:text-gray-900 cursor-pointer w-full text-left">
                  Name
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-gray-700 dark:text-foreground py-3 text-xs">
                <button @click="handleSort('email')" class="flex items-center gap-1 hover:text-gray-900 cursor-pointer w-full text-left">
                  Email
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-gray-700 dark:text-foreground py-3 text-xs">Phone</TableHead>
              <TableHead class="font-bold text-gray-700 dark:text-foreground py-3 text-xs">
                <button @click="handleSort('company')" class="flex items-center gap-1 hover:text-gray-900 cursor-pointer w-full text-left">
                  Company
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-gray-700 dark:text-foreground py-3 text-xs">
                <button @click="handleSort('role')" class="flex items-center gap-1 hover:text-gray-900 cursor-pointer w-full text-left">
                  Role
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-gray-700 dark:text-foreground py-3 text-xs">
                <button @click="handleSort('status')" class="flex items-center gap-1 hover:text-gray-900 cursor-pointer w-full text-left">
                  Status
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-gray-700 dark:text-foreground py-3 text-xs">
                <button @click="handleSort('lastContact')" class="flex items-center gap-1 hover:text-gray-900 cursor-pointer w-full text-left">
                  Last Contact
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="w-20 pr-4 text-right py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="paginatedContacts.length === 0">
              <TableCell colspan="9" class="text-center py-12 text-muted-foreground text-sm">
                <div class="flex flex-col items-center gap-3">
                  <XCircle class="w-8 h-8 text-gray-300" />
                  <p class="font-medium text-gray-600 dark:text-gray-400">No contacts found matching criteria</p>
                  <p class="text-xs text-gray-400">Try adjusting your filters or search phrase.</p>
                  <Button variant="outline" size="sm" @click="resetFilters" class="mt-2 rounded-xl">Clear All Filters</Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow
              v-else
              v-for="contact in paginatedContacts"
              :key="contact.id"
              :class="[
                'border-b border-gray-100 dark:border-border/50 hover:bg-gray-50/50 dark:hover:bg-muted/20 transition-all duration-150 cursor-pointer group',
                selectedIds.includes(contact.id) ? 'bg-emerald-50/30 dark:bg-emerald-950/5 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10' : ''
              ]"
              @click="openContactDrawer(contact)"
            >
              <!-- Row Selection Checkbox -->
              <TableCell class="pl-4 py-2.5" @click.stop>
                <Checkbox
                  :model-value="selectedIds.includes(contact.id)"
                  @update:model-value="toggleSelectContact(contact.id)"
                  class="cursor-pointer"
                />
              </TableCell>

              <!-- Profile Name & Avatar -->
              <TableCell class="py-2.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-primary text-xs font-bold border border-primary/20 flex-shrink-0">
                    {{ contact.avatar }}
                  </div>
                  <div class="min-w-0">
                    <span class="font-semibold text-gray-900 dark:text-foreground text-xs hover:underline truncate block max-w-[160px]">{{ contact.name }}</span>
                    <span class="text-[10px] text-muted-foreground block truncate">ID: {{ contact.id }}</span>
                  </div>
                </div>
              </TableCell>

              <!-- Email -->
              <TableCell class="py-2.5 text-xs text-gray-600 dark:text-gray-300">
                <div class="flex items-center gap-1.5">
                  <Mail class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span class="truncate max-w-[150px]">{{ contact.email }}</span>
                </div>
              </TableCell>

              <!-- Phone -->
              <TableCell class="py-2.5 text-xs text-gray-600 dark:text-gray-300 font-mono">
                {{ contact.phone }}
              </TableCell>

              <!-- Company -->
              <TableCell class="py-2.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                {{ contact.company }}
              </TableCell>

              <!-- Role -->
              <TableCell class="py-2.5 text-xs text-gray-600 dark:text-gray-300">
                {{ contact.role }}
              </TableCell>

              <!-- Status Badge -->
              <TableCell class="py-2.5">
                <Badge
                  variant="outline"
                  :class="[
                    'text-[10px] h-5 py-0 px-2 font-semibold tracking-wide rounded-full border',
                    contact.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' : '',
                    contact.status === 'Lead' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50' : '',
                    contact.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50' : '',
                    contact.status === 'Inactive' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-900/50' : ''
                  ]"
                >
                  {{ contact.status }}
                </Badge>
              </TableCell>

              <!-- Last Contact -->
              <TableCell class="py-2.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ contact.lastContact }}
              </TableCell>

              <!-- Edit & Action Menu -->
              <TableCell class="pr-4 py-2.5 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="xs"
                    class="h-7 w-7 p-0 rounded-lg text-gray-500 hover:text-[#23B750] hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                    title="Edit Contact"
                    @click="openEditDialog(contact)"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    class="h-7 w-7 p-0 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Delete Contact"
                    @click="deleteContact(contact.id, contact.name)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination Panel -->
      <div class="bg-gray-50/50 dark:bg-muted/30 border-t border-gray-200 dark:border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Rows per page selector -->
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show</span>
          <Select :model-value="String(pageSize)" @update:model-value="(val: any) => pageSize = Number(val)">
            <SelectTrigger class="w-[70px] border-gray-200 dark:border-border rounded-xl h-8 text-xs bg-white dark:bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent class="rounded-xl">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>records per page</span>
        </div>

        <!-- Showing info -->
        <span class="text-xs text-muted-foreground font-medium">
          Showing
          <span class="font-bold text-gray-700 dark:text-foreground">
            {{ filteredAndSortedContacts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }}
          </span>
          to
          <span class="font-bold text-gray-700 dark:text-foreground">
            {{ Math.min(currentPage * pageSize, filteredAndSortedContacts.length) }}
          </span>
          of
          <span class="font-bold text-gray-700 dark:text-foreground">
            {{ filteredAndSortedContacts.length }}
          </span>
          contacts
        </span>

        <!-- Page navigation buttons -->
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="xs"
            class="h-8 w-8 p-0 rounded-lg cursor-pointer bg-white dark:bg-background"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>

          <!-- Direct Page Numbers with Ellipses -->
          <template v-for="page in visiblePages" :key="page">
            <Button
              v-if="typeof page === 'number'"
              variant="outline"
              size="xs"
              :class="[
                'h-8 w-8 p-0 rounded-lg font-semibold text-xs transition-all cursor-pointer bg-white dark:bg-background',
                currentPage === page ? 'bg-[#23B750] hover:bg-[#23B750] border-[#23B750] text-white hover:text-white dark:bg-[#23B750]' : 'text-gray-700 dark:text-foreground'
              ]"
              @click="currentPage = page"
            >
              {{ page }}
            </Button>
            <span v-else class="text-xs text-gray-400 px-1 font-semibold select-none">
              {{ page }}
            </span>
          </template>

          <Button
            variant="outline"
            size="xs"
            class="h-8 w-8 p-0 rounded-lg cursor-pointer bg-white dark:bg-background"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Contact Quick Detail View Drawer (Sheet) -->
    <Sheet v-model:open="isDrawerOpen">
      <SheetContent class="w-full sm:max-w-lg p-0 flex flex-col h-full rounded-l-2xl border-l border-gray-200 dark:border-border bg-white dark:bg-card">
        <div class="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-border">
          <SheetHeader class="text-left">
            <SheetTitle class="text-base font-bold text-gray-900 dark:text-foreground">Contact details</SheetTitle>
          </SheetHeader>
        </div>

        <div v-if="activeContact" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Header Hero Profiler -->
          <div class="flex items-center gap-4 bg-gray-50/50 dark:bg-muted/10 p-4 rounded-2xl border border-gray-100 dark:border-border/30">
            <div class="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-primary text-lg font-bold border border-primary/30">
              {{ activeContact.avatar }}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-bold text-gray-900 dark:text-foreground truncate leading-tight">{{ activeContact.name }}</h2>
              <p class="text-xs text-muted-foreground truncate mt-0.5">{{ activeContact.role }} at <span class="font-semibold text-gray-700 dark:text-gray-300">{{ activeContact.company }}</span></p>
              
              <div class="flex flex-wrap gap-1.5 mt-2.5">
                <Badge variant="outline" class="text-[10px] h-5 py-0 px-2 uppercase tracking-wide bg-white dark:bg-muted">ID: {{ activeContact.id }}</Badge>
                <Badge
                  variant="outline"
                  class="text-[10px] h-5 py-0 px-2 uppercase tracking-wide bg-white dark:bg-muted"
                >
                  {{ activeContact.lifecycleStage }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Quick Interactive Controls (Status & Stage Updates) -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-0.5">Status</span>
              <Select :model-value="activeContact.status" @update:model-value="handleDrawerStatusChange">
                <SelectTrigger class="w-full rounded-xl border-gray-200 dark:border-border text-xs h-9 bg-white dark:bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="rounded-xl">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex flex-col gap-1.5">
              <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-0.5">Lifecycle Stage</span>
              <Select :model-value="activeContact.lifecycleStage" @update:model-value="handleDrawerLifecycleChange">
                <SelectTrigger class="w-full rounded-xl border-gray-200 dark:border-border text-xs h-9 bg-white dark:bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="rounded-xl">
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Subscriber">Subscriber</SelectItem>
                  <SelectItem value="Opportunity">Opportunity</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Contact Fields Details -->
          <div class="space-y-3.5 bg-gray-50/50 dark:bg-muted/10 p-5 rounded-2xl border border-gray-100 dark:border-border/30">
            <h3 class="text-xs font-bold text-gray-800 dark:text-foreground uppercase tracking-wide">Standard Information</h3>
            
            <div class="grid grid-cols-3 gap-2 py-1 text-xs border-b border-gray-100 dark:border-border/10">
              <span class="text-muted-foreground">Email</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200 font-medium truncate flex items-center gap-1.5">
                <Mail class="w-3.5 h-3.5 text-gray-400" />
                {{ activeContact.email }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 py-1 text-xs border-b border-gray-100 dark:border-border/10">
              <span class="text-muted-foreground">Phone</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200 font-mono font-medium flex items-center gap-1.5">
                <Phone class="w-3.5 h-3.5 text-gray-400" />
                {{ activeContact.phone }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 py-1 text-xs border-b border-gray-100 dark:border-border/10">
              <span class="text-muted-foreground">Date Onboarded</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200 font-medium flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5 text-gray-400" />
                {{ activeContact.dateAdded }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 py-1 text-xs">
              <span class="text-muted-foreground">Tags</span>
              <div class="col-span-2 flex flex-wrap gap-1">
                <Badge
                  v-for="t in activeContact.tags"
                  :key="t"
                  variant="outline"
                  class="text-[9px] h-4 py-0 px-1.5 font-normal bg-emerald-50/20 text-[#23B750] border-emerald-100 dark:border-emerald-950/20"
                >
                  {{ t }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Notes Card -->
          <div class="space-y-2 bg-gray-50/50 dark:bg-muted/10 p-5 rounded-2xl border border-gray-100 dark:border-border/30">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-bold text-gray-800 dark:text-foreground uppercase tracking-wide">Communication Notes</h3>
              <Button variant="ghost" size="xs" class="text-[10px] text-primary h-6 px-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20" @click="saveDrawerNotes">Save Notes</Button>
            </div>
            <Textarea
              v-model="activeContact.notes"
              placeholder="Record details about contract, requirements or general notes..."
              class="text-xs border-gray-200 dark:border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary min-h-[90px] bg-white dark:bg-background"
            />
          </div>

          <!-- Log Activity Accordion -->
          <div class="border border-gray-200 dark:border-border rounded-2xl overflow-hidden bg-gray-50/30 dark:bg-muted/5">
            <button
              @click="isLoggingActivity = !isLoggingActivity"
              class="w-full px-5 py-3.5 text-left text-xs font-bold text-gray-800 dark:text-foreground flex items-center justify-between hover:bg-gray-100/50 transition-colors"
            >
              <span class="flex items-center gap-1.5">
                <PlusCircle class="w-4 h-4 text-primary" />
                Log a Call, Email or Meeting
              </span>
              <span class="text-[10px] font-semibold text-primary uppercase">{{ isLoggingActivity ? 'Close' : 'Open' }}</span>
            </button>
            <div v-if="isLoggingActivity" class="p-5 border-t border-gray-200 dark:border-border bg-white dark:bg-card space-y-3.5 animate-slide-in">
              <div class="grid grid-cols-2 gap-2.5">
                <div class="flex flex-col gap-1">
                  <label class="text-[9px] text-muted-foreground uppercase font-bold tracking-wide">Activity Type</label>
                  <Select v-model="logActivityType">
                    <SelectTrigger class="h-8 text-xs rounded-xl border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl">
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email Sent/Received</SelectItem>
                      <SelectItem value="meeting">Discovery/Meeting</SelectItem>
                      <SelectItem value="note">Internal Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[9px] text-muted-foreground uppercase font-bold tracking-wide">Subject</label>
                  <Input
                    v-model="logActivityTitle"
                    type="text"
                    placeholder="e.g. Discovery demo"
                    class="h-8 text-xs rounded-xl border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/30"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] text-muted-foreground uppercase font-bold tracking-wide">Summary / Conversation Notes</label>
                <Textarea
                  v-model="logActivityDesc"
                  placeholder="Record summary details..."
                  class="text-xs min-h-[60px] rounded-xl border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/30"
                />
              </div>
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="xs" class="rounded-lg h-7 px-3" @click="isLoggingActivity = false">Cancel</Button>
                <Button variant="primary" size="xs" class="rounded-lg h-7 px-3" @click="addActivityLog">Log Event</Button>
              </div>
            </div>
          </div>

          <!-- Activity Timeline logs -->
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-gray-800 dark:text-foreground uppercase tracking-wide">Engagement Activity Timeline</h3>
            
            <div class="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-200 dark:before:bg-border">
              <div
                v-for="act in activeContact.activities"
                :key="act.id"
                class="relative"
              >
                <!-- Dot Icon indicator -->
                <div class="absolute -left-[21px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border bg-white dark:bg-card" :class="[
                  act.type === 'call' ? 'border-emerald-200 text-emerald-600' : '',
                  act.type === 'email' ? 'border-blue-200 text-blue-600' : '',
                  act.type === 'meeting' ? 'border-purple-200 text-purple-600' : '',
                  act.type === 'note' ? 'border-amber-200 text-amber-600' : ''
                ]">
                  <PhoneCall v-if="act.type === 'call'" class="w-3 h-3" />
                  <Send v-else-if="act.type === 'email'" class="w-3 h-3" />
                  <Calendar v-else-if="act.type === 'meeting'" class="w-3 h-3" />
                  <FileText v-else class="w-3 h-3" />
                </div>

                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-bold text-gray-800 dark:text-foreground leading-none">{{ act.title }}</h4>
                    <span class="text-[10px] text-muted-foreground font-semibold">{{ act.timestamp }}</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pr-2">{{ act.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="p-6 border-t border-gray-100 dark:border-border flex gap-3 bg-gray-50/50 dark:bg-muted/10">
          <Button variant="outline" class="flex-1 rounded-xl shadow-sm cursor-pointer h-10 text-xs bg-white dark:bg-background" @click="openEditDialog(activeContact!)">
            <Edit2 class="w-4 h-4 mr-1" />
            Edit Profile
          </Button>
          <Button variant="danger" class="flex-1 rounded-xl shadow-sm cursor-pointer h-10 text-xs" @click="deleteContact(activeContact!.id, activeContact!.name)">
            <Trash2 class="w-4 h-4 mr-1" />
            Delete Record
          </Button>
        </div>
      </SheetContent>
    </Sheet>

    <!-- Add & Edit Dialog (Popup Modal) -->
    <Dialog v-model:open="isAddEditOpen">
      <DialogContent class="sm:max-w-[480px] p-0 rounded-2xl overflow-hidden border border-gray-200 dark:border-border bg-white dark:bg-card">
        <DialogHeader class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-border text-left">
          <DialogTitle class="text-base font-bold text-gray-900 dark:text-foreground">
            {{ isEditing ? 'Edit Contact Profile' : 'Add New Contact' }}
          </DialogTitle>
          <p class="text-[11px] text-muted-foreground mt-0.5">Enter details regarding the contact. All primary details are saved to database.</p>
        </DialogHeader>

        <!-- Form fields -->
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Full Name -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Full Name *</label>
              <Input
                v-model="formState.name"
                type="text"
                placeholder="e.g. John Doe"
                class="rounded-xl border-gray-200 dark:border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
            <!-- Email -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address *</label>
              <Input
                v-model="formState.email"
                type="email"
                placeholder="e.g. john@acme.com"
                class="rounded-xl border-gray-200 dark:border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Phone Number -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number *</label>
              <Input
                v-model="formState.phone"
                type="text"
                placeholder="e.g. +60 12-345 6789"
                class="rounded-xl border-gray-200 dark:border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
            <!-- Company -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Company Name</label>
              <Input
                v-model="formState.company"
                type="text"
                placeholder="e.g. Acme Corp"
                class="rounded-xl border-gray-200 dark:border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Job Title -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Job Title / Role</label>
              <Input
                v-model="formState.role"
                type="text"
                placeholder="e.g. Product Manager"
                class="rounded-xl border-gray-200 dark:border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
            <!-- Tags string -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
              <Input
                v-model="formState.tagsString"
                type="text"
                placeholder="e.g. High-Value, Lead"
                class="rounded-xl border-gray-200 dark:border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Status -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Status</label>
              <Select v-model="formState.status">
                <SelectTrigger class="w-full rounded-xl border-gray-200 dark:border-border text-xs h-9 bg-white dark:bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="rounded-xl">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Lifecycle Stage -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Lifecycle Stage</label>
              <Select v-model="formState.lifecycleStage">
                <SelectTrigger class="w-full rounded-xl border-gray-200 dark:border-border text-xs h-9 bg-white dark:bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="rounded-xl">
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Subscriber">Subscriber</SelectItem>
                  <SelectItem value="Opportunity">Opportunity</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Notes -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Notes / Details</label>
            <Textarea
              v-model="formState.notes"
              placeholder="Enter brief description or note regarding contact onboarding..."
              class="rounded-xl border-gray-200 dark:border-border focus-visible:ring-1 focus-visible:ring-primary text-xs min-h-[70px]"
            />
          </div>
        </div>

        <DialogFooter class="px-6 py-4 bg-gray-50/50 dark:bg-muted/10 border-t border-gray-100 dark:border-border flex justify-end gap-2.5">
          <DialogClose as-child>
            <Button variant="ghost" class="rounded-xl text-xs h-9 px-4 cursor-pointer">Cancel</Button>
          </DialogClose>
          <Button variant="primary" class="rounded-xl text-xs h-9 px-4 cursor-pointer shadow-sm" @click="submitContactForm">
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
/* Page Animations */
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
