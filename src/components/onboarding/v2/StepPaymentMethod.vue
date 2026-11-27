<template>
  <div class="space-y-5">
    <!-- 2. Heading & Subtitle (No "Optional" pill) -->
    <div class="shrink-0">
      <h2 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Start your {{ trialDays }}-day free trial
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
        You won't be charged today. Choose how you'd like to pay when your trial ends.
      </p>
    </div>

    <!-- 3. Option Selector (Two equal cards side by side, stacked on mobile) -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Choose when to add a payment method"
    >
      <!-- Left Card: Add card now (default) -->
      <button
        type="button"
        role="radio"
        @click="setMode('now')"
        :aria-checked="modelValue.mode === 'now'"
        :class="[
          'p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          modelValue.mode === 'now'
            ? 'border-primary bg-primary/10 ring-2 ring-primary/15 shadow-xs'
            : 'border-border bg-card hover:bg-muted/50'
        ]"
      >
        <div
          :class="[
            'w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0',
            modelValue.mode === 'now'
              ? 'bg-primary text-primary-foreground shadow-2xs'
              : 'bg-muted text-muted-foreground'
          ]"
        >
          <CreditCard class="w-4.5 h-4.5" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-semibold text-foreground leading-snug">Add card now</div>
          <p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            Renews automatically when your trial ends
          </p>
        </div>
        <span
          :class="[
            'w-4.5 h-4.5 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5',
            modelValue.mode === 'now'
              ? 'bg-primary text-primary-foreground'
              : 'border border-input bg-background'
          ]"
        >
          <Check v-if="modelValue.mode === 'now'" class="w-3 h-3 stroke-[3]" />
        </span>
      </button>

      <!-- Right Card: Add card later -->
      <button
        type="button"
        role="radio"
        @click="setMode('later')"
        :aria-checked="modelValue.mode === 'later'"
        :class="[
          'p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          modelValue.mode === 'later'
            ? 'border-primary bg-primary/10 ring-2 ring-primary/15 shadow-xs'
            : 'border-border bg-card hover:bg-muted/50'
        ]"
      >
        <div
          :class="[
            'w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0',
            modelValue.mode === 'later'
              ? 'bg-primary text-primary-foreground shadow-2xs'
              : 'bg-muted text-muted-foreground'
          ]"
        >
          <Clock class="w-4.5 h-4.5" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-semibold text-foreground leading-snug">Add card later</div>
          <p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            We'll remind you before your trial ends
          </p>
        </div>
        <span
          :class="[
            'w-4.5 h-4.5 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5',
            modelValue.mode === 'later'
              ? 'bg-primary text-primary-foreground'
              : 'border border-input bg-background'
          ]"
        >
          <Check v-if="modelValue.mode === 'later'" class="w-3 h-3 stroke-[3]" />
        </span>
      </button>
    </div>

    <!-- 4. Plan Summary Card (Single unified design for both states) -->
    <div class="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <!-- Dark Header Band -->
      <div class="bg-rail text-rail-foreground px-4 py-3.5 flex items-center justify-between gap-3 border-b border-rail-border">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles class="w-5 h-5 stroke-[2.25]" />
          </div>
          <div class="min-w-0">
            <div class="text-xs font-semibold text-rail-foreground truncate">
              {{ planName }} Plan · {{ trialDays }}-day free trial
            </div>
            <p class="text-[11px] text-rail-muted-foreground truncate mt-0.5">
              Then {{ planPriceLabel }} · Cancel anytime
            </p>
          </div>
        </div>

        <div class="text-right shrink-0">
          <div class="text-base font-bold text-primary tabular-nums leading-none">RM 0.00</div>
          <div class="text-[10px] font-medium text-rail-muted-foreground mt-1">Due today</div>
        </div>
      </div>

      <!-- Summary Breakdown & Single Status Line -->
      <div class="p-4 sm:p-5 space-y-3">
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between text-muted-foreground">
            <span>{{ planName }} plan ({{ billingCycleLabel }})</span>
            <span class="tabular-nums font-medium text-foreground">{{ formattedSubtotal }}</span>
          </div>
          <div v-if="!isEnterprise" class="flex items-center justify-between text-muted-foreground">
            <span>Estimated taxes (8% SST)</span>
            <span class="tabular-nums font-medium text-foreground">{{ formattedTax }}</span>
          </div>
          <div class="flex items-center justify-between pt-2.5 border-t border-border">
            <span class="font-semibold text-foreground">Total after {{ trialDays }}-day trial</span>
            <span class="font-bold text-foreground tabular-nums">{{ formattedTotal }}</span>
          </div>
        </div>

        <!-- Single Status Line (Only text that changes between states) -->
        <p class="pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed">
          <template v-if="modelValue.mode === 'now'">
            <template v-if="isEnterprise">
              Custom billing terms begin on <strong class="font-semibold text-foreground">{{ trialEndDateLabel }}</strong>. Cancel anytime before then.
            </template>
            <template v-else>
              Your card will be charged <strong class="font-semibold text-foreground tabular-nums">{{ formattedTotal }}</strong> on <strong class="font-semibold text-foreground">{{ trialEndDateLabel }}</strong>. Cancel anytime before then.
            </template>
          </template>
          <template v-else>
            No card needed today. Add one in <strong class="font-semibold text-foreground">Settings → Billing</strong> before <strong class="font-semibold text-foreground">{{ trialEndDateLabel }}</strong> to keep your plan.
          </template>
        </p>
      </div>
    </div>

    <!-- 5. Payment and Billing Form (Shown ONLY when "Add card now" is selected) -->
    <div
      v-if="modelValue.mode === 'now'"
      ref="formContainerRef"
      class="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs divide-y divide-border"
    >
      <!-- Section 1: Card Details (Secure Embedded Provider Fields) -->
      <section class="pb-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold text-foreground">Card details</h3>
            <p class="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <Lock class="w-3 h-3 shrink-0 text-primary" />
              <span>Secured by encrypted payment fields</span>
            </p>
          </div>

          <!-- Accepted Card Logos: Visa, Mastercard, American Express -->
          <div class="flex items-center gap-1.5" aria-label="Accepted cards: Visa, Mastercard, American Express">
            <!-- Visa -->
            <span
              :class="[
                'h-6 px-2 rounded-md border inline-flex items-center justify-center transition-all',
                detectedCardBrand === 'VISA'
                  ? 'border-primary bg-primary/10 text-primary'
                  : detectedCardBrand
                    ? 'border-border bg-background text-muted-foreground opacity-45'
                    : 'border-border bg-background text-foreground'
              ]"
              title="Visa"
            >
              <svg class="h-2.5 w-auto" viewBox="0 0 48 16" fill="currentColor" aria-hidden="true">
                <path d="M18.4 1.3L14.2 14.7h-3.4L8.2 4.3c-.1-.5-.3-.8-.8-1C6.5 2.8 5 2.3 3.7 2l.1-.7h5.7c.8 0 1.4.5 1.6 1.4l1.4 7.5 3.5-8.9h2.4zm13.4 9c0-3.5-4.9-3.7-4.8-5.3 0-.5.5-1 1.5-1.1.5-.1 1.9-.1 3.5.6l.6-2.9C31.7 1.3 30.5 1 29.1 1c-3.2 0-5.4 1.7-5.5 4.1 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.7 1 1.7 1.5 0 .8-1 1.2-1.9 1.2-1.6 0-2.5-.4-3.3-.8l-.6 3c.8.3 2.2.6 3.6.6 3.4 0 5.9-1.6 5.9-3.7zm8.6 4.4h3L40.8 1.3h-2.7c-.6 0-1.2.4-1.4.9l-4.9 12.5h3.4l.7-1.9h4.1l.4 1.9zm-3.6-4.5l1.7-4.7 1 4.7h-2.7zM22.7 1.3l-2.7 13.4h-3.2l2.7-13.4h3.2z" />
              </svg>
            </span>

            <!-- Mastercard -->
            <span
              :class="[
                'h-6 px-2 rounded-md border inline-flex items-center justify-center transition-all',
                detectedCardBrand === 'MC'
                  ? 'border-primary bg-primary/10'
                  : detectedCardBrand
                    ? 'border-border bg-background opacity-45'
                    : 'border-border bg-background'
              ]"
              title="Mastercard"
            >
              <svg class="h-3.5 w-auto" viewBox="0 0 28 18" aria-hidden="true">
                <circle cx="10.5" cy="9" r="7" class="fill-destructive" />
                <circle cx="17.5" cy="9" r="7" class="fill-warning opacity-85" />
              </svg>
            </span>

            <!-- American Express -->
            <span
              :class="[
                'h-6 px-1.5 rounded-md border inline-flex items-center justify-center text-[9px] font-bold tracking-tight transition-all',
                detectedCardBrand === 'AMEX'
                  ? 'border-primary bg-primary/10 text-primary'
                  : detectedCardBrand
                    ? 'border-border bg-background text-info opacity-45'
                    : 'border-border bg-background text-info'
              ]"
              title="American Express"
            >
              AMEX
            </span>
          </div>
        </div>

        <!-- Embedded Card Fields -->
        <div class="space-y-3.5">
          <!-- Card Number -->
          <div class="space-y-1.5">
            <label for="cardNumber" class="block text-xs font-semibold text-foreground">
              Card number
            </label>
            <div class="relative" data-provider-field="card-number">
              <input
                id="cardNumber"
                :value="modelValue.cardNumber"
                @input="onCardNumberInput"
                @blur="touchField('cardNumber')"
                type="text"
                inputmode="numeric"
                autocomplete="cc-number"
                maxlength="19"
                placeholder="1234 5678 9012 3456"
                :aria-invalid="!!getFieldError('cardNumber')"
                :aria-describedby="getFieldError('cardNumber') ? 'err-cardNumber' : undefined"
                :class="[inputClass('cardNumber'), 'pr-10 tabular-nums']"
              />
              <Lock class="w-3.5 h-3.5 text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <p v-if="getFieldError('cardNumber')" id="err-cardNumber" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('cardNumber') }}
            </p>
          </div>

          <!-- Expiry & CVC (stacked on mobile, side by side on sm+) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="space-y-1.5" data-provider-field="card-expiry">
              <label for="cardExpiry" class="block text-xs font-semibold text-foreground">
                Expiry
              </label>
              <input
                id="cardExpiry"
                :value="modelValue.cardExpiry"
                @input="onExpiryInput"
                @blur="touchField('cardExpiry')"
                type="text"
                inputmode="numeric"
                autocomplete="cc-exp"
                maxlength="7"
                placeholder="MM / YY"
                :aria-invalid="!!getFieldError('cardExpiry')"
                :aria-describedby="getFieldError('cardExpiry') ? 'err-cardExpiry' : undefined"
                :class="[inputClass('cardExpiry'), 'tabular-nums']"
              />
              <p v-if="getFieldError('cardExpiry')" id="err-cardExpiry" class="text-[11px] font-medium text-destructive">
                {{ getFieldError('cardExpiry') }}
              </p>
            </div>

            <div class="space-y-1.5" data-provider-field="card-cvc">
              <label for="cardCvc" class="block text-xs font-semibold text-foreground">
                CVC
              </label>
              <input
                id="cardCvc"
                :value="modelValue.cardCvc"
                @input="onCvcInput"
                @blur="touchField('cardCvc')"
                type="password"
                inputmode="numeric"
                autocomplete="cc-csc"
                maxlength="4"
                placeholder="123"
                :aria-invalid="!!getFieldError('cardCvc')"
                :aria-describedby="getFieldError('cardCvc') ? 'err-cardCvc' : undefined"
                :class="[inputClass('cardCvc'), 'tabular-nums']"
              />
              <p v-if="getFieldError('cardCvc')" id="err-cardCvc" class="text-[11px] font-medium text-destructive">
                {{ getFieldError('cardCvc') }}
              </p>
            </div>
          </div>

          <!-- Name on Card -->
          <div class="space-y-1.5">
            <label for="cardName" class="block text-xs font-semibold text-foreground">
              Name on card
            </label>
            <input
              id="cardName"
              :value="modelValue.cardName"
              @input="updateField('cardName', ($event.target as HTMLInputElement).value)"
              @blur="touchField('cardName')"
              type="text"
              autocomplete="cc-name"
              placeholder="e.g. Ahmad Razak"
              :aria-invalid="!!getFieldError('cardName')"
              :aria-describedby="getFieldError('cardName') ? 'err-cardName' : undefined"
              :class="inputClass('cardName')"
            />
            <p v-if="getFieldError('cardName')" id="err-cardName" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('cardName') }}
            </p>
          </div>
        </div>
      </section>

      <!-- Section 2: Billing Details -->
      <section class="py-5 space-y-3.5">
        <h3 class="text-sm font-bold text-foreground">Billing details</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="space-y-1.5">
            <label for="billingName" class="block text-xs font-semibold text-foreground">
              Billing name
            </label>
            <input
              id="billingName"
              :value="modelValue.billingName"
              @input="updateField('billingName', ($event.target as HTMLInputElement).value)"
              @blur="touchField('billingName')"
              type="text"
              autocomplete="organization"
              placeholder="e.g. Acme Corporation Sdn Bhd"
              :aria-invalid="!!getFieldError('billingName')"
              :aria-describedby="getFieldError('billingName') ? 'err-billingName' : undefined"
              :class="inputClass('billingName')"
            />
            <p v-if="getFieldError('billingName')" id="err-billingName" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('billingName') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label for="billingEmail" class="block text-xs font-semibold text-foreground">
              Billing email
            </label>
            <input
              id="billingEmail"
              :value="modelValue.billingEmail"
              @input="updateField('billingEmail', ($event.target as HTMLInputElement).value)"
              @blur="touchField('billingEmail')"
              type="email"
              autocomplete="email"
              placeholder="billing@company.com"
              :aria-invalid="!!getFieldError('billingEmail')"
              :aria-describedby="getFieldError('billingEmail') ? 'err-billingEmail' : undefined"
              :class="inputClass('billingEmail')"
            />
            <p v-if="getFieldError('billingEmail')" id="err-billingEmail" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('billingEmail') }}
            </p>
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="addressLine1" class="block text-xs font-semibold text-foreground">
            Address line 1
          </label>
          <input
            id="addressLine1"
            :value="modelValue.addressLine1"
            @input="updateField('addressLine1', ($event.target as HTMLInputElement).value)"
            @blur="touchField('addressLine1')"
            type="text"
            autocomplete="address-line1"
            placeholder="Street address, building, unit"
            :aria-invalid="!!getFieldError('addressLine1')"
            :aria-describedby="getFieldError('addressLine1') ? 'err-addressLine1' : undefined"
            :class="inputClass('addressLine1')"
          />
          <p v-if="getFieldError('addressLine1')" id="err-addressLine1" class="text-[11px] font-medium text-destructive">
            {{ getFieldError('addressLine1') }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="addressLine2" class="block text-xs font-semibold text-foreground">
            Address line 2 <span class="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="addressLine2"
            :value="modelValue.addressLine2"
            @input="updateField('addressLine2', ($event.target as HTMLInputElement).value)"
            type="text"
            autocomplete="address-line2"
            placeholder="Suite, floor, industrial park"
            class="w-full h-10 px-3 bg-background border border-input rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all shadow-2xs"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="space-y-1.5">
            <label for="billingCity" class="block text-xs font-semibold text-foreground">
              City
            </label>
            <input
              id="billingCity"
              :value="modelValue.city"
              @input="updateField('city', ($event.target as HTMLInputElement).value)"
              @blur="touchField('city')"
              type="text"
              autocomplete="address-level2"
              placeholder="e.g. Kuala Lumpur"
              :aria-invalid="!!getFieldError('city')"
              :aria-describedby="getFieldError('city') ? 'err-city' : undefined"
              :class="inputClass('city')"
            />
            <p v-if="getFieldError('city')" id="err-city" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('city') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label for="billingState" class="block text-xs font-semibold text-foreground">
              State
            </label>
            <input
              id="billingState"
              :value="modelValue.state"
              @input="updateField('state', ($event.target as HTMLInputElement).value)"
              @blur="touchField('state')"
              type="text"
              autocomplete="address-level1"
              placeholder="e.g. Selangor"
              :aria-invalid="!!getFieldError('state')"
              :aria-describedby="getFieldError('state') ? 'err-state' : undefined"
              :class="inputClass('state')"
            />
            <p v-if="getFieldError('state')" id="err-state" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('state') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label for="billingPostcode" class="block text-xs font-semibold text-foreground">
              Postcode
            </label>
            <input
              id="billingPostcode"
              :value="modelValue.postcode"
              @input="updateField('postcode', ($event.target as HTMLInputElement).value)"
              @blur="touchField('postcode')"
              type="text"
              autocomplete="postal-code"
              placeholder="e.g. 50450"
              :aria-invalid="!!getFieldError('postcode')"
              :aria-describedby="getFieldError('postcode') ? 'err-postcode' : undefined"
              :class="inputClass('postcode')"
            />
            <p v-if="getFieldError('postcode')" id="err-postcode" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('postcode') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label for="billingCountry" class="block text-xs font-semibold text-foreground">
              Country
            </label>
            <input
              id="billingCountry"
              :value="modelValue.country"
              @input="updateField('country', ($event.target as HTMLInputElement).value)"
              @blur="touchField('country')"
              type="text"
              autocomplete="country-name"
              placeholder="Malaysia"
              :aria-invalid="!!getFieldError('country')"
              :aria-describedby="getFieldError('country') ? 'err-country' : undefined"
              :class="inputClass('country')"
            />
            <p v-if="getFieldError('country')" id="err-country" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('country') }}
            </p>
          </div>
        </div>
      </section>

      <!-- Section 3: E-invoice (MyInvois) Details -->
      <section class="pt-5 space-y-3.5">
        <div>
          <h3 class="text-sm font-bold text-foreground">E-invoice (MyInvois) details</h3>
          <p class="text-[11px] text-muted-foreground mt-0.5">
            Required by LHDN before invoices can be filed on your behalf.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="space-y-1.5">
            <label for="tinTaxId" class="block text-xs font-semibold text-foreground">
              TIN / Tax ID <span class="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="tinTaxId"
              :value="modelValue.tinTaxId"
              @input="updateField('tinTaxId', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="e.g. C2584563200"
              class="w-full h-10 px-3 bg-background border border-input rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all shadow-2xs"
            />
          </div>

          <div class="space-y-1.5">
            <label for="regNumber" class="block text-xs font-semibold text-foreground truncate" title="Business registration / ID number">
              Business registration / ID number
            </label>
            <input
              id="regNumber"
              :value="modelValue.registrationNumber"
              @input="updateField('registrationNumber', ($event.target as HTMLInputElement).value)"
              @blur="touchField('registrationNumber')"
              type="text"
              placeholder="e.g. 202001012345"
              :aria-invalid="!!getFieldError('registrationNumber')"
              :aria-describedby="getFieldError('registrationNumber') ? 'err-registrationNumber' : undefined"
              :class="inputClass('registrationNumber')"
            />
            <p v-if="getFieldError('registrationNumber')" id="err-registrationNumber" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('registrationNumber') }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="space-y-1.5">
            <label for="regType" class="block text-xs font-semibold text-foreground">
              Registration type
            </label>
            <select
              id="regType"
              :value="modelValue.registrationType"
              @change="onSelectChange('registrationType', ($event.target as HTMLSelectElement).value)"
              @blur="touchField('registrationType')"
              :aria-invalid="!!getFieldError('registrationType')"
              :aria-describedby="getFieldError('registrationType') ? 'err-registrationType' : undefined"
              :class="[inputClass('registrationType'), 'cursor-pointer']"
            >
              <option value="" disabled>Select a registration type</option>
              <option value="BRN">BRN — Business Registration</option>
              <option value="NRIC">NRIC — Malaysian IC</option>
              <option value="PASSPORT">Passport</option>
              <option value="ARMY">Army / Police ID</option>
            </select>
            <p v-if="getFieldError('registrationType')" id="err-registrationType" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('registrationType') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label for="contactNumber" class="block text-xs font-semibold text-foreground">
              Contact number
            </label>
            <div
              :class="[
                'flex items-center h-10 bg-background border rounded-xl focus-within:ring-2 transition-all shadow-2xs overflow-hidden',
                getFieldError('contactNumber')
                  ? 'border-destructive focus-within:ring-destructive/20 focus-within:border-destructive'
                  : 'border-input focus-within:ring-ring focus-within:border-primary'
              ]"
            >
              <div class="h-full flex items-center bg-muted/40 border-r border-input shrink-0">
                <select
                  aria-label="Country dial code"
                  :value="modelValue.contactDialCode"
                  @change="updateField('contactDialCode', ($event.target as HTMLSelectElement).value)"
                  class="h-full px-2.5 bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option v-for="cc in dialCodes" :key="cc.code" :value="cc.dial">
                    {{ cc.code }} {{ cc.dial }}
                  </option>
                </select>
              </div>
              <input
                id="contactNumber"
                :value="modelValue.contactNumber"
                @input="updateField('contactNumber', ($event.target as HTMLInputElement).value)"
                @blur="touchField('contactNumber')"
                type="tel"
                autocomplete="tel-national"
                placeholder="12 345 6789"
                :aria-invalid="!!getFieldError('contactNumber')"
                :aria-describedby="getFieldError('contactNumber') ? 'err-contactNumber' : undefined"
                class="flex-1 min-w-0 h-full px-2.5 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <p v-if="getFieldError('contactNumber')" id="err-contactNumber" class="text-[11px] font-medium text-destructive">
              {{ getFieldError('contactNumber') }}
            </p>
            <p v-else class="text-[10px] text-muted-foreground leading-snug">
              Pick the country code, then enter the number. Required for e-invoice filing.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { Check, Clock, CreditCard, Lock, Sparkles } from 'lucide-vue-next';

export interface PaymentData {
  mode: 'now' | 'later';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  billingName: string;
  billingEmail: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  tinTaxId: string;
  registrationNumber: string;
  registrationType: string;
  contactDialCode: string;
  contactNumber: string;
  skipped: boolean;
}

interface Props {
  modelValue: PaymentData;
  planId: string;
  planName: string;
  planPriceLabel: string;
  billingCycle: 'monthly' | 'yearly';
  trialDays: number;
  trialEndDateLabel: string;
  defaultCompanyName?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: PaymentData): void;
}>();

const formContainerRef = ref<HTMLElement | null>(null);

const dialCodes = [
  { code: 'MY', dial: '+60' },
  { code: 'SG', dial: '+65' },
  { code: 'ID', dial: '+62' },
  { code: 'TH', dial: '+66' },
  { code: 'PH', dial: '+63' },
  { code: 'VN', dial: '+84' },
  { code: 'US', dial: '+1' },
  { code: 'GB', dial: '+44' },
  { code: 'AU', dial: '+61' },
];

type ValidatedFieldKey =
  | 'cardNumber'
  | 'cardExpiry'
  | 'cardCvc'
  | 'cardName'
  | 'billingName'
  | 'billingEmail'
  | 'addressLine1'
  | 'city'
  | 'state'
  | 'postcode'
  | 'country'
  | 'registrationNumber'
  | 'registrationType'
  | 'contactNumber';

const fieldOrder: { key: ValidatedFieldKey; id: string }[] = [
  { key: 'cardNumber', id: 'cardNumber' },
  { key: 'cardExpiry', id: 'cardExpiry' },
  { key: 'cardCvc', id: 'cardCvc' },
  { key: 'cardName', id: 'cardName' },
  { key: 'billingName', id: 'billingName' },
  { key: 'billingEmail', id: 'billingEmail' },
  { key: 'addressLine1', id: 'addressLine1' },
  { key: 'city', id: 'billingCity' },
  { key: 'state', id: 'billingState' },
  { key: 'postcode', id: 'billingPostcode' },
  { key: 'country', id: 'billingCountry' },
  { key: 'registrationNumber', id: 'regNumber' },
  { key: 'registrationType', id: 'regType' },
  { key: 'contactNumber', id: 'contactNumber' },
];

const touched = reactive<Record<ValidatedFieldKey, boolean>>({
  cardNumber: false,
  cardExpiry: false,
  cardCvc: false,
  cardName: false,
  billingName: false,
  billingEmail: false,
  addressLine1: false,
  city: false,
  state: false,
  postcode: false,
  country: false,
  registrationNumber: false,
  registrationType: false,
  contactNumber: false,
});

// Pre-fill billingName from Step 1 if empty (keep country=Malaysia and dial=+60 defaults)
watch(
  () => props.defaultCompanyName,
  (comp) => {
    if (comp && !props.modelValue.billingName) {
      emit('update:modelValue', { ...props.modelValue, billingName: comp });
    }
  },
  { immediate: true }
);

const billingCycleLabel = computed(() =>
  props.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'
);

const isEnterprise = computed(() => props.planId === 'enterprise');

const numericSubtotal = computed(() => {
  const yearly = props.billingCycle === 'yearly';
  const map: Record<string, number> = {
    basic: yearly ? 1800 : 200,
    growth: yearly ? 4200 : 450,
    pro: yearly ? 9000 : 950,
    enterprise: 0,
  };
  return map[props.planId] ?? (yearly ? 4200 : 450);
});

function formatRM(amount: number): string {
  return `RM ${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const formattedSubtotal = computed(() =>
  isEnterprise.value ? 'Custom pricing' : formatRM(numericSubtotal.value)
);

const formattedTax = computed(() =>
  isEnterprise.value ? '—' : formatRM(numericSubtotal.value * 0.08)
);

const formattedTotal = computed(() =>
  isEnterprise.value ? 'Upon Request' : formatRM(numericSubtotal.value * 1.08)
);

const detectedCardBrand = computed(() => {
  const digits = props.modelValue.cardNumber.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('4')) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'MC';
  if (/^3[47]/.test(digits)) return 'AMEX';
  return '';
});

function validateField(key: ValidatedFieldKey): string {
  const m = props.modelValue;
  switch (key) {
    case 'cardNumber': {
      const d = m.cardNumber.replace(/\D/g, '');
      if (!d) return 'Enter your card number.';
      if (d.length < 15) return 'Enter a valid 15 or 16-digit card number.';
      return '';
    }
    case 'cardExpiry': {
      const d = m.cardExpiry.replace(/\D/g, '');
      if (!d) return 'Enter the expiry date.';
      if (d.length !== 4) return 'Use MM / YY format.';
      const mm = parseInt(d.slice(0, 2), 10);
      const yy = 2000 + parseInt(d.slice(2, 4), 10);
      if (mm < 1 || mm > 12) return 'Enter a valid month (01–12).';
      const now = new Date();
      if (yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) {
        return 'This card has expired.';
      }
      return '';
    }
    case 'cardCvc': {
      const d = m.cardCvc.replace(/\D/g, '');
      if (!d) return 'Enter the CVC.';
      if (d.length < 3) return 'Enter 3 or 4 digits.';
      return '';
    }
    case 'cardName':
      return m.cardName.trim() ? '' : 'Enter the name on your card.';
    case 'billingName':
      return m.billingName.trim() ? '' : 'Enter a billing name.';
    case 'billingEmail': {
      const v = m.billingEmail.trim();
      if (!v) return 'Enter a billing email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
      return '';
    }
    case 'addressLine1':
      return m.addressLine1.trim() ? '' : 'Enter your street address.';
    case 'city':
      return m.city.trim() ? '' : 'Enter a city.';
    case 'state':
      return m.state.trim() ? '' : 'Enter a state.';
    case 'postcode':
      return m.postcode.trim() ? '' : 'Enter a postcode.';
    case 'country':
      return m.country.trim() ? '' : 'Enter a country.';
    case 'registrationNumber':
      return m.registrationNumber.trim() ? '' : 'Enter your business registration or ID number.';
    case 'registrationType':
      return m.registrationType.trim() ? '' : 'Select a registration type.';
    case 'contactNumber': {
      const d = m.contactNumber.replace(/\D/g, '');
      if (!d) return 'Enter a contact number.';
      if (d.length < 7) return 'Enter a valid contact number.';
      return '';
    }
    default:
      return '';
  }
}

function getFieldError(key: ValidatedFieldKey): string {
  if (!touched[key]) return '';
  return validateField(key);
}

function touchField(key: ValidatedFieldKey) {
  touched[key] = true;
}

function inputClass(key: ValidatedFieldKey): string {
  return [
    'w-full h-10 px-3 bg-background border rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all shadow-2xs',
    getFieldError(key)
      ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
      : 'border-input focus:ring-ring focus:border-primary',
  ].join(' ');
}

function setMode(mode: 'now' | 'later') {
  emit('update:modelValue', {
    ...props.modelValue,
    mode,
    skipped: mode === 'later',
  });
}

function updateField<K extends keyof PaymentData>(key: K, val: PaymentData[K]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: val,
  });
}

function onSelectChange(key: ValidatedFieldKey, val: string) {
  touched[key] = true;
  updateField(key, val);
}

function onCardNumberInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '').slice(0, 16);
  const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = formatted;
  updateField('cardNumber', formatted);
}

function onExpiryInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '').slice(0, 4);
  const formatted = digits.length >= 3 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
  input.value = formatted;
  updateField('cardExpiry', formatted);
}

function onCvcInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '').slice(0, 4);
  input.value = digits;
  updateField('cardCvc', digits);
}

function validateAndFocusFirstError(): boolean {
  let firstErrorId: string | null = null;
  for (const item of fieldOrder) {
    touched[item.key] = true;
    const err = validateField(item.key);
    if (err && !firstErrorId) {
      firstErrorId = item.id;
    }
  }

  if (firstErrorId) {
    nextTick(() => {
      const el = document.getElementById(firstErrorId!);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
      }
    });
    return false;
  }

  return true;
}

defineExpose({
  validateAndFocusFirstError,
});
</script>
