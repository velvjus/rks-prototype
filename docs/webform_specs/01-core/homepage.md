# Web Forms Homepage PRD

## Module
Web Forms → **Homepage / Forms List**

## Purpose
The Web Forms homepage is the main landing page for creating, finding, filtering, and managing forms connected to RakanSales. It should help users quickly understand what forms exist, what state they are in, how they are performing, and what action to take next.

This page is the operational index for the module. It is not the place to build the form itself, but it should make it easy to:
- create a new form
- open a form’s detail page
- jump into editing
- manage template access
- monitor status and lightweight performance
- perform bulk administrative actions

---

## Why This Page Exists
Users need a clear starting point for the Web Forms module that answers:
- What forms do we have?
- Which ones are active, draft, paused, starred, or archived?
- Which forms belong to me?
- Which forms are tagged for a department or function?
- Which forms should I edit, publish, pause, archive, or review?

Without this page, users would need to rely on deeper builder or detail screens for basic organization and operational management.

---

## Product Goals
Users should be able to:
- create a new web form quickly
- access template management from the module entry point
- search forms by name, tag, or owner
- filter forms by lifecycle state and tag
- sort forms in useful ways
- browse all active forms or only their own forms
- understand basic performance signals at a glance
- select one or multiple forms for quick actions
- open the Form Detail page for operational review
- open the Form Builder for direct editing

---

## Relationship to Other Web Forms Surfaces
The homepage is the top-level management surface in the module.

### Homepage
Used for:
- browsing all forms
- search, filtering, and sorting
- bulk management
- access to create flow
- access to template management
- opening form detail or editing surfaces

### Create New Form
Triggered from the homepage primary CTA and opens as a modal flow. New forms start as **Draft** and then open directly in the Form Builder.

### Form Detail / View Form
Opened when a user selects a form from the homepage list for summary-first review and operational management.

### Form Builder
Opened when a user chooses to edit a form or after creating a new one. The builder is where structure, logic, styling, submission behavior, sharing, and settings are configured.

---

## Core UX Principles
- The homepage should feel like a **clean operational index**, not a dashboard overloaded with analytics.
- The most common actions must be available immediately: **create, find, filter, edit**.
- Status must be easy to scan across many forms.
- The page should support both **single-form management** and **multi-form administration**.
- List management should be fast for teams with many forms.
- Counts, tags, and status views should help users narrow the list without confusion.
- Primary navigation should separate **active working forms** from **archived forms**.

---

## Page Type
Recommended v1 pattern:
- single homepage list view
- left navigation for saved views and status browsing
- top controls for search, filters, and sorting
- tabbed list context for active scope
- table-based list as the primary content area

This keeps the surface efficient for teams managing many forms.

---

## Entry Points
Users enter the homepage from:
- main app navigation → Web Forms
- back navigation from Form Builder
- back navigation from Form Detail
- direct module shortcut

---

## Global Header
### Left
- Page title: `Web Forms`
- Supporting subtitle: `Create, embed, and manage forms connected to RakanSales`

### Right
- `Manage Templates`
- `+ Create New Web Form`

### Header Action Rules
#### Manage Templates
Opens the template management surface.
Template usage is available to all users, while template management permissions belong to **Admin** and **Lead** roles. The homepage should either:
- show the button only to eligible users, or
- show it with permission-aware handling if broader visibility is preferred.

#### Create New Web Form
Primary CTA for starting a new form.
Clicking this opens the **Create New Web Form** modal, not a full page redirect. Users can start from a blank form or a reusable template.

---

## Page Layout
The homepage uses a **2-column management layout**:

1. **Left Sidebar** — views, status browsing, pinned tags
2. **Main Content Area** — search, filters, list controls, forms table

### Recommended Desktop Layout
- **Left Sidebar:** 260–300px
- **Main Content:** flexible primary workspace

### Responsive Behavior
- On smaller laptop widths, the sidebar can collapse into a filter drawer.
- On tablet, the main list remains primary while views and filters become layered panels.
- Desktop remains the preferred management experience.

---

## Information Architecture
### Left Sidebar
1. Views
2. Browse by status
3. Pinned tags

### Main Content Area
1. Search
2. Applied filters
3. Filter and sort controls
4. Scope tabs
5. Forms table
6. Bulk actions
7. Pagination

---

## Left Sidebar

## Section A — Views
### Purpose
Provide quick access to high-level list scopes.

### Recommended Views
- Active Forms
- Starred
- Archived

### Definitions
#### Active Forms
Default working view containing forms still relevant to daily management, including Draft, Published, and Paused forms.

#### Starred
User-curated list of important forms for quick return.

#### Archived
Forms removed from active working views but still retained for reference or recovery.

### Sidebar Behavior
- each view shows a count
- current view is visually highlighted
- selecting a view updates the main table immediately

---

## Section B — Browse by Status
### Purpose
Let users narrow active forms by lifecycle state.

### Supported Statuses
- Draft
- Published
- Paused

### Behavior
- status filters act within the current main scope
- counts are shown beside each status where useful
- selecting a status applies a list filter, not a separate destination

### Status Model Alignment
These statuses must stay consistent with the Form Builder and Form Detail status model.

---

## Section C — Pinned Tags
### Purpose
Help users quickly access commonly used organizational tags.

### Behavior
- shows pinned tags such as Marketing, Tech, Sales, HR / Admin
- each tag shows a count
- clicking a tag filters the list
- users can pin and unpin frequently used tags
- a lightweight `Pin a tag` action should allow quick setup

### Tag Principles
Tags help with organization, filtering, and later reporting, and should align with the metadata model managed in Settings.

---

## Main Content Area

## Section A — Search
### Purpose
Help users find a form quickly without browsing manually.

### Scope
Search should work against:
- internal form name
- public form title where appropriate
- tags
- owner
- description later if indexed

### Placeholder
`Search by form name, tag, or owner`

### Behavior
- search updates the list after submit or short debounce
- search works with filters and sort
- clearing search restores the current scoped list

---

## Section B — Applied Filters
### Purpose
Make active filters obvious and easy to remove.

### Pattern
Applied filters should appear as removable chips below the search bar.

### Example Filters
- Tag: Marketing
- Date: Last 30 Days
- Owner: Me
- Status: Published

### Required Behaviors
- individual filter chip removal
- `Reset All` action
- count badge on Filter button

---

## Section C — Filter and Sort Controls
### Filter Control
Opens a structured filter panel or dropdown.

### Recommended v1 Filters
- status
- owner
- department
- tag
- updated date range
- created date range later if needed

### Sort Control
Lets users reorder the list.

### Recommended v1 Sort Options
- Last updated
- Form name
- Status
- Most submissions
- Most views
- Highest conversion
- Owner

### Default Sort
`Last updated` descending is the recommended default because it supports active working behavior.

---

## Section D — Scope Tabs
### Purpose
Support a simple toggle between broader and personal working views.

### Recommended Tabs
- All active
- My forms

### Definitions
#### All active
Shows forms in the current active scope based on the selected view and filters.

#### My forms
Shows forms owned by or assigned to the current user within the same scope.

### Behavior
- tabs update only the main list scope
- filters remain applied when switching tabs where sensible
- the active tab should be visually clear

---

## Section E — Forms Table
### Purpose
Provide a dense but readable list for operational management.

### Table Style
A table view is recommended for v1 because users need to compare multiple forms quickly.

### Recommended Columns
1. Selection checkbox
2. Form Name & Last Updated
3. Status
4. Views
5. Starts
6. Submissions
7. Conversion
8. Tags
9. Quick Edit
10. Overflow actions

### Column Definitions
#### Form Name & Last Updated
Shows:
- internal form name or primary display name
- supporting timestamp such as `Updated on Feb 15, 2026`

Clicking the form name or primary row area should open the **Form Detail / View Form** page for that form.

#### Status
Displays lifecycle state pill:
- Draft
- Published
- Paused
- Archived

#### Views
Count of form views where tracking exists.

#### Starts
Count of sessions or visitors who started engaging with the form where trackable.

#### Submissions
Count of completed submissions.

#### Conversion
A simple completion ratio such as submissions divided by starts, when the underlying metrics exist.

#### Tags
Shows primary tags inline with overflow handling for additional tags.

#### Quick Edit
Provides a clear `Edit` action that opens the Form Builder directly.

#### Overflow Actions
Opens row-level operational actions.

---

## Row-Level Actions
### Recommended Overflow Menu
- Overview
- Responses
- Share or embed
- Pause / Resume
- Archive
- Delete

### Action Definitions
#### Overview
Open the Form Detail page.

#### Responses
Open the form’s response or submission list.

#### Share or embed
Open the Share & Embed tab within the Form Builder or the relevant sharing surface. Supported v1 outputs remain standalone link and iFrame embed.

#### Pause / Resume
Status-aware control for forms currently live or paused.

#### Archive
Moves the form out of active working lists.

#### Delete
Destructive action that should require confirmation and align with the broader lifecycle model. Settings defines archive and move-to-trash as protected administrative actions.

---

## Table Behaviors
### Selection
Users can select one or multiple rows through checkboxes.

### Hover State
Hover should reveal row emphasis and quick access to secondary actions.

### Empty Numeric States
Where a metric does not yet exist or is not meaningful, show a neutral placeholder such as `—`.

### Status-Aware Metrics
Draft forms may show incomplete or unavailable performance data until they are published or visited.

### Truncation
Long names and large tag sets should truncate gracefully while preserving access to full values on hover.

---

## Bulk Actions
### Purpose
Support fast administration across multiple forms.

### Trigger
Bulk actions appear when one or more forms are selected.

### Recommended v1 Bulk Actions
- Publish where valid
- Pause / Resume where valid
- Archive
- Delete
- Apply tags
- Remove tags later if needed

### Bulk Action Rules
- actions must be status-aware
- invalid bulk actions should be disabled or hidden
- destructive bulk actions require confirmation
- mixed-status selections should show clear guidance when only some actions are allowed

### Selected Count
Show the number of selected forms clearly, for example:
`2 Selected`

---

## Pagination
### Purpose
Keep the list scalable for larger form libraries.

### Recommended Pattern
Use standard pagination at the bottom of the table.

### Required Behaviors
- page number controls
- current page indicator
- previous/next support
- preserve filters, search, and sort across pages

---

## Interaction Model

## Primary Flow A — Create New Form
1. User clicks `+ Create New Web Form`
2. Create modal opens
3. User selects blank form or template
4. System creates a new **Draft** form
5. User lands in the Form Builder

This must stay aligned with the Create New Form PRD.

---

## Primary Flow B — Review Existing Form
1. User finds a form from the homepage list
2. User clicks the form row or overview action
3. System opens the Form Detail page
4. User reviews status, metrics, sharing readiness, and recent activity

This aligns with the Form Detail page entry model.

---

## Primary Flow C — Edit Existing Form
1. User finds a form
2. User clicks `Edit`
3. System opens the Form Builder
4. User edits Build, Logic, Style, Submit, Share & Embed, or Settings

The homepage should not attempt to recreate builder controls.

---

## Primary Flow D — Manage Multiple Forms
1. User filters the list
2. User selects multiple rows
3. Bulk action bar appears
4. User applies a status-aware action
5. System confirms completion and refreshes list state

---

## State Model
### Supported Listable Statuses
- Draft
- Published
- Paused
- Archived

### Working View Logic
- Active Forms contains Draft, Published, and Paused
- Archived is separated as its own view
- Starred is a user-specific overlay view

### Share Readiness Principles
The homepage does not need to expose full sharing configuration, but it should reflect state clearly enough that users do not mistake Draft or Archived forms as ready for distribution. This aligns with the Share & Embed rules.

---

## Empty States

## Empty State A — No Forms Yet
### When
A new user or workspace has no forms.

### Recommended Content
- heading: `Create your first web form`
- copy: `Start from a blank form or choose a template to collect information in RakanSales.`
- primary action: `+ Create New Web Form`
- secondary action: `Manage Templates` or `Browse templates` if appropriate

This should connect directly to the creation flow.

---

## Empty State B — No Results From Search or Filters
### Recommended Content
- heading: `No forms match your filters`
- copy: `Try removing a filter, changing your search, or switching views.`
- action: `Reset All`

---

## Empty State C — No Starred Forms
### Recommended Content
- heading: `No starred forms yet`
- copy: `Star important forms so they are easier to find later.`

---

## Empty State D — Archived View Empty
### Recommended Content
- heading: `No archived forms`
- copy: `Archived forms will appear here when removed from active workflows.`

---

## Validation and Safeguards
### Hard Prevents
Do not allow:
- destructive delete actions without confirmation
- invalid bulk actions across unsupported statuses
- users without permission to complete restricted template management actions

### Soft Warnings
Warn when:
- archiving published forms
- deleting forms with recent submission activity
- applying bulk actions to mixed-status selections
- attempting to share or treat Draft forms as live from shortcut actions

---

## Permissions
### Form Access
All users can browse and create forms based on the current product direction.

### Template Management
Template management permissions belong to **Admin** and **Lead** users. The homepage should reflect that in the `Manage Templates` action behavior.

### Future Direction
Granular role-based restrictions may be introduced later, but they are not required for the initial module architecture.

---

## Recommended v1 Scope
Included in v1:
- homepage header with create and template actions
- sidebar views
- browse by status
- pinned tags
- search
- filters and sort
- all active / my forms tabs
- forms table with status and lightweight metrics
- row-level actions
- multi-select bulk actions
- pagination
- empty states
- permission-aware template entry

Not included in v1:
- advanced analytics dashboard
- saved custom views
- kanban or card layout switcher
- full audit history from homepage
- form dependency graph
- advanced team workload routing from list view
- inline editing of full form settings directly from the homepage

---

## Success Criteria
The homepage is successful if users can:
- create a new form in one clear action
- find existing forms quickly through search, status, tags, and sort
- understand which forms are draft, published, paused, or archived at a glance
- open the correct next surface for review or editing without confusion
- manage multiple forms efficiently through bulk actions
- access template management from the module entry point
- keep large form libraries organized without needing to enter the builder first

---

## Web Forms Homepage Screen Structure

## Purpose of This Screen Structure
This section defines the exact screen composition for the Web Forms homepage so the PRD is implementation-ready without requiring a separate follow-up artifact.

---

## Screen Structure Principles
- the page should read as a list management surface first, not an analytics dashboard
- the header and top controls should answer the most important user questions immediately: create, find, filter, and act
- the left sidebar should help users narrow scope quickly without leaving the page
- the forms table should optimize for scan speed, row actions, and multi-select management
- bulk actions should feel powerful but status-aware
- the screen should clearly separate review actions from edit actions

---

## Desktop Page Frame
Use a 2-column management layout:
- **Left Sidebar:** 260–300px fixed supporting column
- **Main Content Area:** flexible primary workspace

### Recommended Vertical Order
1. Page Header
2. Search + Filter / Sort row
3. Applied Filters row
4. Scope Tabs + Bulk Action Bar area
5. Forms Table
6. Pagination

### Sticky Behavior
- the page header may remain sticky on scroll
- the search and controls row can remain sticky below the header on large screens
- the bulk action bar should remain visible near the top of the table when rows are selected
- sticky behavior should never obscure row actions, selected state, or confirmation prompts

---

## Header Screen Structure

### Header Row Layout
#### Left Cluster
- page title: `Web Forms`
- supporting subtitle: `Create, embed, and manage forms connected to RakanSales`

#### Right Cluster
- `Manage Templates`
- `+ Create New Web Form`

### Header Action Rules
#### Manage Templates
- secondary action
- visible only to eligible users or shown with permission-aware handling
- opens the template management surface, not a modal

#### Create New Web Form
- primary action
- opens the **Create New Web Form** modal
- supports both `Blank Form` and `Use template` flows
- does not redirect users away from the homepage until a form is actually created

---

## Main Page Structure
The page should visually separate:
1. navigation and saved scopes
2. working controls
3. forms list operations

### Primary Areas
- Left Sidebar
- Main Toolbar Area
- Forms Table Area
- Bulk Action Layer

---

## Left Sidebar Structure

### Sidebar Order
1. Views
2. Browse by status
3. Pinned tags

### Section A — Views
#### Contents
- Active Forms
- Starred
- Archived

#### Rules
- each item shows a count
- the active view is visually highlighted
- changing the view refreshes the main list immediately
- `Active Forms` is the default landing state
- `Archived` should feel clearly separated from active working scope

---

### Section B — Browse by Status
#### Contents
- Draft
- Published
- Paused

#### Rules
- acts as a filter within the selected view
- should show counts where useful
- should not behave like a separate destination
- selecting a status updates the applied filter chips in the main area

---

### Section C — Pinned Tags
#### Contents
Examples:
- Marketing
- Tech
- Sales
- HR & Admin

#### Rules
- each tag shows a count
- clicking a tag filters the main list immediately
- tags support color indicators for easier scanning
- `Pin a tag` appears as a lightweight utility action at the bottom of the section
- pinned tags should stay synchronized with tag filters in the main filter panel

---

## Main Toolbar Area

### Row 1 — Search + Controls
#### Left
- search input with placeholder: `Search by form name, tag, or owner`

#### Right
- `Filters` control with active filter count badge
- `Sort` control

### Search Rules
- search should combine with current view, status filter, tag filter, and ownership scope
- clearing search should preserve current filters and view
- search should support internal form name, public title where indexed, owner, and tags

---

### Row 2 — Applied Filters
#### Contents
- removable filter chips
- `Reset All` action

#### Example Chips
- `Tag: Marketing`
- `Date: Last 30 Days`
- `Owner: Me`
- `Status: Published`

### Rules
- each chip can be removed individually
- `Reset All` clears only active filters, not the current main view
- the filter button count must reflect the number of active filter constraints

---

### Row 3 — Scope Tabs + Selection State
#### Left
- `All active`
- `My forms`

#### Right
- selected count when one or more rows are checked
- bulk action controls appear inline on the same row or directly above the table

### Scope Tab Rules
- tabs only change ownership scope
- filters remain applied when switching tabs
- the active tab should be visually strong and easy to scan

### Selection State Rules
- when no rows are selected, only the scope tabs show
- when rows are selected, selected count appears clearly, for example `2 Selected`
- bulk controls should not replace the tabs entirely; users should still understand their current scope

---

## Forms Table Structure

### Table Header Columns
1. Selection checkbox
2. Form Name & Last Updated
3. Status
4. Views
5. Starts
6. Submissions
7. Conversion
8. Tags
9. Quick Edit
10. Overflow actions

### Column Rules

#### Selection Checkbox
- supports single and multi-select
- selecting one or more rows activates the bulk action bar
- header checkbox supports select all on current page

#### Form Name & Last Updated
- primary line: form display name
- secondary line: supporting text such as `Updated on Feb 15, 2026`
- clicking the name or primary cell opens the **Form Detail / View Form** page

#### Status
- show a clear lifecycle pill: Draft, Published, Paused, Archived
- badge treatment must remain consistent with the rest of the module

#### Views
- numeric metric column
- show `—` when not yet meaningful or unavailable

#### Starts
- numeric metric column
- show `—` when not yet meaningful or unavailable

#### Submissions
- numeric metric column
- show `—` when not yet meaningful or unavailable

#### Conversion
- show a percentage when measurable
- show `—` when draft state or insufficient activity makes the metric invalid

#### Tags
- show one or two primary tags inline
- overflow additional tags behind `+N`
- tags should remain readable without dominating the row

#### Quick Edit
- show a clear `Edit` action
- opens the Form Builder directly

#### Overflow Actions
- opens the row-level operations menu
- should stay aligned to the far right for repeatable scanning

---

## Row-Level Actions Screen Structure

### Recommended Overflow Menu Order
1. Overview
2. Responses
3. Share or embed
4. Pause / Resume
5. Archive
6. Delete

### Row Action Rules by Status

#### Draft
Show:
- Overview
- Responses
- Share or embed
- Archive
- Delete

Behavior notes:
- `Share or embed` remains visible as a shortcut to the relevant surface, but the destination must enforce draft-state warnings
- pause is not relevant for draft

#### Published
Show:
- Overview
- Responses
- Share or embed
- Pause
- Archive
- Delete

#### Paused
Show:
- Overview
- Responses
- Share or embed
- Resume
- Archive
- Delete

#### Archived
Show:
- Overview
- Responses where historical data exists
- Delete

Behavior notes:
- archived forms should reduce emphasis on active-distribution actions
- restore can be introduced later if needed

---

## Bulk Action Bar Structure
Bulk actions appear only when one or more rows are selected.

### Bulk Bar Contents
Recommended v1 actions:
- selected count
- Publish where valid
- Pause / Resume where valid
- Archive
- Delete
- Apply tags
- Clear selection

### Bulk Bar Rules
- actions must be status-aware
- invalid actions should be disabled or hidden
- mixed-status selections should show clear guidance when only part of the selection is eligible
- destructive actions require confirmation with selected count context
- bulk actions should appear visually above the rows they affect, not detached elsewhere on the page

---

## Table Interaction Rules

### Row Click Behavior
- clicking the main row area opens the Form Detail page
- clicking `Edit` opens the Form Builder
- clicking the overflow trigger opens row actions without changing page
- checkbox interaction should not trigger row navigation

### Hover Behavior
- rows gain stronger visual emphasis on hover
- secondary affordances can become more visible on hover
- hover should never be required for core actions on desktop

### Selected Row Behavior
- selected rows show clear checked state
- selected rows may use subtle row highlighting
- selection state must remain visible even while the overflow menu is open

### Truncation Behavior
- long form names truncate with tooltip or hover reveal
- tags collapse gracefully into `+N`
- metric columns remain fixed-width enough for scanning

---

## Pagination Screen Structure

### Bottom Bar Contents
- previous control
- page numbers
- next control
- current page indicator such as `Page 1 of 10`

### Rules
- pagination preserves search, filters, sort, view, and tab scope
- selection should clear on page change unless product later supports cross-page selection

---

## Empty-State Screen Structure

### State A — No Forms Yet
Recommended emphasis:
- large empty-state card in the table area
- heading: `Create your first web form`
- copy: `Start from a blank form or choose a template to collect information in RakanSales.`
- primary action: `+ Create New Web Form`
- secondary action: `Manage Templates` or `Browse templates`

### State B — No Results From Search or Filters
Recommended emphasis:
- inline empty state in the table area
- heading: `No forms match your filters`
- copy: `Try removing a filter, changing your search, or switching views.`
- action: `Reset All`

### State C — No Starred Forms
Recommended emphasis:
- when the user is in the Starred view with no results
- heading: `No starred forms yet`
- copy: `Star important forms so they are easier to find later.`

### State D — Archived View Empty
Recommended emphasis:
- when the user is in Archived view with no results
- heading: `No archived forms`
- copy: `Archived forms will appear here when removed from active workflows.`

---

## Status and Badge Rules

### Supported Homepage Statuses
- Draft
- Published
- Paused
- Archived

### Badge Behavior
- use the same status labels everywhere in sidebar counts, table rows, filters, and confirmations
- Published should be the strongest positive state
- Archived should feel clearly inactive and de-emphasized
- Draft should clearly read as not live
- Paused should clearly communicate that new submissions are unavailable

### Share-Readiness Rule
The homepage should not fully expose sharing configuration, but status treatment must still make it hard to mistake Draft or Archived forms for share-ready live forms.

---

## Confirmation and Warning Structure

### Delete Confirmation Guidance
Message:
`Delete this form? This action should be protected and may affect teams still using this form.`

### Archive Confirmation Guidance
Message:
`Archive this form? It will be removed from active working lists.`

### Mixed Bulk State Guidance
Message pattern:
`Some selected forms cannot use this action because of their current status.`

### Template Permission Guidance
If `Manage Templates` is visible to broader users without access:
- explain that template management is limited to eligible roles
- do not expose a broken destination

---

## Component-Level Content Rules

### Homepage Scope Rule
This page manages finding and operating on forms.
It should not recreate:
- full form detail dashboards
- builder tab controls
- submission inspection drawers from the responses page

### Action Routing Rule
Every major action should route clearly:
- row click or `Overview` → Form Detail / View Form
- `Edit` → Form Builder
- `Responses` → Responses / Submissions page
- `Share or embed` → Share & Embed surface
- `Manage Templates` → Manage Templates page
- `+ Create New Web Form` → Create modal

### Metric Density Rule
Metrics should stay lightweight and tabular.
The homepage should not become a chart-heavy analytics surface in v1.

---

## Responsive Screen Structure

### Laptop / Narrow Desktop
- sidebar may collapse into a filter / views drawer
- table remains primary
- some columns may compress before they are removed
- bulk action bar may wrap to two rows if needed

### Tablet
- sidebar becomes a slide-over panel
- search, filter, and sort remain at the top
- table may reduce visible columns and rely more on row expansion or truncated metadata
- selection and overflow actions must remain easy to tap

### Mobile
- single-column stacked layout
- main controls remain at the top with sticky create action where appropriate
- list may shift from full table to stacked row cards
- row actions move into a bottom sheet or overflow menu
- selected count and bulk actions should remain accessible without crowding the screen

### Responsive Priority Order
When space is constrained, preserve visibility of:
1. page title and create action
2. current view and filters
3. search
4. form name and status
5. primary next actions
6. key tags and secondary metrics

---

## Recommended v1 Scope
Included in v1:
- inline screen structure rules inside this PRD
- header with create and template actions
- left sidebar views and status browsing
- pinned tags
- search, filters, and sort
- all active / my forms tabs
- table with lightweight metrics
- row-level actions
- bulk action bar
- pagination
- empty states
- responsive behavior guidance
- status-aware action rules
