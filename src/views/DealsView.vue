<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Flame,
  Paperclip,
  MessageSquare,
  Clock,
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronDown,
  LayoutGrid,
  List,
  DollarSign,
  X,
  TrendingUp,
  FolderKanban,
  CheckCircle,
  FileText,
  User,
  Thermometer,
  AlertTriangle,
  Building2,
  Phone,
  Mail,
  Crown,
  Smile,
  CalendarDays,
  Link2,
  MapPin,
  BriefcaseBusiness,
  Send,
  Trophy,
  XCircle,
  UserX,
  Shuffle,
  Settings2,
  ArrowRight,
  Check,
  AlertCircle,
  UserCheck,
  Zap
} from 'lucide-vue-next'

// --- View State ---
const currentView = ref<'kanban' | 'list' | 'forecast'>('kanban')
const searchQuery = ref('')
const selectedPipeline = ref('Sales Pipeline')
const showAddDealModal = ref(false)
const showFiltersModal = ref(false)

// --- Filter State ---
const filterOwner = ref('')
const filterValueMin = ref<number | null>(null)
const activeFiltersCount = computed(() => {
  let count = 0
  if (filterOwner.value) count++
  if (filterValueMin.value !== null && filterValueMin.value > 0) count++
  return count || 1 // Defaults to 1 active filter initially to match mock design "Filters 1"
})

// --- New Deal Form ---
const newDeal = ref({
  title: '',
  clientName: '',
  owner: '',
  value: 0,
  description: '',
  hotLead: '1h',
  stage: 'New'
})

const agentAvatars = [
  '/avatars/agent_10_malay_male_coral.png',
  '/avatars/agent_11_chinese_female_mint.png',
  '/avatars/agent_12_indian_male_lavender.png',
  '/avatars/agent_13_malay_female_hijab_peach.png',
  '/avatars/agent_14_chinese_male_skyblue.png',
  '/avatars/agent_15_indian_female_yellow.png',
  '/avatars/agent_16_malay_male_teal.png',
  '/avatars/agent_17_chinese_female_sand.png',
  '/avatars/agent_18_malay_female_hijab_rose.png'
]

// --- Mock Data ---
const deals = ref([
  {
    id: 99,
    title: 'KK Steel Manufacturing Web Design',
    owner: 'Ahmad Faizal',
    value: 90000,
    description: 'Web Design',
    avatar: agentAvatars[1],
    attachments: 2,
    comments: 4,
    age: '3m',
    hotLead: 'Hot',
    stage: 'Qualifying',
    company: 'KK Steel Manufacturing Sdn Bhd',
    clientName: 'Mel Wong',
    closeDate: '22/05/2026',
    serviceType: 'Web Design',
    salesMotion: 'Inbound',
    urgency: 'Urgent',
    email: 'melwong@kksteel.com',
    phone: '+6012 3456 7890',
    insights: 'High potential lead. Last interaction 2 days ago via email regarding System integration compatibility for KK Steel. We\'re seeing high interest in pursuing SEO after the Web Design',
    longDescription: 'This lead seems important, we\'re looking at:\n\n1. The Wrong Person Gets the Lead Scenario: Lead goes to someone who\'s already overloaded instead of someone available. Post Hook: "Your best rep is drowning. Your worst rep has nothing to do." Angle: Lead distribution and fairness\n\n2. The Lead That Went to Competitor Scenario: Lead waits 48 hours for response, finds competitor in 2 hours. Post Hook: "They didn\'t choose your competitor. Your competitor just answered first." Angle: Speed and responsiveness\n\n3. The Team Chat Chaos (can after auto lead scoring) Scenario: 47 unread messages in team chat, nobody knows what\'s important. Post Hook: "Your team chat is a graveyard. Important deals are buried." Angle: Communication overload'
  },
  {
    id: 1,
    title: 'Tech Solutions Malaysia Sdn Bhd',
    owner: 'Ahmad Faizal',
    value: 35500,
    description: 'Cybersecurity Assessment',
    avatar: agentAvatars[0],
    attachments: 1,
    comments: 3,
    age: '10d',
    hotLead: '1h',
    stage: 'New'
  },
  {
    id: 2,
    title: 'Sistem Pintar Sdn Bhd',
    owner: 'Siti Nur Aisyah',
    value: 50000,
    description: 'Data Analytics',
    avatar: agentAvatars[1],
    attachments: 1,
    comments: 2,
    age: '15d',
    hotLead: '1.5h',
    stage: 'New'
  },
  {
    id: 3,
    title: 'Inovasi Digital Sdn Bhd',
    owner: 'Rajesh Kumar',
    value: 28000,
    description: 'Software Development',
    avatar: agentAvatars[2],
    attachments: 1,
    comments: 4,
    age: '5d',
    hotLead: '1h',
    stage: 'Acknowledged'
  },
  {
    id: 4,
    title: 'Harimau Ventures Group',
    owner: 'Lim Wei Jie',
    value: 33000,
    description: 'AI Implementation',
    avatar: agentAvatars[3],
    attachments: 1,
    comments: 4,
    age: '5d',
    hotLead: '1h',
    stage: 'Qualifying'
  },
  {
    id: 5,
    title: 'Tech Innovators Inc.',
    owner: 'Nurul Huda',
    value: 45000,
    description: 'Blockchain Research',
    avatar: agentAvatars[4],
    attachments: 2,
    comments: 3,
    age: '3w',
    hotLead: '2d',
    stage: 'Proposal / Quotation'
  },
  {
    id: 6,
    title: 'Kreatif IT Sdn Bhd',
    owner: 'Mohd Hafiz',
    value: 60000,
    description: 'IT Infrastructure Setup',
    avatar: agentAvatars[5],
    attachments: 1,
    comments: 1,
    age: '20d',
    hotLead: '4h',
    stage: 'Follow Up'
  },
  {
    id: 7,
    title: 'Solusi Teknologi Sdn Bhd',
    owner: 'Ahmad Faizal',
    value: 45000,
    description: 'Network Security',
    avatar: agentAvatars[6],
    attachments: 2,
    comments: 3,
    age: '8d',
    hotLead: '2h',
    stage: 'New'
  },
  {
    id: 8,
    title: 'E-Comm Solutions Sdn Bhd',
    owner: 'Siti Nur Aisyah',
    value: 38000,
    description: 'E-commerce Platform',
    avatar: agentAvatars[7],
    attachments: 1,
    comments: 2,
    age: '12d',
    hotLead: '1h',
    stage: 'New'
  },
  {
    id: 9,
    title: 'Aurora Tech Solutions',
    owner: 'Rajesh Kumar',
    value: 42000,
    description: 'Cloud Migration',
    avatar: agentAvatars[8],
    attachments: 1,
    comments: 2,
    age: '12d',
    hotLead: '1h',
    stage: 'Acknowledged'
  },
  {
    id: 10,
    title: 'Eco Solutions Ltd.',
    owner: 'Lim Wei Jie',
    value: 25000,
    description: 'Sustainable Energy',
    avatar: agentAvatars[0],
    attachments: 1,
    comments: 5,
    age: '7d',
    hotLead: '1w',
    stage: 'Qualifying'
  },
  {
    id: 11,
    title: 'Futuristic IT Sdn Bhd',
    owner: 'Nurul Huda',
    value: 55000,
    description: 'Cloud Backup Solutions',
    avatar: agentAvatars[1],
    attachments: 3,
    comments: 4,
    age: '9d',
    hotLead: '1.5h',
    stage: 'Proposal / Quotation'
  },
  {
    id: 12,
    title: 'Jaringan Pintar Sdn Bhd',
    owner: 'Mohd Hafiz',
    value: 30000,
    description: 'Web Development',
    avatar: agentAvatars[2],
    attachments: 1,
    comments: 3,
    age: '14d',
    hotLead: '1h',
    stage: 'Follow Up'
  },
  {
    id: 13,
    title: 'Sistem e-Dagang Sdn Bhd',
    owner: 'Ahmad Faizal',
    value: 48000,
    description: 'Mobile App Development',
    avatar: agentAvatars[3],
    attachments: 1,
    comments: 5,
    age: '11d',
    hotLead: '3h',
    stage: 'New'
  },
  {
    id: 14,
    title: 'Bina Data Berhad',
    owner: 'Siti Nur Aisyah',
    value: 29000,
    description: 'Data Analytics',
    avatar: agentAvatars[4],
    attachments: 1,
    comments: 5,
    age: '11d',
    hotLead: '3h',
    stage: 'New'
  },
  {
    id: 15,
    title: 'Creative Minds Agency',
    owner: 'Rajesh Kumar',
    value: 40000,
    description: 'Marketing Strategy',
    avatar: agentAvatars[5],
    attachments: 3,
    comments: 2,
    age: '2w',
    hotLead: '4d',
    stage: 'Qualifying'
  },
  {
    id: 16,
    title: 'Data Sains Malaysia Sdn Bhd',
    owner: 'Lim Wei Jie',
    value: 25000,
    description: 'Predictive Modeling',
    avatar: agentAvatars[6],
    attachments: 2,
    comments: 2,
    age: '7d',
    hotLead: '1h',
    stage: 'Qualifying'
  },
  {
    id: 17,
    title: 'Interaktif Media Sdn Bhd',
    owner: 'Nurul Huda',
    value: 33000,
    description: 'Digital Marketing',
    avatar: agentAvatars[7],
    attachments: 1,
    comments: 2,
    age: '13d',
    hotLead: '1.5h',
    stage: 'Proposal / Quotation'
  },
  {
    id: 18,
    title: 'Sistem Keselamatan Sdn Bhd',
    owner: 'Mohd Hafiz',
    value: 70000,
    description: 'Penetration Testing',
    avatar: agentAvatars[8],
    attachments: 1,
    comments: 1,
    age: '30d',
    hotLead: '4h',
    stage: 'Follow Up'
  },
  {
    id: 19,
    title: 'Acme Corp Sdn Bhd Web Design',
    owner: 'Ahmad Faizal',
    value: 35000,
    description: 'Web Design',
    avatar: agentAvatars[0],
    attachments: 1,
    comments: 2,
    age: '13d',
    hotLead: '1.5h',
    stage: 'New',
    clientName: 'Mei Ting',
    email: 'meiting@acmecorp.com.my',
    phone: '+6013 9876 5432'
  },
  {
    id: 20,
    title: 'HealthTech Innovations',
    owner: 'Siti Nur Aisyah',
    value: 50000,
    description: 'Telemedicine Project',
    avatar: agentAvatars[1],
    attachments: 2,
    comments: 4,
    age: '1w',
    hotLead: '5d',
    stage: 'New'
  },
  {
    id: 21,
    title: 'Sistem Komunikasi Berhad',
    owner: 'Rajesh Kumar',
    value: 40000,
    description: 'Telecommunications System',
    avatar: agentAvatars[2],
    attachments: 2,
    comments: 3,
    age: '6d',
    hotLead: '1h',
    stage: 'Qualifying'
  },
  {
    id: 22,
    title: 'Inovasi Lestari Sdn Bhd',
    owner: 'Lim Wei Jie',
    value: 37500,
    description: 'Green Technology',
    avatar: agentAvatars[3],
    attachments: 1,
    comments: 4,
    age: '10d',
    hotLead: '2d',
    stage: 'Qualifying'
  },
  {
    id: 23,
    title: 'Sistem Kewangan Sdn Bhd',
    owner: 'Nurul Huda',
    value: 49000,
    description: 'Fintech Integration',
    avatar: agentAvatars[4],
    attachments: 1,
    comments: 2,
    age: '12d',
    hotLead: '1h',
    stage: 'Proposal / Quotation'
  },
  {
    id: 24,
    title: 'Wawasan Teguh Sdn Bhd',
    owner: 'Ahmad Faizal',
    value: 51000,
    description: 'Building Construction',
    avatar: agentAvatars[5],
    attachments: 2,
    comments: 3,
    age: '14d',
    hotLead: '2h',
    stage: 'Follow Up'
  },
  {
    id: 25,
    title: 'Smart Agri Solutions',
    owner: 'Siti Nur Aisyah',
    value: 60000,
    description: 'Smart Farming IoT',
    avatar: agentAvatars[6],
    attachments: 1,
    comments: 3,
    age: '5d',
    hotLead: '3h',
    stage: 'Proposal / Quotation'
  }
])

// Post-process deals to ensure every deal has a clientName, email, and phone
const clientNamesPool = [
  'Muhammad Ali', 'Sarah Tan', 'Rajesh Ganesan', 'Lim Guan Eng', 'Nurul Izzah',
  'Mohd Faiz', 'Siti Aminah', 'Alex Wong', 'Tan Siew Kiat', 'Zainuddin',
  'Sharifah Hanim', 'Ganesan', 'Chong Wei', 'Farah Diana', 'Ravi Prasad',
  'Lee Chong', 'Hafiz Rahman', 'Sundaralingam', 'Wong Li', 'Azimah',
  'Selvaraj', 'Tan Siew', 'Azman Ali', 'Anita', 'Kumar'
]

deals.value.forEach((deal, index) => {
  if (!deal.clientName) {
    deal.clientName = clientNamesPool[index % clientNamesPool.length]
  }
  if (!deal.email) {
    const cleanClientName = deal.clientName.toLowerCase().replace(/\s+/g, '')
    deal.email = `${cleanClientName}@example.com`
  }
  if (!deal.phone) {
    deal.phone = `+6012 ${Math.floor(1000000 + Math.random() * 9000000)}`
  }
  // Assign a client avatar that is always different from the sales agent avatar
  if (!(deal as any).clientAvatar) {
    const agentIdx = agentAvatars.indexOf(deal.avatar)
    const clientOffset = (agentIdx >= 0 ? agentIdx : index) + 4 // offset by 4 to ensure different person
    ;(deal as any).clientAvatar = agentAvatars[clientOffset % agentAvatars.length]
  }
})

const loadCreatedDeals = () => {
  // Clear stale localStorage data from prior sessions to prevent duplicate cards
  localStorage.removeItem('rakansales_created_deals')
}
loadCreatedDeals()

// Deduplicate deals by ID (keep first occurrence)
const seenIds = new Set<number>()
deals.value = deals.value.filter(d => {
  if (seenIds.has(d.id)) return false
  seenIds.add(d.id)
  return true
})

const stages = ['New', 'Acknowledged', 'Qualifying', 'Proposal / Quotation', 'Follow Up']

// --- Drag Over State ---
const draggedOverStage = ref<string | null>(null)

// --- List View Sorting ---
const sortField = ref<'title' | 'value' | 'age'>('title')
const sortOrder = ref<'asc' | 'desc'>('asc')
const listStageFilter = ref<string>('All')

function toggleSort(field: 'title' | 'value' | 'age') {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const parseAgeInDays = (ageStr: string) => {
  const num = parseInt(ageStr) || 0
  if (ageStr.includes('m')) return num * 30
  if (ageStr.includes('w')) return num * 7
  return num
}

const sortedFilteredDeals = computed(() => {
  let list = filteredDeals.value
  if (listStageFilter.value !== 'All') {
    list = list.filter(d => d.stage === listStageFilter.value)
  }
  
  return [...list].sort((a, b) => {
    let valA: any = a[sortField.value]
    let valB: any = b[sortField.value]
    
    if (sortField.value === 'age') {
      valA = parseAgeInDays(a.age)
      valB = parseAgeInDays(b.age)
    }
    
    if (typeof valA === 'string') {
      return sortOrder.value === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA)
    } else {
      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    }
  })
})

// --- Forecast View State & Slider Scenario Analyst ---
const stageConfidence = ref<Record<string, number>>({
  'New': 10,
  'Acknowledged': 25,
  'Qualifying': 50,
  'Proposal / Quotation': 70,
  'Follow Up': 90
})

const forecastStats = computed(() => {
  const list = filteredDeals.value
  const total = list.reduce((sum, d) => sum + d.value, 0)
  const weightedTotal = list.reduce((sum, d) => {
    const confidence = stageConfidence.value[d.stage] ?? 0
    return sum + d.value * (confidence / 100)
  }, 0)
  const avg = list.length ? Math.round(total / list.length) : 0
  
  // Simulated overall project health win rate
  const lateStageCount = list.filter(d => ['Proposal / Quotation', 'Follow Up'].includes(d.stage)).length
  const winRate = list.length ? Math.round((lateStageCount / list.length) * 45 + 35) : 0
  
  return { total, weightedTotal, avg, winRate }
})

// --- Expanded Forecast Dashboard Computations ---
const activeDealsForForecast = computed(() => {
  return filteredDeals.value.filter(d => d.stage !== 'Lost')
})

const activeDealsCount = computed(() => activeDealsForForecast.value.length)

const pipelineValueSum = computed(() => {
  return activeDealsForForecast.value.reduce((sum, d) => sum + d.value, 0)
})

const wonDealsCount = computed(() => {
  return filteredDeals.value.filter(d => d.stage === 'Follow Up').length
})

const wonDealsValueSum = computed(() => {
  return filteredDeals.value.filter(d => d.stage === 'Follow Up').reduce((sum, d) => sum + d.value, 0)
})

const lostDealsCount = computed(() => {
  return filteredDeals.value.filter(d => d.stage === 'Lost').length
})

const lostDealsValueSum = computed(() => {
  return filteredDeals.value.filter(d => d.stage === 'Lost').reduce((sum, d) => sum + d.value, 0)
})

const monthlyRevenuePeriods = computed(() => {
  const julValue = Math.round(pipelineValueSum.value / 1000)
  return [
    { label: 'Feb 2026', value: 0, display: '0' },
    { label: 'Mar 2026', value: 222000, display: '222K' },
    { label: 'Apr 2026', value: 160000, display: '160K' },
    { label: 'May 2026', value: 248000, display: '248K' },
    { label: 'Jun 2026', value: 502000, display: '502K' },
    { label: 'Jul 2026', value: pipelineValueSum.value, display: `${julValue}K` }
  ]
})

const agentPerformanceStats = computed(() => {
  const statsList: any[] = []
  const agents = uniqueAgents.value.filter(a => a !== 'Everyone')
  
  agents.forEach(agentName => {
    const agentDeals = deals.value.filter(d => d.owner === agentName)
    if (agentDeals.length === 0) return
    
    const activeDeals = agentDeals.filter(d => d.stage !== 'Lost')
    const activeCount = activeDeals.length
    
    const breakdown: Record<string, number> = {}
    stages.forEach(stg => {
      breakdown[stg] = activeDeals.filter(d => d.stage === stg).length
    })
    breakdown['Won'] = agentDeals.filter(d => d.stage === 'Follow Up').length
    breakdown['Lost'] = agentDeals.filter(d => d.stage === 'Lost').length
    
    statsList.push({
      name: agentName,
      avatar: getAgentAvatar(agentName),
      activeCount,
      breakdown
    })
  })
  
  const unassignedDeals = deals.value.filter(d => !d.owner)
  if (unassignedDeals.length > 0) {
    const activeDeals = unassignedDeals.filter(d => d.stage !== 'Lost')
    const breakdown: Record<string, number> = {}
    stages.forEach(stg => {
      breakdown[stg] = activeDeals.filter(d => d.stage === stg).length
    })
    breakdown['Won'] = unassignedDeals.filter(d => d.stage === 'Follow Up').length
    breakdown['Lost'] = unassignedDeals.filter(d => d.stage === 'Lost').length
    statsList.push({
      name: 'Unassigned',
      avatar: '',
      activeCount: activeDeals.length,
      breakdown
    })
  }
  
  return statsList.sort((a, b) => b.activeCount - a.activeCount)
})

// --- Deal Reassignment Wizard (Agent Leaving Workflow) ---
const showExitWizardModal = ref(false)
const showKebabDropdown = ref(false)
const exitSelectedAgent = ref('')
const exitTargetAgent = ref('')
const exitAssignMode = ref<'single' | 'round_robin'>('single')
const isExecutingHandover = ref(false)
const handoverStep = ref(1)

const exitDealsCount = computed(() => {
  if (!exitSelectedAgent.value) return 0
  return deals.value.filter(d => d.owner === exitSelectedAgent.value).length
})

const exitDealsValue = computed(() => {
  if (!exitSelectedAgent.value) return 0
  return deals.value.filter(d => d.owner === exitSelectedAgent.value).reduce((sum, d) => sum + d.value, 0)
})

// Trigger offboarding wizard
function openExitWizard() {
  exitSelectedAgent.value = ''
  exitTargetAgent.value = ''
  exitAssignMode.value = 'single'
  handoverStep.value = 1
  isExecutingHandover.value = false
  showExitWizardModal.value = true
}

// Execute the agent offboarding and reassign their deals
function executeHandover() {
  if (!exitSelectedAgent.value) return
  
  isExecutingHandover.value = true
  
  setTimeout(() => {
    const departingDeals = deals.value.filter(d => d.owner === exitSelectedAgent.value)
    
    if (exitAssignMode.value === 'single') {
      if (!exitTargetAgent.value) return
      
      const newAvatar = getAgentAvatar(exitTargetAgent.value)
      deals.value.forEach(d => {
        if (d.owner === exitSelectedAgent.value) {
          d.owner = exitTargetAgent.value
          if (newAvatar) d.avatar = newAvatar
        }
      })
    } else {
      // Round Robin distribution among other active agents
      const otherAgents = uniqueAgents.value.filter(a => a !== 'Everyone' && a !== exitSelectedAgent.value && roundRobinActivePool.value[a] !== false)
      if (otherAgents.length === 0) {
        alert('Error: No active agents in Round Robin pool to distribute leads to!')
        isExecutingHandover.value = false
        return
      }
      
      // Distribute deals in rotation
      let queueIdx = 0
      deals.value.forEach(d => {
        if (d.owner === exitSelectedAgent.value) {
          const nextAgentName = otherAgents[queueIdx]
          d.owner = nextAgentName
          const newAvatar = getAgentAvatar(nextAgentName)
          if (newAvatar) d.avatar = newAvatar
          
          // Increment simulator counter
          leadsAssignedToday.value[nextAgentName] = (leadsAssignedToday.value[nextAgentName] || 0) + 1
          
          queueIdx = (queueIdx + 1) % otherAgents.length
        }
      })
    }
    
    isExecutingHandover.value = false
    handoverStep.value = 3
  }, 1200)
}

// --- Round Robin Assignment Pool & Intake Simulator ---
const showRoundRobinModal = ref(false)
const isRoundRobinEnabled = ref(true)

// Active status of agents inside round robin
const roundRobinActivePool = ref<Record<string, boolean>>({
  'Olivia Rhye': true,
  'Ahmad Faizal': true,
  'Siti Nur Aisyah': true,
  'Rajesh Kumar': true,
  'Lim Wei Jie': true,
  'Nurul Huda': true,
  'Mohd Hafiz': true,
  'Aishah Binti Ismail': true,
  'Kumaravelan': true,
  'Tan Mei Ling': true,
  'Zainal Abidin': true,
  'Sharifah Aina': true,
  'Gopal Raj': true,
  'Chong Wei Lun': true,
  'Farah Liyana': true,
  'Ravi Subramaniam': true,
  'Lee Xin Yi': true,
  'Hafizah Binti Rahman': true,
  'Sundar Raj': true,
  'Wong Li Na': true,
  'Nor Azimah': true,
  'Selvam': true,
  'Tan Siew Lin': true,
  'Azman Bin Ali': true,
  'Anita Joseph': true,
  'Kumar R.': true
})

// Number of leads assigned today
const leadsAssignedToday = ref<Record<string, number>>({
  'Olivia Rhye': 2,
  'Ahmad Faizal': 1,
  'Siti Nur Aisyah': 3,
  'Rajesh Kumar': 0,
  'Lim Wei Jie': 2
})

// Round robin rotation order (we shift from top, push to back)
const roundRobinQueue = ref<string[]>([
  'Olivia Rhye',
  'Siti Nur Aisyah',
  'Rajesh Kumar',
  'Lim Wei Jie',
  'Ahmad Faizal'
])

// Calculated active queue (only counts agents checked in pool)
const activeRoundRobinQueue = computed(() => {
  return roundRobinQueue.value.filter(agent => roundRobinActivePool.value[agent] !== false)
})

// Simulate an incoming lead routed via Round Robin
const isSimulatingLead = ref(false)
const simulatedLeadInfo = ref<any>(null)

function simulateLeadIntake() {
  if (!isRoundRobinEnabled.value) {
    alert('Please enable Round Robin Assignment first!')
    return
  }
  
  const pool = activeRoundRobinQueue.value
  if (pool.length === 0) {
    alert('No active agents available in the rotation pool!')
    return
  }
  
  isSimulatingLead.value = true
  simulatedLeadInfo.value = null
  
  setTimeout(() => {
    // 1. Get next agent
    const nextAgent = pool[0]
    
    // 2. Generate random lead templates
    const templates = [
      { title: 'Petronas Digital Transformation', desc: 'Enterprise Cloud & DevOps', value: 85000 },
      { title: 'CIMB Bank App Security Assessment', desc: 'Vulnerability Scan & Pentesting', value: 45000 },
      { title: 'Sime Darby smart IoT monitoring', desc: 'IoT Platform Integration', value: 65000 },
      { title: 'Maxis Commerce Portal Refresh', desc: 'UX Revamp & Checkout Refactor', value: 38000 },
      { title: 'Tenaga Nasional Data Engineering', desc: 'Kafka Analytics Infrastructure', value: 92000 }
    ]
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)]
    
    // 3. Create new deal
    const nextId = Math.max(...deals.value.map(d => d.id)) + 1
    const nextAvatar = getAgentAvatar(nextAgent)
    
    const newDealItem = {
      id: nextId,
      title: selectedTemplate.title,
      owner: nextAgent,
      value: selectedTemplate.value,
      description: selectedTemplate.desc,
      avatar: nextAvatar || '/avatars/agent_14_chinese_male_skyblue.png',
      attachments: 0,
      comments: 0,
      age: '1h',
      hotLead: 'Hot',
      stage: 'New',
      company: selectedTemplate.title + ' Corp',
      clientName: 'Automated Lead Intake',
      closeDate: '30/08/2026',
      serviceType: selectedTemplate.desc,
      salesMotion: 'Inbound',
      urgency: 'Urgent',
      email: 'sales@' + selectedTemplate.title.toLowerCase().replace(/\s+/g, '') + '.com',
      phone: '+60 3-2160 0000',
      insights: 'Lead automatically routed fairly via CRM Round Robin routing algorithm.',
      longDescription: 'This lead was generated automatically in real time using the Round Robin Lead Intake Simulator to showcase distribution integrity.'
    }
    
    // Add to deals list
    deals.value.unshift(newDealItem)
    
    // Update assigned count
    leadsAssignedToday.value[nextAgent] = (leadsAssignedToday.value[nextAgent] || 0) + 1
    
    // Rotate queue (move nextAgent to the back of the queue list)
    const originalIndex = roundRobinQueue.value.indexOf(nextAgent)
    if (originalIndex > -1) {
      roundRobinQueue.value.splice(originalIndex, 1)
      roundRobinQueue.value.push(nextAgent)
    }
    
    simulatedLeadInfo.value = {
      title: selectedTemplate.title,
      assignedTo: nextAgent,
      value: selectedTemplate.value
    }
    
    isSimulatingLead.value = false
  }, 1000)
}

// Colors matching the tags on top of columns
const stageColors: Record<string, { border: string; bg: string; text: string; headerBar: string }> = {
  New: { border: 'border-t-[#3b82f6]', bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', headerBar: 'bg-[#3b82f6]' },
  Acknowledged: { border: 'border-t-[#00D2C4]', bg: 'bg-[#00D2C4]/10', text: 'text-[#00D2C4]', headerBar: 'bg-[#00D2C4]' },
  Qualifying: { border: 'border-t-[#FFCC00]', bg: 'bg-[#FFCC00]/10', text: 'text-[#FFCC00]', headerBar: 'bg-[#FFCC00]' },
  'Proposal / Quotation': { border: 'border-t-[#FF8800]', bg: 'bg-[#FF8800]/10', text: 'text-[#FF8800]', headerBar: 'bg-[#FF8800]' },
  'Follow Up': { border: 'border-t-[#10B981]', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', headerBar: 'bg-[#10B981]' }
}

const getHeaderBarColor = (stage: string) => {
  const colors: Record<string, string> = {
    New: '#3b82f6',
    Acknowledged: '#00D2C4',
    Qualifying: '#FFCC00',
    'Proposal / Quotation': '#FF8800',
    'Follow Up': '#10B981'
  }
  return colors[stage] || '#3b82f6'
}

// --- Drag & Drop ---
const draggedDealId = ref<number | null>(null)

function handleDragStart(dealId: number) {
  draggedDealId.value = dealId
}

function handleDrop(stage: string) {
  if (draggedDealId.value !== null) {
    const deal = deals.value.find((d) => d.id === draggedDealId.value)
    if (deal) {
      deal.stage = stage
    }
    draggedDealId.value = null
  }
}

// --- Selection & Actions State ---
const selectedDealIds = ref<number[]>([])
const isBulkEditMode = ref(false)
const showThreeDotDropdown = ref(false)
const showAgentDropdown = ref(false)
const selectedAgentFilter = ref('Everyone')

// Unique list of agents derived from mockData owners
const uniqueAgents = computed(() => {
  const owners = new Set<string>()
  deals.value.forEach(d => {
    if (d.owner) owners.add(d.owner)
  })
  return ['Everyone', ...Array.from(owners).slice(0, 6)]
})

// Avatar mapping for agents dropdown list
const getAgentAvatar = (name: string) => {
  if (name === 'Everyone') return ''
  const deal = deals.value.find(d => d.owner === name)
  return deal ? deal.avatar : '/avatars/agent_14_chinese_male_skyblue.png'
}

// Bulk Selection
function selectAllDeals() {
  selectedDealIds.value = filteredDeals.value.map(d => d.id)
  isBulkEditMode.value = true
  showThreeDotDropdown.value = false
}

function clearSelection() {
  selectedDealIds.value = []
  isBulkEditMode.value = false
}

// Bulk Reassign Action
const showReassignModal = ref(false)
const reassignTargetAgent = ref('')

function performBulkReassign() {
  if (!reassignTargetAgent.value) return
  deals.value.forEach(d => {
    if (selectedDealIds.value.includes(d.id)) {
      d.owner = reassignTargetAgent.value
      // Also update avatar to match the reassigned agent's avatar
      const agentAvatar = getAgentAvatar(reassignTargetAgent.value)
      if (agentAvatar) {
        d.avatar = agentAvatar
      }
    }
  })
  clearSelection()
  showReassignModal.value = false
}

// Bulk restage action
const showBulkStageModal = ref(false)
const bulkTargetStage = ref('New')

function performBulkStageUpdate() {
  deals.value.forEach(d => {
    if (selectedDealIds.value.includes(d.id)) {
      d.stage = bulkTargetStage.value
    }
  })
  clearSelection()
  showBulkStageModal.value = false
}

// Bulk change urgency action
const showBulkUrgencyModal = ref(false)
const bulkTargetUrgency = ref('1h')

function performBulkUrgencyUpdate() {
  deals.value.forEach(d => {
    if (selectedDealIds.value.includes(d.id)) {
      d.hotLead = bulkTargetUrgency.value
    }
  })
  clearSelection()
  showBulkUrgencyModal.value = false
}

// Bulk delete action
function performBulkDelete() {
  if (confirm(`Are you sure you want to delete the ${selectedDealIds.value.length} selected deals?`)) {
    deals.value = deals.value.filter(d => !selectedDealIds.value.includes(d.id))
    clearSelection()
  }
}

function toggleCardSelection(dealId: number) {
  const idx = selectedDealIds.value.indexOf(dealId)
  if (idx > -1) {
    selectedDealIds.value.splice(idx, 1)
  } else {
    selectedDealIds.value.push(dealId)
  }
}

// --- Dynamic Calculations ---
const filteredDeals = computed(() => {
  return deals.value.filter((deal) => {
    // Search filter
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      deal.owner.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Agent dropdown filter (James Doe replacement)
    const matchesAgentDropdown = selectedAgentFilter.value === 'Everyone' || deal.owner === selectedAgentFilter.value

    // Owner filter
    const matchesOwner = filterOwner.value ? deal.owner === filterOwner.value : true

    // Minimum Value filter
    const matchesValue = filterValueMin.value ? deal.value >= filterValueMin.value : true

    return matchesSearch && matchesAgentDropdown && matchesOwner && matchesValue
  })
})

// Calculate values for each stage
const getStageDeals = (stage: string) => {
  return filteredDeals.value.filter((d) => d.stage === stage)
}

const getStageWeightedValueSum = (stage: string) => {
  // Simple Mock: weighted value matches sum of actual values for design matching RM 50k
  const total = getStageDeals(stage).reduce((sum, d) => sum + d.value, 0)
  if (total >= 1000) {
    return `RM ${(total / 1000).toFixed(0)}k`
  }
  return `RM ${total}`
}

// Statistics count
const dealStats = computed(() => {
  const total = deals.value.length
  const won = deals.value.filter((d) => d.stage === 'Follow Up').length
  const lost = 3 // static mock number for realistic dashboard experience
  return { total, won, lost }
})

// Add new deal submit
function submitNewDeal() {
  if (!newDeal.value.title || !newDeal.value.clientName || !newDeal.value.owner) return

  const nextId = Math.max(...deals.value.map((d) => d.id)) + 1
  deals.value.push({
    id: nextId,
    title: newDeal.value.title,
    clientName: newDeal.value.clientName,
    owner: newDeal.value.owner,
    value: Number(newDeal.value.value),
    description: newDeal.value.description || 'General Inquiry',
    avatar: getAgentAvatar(newDeal.value.owner),
    attachments: 0,
    comments: 0,
    age: '1d',
    hotLead: newDeal.value.hotLead || '2h',
    stage: newDeal.value.stage,
    email: `${newDeal.value.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
    phone: `+6012 ${Math.floor(1000000 + Math.random() * 9000000)}`
  })

  // Reset form
  newDeal.value = {
    title: '',
    clientName: '',
    owner: '',
    value: 0,
    description: '',
    hotLead: '1h',
    stage: 'New'
  }
  showAddDealModal.value = false
}

// Reset filters
function clearFilters() {
  filterOwner.value = ''
  filterValueMin.value = null
  showFiltersModal.value = false
}

// --- Deal Preview Modal State ---
const selectedDealForPreview = ref<any | null>(null)
const previewMainTab = ref('Deal Info')
const previewSubTab = ref('Notes')

// Collapsible section toggles (matching the green switches in mockup)
const showPreviewDealInfo = ref(true)
const showPreviewSalesInfo = ref(true)
const showPreviewContactInfo = ref(true)
const showPreviewCompanyInfo = ref(true)

// Notes database for deals
const newNoteText = ref('')
const dealNotes = ref<Record<number, Array<{ id: number; text: string; date: string }>>>({
  1: [
    { id: 101, text: "Contacted Ahmad. He requested a formal proposal by next Monday. Very interested in our assessment package.", date: "2 days ago" }
  ],
  11: [
    { id: 102, text: "Linda Teo requested the pricing details for the website's purchasing form and RSVP form requirements. Shared the draft quote.", date: "2 days ago" }
  ]
})

function addNoteToDeal() {
  if (!selectedDealForPreview.value || !newNoteText.value.trim()) return
  const dealId = selectedDealForPreview.value.id
  if (!dealNotes.value[dealId]) {
    dealNotes.value[dealId] = []
  }
  dealNotes.value[dealId].unshift({
    id: Date.now(),
    text: newNoteText.value,
    date: 'Just now'
  })
  newNoteText.value = ''
}


const currentStageIndex = computed(() => {
  if (!selectedDealForPreview.value) return -1;
  const stage = selectedDealForPreview.value.stage;
  if (stage === 'New') return 0;
  if (stage === 'Acknowledged') return 1;
  if (stage === 'Qualifying') return 2;
  if (stage === 'Proposal / Quotation') return 3;
  if (stage === 'Follow Up') return 4;
  if (stage === 'Lost') return 4;
  return -1;
});

function markPreviewDealWon() {
  if (selectedDealForPreview.value) {
    selectedDealForPreview.value.stage = 'Follow Up'
  }
}

function markPreviewDealLost() {
  if (selectedDealForPreview.value) {
    selectedDealForPreview.value.stage = 'Lost'
  }
}

function changePreviewDealOwner(newOwnerName: string) {
  if (selectedDealForPreview.value) {
    selectedDealForPreview.value.owner = newOwnerName;
    selectedDealForPreview.value.avatar = getAgentAvatar(newOwnerName);
  }
}

function handleOwnerChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  if (target) {
    changePreviewDealOwner(target.value);
  }
}


</script>

<template>
  <div class="h-[calc(100vh-52px)] flex flex-col bg-[#F3F4F6] text-gray-800 font-sans overflow-hidden">
    <!-- Selection Action Bar (Shown when isBulkEditMode is true) -->
    <header
      v-if="isBulkEditMode"
      class="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0 z-25 shadow-md text-white h-[53px]"
    >
      <div class="flex items-center gap-3">
        <!-- Close Selection Mode -->
        <button
          @click="clearSelection"
          class="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Cancel Bulk Edit"
        >
          <X class="w-4 h-4" />
        </button>
        <span class="text-xs font-bold">{{ selectedDealIds.length }} deals selected</span>
      </div>

      <!-- Action items -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Reassign Sales Agent -->
        <button
          @click="showReassignModal = true"
          class="flex items-center gap-1.5 bg-[#23B750] hover:bg-[#1f9f46] text-white font-bold text-xs px-2.5 py-1.5 rounded-md shadow-sm transition-all cursor-pointer animate-fade-in"
        >
          <User class="w-3.5 h-3.5" />
          Reassign Agent
        </button>

        <!-- Update Pipeline Stage -->
        <button
          @click="showBulkStageModal = true"
          class="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-md shadow-sm transition-all cursor-pointer animate-fade-in"
        >
          <FolderKanban class="w-3.5 h-3.5" />
          Update Stage
        </button>

        <!-- Update Urgency -->
        <button
          @click="showBulkUrgencyModal = true"
          class="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-md shadow-sm transition-all cursor-pointer animate-fade-in"
        >
          <Flame class="w-3.5 h-3.5" />
          Change Urgency
        </button>

        <!-- Delete Selected -->
        <button
          @click="performBulkDelete"
          class="flex items-center gap-1.5 bg-red-650 hover:bg-red-750 text-white font-bold text-xs px-2.5 py-1.5 rounded-md shadow-sm transition-all cursor-pointer animate-fade-in"
        >
          Delete Selected
        </button>

        <button
          @click="clearSelection"
          class="text-xs text-slate-400 hover:text-white font-bold px-2.5 py-1.5 border border-slate-800 hover:border-slate-700 rounded-md transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </header>

    <!-- Normal Dashboard Header -->
    <header
      v-else
      class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 z-20 shadow-sm h-[53px]"
    >
      <!-- Left side: View switchers, Add Deal, Stats -->
      <div class="flex items-center gap-3">
        <!-- View Toggle Buttons -->
        <div class="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
          <button
            @click="currentView = 'kanban'"
            :class="[
              'p-1.5 rounded-md transition-all cursor-pointer',
              currentView === 'kanban' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-900'
            ]"
            title="Kanban Board"
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
          <button
            @click="currentView = 'list'"
            :class="[
              'p-1.5 rounded-md transition-all cursor-pointer',
              currentView === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-900'
            ]"
            title="List View"
          >
            <List class="w-4 h-4" />
          </button>
          <button
            @click="currentView = 'forecast'"
            :class="[
              'p-1.5 rounded-md transition-all cursor-pointer',
              currentView === 'forecast' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-900'
            ]"
            title="Value Forecast"
          >
            <DollarSign class="w-4 h-4" />
          </button>
        </div>

        <!-- Add Deal Button -->
        <button
          @click="showAddDealModal = true"
          class="flex items-center gap-1.5 bg-[#23B750] hover:bg-[#1f9f46] text-white font-semibold text-xs px-3 py-1.5 rounded-md shadow-sm transition-all cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          Add Deal
        </button>

        <!-- Stats indicator -->
        <span class="text-xs text-gray-500 font-medium ml-2">
          D {{ dealStats.total }} • W {{ dealStats.won }} • T {{ dealStats.lost }}
        </span>
      </div>

      <!-- Center: Search input -->
      <div class="flex-1 max-w-md mx-6 relative">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for Deals"
          class="w-full pl-9 pr-12 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750] transition-all"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <span class="text-[9px] text-gray-400 font-semibold bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm">⌘K</span>
        </div>
      </div>

      <!-- Right side: Dropdowns, filter button, profile selection -->
      <div class="flex items-center gap-3 relative">
        <!-- Pipeline Select -->
        <div class="relative">
          <button class="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <span>{{ selectedPipeline }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        <!-- Filter trigger button -->
        <button
          @click="showFiltersModal = true"
          class="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-700 hover:bg-gray-55 transition-colors relative cursor-pointer"
        >
          <Filter class="w-3.5 h-3.5 text-gray-500" />
          <span>Filters</span>
          <span
            v-if="activeFiltersCount > 0"
            class="bg-[#EF4444] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ml-1"
          >
            {{ activeFiltersCount }}
          </span>
        </button>

        <!-- User profile mock selector / Agent Filter dropdown -->
        <div class="relative">
          <button
            @click="showAgentDropdown = !showAgentDropdown"
            class="flex items-center gap-2 hover:bg-gray-55 px-2 py-1 rounded-lg border border-gray-200 transition-colors bg-white text-gray-700 text-xs font-semibold cursor-pointer h-8"
          >
            <div class="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
              <img
                v-if="selectedAgentFilter !== 'Everyone'"
                :src="getAgentAvatar(selectedAgentFilter)"
                class="w-full h-full object-cover"
                alt="Avatar"
              />
              <User v-else class="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span>{{ selectedAgentFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>

          <!-- Dropdown List -->
          <div
            v-if="showAgentDropdown"
            class="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto py-1"
          >
            <button
              v-for="agent in uniqueAgents"
              :key="agent"
              @click="selectedAgentFilter = agent; showAgentDropdown = false"
              class="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-gray-55 transition-colors flex items-center gap-2 cursor-pointer"
              :class="selectedAgentFilter === agent ? 'bg-gray-50 text-[#23B750]' : 'text-gray-700'"
            >
              <div class="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                <img
                  v-if="agent !== 'Everyone'"
                  :src="getAgentAvatar(agent)"
                  class="w-full h-full object-cover"
                  alt="avatar"
                />
                <User v-else class="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span class="truncate">{{ agent }}</span>
            </button>
          </div>
        </div>

        <!-- Extra Action Menu -->
        <div class="relative">
          <button
            @click="showThreeDotDropdown = !showThreeDotDropdown"
            class="p-1.5 text-gray-400 hover:text-gray-655 rounded-md transition-colors cursor-pointer"
          >
            <MoreVertical class="w-4 h-4" />
          </button>

          <!-- Dropdown menu content -->
          <div
            v-if="showThreeDotDropdown"
            class="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1"
          >
            <button
              @click="selectAllDeals"
              class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-55 transition-colors cursor-pointer"
            >
              Select All Deals
            </button>
            <button
              @click="isBulkEditMode = true; showThreeDotDropdown = false"
              class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-55 transition-colors cursor-pointer"
            >
              Bulk Edit
            </button>
            <button
              @click="showThreeDotDropdown = false"
              class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-55 border-t border-gray-100 cursor-pointer"
            >
              Export Pipeline
            </button>

            <!-- Divider -->
            <div class="border-t border-gray-100 my-1"></div>

            <!-- Round Robin Settings -->
            <button
              @click="showRoundRobinModal = true; showThreeDotDropdown = false"
              class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-55 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Shuffle class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span class="flex-1">Round Robin Settings</span>
              <span v-if="isRoundRobinEnabled" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
            </button>

            <!-- Exit Handover Wizard -->
            <button
              @click="openExitWizard(); showThreeDotDropdown = false"
              class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-55 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserX class="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span>Exit Handover Wizard</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- MAIN WORKSPACE CONTENT CANVAS -->
    <div class="flex-1 overflow-x-auto overflow-y-hidden p-6 relative flex flex-col min-h-0 bg-[#F9FAFB]">
      <!-- Quick filter pills row (shown above all views) -->
      <div class="flex items-center gap-2 mb-4 overflow-x-auto pb-1.5 shrink-0 no-scrollbar select-none">
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 text-nowrap">Quick Filter:</span>
        <button
          v-for="agent in uniqueAgents"
          :key="agent"
          @click="selectedAgentFilter = agent"
          :class="[
            'flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all duration-150 cursor-pointer shadow-sm shrink-0',
            selectedAgentFilter === agent
              ? 'bg-[#23B750]/15 text-[#168638] border-[#23B750]'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          ]"
        >
          <div v-if="agent !== 'Everyone'" class="w-4 h-4 rounded-full overflow-hidden border border-gray-100 shrink-0">
            <img :src="getAgentAvatar(agent)" class="w-full h-full object-cover" />
          </div>
          <span>{{ agent }}</span>
        </button>

      </div>

      <!-- VIEW 1: KANBAN BOARD -->
      <div
        v-if="currentView === 'kanban'"
        class="flex-1 flex gap-5 select-none w-full pb-4 align-top animate-fade-in overflow-x-auto overflow-y-hidden min-h-0"
      >
        <!-- Columns loop -->
        <div
          v-for="stage in stages"
          :key="stage"
          class="flex-1 min-w-[250px] max-w-[320px] h-full flex flex-col bg-transparent"
          @dragover.prevent
          @dragenter="draggedOverStage = stage"
          @dragleave="draggedOverStage = null"
          @drop="handleDrop(stage); draggedOverStage = null"
          :style="draggedOverStage === stage ? { border: '2px dashed ' + getHeaderBarColor(stage), borderRadius: '16px', backgroundColor: getHeaderBarColor(stage) + '0d' } : {}"
        >
          <!-- Stage Column Header top stripe -->
          <div
            class="h-1.5 w-full rounded-full mb-3 shrink-0"
            :style="{ backgroundColor: getHeaderBarColor(stage) }"
          ></div>

          <!-- Column Header Text and Actions (No card background, no borders) -->
          <div class="px-1 mb-4 flex flex-col gap-1 shrink-0 w-full">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="font-extrabold text-sm text-gray-900 leading-none">{{ stage }}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">
                  {{ getStageDeals(stage).length }}
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  @click="newDeal.stage = stage; showAddDealModal = true"
                  class="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-655 transition-colors"
                >
                  <Plus class="w-3.5 h-3.5" />
                </button>
                <button class="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-655 transition-colors">
                  <MoreVertical class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <!-- Weighted values indicator -->
            <div class="text-[11px] text-gray-500 flex items-center gap-1">
              <span>Weighted value</span>
              <span class="text-[#23B750] font-semibold">{{ getStageWeightedValueSum(stage) }}</span>
            </div>
          </div>

          <!-- Cards body list -->
          <div class="flex-1 w-full overflow-y-auto space-y-2 pb-8 pr-1 min-h-0 flex flex-col items-center column-cards-list">
            <div
              v-for="deal in getStageDeals(stage)"
              :key="deal.id"
              draggable="true"
              @dragstart="handleDragStart(deal.id)"
              @click="isBulkEditMode ? toggleCardSelection(deal.id) : (selectedDealForPreview = deal)"
              class="w-full bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-[0_8px_20px_rgba(35,183,80,0.08)] hover:-translate-y-0.5 p-2.5 shadow-sm transition-all duration-200 cursor-pointer active:cursor-grabbing group relative flex flex-col gap-1.5 flex-shrink-0"
            >
              <!-- Card top line: Title, hot tag, menu -->
              <div class="flex items-center justify-between gap-1.5 w-full min-w-0">
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                  <!-- Checkbox for multi-select (only visible in Bulk Edit mode) -->
                  <input
                    v-if="isBulkEditMode"
                    type="checkbox"
                    :checked="selectedDealIds.includes(deal.id)"
                    @change.stop="toggleCardSelection(deal.id)"
                    class="w-3.5 h-3.5 text-[#23B750] border-gray-350 rounded focus:ring-[#23B750] cursor-pointer shrink-0"
                  />
                  <h3 class="font-bold text-xs text-gray-900 group-hover:text-[#23B750] transition-colors leading-tight truncate flex-1 min-w-0" :title="deal.title">
                    {{ deal.title }}
                  </h3>
                </div>
                <div class="flex items-center gap-0.5 shrink-0">
                  <div
                    v-if="deal.hotLead"
                    class="flex items-center gap-0.5 text-gray-500 bg-gray-50 border border-gray-200 px-1 py-0.2 rounded text-[8px] font-bold"
                  >
                    <Flame class="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{{ deal.hotLead }}</span>
                  </div>
                  <button class="text-gray-400 hover:text-gray-655 rounded" @click.stop>
                    <MoreVertical class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Client Name (not Sales Agent name) -->
              <div class="text-[10px] text-gray-400 font-semibold -mt-1 truncate w-full">
                {{ deal.clientName }}
              </div>

              <!-- Value Badge & Subtitle -->
              <div class="flex items-center gap-1.5 flex-wrap w-full min-w-0">
                <span class="border border-gray-200 bg-white text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm leading-none shrink-0 font-mono">
                  RM {{ deal.value.toLocaleString() }}
                </span>
                <span class="text-[10px] text-gray-300 font-semibold shrink-0">•</span>
                <span class="text-[10px] text-gray-500 truncate flex-1 min-w-0 leading-none">{{ deal.description }}</span>
              </div>

                            <div class="border-t border-gray-100 my-0.5 w-full"></div>
              <div class="flex items-center justify-between w-full min-w-0">
                <!-- Assignee Avatar -->
                <div class="w-5 h-5 rounded-full overflow-hidden border border-gray-100 bg-pink-100 flex items-center justify-center shrink-0">
                  <img :src="deal.avatar" class="w-full h-full object-cover" alt="owner" />
                </div>

                <!-- Icons container -->
                <div class="flex items-center gap-2 text-[10px] font-semibold text-gray-400 shrink-0">
                  <div class="flex items-center gap-0.5" title="Attachments">
                    <Paperclip class="w-3 h-3" />
                    <span>{{ deal.attachments }}</span>
                  </div>
                  <div class="flex items-center gap-0.5" title="Comments">
                    <MessageSquare class="w-3 h-3" />
                    <span>{{ deal.comments }}</span>
                  </div>
                  <div class="flex items-center gap-0.5" title="Days in pipeline">
                    <Clock class="w-3 h-3" />
                    <span>{{ deal.age }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty column indicator -->
            <div
              v-if="getStageDeals(stage).length === 0"
              class="border-2 border-dashed border-gray-300/60 rounded-xl p-8 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2 h-36 w-full"
            >
              <FolderKanban class="w-8 h-8 text-gray-300" />
              <span>Drag deals here</span>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: LIST VIEW -->
      <div v-else-if="currentView === 'list'" class="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm max-w-6xl w-full mx-auto min-h-0">
        <!-- List controls row -->
        <div class="px-6 py-4 border-b border-gray-255 flex items-center justify-between gap-4 bg-gray-50 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Stage Filter:</span>
            <select
              v-model="listStageFilter"
              class="bg-white border border-gray-250 rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750] cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option v-for="stg in stages" :key="stg" :value="stg">{{ stg }}</option>
            </select>
          </div>
          <div class="text-xs font-bold text-gray-500">
            Showing {{ sortedFilteredDeals.length }} deals
          </div>
        </div>

        <div class="overflow-x-auto overflow-y-auto flex-1">
          <table class="w-full text-left text-sm border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200 text-xs font-extrabold text-gray-505 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th class="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    :checked="selectedDealIds.length === sortedFilteredDeals.length && sortedFilteredDeals.length > 0"
                    @change="selectedDealIds.length === sortedFilteredDeals.length ? clearSelection() : selectAllDeals()"
                    class="w-3.5 h-3.5 text-[#23B750] border-gray-300 rounded focus:ring-[#23B750] cursor-pointer"
                  />
                </th>
                <th
                  @click="toggleSort('title')"
                  class="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                >
                  <div class="flex items-center gap-1.5">
                    <span>Deal Title</span>
                    <span class="text-[9.5px] text-gray-400 font-bold font-mono">
                      {{ sortField === 'title' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                    </span>
                  </div>
                </th>
                <th class="px-6 py-4">Client / Owner</th>
                <th class="px-6 py-4">Stage</th>
                <th
                  @click="toggleSort('value')"
                  class="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                >
                  <div class="flex items-center gap-1.5">
                    <span>Deal Value</span>
                    <span class="text-[9.5px] text-gray-400 font-bold font-mono">
                      {{ sortField === 'value' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                    </span>
                  </div>
                </th>
                <th class="px-6 py-4">Project Description</th>
                <th class="px-6 py-4">Urgency</th>
                <th
                  @click="toggleSort('age')"
                  class="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none text-right pr-8"
                >
                  <div class="flex items-center justify-end gap-1.5">
                    <span>Age</span>
                    <span class="text-[9.5px] text-gray-400 font-bold font-mono">
                      {{ sortField === 'age' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="deal in sortedFilteredDeals"
                :key="deal.id"
                @click="isBulkEditMode ? toggleCardSelection(deal.id) : (selectedDealForPreview = deal)"
                :class="[
                  'hover:bg-gray-50/75 transition-colors cursor-pointer',
                  selectedDealIds.includes(deal.id) ? 'bg-[#23B750]/5 hover:bg-[#23B750]/10' : ''
                ]"
              >
                <!-- Row select check box -->
                <td class="px-6 py-4 text-center" @click.stop>
                  <input
                    type="checkbox"
                    :checked="selectedDealIds.includes(deal.id)"
                    @change="toggleCardSelection(deal.id); isBulkEditMode = true"
                    class="w-3.5 h-3.5 text-[#23B750] border-gray-300 rounded focus:ring-[#23B750] cursor-pointer"
                  />
                </td>
                <td class="px-6 py-4 font-bold text-gray-900">{{ deal.title }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-gray-900 leading-normal">{{ deal.clientName }}</span>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <img :src="deal.avatar" class="w-3.5 h-3.5 rounded-full object-cover shrink-0" alt="avatar" />
                      <span class="text-[10px] font-semibold text-gray-500">{{ deal.owner }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="['text-[10px] font-bold px-2.5 py-0.5 rounded-full border', stageColors[deal.stage]?.bg, stageColors[deal.stage]?.text, 'border-current/10']">
                    {{ deal.stage }}
                  </span>
                </td>
                <td class="px-6 py-4 font-bold text-gray-900 font-mono">RM {{ deal.value.toLocaleString() }}</td>
                <td class="px-6 py-4 text-gray-500 text-xs">{{ deal.description }}</td>
                <td class="px-6 py-4">
                  <span class="flex items-center gap-1 text-xs text-amber-605 font-bold">
                    <Flame class="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {{ deal.hotLead }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-400 font-semibold text-xs text-right pr-8">{{ deal.age }}</td>
              </tr>
              <!-- Empty state row -->
              <tr v-if="sortedFilteredDeals.length === 0">
                <td colspan="8" class="px-6 py-12 text-center text-gray-400 text-xs font-bold">
                  No deals match the active filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VIEW 3: FORECAST VIEW (Sales & Analytics Dashboard) -->
      <div v-else-if="currentView === 'forecast'" class="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto animate-fade-in select-none max-w-7xl mx-auto w-full px-6 py-4">
        
        <!-- 1. Top KPI Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
          
          <!-- Card 1: Active Deals -->
          <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Active Deals</span>
            <span class="text-3xl font-semibold text-blue-605 mt-1">
              {{ activeDealsCount }}
            </span>
            <span class="text-xs text-gray-400 font-medium">closing in July 2026</span>
          </div>

          <!-- Card 2: Pipeline Value -->
          <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Pipeline Value</span>
            <span class="text-3xl font-semibold text-slate-900 mt-1">
              RM{{ pipelineValueSum.toLocaleString() }}
            </span>
            <span class="text-xs text-gray-400 font-medium">Total active deal value closing in July 2026</span>
          </div>

          <!-- Card 3: Won -->
          <div class="bg-[#E8F5E9]/40 rounded-2xl p-6 border border-emerald-250 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">Won</span>
            <span class="text-3xl font-semibold text-[#23B750] mt-1">
              RM{{ wonDealsValueSum.toLocaleString() }}
            </span>
            <span class="text-xs text-emerald-600/80 font-medium">{{ wonDealsCount }} deals closing in July 2026</span>
          </div>

          <!-- Card 4: Lost -->
          <div class="bg-[#FFEBEE]/40 rounded-2xl p-6 border border-red-200 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">Lost</span>
            <span class="text-3xl font-semibold text-red-600 mt-1">
              RM{{ lostDealsValueSum.toLocaleString() }}
            </span>
            <span class="text-xs text-red-505/80 font-medium">{{ lostDealsCount }} deals closing in July 2026</span>
          </div>

        </div>

        <!-- 2. Middle Row: Bar Chart & Pipeline Funnel -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-5 shrink-0">
          
          <!-- Bar Chart Widget (col-span-3) -->
          <div class="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black text-slate-900 leading-none">Monthly revenue — Jul 2026</h3>
                <span class="text-[10px] text-gray-400 font-bold mt-1.5 block">Last 6 periods • MYR</span>
              </div>
              <!-- Legend -->
              <div class="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded bg-[#23B750]"></span> Current
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded bg-gray-300"></span> Previous
                </span>
              </div>
            </div>

            <!-- Chart Columns Container -->
            <div class="h-44 flex items-end justify-between px-6 pt-6 pb-2 border-b border-gray-100 relative mt-2">
              <div
                v-for="period in monthlyRevenuePeriods"
                :key="period.label"
                class="flex flex-col items-center flex-1 h-full justify-end group relative"
              >
                <!-- Value label on top -->
                <span class="text-[10px] font-extrabold text-slate-800 mb-1 opacity-100 transition-opacity">
                  {{ period.display }}
                </span>
                
                <!-- Bar representation -->
                <div
                  class="bg-[#23B750] w-12 rounded-t-md transition-all duration-300 hover:opacity-90 hover:scale-x-105 cursor-pointer"
                  :style="{
                    height: period.value > 0 
                      ? `${Math.max(5, (period.value / 600000) * 100)}%` 
                      : '2px'
                  }"
                ></div>
              </div>
            </div>

            <!-- X-axis Labels -->
            <div class="flex justify-between px-6 text-[10px] font-bold text-gray-400">
              <span
                v-for="period in monthlyRevenuePeriods"
                :key="period.label"
                class="flex-1 text-center truncate"
              >
                {{ period.label }}
              </span>
            </div>
          </div>

          <!-- Pipeline Funnel Widget (col-span-1) -->
          <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div>
              <h3 class="text-sm font-black text-slate-900 leading-none">Pipeline funnel</h3>
              <span class="text-[10px] text-gray-400 font-bold mt-1.5 block">Active deals • count & value</span>
            </div>

            <div class="flex-1 flex flex-col justify-between gap-4 mt-2">
              <div v-for="stage in stages" :key="stage" class="flex flex-col gap-1 w-full">
                <div class="flex items-center justify-between text-[11px] font-extrabold text-slate-800">
                  <span class="truncate max-w-[110px]" :title="stage">{{ stage }}</span>
                  <span class="font-mono text-gray-500">
                    {{ getStageDeals(stage).reduce((sum, d) => sum + d.value, 0) >= 1000000 
                      ? `${(getStageDeals(stage).reduce((sum, d) => sum + d.value, 0) / 1000000).toFixed(1)}M` 
                      : getStageDeals(stage).reduce((sum, d) => sum + d.value, 0) >= 1000 
                        ? `${(getStageDeals(stage).reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(0)}K` 
                        : '0' 
                    }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <!-- Blue Count Badge -->
                  <span class="bg-blue-600/10 text-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                    {{ getStageDeals(stage).length }} deals
                  </span>

                  <!-- Funnel progress bar representation -->
                  <div class="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                    <div
                      class="bg-blue-500 h-full rounded-full transition-all duration-300"
                      :style="{
                        width: `${(getStageDeals(stage).length / Math.max(1, activeDealsCount)) * 100}%`
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 3. Bottom Row: Agent Performance -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-5 shrink-0">
          <div>
            <h3 class="text-sm font-black text-slate-900 leading-none">Agent Performance</h3>
            <span class="text-[10px] text-gray-400 font-bold mt-1.5 block">Active deals by stage per agent • July 2026</span>
          </div>

          <!-- Color Legends row -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-50 pb-3 text-[9px] font-extrabold text-gray-500 uppercase tracking-wider select-none shrink-0">
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded bg-[#3b82f6]"></span> New Leads
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded bg-[#00D2C4]"></span> Acknowledged
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded bg-[#FFCC00]"></span> Qualifying
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded bg-[#FF8800]"></span> Proposal / Quotation
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded bg-[#10B981]"></span> Follow up / Negotiation
            </span>
          </div>

          <!-- Performance Table/List -->
          <div class="space-y-4 pt-1 w-full">
            <div
              v-for="agent in agentPerformanceStats"
              :key="agent.name"
              class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center w-full min-w-0"
            >
              <!-- Agent column (2/12 col span) -->
              <div class="md:col-span-2 flex items-center gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden border border-gray-150 shrink-0">
                  <img
                    v-if="agent.avatar"
                    :src="agent.avatar"
                    class="w-full h-full object-cover"
                    alt="Agent Avatar"
                  />
                  <User v-else class="w-4 h-4 text-gray-500" />
                </div>
                <span class="text-xs font-bold text-slate-800 truncate">{{ agent.name }}</span>
              </div>

              <!-- Active count (1/12 col span) -->
              <div class="md:col-span-1 shrink-0 flex flex-col justify-center">
                <span class="text-xs font-black text-slate-900 leading-none">{{ agent.activeCount }}</span>
                <span class="text-[8px] text-gray-400 font-extrabold uppercase mt-0.5 tracking-wider leading-none">Active</span>
              </div>

              <!-- Stacked progress bar breakdown (9/12 col span) -->
              <div class="md:col-span-9 flex items-center w-full min-w-0">
                <div class="h-6 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner border border-gray-100">
                  <!-- Segment: New -->
                  <div
                    v-if="agent.breakdown['New'] > 0"
                    class="bg-[#3b82f6] h-full transition-all duration-300 cursor-pointer hover:opacity-90 flex items-center justify-center"
                    :style="{ width: `${(agent.breakdown['New'] / agent.activeCount) * 100}%` }"
                    :title="`New Leads: ${agent.breakdown['New']} deals`"
                  ></div>
                  <!-- Segment: Acknowledged -->
                  <div
                    v-if="agent.breakdown['Acknowledged'] > 0"
                    class="bg-[#00D2C4] h-full transition-all duration-300 cursor-pointer hover:opacity-90 flex items-center justify-center"
                    :style="{ width: `${(agent.breakdown['Acknowledged'] / agent.activeCount) * 100}%` }"
                    :title="`Acknowledged: ${agent.breakdown['Acknowledged']} deals`"
                  ></div>
                  <!-- Segment: Qualifying -->
                  <div
                    v-if="agent.breakdown['Qualifying'] > 0"
                    class="bg-[#FFCC00] h-full transition-all duration-300 cursor-pointer hover:opacity-90 flex items-center justify-center"
                    :style="{ width: `${(agent.breakdown['Qualifying'] / agent.activeCount) * 100}%` }"
                    :title="`Qualifying: ${agent.breakdown['Qualifying']} deals`"
                  ></div>
                  <!-- Segment: Proposal / Quotation -->
                  <div
                    v-if="agent.breakdown['Proposal / Quotation'] > 0"
                    class="bg-[#FF8800] h-full transition-all duration-300 cursor-pointer hover:opacity-90 flex items-center justify-center"
                    :style="{ width: `${(agent.breakdown['Proposal / Quotation'] / agent.activeCount) * 100}%` }"
                    :title="`Proposal / Quotation: ${agent.breakdown['Proposal / Quotation']} deals`"
                  ></div>
                  <!-- Segment: Follow Up / Negotiation -->
                  <div
                    v-if="agent.breakdown['Follow Up'] > 0"
                    class="bg-[#10B981] h-full transition-all duration-300 cursor-pointer hover:opacity-90 flex items-center justify-center"
                    :style="{ width: `${(agent.breakdown['Follow Up'] / agent.activeCount) * 100}%` }"
                    :title="`Follow Up / Negotiation: ${agent.breakdown['Follow Up']} deals`"
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- ──────────────────────────────────────────────────────────────────
         MODALS
         ────────────────────────────────────────────────────────────────── -->
    <div
      v-if="showAddDealModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        <header class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Plus class="w-4 h-4 text-[#23B750]" />
            Create New Deal
          </h3>
          <button @click="showAddDealModal = false" class="text-gray-400 hover:text-gray-655 rounded cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </header>

        <form @submit.prevent="submitNewDeal" class="p-6 space-y-4 text-xs font-semibold">
          <div class="space-y-1">
            <label class="block text-gray-700">Deal / Company Title</label>
            <input
              v-model="newDeal.title"
              type="text"
              required
              placeholder="e.g. Acme Corporation"
              class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-gray-700">Client Name</label>
              <input
                v-model="newDeal.clientName"
                type="text"
                required
                placeholder="e.g. Mei Ting"
                class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-gray-700">Sales Agent / Owner</label>
              <select
                v-model="newDeal.owner"
                required
                class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
              >
                <option value="" disabled>Select agent...</option>
                <option v-for="agent in uniqueAgents.filter(a => a !== 'Everyone')" :key="agent" :value="agent">
                  {{ agent }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-gray-700">Deal Value (RM)</label>
              <input
                v-model="newDeal.value"
                type="number"
                required
                placeholder="e.g. 50000"
                class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-gray-700">Pipeline Stage</label>
              <select
                v-model="newDeal.stage"
                class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
              >
                <option v-for="stg in stages" :key="stg" :value="stg">{{ stg }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-gray-700">Deal description</label>
            <input
              v-model="newDeal.description"
              type="text"
              placeholder="e.g. Cloud Migration / Implementation"
              class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
            />
          </div>

          <footer class="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              @click="showAddDealModal = false"
              class="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#23B750] text-white rounded-lg hover:bg-[#1f9f46] transition-colors"
            >
              Create Deal
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- MODALS: FILTERS -->
    <div
      v-if="showFiltersModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        <header class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Filter class="w-4 h-4 text-[#23B750]" />
            Filter Deals
          </h3>
          <button @click="showFiltersModal = false" class="text-gray-400 hover:text-gray-600 rounded">
            <X class="w-4 h-4" />
          </button>
        </header>

        <div class="p-6 space-y-4 text-xs font-semibold">
          <div class="space-y-1">
            <label class="block text-gray-700">Filter by Contact Owner</label>
            <input
              v-model="filterOwner"
              type="text"
              placeholder="e.g. Ahmad Faizal"
              class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-gray-700">Minimum Deal Value (RM)</label>
            <input
              v-model="filterValueMin"
              type="number"
              placeholder="e.g. 30000"
              class="w-full p-2 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none"
            />
          </div>

          <footer class="pt-4 border-t border-gray-100 flex justify-between gap-2">
            <button
              type="button"
              @click="clearFilters"
              class="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              @click="showFiltersModal = false"
              class="px-4 py-2 bg-[#23B750] text-white rounded-lg hover:bg-[#1f9f46] transition-colors"
            >
              Apply Filters
            </button>
          </footer>
        </div>
      </div>
    </div>

    <!-- MODALS: REASSIGN AGENT -->
    <div
      v-if="showReassignModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        <header class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
            <User class="w-4 h-4 text-[#23B750]" />
            Reassign Sales Agent
          </h3>
          <button @click="showReassignModal = false" class="text-gray-400 hover:text-gray-600 rounded cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </header>

        <form @submit.prevent="performBulkReassign" class="p-6 space-y-4 text-xs font-semibold">
          <div class="space-y-1">
            <label class="block text-gray-700">Select New Agent</label>
            <select
              v-model="reassignTargetAgent"
              required
              class="w-full p-2.5 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
            >
              <option value="" disabled>Select an agent...</option>
              <option
                v-for="agent in uniqueAgents.filter(a => a !== 'Everyone')"
                :key="agent"
                :value="agent"
              >
                {{ agent }}
              </option>
            </select>
          </div>

          <footer class="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              @click="showReassignModal = false"
              class="px-4 py-2 border border-gray-250 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#23B750] text-white rounded-lg hover:bg-[#1f9f46] transition-colors cursor-pointer"
            >
              Reassign
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- MODALS: BULK UPDATE STAGE -->
    <div
      v-if="showBulkStageModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        <header class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
            <FolderKanban class="w-4 h-4 text-[#23B750]" />
            Bulk Update Stage
          </h3>
          <button @click="showBulkStageModal = false" class="text-gray-400 hover:text-gray-600 rounded cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </header>

        <form @submit.prevent="performBulkStageUpdate" class="p-6 space-y-4 text-xs font-semibold">
          <div class="space-y-1">
            <label class="block text-gray-700">Select New Pipeline Stage</label>
            <select
              v-model="bulkTargetStage"
              required
              class="w-full p-2.5 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
            >
              <option v-for="stg in stages" :key="stg" :value="stg">{{ stg }}</option>
            </select>
          </div>

          <footer class="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              @click="showBulkStageModal = false"
              class="px-4 py-2 border border-gray-250 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#23B750] text-white rounded-lg hover:bg-[#1f9f46] transition-colors cursor-pointer"
            >
              Update Stage
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- MODALS: BULK UPDATE URGENCY -->
    <div
      v-if="showBulkUrgencyModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        <header class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Flame class="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            Bulk Change Urgency
          </h3>
          <button @click="showBulkUrgencyModal = false" class="text-gray-400 hover:text-gray-600 rounded cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </header>

        <form @submit.prevent="performBulkUrgencyUpdate" class="p-6 space-y-4 text-xs font-semibold">
          <div class="space-y-1">
            <label class="block text-gray-700">Select Urgency / Hot Lead Time</label>
            <select
              v-model="bulkTargetUrgency"
              required
              class="w-full p-2.5 border border-gray-250 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
            >
              <option value="1h">1 Hour (Hot Lead)</option>
              <option value="1.5h">1.5 Hours</option>
              <option value="2h">2 Hours</option>
              <option value="3h">3 Hours</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day (Warm Lead)</option>
              <option value="2d">2 Days</option>
              <option value="5d">5 Days</option>
              <option value="1w">1 Week (Cold Lead)</option>
            </select>
          </div>

          <footer class="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              @click="showBulkUrgencyModal = false"
              class="px-4 py-2 border border-gray-250 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#23B750] text-white rounded-lg hover:bg-[#1f9f46] transition-colors cursor-pointer"
            >
              Change Urgency
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- ────────────────────────────────────────────────────────────────── 
         DEAL PREVIEW WIREFRAME
         ──────────────────────────────────────────────────────────────────  -->
    <Transition name="modal">
      <div
        v-if="selectedDealForPreview"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
        @click.self="selectedDealForPreview = null"
      >
        <!-- Modal Card — Centered floating container matching reference proportions -->
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="deal-preview-title"
          class="modal-card deal-preview-compact flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#F7F8FA] shadow-[0_32px_90px_rgba(15,23,42,0.28)] transition-all duration-200"
        >


          <!-- ── MODAL HEADER ────────────────────────────────── -->
          <header class="flex-shrink-0 bg-white px-5 py-5 sm:px-8 sm:py-6">
            <!-- Row 1: Title + Action Buttons -->
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h2 id="deal-preview-title" class="truncate text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-2xl">
                  {{ selectedDealForPreview.title }}
                </h2>
                <!-- Metadata badges row -->
                <div class="mt-2.5 flex flex-wrap items-center gap-2.5 text-sm text-slate-500">
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600">
                    <Flame class="h-3.5 w-3.5 fill-orange-500 text-orange-500" /> Hot
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600">
                    <AlertTriangle class="h-3.5 w-3.5 text-slate-400" /> Urgent
                  </span>
                  <span class="inline-flex min-w-0 items-center gap-1.5 px-1 font-medium">
                    <Building2 class="h-3.5 w-3.5 shrink-0 text-slate-400" /> <span class="truncate">{{ selectedDealForPreview.title }}</span>
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button
                  @click="markPreviewDealWon"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-sm',
                    selectedDealForPreview.stage === 'Follow Up'
                      ? 'bg-[#23B750] text-white border-[#23B750] opacity-80 cursor-not-allowed'
                      : 'bg-[#23B750] text-white border-[#23B750] hover:bg-[#1a8c3d] hover:border-[#1a8c3d]'
                  ]"
                  :disabled="selectedDealForPreview.stage === 'Follow Up'"
                >
                  <Trophy class="w-3.5 h-3.5" />
                  {{ selectedDealForPreview.stage === 'Follow Up' ? 'Won' : 'Mark as Won' }}
                </button>
                <button
                  @click="markPreviewDealLost"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-sm',
                    selectedDealForPreview.stage === 'Lost'
                      ? 'bg-red-500 text-white border-red-500 opacity-80 cursor-not-allowed'
                      : 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600'
                  ]"
                  :disabled="selectedDealForPreview.stage === 'Lost'"
                >
                  <XCircle class="w-3.5 h-3.5" />
                  {{ selectedDealForPreview.stage === 'Lost' ? 'Lost' : 'Mark as Lost' }}
                </button>
                <div class="h-6 w-[1px] bg-slate-200 mx-1"></div>
                <button
                  class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Expand"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                </button>
                <button
                  @click="selectedDealForPreview = null"
                  class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                >
                  <X class="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </header>

          <!-- ── CHEVRON PIPELINE BAR ─────────────────────────── -->
          <div class="flex-shrink-0 overflow-x-auto bg-white px-5 pb-3 sm:px-8">
            <div class="flex min-w-[700px] select-none items-stretch gap-0.5">
              <!-- New Deal -->
              <div :class="['clip-chevron min-w-[130px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                selectedDealForPreview.stage === 'New' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']">
                New Deal / 3days
              </div>
              <!-- Acknowledge -->
              <div :class="['clip-chevron min-w-[110px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                selectedDealForPreview.stage === 'Acknowledged' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']">
                Acknowledge
              </div>
              <!-- Qualifying -->
              <div :class="['clip-chevron min-w-[110px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                (selectedDealForPreview.stage === 'Qualifying' || selectedDealForPreview.stage === 'New' || selectedDealForPreview.stage === 'Acknowledged') ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']">
                Qualifying
              </div>
              <!-- Follow Up -->
              <div :class="['clip-chevron min-w-[110px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                (selectedDealForPreview.stage === 'Proposal / Quotation' || selectedDealForPreview.stage === 'Follow Up') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">
                Follow Up
              </div>
              <!-- Results -->
              <div :class="['clip-chevron min-w-[90px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                (selectedDealForPreview.stage === 'Won' || selectedDealForPreview.stage === 'Lost') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">
                Results
              </div>
            </div>
          </div>

          <!-- â”€â”€ TWO-COLUMN BODY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
          <div class="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5 sm:px-8 sm:pb-8 md:flex-row md:overflow-hidden">

            <!-- LEFT SIDEBAR: Fixed 280px, scrollable -->
            <aside class="flex w-full flex-shrink-0 flex-col gap-4 md:w-[300px] md:overflow-y-auto md:pr-1 xl:w-[360px]">

              <!-- Widget: Deal Info -->
              <div class="shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="showPreviewDealInfo"
                  class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                  @click="showPreviewDealInfo = !showPreviewDealInfo"
                >
                  <span class="text-sm font-extrabold text-slate-900">Deal Info</span>
                  <div :class="['w-7 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center flex-shrink-0', showPreviewDealInfo ? 'bg-[#23B750]' : 'bg-gray-300']">
                    <div :class="['w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow', showPreviewDealInfo ? 'translate-x-3' : 'translate-x-0']"></div>
                  </div>
                </button>
                <div v-if="showPreviewDealInfo" class="space-y-2 border-t border-slate-100 px-4 pb-3.5 pt-3">
                  <div class="flex items-center justify-between gap-2">
                    <span class="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-400"><FolderKanban class="h-3.5 w-3.5 text-slate-400" /> Stage</span>
                    <select v-model="selectedDealForPreview.stage" class="max-w-[180px] cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 outline-none focus:border-[#23B750]">
                      <option v-for="stg in stages" :key="stg" :value="stg">{{ stg }}</option>
                    </select>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-400"><DollarSign class="h-3.5 w-3.5 text-slate-400" /> Est. Deal Value</span>
                    <div class="flex items-center gap-1">
                      <span class="text-xs font-semibold text-slate-400">RM</span>
                      <input v-model.number="selectedDealForPreview.value" type="number" aria-label="Estimated deal value" class="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right text-xs font-bold text-slate-800 outline-none focus:border-[#23B750]" />
                    </div>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="flex items-center gap-2 text-xs font-semibold text-slate-400"><CalendarDays class="h-3.5 w-3.5 text-slate-400" /> Est. Close Date</span>
                    <span class="text-xs font-bold text-slate-700">22/05/2026</span>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="flex items-center gap-2 text-xs font-semibold text-slate-400"><FileText class="h-3.5 w-3.5 text-slate-400" /> Service Type</span>
                    <span class="max-w-[160px] truncate text-xs font-bold text-slate-700">{{ selectedDealForPreview.description }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="flex items-center gap-2 text-xs font-semibold text-slate-400"><TrendingUp class="h-3.5 w-3.5 text-slate-400" /> Sales Motion</span>
                    <span class="text-xs font-bold text-slate-700">Inbound</span>
                  </div>
                </div>
              </div>

              <!-- Widget: Sales Info -->
              <div class="shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="showPreviewSalesInfo"
                  class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                  @click="showPreviewSalesInfo = !showPreviewSalesInfo"
                >
                  <span class="text-sm font-extrabold text-slate-900">Sales Info</span>
                  <div :class="['w-7 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center flex-shrink-0', showPreviewSalesInfo ? 'bg-[#23B750]' : 'bg-gray-300']">
                    <div :class="['w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow', showPreviewSalesInfo ? 'translate-x-3' : 'translate-x-0']"></div>
                  </div>
                </button>
                <div v-if="showPreviewSalesInfo" class="space-y-2 border-t border-slate-100 px-4 pb-3.5 pt-3">
                  <div class="flex items-center gap-2 pt-1">
                    <img :src="selectedDealForPreview.avatar" class="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover" :alt="selectedDealForPreview.owner" />
                    <div class="min-w-0">
                      <select
                        :value="selectedDealForPreview.owner"
                        @change="handleOwnerChange"
                        class="cursor-pointer border-none bg-transparent p-0 text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 focus:border-none focus:text-[#168638] focus:underline"
                        aria-label="Change sales owner"
                      >
                        <option
                          v-for="agent in uniqueAgents.filter(a => a !== 'Everyone')"
                          :key="agent"
                          :value="agent"
                        >
                          {{ agent }}
                        </option>
                      </select>
                      <div class="text-xs font-medium text-slate-400">Sales Owner</div>
                    </div>
                  </div>
                  <div class="text-xs font-semibold text-slate-400">Deal created {{ selectedDealForPreview.age }} ago</div>
                </div>
              </div>

              <!-- Widget: Primary Contact -->
              <div class="shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="showPreviewContactInfo"
                  class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                  @click="showPreviewContactInfo = !showPreviewContactInfo"
                >
                  <span class="text-sm font-extrabold text-slate-900">Primary</span>
                  <div :class="['w-7 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center flex-shrink-0', showPreviewContactInfo ? 'bg-[#23B750]' : 'bg-gray-300']">
                    <div :class="['w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow', showPreviewContactInfo ? 'translate-x-3' : 'translate-x-0']"></div>
                  </div>
                </button>
                <div v-if="showPreviewContactInfo" class="space-y-2.5 border-t border-slate-100 px-4 pb-3.5 pt-3">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <img :src="selectedDealForPreview.clientAvatar || selectedDealForPreview.avatar" class="h-14 w-14 shrink-0 rounded-full border-4 border-white object-cover shadow ring-1 ring-slate-200" :alt="selectedDealForPreview.clientName" />
                      <div>
                        <div class="flex items-center gap-1 text-xs font-bold text-slate-800">
                          {{ selectedDealForPreview.clientName }} <Crown class="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        </div>
                        <div class="mt-1 max-w-[170px] truncate text-xs font-medium text-slate-400">Primary decision maker</div>
                      </div>
                    </div>
                    <div class="flex gap-1">
                      <button class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"><MoreVertical class="w-3.5 h-3.5" /></button>
                      <button class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"><ChevronDown class="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div class="space-y-1.5 pt-1 border-t border-gray-100">
                    <a :href="'tel:' + selectedDealForPreview.phone" class="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#23B750]"><Phone class="h-3.5 w-3.5 shrink-0 text-slate-400" /> {{ selectedDealForPreview.phone }}</a>
                    <a :href="'mailto:' + selectedDealForPreview.email" class="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#23B750]"><Mail class="h-3.5 w-3.5 shrink-0 text-slate-400" /><span class="truncate">{{ selectedDealForPreview.email }}</span></a>
                  </div>
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    <span class="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200 transition-colors"><MessageSquare class="w-2.5 h-2.5" /> Source</span>
                    <span class="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-amber-100 transition-colors"><Thermometer class="w-2.5 h-2.5" /> Temp</span>
                    <span class="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-red-100 transition-colors"><AlertTriangle class="w-2.5 h-2.5" /> Urgency</span>
                  </div>
                </div>
              </div>

              <!-- Widget: Company Info -->
              <div class="shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="showPreviewCompanyInfo"
                  class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                  @click="showPreviewCompanyInfo = !showPreviewCompanyInfo"
                >
                  <span class="text-sm font-extrabold text-slate-900">Company Info</span>
                  <div :class="['w-7 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center flex-shrink-0', showPreviewCompanyInfo ? 'bg-[#23B750]' : 'bg-gray-300']">
                    <div :class="['w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow', showPreviewCompanyInfo ? 'translate-x-3' : 'translate-x-0']"></div>
                  </div>
                </button>
                <div v-if="showPreviewCompanyInfo" class="space-y-2 border-t border-slate-100 px-4 pb-3.5 pt-3 text-xs text-slate-500">
                  <div class="flex items-start gap-2 font-semibold text-slate-700">
                    <Building2 class="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    {{ selectedDealForPreview.title }}
                  </div>
                  <a href="https://example.com" target="_blank" rel="noreferrer" class="flex items-center gap-2 hover:text-[#23B750]"><Link2 class="h-3.5 w-3.5" /> company.example.com</a>
                  <p class="flex items-start gap-2"><MapPin class="mt-0.5 h-3.5 w-3.5 shrink-0" /> Kuala Lumpur, Malaysia</p>
                  <p class="flex items-center gap-2"><BriefcaseBusiness class="h-3.5 w-3.5" /> Professional Services</p>
                </div>
              </div>

            </aside>

            <!-- RIGHT PANEL: Flex-1, white, tabs + content + footer -->
            <main class="flex min-h-[640px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:min-h-0">

              <!-- Main Tab Bar -->
              <div class="flex-shrink-0 border-b border-slate-200 px-4 sm:px-6">
                <div class="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    v-for="tab in ['Deal Info', 'Conversations', 'People', 'Appointments (0)', 'Tickets (0)', 'Logs']"
                    :key="tab"
                    type="button"
                    @click="previewMainTab = tab"
                    :class="[
                      'border-b-2 px-1 py-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer mr-2 sm:mr-4',
                      previewMainTab === tab
                        ? 'border-[#23B750] text-[#168638]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    ]"
                  >
                    <span v-if="tab.includes('(')">
                      <span>{{ tab.split(' ')[0] }} </span>
                      <span class="text-slate-400 font-medium text-[10px]">{{ tab.split(' ')[1] }}</span>
                    </span>
                    <span v-else>{{ tab }}</span>
                  </button>
                </div>
              </div>

              <!-- Sub Tab Bar (Notes / Files / Media) -->
              <section v-if="previewMainTab === 'Deal Info'" class="mx-4 mt-4 flex-shrink-0 rounded-xl bg-violet-50 px-4 py-4 sm:mx-6 sm:px-5">
                <h3 class="text-sm font-bold text-violet-700">Rakan Insights</h3>
                <p class="mt-1.5 text-sm leading-6 text-violet-600 sm:text-base">High-potential opportunity. The latest activity shows strong interest in {{ selectedDealForPreview.description.toLowerCase() }}. Confirm the decision timeline and agree on the next owner action.</p>
              </section>

              <div v-if="previewMainTab === 'Deal Info'" class="flex flex-shrink-0 items-center gap-6 border-b border-slate-200 px-4 pt-2 sm:px-6">
                <button
                  v-for="sub in ['Notes', 'Files', 'Media']"
                  :key="sub"
                  @click="previewSubTab = sub"
                  :class="[
                    'border-b-2 px-1 py-3 text-sm font-semibold transition-colors',
                    previewSubTab === sub
                      ? 'border-[#23B750] text-[#168638]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  ]"
                >
                  {{ sub }}
                </button>
              </div>

              <!-- Scrollable Content Area -->
              <div class="flex-1 overflow-y-auto px-4 py-5 sm:px-6">

                <!-- NOTES VIEW -->
                <div v-if="previewMainTab === 'Deal Info' && previewSubTab === 'Notes'" class="space-y-8">

                  <!-- Description block -->
                  <section>
                    <h3 class="mb-4 text-base font-semibold text-slate-700">Description</h3>
                    <div class="max-w-5xl space-y-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
                      <p class="font-semibold text-gray-900">Linda Teo from Care Corner Singapore Ltd is requesting a quote for a digital project related to their appreciation dinner on November 26.</p>
                      <p>Below are the requirements of the website:</p>
                      <ul class="list-decimal pl-5 space-y-1">
                        <li>Purchasing Form:
                          <ul class="list-[lower-alpha] pl-4 space-y-0.5 mt-0.5">
                            <li>Type: Self (1 seat), Table (10 seats)</li>
                            <li>Confirmation email with a unique RSVP link sent to the buyer after successful payment.</li>
                            <li>Form closes automatically after the registration deadline.</li>
                          </ul>
                        </li>
                        <li>RSVP Form:
                          <ul class="list-[lower-alpha] pl-4 space-y-0.5 mt-0.5">
                            <li>Confirmation email sent to guest upon successful submission.</li>
                            <li>Form closes automatically after the RSVP deadline.</li>
                            <li>Notification email sent to the buyer once all 10 seats at their table have been filled.</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </section>

                  <!-- Notes log -->
                  <section>
                    <h3 class="mb-4 text-base font-semibold text-slate-700">Notes</h3>
                    <p v-if="!(dealNotes[selectedDealForPreview.id] && dealNotes[selectedDealForPreview.id].length > 0)" class="text-sm text-slate-400">No notes yet. Add the first update below.</p>
                    <div v-else class="space-y-2">
                      <div
                        v-for="note in dealNotes[selectedDealForPreview.id]"
                        :key="note.id"
                        class="space-y-1 border-l-2 border-emerald-100 py-1 pl-4"
                      >
                        <div class="flex items-center justify-between text-xs font-medium text-slate-400">
                          <span>Updated by Sales Agent</span>
                          <span>{{ note.date }}</span>
                        </div>
                        <p class="text-sm leading-6 text-slate-700 sm:text-base">{{ note.text }}</p>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- FILES VIEW -->
                <div v-else-if="previewMainTab === 'Deal Info' && previewSubTab === 'Files'" class="flex flex-col items-center justify-center h-full text-center py-16">
                  <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <Paperclip class="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 class="font-extrabold text-sm text-gray-700">No Files Uploaded</h4>
                  <p class="text-xs text-gray-400 mt-1">Upload client briefs, design specs or formal invoices here.</p>
                  <button class="mt-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-all">Upload File</button>
                </div>

                <!-- MEDIA VIEW -->
                <div v-else-if="previewMainTab === 'Deal Info' && previewSubTab === 'Media'" class="flex flex-col items-center justify-center h-full text-center py-16">
                  <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <FileText class="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 class="font-extrabold text-sm text-gray-700">No Media Assets</h4>
                  <p class="text-xs text-gray-400 mt-1">Images, diagrams, and video walkthroughs go here.</p>
                </div>

                <!-- OTHER TABS -->
                <div v-else class="flex flex-col items-center justify-center h-full text-center py-16">
                  <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <MessageSquare class="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 class="font-extrabold text-sm text-gray-700">{{ previewMainTab }}</h4>
                  <p class="text-xs text-gray-400 mt-1">This module is synced with your RakanSales CRM pipeline.</p>
                </div>

              </div>

              <!-- Add Note Footer -->
              <footer v-if="previewMainTab === 'Deal Info' && previewSubTab === 'Notes'" class="flex-shrink-0 border-t border-slate-200 bg-white p-4 sm:px-6 sm:py-5">
                <div class="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm transition-all focus-within:border-[#23B750] focus-within:ring-2 focus-within:ring-[#23B750]/10">
                  <input
                    v-model="newNoteText"
                    type="text"
                    placeholder="Add a note"
                    @keydown.enter="addNoteToDeal"
                    aria-label="Add a note"
                    class="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                  />
                  <div class="flex items-center gap-1">
                    <button type="button" aria-label="Add emoji" class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><Smile class="h-5 w-5" /></button>
                    <button type="button" aria-label="Attach file" class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><Paperclip class="h-5 w-5" /></button>
                    <button
                      @click="addNoteToDeal"
                      type="button"
                      :disabled="!newNoteText.trim()"
                      class="ml-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#168638] transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </footer>

            </main>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ── AGENT EXIT REASSIGNMENT WIZARD MODAL ────────────────────── -->
    <div
      v-if="showExitWizardModal"
      class="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scale-up">
        <!-- Modal Header -->
        <header class="px-6 py-4.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 class="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <UserX class="w-4 h-4 text-red-500" />
            Departing Agent Offboarding Wizard
          </h3>
          <button @click="showExitWizardModal = false" class="text-gray-400 hover:text-gray-600 rounded cursor-pointer" :disabled="isExecutingHandover">
            <X class="w-4.5 h-4.5" />
          </button>
        </header>

        <!-- Wizard Body -->
        <div class="p-6 flex-1 overflow-y-auto text-xs font-semibold space-y-5 font-sans">
          <!-- Step 1: Select departing agent -->
          <div v-if="handoverStep === 1 && !isExecutingHandover" class="space-y-4">
            <p class="text-gray-550 leading-relaxed font-normal">
              Manage the offboarding of a departing sales representative. Select the team member leaving to review their active pipeline impact.
            </p>
            <div class="space-y-1.5">
              <label class="block text-gray-700">Departing Team Member</label>
              <select
                v-model="exitSelectedAgent"
                class="w-full p-2.5 bg-white border border-gray-250 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750] cursor-pointer font-sans"
              >
                <option value="" disabled>-- Select Departing Agent --</option>
                <option v-for="agent in ['Ahmad Faizal', 'Siti Nur Aisyah', 'Rajesh Kumar', 'Lim Wei Jie', 'Nurul Huda']" :key="agent" :value="agent">
                  {{ agent }}
                </option>
              </select>
            </div>

            <!-- Pipeline Impact Card -->
            <div v-if="exitSelectedAgent" class="bg-red-50/50 rounded-xl p-4.5 border border-red-100/80 space-y-3 animate-fade-in">
              <h4 class="text-red-700 font-extrabold flex items-center gap-1.5">
                <AlertTriangle class="w-4 h-4 text-red-500" />
                Active Pipeline Impact Details
              </h4>
              <div class="grid grid-cols-2 gap-3 text-slate-700">
                <div class="bg-white rounded-lg p-2.5 border border-red-50">
                  <span class="text-[10px] text-gray-400 block font-bold uppercase">Active Deals</span>
                  <span class="text-lg font-extrabold text-slate-900 mt-0.5 block">{{ exitDealsCount }}</span>
                </div>
                <div class="bg-white rounded-lg p-2.5 border border-red-50">
                  <span class="text-[10px] text-gray-400 block font-bold uppercase">Pipeline Value</span>
                  <span class="text-lg font-extrabold text-red-600 mt-0.5 block font-mono">RM {{ exitDealsValue.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Action -->
            <button
              @click="handoverStep = 2"
              :disabled="!exitSelectedAgent || exitDealsCount === 0"
              class="w-full py-2.5 bg-[#23B750] hover:bg-[#168638] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              Continue to Handover Setup
            </button>
            <p v-if="exitSelectedAgent && exitDealsCount === 0" class="text-center text-[10.5px] text-amber-605 font-medium">
              This agent has no active deals. You can safely delete their profile.
            </p>
          </div>

          <!-- Step 2: Configure handover mode -->
          <div v-else-if="handoverStep === 2 && !isExecutingHandover" class="space-y-4">
            <h4 class="text-slate-800 font-extrabold uppercase tracking-wider text-[10px]">Select Reassignment Mode</h4>
            <div class="grid grid-cols-2 gap-3">
              <!-- Mode 1: Single Target -->
              <div
                @click="exitAssignMode = 'single'"
                :class="[
                  'border rounded-xl p-4.5 cursor-pointer transition-all flex flex-col gap-2 relative',
                  exitAssignMode === 'single' ? 'border-[#23B750] bg-[#23B750]/5 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                ]"
              >
                <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserCheck class="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div>
                  <span class="block text-slate-800 font-extrabold">Single Agent</span>
                  <span class="text-[10px] text-gray-400 font-medium mt-0.5 block leading-normal font-normal">Assign all deals to one specific agent</span>
                </div>
                <div v-if="exitAssignMode === 'single'" class="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#23B750] flex items-center justify-center text-white text-[8px] font-extrabold">✓</div>
              </div>

              <!-- Mode 2: Equal Round Robin -->
              <div
                @click="exitAssignMode = 'round_robin'"
                :class="[
                  'border rounded-xl p-4.5 cursor-pointer transition-all flex flex-col gap-2 relative',
                  exitAssignMode === 'round_robin' ? 'border-[#23B750] bg-[#23B750]/5 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                ]"
              >
                <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Shuffle class="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div>
                  <span class="block text-slate-800 font-extrabold">Round Robin</span>
                  <span class="text-[10px] text-gray-400 font-medium mt-0.5 block leading-normal font-normal">Fairly rotate deals across active queue pool</span>
                </div>
                <div v-if="exitAssignMode === 'round_robin'" class="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#23B750] flex items-center justify-center text-white text-[8px] font-extrabold">✓</div>
              </div>
            </div>

            <!-- Single Reassign Form -->
            <div v-if="exitAssignMode === 'single'" class="space-y-1.5 animate-fade-in pt-1">
              <label class="block text-gray-700">Target Successor Agent</label>
              <select
                v-model="exitTargetAgent"
                class="w-full p-2.5 bg-white border border-gray-250 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750] cursor-pointer"
              >
                <option value="" disabled>-- Select Successor Agent --</option>
                <option v-for="agent in uniqueAgents.filter(a => a !== 'Everyone' && a !== exitSelectedAgent)" :key="agent" :value="agent">
                  {{ agent }}
                </option>
              </select>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3 pt-2">
              <button
                @click="handoverStep = 1"
                class="flex-1 py-2.5 border border-gray-255 hover:bg-gray-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                @click="executeHandover"
                :disabled="exitAssignMode === 'single' && !exitTargetAgent"
                class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                Execute Reassignment
              </button>
            </div>
          </div>

          <!-- Step 3: Success Screen (replaces alerts) -->
          <div v-else-if="handoverStep === 3 && !isExecutingHandover" class="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle class="w-7 h-7" />
            </div>
            <div class="space-y-1.5">
              <h4 class="text-sm font-extrabold text-slate-900">Handover Successful!</h4>
              <p v-if="exitAssignMode === 'single'" class="text-xs text-gray-500 font-normal leading-relaxed">
                All deals have been successfully reassigned to <span class="font-bold text-slate-800">{{ exitTargetAgent }}</span>.
              </p>
              <p v-else class="text-xs text-gray-500 font-normal leading-relaxed">
                Deals have been successfully distributed via Round Robin among active team members.
              </p>
            </div>
            <button
              @click="showExitWizardModal = false"
              class="w-full py-2.5 bg-[#23B750] hover:bg-[#168638] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              Close Wizard
            </button>
          </div>

          <!-- Step 4: Loading State -->
          <div v-else-if="isExecutingHandover" class="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div class="relative w-14 h-14">
              <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div class="absolute inset-0 rounded-full border-4 border-t-[#23B750] animate-spin"></div>
            </div>
            <div class="space-y-1">
              <h4 class="text-sm font-extrabold text-slate-900">Executing Reassignment...</h4>
              <p class="text-xs text-gray-500 font-normal">Transferring owner permissions & updating timeline logs</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── ROUND ROBIN ROUTING & INTAKE MODAL ───────────────────────── -->
    <div
      v-if="showRoundRobinModal"
      class="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scale-up">
        <!-- Modal Header -->
        <header class="px-6 py-4.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0 text-white">
          <h3 class="font-extrabold text-sm flex items-center gap-2">
            <Shuffle class="w-4 h-4 text-[#23B750]" />
            Round Robin Assignment Settings
          </h3>
          <button @click="showRoundRobinModal = false" class="text-slate-400 hover:text-slate-200 rounded cursor-pointer">
            <X class="w-4.5 h-4.5" />
          </button>
        </header>

        <!-- Body content -->
        <div class="p-6 flex-1 overflow-y-auto text-xs font-semibold space-y-6 max-h-[500px]">
          <!-- Switcher -->
          <div class="flex items-center justify-between bg-slate-50 p-4 border border-gray-200 rounded-xl">
            <div>
              <span class="block text-slate-800 font-extrabold">Enable Automated Queue Routing</span>
              <span class="text-[10px] text-gray-400 font-medium mt-0.5 block leading-normal font-normal">Incoming deals are distributed fairly in a rotation loop</span>
            </div>
            <button
              @click="isRoundRobinEnabled = !isRoundRobinEnabled"
              :class="['w-10 h-6 rounded-full p-1 transition-colors duration-205 flex items-center flex-shrink-0 cursor-pointer focus:outline-none', isRoundRobinEnabled ? 'bg-[#23B750]' : 'bg-gray-300']"
            >
              <div :class="['w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-md', isRoundRobinEnabled ? 'translate-x-4' : 'translate-x-0']"></div>
            </button>
          </div>

          <!-- Queue Pool List -->
          <div class="space-y-3">
            <h4 class="text-slate-900 font-extrabold uppercase tracking-wider text-[10px] flex items-center justify-between">
              <span>Active Agent Rotation Queue ({{ activeRoundRobinQueue.length }} active)</span>
              <span class="text-[9.5px] text-[#23B750] lowercase">drag to change queue order</span>
            </h4>
            <div class="border border-gray-250 rounded-xl divide-y divide-gray-150 overflow-hidden bg-white shadow-sm">
              <div
                v-for="(agent, idx) in roundRobinQueue"
                :key="agent"
                :class="[
                  'px-4 py-3 flex items-center justify-between gap-3 transition-colors',
                  roundRobinActivePool[agent] !== false ? 'hover:bg-slate-50/50' : 'bg-gray-50/70 opacity-60'
                ]"
              >
                <div class="flex items-center gap-3">
                  <!-- Checkbox -->
                  <input
                    type="checkbox"
                    :checked="roundRobinActivePool[agent] !== false"
                    @change="roundRobinActivePool[agent] = !roundRobinActivePool[agent]"
                    class="w-3.5 h-3.5 text-[#23B750] border-gray-300 rounded focus:ring-[#23B750] cursor-pointer"
                  />
                  <!-- Avatar -->
                  <div class="w-6.5 h-6.5 rounded-full overflow-hidden border border-gray-155 bg-slate-100 flex-shrink-0">
                    <img :src="getAgentAvatar(agent) || '/avatars/agent_14_chinese_male_skyblue.png'" class="w-full h-full object-cover" alt="agent" />
                  </div>
                  <!-- Name & Queue Pos -->
                  <div>
                    <span class="block text-slate-800 font-extrabold">{{ agent }}</span>
                    <span v-if="roundRobinActivePool[agent] !== false" class="text-[9px] text-[#23B750] font-bold mt-0.5 block">
                      Queue Priority: #{{ activeRoundRobinQueue.indexOf(agent) + 1 }} Next in Rotation
                    </span>
                    <span v-else class="text-[9px] text-gray-400 font-bold mt-0.5 block">
                      Inactive / Out of Rotation Pool
                    </span>
                  </div>
                </div>

                <!-- Assignment count -->
                <div class="text-right">
                  <span class="text-[10px] text-gray-400 block font-bold uppercase">Assigned Today</span>
                  <span class="text-sm font-extrabold text-slate-800 mt-0.5 block font-mono">{{ leadsAssignedToday[agent] || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Lead Intake Simulator Widget -->
          <div class="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 class="text-[#23B750] font-extrabold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Zap class="w-4 h-4 animate-pulse text-[#23B750]" />
              Lead Intake Simulator (Sandbox Testing)
            </h4>
            <p class="text-slate-400 leading-relaxed font-normal text-[11px]">
              Simulate the arrival of an inbound lead to verify the rotation pool distribution and queue priority shifts.
            </p>

            <button
              @click="simulateLeadIntake"
              :disabled="isSimulatingLead || !isRoundRobinEnabled || activeRoundRobinQueue.length === 0"
              class="w-full py-2.5 bg-[#23B750] hover:bg-[#168638] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              <span v-if="isSimulatingLead">Generating & Routing Inbound Lead...</span>
              <span v-else>Trigger Lead Intake Simulation</span>
            </button>

            <!-- Latest Simulation logs -->
            <div v-if="simulatedLeadInfo" class="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 animate-fade-in text-[11px]">
              <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span class="text-[#23B750] font-extrabold font-mono">SIMULATION SUCCESS</span>
                <span class="text-slate-400">Routed Successfully</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-slate-300">
                <div>
                  <span class="text-[9px] text-slate-500 block">Lead Name</span>
                  <span class="font-bold text-slate-200 block truncate">{{ simulatedLeadInfo.title }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-500 block">Assigned To</span>
                  <span class="font-bold text-slate-200 block truncate">{{ simulatedLeadInfo.assignedTo }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-500 block">Deal Value</span>
                  <span class="font-bold text-emerald-400 block font-mono">RM {{ simulatedLeadInfo.value.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove scrollbars globally by default, but exclude column-cards-list */
*:not(.column-cards-list)::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
}
*:not(.column-cards-list) {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

*:not(.column-cards-list) {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Enable vertical scrollbars on column cards list specifically */
.column-cards-list {
  scrollbar-width: thin !important;
  scrollbar-color: #cbd5e1 transparent !important;
  -ms-overflow-style: auto !important;
}
.column-cards-list::-webkit-scrollbar {
  display: block !important;
  width: 6px !important;
}
.column-cards-list::-webkit-scrollbar-track {
  background: transparent !important;
}
.column-cards-list::-webkit-scrollbar-thumb {
  background: #cbd5e1 !important;
  border-radius: 4px !important;
}
.column-cards-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8 !important;
}

/* Chevron Progress Bar */
.clip-chevron {
  clip-path: polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%, 7% 50%);
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.clip-chevron:first-child {
  clip-path: polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%);
  padding-left: 0.75rem;
}
.clip-chevron:last-child {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 7% 50%);
  padding-right: 0.75rem;
}

/* Keep the deal workspace compact on large displays while retaining a roomy
 * internal canvas for the two-column information layout. */
.deal-preview-compact {
  flex-shrink: 0;
  width: min(calc(86vw / 0.88), 1500px);
  height: min(calc(85vh / 0.88), 900px);
  max-width: none;
  zoom: 0.88;
}

@media (max-width: 1100px) {
  .deal-preview-compact {
    width: calc(84vw / 0.82) !important;
    height: min(calc(84vh / 0.82), 860px) !important;
    zoom: 0.82;
  }
}

@media (max-width: 640px) {
  .deal-preview-compact {
    width: calc(94vw / 0.78) !important;
    height: calc(94vh / 0.78) !important;
    zoom: 0.78;
  }
}

/* Modal enter/leave transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
