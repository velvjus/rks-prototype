export interface CrmTemplate {
  id: string
  title: string
  shortcut: string
  category: 'Sales' | 'Support' | 'Scheduling' | 'Billing' | 'WhatsApp HSM'
  channel: 'all' | 'WhatsApp' | 'Mail' | 'LiveChat'
  language: 'EN' | 'BM' | 'ZH'
  subject?: string
  content: string
  isFavorite?: boolean
  isHsmApproved?: boolean
  hsmCategory?: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION'
  variables: string[]
  usageCount?: number
  updatedAt?: string
}

export const defaultCrmTemplates: CrmTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Welcome & Value Proposition',
    shortcut: '/welcome',
    category: 'Sales',
    channel: 'all',
    language: 'EN',
    subject: 'Welcome to RakanSales — Let’s accelerate your revenue',
    content: 'Hi {{contact.name}}! 👋 Thanks for reaching out to RakanSales. We help growing teams unify omnichannel customer conversations and streamline pipeline management. How can we best assist {{company.name}} today?',
    isFavorite: true,
    variables: ['contact.name', 'company.name'],
    usageCount: 142,
    updatedAt: '2 days ago'
  },
  {
    id: 'tpl-2',
    title: 'Schedule Discovery / Demo Call',
    shortcut: '/demo',
    category: 'Scheduling',
    channel: 'all',
    language: 'EN',
    subject: 'Discovery Session with RakanSales',
    content: 'Hi {{contact.first_name}}, looking forward to exploring how RakanSales fits your workflow! You can pick any 20-minute slot that suits your schedule here: {{meeting.link}}.\n\nLooking forward to speaking soon,\n{{agent.name}}',
    isFavorite: true,
    variables: ['contact.first_name', 'meeting.link', 'agent.name'],
    usageCount: 238,
    updatedAt: 'Yesterday'
  },
  {
    id: 'tpl-3',
    title: 'WhatsApp 24h Re-engagement',
    shortcut: '/reengage',
    category: 'WhatsApp HSM',
    channel: 'WhatsApp',
    language: 'EN',
    isHsmApproved: true,
    hsmCategory: 'UTILITY',
    content: 'Hello {{contact.name}}, this is {{agent.first_name}} from RakanSales. We are following up regarding your inquiry on our omnichannel sales integration. Please reply to this message to resume our chat.',
    isFavorite: true,
    variables: ['contact.name', 'agent.first_name'],
    usageCount: 89,
    updatedAt: 'May 2026'
  },
  {
    id: 'tpl-4',
    title: 'Enterprise Pricing Overview',
    shortcut: '/pricing',
    category: 'Sales',
    channel: 'all',
    language: 'EN',
    subject: 'RakanSales Enterprise & Growth Pricing Overview',
    content: 'Hi {{contact.name}},\n\nHere is a quick summary of our plans for {{company.name}}:\n• Growth Tier: Unlimited inbox channels, 5 agent seats, automated SLA routing\n• Enterprise Tier: Dedicated CRM webhooks, multi-team queues, custom AI playbooks\n\nWould you like me to prepare a customized commercial proposal tailored to your team size?',
    isFavorite: false,
    variables: ['contact.name', 'company.name'],
    usageCount: 97,
    updatedAt: '3 days ago'
  },
  {
    id: 'tpl-5',
    title: 'Duplicate Lead Detection Policy',
    shortcut: '/duplicates',
    category: 'Support',
    channel: 'all',
    language: 'EN',
    content: 'Hi {{contact.first_name}}, our system automatically cross-references incoming WhatsApp numbers and email domains against your CRM records. When duplicate contacts are identified, agents receive a 1-click merge prompt in the client drawer without losing conversation history.',
    isFavorite: false,
    variables: ['contact.first_name'],
    usageCount: 53,
    updatedAt: '1 week ago'
  },
  {
    id: 'tpl-6',
    title: 'Proposal & Scope Follow-up',
    shortcut: '/proposal-followup',
    category: 'Sales',
    channel: 'all',
    language: 'EN',
    subject: 'Following up on your custom proposal',
    content: 'Hi {{contact.name}}, just wanted to check if you had a chance to review the scope proposal we sent over. Happy to answer any questions or jump on a quick 10-minute sync whenever convenient.',
    isFavorite: true,
    variables: ['contact.name'],
    usageCount: 164,
    updatedAt: '4 days ago'
  },
  {
    id: 'tpl-7',
    title: 'Payment & Invoice Confirmation',
    shortcut: '/receipt',
    category: 'Billing',
    channel: 'all',
    language: 'EN',
    subject: 'Payment Receipt Confirmation',
    content: 'Dear {{contact.name}}, we have successfully received your payment for account {{company.name}}. Your official receipt and tax invoice have been generated and archived in your billing portal. Thank you for your continued partnership!',
    isFavorite: false,
    variables: ['contact.name', 'company.name'],
    usageCount: 71,
    updatedAt: '2 weeks ago'
  },
  {
    id: 'tpl-8',
    title: 'Off-Hours & Out of Office',
    shortcut: '/off-hours',
    category: 'Support',
    channel: 'all',
    language: 'EN',
    content: 'Hi {{contact.first_name}}, thank you for reaching out! Our team is currently away outside standard business hours (Mon-Fri 9AM–6PM MYT). We have logged your request with high priority and {{agent.name}} will respond first thing in the morning.',
    isFavorite: false,
    variables: ['contact.first_name', 'agent.name'],
    usageCount: 312,
    updatedAt: '1 month ago'
  },
  {
    id: 'tpl-9',
    title: 'Post-Call Summary & Next Steps',
    shortcut: '/recap',
    category: 'Sales',
    channel: 'all',
    language: 'EN',
    subject: 'Summary of our Discovery Call — Next Steps for {{company.name}}',
    content: 'Hi {{contact.name}},\n\nThank you for your time today! As discussed, here are the key takeaways and our immediate next milestones:\n1. We will configure your sandbox account with WhatsApp webhook routing.\n2. We will prepare custom field mappings for {{company.name}}.\n\nLet me know if you’d like to adjust anything before our next check-in on {{today.date}}.',
    isFavorite: false,
    variables: ['contact.name', 'company.name', 'today.date'],
    usageCount: 118,
    updatedAt: 'May 2026'
  },
  {
    id: 'tpl-10',
    title: 'Resolution & Satisfaction Check',
    shortcut: '/resolved-feedback',
    category: 'Support',
    channel: 'all',
    language: 'EN',
    content: 'Hi {{contact.first_name}}, we’ve resolved this ticket for you. If you need any further assistance with your account, simply reply right here to reopen the thread anytime. Have a wonderful day!',
    isFavorite: false,
    variables: ['contact.first_name'],
    usageCount: 185,
    updatedAt: '3 days ago'
  }
]

export function resolveTemplateVariables(
  content: string,
  context: Record<string, string>
): string {
  let resolved = content
  for (const [key, val] of Object.entries(context)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    resolved = resolved.replace(regex, val)
  }
  return resolved
}
