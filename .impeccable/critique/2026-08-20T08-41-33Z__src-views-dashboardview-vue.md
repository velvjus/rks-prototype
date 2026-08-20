---
target: src/views/DashboardView.vue
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
timestamp: 2026-08-20T08-41-33Z
slug: src-views-dashboardview-vue
---
# Design Critique Report: `src/views/DashboardView.vue`

**Target:** `src/views/DashboardView.vue`  
**Method:** dual-agent (A: ab4a2763-3479-4c90-a933-ca4974813c92 · B: 616b46da-5773-4a2b-99fe-7f39d19657a3)  
**Standard:** Modern CRM Standards (Attio, Linear, Stripe Radar, HubSpot)

## Design Health Score (Nielsen's 10 Heuristics)

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Date picker toggles boolean with no popover; export button triggers native alert() |
| 2 | Match System / Real World | 2 | Math inconsistencies (-0.3d velocity, 15703.6 min response, 175% funnel conversion) |
| 3 | User Control and Freedom | 2 | No drill-downs on chart segments, no deal peek drawer on table click |
| 4 | Consistency and Standards | 2 | Conflicting pipeline metrics across cards; inconsistent time period toggles |
| 5 | Error Prevention | 3 | Real-time search filters are safe and responsive |
| 6 | Recognition Rather Than Recall | 3 | Clear channel icons and badges; stage progression recognizable |
| 7 | Flexibility and Efficiency | 1 | No quick actions (e.g. bulk WhatsApp nudge), no keyboard shortcuts |
| 8 | Aesthetic and Minimalist Design | 2 | Visual noise from decorative fake sparklines; semantic green color overload |
| 9 | Error Recovery | 2 | Zero-result searches render empty without dedicated guidance |
| 10 | Help and Documentation | 2 | Info icons exist but lack real tooltips or contextual popovers |
| **Total** | | **21/40** | **Acceptable (52.5%) — Significant improvements needed** |

## Design Specificity Verdict
- **LLM Assessment**: The visual baseline mimics modern dark SaaS tools (Attio/Linear palette), but the data storytelling lacks RakanSales-specific conversational commerce depth (WhatsApp 24h expiration, response SLAs, template performance).
- **Deterministic Scan**: CLI detector returned 0 regex lint errors (`[]`), but confirmed hardcoded static markup in SVGs, lack of interactive reactivity when switching models/periods, and missing ARIA/tooltip accessibility bindings.

## Priority Issues
- **[P0] Critical Data Inconsistencies & Unwired Controls**: Mathematical anomalies (negative velocity, over-100% conversion, raw minutes) and non-reactive filter toggles.
- **[P1] Interactive Dead-Ends & Missing Drawer Transitions**: Table rows and action buttons do not open side peek drawers or trigger real messaging workflows.
- **[P2] Cognitive Overload & Semantic Green Visual Fatigue**: 5 KPI cards + health pulse + multi-metric footers crowd working memory; emerald green is overused for both status, buttons, charts, and dates.
- **[P3] Missing Zero-State Handling & Micro-Type Legibility**: Sub-10px chart labels and empty table views when search filters yield no results.
