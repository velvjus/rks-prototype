# View Submission PRD

## Module
Web Forms → **View Submission**

## Purpose
The View Submission surface is the dedicated place for reviewing one individual form submission in detail inside RakanSales. It should help users understand exactly what was submitted, what happened after submission, what CRM records were created or linked, and whether the submission needs follow-up.

This surface is primarily **inspection-first and action-oriented**. It is not the place to edit the form, change submission mappings, or modify the submitted answers.

---

## Why This Page Exists
The Responses / Submissions page helps users scan all submissions for a form, but users still need a focused surface where they can answer:
- What exactly did this person submit?
- Which fields were answered, skipped, or hidden?
- What records were created or linked in RakanSales?
- Was the submission flagged as a duplicate or did processing fail?
- Were files uploaded?
- What should I do next: open linked records, download files, export, or go back to the submission list?

Without a dedicated View Submission surface, users would need to inspect dense tables or rely on partial drawer content that may become insufficient as forms become more complex.

---

## Product Goals
Users should be able to:
- inspect the full content of one submission clearly
- understand who submitted it and when
- review answers grouped in a readable structure
- understand what objects were created, linked, or flagged
- identify duplicate or failed-processing cases quickly
- inspect hidden metadata and system context where appropriate
- view and download uploaded files
- open related CRM records directly
- move back to the parent responses list without losing context
- distinguish submission review from form editing

---

## Core UX Principles
- The page should feel like a **submission record view**, not a configuration screen.
- Submitted answers should be the primary focus.
- Operational outcome information should be easy to understand in plain language.
- Sensitive metadata should be visible only where appropriate and permission-aware.
- Users should be able to take the next action quickly without needing to reopen the responses list.
- The surface should support both simple forms and complex multi-step forms.
- v1 should optimize for clarity and reliability over workflow automation.

---

## Relationship to Other Web Forms Surfaces
The product should clearly separate these responsibilities:

### Homepage
Used for:
- browsing forms
- opening form detail
- opening form responses

### Form Detail / View Form
Used for:
- reviewing form-level status and performance
- viewing recent submissions at a summary level
- opening the full responses list

### Responses / Submissions
Used for:
- scanning all submissions for one form
- filtering and searching submissions
- opening one submission for deeper inspection

### View Submission
Used for:
- inspecting one submission in full detail
- reviewing answers, outcomes, metadata, files, and linked records
- taking the next record-level action

### Form Builder
Used for:
- Build
- Logic
- Style
- Submit
- Share & Embed
- Settings

### Product Rule
View Submission should remain an operational review surface. It should not recreate builder controls or allow editing submitted answers in v1.

---

## Entry Points
Users can enter View Submission from:
- the Responses / Submissions table row action: `View submission`
- the Responses / Submissions table row click
- the Recent Submissions section on Form Detail
- notification or activity links referencing a specific submission later
- direct deep links to a submission record

---

## Primary User Jobs
### Job 1 — Read the submission clearly
Users want to see the full response in a readable format without scanning a compressed table row.

### Job 2 — Verify downstream outcomes
Users want to confirm whether the intended Contact, Lead, Conversation, Support Ticket, Deal, or other object was created or linked successfully.

### Job 3 — Inspect exceptions
Users want to understand duplicate flags, failures, or unexpected processing behavior.

### Job 4 — Follow up operationally
Users want to open linked records, download uploaded files, or hand off the information to the next team.

---

## Recommended Surface Pattern
Recommended v1 pattern:
- **dedicated submission detail page**
- optimized for full inspection of one response
- may share the same underlying content model as a right-side drawer in the Responses page
- supports deep-linking and easier review of larger or more complex submissions

### Product Direction
The Responses / Submissions page can still support a quick-inspection drawer, but View Submission should define the **full detail model** so the product has one canonical submission-detail surface.

---

## Page Layout
The View Submission surface uses a **2-column detail layout**:

1. **Main Content Column** — submission content, outcomes, files, and detail sections
2. **Right Sidebar** — status, respondent summary, quick actions, and guidance

### Recommended Desktop Layout
- **Main Content:** flexible primary column
- **Right Sidebar:** 320–360px

### Responsive Behavior
- On smaller laptop widths, the sidebar can collapse below the main content.
- On tablet, the page becomes a stacked detail layout.
- On mobile, sections stack vertically with sticky primary actions.
- Desktop remains the preferred operational review experience.

---

## Global Header
The page should use a dedicated detail header.

### Left
- Back to Responses
- submission identifier
- page label: `View Submission`
- submission status pill
- optional parent form name meta line

### Right
Primary actions:
- **Open linked record** (contextual when one primary record exists)
- **Export submission**
- **More menu**

### More Menu
Recommended items:
- Open parent form detail
- Open responses list
- Open form editor
- Copy submission ID
- Download all files where applicable

---

## Parent Form Context
The page should still make the parent form clear.

### Recommended Context Elements
- parent form internal name
- public form title where useful
- form status
- owner
- department

### Why This Matters
Users reviewing a submission should always know:
- which form the submission belongs to
- whether the form is Draft, Published, Paused, or Archived now
- whether current form status affects expectations for new submissions

---

## Form Status Alignment
The View Submission surface must stay aligned with the broader form lifecycle:
- Draft
- Published
- Paused
- Archived

### Status Behavior
#### Draft
Historical or test submissions remain viewable.

#### Published
Submission can be treated as part of the live flow.

#### Paused
Historical submissions remain viewable, but users should understand the form is not accepting new submissions.

#### Archived
Historical submissions remain viewable where retention policy allows, but the parent form is inactive.

### Product Rule
The form’s current status provides context, but it does not change the submission record itself.

---

## Submission State Model
The page should clearly distinguish submission state from form state.

### Recommended v1 Submission States
- **Completed**
- **Duplicate Flagged**
- **Processing Failed**

### Definitions
#### Completed
The submission was received and the configured downstream processing completed successfully.

#### Duplicate Flagged
The submission was received, but duplicate-handling logic flagged or linked it to an existing record.

#### Processing Failed
The submission was received, but one or more downstream actions, mappings, or record creations failed.

---

## Information Architecture
Recommended section order:
1. Submission Hero Summary
2. Submitted Answers
3. Outcome Summary
4. Linked Records
5. Files
6. Metadata & Hidden Values
7. Processing / Activity Timeline

Right sidebar:
1. Submission Status
2. Respondent Summary
3. Quick Actions
4. Guidance / Warnings

---

## Section A — Submission Hero Summary
### Purpose
Provide immediate context about this submission before users inspect the full answers.

### Recommended Contents
- submission ID
- submitted at timestamp
- submission status pill
- respondent identifier
- parent form name
- duplicate summary where relevant
- processing summary where relevant

### Supporting Copy Examples
- `Submission completed successfully and created a Contact + Conversation.`
- `Submission was linked to an existing Contact and flagged for duplicate review.`
- `Submission was received, but one or more downstream actions failed.`

---

## Section B — Submitted Answers
### Purpose
Show exactly what the person submitted in a readable, structured format.

### Recommended Behavior
- preserve the form field labels as seen by the respondent
- support grouping by step and section for multi-step forms
- show answer values clearly by field type
- display unanswered optional fields only when useful or behind a toggle
- distinguish hidden/system fields from respondent-entered answers

### Supported Answer Types
The page should display answers appropriately for:
- Short Text
- Long Text
- Email
- Phone
- Number
- Date
- Time
- Checkbox
- Radio
- Dropdown
- Multi-select
- Company
- Website
- Address
- Country
- Consent Checkbox
- Hidden Field
- File Upload

### Field Rendering Guidance
#### Textual fields
Show the full value clearly with line breaks preserved where relevant.

#### Choice fields
Show selected value(s) in readable labels, not raw internal keys.

#### Checkbox / consent fields
Show clear yes/no or checked/not checked treatment.

#### Address fields
Render structured address components clearly when available.

#### Hidden fields
Do not mix hidden values into the main answer flow by default. They belong in Metadata unless product direction prefers a clearly labeled system-data group.

#### File uploads
Show uploaded file names with file metadata and download action.

### Empty Answer Behavior
Optional unanswered fields can:
- be hidden by default for readability, or
- show a neutral placeholder such as `No response`

Recommended v1 behavior:
- show answered fields first
- allow optional expansion of unanswered fields later if needed

---

## Section C — Outcome Summary
### Purpose
Help users understand what happened inside RakanSales after the submission was received.

### Recommended Contents
- primary outcome created
- secondary linked outcomes if applicable
- duplicate handling result
- owner assignment result
- team assignment result
- tags applied
- mapping or processing notes where relevant

### Example Summaries
- `Created Contact and linked Conversation.`
- `Created Support Ticket and assigned it to Support Team.`
- `Linked submission to existing Contact and flagged duplicate review.`

### Error Handling
If processing failed, show:
- what succeeded
- what failed
- what remains unavailable
- a plain-language explanation rather than only technical logs

---

## Section D — Linked Records
### Purpose
Give users direct access to downstream CRM records created or linked from the submission.

### Supported Linked Record Types
- Contact
- Lead
- Company
- Conversation
- Support Ticket
- Deal
- Custom Object

### Recommended Contents
For each linked record, show:
- object type
- display name or identifier
- creation vs linked-to-existing state
- owner/team where useful
- open record action

### UX Guidance
- linked records should be scan-friendly cards or rows
- if duplicate logic linked to an existing record, that should be explicit
- if a record was expected but was not created, the absence should be clear

---

## Section E — Files
### Purpose
Allow users to inspect and retrieve files uploaded with the submission.

### Recommended Contents
- file name
- file type
- file size
- upload field label
- download action

### Behavior
- multiple files should be grouped under their original upload field when useful
- file downloads should respect permissions
- unsupported previews can still allow download

### Empty State
If there are no uploaded files:
- `No files uploaded`

---

## Section F — Metadata & Hidden Values
### Purpose
Expose submission context that may matter operationally but was not directly typed by the respondent.

### Recommended Contents
- hidden field values
- UTM values
- submission source
- landing page or page URL later if tracked
- referrer later if tracked
- device or browser context later if appropriate
- internal processing notes where useful

### UX Principles
- metadata should be clearly separated from user-facing answers
- sensitive or system-generated values should be permission-aware
- raw keys should be translated into readable labels where possible

---

## Section G — Processing / Activity Timeline
### Purpose
Give users a lightweight history of what happened to the submission after it was received.

### Recommended v1 Events
- submission received
- records created
- linked to existing record
- duplicate flagged
- owner assigned
- team assigned
- processing failed
- export activity later if tracked

### Why This Helps
This gives users a simple operational story without requiring a heavy audit-log product.

---

## Right Sidebar

## Sidebar Section A — Submission Status
### Purpose
Make the current operational state obvious.

### Recommended Contents
- submission status
- submitted timestamp
- duplicate flag summary
- processing health summary

### Example States
- `Completed — all configured outcomes succeeded`
- `Duplicate Flagged — linked to an existing Contact`
- `Processing Failed — one or more downstream actions need attention`

---

## Sidebar Section B — Respondent Summary
### Purpose
Show the best available identity summary at a glance.

### Recommended Contents
- respondent name where captured
- email where captured
- phone where captured
- company where captured
- source form name

### Fallback Behavior
If identity is limited, show a clear fallback such as:
- `Unknown respondent`
- `Anonymous`

---

## Sidebar Section C — Quick Actions
### Purpose
Support fast operational follow-up.

### Recommended Actions
- Open primary linked record
- Open all linked records
- Export submission
- Download files
- Copy submission ID
- Back to Responses

### Optional Later Actions
- Assign reviewer
- Mark as reviewed
- Add internal note

These are not required in v1.

---

## Sidebar Section D — Guidance / Warnings
### Purpose
Help users interpret the submission safely and accurately.

### Example Notes
- `Submitted answers are read-only in this view.`
- `Duplicate-flagged submissions may still have created valid records.`
- `Processing failures may affect linked record creation.`
- `Sensitive metadata and file access may depend on permissions.`

---

## Interaction Model
### Primary Navigation Flow
1. User opens a submission from the Responses / Submissions page
2. System opens View Submission
3. User inspects answers, outcomes, files, and metadata
4. User opens linked CRM records or returns to the responses list

### Relationship to Responses List
- back navigation should return users to the same filtered/sorted submission context when possible
- the user should not lose place unnecessarily

### Read-Only Model
The page is read-only for submission content in v1.
It should not allow:
- editing submitted answers
- editing form structure
- rerunning mapping configuration
- manually rewriting outcome history

---

## Export
### Purpose
Allow users to export the current submission for analysis, handoff, or recordkeeping.

### Recommended v1 Behavior
Support a single-submission export action.

### Recommended Format
- CSV row export
- JSON or PDF export later if required

### Safeguards
- export must respect submission-data permissions
- remind users that exported data may contain personal or sensitive information

---

## Empty and Edge States

## State A — Missing Linked Record
If a record was expected but not created:
- show the outcome gap clearly
- explain what was expected
- explain what failed where possible

## State B — Duplicate Flagged
If duplicate handling applied:
- show whether a new record was created or linked
- show the existing linked record where relevant
- avoid implying the submission itself is invalid

## State C — Failed Processing
If processing failed:
- show a clear warning banner
- identify which downstream actions failed
- keep successfully captured answers visible and intact

## State D — Submission Not Found or Inaccessible
If the submission no longer exists or the user lacks access:
- show a clear access or availability message
- provide navigation back to the responses list

---

## Validation and Safeguards
### Hard Prevents
Do not allow:
- editing submitted answers in normal v1 flow
- unauthorized file download
- unauthorized export of sensitive submission data
- destructive deletion without explicit product support and confirmation

### Soft Warnings
Warn when:
- the submission includes sensitive data
- duplicate handling linked to an existing record
- some downstream outcomes failed
- the parent form is paused or archived so users do not expect new data

### Privacy Guidance
Submission answers, metadata, and files may contain personal or sensitive information and must respect workspace permissions and retention policy.

---

## Permissions
### View Submission
Users who can access the form’s submissions can view the submission detail under the current product direction.

### Open Linked Records
Access should still respect CRM object permissions.

### Export and File Download
These actions should be permission-aware because they may expose personal or sensitive data.

---

## Recommended v1 Scope
Included in v1:
- dedicated view-submission surface
- submission hero summary
- full submitted answers display
- outcome summary
- linked record shortcuts
- file list and download actions
- hidden metadata visibility where applicable
- processing / status messaging
- export action for one submission
- permission-aware file and export handling
- responsive detail layout

Not included in v1:
- editing submitted answers
- submission replay / reprocessing controls
- internal comment threads
- assignment workflows
- comparison mode across submissions
- full audit log product
- PDF dossier generation unless later prioritized

---

## Success Criteria
The View Submission surface is successful if users can:
- understand one submission completely without returning to the table
- review answers in a clear structure
- confirm what CRM outcomes were created or linked
- identify duplicate or failed cases quickly
- access files and metadata safely
- move to the correct next operational action without confusion

---

## Recommended Next Design Step
After this PRD, the next artifact should be:

**View Submission Screen Structure**

That screen spec should define:
- exact header actions
- section ordering and card structure
- answer rendering rules by field type
- linked-record card behavior
- file list behavior
- status and warning treatments
- responsive layout behavior
- how this surface relates to the submission drawer in Responses
