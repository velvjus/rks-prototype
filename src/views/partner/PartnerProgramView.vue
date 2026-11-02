<template>
 <div class="h-full flex flex-col min-h-0 bg-background text-foreground font-sans transition-colors duration-200">
 <!-- Top Sticky Header -->
 <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
 <div class="flex items-center gap-3 min-w-0">
 <router-link
 v-if="isFromOverview"
 to="/partner/overview"
 class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
 title="Return to Partner Overview"
 >
 <ArrowLeft class="w-3.5 h-3.5" />
 <span>Overview</span>
 </router-link>

 <div v-if="isFromOverview" class="h-4 w-px bg-border"></div>

 <div>
 <h1 class="text-base sm:text-lg font-bold text-foreground tracking-tight">
 Partner Program
 </h1>
 <p class="text-xs text-muted-foreground">
 Compare compensation models, reseller tiers, and client revenue share
 </p>
 </div>
 </div>

 <!-- Action Buttons -->
 <div class="flex items-center gap-2">
 <button
 @click="showShareModal = true"
 class="px-3 py-1.5 text-xs font-semibold text-foreground bg-card hover:bg-muted border border-border text-foreground rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
 >
 <Share2 class="w-3.5 h-3.5" />
 <span class="hidden sm:inline">Share Link</span>
 </button>

 <button
 v-if="partnerStore.activeTrack === 'referral'"
 @click="openUpgradeModal"
 class="px-3.5 py-1.5 text-xs font-bold text-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-98"
 >
 <Briefcase class="w-3.5 h-3.5" />
 <span>Upgrade to Sales Track</span>
 </button>
 <div
 v-else
 class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/20 rounded-xl text-xs font-semibold text-success shadow-2xs"
 >
 <ShieldCheck class="w-3.5 h-3.5 text-primary" />
 <span>Accredited Reseller</span>
 </div>
 </div>
 </header>

 <!-- Main Content Body -->
 <main class="flex-1 min-h-0 overflow-y-auto w-full [scrollbar-gutter:stable]">
 <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">

 <!-- ═════════════════════════════════════════════════════════
 SECTION 1: HERO VALUE BANNER WITH RICH BRAND ARTWORK
 High-contrast type, balanced measure, 3D growth illustration
 ═════════════════════════════════════════════════════════ -->
 <div class="relative bg-card border border-border rounded-2xl p-6 sm:p-8 text-foreground overflow-hidden shadow-xs">
 <!-- Subtle top accent line -->
 <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

 <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
 <!-- Left Side: Core Value Proposition -->
 <div class="lg:col-span-6 space-y-4">
 <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold">
 <Sparkles class="w-3.5 h-3.5" />
 <span>RakanSales Official Commercial Partnership</span>
 </div>

 <div>
 <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
 Two partner pathways.<br />
 Built for <span class="text-primary">compounding revenue</span>.
 </h2>
 <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2 max-w-lg">
 Choose between hands-off referral bounties or recurring MRR as an accredited software reseller. Both tracks include client exclusivity and real-time commission tracking.
 </p>
 </div>

 <!-- Quick Sharing Action Row -->
 <div class="pt-1 flex flex-wrap items-center gap-2.5">
 <div class="relative flex-1 max-w-xs sm:max-w-sm">
 <input
 type="text"
 readonly
 :value="referralLink"
 aria-label="Direct referral tracking link"
 class="w-full pl-3 pr-20 py-2 text-xs bg-muted/50 border border-border rounded-xl text-muted-foreground font-mono focus:outline-none focus:border-primary select-all shadow-inner"
 />
 <button
 @click="copyReferralLink"
 class="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-primary hover:bg-primary/90 active:scale-95 text-foreground rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
 >
 <component :is="isLinkCopied ? Check : Copy" class="w-3 h-3" />
 <span>{{ isLinkCopied ? 'Copied' : 'Copy' }}</span>
 </button>
 </div>

 <button
 @click="showShareModal = true"
 class="px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-card/10 border border-border rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
 >
 <Share2 class="w-3.5 h-3.5" />
 <span>Share Options</span>
 </button>
 </div>

 <!-- Key Assurance Tags -->
 <div class="pt-1 flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground">
 <span class="inline-flex items-center gap-1">
 <ShieldCheck class="w-3.5 h-3.5 text-primary" />
 90–120 Day Client Protection
 </span>
 <span class="inline-flex items-center gap-1">
 <Award class="w-3.5 h-3.5 text-primary" />
 Direct Bank MYR Wire
 </span>
 </div>
 </div>

 <!-- Right Side: 3D Enterprise Partnership Hero Visual -->
 <div class="lg:col-span-6 relative flex items-center justify-center">
 <!-- Radiant Ambient Glow -->
 <div class="absolute -inset-2 bg-radial from-primary/25 via-primary/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>

 <div class="relative w-full rounded-2xl overflow-hidden border border-success/25 shadow-2xl bg-card group">
 <img
 src="/brand-assets/partner/partner-program-hero.jpg"
 alt="RakanSales B2B Partner Revenue & Commercial Accreditation"
 class="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-102"
 loading="eager"
 />
 <!-- Subtle vignette accents -->
 <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
 <div class="absolute inset-0 ring-1 ring-inset ring-border rounded-2xl pointer-events-none"></div>
 </div>
 </div>
 </div>
 </div>

 <!-- ═════════════════════════════════════════════════════════
 SECTION 2: LIVE TRACK STATUS & MILESTONE PROGRESS
 Compact, high-hierarchy 2-column console:
 Left: Active Tier & Entitlements
 Right: Appetizing Green Gradient Milestone Box
 ═════════════════════════════════════════════════════════ -->
 <div class="bg-card border border-border rounded-2xl p-5 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
 
 <!-- Left 7 Cols: Active Tier & Entitlements -->
 <div class="lg:col-span-7 flex flex-col justify-between space-y-3.5">
 <div class="space-y-3">
 <!-- Tier Title & Rate Header -->
 <div class="flex items-start justify-between gap-3 border-b border-border/80 pb-3">
 <div class="space-y-1 min-w-0">
 <div class="flex items-center gap-2">
 <span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
 <h3 class="text-sm font-bold text-foreground truncate">
 {{ partnerStore.activeTrack === 'sales' ? 'Active Track: Certified Solutions Partner' : 'Active Track: Referral Partner' }}
 </h3>
 </div>
 <p class="text-xs text-muted-foreground">
 {{ partnerStore.activeTrack === 'sales'
 ? 'Accredited B2B software reseller with recurring MRR and 120-day exclusive client lock.'
 : 'Affiliate referral model with guaranteed flat bounty on every paid subscription.'
 }}
 </p>
 </div>

 <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-success/10 text-success border border-success/20 shrink-0">
 {{ partnerStore.activeTrack === 'sales' ? '20% Recurring MRR' : 'Fixed RM 300' }}
 </span>
 </div>

 <!-- Structured Active Benefits List -->
 <div class="space-y-1.5">
 <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Active Entitlements</p>

 <!-- Sales Track Active Entitlements -->
 <div v-if="partnerStore.activeTrack === 'sales'" class="grid grid-cols-1 sm:grid-cols-3 gap-2">
 <div class="p-2.5 rounded-xl bg-muted/70 border border-border/60 text-xs flex items-start gap-2">
 <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
 <div>
 <p class="font-bold text-foreground ">20% Monthly MRR</p>
 <p class="text-[10.5px] text-muted-foreground leading-tight">12 months per client</p>
 </div>
 </div>
 <div class="p-2.5 rounded-xl bg-muted/70 border border-border/60 text-xs flex items-start gap-2">
 <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
 <div>
 <p class="font-bold text-foreground ">120-Day Lock</p>
 <p class="text-[10.5px] text-muted-foreground leading-tight">Exclusive domain rights</p>
 </div>
 </div>
 <div class="p-2.5 rounded-xl bg-muted/70 border border-border/60 text-xs flex items-start gap-2">
 <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
 <div>
 <p class="font-bold text-foreground ">Dedicated PAM</p>
 <p class="text-[10.5px] text-muted-foreground leading-tight">Co-selling &amp; RFP reviews</p>
 </div>
 </div>
 </div>

 <!-- Referral Track Active Entitlements -->
 <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-2">
 <div class="p-2.5 rounded-xl bg-muted/70 border border-border/60 text-xs flex items-start gap-2">
 <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
 <div>
 <p class="font-bold text-foreground ">RM 300 Flat Bounty</p>
 <p class="text-[10.5px] text-muted-foreground leading-tight">Per verified subscription</p>
 </div>
 </div>
 <div class="p-2.5 rounded-xl bg-muted/70 border border-border/60 text-xs flex items-start gap-2">
 <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
 <div>
 <p class="font-bold text-foreground ">90-Day Cookies</p>
 <p class="text-[10.5px] text-muted-foreground leading-tight">Extended tracking window</p>
 </div>
 </div>
 <div class="p-2.5 rounded-xl bg-muted/70 border border-border/60 text-xs flex items-start gap-2">
 <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
 <div>
 <p class="font-bold text-foreground ">Zero Quotas</p>
 <p class="text-[10.5px] text-muted-foreground leading-tight">No minimum volume needed</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Right 5 Cols: Appetizing Green Gradient Milestone Box -->
 <div class="lg:col-span-5 relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/80 border border-success/25 shadow-xs flex flex-col justify-center space-y-2.5">
 <template v-if="partnerStore.activeTrack === 'sales'">
 <div class="space-y-2">
 <div class="flex items-start justify-between gap-2 text-xs">
 <div>
 <div class="flex items-center gap-1.5 font-bold text-foreground">
 <Sparkles class="w-3.5 h-3.5 text-primary" />
 <span>Next Upgrade: Premier Reseller</span>
 </div>
 <p class="text-[11px] text-muted-foreground mt-0.5">
 Unlocks <strong class="text-success font-bold">25% MRR (+5%)</strong> + <strong class="text-foreground font-semibold">RM 10,000 Co-Op MDF</strong>
 </p>
 </div>
 <span class="font-mono font-bold text-xs text-primary bg-success/10 px-2 py-0.5 rounded-md border border-success/30 shrink-0">
 62.4%
 </span>
 </div>

 <!-- Progress Bar: Appetizing Green Gradient Fill -->
 <div class="w-full h-2 bg-success/20 rounded-full overflow-hidden p-0.5 border border-success/30">
 <div
 class="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full shadow-xs transition-all duration-500"
 style="width: 62.4%;"
 ></div>
 </div>

 <!-- Progress Status Line -->
 <div class="flex items-center justify-between text-[11px] font-mono text-muted-foreground ">
 <span>RM 124,800 of RM 200,000 ARR</span>
 <span class="font-bold text-success ">RM 75,200 to upgrade</span>
 </div>
 </div>
 </template>

 <template v-else>
 <div class="space-y-2">
 <div class="flex items-start justify-between gap-2 text-xs">
 <div>
 <div class="flex items-center gap-1.5 font-bold text-foreground">
 <Sparkles class="w-3.5 h-3.5 text-primary" />
 <span>Next Upgrade: Reseller Track</span>
 </div>
 <p class="text-[11px] text-muted-foreground mt-0.5">
 Graduate to <strong class="text-success font-bold">15% – 25% recurring MRR</strong> on closed deals
 </p>
 </div>
 <span class="font-mono font-bold text-xs text-primary bg-success/10 px-2 py-0.5 rounded-md border border-success/30 shrink-0">
 4 / 5
 </span>
 </div>

 <!-- Progress Bar: Appetizing Green Gradient Fill -->
 <div class="w-full h-2 bg-success/20 rounded-full overflow-hidden p-0.5 border border-success/30">
 <div
 class="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full shadow-xs transition-all duration-500"
 style="width: 80%;"
 ></div>
 </div>

 <!-- Progress Status Line -->
 <div class="flex items-center justify-between text-[11px] font-mono text-muted-foreground ">
 <span>4 conversions completed</span>
 <span class="font-bold text-success ">1 more to fast-track</span>
 </div>
 </div>
 </template>
 </div>

 </div>

 <!-- ═════════════════════════════════════════════════════════
 SECTION 3: SIDE-BY-SIDE TRACK COMPARISON
 Clear visual hierarchy:
 Card 1: Referral Track (Affiliate Mascot Team)
 Card 2: Sales Reseller (Featured Flagship with Laptop Mascot)
 ═════════════════════════════════════════════════════════ -->
 <div id="partner-tracks" class="space-y-4">
 <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
 <div>
 <h3 class="text-base sm:text-lg font-bold text-foreground tracking-tight">
 Compare Partner Tracks
 </h3>
 <p class="text-xs text-muted-foreground mt-0.5">
 Choose between hands-off affiliate link referrals or managed enterprise B2B sales pipelines.
 </p>
 </div>
 <span class="text-xs font-medium text-muted-foreground font-mono">
 Accreditation-based progression
 </span>
 </div>

 <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

 <!-- ─── CARD 1: REFERRAL TRACK ─── -->
 <div 
 class="rounded-2xl p-6 bg-card flex flex-col justify-between shadow-xs transition-all border border-border/80 "
 :class="partnerStore.activeTrack === 'referral' ? 'ring-2 ring-primary/40 border-primary' : ''"
 >
 <div class="space-y-4">
 <!-- Artwork Header -->
 <div class="h-24 w-full flex items-center justify-center bg-muted/70 rounded-xl p-2 border border-border">
 <img
 src="/brand-assets/partner/sales-partner-illustration.png"
 alt="Referral Partner Graphic"
 class="h-20 w-auto object-contain drop-shadow-sm"
 loading="lazy"
 />
 </div>

 <!-- Header Info -->
 <div class="space-y-1.5">
 <div class="flex items-center justify-between">
 <h4 class="text-lg font-bold text-foreground">Referral Partner</h4>
 <span 
 v-if="partnerStore.activeTrack === 'referral'"
 class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-primary border border-success/20 "
 >
 Active Track
 </span>
 <span 
 v-else
 class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground"
 >
 Affiliate
 </span>
 </div>
 <div class="flex items-baseline gap-1.5">
 <span class="text-2xl font-bold font-mono text-primary">RM 300</span>
 <span class="text-xs text-muted-foreground">/ closed deal (Fixed Flat Bounty)</span>
 </div>
 <p class="text-xs text-muted-foreground leading-relaxed">
 Share your tracking link. RakanSales sales reps handle demos, proposals, and customer closing.
 </p>
 </div>

 <!-- Fixed Bounty Structure Card -->
 <div class="rounded-xl border border-border p-3 bg-muted/70 space-y-2 text-xs">
 <div class="flex items-center justify-between">
 <span class="text-muted-foreground">Reward Per Paid Deal</span>
 <span class="font-mono font-bold text-primary">RM 300 Flat Cash</span>
 </div>
 <div class="flex items-center justify-between">
 <span class="text-muted-foreground">Tier Thresholds</span>
 <span class="font-medium text-foreground">None (Fixed rate for all)</span>
 </div>
 <div class="flex items-center justify-between">
 <span class="text-muted-foreground">Volume Minimums</span>
 <span class="font-medium text-foreground">Zero quota required</span>
 </div>
 <div class="flex items-center justify-between">
 <span class="text-muted-foreground">Settlement Cycle</span>
 <span class="font-mono text-foreground">30-day clearance</span>
 </div>
 </div>

 <!-- Structured Specifications -->
 <div class="space-y-2 pt-1 border-t border-border text-xs">
 <div class="flex items-center justify-between text-muted-foreground">
 <span class="text-muted-foreground">Deal Handling</span>
 <span class="font-medium text-foreground">100% closed by RakanSales</span>
 </div>
 <div class="flex items-center justify-between text-muted-foreground">
 <span class="text-muted-foreground">Attribution</span>
 <span class="font-medium text-foreground">90-day browser cookie</span>
 </div>
 <div class="flex items-center justify-between text-muted-foreground">
 <span class="text-muted-foreground">Payout Method</span>
 <span class="font-medium text-foreground">Instant bank credit</span>
 </div>
 </div>
 </div>

 <!-- Bottom CTA / Status -->
 <div class="pt-4 mt-4 border-t border-border">
 <button
 v-if="partnerStore.activeTrack === 'referral'"
 type="button"
 class="w-full py-2.5 px-4 bg-card text-foreground font-bold text-xs rounded-xl cursor-default text-center"
 >
 Active Track
 </button>
 <div
 v-else
 class="w-full py-2.5 px-3 rounded-xl bg-muted border border-border text-center flex items-center justify-center gap-2 text-xs text-muted-foreground select-none"
 >
 <Lock class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
 <span>Track downgrade managed via Partner Admin</span>
 </div>
 </div>
 </div>

 <!-- ─── CARD 2: SALES PARTNER ─── -->
 <div 
 class="rounded-2xl p-6 bg-card flex flex-col justify-between shadow-xs transition-all border border-border/80 "
 :class="partnerStore.activeTrack === 'sales' ? 'ring-2 ring-primary/40 border-primary' : ''"
 >
 <div class="space-y-4">
 <!-- Artwork Header -->
 <div 
 class="h-24 w-full flex items-center justify-center rounded-xl p-2 border transition-colors"
 :class="partnerStore.activeTrack === 'sales'
 ? 'bg-success/10 border-success/30'
 : 'bg-muted/70 border-border'
 "
 >
 <img
 src="/brand-assets/partner/referral-partner-illustration.png"
 alt="Sales Partner Graphic"
 class="h-20 w-auto object-contain drop-shadow-sm"
 loading="lazy"
 />
 </div>

 <!-- Header Info -->
 <div class="space-y-1.5">
 <div class="flex items-center justify-between">
 <h4 class="text-lg font-bold text-foreground">Sales Reseller</h4>
 <span 
 v-if="partnerStore.activeTrack === 'sales'"
 class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-primary border border-success/20 "
 >
 Active Track
 </span>
 <span 
 v-else
 class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground"
 >
 Enterprise RevShare
 </span>
 </div>
 <div class="flex items-baseline gap-1.5">
 <span class="text-2xl font-bold font-mono text-primary">15% – 25%</span>
 <span class="text-xs text-muted-foreground">recurring MRR &times; 12 months</span>
 </div>
 <p class="text-xs text-muted-foreground leading-relaxed">
 Pitch and close deals directly. Earn monthly recurring payouts for 12 months per client with guaranteed domain protection.
 </p>
 </div>

 <!-- Upgraded Tier Table -->
 <div class="rounded-xl border border-border overflow-hidden shadow-2xs">
 <table class="w-full text-left text-xs border-collapse">
 <thead>
 <tr class="bg-muted/80 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
 <th class="py-2 px-3">Tier</th>
 <th class="py-2 px-3 text-center">Deals Closed</th>
 <th class="py-2 px-3 text-right">RevShare</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border text-xs">
 <tr>
 <td class="py-2 px-3 font-semibold text-foreground">Registered</td>
 <td class="py-2 px-3 text-center text-muted-foreground font-mono">1–5</td>
 <td class="py-2 px-3 text-right font-mono font-bold text-primary">15% MRR</td>
 </tr>
 <tr :class="partnerStore.activeTrack === 'sales' ? 'bg-success/10 ' : ''">
 <td class="py-2 px-3 font-semibold text-foreground flex items-center gap-1.5">
 <span>Certified</span>
 <span v-if="partnerStore.activeTrack === 'sales'" class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary text-foreground">Current</span>
 </td>
 <td class="py-2 px-3 text-center text-muted-foreground font-mono font-bold">6–19</td>
 <td class="py-2 px-3 text-right font-mono font-bold text-primary">20% MRR</td>
 </tr>
 <tr>
 <td class="py-2 px-3 font-semibold text-foreground">Premier</td>
 <td class="py-2 px-3 text-center text-muted-foreground font-mono">20+</td>
 <td class="py-2 px-3 text-right font-mono font-bold text-primary">25% + MDF</td>
 </tr>
 </tbody>
 </table>
 </div>

 <!-- Structured Specifications -->
 <div class="space-y-2 pt-1 border-t border-border text-xs">
 <div class="flex items-center justify-between text-muted-foreground">
 <span class="text-muted-foreground">Deal Handling</span>
 <span class="font-medium text-foreground">Partner-Led Closing</span>
 </div>
 <div class="flex items-center justify-between text-muted-foreground">
 <span class="text-muted-foreground">Payout Model</span>
 <span class="font-medium text-foreground">12 monthly wire disbursements</span>
 </div>
 <div class="flex items-center justify-between text-muted-foreground">
 <span class="text-muted-foreground">Attribution</span>
 <span class="font-medium text-foreground">120-day exclusive domain lock</span>
 </div>
 </div>
 </div>

 <!-- Bottom CTA -->
 <div class="pt-4 mt-4 border-t border-border">
 <button
 v-if="partnerStore.activeTrack === 'sales'"
 type="button"
 class="w-full py-2.5 px-4 bg-primary text-foreground font-bold text-xs rounded-xl cursor-default text-center shadow-xs"
 >
 Active Track (Certified Solutions)
 </button>
 <button
 v-else
 @click="openUpgradeModal"
 type="button"
 class="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl transition-all cursor-pointer text-center shadow-xs"
 >
 Upgrade to Sales Reseller Track
 </button>
 </div>
 </div>

 </div>
 </div>

 <!-- ═════════════════════════════════════════════════════════
 SECTION 4: COMMISSION SIMULATOR (CALCULATOR)
 2-Column Layout: Controls on Left, Projections on Right
 ═════════════════════════════════════════════════════════ -->
 <div class="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-5">
 <div class="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <h3 class="text-base sm:text-lg font-bold text-foreground tracking-tight">
 Commission Simulator
 </h3>
 <p class="text-xs text-muted-foreground mt-0.5">
 Simulate monthly and annual returns across targeted client plan tiers.
 </p>
 </div>

 <!-- Track Toggle -->
 <div class="inline-flex p-1 bg-muted rounded-xl border border-border/80 text-xs self-start sm:self-auto">
 <button
 @click="simTrack = 'referral'"
 :class="[
 'px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer',
 simTrack === 'referral'
 ? 'bg-card text-primary shadow-2xs'
 : 'text-muted-foreground hover:text-foreground '
 ]"
 >
 Referral (Flat Bounty)
 </button>
 <button
 @click="simTrack = 'sales'"
 :class="[
 'px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer',
 simTrack === 'sales'
 ? 'bg-card text-primary shadow-2xs'
 : 'text-muted-foreground hover:text-foreground '
 ]"
 >
 Sales (% MRR)
 </button>
 </div>
 </div>

 <!-- 2-Column Grid -->
 <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

 <!-- Left 7 Cols: Plans Checkboxes & Slider -->
 <div class="lg:col-span-7 space-y-5">
 
 <!-- Plan Selection -->
 <div class="space-y-2">
 <div class="flex items-center justify-between text-xs">
 <span class="font-bold uppercase tracking-wider text-muted-foreground">1. Select Target Plans</span>
 <span class="text-muted-foreground font-mono">{{ selectedPlans.length }} of 4 selected</span>
 </div>

 <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 <button
 v-for="plan in availablePlans"
 :key="plan.id"
 type="button"
 @click="togglePlan(plan.id)"
 :aria-pressed="selectedPlans.includes(plan.id)"
 :class="[
 'p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5',
 selectedPlans.includes(plan.id)
 ? 'border-primary bg-success/10 shadow-2xs ring-1 ring-primary'
 : 'border-border/80 bg-transparent hover:border-border '
 ]"
 >
 <div class="flex items-center justify-between w-full">
 <span class="font-bold text-xs text-foreground">{{ plan.name }}</span>
 <span class="text-[11px] font-mono font-semibold text-muted-foreground">{{ plan.priceLabel }}</span>
 </div>
 <div class="text-[11px] font-mono text-primary font-semibold">
 {{ getPlanPayoutLabel(plan) }}
 </div>
 </button>
 </div>
 </div>

 <!-- Deal Volume Slider -->
 <div class="space-y-2.5 pt-1">
 <div class="flex items-center justify-between text-xs">
 <span class="font-bold uppercase tracking-wider text-muted-foreground">2. Estimated Closed Deals / Month</span>
 <div class="px-2.5 py-0.5 bg-success/10 border border-success/20 rounded-lg">
 <span class="font-mono font-bold text-primary">{{ simDealsPerMonth }}</span>
 <span class="text-[11px] text-muted-foreground ml-1">deals/mo</span>
 </div>
 </div>

 <div class="space-y-1.5">
 <input
 type="range"
 min="1"
 max="50"
 aria-label="Target Closed Deals per Month"
 aria-valuemin="1"
 aria-valuemax="50"
 :aria-valuenow="simDealsPerMonth"
 v-model.number="simDealsPerMonth"
 class="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
 />
 <div class="flex justify-between text-[10px] font-mono text-muted-foreground">
 <span>1 deal</span>
 <span>10 deals</span>
 <span>25 deals</span>
 <span>50 deals/mo</span>
 </div>
 </div>
 </div>

 </div>

 <!-- Right 5 Cols: Projected Results Card (Quiet Executive Card) -->
 <div class="lg:col-span-5 bg-card text-foreground rounded-xl p-5 border border-border flex flex-col justify-between space-y-4 shadow-xs">
 <div class="space-y-4">
 <div class="flex items-center justify-between border-b border-border pb-2.5">
 <span class="text-xs font-bold text-muted-foreground">Projected Cashflow</span>
 <span class="px-2 py-0.5 rounded-full text-[10px] font-mono text-success bg-success/20 border border-success/20">
 {{ simTrack === 'referral' ? 'Flat Bounty' : 'Recurring MRR' }}
 </span>
 </div>

 <!-- Monthly Projection -->
 <div class="space-y-1">
 <span class="text-xs text-muted-foreground">Estimated Monthly Return</span>
 <p class="text-3xl font-bold font-mono text-primary tracking-tight">
 {{ simMonthlyEarningsFormatted }}
 </p>
 <p class="text-[11px] text-muted-foreground font-mono">
 <span v-if="simTrack === 'referral'">
 {{ simDealsPerMonth }} deals &times; RM {{ currentReferralBounty }} flat bounty
 </span>
 <span v-else>
 {{ simDealsPerMonth }} deals &times; ~RM {{ selectedAvgMrr }} MRR &times; {{ Math.round(currentSalesPercent * 100) }}%
 </span>
 </p>
 </div>

 <!-- Annualized Projection -->
 <div class="space-y-1 pt-2.5 border-t border-border">
 <span class="text-xs text-muted-foreground">Annualized Run-Rate</span>
 <p class="text-xl font-bold font-mono text-foreground">
 {{ simAnnualEarningsFormatted }}
 </p>
 <p class="text-[11px] text-muted-foreground">
 12-month cumulative portfolio earnings
 </p>
 </div>

 <!-- Milestone / Program Rate Block -->
 <div class="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
 <span class="text-[10px] uppercase font-bold text-success">
 {{ simTrack === 'referral' ? 'Program Compensation' : 'Milestone Unlocked' }}
 </span>
 <p class="text-xs font-bold text-foreground">{{ simQualifiedTier.name }}</p>
 <div class="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
 <span>{{ simQualifiedTier.rateSummary }}</span>
 <span class="text-muted-foreground">{{ simQualifiedTier.clearanceDays }}</span>
 </div>
 </div>
 </div>

 <div class="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
 <span>Distributed in MYR</span>
 <span>Direct Bank Wire</span>
 </div>
 </div>

 </div>
 </div>

 <!-- ═════════════════════════════════════════════════════════
 SECTION 5: PARTNER KIT CALLOUT (Tight horizontal bar)
 ═════════════════════════════════════════════════════════ -->
 <div class="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-lg bg-success/10 text-primary flex items-center justify-center shrink-0">
 <Package class="w-4 h-4" />
 </div>
 <div>
 <h4 class="text-xs sm:text-sm font-bold text-foreground">Need sales decks and WhatsApp outreach templates?</h4>
 <p class="text-xs text-muted-foreground">
 Download ready-to-use pitch materials, product one-pagers, and competitive battlecards.
 </p>
 </div>
 </div>

 <router-link
 to="/partner/kit"
 class="px-3.5 py-1.5 text-xs font-bold text-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
 >
 <span>Partner Kit</span>
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
 class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card/70 backdrop-blur-xs animate-in fade-in duration-150"
 @click.self="showShareModal = false"
 >
 <div class="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
 <div class="flex items-center justify-between border-b border-border pb-3">
 <div class="flex items-center gap-2">
 <div class="w-8 h-8 rounded-lg bg-success/10 text-primary flex items-center justify-center">
 <Share2 class="w-4 h-4" />
 </div>
 <div>
 <h3 class="text-base font-bold text-foreground">Share Your Partner Link</h3>
 <p class="text-xs text-muted-foreground">All signups attribute directly to your partner ID</p>
 </div>
 </div>
 <button @click="showShareModal = false" class="text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
 </div>

 <div class="space-y-3 text-xs">
 <div class="space-y-1">
 <label class="font-semibold text-foreground">Your Unique Referral URL</label>
 <div class="flex gap-2">
 <input
 type="text"
 readonly
 :value="referralLink"
 class="w-full px-3 py-2 bg-muted border border-border rounded-xl font-mono text-foreground text-xs select-all"
 />
 <button
 @click="copyReferralLink"
 class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all cursor-pointer shrink-0"
 >
 {{ isLinkCopied ? 'Copied' : 'Copy' }}
 </button>
 </div>
 </div>

 <div class="p-3 bg-success/10 rounded-xl border border-success/20 text-[11px] text-success space-y-1">
 <p class="font-semibold text-success ">Attribution Rules:</p>
 <p>· 90-day cookie window preserves your referral even if the client decides later.</p>
 <p>· Earn RM 300 immediately upon paid subscription activation.</p>
 </div>
 </div>

 <div class="flex justify-end pt-3 border-t border-border">
 <button
 @click="showShareModal = false"
 class="px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl cursor-pointer"
 >
 Close
 </button>
 </div>
 </div>
 </div>

 <!-- ═════════════════════════════════════════════════════════
 MODAL 2: UPGRADE TO SALES RESELLER (TERMS & AGREEMENT)
 ═════════════════════════════════════════════════════════ -->
 <div
 v-if="showUpgradeModal"
 class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card/70 backdrop-blur-xs animate-in fade-in duration-150"
 @click.self="showUpgradeModal = false"
 >
 <div class="bg-card border border-border rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
 
 <!-- Modal Header -->
 <div class="flex items-start justify-between border-b border-border pb-3 shrink-0">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-xl bg-success/10 text-primary border border-success/20 flex items-center justify-center shrink-0">
 <Sparkles class="w-5 h-5 text-primary" />
 </div>
 <div>
 <div class="flex items-center gap-2">
 <span class="text-[10px] font-bold uppercase tracking-wider text-primary bg-success/10 px-2 py-0.5 rounded-md border border-success/20 ">
 Track Accreditation Upgrade
 </span>
 </div>
 <h3 class="text-base font-bold text-foreground mt-0.5">
 Upgrade to Accredited Sales Reseller
 </h3>
 </div>
 </div>
 <button 
 @click="showUpgradeModal = false" 
 class="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted "
 aria-label="Close modal"
 >
 ✕
 </button>
 </div>

 <!-- Scrollable Modal Content -->
 <div class="overflow-y-auto pr-1 space-y-4 flex-1 text-xs text-muted-foreground">
 
 <!-- Section 1: What is Happening & Key Enhancements -->
 <div class="p-3.5 rounded-xl bg-success/[0.04] border border-success/30 space-y-2.5">
 <h4 class="font-bold text-foreground flex items-center gap-1.5 text-xs">
 <ShieldCheck class="w-4 h-4 text-primary" />
 <span>What is happening with this upgrade?</span>
 </h4>
 <p class="text-[11.5px] text-muted-foreground leading-relaxed">
 You are migrating from the hands-off fixed referral bounty model (<span class="font-semibold text-foreground ">RM 300 / deal</span>) to the Accredited Sales Reseller track. Here is what activates immediately:
 </p>
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
 <div class="p-2.5 rounded-lg bg-card border border-success/30 space-y-0.5">
 <p class="font-bold text-foreground flex items-center gap-1">
 <Check class="w-3.5 h-3.5 text-primary" />
 <span>15% – 25% Recurring MRR</span>
 </p>
 <p class="text-[10.5px] text-muted-foreground">Monthly wire distributions for 12 continuous months per client.</p>
 </div>
 <div class="p-2.5 rounded-lg bg-card border border-success/30 space-y-0.5">
 <p class="font-bold text-foreground flex items-center gap-1">
 <Check class="w-3.5 h-3.5 text-primary" />
 <span>120-Day Exclusive Domain Lock</span>
 </p>
 <p class="text-[10.5px] text-muted-foreground">Registered prospect domains are shielded against conflicting channels.</p>
 </div>
 <div class="p-2.5 rounded-lg bg-card border border-success/30 space-y-0.5">
 <p class="font-bold text-foreground flex items-center gap-1">
 <Check class="w-3.5 h-3.5 text-primary" />
 <span>Dedicated Partner Manager</span>
 </p>
 <p class="text-[10.5px] text-muted-foreground">Direct co-selling assistance, RFP reviews, and marketing collateral.</p>
 </div>
 <div class="p-2.5 rounded-lg bg-card border border-success/30 space-y-0.5">
 <p class="font-bold text-foreground flex items-center gap-1">
 <Check class="w-3.5 h-3.5 text-primary" />
 <span>Partner-Led Deal Closing</span>
 </p>
 <p class="text-[10.5px] text-muted-foreground">You run sales demos and negotiations directly with your clients.</p>
 </div>
 </div>
 </div>

 <!-- Section 2: Reseller Agreement & Policy Terms -->
 <div class="space-y-2">
 <h4 class="font-bold text-foreground flex items-center gap-1.5 text-xs">
 <FileText class="w-3.5 h-3.5 text-muted-foreground" />
 <span>Reseller Agreement &amp; Operating Terms</span>
 </h4>
 <div class="p-3 rounded-xl bg-muted border border-border space-y-2 text-[11px] leading-relaxed max-h-36 overflow-y-auto">
 <p>
 <strong>1. Ethical Representation:</strong> As an Accredited Reseller, you agree to represent RakanSales features, capabilities, and subscription commitments accurately and ethically.
 </p>
 <p>
 <strong>2. Exclusive 120-Day Lock Policy:</strong> Prospect domains registered in your Deals Pipeline are reserved exclusively for you for 120 days. Deal locks require verified client interaction to remain active.
 </p>
 <p>
 <strong>3. Recurring Disbursements:</strong> RevShare commissions are calculated on active, cleared customer subscription charges and disbursed on the 5th business day of each calendar month.
 </p>
 <p>
 <strong>4. Admin-Only Downgrade Policy:</strong> To protect ongoing 12-month recurring revenue contracts and assigned domain allocations, switching back from the Sales Reseller track to the Referral track cannot be done via self-service and must be requested through Partner Administration.
 </p>
 </div>
 </div>

 <!-- Section 3: Acceptance Checkbox -->
 <div class="p-3 rounded-xl bg-muted border border-border/80">
 <label class="flex items-start gap-2.5 cursor-pointer">
 <input
 type="checkbox"
 v-model="hasAcceptedTerms"
 class="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer accent-primary"
 />
 <span class="text-xs text-foreground leading-normal select-none">
 I understand the requirements of the Sales Reseller track and agree to the <strong>Partner Operating Terms</strong>. I acknowledge that track downgrades are managed via Partner Admin.
 </span>
 </label>
 </div>

 </div>

 <!-- Modal Footer Actions -->
 <div class="flex items-center justify-between pt-3 border-t border-border shrink-0">
 <button
 type="button"
 @click="showUpgradeModal = false"
 class="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl cursor-pointer transition-colors"
 >
 Cancel
 </button>
 <button
 type="button"
 :disabled="!hasAcceptedTerms"
 @click="confirmUpgrade"
 class="px-5 py-2 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs"
 :class="hasAcceptedTerms
 ? 'bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer active:scale-98'
 : 'bg-border text-muted-foreground cursor-not-allowed'
 "
 >
 <span>Accept Terms &amp; Activate Track</span>
 <ArrowRight class="w-3.5 h-3.5" />
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
 class="fixed top-4 right-4 z-50 bg-muted text-foreground px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-border"
 >
 <span class="w-2 h-2 rounded-full bg-primary"></span>
 <span>{{ toastMessage }}</span>
 <button @click="toastMessage = ''" class="ml-2 text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Dismiss toast">✕</button>
 </div>
 </transition>

 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePartnerStore } from '@/stores/partner';
import {
 ArrowLeft,
 ArrowRight,
 ArrowUpRight,
 Share2,
 Copy,
 Briefcase,
 Package,
 Check,
 Sparkles,
 Award,
 ShieldCheck,
 Lock,
 FileText,
} from 'lucide-vue-next';

const partnerStore = usePartnerStore();
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
const hasAcceptedTerms = ref(false);
const isLinkCopied = ref(false);
const referralCode = 'O45HKSYS';
const referralLink = `https://app.rakansales.com/ref/${referralCode}`;

function openUpgradeModal() {
 hasAcceptedTerms.value = false;
 showUpgradeModal.value = true;
}

function confirmUpgrade() {
 if (!hasAcceptedTerms.value) return;
 partnerStore.setTrack('sales');
 showUpgradeModal.value = false;
 showToast('Congratulations! You are now an Accredited Sales Reseller.');
}

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

// ═════════════════════════════════════════════════════════
// SIMULATOR REACTIVE LOGIC
// ═════════════════════════════════════════════════════════
const simTrack = ref<'referral' | 'sales'>('referral');
const simDealsPerMonth = ref(6);

interface PlanItem {
 id: string;
 name: string;
 priceLabel: string;
 mrr: number;
}

const availablePlans: PlanItem[] = [
 {
 id: 'basic',
 name: 'Basic Plan',
 priceLabel: 'RM 150/mo',
 mrr: 150,
 },
 {
 id: 'pro',
 name: 'Pro Plan',
 priceLabel: 'RM 750/mo',
 mrr: 750,
 },
 {
 id: 'growth',
 name: 'Growth Plan',
 priceLabel: 'RM 1,500/mo',
 mrr: 1500,
 },
 {
 id: 'enterprise',
 name: 'Enterprise Plan',
 priceLabel: 'RM 3,500/mo',
 mrr: 3500,
 },
];

const selectedPlans = ref<string[]>(['pro', 'growth']);

function togglePlan(planId: string) {
 if (selectedPlans.value.includes(planId)) {
 if (selectedPlans.value.length > 1) {
 selectedPlans.value = selectedPlans.value.filter(id => id !== planId);
 }
 } else {
 selectedPlans.value.push(planId);
 }
}

const activePlans = computed(() => {
 if (selectedPlans.value.length === 0) {
 return [availablePlans[1]];
 }
 return availablePlans.filter(p => selectedPlans.value.includes(p.id));
});

// Current Rate based on Track and Deals Volume (Fixed RM 300 for Referral)
const currentReferralBounty = computed(() => {
 return 300;
});

const currentSalesPercent = computed(() => {
 const d = simDealsPerMonth.value;
 if (d >= 50) return 0.25;
 if (d >= 20) return 0.20;
 return 0.15;
});

// Dynamic Expected Payout per plan displayed on the plan cards
function getPlanPayoutLabel(plan: PlanItem) {
 if (simTrack.value === 'referral') {
 return `RM ${currentReferralBounty.value} / signup`;
 } else {
 const monthlyAmt = Math.round(plan.mrr * currentSalesPercent.value);
 const annualAmt = monthlyAmt * 12;
 const pct = Math.round(currentSalesPercent.value * 100);
 return `${pct}% MRR (RM ${monthlyAmt}/mo • RM ${annualAmt.toLocaleString()}/yr)`;
 }
}

const simQualifiedTier = computed(() => {
 const d = simDealsPerMonth.value;
 if (simTrack.value === 'referral') {
 return {
 name: 'Fixed Referral Bounty (RM 300 / deal)',
 rateSummary: 'RM 300 / signup · Zero quotas',
 clearanceDays: '30-Day Cycle',
 };
 } else {
 if (d >= 20) {
 return {
 name: 'Premier Reseller (25% MRR + MDF)',
 rateSummary: '25% of MRR &times; 12 Months',
 clearanceDays: 'Monthly Wire',
 };
 }
 if (d >= 6) {
 return {
 name: 'Certified Solutions Partner (20% MRR)',
 rateSummary: '20% of MRR &times; 12 Months',
 clearanceDays: 'Monthly Wire',
 };
 }
 return {
 name: 'Registered Reseller (15% MRR)',
 rateSummary: '15% of MRR &times; 12 Months',
 clearanceDays: 'Monthly Wire',
 };
 }
});

// Average MRR across selected plans
const selectedAvgMrr = computed(() => {
 const plans = activePlans.value;
 return Math.round(plans.reduce((acc, p) => acc + p.mrr, 0) / plans.length);
});

// Monthly earnings
const simMonthlyEarnings = computed(() => {
 const d = simDealsPerMonth.value;
 if (simTrack.value === 'referral') {
 return d * currentReferralBounty.value;
 } else {
 return Math.round(d * selectedAvgMrr.value * currentSalesPercent.value);
 }
});

// Annual earnings
const simAnnualEarnings = computed(() => {
 return simMonthlyEarnings.value * 12;
});

const simMonthlyEarningsFormatted = computed(() => {
 return `RM ${simMonthlyEarnings.value.toLocaleString()}`;
});

const simAnnualEarningsFormatted = computed(() => {
 return `RM ${simAnnualEarnings.value.toLocaleString()}`;
});
</script>
