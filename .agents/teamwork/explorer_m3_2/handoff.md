# Batch 4 Deep Investigation Report: Omnichannel Module

**Explorer 2 Handoff Report**  
**Milestone**: Milestone 3 (CRM Core & Omnichannel — Batch 4)  
**Target**: Parent Orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`)  
**Date**: 2026-10-31T09:15:00Z  
**Working Directory**: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_2`  

---

## 1. Observation

### 1.1 Tool Audit Results & File Inventory
Automated execution of `node scripts/audit-tokens.cjs --batch 4` detected **1,487 token violations** across the 6 registered batch files (6,714 total lines):

```text
======================================================================
 RAKANSALES TOKEN AUDIT REPORT (Batch 4: Omnichannel)
======================================================================
Scanned: 6 file(s)
  - src/views/OmnichannelView.vue: 882 violations (605 palette, 132 hex, 145 status, 0 dark:)
  - src/components/omnichannel/ConversationItem.vue: 335 violations (201 palette, 53 hex, 81 status, 0 dark:)
  - src/components/omnichannel/OmnichannelTutorialModal.vue: 127 violations (89 palette, 25 hex, 13 status, 0 dark:)
  - src/components/omnichannel/TemplatePickerModal.vue: 92 violations (69 palette, 6 hex, 17 status, 0 dark:)
  - src/components/omnichannel/PlatformIcon.vue: 41 violations (7 palette, 0 hex, 32 status, 2 inline style)
  - src/views/webforms/ManageTemplatesView.vue: 10 violations (3 palette, 0 hex, 7 status, 0 dark:)
----------------------------------------------------------------------
VIOLATIONS BY CATEGORY:
  - Palette Grays & Neutrals: 974
  - Raw Status / Accent Colors: 295
  - Tailwind Arbitrary Hex/RGB Classes: 216
  - Inline Hex/RGB Styles: 2
  - dark: Class Overrides: 0
TOTAL VIOLATIONS: 1,487
======================================================================
```

### 1.2 Codemod Efficacy Analysis
Execution of `node scripts/codemod-tokens.cjs --batch 4 --dry-run` yielded only **104 replacements** (7.0% of all violations):
```text
✔ src/views/OmnichannelView.vue: 66 replacement(s)
✔ src/components/omnichannel/ConversationItem.vue: 16 replacement(s)
✔ src/components/omnichannel/OmnichannelTutorialModal.vue: 14 replacement(s)
✔ src/components/omnichannel/TemplatePickerModal.vue: 3 replacement(s)
✔ src/components/omnichannel/PlatformIcon.vue: 5 replacement(s)
Total replacements: 104
```
**Root Cause**: The existing codemod was primarily designed around dark override pairs (e.g. `bg-white dark:bg-gray-900`). In Batch 4, there are **0 `dark:` overrides** in the entire module. Omnichannel was written as 100% light-mode hardcoded UI (`bg-white`, `text-gray-900`, `border-gray-200`, `bg-[#23B750]`, `bg-gray-50`, `bg-green-50`). Codemod rules without pairs don't match, so migration requires systematic recipe replacements.

---

## 2. Logic Chain

1. **Observation 1**: Omnichannel has 0 `dark:` class overrides and relies completely on hardcoded light classes (`bg-white` 100x, `bg-gray-50` 119x, `text-gray-400` 134x, `border-gray-200` 83x, `text-gray-700` 73x, `text-gray-500` 69x, `text-white` 53x, `bg-[#23B750]` 51x).
2. **Inference 1**: By migrating these light classes directly to semantic tokens (`bg-card`, `bg-background`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`), dark mode is activated automatically by the CSS variable system without needing any `dark:` overrides.
3. **Observation 2**: Chat bubbles in `OmnichannelView.vue:3159-3164` use:
   - Self/outgoing: `bg-[#23B750] text-white border-transparent`
   - Self/failed: `bg-red-50 text-red-700 border-red-150`
   - Inbound customer: `bg-white text-gray-800 border-gray-200`
4. **Inference 2**: In both light and dark modes:
   - Self messages must map to `bg-primary text-primary-foreground border-transparent`.
   - Delivery failures map to `bg-destructive/10 text-destructive border-destructive/20`.
   - Inbound customer bubbles must map to `bg-muted text-foreground border border-border` (ensuring readable contrast in dark mode while retaining chat bubble visual differentiation).
   - Quoted replies inside user bubbles map to `bg-primary-foreground/15 text-primary-foreground` with a `bg-primary-foreground` accent bar; quoted replies in customer bubbles map to `bg-card text-foreground` with a `bg-primary` accent bar.
5. **Observation 3**: In `PlatformIcon.vue:112-125`, `badgeContainerClasses` hardcodes raw status colors (`bg-emerald-50 text-emerald-700`, `bg-blue-50 text-blue-700`, `bg-pink-50`, `bg-cyan-50`, `bg-sky-50`, `bg-rose-50`). Lines 176 and 209 have inline styles with fallback `'#23B750'`, and line 175 uses `border-white`.
6. **Inference 3**:
   - Platform badge containers should map to semantic status and categorical tag tokens:
     - WhatsApp / LiveChat: `bg-success/10 text-success border-success/20 hover:bg-success/20`
     - Messenger / Facebook / LinkedIn: `bg-info/10 text-info border-info/20 hover:bg-info/20`
     - Instagram: `bg-tag-4 text-tag-4-foreground border-border hover:bg-tag-4/80`
     - Telegram: `bg-tag-6 text-tag-6-foreground border-border hover:bg-tag-6/80`
     - Webform: `bg-warning/10 text-warning border-warning/20 hover:bg-warning/20`
     - Email / Mail: `bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20`
     - SMS: `bg-tag-1 text-tag-1-foreground border-border hover:bg-tag-1/80`
     - Fallback: `bg-muted text-muted-foreground border-border hover:bg-accent`
   - Avatar badge border `border-white` -> `border-background` (separating the platform badge from the avatar image cleanly in both themes).
   - Inline style fallback `'#23B750'` -> `'var(--primary)'` to eliminate inline hex violations.
7. **Observation 4**: In `ConversationItem.vue:198-202`:
   - Row container: `border-b border-gray-100`, `:class="[selected ? 'bg-gray-100/70 hover:bg-gray-100/80' : 'bg-white hover:bg-gray-50/80']"`
   - Selected indicator line: `bg-[#23B750]`
   - SLA breached badge: `text-[#B91C1C] bg-[#FDF2F2] border-[#FDE8E8]`
   - Focus badge: `text-violet-700 bg-violet-50 border-violet-100`
   - Unread pill: `(item.isUnreadGray || item.isSnoozed) ? 'bg-gray-400 text-white' : 'bg-[#EF4444] text-white'`
8. **Inference 4**:
   - Row selection maps to `border-border`, `selected ? 'bg-muted hover:bg-muted/80' : 'bg-card hover:bg-muted/50'`.
   - Selected 3px left bar maps to `bg-primary`.
   - SLA breached badge maps to `text-destructive bg-destructive/10 border-destructive/20`.
   - Focus badge maps to `text-tag-4-foreground bg-tag-4 border-border`.
   - Unread count pill maps to `(item.isUnreadGray || item.isSnoozed) ? 'bg-muted-foreground text-background' : 'bg-destructive text-destructive-foreground shadow-2xs'`.
   - Tooltips map to `bg-popover text-popover-foreground border-border`.
9. **Observation 5**: In `OmnichannelView.vue`, mock log message strings inside `<script>` (Lines 174, 513, 773, 1200, 1263, 1282, 1319, 1830) hardcode raw Tailwind classes into `logClass: 'bg-green-50 text-green-700 border-green-200'`.
10. **Inference 5**: Tokenizing these 8 data strings to semantic token classes (`bg-success/10 text-success border-success/20`, `bg-info/10 text-info border-info/20`, etc.) completely cleans all 22 script violations in `OmnichannelView.vue`.

---

## 3. Caveats

1. **Third-party brand SVG colors**: `PlatformIcon.vue` maintains brand-authentic fill colors in `brandColors` (`#25D366` for WhatsApp, `#0084FF` for Messenger, etc.) for `variant="colored"`. These are official third-party brand logos and exempt from generic neutral token rules. However, their containing badges and fallbacks must strictly adhere to semantic status/tag tokens and `var(--primary)`.
2. **ContactDrawer & FiltersModal**: These 2 components reside in `src/components/omnichannel/`, but were allocated to Batch 3 (CRM Core). Their token migration is handled by Explorer/Migrator 1.
3. **InboxDropdown & ToastNotifications**: These 2 components reside in `src/components/omnichannel/`, but were already migrated in Batch 1 (App Shell). They are verified at 0 violations.
4. **Rich Text Formatting in Composer**: Active formatting states in the composer typography toolbar (Bold, Italic, Underline, Align) should use `bg-primary text-primary-foreground` when active and `text-muted-foreground hover:bg-muted hover:text-foreground` when inactive.

---

## 4. Conclusion & Precise Replacement Recipes

### 4.1 Master Class Replacement Dictionary for Batch 4

| Raw Pattern | Semantic Replacement | Component Context |
|---|---|---|
| `bg-white` | `bg-card` (modals/drawers/cards/menus) or `bg-background` (canvasses) | Surfaces |
| `bg-gray-50`, `bg-gray-50/70`, `bg-slate-50` | `bg-muted/50` or `bg-background` | Background canvasses, pill buttons |
| `bg-gray-100`, `bg-gray-150` | `bg-muted` | Secondary chips, badges, hover fills |
| `bg-gray-200` | `bg-muted/80` or `bg-accent` | Scroll buttons, inactive pills |
| `text-gray-900`, `text-slate-900`, `text-gray-800` | `text-foreground` | Primary text, titles, headings |
| `text-gray-700`, `text-slate-700`, `text-gray-600` | `text-foreground/90` or `text-foreground` | Labels, active filters |
| `text-gray-500`, `text-slate-500`, `text-gray-400` | `text-muted-foreground` | Muted text, timestamps, icons |
| `text-gray-300` | `text-muted-foreground/50` | Bullet dots, subtle separators |
| `border-gray-100`, `border-gray-150`, `border-gray-200` | `border-border` | Component and card borders |
| `border-gray-250`, `border-gray-300` | `border-input` or `border-border` | Form input borders |
| `bg-[#23B750]`, `text-[#23B750]`, `border-[#23B750]` | `bg-primary`, `text-primary`, `border-primary` | Brand accents, active buttons |
| `hover:bg-[#1a943e]`, `hover:bg-[#1fa346]`, `hover:bg-[#1f9f45]` | `hover:bg-primary/90` | Brand hover states |
| `text-white` (on primary buttons/badges) | `text-primary-foreground` | High-contrast on primary |
| `text-white` (on dark/black elements) | `text-foreground` or `text-popover-foreground` | Text legibility in dark mode |
| `border-white` | `border-background` | Avatar online dot borders, badge borders |
| `bg-green-50 text-green-700 border-green-200` | `bg-success/10 text-success border-success/20` | Success badges, active filter pills |
| `bg-emerald-50 text-emerald-800 border-emerald-200` | `bg-success/10 text-success border-success/20` | Success tags, resolved templates |
| `bg-red-50 text-red-700 border-red-150` | `bg-destructive/10 text-destructive border-destructive/20` | Error banners, failed outbox bubbles |
| `bg-[#EF4444]`, `text-[#EF4444]`, `text-red-500` | `bg-destructive`, `text-destructive` | Destructive actions, unread count pill |
| `bg-amber-50 text-amber-900 border-amber-200` | `bg-warning/10 text-warning border-warning/20` | Warning callouts, variable tokens |
| `bg-blue-50 text-blue-700 border-blue-200` | `bg-info/10 text-info border-info/20` | Info callouts, snooze indicators |
| `bg-violet-50 text-violet-700 border-violet-100` | `bg-tag-4 text-tag-4-foreground border-border` | Focus tags, private bookmarks |
| `text-[#9F5CF8]` | `text-tag-4-foreground` | VIP crown icon |
| `from-white via-white/90 to-transparent` | `from-card via-card/90 to-transparent` | Scroll overlay gradients |

---

### 4.2 Recipe 1: `src/components/omnichannel/PlatformIcon.vue` (41 violations -> 0)

1. **Badge container classes** (`PlatformIcon.vue:112-126`):
```vue
// BEFORE:
const badgeContainerClasses = computed(() => {
  switch (normalizedPlatform.value) {
    case 'whatsapp': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80'
    case 'messenger': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80'
    case 'instagram': return 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100/80'
    case 'telegram': return 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100/80'
    case 'linkedin': return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100/80'
    case 'mail': return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80'
    case 'livechat': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100/80'
    case 'facebook': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80'
    case 'webform': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80'
    case 'sms': return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/80'
    default: return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
  }
})

// AFTER:
const badgeContainerClasses = computed(() => {
  switch (normalizedPlatform.value) {
    case 'whatsapp':
    case 'livechat':
    case 'wechat':
    case 'line':
      return 'bg-success/10 text-success border-success/20 hover:bg-success/20'
    case 'messenger':
    case 'facebook':
    case 'linkedin':
      return 'bg-info/10 text-info border-info/20 hover:bg-info/20'
    case 'instagram':
      return 'bg-tag-4 text-tag-4-foreground border-border hover:bg-tag-4/80'
    case 'telegram':
      return 'bg-tag-6 text-tag-6-foreground border-border hover:bg-tag-6/80'
    case 'mail':
      return 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
    case 'webform':
      return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
    case 'sms':
      return 'bg-tag-1 text-tag-1-foreground border-border hover:bg-tag-1/80'
    default:
      return 'bg-muted text-muted-foreground border-border hover:bg-accent'
  }
})
```

2. **Avatar badge overlay & fallbacks** (`PlatformIcon.vue:175-180, 209, 228`):
```vue
<!-- BEFORE: Line 175-180 -->
<span 
  v-else-if="variant === 'avatar-badge'"
  class="w-4 h-4 rounded-full border-1.5 border-white flex items-center justify-center shadow-xs shrink-0"
  :style="{ backgroundColor: brandColors[normalizedPlatform] || '#23B750' }"
>
  <svg class="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">

<!-- AFTER: -->
<span 
  v-else-if="variant === 'avatar-badge'"
  class="w-4 h-4 rounded-full border-1.5 border-background flex items-center justify-center shadow-xs shrink-0"
  :style="{ backgroundColor: brandColors[normalizedPlatform] || 'var(--primary)' }"
>
  <svg class="w-2.5 h-2.5 fill-primary-foreground" viewBox="0 0 24 24">

<!-- BEFORE: Line 209 -->
:style="variant === 'colored' ? { color: brandColors[normalizedPlatform] || '#23B750' } : {}"
<!-- AFTER: -->
:style="variant === 'colored' ? { color: brandColors[normalizedPlatform] || 'var(--primary)' } : {}"

<!-- BEFORE: Line 228 -->
<span v-if="showLabel" class="text-xs font-semibold text-gray-700">{{ displayLabel }}</span>
<!-- AFTER: -->
<span v-if="showLabel" class="text-xs font-semibold text-foreground">{{ displayLabel }}</span>
```

---

### 4.3 Recipe 2: `src/views/webforms/ManageTemplatesView.vue` (10 violations -> 0)

1. **Back arrow** (`Line 172`):
   ```vue
   <!-- BEFORE --> <ArrowLeft class="w-4 h-4 text-emerald-600" />
   <!-- AFTER  --> <ArrowLeft class="w-4 h-4 text-primary" />
   ```
2. **Published filter icon** (`Line 274`):
   ```vue
   <!-- BEFORE --> <Check class="w-4 h-4 text-emerald-600" />
   <!-- AFTER  --> <Check class="w-4 h-4 text-success" />
   ```
3. **Unpublished dot** (`Line 290`):
   ```vue
   <!-- BEFORE --> <span class="w-2 h-2 rounded-full bg-blue-500"></span>
   <!-- AFTER  --> <span class="w-2 h-2 rounded-full bg-info"></span>
   ```
4. **State Badge** (`Line 405`):
   ```vue
   <!-- BEFORE -->
   tpl.state === 'Published' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
   <!-- AFTER -->
   tpl.state === 'Published' ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'
   ```
5. **Use template icon** (`Line 423`):
   ```vue
   <!-- BEFORE --> <Plus class="w-3.5 h-3.5 mr-2 text-emerald-600" /> Use Template
   <!-- AFTER  --> <Plus class="w-3.5 h-3.5 mr-2 text-primary" /> Use Template
   ```

---

### 4.4 Recipe 3: `src/components/omnichannel/TemplatePickerModal.vue` (92 violations -> 0)

1. **Dynamic placeholder highlight** (`Lines 114-118`):
   ```vue
   // BEFORE:
   if (previewMode.value === 'resolved' && val) {
     return `<span class="bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-200/60">${val}</span>`
   }
   return `<span class="bg-amber-50 text-amber-900 font-mono text-[11px] px-1.5 py-0.5 rounded border border-amber-200/70">${match}</span>`

   // AFTER:
   if (previewMode.value === 'resolved' && val) {
     return `<span class="bg-success/10 text-success font-semibold px-1.5 py-0.5 rounded border border-success/20">${val}</span>`
   }
   return `<span class="bg-warning/10 text-warning font-mono text-[11px] px-1.5 py-0.5 rounded border border-warning/20">${match}</span>`
   ```

2. **Modal Backdrop, Shell and Header** (`Lines 191-218`):
   - `bg-slate-900/40` -> `bg-background/80`
   - `bg-white rounded-2xl ... border border-gray-200/80` -> `bg-card rounded-2xl ... border border-border`
   - `<header class="... border-b border-gray-150 ... bg-white">` -> `<header class="... border-b border-border ... bg-card">`
   - Search input: `bg-gray-50/70 hover:bg-gray-50 focus:bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-[#23B750] focus:border-[#23B750]` -> `bg-muted/50 hover:bg-muted focus:bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary`

3. **Category Tabs & Template List** (`Lines 249-314`):
   - Tab bar: `border-b border-gray-100 ... bg-gray-50/40` -> `border-b border-border ... bg-muted/30`
   - Active tab: `bg-white text-gray-900 border-gray-200` -> `bg-card text-foreground border-border`
   - Inactive tab: `text-gray-500 hover:text-gray-800 hover:bg-gray-100/60` -> `text-muted-foreground hover:text-foreground hover:bg-muted`
   - Left pane: `border-r border-gray-150 ... bg-white` -> `border-r border-border ... bg-card`
   - Selected template item: `bg-green-50/70 border border-green-200/80` -> `bg-primary/10 border border-primary/25`
   - Selected text: `text-emerald-950` -> `text-foreground`
   - Unselected text: `text-gray-800` -> `text-foreground`, snippet `text-gray-500` -> `text-muted-foreground`
   - HSM badge: `bg-emerald-100 text-emerald-800` -> `bg-success/15 text-success`

4. **Right Canvas & Actions** (`Lines 317-435`):
   - Right pane: `bg-white` -> `bg-card`
   - Resolved / Raw switch: `bg-gray-100 border border-gray-200` -> `bg-muted border border-border`, active buttons `bg-white text-emerald-950` / `text-amber-950` -> `bg-card text-foreground shadow-2xs`
   - Message canvas: `bg-gray-50/70 border border-gray-200 text-gray-800` -> `bg-muted/50 border border-border text-foreground`
   - Variables form: `bg-gray-50 border-gray-200` -> `bg-muted/50 border-border`, inputs `bg-white border-gray-200 text-gray-800 focus:ring-[#23B750]` -> `bg-background border-input text-foreground focus:ring-primary`
   - Footer: `border-t border-gray-150 bg-white` -> `border-t border-border bg-card`
   - Send Immediately: `text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200` -> `text-primary bg-primary/10 hover:bg-primary/20 border border-primary/25`
   - Insert Draft: `text-white bg-[#23B750] hover:bg-[#1fa346]` -> `text-primary-foreground bg-primary hover:bg-primary/90`

---

### 4.5 Recipe 4: `src/components/omnichannel/OmnichannelTutorialModal.vue` (127 violations -> 0)

1. **Script definitions** (`Lines 58-205`):
   - In `workflowSteps`: `<strong class="text-gray-800">` -> `<strong class="text-foreground">`
   - In `workflowSections`:
     - Morning / Reply / EOD: `color: 'text-[#23B750]', bg: 'bg-[#23B750]/8'` -> `color: 'text-primary', bg: 'bg-primary/10'`
     - Counter / Sections / Menu: `color: 'text-gray-600', bg: 'bg-gray-100'` -> `color: 'text-muted-foreground', bg: 'bg-muted'`
     - Pin / Focus: `color: 'text-amber-500', bg: 'bg-amber-50'` -> `color: 'text-warning', bg: 'bg-warning/10'`
     - Late: `color: 'text-red-500', bg: 'bg-red-50'` -> `color: 'text-destructive', bg: 'bg-destructive/10'`
     - Mine: `color: 'text-blue-500', bg: 'bg-blue-50'` -> `color: 'text-info', bg: 'bg-info/10'`
     - Admin: `color: 'text-violet-500', bg: 'bg-violet-50'` -> `color: 'text-tag-4-foreground', bg: 'bg-tag-4'`
2. **Modal Shell & Header** (`Lines 245-288`):
   - Shell: `bg-white border border-gray-150` -> `bg-card border border-border`
   - Header badge: `bg-[#23B750]/10 text-[#23B750]` -> `bg-primary/10 text-primary`
   - Title: `text-gray-900` -> `text-foreground`
   - Step buttons:
     - Active: `bg-[#23B750]/10 text-[#23B750] border-[#23B750]/25` -> `bg-primary/10 text-primary border-primary/25`
     - Completed: `bg-gray-50 text-gray-500 border-gray-150 hover:bg-gray-100` -> `bg-muted text-muted-foreground border-border hover:bg-accent`
     - Inactive: `bg-white text-gray-400 border-gray-150` -> `bg-card text-muted-foreground border-border`
     - Number badge: `bg-[#23B750] text-white` -> `bg-primary text-primary-foreground`
   - Divider: `bg-gray-100` -> `bg-border`
3. **Carousel & Guide Panels** (`Lines 293-455`):
   - Left image container: `bg-gray-50 border-r border-gray-100` -> `bg-muted/50 border-r border-border`
   - Number indicator: `bg-[#23B750] text-white` -> `bg-primary text-primary-foreground`
   - Active dot: `bg-[#23B750]` -> `bg-primary`, inactive `bg-gray-200 hover:bg-gray-300` -> `bg-muted hover:bg-accent`
   - Tip callout: `bg-amber-50 border-amber-100 text-amber-700` -> `bg-warning/10 border-warning/20 text-warning`
   - Reference cards: `border-gray-100 bg-gray-50/70 hover:bg-gray-50` -> `border-border bg-muted/40 hover:bg-muted`
   - Reference icons container: `bg-white border-gray-150` -> `bg-card border-border`
4. **Footer Buttons** (`Lines 470-482`):
   - Back: `text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-200` -> `text-muted-foreground hover:text-foreground hover:bg-muted border-border`
   - Next / Got it: `isLastStep ? 'bg-[#23B750] text-white hover:bg-[#1fa344]' : 'bg-gray-900 text-white hover:bg-gray-800'` -> `isLastStep ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-foreground text-background hover:bg-foreground/90'`

---

### 4.6 Recipe 5: `src/components/omnichannel/ConversationItem.vue` (335 violations -> 0)

1. **Row Container & Selected State** (`ConversationItem.vue:198-202`):
   ```vue
   <!-- BEFORE -->
   class="flex items-start gap-3 p-3.5 relative cursor-pointer transition-all duration-200 border-b border-gray-100 group select-none"
   :class="[selected ? 'bg-gray-100/70 hover:bg-gray-100/80' : 'bg-white hover:bg-gray-50/80']"
   ...
   <div v-if="selected" class="absolute left-0 top-0 bottom-0 w-[3px] bg-[#23B750]"></div>

   <!-- AFTER -->
   class="flex items-start gap-3 p-3.5 relative cursor-pointer transition-all duration-200 border-b border-border group select-none"
   :class="[selected ? 'bg-muted hover:bg-muted/80' : 'bg-card hover:bg-muted/50']"
   ...
   <div v-if="selected" class="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"></div>
   ```

2. **Hover Quick Actions Bar** (`ConversationItem.vue:205-286`):
   - Shell: `bg-white/95 border-gray-200/90` -> `bg-card/95 border-border`
   - Mark Read/Unread: `item.unreadCount > 0 ? 'text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800' : 'text-[#475569] hover:bg-red-50 hover:text-red-700'` -> `item.unreadCount > 0 ? 'text-destructive bg-destructive/10 hover:bg-destructive/20' : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'`
   - Unread dot: `border-white bg-red-500` -> `border-background bg-destructive`
   - Snooze: `item.isSnoozed ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800' : 'text-[#475569] hover:bg-blue-50 hover:text-blue-700'` -> `item.isSnoozed ? 'text-info bg-info/10 hover:bg-info/20' : 'text-muted-foreground hover:bg-info/10 hover:text-info'`
   - Focus: `item.isFocus ? 'text-violet-700 bg-violet-50 hover:bg-violet-100 hover:text-violet-800' : 'text-[#475569] hover:bg-violet-50 hover:text-violet-700'` -> `item.isFocus ? 'text-tag-4-foreground bg-tag-4 hover:bg-tag-4/80' : 'text-muted-foreground hover:bg-tag-4/20 hover:text-tag-4-foreground'`, `fill-violet-600` -> `fill-tag-4-foreground`
   - Archive: `text-[#475569] hover:bg-orange-50 hover:text-orange-700` -> `text-muted-foreground hover:bg-warning/10 hover:text-warning`
   - More options: `text-[#475569] hover:bg-gray-100 hover:text-gray-900` -> `text-muted-foreground hover:bg-muted hover:text-foreground`

3. **Avatar and Online Dot** (`ConversationItem.vue:290-315`):
   - Avatar image: `border-gray-100` -> `border-border`
   - Online dot: `border-white bg-[#23B750]` -> `border-background bg-success`
   - Offline dot: `border-white bg-gray-400` -> `border-background bg-muted-foreground/60`
   - Checkbox overlay: `checked ? 'bg-[#23B750] border-[#23B750] text-white' : 'bg-white/90 border-gray-300 hover:border-gray-400'` -> `checked ? 'bg-primary border-primary text-primary-foreground' : 'bg-card/90 border-input hover:border-ring'`

4. **Sender, Badges & Unread Count** (`ConversationItem.vue:320-435`):
   - Sender name: `text-gray-900` -> `text-foreground`
   - VIP crown: `text-[#9F5CF8]` -> `text-tag-4-foreground`
   - Priority alerts: High `text-[#EF4444]` -> `text-destructive`, Medium `text-[#F59E0B]` -> `text-warning`, Low `text-[#9CA3AF]` -> `text-muted-foreground`
   - SLA breached Late badge: `text-[#B91C1C] bg-[#FDF2F2] border-[#FDE8E8]` -> `text-destructive bg-destructive/10 border-destructive/20`
   - Focus badge: `text-violet-700 bg-violet-50 border-violet-100` -> `text-tag-4-foreground bg-tag-4 border-border`
   - Tooltip: `bg-gray-900/95 text-white border-white/10` -> `bg-popover text-popover-foreground border-border`
   - Time: `text-gray-500` -> `text-muted-foreground`
   - Message text: `item.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'` -> `item.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground font-normal'`
   - Unread pill: `(item.isUnreadGray || item.isSnoozed) ? 'bg-gray-400 text-white' : 'bg-[#EF4444] text-white'` -> `(item.isUnreadGray || item.isSnoozed) ? 'bg-muted-foreground text-background' : 'bg-destructive text-destructive-foreground'`

5. **Admin Tags & Custom Labels** (`ConversationItem.vue:437-450, 1002-1008`):
   - Custom tags: `text-teal-605 bg-teal-50 border-teal-150` -> `text-tag-2-foreground bg-tag-2 border-border`, `text-orange-605 bg-orange-50` -> `text-tag-5-foreground bg-tag-5 border-border`, `text-blue-655 bg-blue-50` -> `text-tag-1-foreground bg-tag-1 border-border`, `text-yellow-605 bg-yellow-50` -> `text-tag-3-foreground bg-tag-3 border-border`
   - Dots: `bg-teal-500` -> `bg-tag-2-foreground`, `bg-orange-500` -> `bg-tag-5-foreground`, `bg-blue-500` -> `bg-tag-1-foreground`, `bg-yellow-500` -> `bg-tag-3-foreground`
   - Remove hardcoded color classes from `<style scoped>` (`.text-teal-605`, `.text-orange-605`, etc.).

6. **Context Menu** (`ConversationItem.vue:455-998`):
   - Panels: `bg-white border-gray-200` -> `bg-popover border-border text-popover-foreground`
   - Submenus: `bg-white border-gray-200` / `border-gray-150` -> `bg-popover border-border text-popover-foreground`
   - Dividers: `border-gray-100`, `bg-gray-100` -> `border-border`, `bg-border`
   - Agent search input: `bg-gray-50 border-gray-200 focus:bg-white focus:ring-[#23B750]` -> `bg-muted border-input focus:bg-background focus:ring-primary text-foreground placeholder:text-muted-foreground`
   - Agent item active: `bg-green-50/50 border-green-100 text-emerald-950` -> `bg-primary/10 border-primary/20 text-foreground`
   - Delete item: `text-red-500 hover:bg-red-50` -> `text-destructive hover:bg-destructive/10 hover:text-destructive`

---

### 4.7 Recipe 6: `src/views/OmnichannelView.vue` (882 violations -> 0)

1. **Script mock data `logClass` tokens** (`Lines 174, 513, 773, 1200, 1263, 1282, 1319, 1830`):
   - `bg-green-50 text-green-700 border-green-200` -> `bg-success/10 text-success border-success/20`
   - `text-emerald-800 font-semibold bg-emerald-50/90 border-emerald-200 shadow-2xs` -> `text-success font-semibold bg-success/10 border-success/20 shadow-2xs`
   - `bg-blue-50/90 text-blue-700 border-blue-200 shadow-2xs` -> `bg-info/10 text-info border-info/20 shadow-2xs`
   - `bg-rose-50 text-rose-700 border-rose-200` -> `bg-destructive/10 text-destructive border-destructive/20`
   - `text-green-600 font-medium` -> `text-success font-medium`
   - `bg-gray-100 text-gray-700 border-gray-200` -> `bg-muted text-muted-foreground border-border`

2. **Left Panel Shell & Header** (`Lines 1940-2030`):
   - Outer container: `bg-white` -> `bg-background`
   - Left sidebar: `border-r border-gray-200 ... bg-white` -> `border-r border-border ... bg-card`
   - Resizer handle: `hover:bg-[#23B750]/40 active:bg-[#23B750]/60` -> `hover:bg-primary/40 active:bg-primary/60`, line `bg-gray-300` -> `bg-border`
   - Title: `text-gray-900` -> `text-foreground`
   - Counter pill: `bg-gray-100 text-gray-500` -> `bg-muted text-muted-foreground`, unread `text-red-500` -> `text-destructive`, separator `text-gray-300` -> `text-muted-foreground/40`
   - Guide button: `border-gray-200 bg-white text-gray-400 hover:text-[#23B750] hover:border-[#23B750]/40 hover:bg-[#23B750]/5` -> `border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10`
   - Compose button: `border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100` -> `border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted`
   - Search input: `bg-white border-gray-250 placeholder:text-gray-400` -> `bg-background border-input text-foreground placeholder:text-muted-foreground`

3. **Filter Header Row & Bulk Actions** (`Lines 2110-2345`):
   - Bulk select checkbox: `bg-[#23B750] text-white hover:bg-[#1f9f45]` -> `bg-primary text-primary-foreground hover:bg-primary/90`
   - Bulk action buttons: `border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50` -> `border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted`
   - Delete bulk button: `text-red-400 hover:text-red-600 hover:border-red-200` -> `text-destructive hover:text-destructive hover:border-destructive/30`
   - Filter chips:
     - Active: `border-green-200 bg-green-50 text-[#23B750]` -> `border-primary/30 bg-primary/10 text-primary`
     - Inactive: `border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300` -> `border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground`
   - Gradient scroll indicators: `from-white via-white/90 to-transparent` -> `from-card via-card/90 to-transparent`

4. **Floating Switcher Pill** (`Lines 2585-2620`):
   - Container: `bg-white/90 border-gray-200` -> `bg-card/90 border-border`
   - Active mode: `bg-[#23B750] text-white` -> `bg-primary text-primary-foreground`
   - Inactive mode: `text-gray-500 hover:text-gray-800 hover:bg-gray-50` -> `text-muted-foreground hover:text-foreground hover:bg-muted`

5. **Main Chat Top Header** (`Lines 2625-2820`):
   - Header bar: `bg-white border-b border-gray-200` -> `bg-card border-b border-border`
   - Sender title: `text-gray-800` -> `text-foreground`
   - Online dot: `border-white bg-[#23B750]` -> `border-background bg-success`
   - VIP badge: `border-purple-200 bg-purple-50 text-purple-700` -> `border-tag-4 text-tag-4-foreground bg-tag-4`
   - Late badge: `border-[#FDE8E8] bg-[#FDF2F2] text-[#B91C1C]` -> `border-destructive/20 bg-destructive/10 text-destructive`, dot `bg-[#B91C1C]` -> `bg-destructive`
   - Channel pill: `bg-gray-100 text-gray-600` -> `bg-muted text-muted-foreground`
   - Assign dropdown menu: `bg-white border-gray-200` -> `bg-popover border-border text-popover-foreground`, search `bg-gray-50 border-gray-200 focus:bg-white focus:ring-[#23B750]` -> `bg-muted border-input focus:bg-background focus:ring-primary`

6. **Message Canvas & Chat Bubbles** (`Lines 2831-3260`):
   - Canvas background: `bg-gray-50` -> `bg-background`
   - CRM match state cards: `bg-white border-gray-200` -> `bg-card border-border`
   - Chat bubbles:
     ```vue
     <!-- Outgoing User Bubble -->
     :class="[
       msg.isSelf 
         ? (msg.status === 'failed' || msg.status === 'expired'
           ? 'bg-destructive/10 text-destructive border-destructive/20 rounded-tr-sm rounded-bl-2xl rounded-br-2xl' 
           : 'bg-primary text-primary-foreground border-transparent rounded-tr-sm rounded-bl-2xl rounded-br-2xl') 
         : 'bg-muted text-foreground border border-border rounded-tl-sm rounded-bl-2xl rounded-br-2xl'
     ]"
     ```
   - Quoted reply box:
     ```vue
     <!-- Outgoing Quoted Reply -->
     msg.isSelf ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-card text-foreground border border-border/50'
     <!-- Quoted Bar -->
     msg.isSelf ? 'bg-primary-foreground' : 'bg-primary'
     <!-- Quoted Sender -->
     msg.isSelf ? 'text-primary-foreground' : 'text-primary'
     <!-- Quoted Text -->
     msg.isSelf ? 'text-primary-foreground/90' : 'text-muted-foreground'
     ```
   - Outbox double checks: `text-[#23B750]` -> `text-primary`
   - Failed send text: `text-red-500` -> `text-destructive`
   - Jump to latest button: `bg-[#23B750] hover:bg-[#1fa346] text-white` -> `bg-primary hover:bg-primary/90 text-primary-foreground`

7. **Composer / Input Area** (`Lines 3350-3750`):
   - Wrapper:
     ```vue
     :class="[
       isAiDraftCompleteGlow
         ? 'border-primary ring-3 ring-primary/25 bg-primary/5'
         : isAiTypingAnimation
           ? 'border-info/50 ring-2 ring-info/10 bg-card'
           : composerMode === 'note'
             ? 'bg-warning/10 border-warning/30'
             : 'bg-card border-border'
     ]"
     ```
   - Email TO/CC/VIA headers: `border-gray-150 bg-gray-50/20 text-gray-500 text-gray-700` -> `border-border bg-muted/20 text-muted-foreground text-foreground`
   - Typography toolbar: `border-gray-150 bg-gray-55/50` -> `border-border bg-muted/50`
   - Formatting buttons (B, I, U): active `bg-primary text-primary-foreground border-primary` : inactive `bg-card border-border text-foreground hover:bg-muted`
   - Private note formatting buttons: active `bg-warning text-warning-foreground border-warning` : inactive `bg-card border-warning/30 text-foreground hover:bg-warning/10`
   - Send button: `bg-[#23B750] hover:bg-[#1a923f] text-white` -> `bg-primary hover:bg-primary/90 text-primary-foreground`
   - Add note button: `bg-[#1E823B] hover:bg-[#15612c] text-white` -> `bg-warning hover:bg-warning/90 text-warning-foreground`

8. **Teleported Modals in `OmnichannelView.vue`** (`Lines 3775-4015`):
   - `isComposeOpen` modal: `bg-white border-gray-100` -> `bg-card border-border`, inputs `bg-gray-50 border-gray-250` -> `bg-muted border-input text-foreground focus:ring-primary`, buttons `bg-gray-100` -> `bg-muted`, create button `bg-primary text-primary-foreground`
   - `isComposerSummaryOpen` modal: `bg-white border-gray-100` -> `bg-card border-border`, cards `bg-blue-50/20 border-blue-150`, `bg-orange-50/20 border-orange-150`, `bg-green-50/20 border-green-150` -> `bg-info/10 border-info/20`, `bg-warning/10 border-warning/20`, `bg-success/10 border-success/20`, button `bg-[#23B750] text-white` -> `bg-primary text-primary-foreground`
   - `isComposerMeetingOpen` modal: `bg-white border-gray-150` -> `bg-card border-border`, inputs `bg-gray-50 border-gray-250` -> `bg-muted border-input text-foreground focus:ring-primary`, submit `bg-[#23B750] text-white` -> `bg-primary text-primary-foreground`

---

## 5. Verification Method

### 5.1 Verification Commands
Once the migrator implements these recipes, verify Batch 4 with:

```powershell
# 1. Automated zero-violation token audit
node scripts/audit-tokens.cjs --batch 4

# 2. Build and typecheck gate
npm run build
```

### 5.2 File Inspection Checklist
- [ ] `src/views/OmnichannelView.vue`: 0 violations
- [ ] `src/components/omnichannel/ConversationItem.vue`: 0 violations
- [ ] `src/components/omnichannel/OmnichannelTutorialModal.vue`: 0 violations
- [ ] `src/components/omnichannel/TemplatePickerModal.vue`: 0 violations
- [ ] `src/views/webforms/ManageTemplatesView.vue`: 0 violations
- [ ] `src/components/omnichannel/PlatformIcon.vue`: 0 violations

### 5.3 Invalidation Conditions
This investigation report is invalidated if:
1. New files are added to `src/components/omnichannel/` or Omnichannel views without being registered in `scripts/audit-tokens.cjs`.
2. Semantic tokens in `src/assets/index.css` are modified or renamed.
3. Message bubble contrast fails accessibility standards in dark mode.
