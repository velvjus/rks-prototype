---
target: Onboarding Stepper Progress Bar
total_score: 23.5
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-27T07-05-24Z
slug: src-views-onboardingview-vue-stepper
---
# Design Critique: Onboarding Wizard Stepper & Progress Bar

## Design Health Score (Nielsen's 10 Heuristics)

| # | Heuristic | Score | Key Finding |
|---|---|:---:|---|
| 1 | Visibility of System Status | 2.0/4 | Shows current step, but percentage calculation in header (`Math.round((currentStep/6)*100)`) displays 17% before typing and 100% before saving. |
| 2 | Match System & Real World | 3.0/4 | 6-step naming structure matches SaaS mental models well. |
| 3 | User Control and Freedom | 2.0/4 | Clicking forward allows skipping to Step 6 without filling mandatory fields. |
| 4 | Consistency and Standards | 2.5/4 | Sub-44px touch targets (`w-7 h-7` = 28px) and non-semantic generic `<div>` tags violate web standards. |
| 5 | Error Prevention | 1.5/4 | No guardrails preventing users from clicking uncompleted future steps. |
| 6 | Recognition Rather Than Recall | 3.0/4 | Step titles with subtitles provide context on desktop, but subtitles disappear on mobile. |
| 7 | Flexibility and Efficiency | 2.0/4 | No keyboard navigation shortcuts (Tab, 1-6 keys) or inline optional badges. |
| 8 | Aesthetic and Minimalist Design | 2.5/4 | Dual visual header bands (Banner + Stepper Bar) consume 150px+ vertical height before form content. |
| 9 | Error Recovery | 2.0/4 | Landing on Step 6 via step click gives no contextual guidance on what was skipped. |
| 10 | Help and Documentation | 3.0/4 | Clear step naming; lacks inline tooltips for optional steps. |
| **Total** | | **23.5 / 40** | **Acceptable (Rating: 58.75% · Key Interaction & Mobile Upgrades Needed)** |

---

## Design Specificity Verdict

- **LLM Assessment**: The stepper functions as a traditional horizontal multi-step tracker, but lacks the polished momentum of modern SaaS onboarding (e.g. Linear, Stripe, Supabase). The percentage math is inaccurate, forward skipping bypasses validation, and mobile screens suffer awkward horizontal clipping.
- **Deterministic Scan**: 4 quality/accessibility flags identified, including `2.43:1` contrast ratio on `text-gray-400` subtitle text and `28×28px` touch targets failing WCAG 2.5.5 touch recommendations.

---

## Priority Issues (P0–P3)

- **[P0] Unrestricted Forward Step Skipping (Validation Bypass)**: `goToStep(idx + 1)` allows users to click ahead to Step 6 without completing mandatory prerequisites.
- **[P1] Rigid Mobile Horizontal Clipping (`min-w-[620px]`)**: On mobile viewports (<640px), steps 4, 5, and 6 are cut off offscreen without scroll cues.
- **[P2] Progress Percentage Metric Inaccuracy & Visual Duplication**: `(currentStep / 6) * 100` shows 17% on load; redundant with the step track directly beneath it.
- **[P3] WCAG AA Accessibility & Contrast Gaps**: Subtitle `text-gray-400` fails 4.5:1 contrast; missing `<nav aria-label="Progress">` and `aria-current="step"`.
