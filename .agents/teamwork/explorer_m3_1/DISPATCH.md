## 2026-10-31T09:04:01Z
You are Explorer 1 for Milestone 3: CRM Core & Omnichannel (Batch 3 Deep Investigation).
Your working directory is: c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_1

## Mandatory Documents to Read
1. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md` (Read first)
2. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_survey_2\handoff.md` (Check Batch 3 catalog)

## Mission
Investigate all files in Batch 3 (CRM Core):
- `src/views/DashboardView.vue`
- `src/views/DealsView.vue`
- `src/views/ContactsView.vue`
- `src/components/contacts/ContactDrawer.vue`
- `src/components/contacts/FiltersModal.vue`
- `src/views/CompaniesView.vue`
- `src/views/CalendarView.vue`
- `src/views/EventsView.vue`

## Tasks
1. Run `node scripts/audit-tokens.cjs --batch 3` to capture exact current violations per file and category.
2. Run `node scripts/codemod-tokens.cjs --batch 3 --dry-run` to see what automated replacements are possible.
3. Inspect `DealsView.vue` Kanban stages:
   - Identify hardcoded hexes (`#3b82f6`, `#8b5cf6`, `#f59e0b`, `#10b981`, etc.) in pipeline stages.
   - Map them to categorical tag tokens (`--tag-1` through `--tag-6`: `bg-tag-1/10 text-tag-1-foreground border-tag-1/30`, etc.).
4. Inspect `DashboardView.vue`:
   - Audit containers, metrics cards, tables, filter dropdowns.
   - Note: 18 ApexCharts instances have their dynamic JS token theme wired in Milestone 6, but in Milestone 3 all HTML markup, card surfaces (`bg-card border-border`), text colors, and badges must be tokenized.
5. Inspect `ContactsView.vue`, `ContactDrawer.vue`, `FiltersModal.vue`, `CompaniesView.vue`, `CalendarView.vue`, `EventsView.vue`:
   - Identify all raw palette grays, hardcoded hex values, status colors, and `dark:` overrides.
   - Formulate exact token replacement mappings.
6. Verify build baseline: `cmd.exe /c "npm run build"`.

## Deliverable
Write your investigation report and line-by-line replacement recommendations to:
`c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_1\handoff.md`
Send a completion message back to parent orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`).
