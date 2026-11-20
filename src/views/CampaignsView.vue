<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  approvedWhatsAppTemplates,
  audienceLabels,
  initialCampaigns,
  type CampaignChannel,
  type CampaignRecord,
  type WhatsAppApprovedTemplate,
  type AudienceSegmentLabel
} from '@/data/campaignsData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Megaphone,
  MessageSquare,
  Mail,
  Plus,
  Search,
  CheckCircle2,
  Check,
  Send,
  Users,
  Eye,
  MousePointerClick,
  MessageCircleReply,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FileText,
  Tag,
  Clock,
  BarChart3,
  Bold,
  Italic,
  Underline,
  List,
  Link2,
  ShieldCheck,
  Smartphone,
  Monitor
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// --- Toast Notifications ---
interface Toast {
  id: number
  message: string
  type: 'success' | 'info' | 'warning'
}
const toasts = ref<Toast[]>([])
let toastSeq = 0
const showToast = (message: string, type: Toast['type'] = 'success') => {
  const id = ++toastSeq
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3500)
}

// --- Core View Mode State ---
// 'list' = Unified Campaign List (WhatsApp + Email)
// 'wizard' = 3-Step Creation Flow (for either 'whatsapp' or 'email')
// 'results' = Results View for a specific campaign
const activeScreen = ref<'list' | 'wizard' | 'results'>('list')
const campaigns = ref<CampaignRecord[]>([...initialCampaigns])

// --- List Filtering State ---
const channelFilter = ref<'all' | 'whatsapp' | 'email'>('all')
const searchQuery = ref('')

const filteredCampaigns = computed(() => {
  return campaigns.value.filter(c => {
    const matchesChannel = channelFilter.value === 'all' || c.channel === channelFilter.value
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.audienceLabel.toLowerCase().includes(q) ||
      (c.templateName && c.templateName.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q))
    return matchesChannel && matchesSearch
  })
})

// Summary Stats for List View
const summaryStats = computed(() => {
  const total = campaigns.value.length
  const whatsappCount = campaigns.value.filter(c => c.channel === 'whatsapp').length
  const emailCount = campaigns.value.filter(c => c.channel === 'email').length
  const totalReach = campaigns.value.reduce((acc, c) => acc + c.recipientCount, 0)
  return { total, whatsappCount, emailCount, totalReach }
})

// --- Wizard State (Shared 3-Step Flow for WhatsApp & Email) ---
const wizardChannel = ref<CampaignChannel>('whatsapp')
const wizardStep = ref<1 | 2 | 3>(1)

// Step 1 (WhatsApp): Campaign Name, Inbox, Approved Template
const waCampaignName = ref('Q2 Hot Leads WhatsApp Broadcast')
const waSelectedInbox = ref('RakanSales Official WABA (+6012 345 6789)')
const waSelectedTemplateId = ref<string>(approvedWhatsAppTemplates[0].id)

const selectedWhatsAppTemplate = computed<WhatsAppApprovedTemplate>(() => {
  return (
    approvedWhatsAppTemplates.find(t => t.id === waSelectedTemplateId.value) ||
    approvedWhatsAppTemplates[0]
  )
})

// Step 1 (Email): Campaign Name, Sender, Subject Line, Preview Text, Simple Email Editor
const emailCampaignName = ref('Q2 Hot Leads Product Update')
const emailSenderName = ref('Olivia Rhye (RakanSales)')
const emailSenderAddress = ref('olivia@rakansales.com')
const emailSubject = ref('Exclusive Q2 Offer: Accelerate Your Sales Pipeline with RakanSales')
const emailPreviewText = ref('See how our new AI transcription and WhatsApp automation boost conversions.')
const emailBodyContent = ref(
  `Hi {{contact.first_name}},\n\nWe noticed {{company.name}} has been exploring ways to streamline customer conversations across WhatsApp and Email.\n\nWith our Q2 Release, your team can now:\n• Transcribe & translate Bahasa Melayu voice notes in one click\n• Launch targeted WhatsApp & Email broadcasts by lead label\n• Track real-time opens, clicks, and replies in one unified dashboard\n\nClick the button below to book a 15-minute priority walkthrough with our team this week.\n\nWarm regards,\nOlivia Rhye\nRakanSales Growth Team`
)
const emailCtaText = ref('Book 15-Min Priority Walkthrough')
const emailCtaUrl = ref('https://cal.rakansales.com/priority-demo')
const emailPreviewDevice = ref<'desktop' | 'mobile'>('desktop')

// Step 2 (Shared Audience Selection by Label)
const selectedAudienceLabel = ref<string>('Hot')

const currentAudienceObj = computed<AudienceSegmentLabel>(() => {
  return (
    audienceLabels.find(l => l.label === selectedAudienceLabel.value) ||
    audienceLabels[0]
  )
})

const estimatedReachCount = computed(() => {
  if (wizardChannel.value === 'whatsapp') {
    return currentAudienceObj.value.whatsappReachable
  }
  return currentAudienceObj.value.emailReachable
})

// Step 3 (Review & Send)
const deliveryScheduleMode = ref<'now' | 'later'>('now')
const isSendingCampaign = ref(false)

// --- Results View State ---
const selectedCampaignForResults = ref<CampaignRecord | null>(campaigns.value[0])

// Helper to get tag style for audience label
const getAudienceBadgeClass = (label: string) => {
  const found = audienceLabels.find(l => l.label.toLowerCase() === label.toLowerCase())
  return found ? found.tagStyle : 'bg-primary/10 text-primary border-primary/20'
}

// Start Wizard for WhatsApp or Email
const startCampaignWizard = (channel: CampaignChannel) => {
  wizardChannel.value = channel
  wizardStep.value = 1
  selectedAudienceLabel.value = 'Hot'
  deliveryScheduleMode.value = 'now'

  if (channel === 'whatsapp') {
    waCampaignName.value = 'Hot Leads Q2 Priority Follow-Up'
    waSelectedTemplateId.value = approvedWhatsAppTemplates[0].id
  } else {
    emailCampaignName.value = 'Q2 Hot Leads Executive Offer'
    emailSubject.value = 'Exclusive Q2 Offer: Accelerate Your Sales Pipeline with RakanSales'
    emailPreviewText.value = 'Unlock automated WhatsApp & Email workflows for your sales team.'
  }

  activeScreen.value = 'wizard'
}

// Simple Email Editor formatting helpers
const insertEmailToken = (token: string) => {
  emailBodyContent.value += ` {{${token}}}`
  showToast(`Inserted variable {{${token}}}`, 'info')
}

const applyEmailFormatting = (type: 'bold' | 'italic' | 'bullet' | 'link') => {
  if (type === 'bold') {
    emailBodyContent.value += ' ** Key Highlight **'
  } else if (type === 'italic') {
    emailBodyContent.value += ' *Limited time Q2 offer*'
  } else if (type === 'bullet') {
    emailBodyContent.value += '\n• Priority onboarding & custom CRM mapping'
  } else if (type === 'link') {
    emailBodyContent.value += '\nhttps://cal.rakansales.com/discovery'
  }
  showToast(`Applied ${type} formatting to email body`, 'info')
}

const loadEmailPreset = (preset: 'promo' | 'newsletter' | 'reengage') => {
  if (preset === 'promo') {
    emailSubject.value = 'Exclusive Q2 Offer: Accelerate Your Sales Pipeline with RakanSales'
    emailBodyContent.value = `Hi {{contact.first_name}},\n\nWe noticed {{company.name}} is scaling its customer operations this quarter.\n\nClaim your 14-day priority access to RakanSales C4 — complete with instant Bahasa Melayu voice note transcription, unified WhatsApp + Email campaigns, and automated deal pipelines.\n\nBest regards,\nOlivia Rhye`
  } else if (preset === 'newsletter') {
    emailSubject.value = 'May Product Update: Voice Note AI & Unified Campaigns Are Here'
    emailBodyContent.value = `Hello {{contact.first_name}},\n\nHere is what is new in RakanSales this month for {{company.name}}:\n• 1-Click Bahasa Melayu to English Voice Note Translation\n• Unified WhatsApp & Email Broadcast Wizard\n• Smart CSV Contact Importer with Auto Column Matching\n\nExplore the new features in your dashboard today!\n\nCheers,\nThe RakanSales Team`
  } else {
    emailSubject.value = 'Quick check-in regarding {{company.name}} CRM setup'
    emailBodyContent.value = `Hi {{contact.first_name}},\n\nJust following up on our earlier conversation about unifying your WhatsApp and Email sales channels. Would you be open to a quick 10-minute call this Thursday?\n\nBest,\nOlivia Rhye`
  }
  showToast('Loaded email template preset', 'info')
}

// Navigation between wizard steps
const nextWizardStep = () => {
  if (wizardStep.value === 1) {
    if (wizardChannel.value === 'whatsapp' && !waCampaignName.value.trim()) {
      waCampaignName.value = 'Hot Leads WhatsApp Campaign'
    }
    if (wizardChannel.value === 'email' && !emailSubject.value.trim()) {
      showToast('Please enter an email subject line', 'warning')
      return
    }
    wizardStep.value = 2
  } else if (wizardStep.value === 2) {
    wizardStep.value = 3
  }
}

const prevWizardStep = () => {
  if (wizardStep.value === 3) wizardStep.value = 2
  else if (wizardStep.value === 2) wizardStep.value = 1
  else activeScreen.value = 'list'
}

// Complete Wizard & Send Campaign -> Transitions straight to Results View with sample metrics!
const handleSendCampaign = () => {
  isSendingCampaign.value = true
  const aud = currentAudienceObj.value

  setTimeout(() => {
    isSendingCampaign.value = false
    const nowStr = 'Just now • Today'

    if (wizardChannel.value === 'whatsapp') {
      const tpl = selectedWhatsAppTemplate.value
      const sentCount = aud.whatsappReachable
      const deliveredCount = Math.round(sentCount * 0.97)
      const readCount = Math.round(sentCount * 0.81)
      const repliedCount = Math.round(sentCount * 0.28)

      const newWaCampaign: CampaignRecord = {
        id: `cmp-wa-${Date.now()}`,
        name: waCampaignName.value.trim() || `${tpl.name} (${aud.label})`,
        channel: 'whatsapp',
        status: 'Sent',
        audienceLabel: aud.label,
        recipientCount: sentCount,
        createdAt: nowStr,
        sentAt: nowStr,
        inboxName: waSelectedInbox.value,
        templateId: tpl.id,
        templateName: tpl.name,
        templateBody: tpl.bodyText,
        whatsappMetrics: {
          sent: sentCount,
          delivered: deliveredCount,
          read: readCount,
          replied: repliedCount
        },
        recipients: [
          {
            id: `wa-r-1-${Date.now()}`,
            name: 'Mel Wong',
            company: 'KK Steel Sdn Bhd',
            contactInfo: '+60 12-345 6789',
            status: 'Replied',
            sentAt: 'Just now',
            updatedAt: '1m ago',
            detailNote: '"YES — please book us in for the priority demo tomorrow!"'
          },
          {
            id: `wa-r-2-${Date.now()}`,
            name: 'Mei Ting',
            company: 'Apex Logistics MY',
            contactInfo: '+60 17-882 1940',
            status: 'Replied',
            sentAt: 'Just now',
            updatedAt: '2m ago',
            detailNote: '"Interested! Can you send the quotation PDF here?"'
          },
          {
            id: `wa-r-3-${Date.now()}`,
            name: 'Ahmad Faizal',
            company: 'Malayan Trading',
            contactInfo: '+60 19-410 5521',
            status: 'Read',
            sentAt: 'Just now',
            updatedAt: '2m ago',
            detailNote: 'Read receipt confirmed on WhatsApp'
          },
          {
            id: `wa-r-4-${Date.now()}`,
            name: 'Chong Wei Jian',
            company: 'Nippon Tech KL',
            contactInfo: '+60 16-229 8834',
            status: 'Read',
            sentAt: 'Just now',
            updatedAt: '3m ago',
            detailNote: 'Read receipt confirmed on WhatsApp'
          },
          {
            id: `wa-r-5-${Date.now()}`,
            name: 'Siti Nurhaliza',
            company: 'Seri Mega Holdings',
            contactInfo: '+60 13-901 7742',
            status: 'Delivered',
            sentAt: 'Just now',
            updatedAt: 'Just now',
            detailNote: 'Delivered to handset'
          }
        ]
      }

      campaigns.value.unshift(newWaCampaign)
      selectedCampaignForResults.value = newWaCampaign
      activeScreen.value = 'results'
      showToast(`WhatsApp campaign sent to ${sentCount} "${aud.label}" contacts!`, 'success')
    } else {
      const sentCount = aud.emailReachable
      const openedCount = Math.round(sentCount * 0.68)
      const clickedCount = Math.round(sentCount * 0.25)

      const newEmailCampaign: CampaignRecord = {
        id: `cmp-em-${Date.now()}`,
        name: emailCampaignName.value.trim() || emailSubject.value.trim(),
        channel: 'email',
        status: 'Sent',
        audienceLabel: aud.label,
        recipientCount: sentCount,
        createdAt: nowStr,
        sentAt: nowStr,
        subject: emailSubject.value.trim(),
        previewText: emailPreviewText.value.trim(),
        fromName: emailSenderName.value,
        fromEmail: emailSenderAddress.value,
        emailBody: emailBodyContent.value,
        emailMetrics: {
          sent: sentCount,
          opened: openedCount,
          clicked: clickedCount
        },
        recipients: [
          {
            id: `em-r-1-${Date.now()}`,
            name: 'Mel Wong',
            company: 'KK Steel Sdn Bhd',
            contactInfo: 'melwong@kksteel.com',
            status: 'Clicked',
            sentAt: 'Just now',
            updatedAt: '1m ago',
            detailNote: `Clicked CTA: "${emailCtaText.value}"`
          },
          {
            id: `em-r-2-${Date.now()}`,
            name: 'Mei Ting',
            company: 'Apex Logistics MY',
            contactInfo: 'meiting@apexlogistics.my',
            status: 'Clicked',
            sentAt: 'Just now',
            updatedAt: '2m ago',
            detailNote: `Clicked CTA: "${emailCtaText.value}"`
          },
          {
            id: `em-r-3-${Date.now()}`,
            name: 'Ahmad Faizal',
            company: 'Malayan Trading',
            contactInfo: 'faizal@malayantrading.com',
            status: 'Opened',
            sentAt: 'Just now',
            updatedAt: '3m ago',
            detailNote: 'Opened in Google Workspace Mail'
          },
          {
            id: `em-r-4-${Date.now()}`,
            name: 'Chong Wei Jian',
            company: 'Nippon Tech KL',
            contactInfo: 'weijian@nippontech.com',
            status: 'Opened',
            sentAt: 'Just now',
            updatedAt: '4m ago',
            detailNote: 'Opened in Outlook Desktop'
          },
          {
            id: `em-r-5-${Date.now()}`,
            name: 'Siti Nurhaliza',
            company: 'Seri Mega Holdings',
            contactInfo: 'siti@serimega.com.my',
            status: 'Sent',
            sentAt: 'Just now',
            updatedAt: 'Just now',
            detailNote: 'Delivered via verified domain rakansales.com'
          }
        ]
      }

      campaigns.value.unshift(newEmailCampaign)
      selectedCampaignForResults.value = newEmailCampaign
      activeScreen.value = 'results'
      showToast(`Email campaign sent to ${sentCount} "${aud.label}" contacts!`, 'success')
    }
  }, 400)
}

const openResultsForCampaign = (campaign: CampaignRecord) => {
  selectedCampaignForResults.value = campaign
  activeScreen.value = 'results'
}

// Resolve sample email body preview
const resolvedEmailPreview = computed(() => {
  return emailBodyContent.value
    .replace(/\{\{\s*contact\.first_name\s*\}\}/g, 'Mel')
    .replace(/\{\{\s*contact\.name\s*\}\}/g, 'Mel Wong')
    .replace(/\{\{\s*company\.name\s*\}\}/g, 'KK Steel Sdn Bhd')
})

// Sync route query parameters (from SecondaryPanel links)
const applyRouteQuery = () => {
  const qChannel = route.query.channel as string | undefined
  const qCreate = route.query.create as string | undefined

  if (qCreate === 'whatsapp') {
    startCampaignWizard('whatsapp')
  } else if (qCreate === 'email') {
    startCampaignWizard('email')
  } else if (qChannel === 'whatsapp') {
    activeScreen.value = 'list'
    channelFilter.value = 'whatsapp'
  } else if (qChannel === 'email') {
    activeScreen.value = 'list'
    channelFilter.value = 'email'
  }
}

onMounted(() => {
  applyRouteQuery()
})

watch(
  () => route.query,
  () => {
    applyRouteQuery()
  }
)
</script>

<template>
  <div class="relative space-y-6">
    <!-- Toast Notifications -->
    <TransitionGroup
      name="toast"
      tag="div"
      class="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        class="p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-3 pointer-events-auto bg-card/95 backdrop-blur-md transition-all duration-300"
        :class="[
          t.type === 'success' ? 'border-success/30 text-success' : '',
          t.type === 'info' ? 'border-info/30 text-info' : '',
          t.type === 'warning' ? 'border-warning/30 text-warning' : ''
        ]"
      >
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :class="[
            t.type === 'success' ? 'bg-primary' : '',
            t.type === 'info' ? 'bg-info' : '',
            t.type === 'warning' ? 'bg-warning' : ''
          ]"
        ></span>
        <p>{{ t.message }}</p>
      </div>
    </TransitionGroup>

    <!-- =======================================================================
         VIEW 1: UNIFIED CAMPAIGNS LIST (WhatsApp + Email side-by-side)
    ======================================================================== -->
    <template v-if="activeScreen === 'list'">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold tracking-tight text-foreground">Campaigns</h1>
            <Badge variant="outline" class="text-[10px] font-bold bg-primary/10 text-primary border-primary/20 rounded-full px-2.5">
              WhatsApp & Email
            </Badge>
          </div>
          <p class="text-xs text-muted-foreground mt-0.5">
            Launch targeted WhatsApp template broadcasts and Email marketing campaigns from one unified workspace.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            class="gap-2 rounded-xl border-border bg-card hover:bg-muted text-foreground cursor-pointer font-semibold text-xs h-9"
            @click="startCampaignWizard('email')"
          >
            <Mail class="w-4 h-4 text-info" />
            New Email Campaign
          </Button>
          <Button
            variant="primary"
            class="gap-2 rounded-xl shadow-sm cursor-pointer font-semibold text-xs h-9"
            @click="startCampaignWizard('whatsapp')"
          >
            <MessageSquare class="w-4 h-4" />
            New WhatsApp Campaign
          </Button>
        </div>
      </div>

      <!-- KPI Summary Strip -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Campaigns</span>
            <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Megaphone class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold tracking-tight text-foreground">{{ summaryStats.total }}</span>
            <span class="text-xs font-semibold text-muted-foreground">active & sent</span>
          </div>
        </div>

        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">WhatsApp Broadcasts</span>
            <div class="p-1.5 rounded-lg bg-success/10 text-success">
              <MessageSquare class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold tracking-tight text-foreground">{{ summaryStats.whatsappCount }}</span>
            <span class="text-xs font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-md">97.2% Avg Delivery</span>
          </div>
        </div>

        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Campaigns</span>
            <div class="p-1.5 rounded-lg bg-info/10 text-info">
              <Mail class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold tracking-tight text-foreground">{{ summaryStats.emailCount }}</span>
            <span class="text-xs font-semibold text-info bg-info/10 px-1.5 py-0.5 rounded-md">67.6% Avg Open</span>
          </div>
        </div>

        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Audience Reached</span>
            <div class="p-1.5 rounded-lg bg-tag-4 text-tag-4-foreground">
              <Users class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold tracking-tight text-foreground">{{ summaryStats.totalReach.toLocaleString() }}</span>
            <span class="text-xs font-semibold text-muted-foreground">recipients</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs & Search Bar -->
      <div class="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <!-- Channel Filter Pills -->
        <div class="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl border border-border self-start">
          <button
            @click="channelFilter = 'all'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="channelFilter === 'all' ? 'bg-card text-foreground shadow-2xs border border-border' : 'text-muted-foreground hover:text-foreground'"
          >
            <span>All Campaigns</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">{{ campaigns.length }}</span>
          </button>
          <button
            @click="channelFilter = 'whatsapp'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="channelFilter === 'whatsapp' ? 'bg-card text-success shadow-2xs border border-border' : 'text-muted-foreground hover:text-foreground'"
          >
            <MessageSquare class="w-3.5 h-3.5" />
            <span>WhatsApp</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">{{ summaryStats.whatsappCount }}</span>
          </button>
          <button
            @click="channelFilter = 'email'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="channelFilter === 'email' ? 'bg-card text-info shadow-2xs border border-border' : 'text-muted-foreground hover:text-foreground'"
          >
            <Mail class="w-3.5 h-3.5" />
            <span>Email</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">{{ summaryStats.emailCount }}</span>
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-80">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="Search campaign title, subject, or label..."
            class="pl-9 pr-4 h-9 text-xs rounded-xl border-border bg-muted/30"
          />
        </div>
      </div>

      <!-- Unified Campaigns Table -->
      <div class="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <Table class="w-full border-collapse">
            <TableHeader class="bg-muted/30 border-b border-border">
              <TableRow>
                <TableHead class="py-3 pl-5 font-bold text-foreground text-xs">Campaign</TableHead>
                <TableHead class="py-3 font-bold text-foreground text-xs">Channel</TableHead>
                <TableHead class="py-3 font-bold text-foreground text-xs">Audience Label</TableHead>
                <TableHead class="py-3 font-bold text-foreground text-xs">Status</TableHead>
                <TableHead class="py-3 font-bold text-foreground text-xs">Delivery & Engagement</TableHead>
                <TableHead class="py-3 font-bold text-foreground text-xs">Sent</TableHead>
                <TableHead class="py-3 pr-5 text-right font-bold text-foreground text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="item in filteredCampaigns"
                :key="item.id"
                class="border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer group"
                @click="openResultsForCampaign(item)"
              >
                <!-- Campaign Name & Template/Subject Subtitle -->
                <TableCell class="py-3.5 pl-5 max-w-[290px]">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-bold text-foreground text-xs group-hover:text-primary transition-colors truncate">
                      {{ item.name }}
                    </span>
                    <span class="text-[11px] text-muted-foreground truncate">
                      <template v-if="item.channel === 'whatsapp'">
                        Template: <span class="font-semibold text-foreground/80">{{ item.templateName }}</span>
                      </template>
                      <template v-else>
                        Subject: <span class="font-semibold text-foreground/80">{{ item.subject }}</span>
                      </template>
                    </span>
                  </div>
                </TableCell>

                <!-- Channel Badge -->
                <TableCell class="py-3.5">
                  <span
                    v-if="item.channel === 'whatsapp'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-success/10 text-success border border-success/20"
                  >
                    <MessageSquare class="w-3 h-3" />
                    WhatsApp
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-info/10 text-info border border-info/20"
                  >
                    <Mail class="w-3 h-3" />
                    Email
                  </span>
                </TableCell>

                <!-- Audience Label -->
                <TableCell class="py-3.5">
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                      :class="getAudienceBadgeClass(item.audienceLabel)"
                    >
                      <Tag class="w-2.5 h-2.5" />
                      {{ item.audienceLabel }}
                    </span>
                    <span class="text-[11px] text-muted-foreground font-semibold">
                      ({{ item.recipientCount }})
                    </span>
                  </div>
                </TableCell>

                <!-- Status -->
                <TableCell class="py-3.5">
                  <Badge
                    variant="outline"
                    class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-success/10 text-success border-success/30"
                  >
                    {{ item.status }}
                  </Badge>
                </TableCell>

                <!-- Performance Inline Summary -->
                <TableCell class="py-3.5">
                  <div v-if="item.channel === 'whatsapp' && item.whatsappMetrics" class="flex items-center gap-3 text-[11px]">
                    <div class="flex flex-col">
                      <span class="text-muted-foreground text-[10px]">Sent</span>
                      <span class="font-bold text-foreground">{{ item.whatsappMetrics.sent }}</span>
                    </div>
                    <span class="text-border">•</span>
                    <div class="flex flex-col">
                      <span class="text-muted-foreground text-[10px]">Delivered</span>
                      <span class="font-bold text-success">{{ item.whatsappMetrics.delivered }}</span>
                    </div>
                    <span class="text-border">•</span>
                    <div class="flex flex-col">
                      <span class="text-muted-foreground text-[10px]">Read</span>
                      <span class="font-bold text-info">{{ item.whatsappMetrics.read }}</span>
                    </div>
                    <span class="text-border">•</span>
                    <div class="flex flex-col">
                      <span class="text-muted-foreground text-[10px]">Replied</span>
                      <span class="font-bold text-primary">{{ item.whatsappMetrics.replied }}</span>
                    </div>
                  </div>

                  <div v-else-if="item.channel === 'email' && item.emailMetrics" class="flex items-center gap-3 text-[11px]">
                    <div class="flex flex-col">
                      <span class="text-muted-foreground text-[10px]">Sent</span>
                      <span class="font-bold text-foreground">{{ item.emailMetrics.sent }}</span>
                    </div>
                    <span class="text-border">•</span>
                    <div class="flex flex-col">
                      <span class="text-muted-foreground text-[10px]">Opened</span>
                      <span class="font-bold text-info">{{ item.emailMetrics.opened }}</span>
                    </div>
                    <span class="text-border">•</span>
                    <div class="flex flex-col">
                      <span class="text-muted-foreground text-[10px]">Clicked</span>
                      <span class="font-bold text-primary">{{ item.emailMetrics.clicked }}</span>
                    </div>
                  </div>
                </TableCell>

                <!-- Sent Timestamp -->
                <TableCell class="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                  {{ item.sentAt }}
                </TableCell>

                <!-- View Results Button -->
                <TableCell class="py-3.5 pr-5 text-right" @click.stop>
                  <Button
                    variant="outline"
                    size="xs"
                    class="rounded-xl text-xs font-semibold gap-1.5 border-border hover:border-primary/40 hover:text-primary cursor-pointer"
                    @click="openResultsForCampaign(item)"
                  >
                    <BarChart3 class="w-3.5 h-3.5" />
                    Results
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </template>

    <!-- =======================================================================
         VIEW 2: THREE-STEP CAMPAIGN WIZARD (WhatsApp OR Email)
    ======================================================================== -->
    <template v-else-if="activeScreen === 'wizard'">
      <!-- Wizard Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div class="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            class="rounded-xl h-9 px-3 gap-1.5 cursor-pointer"
            @click="activeScreen = 'list'"
          >
            <ArrowLeft class="w-4 h-4" />
            Back to List
          </Button>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-foreground">
                {{ wizardChannel === 'whatsapp' ? 'Create WhatsApp Campaign' : 'Create Email Campaign' }}
              </h2>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                :class="wizardChannel === 'whatsapp' ? 'bg-success/10 text-success border-success/20' : 'bg-info/10 text-info border-info/20'"
              >
                <MessageSquare v-if="wizardChannel === 'whatsapp'" class="w-3 h-3" />
                <Mail v-else class="w-3 h-3" />
                {{ wizardChannel === 'whatsapp' ? 'WhatsApp Business API' : 'Bulk Email Marketing' }}
              </span>
            </div>
            <p class="text-xs text-muted-foreground">
              Step {{ wizardStep }} of 3 —
              <span v-if="wizardStep === 1">
                {{ wizardChannel === 'whatsapp' ? 'Choose an approved WhatsApp template' : 'Write subject line & compose email' }}
              </span>
              <span v-else-if="wizardStep === 2">Choose target audience by label</span>
              <span v-else>Review campaign details and send</span>
            </p>
          </div>
        </div>

        <!-- Channel Switcher Pill (in Step 1) -->
        <div class="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
          <button
            @click="wizardChannel = 'whatsapp'"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="wizardChannel === 'whatsapp' ? 'bg-card text-success shadow-2xs border border-border' : 'text-muted-foreground hover:text-foreground'"
          >
            <MessageSquare class="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button
            @click="wizardChannel = 'email'"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="wizardChannel === 'email' ? 'bg-card text-info shadow-2xs border border-border' : 'text-muted-foreground hover:text-foreground'"
          >
            <Mail class="w-3.5 h-3.5" />
            Email
          </button>
        </div>
      </div>

      <!-- 3-Step Horizontal Stepper -->
      <div class="grid grid-cols-3 gap-3">
        <!-- Step 1 Indicator -->
        <button
          @click="wizardStep = 1"
          class="flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer"
          :class="[
            wizardStep === 1
              ? 'bg-card border-primary ring-2 ring-primary/15 shadow-sm'
              : wizardStep > 1
                ? 'bg-card border-success/40 text-foreground'
                : 'bg-muted/40 border-border text-muted-foreground'
          ]"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
            :class="[
              wizardStep === 1
                ? 'bg-primary text-primary-foreground'
                : wizardStep > 1
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
            ]"
          >
            <Check v-if="wizardStep > 1" class="w-4 h-4" />
            <span v-else>1</span>
          </div>
          <div class="min-w-0">
            <div class="text-xs font-bold text-foreground truncate">
              {{ wizardChannel === 'whatsapp' ? '1. Approved Template' : '1. Subject & Email Editor' }}
            </div>
            <div class="text-[11px] text-muted-foreground truncate">
              {{ wizardChannel === 'whatsapp' ? selectedWhatsAppTemplate.name : (emailSubject || 'Compose message') }}
            </div>
          </div>
        </button>

        <!-- Step 2 Indicator -->
        <button
          @click="wizardStep = 2"
          class="flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer"
          :class="[
            wizardStep === 2
              ? 'bg-card border-primary ring-2 ring-primary/15 shadow-sm'
              : wizardStep > 2
                ? 'bg-card border-success/40 text-foreground'
                : 'bg-muted/40 border-border text-muted-foreground'
          ]"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
            :class="[
              wizardStep === 2
                ? 'bg-primary text-primary-foreground'
                : wizardStep > 2
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
            ]"
          >
            <Check v-if="wizardStep > 2" class="w-4 h-4" />
            <span v-else>2</span>
          </div>
          <div class="min-w-0">
            <div class="text-xs font-bold text-foreground truncate">2. Choose Audience</div>
            <div class="text-[11px] text-muted-foreground truncate">
              Label: {{ selectedAudienceLabel }} ({{ estimatedReachCount }} contacts)
            </div>
          </div>
        </button>

        <!-- Step 3 Indicator -->
        <button
          @click="wizardStep = 3"
          class="flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer"
          :class="[
            wizardStep === 3
              ? 'bg-card border-primary ring-2 ring-primary/15 shadow-sm'
              : 'bg-muted/40 border-border text-muted-foreground'
          ]"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
            :class="wizardStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
          >
            3
          </div>
          <div class="min-w-0">
            <div class="text-xs font-bold text-foreground truncate">3. Review & Send</div>
            <div class="text-[11px] text-muted-foreground truncate">Confirm & launch broadcast</div>
          </div>
        </button>
      </div>

      <!-- =================================================================
           STEP 1A: WHATSAPP APPROVED TEMPLATE PICKER
      ================================================================== -->
      <div v-if="wizardStep === 1 && wizardChannel === 'whatsapp'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left 7 cols: Campaign Info + Approved Templates List -->
        <div class="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-foreground">Campaign Title</label>
              <Input
                v-model="waCampaignName"
                placeholder="e.g. Q2 Hot Leads WhatsApp Broadcast"
                class="rounded-xl border-border text-xs h-9"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-foreground">WhatsApp Business Inbox</label>
              <select
                v-model="waSelectedInbox"
                class="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="RakanSales Official WABA (+6012 345 6789)">RakanSales Official WABA (+6012 345 6789)</option>
                <option value="Enterprise Sales MY (+6017 889 2210)">Enterprise Sales MY (+6017 889 2210)</option>
              </select>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-foreground">Choose an Approved WhatsApp Template</h3>
                <p class="text-xs text-muted-foreground">Select a Meta-approved HSM template to initiate conversations outside the 24h window.</p>
              </div>
              <Badge variant="outline" class="bg-success/10 text-success border-success/30 text-[10px] font-bold gap-1">
                <ShieldCheck class="w-3 h-3" />
                Meta Approved
              </Badge>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="tpl in approvedWhatsAppTemplates"
                :key="tpl.id"
                @click="waSelectedTemplateId = tpl.id"
                class="p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2"
                :class="[
                  waSelectedTemplateId === tpl.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                    : 'border-border bg-card hover:bg-muted/30'
                ]"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-4 h-4 rounded-full border flex items-center justify-center"
                      :class="waSelectedTemplateId === tpl.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'"
                    >
                      <Check v-if="waSelectedTemplateId === tpl.id" class="w-2.5 h-2.5" />
                    </div>
                    <span class="font-bold text-xs text-foreground">{{ tpl.name }}</span>
                    <span class="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">{{ tpl.code }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Badge variant="outline" class="text-[9px] font-bold bg-muted text-muted-foreground border-border">
                      {{ tpl.language }}
                    </Badge>
                    <Badge variant="outline" class="text-[9px] font-bold bg-success/10 text-success border-success/30">
                      APPROVED • {{ tpl.category }}
                    </Badge>
                  </div>
                </div>
                <p class="text-xs text-muted-foreground leading-relaxed pl-6">
                  {{ tpl.bodyText }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 5 cols: Live WhatsApp Handset Preview -->
        <div class="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-border pb-3">
              <div class="flex items-center gap-2">
                <Smartphone class="w-4 h-4 text-primary" />
                <span class="text-xs font-bold text-foreground uppercase tracking-wider">WhatsApp Message Preview</span>
              </div>
              <span class="text-[11px] text-muted-foreground font-semibold">Live Variable Resolution</span>
            </div>

            <!-- Simulated Phone Screen -->
            <div class="bg-muted/50 border border-border rounded-2xl p-4 space-y-3">
              <div class="flex items-center gap-2.5 pb-2.5 border-b border-border/80">
                <div class="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center font-bold text-xs">
                  RS
                </div>
                <div>
                  <div class="text-xs font-bold text-foreground flex items-center gap-1">
                    RakanSales Official
                    <CheckCircle2 class="w-3 h-3 text-success" />
                  </div>
                  <div class="text-[10px] text-muted-foreground">Official Business Account</div>
                </div>
              </div>

              <!-- WhatsApp Bubble -->
              <div class="bg-card border border-border rounded-2xl rounded-tl-sm p-3.5 shadow-sm space-y-2 max-w-[92%]">
                <div v-if="selectedWhatsAppTemplate.headerText" class="text-xs font-extrabold text-foreground">
                  {{ selectedWhatsAppTemplate.headerText }}
                </div>
                <p class="text-xs text-foreground leading-relaxed">
                  {{ selectedWhatsAppTemplate.sampleResolvedBody }}
                </p>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[10px] text-muted-foreground">{{ selectedWhatsAppTemplate.footerText }}</span>
                  <span class="text-[10px] text-muted-foreground font-semibold">10:30 AM</span>
                </div>

                <!-- Interactive Quick Reply Buttons -->
                <div v-if="selectedWhatsAppTemplate.buttons?.length" class="pt-2 border-t border-border flex flex-col gap-1.5">
                  <div
                    v-for="btn in selectedWhatsAppTemplate.buttons"
                    :key="btn"
                    class="w-full py-1.5 text-center text-xs font-bold text-info bg-info/5 rounded-lg border border-info/20"
                  >
                    {{ btn }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-5 mt-5 border-t border-border flex items-center justify-between">
            <Button variant="ghost" class="rounded-xl text-xs cursor-pointer" @click="activeScreen = 'list'">
              Cancel
            </Button>
            <Button variant="primary" class="rounded-xl text-xs gap-2 cursor-pointer" @click="nextWizardStep">
              Continue to Audience
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- =================================================================
           STEP 1B: EMAIL SUBJECT LINE & SIMPLE EMAIL EDITOR
      ================================================================== -->
      <div v-if="wizardStep === 1 && wizardChannel === 'email'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left 7 cols: Email Setup & Simple Rich Editor -->
        <div class="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-foreground">Email Campaign Editor</h3>
              <p class="text-xs text-muted-foreground">Write your subject line and craft your email content below.</p>
            </div>
            <!-- Quick Starter Presets -->
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-bold text-muted-foreground uppercase mr-1">Presets:</span>
              <button
                @click="loadEmailPreset('promo')"
                class="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground cursor-pointer"
              >
                Q2 Promo
              </button>
              <button
                @click="loadEmailPreset('newsletter')"
                class="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground cursor-pointer"
              >
                Product Update
              </button>
              <button
                @click="loadEmailPreset('reengage')"
                class="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground cursor-pointer"
              >
                Check-In
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Campaign Name</label>
              <Input
                v-model="emailCampaignName"
                placeholder="e.g. Q2 Hot Leads Executive Offer"
                class="rounded-xl border-border text-xs h-9"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-foreground">Verified Sender</label>
              <Input
                v-model="emailSenderAddress"
                placeholder="olivia@rakansales.com"
                class="rounded-xl border-border text-xs h-9"
              />
            </div>
          </div>

          <!-- Subject Line -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-foreground">Subject Line *</label>
            <Input
              v-model="emailSubject"
              placeholder="Write a compelling subject line..."
              class="rounded-xl border-border text-xs h-9 font-semibold"
            />
          </div>

          <!-- Simple Email Editor Box -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-foreground">Email Body Editor</label>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] text-muted-foreground font-semibold">Insert variable:</span>
                <button
                  @click="insertEmailToken('contact.first_name')"
                  class="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold cursor-pointer hover:bg-primary/20"
                >
                  + first_name
                </button>
                <button
                  @click="insertEmailToken('company.name')"
                  class="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold cursor-pointer hover:bg-primary/20"
                >
                  + company
                </button>
              </div>
            </div>

            <div class="border border-border rounded-2xl overflow-hidden bg-background">
              <!-- Formatting Toolbar -->
              <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="applyEmailFormatting('bold')"
                    class="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Bold"
                  >
                    <Bold class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    @click="applyEmailFormatting('italic')"
                    class="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Italic"
                  >
                    <Italic class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    @click="applyEmailFormatting('bullet')"
                    class="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Bullet List"
                  >
                    <List class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    @click="applyEmailFormatting('link')"
                    class="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Insert Link"
                  >
                    <Link2 class="w-3.5 h-3.5" />
                  </button>
                </div>
                <span class="text-[10px] font-semibold text-muted-foreground">Simple Email Editor</span>
              </div>

              <!-- Textarea Content -->
              <Textarea
                v-model="emailBodyContent"
                rows="8"
                class="border-0 focus-visible:ring-0 rounded-none text-xs leading-relaxed p-3.5 bg-background resize-none"
                placeholder="Write your email message here..."
              />

              <!-- Primary CTA Button Config inside Editor -->
              <div class="px-3.5 py-2.5 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <span class="text-[11px] font-bold text-muted-foreground shrink-0">CTA Button:</span>
                <Input
                  v-model="emailCtaText"
                  placeholder="Button label"
                  class="h-7 text-xs rounded-lg border-border bg-card flex-1"
                />
                <Input
                  v-model="emailCtaUrl"
                  placeholder="https://..."
                  class="h-7 text-xs rounded-lg border-border bg-card flex-1 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right 5 cols: Live Email Client Preview -->
        <div class="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-border pb-3">
              <div class="flex items-center gap-2">
                <Monitor class="w-4 h-4 text-info" />
                <span class="text-xs font-bold text-foreground uppercase tracking-wider">Live Email Preview</span>
              </div>
              <div class="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
                <button
                  @click="emailPreviewDevice = 'desktop'"
                  class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
                  :class="emailPreviewDevice === 'desktop' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'"
                >
                  Desktop
                </button>
                <button
                  @click="emailPreviewDevice = 'mobile'"
                  class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
                  :class="emailPreviewDevice === 'mobile' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'"
                >
                  Mobile
                </button>
              </div>
            </div>

            <!-- Simulated Email Client Window -->
            <div
              class="border border-border rounded-2xl overflow-hidden bg-background mx-auto transition-all"
              :class="emailPreviewDevice === 'mobile' ? 'max-w-[300px]' : 'w-full'"
            >
              <div class="p-3.5 bg-muted/40 border-b border-border space-y-1.5">
                <div class="text-xs font-extrabold text-foreground leading-snug">
                  {{ emailSubject || '(No subject line)' }}
                </div>
                <div class="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>From: <strong class="text-foreground">{{ emailSenderName }}</strong> &lt;{{ emailSenderAddress }}&gt;</span>
                </div>
                <div class="text-[11px] text-muted-foreground">
                  To: <span class="text-foreground font-medium">Mel Wong &lt;melwong@kksteel.com&gt;</span>
                </div>
              </div>

              <div class="p-4 space-y-4">
                <div class="text-xs text-foreground whitespace-pre-line leading-relaxed">
                  {{ resolvedEmailPreview }}
                </div>

                <div v-if="emailCtaText" class="pt-1">
                  <span class="inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-2xs">
                    {{ emailCtaText }}
                  </span>
                </div>

                <div class="pt-4 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Sent via RakanSales CRM • Verified Domain</span>
                  <span class="underline">Unsubscribe</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-5 mt-5 border-t border-border flex items-center justify-between">
            <Button variant="ghost" class="rounded-xl text-xs cursor-pointer" @click="activeScreen = 'list'">
              Cancel
            </Button>
            <Button variant="primary" class="rounded-xl text-xs gap-2 cursor-pointer" @click="nextWizardStep">
              Continue to Audience
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- =================================================================
           STEP 2: CHOOSE AUDIENCE BY LABEL (Shared for WhatsApp & Email)
      ================================================================== -->
      <div v-else-if="wizardStep === 2" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left 7 cols: Label Cards -->
        <div class="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-foreground">Choose Target Audience by Label</h3>
              <p class="text-xs text-muted-foreground">
                Select a CRM contact label segment to receive this {{ wizardChannel === 'whatsapp' ? 'WhatsApp broadcast' : 'email campaign' }}.
              </p>
            </div>
            <Badge variant="outline" class="text-[11px] font-bold bg-primary/10 text-primary border-primary/20">
              {{ estimatedReachCount }} Reachable Contacts
            </Badge>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="seg in audienceLabels"
              :key="seg.id"
              @click="selectedAudienceLabel = seg.label"
              class="p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4"
              :class="[
                selectedAudienceLabel === seg.label
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                  : 'border-border bg-card hover:bg-muted/30'
              ]"
            >
              <div class="flex items-start gap-3 min-w-0">
                <div
                  class="w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0"
                  :class="selectedAudienceLabel === seg.label ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'"
                >
                  <Check v-if="selectedAudienceLabel === seg.label" class="w-3 h-3" />
                </div>
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border"
                      :class="seg.tagStyle"
                    >
                      <Tag class="w-3 h-3" />
                      {{ seg.label }}
                    </span>
                    <span v-if="seg.label === 'Hot'" class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Recommended High-Intent Segment
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground leading-snug">
                    {{ seg.description }}
                  </p>
                </div>
              </div>

              <div class="text-right shrink-0">
                <div class="text-base font-extrabold text-foreground">
                  {{ wizardChannel === 'whatsapp' ? seg.whatsappReachable : seg.emailReachable }}
                </div>
                <div class="text-[10px] text-muted-foreground font-semibold">
                  {{ wizardChannel === 'whatsapp' ? 'with valid phone' : 'with valid email' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 5 cols: Selected Audience Preview -->
        <div class="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-border pb-3">
              <div class="flex items-center gap-2">
                <Users class="w-4 h-4 text-primary" />
                <span class="text-xs font-bold text-foreground uppercase tracking-wider">
                  "{{ selectedAudienceLabel }}" Audience Preview
                </span>
              </div>
              <span class="text-xs font-bold text-primary">{{ estimatedReachCount }} recipients</span>
            </div>

            <div class="bg-muted/30 border border-border rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-foreground">Estimated Reachable Audience</div>
                <div class="text-[11px] text-muted-foreground">
                  Out of {{ currentAudienceObj.totalContacts }} total contacts tagged <strong class="text-foreground">{{ selectedAudienceLabel }}</strong>
                </div>
              </div>
              <div class="text-2xl font-extrabold text-primary">{{ estimatedReachCount }}</div>
            </div>

            <!-- Sample matching contacts list -->
            <div class="space-y-2">
              <div class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Sample Matching Contacts
              </div>
              <div class="divide-y divide-border border border-border rounded-xl bg-background overflow-hidden">
                <div
                  v-for="rec in currentAudienceObj.sampleRecipients"
                  :key="rec.id"
                  class="px-3.5 py-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div class="font-bold text-foreground">{{ rec.name }}</div>
                    <div class="text-[10px] text-muted-foreground">{{ rec.company }}</div>
                  </div>
                  <div class="font-mono text-[11px] text-muted-foreground">
                    {{ wizardChannel === 'whatsapp' ? rec.phone : rec.email }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-5 mt-5 border-t border-border flex items-center justify-between">
            <Button variant="outline" class="rounded-xl text-xs gap-1.5 cursor-pointer" @click="prevWizardStep">
              <ArrowLeft class="w-4 h-4" />
              Back
            </Button>
            <Button variant="primary" class="rounded-xl text-xs gap-2 cursor-pointer" @click="nextWizardStep">
              Continue to Review & Send
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- =================================================================
           STEP 3: REVIEW & SEND (Shared for WhatsApp & Email)
      ================================================================== -->
      <div v-else-if="wizardStep === 3" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left 7 cols: Campaign Checklist Summary -->
        <div class="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <div class="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 class="text-base font-bold text-foreground">Review Campaign Before Sending</h3>
              <p class="text-xs text-muted-foreground">Verify your template/content, target audience label, and delivery settings.</p>
            </div>
            <Badge variant="outline" class="bg-success/10 text-success border-success/30 text-xs font-bold gap-1 px-3 py-1">
              <CheckCircle2 class="w-3.5 h-3.5" />
              Ready to Send
            </Badge>
          </div>

          <!-- Review Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-muted/30 border border-border space-y-1">
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Campaign Name</span>
              <div class="text-sm font-bold text-foreground">
                {{ wizardChannel === 'whatsapp' ? waCampaignName : emailCampaignName }}
              </div>
            </div>

            <div class="p-4 rounded-xl bg-muted/30 border border-border space-y-1">
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Channel & Sender</span>
              <div class="text-sm font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare v-if="wizardChannel === 'whatsapp'" class="w-4 h-4 text-success" />
                <Mail v-else class="w-4 h-4 text-info" />
                <span class="truncate">{{ wizardChannel === 'whatsapp' ? waSelectedInbox : emailSenderAddress }}</span>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-muted/30 border border-border space-y-1">
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {{ wizardChannel === 'whatsapp' ? 'Approved HSM Template' : 'Email Subject Line' }}
              </span>
              <div class="text-sm font-bold text-foreground">
                {{ wizardChannel === 'whatsapp' ? selectedWhatsAppTemplate.name : emailSubject }}
              </div>
            </div>

            <div class="p-4 rounded-xl bg-muted/30 border border-border space-y-1">
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Audience Label</span>
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="getAudienceBadgeClass(selectedAudienceLabel)"
                >
                  <Tag class="w-3 h-3" />
                  {{ selectedAudienceLabel }}
                </span>
                <span class="text-xs font-extrabold text-foreground">
                  {{ estimatedReachCount }} recipients
                </span>
              </div>
            </div>
          </div>

          <!-- Delivery Timing -->
          <div class="space-y-2.5">
            <label class="text-xs font-bold text-foreground">Delivery Schedule</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                @click="deliveryScheduleMode = 'now'"
                class="p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all"
                :class="deliveryScheduleMode === 'now' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card'"
              >
                <Send class="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div class="text-xs font-bold text-foreground">Send Immediately</div>
                  <div class="text-[11px] text-muted-foreground">Dispatch to all {{ estimatedReachCount }} contacts now</div>
                </div>
              </div>
              <div
                @click="deliveryScheduleMode = 'later'"
                class="p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all"
                :class="deliveryScheduleMode === 'later' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card'"
              >
                <Clock class="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <div class="text-xs font-bold text-foreground">Schedule for Optimal Window</div>
                  <div class="text-[11px] text-muted-foreground">Tomorrow at 10:00 AM MYT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 5 cols: Final Content Preview & Launch CTA -->
        <div class="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div class="space-y-4">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Final Content Preview</span>

            <div v-if="wizardChannel === 'whatsapp'" class="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div class="text-xs font-extrabold text-foreground">{{ selectedWhatsAppTemplate.headerText }}</div>
              <p class="text-xs text-foreground leading-relaxed">{{ selectedWhatsAppTemplate.sampleResolvedBody }}</p>
              <div class="text-[10px] text-muted-foreground pt-1">{{ selectedWhatsAppTemplate.footerText }}</div>
            </div>

            <div v-else class="p-4 rounded-2xl bg-muted/40 border border-border space-y-2.5">
              <div class="text-xs font-extrabold text-foreground border-b border-border pb-2">
                Subject: {{ emailSubject }}
              </div>
              <p class="text-xs text-foreground whitespace-pre-line leading-relaxed line-clamp-6">
                {{ resolvedEmailPreview }}
              </p>
              <div v-if="emailCtaText" class="pt-1">
                <span class="inline-block px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold">
                  {{ emailCtaText }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-5 mt-5 border-t border-border flex items-center justify-between gap-3">
            <Button variant="outline" class="rounded-xl text-xs gap-1.5 cursor-pointer" @click="prevWizardStep">
              <ArrowLeft class="w-4 h-4" />
              Back to Audience
            </Button>
            <Button
              variant="primary"
              class="rounded-xl text-xs gap-2 px-6 h-10 font-bold shadow-sm cursor-pointer"
              :disabled="isSendingCampaign"
              @click="handleSendCampaign"
            >
              <Send class="w-4 h-4" />
              <span>{{ isSendingCampaign ? 'Sending Campaign...' : `Send Campaign (${estimatedReachCount})` }}</span>
            </Button>
          </div>
        </div>
      </div>
    </template>

    <!-- =======================================================================
         VIEW 3: CAMPAIGN RESULTS VIEW (WhatsApp: Sent/Delivered/Read/Replied | Email: Sent/Opened/Clicked)
    ======================================================================== -->
    <template v-else-if="activeScreen === 'results' && selectedCampaignForResults">
      <!-- Top Results Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm">
        <div class="flex items-start sm:items-center gap-3.5">
          <Button
            variant="outline"
            size="sm"
            class="rounded-xl h-9 px-3 gap-1.5 cursor-pointer shrink-0"
            @click="activeScreen = 'list'"
          >
            <ArrowLeft class="w-4 h-4" />
            All Campaigns
          </Button>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-lg font-bold text-foreground">{{ selectedCampaignForResults.name }}</h1>
              <span
                v-if="selectedCampaignForResults.channel === 'whatsapp'"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success/10 text-success border border-success/20"
              >
                <MessageSquare class="w-3 h-3" />
                WhatsApp Campaign
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-info/10 text-info border border-info/20"
              >
                <Mail class="w-3 h-3" />
                Email Campaign
              </span>
              <span
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                :class="getAudienceBadgeClass(selectedCampaignForResults.audienceLabel)"
              >
                <Tag class="w-3 h-3" />
                Audience: {{ selectedCampaignForResults.audienceLabel }}
              </span>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              Sent {{ selectedCampaignForResults.sentAt }} •
              <span v-if="selectedCampaignForResults.channel === 'whatsapp'">
                Template: <strong class="text-foreground">{{ selectedCampaignForResults.templateName }}</strong> via {{ selectedCampaignForResults.inboxName }}
              </span>
              <span v-else>
                Subject: <strong class="text-foreground">{{ selectedCampaignForResults.subject }}</strong> from {{ selectedCampaignForResults.fromEmail }}
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            class="rounded-xl text-xs gap-1.5 cursor-pointer"
            @click="startCampaignWizard(selectedCampaignForResults.channel === 'whatsapp' ? 'email' : 'whatsapp')"
          >
            <Plus class="w-3.5 h-3.5" />
            New {{ selectedCampaignForResults.channel === 'whatsapp' ? 'Email' : 'WhatsApp' }} Campaign
          </Button>
        </div>
      </div>

      <!-- WHATSAPP RESULTS METRICS: Sent, Delivered, Read, Replied -->
      <div
        v-if="selectedCampaignForResults.channel === 'whatsapp' && selectedCampaignForResults.whatsappMetrics"
        class="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <!-- Sent -->
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sent</span>
            <div class="p-2 rounded-xl bg-muted text-foreground">
              <Send class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-foreground">
              {{ selectedCampaignForResults.whatsappMetrics.sent }}
            </span>
            <span class="text-xs font-semibold text-muted-foreground">100%</span>
          </div>
          <p class="text-[11px] text-muted-foreground mt-1">Total messages dispatched</p>
        </div>

        <!-- Delivered -->
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Delivered</span>
            <div class="p-2 rounded-xl bg-success/10 text-success">
              <CheckCircle2 class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-foreground">
              {{ selectedCampaignForResults.whatsappMetrics.delivered }}
            </span>
            <span class="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
              {{ Math.round((selectedCampaignForResults.whatsappMetrics.delivered / selectedCampaignForResults.whatsappMetrics.sent) * 100) }}%
            </span>
          </div>
          <p class="text-[11px] text-muted-foreground mt-1">Confirmed handset delivery</p>
        </div>

        <!-- Read -->
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Read</span>
            <div class="p-2 rounded-xl bg-info/10 text-info">
              <Eye class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-foreground">
              {{ selectedCampaignForResults.whatsappMetrics.read }}
            </span>
            <span class="text-xs font-bold text-info bg-info/10 px-2 py-0.5 rounded-md">
              {{ Math.round((selectedCampaignForResults.whatsappMetrics.read / selectedCampaignForResults.whatsappMetrics.sent) * 100) }}%
            </span>
          </div>
          <p class="text-[11px] text-muted-foreground mt-1">Opened in WhatsApp</p>
        </div>

        <!-- Replied -->
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Replied</span>
            <div class="p-2 rounded-xl bg-primary/10 text-primary">
              <MessageCircleReply class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-primary">
              {{ selectedCampaignForResults.whatsappMetrics.replied }}
            </span>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {{ Math.round((selectedCampaignForResults.whatsappMetrics.replied / selectedCampaignForResults.whatsappMetrics.sent) * 100) }}%
            </span>
          </div>
          <p class="text-[11px] text-muted-foreground mt-1">Inbound customer responses</p>
        </div>
      </div>

      <!-- EMAIL RESULTS METRICS: Sent, Opened, Clicked -->
      <div
        v-else-if="selectedCampaignForResults.channel === 'email' && selectedCampaignForResults.emailMetrics"
        class="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <!-- Sent -->
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sent</span>
            <div class="p-2 rounded-xl bg-muted text-foreground">
              <Send class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-foreground">
              {{ selectedCampaignForResults.emailMetrics.sent }}
            </span>
            <span class="text-xs font-semibold text-muted-foreground">100%</span>
          </div>
          <p class="text-[11px] text-muted-foreground mt-1">Total emails delivered to inbox</p>
        </div>

        <!-- Opened -->
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Opened</span>
            <div class="p-2 rounded-xl bg-info/10 text-info">
              <Eye class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-foreground">
              {{ selectedCampaignForResults.emailMetrics.opened }}
            </span>
            <span class="text-xs font-bold text-info bg-info/10 px-2 py-0.5 rounded-md">
              {{ Math.round((selectedCampaignForResults.emailMetrics.opened / selectedCampaignForResults.emailMetrics.sent) * 100) }}% Open Rate
            </span>
          </div>
          <p class="text-[11px] text-muted-foreground mt-1">Unique recipient opens tracked</p>
        </div>

        <!-- Clicked -->
        <div class="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Clicked</span>
            <div class="p-2 rounded-xl bg-primary/10 text-primary">
              <MousePointerClick class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-primary">
              {{ selectedCampaignForResults.emailMetrics.clicked }}
            </span>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {{ Math.round((selectedCampaignForResults.emailMetrics.clicked / selectedCampaignForResults.emailMetrics.sent) * 100) }}% Click Rate
            </span>
          </div>
          <p class="text-[11px] text-muted-foreground mt-1">Recipients who clicked CTA link</p>
        </div>
      </div>

      <!-- Recipient Engagement Table + Sent Content Snapshot -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left 8 cols: Recipient Activity Breakdown -->
        <div class="lg:col-span-8 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-foreground">Recipient Delivery & Engagement Log</h3>
              <p class="text-xs text-muted-foreground">
                Real-time status for contacts in the "{{ selectedCampaignForResults.audienceLabel }}" audience.
              </p>
            </div>
            <Badge variant="outline" class="text-[11px] font-semibold bg-muted text-muted-foreground">
              Showing sample of {{ selectedCampaignForResults.recipientCount }} recipients
            </Badge>
          </div>

          <Table class="w-full border-collapse">
            <TableHeader class="bg-muted/30 border-b border-border">
              <TableRow>
                <TableHead class="py-2.5 pl-5 text-xs font-bold text-foreground">Contact</TableHead>
                <TableHead class="py-2.5 text-xs font-bold text-foreground">
                  {{ selectedCampaignForResults.channel === 'whatsapp' ? 'Phone' : 'Email' }}
                </TableHead>
                <TableHead class="py-2.5 text-xs font-bold text-foreground">Status</TableHead>
                <TableHead class="py-2.5 pr-5 text-xs font-bold text-foreground">Engagement Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="r in selectedCampaignForResults.recipients"
                :key="r.id"
                class="border-b border-border/50 hover:bg-muted/20"
              >
                <TableCell class="py-3 pl-5">
                  <div class="font-bold text-xs text-foreground">{{ r.name }}</div>
                  <div class="text-[10px] text-muted-foreground">{{ r.company }}</div>
                </TableCell>
                <TableCell class="py-3 font-mono text-xs text-muted-foreground">
                  {{ r.contactInfo }}
                </TableCell>
                <TableCell class="py-3">
                  <Badge
                    variant="outline"
                    class="text-[10px] font-bold rounded-full px-2.5 py-0.5"
                    :class="[
                      r.status === 'Replied' || r.status === 'Clicked' ? 'bg-primary/10 text-primary border-primary/30' : '',
                      r.status === 'Read' || r.status === 'Opened' ? 'bg-info/10 text-info border-info/30' : '',
                      r.status === 'Delivered' || r.status === 'Sent' ? 'bg-success/10 text-success border-success/30' : ''
                    ]"
                  >
                    {{ r.status }}
                  </Badge>
                </TableCell>
                <TableCell class="py-3 pr-5 text-xs text-muted-foreground">
                  {{ r.detailNote }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Right 4 cols: Sent Message Snapshot -->
        <div class="lg:col-span-4 bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-border pb-3">
            <span class="text-xs font-bold text-foreground uppercase tracking-wider">Dispatched Content</span>
            <span class="text-[11px] font-semibold text-muted-foreground">{{ selectedCampaignForResults.status }}</span>
          </div>

          <div v-if="selectedCampaignForResults.channel === 'whatsapp'" class="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div class="text-[11px] font-bold text-success">{{ selectedCampaignForResults.templateName }}</div>
            <p class="text-xs text-foreground leading-relaxed">{{ selectedCampaignForResults.templateBody }}</p>
          </div>

          <div v-else class="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div class="text-xs font-bold text-foreground border-b border-border pb-2">
              {{ selectedCampaignForResults.subject }}
            </div>
            <p class="text-xs text-foreground whitespace-pre-line leading-relaxed">
              {{ selectedCampaignForResults.emailBody }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
