<template>
  <div class="h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-200">
    <!-- Top Bar Navigation & Actions -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-3">
        <!-- Back Button: Only shown when entering from Overview -->
        <router-link
          v-if="isFromOverview"
          to="/partner/overview"
          class="p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
          title="Back to Overview"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="hidden sm:inline">Overview</span>
        </router-link>

        <div v-if="isFromOverview" class="h-4 w-px bg-border"></div>

        <div>
          <h1 class="text-base sm:text-lg font-bold text-foreground tracking-tight">
            Commissions
          </h1>
          <p class="text-xs text-muted-foreground">
            Track commission accruals, payout clearance schedules, and bank transfers
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          to="/partner/withdrawal?from=commissions"
          class="px-3.5 py-1.5 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Banknote class="w-3.5 h-3.5" />
          <span>Withdraw Balance</span>
        </router-link>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 overflow-y-auto w-full [scrollbar-gutter:stable]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        <!-- 3-Column Financial Metrics Summary Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Metric 1 -->
          <div class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-muted-foreground">
                  {{ partnerStore.activeTrack === 'sales' ? 'Monthly Recurring RevShare' : 'Available Balance' }}
                </span>
                <div class="w-7 h-7 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                  <Wallet class="w-4 h-4" />
                </div>
              </div>
              <p class="text-2xl font-extrabold font-mono text-primary mt-2">
                {{ partnerStore.activeTrack === 'sales' ? 'RM 1,480' : 'RM 1,200' }}
              </p>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                {{ partnerStore.activeTrack === 'sales' ? 'Next disbursement on 05 Nov 2026' : 'Ready for immediate withdrawal' }}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px]">
              <router-link
                to="/partner/withdrawal?from=commissions"
                class="inline-flex items-center gap-1 font-bold text-primary hover:text-primary/90 hover:underline cursor-pointer group/link"
              >
                <span>{{ partnerStore.activeTrack === 'sales' ? 'View remittance' : 'Withdraw now' }}</span>
                <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </router-link>
              <span class="text-muted-foreground text-[10.5px]">
                {{ partnerStore.activeTrack === 'sales' ? 'Auto-bank remittance' : 'Direct bank transfer' }}
              </span>
            </div>
          </div>

          <!-- Metric 2 -->
          <div class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-muted-foreground">
                  {{ partnerStore.activeTrack === 'sales' ? 'Active 12-Mo Cohorts' : 'In Clearance' }}
                </span>
                <div class="w-7 h-7 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                  <Clock class="w-4 h-4" />
                </div>
              </div>
              <p class="text-2xl font-extrabold font-mono text-warning mt-2">
                {{ partnerStore.activeTrack === 'sales' ? '4 Accounts' : 'RM 1,500' }}
              </p>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                {{ partnerStore.activeTrack === 'sales' ? 'Generating monthly recurring RevShare' : 'Deal clearance hold (30-day lock)' }}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{{ partnerStore.activeTrack === 'sales' ? 'Reseller tier' : 'Deal clearance' }}</span>
              <span class="font-mono font-bold text-warning">
                {{ partnerStore.activeTrack === 'sales' ? '20% Certified' : '5 deals' }}
              </span>
            </div>
          </div>

          <!-- Metric 3 -->
          <div class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-muted-foreground">
                  {{ partnerStore.activeTrack === 'sales' ? 'Total Cumulative LTV' : 'Lifetime Earned' }}
                </span>
                <div class="w-7 h-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <Banknote class="w-4 h-4" />
                </div>
              </div>
              <p class="text-2xl font-extrabold font-mono text-foreground mt-2">
                {{ partnerStore.activeTrack === 'sales' ? 'RM 14,480' : 'RM 2,700' }}
              </p>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                {{ partnerStore.activeTrack === 'sales' ? 'Cumulative contract commissions paid' : 'RM 1,200 cleared + RM 1,500 clearing' }}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{{ partnerStore.activeTrack === 'sales' ? 'Total Client Book' : 'All-time converted deals' }}</span>
              <span class="font-mono font-bold text-foreground">
                {{ partnerStore.activeTrack === 'sales' ? 'RM 124,800 ARR' : '9 deals' }}
              </span>
            </div>
          </div>
        </div>

        <!-- SALES TRACK: Recurring RevShare Cohort Schedule -->
        <div
          v-if="partnerStore.activeTrack === 'sales'"
          class="bg-card border border-border rounded-2xl shadow-xs overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-foreground">Active Client Subscriptions & RevShare Cohorts</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                  20% Margin Active
                </span>
              </div>
              <p class="text-xs text-muted-foreground">12-month recurring MRR share schedule for active client accounts</p>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-muted-foreground">Total Monthly RevShare:</span>
              <span class="font-mono font-bold text-primary text-sm">RM {{ partnerStore.monthlyRecurringCommission.toLocaleString() }} / mo</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-border bg-muted/50 text-muted-foreground">
                  <th class="py-3 px-4 font-semibold">Client & Deal ID</th>
                  <th class="py-3 px-4 font-semibold">Plan & Client MRR</th>
                  <th class="py-3 px-4 font-semibold">RevShare Margin</th>
                  <th class="py-3 px-4 font-semibold">Monthly Commission</th>
                  <th class="py-3 px-4 font-semibold">12-Month Cohort Progress</th>
                  <th class="py-3 px-4 font-semibold">Next Disbursement</th>
                  <th class="py-3 px-4 font-semibold text-right">Cumulative Paid</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  v-for="sub in partnerStore.recurringCommissions"
                  :key="sub.id"
                  class="hover:bg-muted/50 transition-colors"
                >
                  <td class="py-3.5 px-4">
                    <p class="font-bold text-foreground">{{ sub.clientName }}</p>
                    <p class="text-[10px] text-muted-foreground font-mono">{{ sub.dealId }}</p>
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="font-mono font-bold text-foreground">RM {{ sub.clientMRR.toLocaleString() }}/mo</span>
                    <span class="ml-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {{ sub.plan }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold text-success">
                    {{ sub.revSharePercent }}%
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold text-primary">
                    RM {{ sub.monthlyCommission.toLocaleString() }}/mo
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="space-y-1 w-32">
                      <div class="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Month {{ sub.monthElapsed }} of {{ sub.totalMonths }}</span>
                        <span class="font-bold">{{ Math.round((sub.monthElapsed / sub.totalMonths) * 100) }}%</span>
                      </div>
                      <div class="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-primary rounded-full"
                          :style="{ width: `${(sub.monthElapsed / sub.totalMonths) * 100}%` }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-muted-foreground">
                    {{ sub.nextDisbursementDate }}
                  </td>
                  <td class="py-3.5 px-4 text-right font-mono font-extrabold text-foreground">
                    RM {{ sub.cumulativePaid.toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- REFERRAL TRACK: Commission Records Ledger Table Card -->
        <div
          v-else
          class="bg-card border border-border rounded-2xl shadow-xs overflow-hidden"
        >
          <!-- Table Toolbar -->
          <div class="border-b border-border">
          <!-- Top Row: Title, Search, Filter Icon, Sort Dropdown -->
          <div class="px-4 sm:px-5 pt-4 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
            <div>
              <h3 class="text-sm font-bold text-foreground">Commission Payout Records</h3>
              <p class="text-xs text-muted-foreground">Itemized ledger of all deals, clearing schedules, and credit payouts</p>
            </div>

            <!-- Toolbar Controls -->
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <!-- Search Bar -->
              <div class="relative flex-1 sm:w-60">
                <Search class="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="searchQuery"
                  @input="currentPage = 1"
                  type="text"
                  placeholder="Search company or ref ID..."
                  class="w-full pl-8 pr-2.5 py-1.5 text-xs bg-muted/50 border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <!-- Sort Dropdown Button with Active Indicator & Popover -->
              <div class="relative">
                <button
                  @click="isSortMenuOpen = !isSortMenuOpen"
                  :class="[
                    'p-2 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                    isCustomSort
                      ? 'border-primary bg-success/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                  ]"
                  :title="isCustomSort ? `Sorted by: ${activeSortOption.label}` : 'Sort records'"
                >
                  <ArrowUpDown class="w-3.5 h-3.5" />
                  <span v-if="isCustomSort" class="hidden sm:inline font-semibold text-[11px] truncate max-w-[110px]">
                    {{ activeSortOption.label }}
                  </span>
                  <span v-else class="hidden sm:inline">Sort</span>
                  <ChevronDown class="w-3 h-3 text-muted-foreground" />
                </button>

                <!-- Sort Options Popover Menu -->
                <div
                  v-if="isSortMenuOpen"
                  class="absolute right-0 mt-1.5 w-56 bg-popover border border-border text-popover-foreground rounded-xl shadow-xl py-1.5 z-30 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div class="px-3 py-1 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                    Sort Commission Records
                  </div>
                  <button
                    v-for="option in sortOptions"
                    :key="option.id"
                    @click="applySortOption(option); isSortMenuOpen = false"
                    :class="[
                      'w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-muted cursor-pointer transition-colors',
                      currentSortOptionId === option.id ? 'text-primary font-bold' : 'text-foreground'
                    ]"
                  >
                    <span class="flex items-center gap-1.5">
                      <ArrowUp v-if="option.order === 'asc'" class="w-3 h-3 text-muted-foreground" />
                      <ArrowDown v-else class="w-3 h-3 text-muted-foreground" />
                      {{ option.label }}
                    </span>
                    <Check v-if="currentSortOptionId === option.id" class="w-3.5 h-3.5 text-primary" />
                  </button>

                  <div v-if="isCustomSort" class="pt-1 mt-1 border-t border-border px-2 pb-0.5">
                    <button
                      @click="applySortOption(sortOptions[0]); isSortMenuOpen = false"
                      class="w-full text-center py-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Reset to Default Sort
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Segmented Tab Bar Design -->
          <div class="px-4 sm:px-5 pb-3 pt-0.5 overflow-x-auto no-scrollbar">
            <div class="inline-flex items-center p-1 bg-muted/80 rounded-xl border border-border gap-0.5">
              <button
                v-for="tab in statusFilters"
                :key="tab.id"
                @click="statusFilter = tab.id; currentPage = 1"
                :class="[
                  'px-3.5 py-1.5 text-xs transition-all duration-150 rounded-lg inline-flex items-center gap-2 cursor-pointer shrink-0 select-none',
                  statusFilter === tab.id
                    ? 'bg-card text-foreground font-bold shadow-xs border border-border'
                    : 'text-muted-foreground hover:text-foreground font-medium border border-transparent hover:bg-muted'
                ]"
              >
                <span>{{ tab.label }}</span>
                <span
                  :class="[
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono transition-colors',
                    statusFilter === tab.id
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground font-medium'
                  ]"
                >
                  {{ tab.count }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Ledger Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-muted/50 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border">
                <th
                  @click="handleSort('refId')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-foreground group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Transaction ID
                    <ArrowUpDown class="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('company')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-foreground group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Client Company
                    <ArrowUpDown class="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('clearingDate')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-foreground group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Clearance Date
                    <ArrowUpDown class="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('status')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-foreground group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Status
                    <ArrowUpDown class="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('payout')"
                  class="px-5 py-3 text-right cursor-pointer select-none hover:text-foreground group"
                >
                  <span class="inline-flex items-center justify-end gap-1.5">
                    Commission Credit
                    <ArrowUpDown class="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-if="paginatedCommissions.length === 0">
                <td colspan="5" class="py-12 text-center text-muted-foreground">
                  <p class="font-semibold text-muted-foreground">No commission records found.</p>
                  <p class="text-xs mt-0.5">Try adjusting your filters or search terms.</p>
                  <button
                    @click="resetFilters"
                    class="mt-3 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </td>
              </tr>
              <tr
                v-for="comm in paginatedCommissions"
                :key="comm.id"
                class="hover:bg-muted/50 transition-colors"
              >
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">
                  {{ comm.refId }}
                </td>
                <td class="px-5 py-3 font-bold text-foreground">
                  {{ comm.company }}
                </td>
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">
                  {{ comm.clearingDate }}
                </td>
                <td class="px-5 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
                      comm.status === 'Cleared'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-warning/10 text-warning border-warning/20'
                    ]"
                  >
                    {{ comm.status }}
                  </span>
                </td>
                <td class="px-5 py-3 text-right font-mono font-bold text-success">
                  +RM {{ comm.payout }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer: Results summary, page size selector & pagination -->
        <div class="px-5 py-3.5 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div class="flex items-center gap-3">
            <span>
              Showing <strong class="text-foreground font-mono">{{ paginationStart }}</strong> to
              <strong class="text-foreground font-mono">{{ paginationEnd }}</strong> of
              <strong class="text-foreground font-mono">{{ sortedCommissions.length }}</strong> commission records
            </span>

            <!-- Page Size Selector -->
            <div class="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
              <span class="text-muted-foreground text-[11px]">Show:</span>
              <select
                v-model="pageSize"
                @change="currentPage = 1"
                class="bg-card border border-input rounded-lg px-2 py-0.5 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
              >
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex items-center gap-1">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
            </button>

            <span class="px-2 py-1 text-xs font-mono font-medium text-foreground">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePartnerStore } from '@/stores/partner';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Wallet,
  Clock,
  Banknote,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-vue-next';

const partnerStore = usePartnerStore();
const route = useRoute();

// Show back button only when navigated from Overview
const isFromOverview = computed(() => {
  if (route.query.from === 'overview') return true;
  if (typeof window !== 'undefined' && window.history?.state?.back) {
    return window.history.state.back.includes('/partner/overview');
  }
  return false;
});

interface SortOption {
  id: string;
  label: string;
  field: 'refId' | 'company' | 'clearingDate' | 'status' | 'payout';
  order: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
  { id: 'date-desc', label: 'Date: Newest First', field: 'clearingDate', order: 'desc' },
  { id: 'date-asc', label: 'Date: Oldest First', field: 'clearingDate', order: 'asc' },
  { id: 'company-asc', label: 'Company: A → Z', field: 'company', order: 'asc' },
  { id: 'company-desc', label: 'Company: Z → A', field: 'company', order: 'desc' },
  { id: 'payout-desc', label: 'Payout: High → Low', field: 'payout', order: 'desc' },
  { id: 'payout-asc', label: 'Payout: Low → High', field: 'payout', order: 'asc' },
  { id: 'status-asc', label: 'Status: A → Z', field: 'status', order: 'asc' },
];

const searchQuery = ref('');
const statusFilter = ref<'all' | 'Cleared' | 'In Clearance'>('all');
const isSortMenuOpen = ref(false);
const currentSortOptionId = ref('date-desc');
const sortField = ref<'refId' | 'company' | 'clearingDate' | 'status' | 'payout'>('clearingDate');
const sortOrder = ref<'asc' | 'desc'>('desc');
const pageSize = ref(10);
const currentPage = ref(1);

// Reconciled ledger dataset across portal
const commissions = [
  { id: 1, refId: 'COMM-8901', company: 'Syarikat Maju Jaya', clearingDate: '14 Oct 2026', status: 'Cleared', payout: 300 },
  { id: 2, refId: 'COMM-8902', company: 'Mega Jaya Wholesale', clearingDate: '01 Oct 2026', status: 'Cleared', payout: 300 },
  { id: 3, refId: 'COMM-8903', company: 'Nusantara Logistics', clearingDate: '21 Sep 2026', status: 'Cleared', payout: 300 },
  { id: 4, refId: 'COMM-8904', company: 'Apex Retail Solutions', clearingDate: '18 Sep 2026', status: 'Cleared', payout: 300 },
  { id: 5, refId: 'COMM-8905', company: 'Kencana Holdings', clearingDate: '10 Nov 2026', status: 'In Clearance', payout: 300 },
  { id: 6, refId: 'COMM-8906', company: 'Sentosa F&B Group', clearingDate: '04 Nov 2026', status: 'In Clearance', payout: 300 },
  { id: 7, refId: 'COMM-8907', company: 'Pelangi Media Lab', clearingDate: '22 Oct 2026', status: 'In Clearance', payout: 300 },
  { id: 8, refId: 'COMM-8908', company: 'Borneo Timberline', clearingDate: '16 Oct 2026', status: 'In Clearance', payout: 300 },
  { id: 9, refId: 'COMM-8909', company: 'Wawasan Capital Partners', clearingDate: '28 Oct 2026', status: 'In Clearance', payout: 300 },
];

const statusFilters = computed(() => [
  { id: 'all' as const, label: 'All', count: commissions.length },
  { id: 'Cleared' as const, label: 'Cleared', count: commissions.filter(c => c.status === 'Cleared').length },
  { id: 'In Clearance' as const, label: 'In Clearance', count: commissions.filter(c => c.status === 'In Clearance').length },
]);

const activeSortOption = computed(() => {
  return sortOptions.find(o => o.id === currentSortOptionId.value) || sortOptions[0];
});

const isCustomSort = computed(() => {
  return currentSortOptionId.value !== 'date-desc';
});

const filteredCommissions = computed(() => {
  return commissions.filter(c => {
    const matchesStatus = statusFilter.value === 'all' || c.status === statusFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q || c.company.toLowerCase().includes(q) || c.refId.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });
});

const sortedCommissions = computed(() => {
  const list = [...filteredCommissions.value];
  const field = sortField.value;
  const isAsc = sortOrder.value === 'asc';

  return list.sort((a, b) => {
    if (field === 'clearingDate') {
      const dateA = new Date(a.clearingDate).getTime();
      const dateB = new Date(b.clearingDate).getTime();
      return isAsc ? dateA - dateB : dateB - dateA;
    }
    if (field === 'payout') {
      return isAsc ? a.payout - b.payout : b.payout - a.payout;
    }
    const valA = String(a[field]).toLowerCase();
    const valB = String(b[field]).toLowerCase();
    return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });
});

const totalPages = computed(() => {
  return Math.ceil(sortedCommissions.value.length / pageSize.value) || 1;
});

const paginatedCommissions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedCommissions.value.slice(start, start + pageSize.value);
});

const paginationStart = computed(() => {
  if (sortedCommissions.value.length === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, sortedCommissions.value.length);
});

function applySortOption(option: SortOption) {
  currentSortOptionId.value = option.id;
  sortField.value = option.field;
  sortOrder.value = option.order;
  currentPage.value = 1;
}

function handleSort(field: 'refId' | 'company' | 'clearingDate' | 'status' | 'payout') {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
  const match = sortOptions.find(o => o.field === sortField.value && o.order === sortOrder.value);
  if (match) {
    currentSortOptionId.value = match.id;
  } else {
    currentSortOptionId.value = '';
  }
  currentPage.value = 1;
}

function resetFilters() {
  searchQuery.value = '';
  statusFilter.value = 'all';
  applySortOption(sortOptions[0]);
  currentPage.value = 1;
}
</script>
