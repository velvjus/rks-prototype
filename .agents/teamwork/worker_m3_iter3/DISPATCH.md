## 2026-10-31T16:56:11Z
You are worker_m3_iter3, the implementation worker for Milestone 3 (Iteration 3) of the Production Dark Mode Migration.

Your working directory is:
`c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m3_iter3`

### Mandatory Reading
Read the authoritative user request before beginning:
`c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md`

Read the Explorer handoff reports containing the exact recipes:
- `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_iter3_3\handoff.md` (Unified plan)
- `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_iter3_1\handoff.md` (DealsView & Spinner contrast)
- `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_iter3_2\handoff.md` (OmnichannelView & audit rule)

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Exclusive Write Ownership
You exclusively own and may edit only these 4 files:
1. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\DealsView.vue`
2. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\OmnichannelView.vue`
3. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\scripts\audit-tokens.cjs`
4. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\assets\index.css`

DO NOT edit any other file.

### Required Execution Steps

#### Step 1: Remediate `src/views/DealsView.vue`
1. Line 1840: Replace `'hover:bg-muted/30/75 transition-colors cursor-pointer',` with `'hover:bg-muted/75 transition-colors cursor-pointer',`
2. Line 3212: Replace `<div class="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>` with `<div class="absolute inset-0 rounded-full border-4 border-t-brand animate-spin"></div>`
3. Line 3268: Replace `roundRobinActivePool[agent] !== false ? 'hover:bg-muted/30/50' : 'bg-muted/30 opacity-60'` with `roundRobinActivePool[agent] !== false ? 'hover:bg-muted/50' : 'bg-muted/30 opacity-60'`

#### Step 2: Remediate `src/views/OmnichannelView.vue`
1. Line 2359: `bg-muted/40/90` -> `bg-muted/90`
2. Line 2400: `bg-muted/40/90` -> `bg-muted/90`
3. Line 2451: `bg-muted/40/95` -> `bg-muted/95`
4. Line 2505: `bg-muted/40/10` -> `bg-muted/30`
5. Line 3023: `bg-muted/40/50` -> `bg-muted/50`
6. Line 3359: Replace `border-primary ring-3 ring-primary/25 bg-primary/5 shadow-lg shadow-primary/25` with `border-brand ring-3 ring-brand/25 bg-brand/5 shadow-lg shadow-brand/25`
7. Line 3403: `bg-muted/40/10` -> `bg-muted/30`
8. Line 3505: `bg-muted/40/90` -> `bg-muted/90`
9. Line 3570: `bg-muted/40/80` -> `bg-muted/80`
10. Line 3616: `bg-muted/40/50` -> `bg-muted/50`

#### Step 3: Harden `scripts/audit-tokens.cjs`
Add `malformedDoubleOpacity` to `RULES` (around line 142):
```javascript
  malformedDoubleOpacity: {
    name: 'Malformed Double Opacity Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g
  }
```

#### Step 4: Foundation Alignment in `src/assets/index.css`
In `src/assets/index.css` under `.dark` (line 116):
Update `--primary: oklch(0.448 0.119 151.328);` to:
`--primary: oklch(0.65 0.18 149.2);`

#### Step 5: Verification Runs
Run these verification commands and capture exact outputs:
1. `node scripts/audit-tokens.cjs --batch 1` (0 violations)
2. `node scripts/audit-tokens.cjs --batch 2` (0 violations)
3. `node scripts/audit-tokens.cjs --batch 3` (0 violations)
4. `node scripts/audit-tokens.cjs --batch 4` (0 violations)
5. `node .agents/teamwork/challenger_m3_iter2_1/adversarial_token_stress.cjs` (184/184 pass, 0 double opacity remnants)
6. `node .agents/teamwork/challenger_m3_iter2_2/test_wcag_and_edge_cases.cjs` (23/23 pass, 0 failures)
7. `cmd.exe /c "npm run build"` (exit code 0, 0 TypeScript errors)

Write your full report to:
`c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m3_iter3\handoff.md`
and notify orchestrator via `send_message`.
