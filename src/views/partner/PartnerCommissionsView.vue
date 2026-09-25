<template>
  <div class="h-full flex flex-col bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
    <!-- Top Bar Navigation & Actions -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-3">
        <!-- Back Button: Only shown when entering from Overview -->
        <router-link
          v-if="isFromOverview"
          to="/partner/overview"
          class="p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
          title="Back to Overview"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="hidden sm:inline">Overview</span>
        </router-link>

        <div v-if="isFromOverview" class="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>

        <div>
          <h1 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Commissions
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Track commission accruals, payout clearance schedules, and bank transfers
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showWithdrawModal = true"
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Banknote class="w-3.5 h-3.5" />
          <span>Withdraw Balance</span>
        </button>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 overflow-y-auto w-full [scrollbar-gutter:stable]">
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        <!-- 3-Column Financial Metrics Summary Grid (Ordered by Immediate Actionability) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Metric 1: Available Balance (Most Relevant / Immediate Action) -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Available Balance</span>
              <div class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Wallet class="w-4 h-4" />
              </div>
            </div>
            <p class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-2">RM 1,200</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Ready for immediate withdrawal</p>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
            <button
              @click="showWithdrawModal = true"
              class="inline-flex items-center gap-1 font-bold text-[#23B750] hover:text-[#1fa848] dark:text-[#23B750] hover:underline cursor-pointer group/link"
            >
              <span>Withdraw now</span>
              <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
            </button>
            <span class="text-gray-400 dark:text-gray-500 text-[10.5px]">Direct bank transfer</span>
          </div>
        </div>

        <!-- Metric 2: In Clearance (Pending Payout Pipeline) -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">In Clearance</span>
              <div class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
                <Clock class="w-4 h-4" />
              </div>
            </div>
            <p class="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-2">RM 1,500</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Clearing in standard 30-day cycle</p>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span>Pending settlement</span>
            <span class="font-mono font-bold text-amber-600 dark:text-amber-400">5 deals</span>
          </div>
        </div>

        <!-- Metric 3: Lifetime Earned (Cumulative Historical Commission) -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Lifetime Earned</span>
              <div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0">
                <Banknote class="w-4 h-4" />
              </div>
            </div>
            <p class="text-2xl font-extrabold font-mono text-gray-900 dark:text-white mt-2">RM 2,700</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">RM 1,200</span> cleared + <span class="font-mono font-bold text-amber-600 dark:text-amber-400">RM 1,500</span> clearing
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span>All-time converted deals</span>
            <span class="font-mono font-bold text-gray-900 dark:text-white">9 deals</span>
          </div>
        </div>
      </div>

      <!-- Commission Records Ledger Table Card with Quick Filter Tabs, Filter & Sort Menu -->
      <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-xs overflow-hidden">
        <!-- Table Toolbar -->
        <div class="border-b border-gray-200/80 dark:border-gray-800/80">
          <!-- Top Row: Title, Search, Filter Icon, Sort Dropdown -->
          <div class="px-4 sm:px-5 pt-4 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Commission Payout Records</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Itemized ledger of all deals, clearing schedules, and credit payouts</p>
            </div>

            <!-- Toolbar Controls -->
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <!-- Search Bar -->
              <div class="relative flex-1 sm:w-60">
                <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="searchQuery"
                  @input="currentPage = 1"
                  type="text"
                  placeholder="Search company or ref ID..."
                  class="w-full pl-8 pr-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#23B750]"
                />
              </div>

              <!-- Filter Icon Button with Active Indicator & Popover -->
              <div class="relative">
                <button
                  @click="isFilterMenuOpen = !isFilterMenuOpen; isSortMenuOpen = false"
                  :class="[
                    'p-2 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                    statusFilter !== 'all'
                      ? 'border-[#23B750] bg-emerald-50 dark:bg-emerald-950/40 text-[#1a943e] dark:text-emerald-400'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                  ]"
                  title="Filter by clearance status"
                >
                  <Filter class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Filter</span>
                  <span v-if="statusFilter !== 'all'" class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span>
                </button>

                <!-- Filter Dropdown Popover -->
                <div
                  v-if="isFilterMenuOpen"
                  class="absolute right-0 mt-1.5 w-48 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-30 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div class="px-3 py-1.5 font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 text-[11px]">
                    Filter by Status
                  </div>
                  <button
                    @click="statusFilter = 'all'; isFilterMenuOpen = false; currentPage = 1"
                    :class="[
                      'w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors',
                      statusFilter === 'all' ? 'text-[#23B750] font-bold' : 'text-gray-700 dark:text-gray-300'
                    ]"
                  >
                    <span>All Records</span>
                    <Check v-if="statusFilter === 'all'" class="w-3.5 h-3.5 text-[#23B750]" />
                  </button>
                  <button
                    @click="statusFilter = 'Cleared'; isFilterMenuOpen = false; currentPage = 1"
                    :class="[
                      'w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors',
                      statusFilter === 'Cleared' ? 'text-[#23B750] font-bold' : 'text-gray-700 dark:text-gray-300'
                    ]"
                  >
                    <span>Cleared</span>
                    <Check v-if="statusFilter === 'Cleared'" class="w-3.5 h-3.5 text-[#23B750]" />
                  </button>
                  <button
                    @click="statusFilter = 'In Clearance'; isFilterMenuOpen = false; currentPage = 1"
                    :class="[
                      'w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors',
                      statusFilter === 'In Clearance' ? 'text-[#23B750] font-bold' : 'text-gray-700 dark:text-gray-300'
                    ]"
                  >
                    <span>In Clearance</span>
                    <Check v-if="statusFilter === 'In Clearance'" class="w-3.5 h-3.5 text-[#23B750]" />
                  </button>
                </div>
              </div>

              <!-- Sort Dropdown Button with Active Indicator & Popover -->
              <div class="relative">
                <button
                  @click="isSortMenuOpen = !isSortMenuOpen; isFilterMenuOpen = false"
                  :class="[
                    'p-2 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                    isCustomSort
                      ? 'border-[#23B750] bg-emerald-50 dark:bg-emerald-950/40 text-[#1a943e] dark:text-emerald-400'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                  ]"
                  :title="isCustomSort ? `Sorted by: ${activeSortOption.label}` : 'Sort records'"
                >
                  <ArrowUpDown class="w-3.5 h-3.5" />
                  <span v-if="isCustomSort" class="hidden sm:inline font-semibold text-[11px] truncate max-w-[110px]">
                    {{ activeSortOption.label }}
                  </span>
                  <span v-else class="hidden sm:inline">Sort</span>
                  <ChevronDown class="w-3 h-3 text-gray-400" />
                </button>

                <!-- Sort Options Popover Menu -->
                <div
                  v-if="isSortMenuOpen"
                  class="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1.5 z-30 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div class="px-3 py-1 font-semibold text-gray-400 dark:text-gray-500 uppercase text-[10px] tracking-wider">
                    Sort Commission Records
                  </div>
                  <button
                    v-for="option in sortOptions"
                    :key="option.id"
                    @click="applySortOption(option); isSortMenuOpen = false"
                    :class="[
                      'w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors',
                      currentSortOptionId === option.id ? 'text-[#23B750] font-bold' : 'text-gray-700 dark:text-gray-300'
                    ]"
                  >
                    <span class="flex items-center gap-1.5">
                      <ArrowUp v-if="option.order === 'asc'" class="w-3 h-3 text-gray-400" />
                      <ArrowDown v-else class="w-3 h-3 text-gray-400" />
                      {{ option.label }}
                    </span>
                    <Check v-if="currentSortOptionId === option.id" class="w-3.5 h-3.5 text-[#23B750]" />
                  </button>

                  <div v-if="isCustomSort" class="pt-1 mt-1 border-t border-gray-100 dark:border-gray-800 px-2 pb-0.5">
                    <button
                      @click="applySortOption(sortOptions[0]); isSortMenuOpen = false"
                      class="w-full text-center py-1 text-[11px] font-semibold text-[#23B750] hover:underline cursor-pointer"
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
            <div class="inline-flex items-center p-1 bg-gray-100/90 dark:bg-gray-800/80 rounded-xl border border-gray-200/70 dark:border-gray-700/60 gap-0.5">
              <button
                v-for="tab in statusFilters"
                :key="tab.id"
                @click="statusFilter = tab.id; currentPage = 1"
                :class="[
                  'px-3.5 py-1.5 text-xs transition-all duration-150 rounded-lg inline-flex items-center gap-2 cursor-pointer shrink-0 select-none',
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white font-bold shadow-xs border border-gray-200/80 dark:border-gray-700/80'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium border border-transparent hover:bg-white/40 dark:hover:bg-gray-700/40'
                ]"
              >
                <span>{{ tab.label }}</span>
                <span
                  :class="[
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono transition-colors',
                    statusFilter === tab.id
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold'
                      : 'text-gray-400 dark:text-gray-500 font-medium'
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
              <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80">
                <th
                  @click="handleSort('refId')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-gray-900 dark:hover:text-white group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Transaction ID
                    <ArrowUpDown class="w-3 h-3 text-gray-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('company')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-gray-900 dark:hover:text-white group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Client Company
                    <ArrowUpDown class="w-3 h-3 text-gray-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('clearingDate')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-gray-900 dark:hover:text-white group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Clearance Date
                    <ArrowUpDown class="w-3 h-3 text-gray-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('status')"
                  class="px-5 py-3 cursor-pointer select-none hover:text-gray-900 dark:hover:text-white group"
                >
                  <span class="inline-flex items-center gap-1.5">
                    Status
                    <ArrowUpDown class="w-3 h-3 text-gray-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
                <th
                  @click="handleSort('payout')"
                  class="px-5 py-3 text-right cursor-pointer select-none hover:text-gray-900 dark:hover:text-white group"
                >
                  <span class="inline-flex items-center justify-end gap-1.5">
                    Commission Credit
                    <ArrowUpDown class="w-3 h-3 text-gray-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800/80">
              <tr v-if="paginatedCommissions.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-400">
                  <p class="font-semibold text-gray-600 dark:text-gray-300">No commission records found.</p>
                  <p class="text-xs mt-0.5">Try adjusting your filters or search terms.</p>
                  <button
                    @click="resetFilters"
                    class="mt-3 px-3 py-1.5 text-xs font-semibold text-[#23B750] bg-emerald-50 dark:bg-emerald-950/40 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </td>
              </tr>
              <tr
                v-for="comm in paginatedCommissions"
                :key="comm.id"
                class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td class="px-5 py-3 font-mono text-gray-500 dark:text-gray-400 text-xs">
                  {{ comm.refId }}
                </td>
                <td class="px-5 py-3 font-bold text-gray-900 dark:text-white">
                  {{ comm.company }}
                </td>
                <td class="px-5 py-3 font-mono text-gray-500 dark:text-gray-400 text-xs">
                  {{ comm.clearingDate }}
                </td>
                <td class="px-5 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
                      comm.status === 'Cleared'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60'
                        : 'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60'
                    ]"
                  >
                    {{ comm.status }}
                  </span>
                </td>
                <td class="px-5 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  +RM {{ comm.payout }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer: Results summary, page size selector & pagination -->
        <div class="px-4 sm:px-5 py-3 bg-gray-50/60 dark:bg-gray-800/30 border-t border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-3">
            <span>
              Showing <strong class="text-gray-700 dark:text-gray-200 font-mono">{{ paginationStart }}</strong> to
              <strong class="text-gray-700 dark:text-gray-200 font-mono">{{ paginationEnd }}</strong> of
              <strong class="text-gray-700 dark:text-gray-200 font-mono">{{ sortedCommissions.length }}</strong> commission records
            </span>

            <!-- Page Size Selector -->
            <div class="flex items-center gap-1.5 ml-2 border-l border-gray-200 dark:border-gray-700 pl-3">
              <span class="text-gray-400 text-[11px]">Show:</span>
              <select
                v-model="pageSize"
                @change="currentPage = 1"
                class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#23B750] cursor-pointer"
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
              class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
            </button>

            <span class="px-2 py-1 text-xs font-mono font-medium text-gray-700 dark:text-gray-300">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </main>

    <!-- Withdraw Earnings Modal -->
    <div
      v-if="showWithdrawModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showWithdrawModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <Banknote class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Withdraw Earnings</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Transfer to your Malaysian bank account</p>
            </div>
          </div>
          <button @click="showWithdrawModal = false" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 cursor-pointer" aria-label="Close modal">✕</button>
        </div>

        <div class="space-y-3.5 text-xs">
          <div class="bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400 font-medium">Available Balance</span>
            <span class="font-mono font-extrabold text-base text-emerald-700 dark:text-emerald-400">RM 1,200</span>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Bank Account</label>
            <select
              v-model="withdrawBank"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:border-[#23B750]"
            >
              <option value="Maybank">Maybank (5140 **** 8921)</option>
              <option value="CIMB Bank">CIMB Bank (7012 **** 4432)</option>
              <option value="Public Bank">Public Bank (3198 **** 1120)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Withdraw Amount (RM)</label>
            <input
              type="number"
              v-model="withdrawAmount"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-xs font-mono focus:outline-none focus:border-[#23B750]"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            @click="showWithdrawModal = false"
            class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="handleConfirmWithdrawal"
            class="px-5 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white text-xs font-bold rounded-xl shadow-md shadow-[#23B750]/20 cursor-pointer"
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
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
} from 'lucide-vue-next';

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
const isFilterMenuOpen = ref(false);
const isSortMenuOpen = ref(false);
const currentSortOptionId = ref('date-desc');
const sortField = ref<'refId' | 'company' | 'clearingDate' | 'status' | 'payout'>('clearingDate');
const sortOrder = ref<'asc' | 'desc'>('desc');
const pageSize = ref(10);
const currentPage = ref(1);
const showWithdrawModal = ref(false);
const withdrawBank = ref('Maybank');
const withdrawAmount = ref(1200);

function handleConfirmWithdrawal() {
  showWithdrawModal.value = false;
  alert(`Withdrawal request of RM ${withdrawAmount.value} to ${withdrawBank.value} submitted.`);
}

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
