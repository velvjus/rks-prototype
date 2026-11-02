# DISPATCH — worker_m4

## Mission: Milestone 4 Implementation (Batches 5, 6, 7 — Settings, Forms/Booking, Partner Portal)
Your working directory is: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m4`

You MUST read:
1. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md`
2. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\AGENTS.md`
4. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_1\handoff.md` (Batch 5 recipes)
5. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_2\handoff.md` (Batch 6 recipes)
6. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_3\handoff.md` (Batch 7 recipes & holistic strategy)

### MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Exclusive Write Ownership (22 Target Files):
#### Batch 5 (Settings - 7 files):
1. `src/views/SettingsView.vue`
2. `src/components/settings/AIAssistantsTab.vue`
3. `src/components/settings/AutomationTab.vue`
4. `src/components/settings/AgentsTab.vue`
5. `src/components/settings/TeamsTab.vue`
6. `src/components/settings/RolesTab.vue`
7. `src/components/dashboard/CrmSetupStatusBar.vue`

#### Batch 6 (Forms & Booking - 7 files):
8. `src/views/webforms/FormBuilderView.vue`
9. `src/views/webforms/WebFormsDashboardView.vue`
10. `src/views/webforms/FormDetailView.vue`
11. `src/views/webforms/SubmissionsView.vue`
12. `src/views/BookingPagesView.vue`
13. `src/views/ScanNameCardView.vue`
14. `src/views/AddonsView.vue`

#### Batch 7 (Partner Portal - 8 files):
15. `src/views/partner/PartnerReferralsView.vue`
16. `src/views/partner/PartnerOverviewView.vue`
17. `src/views/partner/PartnerWithdrawalView.vue`
18. `src/views/partner/PartnerProgramView.vue`
19. `src/views/PartnerRegisterView.vue`
20. `src/views/partner/PartnerCommissionsView.vue`
21. `src/views/partner/PartnerKitView.vue`
22. `src/components/partner/PartnerTrackSwitcher.vue`

### Implementation Strategy & Rules:
1. Follow the 3-phase execution recommended by `explorer_m4_3`:
   - Phase 1: Migrate Batch 7 (Partner Portal — 8 files). Eliminate all 136 `dark:` overrides (including `dark:bg-[#0B0F19]`) and script-level color definitions. Verify: `node scripts/audit-tokens.cjs --batch 7` (0 violations).
   - Phase 2: Migrate Batch 6 (Forms & Booking — 7 files). Migrate FormBuilder, BookingPages, phone chassis in ScanNameCard to `--rail` tokens, scanner laser to `.glow`, Addons dataset colors. Verify: `node scripts/audit-tokens.cjs --batch 6` (0 violations).
   - Phase 3: Migrate Batch 5 (Settings — 7 files). Migrate Settings tabs, Status bar, Roles/Teams/Agents/Automation color mappings, button hovers. Verify: `node scripts/audit-tokens.cjs --batch 5` (0 violations).
2. **Never introduce double-slash opacity**: Ensure replacements never yield `token/x/y`.
3. **Never add `dark:` class overrides**: Fix tokens via semantic classes (`bg-card`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `bg-brand`, `bg-success/10`, `bg-warning/10`, `bg-destructive/10`, `bg-info/10`).
4. **PartnerRegisterView Logo Theme Awareness**: Import `darkLogoUrl` and bind `:src="isDark ? darkLogoUrl : lightLogoUrl"`.
5. Run verification commands:
   - `node scripts/audit-tokens.cjs --batch 5`
   - `node scripts/audit-tokens.cjs --batch 6`
   - `node scripts/audit-tokens.cjs --batch 7`
   - `cmd.exe /c "npm run build"`
6. Document all changes and outputs in `handoff.md` and notify orchestrator when done.


## 2026-10-31T17:23:49Z
[Message] timestamp=2026-10-31T17:23:49Z sender=57c50def-4689-4a65-86f1-14dce8a95cbf priority=MESSAGE_PRIORITY_HIGH content=You are worker_m4. Your working directory is c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m4.
You MUST read:
1. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md
2. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md
3. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\AGENTS.md
4. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m4\DISPATCH.md
5. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_1\handoff.md (Batch 5 recipes)
6. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_2\handoff.md (Batch 6 recipes)
7. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_3\handoff.md (Batch 7 recipes & holistic strategy)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You have EXCLUSIVE WRITE OWNERSHIP of all 22 files across Batches 5, 6, and 7:
Batch 5 (Settings - 7 files):
1. src/views/SettingsView.vue
2. src/components/settings/AIAssistantsTab.vue
3. src/components/settings/AutomationTab.vue
4. src/components/settings/AgentsTab.vue
5. src/components/settings/TeamsTab.vue
6. src/components/settings/RolesTab.vue
7. src/components/dashboard/CrmSetupStatusBar.vue

Batch 6 (Forms & Booking - 7 files):
8. src/views/webforms/FormBuilderView.vue
9. src/views/webforms/WebFormsDashboardView.vue
10. src/views/webforms/FormDetailView.vue
11. src/views/webforms/SubmissionsView.vue
12. src/views/BookingPagesView.vue
13. src/views/ScanNameCardView.vue
14. src/views/AddonsView.vue

Batch 7 (Partner Portal - 8 files):
15. src/views/partner/PartnerReferralsView.vue
16. src/views/partner/PartnerOverviewView.vue
17. src/views/partner/PartnerWithdrawalView.vue
18. src/views/partner/PartnerProgramView.vue
19. src/views/PartnerRegisterView.vue
20. src/views/partner/PartnerCommissionsView.vue
21. src/views/partner/PartnerKitView.vue
22. src/components/partner/PartnerTrackSwitcher.vue

Execute in the 3-phase order recommended by Explorer 3:
- Phase 1: Migrate Batch 7 (Partner Portal — 8 files). Eliminate all 136 `dark:` overrides (including `dark:bg-[#0B0F19]`) and script-level color definitions. Verify: `node scripts/audit-tokens.cjs --batch 7` achieves 0 violations.
- Phase 2: Migrate Batch 6 (Forms & Booking — 7 files). Tokenize FormBuilder, BookingPages, phone chassis in ScanNameCard to `--rail` tokens, scanner laser to `.glow`, Addons dataset colors. Verify: `node scripts/audit-tokens.cjs --batch 6` achieves 0 violations.
- Phase 3: Migrate Batch 5 (Settings — 7 files). Tokenize Settings tabs, Status bar, Roles/Teams/Agents/Automation color mappings, button hovers. Verify: `node scripts/audit-tokens.cjs --batch 5` achieves 0 violations.

CRITICAL RULES:
- Never introduce double-slash opacity (e.g. `bg-success/10/30` or `bg-muted/40/90`).
- Never add `dark:` overrides.
- In PartnerRegisterView.vue: import `darkLogoUrl from '@/assets/logo/RKS Logo Lockup 02.svg'`, import `useTheme`, and bind `:src="isDark ? darkLogoUrl : lightLogoUrl"`.
- Run verification commands:
  - `node scripts/audit-tokens.cjs --batch 5`
  - `node scripts/audit-tokens.cjs --batch 6`
  - `node scripts/audit-tokens.cjs --batch 7`
  - `cmd.exe /c "npm run build"`
Write your complete report to handoff.md in your working directory and notify the orchestrator via send_message when finished.
