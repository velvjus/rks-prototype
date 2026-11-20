export type CampaignChannel = 'whatsapp' | 'email'
export type CampaignStatus = 'Sent' | 'Scheduled' | 'Draft'

export interface WhatsAppApprovedTemplate {
  id: string
  name: string
  code: string
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
  language: 'EN' | 'BM'
  inboxName: string
  headerText?: string
  bodyText: string
  footerText?: string
  buttons?: string[]
  variables: string[]
  sampleResolvedBody: string
}

export interface AudienceSegmentLabel {
  id: string
  label: string
  description: string
  tagStyle: string
  totalContacts: number
  whatsappReachable: number
  emailReachable: number
  sampleRecipients: {
    id: string
    name: string
    company: string
    phone: string
    email: string
  }[]
}

export interface CampaignRecipientResult {
  id: string
  name: string
  company: string
  contactInfo: string // phone for WA, email for Email
  status: 'Replied' | 'Read' | 'Delivered' | 'Sent' | 'Opened' | 'Clicked'
  sentAt: string
  updatedAt: string
  detailNote?: string
}

export interface CampaignRecord {
  id: string
  name: string
  channel: CampaignChannel
  status: CampaignStatus
  audienceLabel: string
  recipientCount: number
  createdAt: string
  sentAt: string
  // WhatsApp specific fields
  inboxName?: string
  templateId?: string
  templateName?: string
  templateBody?: string
  whatsappMetrics?: {
    sent: number
    delivered: number
    read: number
    replied: number
  }
  // Email specific fields
  subject?: string
  previewText?: string
  fromName?: string
  fromEmail?: string
  emailBody?: string
  emailMetrics?: {
    sent: number
    opened: number
    clicked: number
  }
  recipients: CampaignRecipientResult[]
}

export const approvedWhatsAppTemplates: WhatsAppApprovedTemplate[] = [
  {
    id: 'wa-tpl-hot-promo',
    name: 'Q2 Growth Promo & Priority Demo',
    code: 'q2_hot_lead_promo',
    category: 'MARKETING',
    language: 'EN',
    inboxName: 'RakanSales Official WABA (+6012 345 6789)',
    headerText: 'Accelerate Your Q2 Sales Pipeline 🚀',
    bodyText: 'Hi {{1}}, we noticed {{2}} is expanding your sales operations! Unlock our Q2 Growth Package with automated WhatsApp routing & AI transcription. Reply YES to claim your 14-day priority sandbox.',
    footerText: 'RakanSales CRM • Reply STOP to opt out',
    buttons: ['Yes, Book Priority Demo', 'View Pricing Deck'],
    variables: ['contact.first_name', 'company.name'],
    sampleResolvedBody: 'Hi Ahmad, we noticed Malayan Trading is expanding your sales operations! Unlock our Q2 Growth Package with automated WhatsApp routing & AI transcription. Reply YES to claim your 14-day priority sandbox.'
  },
  {
    id: 'wa-tpl-reengage',
    name: 'Hot Lead 24h Follow-Up & Quotation',
    code: 'enterprise_followup_my',
    category: 'UTILITY',
    language: 'EN',
    inboxName: 'RakanSales Official WABA (+6012 345 6789)',
    headerText: 'Proposal & Commercial Quotation Follow-Up',
    bodyText: 'Hello {{1}}, this is Olivia from RakanSales. Just checking in on the Enterprise CRM quotation prepared for {{2}}. Let us know if you would like to adjust seat counts or schedule a technical walkthrough this week.',
    footerText: 'RakanSales Enterprise Team',
    buttons: ['Confirm Walkthrough', 'Request Revised Quote'],
    variables: ['contact.first_name', 'company.name'],
    sampleResolvedBody: 'Hello Mei Ting, this is Olivia from RakanSales. Just checking in on the Enterprise CRM quotation prepared for KK Steel Manufacturing. Let us know if you would like to adjust seat counts or schedule a technical walkthrough this week.'
  },
  {
    id: 'wa-tpl-bm-offer',
    name: 'Jemputan Eksklusif Pakej Usahawan (BM)',
    code: 'pakej_usahawan_my_2026',
    category: 'MARKETING',
    language: 'BM',
    inboxName: 'RakanSales Official WABA (+6012 345 6789)',
    headerText: 'Tawaran Istimewa RakanSales C4 ✨',
    bodyText: 'Hai {{1}}, tingkatkan jualan pasukan {{2}} dengan integrasi WhatsApp Business API & AI Automasi. Balas mesej ini untuk dapatkan sesi konsultasi percuma bersama pakar kami minggu ini.',
    footerText: 'RakanSales Malaysia • Balas STOP untuk berhenti',
    buttons: ['Tempah Sesi Demo', 'Lihat Pakej'],
    variables: ['contact.first_name', 'company.name'],
    sampleResolvedBody: 'Hai Rizal, tingkatkan jualan pasukan Borneo Ventures dengan integrasi WhatsApp Business API & AI Automasi. Balas mesej ini untuk dapatkan sesi konsultasi percuma bersama pakar kami minggu ini.'
  },
  {
    id: 'wa-tpl-summit',
    name: 'SME AI Sales Summit VIP Pass',
    code: 'sme_ai_summit_invite',
    category: 'MARKETING',
    language: 'EN',
    inboxName: 'RakanSales Official WABA (+6012 345 6789)',
    headerText: 'VIP Invitation: KL SME AI Summit 2026',
    bodyText: 'Hi {{1}}, we have reserved a complimentary VIP Executive Pass for {{2}} at the upcoming KL SME AI Sales Summit. Reply CONFIRM to receive your digital QR badge immediately.',
    footerText: 'Limited to 150 VIP guests',
    buttons: ['Confirm VIP Pass', 'See Agenda'],
    variables: ['contact.first_name', 'company.name'],
    sampleResolvedBody: 'Hi Daniel, we have reserved a complimentary VIP Executive Pass for Tech Solutions at the upcoming KL SME AI Sales Summit. Reply CONFIRM to receive your digital QR badge immediately.'
  }
]

export const audienceLabels: AudienceSegmentLabel[] = [
  {
    id: 'lbl-hot',
    label: 'Hot',
    description: 'High-intent leads ready for immediate closing or priority demo follow-up',
    tagStyle: 'bg-destructive/10 text-destructive border-destructive/30',
    totalContacts: 148,
    whatsappReachable: 142,
    emailReachable: 145,
    sampleRecipients: [
      { id: 'r-1', name: 'Mel Wong', company: 'KK Steel Sdn Bhd', phone: '+60 12-345 6789', email: 'melwong@kksteel.com' },
      { id: 'r-2', name: 'Mei Ting', company: 'Apex Logistics MY', phone: '+60 17-882 1940', email: 'meiting@apexlogistics.my' },
      { id: 'r-3', name: 'Ahmad Faizal', company: 'Malayan Trading', phone: '+60 19-410 5521', email: 'faizal@malayantrading.com' },
      { id: 'r-4', name: 'Chong Wei Jian', company: 'Nippon Tech KL', phone: '+60 16-229 8834', email: 'weijian@nippontech.com' },
      { id: 'r-5', name: 'Siti Nurhaliza', company: 'Seri Mega Holdings', phone: '+60 13-901 7742', email: 'siti@serimega.com.my' }
    ]
  },
  {
    id: 'lbl-vip',
    label: 'VIP-Tier',
    description: 'Enterprise decision-makers and key accounts with >RM 50k pipeline value',
    tagStyle: 'bg-tag-4 text-tag-4-foreground border-tag-4-foreground/20',
    totalContacts: 84,
    whatsappReachable: 84,
    emailReachable: 82,
    sampleRecipients: [
      { id: 'r-6', name: 'Dato Sri Amirul', company: 'Puncak Niaga Corp', phone: '+60 12-200 9981', email: 'amirul@puncakniaga.com' },
      { id: 'r-7', name: 'Rachel Tan', company: 'Singa Financial', phone: '+60 12-883 4100', email: 'rachel.tan@singafin.com' },
      { id: 'r-8', name: 'Karthik Subra', company: 'Global Biz Solutions', phone: '+60 17-334 9012', email: 'karthik@globalbiz.my' }
    ]
  },
  {
    id: 'lbl-warm',
    label: 'Warm',
    description: 'Engaged prospects evaluating proposals or attending discovery webinars',
    tagStyle: 'bg-warning/10 text-warning border-warning/30',
    totalContacts: 312,
    whatsappReachable: 298,
    emailReachable: 305,
    sampleRecipients: [
      { id: 'r-9', name: 'Daniel Imran', company: 'Borneo Ventures', phone: '+60 14-512 3390', email: 'daniel@borneoventures.com' },
      { id: 'r-10', name: 'Kavitha Krishnan', company: 'IndoFoods MY', phone: '+60 16-771 2048', email: 'kavitha@indofoods.my' },
      { id: 'r-11', name: 'Zac Goh', company: 'KL Enterprise', phone: '+60 11-2940 8812', email: 'zac.goh@klenterprise.com' }
    ]
  },
  {
    id: 'lbl-event',
    label: 'SMEAievent2026',
    description: 'Booth visitors and registrants from the SME AI Automation Expo 2026',
    tagStyle: 'bg-tag-1 text-tag-1-foreground border-tag-1-foreground/20',
    totalContacts: 215,
    whatsappReachable: 204,
    emailReachable: 210,
    sampleRecipients: [
      { id: 'r-12', name: 'Kevin Nguyen', company: 'Horizon Digital', phone: '+60 18-392 1104', email: 'kevin@horizondigital.io' },
      { id: 'r-13', name: 'Nurul Ain', company: 'Bintang Retail', phone: '+60 13-445 6120', email: 'nurul@bintangretail.my' }
    ]
  },
  {
    id: 'lbl-cold',
    label: 'Cold',
    description: 'Outbound prospecting list and inactive leads for seasonal re-engagement',
    tagStyle: 'bg-tag-6 text-tag-6-foreground border-tag-6-foreground/20',
    totalContacts: 420,
    whatsappReachable: 390,
    emailReachable: 410,
    sampleRecipients: [
      { id: 'r-14', name: 'Hassan Mahmood', company: 'Metro Builders', phone: '+60 19-887 3201', email: 'hassan@metrobuilders.my' },
      { id: 'r-15', name: 'Grace Lee', company: 'Alpha MedTech', phone: '+60 12-665 1092', email: 'grace@alphamedtech.com' }
    ]
  }
]

export const initialCampaigns: CampaignRecord[] = [
  {
    id: 'cmp-wa-1',
    name: 'Q2 Hot Leads Priority Demo Broadcast',
    channel: 'whatsapp',
    status: 'Sent',
    audienceLabel: 'Hot',
    recipientCount: 142,
    createdAt: 'May 12, 2026 • 10:15 AM',
    sentAt: 'May 12, 2026 • 10:30 AM',
    inboxName: 'RakanSales Official WABA (+6012 345 6789)',
    templateId: 'wa-tpl-hot-promo',
    templateName: 'Q2 Growth Promo & Priority Demo',
    templateBody: 'Hi {{1}}, we noticed {{2}} is expanding your sales operations! Unlock our Q2 Growth Package with automated WhatsApp routing & AI transcription. Reply YES to claim your 14-day priority sandbox.',
    whatsappMetrics: {
      sent: 142,
      delivered: 138,
      read: 114,
      replied: 39
    },
    recipients: [
      { id: 'rec-1', name: 'Mel Wong', company: 'KK Steel Sdn Bhd', contactInfo: '+60 12-345 6789', status: 'Replied', sentAt: '10:30 AM', updatedAt: '10:34 AM', detailNote: '"YES — can we schedule a demo for our 25 reps tomorrow at 3 PM?"' },
      { id: 'rec-2', name: 'Mei Ting', company: 'Apex Logistics MY', contactInfo: '+60 17-882 1940', status: 'Replied', sentAt: '10:30 AM', updatedAt: '10:39 AM', detailNote: '"Yes! Please share the Enterprise quotation and sandbox link."' },
      { id: 'rec-3', name: 'Ahmad Faizal', company: 'Malayan Trading', contactInfo: '+60 19-410 5521', status: 'Replied', sentAt: '10:30 AM', updatedAt: '10:42 AM', detailNote: '"Berminat! Boleh hantar sebut harga rasmi?"' },
      { id: 'rec-4', name: 'Chong Wei Jian', company: 'Nippon Tech KL', contactInfo: '+60 16-229 8834', status: 'Read', sentAt: '10:30 AM', updatedAt: '10:48 AM', detailNote: 'Opened on WhatsApp Business' },
      { id: 'rec-5', name: 'Siti Nurhaliza', company: 'Seri Mega Holdings', contactInfo: '+60 13-901 7742', status: 'Delivered', sentAt: '10:30 AM', updatedAt: '10:31 AM', detailNote: 'Delivered to device' }
    ]
  },
  {
    id: 'cmp-em-1',
    name: 'RakanSales C4 Product Launch & AI Playbook',
    channel: 'email',
    status: 'Sent',
    audienceLabel: 'Hot',
    recipientCount: 145,
    createdAt: 'May 10, 2026 • 09:00 AM',
    sentAt: 'May 10, 2026 • 09:30 AM',
    subject: 'Unlock 3x Faster Lead Response with RakanSales AI Omnichannel',
    previewText: 'See how Malaysian sales teams close deals faster across WhatsApp & Email.',
    fromName: 'Olivia Rhye (RakanSales)',
    fromEmail: 'olivia@rakansales.com',
    emailBody: 'Hi {{contact.first_name}},\n\nWe are excited to introduce RakanSales C4 — built to unify your WhatsApp Business API, Email campaigns, and instant Bahasa Melayu voice note transcription in one workspace.\n\nBook your personalized 15-minute walkthrough today and receive complimentary onboarding for {{company.name}}.\n\nBest regards,\nOlivia Rhye\nHead of Growth, RakanSales',
    emailMetrics: {
      sent: 145,
      opened: 98,
      clicked: 34
    },
    recipients: [
      { id: 'erec-1', name: 'Mel Wong', company: 'KK Steel Sdn Bhd', contactInfo: 'melwong@kksteel.com', status: 'Clicked', sentAt: '09:30 AM', updatedAt: '09:44 AM', detailNote: 'Clicked: "Book 15-Minute Walkthrough" (2 times)' },
      { id: 'erec-2', name: 'Mei Ting', company: 'Apex Logistics MY', contactInfo: 'meiting@apexlogistics.my', status: 'Clicked', sentAt: '09:30 AM', updatedAt: '10:02 AM', detailNote: 'Clicked: "View Enterprise Pricing Deck"' },
      { id: 'erec-3', name: 'Ahmad Faizal', company: 'Malayan Trading', contactInfo: 'faizal@malayantrading.com', status: 'Opened', sentAt: '09:30 AM', updatedAt: '10:15 AM', detailNote: 'Opened via Gmail Desktop' },
      { id: 'erec-4', name: 'Chong Wei Jian', company: 'Nippon Tech KL', contactInfo: 'weijian@nippontech.com', status: 'Opened', sentAt: '09:30 AM', updatedAt: '11:05 AM', detailNote: 'Opened via Apple Mail' },
      { id: 'erec-5', name: 'Siti Nurhaliza', company: 'Seri Mega Holdings', contactInfo: 'siti@serimega.com.my', status: 'Sent', sentAt: '09:30 AM', updatedAt: '09:30 AM', detailNote: 'Delivered to inbox' }
    ]
  },
  {
    id: 'cmp-wa-2',
    name: 'KL SME AI Summit 2026 VIP Pass Confirmation',
    channel: 'whatsapp',
    status: 'Sent',
    audienceLabel: 'SMEAievent2026',
    recipientCount: 204,
    createdAt: 'May 06, 2026 • 02:00 PM',
    sentAt: 'May 06, 2026 • 02:15 PM',
    inboxName: 'RakanSales Official WABA (+6012 345 6789)',
    templateId: 'wa-tpl-summit',
    templateName: 'SME AI Sales Summit VIP Pass',
    templateBody: 'Hi {{1}}, we have reserved a complimentary VIP Executive Pass for {{2}} at the upcoming KL SME AI Sales Summit. Reply CONFIRM to receive your digital QR badge immediately.',
    whatsappMetrics: {
      sent: 204,
      delivered: 199,
      read: 168,
      replied: 64
    },
    recipients: [
      { id: 'rec-21', name: 'Kevin Nguyen', company: 'Horizon Digital', contactInfo: '+60 18-392 1104', status: 'Replied', sentAt: '02:15 PM', updatedAt: '02:19 PM', detailNote: '"CONFIRM — see you at KLCC!"' },
      { id: 'rec-22', name: 'Nurul Ain', company: 'Bintang Retail', contactInfo: '+60 13-445 6120', status: 'Read', sentAt: '02:15 PM', updatedAt: '02:40 PM', detailNote: 'Read receipt received' }
    ]
  },
  {
    id: 'cmp-em-2',
    name: 'Monthly Executive CRM Digest & Case Study',
    channel: 'email',
    status: 'Sent',
    audienceLabel: 'VIP-Tier',
    recipientCount: 82,
    createdAt: 'May 02, 2026 • 11:00 AM',
    sentAt: 'May 02, 2026 • 11:30 AM',
    subject: 'Case Study: How KK Steel Increased WhatsApp Conversion by 42%',
    previewText: 'Read our latest Malaysia enterprise benchmark report inside.',
    fromName: 'Olivia Rhye (RakanSales)',
    fromEmail: 'olivia@rakansales.com',
    emailBody: 'Dear {{contact.first_name}},\n\nHere is our May executive benchmark report showing how Malaysian B2B teams are combining WhatsApp broadcast templates with automated CRM deal pipelines.\n\nClick below to download the full PDF report.\n\nWarm regards,\nOlivia Rhye',
    emailMetrics: {
      sent: 82,
      opened: 64,
      clicked: 29
    },
    recipients: [
      { id: 'erec-21', name: 'Dato Sri Amirul', company: 'Puncak Niaga Corp', contactInfo: 'amirul@puncakniaga.com', status: 'Clicked', sentAt: '11:30 AM', updatedAt: '11:52 AM', detailNote: 'Clicked: "Download Enterprise Benchmark PDF"' },
      { id: 'erec-22', name: 'Rachel Tan', company: 'Singa Financial', contactInfo: 'rachel.tan@singafin.com', status: 'Opened', sentAt: '11:30 AM', updatedAt: '12:15 PM', detailNote: 'Opened on iPhone' }
    ]
  }
]
