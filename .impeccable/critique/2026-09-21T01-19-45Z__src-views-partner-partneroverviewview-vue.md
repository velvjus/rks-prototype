---
target: src/views/partner/PartnerOverviewView.vue
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-09-21T01-19-45Z
slug: src-views-partner-partneroverviewview-vue
---
# Partner Portal Overview Dashboard Design Critique

## Design Health Score

| # | Heuristic | Score | Key Finding |
|---|-----------|:-----:|-------------|
| 1 | Visibility of System Status | 2/4 | Instant clipboard toast feedback is great; however, date filters are non-functional, CSV export is simulated, and milestone math is contradictory ("2 of 20 deals" vs "3 more signups to reach Silver"). |
| 2 | Match Between System & Real World | 3/4 | Authentic Malaysian business conventions (`RM`, `Sdn Bhd`, WhatsApp), but awkward syntax (`RM300/ per signup`, `Withdrew now`). |
| 3 | User Control and Freedom | 2/4 | Modals dismiss properly, but "View all" creates circular navigation loops, and "How it works" cannot be dismissed. |
| 4 | Consistency and Standards | 2/4 | Lacks `font-mono` on table currency metrics (violates `DESIGN.md §3`). Referral statuses don't match core RakanSales pipeline stages. Live wireframe switcher exposed in header. |
| 5 | Error Prevention | 3/4 | Readonly inputs prevent link tampering; but "Request Track Upgrade" dispatches immediately with no confirmation. |
| 6 | Recognition Rather Than Recall | 3/4 | Referral code and link are easily recognized; tier thresholds are explicitly visible. |
| 7 | Flexibility and Efficiency | 1/4 | No keyboard shortcuts, no search or sorting on referrals, no bulk invite/share capability. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Inverted vertical hierarchy forces core tool below fold. Permanent onboarding cards take up prime space. Saturated gradient on Card 1 overpowers other cards. |
| 9 | Error Recovery | 2/4 | Clipboard fallback exists, but empty table states offer no interactive resolution or actionable next step. |
| 10 | Help and Documentation | 2/4 | Tier modal exists, but lacks partner FAQs, payout schedule details, clearance rules, and bank account setup guidance. |
| **Total** | | **22 / 40** | **Acceptable** (55% — Significant improvements needed) |

## Design Specificity Verdict

- **LLM Assessment**: The dashboard is styled with RakanSales brand tokens (Primary Green `#008236`, Highlight Green `#23B750`, Malaysian Ringgit `RM`, and Lucide icons), but mechanically it reads as a generic affiliate SaaS template rather than an integrated portal tailored for RakanSales CRM. In RakanSales, deals, contacts, and omnichannel WhatsApp chats are the core product truth. In this portal, referrals are isolated records with arbitrary statuses (`Converted`, `Awaiting Payment`, `Trial Active`) rather than living CRM pipeline stages (`New`, `Acknowledged`, `Qualifying`, `Proposal`, `Follow Up`). Furthermore, the primary operational tool (Referral Link & Code) is buried in Row 3 beneath two separate data tables.
- **Deterministic Scan**: The automated detector passed cleanly with 0 overt anti-pattern findings. However, deep AST/code inspection revealed silent CSS defects from hallucinated Tailwind utility classes (`border-gray-150`, `py-0.2`, `shadow-2xs`, `dark:hover:bg-gray-750`), heavy reliance on sub-12px micro-typography (`text-[10px]` and `text-[11px]`, 25+ instances), and decorative boilerplate watermark numerals (`1`, `2`, `3`).
- **Visual Overlays**: In-browser script injection skipped because headless browser automation (Puppeteer) is not installed in local `node_modules`.

## Overall Impression
The wireframe provided the necessary functional data points (KPIs, referral links, codes, tier progress, and payouts), but literal adherence to its wireframe layout resulted in an inverted vertical stack where the most important partner action—sharing their link—is pushed below the fold beneath empty or secondary tables. Redesigning this view into an authoritatively branded, high-velocity commercial command center will elevate the partner experience dramatically.

## What's Working
1. **Multi-Channel Sharing Interactions**: Click-to-copy for both link and code provides immediate visual feedback (label swaps, checkmark transitions, and toast notifications), paired with direct WhatsApp and Email sharing hooks.
2. **Structured Milestone Progression Model**: The 4-tier commission ladder (Starter $\rightarrow$ Silver $\rightarrow$ Gold $\rightarrow$ Elite) gives partners clear financial incentives with escalating payout rates (RM 300 to RM 500).
3. **Comprehensive Zero-State & Active Coverage**: Dual-state thinking ensures new partners don't encounter broken layouts on day zero.

## Priority Issues (P0–P3)
- **[P1] Inverted Visual & Information Architecture (Hero Sharing Below Fold)**:
  - *Why it matters*: A partner's primary task is grabbing their referral link/code or sharing directly to WhatsApp. Placing this under two data tables forces unnecessary scrolling.
  - *Fix*: Elevate the Referral Link & Code into a prominent top-of-page Hero Command Card or persistent split banner directly beside the key KPIs. Demote static onboarding into a dismissible guide.
  - *Suggested command*: `/impeccable layout`
- **[P1] Broken Sub-navigation & Circular Routing Loops**:
  - *Why it matters*: Clicking "View all" on either referrals or earnings reloads the same overview page, creating dead ends.
  - *Fix*: Provide dedicated table sub-views with pagination, search, and status filtering, or replace "View all" links with slide-out details drawers.
  - *Suggested command*: `/impeccable harden`
- **[P2] Exposure of Development Wireframe Toggle in Production Header**:
  - *Why it matters*: The `Empty (Wireframe)` vs `Active Partner` toggle clutters the header and signals an incomplete prototype.
  - *Fix*: Remove the toggle from the customer-facing header and bind views to reactive state.
  - *Suggested command*: `/impeccable distill`
- **[P2] Contradictory Tier Math & Missing Withdrawal Action**:
  - *Why it matters*: The tier card states *"Starter • 2 of 20 deals"* alongside *"3 more signups to reach Silver"*, confusing users on whether the target is 5 or 20 deals. Additionally, despite displaying RM 1,200 available balance, there is no direct CTA to withdraw funds.
  - *Fix*: Correct the progress denominator to the next milestone (`2 of 5 deals to reach Silver`), and add a prominent "Withdraw Earnings" primary button.
  - *Suggested command*: `/impeccable clarify`
- **[P3] Micro-Typography & Invalid Tailwind Classes**:
  - *Why it matters*: 25+ instances of `text-[10px]` and `text-[11px]` strain legibility, while `border-gray-150` and `py-0.2` fail silently in Tailwind CSS.
  - *Fix*: Normalize to standard Tailwind utility classes (`text-xs`, `text-sm`, `border-gray-200 dark:border-gray-800`, `py-0.5`).
  - *Suggested command*: `/impeccable polish`

## Persona Red Flags
- **Alex (Power User)**: No keyboard accelerators for copying link or code. No search/filtering on data tables. "Export CSV" is non-functional.
- **Jordan (First-Timer)**: Confused by developer toggles in the header. No instructions on how to link a bank account to receive RM 300 payouts. Unclear what "In clearance (~30d)" means.
- **Sam (Accessibility-Dependent)**: Dashed referral code card lacks explicit `aria-label`. Tables use arbitrary `grid-cols-12` `<div>` elements rather than semantic `<table>` elements with column headers. Tooltips rely on mouse hover and cannot be reached via keyboard focus.

## Minor Observations
- Label "Withdrew now: RM 0" should be "Available for withdrawal".
- "RM300/ per signup" contains redundant punctuation.
- Large background step numbers (`1`, `2`, `3`) can collide with text on smaller widths.
- Toast notifications lack action/undo capability.

## Questions to Consider
1. *What if the Referral Link, Referral Code, and 1-click WhatsApp share were unified into a top hero action banner, making partner sharing a 0-scroll interaction?*
2. *What if partners could track referred leads progressing through real CRM deal stages (`Trial` $\rightarrow$ `Quotation` $\rightarrow$ `Won`) rather than disconnected static statuses?*
3. *What if the static 3-step "How It Works" guide automatically collapsed once a partner records their first conversion?*
