# DISPATCH — worker_m4_iter2

## Mission: Milestone 4 Iteration 2 Implementation (Settings, Forms & Partner Portal Remediation)
Your working directory is: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m4_iter2`

You MUST read:
1. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md`
2. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\AGENTS.md`
4. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_iter2_3\handoff.md` (Master Blueprint with exact before/after diffs)
5. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_iter2_1\handoff.md` (Partner Views detail)
6. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_iter2_2\handoff.md` (Settings & Tools detail)

### File Ownership:
You have exclusive write access to:
1. `src/views/partner/PartnerProgramView.vue`
2. `src/views/PartnerRegisterView.vue`
3. `src/views/SettingsView.vue`
4. `src/views/AddonsView.vue`
5. `src/components/settings/AutomationTab.vue`
6. `scripts/audit-tokens.cjs`

### Step-by-Step Implementation Sequence:

#### Step 1: Batch 7 Remediations
1. **`src/views/partner/PartnerProgramView.vue`**:
   - Line 650: Replace `accent-[#23B750]` with `accent-primary` on the range input.
   - Line 917: Replace `accent-[#23B750]` with `accent-primary` on the terms checkbox.
2. **`src/views/PartnerRegisterView.vue`**:
   - Lines 46–59: Replace the inline `<svg>` inside the desktop hover slide-down header with:
     ```html
     <img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-7 w-auto transition-transform group-hover/logo:scale-102" alt="RakanSales Logo" />
     ```

#### Step 2: Batch 5 & 6 Remediations
1. **`src/views/SettingsView.vue`**:
   - Lines 3090–3096: In `.custom-settings-scrollbar::-webkit-scrollbar-thumb`, replace `#e2e8f0` with `var(--border)` and hover `#cbd5e1` with `var(--muted-foreground)`.
   - Line 2112: Replace `shadow-amber-500/5` with `shadow-warning/5`.
   - Lines 2767–2788: Tokenize `activeLabels` and `tagColors` using `var(--tag-1)` through `var(--tag-6)` with matching `var(--tag-N-foreground)`.
   - Lines 1974–1990 & 2016–2030: Update modal palette grids to `grid-cols-6` and remove invalid `borderColor: selectedTagColor.text + '30'` / `editTagModal.colorText + '30'` string concatenations (relying on `border border-border`).
2. **`src/views/AddonsView.vue`**:
   - Lines 444–449: Replace raw hex colors and DOM query in `sliderBackground` with `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`.
3. **`src/components/settings/AutomationTab.vue`**:
   - Line 1578: Replace fallback `'#94A3B8'` in `getTagDotColor` with `'hsl(var(--muted-foreground))'`.

#### Step 3: Tooling Hardening
1. **`scripts/audit-tokens.cjs`**:
   - In `RULES`:
     - Update `paletteGrays` to include `shadow|accent|caret`.
     - Update `hexRgbClasses` to include `accent|caret`.
     - Update `rawStatusColors` to include `shadow|accent|caret`.
     - Add `scopedStyleHexRgb` rule (`/#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d+/g`).
   - In `auditFile`:
     - Track `<style>` blocks via `inStyleBlock` for `.vue` files.
     - Apply `scopedStyleHexRgb` only inside `<style>` blocks, and other rules only outside `<style>` blocks.

#### Step 4: Verification
1. Run token audits across all batches:
   - `node scripts/audit-tokens.cjs --batch 5`
   - `node scripts/audit-tokens.cjs --batch 6`
   - `node scripts/audit-tokens.cjs --batch 7`
   - Check regressions: `node scripts/audit-tokens.cjs --batch 1`, `--batch 2`, `--batch 3`, `--batch 4`
2. Run challenger adversarial suite:
   - `node .agents/teamwork/challenger_m4_1/test_m4_adversarial.cjs`
3. Run full production build:
   - `cmd.exe /c "npm run build"`
4. Deliver comprehensive report in `handoff.md` and send message to orchestrator.

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.


## 2026-10-31T18:23:59Z
You are worker_m4_iter2, an implementation worker for Milestone 4 Iteration 2 (Settings, Forms & Partner Portal Remediation).
Your working directory is: c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m4_iter2

Read your complete instructions and exact code diffs from:
1. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m4_iter2\DISPATCH.md
2. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md
3. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md
4. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\AGENTS.md
5. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_iter2_3\handoff.md (Master Blueprint with exact before/after diffs)
6. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_iter2_1\handoff.md (Partner Views detail)
7. c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_iter2_2\handoff.md (Settings & Tools detail)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks:
1. Apply the exact changes to the 5 target application files:
   - src/views/partner/PartnerProgramView.vue (Lines 650 & 917: accent-primary)
   - src/views/PartnerRegisterView.vue (Lines 46–59: dynamic <img> logo)
   - src/views/SettingsView.vue (scrollbar tokens, shadow-warning/5, CRM tag tokens, fixed modal template bindings)
   - src/views/AddonsView.vue (sliderBackground CSS variable gradient)
   - src/components/settings/AutomationTab.vue (getTagDotColor fallback token)
2. Apply the hardening updates to scripts/audit-tokens.cjs (RULES & auditFile inStyleBlock tracking).
3. Verify:
   - node scripts/audit-tokens.cjs --batch 5
   - node scripts/audit-tokens.cjs --batch 6
   - node scripts/audit-tokens.cjs --batch 7
   - Check regressions: node scripts/audit-tokens.cjs --batch 1, --batch 2, --batch 3, --batch 4
   - node .agents/teamwork/challenger_m4_1/test_m4_adversarial.cjs
   - cmd.exe /c "npm run build"
4. Write handoff.md in your working directory and notify the orchestrator.
