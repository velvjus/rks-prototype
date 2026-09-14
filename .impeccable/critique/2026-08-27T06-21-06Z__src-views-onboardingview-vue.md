---
target: Onboarding Wizard
total_score: 26.5
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-27T06-21-06Z
slug: src-views-onboardingview-vue
---
# Design Critique: RakanSales CRM Onboarding Wizard

## Design Health Score (Nielsen's 10 Heuristics)

| # | Heuristic | Score | Key Finding |
|---|---|:---:|---|
| 1 | Visibility of System Status | 2.5/4 | Parent stepper shows 6 steps, but hidden 3-tab sub-steps in WhatsApp & Widget mask real effort. |
| 2 | Match System & Real World | 2.5/4 | Too clinical in places (`HTML Snippet`, `Session Token`, `Subdomain slug` vs friendly conversational sales guidance). |
| 3 | User Control and Freedom | 3.0/4 | Good skip actions on later steps, but clicking stepper headers allows unvalidated leaps. |
| 4 | Consistency and Standards | 3.0/4 | Cohesive green palette, but CTA button contrast and card paddings fluctuate between steps. |
| 5 | Error Prevention | 2.5/4 | Missing inline validation feedback before advancing on empty inputs. |
| 6 | Recognition Rather Than Recall | 3.0/4 | Summary is comprehensive, but early steps require manual typing where smart presets could auto-fill. |
| 7 | Flexibility and Efficiency | 2.5/4 | Sequential 6-step path with no 30s "Express Launch" option for power users. |
| 8 | Aesthetic and Minimalist Design | 2.0/4 | Step 6 suffers visual noise (15 total cards); feels systematic and administrative rather than warm and friendly. |
| 9 | Error Recovery | 2.5/4 | Sub-step inputs lack inline recovery tips for invalid numbers/domains. |
| 10 | Help and Documentation | 3.0/4 | WhatsApp QR instructions are clear; role permissions lack contextual tooltips. |
| **Total** | | **26.5 / 40** | **Acceptable (Needs Warmth, Better Spacing & De-cluttering)** |

---

## Design Specificity Verdict

- **LLM Assessment**: The flow functions correctly as a multi-step form, but it falls into the "clinical ERP configuration trap." For a conversational WhatsApp CRM designed to build warm customer relationships, the onboarding feels too systematic and rigid.
- **Deterministic Scan**: 0 fatal anti-patterns detected. Advisory findings include undersized badge micro-copy (`text-[9px]`) and brand green on pure white text contrast advisory.

---

## Priority Issues (P0–P3)

- **[P0] Flatten the "Wizard-Inside-a-Wizard" in Steps 4 & 5**: Nested 3-tab sub-steppers confuse the parent Continue button and add artificial friction.
- **[P1] Eliminate Step 6 Completion Overload**: 15 cards on the finish line causes cognitive exhaustion. Move the 9 accelerator cards to an in-app dashboard checklist.
- **[P2] Infuse Visual Warmth & Conversational Previews**: Soften rigid gray-50 boxes with warm ambient gradients, human sales copy, and interactive live WhatsApp chat simulation.
- **[P3] Streamline Step 1 Form Burden**: Replace 6 separate form sections with smart Malaysian presets and interactive cards.
