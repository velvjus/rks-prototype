# RakanSales C4 — Project Map

> **Single-Read Entry Point:** Read this file first at the start of any session. It maps every module, route, store, cross-page dependency, and recent change. For full chronological history, see [.context/TASK_LOG.md](./TASK_LOG.md).

---

## 1. Recent Activity (Last 5 Tasks)

- **2026-11-21** — Updated Onboarding v2 Step 1 (`StepCompanyNameType.vue`, `OnboardingView.vue`, `OnboardingTopStepper.vue`) and `html/onboarding-wizard.html`: replaced Company Type with "How will your company use RakanSales?" (Sales & Lead Management / Customer & Service Support), added optional Referral Code field, and standardized step CTA buttons to `"Next"`.
- **2026-11-21** — Built Storylane/Supademo-style interactive dashboard walkthrough (`DashboardInteractiveTour.vue`), added on-demand `Tour` button beside Help in `TopNav.vue`, and added `--tour-scrim` / `--tour-callout*` tokens (`index.css`).
- **2026-11-21** — Set up `.context/` project map & task logging system (`PROJECT_MAP.md`, `TASK_LOG.md`, `scripts/check-map.cjs`, `AGENTS.md` continuity rules).
- **2026-11-02** (`e166597`) — Updated CSS semantic tokens (`src/assets/index.css`), `colorTokensData.ts`, and `GuidelinesView.vue`.
- **2026-11-02** (`f6b65dc`) — Implemented full system Light/Dark mode across all pages, components, and charts (`useTheme.ts`, `useChartTheme.ts`).

---

## 2. Quick Commands & Architecture

- **Stack:** Vue 3 (`<script setup lang="ts">`), TypeScript, Vite 8, Vue Router 4, Pinia, Tailwind CSS v4 (`@theme inline`), Shadcn/Vue + Radix/Reka UI (52 primitives in `src/components/ui/`), ApexCharts + Unovis.
- **Deployment:** SPA on Vercel (`vercel.json` catch-all rewrite to `/`).
- **Key Scripts (`package.json`):**
  - `npm run dev` — local Vite dev server
  - `npm run build` — `vue-tsc -b && vite build` (required check after edits)
  - `npm run audit:tokens` — checks zero raw colors / `dark:` violations (`scripts/audit-tokens.cjs`)
  - `npm run map:check` — verifies all routes, views, and stores are registered here (`scripts/check-map.cjs`)

---

## 3. Module Registry (30 Views)

### Core CRM Workspace
| Module | Status | Route(s) | View & Key Components | Store / Data | Spec / Notes |
|---|---|---|---|---|---|
| **Dashboard** | Live | `/dashboard` (default `/`) | `src/views/DashboardView.vue`, `src/components/dashboard/CrmSetupStatusBar.vue`, `src/components/dashboard/DashboardInteractiveTour.vue` | `mockData.ts`, `useChartTheme.ts` | 4 tabs: Sale, Pipeline, Marketing, Support; date presets; CSV export; sample-data toggle; on-demand interactive walkthrough |
| **Omnichannel** | Live | `/omnichannel` (`fullWidth`) | `src/views/OmnichannelView.vue`, `src/components/omnichannel/*` (8 components) | `mockData.ts` | 3-pane inbox, WhatsApp reply vs. private note, `ContactDrawer.vue`, deal creation |
| **Deals Pipeline** | Live | `/deals` (`fullWidth`) | `src/views/DealsView.vue` | `mockData.ts` | Drag-and-drop Kanban (8 `--stage-*` tokens), detail modal |
| **Contacts** | Live | `/contacts` | `src/views/ContactsView.vue` | `src/data/contactsData.ts` (2,500 seeded) | KPIs, search/filter, bulk actions, slide-out drawer, Zod modals |
| **Scan Name Card** | Live | `/contacts/scan-namecard` | `src/views/ScanNameCardView.vue` | Local state | 7-step interactive name-card scan simulation |
| **Companies** | Live | `/companies` | `src/views/CompaniesView.vue` | `mockData.ts` | B2B accounts directory table |

### Lead Capture, Marketing & Scheduling
| Module | Status | Route(s) | View & Key Components | Store / Data | Spec / Notes |
|---|---|---|---|---|---|
| **Events** | Live | `/events` (`fullWidth`) | `src/views/EventsView.vue` | Local / mock | Roadshow lead capture + AI Name Card Scanner, AI Auto Message, Event Analytics modals |
| **Campaigns** | Live | `/campaigns` | `src/views/CampaignsView.vue` | `src/data/campaignsData.ts` | Unified WhatsApp & Email broadcasts; 3-step wizard + results view |
| **Web Forms** | Live | `/web-forms`, `/web-forms/builder/:id?` (`fullWidth`), `/web-forms/templates`, `/web-forms/submissions`, `/web-forms/detail/:id` | `src/views/webforms/WebFormsDashboardView.vue`, `FormBuilderView.vue`, `ManageTemplatesView.vue`, `SubmissionsView.vue`, `FormDetailView.vue` | `src/stores/webforms.ts`, `src/types/webforms.ts` | Specs in `docs/webform_specs/` (13 docs) |
| **Appointments — Calendar** | Live | `/appointments/calendar` | `src/views/CalendarView.vue` | `src/data/calendarMock.ts` | CRUD modals, `⌘K`/`Ctrl+K` search, `localStorage` persistence |
| **Appointments — Booking Pages** | Live | `/appointments/booking-pages` | `src/views/BookingPagesView.vue` | Local state | Booking configurator + live AI chat booking simulator |
| **Add-ons Marketplace** | Live | `/addons` | `src/views/AddonsView.vue` | Local state | Usage add-ons, volume multiplier, multi-step checkout/deactivation, logs |

### Settings & AI Assistants
| Module | Status | Route(s) | View & Key Components | Store / Data | Spec / Notes |
|---|---|---|---|---|---|
| **Settings & AI Studio** | Live | `/settings` (`fullWidth`), `/settings/ai-assistants` (redirect) | `src/views/SettingsView.vue`, `AIAssistantsTab.vue`, `AgentsTab.vue`, `TeamsTab.vue`, `RolesTab.vue`, `AutomationTab.vue` (`src/components/settings/`) | Local / mock | Searchable directory (`⌘K`) across 4 groups: Team & Workspace, Workflows & Productivity, AI Assistant, Ecosystem & System |

### Auth, Onboarding & Setup
| Module | Status | Route(s) | View & Key Components | Store / Data | Spec / Notes |
|---|---|---|---|---|---|
| **Auth Portal** | Live | `/auth` (`fullWidth`) | `src/views/AuthView.vue` | Local state | Switcher for Sign Up, OTP Verification, Login → links to `/onboarding` |
| **Onboarding v2** | Live | `/onboarding`, `/onboarding-v2` (`fullWidth`) | `src/views/OnboardingView.vue`, `src/components/onboarding/v2/*` | Local state | Multi-step company, currency, team/industry, plan selection + confetti |
| **Onboarding v1** | Legacy | `/onboarding-v1` (`fullWidth`) | `src/views/OnboardingV1View.vue`, `src/components/onboarding/Step*.vue` | Local state | Earlier onboarding iteration kept for reference |
| **Setup Wizard** | Live | `/setup-wizard` (`fullWidth`) | `src/views/SetupWizardView.vue`, `src/components/onboarding/v2/StepWizard*.vue` | `localStorage` | Post-signup checklist: Sales Team, WhatsApp Channel, Website LiveChat |

### Partner Program & Portal
| Module | Status | Route(s) | View & Key Components | Store / Data | Spec / Notes |
|---|---|---|---|---|---|
| **Partner Registration** | Live | `/partner/register` (`standalone`) | `src/views/PartnerRegisterView.vue` | Local state | Split-screen wizard: New Partner vs. Existing Customer CRM link |
| **Partner Portal** | Live | `/partner/overview`, `/partner/program`, `/partner/referrals`, `/partner/commissions`, `/partner/earnings` (redirect), `/partner/withdrawal`, `/partner/kit` (all `fullWidth`) | `src/views/partner/`: `PartnerOverviewView.vue`, `PartnerProgramView.vue`, `PartnerReferralsView.vue`, `PartnerCommissionsView.vue`, `PartnerWithdrawalView.vue`, `PartnerKitView.vue`; `src/components/partner/PartnerTrackSwitcher.vue` | `src/stores/partner.ts` | Dual-track switcher (`referral` vs. `sales`) alters nav labels, metrics, pipeline & rev-share views |

### Design System & Guidelines
| Module | Status | Route(s) | View & Key Components | Store / Data | Spec / Notes |
|---|---|---|---|---|---|
| **Design System** | Live | `/design-system` (`fullWidth`) | `src/views/DesignSystemView.vue` | `src/data/componentsList.ts` | Live Nova v4.0 component & pattern showcase |
| **Guidelines** | Live | `/guidelines` (`fullWidth`) | `src/views/GuidelinesView.vue` | `src/data/colorTokensData.ts`, `src/data/designSystemGuidelines.ts` | Token catalog, badge hierarchy, typography, contrast guide |

---

## 4. Cross-Module Connections & Shared State (Wiring Table)

Keep these links intact whenever editing related files:

### Pinia Stores (`src/stores/`)
- `src/stores/ui.ts` — controls `isSidebarCollapsed`, `activeParentItem`, `isSecondaryPanelOpen`, and `isDashboardTourOpen` across `AppShell.vue`, `TopNav.vue`, `Sidebar.vue`, `SecondaryPanel.vue`, and `DashboardView.vue`.
- `src/stores/partner.ts` — shared across all 6 Partner views + `PartnerTrackSwitcher.vue` (mounted globally inside `AppShell.vue` for `/partner/*` routes except `/partner/register`) + `SecondaryPanel.vue` (dynamically swaps Partner submenu labels/badges between Referral vs. Sales track).
- `src/stores/webforms.ts` — shared across all 5 views in `src/views/webforms/`.

### Shared `localStorage` Keys
| Key | Writers | Readers | Purpose |
|---|---|---|---|
| `rks-theme` / `rks-dark` | `src/composables/useTheme.ts` | `useTheme.ts`, `useChartTheme.ts` | Persists `light` / `dark` / `system` theme mode & reactive chart theming |
| `rakansales_crm_setup_checklist_v5` | `SetupWizardView.vue`, `CrmSetupStatusBar.vue` | `SetupWizardView.vue`, `CrmSetupStatusBar.vue` | Syncs setup checklist progress between Setup Wizard and Dashboard top bar |
| `rakansales_has_sample_data` | `OnboardingView.vue`, `DashboardView.vue` | `DashboardView.vue` | Toggles prepopulated sample analytics data & kebab dot indicator |
| `rks_partner_track` | `src/stores/partner.ts` | `src/stores/partner.ts` | Persists active Partner Portal track (`referral` vs. `sales`) |
| `rakansales_calendar_events` | `CalendarView.vue` | `CalendarView.vue` | Persists user-created/edited calendar events |
| `rakansales_created_deals` | *(cleared on mount)* | `DealsView.vue` | Cleared on `DealsView` init to prevent stale duplicate deal cards |

### Deep Links, Query Params & Redirects
- `/` → redirects to `/dashboard`
- `/settings/ai-assistants` → redirects to `/settings?tab=ai-assistants` (`SettingsView.vue` watches `route.query.tab`)
- `/campaigns?channel=whatsapp|email` & `/campaigns?create=whatsapp|email` — read by `CampaignsView.vue` from `SecondaryPanel.vue` links
- `/partner/earnings` → redirects to `/partner/commissions`

### Shell & Hidden Navigation Coupling
- **`src/components/layout/AppShell.vue`** wraps all non-`standalone` routes with `TopNav.vue` + `Sidebar.vue` + `SecondaryPanel.vue`.
- **`Sidebar.vue`** has **two stealth hover-only items** below Settings (`opacity-0 hover:opacity-100`):
  - **Hidden** → opens secondary menu for AI Assistants, Setup Wizard, Partner Registration, Onboarding v2/v1, Auth Flow, Design System, Guidelines.
  - **Partners** → opens Partner Portal submenu.

### Standalone HTML Mirrors (`html/`)
Zero-dependency HTML prototypes that mirror Vue views (update together if flows change):
- `html/onboarding-wizard.html` ↔ `src/views/OnboardingView.vue`
- `html/setup-wizard.html` ↔ `src/views/SetupWizardView.vue`
- `html/partner-register.html` ↔ `src/views/PartnerRegisterView.vue`

---

## 5. Source-of-Truth Docs & Tooling

- **Agent Rules:** `AGENTS.md` (auto-loaded every session)
- **Design System Spec:** `DESIGN.md` + `src/assets/index.css` (56 semantic tokens)
- **Product Spec:** `PRODUCT.md`
- **Module PRDs:** `docs/omnichannel_specs/` (4 PRDs), `docs/webform_specs/` (13 specs), `docs/Roadshow Script/RakanSales_Roadshow_Video_Script.md`
- **Quality Scripts:** `scripts/audit-tokens.cjs`, `scripts/codemod-tokens.cjs`, `scripts/verify-contrast.cjs`, `scripts/check-map.cjs`
- **Per-Module Deep Briefs (Optional):** Place under `.context/modules/<module>.md` if a single module grows complex enough to need its own architecture note, and link it from Section 3 above.

---

## 6. Unwired Navigation Placeholders (Backlog)

Present in `Sidebar.vue` / `SecondaryPanel.vue` without dedicated views yet:
- **Tickets** (sidebar item)
- **Reports** (12 submenu items: Overview, Sales, Conversations, Tickets, Campaigns, Agents, Teams, Inboxes, Labels, SLA, CSAT, Bots)
- **Help Center** (Articles, Categories, Locales, Help Center Settings)
- **Appointments** → Availability, Settings
- **Campaigns** → Live Chat, SMS, Email Templates, Email Providers, AI Campaigns
- **Conversations** → Channel filter sub-views (Support Email, WhatsApp Business, Instagram Direct, Website Chat)
