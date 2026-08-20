# Responses / Submissions Page PRD

## Module
Web Forms → **Responses / Submissions**

## Purpose
The Responses / Submissions page is the operational home for reviewing all submissions received by a single web form in RakanSales. It should help users monitor incoming responses, inspect submitted answers, understand what records were created, and take the next operational action quickly.

This page is primarily **review-first and action-oriented**. It is not the place to build or configure the form itself.

---

## Why This Page Exists
The homepage helps users find a form, and the Form Detail page helps users understand a form’s overall status and performance. Users still need a dedicated surface where they can answer:
- Who has submitted this form?
- What exactly did each person submit?
- Did the submission create the expected CRM records?
- Were any duplicates flagged or processing issues encountered?
- Which submissions need attention?
- What should I do next: inspect, export, open linked records, or edit the form?

Without this page, users would need to rely on summary tables or open the builder to investigate individual responses, which mixes operational review with configuration work.

---

## Product Goals
Users should be able to:
- view all submissions for a single form in one dedicated surface
- scan submission volume and recent activity quickly
- search and filter submissions by respondent, date, status, and outcome signals
- open an individual submission to inspect answers and metadata
- understand what CRM records were created from each submission
- identify duplicate-flagged or failed submissions clearly
- open linked records such as Contact, Lead, Conversation, Support Ticket, or Deal
- export submissions when needed
- move between submission review and form management without confusion

---

## Core UX Principles
- The page should feel like a **submission inbox and review table**, not a second form editor.
- The most important information should be visible quickly: who submitted, when, what happened, and whether attention is needed.
- Submission data and form configuration should remain clearly separated.
- Users should be able to inspect a single submission without losing their place in the larger list.
- Outcome status, duplicate signals, and linked records must be easy to understand.
- The page should support both quick scanning and deeper inspection.
- v1 should prioritize clarity and operational usefulness over advanced analytics or workflow automation.

---

## Relationship to Other Web Forms Surfaces
The product should clearly separate these responsibilities:

### Homepage
Used for:
- browsing all forms
- seeing lightweight performance signals
- opening the form detail page
- opening the form’s responses list from row actions

### Form Detail / View Form
Used for:
- high-level status and performance review
- recent submissions snapshot
- opening the full responses page for deeper inspection

### Form Builder
Used for:
- Build
- Logic
- Style
- Submit
- Share & Embed
- Settings

### Responses / Submissions Page
Used for:
- reviewing all submissions for one form
- inspecting answers and metadata
- checking submission outcomes
- opening linked CRM records
- exporting response data

### Product Rule
The Responses / Submissions page should be a **separate operational surface** from the Form Builder. It should not recreate editing controls that belong in the builder.

---

## Entry Points
Users can enter the Responses / Submissions page from:
- the Web Forms homepage row action: `Responses`
- the Form Detail page action: `Open all submissions`
- the Form Detail page recent submissions table
- notification or activity links that reference a specific submission later
- direct deep links to a form’s submissions list

---

## Primary User Jobs
### Job 1 — Monitor incoming activity
Users want to know whether submissions are arriving and whether volume looks healthy.

### Job 2 — Inspect individual responses
Users want to see exactly what a person submitted, including uploaded files and hidden metadata where relevant.

### Job 3 — Verify downstream outcomes
Users want to confirm that each submission created the intended CRM objects and routing outcomes.

### Job 4 — Resolve exceptions
Users want to spot duplicate flags, failed processing, or missing linked outcomes quickly.

### Job 5 — Export or hand off data
Users want to export response data or open the linked record for follow-up.

---

## Page Type
Recommended v1 pattern:
- **single submissions management page** for one form
- summary strip at the top
- filterable and searchable table as the primary surface
- optional right-side detail drawer for inspecting a single submission
- full submission detail page can be added later if needed

This keeps the page fast for review while allowing deeper inspection without forcing users into a separate editing workflow.

---

## Page Layout
The Responses / Submissions page uses a **single primary workspace** with optional contextual detail.

### Recommended Structure
1. Header
2. Submission summary strip
3. Search, filters, and export controls
4. Submissions table
5. Optional submission detail drawer

### Recommended Desktop Behavior
- full-width table-focused layout
- summary cards above the table
- right-side submission drawer opens over the page without losing table context

### Responsive Behavior
- on smaller laptop widths, some filters can collapse into a filter drawer
- on tablet, the detail drawer can become full-screen
- on mobile, the page becomes a stacked list with expandable rows or a full-screen detail view
- desktop remains the preferred operational review experience

---

## Global Header
The page should use a dedicated operational header, separate from the Form Builder header.

### Left
- Back to Web Forms or Back to Form Detail
- Form internal name
- page label: `Responses`
- form status pill

### Right
Primary actions:
- **Form Detail**
- **Edit Form**
- **Preview Form**
- **Export**
- **More menu**

### More Menu
Recommended items:
- Open standalone link
- Copy share link
- Pause / Resume form
- Archive form
- Move form to trash

This keeps form-level actions available without turning the page into a management dashboard for the form itself.

---

## Relationship to Form Status
The Responses / Submissions page must stay aligned with the same form statuses used elsewhere:
- Draft
- Published
- Paused
- Archived

### Status Behavior on Responses Page
#### Draft
- existing submissions, if any, remain viewable
- most forms will have no submissions yet
- header and empty states should reinforce that the form is not live

#### Published
- new submissions may continue arriving
- the page should clearly show current activity and recent results

#### Paused
- existing submissions remain viewable
- the page should make clear that new submissions are currently unavailable

#### Archived
- historical submissions remain viewable for reference
- the form is inactive, but the response history should remain accessible where retention policy allows

### Product Rule
Form lifecycle status affects whether **new** submissions can arrive, but it should not remove access to existing submissions.

---

## Submission State Model
The page should clearly distinguish the status of an individual submission from the status of the form.

### Recommended v1 Submission States
- **Completed**
- **Duplicate Flagged**
- **Processing Failed**

### Definitions
#### Completed
The submission was received and the expected downstream processing completed successfully.

#### Duplicate Flagged
The submission was received, but the configured duplicate strategy flagged a potential duplicate or linked the submission to an existing record.

#### Processing Failed
The submission was received, but one or more downstream outcomes or mappings failed and need attention.

### Notes
- additional technical states can exist internally, but the UI should keep v1 statuses readable
- duplicate behavior should reflect the configuration defined in the Submit tab
- linked outcome summaries should explain what happened in plain language

---

## Information Architecture
Recommended section order:
1. Hero summary
2. Submission snapshot
3. Search and filters
4. Submissions table
5. Submission detail drawer

---

## Section A — Hero Summary
### Purpose
Provide fast context about which form’s responses the user is viewing.

### Contents
- form internal name
- public form title where useful
- form status pill
- owner
- department
- last submission timestamp
- total submissions count

### Supporting Copy Examples
- `Published form with active submission history.`
- `Draft form. No live submissions expected until published.`
- `Paused form. Historical submissions remain available.`
- `Archived form. Viewing retained submission history.`

---

## Section B — Submission Snapshot
### Purpose
Give users a quick operational view of response activity and issues.

### Recommended v1 Metrics
- total submissions
- submissions in last 7 days
- submissions in last 30 days
- duplicate-flagged count
- failed processing count
- last submission timestamp

### Card Behavior
- display metrics as lightweight summary cards
- metrics should update when submission data changes
- avoid turning v1 into a heavy analytics surface

### Empty State
If no submissions exist:
- `No submissions yet`
- supporting note: `Once people submit this form, responses will appear here.`

---

## Section C — Search, Filters, and Views
### Purpose
Help users narrow large submission sets quickly.

### Search Scope
Search should work against:
- respondent name where captured
- respondent email where captured
- submission ID
- linked record name or identifier where useful
- key text answers later if indexed reliably

### Placeholder
`Search by respondent, email, or submission ID`

### Recommended v1 Filters
- submission status
- date range
- duplicate flagged
- outcome type
- owner / team outcome
- has file upload

### Recommended Quick Views
- All submissions
- Recent
- Duplicate flagged
- Failed

### Applied Filters Pattern
- show removable filter chips below the search row
- support `Reset All`
- preserve filters while paging or exporting filtered results

### Default Sort
`Newest first`

### Additional Sort Options
- Oldest first
- Last updated
- Submission status
- Respondent name later if useful

---

## Section D — Submissions Table
### Purpose
Provide a dense but readable operational list of submissions for one form.

### Recommended Table Style
A table view is recommended for v1 because users need to compare multiple submissions quickly.

### Recommended Columns
1. Selection checkbox
2. Submitted At
3. Respondent
4. Response Preview
5. Created Outcome Summary
6. Submission Status
7. Action

### Column Definitions
#### Submitted At
Shows the submission timestamp in a readable format with timezone handling consistent with the product.

#### Respondent
Shows the best available identifier, for example:
- full name
- email address
- company name
- fallback such as `Anonymous` or `Unknown respondent` where appropriate

#### Response Preview
Shows a compact preview of one or two useful submitted values, such as inquiry type or subject.
This helps users scan the table without opening every row.

#### Created Outcome Summary
Shows what was created or linked in RakanSales, for example:
- `Contact + Conversation`
- `Lead`
- `Contact linked to existing record`
- `Support Ticket`

#### Submission Status
Shows a clear badge such as:
- Completed
- Duplicate Flagged
- Processing Failed

#### Action
Primary row action:
- `View submission`

### Table Behaviors
- clicking the row or `View submission` opens the submission detail drawer
- hover states should improve scannability without clutter
- long respondent values should truncate gracefully with full value on hover
- empty values should show a neutral placeholder such as `—`
- pagination should preserve filters and search state

---

## Section E — Submission Detail Drawer
### Purpose
Let users inspect one submission in detail without leaving the main responses list.

### Recommended v1 Drawer Sections
1. Submission summary
2. Answer content
3. Outcome summary
4. Linked records
5. Metadata
6. Files

### Drawer Section A — Submission Summary
Show:
- submission ID
- submitted at timestamp
- submission status
- respondent identifier
- duplicate flag summary where relevant

### Drawer Section B — Answer Content
Show the submitted answers grouped in a readable way.

Recommended behavior:
- preserve form labels as seen by the user
- support multi-step forms clearly
- group answers by section or step where useful
- show unanswered optional fields only when needed

### Drawer Section C — Outcome Summary
Show what happened after submission, for example:
- created object types
- linked object types
- duplicate handling result
- owner / team assignment result
- tags applied

### Drawer Section D — Linked Records
Provide direct actions to open related records such as:
- Contact
- Lead
- Company
- Conversation
- Support Ticket
- Deal
- Custom Object

### Drawer Section E — Metadata
Show relevant system and hidden data such as:
- hidden field values
- UTM values where captured
- submission source
- page URL later if tracked
- internal processing notes where useful

### Drawer Section F — Files
If the submission contains file uploads, show:
- uploaded file names
- file type / size where available
- download action

### Drawer Constraints
The drawer should remain focused on inspection and follow-up, not editing or reprocessing workflows.

---

## Export
### Purpose
Allow teams to extract submission data for analysis, reporting, or handoff.

### Recommended v1 Export Options
- export all submissions
- export filtered results
- export selected submissions

### Recommended Export Format
- CSV in v1

### Export Content
Exports should include, where available:
- submission timestamp
- respondent identifiers
- submitted field values
- submission status
- linked outcome summary
- hidden metadata where permitted

### Safeguards
- exporting should respect user permissions
- the UI should remind users that exports may contain personal or sensitive information
- if no submissions match the current scope, export should be disabled

---

## Bulk Actions
### Purpose
Support efficient handling of multiple submissions without overcomplicating v1.

### Recommended v1 Bulk Actions
- Export selected

### Optional Later Bulk Actions
- assign reviewer
- tag submissions
- mark as reviewed

### Bulk Action Rules
- bulk actions appear only when one or more rows are selected
- show selected count clearly, for example `3 Selected`
- destructive submission-level bulk actions should remain out of scope for v1

---

## Empty States

## Empty State A — No Submissions Yet
### When
The form has not received any submissions.

### Recommended Content
- heading: `No submissions yet`
- copy: `Responses will appear here once people submit this form.`
- primary action: `Preview Form`
- secondary action: `Edit Form` or `Publish` depending on form status

### Draft Variant
If the form is still Draft:
- supporting note: `This form is still in draft. Publish it before expecting live submissions.`

---

## Empty State B — No Results From Search or Filters
### Recommended Content
- heading: `No submissions match your filters`
- copy: `Try removing a filter, changing your search, or viewing a broader date range.`
- action: `Reset All`

---

## Empty State C — Failed Filter Empty
### Recommended Content
- heading: `No failed submissions`
- copy: `Submissions with processing issues will appear here if anything needs attention.`

---

## Validation and Safeguards
### Hard Prevents
Do not allow:
- export when there are no submissions in the selected scope
- unauthorized users to export sensitive submission data
- destructive submission deletion flows without explicit product support and confirmation

### Soft Warnings
Warn when:
- exporting filtered results that contain personal data
- a submission is linked to an existing contact through duplicate handling
- downstream outcome creation failed for a submission
- a paused or archived form is being reviewed so users do not expect new data to arrive

### Privacy and Retention Notes
The page should make it clear that submission visibility and export capability may involve sensitive data and must follow workspace permissions and retention policy.

---

## Permissions
### Submission Viewing
All users who can access the form should be able to view submissions under the current product direction unless more granular permissions are introduced later.

### Export Permissions
Export should be permission-aware because submission data may contain personal or sensitive information.

### Future Direction
Granular access controls can later separate:
- view submissions
- export submissions
- open linked CRM records
- manage sensitive file attachments

---

## Recommended v1 Scope
Included in v1:
- dedicated responses page per form
- top summary context
- submission snapshot metrics
- search and filters
- submissions table
- submission status badges
- submission detail drawer
- linked record shortcuts
- hidden metadata visibility where applicable
- file upload visibility and download actions
- CSV export
- minimal bulk export action
- empty states
- permission-aware export handling

Not included in v1:
- full analytics suite
- collaboration comments on submissions
- spam scoring engine
- mass submission deletion
- workflow automation builder for responses
- inline editing of submitted answers
- resubmit or replay processing actions
- submission comparison mode

---

## Success Criteria
The Responses / Submissions page is successful if users can:
- find and inspect submissions quickly
- understand what each person submitted without opening the builder
- confirm what CRM records were created from each submission
- identify duplicate or failed cases clearly
- export response data safely when needed
- move between form management and submission review without confusion

---

## Recommended Next Design Step
After this PRD, the next artifact should be:

**Responses / Submissions Page Screen Structure**

That screen spec should define:
- exact header actions
- top summary card layout
- filter and table interactions
- submission detail drawer structure
- export states
- empty states
- responsive behavior
- row and status badge rules
