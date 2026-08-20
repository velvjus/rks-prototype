# Form Builder Architecture PRD

## Module
Web Forms → Form Editor / Form Builder

## Purpose
The Form Builder is the core workspace where users create, edit, style, configure, and publish web forms in RakanSales. It must support both simple forms and advanced multi-step workflows while remaining clear, fast, and scalable.

## Goals
Users should be able to:
- build forms visually using drag-and-drop
- manage structure through an outline view
- edit field and section settings in context
- create multi-step forms
- apply simple conditional logic
- style forms without code
- define submission outcomes into RakanSales
- publish, pause, archive, and update forms safely
- preview the form before sharing

## Product Principles
- The editor should feel like a builder, not a long settings page.
- Structure, logic, style, and submission behavior must be clearly separated.
- Drag-and-drop and structured editing must stay in sync.
- Default layout should stay simple: single-column first, optional 2-column rows.
- Published forms must warn users when edits will affect live visitors.
- The editor must scale from beginner use to advanced workflows.

## Entry Into Editor
Users enter the Form Builder after:
- creating a blank form
- creating a form from a template
- opening an existing form from the Web Forms homepage

All new forms enter the builder as **Draft** by default.

---

## Global Page Architecture

### Top Bar
The editor uses a persistent top bar with:

**Left**
- Back to Web Forms
- Form name
- Status pill
- Autosave state

**Right**
- Preview
- Save
- Publish / Update
- More menu

### Statuses
Supported statuses:
- Draft
- Published
- Paused
- Archived

### Status Rules
- **Draft**: editable, not live
- **Published**: live, editable with warning
- **Paused**: unavailable to new submissions
- **Archived**: removed from active workflow

### Published Warning
When editing a published form, show a persistent warning banner:

`You are editing a live form. Changes will update immediately for visitors.`

---

## Main Tabs

The Form Builder uses 6 top-level tabs:

1. **Build**
2. **Logic**
3. **Style**
4. **Submit**
5. **Share & Embed**
6. **Settings**

### Why this structure
- **Build** handles form structure and content
- **Logic** handles conditional behavior
- **Style** handles visual customization
- **Submit** handles success behavior and CRM outcomes
- **Share & Embed** handles publishing outputs
- **Settings** handles metadata and administrative actions

This separation prevents the editor from becoming overloaded and unclear.

---

## Build Tab

### Purpose
The Build tab is the primary workspace for constructing the form layout and content.

### Core Layout
The Build tab uses a 3-panel layout:

#### Left Panel
Used for:
- field library (searchable)
- outline/structure
- quick insertion

#### Center Canvas
Used for:
- live form layout
- drag-and-drop editing
- inline editing
- step and section organization

#### Right Panel
Used for:
- selected object properties
- field settings
- section settings
- step settings

### Supported Building Objects
- Form
- Step
- Section
- Field
- Static Content Block

### Static Content Blocks
- Heading
- Paragraph
- Divider
- Image

### Launch Field Types

#### Basic
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

#### Business
- Company
- Website
- Address
- Country
- File Upload
- Consent Checkbox
- Hidden Field

### Layout Rules
- Default layout is single-column
- Optional 2-column rows are supported
- Freeform grid layout is not supported in v1

### Editing Model
Users can:
- drag fields into the canvas
- click to insert fields
- access quick contextual controls (Move Up, Move Down, Delete) directly via element hover in the canvas
- scroll seamlessly across large forms without UI viewport scaling breakdown

### Search Functionality
The field library includes a persistent search bar to improve block discovery:
- **Real-time Filtering**: The library filters blocks as the user types.
- **Label & Type Matching**: Search matches against both the display label (e.g., "Short Text") and the underlying type (e.g., "text").
- **Dynamic Headers**: Category headers (e.g., "Basic Fields") hide automatically if no blocks within that category match the search term.
- **Empty State**: Displays a "No matching blocks" message with a clear action to reset the search when no results are found.

### Sync Requirement
The **Fields** and **Outline** modes must stay synchronized with the live canvas.

---

## Logic Tab

### Purpose
The Logic tab handles simple conditional behavior in v1.

### v1 Supported Logic
- Show field when condition matches
- Hide field when condition matches
- Show step when condition matches
- Make field required when condition matches

### Rule Builder Pattern
Logic is configured using a simple rule format:

- When
- Condition
- Then

### Example
- When `Inquiry Type` is `Support`
- Then `Show` field `Priority`

### v1 Constraint
Logic should remain simple in v1:
- no nested condition groups
- no advanced AND/OR trees
- no complex routing builders

---

## Style Tab

### Purpose
The Style tab allows users to visually brand and customize the form without code.

### Styling Levels
The tab should support 2 modes:
- Quick Style
- Advanced Style

### Quick Style
- theme preset
- primary color
- font
- border radius
- button style

### Advanced Style
- typography
- input styles
- button styles
- spacing
- section spacing
- form container
- background
- success state styling

### Constraint
No custom CSS support in v1.

---

## Submit Tab

### Purpose
The Submit tab defines both:
- what the visitor sees after submission
- what the system creates inside RakanSales

### Section A — Success Experience
- thank-you message
- redirect to URL
- redirect delay
- success CTA button

### Section B — Submission Outcomes
Supported outcomes:
- Contact
- Lead
- Company
- Conversation
- Support Ticket
- Deal
- Custom Object

### Section C — Duplicate Handling
Supported options:
- Always create new
- Create new and flag duplicate
- Link to existing contact and keep new submission
- Admin-defined rule

Recommended default:
- **Create new and flag duplicate**

### Section D — Ownership and Tags
- assign owner
- assign team
- apply contact tags
- apply lead tags
- apply conversation tags

### Section E — Field Mapping
- map form field to CRM field
- save hidden metadata
- overwrite vs append rules

---

## Share & Embed Tab

### Purpose
The Share & Embed tab gives users the publish outputs for the form.

### v1 Supported Outputs
- standalone link
- iFrame embed

### Required Elements
- share link section
- embed code section
- preview section
- copy actions

### Draft Rule
If the form is still Draft, show a clear warning:

`This form is still in draft. Publish it before sharing.`

---

## Settings Tab

### Purpose
The Settings tab contains form metadata and administrative actions.

### Settings Content
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

## Preview

### Purpose
Preview lets users inspect the form before publishing or sharing.

### Preview Requirements
- desktop view
- mobile view
- current step preview
- success state preview

### Preview Behavior
- updates live as changes are made
- can be opened from the top bar
- should accurately reflect layout and style changes

---

## File Upload Requirements

### v1 Support
File uploads are supported on day one.

### Required Settings
- allowed file types
- maximum file size
- maximum number of files
- required / optional
- help text

---

## Save Progress Later

### Definition
Save progress later means a respondent can partially complete a form and resume later.

### Product Direction
The architecture should allow for this in the future, but it is not required in the first release unless prioritized later.

### Future Considerations
- partial response storage
- resume logic
- identity strategy
- expiry rules
- consent/privacy handling

---

## Permissions
- all users can create forms
- all users can edit and publish forms for now
- future role-based restrictions will apply later
- template management permissions remain separate

---

## Success Criteria
The Form Builder is successful if users can:
- build a form without confusion
- understand structure and hierarchy clearly
- configure basic logic without needing support
- style the form without code
- define CRM submission outcomes accurately
- preview and publish safely
- confidently edit existing live forms with clear warnings

---

## Out of Scope for v1
- custom CSS
- advanced logic groups
- complex scoring workflows
- popup or script embeds
- freeform grid layouts
- full save-progress-later implementation