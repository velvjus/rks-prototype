## 2026-11-01T05:59:31Z

You are worker_m6, a teamwork_worker agent.
Your working directory: c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m6

MANDATORY FIRST STEP: Read the following files before taking any action:
1. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md
2. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md
3. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\AGENTS.md
4. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m6_1\analysis.md
5. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m6_1\handoff.md
6. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m6_2\analysis.md
7. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m6_2\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

SCOPE & EXCLUSIVE WRITE OWNERSHIP:
You own:
- `src/composables/useChartTheme.ts`
- `src/views/DashboardView.vue`
- `src/views/partner/PartnerOverviewView.vue`
- `src/views/DesignSystemView.vue`
- `DESIGN.md`
- `src/data/designSystemGuidelines.ts`
- `scripts/audit-tokens.cjs`

TASK:
1. Implement `src/composables/useChartTheme.ts` following the exact blueprint in `explorer_m6_1/handoff.md` and `PROJECT.md § Interface Contracts`:
   - OKLCH-to-sRGB resolution via DOM query and mathematical conversion to `#RRGGBB` / `rgba()` format expected by ApexCharts.
   - Reactive `isDark` integration from `useTheme.ts`.
   - Reactive `chartBase` computed property (`chart.background = 'transparent'`, `chart.foreColor`, `grid.borderColor`, `tooltip.theme`, axis label styles).
   - Reactive palette of semantic theme colors (`colors.primary`, `colors.success`, `colors.warning`, `colors.info`, `colors.destructive`, `colors.muted`, etc.).
2. Refactor `src/views/DashboardView.vue`:
   - Import `useChartTheme`.
   - Convert all 18 `<apexchart>` options to `computed(() => ({ ...chartBase.value, ... }))` referencing `colors.value.<token>` instead of hardcoded hex colors.
3. Refactor `src/views/partner/PartnerOverviewView.vue`:
   - Update `salesApexDonutOptions` and `pipelineApexDonutOptions` to spread `chartBase.value` and use `colors.value`.
4. In `src/views/DesignSystemView.vue`:
   - Update SVG sparklines and dial chart presentation attributes (lines 2444–2508 and line 2901) to use `var(--primary)`, `var(--brand-secondary)`, `stroke-border`, etc.
5. Update `DESIGN.md`:
   - Replace content with the validated text in `.agents/teamwork/explorer_m6_2/proposed_DESIGN.md`. Ensure zero token violations.
   - Ensure `src/data/designSystemGuidelines.ts` is fully aligned.
6. In `scripts/audit-tokens.cjs`:
   - Add `'src/data/designSystemGuidelines.ts'` to `BATCHES[9].files`.
7. Verify all changes:
   - Run `node scripts/audit-tokens.cjs` (must report 0 violations across all 444+ files)
   - Run `node scripts/audit-tokens.cjs --batch 9` (must report 0 violations across all 3 files)
   - Run `node scripts/audit-tokens.cjs --file DESIGN.md` (must report 0 violations)
   - Run `npm run build` (must pass cleanly with exit code 0)
8. Maintain `progress.md` in your working directory.
9. When complete, write `changes.md` and `handoff.md` in your working directory and send a message back with your verification results.
