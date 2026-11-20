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
  AlertCircle,
  Upload,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft
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

  // 2. Sorting (keep newly imported contacts at the very top so they are immediately visible)
  result.sort((a, b) => {
    const aImported = a.id.startsWith('IMP-')
    const bImported = b.id.startsWith('IMP-')
    if (aImported && !bImported) return -1
    if (!aImported && bImported) return 1

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

// --- CSV Import Contacts Flow (3 Steps: Upload -> Column Matching -> Success Summary) ---
const isImportModalOpen = ref(false)
const importStep = ref<1 | 2 | 3>(1)
const uploadedCsvFileName = ref('')
const uploadedCsvFileSize = ref('')
const csvFileInputRef = ref<HTMLInputElement | null>(null)

interface CsvColumnMapping {
  index: number
  csvHeader: string
  sampleRow1: string
  sampleRow2: string
  crmField: 'name' | 'email' | 'phone' | 'company' | 'role' | 'status' | 'tags' | 'skip'
}

const crmFieldOptions = [
  { value: 'name', label: 'Full Name (Required)' },
  { value: 'email', label: 'Email Address (Required)' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'company', label: 'Company Name' },
  { value: 'role', label: 'Job Title / Role' },
  { value: 'status', label: 'Lead Status' },
  { value: 'tags', label: 'Label / Tag' },
  { value: 'skip', label: 'Do not import (Skip)' }
]

const defaultSampleCsvRows: string[][] = [
  ['Full Name', 'Work Email', 'Mobile Phone', 'Company Name', 'Job Title', 'Lead Label'],
  ['Nurul Izzah Kamarul', 'izzah@petronas-digital.my', '+60 12-894 3310', 'Petronas Digital Sdn Bhd', 'Head of Digital Sales', 'Hot'],
  ['Marcus Lim Wei', 'marcus.lim@sunwayventures.com', '+60 17-309 8821', 'Sunway Ventures MY', 'VP of Commercial', 'Hot'],
  ['Faridah Begum', 'faridah@cimb-wealth.com.my', '+60 19-228 4501', 'CIMB Wealth Advisory', 'Regional Director', 'VIP-Tier'],
  ['Jason Khoo', 'jkhoo@grab-enterprise.my', '+60 16-772 9104', 'Grab Enterprise MY', 'Partnerships Lead', 'Hot'],
  ['Dr. Arvind Nair', 'arvind@kpjhealth.com.my', '+60 13-550 1198', 'KPJ Healthcare Group', 'Chief Operations Officer', 'Warm']
]

const parsedCsvRows = ref<string[][]>([])
const csvColumnMappings = ref<CsvColumnMapping[]>([])
const importedContactsSummary = ref<Contact[]>([])

const autoDetectCrmField = (header: string): CsvColumnMapping['crmField'] => {
  const h = header.toLowerCase().trim()
  if (h.includes('name') && !h.includes('company')) return 'name'
  if (h.includes('email') || h.includes('mail')) return 'email'
  if (h.includes('phone') || h.includes('mobile') || h.includes('tel') || h.includes('whatsapp')) return 'phone'
  if (h.includes('company') || h.includes('org') || h.includes('business')) return 'company'
  if (h.includes('role') || h.includes('title') || h.includes('position') || h.includes('job')) return 'role'
  if (h.includes('status')) return 'status'
  if (h.includes('tag') || h.includes('label') || h.includes('segment')) return 'tags'
  return 'skip'
}

const populateCsvMappingsFromRows = (rows: string[][]) => {
  if (rows.length < 2) return
  const headers = rows[0]
  const row1 = rows[1] || []
  const row2 = rows[2] || []

  csvColumnMappings.value = headers.map((hdr, idx) => ({
    index: idx,
    csvHeader: hdr,
    sampleRow1: row1[idx] || '—',
    sampleRow2: row2[idx] || '—',
    crmField: autoDetectCrmField(hdr)
  }))
}

const openImportModal = () => {
  importStep.value = 1
  uploadedCsvFileName.value = ''
  uploadedCsvFileSize.value = ''
  parsedCsvRows.value = []
  csvColumnMappings.value = []
  importedContactsSummary.value = []
  isImportModalOpen.value = true
}

const loadSampleCsvFile = () => {
  uploadedCsvFileName.value = 'malaysia_q2_hot_leads.csv'
  uploadedCsvFileSize.value = '4.2 KB'
  parsedCsvRows.value = defaultSampleCsvRows.map(r => [...r])
  populateCsvMappingsFromRows(parsedCsvRows.value)
  showToast('Loaded sample CSV file (5 contact rows detected)', 'info')
}

const handleCsvFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadedCsvFileName.value = file.name
  uploadedCsvFileSize.value = `${Math.max(1, Math.round(file.size / 1024))} KB`

  const reader = new FileReader()
  reader.onload = e => {
    const text = String(e.target?.result || '')
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0)

    if (lines.length >= 2) {
      const rows = lines.map(line =>
        line.split(',').map(cell => cell.replace(/^"|"$/g, '').trim())
      )
      parsedCsvRows.value = rows
      populateCsvMappingsFromRows(rows)
      showToast(`Parsed ${rows.length - 1} rows from ${file.name}`, 'info')
    } else {
      loadSampleCsvFile()
    }
  }
  reader.readAsText(file)
}

const proceedToColumnMatching = () => {
  if (!uploadedCsvFileName.value) {
    loadSampleCsvFile()
  }
  importStep.value = 2
}

const matchedColumnsCount = computed(() => {
  return csvColumnMappings.value.filter(m => m.crmField !== 'skip').length
})

const executeCsvImport = () => {
  const dataRows = parsedCsvRows.value.slice(1)
  const newlyCreated: Contact[] = []
  const todayIso = new Date().toISOString().split('T')[0]

  dataRows.forEach((row, idx) => {
    let name = ''
    let email = ''
    let phone = ''
    let company = ''
    let role = ''
    let status: Contact['status'] = 'Lead'
    let tags: string[] = ['CSV Import']

    csvColumnMappings.value.forEach(mapping => {
      const val = (row[mapping.index] || '').trim()
      if (!val) return
      if (mapping.crmField === 'name') name = val
      else if (mapping.crmField === 'email') email = val
      else if (mapping.crmField === 'phone') phone = val
      else if (mapping.crmField === 'company') company = val
      else if (mapping.crmField === 'role') role = val
      else if (mapping.crmField === 'status') {
        if (['Active', 'Inactive', 'Pending', 'Lead'].includes(val)) {
          status = val as Contact['status']
        }
      } else if (mapping.crmField === 'tags') {
        tags = [val, 'CSV Import']
      }
    })

    if (!name) name = `Imported Contact ${idx + 1}`
    if (!email) email = `contact${idx + 1}@company.my`
    if (!phone) phone = `+60 12-300 400${idx}`
    if (!company) company = 'Enterprise MY'
    if (!role) role = 'Decision Maker'

    const avatar = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('')

    const newContact: Contact = {
      id: `IMP-${String(idx + 1).padStart(3, '0')}`,
      name,
      email,
      phone,
      company,
      role,
      status,
      lifecycleStage: 'Lead',
      lastContact: 'Just imported',
      dateAdded: todayIso,
      avatar: avatar || 'IC',
      notes: `Imported via CSV (${uploadedCsvFileName.value})`,
      tags,
      activities: [
        {
          id: `act-imp-${Date.now()}-${idx}`,
          type: 'note',
          title: 'Contact Imported via CSV',
          timestamp: 'Today',
          description: `Imported from ${uploadedCsvFileName.value} with matched CRM columns.`
        }
      ]
    }

    newlyCreated.push(newContact)
  })

  // Prepend to main contacts list and reset pagination/filters so they appear at the top
  contacts.value.unshift(...newlyCreated)
  importedContactsSummary.value = newlyCreated
  currentPage.value = 1
  importStep.value = 3
  showToast(`Successfully imported ${newlyCreated.length} contacts from CSV!`, 'success')
}

const downloadSampleCsvTemplate = () => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    defaultSampleCsvRows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const link = document.createElement('a')
  link.setAttribute('href', encodeURI(csvContent))
  link.setAttribute('download', 'rakansales_sample_contacts.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Sample CSV template downloaded', 'info')
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
          'p-4 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-3 animate-slide-in pointer-events-auto bg-card/95 backdrop-blur-md transition-all duration-300',
          toast.type === 'success' ? 'border-success/30 text-success' : '',
          toast.type === 'info' ? 'border-info/30 text-info' : '',
          toast.type === 'error' ? 'border-destructive/30 text-destructive' : ''
        ]"
      >
        <span class="w-2 h-2 rounded-full" :class="[
          toast.type === 'success' ? 'bg-primary' : '',
          toast.type === 'info' ? 'bg-info' : '',
          toast.type === 'error' ? 'bg-destructive' : ''
        ]"></span>
        <p>{{ toast.message }}</p>
      </div>
    </TransitionGroup>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Contacts Database</h1>
        <p class="text-xs text-muted-foreground mt-0.5">Manage and analyze your CRM network, leads, and customer lifecycles.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <Button
          variant="outline"
          class="gap-2 rounded-xl border-border bg-card hover:bg-muted text-foreground cursor-pointer font-semibold text-xs h-9"
          @click="openImportModal"
        >
          <Upload class="w-4 h-4 text-primary" />
          Import
        </Button>
        <Button
          variant="primary"
          class="gap-2 shadow-sm rounded-xl cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all text-xs h-9"
          @click="openAddDialog"
        >
          <Plus class="w-4 h-4" />
          Add Contact
        </Button>
      </div>
    </div>

    <!-- Statistics Dashboard (Glassmorphism Cards) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Contacts Card -->
      <div class="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-primary group-hover:scale-110 transition-transform">
          <Building2 class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Network</span>
          <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
            <CheckCircle class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-foreground">{{ stats.total.toLocaleString() }}</span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Sparkles class="w-3 h-3 text-warning" />
          Active pipeline records
        </p>
      </div>

      <!-- Active Leads Card -->
      <div class="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-tag-4-foreground group-hover:scale-110 transition-transform">
          <Award class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Leads</span>
          <div class="p-1.5 rounded-lg bg-tag-4/10 text-tag-4-foreground">
            <Sparkles class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-foreground">{{ stats.leads.toLocaleString() }}</span>
          <span class="text-xs font-medium text-tag-4-foreground bg-tag-4/10 px-1.5 py-0.5 rounded-md">
            {{ Math.round((stats.leads / stats.total) * 100) }}%
          </span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Clock class="w-3 h-3 text-tag-4-foreground" />
          Nurturing lifecycle stage
        </p>
      </div>

      <!-- New Contacts Card -->
      <div class="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-info group-hover:scale-110 transition-transform">
          <Calendar class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New This Week</span>
          <div class="p-1.5 rounded-lg bg-info/10 text-info">
            <Info class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-foreground">+{{ stats.newThisWeek.toLocaleString() }}</span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Clock class="w-3 h-3 text-info" />
          Onboarded within last 7 days
        </p>
      </div>

      <!-- Activity Rate Card -->
      <div class="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        <div class="absolute -right-2 -bottom-2 opacity-5 text-warning group-hover:scale-110 transition-transform">
          <RefreshCw class="w-24 h-24" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Engagement</span>
          <div class="p-1.5 rounded-lg bg-warning/10 text-warning">
            <Send class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold tracking-tight text-foreground">{{ stats.activityRate }}%</span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <CheckCircle class="w-3 h-3 text-success" />
          Engaged in past 30 days
        </p>
      </div>
    </div>

    <!-- Filters & Query Workspace (CRM Toolbar) -->
    <div class="bg-card border border-border p-4 rounded-2xl shadow-sm space-y-4">
      <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <!-- Search bar -->
        <div class="relative flex-1 max-w-lg">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, phone, company, role..."
            class="pl-10 pr-4 py-2 border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary w-full bg-muted/30 text-sm"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full"
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
              <SelectTrigger class="w-[130px] rounded-xl border-border text-xs bg-muted/30 h-9">
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
              <SelectTrigger class="w-[140px] rounded-xl border-border text-xs bg-muted/30 h-9">
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
              <SelectTrigger class="w-[160px] rounded-xl border-border text-xs bg-muted/30 h-9 truncate">
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
              <SelectTrigger class="w-[150px] rounded-xl border-border text-xs bg-muted/30 h-9 truncate">
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
              class="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl h-9"
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
        class="bg-primary/10 border border-primary/20 p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-in"
      >
        <div class="flex items-center gap-2 text-xs text-primary font-semibold">
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {{ selectedIds.length }}
          </span>
          contacts selected.
          <button
            v-if="selectAllMode === 'page' && filteredAndSortedContacts.length > selectedIds.length"
            class="underline text-primary hover:text-primary/80 font-bold ml-1 cursor-pointer"
            @click="selectAllFiltered"
          >
            Select all {{ filteredAndSortedContacts.length }} filtered contacts
          </button>
          <span v-if="selectAllMode === 'all'" class="font-normal text-primary">
            (Selected all {{ filteredAndSortedContacts.length }} contacts in search)
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Bulk actions dropdown/buttons -->
          <Button variant="outline" size="xs" class="text-xs border-primary/20 hover:bg-primary/10 text-foreground cursor-pointer rounded-lg bg-card" @click="bulkExport">
            <Download class="w-3 h-3 mr-1" />
            CSV Export
          </Button>

          <!-- Update status bulk -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="xs" class="text-xs border-primary/20 hover:bg-primary/10 text-foreground cursor-pointer rounded-lg bg-card">
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

          <Button variant="outline" size="xs" class="text-xs border-destructive/30 text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg bg-card" @click="bulkDelete">
            <Trash2 class="w-3 h-3 mr-1" />
            Delete Selected
          </Button>

          <Button variant="ghost" size="xs" class="text-xs text-muted-foreground hover:text-foreground" @click="clearSelection">
            Cancel
          </Button>
        </div>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto min-h-[300px]">
        <Table class="w-full border-collapse">
          <TableHeader class="bg-muted/30 border-b border-border">
            <TableRow>
              <TableHead class="w-10 pl-4 py-3">
                <Checkbox
                  :model-value="isCurrentPageAllSelected"
                  @update:model-value="handleHeaderCheckboxChange"
                  class="cursor-pointer"
                />
              </TableHead>
              <TableHead class="font-bold text-foreground py-3 text-xs w-[220px]">
                <button @click="handleSort('name')" class="flex items-center gap-1 hover:text-foreground cursor-pointer w-full text-left">
                  Name
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-foreground py-3 text-xs">
                <button @click="handleSort('email')" class="flex items-center gap-1 hover:text-foreground cursor-pointer w-full text-left">
                  Email
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-foreground py-3 text-xs">Phone</TableHead>
              <TableHead class="font-bold text-foreground py-3 text-xs">
                <button @click="handleSort('company')" class="flex items-center gap-1 hover:text-foreground cursor-pointer w-full text-left">
                  Company
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-foreground py-3 text-xs">
                <button @click="handleSort('role')" class="flex items-center gap-1 hover:text-foreground cursor-pointer w-full text-left">
                  Role
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-foreground py-3 text-xs">
                <button @click="handleSort('status')" class="flex items-center gap-1 hover:text-foreground cursor-pointer w-full text-left">
                  Status
                  <ArrowUpDown class="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead class="font-bold text-foreground py-3 text-xs">
                <button @click="handleSort('lastContact')" class="flex items-center gap-1 hover:text-foreground cursor-pointer w-full text-left">
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
                  <XCircle class="w-8 h-8 text-muted-foreground" />
                  <p class="font-medium text-muted-foreground">No contacts found matching criteria</p>
                  <p class="text-xs text-muted-foreground">Try adjusting your filters or search phrase.</p>
                  <Button variant="outline" size="sm" @click="resetFilters" class="mt-2 rounded-xl">Clear All Filters</Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow
              v-else
              v-for="contact in paginatedContacts"
              :key="contact.id"
              :class="[
                'border-b border-border/50 hover:bg-muted/20 transition-all duration-150 cursor-pointer group',
                selectedIds.includes(contact.id) ? 'bg-primary/5 hover:bg-primary/10' : ''
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
                  <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20 flex-shrink-0">
                    {{ contact.avatar }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="font-semibold text-foreground text-xs hover:underline truncate block max-w-[160px]">{{ contact.name }}</span>
                      <span
                        v-if="contact.id.startsWith('IMP-')"
                        class="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-success/10 text-success border border-success/30 shrink-0"
                      >
                        Imported
                      </span>
                    </div>
                    <span class="text-[10px] text-muted-foreground block truncate">ID: {{ contact.id }}</span>
                  </div>
                </div>
              </TableCell>

              <!-- Email -->
              <TableCell class="py-2.5 text-xs text-muted-foreground">
                <div class="flex items-center gap-1.5">
                  <Mail class="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span class="truncate max-w-[150px]">{{ contact.email }}</span>
                </div>
              </TableCell>

              <!-- Phone -->
              <TableCell class="py-2.5 text-xs text-muted-foreground font-mono">
                {{ contact.phone }}
              </TableCell>

              <!-- Company -->
              <TableCell class="py-2.5 text-xs font-medium text-foreground">
                {{ contact.company }}
              </TableCell>

              <!-- Role -->
              <TableCell class="py-2.5 text-xs text-muted-foreground">
                {{ contact.role }}
              </TableCell>

              <!-- Status Badge -->
              <TableCell class="py-2.5">
                <Badge
                  variant="outline"
                  :class="[
                    'text-[10px] h-5 py-0 px-2 font-semibold tracking-wide rounded-full border',
                    contact.status === 'Active' ? 'bg-success/10 text-success border-success/30' : '',
                    contact.status === 'Lead' ? 'bg-tag-4/10 text-tag-4-foreground border-tag-4/30' : '',
                    contact.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/30' : '',
                    contact.status === 'Inactive' ? 'bg-muted text-muted-foreground border-border' : ''
                  ]"
                >
                  {{ contact.status }}
                </Badge>
              </TableCell>

              <!-- Last Contact -->
              <TableCell class="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                {{ contact.lastContact }}
              </TableCell>

              <!-- Edit & Action Menu -->
              <TableCell class="pr-4 py-2.5 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="xs"
                    class="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                    title="Edit Contact"
                    @click="openEditDialog(contact)"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    class="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
      <div class="bg-muted/30 border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Rows per page selector -->
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show</span>
          <Select :model-value="String(pageSize)" @update:model-value="(val: any) => pageSize = Number(val)">
            <SelectTrigger class="w-[70px] border-border rounded-xl h-8 text-xs bg-card">
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
          <span class="font-bold text-foreground">
            {{ filteredAndSortedContacts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }}
          </span>
          to
          <span class="font-bold text-foreground">
            {{ Math.min(currentPage * pageSize, filteredAndSortedContacts.length) }}
          </span>
          of
          <span class="font-bold text-foreground">
            {{ filteredAndSortedContacts.length }}
          </span>
          contacts
        </span>

        <!-- Page navigation buttons -->
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="xs"
            class="h-8 w-8 p-0 rounded-lg cursor-pointer bg-card"
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
                'h-8 w-8 p-0 rounded-lg font-semibold text-xs transition-all cursor-pointer bg-card',
                currentPage === page ? 'bg-primary hover:bg-primary border-primary text-primary-foreground hover:text-primary-foreground' : 'text-foreground'
              ]"
              @click="currentPage = page"
            >
              {{ page }}
            </Button>
            <span v-else class="text-xs text-muted-foreground px-1 font-semibold select-none">
              {{ page }}
            </span>
          </template>

          <Button
            variant="outline"
            size="xs"
            class="h-8 w-8 p-0 rounded-lg cursor-pointer bg-card"
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
      <SheetContent class="w-full sm:max-w-lg p-0 flex flex-col h-full rounded-l-2xl border-l border-border bg-card">
        <div class="h-16 flex items-center justify-between px-6 border-b border-border">
          <SheetHeader class="text-left">
            <SheetTitle class="text-base font-bold text-foreground">Contact details</SheetTitle>
          </SheetHeader>
        </div>

        <div v-if="activeContact" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Header Hero Profiler -->
          <div class="flex items-center gap-4 bg-muted/10 p-4 rounded-2xl border border-border/30">
            <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold border border-primary/30">
              {{ activeContact.avatar }}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-bold text-foreground truncate leading-tight">{{ activeContact.name }}</h2>
              <p class="text-xs text-muted-foreground truncate mt-0.5">{{ activeContact.role }} at <span class="font-semibold text-foreground">{{ activeContact.company }}</span></p>
              
              <div class="flex flex-wrap gap-1.5 mt-2.5">
                <Badge variant="outline" class="text-[10px] h-5 py-0 px-2 uppercase tracking-wide bg-muted">ID: {{ activeContact.id }}</Badge>
                <Badge
                  variant="outline"
                  class="text-[10px] h-5 py-0 px-2 uppercase tracking-wide bg-muted"
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
                <SelectTrigger class="w-full rounded-xl border-border text-xs h-9 bg-background">
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
                <SelectTrigger class="w-full rounded-xl border-border text-xs h-9 bg-background">
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
          <div class="space-y-3.5 bg-muted/10 p-5 rounded-2xl border border-border/30">
            <h3 class="text-xs font-bold text-foreground uppercase tracking-wide">Standard Information</h3>
            
            <div class="grid grid-cols-3 gap-2 py-1 text-xs border-b border-border/20">
              <span class="text-muted-foreground">Email</span>
              <span class="col-span-2 text-foreground font-medium truncate flex items-center gap-1.5">
                <Mail class="w-3.5 h-3.5 text-muted-foreground" />
                {{ activeContact.email }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 py-1 text-xs border-b border-border/20">
              <span class="text-muted-foreground">Phone</span>
              <span class="col-span-2 text-foreground font-mono font-medium flex items-center gap-1.5">
                <Phone class="w-3.5 h-3.5 text-muted-foreground" />
                {{ activeContact.phone }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 py-1 text-xs border-b border-border/20">
              <span class="text-muted-foreground">Date Onboarded</span>
              <span class="col-span-2 text-foreground font-medium flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5 text-muted-foreground" />
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
                  class="text-[9px] h-4 py-0 px-1.5 font-normal bg-primary/10 text-primary border-primary/20"
                >
                  {{ t }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Notes Card -->
          <div class="space-y-2 bg-muted/10 p-5 rounded-2xl border border-border/30">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-bold text-foreground uppercase tracking-wide">Communication Notes</h3>
              <Button variant="ghost" size="xs" class="text-[10px] text-primary h-6 px-2 hover:bg-primary/10" @click="saveDrawerNotes">Save Notes</Button>
            </div>
            <Textarea
              v-model="activeContact.notes"
              placeholder="Record details about contract, requirements or general notes..."
              class="text-xs border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary min-h-[90px] bg-background"
            />
          </div>

          <!-- Log Activity Accordion -->
          <div class="border border-border rounded-2xl overflow-hidden bg-muted/10">
            <button
              @click="isLoggingActivity = !isLoggingActivity"
              class="w-full px-5 py-3.5 text-left text-xs font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <span class="flex items-center gap-1.5">
                <PlusCircle class="w-4 h-4 text-primary" />
                Log a Call, Email or Meeting
              </span>
              <span class="text-[10px] font-semibold text-primary uppercase">{{ isLoggingActivity ? 'Close' : 'Open' }}</span>
            </button>
            <div v-if="isLoggingActivity" class="p-5 border-t border-border bg-card space-y-3.5 animate-slide-in">
              <div class="grid grid-cols-2 gap-2.5">
                <div class="flex flex-col gap-1">
                  <label class="text-[9px] text-muted-foreground uppercase font-bold tracking-wide">Activity Type</label>
                  <Select v-model="logActivityType">
                    <SelectTrigger class="h-8 text-xs rounded-xl border-border bg-muted/30">
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
                    class="h-8 text-xs rounded-xl border-border bg-muted/30"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] text-muted-foreground uppercase font-bold tracking-wide">Summary / Conversation Notes</label>
                <Textarea
                  v-model="logActivityDesc"
                  placeholder="Record summary details..."
                  class="text-xs min-h-[60px] rounded-xl border-border bg-muted/30"
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
            <h3 class="text-xs font-bold text-foreground uppercase tracking-wide">Engagement Activity Timeline</h3>
            
            <div class="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-border">
              <div
                v-for="act in activeContact.activities"
                :key="act.id"
                class="relative"
              >
                <!-- Dot Icon indicator -->
                <div class="absolute -left-[21px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border bg-card" :class="[
                  act.type === 'call' ? 'border-primary/30 text-primary' : '',
                  act.type === 'email' ? 'border-info/30 text-info' : '',
                  act.type === 'meeting' ? 'border-tag-4/30 text-tag-4-foreground' : '',
                  act.type === 'note' ? 'border-warning/30 text-warning' : ''
                ]">
                  <PhoneCall v-if="act.type === 'call'" class="w-3 h-3" />
                  <Send v-else-if="act.type === 'email'" class="w-3 h-3" />
                  <Calendar v-else-if="act.type === 'meeting'" class="w-3 h-3" />
                  <FileText v-else class="w-3 h-3" />
                </div>

                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-bold text-foreground leading-none">{{ act.title }}</h4>
                    <span class="text-[10px] text-muted-foreground font-semibold">{{ act.timestamp }}</span>
                  </div>
                  <p class="text-xs text-muted-foreground leading-relaxed pr-2">{{ act.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="p-6 border-t border-border flex gap-3 bg-muted/10">
          <Button variant="outline" class="flex-1 rounded-xl shadow-sm cursor-pointer h-10 text-xs bg-background" @click="openEditDialog(activeContact!)">
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
      <DialogContent class="sm:max-w-[480px] p-0 rounded-2xl overflow-hidden border border-border bg-card">
        <DialogHeader class="px-6 pt-6 pb-4 border-b border-border text-left">
          <DialogTitle class="text-base font-bold text-foreground">
            {{ isEditing ? 'Edit Contact Profile' : 'Add New Contact' }}
          </DialogTitle>
          <p class="text-[11px] text-muted-foreground mt-0.5">Enter details regarding the contact. All primary details are saved to database.</p>
        </DialogHeader>

        <!-- Form fields -->
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Full Name -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Full Name *</label>
              <Input
                v-model="formState.name"
                type="text"
                placeholder="e.g. John Doe"
                class="rounded-xl border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
            <!-- Email -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Email Address *</label>
              <Input
                v-model="formState.email"
                type="email"
                placeholder="e.g. john@acme.com"
                class="rounded-xl border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Phone Number -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Phone Number *</label>
              <Input
                v-model="formState.phone"
                type="text"
                placeholder="e.g. +60 12-345 6789"
                class="rounded-xl border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
            <!-- Company -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Company Name</label>
              <Input
                v-model="formState.company"
                type="text"
                placeholder="e.g. Acme Corp"
                class="rounded-xl border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Job Title -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Job Title / Role</label>
              <Input
                v-model="formState.role"
                type="text"
                placeholder="e.g. Product Manager"
                class="rounded-xl border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
            <!-- Tags string -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Tags (comma-separated)</label>
              <Input
                v-model="formState.tagsString"
                type="text"
                placeholder="e.g. High-Value, Lead"
                class="rounded-xl border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Status -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Status</label>
              <Select v-model="formState.status">
                <SelectTrigger class="w-full rounded-xl border-border text-xs h-9 bg-background">
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
              <label class="text-xs font-bold text-foreground">Lifecycle Stage</label>
              <Select v-model="formState.lifecycleStage">
                <SelectTrigger class="w-full rounded-xl border-border text-xs h-9 bg-background">
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
            <label class="text-xs font-bold text-foreground">Notes / Details</label>
            <Textarea
              v-model="formState.notes"
              placeholder="Enter brief description or note regarding contact onboarding..."
              class="rounded-xl border-border focus-visible:ring-1 focus-visible:ring-primary text-xs min-h-[70px]"
            />
          </div>
        </div>

        <DialogFooter class="px-6 py-4 bg-muted/10 border-t border-border flex justify-end gap-2.5">
          <DialogClose as-child>
            <Button variant="ghost" class="rounded-xl text-xs h-9 px-4 cursor-pointer">Cancel</Button>
          </DialogClose>
          <Button variant="primary" class="rounded-xl text-xs h-9 px-4 cursor-pointer shadow-sm" @click="submitContactForm">
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 3-Step Import Contacts Modal (Step 1: CSV Upload -> Step 2: Column Matching -> Step 3: Success Summary) -->
    <Dialog v-model:open="isImportModalOpen">
      <DialogContent class="sm:max-w-[680px] p-0 rounded-2xl overflow-hidden border border-border bg-card">
        <DialogHeader class="px-6 pt-6 pb-4 border-b border-border text-left">
          <div class="flex items-center justify-between pr-6">
            <div>
              <DialogTitle class="text-base font-bold text-foreground flex items-center gap-2">
                <FileSpreadsheet class="w-4 h-4 text-primary" />
                Import Contacts from CSV
              </DialogTitle>
              <p class="text-xs text-muted-foreground mt-0.5">
                <span v-if="importStep === 1">Step 1 of 3 — Upload your CSV file or load the sample leads CSV.</span>
                <span v-else-if="importStep === 2">Step 2 of 3 — Match CSV columns to RakanSales CRM contact fields.</span>
                <span v-else>Step 3 of 3 — Import complete! Review summary below.</span>
              </p>
            </div>

            <!-- Step Pills -->
            <div class="flex items-center gap-1.5">
              <span
                v-for="s in [1, 2, 3]"
                :key="s"
                class="w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center border transition-all"
                :class="[
                  importStep === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : importStep > s
                      ? 'bg-success/15 text-success border-success/30'
                      : 'bg-muted text-muted-foreground border-border'
                ]"
              >
                <Check v-if="importStep > s" class="w-3.5 h-3.5" />
                <span v-else>{{ s }}</span>
              </span>
            </div>
          </div>
        </DialogHeader>

        <!-- STEP 1: CSV UPLOAD -->
        <div v-if="importStep === 1" class="p-6 space-y-5">
          <input
            ref="csvFileInputRef"
            type="file"
            accept=".csv,text/csv"
            class="hidden"
            @change="handleCsvFileUpload"
          />

          <!-- Dropzone / Upload Area -->
          <div
            @click="csvFileInputRef?.click()"
            class="border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
            :class="uploadedCsvFileName ? 'border-success/50 bg-success/5' : 'border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40'"
          >
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center border"
              :class="uploadedCsvFileName ? 'bg-success/10 text-success border-success/30' : 'bg-primary/10 text-primary border-primary/20'"
            >
              <CheckCircle v-if="uploadedCsvFileName" class="w-6 h-6" />
              <Upload v-else class="w-6 h-6" />
            </div>

            <div v-if="!uploadedCsvFileName" class="space-y-1">
              <p class="text-sm font-bold text-foreground">Click to upload a CSV file or drag and drop</p>
              <p class="text-xs text-muted-foreground">Supports standard .CSV files with headers (Name, Email, Phone, Company, Role, Label)</p>
            </div>

            <div v-else class="space-y-1">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-bold text-foreground">
                <FileSpreadsheet class="w-3.5 h-3.5 text-success" />
                <span>{{ uploadedCsvFileName }}</span>
                <span class="text-muted-foreground font-normal">({{ uploadedCsvFileSize }})</span>
              </div>
              <p class="text-xs text-success font-semibold">
                {{ parsedCsvRows.length - 1 }} sample contact rows detected and ready for column matching
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-2 pt-1" @click.stop>
              <Button
                variant="outline"
                size="xs"
                class="rounded-xl text-xs font-semibold gap-1.5 border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer h-8 px-3"
                @click="loadSampleCsvFile"
              >
                <Sparkles class="w-3.5 h-3.5" />
                {{ uploadedCsvFileName ? 'Reload Sample CSV (malaysia_q2_hot_leads.csv)' : 'Load Sample CSV (malaysia_q2_hot_leads.csv)' }}
              </Button>
              <Button
                variant="ghost"
                size="xs"
                class="rounded-xl text-xs text-muted-foreground hover:text-foreground cursor-pointer h-8 px-2.5"
                @click="downloadSampleCsvTemplate"
              >
                <Download class="w-3.5 h-3.5 mr-1" />
                Download Sample Template
              </Button>
            </div>
          </div>

          <!-- Detected Preview Strip -->
          <div v-if="uploadedCsvFileName && parsedCsvRows.length > 1" class="bg-muted/30 border border-border rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-foreground">Detected CSV Preview ({{ parsedCsvRows.length - 1 }} rows)</span>
              <span class="text-muted-foreground font-semibold">{{ parsedCsvRows[0].length }} columns</span>
            </div>
            <div class="text-[11px] text-muted-foreground truncate font-mono bg-card p-2 rounded-lg border border-border">
              Headers: {{ parsedCsvRows[0].join(' | ') }}
            </div>
          </div>
        </div>

        <!-- STEP 2: COLUMN MATCHING -->
        <div v-else-if="importStep === 2" class="p-6 space-y-4">
          <div class="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-3">
            <div class="flex items-center gap-2 text-xs">
              <FileSpreadsheet class="w-4 h-4 text-primary shrink-0" />
              <span class="font-bold text-foreground">{{ uploadedCsvFileName }}</span>
              <span class="text-muted-foreground">• {{ parsedCsvRows.length - 1 }} rows to import</span>
            </div>
            <Badge variant="outline" class="bg-success/10 text-success border-success/30 text-[10px] font-bold">
              {{ matchedColumnsCount }} of {{ csvColumnMappings.length }} Columns Matched
            </Badge>
          </div>

          <div class="border border-border rounded-2xl overflow-hidden max-h-[320px] overflow-y-auto">
            <Table class="w-full border-collapse">
              <TableHeader class="bg-muted/40 border-b border-border">
                <TableRow>
                  <TableHead class="py-2.5 pl-4 text-xs font-bold text-foreground">CSV Column Header</TableHead>
                  <TableHead class="py-2.5 text-xs font-bold text-foreground">Sample Row Preview</TableHead>
                  <TableHead class="py-2.5 text-xs font-bold text-foreground">CRM Field Match</TableHead>
                  <TableHead class="py-2.5 pr-4 text-right text-xs font-bold text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="col in csvColumnMappings"
                  :key="col.index"
                  class="border-b border-border/60 hover:bg-muted/20"
                >
                  <TableCell class="py-2.5 pl-4 font-mono text-xs font-bold text-foreground">
                    {{ col.csvHeader }}
                  </TableCell>
                  <TableCell class="py-2.5 text-xs text-muted-foreground max-w-[180px]">
                    <div class="truncate font-medium text-foreground">{{ col.sampleRow1 }}</div>
                    <div class="truncate text-[10px] text-muted-foreground">{{ col.sampleRow2 }}</div>
                  </TableCell>
                  <TableCell class="py-2.5">
                    <select
                      v-model="col.crmField"
                      class="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full"
                    >
                      <option v-for="opt in crmFieldOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                      </option>
                    </select>
                  </TableCell>
                  <TableCell class="py-2.5 pr-4 text-right">
                    <span
                      v-if="col.crmField !== 'skip'"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/30"
                    >
                      <Check class="w-3 h-3" />
                      Matched
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground"
                    >
                      Skipped
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- STEP 3: SUCCESS SUMMARY WITH COUNT -->
        <div v-else-if="importStep === 3" class="p-6 space-y-5">
          <div class="bg-success/10 border border-success/30 rounded-2xl p-5 flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-success text-success-foreground flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-base font-extrabold text-foreground">
                {{ importedContactsSummary.length }} Contacts Imported Successfully!
              </h3>
              <p class="text-xs text-muted-foreground mt-0.5">
                All {{ importedContactsSummary.length }} sample rows from <strong class="text-foreground">{{ uploadedCsvFileName }}</strong> have been matched and added to your Contacts list.
              </p>
            </div>
          </div>

          <!-- Count Breakdown Cards -->
          <div class="grid grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl bg-muted/30 border border-border text-center">
              <div class="text-2xl font-extrabold text-success">{{ importedContactsSummary.length }}</div>
              <div class="text-[11px] font-bold text-muted-foreground">New Contacts Added</div>
            </div>
            <div class="p-3.5 rounded-xl bg-muted/30 border border-border text-center">
              <div class="text-2xl font-extrabold text-foreground">{{ matchedColumnsCount }}</div>
              <div class="text-[11px] font-bold text-muted-foreground">Columns Matched</div>
            </div>
            <div class="p-3.5 rounded-xl bg-muted/30 border border-border text-center">
              <div class="text-2xl font-extrabold text-muted-foreground">0</div>
              <div class="text-[11px] font-bold text-muted-foreground">Failed / Skipped Rows</div>
            </div>
          </div>

          <!-- Preview of Newly Imported Contacts -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-foreground">Imported Contacts Added to List</div>
            <div class="border border-border rounded-xl divide-y divide-border max-h-[180px] overflow-y-auto bg-background">
              <div
                v-for="ic in importedContactsSummary"
                :key="ic.id"
                class="px-3.5 py-2.5 flex items-center justify-between text-xs"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-primary/20 shrink-0">
                    {{ ic.avatar }}
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-foreground truncate">{{ ic.name }}</div>
                    <div class="text-[10px] text-muted-foreground truncate">{{ ic.role }} • {{ ic.company }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="font-mono text-[11px] text-muted-foreground">{{ ic.email }}</span>
                  <Badge variant="outline" class="bg-success/10 text-success border-success/30 text-[9px] font-bold">
                    Imported
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <DialogFooter class="px-6 py-4 bg-muted/10 border-t border-border flex items-center justify-between gap-2.5">
          <template v-if="importStep === 1">
            <Button variant="ghost" class="rounded-xl text-xs h-9 px-4 cursor-pointer" @click="isImportModalOpen = false">
              Cancel
            </Button>
            <Button
              variant="primary"
              class="rounded-xl text-xs h-9 px-5 gap-1.5 cursor-pointer shadow-sm"
              @click="proceedToColumnMatching"
            >
              <span>Continue to Column Matching</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </Button>
          </template>

          <template v-else-if="importStep === 2">
            <Button variant="outline" class="rounded-xl text-xs h-9 px-4 gap-1.5 cursor-pointer" @click="importStep = 1">
              <ArrowLeft class="w-3.5 h-3.5" />
              Back
            </Button>
            <Button
              variant="primary"
              class="rounded-xl text-xs h-9 px-5 gap-1.5 cursor-pointer shadow-sm"
              @click="executeCsvImport"
            >
              <Check class="w-3.5 h-3.5" />
              <span>Import {{ parsedCsvRows.length - 1 }} Contacts</span>
            </Button>
          </template>

          <template v-else>
            <div></div>
            <Button
              variant="primary"
              class="rounded-xl text-xs h-9 px-6 gap-1.5 cursor-pointer shadow-sm"
              @click="isImportModalOpen = false"
            >
              <CheckCircle class="w-3.5 h-3.5" />
              <span>Done — View Contacts in List</span>
            </Button>
          </template>
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
