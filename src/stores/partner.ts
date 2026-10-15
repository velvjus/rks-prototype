import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type PartnerTrack = 'referral' | 'sales';

export type DealStage = 
  | 'registered'
  | 'discovery'
  | 'proposal'
  | 'in_clearance'
  | 'closed_won'
  | 'closed_lost';

export interface DealItem {
  id: string;
  companyName: string;
  domain: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  planTier: 'Basic' | 'Pro' | 'Growth' | 'Enterprise';
  mrrValue: number; // in MYR
  arrValue: number; // in MYR
  registeredDate: string;
  expectedCloseDate: string;
  stage: DealStage;
  protectionDaysRemaining: number; // 120-day exclusivity lock
  notes: string;
  lastActivity: string;
}

export interface ReferralItem {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'Basic' | 'Pro' | 'Growth' | 'Enterprise';
  mrr: number;
  signupDate: string;
  status: 'active_trial' | 'awaiting_payment' | 'converted' | 'churned';
  commissionBounty: number;
  payoutStatus: 'cleared' | 'in_clearance' | 'paid';
  trialDaysLeft?: number;
}

export interface RecurringCommissionItem {
  id: string;
  dealId: string;
  clientName: string;
  plan: 'Basic' | 'Pro' | 'Growth' | 'Enterprise';
  clientMRR: number;
  revSharePercent: number; // e.g. 20%
  monthlyCommission: number;
  monthElapsed: number; // e.g. 5
  totalMonths: number; // 12
  nextDisbursementDate: string;
  cumulativePaid: number;
  status: 'active' | 'completed' | 'paused';
}

export const usePartnerStore = defineStore('partner', () => {
  // Active track state with localStorage persistence
  const savedTrack = typeof window !== 'undefined' ? (localStorage.getItem('rks_partner_track') as PartnerTrack) : null;
  const activeTrack = ref<PartnerTrack>(savedTrack === 'sales' ? 'sales' : 'referral');

  // Track Switcher Toast
  const toastMessage = ref<string | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  function showToast(msg: string) {
    toastMessage.value = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.value = null;
    }, 4000);
  }

  function setTrack(track: PartnerTrack) {
    activeTrack.value = track;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rks_partner_track', track);
    }
    if (track === 'sales') {
      showToast('Switched to Sales Partner Mode (Deal Pipeline & Recurring RevShare enabled)');
    } else {
      showToast('Switched to Referral Partner Mode (Affiliate Links & Fixed RM 300 Bounty enabled)');
    }
  }

  function toggleTrack() {
    setTrack(activeTrack.value === 'referral' ? 'sales' : 'referral');
  }

  // -------------------------------------------------------------
  // SALES TRACK DEALS DATA & CRUD
  // -------------------------------------------------------------
  const deals = ref<DealItem[]>([
    {
      id: 'RKS-D801',
      companyName: 'Apex Logistics Sdn Bhd',
      domain: 'apexlogistics.com.my',
      contactName: 'Dato’ Kenneth Tan',
      contactEmail: 'kenneth@apexlogistics.com.my',
      contactPhone: '+60 12-345 6789',
      contactRole: 'Chief Operating Officer',
      planTier: 'Enterprise',
      mrrValue: 2400,
      arrValue: 28800,
      registeredDate: '2026-09-08',
      expectedCloseDate: '2026-10-31',
      stage: 'proposal',
      protectionDaysRemaining: 84,
      notes: 'Migrating 45 dispatch sales reps from manual spreadsheets. Requires custom webhook integration to warehouse ERP.',
      lastActivity: 'Proposal v2 sent with 3-year multi-site pricing',
    },
    {
      id: 'RKS-D802',
      companyName: 'Klang Valley Retailers Consortium',
      domain: 'kvretail.my',
      contactName: 'Sarah Lim',
      contactEmail: 'sarah.lim@kvretail.my',
      contactPhone: '+60 16-892 1102',
      contactRole: 'VP of Commercial Strategy',
      planTier: 'Growth',
      mrrValue: 1200,
      arrValue: 14400,
      registeredDate: '2026-09-22',
      expectedCloseDate: '2026-11-15',
      stage: 'discovery',
      protectionDaysRemaining: 98,
      notes: 'Evaluating RakanSales vs HubSpot. High interest in localized WhatsApp CRM & multi-currency billing.',
      lastActivity: 'Discovery call completed; scheduled technical demo',
    },
    {
      id: 'RKS-D803',
      companyName: 'Borneo AgroTech Industries',
      domain: 'borneoagrotech.com',
      contactName: 'Ir. Ahmad Zulkifli',
      contactEmail: 'zulkifli@borneoagrotech.com',
      contactPhone: '+60 19-771 4309',
      contactRole: 'Managing Director',
      planTier: 'Enterprise',
      mrrValue: 3200,
      arrValue: 38400,
      registeredDate: '2026-08-14',
      expectedCloseDate: '2026-10-25',
      stage: 'in_clearance',
      protectionDaysRemaining: 60,
      notes: 'Master services agreement in final legal clearance. Procurement PO signed on Oct 10.',
      lastActivity: 'SST e-Invoicing compliance check passed',
    },
    {
      id: 'RKS-D804',
      companyName: 'Starlight Medical Supplies',
      domain: 'starlightmed.my',
      contactName: 'Dr. Raymond Wong',
      contactEmail: 'raymond@starlightmed.my',
      contactPhone: '+60 13-228 9011',
      contactRole: 'General Manager',
      planTier: 'Pro',
      mrrValue: 600,
      arrValue: 7200,
      registeredDate: '2026-10-02',
      expectedCloseDate: '2026-11-30',
      stage: 'registered',
      protectionDaysRemaining: 108,
      notes: 'Inbound referral from medical distributor network. Needs quotation for 12 user licenses.',
      lastActivity: 'Lead domain exclusivity locked for 120 days',
    },
    {
      id: 'RKS-D805',
      companyName: 'Nexus Digital Media Group',
      domain: 'nexusdigital.asia',
      contactName: 'Chloe Chen',
      contactEmail: 'chloe@nexusdigital.asia',
      contactPhone: '+60 11-5520 8891',
      contactRole: 'Head of Growth',
      planTier: 'Growth',
      mrrValue: 1200,
      arrValue: 14400,
      registeredDate: '2026-07-20',
      expectedCloseDate: '2026-08-28',
      stage: 'closed_won',
      protectionDaysRemaining: 34,
      notes: 'Successfully deployed across 20 media planners. Generating active monthly RevShare.',
      lastActivity: 'Account onboarded; Month 3 commission credited',
    },
    {
      id: 'RKS-D806',
      companyName: 'Citadel Security Solutions',
      domain: 'citadelsec.com.my',
      contactName: 'Rizal Mansor',
      contactEmail: 'rizal@citadelsec.com.my',
      contactPhone: '+60 17-334 5092',
      contactRole: 'Operations Director',
      planTier: 'Pro',
      mrrValue: 600,
      arrValue: 7200,
      registeredDate: '2026-06-15',
      expectedCloseDate: '2026-07-30',
      stage: 'closed_won',
      protectionDaysRemaining: 0,
      notes: 'Closed by partner independently. Steady usage.',
      lastActivity: 'Month 4 recurring RevShare released',
    },
    {
      id: 'RKS-D807',
      companyName: 'Vanguard Engineering Works',
      domain: 'vanguardeng.com.my',
      contactName: 'Marcus Teo',
      contactEmail: 'marcus@vanguardeng.com.my',
      contactPhone: '+60 12-998 1234',
      contactRole: 'Procurement Lead',
      planTier: 'Enterprise',
      mrrValue: 1800,
      arrValue: 21600,
      registeredDate: '2026-08-01',
      expectedCloseDate: '2026-09-15',
      stage: 'closed_lost',
      protectionDaysRemaining: 0,
      notes: 'Customer opted for legacy on-premise ERP extension due to internal IT policy.',
      lastActivity: 'Closed lost: On-premise compliance restriction',
    },
  ]);

  // Deal CRUD Actions
  function addDeal(dealData: Omit<DealItem, 'id' | 'registeredDate' | 'protectionDaysRemaining' | 'lastActivity'>) {
    const newId = `RKS-D${800 + deals.value.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const newDeal: DealItem = {
      ...dealData,
      id: newId,
      registeredDate: today,
      protectionDaysRemaining: 120,
      lastActivity: `Deal registered on ${today} with 120-day exclusive lock`,
    };
    deals.value.unshift(newDeal);
    showToast(`Deal "${newDeal.companyName}" successfully registered & protected for 120 days.`);
    return newDeal;
  }

  function updateDealStage(dealId: string, newStage: DealStage) {
    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return;
    const oldStage = deal.stage;
    deal.stage = newStage;
    deal.lastActivity = `Stage moved from ${oldStage} to ${newStage}`;
    showToast(`Deal ${deal.companyName} updated to stage: ${newStage.replace('_', ' ').toUpperCase()}`);
  }

  function editDeal(dealId: string, updates: Partial<DealItem>) {
    const index = deals.value.findIndex((d) => d.id === dealId);
    if (index === -1) return;
    deals.value[index] = {
      ...deals.value[index],
      ...updates,
      lastActivity: `Deal details updated on ${new Date().toISOString().split('T')[0]}`,
    };
    showToast(`Updated deal details for ${deals.value[index].companyName}`);
  }

  function archiveDeal(dealId: string) {
    const deal = deals.value.find((d) => d.id === dealId);
    if (!deal) return;
    deals.value = deals.value.filter((d) => d.id !== dealId);
    showToast(`Deal ${deal.companyName} has been archived.`);
  }

  // -------------------------------------------------------------
  // RECURRING COMMISSIONS (SALES TRACK)
  // -------------------------------------------------------------
  const recurringCommissions = ref<RecurringCommissionItem[]>([
    {
      id: 'REC-101',
      dealId: 'RKS-D805',
      clientName: 'Nexus Digital Media Group',
      plan: 'Growth',
      clientMRR: 1200,
      revSharePercent: 20, // Certified Partner tier
      monthlyCommission: 240,
      monthElapsed: 3,
      totalMonths: 12,
      nextDisbursementDate: '2026-11-05',
      cumulativePaid: 720,
      status: 'active',
    },
    {
      id: 'REC-102',
      dealId: 'RKS-D806',
      clientName: 'Citadel Security Solutions',
      plan: 'Pro',
      clientMRR: 600,
      revSharePercent: 20,
      monthlyCommission: 120,
      monthElapsed: 4,
      totalMonths: 12,
      nextDisbursementDate: '2026-11-05',
      cumulativePaid: 480,
      status: 'active',
    },
    {
      id: 'REC-103',
      dealId: 'RKS-D790',
      clientName: 'Hyperion Cloud Engineering',
      plan: 'Enterprise',
      clientMRR: 3200,
      revSharePercent: 20,
      monthlyCommission: 640,
      monthElapsed: 8,
      totalMonths: 12,
      nextDisbursementDate: '2026-11-05',
      cumulativePaid: 5120,
      status: 'active',
    },
    {
      id: 'REC-104',
      dealId: 'RKS-D782',
      clientName: 'Pacific Rim Trade Hub',
      plan: 'Enterprise',
      clientMRR: 2400,
      revSharePercent: 20,
      monthlyCommission: 480,
      monthElapsed: 11,
      totalMonths: 12,
      nextDisbursementDate: '2026-11-05',
      cumulativePaid: 5280,
      status: 'active',
    },
    {
      id: 'REC-105',
      dealId: 'RKS-D765',
      clientName: 'Zenith Logistics Hub',
      plan: 'Growth',
      clientMRR: 1200,
      revSharePercent: 20,
      monthlyCommission: 240,
      monthElapsed: 12,
      totalMonths: 12,
      nextDisbursementDate: 'Completed',
      cumulativePaid: 2880,
      status: 'completed',
    },
  ]);

  // -------------------------------------------------------------
  // REFERRAL TRACK DATA (LEGACY AFFILIATE)
  // -------------------------------------------------------------
  const referrals = ref<ReferralItem[]>([
    {
      id: 'REF-001',
      name: 'Ahmad Faiz',
      email: 'faiz@synergymedia.my',
      company: 'Synergy Media Sdn Bhd',
      plan: 'Enterprise',
      mrr: 2400,
      signupDate: '2026-09-12',
      status: 'converted',
      commissionBounty: 300,
      payoutStatus: 'cleared',
    },
    {
      id: 'REF-002',
      name: 'Tan Wei Ling',
      email: 'weiling@crestcom.com',
      company: 'Crest Communications',
      plan: 'Growth',
      mrr: 1200,
      signupDate: '2026-09-18',
      status: 'converted',
      commissionBounty: 300,
      payoutStatus: 'cleared',
    },
    {
      id: 'REF-003',
      name: 'Suresh Kumar',
      email: 'suresh@apexbiotech.my',
      company: 'Apex Biotech Solutions',
      plan: 'Pro',
      mrr: 600,
      signupDate: '2026-09-28',
      status: 'awaiting_payment',
      commissionBounty: 300,
      payoutStatus: 'in_clearance',
    },
    {
      id: 'REF-004',
      name: 'Norazlan Shah',
      email: 'azlan@borneoheavy.com',
      company: 'Borneo Heavy Machinery',
      plan: 'Enterprise',
      mrr: 2400,
      signupDate: '2026-10-04',
      status: 'active_trial',
      commissionBounty: 300,
      payoutStatus: 'in_clearance',
      trialDaysLeft: 6,
    },
    {
      id: 'REF-005',
      name: 'Karen Ong',
      email: 'karen@omnicare.com.my',
      company: 'OmniCare Healthcare',
      plan: 'Growth',
      mrr: 1200,
      signupDate: '2026-10-08',
      status: 'active_trial',
      commissionBounty: 300,
      payoutStatus: 'in_clearance',
      trialDaysLeft: 10,
    },
  ]);

  // -------------------------------------------------------------
  // COMPUTED METRICS
  // -------------------------------------------------------------
  // Sales Metrics
  const activeDeals = computed(() => deals.value.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost'));
  const closedWonDeals = computed(() => deals.value.filter((d) => d.stage === 'closed_won'));
  
  const totalPipelineMRR = computed(() => activeDeals.value.reduce((sum, d) => sum + d.mrrValue, 0));
  const totalPipelineARR = computed(() => activeDeals.value.reduce((sum, d) => sum + d.arrValue, 0));
  
  const monthlyRecurringCommission = computed(() => 
    recurringCommissions.value
      .filter((r) => r.status === 'active')
      .reduce((sum, r) => sum + r.monthlyCommission, 0)
  );

  const activeAccountsCount = computed(() => 
    recurringCommissions.value.filter((r) => r.status === 'active').length
  );

  const totalSalesEarnedLTV = computed(() => 
    recurringCommissions.value.reduce((sum, r) => sum + r.cumulativePaid, 0)
  );

  const protectedDealsCount = computed(() => 
    deals.value.filter((d) => d.protectionDaysRemaining > 0 && d.stage !== 'closed_lost').length
  );

  // Referral Metrics
  const totalReferralBountiesCleared = computed(() =>
    referrals.value
      .filter((r) => r.payoutStatus === 'cleared')
      .reduce((sum, r) => sum + r.commissionBounty, 0)
  );

  const totalReferralBountiesInClearance = computed(() =>
    referrals.value
      .filter((r) => r.payoutStatus === 'in_clearance')
      .reduce((sum, r) => sum + r.commissionBounty, 0)
  );

  return {
    activeTrack,
    toastMessage,
    setTrack,
    toggleTrack,
    showToast,
    
    // Sales track state
    deals,
    recurringCommissions,
    activeDeals,
    closedWonDeals,
    totalPipelineMRR,
    totalPipelineARR,
    monthlyRecurringCommission,
    activeAccountsCount,
    totalSalesEarnedLTV,
    protectedDealsCount,
    addDeal,
    updateDealStage,
    editDeal,
    archiveDeal,

    // Referral track state
    referrals,
    totalReferralBountiesCleared,
    totalReferralBountiesInClearance,
  };
});
