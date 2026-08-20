export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note'
  title: string
  timestamp: string
  description: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: 'Active' | 'Inactive' | 'Pending' | 'Lead'
  lifecycleStage: 'Lead' | 'Subscriber' | 'Opportunity' | 'Customer'
  lastContact: string
  dateAdded: string
  avatar: string
  notes: string
  tags: string[]
  activities: Activity[]
}

const firstNames = [
  'Arif', 'Sarah', 'Wei Kiat', 'Fatima', 'Ravi', 'John', 'Jane', 'Michael', 'Emily', 'David',
  'Amina', 'Chong', 'Devi', 'Kumar', 'Lim', 'Tan', 'Nurul', 'Amir', 'Grace', 'Daniel',
  'Siti', 'Zubair', 'Karthik', 'Mei Ling', 'Hassan', 'Rachel', 'Alex', 'Amanda', 'Robert', 'Lisa'
]

const lastNames = [
  'Rahman', 'Tan', 'Lim', 'Aminah', 'Shankar', 'Smith', 'Doe', 'Wong', 'Davis', 'Johnson',
  'Ali', 'Goh', 'Pillay', 'Rao', 'Teoh', 'Ng', 'Zulkifli', 'Kamal', 'Lee', 'Chen',
  'Ibrahim', 'Mahmood', 'Subramaniam', 'Low', 'Othman', 'Taylor', 'Brown', 'Wilson', 'Miller', 'Jones'
]

const roles = [
  'CEO', 'CTO', 'VP of Sales', 'Marketing Director', 'Procurement Officer',
  'Lead Engineer', 'HR Manager', 'Product Owner', 'Account Executive', 'Operations Manager'
]

const companies = [
  'Acme Corp', 'Tech Solutions', 'Global Biz', 'Innovate LLC', 'Nippon Tech',
  'Malayan Trading', 'Borneo Ventures', 'IndoFoods', 'Singa Services', 'KL Enterprise'
]

const statuses: Contact['status'][] = ['Active', 'Inactive', 'Pending', 'Lead']
const lifecycleStages: Contact['lifecycleStage'][] = ['Lead', 'Subscriber', 'Opportunity', 'Customer']

const tagOptions = [
  'High-Value', 'Decision Maker', 'Inbound', 'Follow-up Required', 'Warm Lead', 'Cold Lead', 'Key Account'
]

// Simple seeded random to keep mock data deterministic
function createRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export function generateMockContacts(count = 2500): Contact[] {
  const rand = createRandom(12345)
  const contacts: Contact[] = []

  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]

  for (let i = 1; i <= count; i++) {
    const firstName = pickRandom(firstNames)
    const lastName = pickRandom(lastNames)
    const name = `${firstName} ${lastName}`
    const company = pickRandom(companies)
    const role = pickRandom(roles)
    const status = pickRandom(statuses)
    const lifecycleStage = pickRandom(lifecycleStages)

    const email = `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase().replace(/\s+/g, '')}@${company.toLowerCase().replace(/\s+/g, '')}.com`
    const phone = `+60 1${Math.floor(rand() * 9)}-${Math.floor(rand() * 9000000 + 1000000)}`

    // Generate random date within past year
    const monthsAgo = Math.floor(rand() * 12)
    const daysAgo = Math.floor(rand() * 30)
    const dateAdded = new Date()
    dateAdded.setMonth(dateAdded.getMonth() - monthsAgo)
    dateAdded.setDate(dateAdded.getDate() - daysAgo)

    const lastContactDays = Math.floor(rand() * 45)
    let lastContact = ''
    if (lastContactDays === 0) {
      lastContact = 'Today'
    } else if (lastContactDays === 1) {
      lastContact = 'Yesterday'
    } else {
      lastContact = `${lastContactDays} days ago`
    }

    // Pick 1-3 tags
    const tagsCount = Math.floor(rand() * 3) + 1
    const tags: string[] = []
    while (tags.length < tagsCount) {
      const tag = pickRandom(tagOptions)
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    // Generate some activities
    const activities: Activity[] = []
    const activityCount = Math.floor(rand() * 4) + 1
    const activityTypes: Activity['type'][] = ['call', 'email', 'meeting', 'note']

    for (let j = 1; j <= activityCount; j++) {
      const type = pickRandom(activityTypes)
      let title = ''
      let description = ''
      if (type === 'call') {
        title = 'Outbound Call Completed'
        description = pickRandom([
          'Spoke about service pricing. Prospect requested proposal.',
          'Followed up on sales trial. Positive response.',
          'Voicemail left. Will retry next week.',
          'Discussed feature requests for integration.'
        ])
      } else if (type === 'email') {
        title = 'Email Sent'
        description = pickRandom([
          'Sent proposal deck and overview document.',
          'Replied to pricing queries. Standard rates sheet attached.',
          'Introduction email sent for onboarding program.',
          'Follow-up email sent regarding contract terms.'
        ])
      } else if (type === 'meeting') {
        title = 'Discovery Call / Meeting'
        description = pickRandom([
          'Conducted product demo with team. Highlighted core workflow.',
          'Requirement gathering session. Highlighted scalability needs.',
          'Price negotiation meeting. Finalizing contract terms.'
        ])
      } else {
        title = 'Internal Note Added'
        description = pickRandom([
          'Recommended by manager to treat as key decision-maker.',
          'Met at virtual conference. Seems very interested in automation.',
          'Contact requested communication only via WhatsApp/Email.'
        ])
      }

      const actDate = new Date(dateAdded)
      actDate.setDate(actDate.getDate() + Math.floor(rand() * 15))

      activities.push({
        id: `act-${i}-${j}`,
        type,
        title,
        timestamp: actDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description
      })
    }

    // Sort activities descending by date/id
    activities.sort((a, b) => b.id.localeCompare(a.id))

    contacts.push({
      id: `C${String(i).padStart(4, '0')}`,
      name,
      email,
      phone,
      company,
      role,
      status,
      lifecycleStage,
      lastContact,
      dateAdded: dateAdded.toISOString().split('T')[0],
      avatar: name.split(' ').map(n => n[0]).join(''),
      notes: `Notes for ${name}. Add details here regarding communication history and project scope.`,
      tags,
      activities
    })
  }

  return contacts
}
