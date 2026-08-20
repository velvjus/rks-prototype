# Logic Tab PRD

## Module
Web Forms → Form Editor → **Logic Tab**

## Purpose
The Logic tab allows users to configure conditional behavior for form fields and steps without needing to understand code. It should make simple conditional rules feel clear, safe, and manageable, especially for business users creating guided forms, intake flows, and basic branching experiences.

---

## Product Goals
Users should be able to:
- create simple conditional rules quickly
- see which fields or steps already have logic applied
- understand what triggers each rule and what happens next
- manage field visibility and required-state logic confidently
- control simple step visibility for multi-step forms
- avoid broken logic caused by deleted or renamed fields
- keep v1 logic powerful enough for common use cases without becoming overwhelming

---

## Core UX Principles
- The Logic tab must make conditional behavior feel **readable**, not technical.
- v1 logic should prioritize **clarity over flexibility**.
- Rules should be expressed in plain language:
  - **When** something matches
  - **Then** do something
- Users should always know which fields are **triggers** and which are **targets**.
- The UI should prevent invalid configurations wherever possible.
- Logic should remain lightweight in v1:
  - no nested condition groups
  - no visual flowchart builder
  - no advanced routing trees
- Build and Logic must stay connected so users can move between structure editing and behavior editing with confidence.

---

## Supported v1 Logic Types
The Logic tab supports the following rule outcomes in v1:
- **Show field when condition matches**
- **Hide field when condition matches**
- **Show step when condition matches**
- **Make field required when condition matches**

### Explicit v1 Exclusions
Not supported in v1:
- nested groups of conditions
- advanced AND/OR group trees
- score-based logic
- calculated fields
- conditional redirects
- conditional CRM mapping
- conditional styling
- branching to arbitrary next steps
- workflow automation logic outside form rendering

---

## Rule Model
Each logic rule follows a simple model:

1. **Target** — the field or step affected by the rule
2. **When** — the field that acts as the trigger
3. **Condition** — the comparison used
4. **Then** — the action applied to the target

### Example
- Target: `Priority`
- When `Inquiry Type`
- Condition `is Support`
- Then `Show field`

### Recommended Internal Data Shape
Each rule should store:
- rule id
- rule status (active / inactive)
- target object type
- target object id
- trigger field id
- operator
- comparison value
- action type
- conflict flags if present
- created at / updated at

---

## Logic Tab Page Layout
The Logic tab uses a **3-panel workspace** optimized for rule browsing and editing:

1. **Left Panel** — Rule list + object index
2. **Center Panel** — Rule builder / selected rule editor
3. **Right Panel** — Context + validation + impact summary

### Recommended Desktop Layout
- **Left Panel:** 280–320px
- **Center Panel:** flexible primary workspace
- **Right Panel:** 300–360px

### Responsive Behavior
- On smaller laptop widths, the right panel can collapse into a drawer.
- On tablet, the left list becomes a slide-over and the builder remains primary.
- Desktop remains the preferred editing experience.

---

## Global Tab Header Behavior
The Logic tab uses the persistent Form Builder top bar.

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

### Optional Secondary Row Inside Logic Tab
A lightweight contextual row may contain:
- search rules
- filter by target type
- filter by step
- show only warnings toggle
- add rule button

---

## Screen Composition

### 1) Left Panel — Rules + Objects
The left panel supports two top-level views:

#### A. Rules
Used to browse and manage all existing rules.

##### Rule List Contents
Each rule row should show:
- rule name or generated summary
- target item name
- action type
- trigger field name
- active/inactive state
- warning indicator when broken

##### Rule Row Example
`Show Priority when Inquiry Type is Support`

##### Rule List Actions
Users can:
- select a rule to edit
- create a new rule
- duplicate a rule
- enable/disable a rule
- delete a rule
- filter rules by status or target type

##### Recommended Filters
- All rules
- Field rules
- Step rules
- Active
- Has warnings
- Current step

---

#### B. Objects With Logic
Used to browse fields and steps that currently have logic attached.

##### Object Index Shows
- steps
- sections
- fields
- hidden fields where relevant
- objects with logic badges

##### Object Index Capabilities
Users can:
- click a field or step to view its rules
- see how many rules affect that object
- identify trigger fields used heavily across the form

This helps users answer:
- “What logic is attached to this field?”
- “Which step is conditionally visible?”
- “What breaks if I remove this trigger field?”

---

### 2) Center Panel — Rule Builder
The center panel is the primary rule creation and editing surface.

#### Default Empty State
If no rule exists yet, show:
- heading: `Add your first rule`
- supporting text: `Use simple conditions to show fields, show steps, or make fields required.`
- primary action: `Create rule`

#### Rule Builder Structure
The builder should use a plain-language stacked format:

##### A. Target
Choose what the rule affects.

Supported target types:
- Field
- Step

##### B. When
Choose the trigger field.

Supported trigger field types in v1:
- Dropdown
- Radio
- Checkbox
- Multi-select
- Short Text
- Long Text
- Number
- Date
- Consent Checkbox
- Hidden Field where meaningful

##### C. Condition
Choose the comparison.

Supported condition operators should adapt by field type.

**Choice fields**
- is
- is not
- contains
- does not contain
- is any of

**Text fields**
- is
- is not
- contains
- does not contain
- is empty
- is not empty

**Number fields**
- equals
- does not equal
- greater than
- less than
- is empty
- is not empty

**Checkbox / boolean fields**
- is checked
- is not checked

**Date fields**
- is
- before
- after
- is empty
- is not empty

##### D. Then
Choose the action.

Supported actions:
- Show field
- Hide field
- Show step
- Make field required

##### E. Rule Summary
Always show a generated sentence preview, for example:

`When Inquiry Type is Support, show field Priority.`

This summary should update live as the user edits the rule.

---

### 3) Right Panel — Context + Warnings
The right panel gives users confidence before they save changes.

#### Recommended Sections

##### A. Rule Status
- active toggle
- draft / unsaved state
- last updated information

##### B. Impact Summary
Show:
- target item name
- target item type
- current step / section location
- whether the rule affects published content immediately

##### C. Validation
Show inline warnings such as:
- trigger field deleted
- target field deleted
- comparison value no longer exists
- rule conflicts with another rule
- hidden target also marked required

##### D. Related Items
- open target in Build tab
- open trigger field in Build tab
- open step in Build tab

##### E. Logic Notes
A short helper reminding users:
- rules apply live in preview
- complex nested branching is not supported in v1
- rule order should not matter for simple logic, but conflicts will be flagged

---

## Rule Creation Flows

### Flow A — Add Rule From Scratch
1. User clicks `Create rule`
2. Rule builder opens
3. User selects target
4. User selects trigger field
5. User chooses condition
6. User chooses action
7. System validates rule
8. Rule is saved and listed

### Flow B — Add Logic From Build Tab
1. User selects a field or step in Build
2. User clicks `Add logic`
3. System opens the Logic tab
4. Target is preselected in rule builder
5. User completes the trigger, condition, and action

### Flow C — Edit Existing Rule
1. User selects rule in left panel
2. Center builder loads existing rule
3. User edits condition or action
4. Rule summary and warnings update live
5. System autosaves or saves on command

---

## Rule Naming Strategy
Users should not be forced to manually name rules in v1.

### Recommended Pattern
Auto-generate rule names from the rule summary, for example:
- `Show Priority when Inquiry Type is Support`
- `Show Step 2 when Customer Type is Existing Customer`
- `Require Phone when Contact Method is Call`

Optional custom naming can be added later if the rule list becomes harder to scan.

---

## Validation Rules
The Logic tab must prevent or clearly warn against invalid setups.

### Hard Prevents
Do not allow:
- targeting the same field as both trigger and target in an invalid way
- selecting unsupported target types
- saving a rule without trigger, condition, or action
- step rules on single-step forms unless another step exists

### Soft Warnings
Allow save but warn when:
- comparison value no longer matches available options
- target field is also hidden elsewhere
- multiple rules affect the same target in potentially conflicting ways
- rule may create confusing user experience

### Conflict Examples
- Rule A shows `Priority` when `Inquiry Type = Support`
- Rule B hides `Priority` when `Customer Type = Existing`

In v1, the product should:
- allow the rules
- flag potential conflict
- show a warning summary
- leave advanced conflict resolution out of scope

---

## Logic Summary Views
Users should be able to understand logic at multiple levels.

### A. Per Rule
Each rule has a readable sentence summary.

### B. Per Object
Fields and steps should show a count of related rules.

### C. Per Form
A top-level summary may show:
- total rules
- fields with logic
- steps with logic
- broken rules

This improves maintainability for larger forms.

---

## Interaction Model

### Selection Behavior
- selecting a rule loads it in the center panel
- selecting an object in the logic index filters to its related rules
- only one rule is actively edited at a time

### Editing Behavior
- builder changes update the summary immediately
- invalid states show inline error guidance before save
- autosave feedback follows the editor-wide save pattern

### Cross-Tab Linking
Users should be able to jump to:
- target field in Build
- trigger field in Build
- related submission mapping where relevant

---

## Empty States

### No Rules Yet
- heading: `No logic rules yet`
- copy: `Use logic to show fields, reveal steps, or require information only when needed.`
- action: `Create first rule`

### No Logic For Selected Object
- heading: `No rules for this item`
- copy: `This field or step does not currently use conditional behavior.`
- action: `Add rule`

### Broken Rule State
- heading: `This rule needs attention`
- copy explains what changed, for example:
  - `The trigger option “Support” no longer exists.`
  - `The target field was deleted in Build.`

---

## Warnings and Safeguards

### Live Form Warning
If the form is published, show the persistent editor banner:

`You are editing a live form. Changes will update immediately for visitors.`

### Destructive Action Confirmation
Confirm before:
- deleting a rule
- deleting a target with existing rules from Build
- deleting a trigger field used by one or more rules

### Cross-Tab Deletion Safeguard
If a field is deleted in Build and is used in logic, the system should:
- warn before deletion
- explain the rule impact
- offer to remove affected rules or leave them broken for review

---

## Recommended v1 Scope
Included in v1:
- rule list
- readable rule builder
- field visibility logic
- step visibility logic
- conditional required logic
- rule validation and warning states
- links back to Build
- object-level logic indicators

Not included in v1:
- nested logic groups
- full branching journey builder
- conditional redirects
- calculations
- scoring
- workflow automations
- per-rule analytics
- simulation timelines

---

## Success Criteria
The Logic tab is successful if users can:
- create common conditional rules without support
- understand what each rule does at a glance
- identify which fields and steps are affected by logic
- spot broken or conflicting rules before publishing
- navigate between Build and Logic without losing context
- maintain logic in larger forms without confusion
