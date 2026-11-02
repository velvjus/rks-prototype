## 2026-10-31T10:17:53Z
You are worker_m3_iter2, the implementation worker for Milestone 3 (Iteration 2) Remediation of CRM Core & Omnichannel (Batches 3 & 4) in the Production Dark Mode Migration.

Your working directory is:
`c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m3_iter2`

### Mandatory Reading
Read the authoritative user request before beginning:
`c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md`

Also read the Explorer handoff reports containing the exact recipes and proof:
- `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_iter2_3\handoff.md` (Holistic plan & recipes)
- `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_iter2_1\handoff.md` (DealsView & EventsView recipes)
- `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_iter2_2\handoff.md` (OmnichannelView & audit hardening)

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Exclusive Write Ownership
You exclusively own and may modify only these 4 files:
1. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\scripts\audit-tokens.cjs`
2. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\DealsView.vue`
3. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\EventsView.vue`
4. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\OmnichannelView.vue`

DO NOT edit any other file.

### Required Tasks (Follow the 5-Phase Execution Plan)

#### Phase 1: Harden `scripts/audit-tokens.cjs` (Lines 121–134)
Update `RULES` in `scripts/audit-tokens.cjs`:
- `paletteGrays`:
  pattern: `/\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b|\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline)-(?:white|black)\b/g`
- `hexRgbClasses`:
  pattern: `/\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g`
- `rawStatusColors`:
  pattern: `/\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g`

#### Phase 2: Remediate `src/views/DealsView.vue`
Apply the 28 clean token replacements identified in `explorer_m3_iter2_3/handoff.md` and `explorer_m3_iter2_1/handoff.md`:
1. Lines 1493, 1518, 1727: `bg-pink-100` -> `bg-muted`
2. Line 2068: `bg-pink-100` -> `bg-muted`, `border-gray-150` -> `border-border`
3. Line 3212: `border-t-[#23B750]` -> `border-t-primary`
4. Non-standard grays:
   - Lines 1536, 1649, 1653, 1704, 2289: `hover:text-gray-655` -> `hover:text-foreground`
   - Line 1690: `border-gray-350` -> `border-border`
   - Lines 1764, 3172: `border-gray-255` -> `border-border`
   - Line 1785: `text-gray-505` -> `text-muted-foreground`
   - Line 3066: `text-gray-550` -> `text-muted-foreground`
   - Line 3280: `border-gray-155` -> `border-border`
5. Non-standard colors & malformed opacities:
   - Lines 1871, 3108: `text-amber-605` -> `text-warning`
   - Line 1898: `text-blue-605` -> `text-primary`
   - Line 1914: `bg-success/10/40 rounded-2xl p-6 border border-emerald-250` -> `bg-success/10 rounded-2xl p-6 border border-success/30`
   - Line 1923, 1928: `bg-destructive/10/40` -> `bg-destructive/10`, `text-red-505/80` -> `text-destructive/80`
   - Line 2190: `bg-destructive/10/85` -> `bg-destructive/10`
6. Arbitrary RGBA shadows:
   - Line 1678: `hover:shadow-[0_8px_20px_rgba(35,183,80,0.08)]` -> `hover:shadow-md hover:shadow-primary/10`
   - Line 2145: `shadow-[0_18px_42px_-8px_rgba(15,23,42,0.16),0_4px_12px_-2px_rgba(15,23,42,0.06)]` -> `shadow-2xl`
   - Line 2172: `shadow-[0_10px_22px_-4px_rgba(220,38,38,0.35)]` / Won zone -> `shadow-lg shadow-success/30`
   - Line 2189: Lost zone -> `shadow-lg shadow-destructive/30`
   - Line 2206: Archive zone -> `shadow-lg`
   - Line 2223: Toast -> `shadow-xl`
   - Line 2619: Modal -> `shadow-2xl`

#### Phase 3: Remediate `src/views/EventsView.vue`
1. Line 827: `bg-emerald-350` -> `bg-success` (and deduplicate `bg-muted bg-muted` / `border-border border-border` on line 826).
2. Line 893: `bg-cyan-500` -> `bg-tag-6` (categorical cyan token).
3. Line 1150: `text-gray-550` -> `text-muted-foreground`.
4. Toast & Scanner shadows (lines 16 & 1051): `shadow-emerald-500/10` -> `shadow-success/10`, `shadow-red-500/10` -> `shadow-destructive/10`, `shadow-emerald-500/50` -> `shadow-success/50`.

#### Phase 4: Remediate `src/views/OmnichannelView.vue`
1. Lines 3357–3365:
   Replace composer container mode classes with:
   - `isAiDraftCompleteGlow`: `'border-primary ring-3 ring-primary/25 bg-primary/5 shadow-lg shadow-primary/25'`
   - `isAiTypingAnimation`: `'border-info/50 ring-2 ring-info/10 bg-card'`
   - `composerMode === 'note'`: `'bg-warning/10 border-warning/30'`
   - default: `'bg-card border-input/80'`
2. Lines 3371, 3381, 3392, 3396 (and any others in the file): Replace malformed `bg-muted/40/20` with `bg-muted/30`.

#### Phase 5: Verification Runs
Run these verification commands and capture exact outputs:
1. `node scripts/audit-tokens.cjs --batch 1` (Must exit 0, 0 violations)
2. `node scripts/audit-tokens.cjs --batch 2` (Must exit 0, 0 violations across 357 files)
3. `node scripts/audit-tokens.cjs --batch 3` (Must exit 0, 0 violations)
4. `node scripts/audit-tokens.cjs --batch 4` (Must exit 0, 0 violations)
5. `node .agents/teamwork/challenger_m3_1/test_token_stress.cjs` (Must pass 159/159 checks with exit 0)
6. `cmd.exe /c "npm run build"` (Must exit 0 with 0 errors)

Write your full report to:
`c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m3_iter2\handoff.md`
and notify orchestrator via `send_message`.
