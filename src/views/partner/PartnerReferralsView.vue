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
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {{ partnerStore.activeTrack === 'sales' ? 'Client Deals & Pipeline' : 'My Referral' }}
            </h1>
            <span
              v-if="partnerStore.activeTrack === 'sales'"
              class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[#23B750] border border-emerald-500/20"
            >
              <Shield class="w-3 h-3" />
              120-Day Lock Active
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ partnerStore.activeTrack === 'sales'
              ? 'Register client deals, advance enterprise stages, and lock domain exclusivity.'
              : 'Track all partner referrals, lead stages, and commission payouts'
            }}
          </p>
        </div>
      </div>

      <!-- Header Action Controls -->
      <div class="flex items-center gap-2">
        <router-link
          to="/partner/overview"
          class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-200 dark:border-gray-700 hidden md:inline-flex"
        >
          Dashboard Overview
        </router-link>

        <!-- Referral Track Primary Action -->
        <button
          v-if="partnerStore.activeTrack === 'referral'"
          @click="showShareModal = true"
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Share2 class="w-3.5 h-3.5" />
          <span>Share Link</span>
        </button>

        <!-- Sales Track Actions: View Switcher & Register Deal CTA -->
        <template v-else>
          <div class="inline-flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
            <button
              @click="salesViewMode = 'kanban'"
              type="button"
              class="px-2.5 py-1 rounded-lg font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer"
              :class="salesViewMode === 'kanban' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
            >
              <LayoutGrid class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Kanban</span>
            </button>
            <button
              @click="salesViewMode = 'table'"
              type="button"
              class="px-2.5 py-1 rounded-lg font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer"
              :class="salesViewMode === 'table' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
            >
              <Table2 class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            @click="openRegisterDealModal"
            class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Register Deal</span>
          </button>
        </template>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 overflow-y-auto w-full [scrollbar-gutter:stable]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">

        <!-- ============================================================= -->
        <!-- 1. SALES TRACK PIPELINE VIEW                                   -->
        <!-- ============================================================= -->
        <template v-if="partnerStore.activeTrack === 'sales'">
          <!-- 5-Column Sales Metrics Summary Grid (Quiet, Unified Typography) -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <!-- Metric 1: Total Registered Deals -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Deals</span>
                  <Briefcase class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">{{ partnerStore.deals.length }}</p>
                <p class="text-[11px] text-gray-400">Registered accounts</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Total Book</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">RM {{ formatNumber(totalArrValue) }} ARR</span>
              </div>
            </div>

            <!-- Metric 2: Active Pipeline -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Active Pipeline</span>
                  <Flame class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">{{ partnerStore.activeDeals.length }}</p>
                <p class="text-[11px] text-gray-400">Deals in progress</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Pipeline Value</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">RM {{ formatNumber(partnerStore.totalPipelineARR) }}</span>
              </div>
            </div>

            <!-- Metric 3: Closed-Won Deals -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Closed Won</span>
                  <CheckCircle2 class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">{{ partnerStore.closedWonDeals.length }}</p>
                <p class="text-[11px] text-gray-400">Active subscriptions</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">RevShare Yield</span>
                <span class="font-mono font-semibold text-[#23B750]">20% Recurring</span>
              </div>
            </div>

            <!-- Metric 4: Exclusivity Protections -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">120-Day Locks</span>
                  <ShieldCheck class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">{{ partnerStore.protectedDealsCount }}</p>
                <p class="text-[11px] text-gray-400">Domain exclusivity</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Expiring &lt; 30d</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ expiringLocksCount }} deals</span>
              </div>
            </div>

            <!-- Metric 5: RevShare Tier Yield -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">RevShare Tier</span>
                  <Award class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">20%</p>
                <p class="text-[11px] text-gray-400">Certified Reseller</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Next Tier</span>
                <span class="font-medium text-[#23B750]">25% Premier</span>
              </div>
            </div>
          </div>

          <!-- Filter & Search Bar for Sales -->
          <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div class="flex flex-1 items-center gap-2 max-w-md">
              <div class="relative w-full">
                <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="salesSearchQuery"
                  type="text"
                  placeholder="Search deals by company, domain, or contact..."
                  class="w-full pl-8.5 pr-4 py-2 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#23B750] transition-colors"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Stage Filter -->
              <select
                v-model="salesStageFilter"
                class="px-3 py-2 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#23B750] transition-colors cursor-pointer"
              >
                <option value="all">All Stages ({{ partnerStore.deals.length }})</option>
                <option value="registered">Registered</option>
                <option value="discovery">Discovery &amp; Demo</option>
                <option value="proposal">Proposal Sent</option>
                <option value="in_clearance">In Clearance</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>

              <!-- Plan Filter -->
              <select
                v-model="salesPlanFilter"
                class="px-3 py-2 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#23B750] transition-colors cursor-pointer"
              >
                <option value="all">All Plans</option>
                <option value="Basic">Basic (RM 300/mo)</option>
                <option value="Pro">Pro (RM 600/mo)</option>
                <option value="Growth">Growth (RM 1,200/mo)</option>
                <option value="Enterprise">Enterprise (RM 2,400+/mo)</option>
              </select>
            </div>
          </div>

          <!-- VIEW MODE 1: KANBAN BOARD (Calm, Typeset, Reduced Colors) -->
          <div v-if="salesViewMode === 'kanban'" class="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
            <div
              v-for="col in kanbanColumns"
              :key="col.id"
              @dragover.prevent="onDragOverCol(col.id, $event)"
              @dragleave="onDragLeaveCol(col.id)"
              @drop="onDropOnCol(col.id)"
              class="bg-gray-50/80 dark:bg-gray-900/30 border rounded-xl p-2.5 flex flex-col gap-2.5 min-h-[480px] transition-all"
              :class="dragOverColId === col.id ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-[#23B750]/30' : 'border-gray-200/60 dark:border-gray-800/60'"
            >
              <!-- Column Header -->
              <div class="flex items-center justify-between pb-2 border-b border-gray-200/60 dark:border-gray-800/60">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="col.dotClass"></span>
                  <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{{ col.title }}</span>
                </div>
                <span class="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700/60 shrink-0">
                  {{ getDealsInStage(col.id).length }}
                </span>
              </div>

              <!-- Deal Cards in this Stage -->
              <div class="flex-1 space-y-2.5">
                <!-- Drop Target Preview when hovering over this column -->
                <div
                  v-if="dragOverColId === col.id && draggedDeal && draggedDeal.stage !== col.id"
                  class="border-2 border-dashed border-[#23B750] rounded-xl h-20 flex flex-col items-center justify-center text-center p-2 bg-emerald-50/40 dark:bg-emerald-950/20 animate-pulse"
                >
                  <p class="text-xs font-bold text-[#23B750]">Move to {{ col.title }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Release to drop</p>
                </div>

                <div
                  v-for="deal in getDealsInStage(col.id)"
                  :key="deal.id"
                  draggable="true"
                  @dragstart="onDragStart(deal, $event)"
                  @dragend="onDragEnd"
                  @click="openDealDetail(deal)"
                  class="bg-white dark:bg-[#0E131F] border rounded-xl p-3 shadow-2xs hover:shadow-md hover:border-[#23B750]/50 transition-all cursor-grab active:cursor-grabbing group flex flex-col justify-between h-[168px]"
                  :class="draggedDeal?.id === deal.id ? 'opacity-30 border-dashed border-[#23B750] scale-95' : 'border-gray-200/80 dark:border-gray-800/80'"
                >
                  <!-- Card Header: Title & Plan Badge -->
                  <div>
                    <div class="flex items-start justify-between gap-1.5">
                      <h4 class="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#23B750] transition-colors flex-1 min-w-0" :title="deal.companyName">
                        {{ deal.companyName }}
                      </h4>
                      <span
                        class="text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 leading-none"
                        :class="getPlanBadgeClass(deal.planTier)"
                      >
                        {{ deal.planTier }}
                      </span>
                    </div>

                    <!-- Deal ID & Single Domain on 1 clean line -->
                    <div class="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono mt-1 min-w-0">
                      <span class="shrink-0">{{ deal.id }}</span>
                      <span class="text-gray-300 dark:text-gray-600">·</span>
                      <span class="truncate">{{ deal.domain }}</span>
                    </div>
                  </div>

                  <!-- Financial Metrics: ARR Book & 20% RevShare -->
                  <div class="pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs">
                    <div>
                      <span class="text-[10px] text-gray-400 block leading-tight font-medium">ARR Book</span>
                      <span class="font-mono font-semibold text-gray-900 dark:text-white">RM {{ formatNumber(deal.arrValue) }}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-[10px] text-gray-400 block leading-tight font-medium">20% RevShare</span>
                      <span class="font-mono font-semibold text-[#23B750]">RM {{ formatNumber(deal.mrrValue * 0.2) }}/mo</span>
                    </div>
                  </div>

                  <!-- Card Footer: Contact & Exclusivity Lock & Drag Handle -->
                  <div class="pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-[10px]">
                    <div class="flex items-center gap-1.5 min-w-0 flex-1">
                      <span
                        v-if="deal.protectionDaysRemaining > 0"
                        class="inline-flex items-center gap-0.5 font-mono text-[10px] shrink-0"
                        :class="deal.protectionDaysRemaining <= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'"
                        :title="`${deal.protectionDaysRemaining} days domain lock remaining`"
                      >
                        <Lock class="w-3 h-3" :class="deal.protectionDaysRemaining <= 30 ? 'text-amber-500' : 'text-gray-400'" />
                        <span>{{ deal.protectionDaysRemaining }}d</span>
                      </span>
                      <span v-if="deal.protectionDaysRemaining > 0" class="text-gray-300 dark:text-gray-600">·</span>
                      <span class="text-gray-500 dark:text-gray-400 truncate text-[10px] font-medium" :title="deal.contactName">
                        {{ deal.contactName }}
                      </span>
                    </div>

                    <span v-if="col.id === 'closed_won'" class="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-0.5 text-[10px] shrink-0">
                      <Check class="w-3 h-3" />
                      <span>Won</span>
                    </span>
                    <span v-else class="text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors shrink-0" title="Drag to move deal to another stage or drop below">
                      <GripVertical class="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <!-- Empty Column State -->
                <div
                  v-if="getDealsInStage(col.id).length === 0"
                  class="h-28 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-center p-3"
                >
                  <p class="text-[11px] text-gray-400">No deals in this stage</p>
                </div>
              </div>
            </div>
          </div>

          <!-- VIEW MODE 2: INTERACTIVE DATA TABLE (Typeset, Clean Spacing) -->
          <div v-else class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl shadow-2xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[720px]">
                <thead>
                  <tr class="border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                    <th scope="col" class="py-2.5 px-4">Deal &amp; Company</th>
                    <th scope="col" class="py-2.5 px-4">Contact Lead</th>
                    <th scope="col" class="py-2.5 px-4">Plan &amp; Value</th>
                    <th scope="col" class="py-2.5 px-4">Current Stage</th>
                    <th scope="col" class="py-2.5 px-4">120-Day Protection</th>
                    <th scope="col" class="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
                  <tr
                    v-for="(deal, index) in filteredSalesDeals"
                    :key="deal.id"
                    @click="openDealDetail(deal)"
                    class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors cursor-pointer group"
                  >
                    <!-- Company & Domain -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold flex items-center justify-center text-xs shrink-0 border border-gray-200/60 dark:border-gray-700/60">
                          {{ deal.companyName.charAt(0) }}
                        </div>
                        <div class="min-w-0 max-w-[170px]">
                          <p class="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#23B750] transition-colors">
                            {{ deal.companyName }}
                          </p>
                          <div class="flex items-center gap-1 text-[10px] text-gray-400 font-mono truncate">
                            <span>{{ deal.id }}</span>
                            <span>·</span>
                            <span>{{ deal.domain }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Contact Lead -->
                    <td class="py-3 px-4">
                      <p class="font-medium text-gray-900 dark:text-gray-200">{{ deal.contactName }}</p>
                      <p class="text-[10.5px] text-gray-400">{{ deal.contactRole }}</p>
                    </td>

                    <!-- Plan & Value -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-1.5">
                        <span class="font-mono font-semibold text-gray-900 dark:text-white text-xs">
                          RM {{ formatNumber(deal.mrrValue) }}/mo
                        </span>
                        <span class="text-[10px] font-medium px-2 py-0.5 rounded-md" :class="getPlanBadgeClass(deal.planTier)">
                          {{ deal.planTier }}
                        </span>
                      </div>
                      <p class="text-[10.5px] text-[#23B750] font-mono mt-0.5 font-medium">
                        +RM {{ formatNumber(deal.mrrValue * 0.2) }}/mo RevShare
                      </p>
                    </td>

                    <!-- Stage (Interactive Quick Mover with Colored Pill Dropdown) -->
                    <td class="py-3 px-4 relative" @click.stop>
                      <div class="relative inline-block text-left">
                        <button
                          type="button"
                          @click="openStageMenuId = openStageMenuId === deal.id ? null : deal.id"
                          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer hover:opacity-90 shadow-2xs"
                          :class="getStagePillClass(deal.stage)"
                          :title="`Current stage: ${formatStageLabel(deal.stage)}. Click to update stage.`"
                          aria-haspopup="true"
                          :aria-expanded="openStageMenuId === deal.id"
                        >
                          <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="getStageDotClass(deal.stage)"></span>
                          <span>{{ formatStageLabel(deal.stage) }}</span>
                          <ChevronDown
                            class="w-3 h-3 opacity-60 transition-transform duration-150 shrink-0"
                            :class="{ 'rotate-180': openStageMenuId === deal.id }"
                          />
                        </button>

                        <!-- Stage Dropdown Menu with Colored Pills -->
                        <div
                          v-if="openStageMenuId === deal.id"
                          @click.stop
                          class="absolute left-0 w-52 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                          :class="getDropdownPositionClass(index, filteredSalesDeals.length)"
                          role="menu"
                        >
                          <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-1 mb-1">
                            <span>Change Stage</span>
                            <span class="text-[9px] text-gray-400 font-normal">Select stage</span>
                          </div>
                          <button
                            v-for="stg in allStages"
                            :key="stg.id"
                            type="button"
                            @click="onStageSelectChange(deal.id, stg.id); openStageMenuId = null"
                            class="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer group"
                            :class="{ 'bg-gray-50/80 dark:bg-gray-800/40': deal.stage === stg.id }"
                            role="menuitem"
                          >
                            <span
                              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-transform group-hover:scale-[1.02]"
                              :class="stg.pillClass"
                            >
                              <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="stg.dotClass"></span>
                              <span>{{ stg.title }}</span>
                            </span>
                            <Check v-if="deal.stage === stg.id" class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <!-- Protection Status -->
                    <td class="py-3 px-4">
                      <div v-if="deal.protectionDaysRemaining > 0" class="space-y-1 w-28">
                        <div class="flex items-center justify-between text-[10px]">
                          <span class="font-mono font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Lock class="w-3 h-3 text-gray-400" />
                            <span>{{ deal.protectionDaysRemaining }}d left</span>
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                          <div
                            class="h-full rounded-full transition-all duration-300"
                            :class="deal.protectionDaysRemaining <= 30 ? 'bg-amber-500' : 'bg-[#23B750]'"
                            :style="{ width: `${Math.min(100, (deal.protectionDaysRemaining / 120) * 100)}%` }"
                          ></div>
                        </div>
                      </div>
                      <span v-else class="text-[10px] text-gray-400 font-mono">Expired</span>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-right" @click.stop>
                      <div class="flex items-center justify-end gap-1">
                        <button
                          @click="openEditDealModal(deal)"
                          class="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          title="Edit Deal"
                        >
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button
                          @click="partnerStore.archiveDeal(deal.id)"
                          class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          title="Archive Deal"
                        >
                          <Archive class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- ============================================================= -->
        <!-- 2. REFERRAL TRACK VIEW (LEGACY AFFILIATE)                      -->
        <!-- ============================================================= -->
        <template v-else>
          <!-- 5-Column Metrics Summary Grid (Quiet, Unified Typography matching Sales Track) -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <!-- Metric 1: Total Referrals -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Referrals</span>
                  <Users class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">16</p>
                <p class="text-[11px] text-gray-400">All registered leads</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">In pipeline</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">7 active</span>
              </div>
            </div>

            <!-- Metric 2: Converted Deals -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Converted Deals</span>
                  <CheckCircle2 class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">9</p>
                <p class="text-[11px] text-gray-400">75% conversion rate</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Closed rate</span>
                <span class="font-mono font-semibold text-[#23B750]">9 of 12 closed</span>
              </div>
            </div>

            <!-- Metric 3: In Clearance -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">In Clearance</span>
                  <Clock class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">RM 1,500</p>
                <p class="text-[11px] text-gray-400">Clearing in 30 days</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Pending payout</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">5 deals</span>
              </div>
            </div>

            <!-- Metric 4: Total Withdrawn -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Withdrawn</span>
                  <Wallet class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">RM 1,800</p>
                <p class="text-[11px] text-gray-400">Disbursed to bank</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Disbursements</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">4 payouts</span>
              </div>
            </div>

            <!-- Metric 5: Fixed Bounty Rate -->
            <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Commission Rate</span>
                  <Award class="w-3.5 h-3.5 text-[#23B750] shrink-0" />
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white mt-1">RM 300</p>
                <p class="text-[11px] text-gray-400">Fixed per closed deal</p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span class="text-gray-400">Model</span>
                <span class="font-mono font-semibold text-[#23B750]">No Tier Lock</span>
              </div>
            </div>
          </div>

          <!-- Referral Table Filter & Search Bar -->
          <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div class="flex flex-1 items-center gap-2 max-w-md">
              <div class="relative w-full">
                <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search referrals by company name or contact..."
                  class="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0E131F] border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-for="filter in statusFilters"
                :key="filter.id"
                @click="statusFilter = filter.id"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                :class="statusFilter === filter.id ? 'bg-[#23B750] text-white' : 'bg-white dark:bg-[#0E131F] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
              >
                {{ filter.label }} ({{ filter.count }})
              </button>
            </div>
          </div>

          <!-- Referral Table -->
          <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400">
                    <th class="py-3 px-4 font-semibold">Business / Company</th>
                    <th class="py-3 px-4 font-semibold">Contact Person</th>
                    <th class="py-3 px-4 font-semibold">Signup Date</th>
                    <th class="py-3 px-4 font-semibold">Lead Status</th>
                    <th class="py-3 px-4 font-semibold text-right">Commission Bounty</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
                  <tr
                    v-for="referral in paginatedReferrals"
                    :key="referral.id"
                    class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td class="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      {{ referral.company }}
                    </td>
                    <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                      {{ referral.contact }}
                    </td>
                    <td class="py-3.5 px-4 text-gray-500 font-mono">
                      {{ referral.signupDate }}
                    </td>
                    <td class="py-3.5 px-4">
                      <span
                        class="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        :class="[
                          referral.status === 'Converted' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] border border-emerald-500/20' : '',
                          referral.status === 'Trial Active' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-500/20' : '',
                          referral.status === 'Awaiting Payment' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/20' : '',
                        ]"
                      >
                        {{ referral.status }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                      RM {{ referral.payout }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

      </div>
    </main>

    <!-- ============================================================= -->
    <!-- POP-UP MODAL: DEAL DETAILS TELEMETRY (SALES TRACK)             -->
    <!-- ============================================================= -->
    <div
      v-if="selectedDeal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="selectedDeal = null"
    >
      <div class="relative w-full max-w-lg bg-white dark:bg-[#0E131F] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10 animate-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="p-5 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between bg-gray-50/50 dark:bg-gray-900/30">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono font-medium text-gray-500 dark:text-gray-400">{{ selectedDeal.id }}</span>
              <span class="text-[10px] font-medium px-2 py-0.5 rounded-md" :class="getPlanBadgeClass(selectedDeal.planTier)">
                {{ selectedDeal.planTier }}
              </span>
              <span class="text-gray-300 dark:text-gray-700">·</span>

              <!-- Interactive Stage Switcher in Modal Header -->
              <div class="relative inline-block text-left" @click.stop>
                <button
                  type="button"
                  @click="modalStageMenuOpen = !modalStageMenuOpen"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer hover:opacity-90 shadow-2xs"
                  :class="getStagePillClass(selectedDeal.stage)"
                  :title="`Current stage: ${formatStageLabel(selectedDeal.stage)}. Click to update stage.`"
                >
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="getStageDotClass(selectedDeal.stage)"></span>
                  <span>{{ formatStageLabel(selectedDeal.stage) }}</span>
                  <ChevronDown
                    class="w-3 h-3 opacity-60 transition-transform duration-150 shrink-0"
                    :class="{ 'rotate-180': modalStageMenuOpen }"
                  />
                </button>

                <!-- Stage Dropdown Menu in Modal -->
                <div
                  v-if="modalStageMenuOpen"
                  class="absolute left-0 mt-1.5 w-48 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-1 mb-1">
                    <span>Move Deal Stage</span>
                  </div>
                  <button
                    v-for="stg in allStages"
                    :key="stg.id"
                    type="button"
                    @click="changeDealStage(selectedDeal.id, stg.id, selectedDeal.stage); modalStageMenuOpen = false"
                    class="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer group"
                    :class="{ 'bg-gray-50/80 dark:bg-gray-800/40': selectedDeal.stage === stg.id }"
                  >
                    <span
                      class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold border transition-transform group-hover:scale-[1.02]"
                      :class="stg.pillClass"
                    >
                      <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="stg.dotClass"></span>
                      <span>{{ stg.title }}</span>
                    </span>
                    <Check v-if="selectedDeal.stage === stg.id" class="w-3 h-3 text-[#23B750] shrink-0" />
                  </button>
                </div>
              </div>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mt-1.5">{{ selectedDeal.companyName }}</h3>
            <a :href="`https://${selectedDeal.domain}`" target="_blank" class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 mt-0.5">
              <span>{{ selectedDeal.domain }}</span>
              <ExternalLink class="w-3 h-3 text-gray-400" />
            </a>
          </div>
          <button
            @click="selectedDeal = null"
            class="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close deal modal"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Content (Scrollable) -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <!-- Visual Pipeline Funnel Stepper -->
          <div class="space-y-1.5 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-900/40 border border-gray-200/70 dark:border-gray-800">
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-semibold text-gray-700 dark:text-gray-300">Pipeline Stage</span>
              <span class="font-mono text-gray-400">Step {{ getStageStepNumber(selectedDeal.stage) }} of 5</span>
            </div>

            <div class="grid grid-cols-5 gap-1 pt-1">
              <button
                v-for="(stg, idx) in funnelStages"
                :key="stg.id"
                @click="changeDealStage(selectedDeal.id, stg.id, selectedDeal.stage)"
                type="button"
                class="group flex flex-col items-center py-1.5 px-0.5 rounded-lg transition-all cursor-pointer text-center relative"
                :class="[
                  selectedDeal.stage === stg.id
                    ? 'bg-white dark:bg-[#111827] shadow-2xs text-gray-900 dark:text-white font-bold ring-1 ring-gray-200 dark:ring-gray-700'
                    : isStagePassed(selectedDeal.stage, stg.id)
                    ? 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/40'
                    : 'text-gray-400 dark:text-gray-500 hover:bg-white/60 dark:hover:bg-gray-800/40'
                ]"
                :title="`Click to move deal to ${stg.title}`"
              >
                <!-- Indicator dot / check -->
                <div
                  class="flex items-center justify-center w-4 h-4 rounded-full mb-1 transition-transform group-hover:scale-110 shrink-0"
                  :class="[
                    selectedDeal.stage === stg.id
                      ? 'bg-[#23B750] text-white shadow-2xs'
                      : isStagePassed(selectedDeal.stage, stg.id)
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  ]"
                >
                  <Check v-if="isStagePassed(selectedDeal.stage, stg.id) && selectedDeal.stage !== stg.id" class="w-2.5 h-2.5 stroke-[3]" />
                  <span v-else-if="selectedDeal.stage === stg.id" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span v-else class="text-[9px] font-mono font-medium">{{ idx + 1 }}</span>
                </div>
                <span class="text-[9.5px] leading-tight truncate w-full px-0.5" :class="{ 'font-semibold text-gray-900 dark:text-white': selectedDeal.stage === stg.id }">
                  {{ stg.shortTitle }}
                </span>
              </button>
            </div>

            <!-- Closed Lost alert banner if stage is closed_lost -->
            <div v-if="selectedDeal.stage === 'closed_lost'" class="mt-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs">
              <span class="text-rose-700 dark:text-rose-300 font-medium text-[11px] flex items-center gap-1.5">
                <XCircle class="w-3.5 h-3.5 text-rose-500 shrink-0" />
                Deal marked as Closed Lost (Domain lock released)
              </span>
              <button
                @click="changeDealStage(selectedDeal.id, 'discovery', 'closed_lost')"
                type="button"
                class="text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:underline cursor-pointer"
              >
                Reopen
              </button>
            </div>
          </div>

          <!-- 120-Day Exclusivity Gauge -->
          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-[#23B750]" />
                120-Day Exclusive Domain Protection
              </span>
              <span class="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">{{ selectedDeal.protectionDaysRemaining }} Days Left</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div
                class="h-full bg-[#23B750] rounded-full transition-all"
                :style="{ width: `${(selectedDeal.protectionDaysRemaining / 120) * 100}%` }"
              ></div>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
              This client domain is protected under your account until expiry. No other partner or direct sales rep can claim it.
            </p>
          </div>

          <!-- Financial Breakdown -->
          <div class="space-y-2">
            <h4 class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Financial Breakdown</h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl bg-gray-50/80 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800">
                <span class="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">Client Subscription MRR</span>
                <span class="font-mono font-semibold text-sm text-gray-900 dark:text-white">RM {{ formatNumber(selectedDeal.mrrValue) }}/mo</span>
              </div>
              <div class="p-3.5 rounded-xl bg-gray-50/80 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800">
                <span class="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">Your 20% RevShare</span>
                <span class="font-mono font-semibold text-sm text-[#23B750]">RM {{ formatNumber(selectedDeal.mrrValue * 0.2) }}/mo</span>
              </div>
            </div>
          </div>

          <!-- Decision Maker Contact -->
          <div class="space-y-2">
            <h4 class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Primary Contact</h4>
            <div class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0E131F] space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-gray-900 dark:text-white">{{ selectedDeal.contactName }}</span>
                <span class="text-[11px] text-gray-500 dark:text-gray-400 font-mono">{{ selectedDeal.contactRole }}</span>
              </div>
              <div class="flex items-center justify-between text-gray-600 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800/80">
                <span class="font-mono text-[11px]">{{ selectedDeal.contactEmail }}</span>
                <span class="font-mono text-[11px]">{{ selectedDeal.contactPhone }}</span>
              </div>
            </div>
          </div>

          <!-- Deal Notes & Intent -->
          <div class="space-y-2">
            <h4 class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Deal Notes & Requirements</h4>
            <div class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ selectedDeal.notes }}
            </div>
          </div>

          <!-- Activity Audit Log -->
          <div class="space-y-2">
            <h4 class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Recent Activity</h4>
            <div class="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Clock class="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{{ selectedDeal.lastActivity }}</span>
            </div>
          </div>
        </div>

        <!-- Modal Footer (Polished, Balanced Hierarchy) -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 flex items-center justify-between gap-3">
          <!-- Left: Secondary Controls (Edit & More Overflow) -->
          <div class="flex items-center gap-2">
            <button
              @click="openEditDealModal(selectedDeal)"
              type="button"
              class="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Pencil class="w-3.5 h-3.5" />
              <span>Edit Deal</span>
            </button>

            <!-- More Actions Dropdown (Mark Lost, Archive) -->
            <div class="relative inline-block text-left" @click.stop>
              <button
                type="button"
                @click="showModalMoreMenu = !showModalMoreMenu"
                class="px-2.5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                title="More lifecycle actions"
                :aria-expanded="showModalMoreMenu"
              >
                <MoreHorizontal class="w-3.5 h-3.5" />
                <span>More</span>
                <ChevronDown class="w-3 h-3 opacity-60 transition-transform duration-150" :class="{ 'rotate-180': showModalMoreMenu }" />
              </button>

              <div
                v-if="showModalMoreMenu"
                class="absolute left-0 bottom-full mb-1.5 w-52 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  v-if="selectedDeal.stage !== 'closed_lost'"
                  type="button"
                  @click="markSelectedDealLost(selectedDeal); showModalMoreMenu = false"
                  class="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 transition-colors cursor-pointer group"
                >
                  <XCircle class="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <div>
                    <span class="text-xs font-semibold block leading-tight">Mark Closed Lost</span>
                    <span class="text-[10px] text-rose-500/80 leading-normal">Release exclusivity lock</span>
                  </div>
                </button>

                <button
                  type="button"
                  @click="archiveDealWithUndo(selectedDeal); showModalMoreMenu = false"
                  class="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer group"
                >
                  <Archive class="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                  <div>
                    <span class="text-xs font-semibold block leading-tight">Archive Deal</span>
                    <span class="text-[10px] text-gray-400 leading-normal">Remove from active pipeline</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Primary Progression & Close Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="selectedDeal = null"
              type="button"
              class="px-3.5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>

            <!-- Primary Action: Advance Stage -->
            <button
              v-if="getNextStage(selectedDeal.stage)"
              @click="changeDealStage(selectedDeal.id, getNextStage(selectedDeal.stage)!, selectedDeal.stage)"
              type="button"
              class="px-4 py-2 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Advance Stage</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>

            <!-- If Closed Won: show Won Badge + Reopen -->
            <div v-else-if="selectedDeal.stage === 'closed_won'" class="flex items-center gap-1.5">
              <span class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold inline-flex items-center gap-1.5">
                <Check class="w-3.5 h-3.5 text-[#23B750]" />
                <span>Won · 20% RevShare Active</span>
              </span>
              <button
                @click="changeDealStage(selectedDeal.id, 'in_clearance', 'closed_won')"
                type="button"
                class="px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:underline cursor-pointer"
              >
                Reopen
              </button>
            </div>

            <!-- If Closed Lost: show Reopen to Discovery -->
            <button
              v-else-if="selectedDeal.stage === 'closed_lost'"
              @click="changeDealStage(selectedDeal.id, 'discovery', 'closed_lost')"
              type="button"
              class="px-3.5 py-2 text-xs font-bold text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Undo2 class="w-3.5 h-3.5" />
              <span>Reopen Deal</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL 1: REGISTER NEW DEAL (SALES TRACK CRUD)                  -->
    <!-- ============================================================= -->
    <div
      v-if="showRegisterDealModal"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div class="bg-white dark:bg-[#0E131F] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Register New Client Deal</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Lock exclusivity domain and start the sales cycle</p>
          </div>
          <button
            @click="showRegisterDealModal = false"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="submitRegisterDeal" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
              <input
                v-model="newDealForm.companyName"
                required
                type="text"
                placeholder="e.g. Maju Logistics Sdn Bhd"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company Website / Domain *</label>
              <input
                v-model="newDealForm.domain"
                required
                type="text"
                placeholder="e.g. majulogistics.com.my"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
          </div>

          <!-- Instant simulated lock verification pill -->
          <div v-if="newDealForm.domain" class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300">
            <ShieldCheck class="w-4 h-4 text-[#23B750] shrink-0" />
            <span>Domain available. Submitting will grant <strong class="font-semibold text-gray-900 dark:text-white">120-Day Exclusive Deal Protection</strong>.</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact Full Name *</label>
              <input
                v-model="newDealForm.contactName"
                required
                type="text"
                placeholder="e.g. Dato' Brian Ooi"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Job Title / Role</label>
              <input
                v-model="newDealForm.contactRole"
                type="text"
                placeholder="e.g. Chief Operating Officer"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Work Email *</label>
              <input
                v-model="newDealForm.contactEmail"
                required
                type="email"
                placeholder="brian@majulogistics.com.my"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                v-model="newDealForm.contactPhone"
                type="text"
                placeholder="+60 12-345 6789"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Plan Tier *</label>
              <select
                v-model="newDealForm.planTier"
                @change="onPlanChangeInForm"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              >
                <option value="Basic">Basic (RM 300 / mo)</option>
                <option value="Pro">Pro (RM 600 / mo)</option>
                <option value="Growth">Growth (RM 1,200 / mo)</option>
                <option value="Enterprise">Enterprise (RM 2,400+ / mo)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimated MRR (MYR) *</label>
              <input
                v-model.number="newDealForm.mrrValue"
                required
                type="number"
                min="300"
                step="100"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer Needs & Notes</label>
            <textarea
              v-model="newDealForm.notes"
              rows="3"
              placeholder="e.g. Migrating from manual WhatsApp spreadsheets. Looking for multi-user sales pipeline..."
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
            ></textarea>
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="showRegisterDealModal = false"
              class="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs font-semibold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer"
            >
              Register & Lock Deal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL 2: EDIT DEAL MODAL (SALES TRACK CRUD)                    -->
    <!-- ============================================================= -->
    <div
      v-if="editingDeal"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div class="bg-white dark:bg-[#0E131F] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">Edit Deal: {{ editingDeal.companyName }}</h3>
          <button
            @click="editingDeal = null"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submitEditDeal" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact Full Name</label>
            <input
              v-model="editForm.contactName"
              type="text"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Plan</label>
              <select
                v-model="editForm.planTier"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              >
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Growth">Growth</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimated MRR (MYR)</label>
              <input
                v-model.number="editForm.mrrValue"
                type="number"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Notes & Next Actions</label>
            <textarea
              v-model="editForm.notes"
              rows="3"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#23B750]"
            ></textarea>
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
            <button
              type="button"
              @click="editingDeal = null"
              class="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs font-semibold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Referral Track Legacy Modals (Share Link & Tier Modal) -->
    <!-- Share Link Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
    >
      <div class="bg-white dark:bg-[#0E131F] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">Share Referral Link</h3>
          <button
            @click="showShareModal = false"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <p class="text-xs text-gray-500">Share your exclusive partner referral link to earn a fixed RM 300 flat bounty per paid signup.</p>
        <div class="flex items-center gap-2">
          <input
            readonly
            value="https://crm.rakansales.com/ref/partner-089"
            class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono"
          />
          <button
            @click="handleCopyLink"
            class="px-4 py-2 bg-[#23B750] text-white text-xs font-bold rounded-xl"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Referral Reward Details Modal -->
    <div
      v-if="showTierModal"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
    >
      <div class="bg-white dark:bg-[#0E131F] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">Referral Compensation Model</h3>
          <button
            @click="showTierModal = false"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-3 text-xs">
          <div class="p-3 rounded-xl border border-[#23B750]/40 bg-emerald-50/30 dark:bg-emerald-950/20 flex justify-between items-center">
            <div>
              <span class="font-bold text-[#23B750]">Fixed Bounty per Paid Deal</span>
              <p class="text-gray-500 text-[11px] mt-0.5">Credited automatically upon customer invoice settlement</p>
            </div>
            <span class="font-mono font-bold text-[#23B750] text-sm shrink-0">RM 300</span>
          </div>
          <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
              <span class="font-bold text-gray-900 dark:text-white">Zero Quota Requirement</span>
              <p class="text-gray-500 text-[11px] mt-0.5">No minimum deals needed to unlock top payout</p>
            </div>
            <span class="text-gray-500 font-mono shrink-0">No Tiers</span>
          </div>
          <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
              <span class="font-bold text-gray-900 dark:text-white">Cookie Attribution Window</span>
              <p class="text-gray-500 text-[11px] mt-0.5">Client visits preserved across multiple sessions</p>
            </div>
            <span class="text-gray-500 font-mono shrink-0">90 Days</span>
          </div>
        </div>
        <div class="flex justify-end pt-2">
          <button @click="showTierModal = false" class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-gray-800 cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- DRAG-AND-DROP BOTTOM ACTION DOCK                               -->
    <!-- Appears smoothly while dragging any deal card                   -->
    <!-- ============================================================= -->
    <transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="isDragging && draggedDeal"
        class="fixed bottom-0 inset-x-0 z-[110] pb-6 px-4 flex justify-center pointer-events-none"
      >
        <div class="pointer-events-auto bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md border border-gray-200/90 dark:border-gray-700/80 rounded-2xl shadow-2xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 max-w-2xl w-full animate-in zoom-in-95 duration-150">
          <!-- Drag Info Badge -->
          <div class="hidden sm:flex flex-col justify-center px-3 py-1 border-r border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 shrink-0">
            <span class="text-[9.5px] text-gray-400 uppercase tracking-wider font-semibold">Dragging Deal</span>
            <span class="font-semibold text-gray-900 dark:text-white truncate max-w-[130px]">{{ draggedDeal.companyName }}</span>
          </div>

          <!-- Drop Target 1: Closed Won (if not already won) -->
          <div
            v-if="draggedDeal.stage !== 'closed_won'"
            @dragover.prevent="onDragOverBottomZone('won')"
            @dragleave="onDragLeaveBottomZone('won')"
            @drop.prevent="onDropBottomZone('won')"
            class="flex-1 border-2 border-dashed rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-center transition-all cursor-pointer"
            :class="hoveredBottomZone === 'won'
              ? 'border-[#23B750] bg-emerald-100/90 dark:bg-emerald-500/25 text-emerald-900 dark:text-[#23B750] scale-[1.03] ring-2 ring-[#23B750]/50'
              : 'border-emerald-300 dark:border-emerald-600/40 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 hover:border-[#23B750] hover:bg-emerald-100/70'"
          >
            <CheckCircle2 class="w-4 h-4 shrink-0 text-[#23B750]" />
            <div class="text-left min-w-0">
              <span class="text-xs font-bold block leading-tight">Drop for Won</span>
              <span class="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 leading-none">20% RevShare</span>
            </div>
          </div>

          <!-- Drop Target 2: Mark Closed Lost -->
          <div
            v-if="draggedDeal.stage !== 'closed_lost'"
            @dragover.prevent="onDragOverBottomZone('lost')"
            @dragleave="onDragLeaveBottomZone('lost')"
            @drop.prevent="onDropBottomZone('lost')"
            class="flex-1 border-2 border-dashed rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-center transition-all cursor-pointer"
            :class="hoveredBottomZone === 'lost'
              ? 'border-rose-500 bg-rose-100/90 dark:bg-rose-500/25 text-rose-900 dark:text-rose-300 scale-[1.03] ring-2 ring-rose-400/50'
              : 'border-rose-300/80 dark:border-rose-600/40 bg-rose-50/80 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 hover:border-rose-500 hover:bg-rose-100/70'"
          >
            <XCircle class="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <div class="text-left min-w-0">
              <span class="text-xs font-bold block leading-tight">Drop for Lost</span>
              <span class="text-[10px] text-rose-700/80 dark:text-rose-300/80 leading-none">Relinquish lock</span>
            </div>
          </div>

          <!-- Drop Target 3: Archive Deal -->
          <div
            @dragover.prevent="onDragOverBottomZone('archive')"
            @dragleave="onDragLeaveBottomZone('archive')"
            @drop.prevent="onDropBottomZone('archive')"
            class="flex-1 border-2 border-dashed rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-center transition-all cursor-pointer"
            :class="hoveredBottomZone === 'archive'
              ? 'border-amber-500 bg-amber-100/90 dark:bg-amber-500/25 text-amber-950 dark:text-amber-300 scale-[1.03] ring-2 ring-amber-400/50'
              : 'border-amber-300/70 dark:border-amber-600/40 bg-amber-50/70 dark:bg-amber-950/20 text-amber-900 dark:text-amber-400 hover:border-amber-500 hover:bg-amber-100/70'"
          >
            <Archive class="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div class="text-left min-w-0">
              <span class="text-xs font-bold block leading-tight">Drop to Archive</span>
              <span class="text-[10px] text-amber-800/70 dark:text-amber-300/80 leading-none">Remove from board</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Floating Undo Toast Notification for Accidental Stage Moves & Archiving -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="lastStageChange"
        class="fixed bottom-6 right-6 z-[120] flex items-center gap-3 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-3 rounded-2xl shadow-2xl text-xs font-medium border border-gray-800 dark:border-gray-300"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
          <span v-if="lastStageChange.isArchive">
            Archived <strong class="font-semibold">{{ lastStageChange.dealName }}</strong>
          </span>
          <span v-else>
            Moved <strong class="font-semibold">{{ lastStageChange.dealName }}</strong> to
            <span class="font-semibold" :class="lastStageChange.toStage === 'closed_lost' ? 'text-rose-400' : 'text-[#23B750]'">
              {{ formatStageLabel(lastStageChange.toStage) }}
            </span>
          </span>
        </div>
        <div class="flex items-center gap-1.5 pl-2 border-l border-gray-700 dark:border-gray-300">
          <button
            @click="undoLastStageChange"
            type="button"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 dark:bg-gray-900/10 hover:bg-[#23B750] hover:text-white dark:hover:bg-[#23B750] dark:hover:text-white text-white dark:text-gray-900 font-bold text-xs transition-colors cursor-pointer"
            title="Undo stage change"
          >
            <Undo2 class="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            @click="lastStageChange = null"
            type="button"
            class="p-1 rounded-md text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePartnerStore, type DealItem, type DealStage } from '@/stores/partner';
import {
  ArrowLeft,
  Share2,
  Search,
  Plus,
  LayoutGrid,
  Table2,
  Users,
  CheckCircle2,
  Clock,
  Wallet,
  Award,
  Briefcase,
  Flame,
  Shield,
  ShieldCheck,
  Pencil,
  Archive,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Check,
  Lock,
  Undo2,
  GripVertical,
  XCircle,
  MoreHorizontal,
} from 'lucide-vue-next';

const partnerStore = usePartnerStore();
const route = useRoute();

// Navigation context
const isFromOverview = computed(() => {
  if (route.query.from === 'overview') return true;
  if (typeof window !== 'undefined' && window.history?.state?.back) {
    return window.history.state.back.includes('/partner/overview');
  }
  return false;
});

// Sales Track State
const salesViewMode = ref<'kanban' | 'table'>('kanban');
const salesSearchQuery = ref('');
const salesStageFilter = ref<string>('all');
const salesPlanFilter = ref<string>('all');

// Modals
const showRegisterDealModal = ref(false);
const selectedDeal = ref<DealItem | null>(null);
const editingDeal = ref<DealItem | null>(null);
const modalStageMenuOpen = ref(false);
const showModalMoreMenu = ref(false);

const funnelStages = [
  { id: 'registered' as DealStage, title: 'Registered', shortTitle: 'Registered' },
  { id: 'discovery' as DealStage, title: 'Discovery & Demo', shortTitle: 'Discovery' },
  { id: 'proposal' as DealStage, title: 'Proposal Sent', shortTitle: 'Proposal' },
  { id: 'in_clearance' as DealStage, title: 'In Clearance', shortTitle: 'Clearance' },
  { id: 'closed_won' as DealStage, title: 'Closed Won', shortTitle: 'Won' },
];

function isStagePassed(currentStage: DealStage, checkStage: DealStage): boolean {
  const order: DealStage[] = ['registered', 'discovery', 'proposal', 'in_clearance', 'closed_won'];
  const currentIndex = order.indexOf(currentStage);
  const checkIndex = order.indexOf(checkStage);
  return currentIndex >= 0 && checkIndex >= 0 && checkIndex < currentIndex;
}

function getStageStepNumber(stage: DealStage): number {
  const order: DealStage[] = ['registered', 'discovery', 'proposal', 'in_clearance', 'closed_won'];
  const idx = order.indexOf(stage);
  return idx >= 0 ? idx + 1 : 1;
}

// Forms
const newDealForm = ref({
  companyName: '',
  domain: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactRole: '',
  planTier: 'Growth' as 'Basic' | 'Pro' | 'Growth' | 'Enterprise',
  mrrValue: 1200,
  expectedCloseDate: '2026-11-30',
  stage: 'registered' as DealStage,
  notes: '',
});

const editForm = ref({
  contactName: '',
  planTier: 'Growth' as 'Basic' | 'Pro' | 'Growth' | 'Enterprise',
  mrrValue: 1200,
  notes: '',
});

// Kanban column definitions with bidirectional stage progression
interface KanbanCol {
  id: DealStage;
  title: string;
  dotClass: string;
  prevStage?: DealStage;
  nextStage?: DealStage;
}

const kanbanColumns: KanbanCol[] = [
  { id: 'registered', title: 'Registered', dotClass: 'bg-slate-400 dark:bg-slate-500', nextStage: 'discovery' },
  { id: 'discovery', title: 'Discovery & Demo', dotClass: 'bg-amber-500', prevStage: 'registered', nextStage: 'proposal' },
  { id: 'proposal', title: 'Proposal Sent', dotClass: 'bg-blue-500', prevStage: 'discovery', nextStage: 'in_clearance' },
  { id: 'in_clearance', title: 'In Clearance', dotClass: 'bg-rose-500', prevStage: 'proposal', nextStage: 'closed_won' },
  { id: 'closed_won', title: 'Closed Won', dotClass: 'bg-[#23B750]', prevStage: 'in_clearance' },
];

function getDealsInStage(stage: DealStage): DealItem[] {
  return filteredSalesDeals.value.filter((d) => d.stage === stage);
}

function formatStageLabel(stage: DealStage | string) {
  switch (stage) {
    case 'registered': return 'Registered';
    case 'discovery': return 'Discovery & Demo';
    case 'proposal': return 'Proposal Sent';
    case 'in_clearance': return 'In Clearance';
    case 'closed_won': return 'Closed Won';
    case 'closed_lost': return 'Closed Lost';
    default: return stage;
  }
}

// Stage pill definitions and styling
interface StageOption {
  id: DealStage;
  title: string;
  dotClass: string;
  pillClass: string;
}

const allStages: StageOption[] = [
  {
    id: 'registered',
    title: 'Registered',
    dotClass: 'bg-slate-400 dark:bg-slate-500',
    pillClass: 'bg-slate-50 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  {
    id: 'discovery',
    title: 'Discovery & Demo',
    dotClass: 'bg-amber-500',
    pillClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
  },
  {
    id: 'proposal',
    title: 'Proposal Sent',
    dotClass: 'bg-blue-500',
    pillClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
  },
  {
    id: 'in_clearance',
    title: 'In Clearance',
    dotClass: 'bg-rose-500',
    pillClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
  },
  {
    id: 'closed_won',
    title: 'Closed Won',
    dotClass: 'bg-[#23B750]',
    pillClass: 'bg-emerald-50 text-[#23B750] dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
  },
  {
    id: 'closed_lost',
    title: 'Closed Lost',
    dotClass: 'bg-gray-400 dark:bg-gray-500',
    pillClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  },
];

const openStageMenuId = ref<string | null>(null);

function getStagePillClass(stage: DealStage | string): string {
  const match = allStages.find((s) => s.id === stage);
  return match ? match.pillClass : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
}

function getStageDotClass(stage: DealStage | string): string {
  const match = allStages.find((s) => s.id === stage);
  return match ? match.dotClass : 'bg-gray-400';
}

function getDropdownPositionClass(index: number, totalCount: number): string {
  if (totalCount > 2 && index >= totalCount - 2) {
    return 'bottom-full mb-1.5';
  }
  return 'top-full mt-1.5';
}

const filteredSalesDeals = computed(() => {
  return partnerStore.deals.filter((deal) => {
    // Stage filter
    if (salesStageFilter.value !== 'all' && deal.stage !== salesStageFilter.value) {
      return false;
    }
    // Plan filter
    if (salesPlanFilter.value !== 'all' && deal.planTier !== salesPlanFilter.value) {
      return false;
    }
    // Search query
    const q = salesSearchQuery.value.trim().toLowerCase();
    if (q) {
      const matchComp = deal.companyName.toLowerCase().includes(q);
      const matchDomain = deal.domain.toLowerCase().includes(q);
      const matchContact = deal.contactName.toLowerCase().includes(q);
      return matchComp || matchDomain || matchContact;
    }
    return true;
  });
});

const totalArrValue = computed(() => {
  return partnerStore.deals.reduce((sum, d) => sum + d.arrValue, 0);
});

const expiringLocksCount = computed(() => {
  return partnerStore.deals.filter((d) => d.protectionDaysRemaining > 0 && d.protectionDaysRemaining <= 30).length;
});

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function getPlanBadgeClass(plan: string): string {
  switch (plan) {
    case 'Enterprise':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold';
    case 'Growth':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700';
    case 'Pro':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/70 dark:border-gray-700';
  }
}

function onPlanChangeInForm() {
  switch (newDealForm.value.planTier) {
    case 'Basic':
      newDealForm.value.mrrValue = 300;
      break;
    case 'Pro':
      newDealForm.value.mrrValue = 600;
      break;
    case 'Growth':
      newDealForm.value.mrrValue = 1200;
      break;
    case 'Enterprise':
      newDealForm.value.mrrValue = 2400;
      break;
  }
}

function openRegisterDealModal() {
  newDealForm.value = {
    companyName: '',
    domain: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactRole: '',
    planTier: 'Growth',
    mrrValue: 1200,
    expectedCloseDate: '2026-11-30',
    stage: 'registered',
    notes: '',
  };
  showRegisterDealModal.value = true;
}

function submitRegisterDeal() {
  partnerStore.addDeal({
    companyName: newDealForm.value.companyName,
    domain: newDealForm.value.domain,
    contactName: newDealForm.value.contactName,
    contactEmail: newDealForm.value.contactEmail,
    contactPhone: newDealForm.value.contactPhone,
    contactRole: newDealForm.value.contactRole || 'Decision Maker',
    planTier: newDealForm.value.planTier,
    mrrValue: newDealForm.value.mrrValue,
    arrValue: newDealForm.value.mrrValue * 12,
    expectedCloseDate: newDealForm.value.expectedCloseDate,
    stage: 'registered',
    notes: newDealForm.value.notes,
  });
  showRegisterDealModal.value = false;
}

function openDealDetail(deal: DealItem) {
  selectedDeal.value = deal;
}

function openEditDealModal(deal: DealItem) {
  editingDeal.value = deal;
  editForm.value = {
    contactName: deal.contactName,
    planTier: deal.planTier,
    mrrValue: deal.mrrValue,
    notes: deal.notes,
  };
}

function submitEditDeal() {
  if (!editingDeal.value) return;
  partnerStore.editDeal(editingDeal.value.id, {
    contactName: editForm.value.contactName,
    planTier: editForm.value.planTier,
    mrrValue: editForm.value.mrrValue,
    arrValue: editForm.value.mrrValue * 12,
    notes: editForm.value.notes,
  });
  if (selectedDeal.value && selectedDeal.value.id === editingDeal.value.id) {
    selectedDeal.value.contactName = editForm.value.contactName;
    selectedDeal.value.planTier = editForm.value.planTier;
    selectedDeal.value.mrrValue = editForm.value.mrrValue;
    selectedDeal.value.notes = editForm.value.notes;
  }
  editingDeal.value = null;
}

// -------------------------------------------------------------
// Drag & Drop Kanban State & Handlers
// -------------------------------------------------------------
const isDragging = ref(false);
const draggedDeal = ref<DealItem | null>(null);
const dragOverColId = ref<DealStage | null>(null);
const hoveredBottomZone = ref<'won' | 'lost' | 'archive' | null>(null);
const lastArchivedDeal = ref<DealItem | null>(null);

function onDragStart(deal: DealItem, event: DragEvent) {
  isDragging.value = true;
  draggedDeal.value = deal;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', deal.id);
  }
}

function onDragEnd() {
  isDragging.value = false;
  draggedDeal.value = null;
  dragOverColId.value = null;
  hoveredBottomZone.value = null;
}

function onDragOverCol(colId: DealStage, event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  dragOverColId.value = colId;
}

function onDragLeaveCol(colId: DealStage) {
  if (dragOverColId.value === colId) {
    dragOverColId.value = null;
  }
}

function onDropOnCol(colId: DealStage) {
  if (!draggedDeal.value) return;
  if (draggedDeal.value.stage !== colId) {
    changeDealStage(draggedDeal.value.id, colId, draggedDeal.value.stage);
  }
  onDragEnd();
}

function onDragOverBottomZone(zone: 'won' | 'lost' | 'archive') {
  hoveredBottomZone.value = zone;
}

function onDragLeaveBottomZone(zone: 'won' | 'lost' | 'archive') {
  if (hoveredBottomZone.value === zone) {
    hoveredBottomZone.value = null;
  }
}

function onDropBottomZone(zone: 'won' | 'lost' | 'archive') {
  if (!draggedDeal.value) return;
  const deal = draggedDeal.value;
  if (zone === 'won') {
    changeDealStage(deal.id, 'closed_won', deal.stage);
  } else if (zone === 'lost') {
    changeDealStage(deal.id, 'closed_lost', deal.stage);
  } else if (zone === 'archive') {
    archiveDealWithUndo(deal);
  }
  onDragEnd();
}

// -------------------------------------------------------------
// Stage Advancement & Undo Reversion Logic
// -------------------------------------------------------------
interface UndoHistory {
  dealId: string;
  dealName: string;
  fromStage: DealStage;
  toStage: DealStage;
  isArchive?: boolean;
}

const lastStageChange = ref<UndoHistory | null>(null);
let undoToastTimer: ReturnType<typeof setTimeout> | null = null;

function changeDealStage(dealId: string, toStage: DealStage, fromStage?: DealStage) {
  const deal = partnerStore.deals.find((d) => d.id === dealId);
  if (!deal) return;
  const previous = fromStage || deal.stage;
  if (previous === toStage) return;

  partnerStore.updateDealStage(dealId, toStage);
  if (selectedDeal.value && selectedDeal.value.id === dealId) {
    selectedDeal.value.stage = toStage;
  }

  // Record for instant undo
  lastStageChange.value = {
    dealId,
    dealName: deal.companyName,
    fromStage: previous,
    toStage,
    isArchive: false,
  };

  if (undoToastTimer) clearTimeout(undoToastTimer);
  undoToastTimer = setTimeout(() => {
    lastStageChange.value = null;
  }, 6000);
}

function archiveDealWithUndo(deal: DealItem) {
  lastArchivedDeal.value = { ...deal };
  partnerStore.archiveDeal(deal.id);
  if (selectedDeal.value && selectedDeal.value.id === deal.id) {
    selectedDeal.value = null;
  }

  lastStageChange.value = {
    dealId: deal.id,
    dealName: deal.companyName,
    fromStage: deal.stage,
    toStage: 'closed_lost',
    isArchive: true,
  };

  if (undoToastTimer) clearTimeout(undoToastTimer);
  undoToastTimer = setTimeout(() => {
    lastStageChange.value = null;
    lastArchivedDeal.value = null;
  }, 6000);
}

function markSelectedDealLost(deal: DealItem) {
  changeDealStage(deal.id, 'closed_lost', deal.stage);
}

function undoLastStageChange() {
  if (!lastStageChange.value) return;
  if (lastStageChange.value.isArchive && lastArchivedDeal.value) {
    partnerStore.deals.unshift(lastArchivedDeal.value);
    partnerStore.showToast(`Restored "${lastArchivedDeal.value.companyName}" to active pipeline.`);
    lastArchivedDeal.value = null;
    lastStageChange.value = null;
    if (undoToastTimer) clearTimeout(undoToastTimer);
    return;
  }
  const { dealId, fromStage } = lastStageChange.value;
  partnerStore.updateDealStage(dealId, fromStage);
  if (selectedDeal.value && selectedDeal.value.id === dealId) {
    selectedDeal.value.stage = fromStage;
  }
  lastStageChange.value = null;
  if (undoToastTimer) clearTimeout(undoToastTimer);
}

function getPrevStage(stage: DealStage): DealStage | null {
  const col = kanbanColumns.find((c) => c.id === stage);
  return col?.prevStage || null;
}

function getNextStage(stage: DealStage): DealStage | null {
  const col = kanbanColumns.find((c) => c.id === stage);
  return col?.nextStage || null;
}

function onStageSelectChange(dealId: string, stage: DealStage) {
  changeDealStage(dealId, stage);
}

// -------------------------------------------------------------
// Referral Track State (Legacy Affiliate)
// -------------------------------------------------------------
const searchQuery = ref('');
const statusFilter = ref<'all' | 'Converted' | 'Trial Active' | 'Awaiting Payment'>('all');
const showShareModal = ref(false);
const showTierModal = ref(false);
const copied = ref(false);

const referrals = [
  { id: 1, company: 'Syarikat Maju Jaya', contact: 'Ahmad bin Razak', status: 'Converted', signupDate: '14 Sep 2026', payout: 300 },
  { id: 2, company: 'Borneo Digital Enterprise', contact: 'Grace Ling', status: 'Trial Active', signupDate: '09 Sep 2026', payout: 300 },
  { id: 3, company: 'Seri Mutiara Sdn Bhd', contact: 'Dato Francis Wong', status: 'Awaiting Payment', signupDate: '05 Sep 2026', payout: 300 },
  { id: 4, company: 'Mega Jaya Wholesale', contact: 'Tan Sri Dato Lee', status: 'Converted', signupDate: '01 Sep 2026', payout: 300 },
  { id: 5, company: 'Vortex Global Tech', contact: 'Harith Iskandar', status: 'Trial Active', signupDate: '28 Aug 2026', payout: 300 },
  { id: 6, company: 'Nusantara Logistics', contact: 'Zul Ariffin', status: 'Converted', signupDate: '21 Aug 2026', payout: 300 },
];

const statusFilters = computed(() => [
  { id: 'all' as const, label: 'All', count: referrals.length },
  { id: 'Converted' as const, label: 'Converted', count: referrals.filter(r => r.status === 'Converted').length },
  { id: 'Trial Active' as const, label: 'Trial Active', count: referrals.filter(r => r.status === 'Trial Active').length },
  { id: 'Awaiting Payment' as const, label: 'Awaiting Payment', count: referrals.filter(r => r.status === 'Awaiting Payment').length },
]);

const paginatedReferrals = computed(() => {
  return referrals.filter(r => {
    const matchesStatus = statusFilter.value === 'all' || r.status === statusFilter.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch = !q || r.company.toLowerCase().includes(q) || r.contact.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });
});

function handleCopyLink() {
  navigator.clipboard.writeText('https://crm.rakansales.com/ref/partner-089');
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

// Close stage menu when clicking outside
function handleOutsideClick() {
  openStageMenuId.value = null;
  modalStageMenuOpen.value = false;
  showModalMoreMenu.value = false;
}

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>
