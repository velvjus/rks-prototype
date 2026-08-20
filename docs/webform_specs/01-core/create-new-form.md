# Create New Form PRD

## Module
Web Forms → Create New Form

## Purpose
The Create New Form flow allows users to quickly start a new web form in RakanSales using either a blank starter or a reusable template. This flow is intended to reduce setup friction, encourage consistency through templates, and transition users directly into the Form Editor with a draft form ready for editing.

---

## Goals
Users should be able to:
- start a new form from a blank starter
- start a new form from a reusable template
- search and browse templates easily
- preview templates before choosing
- filter templates by department/category
- enter the Form Editor immediately after selection
- begin with the form saved as a draft

---

## Entry Point
Triggered from the homepage button:

**Primary CTA:** `+ Create New Web Form`

---

## Entry Pattern
Clicking the CTA opens a **modal**.

### Why modal
- keeps users anchored to the homepage
- makes creation feel lightweight and fast
- allows template selection without leaving context
- deeper configuration happens only after the starting point is chosen

---

## Primary User Flows

### Flow A — Start from Blank
1. User clicks `+ Create New Web Form`
2. Modal opens
3. User selects `Blank Form`
4. User clicks `Create blank form`
5. System creates a new draft form with a minimal starter structure
6. User is redirected into the Form Editor

### Flow B — Start from Template
1. User clicks `+ Create New Web Form`
2. Modal opens
3. User searches or filters templates
4. User selects a template
5. Preview panel updates with the selected template
6. User clicks `Use template`
7. System creates a new draft form from the template
8. User is redirected into the Form Editor

---

## Modal Information Architecture

### Header
**Title:** `Create New Web Form`  
**Subtitle:** `Start from a blank form or choose a template.`

### Main Layout
Use a large 2-column modal.

#### Left Column
Template browser:
- search input
- category filters
- template cards
- blank form card pinned first

#### Right Column
Preview panel:
- selected template preview
- full visual preview of the form layout
- non-interactive display only

---

## Search

### Purpose
Help users quickly find a template by name, purpose, or category.

### Scope
Search should work against:
- template name
- description
- tags
- category/department

### Placeholder
`Search templates`

---

## Category Filters

### Purpose
Help users browse templates by functional use case or department.

### Launch Categories
- All templates
- General
- Marketing
- Sales
- Support
- HR / Admin

### UX Recommendation
Use horizontal filter chips or tabs instead of a dropdown for faster browsing.

---

## Blank Form Option

### Requirement
Blank Form must always be visible as the first and clearest option.

### Purpose
Provide a low-friction entry point for users who do not want to start from a template.

### Blank Form Card Copy
**Title:** `Blank Form`  
**Description:** `Start with a simple form and build from there.`

### Blank Starter Structure
Creating a blank form should preload:
- form title
- short intro text
- one required email field
- submit button

### Default Blank Form Content
**Form Title:** `Untitled Form`  
**Intro Text:** `Start by collecting an email address and build from there.`  
**Required Field:** `Email`  
**Submit Button:** `Submit`

### Lifecycle
A blank form is created as **Draft** by default.

---

## Template Library

### Launch Template Strategy
Templates are available to all users and serve as reusable starting points.

### Access Model
- templates are visible to everyone
- templates can be filtered by department/category
- department is a classification model, not an access restriction

### Recommended Launch Templates

#### General
- Blank Form
- Contact Us
- Registration Form
- Feedback Form

#### Marketing
- Download Material
- Newsletter Signup
- Event Registration
- Webinar Registration

#### Sales
- Request a Demo
- Request a Quote
- Consultation Request

#### Support
- Support Request
- Bug Report
- Help Desk Intake

#### HR / Admin
- Job Application
- Internal Request
- Employee Feedback

---

## Template Card Requirements

Each template card should display:
- template name
- short description
- category/department
- optional field count or form type hint
- optional preview thumbnail

### Card Actions
- `Preview`
- `Use template`

### Blank Card Action
- `Create blank form`

---

## Preview Panel

### Purpose
Allow users to evaluate the selected template before using it.

### Behavior
Selecting a template updates the preview panel immediately.

### Preview Contents
- form title
- intro text
- key form fields
- submit button
- general layout structure

### Preview Constraints
The preview is **not interactive**. It should not support:
- typing into fields
- validation
- real submission
- conditional logic simulation

### Rationale
Keeps the picker fast, focused, and easier to understand.

---

## Primary Actions

### For Blank Form
**Primary Button:** `Create blank form`

### For Template
**Primary Button:** `Use template`

### Secondary Action
**Secondary Button:** `Cancel`

### Close Behavior
- close icon in modal header
- cancel closes modal without creating anything
- ESC closes modal

---

## Post-Selection Behavior

### After Blank or Template Selection
The system should:
1. create a new form record
2. save it as **Draft**
3. preload starter content from blank or selected template
4. open the Form Editor

### Status Rule
All newly created forms start as:

**Draft**

### Rationale
Prevents accidental publishing and allows users to finish setup before going live.

---

## Forms and Templates Relationship

### Rule
Once a form is created from a template:
- it becomes fully independent
- template changes do not affect the form
- the new form can later be edited freely
- the form can later be saved as a template

---

## Save as Template Support

### Future Action
Inside the Form Editor, users can choose:

**Action:** `Save as Template`

### Required Template Metadata
When saving a form as a template, users should provide:
- template name
- description
- category
- tags
- publish status
- department classification

---

## Permissions

### Form Creation
All users can create forms.

### Template Usage
All users can use templates.

### Template Management
Only **Admin** and **Lead** users can:
- create templates
- edit templates
- publish templates
- unpublish templates
- manage template library content

---

## UX Principles
- Blank Form should always be visible
- Template selection should feel quick and visual
- Preview should update instantly
- Template library should remain curated and simple in v1
- Search and category filters should reduce browsing friction
- Users should never have to begin from a truly empty state

---

## Future Enhancements
Not required for v1, but supported by the model:
- favorite templates
- recently used templates
- my templates
- popular templates
- recommended templates
- template version history
- duplicate template
- template analytics

---

## Success Criteria
This flow is successful if users can:
- understand the difference between blank and template-based creation
- find an appropriate template quickly
- preview before choosing
- create a new form in one clear action
- land in the Form Editor with a usable draft form ready to configure

---

## Open Questions for Later Phases
- Should template popularity or usage count be shown?
- Should users be able to favorite templates?
- Should recently used templates appear at the top?
- Should there be separate tabs for Global Templates and My Templates?
- Should recommended templates appear based on department usage?

---

## Final Product Decision Summary
- Entry opens in a **modal**
- Supports **Blank Form** and **Template-based creation**
- Templates are visible to **everyone**
- Templates are filterable by **department/category**
- Blank starter includes title, intro, required email field, and submit button
- Template preview is **full visual preview**, but **non-interactive**
- All new forms start as **Draft**
- Forms created from templates are **independent**
- Users can later **save forms as templates**
- Template management permissions belong to **Admin** and **Lead**