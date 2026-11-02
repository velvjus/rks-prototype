# Partner Views Remediation Investigation Report (Milestone 4 Iteration 2)

**Agent**: `explorer_m4_iter2_1`  
**Role**: Technical Explorer (Partner Portal Remediation)  
**Parent Agent**: `57c50def-4689-4a65-86f1-14dce8a95cbf` (orchestrator)  
**Date**: 2026-10-31T18:25:00Z  
**Target Scope**: Batch 7 (Partner Portal Views & Components)

---

## 1. Observation

Direct empirical observations, line numbers, and tool execution results from the Batch 7 audit:

### 1.1 `src/views/partner/PartnerProgramView.vue`
Two occurrences of unmigrated arbitrary hex class `accent-[#23B750]` were identified:
- **Line 650**:
  ```html
  class="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-[#23B750]"
  ```
- **Line 917**:
  ```html
  class="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer accent-[#23B750]"
  ```
A full regex scan of the remaining 1,188 lines for `#[0-9a-fA-F]{3,8}`, `rgba?\(`, `dark:`, raw palette colors (`slate`, `gray`, `zinc`, `red-`, etc.), and raw white/black yielded **0 other violations**.

### 1.2 `src/views/PartnerRegisterView.vue`
In the slide-down hover header revealed at the top of the viewport on desktop:
- **Lines 46–59**:
  ```html
  <router-link to="/dashboard" class="flex items-center gap-2.5 group/logo" title="Return to RakanSales">
    <svg class="h-7 w-auto text-primary transition-transform group-hover/logo:scale-102" viewBox="0 0 1085 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#23b750" d="M256.46,25.78A38.7,38.7,0,0,1,270,32.54a28.91,28.91,0,0,1,8.39,10.8,34.87,34.87,0,0,1,2.87,14.45q0,12-5.9,19.88T258.71,89.32l22.83,38.21H253.43l-20.51-35.1H218.16v35.1H194.24V23.45h44A65.53,65.53,0,0,1,256.46,25.78ZM237.58,73.63a29.66,29.66,0,0,0,7.77-.93A17.41,17.41,0,0,0,251.17,70a11.71,11.71,0,0,0,3.65-4.35,13.48,13.48,0,0,0,0-11.34A11.1,11.1,0,0,0,251.17,50a19.36,19.36,0,0,0-5.82-2.72,27.56,27.56,0,0,0-7.77-1H218.16V73.63Z"/>
      <path fill="#23b750" d="M378.48,127.53H355.33V117.9a25.23,25.23,0,0,1-9.24,8.08q-5.67,3-14.37,3a39.14,39.14,0,0,1-15.93-3.18,35.9,35.9,0,0,1-12.34-8.86,40.81,40.81,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78,49.46,49.46,0,0,1,2.88-17.17,39.16,39.16,0,0,1,8.07-13.43A38.45,38.45,0,0,1,316,47.22,38,38,0,0,1,331.72,44q8.7,0,14.37,3a25.59,25.59,0,0,1,9.24,8.32V45.51h23.15Zm-23.15-43.8a17.49,17.49,0,0,0-1.94-6.68,18.57,18.57,0,0,0-4.2-5.36,20.86,20.86,0,0,0-21.35-3.34,17,17,0,0,0-6.06,4.35,20.74,20.74,0,0,0-5.28,14,20.27,20.27,0,0,0,1.39,7.45,19,19,0,0,0,3.89,6.22,17.76,17.76,0,0,0,6.14,4.19,21.26,21.26,0,0,0,15.37.24,20.76,20.76,0,0,0,5.9-3.5,17.58,17.58,0,0,0,4.2-5.28,17.3,17.3,0,0,0,1.94-6.52Z"/>
      <path fill="#23b750" d="M395.88,15.68H419V75h5.75l18.49-29.52h28.12L446.21,85.9l28.9,41.63H445.28l-20-30.75H419v30.75H395.88Z"/>
      <path fill="#23b750" d="M564.58,127.53H541.44V117.9a25.34,25.34,0,0,1-9.25,8.08q-5.67,3-14.37,3a39.09,39.09,0,0,1-15.92-3.18,35.84,35.84,0,0,1-12.35-8.86,41,41,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78,49.46,49.46,0,0,1,2.88-17.17,39.34,39.34,0,0,1,8.08-13.43,38.41,38.41,0,0,1,12.42-8.86A38,38,0,0,1,517.82,44q8.7,0,14.37,3a25.71,25.71,0,0,1,9.25,8.32V45.51h23.14Zm-23.14-43.8a17.67,17.67,0,0,0-1.94-6.68,18.57,18.57,0,0,0-4.2-5.36,20.34,20.34,0,0,0-5.9-3.58,21.51,21.51,0,0,0-15.46.24,17.16,17.16,0,0,0-6.06,4.35,20.87,20.87,0,0,0-5.28,14,20.28,20.28,0,0,0,1.4,7.45,19,19,0,0,0,3.88,6.22,17.85,17.85,0,0,0,6.14,4.19,21.29,21.29,0,0,0,15.38.24,21,21,0,0,0,5.9-3.5,17.81,17.81,0,0,0,6.14-11.8Z"/>
      <path fill="#23b750" d="M582,45.51h23.15v12a30.75,30.75,0,0,1,11-9.94A31.47,31.47,0,0,1,631.23,44a29.68,29.68,0,0,1,11.88,2.25A25.87,25.87,0,0,1,652,52.42a28.3,28.3,0,0,1,5.67,9.48,35.4,35.4,0,0,1,2,12.2v53.43H636.51V82.17a17,17,0,0,0-1.09-6.29,15.3,15.3,0,0,0-2.95-4.74,12.84,12.84,0,0,0-4.35-3.1A13.73,13.73,0,0,0,622.53,67a14.77,14.77,0,0,0-7,1.63,17.47,17.47,0,0,0-5.36,4.35,21.64,21.64,0,0,0-3.58,6.21,23.63,23.63,0,0,0-1.47,7.38v41H582Z"/>
      <path fill="#23b750" d="M679.38,54.21q0-15.54,10.64-23.93t30.37-8.38q20.36,0,30.84,9.09t10.64,25.09H737.32a15.65,15.65,0,0,0-1.08-5.83,12.14,12.14,0,0,0-3.19-4.59,14.33,14.33,0,0,0-5.44-2.87,27.89,27.89,0,0,0-8-1c-5,0-8.89,1-11.73,2.88a9.24,9.24,0,0,0-4.27,8.15,8.91,8.91,0,0,0,1.7,5.52,13.91,13.91,0,0,0,4.59,3.8,30.41,30.41,0,0,0,6.68,2.57q3.79,1,8,1.94,6.52,1.39,13.51,3a50.09,50.09,0,0,1,12.82,4.82,27.25,27.25,0,0,1,9.55,8.61q3.74,5.45,3.73,14.45a31.89,31.89,0,0,1-2.56,13,25.34,25.34,0,0,1-7.92,9.94,39.21,39.21,0,0,1-13.37,6.37,70.52,70.52,0,0,1-18.87,2.25,72.06,72.06,0,0,1-19.34-2.33,39.21,39.21,0,0,1-13.9-6.76,28,28,0,0,1-8.39-10.72,34.52,34.52,0,0,1-2.8-14.21H701.6q.61,7,5.67,10.64t14.37,3.65q8.39,0,13-2.87t4.58-7.7a8.56,8.56,0,0,0-1.79-5.59,13.16,13.16,0,0,0-4.89-3.57,38.3,38.3,0,0,0-7.22-2.33c-2.75-.62-5.62-1.19-8.63-1.71q-6.36-1.25-13-2.87a43.56,43.56,0,0,1-12-4.9,25.57,25.57,0,0,1-8.85-8.93Q679.38,63.22,679.38,54.21Z"/>
      <path fill="#23b750" d="M861,127.53H837.83V117.9a25.23,25.23,0,0,1-9.24,8.08q-5.67,3-14.37,3a39.05,39.05,0,0,1-15.92-3.18A35.84,35.84,0,0,1,786,116.89a40.81,40.81,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78A49.46,49.46,0,0,1,778,69.51,39.16,39.16,0,0,1,786,56.08a38.56,38.56,0,0,1,12.43-8.86A38,38,0,0,1,814.22,44q8.7,0,14.37,3a25.59,25.59,0,0,1,9.24,8.32V45.51H861Zm-23.15-43.8a17.31,17.31,0,0,0-1.94-6.68,18.71,18.71,0,0,0-4.19-5.36,20.34,20.34,0,0,0-5.9-3.58,21.51,21.51,0,0,0-15.46.24,17.07,17.07,0,0,0-6.06,4.35,21.09,21.09,0,0,0-3.89,6.36A20.82,20.82,0,0,0,799,86.68a20.27,20.27,0,0,0,1.39,7.45,19.17,19.17,0,0,0,3.89,6.22,17.85,17.85,0,0,0,6.14,4.19,21.29,21.29,0,0,0,15.38.24,21,21,0,0,0,5.9-3.5A17.7,17.7,0,0,0,835.89,96a17.12,17.12,0,0,0,1.94-6.52Z"/>
      <path fill="#23b750" d="M878.38,15.68h23.14V127.53H878.38Z"/>
      <path fill="#23b750" d="M938.34,91.65a21.47,21.47,0,0,0,2.25,6.6,18.11,18.11,0,0,0,9.94,8.62,21,21,0,0,0,7.38,1.24,17.63,17.63,0,0,0,9.17-2.48,17.9,17.9,0,0,0,6.37-6.06h25a36,36,0,0,1-14.14,21.36,41.25,41.25,0,0,1-12.11,5.91,50.39,50.39,0,0,1-14.76,2.09,45.31,45.31,0,0,1-17.17-3.18,41,41,0,0,1-13.59-8.86,39.83,39.83,0,0,1-8.93-13.43,44.13,44.13,0,0,1-3.19-16.94,44.7,44.7,0,0,1,3.19-17,39.79,39.79,0,0,1,22.29-22.37A44.68,44.68,0,0,1,957.14,44a47.42,47.42,0,0,1,16.08,2.64,41.56,41.56,0,0,1,13,7.38,39.39,39.39,0,0,1,9.16,11.26,37.25,37.25,0,0,1,4.35,14.45q.31,3.42.39,6.13t-.07,5.83Zm36.82-12.74a15.26,15.26,0,0,0-2-5.67,17,17,0,0,0-3.88-4.43,18.86,18.86,0,0,0-11.81-4,20.81,20.81,0,0,0-6.6,1,17.37,17.37,0,0,0-5.36,2.88,17,17,0,0,0-4,4.51,20.13,20.13,0,0,0-2.41,5.74Z"/>
      <path fill="#23b750" d="M1011.66,69.9q0-12.42,9-19.18T1045.84,44q16.94,0,25.71,7.07t9.09,19.8h-23.46a8.79,8.79,0,0,0-3-6.76q-2.87-2.4-8.15-2.4-5.61,0-8.47,1.86a6.08,6.08,0,0,0-2.87,5.44,6.26,6.26,0,0,0,3.49,5.82A32.12,32.12,0,0,0,1047,77.9q5.35,1.17,11.49,2.33A49.28,49.28,0,0,1,1070,83.88a24.33,24.33,0,0,1,8.94,7q3.57,4.51,3.57,12.28,0,11.8-8.93,18.72t-27,6.91a61.55,61.55,0,0,1-16.16-1.87,33.92,33.92,0,0,1-11.5-5.35,21.64,21.64,0,0,1-6.91-8.55,27,27,0,0,1-2.25-11.11h23.3a8.71,8.71,0,0,0,3.65,7c2.23,1.56,5.51,2.33,9.87,2.33,4.14,0,7.24-.62,9.32-1.86a6,6,0,0,0,3.1-5.44,5.69,5.69,0,0,0-3.57-5.44,39.17,39.17,0,0,0-8.78-2.79q-5.2-1.08-11.34-2.18a44.7,44.7,0,0,1-11.41-3.57,22.78,22.78,0,0,1-8.78-7.22Q1011.67,78,1011.66,69.9Z"/>
      <path fill="#23b750" d="M2.5,10.85V120.08a9,9,0,0,0,14.23,7.41l31-21.69V24a8.66,8.66,0,0,1,8.66-8.66h0a8.64,8.64,0,0,1,7.42,4.2l51.74,86.23h13.57a9,9,0,0,0,9-9V10.85a9,9,0,0,0-9-9H11.54A9,9,0,0,0,2.5,10.85Z"/>
      <path fill="#62d816" d="M47.72,105.8v45.44a7,7,0,0,0,3.84,6.22h0a7,7,0,0,0,8.68-2.05l20.26-27a7.86,7.86,0,0,1,8.75-2.73L122,136.6a6.56,6.56,0,0,0,5-.36h0a6.54,6.54,0,0,0,2.51-9.47l-14-21Z"/>
    </svg>
  </router-link>
  ```
- **Finding**: While lines 8 (mobile header) and 28 (desktop fixed logo) correctly use:
  ```html
  <img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-6 w-auto" alt="RakanSales Logo" />
  <img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-7 sm:h-8 w-auto" alt="RakanSales Logo" />
  ```
  The third logo instance in the slide-down header retains the inline SVG containing 11 paths with `fill="#23b750"` and 1 path with `fill="#62d816"`. Replacing this SVG with the dynamic `<img>` tag completely eliminates all 12 hardcoded hex values.

### 1.3 Deep Scan of Remaining Batch 7 Files
A comprehensive scan was conducted across all remaining Batch 7 files:
1. `src/views/partner/PartnerOverviewView.vue` (1,796 lines):
   - **ApexCharts colors** at lines 1628–1629 and 1671–1672:
     ```typescript
     colors: isPreviewEmpty.value ? ['#E5E7EB'] : ['#F59E0B', '#8B5CF6', '#F43F5E', '#23B750'],
     colors: isPreviewEmpty.value ? ['#E5E7EB'] : ['#F59E0B', '#F43F5E', '#23B750'],
     ```
     Per `PROJECT.md` line 33, Feature 19 ("ApexCharts & Unovis Adaptation") is explicitly scheduled for Milestone 6 (M6). Zero template violations exist in this view.
2. `src/views/partner/PartnerReferralsView.vue` (1,994 lines): **0 violations**. All badges, progress bars, and filters use semantic tokens (`bg-warning/10`, `text-info`, `bg-tag-1` through `bg-tag-6`).
3. `src/views/partner/PartnerWithdrawalView.vue` (1,351 lines): **0 violations**.
4. `src/views/partner/PartnerCommissionsView.vue` (651 lines): **0 violations**.
5. `src/views/partner/PartnerKitView.vue` (277 lines): **0 violations**.
6. `src/components/partner/PartnerTrackSwitcher.vue` (85 lines): **0 violations**.

### 1.4 Audit Script Regex Blind Spot (`scripts/audit-tokens.cjs`)
- **File**: `scripts/audit-tokens.cjs` Line 128
- **Current regex**:
  ```javascript
  pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  ```
- **Defect**: Lacks `accent|caret` in the prefix alternation. Adding `accent|caret|` ensures `accent-[#23B750]` is caught automatically.

---

## 2. Logic Chain

1. **Premise (`AGENTS.md`)**: "No hex/rgb values in classes or inline styles: `bg-[#23B750]`, `text-[#111827]`, `style="color: #..."`, `rgba(...)`."
2. **Observation 1**: `src/views/partner/PartnerProgramView.vue` lines 650 & 917 directly contain `accent-[#23B750]`.
3. **Inference 1**: Both lines must be replaced with the semantic token class `accent-primary` (consistent with `src/views/AddonsView.vue` line 1152 and `src/components/settings/AutomationTab.vue` line 141).
4. **Observation 2**: `src/views/PartnerRegisterView.vue` lines 46–59 contain an inline `<svg>` with 12 hardcoded hex fills (`#23b750` and `#62d816`).
5. **Inference 2**: In `PartnerRegisterView.vue`, `isDark`, `darkLogoUrl`, and `lightLogoUrl` are already imported and active. Replacing the inline SVG with `<img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-7 w-auto transition-transform group-hover/logo:scale-102" alt="RakanSales Logo" />` eliminates all 12 hex fills, resolves light/dark switching in the hover header, and preserves the hover zoom interaction (`group-hover/logo:scale-102`).
6. **Observation 3**: A deep scan of all 6 other Batch 7 files confirmed 0 raw colors, 0 `dark:` overrides, and 0 inline color styles.
7. **Observation 4**: In `PartnerOverviewView.vue`, hex arrays exist solely within ApexCharts donut options, which `PROJECT.md` Feature 19 explicitly designates for Milestone 6 adaptation.

---

## 3. Caveats

1. **ApexCharts Options in `PartnerOverviewView.vue`**:
   Lines 1629 & 1672 use raw hex arrays (`['#F59E0B', '#8B5CF6', '#F43F5E', '#23B750']`). As documented in `PROJECT.md` (Feature 19) and acknowledged by `reviewer_m4_2`, dynamic chart color resolution via `useChartTheme.ts` is explicitly deferred to Milestone 6.
2. **SettingsView Toast Defect (`shadow-amber-500/5`)**:
   `SettingsView.vue` line 2112 is a Batch 5 defect investigated concurrently by `explorer_m4_iter2_2`. It is not part of Batch 7.

---

## 4. Conclusion & Actionable Replacement Specifications

Only **two files** in Batch 7 require modification:

### Change 1: `src/views/partner/PartnerProgramView.vue`

#### Modification 1.1 — Range Slider (Line 650)
- **Target File**: `src/views/partner/PartnerProgramView.vue`
- **Lines**: 641–651
- **Target Content**:
  ```html
                  <input
                    type="range"
                    min="1"
                    max="50"
                    aria-label="Target Closed Deals per Month"
                    aria-valuemin="1"
                    aria-valuemax="50"
                    :aria-valuenow="simDealsPerMonth"
                    v-model.number="simDealsPerMonth"
                    class="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-[#23B750]"
                  />
  ```
- **Replacement Content**:
  ```html
                  <input
                    type="range"
                    min="1"
                    max="50"
                    aria-label="Target Closed Deals per Month"
                    aria-valuemin="1"
                    aria-valuemax="50"
                    :aria-valuenow="simDealsPerMonth"
                    v-model.number="simDealsPerMonth"
                    class="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
  ```

#### Modification 1.2 — Terms Checkbox (Line 917)
- **Target File**: `src/views/partner/PartnerProgramView.vue`
- **Lines**: 914–918
- **Target Content**:
  ```html
                <input
                  type="checkbox"
                  v-model="hasAcceptedTerms"
                  class="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer accent-[#23B750]"
                />
  ```
- **Replacement Content**:
  ```html
                <input
                  type="checkbox"
                  v-model="hasAcceptedTerms"
                  class="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer accent-primary"
                />
  ```

---

### Change 2: `src/views/PartnerRegisterView.vue`

#### Modification 2.1 — Hover Sensor Header Brand Logo (Lines 46–59)
- **Target File**: `src/views/PartnerRegisterView.vue`
- **Lines**: 45–60
- **Target Content**:
  ```html
            <svg class="h-7 w-auto text-primary transition-transform group-hover/logo:scale-102" viewBox="0 0 1085 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#23b750" d="M256.46,25.78A38.7,38.7,0,0,1,270,32.54a28.91,28.91,0,0,1,8.39,10.8,34.87,34.87,0,0,1,2.87,14.45q0,12-5.9,19.88T258.71,89.32l22.83,38.21H253.43l-20.51-35.1H218.16v35.1H194.24V23.45h44A65.53,65.53,0,0,1,256.46,25.78ZM237.58,73.63a29.66,29.66,0,0,0,7.77-.93A17.41,17.41,0,0,0,251.17,70a11.71,11.71,0,0,0,3.65-4.35,13.48,13.48,0,0,0,0-11.34A11.1,11.1,0,0,0,251.17,50a19.36,19.36,0,0,0-5.82-2.72,27.56,27.56,0,0,0-7.77-1H218.16V73.63Z"/>
              <path fill="#23b750" d="M378.48,127.53H355.33V117.9a25.23,25.23,0,0,1-9.24,8.08q-5.67,3-14.37,3a39.14,39.14,0,0,1-15.93-3.18,35.9,35.9,0,0,1-12.34-8.86,40.81,40.81,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78,49.46,49.46,0,0,1,2.88-17.17,39.16,39.16,0,0,1,8.07-13.43A38.45,38.45,0,0,1,316,47.22,38,38,0,0,1,331.72,44q8.7,0,14.37,3a25.59,25.59,0,0,1,9.24,8.32V45.51h23.15Zm-23.15-43.8a17.49,17.49,0,0,0-1.94-6.68,18.57,18.57,0,0,0-4.2-5.36,20.86,20.86,0,0,0-21.35-3.34,17,17,0,0,0-6.06,4.35,20.74,20.74,0,0,0-5.28,14,20.27,20.27,0,0,0,1.39,7.45,19,19,0,0,0,3.89,6.22,17.76,17.76,0,0,0,6.14,4.19,21.26,21.26,0,0,0,15.37.24,20.76,20.76,0,0,0,5.9-3.5,17.58,17.58,0,0,0,4.2-5.28,17.3,17.3,0,0,0,1.94-6.52Z"/>
              <path fill="#23b750" d="M395.88,15.68H419V75h5.75l18.49-29.52h28.12L446.21,85.9l28.9,41.63H445.28l-20-30.75H419v30.75H395.88Z"/>
              <path fill="#23b750" d="M564.58,127.53H541.44V117.9a25.34,25.34,0,0,1-9.25,8.08q-5.67,3-14.37,3a39.09,39.09,0,0,1-15.92-3.18,35.84,35.84,0,0,1-12.35-8.86,41,41,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78,49.46,49.46,0,0,1,2.88-17.17,39.34,39.34,0,0,1,8.08-13.43,38.41,38.41,0,0,1,12.42-8.86A38,38,0,0,1,517.82,44q8.7,0,14.37,3a25.71,25.71,0,0,1,9.25,8.32V45.51h23.14Zm-23.14-43.8a17.67,17.67,0,0,0-1.94-6.68,18.57,18.57,0,0,0-4.2-5.36,20.34,20.34,0,0,0-5.9-3.58,21.51,21.51,0,0,0-15.46.24,17.16,17.16,0,0,0-6.06,4.35,20.87,20.87,0,0,0-5.28,14,20.28,20.28,0,0,0,1.4,7.45,19,19,0,0,0,3.88,6.22,17.85,17.85,0,0,0,6.14,4.19,21.29,21.29,0,0,0,15.38.24,21,21,0,0,0,5.9-3.5,17.81,17.81,0,0,0,6.14-11.8Z"/>
              <path fill="#23b750" d="M582,45.51h23.15v12a30.75,30.75,0,0,1,11-9.94A31.47,31.47,0,0,1,631.23,44a29.68,29.68,0,0,1,11.88,2.25A25.87,25.87,0,0,1,652,52.42a28.3,28.3,0,0,1,5.67,9.48,35.4,35.4,0,0,1,2,12.2v53.43H636.51V82.17a17,17,0,0,0-1.09-6.29,15.3,15.3,0,0,0-2.95-4.74,12.84,12.84,0,0,0-4.35-3.1A13.73,13.73,0,0,0,622.53,67a14.77,14.77,0,0,0-7,1.63,17.47,17.47,0,0,0-5.36,4.35,21.64,21.64,0,0,0-3.58,6.21,23.63,23.63,0,0,0-1.47,7.38v41H582Z"/>
              <path fill="#23b750" d="M679.38,54.21q0-15.54,10.64-23.93t30.37-8.38q20.36,0,30.84,9.09t10.64,25.09H737.32a15.65,15.65,0,0,0-1.08-5.83,12.14,12.14,0,0,0-3.19-4.59,14.33,14.33,0,0,0-5.44-2.87,27.89,27.89,0,0,0-8-1c-5,0-8.89,1-11.73,2.88a9.24,9.24,0,0,0-4.27,8.15,8.91,8.91,0,0,0,1.7,5.52,13.91,13.91,0,0,0,4.59,3.8,30.41,30.41,0,0,0,6.68,2.57q3.79,1,8,1.94,6.52,1.39,13.51,3a50.09,50.09,0,0,1,12.82,4.82,27.25,27.25,0,0,1,9.55,8.61q3.74,5.45,3.73,14.45a31.89,31.89,0,0,1-2.56,13,25.34,25.34,0,0,1-7.92,9.94,39.21,39.21,0,0,1-13.37,6.37,70.52,70.52,0,0,1-18.87,2.25,72.06,72.06,0,0,1-19.34-2.33,39.21,39.21,0,0,1-13.9-6.76,28,28,0,0,1-8.39-10.72,34.52,34.52,0,0,1-2.8-14.21H701.6q.61,7,5.67,10.64t14.37,3.65q8.39,0,13-2.87t4.58-7.7a8.56,8.56,0,0,0-1.79-5.59,13.16,13.16,0,0,0-4.89-3.57,38.3,38.3,0,0,0-7.22-2.33c-2.75-.62-5.62-1.19-8.63-1.71q-6.36-1.25-13-2.87a43.56,43.56,0,0,1-12-4.9,25.57,25.57,0,0,1-8.85-8.93Q679.38,63.22,679.38,54.21Z"/>
              <path fill="#23b750" d="M861,127.53H837.83V117.9a25.23,25.23,0,0,1-9.24,8.08q-5.67,3-14.37,3a39.05,39.05,0,0,1-15.92-3.18A35.84,35.84,0,0,1,786,116.89a40.81,40.81,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78A49.46,49.46,0,0,1,778,69.51,39.16,39.16,0,0,1,786,56.08a38.56,38.56,0,0,1,12.43-8.86A38,38,0,0,1,814.22,44q8.7,0,14.37,3a25.59,25.59,0,0,1,9.24,8.32V45.51H861Zm-23.15-43.8a17.31,17.31,0,0,0-1.94-6.68,18.71,18.71,0,0,0-4.19-5.36,20.34,20.34,0,0,0-5.9-3.58,21.51,21.51,0,0,0-15.46.24,17.07,17.07,0,0,0-6.06,4.35,21.09,21.09,0,0,0-3.89,6.36A20.82,20.82,0,0,0,799,86.68a20.27,20.27,0,0,0,1.39,7.45,19.17,19.17,0,0,0,3.89,6.22,17.85,17.85,0,0,0,6.14,4.19,21.29,21.29,0,0,0,15.38.24,21,21,0,0,0,5.9-3.5A17.7,17.7,0,0,0,835.89,96a17.12,17.12,0,0,0,1.94-6.52Z"/>
              <path fill="#23b750" d="M878.38,15.68h23.14V127.53H878.38Z"/>
              <path fill="#23b750" d="M938.34,91.65a21.47,21.47,0,0,0,2.25,6.6,18.11,18.11,0,0,0,9.94,8.62,21,21,0,0,0,7.38,1.24,17.63,17.63,0,0,0,9.17-2.48,17.9,17.9,0,0,0,6.37-6.06h25a36,36,0,0,1-14.14,21.36,41.25,41.25,0,0,1-12.11,5.91,50.39,50.39,0,0,1-14.76,2.09,45.31,45.31,0,0,1-17.17-3.18,41,41,0,0,1-13.59-8.86,39.83,39.83,0,0,1-8.93-13.43,44.13,44.13,0,0,1-3.19-16.94,44.7,44.7,0,0,1,3.19-17,39.79,39.79,0,0,1,22.29-22.37A44.68,44.68,0,0,1,957.14,44a47.42,47.42,0,0,1,16.08,2.64,41.56,41.56,0,0,1,13,7.38,39.39,39.39,0,0,1,9.16,11.26,37.25,37.25,0,0,1,4.35,14.45q.31,3.42.39,6.13t-.07,5.83Zm36.82-12.74a15.26,15.26,0,0,0-2-5.67,17,17,0,0,0-3.88-4.43,18.86,18.86,0,0,0-11.81-4,20.81,20.81,0,0,0-6.6,1,17.37,17.37,0,0,0-5.36,2.88,17,17,0,0,0-4,4.51,20.13,20.13,0,0,0-2.41,5.74Z"/>
              <path fill="#23b750" d="M1011.66,69.9q0-12.42,9-19.18T1045.84,44q16.94,0,25.71,7.07t9.09,19.8h-23.46a8.79,8.79,0,0,0-3-6.76q-2.87-2.4-8.15-2.4-5.61,0-8.47,1.86a6.08,6.08,0,0,0-2.87,5.44,6.26,6.26,0,0,0,3.49,5.82A32.12,32.12,0,0,0,1047,77.9q5.35,1.17,11.49,2.33A49.28,49.28,0,0,1,1070,83.88a24.33,24.33,0,0,1,8.94,7q3.57,4.51,3.57,12.28,0,11.8-8.93,18.72t-27,6.91a61.55,61.55,0,0,1-16.16-1.87,33.92,33.92,0,0,1-11.5-5.35,21.64,21.64,0,0,1-6.91-8.55,27,27,0,0,1-2.25-11.11h23.3a8.71,8.71,0,0,0,3.65,7c2.23,1.56,5.51,2.33,9.87,2.33,4.14,0,7.24-.62,9.32-1.86a6,6,0,0,0,3.1-5.44,5.69,5.69,0,0,0-3.57-5.44,39.17,39.17,0,0,0-8.78-2.79q-5.2-1.08-11.34-2.18a44.7,44.7,0,0,1-11.41-3.57,22.78,22.78,0,0,1-8.78-7.22Q1011.67,78,1011.66,69.9Z"/>
              <path fill="#23b750" d="M2.5,10.85V120.08a9,9,0,0,0,14.23,7.41l31-21.69V24a8.66,8.66,0,0,1,8.66-8.66h0a8.64,8.64,0,0,1,7.42,4.2l51.74,86.23h13.57a9,9,0,0,0,9-9V10.85a9,9,0,0,0-9-9H11.54A9,9,0,0,0,2.5,10.85Z"/>
              <path fill="#62d816" d="M47.72,105.8v45.44a7,7,0,0,0,3.84,6.22h0a7,7,0,0,0,8.68-2.05l20.26-27a7.86,7.86,0,0,1,8.75-2.73L122,136.6a6.56,6.56,0,0,0,5-.36h0a6.54,6.54,0,0,0,2.51-9.47l-14-21Z"/>
            </svg>
  ```
- **Replacement Content**:
  ```html
            <img
              :src="isDark ? darkLogoUrl : lightLogoUrl"
              class="h-7 w-auto transition-transform group-hover/logo:scale-102"
              alt="RakanSales Logo"
            />
  ```

---

### Recommended Hardening: `scripts/audit-tokens.cjs`

#### Modification 3.1 — Prefix Extension in `hexRgbClasses`
- **Target File**: `scripts/audit-tokens.cjs` Line 128
- **Target Content**:
  ```javascript
      pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  ```
- **Replacement Content**:
  ```javascript
      pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|accent|caret|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  ```

---

## 5. Verification Method

Once the implementer applies the changes above, run the following verification steps:

### Step 1: Execute Hex Presence Check
```powershell
node -e "
const fs = require('fs');
const pp = fs.readFileSync('src/views/partner/PartnerProgramView.vue', 'utf8');
const pr = fs.readFileSync('src/views/PartnerRegisterView.vue', 'utf8');
console.log('PartnerProgramView has hex:', /#[0-9a-fA-F]{3,8}/.test(pp));
console.log('PartnerRegisterView has hex:', /#[0-9a-fA-F]{3,8}/.test(pr));
"
```
**Expected**: Both print `false`.

### Step 2: Run Challenger Adversarial Verification Suite
```powershell
node .agents/teamwork/challenger_m4_1/test_m4_adversarial.cjs
```
**Expected**:
- `PartnerProgramView.vue`: ✔ PASS (0 strict token violations)
- `PartnerRegisterView.vue`: ✔ PASS (0 strict token violations)

### Step 3: Run Full Token Audit for Batch 7
```powershell
node scripts/audit-tokens.cjs --batch 7
```
**Expected**:
`✔ SUCCESS: 0 token violations detected across all 8 scanned files!`

### Step 4: Full Production Build Verification
```powershell
cmd.exe /c "npm run build"
```
**Expected**: Exit code 0, 0 TypeScript compiler errors.
