# Settings Tab PRD

## Module
Web Forms → Form Editor → **Settings Tab**

## Purpose
The Settings tab contains form metadata, ownership details, template-related actions, and administrative lifecycle controls. It should serve as the operational home for form-level settings that do not belong in Build, Logic, Style, Submit, or Share & Embed.

---

## Product Goals
Users should be able to:
- manage internal form metadata clearly
- define ownership and organizational classification
- save an existing form as a reusable template
- duplicate a form safely
- archive or trash a form intentionally
- understand the administrative status and lifecycle of the form

---

## Core UX Principles
- The Settings tab should feel **administrative**, not creative.
- Form-level metadata should be separated from builder behavior.
- Destructive actions must be clearly isolated and protected.
- Operational actions like duplicate, archive, and save as template should be easy to find but hard to misuse.
- The tab should support both day-to-day management and future governance needs.

---

## Settings Content
The Settings tab includes:
- internal form name
- description
- tags
- department
- owner
- duplicate form
- save as template
- archive
- move to trash

---

## Settings Tab Page Layout
The Settings tab uses a **2-column workspace**:

1. **Main Panel** — grouped settings sections
2. **Right Panel** — status summary and action guidance

### Recommended Desktop Layout
- **Main Panel:** flexible primary workspace
- **Right Panel:** 320–360px

### Responsive Behavior
- On smaller laptop widths, the right panel can collapse below.
- On tablet, the page becomes a stacked form.
- Desktop remains the primary administrative editing experience.

---

## Global Tab Header Behavior
The Settings tab uses the persistent Form Builder top bar.

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

---

## Screen Composition

### 1) Main Panel — Settings Sections
The main panel should organize settings into clear groups.

#### Recommended Section Order
1. Form Details
2. Ownership & Classification
3. Template Actions
4. Lifecycle Actions

---

## Section A — Form Details

### Purpose
Capture internal metadata used by the team to identify and manage the form.

### Fields
- internal form name
- description
- tags

### Field Definitions

#### Internal Form Name
Used by team members inside RakanSales.
This may differ from the public title shown in the form itself.

#### Description
Internal notes about purpose, audience, or use case.

#### Tags
Helps with organization, filtering, and later reporting.

### UX Guidance
- internal form name is required
- description is optional but encouraged
- tags should support multi-value entry

---

## Section B — Ownership & Classification

### Purpose
Help teams understand who owns the form and how it is categorized operationally.

### Fields
- department
- owner

### Department
Used as a classification model for organization and filtering.
It should not be treated as a hard access restriction in the current product direction.

### Owner
Indicates the person responsible for maintaining the form.
This is different from submission ownership configuration in the Submit tab.

### Recommended Behavior
- owner should default intelligently where possible
- department should use a controlled list
- changes should update list views and filters across the module

---

## Section C — Template Actions

### Purpose
Allow users to convert a useful form into a reusable starting point for future forms.

### Primary Action
`Save as Template`

### Save as Template Flow
When the user chooses to save as a template, prompt for:
- template name
- description
- category
- tags
- publish status
- department classification

### Rules
- the form becomes a reusable template copy
- the current form remains independent
- future template changes do not retroactively alter the source form

### Permissions
Template management permissions belong to **Admin** and **Lead** users.
If broader users can trigger the action later, the system should still enforce permission on completion.

### Guidance
The template action should explain that the template is a starting point, not a linked master.

---

## Section D — Duplicate Form

### Purpose
Allow users to create a copy of the current form for reuse or experimentation.

### Primary Action
`Duplicate form`

### Recommended Behavior
Duplicating a form should create:
- a new independent draft form
- copied structure
- copied logic
- copied styling
- copied submission settings where supported
- copied metadata with editable naming

### Duplicate Naming Pattern
Suggested default:
`[Original Form Name] (Copy)`

### Safeguard
Users should understand that the duplicate is fully separate from the original form.

---

## Section E — Lifecycle Actions

### Purpose
Support non-creative administrative management of the form record.

### Actions
- archive
- move to trash

### Archive
Archive is used for forms that should no longer remain active in the main workflow but may need to be retained.

#### Archive Behavior
- removes form from active working lists or de-emphasizes it
- prevents it from being treated as an active form
- preserves history and recoverability where supported

### Move to Trash
Move to Trash is a more destructive administrative action.

#### Trash Behavior
- removes the form from normal working lists
- should require confirmation
- may support later restore flows depending on system behavior

### Action Separation
Archive and Move to Trash should not appear as equal-weight casual actions.
They should be visually separated from routine metadata editing.

---

### 2) Right Panel — Status + Guidance
The right panel gives context before sensitive changes are made.

#### Recommended Sections

##### A. Form Status Summary
Show:
- current status
- owner
- department
- template origin if applicable later
- last updated information

##### B. Administrative Notes
Examples:
- `Editing metadata does not change the public form title unless updated in Build.`
- `Archiving removes the form from active workflow use.`
- `Moving to trash is intended for removal, not routine deactivation.`

##### C. Permission Notes
Where relevant, explain:
- who can save templates
- who can manage template library content
- whether the current user can complete certain actions

##### D. Risk Summary
Useful for destructive operations:
- form is currently published
- form is embedded somewhere active
- form has linked submission activity

---

## Interaction Model

### Editing Behavior
- metadata updates save through the standard save/autosave system
- administrative actions use explicit confirmation flows
- right panel guidance updates when a risky action is selected

### Save as Template Behavior
- opens a metadata modal or drawer
- validates required template metadata
- creates a separate template artifact

### Duplicate Behavior
- creates a new draft record
- returns the user to either the new form or current form depending on chosen product behavior later

---

## Validation Rules

### Hard Prevents
Do not allow:
- blank internal form name
- save-as-template completion without required template metadata
- destructive actions without confirmation

### Soft Warnings
Warn when:
- archiving a published form
- trashing a published form
- changing ownership on a form actively managed by another team
- saving a template without clear description or classification

---

## Warnings and Safeguards

### Published Form Safeguard
If the form is published, destructive lifecycle actions should carry stronger warnings.

### Archive Confirmation Example
`Archive this form? It will be removed from active workflows and should no longer be treated as a live working form.`

### Trash Confirmation Example
`Move this form to trash? This is intended for removal and may affect teams still using this form.`

### Unsaved / Saving State
Show clear autosave feedback in the top bar:
- Saving...
- Saved
- Save failed

---

## Empty and First-Use States

### No Description Yet
Show lightweight helper text encouraging users to add internal context.

### No Tags Yet
Prompt users to add tags for better organization.

### No Owner Assigned
Show a clear but non-blocking reminder that ownership helps accountability.

---

## Recommended v1 Scope
Included in v1:
- internal form name
- description
- tags
- department
- owner
- save as template
- duplicate form
- archive
- move to trash
- permission-aware messaging
- confirmation flows for destructive actions

Not included in v1:
- detailed audit history UI
- approval workflows
- environment promotion workflows
- granular role configuration UI
- template version history
- dependency graph of embeds or pages

---

## Success Criteria
The Settings tab is successful if users can:
- manage form metadata without confusion
- assign ownership and classification clearly
- save a reusable form as a template with the right metadata
- duplicate forms safely for reuse
- archive or trash forms with clear understanding of impact
- distinguish routine administrative editing from destructive lifecycle actions
