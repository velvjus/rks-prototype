# Share & Embed Tab PRD

## Module
Web Forms → Form Editor → **Share & Embed Tab**

## Purpose
The Share & Embed tab gives users the publish-ready outputs for their form so they can distribute it publicly or embed it on a website. It should make sharing straightforward while clearly communicating draft and live status.

---

## Product Goals
Users should be able to:
- access the live standalone form link
- copy an embeddable iFrame snippet
- preview the published form before sharing
- understand whether the form is currently draft, published, paused, or archived
- avoid sharing forms that are not ready or not live
- distribute forms confidently across owned channels

---

## Core UX Principles
- The tab should feel **action-oriented** and easy to scan.
- The most important outputs should be immediately visible.
- Form status must be obvious before users copy anything.
- Sharing should be simple for non-technical users.
- Embedding should be practical for basic website use in v1.
- v1 should avoid overloading the tab with advanced publish infrastructure.

---

## Supported v1 Outputs
- **Standalone link**
- **iFrame embed**

### Explicit v1 Exclusions
Not included in v1:
- popup embed
- JavaScript embed
- WordPress plugin distribution
- QR code generation
- domain mapping UI
- advanced access gating
- multi-environment release workflows

---

## Share & Embed Tab Page Layout
The Share & Embed tab uses a **2-column workspace**:

1. **Left / Main Panel** — share and embed outputs
2. **Right Panel** — live preview and status guidance

### Recommended Desktop Layout
- **Main Panel:** flexible primary workspace
- **Right Panel:** 360–420px

### Responsive Behavior
- On smaller widths, the preview panel stacks below the main content.
- On tablet, preview can collapse behind a toggle.
- Desktop remains the preferred sharing experience.

---

## Global Tab Header Behavior
The Share & Embed tab uses the persistent Form Builder top bar.

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

## Status Awareness
The Share & Embed tab must clearly reflect the current form status.

### Supported Statuses
- Draft
- Published
- Paused
- Archived

### Status Behavior

#### Draft
- standalone link is not considered ready for public distribution
- embed section should be visually disabled or warning-led
- show a clear prompt to publish first

Required message:

`This form is still in draft. Publish it before sharing.`

#### Published
- standalone link is active
- iFrame embed is available
- preview should reflect the live version

#### Paused
- sharing information may still be visible, but the form should clearly be marked unavailable for new submissions
- preview and messaging should explain paused behavior

#### Archived
- sharing actions should be disabled or strongly discouraged
- archived forms are not active distribution targets

---

## Screen Composition

### 1) Main Panel — Share Outputs
The main panel contains output cards that users can copy.

---

## Section A — Share Link

### Purpose
Provide the direct standalone URL to the hosted form.

### Required Elements
- section title
- environment/status note
- share URL field
- copy action
- open link action

### Behavior
- if published, the live URL is shown
- if draft, the section remains visible but blocked with publish guidance
- the copy button should confirm success clearly

### Recommended Copy
- section title: `Standalone link`
- helper text: `Use this link to share the form directly.`

---

## Section B — Embed Code

### Purpose
Provide a simple iFrame snippet for website embedding.

### Required Elements
- section title
- embed code box
- copy action
- basic explanation of how the embed works
- optional size guidance

### Recommended Embed Pattern
Provide a generated iFrame snippet that references the published hosted form URL.

### Optional v1 Controls
Keep the control set minimal:
- width guidance
- height guidance
- recommended responsive wrapper note

Avoid turning v1 into a full embed configurator.

### Recommended Copy
- section title: `iFrame embed`
- helper text: `Paste this snippet into your website where you want the form to appear.`

---

## Section C — Sharing Guidance
A lightweight guidance block can explain:
- publish status requirements
- how standalone link differs from iFrame embed
- that changes to a published form update the shared output

Example note:

`Updates to a published form will affect both the standalone link and embedded version.`

---

### 2) Right Panel — Preview + Status Guidance
The right panel helps users confirm what they are sharing.

#### Recommended Sections

##### A. Status Summary
Show:
- current form status
- last published / updated state where available
- whether outputs are active

##### B. Preview
A live or near-live preview should show:
- desktop preview by default
- mobile toggle optional
- current styling and structure

The preview is for visual confirmation, not full submission testing.

##### C. Distribution Notes
Helpful reminders such as:
- `Draft forms should be published before sharing.`
- `Paused forms will not accept new submissions.`
- `Archived forms should not be embedded on active pages.`

---

## Draft and Publish Rules

### Draft Rule
If a form is Draft:
- show the warning banner in this tab
- keep copy actions disabled or clearly intercepted
- promote `Publish` as the primary next step

### Publish Rule
Once published:
- standalone link becomes active
- iFrame code becomes available
- preview reflects the shareable version

### Update Rule
When a live form changes and is updated:
- the same share link remains preferred where possible
- embeds continue using the same source URL
- users should be reminded that published changes affect current visitors

---

## Interaction Model

### Copy Actions
Users should be able to:
- copy standalone link
- copy embed code
- receive inline confirmation such as `Copied`

### Preview Behavior
- preview updates with current form state
- preview should reflect style and build changes
- preview should make draft/published state obvious

### Call-To-Action Behavior
If the form is not ready to share, the tab should guide users toward:
- Save
- Publish / Update
- Preview

---

## Empty and Warning States

### Draft Form State
- heading: `Publish before sharing`
- copy: `This form is still in draft. Publish it before sharing.`
- primary action: `Publish`

### Paused Form State
- heading: `This form is paused`
- copy: `Visitors can still access the link location, but new submissions are unavailable.`

### Archived Form State
- heading: `This form is archived`
- copy: `Archived forms are not intended for active sharing or embed use.`

### Missing Published URL State
If the published URL is unavailable for any reason:
- explain that publishing must complete successfully first
- provide a retry or refresh action later if relevant

---

## Validation and Safeguards

### Hard Prevents
Do not allow active sharing output copy in normal flow when:
- the form is Draft
- the form is Archived
- publish process has not completed successfully

### Soft Warnings
Warn but allow viewing when:
- form is Paused
- form has unpublished edits relative to currently live version if versioning later exists

---

## Recommended v1 Scope
Included in v1:
- standalone link card
- iFrame embed card
- copy actions
- preview panel
- draft warning state
- paused state guidance
- archived state guidance
- publish/update reminders

Not included in v1:
- popup embed
- JavaScript embed
- custom domain management
- embed theming controls in this tab
- QR codes
- access passwords
- environment-specific release controls

---

## Success Criteria
The Share & Embed tab is successful if users can:
- understand whether the form is ready to share
- copy the standalone link without confusion
- copy an iFrame embed snippet easily
- preview the shared form before distribution
- avoid sharing inactive or draft forms accidentally
