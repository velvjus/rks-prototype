export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM AM/PM format
  endTime?: string;
  category: 'work' | 'personal' | 'design' | 'marketing' | 'client' | 'team';
  sharing: 'shared' | 'public' | 'archived' | 'private';
  description?: string;
}

export const initialEvents: CalendarEvent[] = [
  // Trailing December 2026 Events
  {
    id: 'e1',
    title: 'Monday standup',
    date: '2026-12-28',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared',
    description: 'Weekly team kick-off meeting'
  },
  {
    id: 'e2',
    title: 'One-on-one w/ manager',
    date: '2026-12-29',
    time: '10:00 AM',
    category: 'work',
    sharing: 'private',
    description: 'Bi-weekly sync with manager'
  },
  {
    id: 'e3',
    title: 'All-hands meeting',
    date: '2026-12-29',
    time: '4:00 PM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e4',
    title: 'Dinner with client',
    date: '2026-12-29',
    time: '6:30 PM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e4-sub1',
    title: 'Weekly report check',
    date: '2026-12-29',
    time: '11:00 AM',
    category: 'work',
    sharing: 'private'
  },
  {
    id: 'e4-sub2',
    title: 'Customer support review',
    date: '2026-12-29',
    time: '3:00 PM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e5',
    title: 'EOY meeting',
    date: '2026-12-30',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared',
    description: 'End of year review and plans'
  },
  {
    id: 'e6',
    title: 'Coffee with design team',
    date: '2026-12-30',
    time: '11:30 AM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e7',
    title: 'Marketing sync',
    date: '2026-12-30',
    time: '2:30 PM',
    category: 'marketing',
    sharing: 'public'
  },
  {
    id: 'e7-sub1',
    title: 'Code review',
    date: '2026-12-30',
    time: '4:00 PM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e7-sub2',
    title: 'Gym session',
    date: '2026-12-30',
    time: '6:00 PM',
    category: 'personal',
    sharing: 'private'
  },
  {
    id: 'e8',
    title: 'Remote brainstorming',
    date: '2026-12-31',
    time: '10:30 AM',
    category: 'design',
    sharing: 'shared'
  },

  // January 2027 Events
  {
    id: 'e9',
    title: 'Friday standup',
    date: '2027-01-01',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e10',
    title: 'House inspection',
    date: '2027-01-02',
    time: '10:30 AM',
    category: 'client',
    sharing: 'private'
  },
  {
    id: 'e11',
    title: 'Monday standup',
    date: '2027-01-04',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e12',
    title: 'Content planning',
    date: '2027-01-04',
    time: '11:00 AM',
    category: 'design',
    sharing: 'public'
  },
  {
    id: 'e13',
    title: 'One-on-one w/ manager',
    date: '2027-01-05',
    time: '10:00 AM',
    category: 'work',
    sharing: 'private'
  },
  {
    id: 'e14',
    title: 'Catch up with product',
    date: '2027-01-05',
    time: '2:30 PM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e15',
    title: 'Deep work',
    date: '2027-01-06',
    time: '9:00 AM',
    category: 'design',
    sharing: 'private'
  },
  {
    id: 'e16',
    title: 'Design sync',
    date: '2027-01-06',
    time: '10:30 AM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e17',
    title: 'SEO planning',
    date: '2027-01-06',
    time: '1:30 PM',
    category: 'marketing',
    sharing: 'public'
  },
  {
    id: 'e17-sub1',
    title: 'Analytics check',
    date: '2027-01-06',
    time: '11:30 AM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e17-sub2',
    title: 'Social media check',
    date: '2027-01-06',
    time: '3:00 PM',
    category: 'marketing',
    sharing: 'public'
  },
  {
    id: 'e17-sub3',
    title: 'Billing update',
    date: '2027-01-06',
    time: '5:00 PM',
    category: 'client',
    sharing: 'private'
  },
  {
    id: 'e18',
    title: 'Lunch with partners',
    date: '2027-01-07',
    time: '12:00 PM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e19',
    title: 'Friday standup',
    date: '2027-01-08',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e20',
    title: 'Olivia x Riley onboarding',
    date: '2027-01-08',
    time: '10:00 AM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e21',
    title: 'Product demo prep',
    date: '2027-01-08',
    time: '1:30 PM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e21-sub1',
    title: 'Sprint retro',
    date: '2027-01-08',
    time: '3:00 PM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e21-sub2',
    title: 'Happy hour',
    date: '2027-01-08',
    time: '5:00 PM',
    category: 'work',
    sharing: 'shared'
  },
  {
    id: 'e22',
    title: 'House inspection',
    date: '2027-01-09',
    time: '11:00 AM',
    category: 'client',
    sharing: 'private'
  },
  {
    id: 'e23',
    title: "Ava's engagement party",
    date: '2027-01-10',
    time: '1:00 PM',
    category: 'marketing',
    sharing: 'public'
  },
  {
    id: 'e24',
    title: 'Monday standup',
    date: '2027-01-11',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e25',
    title: 'Team lunch',
    date: '2027-01-11',
    time: '12:15 PM',
    category: 'work',
    sharing: 'shared'
  },
  {
    id: 'e26',
    title: 'Product planning sync',
    date: '2027-01-13',
    time: '9:30 AM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e27',
    title: "Amélie's first day",
    date: '2027-01-14',
    time: '10:00 AM',
    category: 'work',
    sharing: 'shared'
  },
  {
    id: 'e28',
    title: 'All-hands company sync',
    date: '2027-01-14',
    time: '4:00 PM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e29',
    title: 'Friday standup',
    date: '2027-01-15',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e30',
    title: 'Coffee w/ CEO',
    date: '2027-01-15',
    time: '9:30 AM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e31',
    title: 'Design feedback session',
    date: '2027-01-15',
    time: '2:30 PM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e31-sub1',
    title: 'SaaS deployment',
    date: '2027-01-15',
    time: '4:30 PM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e32',
    title: 'Half marathon',
    date: '2027-01-16',
    time: '7:00 AM',
    category: 'personal',
    sharing: 'public'
  },
  {
    id: 'e33',
    title: 'Monday standup',
    date: '2027-01-18',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e34',
    title: 'Deep work session',
    date: '2027-01-18',
    time: '9:15 AM',
    category: 'design',
    sharing: 'private'
  },
  {
    id: 'e35',
    title: 'Quarterly business review',
    date: '2027-01-19',
    time: '11:30 AM',
    category: 'client',
    sharing: 'shared'
  },
  {
    id: 'e36',
    title: 'Lunch with marketing',
    date: '2027-01-19',
    time: '1:00 PM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e37',
    title: 'Dinner with partners',
    date: '2027-01-19',
    time: '7:00 PM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e38',
    title: 'Deep work focus',
    date: '2027-01-20',
    time: '9:00 AM',
    category: 'design',
    sharing: 'private'
  },
  {
    id: 'e39',
    title: 'Design sync',
    date: '2027-01-20',
    time: '2:30 PM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e40',
    title: 'Amélie coaching session',
    date: '2027-01-21',
    time: '10:00 AM',
    category: 'work',
    sharing: 'private'
  },
  {
    id: 'e41',
    title: 'Friday standup',
    date: '2027-01-22',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e42',
    title: 'Accountant meeting',
    date: '2027-01-22',
    time: '1:45 PM',
    category: 'client',
    sharing: 'private'
  },
  {
    id: 'e43',
    title: 'Marketing presentation',
    date: '2027-01-22',
    time: '2:30 PM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e43-sub1',
    title: 'Team retrospective',
    date: '2027-01-22',
    time: '3:30 PM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e43-sub2',
    title: 'Call with client',
    date: '2027-01-22',
    time: '4:30 PM',
    category: 'client',
    sharing: 'private'
  },
  {
    id: 'e43-sub3',
    title: 'Product sync',
    date: '2027-01-22',
    time: '11:00 AM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e44',
    title: 'Monday standup',
    date: '2027-01-25',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e45',
    title: 'Content planning sync',
    date: '2027-01-26',
    time: '11:00 AM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e46',
    title: 'Lunch with agency',
    date: '2027-01-26',
    time: '12:45 PM',
    category: 'personal',
    sharing: 'shared'
  },
  {
    id: 'e47',
    title: 'Product planning',
    date: '2027-01-27',
    time: '9:30 AM',
    category: 'design',
    sharing: 'shared'
  },
  {
    id: 'e48',
    title: 'All-hands sync',
    date: '2027-01-28',
    time: '4:00 PM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e49',
    title: 'Team dinner',
    date: '2027-01-28',
    time: '5:30 PM',
    category: 'work',
    sharing: 'shared'
  },
  {
    id: 'e50',
    title: 'Friday standup',
    date: '2027-01-29',
    time: '9:00 AM',
    category: 'team',
    sharing: 'shared'
  },
  {
    id: 'e51',
    title: 'Drive to Sydney',
    date: '2027-01-31',
    time: '9:00 AM',
    category: 'client',
    sharing: 'archived',
    description: 'Road trip down to Sydney for client onboarding meetings'
  }
];
