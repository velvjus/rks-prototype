## 2026-10-31T21:37:40Z
From: 5aea650b-d2f1-47cc-a2a7-514ea3536dc2
Priority: MESSAGE_PRIORITY_HIGH

Implement dark mode across every page of the codebase following the token-based architecture and migration plan for production.

Integrity mode: development

## Requirements

### R1. Foundation & Token System
Deduplicate `:root` and `.dark` blocks in `src/assets/index.css`, using existing token values as the primary source of truth. Add semantic tokens (success, warning, info, brand), categorical tag tokens (`--tag-1` through `--tag-6` with light/dark bg+fg pairs), and dedicated rail tokens (`--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-active`) so the outer navigation rail remains dark in both themes while token-driven. Clean up `tailwind.config.js` to ensure color tokens are not overridden by raw hex values, extract `useTheme.ts` composable, and create an audit script and tokenization codemod.

### R2. Codebase-wide Batch Migration
Migrate pages in batches replacing raw colors (palette grays/neutrals, hex/rgb values, raw status colors, and `dark:` overrides) with semantic tokens:
- Batch 1 (App Shell): MainLayout.vue, AppShell.vue, Sidebar.vue, SidebarItem, SecondaryPanel.vue, TopNav, InboxDropdown, ToastNotifications
- Batch 2 (UI Components): components/ui
- Batch 3 (CRM Core): DashboardView, DealsView, ContactsView, ContactDrawer, FiltersModal, CompaniesView, CalendarView, EventsView
- Batch 4 (Omnichannel): OmnichannelView, ConversationItem, OmnichannelTutorialModal, TemplatePickerModal, ManageTemplatesView, PlatformIcon
- Batch 5 (Settings): SettingsView, AIAssistantsTab, AutomationTab, AgentsTab, TeamsTab, RolesTab, CrmSetupStatusBar
- Batch 6 (Forms, Booking & Tools): FormBuilderView, WebFormsDashboardView, FormDetailView, SubmissionsView, BookingPagesView, ScanNameCardView, AddonsView
- Batch 7 (Partner Portal): PartnerReferrals, PartnerOverview, PartnerWithdrawal, PartnerProgram, PartnerRegister, PartnerCommissions, PartnerKit, PartnerTrackSwitcher
- Batch 8 (Auth & Onboarding): AuthView, OnboardingView, SetupWizardView, steps, steppers
- Batch 9 (Docs & Guidelines): DesignSystemView, GuidelinesView

### R3. Charts & Documentation Alignment
Update ApexCharts and Unovis charts to dynamically adapt to dark and light themes by reading colors from CSS variables (e.g. via `getComputedStyle`). Fix raw styles, inline rgba, and illustrations. Align DESIGN.md with the token rules in AGENTS.md.

## Acceptance Criteria

### Token Architecture & Consistency
- [ ] Deduplicated `:root` and `.dark` blocks in `src/assets/index.css` define all semantic tokens (success, warning, info, brand).
- [ ] Dedicated rail tokens (`--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-active`) keep the outer navigation rail dark in both light and dark themes.
- [ ] Categorical tag tokens (`--tag-1` through `--tag-6`) provide paired background and foreground tokens for both light and dark themes.
- [ ] `tailwind.config.js` does not override semantic color tokens with raw hex values.
- [ ] `useTheme.ts` composable manages theme state.
- [ ] All components across Batches 1 through 9 use semantic tokens without raw palette grays/neutrals, hex/rgb values, raw status colors, or `dark:` overrides.
- [ ] ApexCharts and Unovis charts dynamically read colors from CSS variables and respond to theme changes.
- [ ] DESIGN.md matches the token rules in AGENTS.md.

### Verification & Quality
- [ ] Audit script detects zero raw color violations across migrated files.
- [ ] Project builds successfully via `npm run build` with zero TypeScript and build errors.
- [ ] Every migrated page renders properly with legible contrast in both light and dark modes.

---
## Orchestrator Environment & Instructions
- Working directory: `.agents/teamwork/orchestrator_2/`
- Original request reference: `.agents/teamwork/ORIGINAL_REQUEST.md`
- Master project scope: `.agents/teamwork/orchestrator_1/PROJECT.md`
- Predecessor state: `.agents/teamwork/orchestrator_2/PREDECESSOR_STATE.md`
- Current state: Milestones 1, 2, 3, and 4 are fully implemented and verified with 0 violations across Batches 1 through 7.
- Your immediate mission: Pick up execution and drive Milestone 5 (Batches 8 & 9: Auth, Onboarding, Guidelines, Design System) and Milestone 6 (R3 Charts dynamic theming, DESIGN.md alignment, codebase-wide 0-violation audit validation, and build verification).
- Maintain `progress.md`, `plan.md`, and `BRIEFING.md` in your working directory.
