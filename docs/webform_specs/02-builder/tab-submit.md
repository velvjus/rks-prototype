# Submit Tab PRD

## Module
Web Forms → Form Editor → **Submit Tab**

## Purpose
The Submit tab defines what happens after a visitor submits a form and what records or actions are created inside RakanSales. It connects the front-end submission experience with the CRM and operational data model.

---

## Product Goals
Users should be able to:
- choose what the visitor sees after submitting
- configure redirects or thank-you experiences
- define what object(s) are created in RakanSales
- handle duplicates safely
- assign ownership and tags automatically
- map form fields to CRM fields confidently
- understand what data will be stored before publishing

---

## Core UX Principles
- The Submit tab should bridge **visitor experience** and **system outcome** in one clear workflow.
- Success behavior and CRM behavior should be separate, but adjacent.
- Users should understand the downstream result of each submission.
- Duplicate handling must be explicit, because it affects data quality.
- Field mapping should feel structured and understandable, not overly technical.
- v1 should support common CRM outcomes without becoming a full automation builder.

---

## Submit Tab Page Layout
The Submit tab uses a **3-panel workspace**:

1. **Left Panel** — Sections + status summary
2. **Center Panel** — Main configuration workspace
3. **Right Panel** — Context, mapping help, and validation

### Recommended Desktop Layout
- **Left Panel:** 240–280px
- **Center Panel:** flexible primary workspace
- **Right Panel:** 320–380px

### Responsive Behavior
- On smaller laptop widths, the right panel can collapse into a drawer.
- On tablet, the section list becomes a slide-over while configuration remains central.
- Desktop remains the main operational setup experience.

---

## Global Tab Header Behavior
The Submit tab uses the persistent Form Builder top bar.

### Left
- Back to Web Forms
- Form name
- Status pill
- Autosave state

### Right
- Preview
- Save
- Publish / Update
- More menu

### Optional Secondary Row Inside Submit Tab
A contextual row may contain:
- completion checklist
- selected outcome summary
- validation warning count
- test submission action later if introduced

---

## Screen Composition

### 1) Left Panel — Sections
The left panel provides direct navigation through the Submit setup.

#### Recommended Navigation
- Success Experience
- Submission Outcomes
- Duplicate Handling
- Ownership & Tags
- Respondent Notifications
- Field Mapping

#### Summary Indicators
Each section can show:
- completion state
- warning state
- object type summary
- mapping count where relevant

This helps users see what is configured and what still needs attention.

---

### 2) Center Panel — Main Configuration Workspace
The center panel contains the actual controls for the selected section.

---

## Section A — Success Experience

### Purpose
Define what the visitor sees immediately after a successful submission.

### Supported v1 Success Modes
- show thank-you message
- redirect to URL
- redirect after optional delay
- show success CTA button

### Recommended Controls

#### A. Success Mode
Choose one primary pattern:
- Thank-you message
- Redirect to URL
- Thank-you message with CTA button
- Thank-you message then redirect

#### B. Thank-You Content
Fields:
- success title
- success body text
- optional success CTA label
- optional success CTA URL

#### C. Redirect Settings
Fields:
- redirect URL
- delay before redirect
- open in same tab

#### D. Preview
A lightweight preview block should show how the success state will appear.

### Default Recommendation
Default to:
- thank-you title
- thank-you body
- no redirect unless explicitly chosen

This is safer and easier to understand than redirect-first behavior.

---

## Section B — Submission Outcomes

### Purpose
Define what the system creates inside RakanSales from each submission.

### Supported v1 Outcomes
- Contact
- Lead
- Company
- Conversation
- Support Ticket
- Deal
- Custom Object

### Recommended Outcome Pattern
Allow users to choose one primary record type and optional related records where supported by business rules.

### Example Outcome Configurations
- Create Contact
- Create Lead + Conversation
- Create Contact + Support Ticket
- Create Company + Deal

### Recommended Controls
- primary outcome type
- optional secondary linked outcome(s)
- relationship summary
- brief explanation of what gets created

### Outcome Summary Example
`Each submission will create a Contact and a linked Conversation.`

### Guardrails
The system should prevent unsupported or conflicting combinations where necessary.

---

## Section C — Duplicate Handling

### Purpose
Define how the system should behave when an incoming submission matches an existing person or record.

### Supported v1 Options
- Always create new
- Create new and flag duplicate
- Link to existing contact and keep new submission
- Admin-defined rule

### Recommended Default
**Create new and flag duplicate**

This preserves submission history while making duplicates visible for review.

### Duplicate Handling UI
Controls:
- duplicate strategy selector
- explanation of selected behavior
- matching basis summary, for example email or phone where applicable
- optional alert note if the strategy may affect data quality

### Example Explanations
- `A new record will always be created, even if a match exists.`
- `A new record will be created and marked for duplicate review.`
- `The submission will attach to an existing contact when a match is found.`

### Special Consideration
For inquiry-style forms, preserving the submission record is often important even when the person already exists. The UI should not force a merge-style mental model for every form type.

---

## Section D — Ownership & Tags

### Purpose
Apply routing, team ownership, and metadata to the record(s) created from the submission.

### Supported v1 Controls
- assign owner
- assign team
- apply contact tags
- apply lead tags
- apply conversation tags

### Ownership Modes
Recommended modes:
- no explicit owner
- assign specific owner
- assign team
- future routing rules later

### Tagging UX
Users should be able to:
- add one or more tags per applicable object type
- see which object type each tag applies to
- remove tags easily

### Example Summary
`New contacts will be tagged “webform” and assigned to the Sales team.`

---

## Section E — Respondent Notifications

### Purpose
Automatically send an acknowledgement message or email to the person who submitted the form. This builds trust and provides the respondent with a record of their submission.

### Supported v1 Controls
- **Enable Acknowledgement Email**: Toggle to turn the feature on/off.
- **Email Subject**: Customizable subject line.
- **Sender Name**: Customizable name showing in the respondent's inbox.
- **Email Body**: Customizable message content.
- **Include Submission Copy**: Optional checkbox to include a summary of the respondent's answers in the email.

### Recommended UX
- Show a "Live Preview" of the email to help users visualize the respondent's experience.
- Default the sender name to the Workspace name or Form Owner.
- Ensure the email body supports basic line breaks.

### Example Summary
`Respondents will receive an automated thank-you email from "RakanSales Team".`

---

## Section F — Field Mapping

### Purpose
Map collected form data into the correct CRM fields and define how values should be stored.

### Mapping Responsibilities
Users should be able to:
- see all form fields
- choose destination CRM field(s)
- review unmapped fields
- store hidden metadata
- control overwrite versus append where supported

### Recommended Mapping Layout
A table-style mapping interface works best.

#### Suggested Columns
- Form field
- Field type
- Target object
- CRM field
- Write behavior
- Status

#### Example Rows
- `Email` → `Contact` → `Email Address` → `Overwrite`
- `Company` → `Company` → `Company Name` → `Overwrite`
- `Inquiry Details` → `Conversation` → `Message Body` → `Append`

### Required Mapping Behaviors
- map form field to CRM field
- save hidden metadata
- choose overwrite vs append where relevant
- flag unmapped required business fields

### Mapping Guidance
The UI should recommend sensible defaults where possible:
- Email → Contact Email
- Phone → Contact Phone
- Company → Company Name
- Hidden UTM values → metadata/custom fields

### Read-Only Hints From Build
Field cards can include quick mapping hints or target object previews, but actual mapping belongs in Submit.

---

### 3) Right Panel — Context + Validation
The right panel helps users understand implications and resolve issues.

#### Recommended Sections

##### A. Submission Summary
Show:
- current success mode
- object(s) created
- duplicate strategy
- owner / team summary
- respondent notifications (Enabled/Disabled)
- mapped fields count

##### B. Validation
Show warnings such as:
- no success behavior selected
- required business mapping missing
- outcome combination unsupported
- duplicate rule not chosen
- hidden field used but not mapped where intended

##### C. Data Notes
Helpful explanations such as:
- `Append is recommended for message-style fields.`
- `Overwrite is safer for canonical fields like Email.`
- `This outcome creates linked records.`

##### D. Related Actions
- jump to Build field
- jump to Logic when conditional visibility affects data expectations
- preview success state

---

## Validation Rules
The Submit tab must prevent obvious configuration mistakes.

### Hard Prevents
Do not allow publishing when:
- a required outcome configuration is incomplete
- required destination mapping is missing for the selected outcome model
- redirect URL is invalid when redirect mode is selected

### Soft Warnings
Warn but allow saving when:
- some optional fields are unmapped
- append/overwrite choice may be risky
- duplicate strategy may create many records
- owner or team is not assigned

---

## Interaction Model

### Section Navigation
- selecting a section in the left panel updates the center workspace
- right panel always reflects current configuration state
- completion indicators update as settings change

### Mapping Interactions
Users should be able to:
- select a CRM target from a dropdown
- bulk apply obvious defaults later if introduced
- filter unmapped fields
- identify hidden fields and system metadata clearly

### Preview Behavior
The success experience should have its own lightweight preview inside this tab.
Full form preview still belongs to the global Preview action.

---

## Empty States

### No Outcome Selected Yet
- heading: `Choose what a submission creates`
- copy: `Select a record type so RakanSales knows how to store incoming responses.`
- action: `Choose outcome`

### No Mappings Yet
- heading: `Map your fields`
- copy: `Connect form fields to CRM fields so each submission is stored correctly.`
- action: `Start mapping`

### No Success Experience Defined
- heading: `Choose what visitors see next`
- copy: `Set a thank-you message or redirect after submission.`

---

## Warnings and Safeguards

### Live Form Warning
If the form is published, show the persistent editor banner:

`You are editing a live form. Changes will update immediately for visitors.`

### Destructive / Sensitive Changes
Warn before changing:
- primary outcome type on a live form
- duplicate handling strategy on a live form
- core field mappings already in use

### Unsaved / Saving State
Show clear autosave feedback in the top bar:
- Saving...
- Saved
- Save failed

---

## Recommended v1 Scope
Included in v1:
- success message configuration
- redirect configuration
- success CTA button
- CRM outcome selection
- duplicate handling strategies
- owner and team assignment
- tagging
- respondent notifications
- field mapping table
- hidden metadata mapping
- overwrite vs append rules
- validation warnings

Not included in v1:
- advanced automation workflows
- conditional outcome logic
- branching based on submit destination
- lead scoring
- webhook builder
- external integration marketplace setup
- mapping rules based on conditional logic outcomes

---

## Success Criteria
The Submit tab is successful if users can:
- understand what happens after a submission
- configure visitor success behavior without confusion
- choose the right CRM outcome model
- handle duplicates intentionally
- map fields correctly into RakanSales
- review downstream data behavior before publishing
