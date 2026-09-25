<template>
  <div class="h-full flex flex-col bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
    <!-- Top Bar Navigation & Actions -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-3">
        <!-- Back to Overview Button (only shown if accessed from Overview page) -->
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
            My Referral
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Track all partner referrals, lead stages, and commission payouts
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          to="/partner/overview"
          class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
        >
          Dashboard Overview
        </router-link>
        <button
          @click="showShareModal = true"
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Share2 class="w-3.5 h-3.5" />
          <span>Share Link</span>
        </button>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 overflow-y-auto w-full [scrollbar-gutter:stable]">
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        <!-- 5-Column Metrics Summary Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <!-- Metric 1: Total Referrals -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Referrals</span>
              <Users class="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
            </div>
            <p class="text-xl font-extrabold font-mono text-gray-900 dark:text-white mt-1">16</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">All registered leads</p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span>In pipeline</span>
            <span class="font-mono font-bold text-gray-900 dark:text-white">7 active</span>
          </div>
        </div>

        <!-- Metric 2: Converted Deals -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Converted Deals</span>
              <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <p class="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">9</p>
            <p class="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">75% conversion rate</p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span>Closed rate</span>
            <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">9 of 12 closed</span>
          </div>
        </div>

        <!-- Metric 3: In Clearance -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">In Clearance</span>
              <Clock class="w-4 h-4 text-amber-500 shrink-0" />
            </div>
            <p class="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">RM 1,500</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Clearing in 30 days</p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span>Pending payout</span>
            <span class="font-mono font-bold text-amber-600 dark:text-amber-400">3 deals</span>
          </div>
        </div>

        <!-- Metric 4: Earned Payout -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Earned Payout</span>
              <Wallet class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <p class="text-xl font-extrabold font-mono text-gray-900 dark:text-white mt-1">RM 2,700</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">RM 1,200</span> Withdrawable
            </p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
            <router-link
              to="/partner/withdrawal"
              class="inline-flex items-center gap-1 font-semibold text-[#23B750] hover:text-[#1fa848] dark:text-[#23B750] hover:underline cursor-pointer group/link"
            >
              <span>Withdraw now</span>
              <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
            </router-link>
          </div>
        </div>

        <!-- Metric 5: Current Tier & Next Milestone (Clean Minimal Design with Tier Modal Trigger) -->
        <div
          @click="showTierModal = true"
          class="col-span-2 sm:col-span-1 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 hover:border-[#23B750]/60 hover:shadow-xs rounded-2xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all group"
          title="Click to view tier details"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Current Tier</span>
              <Award class="w-4 h-4 text-[#23B750] shrink-0" />
            </div>

            <p class="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
              Starter
            </p>
          </div>

          <!-- Progress Track with '3 Deals to Silver' uniform font size aligned just above -->
          <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-semibold text-gray-700 dark:text-gray-300">3 Deals to Silver</span>
              <span class="text-[10px] font-mono text-gray-400 dark:text-gray-500">40%</span>
            </div>
            <div class="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div class="h-full bg-[#23B750] rounded-full transition-all duration-500" style="width: 40%"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono text-gray-400 dark:text-gray-500">
              <span>Starter (2/5)</span>
              <span>Silver (5 deals)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Referral List Table Card with Quick Filter Tabs, Filter & Rich Sort Menu -->
      <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-xs overflow-hidden">
        <!-- Table Toolbar -->
        <div class="border-b border-gray-200/80 dark:border-gray-800/80">
          <!-- Top Row: Title, Search, Filter Icon, Sort Dropdown -->
          <div class="px-4 sm:px-5 pt-4 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Referral Directory</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Search, filter, and track all partner signups</p>
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
                  placeholder="Search business or contact..."
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
                  title="Filter by status"
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
                    v-for="filter in statusFilters"
                    :key="filter.id"
                    @click="statusFilter = filter.id; currentPage = 1; isFilterMenuOpen = false"
                    :class="[
                      'w-full text-left px-3 py-1.5 flex items-center justify-between cursor-pointer transition-colors',
                      statusFilter === filter.id
                        ? 'text-[#1a943e] dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                  >
                    <span>{{ filter.label }}</span>
                    <span
                      class="text-[10px] font-mono"
                      :class="statusFilter === filter.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'"
                    >
                      ({{ filter.count }})
                    </span>
                  </button>
                </div>
              </div>

              <!-- Sort Dropdown Menu with Simple Default Icon -->
              <div class="relative">
                <button
                  @click="isSortMenuOpen = !isSortMenuOpen; isFilterMenuOpen = false"
                  :class="[
                    'p-2 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0',
                    isCustomSort
                      ? 'border-[#23B750] bg-emerald-50 dark:bg-emerald-950/40 text-[#1a943e] dark:text-[#62D816] font-semibold sm:px-2.5'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                  ]"
                  :title="isCustomSort ? `Sorted by: ${activeSortOption.label}` : 'Sort referrals'"
                >
                  <ArrowUpDown class="w-3.5 h-3.5" :class="isCustomSort ? 'text-[#23B750]' : 'text-gray-500 dark:text-gray-400'" />
                  <!-- Simple default text when standard -->
                  <span v-if="!isCustomSort" class="hidden sm:inline">Sort</span>
                  <!-- Only show what it is sorted by if custom sort is applied -->
                  <template v-else>
                    <span class="hidden sm:inline font-medium max-w-[130px] truncate text-gray-900 dark:text-white">
                      {{ activeSortOption.label }}
                    </span>
                    <span class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span>
                    <ChevronDown class="w-3 h-3 text-gray-400" />
                  </template>
                </button>

                <!-- Sort Popover Menu -->
                <div
                  v-if="isSortMenuOpen"
                  class="absolute right-0 mt-1.5 w-60 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-30 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div class="px-3 py-1.5 font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 text-[11px] flex items-center justify-between">
                    <span>Sort Referrals By</span>
                    <span class="text-[10px] text-gray-400">7 options</span>
                  </div>
                  <button
                    v-for="opt in sortOptions"
                    :key="opt.id"
                    @click="applySortOption(opt); isSortMenuOpen = false"
                    :class="[
                      'w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer transition-colors',
                      currentSortOptionId === opt.id
                        ? 'text-[#1a943e] dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                  >
                    <span>{{ opt.label }}</span>
                    <Check v-if="currentSortOptionId === opt.id" class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
                  </button>

                  <!-- Reset to Default Sort option if custom sorted -->
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

          <!-- Bottom Row: Segmented Tab Bar Design (matching user reference) -->
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

        <!-- Table View with Sortable Column Headers -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80 select-none">
                <!-- Sortable Business Column -->
                <th
                  @click="handleSort('company')"
                  scope="col"
                  class="px-5 py-3 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div class="inline-flex items-center gap-1.5">
                    <span>Business / Contact</span>
                    <ArrowUp v-if="sortField === 'company' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowDown v-else-if="sortField === 'company' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowUpDown v-else class="w-3 h-3 text-gray-400 opacity-60" />
                  </div>
                </th>

                <!-- Sortable Stage Column -->
                <th
                  @click="handleSort('status')"
                  scope="col"
                  class="px-5 py-3 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div class="inline-flex items-center gap-1.5">
                    <span>Stage</span>
                    <ArrowUp v-if="sortField === 'status' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowDown v-else-if="sortField === 'status' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowUpDown v-else class="w-3 h-3 text-gray-400 opacity-60" />
                  </div>
                </th>

                <!-- Sortable Date Column -->
                <th
                  @click="handleSort('signupDate')"
                  scope="col"
                  class="px-5 py-3 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div class="inline-flex items-center gap-1.5">
                    <span>Signup Date</span>
                    <ArrowUp v-if="sortField === 'signupDate' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowDown v-else-if="sortField === 'signupDate' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowUpDown v-else class="w-3 h-3 text-gray-400 opacity-60" />
                  </div>
                </th>

                <!-- Sortable Payout Column -->
                <th
                  @click="handleSort('payout')"
                  scope="col"
                  class="px-5 py-3 text-right cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div class="inline-flex items-center justify-end gap-1.5 w-full">
                    <span>Commission</span>
                    <ArrowUp v-if="sortField === 'payout' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowDown v-else-if="sortField === 'payout' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-[#23B750]" />
                    <ArrowUpDown v-else class="w-3 h-3 text-gray-400 opacity-60" />
                  </div>
                </th>

                <th scope="col" class="px-4 py-3 text-right w-16">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
              <tr
                v-for="referral in paginatedReferrals"
                :key="referral.id"
                class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 text-xs shrink-0">
                      {{ referral.company.charAt(0) }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-gray-900 dark:text-white truncate">{{ referral.company }}</p>
                      <p class="text-[11px] text-gray-400 truncate">{{ referral.contact }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
                      referral.status === 'Converted'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                        : referral.status === 'Awaiting Payment'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                    ]"
                  >
                    {{ referral.status }}
                  </span>
                </td>
                <td class="px-5 py-3 font-mono text-gray-500 dark:text-gray-400">
                  {{ referral.signupDate }}
                </td>
                <td class="px-5 py-3 text-right font-mono font-bold text-gray-900 dark:text-white">
                  RM {{ referral.payout }}
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="handleCopy(referral.company)"
                    class="px-2 py-1 text-[11px] text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                </td>
              </tr>

              <!-- Empty State when filtering or searching has no matches -->
              <tr v-if="paginatedReferrals.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-500 dark:text-gray-400">
                  <p class="font-medium text-xs">No referrals match the selected filter or search query.</p>
                  <button
                    @click="resetFilters"
                    class="mt-2 text-xs font-semibold text-[#23B750] hover:underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Pagination & Results-Per-Page Footer -->
        <div class="px-5 py-3.5 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <!-- Left: Showing range and per-page select -->
          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span>
              Showing
              <strong class="font-semibold text-gray-900 dark:text-white">{{ paginationStart }}</strong>
              to
              <strong class="font-semibold text-gray-900 dark:text-white">{{ paginationEnd }}</strong>
              of
              <strong class="font-semibold text-gray-900 dark:text-white">{{ sortedReferrals.length }}</strong>
              referrals
            </span>

            <!-- Results Per Page Selector -->
            <div class="flex items-center gap-1.5 ml-0 sm:ml-3">
              <label for="pageSizeSelect" class="text-xs text-gray-500 dark:text-gray-400 font-medium">Show:</label>
              <select
                id="pageSizeSelect"
                v-model.number="pageSize"
                @change="currentPage = 1"
                class="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#23B750] cursor-pointer"
              >
                <option :value="5">5 / page</option>
                <option :value="10">10 / page</option>
                <option :value="20">20 / page</option>
                <option :value="50">50 / page</option>
                <option :value="100">All ({{ sortedReferrals.length }})</option>
              </select>
            </div>
          </div>

          <!-- Right: Page Navigation Controls -->
          <div class="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button
              @click="currentPage > 1 && (currentPage--)"
              :disabled="currentPage === 1"
              class="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer font-medium text-xs"
              title="Previous page"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Prev</span>
            </button>

            <!-- Page Number Pills -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer',
                  currentPage === page
                    ? 'bg-[#23B750] text-white font-bold shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="currentPage < totalPages && (currentPage++)"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer font-medium text-xs"
              title="Next page"
            >
              <span class="hidden sm:inline">Next</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </main>

    <!-- Share Link Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showShareModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Share Your Referral Link</h3>
          <button @click="showShareModal = false" class="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Partner Referral Link</label>
          <div class="flex gap-2">
            <input
              type="text"
              readonly
              value="https://crm.rakansales.com/ref/partner-089"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-800 dark:text-gray-200"
            />
            <button
              @click="handleCopyLink"
              class="px-4 py-2 bg-[#23B750] text-white text-xs font-bold rounded-xl hover:bg-[#1fa848] transition-colors shrink-0 cursor-pointer"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tier Information Modal (Impeccably Typeset & Detailed) -->
    <div
      v-if="showTierModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showTierModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#23B750] flex items-center justify-center shrink-0">
              <Award class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Partner Program Tiers & Progression</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Milestone thresholds, closed deals per tier, and commission rates</p>
            </div>
          </div>
          <button
            @click="showTierModal = false"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
          <!-- Active Status Snapshot Card -->
          <div class="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-2.5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#23B750] animate-pulse"></span>
                <span class="text-xs font-bold text-gray-900 dark:text-white">Current Track: Starter</span>
                <span class="text-[11px] text-gray-500 dark:text-gray-400 font-mono">(RM 300 / deal)</span>
              </div>
              <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                3 Deals to Silver (+RM 50 / deal)
              </div>
            </div>

            <!-- Milestone Progress Bar -->
            <div class="space-y-1">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-gray-600 dark:text-gray-300 font-medium">
                  Deals Closed in Starter: <strong class="font-mono text-gray-900 dark:text-white">2 of 5</strong>
                </span>
                <span class="font-mono font-bold text-[#23B750]">40% Complete</span>
              </div>
              <div class="w-full h-1.5 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                <div class="h-full bg-[#23B750] rounded-full transition-all duration-500" style="width: 40%"></div>
              </div>
            </div>
          </div>

          <!-- Tier Cards Grid -->
          <div class="space-y-3">
            <div
              v-for="tier in tierDetails"
              :key="tier.id"
              :class="[
                'p-4 rounded-xl border transition-all space-y-3',
                tier.current
                  ? 'border-[#23B750] bg-emerald-50/15 dark:bg-emerald-950/15 shadow-2xs ring-1 ring-[#23B750]/20'
                  : 'border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#0E131F]'
              ]"
            >
              <!-- Card Header Row -->
              <div class="flex items-start justify-between gap-2">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-gray-900 dark:text-white">{{ tier.name }}</span>
                    <span
                      v-if="tier.current"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#23B750] text-white"
                    >
                      Current Tier
                    </span>
                    <span
                      v-else-if="tier.id === 'silver'"
                      class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60"
                    >
                      Next Milestone
                    </span>
                    <span
                      v-else
                      class="px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
                    >
                      Locked
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ tier.description }}</p>
                </div>

                <!-- Rate Display -->
                <div class="text-right shrink-0">
                  <div class="font-mono font-extrabold text-sm sm:text-base text-[#23B750]">
                    {{ tier.payout }}
                    <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400">/ deal</span>
                  </div>
                  <div class="text-[10px] font-mono text-gray-400 dark:text-gray-500">
                    {{ tier.range }}
                  </div>
                </div>
              </div>

              <!-- Typeset Relevant Data Metrics Grid -->
              <div class="grid grid-cols-3 gap-2 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 text-[11px]">
                <div>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Closed in Tier</span>
                  <span class="font-mono font-bold text-gray-900 dark:text-white">{{ tier.closedInTier }} deals</span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Tier Earnings</span>
                  <span class="font-mono font-bold" :class="tier.current ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'">
                    {{ tier.earningsInTier }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Milestone Status</span>
                  <span class="font-mono font-semibold" :class="tier.current ? 'text-[#23B750]' : 'text-gray-600 dark:text-gray-300'">
                    {{ tier.remainingRequirement }}
                  </span>
                </div>
              </div>

              <!-- Key Tier Perks List -->
              <div class="space-y-1 pt-2 border-t border-gray-100/80 dark:border-gray-800/60">
                <div
                  v-for="(perk, pIdx) in tier.perks"
                  :key="pIdx"
                  class="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300"
                >
                  <Check class="w-3 h-3 text-[#23B750] shrink-0" />
                  <span>{{ perk }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-gray-50/70 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <span class="text-[11px] text-gray-500 dark:text-gray-400">
            Tiers evaluate in real time as referral deals convert.
          </span>
          <button
            @click="showTierModal = false"
            class="px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors cursor-pointer"
          >
            Close
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
  Share2,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowRight,
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
  field: 'company' | 'status' | 'signupDate' | 'payout';
  order: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
  { id: 'date-desc', label: 'Date: Newest First', field: 'signupDate', order: 'desc' },
  { id: 'date-asc', label: 'Date: Oldest First', field: 'signupDate', order: 'asc' },
  { id: 'company-asc', label: 'Business: A → Z', field: 'company', order: 'asc' },
  { id: 'company-desc', label: 'Business: Z → A', field: 'company', order: 'desc' },
  { id: 'payout-desc', label: 'Commission: High → Low', field: 'payout', order: 'desc' },
  { id: 'payout-asc', label: 'Commission: Low → High', field: 'payout', order: 'asc' },
  { id: 'status-asc', label: 'Stage: Status A → Z', field: 'status', order: 'asc' },
];

const searchQuery = ref('');
const statusFilter = ref<'all' | 'Converted' | 'Trial Active' | 'Awaiting Payment'>('all');
const isFilterMenuOpen = ref(false);
const isSortMenuOpen = ref(false);
const currentSortOptionId = ref('date-desc');
const sortField = ref<'company' | 'status' | 'signupDate' | 'payout'>('signupDate');
const sortOrder = ref<'asc' | 'desc'>('desc');
const pageSize = ref(10);
const currentPage = ref(1);
const showShareModal = ref(false);
const showTierModal = ref(false);
const copied = ref(false);

interface TierItem {
  id: string;
  name: string;
  range: string;
  payout: string;
  rateValue: number;
  bonus: string;
  current: boolean;
  closedInTier: number;
  tierTarget: string;
  earningsInTier: string;
  progressSummary: string;
  remainingRequirement: string;
  description: string;
  perks: string[];
}

const tierDetails: TierItem[] = [
  {
    id: 'starter',
    name: 'Starter',
    range: '1–4 deals',
    payout: 'RM 300',
    rateValue: 300,
    bonus: 'Base Rate',
    current: true,
    closedInTier: 2,
    tierTarget: '4 deals',
    earningsInTier: 'RM 600',
    progressSummary: '2 of 4 deals closed',
    remainingRequirement: '3 deals left to Silver',
    description: 'Active entry tier for all registered partners with instant referral tracking.',
    perks: ['Standard RM 300 commission per paid deal', '30-day payout clearance cycle', 'Real-time referral directory access'],
  },
  {
    id: 'silver',
    name: 'Silver',
    range: '5–19 deals',
    payout: 'RM 350',
    rateValue: 350,
    bonus: '+RM 50 / deal',
    current: false,
    closedInTier: 0,
    tierTarget: '15 deals',
    earningsInTier: 'RM 0',
    progressSummary: '0 of 15 closed',
    remainingRequirement: '3 deals needed to unlock',
    description: 'Elevated commission rate automatically activates upon 5 confirmed subscriptions.',
    perks: ['+RM 50 bonus bump on every deal', 'Accelerated 14-day clearance cycle', 'Dedicated Partner Success Manager'],
  },
  {
    id: 'gold',
    name: 'Gold',
    range: '20–49 deals',
    payout: 'RM 400',
    rateValue: 400,
    bonus: '+RM 100 / deal',
    current: false,
    closedInTier: 0,
    tierTarget: '30 deals',
    earningsInTier: 'RM 0',
    progressSummary: '0 of 30 closed',
    remainingRequirement: '18 deals needed to unlock',
    description: 'High-volume tier designed for marketing agencies, consultants, and active resellers.',
    perks: ['+RM 100 bonus bump per deal (RM 400 total)', 'Quarterly performance bonus pool', 'VIP client onboarding assistance'],
  },
  {
    id: 'elite',
    name: 'Elite',
    range: '50+ deals',
    payout: 'RM 500',
    rateValue: 500,
    bonus: '+RM 200 / deal',
    current: false,
    closedInTier: 0,
    tierTarget: '50+ deals',
    earningsInTier: 'RM 0',
    progressSummary: '0 closed',
    remainingRequirement: '48 deals needed to unlock',
    description: 'Premier alliance track with executive sponsorship, co-marketing, and top payouts.',
    perks: ['Maximum RM 500 payout per paid deal', 'Direct co-marketing budget allocation', 'Quarterly executive partner review'],
  },
];

const referrals = [
  { id: 1, company: 'Syarikat Maju Jaya', contact: 'Ahmad bin Razak', status: 'Converted', signupDate: '14 Sep 2026', payout: 300 },
  { id: 2, company: 'Borneo Digital Enterprise', contact: 'Grace Ling', status: 'Trial Active', signupDate: '09 Sep 2026', payout: 300 },
  { id: 3, company: 'Seri Mutiara Sdn Bhd', contact: 'Dato Francis Wong', status: 'Awaiting Payment', signupDate: '05 Sep 2026', payout: 300 },
  { id: 4, company: 'Mega Jaya Wholesale', contact: 'Tan Sri Dato Lee', status: 'Converted', signupDate: '01 Sep 2026', payout: 300 },
  { id: 5, company: 'Vortex Global Tech', contact: 'Harith Iskandar', status: 'Trial Active', signupDate: '28 Aug 2026', payout: 300 },
  { id: 6, company: 'Nusantara Logistics', contact: 'Zul Ariffin', status: 'Converted', signupDate: '21 Aug 2026', payout: 300 },
  { id: 7, company: 'Apex Retail Solutions', contact: 'Chloe Tan', status: 'Converted', signupDate: '18 Aug 2026', payout: 300 },
  { id: 8, company: 'Bayu Marine Engineering', contact: 'Captain Razif', status: 'Awaiting Payment', signupDate: '15 Aug 2026', payout: 300 },
  { id: 9, company: 'Kencana Holdings', contact: 'Datin Sheila', status: 'Converted', signupDate: '10 Aug 2026', payout: 300 },
  { id: 10, company: 'Sentosa F&B Group', contact: 'Marcus Chong', status: 'Converted', signupDate: '04 Aug 2026', payout: 300 },
  { id: 11, company: 'Melaka Tech Ventures', contact: 'Nurul Izzah', status: 'Trial Active', signupDate: '29 Jul 2026', payout: 300 },
  { id: 12, company: 'Pelangi Media Lab', contact: 'Jason Lim', status: 'Converted', signupDate: '22 Jul 2026', payout: 300 },
  { id: 13, company: 'Borneo Timberline', contact: 'Alan Tsen', status: 'Converted', signupDate: '16 Jul 2026', payout: 300 },
  { id: 14, company: 'Pantai Express Courier', contact: 'Siti Aishah', status: 'Awaiting Payment', signupDate: '11 Jul 2026', payout: 300 },
  { id: 15, company: 'Smart Auto Dealership', contact: 'Kevin Ooi', status: 'Trial Active', signupDate: '05 Jul 2026', payout: 300 },
  { id: 16, company: 'Wawasan Capital Partners', contact: 'Farhan Malik', status: 'Converted', signupDate: '28 Jun 2026', payout: 300 },
];

const statusFilters = computed(() => [
  { id: 'all' as const, label: 'All', count: referrals.length },
  { id: 'Converted' as const, label: 'Converted', count: referrals.filter(r => r.status === 'Converted').length },
  { id: 'Trial Active' as const, label: 'Trial Active', count: referrals.filter(r => r.status === 'Trial Active').length },
  { id: 'Awaiting Payment' as const, label: 'Awaiting Payment', count: referrals.filter(r => r.status === 'Awaiting Payment').length },
]);

const activeSortOption = computed(() => {
  return sortOptions.find(o => o.id === currentSortOptionId.value) || sortOptions[0];
});

const filteredReferrals = computed(() => {
  return referrals.filter(r => {
    const matchesStatus = statusFilter.value === 'all' || r.status === statusFilter.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch = !q || r.company.toLowerCase().includes(q) || r.contact.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });
});

const sortedReferrals = computed(() => {
  return [...filteredReferrals.value].sort((a, b) => {
    let cmp = 0;
    if (sortField.value === 'company') {
      cmp = a.company.localeCompare(b.company);
    } else if (sortField.value === 'status') {
      cmp = a.status.localeCompare(b.status);
    } else if (sortField.value === 'payout') {
      cmp = a.payout - b.payout;
    } else if (sortField.value === 'signupDate') {
      cmp = new Date(a.signupDate).getTime() - new Date(b.signupDate).getTime();
    }
    return sortOrder.value === 'asc' ? cmp : -cmp;
  });
});

const totalPages = computed(() => {
  if (pageSize.value >= sortedReferrals.value.length) return 1;
  return Math.ceil(sortedReferrals.value.length / pageSize.value) || 1;
});

const paginatedReferrals = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedReferrals.value.slice(start, start + pageSize.value);
});

const paginationStart = computed(() => {
  if (sortedReferrals.value.length === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, sortedReferrals.value.length);
});

const isCustomSort = computed(() => {
  return currentSortOptionId.value !== 'date-desc';
});

function applySortOption(option: SortOption) {
  currentSortOptionId.value = option.id;
  sortField.value = option.field;
  sortOrder.value = option.order;
  currentPage.value = 1;
}

function handleSort(field: 'company' | 'status' | 'signupDate' | 'payout') {
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

function handleCopy(name: string) {
  navigator.clipboard.writeText(`Referral: ${name}`);
}

function handleCopyLink() {
  navigator.clipboard.writeText('https://crm.rakansales.com/ref/partner-089');
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>
