<template>
  <div class="min-h-screen lg:h-screen w-full bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-foreground text-foreground overflow-x-hidden lg:overflow-hidden relative">
    <!-- ========================================================= -->
    <!-- MOBILE TOP BAR (PERSISTENT LOGO + BACK LINK)             -->
    <!-- ========================================================= -->
    <header class="sticky top-0 z-40 w-full bg-card/95 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center justify-between lg:hidden shadow-2xs">
      <router-link to="/dashboard" class="flex items-center gap-2" title="Return to RakanSales CRM">
        <img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-6 w-auto" alt="RakanSales Logo" />
      </router-link>
      <router-link
        to="/dashboard"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg border border-border bg-card shadow-2xs"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Back to CRM</span>
      </router-link>
    </header>

    <!-- ========================================================= -->
    <!-- PERSISTENT TOP-LEFT BRAND LOGO (DESKTOP ONLY)            -->
    <!-- ========================================================= -->
    <div class="hidden lg:block fixed top-5 left-8 lg:left-10 z-40">
      <router-link
        to="/dashboard"
        class="inline-block transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
        title="Return to RakanSales CRM"
      >
        <img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-7 sm:h-8 w-auto" alt="RakanSales Logo" />
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- GLOBAL TOP HEADER (TOTALLY HIDDEN, REVEALS ONLY ON HOVER) -->
    <!-- ========================================================= -->
    <div class="hidden lg:block fixed top-0 left-0 w-full z-50 group pointer-events-none">
      <!-- Invisible hover sensor strip at the top edge of viewport (absolute, zero layout impact) -->
      <div class="absolute top-0 left-0 h-6 w-full pointer-events-auto"></div>

      <!-- Hidden navigation bar, slides down smoothly flush against the top edge -->
      <header
        class="w-full bg-card/95 backdrop-blur-md border-b border-border px-6 sm:px-10 py-3 flex items-center justify-between shadow-md transition-all duration-300 ease-out transform -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-auto"
      >
        <!-- Brand Logo & Context -->
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="flex items-center gap-2.5 group/logo" title="Return to RakanSales">
            <img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-7 w-auto transition-transform group-hover/logo:scale-102" alt="RakanSales Logo" />
          </router-link>
          <span class="text-xs font-semibold text-muted-foreground select-none">/</span>
          <span class="text-xs font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20 select-none">
            Partner Network
          </span>
        </div>

        <!-- Center: Prototype Step Switcher -->
        <nav aria-label="Step progress switcher" class="hidden md:flex items-center gap-1 bg-muted/90 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            @click="goToStep(1)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
              currentStep === 1 ? 'bg-card text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="currentStep === 1 ? 'bg-primary' : 'bg-transparent'"></span>
            <span>1. Account Setup</span>
          </button>
          <button
            type="button"
            @click="goToStep(2)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
              currentStep === 2 ? 'bg-card text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="currentStep === 2 ? 'bg-primary' : 'bg-transparent'"></span>
            <span>2. {{ userType === 'existing' ? 'Link CRM' : 'Partner Track' }}</span>
          </button>
          <button
            type="button"
            @click="goToStep(3)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
              currentStep === 3 ? 'bg-card text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="currentStep === 3 ? 'bg-primary' : 'bg-transparent'"></span>
            <span>3. {{ userType === 'existing' ? 'Partner Track' : 'Account Details' }}</span>
          </button>
          <button
            type="button"
            @click="goToStep(4)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
              currentStep === 4 ? 'bg-primary text-primary-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            <span>Success</span>
          </button>
        </nav>

        <!-- Right: Escape hatch back to CRM Dashboard -->
        <div class="flex items-center gap-3">
          <router-link
            to="/dashboard"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-lg transition-colors border border-border shadow-2xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Back to CRM</span>
          </router-link>
        </div>
      </header>
    </div>

    <!-- Full-Screen Split Stage: Form Area (Left) + Visual Canvas (Right) -->
    <div class="flex-1 flex flex-col lg:flex-row w-full min-h-0 relative overflow-x-hidden lg:overflow-hidden">
      <!-- ========================================================= -->
      <!-- LEFT PANE: PIXEL-PERFECT ANCHORED REGISTRATION WIZARD    -->
      <!-- ========================================================= -->
      <section
        aria-label="Registration Form Container"
        :class="[
          isRightPaneHovered ? 'lg:w-1/2' : 'lg:w-[70%]',
          'w-full flex-1 lg:h-full flex flex-col justify-start lg:justify-between px-4 sm:px-8 md:px-12 lg:px-14 xl:px-20 py-5 sm:py-7 lg:pt-8 lg:pb-4 bg-background lg:border-r border-border overflow-y-auto relative transition-all duration-500 ease-out'
        ]"
      >
        <!-- BALANCED WIZARD CONTAINER (Generous Breathing Room, Never Mushed) -->
        <div class="w-full max-w-xl mx-auto flex-1 flex flex-col justify-start lg:justify-center min-h-0 py-1 sm:py-2">
          <!-- WIZARD STAGE (Adaptive on Mobile, Anchored on Desktop) -->
          <div class="w-full min-h-0 lg:h-[660px] flex flex-col justify-start lg:justify-between gap-5 sm:gap-6 lg:gap-0 shrink-0">
            <!-- 1. STEPPER PROGRESS BAR (Fixed Height & Position on Desktop) -->
            <div class="h-auto lg:h-[32px] shrink-0">
              <div v-if="currentStep <= 3" class="w-full space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-primary tracking-wide uppercase text-[11px]">
                    Step {{ currentStep }} of 3
                  </span>
                  <span class="text-muted-foreground font-medium text-[11px]">
                    {{ currentStepIndicatorLabel }}
                  </span>
                </div>

                <!-- Progress Segment Bars -->
                <div class="grid grid-cols-3 gap-2" role="progressbar" :aria-valuenow="currentStep" aria-valuemin="1" aria-valuemax="3">
                  <div class="h-1.5 rounded-full transition-all duration-300" :class="currentStep >= 1 ? 'bg-primary' : 'bg-muted'"></div>
                  <div class="h-1.5 rounded-full transition-all duration-300" :class="currentStep >= 2 ? 'bg-primary' : 'bg-muted'"></div>
                  <div class="h-1.5 rounded-full transition-all duration-300" :class="currentStep >= 3 ? 'bg-primary' : 'bg-muted'"></div>
                </div>
              </div>
              <div v-else class="h-[27px]"></div>
            </div>

            <!-- 2. STEP TITLE & SUBTITLE BLOCK -->
            <div
              class="min-h-0 lg:h-[54px] shrink-0 text-center flex flex-col justify-center transition-opacity duration-200"
              :class="currentStep === 4 ? 'opacity-0 pointer-events-none' : ''"
            >
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-tight">
                {{ currentStepTitle }}
              </h1>
              <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                {{ currentStepSubtitle }}
              </p>
            </div>

            <!-- 3. STEP CONTENT (Spacious Stage with Natural Top-Down Flow) -->
            <div class="min-h-0 lg:min-h-[375px] lg:h-[395px] shrink-0 flex flex-col justify-start">
          <!-- ============================================================== -->
          <!-- STEP 1: CHOOSE ACCOUNT STATUS (NEW USER VS EXISTING CUSTOMER)  -->
          <!-- ============================================================== -->
          <div v-if="currentStep === 1" class="flex flex-col justify-start animate-in fade-in-50 duration-200 pt-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <!-- Card 1: New Partner -->
              <div
                role="button"
                tabindex="0"
                @click="userType = 'new'"
                @keydown.enter.prevent="userType = 'new'"
                @keydown.space.prevent="userType = 'new'"
                class="group relative rounded-2xl border-2 p-4.5 sm:p-7 flex flex-col justify-start gap-3 sm:gap-4 cursor-pointer transition-all text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-0 sm:min-h-[200px]"
                :class="[
                  userType === 'new'
                    ? 'border-primary bg-success/10 ring-2 ring-primary/15 shadow-xs'
                    : 'border-border bg-card hover:border-border hover:bg-card'
                ]"
              >
                <!-- Top Header Row -->
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
                    New
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="userType === 'new' ? 'border-primary bg-primary text-primary-foreground shadow-xs' : 'border-border bg-card'"
                  >
                    <Check v-if="userType === 'new'" class="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <!-- Info -->
                <div class="space-y-1.5">
                  <h3 class="font-bold text-foreground text-base sm:text-lg">New Partner Account</h3>
                  <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Create a dedicated partner login to start referring businesses and receiving payouts.
                  </p>
                </div>
              </div>

              <!-- Card 2: Already Using RakanSales -->
              <div
                role="button"
                tabindex="0"
                @click="userType = 'existing'"
                @keydown.enter.prevent="userType = 'existing'"
                @keydown.space.prevent="userType = 'existing'"
                class="group relative rounded-2xl border-2 p-4.5 sm:p-7 flex flex-col justify-start gap-3 sm:gap-4 cursor-pointer transition-all text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-0 sm:min-h-[200px]"
                :class="[
                  userType === 'existing'
                    ? 'border-primary bg-success/10 ring-2 ring-primary/15 shadow-xs'
                    : 'border-border bg-card hover:border-border hover:bg-card'
                ]"
              >
                <!-- Top Header Row -->
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
                    Existing
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="userType === 'existing' ? 'border-primary bg-primary text-primary-foreground shadow-xs' : 'border-border bg-card'"
                  >
                    <Check v-if="userType === 'existing'" class="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <!-- Info -->
                <div class="space-y-1.5">
                  <h3 class="font-bold text-foreground text-base sm:text-lg">Link Existing Account</h3>
                  <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Connect your existing RakanSales login to manage CRM tools and partner earnings together.
                  </p>
                </div>
              </div>
            </div>

            <!-- Reassuring Footnote -->
            <p class="text-xs text-muted-foreground text-center leading-relaxed mt-4">
              <Info class="inline-block w-3.5 h-3.5 text-muted-foreground align-middle -translate-y-[1px] mr-1" />
              <span>Both paths include full access to referral tracking links, marketing kits, and automated payouts.</span>
            </p>
          </div>

          <!-- ============================================================== -->
          <!-- STEP 2 (EXISTING USER): LINK ACCOUNT FLOW (REFERENCE IMAGE)    -->
          <!-- ============================================================== -->
          <div
            v-else-if="currentStep === 2 && userType === 'existing'"
            class="space-y-5 animate-in fade-in-50 duration-200 text-left pt-2"
          >
            <!-- Callout Pill: One login for both -->
            <div class="p-4 sm:p-5 rounded-2xl bg-success/10 border border-success/20 flex items-start gap-3.5">
              <div class="w-9 h-9 rounded-xl bg-card border border-success/20 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Link class="w-4.5 h-4.5 stroke-[2.5]" />
              </div>
              <p class="text-xs sm:text-[13px] text-foreground leading-relaxed font-normal">
                One login for both. Your CRM dashboard and partner earnings dashboard will share the same email and password.
              </p>
            </div>

            <!-- Input: CRM account email -->
            <div class="space-y-2">
              <label for="link-crm-email" class="block text-xs font-semibold text-foreground">
                CRM account email <span class="text-destructive">*</span>
              </label>
              <input
                id="link-crm-email"
                v-model="crmLinkEmail"
                type="email"
                required
                autocomplete="email"
                placeholder="Enter your CRM account email"
                @keydown.enter.prevent="findAccountAndContinue"
                class="w-full px-3.5 py-2.5 bg-card border border-border hover:border-border rounded-xl text-base sm:text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary shadow-2xs transition-all"
              />
              <p v-if="accountLinkError" class="text-xs text-destructive mt-1">
                {{ accountLinkError }}
              </p>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- PARTNER TRACK SELECTION (STEP 2 FOR NEW, STEP 3 FOR EXISTING)  -->
          <!-- ============================================================== -->
          <div
            v-else-if="(currentStep === 2 && userType === 'new') || (currentStep === 3 && userType === 'existing')"
            class="flex flex-col justify-start animate-in fade-in-50 duration-200 pt-1"
          >
            <!-- Linked Account Indicator Banner (For existing customers) -->
            <div
              v-if="userType === 'existing' && isAccountLinked"
              class="mb-2.5 px-3.5 py-1.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-medium flex items-center justify-between shadow-2xs"
            >
              <div class="flex items-center gap-2">
                <Check class="w-3.5 h-3.5 text-primary stroke-[3]" />
                <span>Linked CRM account: <strong class="text-foreground font-semibold">{{ crmLinkEmail }}</strong></span>
              </div>
              <button
                type="button"
                @click="goToStep(2)"
                class="text-[11px] text-primary hover:text-primary hover:underline font-semibold cursor-pointer"
              >
                Change email
              </button>
            </div>
            <!-- 2 Polished Track Cards with Clear Terminology & Earning Heroes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <!-- Card 1: Referral Partner -->
              <div
                role="button"
                tabindex="0"
                @click="selectedPartnerType = 'referral'"
                @keydown.enter.prevent="selectedPartnerType = 'referral'"
                @keydown.space.prevent="selectedPartnerType = 'referral'"
                class="group relative rounded-2xl border-2 p-4 sm:p-4.5 lg:p-5 flex flex-col justify-between cursor-pointer transition-all text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-0 sm:min-h-[275px] lg:min-h-[285px]"
                :class="[
                  selectedPartnerType === 'referral'
                    ? 'border-primary bg-success/10 ring-2 ring-primary/15 shadow-xs'
                    : 'border-border bg-card hover:border-border hover:bg-card'
                ]"
              >
                <!-- Top Header Row: Status Badge & Selection Indicator -->
                <div class="flex items-center justify-between min-h-[24px]">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
                    Recommended to Start
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="selectedPartnerType === 'referral' ? 'border-primary bg-primary text-primary-foreground shadow-xs' : 'border-border bg-card'"
                  >
                    <Check v-if="selectedPartnerType === 'referral'" class="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <!-- Graphic Hero (Swapped & Enlarged) -->
                <div class="h-24 sm:h-28 lg:h-30 w-full flex items-center justify-center py-0.5">
                  <img
                    src="/brand-assets/partner/sales-partner-illustration.png"
                    alt="Referral Partner Mascot"
                    class="max-h-22 sm:max-h-26 lg:max-h-28 max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105 duration-200"
                  />
                </div>

                <!-- Title & Description -->
                <div class="text-center space-y-1 pt-1">
                  <h3 class="font-bold text-foreground text-base sm:text-lg">Referral Partner</h3>
                  <p class="text-xs sm:text-[13px] text-muted-foreground leading-relaxed px-1">
                    Share your link with contacts. Our sales team conducts demos & closes the sale.
                  </p>
                </div>
              </div>

              <!-- Card 2: Sales Partner (Locked with Inline Modal Trigger) -->
              <div
                role="button"
                tabindex="0"
                @click="openSalesPartnerModal"
                @keydown.enter.prevent="openSalesPartnerModal"
                @keydown.space.prevent="openSalesPartnerModal"
                class="group relative rounded-2xl border-2 p-4 sm:p-4.5 lg:p-5 flex flex-col justify-between text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-0 sm:min-h-[275px] lg:min-h-[285px]"
                :class="[
                  !isSalesPartnerUnlocked
                    ? 'border-border/90 bg-muted/70 opacity-60 hover:opacity-85 hover:border-border'
                    : (selectedPartnerType === 'sales'
                      ? 'border-primary bg-success/10 ring-2 ring-primary/15 shadow-xs'
                      : 'border-border bg-card hover:border-border')
                ]"
              >
                <!-- Top Header Row: Status Badge & Lock Indicator -->
                <div class="flex items-center justify-between min-h-[24px]">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors"
                    :class="salesPartnerBadgeClass"
                  >
                    <Lock v-if="!isSalesPartnerUnlocked" class="w-3 h-3 text-muted-foreground" />
                    <Unlock v-else class="w-3 h-3 text-success" />
                    {{ isSalesPartnerUnlocked ? 'Unlocked' : 'Unlocks at 5 Deals' }}
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="selectedPartnerType === 'sales' ? 'border-primary bg-primary text-primary-foreground shadow-xs' : 'border-border bg-card'"
                  >
                    <Check v-if="selectedPartnerType === 'sales'" class="w-3 h-3 stroke-[3]" />
                    <Lock v-else-if="!isSalesPartnerUnlocked" class="w-2.5 h-2.5 text-muted-foreground" />
                  </div>
                </div>

                <!-- Graphic Hero (Swapped & Enlarged) -->
                <div
                  class="h-24 sm:h-28 lg:h-30 w-full flex items-center justify-center py-0.5 transition-all"
                  :class="!isSalesPartnerUnlocked ? 'opacity-70 grayscale-[50%]' : 'opacity-90'"
                >
                  <img
                    src="/brand-assets/partner/referral-partner-illustration.png"
                    alt="Sales Partner Mascot Team"
                    class="max-h-22 sm:max-h-26 lg:max-h-28 max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105 duration-200"
                  />
                </div>

                <!-- Title & Description -->
                <div class="text-center space-y-1 pt-1">
                  <h3
                    class="font-bold text-base sm:text-lg transition-colors"
                    :class="!isSalesPartnerUnlocked ? 'text-muted-foreground' : (selectedPartnerType === 'sales' ? 'text-foreground' : 'text-foreground')"
                  >
                    Sales Partner
                  </h3>
                  <p class="text-xs sm:text-[13px] text-muted-foreground leading-relaxed px-1">
                    Pitch leads directly and manage the full client sales cycle.
                  </p>
                </div>
              </div>
            </div>

            <!-- Clear & Reassuring Footnote with Generous Breathing Room Below -->
            <p class="text-xs text-muted-foreground text-center leading-relaxed mt-2.5 sm:mt-3 font-normal">
              <Info class="inline-block w-3.5 h-3.5 text-muted-foreground align-middle -translate-y-[1px] mr-1" />
              <span>Every new partner starts on the Referral Track. Close 5 successful referrals to unlock the recurring Sales Track.</span>
            </p>
          </div>

          <!-- ============================================== -->
          <!-- STEP 3 (NEW USER): ACCOUNT DETAILS             -->
          <!-- ============================================== -->
          <div v-else-if="currentStep === 3 && userType === 'new'" class="space-y-5 sm:space-y-5.5 animate-in fade-in-50 duration-200 text-left pt-1">
            <!-- Full Name & Company Name (No Redundant "optional") -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step2-fullname" class="block text-xs font-semibold text-foreground mb-2">
                  Full name <span class="text-destructive">*</span>
                </label>
                <input
                  id="step2-fullname"
                  v-model="partnerForm.fullName"
                  type="text"
                  required
                  autocomplete="name"
                  placeholder="e.g. Ahmad Haziq"
                  class="w-full px-3.5 py-2.5 bg-card border border-border hover:border-border rounded-xl text-base sm:text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary shadow-2xs transition-all"
                />
              </div>
              <div>
                <label for="step2-company" class="block text-xs font-semibold text-foreground mb-2">
                  Company or agency name
                </label>
                <input
                  id="step2-company"
                  v-model="partnerForm.companyName"
                  type="text"
                  autocomplete="organization"
                  placeholder="e.g. Syarikat Sdn Bhd or Studio Name"
                  class="w-full px-3.5 py-2.5 bg-card border border-border hover:border-border rounded-xl text-base sm:text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary shadow-2xs transition-all"
                />
              </div>
            </div>

            <!-- Email Address & WhatsApp Number -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step2-email" class="block text-xs font-semibold text-foreground mb-2">
                  Work email address <span class="text-destructive">*</span>
                </label>
                <input
                  id="step2-email"
                  v-model="partnerForm.email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="ahmad@company.com"
                  class="w-full px-3.5 py-2.5 bg-card border border-border hover:border-border rounded-xl text-base sm:text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary shadow-2xs transition-all"
                />
              </div>
              <div>
                <label for="step2-whatsapp" class="block text-xs font-semibold text-foreground mb-2">
                  WhatsApp mobile number <span class="text-destructive">*</span>
                </label>
                <div class="relative flex items-center">
                  <div class="absolute left-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground select-none border-r border-border pr-2">
                    <span class="text-sm leading-none">🇲🇾</span>
                    <span>+60</span>
                  </div>
                  <input
                    id="step2-whatsapp"
                    v-model="partnerForm.whatsapp"
                    type="tel"
                    required
                    autocomplete="tel"
                    placeholder="12-345 6789"
                    class="w-full pl-20 pr-3.5 py-2.5 bg-card border border-border hover:border-border rounded-xl text-base sm:text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary shadow-2xs transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Password & Confirm Password -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step2-password" class="block text-xs font-semibold text-foreground mb-2">
                  Create password <span class="text-destructive">*</span>
                </label>
                <div class="relative">
                  <input
                    id="step2-password"
                    v-model="partnerForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="new-password"
                    placeholder="Minimum 8 characters"
                    class="w-full pl-3.5 pr-9 py-2.5 bg-card border border-border hover:border-border rounded-xl text-base sm:text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary shadow-2xs transition-all"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground cursor-pointer focus-visible:outline-none rounded"
                    title="Toggle password view"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <Eye v-if="!showPassword" class="w-3.5 h-3.5" />
                    <EyeOff v-else class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <label for="step2-confirm-pwd" class="block text-xs font-semibold text-foreground mb-2">
                  Confirm password <span class="text-destructive">*</span>
                </label>
                <input
                  id="step2-confirm-pwd"
                  v-model="partnerForm.confirmPassword"
                  type="password"
                  required
                  autocomplete="new-password"
                  placeholder="Re-enter your password"
                  class="w-full px-3.5 py-2.5 bg-card border border-border hover:border-border rounded-xl text-base sm:text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary shadow-2xs transition-all"
                />
              </div>
            </div>

            <!-- Redesigned Password Security Strength Card -->
            <div class="p-3 sm:p-3.5 bg-card/95 rounded-xl border border-border/90 shadow-2xs space-y-2.5">
              <!-- Top Header: Shield Icon, Title, and Dynamic Status Pill -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div
                    v-if="passwordStrengthScore === 4"
                    class="w-5 h-5 rounded-lg flex items-center justify-center bg-success/15 text-success transition-colors"
                  >
                    <ShieldCheck class="w-3.5 h-3.5" />
                  </div>
                  <div
                    v-else
                    class="w-5 h-5 rounded-lg flex items-center justify-center bg-muted text-muted-foreground transition-colors"
                  >
                    <ShieldCheck class="w-3.5 h-3.5" />
                  </div>
                  <span class="text-xs font-semibold text-foreground">Password security</span>
                </div>
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-200"
                  :class="passwordStrengthBadgeClass"
                >
                  <Sparkles v-if="passwordStrengthScore === 4" class="w-2.5 h-2.5 text-success" />
                  {{ passwordStrengthLabel }}
                </span>
              </div>

              <!-- Segmented Progress Track with Smooth Pulse Fill -->
              <div class="grid grid-cols-4 gap-1.5 h-1.5">
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 1 ? passwordStrengthBg : 'bg-muted'"></div>
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 2 ? passwordStrengthBg : 'bg-muted'"></div>
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 3 ? passwordStrengthBg : 'bg-muted'"></div>
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 4 ? passwordStrengthBg : 'bg-muted'"></div>
              </div>

              <!-- Sleek Criteria Checklist with Micro Indicator Pills -->
              <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5 text-[11px]">
                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="partnerForm.password.length >= 8 ? 'text-success font-medium' : 'text-muted-foreground'"
                >
                  <div
                    v-if="partnerForm.password.length >= 8"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-success/15 text-success shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-muted shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-muted"></div>
                  </div>
                  <span>Min 8 characters</span>
                </div>

                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="/[A-Z]/.test(partnerForm.password) ? 'text-success font-medium' : 'text-muted-foreground'"
                >
                  <div
                    v-if="/[A-Z]/.test(partnerForm.password)"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-success/15 text-success shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-muted shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-muted"></div>
                  </div>
                  <span>Uppercase letter</span>
                </div>

                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="/[a-z]/.test(partnerForm.password) ? 'text-success font-medium' : 'text-muted-foreground'"
                >
                  <div
                    v-if="/[a-z]/.test(partnerForm.password)"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-success/15 text-success shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-muted shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-muted"></div>
                  </div>
                  <span>Lowercase letter</span>
                </div>

                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="partnerForm.password && partnerForm.password === partnerForm.confirmPassword ? 'text-success font-medium' : 'text-muted-foreground'"
                >
                  <div
                    v-if="partnerForm.password && partnerForm.password === partnerForm.confirmPassword"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-success/15 text-success shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-muted shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-muted"></div>
                  </div>
                  <span>Passwords match</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- REFERRAL PROFILE (TEMPORARILY HIDDEN PER USER REQUEST)         -->
          <!-- ============================================================== -->
          <template v-if="false">
            <div class="space-y-5 sm:space-y-5.5 animate-in fade-in-50 duration-200 text-left pt-1">
              <!-- Row 1: Industry + Discovery Source (2 Cols) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label for="step3-industry" class="block text-xs font-semibold text-foreground mb-2">
                    Primary client industry
                  </label>
                  <div class="relative">
                    <select
                      id="step3-industry"
                      v-model="partnerForm.industry"
                      class="w-full pl-3.5 pr-8 py-2.5 bg-card border border-border hover:border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-2xs transition-all cursor-pointer appearance-none"
                      :class="partnerForm.industry ? 'text-foreground' : 'text-muted-foreground'"
                    >
                      <option value="" class="text-muted-foreground">Select one (optional)</option>
                      <option value="ecommerce" class="text-foreground">Retail & E-commerce</option>
                      <option value="realestate" class="text-foreground">Real Estate & Property Development</option>
                      <option value="agency" class="text-foreground">Marketing & Digital Agency</option>
                      <option value="tech" class="text-foreground">IT Consulting & Software Services</option>
                      <option value="fnb" class="text-foreground">Food & Beverage / Hospitality</option>
                      <option value="financial" class="text-foreground">Financial Services & Insurance</option>
                      <option value="other" class="text-foreground">Other B2B Sector</option>
                    </select>
                    <ChevronDown class="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label for="step3-source" class="block text-xs font-semibold text-foreground mb-2">
                    How did you discover our program?
                  </label>
                  <div class="relative">
                    <select
                      id="step3-source"
                      v-model="partnerForm.source"
                      class="w-full pl-3.5 pr-8 py-2.5 bg-card border border-border hover:border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-2xs transition-all cursor-pointer appearance-none"
                      :class="partnerForm.source ? 'text-foreground' : 'text-muted-foreground'"
                    >
                      <option value="" class="text-muted-foreground">Select one (optional)</option>
                      <option value="friend" class="text-foreground">Colleague or Friend</option>
                      <option value="social" class="text-foreground">LinkedIn / Social Media</option>
                      <option value="search" class="text-foreground">Google Search</option>
                      <option value="event" class="text-foreground">Tech Event / Webinar</option>
                      <option value="customer" class="text-foreground">Existing RakanSales Customer</option>
                      <option value="other" class="text-foreground">Other Channel</option>
                    </select>
                    <ChevronDown class="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <!-- Row 2: Referral Method + Monthly Reach (2 Cols) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label for="step3-refer-channel" class="block text-xs font-semibold text-foreground mb-2">
                    Primary referral channel
                  </label>
                  <div class="relative">
                    <select
                      id="step3-refer-channel"
                      v-model="partnerForm.referMethod"
                      class="w-full pl-3.5 pr-8 py-2.5 bg-card border border-border hover:border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-2xs transition-all cursor-pointer appearance-none"
                      :class="partnerForm.referMethod ? 'text-foreground' : 'text-muted-foreground'"
                    >
                      <option value="" class="text-muted-foreground">Select one (optional)</option>
                      <option value="network" class="text-foreground">Personal & Business Network</option>
                      <option value="clients" class="text-foreground">Existing Corporate Client Base</option>
                      <option value="whatsapp" class="text-foreground">WhatsApp & Business Communities</option>
                      <option value="content" class="text-foreground">Content Marketing & Social Media</option>
                      <option value="other" class="text-foreground">Direct Outreach</option>
                    </select>
                    <ChevronDown class="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label for="step3-monthly-reach" class="block text-xs font-semibold text-foreground mb-2">
                    Estimated monthly reach
                  </label>
                  <div class="relative">
                    <select
                      id="step3-monthly-reach"
                      v-model="partnerForm.monthlyReach"
                      class="w-full pl-3.5 pr-8 py-2.5 bg-card border border-border hover:border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-2xs transition-all cursor-pointer appearance-none"
                      :class="partnerForm.monthlyReach ? 'text-foreground' : 'text-muted-foreground'"
                    >
                      <option value="" class="text-muted-foreground">Select one (optional)</option>
                      <option value="1-10" class="text-foreground">1 – 10 businesses / month</option>
                      <option value="11-50" class="text-foreground">11 – 50 businesses / month</option>
                      <option value="51-200" class="text-foreground">51 – 200 businesses / month</option>
                      <option value="200+" class="text-foreground">200+ businesses / month</option>
                    </select>
                    <ChevronDown class="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <!-- Row 3: Prior B2B/SaaS Referral Experience -->
              <div>
                <label for="step3-prev-exp" class="block text-xs font-semibold text-foreground mb-2">
                  Have you referred SaaS or B2B tools before?
                </label>
                <div class="relative">
                  <select
                    id="step3-prev-exp"
                    v-model="partnerForm.previousReferral"
                    class="w-full pl-3.5 pr-8 py-2.5 bg-card border border-border hover:border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-2xs transition-all cursor-pointer appearance-none"
                    :class="partnerForm.previousReferral ? 'text-foreground' : 'text-muted-foreground'"
                  >
                    <option value="" class="text-muted-foreground">Select one (optional)</option>
                    <option value="yes-regularly" class="text-foreground">Yes, I regularly refer software and tools</option>
                    <option value="yes-few" class="text-foreground">Yes, I have referred business services occasionally</option>
                    <option value="no-first-time" class="text-foreground">No, this is my first referral program</option>
                  </select>
                  <ChevronDown class="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <!-- Quality Checkbox (Clean & Light) -->
              <div class="pt-1.5">
                <label class="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground leading-relaxed">
                  <input
                    type="checkbox"
                    v-model="partnerForm.confirmedActiveBusinesses"
                    required
                    class="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span class="text-[11px] sm:text-xs">
                    I confirm that I will refer active, genuine businesses and will not submit spam or cold scraped lists.
                  </span>
                </label>
              </div>

              <!-- Agreement disclaimer -->
              <p class="text-[10px] text-muted-foreground text-center pt-0.5">
                By registering, you agree to the <a href="#" class="text-primary font-medium hover:underline">Partner Agreement</a> and <a href="#" class="text-primary font-medium hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </template>

          <!-- ============================================== -->
          <!-- STEP 4: SUCCESS / CONFIRMATION (CLEAN & SIMPLE) -->
          <!-- ============================================== -->
          <div v-else-if="currentStep === 4" class="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in-50 duration-300">
            <!-- Celebratory Checkmark Icon Badge -->
            <div class="w-16 h-16 rounded-2xl bg-success/10 border-2 border-success/20 flex items-center justify-center text-primary shadow-sm mb-5">
              <Check class="w-8 h-8 stroke-[2.5]" />
            </div>

            <!-- Heading & Clarity Subtext -->
            <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2.5">
              {{ userType === 'existing' ? 'Partner Account Linked!' : 'Registration submitted!' }}
            </h2>
            <p class="text-sm text-muted-foreground max-w-sm leading-relaxed mb-5">
              <span v-if="userType === 'existing'">
                Your partner dashboard has been connected to
                <strong class="text-foreground">{{ crmLinkEmail }}</strong>. You can now use your existing CRM login to view referral leads and payouts.
              </span>
              <span v-else>
                We've sent a verification link to
                <strong class="text-foreground">{{ partnerForm.email || 'your email' }}</strong>.
                Please check your inbox to activate your account.
              </span>
            </p>

            <!-- Minimal Resend Trigger -->
            <button
              v-if="userType === 'new'"
              type="button"
              @click="resendVerificationEmail"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none"
            >
              <span v-if="emailResent" class="text-success font-bold inline-flex items-center gap-1">
                <Check class="w-3.5 h-3.5" /> Verification email resent
              </span>
              <span v-else>
                Didn't receive the email? <span class="text-primary font-semibold underline hover:text-primary">Click to resend</span>
              </span>
            </button>
          </div>
        </div>

        <!-- 4. ACTION CONTROLS (Consistent h-12 Height & text-sm Typography) -->
        <div class="min-h-[80px] lg:h-[88px] shrink-0 pt-4 lg:pt-4.5 border-t border-border/90 flex flex-col justify-between gap-2.5 lg:gap-0 mt-4 lg:mt-0">
          <!-- Step 1 Actions (Account Status) -->
          <template v-if="currentStep === 1">
            <button
              type="button"
              @click="goToStep(2)"
              class="w-full h-12 bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span>{{ userType === 'existing' ? 'Continue to Link CRM Account' : 'Continue to Track Selection' }}</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <div class="text-center pt-1">
              <router-link
                to="/auth"
                class="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
              >
                <span>Already registered as a partner?</span>
                <span class="font-semibold text-primary hover:text-primary hover:underline">Sign in</span>
              </router-link>
            </div>
          </template>

          <!-- Step 2 Actions -->
          <template v-else-if="currentStep === 2">
            <!-- Case 2A: New User (Partner Track -> Account Details) -->
            <template v-if="userType === 'new'">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="goToStep(1)"
                  class="px-5 h-12 bg-card border border-border hover:bg-muted text-foreground font-semibold text-sm rounded-xl transition-colors cursor-pointer min-w-[88px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Back
                </button>
                <button
                  type="button"
                  @click="goToStep(3)"
                  class="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span>{{ selectedPartnerType === 'sales' ? 'Continue as Sales Partner' : 'Continue as Referral Partner' }}</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>
              <div class="text-center pt-1">
                <router-link
                  to="/auth"
                  class="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                >
                  <span>Already registered as a partner?</span>
                  <span class="font-semibold text-primary hover:text-primary hover:underline">Sign in</span>
                </router-link>
              </div>
            </template>

            <!-- Case 2B: Existing User (Link Account -> Find my account & continue) -->
            <template v-else>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="goToStep(1)"
                  class="px-5 h-12 bg-card border border-border hover:bg-muted text-foreground font-semibold text-sm rounded-xl transition-colors cursor-pointer min-w-[88px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Back
                </button>
                <button
                  type="button"
                  @click="findAccountAndContinue"
                  :disabled="!crmLinkEmail || isFindingAccount"
                  class="flex-1 h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Loader2 v-if="isFindingAccount" class="w-4 h-4 animate-spin text-primary-foreground" />
                  <span v-else>Find my account & continue</span>
                </button>
              </div>
              <p class="text-xs text-muted-foreground text-center pt-1">
                You'll pick your partner type next — no need to re-enter your details.
              </p>
            </template>
          </template>

          <!-- Step 3 Actions -->
          <template v-else-if="currentStep === 3">
            <!-- Case 3A: New User (Account Details -> Submit Registration) -->
            <template v-if="userType === 'new'">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="isSubmitting"
                  @click="goToStep(2)"
                  class="px-5 h-12 bg-card border border-border hover:bg-muted text-foreground font-semibold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50 min-w-[88px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Back
                </button>
                <button
                  type="button"
                  @click="submitRegistration"
                  :disabled="isSubmitting || !partnerForm.fullName || !partnerForm.email || !partnerForm.password"
                  class="flex-1 h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin text-primary-foreground" />
                  <Sparkles v-else class="w-4 h-4" />
                  <span>{{ isSubmitting ? 'Creating partner account...' : 'Complete Partner Registration' }}</span>
                </button>
              </div>
              <div class="text-center pt-1">
                <router-link
                  to="/auth"
                  class="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                >
                  <span>Already registered as a partner?</span>
                  <span class="font-semibold text-primary hover:text-primary hover:underline">Sign in</span>
                </router-link>
              </div>
            </template>

            <!-- Case 3B: Existing User (Partner Track -> Complete Activation) -->
            <template v-else>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="isSubmitting"
                  @click="goToStep(2)"
                  class="px-5 h-12 bg-card border border-border hover:bg-muted text-foreground font-semibold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50 min-w-[88px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Back
                </button>
                <button
                  type="button"
                  @click="submitRegistration"
                  :disabled="isSubmitting"
                  class="flex-1 h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin text-primary-foreground" />
                  <Sparkles v-else class="w-4 h-4" />
                  <span>{{ isSubmitting ? (selectedPartnerType === 'sales' ? 'Activating sales track...' : 'Activating referral track...') : (selectedPartnerType === 'sales' ? 'Complete Sales Partner Setup' : 'Complete Referral Partner Setup') }}</span>
                </button>
              </div>
              <div class="text-center pt-1">
                <router-link
                  to="/auth"
                  class="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                >
                  <span>Already registered as a partner?</span>
                  <span class="font-semibold text-primary hover:text-primary hover:underline">Sign in</span>
                </router-link>
              </div>
            </template>
          </template>

          <!-- Step 4 Actions -->
          <template v-else-if="currentStep === 4">
            <button
              type="button"
              @click="goToPartnerOverview"
              class="w-full h-12 bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span>{{ userType === 'existing' ? 'Open Partner Dashboard' : 'Go to Partner Dashboard' }}</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <div class="text-center pt-1">
              <button
                type="button"
                @click="resetForm"
                class="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none"
              >
                Register another partner account
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

        <!-- 5. FOOTER (Anchored at Bottom Edge) -->
        <footer class="w-full max-w-xl mx-auto shrink-0 pt-3 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs text-muted-foreground border-t border-border/60 text-center sm:text-left">
          <p>© 2026 RakanSales</p>
          <div class="flex items-center gap-3 text-xs">
            <a href="#" class="hover:text-muted-foreground transition-colors">Terms</a>
            <span>·</span>
            <a href="#" class="hover:text-muted-foreground transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" class="hover:text-muted-foreground transition-colors">Help Center</a>
          </div>
        </footer>
      </section>

      <!-- ========================================================= -->
      <!-- RIGHT PANE: BRAND GRAPHIC & TITLE (EXPANDS 50% ON HOVER)  -->
      <!-- ========================================================= -->
      <section
        aria-label="Partner Program Showcase"
        @mouseenter="isRightPaneHovered = true"
        @mouseleave="isRightPaneHovered = false"
        :class="[
          isRightPaneHovered ? 'lg:w-1/2' : 'lg:w-[30%]',
          'hidden lg:flex bg-gradient-to-b from-card to-muted/30 flex-col justify-end items-center relative overflow-hidden select-none border-l border-success/20 p-0 transition-all duration-500 ease-out cursor-default'
        ]"
      >
        <!-- Title: Aligned middle initially, glides to top position and scales when pane expands -->
        <div
          :class="[
            isRightPaneHovered
              ? 'top-[10%] xl:top-[12%] 2xl:top-[14%] -translate-y-0 scale-120 xl:scale-130'
              : 'top-[30%] -translate-y-1/2 scale-100',
            'absolute inset-x-0 text-center px-6 z-20 pointer-events-none select-none transition-all duration-500 ease-out origin-center'
          ]"
        >
          <h2 class="text-2xl sm:text-3xl xl:text-3xl font-semibold text-foreground tracking-tight leading-[1.2]">
            Grow Together,<br />
            <span class="text-primary">Earn Together.</span>
          </h2>
        </div>

        <!-- 100% Width Graphic Aligned Bottom (Scales with Pane) -->
        <img
          src="/brand-assets/partner/partner-earnings-hero.png"
          alt="Grow Together, Earn Together with RakanSales CRM"
          class="w-full h-auto object-contain object-bottom pointer-events-none select-none block relative z-10 transition-all duration-500 ease-out"
        />
      </section>
    </div>

    <!-- ========================================================= -->
    <!-- FRIENDLY SALES TRACK MODAL (OPTION 3 ACCORDION BYPASS)    -->
    <!-- ========================================================= -->
    <div
      v-if="showUnlockModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-popover/50 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
    >
      <div class="bg-card w-full max-w-sm sm:max-w-[410px] max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl border border-border p-5 sm:p-7 space-y-4 text-center relative">
        <!-- Close Button Top Right -->
        <button
          type="button"
          @click="showUnlockModal = false"
          class="absolute top-4 right-4 text-muted-foreground hover:text-muted-foreground p-1.5 rounded-lg cursor-pointer focus-visible:outline-none transition-colors"
          aria-label="Close dialog"
        >
          <X class="w-4 h-4" />
        </button>

        <!-- Friendly Robot Illustration (Enlarged) -->
        <div class="pt-1 flex justify-center">
          <div class="w-full max-w-[260px] h-28 sm:h-32 flex items-center justify-center">
            <img
              src="/brand-assets/partner/referral-partner-illustration.png"
              alt="Sales Partner Mascot Team"
              class="max-h-full max-w-full object-contain pointer-events-none select-none drop-shadow-sm"
            />
          </div>
        </div>

        <!-- Title & Friendly Explanation -->
        <div class="space-y-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-[11px] font-semibold">
            <Lock class="w-3 h-3 stroke-[2.2]" />
            <span>Unlocks at 5 Deals</span>
          </div>

          <h3 id="unlock-modal-title" class="text-base sm:text-lg font-bold text-foreground tracking-tight">
            Sales Partner Track
          </h3>

          <p class="text-xs text-muted-foreground leading-relaxed font-normal px-1">
            New partners begin on the Referral Track. Close 5 successful referrals to automatically unlock recurring sales commissions.
          </p>
        </div>

        <!-- Optional Expandable "Have a code?" Section -->
        <div class="pt-2 border-t border-border">
          <button
            type="button"
            @click="showCodeInput = !showCodeInput"
            class="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
          >
            <span>Have an approved bypass code? Enter here</span>
            <ChevronDown
              class="w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground"
              :class="showCodeInput ? 'rotate-180 text-foreground' : ''"
            />
          </button>

          <!-- Collapsible Code Input Container -->
          <div
            v-if="showCodeInput"
            class="mt-2.5 p-3 bg-muted border border-border rounded-xl space-y-2 text-left animate-in fade-in-50 duration-150"
          >
            <p class="text-[11px] text-muted-foreground font-normal">
              Enter your invitation code to bypass the 5-deal requirement:
            </p>
            <div class="flex items-center gap-2">
              <input
                v-model="partnerAccessCode"
                type="text"
                placeholder="ENTER CODE"
                @keydown.enter.prevent="submitAccessCode"
                class="flex-1 px-3 py-2 bg-card border border-border hover:border-border rounded-lg text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary caret-primary uppercase tracking-wider transition-all"
              />
              <button
                type="button"
                @click="submitAccessCode"
                class="px-3.5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                Unlock
              </button>
            </div>
            <p v-if="codeError" class="text-[11px] text-destructive font-medium">
              {{ codeError }}
            </p>
          </div>
        </div>

        <!-- Primary Welcoming Action -->
        <div class="pt-1">
          <button
            type="button"
            @click="selectReferralAndClose"
            class="w-full py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span>Continue on Referral Track</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import lightLogoUrl from '@/assets/logo/RKS Logo Lockup 01.svg';
import darkLogoUrl from '@/assets/logo/RKS Logo Lockup 02.svg';
import { useTheme } from '@/composables/useTheme';
import {
  Check,
  CheckCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  Copy,
  Loader2,
  ChevronDown,
  X,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Zap,
  Award,
  Info,
  Link,
  UserPlus,
} from 'lucide-vue-next';

const router = useRouter();
const { isDark } = useTheme();

// User flow selection ('new' user vs 'existing' CRM customer)
const userType = ref<'new' | 'existing'>('new');
const crmLinkEmail = ref('');
const isFindingAccount = ref(false);
const accountLinkError = ref('');
const isAccountLinked = ref(false);

// Current active wizard step (1 to 4)
const currentStep = ref<number>(1);
const selectedPartnerType = ref<'referral' | 'sales'>('referral');
const isSalesPartnerUnlocked = ref(false);
const showUnlockModal = ref(false);
const showCodeInput = ref(false);
const partnerAccessCode = ref('');
const codeError = ref('');
const showPassword = ref(false);
const isSubmitting = ref(false);
const isChatOpen = ref(false);
const copiedLink = ref(false);
const copiedCode = ref(false);
const isRightPaneHovered = ref(false);

// Partner registration form state
const partnerForm = reactive({
  fullName: '',
  companyName: '',
  email: '',
  whatsapp: '',
  password: '',
  confirmPassword: '',
  industry: '',
  source: '',
  referMethod: '',
  monthlyReach: '',
  previousReferral: '',
  confirmedActiveBusinesses: true,
});

const currentStepTitle = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Partner Account Setup';
    case 2:
      return userType.value === 'existing' ? 'Link your account' : 'Select your partner track';
    case 3:
      return userType.value === 'existing' ? 'Select your partner track' : 'Account details';
    case 4:
      return userType.value === 'existing' ? 'Partner Account Linked!' : 'Registration submitted!';
    default:
      return '';
  }
});

const currentStepSubtitle = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Create a new partner account, or link your existing RakanSales login to manage everything in one place.';
    case 2:
      return userType.value === 'existing'
        ? "Already a RakanSales CRM customer? Use the same email — we'll link your partner earnings to your existing login, no new password needed."
        : 'Choose how you want to earn — share links for quick cash bonuses, or manage sales for recurring revenue.';
    case 3:
      return userType.value === 'existing'
        ? 'Choose how you want to earn — share links for quick cash bonuses, or manage sales for recurring revenue.'
        : "Create the partner login you'll use to view tracked leads and commission payouts.";
    case 4:
      return userType.value === 'existing'
        ? `Your partner access has been linked to ${crmLinkEmail.value || 'your CRM account'}.`
        : `We've sent a verification link to ${partnerForm.email || 'your email'}. Please check your inbox to activate your account.`;
    default:
      return '';
  }
});

const currentStepIndicatorLabel = computed(() => {
  if (currentStep.value === 1) return 'Account setup';
  if (currentStep.value === 2) {
    return userType.value === 'existing' ? 'Link CRM account' : 'Select partner track';
  }
  if (currentStep.value === 3) {
    return userType.value === 'existing' ? 'Select partner track' : 'Account details';
  }
  return '';
});

const referralUrl = computed(() => `https://app.rakansales.com/ref/RKS-8821`);

const salesPartnerBadgeClass = computed(() => {
  return isSalesPartnerUnlocked.value
    ? 'bg-warning/15 text-warning border border-warning/30'
    : 'bg-muted text-muted-foreground border border-border';
});

// Password strength calculation
const passwordStrengthScore = computed(() => {
  if (!partnerForm.password) return 0;
  let score = 0;
  if (partnerForm.password.length >= 8) score++;
  if (/[A-Z]/.test(partnerForm.password)) score++;
  if (/[a-z]/.test(partnerForm.password)) score++;
  if (
    (/[0-9!@#$%^&*(),.?":{}|<>]/.test(partnerForm.password) && partnerForm.password.length >= 8) ||
    (partnerForm.confirmPassword && partnerForm.password === partnerForm.confirmPassword)
  ) {
    score++;
  }
  return Math.min(score, 4);
});

const passwordStrengthLabel = computed(() => {
  if (!partnerForm.password) return 'Enter password';
  switch (passwordStrengthScore.value) {
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Enter password';
  }
});

const passwordStrengthBadgeClass = computed(() => {
  if (!partnerForm.password) {
    return 'bg-muted text-muted-foreground border border-border';
  }
  switch (passwordStrengthScore.value) {
    case 1:
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 2:
      return 'bg-warning/10 text-warning border border-warning/20';
    case 3:
      return 'bg-info/10 text-info border border-info/20';
    case 4:
      return 'bg-success/10 text-success border border-success/20 font-bold';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
});

const passwordStrengthBg = computed(() => {
  switch (passwordStrengthScore.value) {
    case 1:
      return 'bg-destructive';
    case 2:
      return 'bg-warning';
    case 3:
      return 'bg-info';
    case 4:
      return 'bg-primary';
    default:
      return 'bg-muted';
  }
});

function goToStep(step: number) {
  currentStep.value = step;
}

function openSalesPartnerModal() {
  if (!isSalesPartnerUnlocked.value) {
    partnerAccessCode.value = '';
    codeError.value = '';
    showCodeInput.value = false;
    showUnlockModal.value = true;
  } else {
    selectedPartnerType.value = 'sales';
  }
}

function selectReferralAndClose() {
  selectedPartnerType.value = 'referral';
  showUnlockModal.value = false;
}

function submitAccessCode() {
  codeError.value = '';
  if (!partnerAccessCode.value.trim()) {
    codeError.value = 'Please enter an access code.';
    return;
  }
  isSalesPartnerUnlocked.value = true;
  selectedPartnerType.value = 'sales';
  showUnlockModal.value = false;
}

function confirmUnlockSalesPartner() {
  isSalesPartnerUnlocked.value = true;
  selectedPartnerType.value = 'sales';
  showUnlockModal.value = false;
}

function findAccountAndContinue() {
  accountLinkError.value = '';
  if (!crmLinkEmail.value || !crmLinkEmail.value.includes('@')) {
    accountLinkError.value = 'Please enter a valid CRM account email address.';
    return;
  }
  isFindingAccount.value = true;
  setTimeout(() => {
    isFindingAccount.value = false;
    isAccountLinked.value = true;
    currentStep.value = 3;
  }, 400);
}

function submitStep2() {
  currentStep.value = 3;
}

function submitRegistration() {
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    currentStep.value = 4;
  }, 750);
}

function copyReferralLink() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(referralUrl.value).catch(() => {});
  }
  copiedLink.value = true;
  setTimeout(() => {
    copiedLink.value = false;
  }, 2200);
}

function copyPartnerCode() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText('RKS-PARTNER-8821').catch(() => {});
  }
  copiedCode.value = true;
  setTimeout(() => {
    copiedCode.value = false;
  }, 2200);
}

function goToPartnerOverview() {
  router.push('/partner/overview');
}

function goToLogin() {
  goToPartnerOverview();
}

const emailResent = ref(false);

function resendVerificationEmail() {
  emailResent.value = true;
  setTimeout(() => {
    emailResent.value = false;
  }, 3500);
}

function resetForm() {
  currentStep.value = 1;
  userType.value = 'new';
  crmLinkEmail.value = '';
  isAccountLinked.value = false;
  accountLinkError.value = '';
  selectedPartnerType.value = 'referral';
  isSalesPartnerUnlocked.value = false;
  isSubmitting.value = false;
  emailResent.value = false;
  partnerForm.fullName = '';
  partnerForm.companyName = '';
  partnerForm.email = '';
  partnerForm.whatsapp = '';
  partnerForm.password = '';
  partnerForm.confirmPassword = '';
  partnerForm.industry = '';
  partnerForm.source = '';
  partnerForm.referMethod = '';
  partnerForm.monthlyReach = '';
  partnerForm.previousReferral = '';
  partnerForm.confirmedActiveBusinesses = true;
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
</style>
