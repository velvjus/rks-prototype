# Milestone 4 Adversarial Stress Test & Verification Report

**Agent**: `challenger_m4_1`  
**Milestone**: Milestone 4 (Settings, Forms & Partner Portal — Batches 5, 6, 7)  
**Parent Agent**: `57c50def-4689-4a65-86f1-14dce8a95cbf` (orchestrator)  
**Date**: 2026-10-31T18:12:00Z  
**Verdict**: **REJECT** (Remediation Required)

---

## 1. Observation

Direct empirical findings, file locations, line numbers, and tool execution outputs:

### 1.1 Baseline Audit & Build Verification
1. **Standard Audit Script Execution**:
   - `node scripts/audit-tokens.cjs --batch 5` -> reported 0 violations (7 files).
   - `node scripts/audit-tokens.cjs --batch 6` -> reported 0 violations (7 files).
   - `node scripts/audit-tokens.cjs --batch 7` -> reported 0 violations (8 files).
   - Regression Batches 1–4 -> reported 0 violations (380 files).
2. **Production Build Verification**:
   - Command: `cmd.exe /c "npm run build"`
   - Result: Exit code 0, 2961 modules transformed, zero TypeScript compiler errors, bundle built cleanly in 5.31s.

### 1.2 Adversarial Stress Test Findings
Executing our custom adversarial stress harness (`.agents/teamwork/challenger_m4_1/test_m4_adversarial.cjs`) revealed **4 concrete defects** that bypassed standard audits:

#### Defect 1: Hardcoded Hex Classes in `PartnerProgramView.vue`
- **File**: `src/views/partner/PartnerProgramView.vue`
- **Line 650**:
  ```html
  <input
    type="range"
    id="targetClosedDeals"
    aria-label="Target Closed Deals per Month"
    aria-valuemin="1"
    aria-valuemax="50"
    :aria-valuenow="simDealsPerMonth"
    v-model.number="simDealsPerMonth"
    class="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-[#23B750]"
  />
  ```
- **Line 917**:
  ```html
  <input
    type="checkbox"
    v-model="hasAcceptedTerms"
    class="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer accent-[#23B750]"
  />
  ```
- **Violation**: `accent-[#23B750]` is an unmigrated arbitrary hex class violating `AGENTS.md` ("No hex/rgb values in classes or inline styles: `bg-[#23B750]`..."). Canonical replacement: `accent-primary`.

#### Defect 2: Raw Status Color in `SettingsView.vue`
- **File**: `src/views/SettingsView.vue`
- **Line 2112**:
  ```html
  :class="toast.type === 'success' ? 'border-primary/25 shadow-primary/5' : 'border-warning/30 shadow-amber-500/5'"
  ```
- **Violation**: `shadow-amber-500/5` uses the raw palette status color `amber-500` instead of the semantic token `shadow-warning/5`. Violates `AGENTS.md` ("No raw status colors (`bg-green-100`, `text-red-600`, `bg-amber-50`…) — use the status tokens (`success`, `warning`, `info`, `destructive`)").

#### Defect 3: Unmigrated Inline SVG Hex Fills in `PartnerRegisterView.vue`
- **File**: `src/views/PartnerRegisterView.vue`
- **Lines 46–59**:
  ```html
  <router-link to="/dashboard" class="flex items-center gap-2.5 group/logo" title="Return to RakanSales">
    <svg class="h-7 w-auto text-primary transition-transform group-hover/logo:scale-102" viewBox="0 0 1085 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#23b750" d="..."/>  <!-- 11 paths with fill="#23b750" -->
      ...
      <path fill="#62d816" d="..."/>  <!-- 1 path with fill="#62d816" -->
    </svg>
  </router-link>
  ```
- **Violation**: While lines 8 and 28 were properly migrated to `<img :src="isDark ? darkLogoUrl : lightLogoUrl" />`, the third brand logo instance in the global top header (revealed on hover) was missed, retaining 12 hardcoded hex fills.

#### Defect 4: Whitelist Blind Spots in `scripts/audit-tokens.cjs`
- **File**: `scripts/audit-tokens.cjs`
- **Line 128**:
  ```javascript
  pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  ```
  Omitted `accent-` and `caret-`. This caused `accent-[#23B750]` to pass through undetected.
- **Line 132**:
  ```javascript
  pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g
  ```
  Omitted `shadow-`. This caused `shadow-amber-500/5` to pass through undetected.

---

## 2. Logic Chain

1. **Rule Invariance**:
   `AGENTS.md` explicitly dictates that all UI styling must flow from semantic CSS tokens defined in `src/assets/index.css`. Hardcoded hex literals (`#...`), raw palette accents (`amber-500`), and raw status colors are strictly forbidden in new or edited code.

2. **False Sense of Security from Tool Blind Spots**:
   `worker_m4` relied on `scripts/audit-tokens.cjs` to conclude that Batches 5, 6, and 7 achieved "0 violations". However, because `audit-tokens.cjs` had incomplete prefix matching (missing `accent-` and `shadow-`), it generated false negatives for `accent-[#23B750]` and `shadow-amber-500/5`.

3. **Incomplete Scope Migration**:
   In `src/views/PartnerRegisterView.vue`, worker updated the mobile header logo and desktop anchored logo to use reactive theme switching (`isDark ? darkLogoUrl : lightLogoUrl`), but overlooked the third logo instance embedded directly inside the desktop slide-down hover header, leaving 12 raw `#23b750` / `#62d816` SVG path fills.

4. **Remediation Requirement**:
   Allowing these raw colors to pass into Milestone 5 would create technical debt and compromise theme consistency, especially on dark background hover states and warning toast presentation.

---

## 3. Caveats

- **Build Integrity**: The build pipeline (`vue-tsc -b && vite build`) is completely green and generates bundles without runtime or packaging errors.
- **Batch 6 (Forms & Booking)**: All 7 files in Batch 6 (`FormBuilderView`, `WebFormsDashboardView`, `FormDetailView`, `SubmissionsView`, `BookingPagesView`, `ScanNameCardView`, `AddonsView`) passed all adversarial checks with 0 defects.
- **Batch 1–4 Regressions**: No regressions were detected across the 380 previously migrated files.
- **Non-M4 Code**: Batches 8 and 9 (Auth, Onboarding, Guidelines) were not modified in Milestone 4 and will be migrated in subsequent milestones.

---

## 4. Conclusion

**Verdict: REJECT**

The Milestone 4 deliverables cannot be approved in their current state due to 3 confirmed residual color defects in application views and 1 tooling blind spot in `scripts/audit-tokens.cjs`.

### Required Worker Actions:
1. **Fix `src/views/partner/PartnerProgramView.vue`**:
   - Line 650: Replace `accent-[#23B750]` with `accent-primary`.
   - Line 917: Replace `accent-[#23B750]` with `accent-primary`.
2. **Fix `src/views/SettingsView.vue`**:
   - Line 2112: Replace `shadow-amber-500/5` with `shadow-warning/5`.
3. **Fix `src/views/PartnerRegisterView.vue`**:
   - Lines 46–59: Replace the inline `<svg>` with `<img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-7 w-auto" alt="RakanSales Logo" />`.
4. **Harden `scripts/audit-tokens.cjs`**:
   - Add `accent-` and `caret-` to `hexRgbClasses`.
   - Add `shadow-` to `rawStatusColors` and `paletteGrays`.

---

## 5. Verification Method

To verify these findings and confirm resolution:

### Step 1: Run Challenger Adversarial Suite
```powershell
node .agents/teamwork/challenger_m4_1/test_m4_adversarial.cjs
```
- Current output: Exits with code 1, reporting failures on `PartnerProgramView.vue`, `SettingsView.vue`, and `PartnerRegisterView.vue`.
- Target output after fix: Exits with code 0 (`✔ ALL ADVERSARIAL CHALLENGES PASSED EMPIRICALLY!`).

### Step 2: Direct Ripgrep Verification
```powershell
# Verify no accent bracket hex:
node -e "const content = require('fs').readFileSync('src/views/partner/PartnerProgramView.vue', 'utf8'); console.log('accent-hex:', content.includes('accent-[#23B750]'));"

# Verify no shadow-amber:
node -e "const content = require('fs').readFileSync('src/views/SettingsView.vue', 'utf8'); console.log('shadow-amber:', content.includes('shadow-amber-500'));"

# Verify PartnerRegisterView hover logo:
node -e "const content = require('fs').readFileSync('src/views/PartnerRegisterView.vue', 'utf8'); console.log('inline-logo-svg:', content.includes('viewBox=\"0 0 1085 160\"'));"
```

### Step 3: Run Full Project Build
```powershell
cmd.exe /c "npm run build"
```
- Expected: Exit code 0.
