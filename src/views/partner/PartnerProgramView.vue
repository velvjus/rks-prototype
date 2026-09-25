<template>
  <div class="h-full flex flex-col min-h-0 bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
    <!-- Top Sticky Header -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-3 min-w-0">
        <router-link
          v-if="isFromOverview"
          to="/partner/overview"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          title="Return to Partner Overview"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Overview</span>
        </router-link>

        <div v-if="isFromOverview" class="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>

        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Partner Program
            </h1>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Compare partner pathways, payout tiers, and commission structures
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <button
          @click="showShareModal = true"
          class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
        >
          <Share2 class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Share Link</span>
        </button>

        <button
          @click="showUpgradeModal = true"
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Briefcase class="w-3.5 h-3.5" />
          <span>Apply for Sales Track</span>
        </button>
      </div>
    </header>

    <!-- Main Content Body (Full width with stable scrollbar gutter) -->
    <main class="flex-1 min-h-0 overflow-y-auto w-full [scrollbar-gutter:stable]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">

        <!-- ═════════════════════════════════════════════════════════
             SECTION 1: SIMPLIFIED TITLE HERO BANNER
             Distilled typography with clean visual placeholder on right
             ═════════════════════════════════════════════════════════ -->
        <div class="relative bg-[#02130a] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 text-white overflow-hidden shadow-xl partner-hero-banner">
          <!-- Dark Ambient Glow -->
          <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#23B750]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-700/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- Left Side: Clean Value Messaging -->
            <div class="lg:col-span-7 space-y-4">
              <p class="text-xs font-bold tracking-wider text-[#23B750] uppercase">
                Official Partner Program
              </p>

              <div>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Grow with RakanSales.<br />
                  Turn your network into <span class="text-[#23B750]">compounding revenue</span>.
                </h2>
                <p class="text-xs sm:text-sm text-gray-300 mt-2.5 max-w-xl leading-relaxed">
                  Choose your track: earn a flat cash bounty per signup, or close deals to unlock recurring monthly software commission.
                </p>
              </div>

              <!-- Quick Sharing Action Row -->
              <div class="pt-1 flex flex-wrap items-center gap-3">
                <div class="relative flex-1 max-w-md">
                  <input
                    type="text"
                    readonly
                    :value="referralLink"
                    class="w-full pl-3 pr-24 py-2 text-xs bg-black/50 border border-emerald-500/30 rounded-xl text-emerald-200 font-mono focus:outline-none select-all"
                  />
                  <button
                    @click="copyReferralLink"
                    class="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#23B750] hover:bg-[#1fa848] active:scale-95 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Copy class="w-3 h-3" />
                    <span>{{ isLinkCopied ? 'Copied' : 'Copy' }}</span>
                  </button>
                </div>

                <button
                  @click="showShareModal = true"
                  class="px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  Share Options &rarr;
                </button>
              </div>
            </div>

            <!-- Right Side: Graphic Placeholder Area (Simple & Ready for artwork) -->
            <div class="lg:col-span-5 flex items-center justify-center">
              <div class="w-full max-w-md bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-6 sm:p-7 backdrop-blur-xs flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
                <div class="w-14 h-14 rounded-2xl bg-[#23B750]/20 border border-[#23B750]/40 flex items-center justify-center text-[#23B750] shadow-lg shadow-[#23B750]/20">
                  <Award class="w-7 h-7" />
                </div>
                <div>
                  <h3 class="font-bold text-white text-base">Verified Channel Partner</h3>
                  <p class="text-xs text-gray-400 mt-1 max-w-xs">
                    Malaysia's fastest-growing WhatsApp CRM network. Two clear pathways built for your workflow.
                  </p>
                </div>
                <div class="flex items-center gap-4 pt-1 text-[11px] text-emerald-300/80 font-medium">
                  <span class="flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5 text-[#23B750]" /> Flat Bounties
                  </span>
                  <span class="flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5 text-[#23B750]" /> Recurring MRR
                  </span>
                  <span class="flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5 text-[#23B750]" /> 90-Day Cookie
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 2: CURRENT TRACK LIVE STATUS (STANDOUT WITH SHADOW)
             Prominent card with elevated bottom shadow
             ═════════════════════════════════════════════════════════ -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/90 dark:border-gray-800/90 rounded-2xl p-5 sm:p-6 shadow-md shadow-gray-200/70 dark:shadow-black/50 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#23B750] animate-pulse"></span>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Your Active Track: Referral Partner</h3>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#23B750] text-white">Starter Tier</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                You earn <strong class="text-emerald-600 dark:text-emerald-400 font-mono">RM 300</strong> for every closed referral. 3 more closed deals unlock the Silver Tier milestone (+RM 50 bonus per deal).
              </p>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-auto">
              <button
                @click="showUpgradeModal = true"
                class="px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Upgrade to Sales Partner</span>
                <ArrowUpRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Progress Track -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-700 dark:text-gray-300">
                Tier Progression: <strong class="text-gray-900 dark:text-white font-mono">2 of 5 deals closed</strong>
              </span>
              <span class="font-mono font-bold text-[#23B750]">40% Completed</span>
            </div>

            <div class="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-[#23B750] to-[#62D816] rounded-full transition-all duration-700" style="width: 40%"></div>
            </div>

            <div class="flex justify-between items-center text-[11px] text-gray-400 dark:text-gray-500 font-mono">
              <span>Starter (RM 300 / deal)</span>
              <span class="text-[#23B750] font-semibold">3 deals left to Silver</span>
              <span>Silver (RM 350 / deal)</span>
            </div>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 3: PARTNER TRACKS (SIDE-BY-SIDE CARDS MATCHING DESIGN)
             Distilled 2-column cards comparing Referral vs Sales Partner
             ═════════════════════════════════════════════════════════ -->
        <div id="partner-tracks" class="space-y-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Partner Tracks &amp; Tiers
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Choose the model that fits your business: flat referral payouts or recurring monthly software revenue.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

            <!-- ─── CARD 1: REFERRAL PARTNER (ACTIVE TRACK) ─── -->
            <div class="border-2 border-[#23B750] rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0E131F] flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative">
              <div class="space-y-5">
                <!-- Header -->
                <div>
                  <div class="flex items-center justify-between">
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white">Referral Partner</h4>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-[#23B750] border border-emerald-300 dark:border-emerald-800">
                      Active Track
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    Share your link. Our team closes the deal. You earn a flat fee per signup &mdash; no experience needed.
                  </p>
                </div>

                <!-- Tier Table -->
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        <th class="py-2 pr-3">Tier</th>
                        <th class="py-2 px-3 text-center">Signups</th>
                        <th class="py-2 pl-3 text-right">Fee Per Signup</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                      <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="py-2.5 pr-3 font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>Starter</span>
                          <span class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span>
                        </td>
                        <td class="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 font-mono">1&ndash;5</td>
                        <td class="py-2.5 pl-3 text-right font-mono font-bold text-[#23B750]">RM300</td>
                      </tr>
                      <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="py-2.5 pr-3 font-semibold text-gray-900 dark:text-white">Silver</td>
                        <td class="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 font-mono">6&ndash;19</td>
                        <td class="py-2.5 pl-3 text-right font-mono font-bold text-[#23B750]">RM350</td>
                      </tr>
                      <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="py-2.5 pr-3 font-semibold text-gray-900 dark:text-white">Gold</td>
                        <td class="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 font-mono">20&ndash;49</td>
                        <td class="py-2.5 pl-3 text-right font-mono font-bold text-[#23B750]">RM400</td>
                      </tr>
                      <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="py-2.5 pr-3 font-semibold text-gray-900 dark:text-white">Elite</td>
                        <td class="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 font-mono">50+</td>
                        <td class="py-2.5 pl-3 text-right font-mono font-bold text-[#23B750]">RM500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Example Note Callout -->
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Silver Partner example: 10 signups = <strong class="text-[#23B750] font-mono">RM3,500</strong>
                </p>

                <!-- What's included checklist -->
                <div class="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white">What's included</h5>
                  <ul class="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>Unique referral link + tracking code</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>WhatsApp and email templates</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>Our team closes for you</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>90-day lead lock protection</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>Monthly bank payout</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Bottom CTA Button -->
              <div class="pt-6">
                <button
                  type="button"
                  class="w-full py-3 px-4 bg-gray-950 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold text-xs rounded-xl transition-all cursor-default text-center shadow-xs"
                >
                  Current track
                </button>
                <p class="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  No requirements &bull; Open to everyone
                </p>
              </div>
            </div>

            <!-- ─── CARD 2: SALES PARTNER ─── -->
            <div class="border border-gray-200/90 dark:border-gray-800/90 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0E131F] flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative">
              <div class="space-y-5">
                <!-- Header -->
                <div>
                  <div class="flex items-center justify-between">
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white">Sales Partner</h4>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] border border-emerald-200/60 dark:border-emerald-800/60">
                      Recurring RevShare
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    You pitch and close. Earn a recurring % of monthly revenue for every customer you bring in.
                  </p>
                </div>

                <!-- Tier Table -->
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        <th class="py-2 pr-3">Tier</th>
                        <th class="py-2 px-3 text-center">Deals Closed</th>
                        <th class="py-2 pl-3 text-right">% of MRR &times; 12Mo</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                      <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="py-2.5 pr-3 font-semibold text-gray-900 dark:text-white">Silver</td>
                        <td class="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 font-mono">6&ndash;19</td>
                        <td class="py-2.5 pl-3 text-right font-mono font-bold text-[#23B750]">10% MRR</td>
                      </tr>
                      <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="py-2.5 pr-3 font-semibold text-gray-900 dark:text-white">Gold</td>
                        <td class="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 font-mono">20&ndash;49</td>
                        <td class="py-2.5 pl-3 text-right font-mono font-bold text-[#23B750]">20% MRR</td>
                      </tr>
                      <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="py-2.5 pr-3 font-semibold text-gray-900 dark:text-white">Elite</td>
                        <td class="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 font-mono">50+</td>
                        <td class="py-2.5 pl-3 text-right font-mono font-bold text-[#23B750]">25% MRR</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Example Note Callout -->
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Gold Partner example (20%): 1 Pro customer = <strong class="text-[#23B750] font-mono">RM1,800 commission in 1 Year</strong>
                </p>

                <!-- What's included checklist -->
                <div class="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white">Everything in Referrals, plus</h5>
                  <ul class="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>Full deal pipeline access</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>Demo materials and sales deck</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>Co-sell support on big deals</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>120-day lead lock protection</span>
                    </li>
                    <li class="flex items-center gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-[#23B750] shrink-0" />
                      <span>Dedicated partner manager</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Bottom CTA Button -->
              <div class="pt-6">
                <button
                  type="button"
                  @click="showUpgradeModal = true"
                  class="w-full py-3 px-4 bg-emerald-100 hover:bg-emerald-200/90 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 font-bold text-xs rounded-xl transition-all cursor-pointer text-center shadow-xs"
                >
                  Close 3 more deals to unlock
                </button>
                <p class="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  Unlocks at 5 closed deals &bull; Or apply directly
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 4: REDESIGNED EARNINGS CALCULATOR (2-COLUMNS)
             Left: Options & Volume Slider | Right: Estimated Results
             ═════════════════════════════════════════════════════════ -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/90 dark:border-gray-800/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xs space-y-6">
          <div class="border-b border-gray-100 dark:border-gray-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Interactive Commission Calculator
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select the client plans you target and adjust estimated deal volume to simulate your cashflow.
              </p>
            </div>

            <!-- Track Selector for Calculator -->
            <div class="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700/80 self-start sm:self-auto">
              <button
                @click="simTrack = 'referral'"
                :class="[
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  simTrack === 'referral'
                    ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Referral Track (Flat Fee)
              </button>
              <button
                @click="simTrack = 'sales'"
                :class="[
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  simTrack === 'sales'
                    ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Sales Track (% MRR)
              </button>
            </div>
          </div>

          <!-- Two Columns Grid: Left = Selection Options, Right = Estimated Results -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">

            <!-- Left Column: Plans Checkboxes & Deal Volume Slider -->
            <div class="lg:col-span-7 space-y-6">

              <!-- Step 1: Select Plans Checkboxes -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    1. Select Plans You Sell or Refer
                  </label>
                  <span class="text-[11px] text-gray-400">
                    {{ selectedPlans.length }} plan{{ selectedPlans.length === 1 ? '' : 's' }} selected
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    v-for="plan in availablePlans"
                    :key="plan.id"
                    :class="[
                      'p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none',
                      selectedPlans.includes(plan.id)
                        ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-2xs ring-1 ring-[#23B750]'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/40 hover:border-gray-300 dark:hover:border-gray-700'
                    ]"
                  >
                    <div class="flex items-start justify-between">
                      <div>
                        <h5 class="font-bold text-xs text-gray-900 dark:text-white">{{ plan.name }}</h5>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 font-mono">{{ plan.priceLabel }}</p>
                      </div>
                      <input
                        type="checkbox"
                        :value="plan.id"
                        v-model="selectedPlans"
                        class="w-4 h-4 text-[#23B750] rounded border-gray-300 focus:ring-[#23B750] cursor-pointer accent-[#23B750] mt-0.5"
                      />
                    </div>

                    <div class="pt-2 border-t border-gray-200/50 dark:border-gray-800/60 text-[11px]">
                      <span class="text-gray-500 dark:text-gray-400">Expected payout:</span>
                      <p class="font-semibold text-[#23B750] font-mono">
                        {{ simTrack === 'referral' ? plan.referralPayout : plan.salesPayout }}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Step 2: Volume Slider -->
              <div class="space-y-3 pt-1">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    2. Estimated Closed Deals Per Month
                  </label>
                  <div class="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl">
                    <span class="text-sm font-extrabold font-mono text-[#23B750]">{{ simDealsPerMonth }}</span>
                    <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">deals/mo</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    v-model.number="simDealsPerMonth"
                    class="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#23B750]"
                  />
                  <div class="flex justify-between text-[11px] font-mono text-gray-400 dark:text-gray-500">
                    <span>1 deal</span>
                    <span>10 deals</span>
                    <span>25 deals</span>
                    <span>50 deals/mo</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right Column: Estimated Results Card -->
            <div class="lg:col-span-5 bg-[#02130a] text-white rounded-2xl p-6 sm:p-7 border border-emerald-500/20 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
              <div class="absolute -top-16 -right-16 w-64 h-64 bg-[#23B750]/20 rounded-full blur-3xl pointer-events-none"></div>

              <div class="relative z-10 space-y-6">
                <!-- Card Header -->
                <div class="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <span class="text-xs font-bold uppercase tracking-wider text-emerald-300">Estimated Returns</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-[#23B750] border border-emerald-500/30">
                    {{ simTrack === 'referral' ? 'Flat Referral Payout' : 'Recurring % MRR' }}
                  </span>
                </div>

                <!-- Monthly Payout Metric -->
                <div class="space-y-1">
                  <span class="text-xs text-gray-400 font-medium">Estimated Monthly Payout</span>
                  <p class="text-3xl sm:text-4xl font-extrabold font-mono text-[#23B750] tracking-tight">
                    {{ simMonthlyEarningsFormatted }}
                  </p>
                  <p class="text-[11px] text-gray-400">
                    Automated bank clearance into your account
                  </p>
                </div>

                <!-- Annualized Revenue Metric -->
                <div class="space-y-1 pt-2 border-t border-emerald-500/15">
                  <span class="text-xs text-gray-400 font-medium">Annualized Earnings</span>
                  <p class="text-2xl font-bold font-mono text-white">
                    {{ simAnnualEarningsFormatted }}
                  </p>
                  <p class="text-[11px] text-gray-400">
                    12-month projected pipeline revenue
                  </p>
                </div>

                <!-- Milestone Tier Box -->
                <div class="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-500/20 space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Unlocked Milestone</span>
                  <p class="text-sm font-bold text-white">{{ simQualifiedTier.name }}</p>
                  <div class="flex items-center justify-between text-[11px] text-gray-300 font-mono pt-0.5">
                    <span>{{ simQualifiedTier.rateSummary }}</span>
                    <span class="text-[#23B750] font-semibold">{{ simQualifiedTier.clearanceDays }}</span>
                  </div>
                </div>
              </div>

              <div class="relative z-10 pt-2 border-t border-emerald-500/15 flex items-center gap-2 text-[11px] text-gray-400">
                <span class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span>
                <span>Payouts distributed in Ringgit Malaysia (MYR)</span>
              </div>
            </div>

          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 5: PARTNER KIT TEASER (COMPACT BANNER)
             Points cleanly to dedicated /partner/kit page
             ═════════════════════════════════════════════════════════ -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/90 dark:border-gray-800/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center shrink-0">
              <Package class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">Looking for marketing assets &amp; presentation decks?</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Explore the official Partner Enablement Kit with ready-to-use pitch decks, WhatsApp outreach templates, and battlecards.
              </p>
            </div>
          </div>

          <router-link
            to="/partner/kit"
            class="px-4 py-2 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>Open Partner Kit</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>

      </div>
    </main>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 1: SHARE PARTNER LINK
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showShareModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <Share2 class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Share Your Partner Link</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">All signups attribute directly to your partner ID</p>
            </div>
          </div>
          <button @click="showShareModal = false" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Your Unique Referral URL</label>
            <div class="flex gap-2">
              <input
                type="text"
                readonly
                :value="referralLink"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-gray-900 dark:text-gray-100 text-xs select-all"
              />
              <button
                @click="copyReferralLink"
                class="px-4 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white font-bold rounded-xl transition-all cursor-pointer shrink-0"
              >
                {{ isLinkCopied ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </div>

          <div class="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-950 dark:text-emerald-200 space-y-1">
            <p class="font-semibold text-emerald-800 dark:text-emerald-300">Attribution Rules:</p>
            <p>&bull; 90-day cookie window preserves your referral even if the client decides later.</p>
            <p>&bull; Earn RM 300 immediately upon paid subscription activation.</p>
          </div>
        </div>

        <div class="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            @click="showShareModal = false"
            class="px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 2: APPLY FOR SALES PARTNER TRACK UPGRADE
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="showUpgradeModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showUpgradeModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <Briefcase class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Apply for Sales Partner Track</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Unlock 10% to 25% recurring monthly revenue share</p>
            </div>
          </div>
          <button @click="showUpgradeModal = false" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="submitUpgrade" class="space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Company / Agency Name</label>
            <input
              type="text"
              required
              v-model="upgradeForm.company"
              placeholder="e.g. Apex Digital Solutions Sdn Bhd"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750] text-xs"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-semibold text-gray-700 dark:text-gray-300">Primary Consulting Focus</label>
              <select
                v-model="upgradeForm.focus"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750] text-xs"
              >
                <option>IT Consulting &amp; Systems</option>
                <option>Digital Marketing Agency</option>
                <option>Accounting &amp; ERP Advisory</option>
                <option>Business Management Consulting</option>
                <option>Freelance Consultant</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="font-semibold text-gray-700 dark:text-gray-300">Estimated Deals / Month</label>
              <select
                v-model="upgradeForm.pipeline"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750] text-xs"
              >
                <option>3&ndash;5 deals / mo</option>
                <option>6&ndash;10 deals / mo</option>
                <option>11&ndash;20 deals / mo</option>
                <option>20+ deals / mo</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Direct Contact Number (WhatsApp)</label>
            <input
              type="text"
              required
              v-model="upgradeForm.phone"
              placeholder="+6012-345 6789"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750] text-xs"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Brief Notes on Your Client Base</label>
            <textarea
              v-model="upgradeForm.notes"
              rows="2"
              placeholder="Tell us about the types of businesses you work with (e.g. retail, logistics, manufacturing)..."
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#23B750] text-xs resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="showUpgradeModal = false"
              class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white text-xs font-bold rounded-xl shadow-md shadow-[#23B750]/20 cursor-pointer"
            >
              Submit Upgrade Application
            </button>
          </div>
        </form>
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
import { useRoute } from 'vue-router';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Share2,
  Copy,
  CheckCircle2,
  Briefcase,
  Award,
  Calculator,
  Package,
} from 'lucide-vue-next';

const route = useRoute();

// Navigation source check
const isFromOverview = computed(() => {
  if (route.query.from === 'overview') return true;
  if (typeof window !== 'undefined' && window.history?.state?.back) {
    return window.history.state.back.includes('/partner/overview');
  }
  return false;
});

// Modals and Link Sharing
const showShareModal = ref(false);
const showUpgradeModal = ref(false);
const isLinkCopied = ref(false);
const referralCode = 'O45HKSYS';
const referralLink = `https://app.rakansales.com/ref/${referralCode}`;

const toastMessage = ref('');
let toastTimer: number | null = null;
function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
}

function copyReferralLink() {
  navigator.clipboard.writeText(referralLink);
  isLinkCopied.value = true;
  showToast('Partner referral link copied to clipboard!');
  setTimeout(() => {
    isLinkCopied.value = false;
  }, 2500);
}

// Upgrade Form State
const upgradeForm = ref({
  company: '',
  focus: 'IT Consulting & Systems',
  pipeline: '6–10 deals / mo',
  phone: '',
  notes: '',
});

function submitUpgrade() {
  showUpgradeModal.value = false;
  showToast('Sales Partner Track application submitted! Our team will contact you.');
  upgradeForm.value = {
    company: '',
    focus: 'IT Consulting & Systems',
    pipeline: '6–10 deals / mo',
    phone: '',
    notes: '',
  };
}

// ═════════════════════════════════════════════════════════
// SIMULATOR REACTIVE LOGIC WITH PLAN CHECKBOXES
// ═════════════════════════════════════════════════════════
const simTrack = ref<'referral' | 'sales'>('referral');
const simDealsPerMonth = ref(6);

interface PlanItem {
  id: string;
  name: string;
  priceLabel: string;
  mrr: number;
  referralPayout: string;
  salesPayout: string;
}

const availablePlans: PlanItem[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    priceLabel: 'RM 150 / mo MRR',
    mrr: 150,
    referralPayout: 'RM 300 / signup',
    salesPayout: '10% – 25% MRR (~RM15 – RM38/mo)',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    priceLabel: 'RM 750 / mo MRR',
    mrr: 750,
    referralPayout: 'RM 300 – RM 500 / signup',
    salesPayout: '10% – 25% MRR (~RM75 – RM188/mo)',
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    priceLabel: 'RM 1,500 / mo MRR',
    mrr: 1500,
    referralPayout: 'RM 300 – RM 500 / signup',
    salesPayout: '10% – 25% MRR (~RM150 – RM375/mo)',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    priceLabel: 'RM 3,500 / mo MRR',
    mrr: 3500,
    referralPayout: 'RM 300 – RM 500 / signup',
    salesPayout: '10% – 25% MRR (~RM350 – RM875/mo)',
  },
];

const selectedPlans = ref<string[]>(['pro', 'growth']);

const activePlans = computed(() => {
  if (selectedPlans.value.length === 0) {
    return [availablePlans[1]]; // fallback to Pro if user unchecks all
  }
  return availablePlans.filter(p => selectedPlans.value.includes(p.id));
});

const simQualifiedTier = computed(() => {
  const d = simDealsPerMonth.value;
  if (simTrack.value === 'referral') {
    if (d >= 50) {
      return {
        name: 'Elite Tier (RM 500 / deal)',
        rateSummary: 'RM 500 / signup (+RM 200 bonus)',
        clearanceDays: 'Instant Payout Cycle',
      };
    }
    if (d >= 20) {
      return {
        name: 'Gold Tier (RM 400 / deal)',
        rateSummary: 'RM 400 / signup (+RM 100 bonus)',
        clearanceDays: '14 Days Payout Cycle',
      };
    }
    if (d >= 6) {
      return {
        name: 'Silver Tier (RM 350 / deal)',
        rateSummary: 'RM 350 / signup (+RM 50 bonus)',
        clearanceDays: '14 Days Payout Cycle',
      };
    }
    return {
      name: 'Starter Tier (RM 300 / deal)',
      rateSummary: 'RM 300 / signup (Base Rate)',
      clearanceDays: '30 Days Payout Cycle',
    };
  } else {
    if (d >= 50) {
      return {
        name: 'Elite Partner (25% MRR)',
        rateSummary: '25% of MRR × 12 Months',
        clearanceDays: 'Monthly Automatic Wire',
      };
    }
    if (d >= 20) {
      return {
        name: 'Gold Partner (20% MRR)',
        rateSummary: '20% of MRR × 12 Months',
        clearanceDays: 'Monthly Automatic Wire',
      };
    }
    return {
      name: 'Silver Partner (10% MRR)',
      rateSummary: '10% of MRR × 12 Months',
      clearanceDays: 'Monthly Automatic Wire',
    };
  }
});

const simMonthlyEarnings = computed(() => {
  const d = simDealsPerMonth.value;
  const plans = activePlans.value;
  const avgMrr = plans.reduce((acc, p) => acc + p.mrr, 0) / plans.length;

  if (simTrack.value === 'referral') {
    const rate = d >= 50 ? 500 : d >= 20 ? 400 : d >= 6 ? 350 : 300;
    return d * rate;
  } else {
    const percent = d >= 50 ? 0.25 : d >= 20 ? 0.20 : 0.10;
    // Monthly recurring commission across active accounts
    return Math.round(d * avgMrr * percent);
  }
});

const simMonthlyEarningsFormatted = computed(() => {
  return `RM ${simMonthlyEarnings.value.toLocaleString()}`;
});

const simAnnualEarningsFormatted = computed(() => {
  const annual = simMonthlyEarnings.value * 12;
  return `RM ${annual.toLocaleString()}`;
});
</script>

<style scoped>
.partner-hero-banner {
  background-image: radial-gradient(circle at 10% 20%, rgba(35, 183, 80, 0.12) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%);
}
</style>
