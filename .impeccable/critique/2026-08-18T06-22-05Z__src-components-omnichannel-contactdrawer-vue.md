---
target: src/components/omnichannel/ContactDrawer.vue
total_score: 35.5
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-18T06-22-05Z
slug: src-components-omnichannel-contactdrawer-vue
---
# 🎨 UX/UI Design Critique: Omnichannel Context Panel

Method: dual-agent (A: 894ff1fa-6dae-4160-a1d7-0033200f6703 · B: 4f1dfb7b-f770-40b9-9c0e-2f3408cc41aa)

---

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Excellent use of Success Modals, Toast emissions, and status dots on avatars. |
| 2 | Match System / Real World | 4.0 | Uses clear, natural CRM terminology ("Pipeline", "Stage", "Assignee"). |
| 3 | User Control and Freedom | 4.0 | Clear cancel buttons, modal dismissals, and collapsible accordions give users full control. |
| 4 | Consistency and Standards | 3.5 | Unified visual language with Lucide icons and consistent typography. |
| 5 | Error Prevention | 3.0 | Basic validation exists (disabling the Submit button if the title is invalid). |
| 6 | Recognition Rather Than Recall | 3.5 | Excellent autocomplete suggestions for Tags and Participants. |
| 7 | Flexibility and Efficiency | 4.0 | High flexibility with keyboard navigation and AI title generation. |
| 8 | Aesthetic and Minimalist Design | 3.0 | Visually pleasing, but slightly dense with information. |
| 9 | Error Recovery | 3.0 | Inline validation warnings guide the user clearly. |
| 10 | Help and Documentation | 4.0 | The interactive hover tooltip for "How to use Participants" is a standout feature for contextual help. |
| **Total** | | **35.5/40** | **Good (88.75%)** |

---

### Design Specificity Verdict

- **LLM Assessment**: The component is **highly customized for RakanSales**. It is not a generic boilerplate drawer. It tightly integrates domain-specific logic, such as "Lead Status" (VIP vs Lead), specialized CRM tags (WhatsApp, Hot, High), and complex entity relationships (Conversations attached to Deals, Assignees, and Watchers/Participants). The hardcoded RakanSales mock data (e.g., "Ahmad Faizal", "KK Steel Manufacturing") further roots it in the specific product context.
- **Deterministic Scan**: The scan returned **2 warnings** regarding `gray-on-color` contrast (text-gray-700 on bg-teal-50, and text-gray-400 on bg-green-50). However, both are **false positives** in execution: the scanner evaluated template strings statically and missed ternary runtime splits and hover modifiers. Contrast can still be polished.

---

### Overall Impression
The Omnichannel Context Panel is a dense, high-fidelity sales drawer with robust keyboard navigation, AI utilities, and interactive help systems. The primary opportunity is to polish its default state density, increase key accessibility details (such as scrollbar grab target size), and introduce inline interactions for the main action buttons (Tasks, private Notes, and scheduling Calendar) to elevate it to a fully functional sales cockpit.

---

### What's Working
- **Keyboard Accessibility**: The inline tags and participants fields support rich arrow-key navigation and backspace deletion.
- **Contextual Help Popovers**: The hover-activated "How to use Participants" toolbox popover is elegant and keeps help inline.
- **End-of-Workflow Reassurance**: The Success Modal for deal creation with direct Deals page redirection is clean and delightful.

---

### Priority Issues

- **[P1] Initial Cognitive Overload**
  - *Why it matters*: All 4 accordion sections default to open, overloading the user with information immediately.
  - *Fix*: Default secondary accordions (Company Info, Actions) to closed.
  - *Suggested command*: `/impeccable quieter`
- **[P1] Contrast Polish for Colored Badges (Gray on Color)**
  - *Why it matters*: The remove icon and dynamic text inside tag chips/deal states lack optimal contrast.
  - *Fix*: Refactor dynamic classes, use text-current or higher contrast greens (`hover:text-green-700` / `bg-green-50/40`).
  - *Suggested command*: `/impeccable colorize`
- **[P2] Narrow Scrollbar Accessibility**
  - *Why it matters*: A 4px width is too narrow for standard cursor-grabbing.
  - *Fix*: Increase width to 6px or expand on hover.
  - *Suggested command*: `/impeccable layout`
- **[P2] Inline Action Button Redundancy**
  - *Why it matters*: Bottom actions (Tasks, Calendar, Chat, Watchers) trigger static toasts instead of functional prototypes.
  - *Fix*: Implement interactive inline modal overlays / toggles for task checking, note adding, and scheduling.
  - *Suggested command*: `/impeccable polish`
- **[P2] Layout Shift on Validation Error**
  - *Why it matters*: Dynamic error text shifts form controls downwards.
  - *Fix*: Wrap validation warning in an absolute or reserved-height element.
  - *Suggested command*: `/impeccable adapt`

---

### Persona Red Flags

- **Alex (Power User)**: Keyboard-friendly but frustrated that high-frequency workflow buttons like "Add Note" and "Tasks" are placed at the bottom, requiring scrolling.
- **Jordan (First-Timer)**: Overwhelmed by the sudden influx of checkboxes, inputs, dropdowns, and buttons. Needs cleaner progressive disclosure.

---

### Minor Observations
- The interactive hover empty state transitioning into a "+ Create Deal" button is smooth and intuitive.
- The custom switch toggle animation provides clear visual status feedback.

---

### Questions to Consider
- *What if the Action buttons were accessible at the top of the panel to reduce scrolling?*
- *Should selecting alternative pipelines dynamically adjust the available stages in the dropdown?*
