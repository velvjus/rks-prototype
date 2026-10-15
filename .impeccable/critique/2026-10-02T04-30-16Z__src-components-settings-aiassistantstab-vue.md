---
target: src/components/settings/AIAssistantsTab.vue
total_score: 17
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
timestamp: 2026-10-02T04-30-16Z
slug: src-components-settings-aiassistantstab-vue
---
# Design Critique: AI Assistants (`src/components/settings/AIAssistantsTab.vue`)

Method: dual-agent (A: 0268cf6f-411c-4911-9666-19c8b0561d45 · B: 22d0b907-6a03-4510-93e6-6d6463aedbcb)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 2/4 | Status badges show "Live" or "Draft" but zero operational telemetry (active WhatsApp chats, lead qualification rate, error count). No unsaved changes indicator. |
| 2 | Match System / Real World | 2/4 | Generic bot jargon ("Identity Response", "Guardrails count", "FAQ synthesis") instead of CRM commercial concepts (Greeting, Human Rep Handoff, Inbound Lead Qualifier). |
| 3 | User Control and Freedom | 2/4 | Destructive actions (Delete Assistant, Delete Document) execute with zero confirmation dialog and zero undo mechanism. |
| 4 | Consistency and Standards | 1/4 | Severe architectural disconnect with sister tabs in Settings (`ai-behaviour`, `ai-inboxes`, `ai-training`). Five out of seven subnav tabs are dead stubs that throw toast warnings. |
| 5 | Error Prevention | 1/4 | Dangerous lack of safety gates: "Publish Live" can be clicked with 0 knowledge docs and no connected inbox; one-click delete permanently purges assistants. |
| 6 | Recognition Rather Than Recall | 2/4 | Subnav tabs look identical, forcing users to recall which 2 actually work. Knowledge ingestion requires manual URL typing with no document browsing or PDF ingestion. |
| 7 | Flexibility and Efficiency | 1/4 | No keyboard accelerators (no Cmd+S, no Esc for modal close, no Ctrl+Enter). No batch document actions or pre-built CRM sales templates. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Oversized vanity KPI banner wastes vertical space for 3 trivial counts. Triple-nested navigation creates severe claustrophobia on standard desktop screens. |
| 9 | Error Recovery | 2/4 | Validation errors only appear as fleeting toasts; no inline field error borders, helper recovery messages, or auto-focus to faulty inputs. |
| 10 | Help and Documentation | 2/4 | Static 3-bullet Guide modal lacks contextual inline tooltips, real-world Malaysian sales prompt examples, or WhatsApp handoff guidelines. |
| **Total** | | **17/40** | **Poor (Major UX overhaul required; core experience broken)** |

## Design Specificity Verdict

### LLM Assessment: Severe Reference Plagiarism without CRM Domain Elevation
The current design is an uninspired, literal facsimile of an external generic chatbot template. It copies the visual arrangement card-for-card while failing to elevate the user experience for **RakanSales CRM**. 
- It exists in a commercial vacuum: no lead qualification triggers, no WhatsApp channel binding, no pipeline handoff rules, and no revenue attribution.
- The top 3 KPI cards (`Total: 1`, `Live: 1`, `Draft: 0`) waste prime screen real estate to show static inventory counts rather than operational performance (inquiries handled, leads qualified, rep handoffs).
- The inner page suffers from triple-nested sidebar claustrophobia (Global Rail → Settings Sidebar → Inner Setup Nav), leaving the actual workspace cramped and frustrating.

### Deterministic Scan
- `detect.mjs` returned **0 static syntax findings**, confirming proper Tailwind syntax, clean font usage, and zero raw style anti-patterns.
- However, code-level inspection revealed significant UX debt: missing focus traps in modals, missing `Escape` key handlers, non-semantic toggle buttons missing `role="switch"` and `aria-checked`, invisible table action buttons for keyboard users (`opacity-0`), and zero destructive action barriers.

## Overall Impression
The surface looks clean on the surface because it mimics modern dashboard components, but it fails as a commercial tool. It creates cognitive friction with phantom tabs, risks customer disasters with one-click unconfirmed deployments, and fails to give sales teams what they actually need: an AI copilot tightly integrated into their WhatsApp sales funnel.

## What's Working
1. **Visual Baseline & Component Polish**: Card borders (`border-gray-200`), button radii (`rounded-xl`, `rounded-2xl`), and RakanSales brand tokens align with the design system.
2. **Instant Reactive State**: Filtering, searching, and form updates happen instantaneously with zero perceptible lag.
3. **Status Clarity**: High-contrast Emerald vs Slate pill badges for "Live" and "Draft" make operational state clear at a glance.

## Priority Issues (P0–P3)

### [P0] Destructive One-Click Delete & Instant Live Deployment without Safety Gate
- **Why it matters**: A single accidental click on "Delete" instantly purges an assistant with no confirmation. Clicking "Publish Live" activates an unverified assistant immediately on live customer channels with 0 knowledge documents, risking customer churn and brand damage.
- **Fix**: Add a safety confirmation dialog for deletion, and require a pre-flight readiness checklist before publishing live (verified knowledge sources, assigned fallback human agent, connected WhatsApp inbox).
- **Suggested command**: `/impeccable harden`

### [P1] Sub-Navigation Phantom Tabs (5 Dead-End Features)
- **Why it matters**: Advertising tabs for Behavior, Tools, Playground, Connect, and Report that only trigger floating toast redirects destroys user trust and creates cognitive overload.
- **Fix**: Consolidate into a focused, working 3-tab layout: (1) Identity & Sales Persona, (2) Knowledge & Documents, and (3) Channel & Handoff Rules. Embed an interactive testing drawer directly on the page so users can test prompts immediately.
- **Suggested command**: `/impeccable shape`

### [P2] Missing CRM Commercial & Sales Workflows
- **Why it matters**: The assistant cannot qualify leads, tag high-intent prospects, or assign deals to sales reps. The KPI cards show empty inventory counts instead of business value.
- **Fix**: Replace static vanity counters with sales performance metrics (Leads Qualified, Inquiries Resolved, Escalation Rate). Add CRM automation triggers: *"When prospect requests quotation → tag VIP and assign rep"*.
- **Suggested command**: `/impeccable layout`

### [P3] Crippled Knowledge Ingestion (URL Text Input Only)
- **Why it matters**: Sales teams have PDF product brochures, price sheets, and SOPs. Forcing manual URL text input makes real enterprise training impossible.
- **Fix**: Provide a multi-mode knowledge uploader supporting drag-and-drop PDF/DOCX files, website crawling, and selection from existing RakanSales knowledge assets.
- **Suggested command**: `/impeccable clarify`

### [P3] Accessibility & Keyboard Trapping Deficits
- **Why it matters**: Screen reader users cannot operate toggles without `role="switch"`, keyboard users cannot escape modals or see hover-only delete buttons, and modal focus bleeds into the background.
- **Fix**: Add semantic switch roles, modal focus traps, Escape key listeners, and persistent accessible focus rings.
- **Suggested command**: `/impeccable audit`

## Persona Red Flags
- **Alex (Power User / Sales Director)**: Blocked from rapid iteration because there is no inline sandbox to test prompt changes side-by-side; blocked from duplicating bots with trained knowledge for A/B testing; frustrated by 0 keyboard accelerators.
- **Jordan (First-Timer / Junior Agent)**: Paralyzed by "Publish Live" because the UI doesn't say which WhatsApp number it will deploy to; confused by jargon like "Identity Response" with no default preview.
- **Sam (Accessibility-Dependent User)**: Cannot operate feature toggles (plain buttons without `role="switch"` or `aria-checked`); cannot access document delete buttons hidden behind `opacity-0` mouse hovers; trapped in modals without Escape key handling.

## Minor Observations
1. **Unnecessary Pagination Noise**: Displays `"Showing 1 of 1 assistants"` with 4 disabled pagination buttons (`« ‹ 1 of 1 › »`).
2. **Restricted Description Length**: 200 characters is too short for enterprise assistant instructions.
3. **Search Missing Clear Button**: Unlike the main settings search, the assistant search input lacks an `X` clear button.
4. **Vague Helper Copy**: "Leave blank to use default response" never explains what the default response actually is.

## Provocative Questions
1. *Why are "AI Behaviour", "AI Inboxes", and "AI Assistants" separate siloed tabs in Settings, when an AI Assistant is inherently a persona with behavior operating in an inbox?*
2. *What if the assistant editor had a live split-screen test console on the right, allowing sales managers to test real WhatsApp customer scenarios in real time?*
3. *What would happen if the top metrics showed commercial ROI—such as "RM 48,200 in qualified deals this week"—instead of static file counts?*
