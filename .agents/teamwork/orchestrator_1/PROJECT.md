# Project: Production Dark Mode Migration

## Architecture
- **Token Source of Truth**: Single canonical `:root` and `.dark` block inside `@layer base` in `src/assets/index.css`.
- **Utility Generation**: Tailwind CSS v4 `@theme inline` mapping in `src/assets/index.css` paired with synchronized `var(--<token>)` color extensions in `tailwind.config.js`.
- **Theme State Management**: `src/composables/useTheme.ts` managing `light | dark | system` mode, reactive `isDark`, synchronizing `.dark` on `document.documentElement`, localStorage (`rks-theme` and `rks-dark`), and system preference detection (`window.matchMedia`). Pre-paint anti-FOUC inline script in `index.html`.
- **Outer Rail Theme Invariance**: Dedicated rail tokens (`--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-active`, `--rail-border`) maintain dark rail aesthetics across both light and dark themes in a 100% token-driven manner.
- **Categorical Tag Channels**: 6 distinct OKLCH background and foreground pairs (`--tag-1` through `--tag-6` and `--tag-N-foreground`) providing accessible color differentiation for CRM pipeline stages, badges, and categories in both themes.
- **Dynamic Chart Theming**: Reactive `useChartTheme.ts` querying resolved CSS variable color values from the DOM to dynamically re-render ApexCharts and Unovis charts when the theme toggles.
- **Audit Gate**: Automated token audit script (`scripts/audit-tokens.cjs`) enforcing zero raw color violations across migrated files.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | CSS Token Deduplication | Remove duplicate unlayered :root and .dark blocks in `index.css`, consolidate in `@layer base` | M1 | Survey (Explorer 1) [DONE] |
| 2 | Semantic Status Tokens | Define `--success`, `--warning`, `--info`, `--brand` and foregrounds in light & dark | M1 | Survey (Explorer 1) [DONE] |
| 3 | Dedicated Rail Tokens | Define `--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-active`, `--rail-border` (dark in both themes) | M1 | Survey (Explorer 1) [DONE] |
| 4 | Categorical Tag Tokens | Define `--tag-1` through `--tag-6` with paired background & foreground in light & dark | M1 | Survey (Explorer 1) [DONE] |
| 5 | Tailwind Config Decoupling | Remove raw hex overrides (`#23B750`, etc.) and `hsl()` wrappers in `tailwind.config.js`, map to `var(--<token>)` | M1 | Survey (Explorer 1) [DONE] |
| 6 | Scrollbar Tokenization | Replace raw hex scrollbar thumb/track styles in `index.css` with semantic tokens | M1 | Survey (Explorer 1) [DONE] |
| 7 | Centralized `useTheme.ts` | Composable with `mode`, `isDark`, `setMode`, `toggleTheme`, localStorage sync, matchMedia, and anti-FOUC script | M1 | Survey (Explorer 1) [DONE] |
| 8 | Token Audit & Codemod Tools | Create `scripts/audit-tokens.cjs` and `scripts/codemod-tokens.cjs` to enforce and automate migration | M1 | Survey (Explorer 3) [DONE] |
| 9 | Batch 1 Migration (App Shell) | Migrate MainLayout, AppShell, Sidebar, SidebarItem, SecondaryPanel, TopNav, InboxDropdown, ToastNotifications | M2 | Survey (Explorer 2) |
| 10 | Batch 2 Migration (UI Components) | Migrate Button CVA variants, Dialog/Drawer/Alert overlay backdrops, and Unovis base token links in `src/components/ui/` | M2 | Survey (Explorer 2) |
| 11 | Batch 3 Migration (CRM Core) | Migrate DashboardView, DealsView (Kanban tags 1-5), ContactsView, ContactDrawer, FiltersModal, CompaniesView, CalendarView, EventsView | M3 | Survey (Explorer 2) |
| 12 | Batch 4 Migration (Omnichannel) | Enable dark mode across OmnichannelView, ConversationItem, OmnichannelTutorialModal, TemplatePickerModal, ManageTemplatesView, PlatformIcon | M3 | Survey (Explorer 2) |
| 13 | Batch 5 Migration (Settings) | Migrate SettingsView, AIAssistantsTab, AutomationTab, AgentsTab, TeamsTab, RolesTab, CrmSetupStatusBar | M4 | Survey (Explorer 2) |
| 14 | Batch 6 Migration (Forms & Booking) | Migrate FormBuilderView, WebFormsDashboardView, FormDetailView, SubmissionsView, BookingPagesView, ScanNameCardView, AddonsView | M4 | Survey (Explorer 2) |
| 15 | Batch 7 Migration (Partner Portal) | Migrate PartnerReferrals, PartnerOverview, PartnerWithdrawal, PartnerProgram, PartnerRegister, PartnerCommissions, PartnerKit, PartnerTrackSwitcher | M4 | Survey (Explorer 2) |
| 16 | Batch 8 Migration (Auth & Onboarding) | Migrate AuthView, OnboardingView, SetupWizardView, and all 17 step/stepper components | M5 | Survey (Explorer 2) |
| 17 | Batch 9 Migration (Docs & Guidelines) | Migrate DesignSystemView, GuidelinesView, living component catalogs | M5 | Survey (Explorer 2) |
| 18 | Dynamic Chart Theming Composable | Implement `src/composables/useChartTheme.ts` to dynamically resolve tokens and react to theme changes | M6 | Survey (Explorer 3) |
| 19 | ApexCharts & Unovis Adaptation | Convert 18 charts in DashboardView and 2 in PartnerOverviewView to reactive computed options with theme-aware colors | M6 | Survey (Explorer 3) |
| 20 | Particle Confetti Token Adaptation | Update canvas-confetti invocations in Setup/Onboarding to use theme-aware brand/status colors | M6 | Survey (Explorer 3) |
| 21 | Documentation Alignment | Update `DESIGN.md` and `src/data/designSystemGuidelines.ts` to strictly adhere to `AGENTS.md` rules | M6 | Survey (Explorer 3) |
| 22 | Full-Codebase Audit & Build Gate | Execute audit script with 0 violations across all 417 files, verify `npm run build` succeeds with 0 errors | M6 | Survey (Explorer 2 & 3) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Foundation, Token System & Tooling (R1) | Features 1–8: `index.css`, `tailwind.config.js`, `useTheme.ts`, `index.html`, audit & codemod scripts | none | DONE (Gate passed, 0 errors, 100% tests passed) |
| M2 | App Shell & UI Components (R2 Batches 1 & 2) | Features 9–10: Batch 1 (App Shell, Rail tokens, TopNav toggle) & Batch 2 (UI primitives) | M1 | DONE (Gate passed, 0 violations, 100% tests passed) |
| M3 | CRM Core & Omnichannel (R2 Batches 3 & 4) | Features 11–12: Batch 3 (Dashboard, Deals Kanban tags, Contacts, Calendar, Events) & Batch 4 (Omnichannel chat) | M2 | DONE (Gate passed, 0 violations, 100% tests passed) |
| M4 | Settings, Forms & Partner Portal (R2 Batches 5, 6, 7) | Features 13–15: Batch 5 (Settings tabs), Batch 6 (WebForms/Booking/ScanCard), Batch 7 (Partner Portal) | M2 | PLANNED |
| M5 | Auth, Onboarding & Documentation Views (R2 Batches 8 & 9) | Features 16–17: Batch 8 (Auth/Onboarding/Steppers) & Batch 9 (DesignSystemView, GuidelinesView) | M2 | PLANNED |
| M6 | Charts Theming, Doc Alignment & Final Audit (R3 & Verification) | Features 18–22: Dynamic ApexCharts/Unovis theming, confetti, `DESIGN.md` update, 0-violation audit, build verification | M3, M4, M5 | PLANNED |

## Interface Contracts
### Theme System (`src/composables/useTheme.ts`)
```typescript
export type ThemeMode = 'light' | 'dark' | 'system';
export interface UseThemeReturn {
  mode: Ref<ThemeMode>;
  isDark: ComputedRef<boolean>;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}
```

### Chart Theming Helper (`src/composables/useChartTheme.ts`)
```typescript
export interface UseChartThemeReturn {
  isDark: ComputedRef<boolean>;
  resolveToken: (cssVarName: string, fallback?: string) => string;
  chartBase: ComputedRef<{
    chart: { background: string; foreColor: string; fontFamily: string; toolbar: { show: boolean } };
    theme: { mode: 'light' | 'dark' };
    grid: { borderColor: string; strokeDashArray: number };
    tooltip: { theme: 'light' | 'dark' };
    xaxis: { labels: { style: { colors: string } } };
    yaxis: { labels: { style: { colors: string } } };
  }>;
}
```

### Audit Tool CLI Contract (`scripts/audit-tokens.cjs`)
- Command: `node scripts/audit-tokens.cjs [--batch <1..9>] [--file <path>]`
- Return code: 0 if 0 violations found; 1 if any violation found.
- Scanned rules: palette grays (`gray-`, `slate-`, `zinc-`, `white`, `black`), hex/rgb classes (`bg-[#...]`), raw status colors (`bg-green-`, `text-red-`, etc.), redundant `dark:` class overrides.

## Code Layout
- `src/assets/index.css`: Canonical token definitions (`:root`, `.dark`, `@theme inline`)
- `tailwind.config.js`: Tailwind theme extensions referencing `var(--<token>)`
- `src/composables/useTheme.ts`: Core theme state composable
- `src/composables/useChartTheme.ts`: Dynamic chart color resolution composable
- `src/components/layout/`: App Shell components (TopNav, Sidebar, SidebarItem, SecondaryPanel, AppShell)
- `src/components/ui/`: Base Shadcn-Vue UI primitives
- `src/views/`: Application views (CRM, Omnichannel, Settings, Forms, Partner, Auth, Docs)
- `scripts/`: Tooling (audit script, codemod)
- `DESIGN.md`: Global design system documentation
