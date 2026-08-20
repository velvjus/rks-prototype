# Form Detail / View Form PRD

## Module
Web Forms → **Form Detail / View Form**

## Purpose
The Form Detail page is the operational home for a single web form outside the editor. It helps users quickly understand a form’s status, performance, sharing readiness, submission behavior, and recent activity before deciding what to do next.

This page is primarily **read-first and action-oriented**, while the Form Builder remains the place where users actively configure the form itself.

---

## Why This Page Exists
The Form Builder is optimized for creating and editing forms. The Form Detail page should instead answer:
- What is this form for?
- Is it draft, published, paused, or archived?
- Is it currently ready to share?
- What happens when someone submits it?
- How is it performing?
- What should I do next?

Without this page, users must open the editor to answer simple operational questions that should be visible at a glance.

---

## Product Goals
Users should be able to:
- understand the current status and health of a form immediately
- review key metadata, ownership, and classification
- see headline submission and performance metrics
- understand what happens after submission at a summary level
- access the live standalone link and share readiness quickly
- review recent submissions and recent changes
- take the next action quickly: edit, preview, publish, pause, archive, duplicate, or open submissions
- distinguish between **viewing/managing** a form and **editing/building** a form

---

## Core UX Principles
- The page should feel like a **form dashboard**, not a second editor.
- The most important information should be visible **above the fold**.
- Primary actions should be obvious and status-aware.
- The page should support both quick scanning and deeper inspection.
- Editing should route users into the appropriate editor surface, not recreate the editor here.
- Status and share-readiness should always be unambiguous.
- Metrics should be useful, but should not turn v1 into a full analytics suite.

---

## Relationship to the Form Builder
The product should clearly separate these responsibilities:

### Form Detail / View Form
Used for:
- status review
- performance review
- metadata summary
- sharing readiness
- recent submissions/activity
- operational actions

### Form Builder
Used for:
- Build
- Logic
- Style
- Submit
- Share & Embed
- Settings

### Product Rule
The Form Detail page should show **summaries and shortcuts** from these areas, but should not duplicate the full editing experience.

---

## Entry Points
Users can enter the Form Detail page from:
- the Web Forms homepage list/card click
- a “View details” action from row overflow
- post-publish success flow
- recent activity links
- submission-related links that reference the parent form

### New Form Creation Rule
New forms are still created through the **Create New Form** flow and open directly in the Form Builder as **Draft**. The Detail page is not the first screen after creation unless product direction changes later.

---

## Primary User Jobs
### Job 1 — Check readiness
Users want to know if the form is ready to go live or share.

### Job 2 — Monitor activity
Users want to know whether the form is receiving submissions and whether it is working as expected.

### Job 3 — Take action quickly
Users want quick access to edit, preview, publish, pause, duplicate, archive, or share.

### Job 4 — Understand configuration without opening every tab
Users want a reliable summary of structure, submit behavior, and distribution status.

---

## Page Type
Recommended v1 pattern:
- **single detail page**
- summary-first
- with clearly separated sections
- optionally using lightweight internal tabs/anchors for navigation on long pages

This should feel faster and simpler than introducing another heavy multi-tab management surface.

---

## Page Layout
The Form Detail page uses a **2-column dashboard layout**:

1. **Main Content Column** — overview, metrics, submission summary, recent submissions, activity
2. **Right Sidebar** — status, quick actions, metadata, share readiness, guidance

### Recommended Desktop Layout
- **Main Content:** flexible primary column
- **Right Sidebar:** 320–360px

### Responsive Behavior
- On smaller laptop widths, the sidebar can collapse below the main content.
- On tablet, cards stack vertically.
- Mobile can use a fully stacked layout with sticky primary actions.

---

## Global Header
The page should have a dedicated detail header, separate from the Form Builder header.

### Left
- Back to Web Forms
- Form internal name
- status pill
- optional department / owner meta line

### Right
Primary actions:
- **Edit Form**
- **Preview**
- **Publish / Update** or **Pause / Resume** depending on status
- **More menu**

### More Menu
Recommended items:
- Duplicate form
- Open submissions
- Open standalone link
- Copy share link
- Archive
- Move to trash

---

## Status Model
The page must reflect the same supported statuses used in the Form Builder:
- Draft
- Published
- Paused
- Archived

### Status Behavior on Detail Page
#### Draft
- clearly marked as not live
- publish readiness issues surfaced
- share actions blocked or warning-led

#### Published
- clearly marked live
- share outputs available
- editing should warn that changes may affect live visitors once updated

#### Paused
- clearly marked unavailable for new submissions
- sharing visibility may remain, but submission acceptance status must be obvious

#### Archived
- clearly marked inactive
- operational actions limited
- sharing strongly discouraged or disabled

---

## Information Architecture
Recommended section order:
1. Hero Summary
2. Performance Snapshot
3. Configuration Summary
4. Distribution / Share Status
5. Recent Submissions
6. Recent Activity

Right sidebar:
1. Status & Health
2. Quick Actions
3. Metadata
4. Guidance / Warnings

---

## Section A — Hero Summary
### Purpose
Provide a fast understanding of what the form is and its current state.

### Contents
- internal form name
- public form title
- short internal description
- status pill
- owner
- department
- tags
- created date
- last updated date
- last published date where applicable

### Optional Supporting Copy
Examples:
- `Draft form. Publish before sharing.`
- `Published and accepting submissions.`
- `Paused. Visitors cannot submit right now.`
- `Archived. Not intended for active use.`

---

## Section B — Performance Snapshot
### Purpose
Give a quick operational view of form activity.

### Recommended v1 Metrics
- total submissions
- submissions in last 7 days
- submissions in last 30 days
- last submission timestamp
- completion rate (if trackable in v1)

### Optional v1.1 Metrics
- conversion rate by source
- top traffic source
- device split
- abandonment rate by step

### Card Behavior
Metrics should be displayed in simple summary cards.
Do not overload v1 with advanced charting unless data already exists reliably.

### Empty State
If no submissions yet:
- `No submissions yet`
- supporting note: `Once visitors submit this form, activity will appear here.`

---

## Section C — Configuration Summary
### Purpose
Summarize the most important parts of the form’s setup without requiring entry into each builder tab.

### Recommended Summary Blocks
#### 1. Structure Summary
Show:
- single-step or multi-step
- number of steps
- number of sections
- number of fields
- file upload present or not
- logic rules present count

#### 2. Submission Summary
Show:
- success behavior type
- primary CRM outcome
- secondary linked outcome(s) if configured
- duplicate handling strategy
- owner/team routing summary

#### 3. Style Summary
Show:
- active theme/preset name if applicable
- primary color preview
- font family
- button style preset

### Interaction Pattern
Each summary block should include a clear shortcut:
- `Edit Build`
- `Edit Logic`
- `Edit Submit`
- `Edit Style`

This preserves separation between summary and editing.

---

## Section D — Distribution / Share Status
### Purpose
Help users understand how the form is distributed and whether it is safe to share.

### Recommended Contents
- share readiness state
- standalone link preview or placeholder
- embed availability state
- published/live note
- last updated / last published summary

### v1 Output Summary
- Standalone link available or not
- iFrame embed available or not

### Status-Aware Behavior
#### Draft
Show warning:
`This form is still in draft. Publish it before sharing.`

#### Published
Show:
- live URL
- copy link action
- quick open action
- embed available indicator

#### Paused
Show:
- link may still exist
- new submissions unavailable
- warning-led messaging

#### Archived
Show:
- sharing disabled or strongly discouraged

### Edit Shortcut
Action:
- `Open Share & Embed`

---

## Section E — Recent Submissions
### Purpose
Give users confidence that the form is working and let them inspect recent incoming responses quickly.

### Recommended v1 Table
Columns:
- submission timestamp
- primary respondent identifier (for example email or name)
- created outcome summary
- submission status
- owner/team outcome if relevant
- action

### Row Action
- `View submission`

### Section Actions
- `Open all submissions`
- optional `Export later` if supported elsewhere

### Empty State
- heading: `No submissions yet`
- copy: `This form has not received any submissions.`
- secondary guidance can suggest previewing or publishing if still draft

---

## Section F — Recent Activity
### Purpose
Provide lightweight audit visibility so users understand what changed recently.

### Recommended Activity Items
- form created
- published
- paused / resumed
- updated
- owner changed
- template source created from template (if applicable)
- duplicate created
- archived / moved to trash

### v1 Scope Note
This should be a lightweight recent activity feed, not a full audit log product.

---

## Right Sidebar

## Sidebar Section A — Status & Health
### Purpose
Make status, live impact, and readiness immediately visible.

### Recommended Contents
- current status
- live readiness indicator
- submission acceptance state
- unpublished changes indicator later if versioning exists
- latest save/update state where available

### Examples
- `Draft — not shareable yet`
- `Published — live and accepting submissions`
- `Paused — link may remain accessible, but submissions are off`
- `Archived — inactive`

---

## Sidebar Section B — Quick Actions
### Purpose
Support fast operational workflows.

### Recommended Actions
- Edit Form
- Preview Form
- Open Submissions
- Copy Share Link
- Publish / Update
- Pause / Resume
- Duplicate Form

### Secondary / Destructive Actions
- Archive
- Move to Trash

These should be visually separated from standard actions.

---

## Sidebar Section C — Metadata
### Purpose
Provide administrative context.

### Recommended Contents
- owner
- department
- tags
- template origin if applicable
- created by
- created date
- last updated by
- last updated date

This should mirror the operational model from Settings without recreating the full editing UI.

---

## Sidebar Section D — Guidance / Warnings
### Purpose
Help users avoid mistakes.

### Examples
- `Editing content and settings happens inside the Form Builder.`
- `Changes to a published form may affect live visitors after update.`
- `Draft forms should be published before sharing.`
- `Paused forms will not accept new submissions.`
- `Archived forms should not remain embedded on active pages.`

---

## Interaction Model
### Primary Editing Flow
Clicking **Edit Form** opens the Form Builder.

### Deep Edit Shortcuts
From summary blocks, users can jump directly into relevant tabs:
- Build
- Logic
- Style
- Submit
- Share & Embed
- Settings

### Preview Flow
Preview opens the current form preview experience.

### Submission Flow
Clicking a recent submission opens the submission detail view if available.

---

## Empty and First-Use States
### Draft With No Submissions
Show:
- readiness message
- next step guidance
- strong CTA: `Edit Form` or `Publish`

### Published With No Submissions
Show:
- `This form is live, but no submissions have arrived yet.`
- optional guidance to share the standalone link

### Archived Form
Show:
- reduced action surface
- clear inactive messaging

---

## Validation and Safeguards
### Hard Prevents
Do not allow:
- share link copy in normal flow while Draft if product blocks sharing there
- publish action when required configuration is incomplete
- destructive actions without confirmation

### Soft Warnings
Warn when:
- form is Draft and user attempts to share
- form is Paused and user opens distribution outputs
- form is Archived and still appears to be embedded or distributed
- form has no owner or weak classification metadata

---

## Form Detail / View Form Screen Structure

## Purpose of This Screen Structure
This section defines the exact screen composition for the Form Detail page so the PRD is implementation-ready without requiring a separate follow-up artifact.

---

## Screen Structure Principles
- the page should read as a dashboard for one form
- the header and top summary should answer the most important operational questions first
- cards should group information by decision-making purpose, not by source system
- the right sidebar should stay useful even when the main column grows longer
- every summary area should lead clearly to the correct deeper surface

---

## Desktop Page Frame
Use a 2-column dashboard layout:
- **Main Content Column:** flexible primary column
- **Right Sidebar:** 320–360px fixed supporting column

### Recommended Vertical Order
1. Detail Header
2. Hero Summary
3. Performance Snapshot
4. Configuration Summary
5. Distribution / Share Status
6. Recent Submissions
7. Recent Activity

### Sticky Behavior
- the detail header may remain sticky on scroll
- the right sidebar can remain sticky below the header on large screens
- sticky behavior should never hide destructive warnings or status information

---

## Header Screen Structure

### Header Row Layout
#### Left Cluster
- Back to Web Forms
- Form internal name
- status pill
- optional owner / department meta line

#### Right Cluster
- Edit Form
- Preview
- primary lifecycle action
- More menu

### Header Action Rules by Status
#### Draft
Primary actions:
- Edit Form
- Preview
- **Publish**
- More menu

Behavior notes:
- share actions in the more menu can remain visible but should be blocked or warning-led
- readiness issues should be surfaced before publish completes

#### Published
Primary actions:
- Edit Form
- Preview
- **Pause** or **Update** when live changes require publishing/updating behavior
- More menu

Behavior notes:
- if the product distinguishes saved changes from live changes later, `Update` should replace or sit above `Pause` as the primary lifecycle action
- open standalone link and copy share link should be available

#### Paused
Primary actions:
- Edit Form
- Preview
- **Resume**
- More menu

Behavior notes:
- the page should clearly show that the form can still be reviewed and edited, but is not accepting new submissions

#### Archived
Primary actions:
- Edit Form
- Preview
- no live-share primary action
- More menu

Behavior notes:
- archived forms should visually reduce emphasis on publish/share behaviors
- destructive actions remain available only in protected flows

### More Menu Rules
Recommended items:
- Duplicate form
- Open submissions
- Open standalone link
- Copy share link
- Archive
- Move to trash

Status-aware rules:
- Draft: open/copy share should be blocked or warning-led
- Published: all non-destructive actions available
- Paused: open/copy share allowed with paused warning
- Archived: share actions hidden or strongly discouraged

---

## Main Content Column Structure

## Section 1 — Hero Summary Card
### Layout
Use a full-width top card with two internal zones:

#### Left Zone
- internal form name
- public form title
- short internal description
- supporting status message

#### Right Zone
- owner
- department
- tags
- created date
- last updated date
- last published date

### Card Behavior
- this card should be the first visual anchor on the page
- the status message should change by lifecycle state
- long descriptions should truncate with expand behavior if needed

### Example Supporting Status Messages
- `Draft form. Publish before sharing.`
- `Published and accepting submissions.`
- `Paused. Visitors cannot submit right now.`
- `Archived. Not intended for active use.`

---

## Section 2 — Performance Snapshot
### Layout
Use a row of lightweight metric cards directly below the hero summary.

### Recommended Cards
- Total submissions
- Last 7 days
- Last 30 days
- Last submission
- Completion rate

### Card Rules
- cards should be equal-height and easy to scan
- use a neutral placeholder when a metric is unavailable
- avoid charts in v1 unless tracking reliability is already confirmed

### Empty State
If there are no submissions:
- show `No submissions yet`
- include supporting note: `Once visitors submit this form, activity will appear here.`

---

## Section 3 — Configuration Summary
### Layout
Use a grouped 3-card block or vertically stacked cards depending on width.

### Card A — Structure Summary
Contents:
- single-step or multi-step
- number of steps
- number of sections
- number of fields
- file upload present or not
- logic rules count

Primary shortcut:
- `Edit Build`
- `Edit Logic`

### Card B — Submission Summary
Contents:
- success behavior type
- primary CRM outcome
- linked secondary outcome summary
- duplicate handling strategy
- owner/team routing summary

Primary shortcut:
- `Edit Submit`

### Card C — Style Summary
Contents:
- active theme or preset
- primary color preview
- font family
- button style preset

Primary shortcut:
- `Edit Style`

### Rules
- these cards are summaries only and must not expose inline editing in v1
- each card should be readable without opening the builder
- each card should end with one clear deep-link action

---

## Section 4 — Distribution / Share Status
### Layout
Use a dedicated card below Configuration Summary.

### Left Side
- share readiness state
- standalone link state
- embed availability state
- live / published note

### Right Side
- copy link action
- open link action
- `Open Share & Embed` shortcut

### Status Variants
#### Draft
Show:
- warning banner or warning block
- disabled share actions
- message: `This form is still in draft. Publish it before sharing.`

#### Published
Show:
- live URL preview
- copy action
- open action
- embed available indicator

#### Paused
Show:
- share location may still exist
- clear note that new submissions are unavailable
- warning-led share treatment

#### Archived
Show:
- sharing disabled or strongly discouraged
- archival guidance

---

## Section 5 — Recent Submissions
### Layout
Use a table card below Distribution / Share Status.

### Header Row
- section title: `Recent Submissions`
- secondary action: `Open all submissions`

### Recommended Columns
- submission timestamp
- respondent identifier
- created outcome summary
- submission status
- owner/team outcome
- action

### Row Action
- `View submission`

### Rules
- show a limited recent set such as the latest 5 to 10 items
- this section is for confidence and quick inspection, not full response management
- clicking the section action should open the dedicated Responses / Submissions page

### Empty State
- heading: `No submissions yet`
- copy: `This form has not received any submissions.`
- if Draft, add next-step guidance to publish or preview

---

## Section 6 — Recent Activity
### Layout
Use a timeline-style or stacked activity card at the bottom of the main column.

### Recommended Activity Items
- form created
- published
- paused / resumed
- updated
- owner changed
- created from template
- duplicate created
- archived / moved to trash

### Rules
- activity should stay lightweight in v1
- show human-readable timestamps
- do not turn this section into a full audit log

---

## Right Sidebar Structure
The right sidebar should remain visible as the operational control rail.

### Sidebar Order
1. Status & Health
2. Quick Actions
3. Metadata
4. Guidance / Warnings

---

## Sidebar Section A — Status & Health Card
### Contents
- current status
- live readiness indicator
- submission acceptance state
- latest save/update state where available

### Example Treatments
- `Draft — not shareable yet`
- `Published — live and accepting submissions`
- `Paused — submissions are off`
- `Archived — inactive`

### Rules
- this card should be visible without scrolling far
- the top status treatment should visually match the global status pill

---

## Sidebar Section B — Quick Actions Card
### Primary Actions
- Edit Form
- Preview Form
- Open Submissions
- Copy Share Link
- Publish / Update
- Pause / Resume
- Duplicate Form

### Secondary / Destructive Actions
- Archive
- Move to Trash

### Rules
- destructive actions must be visually separated
- disabled actions must still explain why they are unavailable

---

## Sidebar Section C — Metadata Card
### Contents
- owner
- department
- tags
- template origin if applicable
- created by
- created date
- last updated by
- last updated date

### Rules
- this mirrors Settings-level context without recreating editable controls
- long tag lists should collapse cleanly

---

## Sidebar Section D — Guidance / Warnings Card
### Contents
- editing happens in the Form Builder
- published changes may affect live visitors after update
- draft forms should be published before sharing
- paused forms will not accept new submissions
- archived forms should not remain embedded on active pages

### Rules
- guidance should be status-aware
- only show the most relevant warnings for the current form state

---

## Component-Level Content Rules

### Summary-Only Rule
The Form Detail page should summarize information from:
- Build
- Logic
- Style
- Submit
- Share & Embed
- Settings

It should not recreate full configuration controls from those tabs.

### Action Routing Rule
Every summary area should route to the correct deeper surface:
- structure summary → Build / Logic
- submission summary → Submit
- style summary → Style
- distribution summary → Share & Embed
- metadata / ownership issues → Settings
- submissions list → Responses / Submissions

### Badge and Status Rule
- use the same status labels used across the module
- submission statuses shown in recent submissions should match the responses model
- warning badges should be used sparingly and only when action is required or risk is real

### Content Density Rule
- hero and snapshot sections should optimize for scanning
- long operational detail belongs in linked surfaces, not expanded inline on this page

---

## Empty-State Screen Structure

### Draft With No Submissions
Recommended page emphasis:
- hero summary with draft message
- performance cards showing no activity
- distribution card showing blocked sharing
- quick actions emphasizing `Edit Form` and `Publish`

### Published With No Submissions
Recommended page emphasis:
- hero summary showing live state
- performance cards with zero activity
- distribution card showing live share link
- guidance suggesting sharing or distribution review

### Paused Form
Recommended page emphasis:
- status and health card showing paused state clearly
- distribution card warning that new submissions are unavailable
- quick action emphasizing `Resume`

### Archived Form
Recommended page emphasis:
- reduced operational action surface
- inactive messaging in hero and status cards
- sharing discouraged or disabled
- recent historical activity and submissions remain visible where available

---

## Responsive Screen Structure

### Laptop / Narrow Desktop
- main content remains primary
- right sidebar may stack below the main column
- metric cards can wrap to 2 rows
- configuration summary cards can stack vertically

### Tablet
- fully stacked layout
- header actions may condense into one primary action plus overflow
- recent submissions table may reduce visible columns and rely on row expansion

### Mobile
- single-column stacked layout
- sticky primary action area for the most important lifecycle action
- hero summary becomes compact with expandable metadata
- recent submissions may switch from table to stacked rows/cards
- right sidebar content becomes inline cards below the main sections

### Responsive Priority Order
When space is constrained, preserve visibility of:
1. status
2. primary actions
3. hero summary
4. performance snapshot
5. share readiness
6. recent submissions
7. recent activity

---

## Recommended v1 Scope
Included in v1:
- detail header with status-aware actions
- hero summary
- performance snapshot
- configuration summary
- distribution/share status summary
- recent submissions list
- recent activity feed
- metadata sidebar
- deep links into Form Builder tabs
- status-aware warnings and confirmations
- inline screen structure rules inside this PRD

Not included in v1:
- advanced analytics suite
- funnel visualization
- full audit history system
- per-step abandonment diagnostics
- embed dependency graph
- environment/version comparison
- inline editing across all summaries

---

## Success Criteria
The Form Detail page is successful if users can:
- understand a form’s current state in seconds
- know whether the form is live and safe to share
- review basic performance without opening reports
- understand submission behavior at a summary level
- access recent submissions quickly
- jump into the correct editing surface without confusion
- manage operational actions without opening the full builder unnecessarily
