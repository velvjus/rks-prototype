# RakanSales C4 — Task Log

> Chronological record of completed tasks, decisions, and open follow-ups. **Always prepend new entries at the top** and refresh the "Recent Activity (Last 5 Tasks)" list in [.context/PROJECT_MAP.md](./PROJECT_MAP.md).

### Entry Template
```markdown
## [YYYY-MM-DD] <Short Task Title>
- **Scope:** <Module(s)>
- **Summary:** <1–3 concise bullets on what changed>
- **Files:** `<path1>`, `<path2>`
- **Connections Updated:** <Routes / Nav / Stores / localStorage / HTML mirror, or None>
- **Decisions & Gotchas:** <Choices future sessions should preserve>
- **Open Follow-ups:** <Deferred items, or None>
```

---

## [2026-11-27] Onboarding v2 Step 5 Redesign: Unified 7-Day Free Trial & Payment Flow
- **Scope:** Onboarding v2 Step 5 (`StepPaymentMethod.vue`, `OnboardingView.vue`) & Standalone HTML Mirror (`html/onboarding-wizard.html`)
- **Summary:**
  - Unified Step 5 so both **"Add card now"** (default) and **"Add card later"** render the exact same page structure (top stepper, `"Start your 7-day free trial"` heading without `"Optional"` pill, two equal option cards, single dark-header Plan Summary card, and single-CTA footer `"Start free trial"` always enabled), differing only in the summary status line and whether the payment/billing form expands between the summary and footer.
  - Stored trial length in a single `TRIAL_DAYS = 7` constant powering every trial mention and computed `{trial end date}` (eliminating all `"14"` references).
  - Built one continuous 3-section card form (shown only under **"Add card now"**): **Card details** (encrypted provider-field slots for card number, expiry, CVC, name on card + Visa/Mastercard/Amex logos), **Billing details** (defaulting Country to `Malaysia`), and **E-invoice (MyInvois) details** (defaulting phone code to `MY +60` with LHDN helper text). Removed inner `Save details`/`Cancel` buttons, `Incomplete` badge, required counter, red asterisks (marking only optional fields with `(optional)`), and the single-option Card radio row.
  - Added inline per-field validation on blur and on submit (scrolling to and focusing the first invalid field when submitting **"Add card now"**), while preserving typed values across mode switches and stacking option cards & all form fields single-column on mobile.
  - Mirrored all Step 5 & Step 6 updates in `html/onboarding-wizard.html`.
- **Files:** `src/components/onboarding/v2/StepPaymentMethod.vue`, `src/views/OnboardingView.vue`, `html/onboarding-wizard.html`
- **Connections Updated:** `html/onboarding-wizard.html` ↔ `src/views/OnboardingView.vue`
- **Decisions & Gotchas:** Step 5 stage is top-aligned (no `my-auto` vertical re-centering) so toggling between **"Add card now"** and **"Add card later"** keeps Items 1–4 pixel-locked with zero vertical jump. `country` (`'Malaysia'`) and `contactDialCode` (`'+60'`) default to Malaysia regardless of Step 2 selection. All Vue styling uses semantic tokens only (0 violations).
- **Open Follow-ups:** None

---

## [2026-11-21] Onboarding v2 Step 1: Primary Use Case & Referral Code
- **Scope:** Onboarding v2 (`OnboardingView.vue`, `StepCompanyNameType.vue`, `OnboardingTopStepper.vue`) & Standalone HTML Mirror (`html/onboarding-wizard.html`)
- **Summary:**
  - Replaced the 3-card "Company Type" selector in Step 1 with the 2-card **"How will your company use RakanSales?"** selector (**Sales & Lead Management** and **Customer & Service Support**) with icons and selection check indicators.
  - Added an optional **Referral Code (if any)** input field below the use case cards and updated Step 1 validation to require Company Name + Primary Use Case (leaving Referral Code optional).
  - Updated Step 1 stepper subtitle to `"Company details & primary use case"`, unified the primary step progression button label to `"Next"` across all 4 onboarding steps, adjusted stage container to `min-h-[520px] gap-6` so Step 1 fits cleanly without clipping, and mirrored all changes in `html/onboarding-wizard.html`.
- **Files:** `src/components/onboarding/v2/StepCompanyNameType.vue`, `src/views/OnboardingView.vue`, `src/components/onboarding/v2/OnboardingTopStepper.vue`, `html/onboarding-wizard.html`
- **Connections Updated:** `html/onboarding-wizard.html` ↔ `src/views/OnboardingView.vue`
- **Decisions & Gotchas:** Replaced `formData.business.companyType` with `formData.business.useCase` (`'sales' | 'support'`) and added `formData.business.referralCode` (optional). Used semantic tokens exclusively in Vue components (0 violations in `audit-tokens.cjs --batch 8`).
- **Open Follow-ups:** None

---

## [2026-11-21] Interactive Dashboard Onboarding Walkthrough (Storylane / Supademo Style)
- **Scope:** Dashboard, Top Navigation Bar, UI Store, Semantic Theming
- **Summary:**
  - Built `src/components/dashboard/DashboardInteractiveTour.vue` — a 9-step interactive screen walkthrough modeled after Storylane and Supademo with a minimal Welcome cover card (eyebrow + title + description + centered Start Tour CTA), lighter morphing SVG spotlight cutout, click-through guards, pulsing hotspot beacons overlapping the spotlight edge by 40%, minimal inverted high-contrast floating callout cards (black in light mode, white in dark mode, with unified `← step/total` back button and `Next` CTA), single-vector smooth travel transitions, bottom scrubber dock, keyboard navigation (`←`/`→`/`Esc`), and a minimal confetti completion card.
  - Added an on-demand **Tour** trigger button in `TopNav.vue` directly beside the Help (`?`) button (never auto-opens on landing) and wired the Help dropdown's "Page Tour" option to launch the same walkthrough (auto-navigating to `/dashboard` when triggered from other routes).
  - Added `data-tour` hooks and `DashboardTourController` in `DashboardView.vue`, bumped the slide-over opportunity drawer to `z-[70]` so it clears `TopNav` (`z-[60]`), and added semantic tour tokens (`--tour-scrim`, `--tour-callout`, `--tour-callout-foreground`, `--tour-callout-muted`, `--tour-callout-border`) to `src/assets/index.css` for light and dark modes.
- **Files:** `src/components/dashboard/DashboardInteractiveTour.vue`, `src/views/DashboardView.vue`, `src/components/layout/TopNav.vue`, `src/stores/ui.ts`, `src/assets/index.css`
- **Connections Updated:** `src/stores/ui.ts` (`isDashboardTourOpen`, `startDashboardTour`, `closeDashboardTour`, `toggleDashboardTour`) shared between `TopNav.vue` and `DashboardView.vue`
- **Decisions & Gotchas:** Tour defaults strictly to closed (`isDashboardTourOpen = false`) and auto-closes on `DashboardView` unmount; if sample data was cleared, starting the tour re-enables demo data so charts and active opportunities remain interactive.
- **Open Follow-ups:** Optionally extend the interactive walkthrough pattern to other key modules (Omnichannel, Deals Pipeline) if needed.

---

## [2026-11-21] Set up `.context/` Project Map & Session Continuity System
- **Scope:** Project documentation, agent workflow, and drift-checking tooling
- **Summary:**
  - Created `.context/PROJECT_MAP.md` as the single-read hub covering all 30 views, 3 Pinia stores, 6 `localStorage` keys, query-param deep links, stealth nav items, standalone HTML mirrors, and unwired placeholders.
  - Created `.context/TASK_LOG.md` seeded from git history as the append-only chronological log.
  - Updated `AGENTS.md` with mandatory start-of-session read and end-of-task recording rules.
  - Added `scripts/check-map.cjs` (`npm run map:check`) to detect undocumented routes, views, or stores automatically.
  - Added a deprecation banner to `docs/project_context.md` redirecting to `.context/PROJECT_MAP.md` and `DESIGN.md`.
- **Files:** `.context/PROJECT_MAP.md`, `.context/TASK_LOG.md`, `AGENTS.md`, `scripts/check-map.cjs`, `package.json`, `docs/project_context.md`
- **Connections Updated:** `package.json` (`map:check` script)
- **Decisions & Gotchas:** Kept `.context/PROJECT_MAP.md` strictly focused on current state + last 5 tasks so context size stays flat over time; full history stays here in `TASK_LOG.md`.
- **Open Follow-ups:** Optionally add `.context/modules/<name>.md` deep briefs for large views (`OmnichannelView`, `AIAssistantsTab`, `DealsView`) as they are modified next.

---

## Historical Milestones (Seeded from Git History)

## [2026-11-02] CSS Token Refinements & Guidelines View Update (`e166597`)
- **Scope:** Design System, Theming, Guidelines
- **Summary:** Updated CSS token values in `src/assets/index.css`, refreshed `src/data/colorTokensData.ts`, and aligned `src/views/GuidelinesView.vue` with the finalized token catalog.
- **Files:** `src/assets/index.css`, `src/data/colorTokensData.ts`, `src/views/GuidelinesView.vue`

## [2026-11-02] Full System Dark Mode & Semantic Tokenization (`f6b65dc`, `50d0bb3`)
- **Scope:** Entire application (all 30 views, UI primitives, layouts, charts)
- **Summary:**
  - Implemented 56-token Light/Dark theme architecture in `src/assets/index.css` with reactive `useTheme.ts` and OKLCH-to-hex chart theming in `useChartTheme.ts`.
  - Migrated raw palette colors and `dark:` overrides across components using `scripts/audit-tokens.cjs`, `scripts/codemod-tokens.cjs`, and `scripts/verify-contrast.cjs`.
  - Documented strict theming rules in `AGENTS.md` and `DESIGN.md`.
- **Files:** `src/assets/index.css`, `src/composables/useTheme.ts`, `src/composables/useChartTheme.ts`, `AGENTS.md`, `DESIGN.md`, `scripts/*`

## [2026-10-25] AI Assistants Studio & Dashboard Refinements (`b7f6f19`, `4ea04ea`)
- **Scope:** Settings → AI Assistants, Dashboard
- **Summary:** Expanded `src/components/settings/AIAssistantsTab.vue` (multi-assistant management, live metrics, configuration studio) and refined `src/views/DashboardView.vue` layout and components.
- **Files:** `src/components/settings/AIAssistantsTab.vue`, `src/views/DashboardView.vue`

## [2026-10-24] Omnichannel, Contact Drawer & Deals Pipeline Updates (`0691e5b`)
- **Scope:** Omnichannel, Deals
- **Summary:** Refined `ContactDrawer.vue`, `OmnichannelView.vue`, and `DealsView.vue` interactions and modal/panel ergonomics.
- **Files:** `src/components/omnichannel/ContactDrawer.vue`, `src/views/OmnichannelView.vue`, `src/views/DealsView.vue`

## [2026-10-16] Partner Withdrawal, AI Assistants Tab & Navigation Updates (`57f1531`)
- **Scope:** Partner Portal, Settings, Navigation
- **Summary:** Added `PartnerWithdrawalView.vue` (`/partner/withdrawal`), introduced `AIAssistantsTab.vue` with `/settings/ai-assistants` redirect, and updated `Sidebar.vue` / `SecondaryPanel.vue`.
- **Files:** `src/views/partner/PartnerWithdrawalView.vue`, `src/components/settings/AIAssistantsTab.vue`, `src/router/index.ts`, `src/components/layout/SecondaryPanel.vue`

## [2026-09-25] Setup Wizard, Onboarding V2 & Partner Portal Views (`7441778`)
- **Scope:** Onboarding, Setup Wizard, Partner Portal, Standalone HTML
- **Summary:** Added `SetupWizardView.vue`, Onboarding v2 flow (`OnboardingView.vue` + `src/components/onboarding/v2/*`), Partner Portal views (`Overview`, `Program`, `Referrals`, `Commissions`, `Kit` + `src/stores/partner.ts` + `PartnerTrackSwitcher.vue`), and standalone HTML mirrors.
- **Files:** `src/views/SetupWizardView.vue`, `src/views/OnboardingView.vue`, `src/views/partner/*`, `src/stores/partner.ts`, `html/*`

## [2026-09-14] Auth, Onboarding V1 & Partner Registration (`4dfdf1a`)
- **Scope:** Auth, Onboarding, Partner Registration, Settings
- **Summary:** Added `AuthView.vue` (`/auth`), `OnboardingV1View.vue`, `PartnerRegisterView.vue` (`/partner/register` standalone), and updated Settings tabs.
- **Files:** `src/views/AuthView.vue`, `src/views/OnboardingV1View.vue`, `src/views/PartnerRegisterView.vue`, `src/views/SettingsView.vue`

## [2026-08-20] Initial Prototype Release, Dashboard & Automation (`d2298c1`..`0b995b6`)
- **Scope:** Core CRM prototype foundation
- **Summary:** Initialized Vue 3 + Vite + Tailwind v4 + Shadcn/Vue CRM prototype with Dashboard, Omnichannel, Deals Kanban, Contacts (2,500 seeded), Companies, Events, Campaigns, Web Forms suite, Appointments (Calendar + Booking Pages), Add-ons, Settings/Automation, Design System, and Guidelines.
- **Files:** `src/*`, `docs/*`
