import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Form, 
  FormField, 
  FormTemplate, 
  Submission, 
  LogicRule, 
  FormStyles, 
  SubmitConfig, 
  AppliedFilters,
  FormFieldType
} from '@/types/webforms'

export function getLabel(item: any): string {
  if (item === null || item === undefined) return ''
  if (typeof item === 'string') return item
  if (typeof item === 'number' || typeof item === 'boolean') return String(item)
  if (typeof item === 'object') {
    return item.label || item.name || item.title || item.value || item.text || JSON.stringify(item)
  }
  return String(item)
}

export const INITIAL_FORMS: Form[] = [
  { id: '1', name: 'Product Feedback Survey 2026', status: 'Published', lastUpdated: '2026-04-20', views: 1240, starts: 850, submissions: 420, tags: ['Marketing', 'Research'], department: 'Product', owner: 'Alex Rivera', starred: true, description: 'Annual survey sent to all active product users.' },
  { id: '2', name: 'Lead Gen - Enterprise Demo', status: 'Published', lastUpdated: '2026-04-19', views: 3200, starts: 2100, submissions: 150, tags: ['Sales', 'High Intent'], department: 'Sales', owner: 'Sam Chen', starred: false, description: 'Primary intake form for enterprise prospects.' },
  { id: '3', name: 'Customer Support Request', status: 'Paused', lastUpdated: '2026-03-15', views: 890, starts: 600, submissions: 540, tags: ['Support'], department: 'Customer Success', owner: 'Alex Rivera', starred: false, description: 'Support intake form for incoming help requests.' },
  { id: '4', name: 'Webinar Registration - Q2', status: 'Draft', lastUpdated: '2026-04-18', views: 0, starts: 0, submissions: 0, tags: ['Marketing'], department: 'Marketing', owner: 'Jordan Smith', starred: true, description: 'Registration page for quarterly marketing webinar.' },
  { id: '5', name: 'Employee Onboarding Flow', status: 'Archived', lastUpdated: '2026-02-01', views: 450, starts: 440, submissions: 430, tags: ['HR'], department: 'People', owner: 'Alex Rivera', starred: false, description: 'Legacy employee onboarding intake.' },
  { id: '6', name: 'Event Feedback - Tech Summit', status: 'Published', lastUpdated: '2026-03-10', views: 2100, starts: 1800, submissions: 1200, tags: ['Marketing', 'Tech'], department: 'Marketing', owner: 'Sam Chen', starred: false, description: 'Post-event survey for Tech Summit attendees.' },
  { id: '7', name: 'Referral Program Application', status: 'Published', lastUpdated: '2026-03-14', views: 560, starts: 400, submissions: 80, tags: ['Growth'], department: 'Marketing', owner: 'Jordan Smith', starred: false, description: 'Partner referral signup form.' },
]

export const INITIAL_TEMPLATES: FormTemplate[] = [
  { 
    id: 'blank', 
    name: 'Blank Form', 
    description: 'Start with a simple form and build from there.', 
    category: 'General',
    fields: ['Email Address'],
    title: 'Untitled Form',
    intro: 'Start by collecting an email address and build from there.',
    usageCount: 1250,
    tags: ['Basic', 'Clean'],
    complexity: 'Simple',
    thumbnailColor: '#F2F4F7'
  },
  { 
    id: 'contact', 
    name: 'Contact Us', 
    description: 'Standard intake for general inquiries.', 
    category: 'General',
    fields: ['Full Name', 'Email Address', 'Subject', 'Message'],
    title: 'Contact Our Team',
    intro: 'Have a question? We typically respond within 24 hours.',
    usageCount: 840,
    tags: ['Support', 'Internal'],
    complexity: 'Medium',
    thumbnailColor: '#EBF5EE'
  },
  { 
    id: 'newsletter', 
    name: 'Newsletter Signup', 
    description: 'Simple capture for marketing updates.', 
    category: 'Marketing',
    fields: ['First Name', 'Email Address'],
    title: 'Stay in the Loop',
    intro: 'Subscribe to receive our latest insights and product updates.',
    usageCount: 2100,
    tags: ['Growth', 'Marketing'],
    complexity: 'Simple',
    thumbnailColor: '#EEF4FF'
  },
  { 
    id: 'demo', 
    name: 'Request a Demo', 
    description: 'Lead capture for sales walkthroughs.', 
    category: 'Sales',
    fields: ['Company Name', 'Job Title', 'Email Address', 'Team Size'],
    title: 'See RakanSales in Action',
    intro: 'Book a personalized walkthrough with one of our experts.',
    usageCount: 450,
    tags: ['Sales', 'Enterprise'],
    complexity: 'Advanced',
    thumbnailColor: '#FFF4ED'
  },
  { 
    id: 'webinar', 
    name: 'Webinar Registration', 
    description: 'Event capture for online sessions.', 
    category: 'Marketing',
    fields: ['Full Name', 'Email Address', 'Role', 'Company'],
    title: 'Mastering the Sales Funnel',
    intro: 'Register now for our live masterclass on conversion optimization.',
    usageCount: 120,
    tags: ['Events', 'Marketing'],
    complexity: 'Medium',
    thumbnailColor: '#F9F5FF'
  },
  { 
    id: 'support', 
    name: 'Support Request', 
    description: 'Structured intake for help desk tickets.', 
    category: 'Support',
    fields: ['Email Address', 'Issue Type', 'Priority', 'Details'],
    title: 'How can we help?',
    intro: 'Submit your request and our support team will get right on it.',
    usageCount: 3200,
    tags: ['Support', 'Internal'],
    complexity: 'Advanced',
    thumbnailColor: '#FEF3F2'
  },
  { 
    id: 'job', 
    name: 'Job Application', 
    description: 'Standard HR intake for candidates.', 
    category: 'HR / Admin',
    fields: ['Full Name', 'Email Address', 'Resume Link', 'LinkedIn Profile'],
    title: 'Join our Mission',
    intro: 'Tell us a bit about yourself and why you want to join RakanSales.',
    usageCount: 680,
    tags: ['HR', 'Recruiting'],
    complexity: 'Medium',
    thumbnailColor: '#F0F9FF'
  },
  { 
    id: 'feedback', 
    name: 'Product Feedback', 
    description: 'Collect user feedback on features.', 
    category: 'General',
    fields: ['Full Name', 'Email Address', 'Overall Rating', 'Product Feedback'],
    title: 'We Value Your Feedback',
    intro: 'Help us improve by sharing your thoughts and feature requests.',
    usageCount: 930,
    tags: ['Feedback', 'Product'],
    complexity: 'Simple',
    thumbnailColor: '#FDF2F8'
  }
]

export const INITIAL_SUBMISSIONS: Submission[] = [
  { id: 'SUB-1001', formId: '1', formName: 'Product Feedback Survey 2026', submittedAt: '2026-04-23T10:30:00Z', status: 'Completed', respondent: 'Sarah Jenkins', email: 'sarah.j@acmecorp.com', responsePreview: 'Product is great, but needs darker table headers...', createdOutcome: 'Contact + Conversation', duplicateFlag: false, answers: { 'Full Name': 'Sarah Jenkins', 'Email': 'sarah.j@acmecorp.com', 'Feedback': 'Product is great, but needs darker table headers' }, metadata: { 'IP Address': '192.168.1.1', 'Browser': 'Chrome 124 / macOS' } },
  { id: 'SUB-1002', formId: '1', formName: 'Product Feedback Survey 2026', submittedAt: '2026-04-23T09:15:00Z', status: 'Duplicate Flagged', respondent: 'Mike Ross', email: 'm.ross@pearson.com', responsePreview: 'Looking for enterprise pricing and dedicated support...', createdOutcome: 'Linked to Contact', duplicateFlag: true, answers: { 'Full Name': 'Mike Ross', 'Email': 'm.ross@pearson.com', 'Inquiry': 'Looking for enterprise pricing and dedicated support' }, metadata: { 'IP Address': '10.0.4.12', 'Browser': 'Safari 17 / iOS' } },
  { id: 'SUB-1003', formId: '1', formName: 'Product Feedback Survey 2026', submittedAt: '2026-04-22T16:45:00Z', status: 'Processing Failed', respondent: 'Unknown', email: 'test@test.com', responsePreview: 'Test submission with missing payload', createdOutcome: 'None', duplicateFlag: false, answers: { 'Email': 'test@test.com' }, metadata: { 'Error': 'Failed to resolve lead routing' } },
  { id: 'SUB-1004', formId: '1', formName: 'Product Feedback Survey 2026', submittedAt: '2026-04-22T11:20:00Z', status: 'Completed', respondent: 'Elena Rodriguez', email: 'elena@startup.io', responsePreview: 'Need help integrating with REST API endpoints', createdOutcome: 'Contact + Ticket', duplicateFlag: false, answers: { 'Full Name': 'Elena Rodriguez', 'Email': 'elena@startup.io', 'Topic': 'API Integration' }, metadata: { 'Browser': 'Firefox 125 / Linux' } },
  { id: 'SUB-1005', formId: '2', formName: 'Lead Gen - Enterprise Demo', submittedAt: '2026-04-21T14:10:00Z', status: 'Completed', respondent: 'David Chen', email: 'david.chen@techsolutions.com', responsePreview: 'Demo request for sales team of 50 reps', createdOutcome: 'Lead', duplicateFlag: false, answers: { 'Full Name': 'David Chen', 'Email': 'david.chen@techsolutions.com', 'Team Size': '50-100' }, metadata: { 'UTM Source': 'google_ads' } },
]

export const DEPARTMENTS = ['Sales', 'Marketing', 'Customer Success', 'HR', 'Support', 'Product', 'People']
export const OWNERS = ['Alex Rivera', 'Sam Chen', 'Jordan Smith', 'Sarah Jenkins', 'Marcus Chen']
export const CATEGORIES = ['All templates', 'General', 'Sales', 'Marketing', 'Support', 'HR / Admin']
export const PINNED_TAGS = ['Marketing', 'Tech', 'Sales', 'HR', 'Growth', 'Support']

export const useWebFormsStore = defineStore('webforms', () => {
  // --- STATE ---
  const forms = ref<Form[]>(INITIAL_FORMS)
  const templates = ref<FormTemplate[]>(INITIAL_TEMPLATES)
  const submissions = ref<Submission[]>(INITIAL_SUBMISSIONS)

  // Dashboard Filters State
  const activeView = ref<'Active' | 'Starred' | 'Archived'>('Active')
  const activeTab = ref<'All active' | 'My forms'>('All active')
  const searchQuery = ref<string>('')
  const appliedFilters = ref<AppliedFilters>({
    status: null,
    owner: null,
    department: null,
    tag: null,
    dateRange: 'all',
  })
  const selectedIds = ref<string[]>([])
  const isFilterModalOpen = ref(false)
  const isCreateModalOpen = ref(false)

  // Active Editor State
  const activeForm = ref<Form | null>(null)
  const editorFields = ref<FormField[]>([])
  const selectedElementId = ref<string | null>(null)
  const editorTab = ref<'Build' | 'Logic' | 'Style' | 'Submit' | 'Share' | 'Settings'>('Build')
  const viewportMode = ref<'desktop' | 'mobile'>('desktop')

  // Styling Config State
  const formStyles = ref<FormStyles>({
    primaryColor: '#23B750',
    radius: '12px',
    theme: 'Modern',
    fontFamily: 'Inter, sans-serif',
    pageBg: '#F9FAFB',
    formBg: '#ffffff',
    inputBg: '#F9FAFB',
    buttonStyle: 'Solid',
    fieldSpacing: 'Comfortable',
    formPadding: 'Comfortable',
    formWidth: 'Medium',
    cardStyle: true,
    containerShadow: 'Large',
    successAlignment: 'Center',
    successShowIcon: true,
  })

  // Submission / CRM Outcome Config State
  const submitConfig = ref<SubmitConfig>({
    successMode: 'message',
    successTitle: 'Thank you!',
    successBody: 'We have received your submission and will be in touch shortly.',
    successCtaLabel: 'Back to Home',
    successCtaUrl: 'https://example.com',
    redirectUrl: 'https://example.com/thank-you',
    redirectDelay: '3',
    primaryOutcome: 'Contact',
    linkedOutcomes: ['Conversation'],
    duplicateStrategy: 'new_flag',
    owner: 'Alex Rivera',
    team: 'Sales East',
    tags: ['Inbound Lead'],
    fieldMappings: {
      'Full Name': { object: 'Contact', field: 'Full Name', action: 'Overwrite' },
      'Email Address': { object: 'Contact', field: 'Email', action: 'Overwrite' },
    },
  })

  // Logic Rules State
  const logicRules = ref<LogicRule[]>([
    { id: '1', target: 'Priority', trigger: 'Issue Type', condition: 'is', comparison: 'Urgent', action: 'Show field', active: true }
  ])

  // Submissions View State
  const activeSubmission = ref<Submission | null>(null)
  const isSubmissionDrawerOpen = ref(false)

  const currentUser = 'Alex Rivera'

  // --- COMPUTED ---
  const counts = computed(() => ({
    active: forms.value.filter(f => f.status !== 'Archived').length,
    starred: forms.value.filter(f => f.starred && f.status !== 'Archived').length,
    archived: forms.value.filter(f => f.status === 'Archived').length,
    draft: forms.value.filter(f => f.status === 'Draft').length,
    published: forms.value.filter(f => f.status === 'Published').length,
    paused: forms.value.filter(f => f.status === 'Paused').length,
  }))

  const filteredForms = computed(() => {
    return forms.value.filter(form => {
      if (activeView.value === 'Starred' && !form.starred) return false
      if (activeView.value === 'Archived' && form.status !== 'Archived') return false
      if (activeView.value === 'Active' && form.status === 'Archived') return false
      if (appliedFilters.value.status && form.status !== appliedFilters.value.status) return false
      if (appliedFilters.value.owner && form.owner !== appliedFilters.value.owner) return false
      if (appliedFilters.value.tag && !form.tags.includes(appliedFilters.value.tag)) return false
      if (appliedFilters.value.department && form.department !== appliedFilters.value.department) return false

      if (appliedFilters.value.dateRange !== 'all') {
        const formDate = new Date(form.lastUpdated)
        const now = new Date()
        if (appliedFilters.value.dateRange === 'week') {
          const weekAgo = new Date(now.setDate(now.getDate() - 7))
          if (formDate < weekAgo) return false
        } else if (appliedFilters.value.dateRange === 'month') {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
          if (formDate < monthAgo) return false
        }
      }

      if (activeTab.value === 'My forms' && form.owner !== currentUser) return false

      const query = searchQuery.value.toLowerCase()
      if (query && !(
        form.name.toLowerCase().includes(query) ||
        form.owner.toLowerCase().includes(query) ||
        form.tags.some(t => getLabel(t).toLowerCase().includes(query))
      )) return false

      return true
    }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
  })

  const activeFilterCount = computed(() => {
    return Object.entries(appliedFilters.value).filter(([key, val]) => {
      if (key === 'dateRange') return val !== 'all'
      return val !== null
    }).length
  })

  // --- ACTIONS ---
  function toggleStar(id: string) {
    const f = forms.value.find(item => item.id === id)
    if (f) f.starred = !f.starred
  }

  function toggleSelectAll(checked: boolean) {
    selectedIds.value = checked ? filteredForms.value.map(f => f.id) : []
  }

  function toggleSelect(id: string) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter(i => i !== id)
    } else {
      selectedIds.value.push(id)
    }
  }

  function updateStatus(ids: string[], newStatus: Form['status']) {
    forms.value.forEach(f => {
      if (ids.includes(f.id)) f.status = newStatus
    })
    selectedIds.value = []
  }

  function deleteForms(ids: string[]) {
    forms.value = forms.value.filter(f => !ids.includes(f.id))
    selectedIds.value = []
  }

  function resetFilters() {
    appliedFilters.value = { status: null, owner: null, tag: null, department: null, dateRange: 'all' }
    searchQuery.value = ''
  }

  function removeFilter(key: keyof AppliedFilters) {
    if (key === 'dateRange') {
      appliedFilters.value.dateRange = 'all'
    } else {
      appliedFilters.value[key] = null
    }
  }

  function createFormFromTemplate(templateId: string): Form {
    const template = templates.value.find(t => t.id === templateId) || templates.value[0]
    const newForm: Form = {
      id: Date.now().toString(),
      name: template.name === 'Blank Form' ? 'Untitled Form' : template.name,
      status: 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      views: 0,
      starts: 0,
      submissions: 0,
      tags: [...template.tags],
      department: template.category === 'General' ? 'Sales' : template.category,
      owner: currentUser,
      starred: false,
      description: template.description
    }

    forms.value.unshift(newForm)
    activeForm.value = newForm
    editorFields.value = template.fields.map((f, idx) => {
      const fieldLabel = getLabel(f)
      const isEmail = fieldLabel.toLowerCase().includes('email')
      const isPhone = fieldLabel.toLowerCase().includes('phone')
      const isLong = fieldLabel.toLowerCase().includes('message') || fieldLabel.toLowerCase().includes('detail') || fieldLabel.toLowerCase().includes('inquiry')
      const isChoice = fieldLabel.toLowerCase().includes('select') || fieldLabel.toLowerCase().includes('size') || fieldLabel.toLowerCase().includes('type') || fieldLabel.toLowerCase().includes('role') || fieldLabel.toLowerCase().includes('priority') || fieldLabel.toLowerCase().includes('issue')
      
      const type: FormFieldType = isEmail ? 'email' : isPhone ? 'phone' : isLong ? 'longtext' : isChoice ? 'dropdown' : 'text'

      return {
        id: `field-${Date.now()}-${idx}`,
        label: fieldLabel,
        type,
        placeholder: `Enter ${fieldLabel.toLowerCase()}...`,
        required: idx === 0,
        width: 'full',
        options: isChoice ? [
          { label: `Option A for ${fieldLabel}`, value: `Option A` },
          { label: `Option B for ${fieldLabel}`, value: `Option B` }
        ] : undefined
      }
    })

    return newForm
  }

  function setFormToEdit(formId: string) {
    const existing = forms.value.find(f => f.id === formId)
    if (existing) {
      activeForm.value = existing
    } else {
      const template = templates.value.find(t => t.id === formId)
      if (template) {
        createFormFromTemplate(template.id)
        return
      }
      activeForm.value = forms.value[0]
    }

    if (editorFields.value.length === 0) {
      editorFields.value = [
        { id: 'f-1', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true, width: 'full' },
        { id: 'f-2', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true, width: 'full' },
        { id: 'f-3', label: 'Company Size', type: 'dropdown', required: false, width: 'full', options: [{ label: '1-10 Employees', value: '1-10' }, { label: '11-50 Employees', value: '11-50' }, { label: '50+ Employees', value: '50+' }] }
      ]
    }
  }

  function addField(type: FormField['type']) {
    const fieldCount = editorFields.value.length + 1
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: type === 'heading' ? 'Section Header' : type === 'paragraph' ? 'Instruction text...' : `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field ${fieldCount}`,
      type,
      placeholder: type.includes('text') || type === 'email' ? 'Enter text...' : undefined,
      required: false,
      width: 'full',
      options: ['dropdown', 'radio', 'checkbox'].includes(type) ? [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' }
      ] : undefined
    }

    editorFields.value.push(newField)
    selectedElementId.value = newField.id
  }

  function moveField(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index > 0) {
      const item = editorFields.value.splice(index, 1)[0]
      editorFields.value.splice(index - 1, 0, item)
    } else if (direction === 'down' && index < editorFields.value.length - 1) {
      const item = editorFields.value.splice(index, 1)[0]
      editorFields.value.splice(index + 1, 0, item)
    }
  }

  function duplicateField(id: string) {
    const idx = editorFields.value.findIndex(f => f.id === id)
    if (idx !== -1) {
      const source = editorFields.value[idx]
      const copy: FormField = JSON.parse(JSON.stringify(source))
      copy.id = `field-${Date.now()}`
      copy.label = `${copy.label} (Copy)`
      editorFields.value.splice(idx + 1, 0, copy)
      selectedElementId.value = copy.id
    }
  }

  function removeField(id: string) {
    editorFields.value = editorFields.value.filter(f => f.id !== id)
    if (selectedElementId.value === id) {
      selectedElementId.value = editorFields.value[0]?.id || null
    }
  }

  function cloneFormToTemplate(form: Form): FormTemplate {
    const newTemp: FormTemplate = {
      id: `template-${Date.now()}`,
      name: `${form.name} Template`,
      description: form.description || 'Custom cloned template from active form.',
      category: form.department || 'General',
      fields: editorFields.value.map(f => f.label),
      title: form.name,
      intro: 'Created from cloned custom form template.',
      usageCount: 0,
      tags: [...form.tags],
      complexity: editorFields.value.length > 8 ? 'Advanced' : editorFields.value.length > 4 ? 'Medium' : 'Simple',
      thumbnailColor: '#EBF5EE',
      state: 'Published',
      owner: form.owner,
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    templates.value.unshift(newTemp)
    return newTemp
  }

  return {
    forms,
    templates,
    submissions,
    activeView,
    activeTab,
    searchQuery,
    appliedFilters,
    selectedIds,
    isFilterModalOpen,
    isCreateModalOpen,
    activeForm,
    editorFields,
    selectedElementId,
    editorTab,
    viewportMode,
    formStyles,
    submitConfig,
    logicRules,
    activeSubmission,
    isSubmissionDrawerOpen,
    currentUser,
    counts,
    filteredForms,
    activeFilterCount,
    toggleStar,
    toggleSelectAll,
    toggleSelect,
    updateStatus,
    deleteForms,
    resetFilters,
    removeFilter,
    createFormFromTemplate,
    setFormToEdit,
    addField,
    moveField,
    duplicateField,
    removeField,
    cloneFormToTemplate
  }
})
