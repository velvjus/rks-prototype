# Manage Templates Page PRD

## Module

Web Forms → **Manage Templates**

## Purpose

The Manage Templates page is the operational home for creating, editing, organizing, publishing, and retiring reusable web form templates in RakanSales. It should help eligible users maintain a clean, trusted template library that supports fast form creation across teams.

This page is not the place to build live forms from scratch. Instead, it is where template managers govern the reusable starting points that appear in the Create New Form flow.

---

## Why This Page Exists

Templates are visible to all users during form creation, but template library management belongs to a smaller set of users. The product needs a dedicated surface where those users can:

* review all templates in one place
* control which templates are published and available for use
* create new templates from existing forms or from scratch
* edit template metadata and structure safely
* archive or unpublish outdated templates
* keep the library curated, searchable, and trustworthy

Without this page, template governance would be fragmented across the homepage, the create modal, and the form editor.

---

## Product Goals

Users with template permissions should be able to:

* browse all templates in one management surface
* search templates by name, description, tag, owner, or department
* filter templates by publish state, category, and department
* create a new template intentionally
* open a template for editing in the Form Builder
* publish or unpublish templates safely
* duplicate templates for reuse
* archive or move templates out of active circulation
* understand where a template fits in the library at a glance
* maintain a curated set of templates for all users

All users should continue to:

* use templates in the Create New Form flow
* preview templates before choosing them
* create independent draft forms from templates

---

## Relationship to Other Web Forms Surfaces

### Homepage

Used for:

* browsing forms
* creating forms
* opening template management

The homepage should treat `Manage Templates` as a gateway action, not recreate template governance inline.

### Create New Form

Used for:

* browsing available published templates
* previewing templates before use
* creating a new draft form from a template

The Create New Form modal is for **using** templates, not managing the full template library.

### Form Builder

Used for:

* editing template structure, logic, style, submit behavior, share behavior, and settings
* saving a form as a template
* editing an existing template when opened in template mode

### Manage Templates

Used for:

* viewing the template library
* controlling publish state
* organizing template metadata
* launching template edit flows
* handling lifecycle actions for templates

---

## Core UX Principles

* The page should feel like a **governed library**, not a second forms homepage.
* Published templates should be easy to identify because they affect what all users can start from.
* Draft, unpublished, and archived templates must never be confused with live, available templates.
* Metadata quality matters because search, filtering, and browsing depend on it.
* Destructive or library-affecting actions must be permission-aware and protected.
* The page should support both curated browsing and efficient admin-level bulk management.
* Template management should stay simple in v1 and avoid turning into a full content operations suite.

---

## Permissions Model

### Template Usage

All users can:

* browse published templates in Create New Form
* preview a template before using it
* create a new draft form from a template

### Template Management

Only **Admin** and **Lead** users can:

* create templates
* edit templates
* publish templates
* unpublish templates
* duplicate templates
* archive templates
* manage template library metadata

### Permission-Aware Entry

If broader users can see the `Manage Templates` entry point, the system should intercept with clear permission messaging instead of exposing broken or confusing controls.

---

## Template State Model

The template library uses its own management states.

### Recommended v1 States

* Draft
* Published
* Unpublished
* Archived

### State Definitions

#### Draft

A newly created or in-progress template not yet ready for library use.

#### Published

Visible in the Create New Form flow for all users.

#### Unpublished

Retained in the library but hidden from general template selection.
Useful when a template should be removed from circulation without being deleted.

#### Archived

Inactive and removed from normal working views.
Not intended for active use or browsing in the creation flow.

### State Rules

* Only **Published** templates appear in the Create New Form library.
* Draft and Unpublished templates are manageable internally but not exposed for general use.
* Archived templates are separated from active management views.

---

## Page Type

Recommended v1 pattern:

* single management page
* summary-first list experience
* filterable table as primary surface
* optional preview side panel or detail drawer
* bulk actions for admins and leads

This keeps the page fast and scalable for template governance.

---

## Entry Points

Users enter the page from:

* Web Forms homepage → `Manage Templates`
* success flow after saving a form as a template
* template-related shortcuts later from template detail or builder contexts

---

## Global Header

### Left

* Back to Web Forms
* Page title: `Manage Templates`
* Subtitle: `Create, organize, and publish reusable web form templates`

### Right

* `+ New Template`
* optional overflow menu later for library settings

### Header Action Rules

#### New Template

Starts intentional template creation.
Recommended v1 behavior:

* opens a lightweight creation choice modal or dropdown
* supports `Blank Template` and `Create from Existing Form`

Alternative acceptable v1 behavior:

* create blank template directly, then open builder

---

## Page Layout

The page uses a **2-column management layout**:

1. **Left Sidebar** — views and taxonomy shortcuts
2. **Main Content Area** — search, filters, list/table, bulk actions, preview affordances

### Recommended Desktop Layout

* **Left Sidebar:** 260–300px
* **Main Content:** flexible primary workspace

### Responsive Behavior

* On smaller laptop widths, the sidebar can collapse into a filter drawer.
* On tablet, the list remains primary while filters and preview become layered panels.
* On mobile, the page becomes a stacked list with sticky primary actions.
* Desktop remains the primary template management experience.

---

## Information Architecture

### Left Sidebar

1. Views
2. Browse by state
3. Browse by category / department
4. Pinned tags later if needed

### Main Content Area

1. Search
2. Applied filters
3. Filter and sort controls
4. Scope tabs
5. Templates table
6. Bulk actions
7. Pagination

---

## Left Sidebar

## Section A — Views

### Purpose

Provide quick access to the main library scopes.

### Recommended Views

* Active Templates
* Drafts
* Archived

### Definitions

#### Active Templates

Contains Draft, Published, and Unpublished templates that are still part of current library management.

#### Drafts

Dedicated shortcut for templates still being prepared.

#### Archived

Templates removed from active circulation but retained for reference or possible recovery.

---

## Section B — Browse by State

### Purpose

Let users narrow templates by availability and management state.

### Supported States

* Published
* Draft
* Unpublished

### Behavior

* state filters act within the current main view
* counts are shown where useful
* selecting a state updates the main table immediately

---

## Section C — Browse by Category / Department

### Purpose

Help managers keep the library organized around the same classification model used in template creation.

### Recommended Launch Categories

* All templates
* General
* Marketing
* Sales
* Support
* HR / Admin

### Behavior

* category can be shown as filter chips in the main content and as a sidebar shortcut if space allows
* department remains a classification model, not an access restriction

---

## Main Content Area

## Section A — Search

### Purpose

Help managers find a template quickly.

### Search Scope

Search should work against:

* template name
* description
* tags
* category
* department
* owner

### Placeholder

`Search templates by name, tag, owner, or category`

### Behavior

* search works with filters and sort
* clearing search restores the current scoped library view
* search should be fast because the library is meant to feel curated

---

## Section B — Applied Filters

### Purpose

Make current constraints obvious and easy to clear.

### Pattern

Show removable chips below search.

### Example Filters

* State: Published
* Category: Marketing
* Owner: Me
* Department: Sales

### Required Behaviors

* remove one filter at a time
* `Reset All` action
* filter count badge

---

## Section C — Filter and Sort Controls

### Recommended v1 Filters

* state
* category
* department
* owner
* tags
* last updated date
* created date later if needed

### Recommended v1 Sort Options

* Last updated
* Template name
* State
* Most used later if available
* Owner
* Category

### Default Sort

`Last updated` descending

---

## Section D — Scope Tabs

### Purpose

Support a simple working toggle.

### Recommended Tabs

* All templates
* My templates

### Definitions

#### All templates

Shows all templates in the current filtered scope.

#### My templates

Shows templates created by or owned by the current user within the same filtered scope.

---

## Section E — Templates Table

### Purpose

Provide a dense, manageable list for template governance.

### Table Style

A table view is recommended for v1 because template managers need to compare many entries quickly.

### Recommended Columns

1. Selection checkbox
2. Template Name & Last Updated
3. State
4. Category
5. Department
6. Used In Create Flow
7. Tags
8. Owner
9. Quick Edit
10. Overflow actions

### Column Definitions

#### Template Name & Last Updated

Shows:

* template display name
* supporting timestamp such as `Updated on Apr 22, 2026`
* optional short description on hover or secondary line

Clicking the name should open either:

* a template detail drawer/page later, or
* the template editor directly in v1

#### State

Displays the template lifecycle pill:

* Draft
* Published
* Unpublished
* Archived

#### Category

Shows the launch category used in the creation flow.

#### Department

Shows the classification label for library organization.

#### Used In Create Flow

Simple availability indicator:

* `Visible` for Published
* `Hidden` for Draft / Unpublished / Archived

This helps managers understand downstream impact immediately.

#### Tags

Shows primary tags inline with overflow handling.

#### Owner

Shows the accountable template manager.

#### Quick Edit

Provides a clear `Edit` action that opens the Form Builder in template-editing mode.

#### Overflow Actions

Opens row-level operational actions.

---

## Row-Level Actions

### Recommended Overflow Menu

* Edit template
* Preview template
* Publish
* Unpublish
* Duplicate
* Archive
* Delete or Move to Trash

### Action Definitions

#### Edit template

Open the Form Builder with the template loaded for editing.

#### Preview template

Open a non-interactive preview of the template as it will appear in template selection or builder preview.

#### Publish

Makes the template available to all users in Create New Form.

#### Unpublish

Removes the template from Create New Form while preserving it for management.

#### Duplicate

Creates an independent draft copy of the template.

#### Archive

Moves the template out of active library views.

#### Delete / Move to Trash

Destructive action requiring confirmation.
If product-wide lifecycle conventions prefer trash over direct delete, use trash language consistently.

---

## Bulk Actions

### Purpose

Support efficient library governance.

### Trigger

Bulk actions appear when one or more templates are selected.

### Recommended v1 Bulk Actions

* Publish where valid
* Unpublish where valid
* Archive
* Apply tags
* Change category later if needed
* Delete / Move to Trash

### Bulk Action Rules

* actions must be state-aware
* invalid actions should be disabled or hidden
* destructive actions require confirmation
* mixed-state selections should show clear guidance when only some actions are eligible

---

## Template Preview Pattern

### Purpose

Help managers validate a template without entering full edit mode.

### Recommended v1 Behavior

Use a right-side preview drawer or modal showing:

* template name
* description
* category
* tags
* form title
* intro text
* visible fields
* submit button
* general layout structure
* state badge

### Preview Constraints

The preview is **non-interactive**.
It should not support typing, validation, or submission.

This keeps the template management experience aligned with the preview model already used in Create New Form.

---

## Template Creation Flows

## Flow A — Create Blank Template

1. User clicks `+ New Template`
2. User selects `Blank Template`
3. System creates a template in Draft state
4. System opens the Form Builder in template mode
5. User configures content and metadata
6. User publishes when ready

## Flow B — Create Template from Existing Form

1. User clicks `+ New Template`
2. User selects `Create from Existing Form`
3. User searches and selects a source form
4. System creates an independent template copy in Draft state
5. System opens the template in the Form Builder
6. User reviews metadata and publishes when ready

## Flow C — Save as Template from Form Builder

1. User clicks `Save as Template` from form Settings
2. System collects template metadata
3. System creates a separate template artifact
4. User can continue editing or open Manage Templates

---

## Template Metadata Model

### Required Metadata

* template name
* description
* category
* department classification
* state

### Recommended Metadata

* tags
* owner
* created by
* last updated by
* template origin

### Optional Later Metadata

* usage count
* last used date
* recommended flag
* featured flag

---

## Editing Model

### Recommended v1 Rule

Templates should open in the same Form Builder foundation as forms, but with template context.

### Template Editing Behavior

Users can edit:

* Build
* Logic
* Style
* Submit
* Settings relevant to templates

### Share Behavior

Template editing should not expose template sharing as if it were a live form destination.
If the builder is reused, the product should either:

* hide Share & Embed for templates, or
* replace it with a non-live preview-oriented state

### Lifecycle Reminder

Changes to a template affect future forms created from it, not forms already created earlier.

---

## Validation and Safeguards

### Hard Prevents

Do not allow:

* publishing a template without required metadata
* destructive delete/trash without confirmation
* unauthorized users to complete template management actions

### Soft Warnings

Warn when:

* publishing a template with weak description or missing tags
* unpublishing a heavily used template later if usage data exists
* archiving a published template
* editing a published template that many users rely on

### Recommended Publish Guidance

`Publishing makes this template available to all users in Create New Form.`

### Recommended Unpublish Guidance

`Unpublishing removes this template from future form creation, but does not affect forms already created from it.`

---

## Empty States

## Empty State A — No Templates Yet

### When

The workspace has no templates in the library.

### Recommended Content

* heading: `Create your first template`
* copy: `Build reusable web form starters your team can use again and again.`
* primary action: `+ New Template`
* secondary action: `Create from existing form`

## Empty State B — No Results From Search or Filters

### Recommended Content

* heading: `No templates match your filters`
* copy: `Try removing a filter, changing your search, or switching views.`
* action: `Reset All`

## Empty State C — No Draft Templates

### Recommended Content

* heading: `No draft templates`
* copy: `Draft templates will appear here while they are being prepared.`

## Empty State D — Archived Empty

### Recommended Content

* heading: `No archived templates`
* copy: `Archived templates will appear here when removed from active library use.`

---

## Right-Side Context Panel or Secondary Guidance

A lightweight secondary panel can help managers understand impact.

### Recommended Contents

* selected template state
* visibility in Create New Form
* owner
* category
* department
* last updated info
* template origin
* guidance note about library impact

### Example Notes

* `Published templates are visible to all users during form creation.`
* `Unpublished templates stay in the library but are hidden from template selection.`
* `Forms already created from a template remain independent.`

---

## Recommended v1 Scope

Included in v1:

* manage templates entry from homepage
* permission-aware access
* template list/table
* search
* filter and sort
* draft / published / unpublished / archived states
* blank template creation
* create from existing form
* open template in builder
* publish / unpublish
* duplicate
* archive
* non-interactive preview
* bulk actions
* pagination
* empty states

Not included in v1:

* template analytics dashboard
* version history
* approval workflows
* comments or collaboration threads
* popularity ranking by usage unless already tracked reliably
* featured / recommended governance rules
* custom role configuration for template governance

---

## Success Criteria

The Manage Templates page is successful if users can:

* keep the template library organized and trustworthy
* publish templates confidently for all users
* remove outdated templates from circulation without confusion
* find and edit templates quickly
* create new templates from blank or existing forms efficiently
* understand the difference between template management and template usage
* preserve the rule that forms created from templates remain independent

---

## Manage Templates Page Screen Structure

## Purpose of This Screen Structure

This section defines the exact screen composition for the Manage Templates page so the PRD is implementation-ready without requiring a separate follow-up artifact.

---

## Screen Structure Principles

* the page should read as a governed template library, not a second homepage
* the header and top controls should answer the most important management questions first
* state and create-flow visibility must be obvious at a glance
* the main list should optimize for fast scanning and bulk management
* the preview surface should help validate templates without forcing users into edit mode
* every surface should route clearly to the correct deeper action: create, edit, preview, publish, unpublish, archive

---

## Desktop Page Frame

Use a 2-column management layout:

* **Left Sidebar:** 260–300px fixed supporting column
* **Main Content Area:** flexible primary workspace

### Recommended Vertical Order

1. Page Header
2. Search + Applied Filters + Filter/Sort Row
3. Scope Tabs
4. Templates Table
5. Bulk Action Bar when rows are selected
6. Pagination
7. Optional right-side preview drawer layered above the page when triggered

### Sticky Behavior

* the page header can remain sticky on scroll
* the search and control row can remain sticky below the header on large screens
* the bulk action bar should pin near the top of the table when active
* sticky behavior should never hide state warnings or destructive action context

---

## Header Screen Structure

### Header Row Layout

#### Left Cluster

* Back to Web Forms
* page title: `Manage Templates`
* supporting subtitle: `Create, organize, and publish reusable web form templates`

#### Right Cluster

* `+ New Template`
* optional overflow menu for future library-level settings

### Header Action Rules

#### New Template

Primary action opens a lightweight create menu or modal.

Recommended options:

* `Blank Template`
* `Create from Existing Form`

Behavior notes:

* both paths create a template in **Draft** state first
* both paths should route to the Form Builder in template mode after creation
* users without permission should not be allowed to complete this flow

---

## Main Page Structure

The page should visually separate **navigation**, **working controls**, and **table operations**.

### Primary Areas

1. Left Sidebar
2. Main Toolbar Area
3. Templates Table Area
4. Preview Drawer / Modal

---

## Left Sidebar Structure

The left sidebar should stay lightweight and browsing-focused.

### Sidebar Order

1. Views
2. Browse by State
3. Browse by Category / Department

### Section A — Views

#### Contents

* Active Templates
* Drafts
* Archived

#### Rules

* each view shows a count
* the current view is visually highlighted
* changing views updates the main table immediately
* `Active Templates` contains Draft, Published, and Unpublished templates

### Section B — Browse by State

#### Contents

* Published
* Draft
* Unpublished

#### Rules

* acts as a filter within the selected view
* should show counts where available
* should not conflict with Archived view logic
* selecting a state updates the applied filter chips in the main area

### Section C — Browse by Category / Department

#### Contents

* All templates
* General
* Marketing
* Sales
* Support
* HR / Admin

#### Rules

* category selection updates the main list immediately
* department remains an organizational label, not an access restriction
* if both category chips and sidebar shortcuts exist, they must stay synchronized

---

## Main Toolbar Area

This area sits above the templates table and controls the current working scope.

### Row 1 — Search

#### Left

* search input with placeholder: `Search templates by name, tag, owner, or category`

#### Right

* Filter control
* Sort control

### Search Rules

* search should work against template name, description, tags, category, department, and owner
* search should combine cleanly with current view, state, and category filters
* clearing search should preserve the current view and non-search filters

### Row 2 — Applied Filters

#### Contents

* removable filter chips
* `Reset All` action
* optional filter count badge

#### Example Chips

* State: Published
* Category: Marketing
* Owner: Me
* Department: Sales

### Row 3 — Scope Tabs

#### Tabs

* All templates
* My templates

#### Rules

* tabs only change the ownership scope of the list
* filters remain applied when switching tabs
* the active tab must be visually strong and easy to scan

---

## Templates Table Structure

The table is the primary management surface and should optimize for density and clarity.

### Table Header Columns

1. Selection checkbox
2. Template Name & Last Updated
3. State
4. Category
5. Department
6. Used In Create Flow
7. Tags
8. Owner
9. Quick Edit
10. Overflow actions

### Column Rules

#### Selection Checkbox

* supports single and multi-select
* selecting one or more rows reveals the bulk action bar

#### Template Name & Last Updated

* primary line: template display name
* secondary line: supporting metadata such as last updated date
* optional short description can appear as secondary text or hover detail
* clicking the template name should open the template editor directly in v1

#### State

* use a clear lifecycle pill: Draft, Published, Unpublished, Archived
* badge treatment must be visually distinct enough for fast scanning

#### Category

* show the template’s launch category used in Create New Form

#### Department

* show the template’s organizational classification label

#### Used In Create Flow

* show `Visible` for Published
* show `Hidden` for Draft, Unpublished, and Archived
* this column should make downstream availability obvious without opening the row

#### Tags

* show primary tags inline
* overflow additional tags behind `+N` or hover disclosure

#### Owner

* show the accountable template manager

#### Quick Edit

* show a clear `Edit` action
* clicking should open the Form Builder in template mode

#### Overflow Actions

* opens the full row-level action menu

---

## Row-Level Actions Screen Structure

Each row should expose an overflow menu with state-aware actions.

### Recommended Menu Order

1. Edit template
2. Preview template
3. Publish or Unpublish
4. Duplicate
5. Archive
6. Delete / Move to Trash

### Row Action Rules by State

#### Draft

Show:

* Edit template
* Preview template
* Publish
* Duplicate
* Archive
* Delete / Move to Trash

#### Published

Show:

* Edit template
* Preview template
* Unpublish
* Duplicate
* Archive
* Delete / Move to Trash

#### Unpublished

Show:

* Edit template
* Preview template
* Publish
* Duplicate
* Archive
* Delete / Move to Trash

#### Archived

Show:

* Preview template
* Duplicate
* Delete / Move to Trash

Behavior notes:

* archived templates should not appear as normal active working items
* restore can be introduced later if product direction adds it
* destructive actions must require confirmation

---

## Bulk Action Bar Structure

The bulk action bar appears only when one or more templates are selected.

### Bulk Bar Contents

* selected count, for example `3 Selected`
* Publish where valid
* Unpublish where valid
* Archive
* Apply tags
* Delete / Move to Trash
* Clear selection

### Bulk Action Rules

* actions must be state-aware
* invalid actions should be disabled or hidden
* mixed-state selections should show clear guidance when not all selected rows are eligible
* destructive actions require confirmation with selected count context

---

## Preview Drawer Structure

Preview should open as a right-side drawer on desktop and as a modal or full-screen layer on smaller screens.

### Drawer Header

* template name
* state badge
* close action
* optional `Edit template` action

### Drawer Body Order

1. Template Summary
2. Form Preview Snapshot
3. Library Impact Notes

### Section 1 — Template Summary

Show:

* description
* category
* department
* tags
* owner
* last updated info
* template origin where applicable

### Section 2 — Form Preview Snapshot

Show a non-interactive preview of:

* form title
* intro text
* key visible fields
* submit button
* general layout structure

### Section 3 — Library Impact Notes

Show short context notes such as:

* `Published templates are visible to all users in Create New Form.`
* `Unpublished templates remain manageable but hidden from template selection.`
* `Forms already created from this template remain independent.`

### Preview Rules

* the preview must not allow typing, validation, or submission
* the preview should feel aligned with the Create New Form preview model
* preview should not expose live share/embed behavior because templates are not live forms

---

## Empty-State Screen Structure

### State A — No Templates Yet

Recommended emphasis:

* large empty-state card in the table area
* heading: `Create your first template`
* copy: `Build reusable web form starters your team can use again and again.`
* primary action: `+ New Template`
* secondary action: `Create from existing form`

### State B — No Results From Search or Filters

Recommended emphasis:

* inline empty state in the table area
* heading: `No templates match your filters`
* copy: `Try removing a filter, changing your search, or switching views.`
* action: `Reset All`

### State C — No Draft Templates

Recommended emphasis:

* when inside Drafts view with no results
* heading: `No draft templates`
* copy: `Draft templates will appear here while they are being prepared.`

### State D — Archived Empty

Recommended emphasis:

* when inside Archived view with no results
* heading: `No archived templates`
* copy: `Archived templates will appear here when removed from active library use.`

---

## Status and Badge Rules

State must remain unambiguous across the page.

### Badge Set

* Draft
* Published
* Unpublished
* Archived

### Badge Behavior

* use the same labels everywhere in sidebar counts, table rows, preview drawer, and confirmations
* Published should be the strongest positive state because it affects all users in Create New Form
* Archived should feel clearly inactive and visually de-emphasized

### Create-Flow Visibility Rule

Every template should make its Create New Form availability obvious through either:

* the `Used In Create Flow` column, or
* a matching visibility label in the preview drawer

---

## Confirmation and Warning Structure

The page needs lightweight but clear safeguards for high-impact actions.

### Publish Confirmation Guidance

Message:
`Publishing makes this template available to all users in Create New Form.`

### Unpublish Confirmation Guidance

Message:
`Unpublishing removes this template from future form creation, but does not affect forms already created from it.`

### Archive Confirmation Guidance

Message:
`Archive this template? It will be removed from active library views and hidden from normal management workflows.`

### Delete / Trash Confirmation Guidance

Message:
`Remove this template? This action is intended for templates that should no longer remain in the library.`

---

## Template Creation Entry Structure

The `+ New Template` action should open a lightweight choice surface.

### Recommended Create Menu / Modal Layout

#### Header

* title: `Create New Template`
* subtitle: `Start from a blank template or generate one from an existing form.`

#### Body Options

* `Blank Template`
* `Create from Existing Form`

#### Rules

* selecting `Blank Template` creates a Draft template and opens the builder in template mode
* selecting `Create from Existing Form` opens a searchable form picker first, then creates a Draft template copy
* the source form and resulting template must remain independent after creation

---

## Component-Level Content Rules

### Governance-First Rule

This page manages reusable templates, not live form records.
It should not recreate homepage form metrics, response analytics, or full builder editing controls.

### Action Routing Rule

Every high-level action should route clearly:

* create template → template-mode builder
* edit template → template-mode builder
* preview template → preview drawer or modal
* publish/unpublish/archive/delete → confirmation flow
* save as template from builder → returns here or surfaces this page as the library home

### Template Independence Rule

The page should reinforce that:

* templates are starting points
* new forms created from templates become independent
* edits to a template affect future use, not previously created forms

### Share Behavior Rule

Templates must not be presented as live share targets.
Any reused builder surface should hide or replace Share & Embed behavior in template mode.

---

## Responsive Screen Structure

### Laptop / Narrow Desktop

* sidebar may collapse into a filter drawer
* table remains primary
* preview drawer may narrow but remain usable
* bulk action bar can wrap onto two rows if needed

### Tablet

* sidebar becomes a slide-over filter/navigation panel
* table columns may reduce, with some metadata moving into row expansion
* preview opens as a full-height slide-over or full-screen panel
* sticky controls should prioritize search, filters, and selected-count actions

### Mobile

* single-column stacked layout
* primary actions remain accessible at the top
* table becomes stacked list rows/cards
* row actions move into a bottom sheet or overflow menu
* preview becomes a full-screen view

### Responsive Priority Order

When space is constrained, preserve visibility of:

1. page title and primary create action
2. current view and state filters
3. search
4. state badge and template name
5. quick edit / row actions
6. create-flow visibility
7. tags and secondary metadata

---

## Recommended v1 Scope

Included in v1:

* inline screen structure rules inside this PRD
* header with `+ New Template`
* left sidebar views and state browsing
* search, filters, and sort
* all templates / my templates tabs
* table with state and create-flow visibility
* row-level actions
* bulk action bar
* preview drawer
* creation choice modal or menu
* empty states
* responsive behavior guidance
* template-mode routing rules

Not included in v1:

* advanced analytics for template performance
* restore-from-archive workflow unless later added
* approval workflow UI
* version history UI
* collaboration comments
* featured/recommended governance system

---

## Success Criteria

The Manage Templates page screen structure is successful if users can:

* understand the current template library state at a glance
* identify which templates are visible in Create New Form
* find and edit templates quickly
* perform publish, unpublish, archive, and duplicate actions safely
* preview templates without leaving the page unnecessarily
* create new templates from blank or existing forms without confusion
* manage the library efficiently across desktop and responsive layouts
