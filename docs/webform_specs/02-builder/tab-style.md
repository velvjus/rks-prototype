# Style Tab PRD

## Module
Web Forms → Form Editor → **Style Tab**

## Purpose
The Style tab allows users to visually brand and customize a form without writing code. It should help teams create polished, on-brand forms quickly while keeping the default workflow simple enough for non-designers.

---

## Product Goals
Users should be able to:
- apply an attractive form style quickly with minimal setup
- adjust brand basics like color, font, and button appearance
- refine typography, spacing, container, and input styling in a controlled way
- preview style changes instantly on desktop and mobile
- maintain consistent styling across fields, sections, steps, and success states
- create professional forms without needing custom CSS

---

## Core UX Principles
- The Style tab should feel **visual first**.
- Most users should be able to get a good result through **Quick Style** alone.
- Advanced customization should be available, but not mandatory.
- Changes should preview immediately and accurately.
- The system should favor **safe design constraints** over unlimited control.
- Styling should be consistent across the whole form unless future per-object styling is introduced.
- No custom CSS is supported in v1.

---

## Styling Levels
The tab supports two modes:
- **Quick Style**
- **Advanced Style**

### Why Two Levels
- Quick Style helps users make fast brand updates.
- Advanced Style gives more control for teams that want refinement.
- This keeps the default experience lightweight while still supporting more polished outputs.

---

## Style Tab Page Layout
The Style tab uses a **3-panel visual workspace**:

1. **Left Panel** — Style navigation
2. **Center Panel** — Live preview
3. **Right Panel** — Style controls for selected category

### Recommended Desktop Layout
- **Left Panel:** 240–280px
- **Center Panel:** flexible preview workspace
- **Right Panel:** 320–380px

### Responsive Behavior
- On smaller laptop widths, the right panel can collapse into a drawer.
- On tablet, preview remains primary while controls move into slide-overs.
- Desktop remains the main styling experience.

---

## Global Tab Header Behavior
The Style tab uses the persistent Form Builder top bar.

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

### Optional Secondary Row Inside Style Tab
A contextual row may contain:
- desktop / mobile preview toggle
- preview state selector
- reset section styles action
- switch between Quick and Advanced

---

## Screen Composition

### 1) Left Panel — Style Navigation
The left panel helps users understand what category of styling they are editing.

#### Recommended Navigation Structure
- Quick Style
- Typography
- Inputs
- Buttons
- Spacing
- Container
- Background
- Success State

A simple vertical navigation works best.

#### Behavior
- selecting a category updates the right panel controls
- the center preview remains persistent
- current section is clearly highlighted

---

### 2) Center Panel — Live Preview
The center panel is the visual source of truth for how style changes affect the form.

#### Preview Responsibilities
- render the current form with live styling applied
- reflect current layout and content from Build
- show desktop and mobile views
- support previewing current step and success state
- update immediately as controls change

#### Recommended Preview Modes
- Desktop
- Mobile

#### Recommended Preview States
- Default form state
- Focused field state
- Validation error state
- Multi-step state if applicable
- Success state

#### Preview Constraints
The Style tab preview is for styling review, not submission testing.
It does not need to simulate real submissions.

---

### 3) Right Panel — Style Controls
The right panel shows the settings for the selected style category.

#### Behavior
- controls update based on selected navigation item
- changes apply live to preview
- defaults are visible and reversible
- invalid combinations are prevented where possible

---

## Quick Style
Quick Style is the default mode for fast customization.

### Purpose
Help most users make their form feel branded in under a minute.

### Quick Style Controls
- theme preset
- primary color
- font family
- border radius
- button style preset

### Recommended Theme Presets
Examples:
- Clean
- Rounded
- Minimal
- Bold
- Corporate

These are style presets, not content templates.

### Quick Style Behavior
- changing a preset updates multiple downstream values at once
- users can still fine-tune details later in Advanced Style
- Quick Style should never feel destructive; users can reset or override individual settings

---

## Advanced Style Categories

### A. Typography
Controls:
- form title font size
- heading scale
- body text size
- label size
- helper text size
- font weight choices
- text color
- label color
- helper/error color
- alignment controls where appropriate

Guidance:
- keep the control set practical
- do not expose excessive typographic micro-controls in v1

---

### B. Inputs
Controls:
- input shape
- border style
- border thickness presets
- border color
- input background color
- text color
- placeholder color
- focus state styling
- error state styling
- field height presets

Supported element types should inherit the same input system where possible:
- text inputs
- textarea
- select/dropdown
- date/time controls
- checkbox/radio families
- file upload container

---

### C. Buttons
Controls:
- button style preset
- fill / outline / soft style
- button color
- text color
- border radius
- height size preset
- full-width toggle
- alignment for single-step forms

Button styling should apply to:
- submit button
- next step button
- previous step button where appropriate
- success CTA button if enabled

---

### D. Spacing
Controls:
- field vertical spacing
- section spacing
- step spacing
- form padding
- content block spacing

Guidance:
- keep spacing token-based rather than pixel-freeform in v1
- presets such as Compact / Comfortable / Spacious can help non-designers

---

### E. Container
Controls:
- form width preset
- container padding
- container border
- border radius
- shadow preset
- card style on/off
- alignment within page

This determines the overall visual framing of the form.

---

### F. Background
Controls:
- page background color
- form container background color
- contrast guidance
- optional subtle surface preset

Constraint:
- no advanced background media system in v1
- background image support can be deferred unless later prioritized

---

### G. Success State
Controls:
- success message title style
- success body style
- icon / illustration preset later if needed
- success CTA button styling inheritance
- success state container style

This ensures the post-submit experience remains visually consistent.

---

## Design Tokens and System Behavior
The style system should ideally map user controls to a small set of internal tokens.

### Recommended Token Families
- color
- typography
- radius
- spacing
- border
- shadow
- button treatment

### Why Tokenization Matters
- keeps design output consistent
- improves preview reliability
- simplifies theming later
- prevents uncontrolled styling combinations

---

## Preview-State Requirements
Users should be able to inspect style decisions across common states.

### Required Preview States
- default field
- focused field
- required indicator
- validation error
- checkbox/radio group
- file upload field
- multi-step navigation when applicable
- success state

This helps prevent styling surprises after publishing.

---

## Interaction Model

### Selection Behavior
- selecting a style category in the left panel updates the right-side controls
- center preview remains visible while switching categories
- device toggle should not reset current editing context

### Editing Behavior
- changes apply live to preview
- autosave or save feedback follows the builder-wide pattern
- style changes affect all relevant objects globally in v1

### Reset Behavior
Users should be able to:
- reset a section to defaults
- revert the current style category
- restore the full theme preset if needed

---

## Empty and First-Use States

### First Visit to Style Tab
Show a lightweight helper such as:

`Choose a preset to style your form quickly, or fine-tune each category in Advanced Style.`

### No Advanced Customization Yet
If the user has not changed advanced settings, the system can show:
- current preset name
- default token summary
- action: `Customize`

---

## Accessibility and Safeguards
The Style tab should encourage accessible outcomes.

### Recommended Safeguards
- warn about low color contrast
- preserve visible focus states
- prevent invisible required/error messaging
- keep form text readable on selected backgrounds
- avoid style settings that make controls unclear or unusable

### Accessibility Guidance
When possible, surface helpful notes such as:
- `Contrast may be too low for button text.`
- `Focus state should remain visible for keyboard users.`

---

## Warnings and Safeguards

### Live Form Warning
If the form is published, show the persistent editor banner:

`You are editing a live form. Changes will update immediately for visitors.`

### Unsaved / Saving State
Show clear autosave feedback in the top bar:
- Saving...
- Saved
- Save failed

### Destructive Actions
Confirm before:
- resetting all style settings
- restoring defaults for the entire form

---

## Recommended v1 Scope
Included in v1:
- Quick Style presets
- primary color
- font selection
- border radius
- button style presets
- advanced typography controls
- advanced input controls
- spacing controls
- container controls
- background controls
- success state styling
- desktop and mobile preview
- contrast warnings where feasible

Not included in v1:
- custom CSS
- per-field style overrides
- breakpoint-by-breakpoint styling editor
- animation system
- custom theme import/export
- advanced visual effects library

---

## Success Criteria
The Style tab is successful if users can:
- make forms look polished quickly
- match basic brand appearance without code
- preview styling changes accurately before publishing
- adjust typography, inputs, and buttons with confidence
- maintain usable and readable forms across devices
- avoid common visual and accessibility problems
