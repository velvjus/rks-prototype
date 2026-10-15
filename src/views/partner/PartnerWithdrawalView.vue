<template>
  <div class="h-full flex flex-col min-h-0 bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
    <!-- Top Sticky Header: Quiet, Clean Title Bar -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div>
        <h1 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          {{ partnerStore.activeTrack === 'sales' ? 'Remittance & Banking' : 'Withdrawal & Banking' }}
        </h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ partnerStore.activeTrack === 'sales'
            ? 'Manage automated monthly recurring remittances, bank clearance, and settlement tax advice'
            : 'Disburse cleared partner referral earnings to Malaysian bank accounts and track settlement history'
          }}
        </p>
      </div>
    </header>

    <!-- Main Content Canvas -->
    <main class="flex-1 min-h-0 overflow-y-auto w-full [scrollbar-gutter:stable]">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">

        <!-- ═════════════════════════════════════════════════════════
             CALM SEGMENTED TAB NAVIGATION
             Adapts labels and counts dynamically per track
             ═════════════════════════════════════════════════════════ -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 dark:border-gray-800/80 pb-3">
          <div class="inline-flex p-1 bg-gray-100/90 dark:bg-gray-800/80 rounded-xl border border-gray-200/70 dark:border-gray-700/60 gap-1 text-xs">
            <button
              @click="activeTab = 'cashier'"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-2 select-none',
                activeTab === 'cashier'
                  ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <Banknote class="w-3.5 h-3.5" />
              <span>{{ partnerStore.activeTrack === 'sales' ? 'Monthly Remittance' : 'Request Payout' }}</span>
            </button>

            <button
              @click="activeTab = 'history'"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-2 select-none',
                activeTab === 'history'
                  ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <ReceiptText class="w-3.5 h-3.5" />
              <span>{{ partnerStore.activeTrack === 'sales' ? 'Remittance Ledger' : 'Disbursement History' }}</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {{ activeHistoryRecords.length }}
              </span>
            </button>

            <button
              @click="activeTab = 'banks'"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-2 select-none',
                activeTab === 'banks'
                  ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <Building2 class="w-3.5 h-3.5" />
              <span>Bank Accounts</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {{ linkedBanks.length }}
              </span>
            </button>
          </div>

          <!-- Quick Balance Summary in Navigation Bar -->
          <div class="flex items-center gap-2 text-xs">
            <span class="text-gray-400">
              {{ partnerStore.activeTrack === 'sales' ? 'Next Remittance:' : 'Available to Disburse:' }}
            </span>
            <span class="font-mono font-bold text-[#23B750]">
              RM {{ (partnerStore.activeTrack === 'sales' ? 1480 : availableBalance).toLocaleString() }}.00
            </span>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 1: SETTLEMENT ENGINE
             Referral Track: Manual Payout Cashier
             Sales Track: Automated Scheduled Monthly Remittance Console
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'cashier'" class="animate-in fade-in duration-150">

          <!-- ═════════════════════════════════════════════════════════
               TRACK A: SALES PARTNER (RESELLER RECURRING REMITTANCE)
               ═════════════════════════════════════════════════════════ -->
          <div v-if="partnerStore.activeTrack === 'sales'" class="space-y-6 max-w-3xl mx-auto">
            <!-- Automated Monthly Remittance Status Card -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 shadow-xs space-y-6">
              <!-- Header Strip -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-5">
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-gray-900 dark:text-white">Scheduled Auto-Remittance</h2>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] border border-emerald-200/70 dark:border-emerald-800/60">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span>
                      <span>Active</span>
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Monthly recurring commission is automatically disbursed on the 5th of every month
                  </p>
                </div>

                <!-- Primary Destination Preview -->
                <div class="text-left sm:text-right text-xs">
                  <span class="text-gray-400">Payout Destination:</span>
                  <div class="font-semibold text-gray-800 dark:text-gray-200 flex items-center sm:justify-end gap-1.5 mt-0.5">
                    <Building2 class="w-3.5 h-3.5 text-gray-400" />
                    <span>{{ primaryBank.bankName }} ({{ primaryBank.accountMasked }})</span>
                  </div>
                </div>
              </div>

              <!-- Main Amount & Remittance Countdown -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700/60 space-y-1">
                  <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Next Wire Amount</span>
                  <p class="text-2xl font-extrabold font-mono text-[#23B750]">RM 1,480.00</p>
                  <p class="text-[11px] text-gray-400">20% RevShare across 4 cohorts</p>
                </div>

                <div class="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700/60 space-y-1">
                  <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Disbursement Date</span>
                  <p class="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">05 Nov 2026</p>
                  <p class="text-[11px] text-gray-400">In 20 days (Next banking cycle)</p>
                </div>

                <div class="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700/60 space-y-1">
                  <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Cumulative Paid LTV</span>
                  <p class="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">RM 14,480.00</p>
                  <p class="text-[11px] text-gray-400">All-time contract earnings</p>
                </div>
              </div>

              <!-- Cohort Allocation Breakdown -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Contributing Client Cohorts (November 2026 Payout)
                  </h3>
                  <span class="text-xs text-gray-400 font-mono">4 Accounts</span>
                </div>

                <div class="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200/70 dark:border-gray-800 rounded-xl overflow-hidden text-xs">
                  <div
                    v-for="item in salesCohorts"
                    :key="item.id"
                    class="p-3.5 bg-white dark:bg-[#0E131F] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ item.clientName }}</div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                        {{ item.plan }} Plan · Client MRR: RM {{ item.clientMRR.toLocaleString() }} · Month {{ item.monthElapsed }}/12
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-mono font-bold text-[#23B750]">+RM {{ item.monthlyCommission.toLocaleString() }}.00</div>
                      <div class="text-[10px] text-gray-400">20% Tier Share</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Early On-Demand Cashout Option (In-Card Action) -->
              <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 class="text-xs font-bold text-gray-900 dark:text-white">Need funds before 05 Nov?</h4>
                  <p class="text-[11px] text-gray-400">Instant early settlement is available for cleared active monthly accruals.</p>
                </div>
                <button
                  @click="showEarlyDisbursalModal = true"
                  class="px-3.5 py-1.5 text-xs font-semibold text-[#23B750] bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 transition-colors cursor-pointer shrink-0"
                >
                  Request Early Disbursal &rarr;
                </button>
              </div>
            </div>

            <!-- Quiet Footer Audit Link -->
            <div class="text-center text-xs text-gray-400">
              <span>Looking for past corporate remittances &amp; tax advice slips? </span>
              <button
                @click="activeTab = 'history'"
                class="font-semibold text-[#23B750] hover:underline cursor-pointer"
              >
                View Remittance Ledger &rarr;
              </button>
            </div>
          </div>

          <!-- ═════════════════════════════════════════════════════════
               TRACK B: REFERRAL PARTNER (AFFILIATE BOUNTY CASHIER)
               ═════════════════════════════════════════════════════════ -->
          <div v-else class="max-w-xl mx-auto space-y-6">
            <!-- Calm Balance Strip -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 shadow-xs space-y-5">
              <div class="text-center space-y-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Available to Disburse
                </span>
                <div class="text-4xl font-extrabold font-mono text-gray-900 dark:text-white tracking-tight">
                  RM {{ availableBalance.toLocaleString() }}.00
                </div>
                <p class="text-xs text-gray-400 dark:text-gray-500">
                  Cleared referral bounty earnings ready for direct Malaysian bank transfer
                </p>
                <div class="pt-1">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/50">
                    <Clock class="w-3 h-3" />
                    <span>RM {{ processingBalance.toLocaleString() }}.00 in standard 30-day clearance hold (5 deals)</span>
                  </span>
                </div>
              </div>

              <!-- Cashier Form -->
              <form @submit.prevent="submitWithdrawal" class="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                <!-- Destination Bank Selector -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label for="destination-bank-select" class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Building2 class="w-3.5 h-3.5 text-gray-400" />
                      <span>Destination Bank Account</span>
                    </label>
                    <button
                      type="button"
                      @click="showAddBankModal = true"
                      class="text-[11px] font-semibold text-[#23B750] hover:underline cursor-pointer"
                    >
                      + Add New Bank
                    </button>
                  </div>

                  <div class="relative">
                    <select
                      id="destination-bank-select"
                      v-model="selectedBankId"
                      class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750] transition-colors"
                    >
                      <option
                        v-for="bank in linkedBanks"
                        :key="bank.id"
                        :value="bank.id"
                      >
                        {{ bank.bankName }} · {{ bank.accountMasked }} {{ bank.isPrimary ? '(Primary Account)' : '' }}
                      </option>
                    </select>
                  </div>
                  <div class="text-[11px] text-gray-400 flex items-center justify-between px-0.5">
                    <span>Beneficiary Name: <strong class="text-gray-700 dark:text-gray-300">{{ currentSelectedBank?.holderName || 'Tan Wei Jun' }}</strong></span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-medium">Auto Name Matching OK</span>
                  </div>
                </div>

                <!-- Payout Amount with Presets -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label for="withdraw-amount-input" class="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Disbursement Amount (RM)
                    </label>
                    <span class="text-[11px] text-gray-400">Min: RM 100 · Max: RM {{ availableBalance.toLocaleString() }}</span>
                  </div>

                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-gray-400 text-xs">RM</span>
                    <input
                      id="withdraw-amount-input"
                      type="number"
                      ref="amountInputRef"
                      v-model.number="withdrawAmount"
                      :min="100"
                      :max="availableBalance"
                      required
                      placeholder="0.00"
                      class="w-full pl-10 pr-20 py-2.5 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750] transition-colors"
                    />
                    <button
                      type="button"
                      @click="fillAmount(availableBalance)"
                      class="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-[#23B750] bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>

                  <!-- Quick Amount Chips (Fixed RM 300 Bounty Multiples) -->
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      v-for="amt in referralQuickAmounts"
                      :key="amt.label"
                      type="button"
                      @click="fillAmount(amt.value)"
                      :disabled="amt.value > availableBalance"
                      :class="[
                        'px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                        withdrawAmount === amt.value
                          ? 'bg-[#23B750] text-white shadow-2xs'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      ]"
                    >
                      {{ amt.label }}
                    </button>
                  </div>
                </div>

                <!-- Transparent Settlement Breakdown Box -->
                <div class="bg-gray-50/80 dark:bg-gray-800/40 rounded-xl p-3.5 border border-gray-200/70 dark:border-gray-800 space-y-2 text-xs">
                  <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>Requested Disbursal:</span>
                    <span class="font-mono font-bold text-gray-900 dark:text-white">RM {{ (withdrawAmount || 0).toLocaleString() }}.00</span>
                  </div>
                  <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>MEPS IBG Processing Fee:</span>
                    <span class="font-bold text-[#23B750]">Free (RM 0.00)</span>
                  </div>
                  <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>Settlement Window:</span>
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Same Business Day (by 5:00 PM)</span>
                  </div>
                  <div class="pt-2 border-t border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between">
                    <span class="font-semibold text-gray-800 dark:text-gray-200">Net Credit to Bank:</span>
                    <span class="font-mono font-extrabold text-base text-[#23B750]">RM {{ (withdrawAmount || 0).toLocaleString() }}.00</span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="!isValidAmount || isSubmitting"
                  class="w-full py-2.5 bg-[#23B750] hover:bg-[#1fa848] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Banknote class="w-4 h-4" />
                  <span>{{ isSubmitting ? 'Initiating MEPS Transfer...' : 'Confirm & Disburse Funds' }}</span>
                </button>
              </form>
            </div>

            <!-- Quiet Footer Audit Link -->
            <div class="text-center text-xs text-gray-400">
              <span>Need to inspect past bounty payouts? </span>
              <button
                @click="activeTab = 'history'"
                class="font-semibold text-[#23B750] hover:underline cursor-pointer"
              >
                View Disbursement History &rarr;
              </button>
            </div>
          </div>

        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 2: AUDIT LEDGER & SLIPS
             Sales Track: Monthly Corporate Remittance Statements
             Referral Track: Individual Bounty Cashout Records
             ═════════════════════════════════════════════════════════ -->
        <div v-else-if="activeTab === 'history'" class="space-y-4 animate-in fade-in duration-150">
          <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            <!-- Row 1: Title and Record Count -->
            <div class="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ partnerStore.activeTrack === 'sales' ? 'Monthly Remittance Statements' : 'Disbursement Audit Ledger' }}
                </h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ partnerStore.activeTrack === 'sales'
                    ? 'Official audit trail of monthly reseller revshare remittances, cohort accounts, and tax advice slips'
                    : 'Complete history of referral bounty cashouts, MEPS references, and payment vouchers'
                  }}
                </p>
              </div>
              <div class="text-xs text-gray-400 font-mono">
                Showing {{ filteredHistory.length }} of {{ activeHistoryRecords.length }} records
              </div>
            </div>

            <!-- Row 2: Clean, Logical Toolbar (Status Filter Left, Search Right) -->
            <div class="px-5 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <!-- Status Segmented Filter Pills -->
              <div class="inline-flex p-1 bg-gray-100/90 dark:bg-gray-800/80 rounded-xl border border-gray-200/70 dark:border-gray-700/60 gap-0.5 text-xs self-start sm:self-auto">
                <button
                  v-for="tab in filterTabs"
                  :key="tab.id"
                  @click="activeStatusFilter = tab.id"
                  :class="[
                    'px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer select-none font-medium',
                    activeStatusFilter === tab.id
                      ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white font-bold shadow-xs border border-gray-200/80 dark:border-gray-700/80'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent'
                  ]"
                >
                  {{ tab.label }}
                </button>
              </div>

              <!-- Search Input with Clear Width and Icon Alignment -->
              <div class="relative w-full sm:w-72">
                <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search ref ID or bank..."
                  class="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750]"
                />
              </div>
            </div>

            <!-- Table Content -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-200/80 dark:border-gray-800/80 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <th class="py-3 px-5">{{ partnerStore.activeTrack === 'sales' ? 'Statement ID' : 'Reference ID' }}</th>
                    <th class="py-3 px-5">Date &amp; Time</th>
                    <th class="py-3 px-5">Destination Bank</th>
                    <th class="py-3 px-5">{{ partnerStore.activeTrack === 'sales' ? 'Client Accounts' : 'MEPS Reference' }}</th>
                    <th class="py-3 px-5">Amount</th>
                    <th class="py-3 px-5">Status</th>
                    <th class="py-3 px-5 text-right">{{ partnerStore.activeTrack === 'sales' ? 'Tax Advice' : 'Voucher' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/80">
                  <tr
                    v-for="item in paginatedHistory"
                    :key="item.id"
                    class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <!-- Ref ID -->
                    <td class="py-3.5 px-5 font-mono font-bold text-gray-900 dark:text-white">
                      {{ item.refId }}
                    </td>

                    <!-- Date & Time -->
                    <td class="py-3.5 px-5 text-gray-600 dark:text-gray-300">
                      <div>{{ item.date }}</div>
                      <div class="text-[10px] text-gray-400">{{ item.time }}</div>
                    </td>

                    <!-- Bank & Account -->
                    <td class="py-3.5 px-5">
                      <div class="font-medium text-gray-900 dark:text-white">{{ item.bank }}</div>
                      <div class="text-[11px] font-mono text-gray-400">{{ item.accountMasked }}</div>
                    </td>

                    <!-- Detail: Cohort vs MEPS -->
                    <td class="py-3.5 px-5">
                      <span v-if="partnerStore.activeTrack === 'sales'" class="font-semibold text-gray-700 dark:text-gray-300">
                        {{ item.cohortsCount || 4 }} Accounts
                      </span>
                      <span v-else class="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                        {{ item.mepsRef }}
                      </span>
                    </td>

                    <!-- Amount -->
                    <td class="py-3.5 px-5 font-mono font-extrabold text-gray-900 dark:text-white">
                      RM {{ item.amount.toLocaleString() }}.00
                    </td>

                    <!-- Status -->
                    <td class="py-3.5 px-5">
                      <span
                        :class="[
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                          item.status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] border-emerald-200/80 dark:border-emerald-800/60'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/60'
                        ]"
                      >
                        <span
                          :class="[
                            'w-1.5 h-1.5 rounded-full',
                            item.status === 'Completed' ? 'bg-[#23B750]' : 'bg-amber-500 animate-pulse'
                          ]"
                        ></span>
                        <span>{{ item.status }}</span>
                      </span>
                    </td>

                    <!-- Action: Voucher / Tax Advice -->
                    <td class="py-3.5 px-5 text-right">
                      <button
                        @click="openReceiptModal(item)"
                        class="px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[#23B750] dark:hover:text-[#23B750] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#23B750]/50 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText class="w-3 h-3" />
                        <span>{{ partnerStore.activeTrack === 'sales' ? 'Statement' : 'Slip' }}</span>
                      </button>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="filteredHistory.length === 0">
                    <td colspan="7" class="py-12 text-center text-gray-400 space-y-2">
                      <ReceiptText class="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600" />
                      <p class="text-xs font-semibold">No records matching your search filter.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Footer -->
            <div class="px-5 py-3.5 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div>
                Showing <strong class="font-mono text-gray-800 dark:text-gray-200">{{ paginatedHistory.length }}</strong> of
                <strong class="font-mono text-gray-800 dark:text-gray-200">{{ filteredHistory.length }}</strong> statements
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  @click="currentPage > 1 && currentPage--"
                  :disabled="currentPage === 1"
                  class="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Previous
                </button>
                <span class="px-2 font-mono font-semibold text-gray-800 dark:text-gray-200">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
                <button
                  @click="currentPage < totalPages && currentPage++"
                  :disabled="currentPage >= totalPages"
                  class="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 3: BANK ACCOUNTS (SHARED MALAYSIAN BANKING HUB)
             Verified Malaysian Banking Infrastructure
             ═════════════════════════════════════════════════════════ -->
        <div v-else-if="activeTab === 'banks'" class="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
          <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Verified Malaysian Bank Accounts</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono">{{ linkedBanks.length }}</span>
                </h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ partnerStore.activeTrack === 'sales'
                    ? 'Authorized accounts for automatic 5th-of-month MEPS IBG revenue share bank wires'
                    : 'Accounts authorized for DuitNow and MEPS interbank GIRO on-demand payouts'
                  }}
                </p>
              </div>

              <!-- Action placed directly near the content card! -->
              <button
                @click="showAddBankModal = true"
                class="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>Link Account</span>
              </button>
            </div>

            <!-- Bank Cards List -->
            <div class="space-y-3">
              <div
                v-for="bank in linkedBanks"
                :key="bank.id"
                :class="[
                  'p-4 rounded-xl border transition-all flex items-center justify-between gap-3',
                  bank.isPrimary
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs'
                    : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200/70 dark:border-gray-800'
                ]"
              >
                <div class="flex items-center gap-3.5 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-xs text-gray-700 dark:text-gray-300 shrink-0 shadow-2xs">
                    {{ bank.bankCode }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ bank.bankName }}</span>
                      <span
                        v-if="bank.isPrimary"
                        class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-[#23B750]"
                      >
                        {{ partnerStore.activeTrack === 'sales' ? 'Default Wire Account' : 'Primary Account' }}
                      </span>
                      <span
                        v-if="bank.isVerified"
                        class="text-emerald-500 inline-flex items-center gap-0.5 text-[11px] font-medium"
                        title="Account name matches IC / SSM"
                      >
                        <CheckCircle2 class="w-3.5 h-3.5" />
                        <span class="text-[10px]">Verified</span>
                      </span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                      <span>{{ bank.accountMasked }}</span>
                      <span>·</span>
                      <span class="truncate">{{ bank.holderName }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="shrink-0 flex items-center gap-2">
                  <button
                    v-if="!bank.isPrimary"
                    @click="setPrimaryBank(bank.id)"
                    class="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Set as Primary
                  </button>
                  <span v-else class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 flex items-center gap-1">
                    <Check class="w-3.5 h-3.5" />
                    <span>Default Destination</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Security Reassurance Box -->
            <div class="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-start gap-2.5 text-xs text-gray-400 dark:text-gray-500">
              <Lock class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <p>
                Bank-grade 256-bit encryption. Payout destinations are authenticated via Bank Negara Malaysia MEPS IBG routing. Your online banking credentials are never requested or stored.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 1: EARLY ON-DEMAND DISBURSAL (SALES TRACK)
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="showEarlyDisbursalModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showEarlyDisbursalModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <Banknote class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Early Remittance Settlement</h3>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">November 2026 Reseller Accrual</p>
            </div>
          </div>
          <button @click="showEarlyDisbursalModal = false" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-gray-600 dark:text-gray-300">
            You are requesting early disbursal of your cleared monthly recurring RevShare before the scheduled 05 Nov 2026 batch run.
          </p>

          <div class="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Accrued Commission:</span>
              <span class="font-mono font-bold text-gray-900 dark:text-white">RM 1,480.00</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Early Settlement Fee:</span>
              <span class="font-bold text-[#23B750]">Free (RM 0.00)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Destination Account:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ primaryBank.bankName }} ({{ primaryBank.accountMasked }})</span>
            </div>
            <div class="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
              <span>Net Immediate Credit:</span>
              <span class="font-mono text-sm text-[#23B750]">RM 1,480.00</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            @click="showEarlyDisbursalModal = false"
            class="px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmEarlyDisbursal"
            class="px-4 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Confirm &amp; Disburse RM 1,480
          </button>
        </div>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 2: LINK NEW MALAYSIAN BANK ACCOUNT
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="showAddBankModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showAddBankModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <Building2 class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Link Bank Account</h3>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">Malaysian Bank Account Verification</p>
            </div>
          </div>
          <button @click="showAddBankModal = false" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="handleAddBank" class="space-y-3.5 text-xs">
          <div class="space-y-1">
            <label for="new-bank-name" class="font-semibold text-gray-700 dark:text-gray-300">Bank Name</label>
            <select
              id="new-bank-name"
              v-model="newBankForm.bankName"
              required
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#23B750]"
            >
              <option value="RHB Bank">RHB Bank</option>
              <option value="Hong Leong Bank">Hong Leong Bank</option>
              <option value="AmBank">AmBank</option>
              <option value="Alliance Bank">Alliance Bank</option>
              <option value="Bank Islam Malaysia">Bank Islam Malaysia</option>
              <option value="OCBC Bank (Malaysia)">OCBC Bank (Malaysia)</option>
              <option value="HSBC Bank Malaysia">HSBC Bank Malaysia</option>
            </select>
          </div>

          <div class="space-y-1">
            <label for="new-bank-acc" class="font-semibold text-gray-700 dark:text-gray-300">Account Number</label>
            <input
              id="new-bank-acc"
              type="text"
              v-model="newBankForm.accountNumber"
              required
              placeholder="e.g. 1102 9948 2019"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#23B750]"
            />
          </div>

          <div class="space-y-1">
            <label for="new-bank-holder" class="font-semibold text-gray-700 dark:text-gray-300">Account Holder Name</label>
            <input
              id="new-bank-holder"
              type="text"
              v-model="newBankForm.holderName"
              required
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#23B750]"
            />
            <p class="text-[10px] text-gray-400">Must match your verified partner identification name (Tan Wei Jun)</p>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="set-primary-check"
              v-model="newBankForm.isPrimary"
              class="rounded border-gray-300 text-[#23B750] focus:ring-[#23B750]"
            />
            <label for="set-primary-check" class="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              Set as primary payout bank account
            </label>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="showAddBankModal = false"
              class="px-3.5 py-1.5 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Verify &amp; Link Account
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 3: OFFICIAL PAYMENT VOUCHER / REMITTANCE TAX ADVICE
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="selectedReceipt"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="selectedReceipt = null"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <!-- Receipt Header -->
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <ReceiptText class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ partnerStore.activeTrack === 'sales' ? 'Remittance Statement' : 'Payout Voucher' }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ selectedReceipt.refId }}</p>
            </div>
          </div>
          <button @click="selectedReceipt = null" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">✕</button>
        </div>

        <!-- Voucher Body -->
        <div class="space-y-3.5 text-xs">
          <!-- Total Disbursed Strip -->
          <div class="bg-emerald-950/80 text-white p-4 rounded-xl border border-emerald-500/30 flex justify-between items-center">
            <div>
              <span class="text-[11px] text-emerald-200">
                {{ partnerStore.activeTrack === 'sales' ? 'Net Recurring Commission Remitted' : 'Total Payout Disbursed' }}
              </span>
              <p class="text-2xl font-extrabold font-mono text-[#23B750]">RM {{ selectedReceipt.amount.toLocaleString() }}.00</p>
            </div>
            <span
              :class="[
                'px-2.5 py-1 rounded-full text-[10px] font-bold border',
                selectedReceipt.status === 'Completed'
                  ? 'bg-emerald-950/80 text-[#23B750] border-emerald-500/40'
                  : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
              ]"
            >
              {{ selectedReceipt.status }}
            </span>
          </div>

          <!-- Metadata Grid -->
          <div class="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Transaction Date:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ selectedReceipt.date }} at {{ selectedReceipt.time }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">MEPS / DuitNow Ref:</span>
              <span class="font-mono text-gray-900 dark:text-white">{{ selectedReceipt.mepsRef }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Beneficiary Bank:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ selectedReceipt.bank }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Account Number:</span>
              <span class="font-mono text-gray-900 dark:text-white">{{ selectedReceipt.accountMasked }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Partner Program:</span>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ partnerStore.activeTrack === 'sales' ? 'Solutions Reseller (20% RevShare)' : 'Referral Affiliate (Fixed Bounty)' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Account Holder:</span>
              <span class="font-semibold text-gray-900 dark:text-white">Tan Wei Jun</span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            @click="downloadReceiptSlip"
            class="px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Download class="w-3.5 h-3.5" />
            <span>{{ partnerStore.activeTrack === 'sales' ? 'Download Tax Advice PDF' : 'Download PDF Slip' }}</span>
          </button>
          <button
            @click="selectedReceipt = null"
            class="px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Toast Feedback -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="toastMessage"
        class="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-gray-700"
      >
        <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
        <span>{{ toastMessage }}</span>
        <button @click="toastMessage = ''" class="ml-2 text-gray-400 hover:text-white cursor-pointer" aria-label="Dismiss toast">✕</button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePartnerStore } from '@/stores/partner';
import {
  Banknote,
  Clock,
  CheckCircle2,
  Search,
  FileText,
  ReceiptText,
  Download,
  Plus,
  Building2,
  Lock,
  Check,
} from 'lucide-vue-next';

const partnerStore = usePartnerStore();

// Segmented Tab State ('cashier' | 'history' | 'banks')
const activeTab = ref<'cashier' | 'history' | 'banks'>('cashier');

// Financial Balances (Reconciled with store & active track)
const availableBalance = ref(1200);
const processingBalance = ref(1500); // 5 referral deals in clearance hold

// Sales Track Active Cohorts
const salesCohorts = computed(() => {
  return partnerStore.recurringCommissions.filter(c => c.status === 'active');
});

// Bank Accounts Architecture
interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountMasked: string;
  holderName: string;
  isPrimary: boolean;
  isVerified: boolean;
  bankCode: string;
}

const linkedBanks = ref<BankAccount[]>([
  {
    id: 'b1',
    bankName: 'Maybank',
    accountNumber: '514028198921',
    accountMasked: '5140 2819 8921',
    holderName: 'Tan Wei Jun',
    isPrimary: true,
    isVerified: true,
    bankCode: 'MBB',
  },
  {
    id: 'b2',
    bankName: 'CIMB Bank',
    accountNumber: '701244913320',
    accountMasked: '7012 4491 3320',
    holderName: 'Tan Wei Jun',
    isPrimary: false,
    isVerified: true,
    bankCode: 'CIMB',
  },
  {
    id: 'b3',
    bankName: 'Public Bank',
    accountNumber: '319800411120',
    accountMasked: '3198 0041 1120',
    holderName: 'Tan Wei Jun',
    isPrimary: false,
    isVerified: true,
    bankCode: 'PBB',
  },
]);

const selectedBankId = ref<string>('b1');

const primaryBank = computed(() => {
  return linkedBanks.value.find(b => b.isPrimary) || linkedBanks.value[0];
});

const currentSelectedBank = computed(() => {
  return linkedBanks.value.find(b => b.id === selectedBankId.value) || linkedBanks.value[0];
});

function setPrimaryBank(bankId: string) {
  linkedBanks.value.forEach(b => {
    b.isPrimary = b.id === bankId;
  });
  selectedBankId.value = bankId;
  showToast('Primary payout bank account updated.');
}

// Modal: Early Disbursal (Sales Track)
const showEarlyDisbursalModal = ref(false);

function confirmEarlyDisbursal() {
  showEarlyDisbursalModal.value = false;
  showToast('Immediate MEPS remittance of RM 1,480 initiated to your Primary Maybank account!');
}

// Modal: Add Bank Account Form State
const showAddBankModal = ref(false);
const newBankForm = ref({
  bankName: 'RHB Bank',
  accountNumber: '',
  holderName: 'Tan Wei Jun',
  isPrimary: false,
});

function handleAddBank() {
  if (!newBankForm.value.accountNumber.trim()) return;

  const rawNumber = newBankForm.value.accountNumber.replace(/\s+/g, '');
  const masked = rawNumber.length > 4 ? `**** **** ${rawNumber.slice(-4)}` : rawNumber;
  const newId = `b-${Date.now()}`;
  const code = newBankForm.value.bankName.slice(0, 4).toUpperCase();

  const newAcc: BankAccount = {
    id: newId,
    bankName: newBankForm.value.bankName,
    accountNumber: rawNumber,
    accountMasked: masked,
    holderName: newBankForm.value.holderName,
    isPrimary: newBankForm.value.isPrimary,
    isVerified: true,
    bankCode: code,
  };

  if (newBankForm.value.isPrimary) {
    linkedBanks.value.forEach(b => { b.isPrimary = false; });
  }

  linkedBanks.value.push(newAcc);
  selectedBankId.value = newId;

  // Reset form
  newBankForm.value = {
    bankName: 'RHB Bank',
    accountNumber: '',
    holderName: 'Tan Wei Jun',
    isPrimary: false,
  };

  showAddBankModal.value = false;
  showToast(`Successfully linked ${newAcc.bankName} account.`);
}

// Cashier Withdrawal Form State (Referral Track)
const withdrawAmount = ref<number>(1200);
const isSubmitting = ref(false);
const amountInputRef = ref<HTMLInputElement | null>(null);

const referralQuickAmounts = computed(() => [
  { label: 'RM 300', value: 300 },
  { label: 'RM 600', value: 600 },
  { label: 'RM 900', value: 900 },
  { label: `MAX (RM ${availableBalance.value})`, value: availableBalance.value },
]);

const isValidAmount = computed(() => {
  return (
    withdrawAmount.value !== null &&
    withdrawAmount.value >= 100 &&
    withdrawAmount.value <= availableBalance.value
  );
});

function fillAmount(amt: number) {
  withdrawAmount.value = amt;
}

// Toast Feedback System
const toastMessage = ref('');
let toastTimer: number | null = null;
function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
}

// Historical Disbursement Records Architecture (Track Dependent)
interface WithdrawalRecord {
  id: number;
  refId: string;
  mepsRef: string;
  date: string;
  time: string;
  bank: string;
  accountMasked: string;
  amount: number;
  cohortsCount?: number;
  status: 'Completed' | 'Processing';
}

// Sales Track: Monthly Consolidated Batch Remittances (Totaling RM 14,480 cumulative LTV)
const salesRemittanceRecords = ref<WithdrawalRecord[]>([
  {
    id: 101,
    refId: 'REMIT-2026-10',
    mepsRef: 'MEPS-9920194821',
    date: '05 Oct 2026',
    time: '09:00 AM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1480,
    cohortsCount: 4,
    status: 'Completed',
  },
  {
    id: 102,
    refId: 'REMIT-2026-09',
    mepsRef: 'MEPS-8819230192',
    date: '05 Sep 2026',
    time: '09:00 AM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1480,
    cohortsCount: 4,
    status: 'Completed',
  },
  {
    id: 103,
    refId: 'REMIT-2026-08',
    mepsRef: 'MEPS-7740192841',
    date: '05 Aug 2026',
    time: '09:00 AM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1240,
    cohortsCount: 3,
    status: 'Completed',
  },
  {
    id: 104,
    refId: 'REMIT-2026-07',
    mepsRef: 'MEPS-6619284011',
    date: '05 Jul 2026',
    time: '09:00 AM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1240,
    cohortsCount: 3,
    status: 'Completed',
  },
  {
    id: 105,
    refId: 'REMIT-2026-06',
    mepsRef: 'MEPS-5501928312',
    date: '05 Jun 2026',
    time: '09:00 AM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1000,
    cohortsCount: 2,
    status: 'Completed',
  },
  {
    id: 106,
    refId: 'REMIT-2026-05',
    mepsRef: 'MEPS-4410293819',
    date: '05 May 2026',
    time: '09:00 AM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1000,
    cohortsCount: 2,
    status: 'Completed',
  },
]);

// Referral Track: Ad-hoc Bounty Cashouts
const referralHistoryRecords = ref<WithdrawalRecord[]>([
  {
    id: 1,
    refId: 'WD-2026-0819',
    mepsRef: 'MEPS-9920194821',
    date: '12 Oct 2026',
    time: '10:30 AM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 500,
    status: 'Processing',
  },
  {
    id: 2,
    refId: 'WD-2026-0742',
    mepsRef: 'MEPS-8819230192',
    date: '28 Sep 2026',
    time: '04:15 PM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1200,
    status: 'Completed',
  },
  {
    id: 3,
    refId: 'WD-2026-0610',
    mepsRef: 'MEPS-7740192841',
    date: '15 Sep 2026',
    time: '11:00 AM',
    bank: 'CIMB Bank',
    accountMasked: '7012 4491 3320',
    amount: 900,
    status: 'Completed',
  },
  {
    id: 4,
    refId: 'WD-2026-0524',
    mepsRef: 'MEPS-6619284011',
    date: '31 Aug 2026',
    time: '02:45 PM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 1500,
    status: 'Completed',
  },
  {
    id: 5,
    refId: 'WD-2026-0418',
    mepsRef: 'MEPS-5501928312',
    date: '14 Aug 2026',
    time: '09:15 AM',
    bank: 'Public Bank',
    accountMasked: '3198 0041 1120',
    amount: 600,
    status: 'Completed',
  },
  {
    id: 6,
    refId: 'WD-2026-0302',
    mepsRef: 'MEPS-4410293819',
    date: '28 Jul 2026',
    time: '03:30 PM',
    bank: 'Maybank',
    accountMasked: '5140 2819 8921',
    amount: 600,
    status: 'Completed',
  },
]);

const activeHistoryRecords = computed(() => {
  return partnerStore.activeTrack === 'sales'
    ? salesRemittanceRecords.value
    : referralHistoryRecords.value;
});

// Submit Withdrawal Handler (Referral Track)
function submitWithdrawal() {
  if (!isValidAmount.value) return;

  isSubmitting.value = true;
  const amt = withdrawAmount.value;
  const bank = currentSelectedBank.value;

  setTimeout(() => {
    isSubmitting.value = false;
    availableBalance.value -= amt;

    const newRecord: WithdrawalRecord = {
      id: Date.now(),
      refId: `WD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      mepsRef: `MEPS-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      date: 'Today',
      time: 'Just now',
      bank: bank.bankName,
      accountMasked: bank.accountMasked,
      amount: amt,
      status: 'Processing',
    };

    referralHistoryRecords.value.unshift(newRecord);
    withdrawAmount.value = Math.min(100, availableBalance.value);
    showToast(`Disbursement of RM ${amt.toLocaleString()} to ${bank.bankName} initiated!`);
  }, 600);
}

// Filtering & Pagination for History Stream
const searchQuery = ref('');
const activeStatusFilter = ref('all');
const currentPage = ref(1);
const pageSize = 8;

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Processing', label: 'In Clearance' },
];

const filteredHistory = computed(() => {
  let list = activeHistoryRecords.value;

  if (activeStatusFilter.value !== 'all') {
    list = list.filter(r => r.status === activeStatusFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(r =>
      r.refId.toLowerCase().includes(q) ||
      r.bank.toLowerCase().includes(q) ||
      r.accountMasked.includes(q)
    );
  }

  return list;
});

const totalPages = computed(() => Math.ceil(filteredHistory.value.length / pageSize));

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredHistory.value.slice(start, start + pageSize);
});

// Modal Voucher Detail
const selectedReceipt = ref<WithdrawalRecord | null>(null);

function openReceiptModal(record: WithdrawalRecord) {
  selectedReceipt.value = record;
}

function downloadReceiptSlip() {
  const docType = partnerStore.activeTrack === 'sales' ? 'Tax Remittance Statement' : 'Official Payout Receipt';
  showToast(`Generating official ${docType} PDF...`);
}
</script>
