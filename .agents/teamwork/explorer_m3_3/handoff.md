# Milestone 3: Holistic Integration Analysis & Implementation Blueprint (Batches 3 & 4)

**Author**: Explorer 3 (Holistic Integration & Blueprint)  
**Date**: 2026-10-31T09:12:00Z  
**Target Milestone**: Milestone 3 — CRM Core & Omnichannel (Batches 3 & 4)  
**Parent Orchestrator**: `57c50def-4689-4a65-86f1-14dce8a95cbf`  
**Working Directory**: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_3\`  

---

## 1. Observation

### 1.1 Baseline Build Status
Baseline build was verified using `cmd.exe /c "npm run build"` (`vue-tsc -b && vite build`):
- **Exit Code**: `0` (Success)
- **Duration**: `4.38s`
- **Modules Transformed**: `2,961`
- **Output Bundle**: `dist/index.html` (1.51 kB), `dist/assets/index-kw3yr6vP.css` (407.04 kB), `dist/assets/index-cMt3WNHy.js` (2,362.81 kB), plus route chunks.
- **TypeScript & Build Errors**: Exactly `0`. The repository compiles cleanly.

### 1.2 Baseline Token Audit: Batch 3 (CRM Core)
Execution of `node scripts/audit-tokens.cjs --batch 3`:
- **Exit Code**: `1` (Failing due to raw color violations)
- **Scanned Files**: 8 files
- **Total Violations**: **4,634 violations** across all 8 files:

| # | File Path | Total Violations | Palette Grays | Arbitrary Hex | `dark:` Overrides | Raw Status Colors |
|---|-----------|------------------|---------------|---------------|-------------------|-------------------|
| 1 | `src/views/DashboardView.vue` | **1,345** | 762 | 148 | 389 | 46 |
| 2 | `src/views/DealsView.vue` | **742** | 412 | 114 | 0 | 216 |
| 3 | `src/views/ContactsView.vue` | **476** | 185 | 9 | 177 | 105 |
| 4 | `src/components/omnichannel/ContactDrawer.vue` | **542** | 338 | 51 | 0 | 153 |
| 5 | `src/components/omnichannel/FiltersModal.vue` | **251** | 196 | 5 | 0 | 50 |
| 6 | `src/views/CompaniesView.vue` | **21** | 21 | 0 | 0 | 0 |
| 7 | `src/views/CalendarView.vue` | **221** | 137 | 0 | 18 | 66 |
| 8 | `src/views/EventsView.vue` | **1,036** | 464 | 7 | 403 | 162 |
| **Total** | **Batch 3 (CRM Core)** | **4,634** | **2,626** | **333** | **987** | **688** |

### 1.3 Baseline Token Audit: Batch 4 (Omnichannel)
Execution of `node scripts/audit-tokens.cjs --batch 4`:
- **Exit Code**: `1` (Failing due to raw color violations)
- **Scanned Files**: 6 files
- **Total Violations**: **1,487 violations** across all 6 files:

| # | File Path | Total Violations | Palette Grays | Arbitrary Hex | Raw Status Colors | Inline Styles | `dark:` Overrides |
|---|-----------|------------------|---------------|---------------|-------------------|---------------|-------------------|
| 1 | `src/views/OmnichannelView.vue` | **882** | 605 | 132 | 145 | 0 | 0 |
| 2 | `src/components/omnichannel/ConversationItem.vue` | **335** | 201 | 53 | 81 | 0 | 0 |
| 3 | `src/components/omnichannel/OmnichannelTutorialModal.vue` | **127** | 88 | 26 | 13 | 0 | 0 |
| 4 | `src/components/omnichannel/TemplatePickerModal.vue` | **92** | 71 | 5 | 16 | 0 | 0 |
| 5 | `src/views/webforms/ManageTemplatesView.vue` | **10** | 3 | 0 | 7 | 0 | 0 |
| 6 | `src/components/omnichannel/PlatformIcon.vue` | **41** | 7 | 0 | 32 | 2 | 0 |
| **Total** | **Batch 4 (Omnichannel)** | **1,487** | **974** | **216** | **295** | **2** | **0** |

**Combined Milestone 3 Total**: **6,121 violations across 14 files**.

### 1.4 Codemod Testing & Efficacy (`scripts/codemod-tokens.cjs --dry-run`)
Dry-run testing was executed against both batches:
- `node scripts/codemod-tokens.cjs --batch 3 --dry-run`:
  - `src/views/DashboardView.vue`: 253 replacements
  - `src/views/DealsView.vue`: 70 replacements
  - `src/views/ContactsView.vue`: 70 replacements
  - `src/components/omnichannel/ContactDrawer.vue`: 7 replacements
  - `src/components/omnichannel/FiltersModal.vue`: 28 replacements
  - `src/views/CalendarView.vue`: 2 replacements
  - `src/views/EventsView.vue`: 173 replacements
  - **Batch 3 Automated**: **603 replacements** (13.0% of Batch 3 violations).
- `node scripts/codemod-tokens.cjs --batch 4 --dry-run`:
  - `src/views/OmnichannelView.vue`: 66 replacements
  - `src/components/omnichannel/ConversationItem.vue`: 16 replacements
  - `src/components/omnichannel/OmnichannelTutorialModal.vue`: 14 replacements
  - `src/components/omnichannel/TemplatePickerModal.vue`: 3 replacements
  - `src/components/omnichannel/PlatformIcon.vue`: 5 replacements
  - **Batch 4 Automated**: **104 replacements** (7.0% of Batch 4 violations).
- **Combined Automated Potential**: **707 replacements** across 12 files (11.5%).
- **Manual / Precision Requirement**: **5,414 violations** (88.5%) require structural understanding, categorical tag assignment (`--tag-1` through `--tag-6`), modal backdrop scrims, table row styling, and interactive component state mappings.

### 1.5 Shared UI Patterns Survey
Analysis across both batches reveals four universal UI patterns that span CRM Core and Omnichannel:
1. **Categorical Tag & Pill System**:
   - `DealsView.vue`: 8 Kanban pipeline stages (`New`, `Acknowledged`, `Qualifying`, `Proposal / Quotation`, `Follow Up`, `Won`, `Lost`, `Archived`).
   - `CalendarView.vue`: 6 event categories (`work`, `personal`, `design`, `marketing`, `client`, `team`).
   - `ContactDrawer.vue` & `ConversationItem.vue`: Lead temperature tags (`Hot`, `Warm`, `Cold`), Priority tags (`High`, `Medium`, `Low`), and custom labels (`VIP-Tier`, `Temp-Warm`, `Enterprise`).
   - `PlatformIcon.vue`: Channel badge container pills (WhatsApp, Messenger, Instagram, Telegram, LinkedIn, Email, LiveChat, Facebook, Webform, SMS).
2. **Card Surfaces & List Items**:
   - Kanban deal cards (`DealsView.vue`), conversation thread items (`ConversationItem.vue`), contact detail tiles (`ContactDrawer.vue`), and dashboard metric summary cards (`DashboardView.vue`).
   - Shared structure: elevated `bg-card border-border text-foreground hover:bg-accent/50`.
3. **Modals and Drawers**:
   - Four major dialogs/drawers: `FiltersModal.vue`, `ContactDrawer.vue`, `OmnichannelTutorialModal.vue`, `TemplatePickerModal.vue`.
   - Shared backdrop: `fixed inset-0 bg-background/80 backdrop-blur-sm z-50`.
   - Shared container: `bg-card text-card-foreground border-border shadow-2xl rounded-2xl`.
4. **Table Layouts**:
   - Tabular layouts in `CompaniesView.vue`, `ContactsView.vue`, `EventsView.vue`, and list views in `DealsView.vue` and `ManageTemplatesView.vue`.
   - Standard structure: `bg-card border-border`, header `bg-muted/50 text-muted-foreground border-b border-border`, row `hover:bg-muted/30 transition-colors divide-y divide-border`.

---

## 2. Logic Chain

### 2.1 Unified Token Architecture for CRM & Omnichannel
1. **Observation 1.4 & 1.5**: In Milestone 1 and Milestone 2, foundation tokens (`index.css`) and App Shell tokens were successfully deployed. Milestone 3 components currently mix raw Tailwind palette grays (`gray-50`, `gray-100`, `gray-200`, `gray-800`, `gray-900`), hardcoded brand hexes (`#23B750`, `#1a943e`, `#3b82f6`, `#00D2C4`), raw status colors (`bg-green-50`, `text-emerald-700`), and 987 redundant `dark:` class overrides.
2. **Logic Step**: According to `AGENTS.md`, all styling must flow from a single source of truth (`:root` and `.dark` in `index.css`). Components must never use raw colors or `dark:` overrides. By mapping all raw styles to standard semantic tokens, components automatically adapt to light and dark themes with zero manual toggling logic.

### 2.2 Categorical Tag Token Mapping (`--tag-1` through `--tag-6`)
1. **Observation 1.2, 1.4, 1.5**:
   - `src/assets/index.css` defines `--tag-1` through `--tag-6` with light/dark bg+fg pairs:
     - `--tag-1`: Blue / Indigo channel (`oklch(0.95 0.04 240)` / dark `oklch(0.25 0.06 245)`)
     - `--tag-2`: Emerald / Mint channel (`oklch(0.95 0.05 150)` / dark `oklch(0.25 0.07 150)`)
     - `--tag-3`: Amber / Yellow channel (`oklch(0.95 0.06 75)` / dark `oklch(0.27 0.07 70)`)
     - `--tag-4`: Purple / Violet channel (`oklch(0.95 0.05 300)` / dark `oklch(0.26 0.08 300)`)
     - `--tag-5`: Orange / Rose channel (`oklch(0.95 0.05 25)` / dark `oklch(0.26 0.08 25)`)
     - `--tag-6`: Teal / Cyan channel (`oklch(0.95 0.05 195)` / dark `oklch(0.25 0.06 195)`)
2. **Kanban Pipeline Mapping (`DealsView.vue:870-879`)**:
   - Currently:
     ```ts
     const stageColors: Record<string, { border: string; bg: string; text: string; headerBar: string }> = {
       New: { border: 'border-t-[#3b82f6]', bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', headerBar: 'bg-[#3b82f6]' },
       Acknowledged: { border: 'border-t-[#00D2C4]', bg: 'bg-[#00D2C4]/10', text: 'text-[#00D2C4]', headerBar: 'bg-[#00D2C4]' },
       Qualifying: { border: 'border-t-[#FFCC00]', bg: 'bg-[#FFCC00]/10', text: 'text-[#FFCC00]', headerBar: 'bg-[#FFCC00]' },
       'Proposal / Quotation': { border: 'border-t-[#FF8800]', bg: 'bg-[#FF8800]/10', text: 'text-[#FF8800]', headerBar: 'bg-[#FF8800]' },
       'Follow Up': { border: 'border-t-[#10B981]', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', headerBar: 'bg-[#10B981]' },
       Won: { border: 'border-t-[#23B750]', bg: 'bg-[#23B750]/10', text: 'text-[#168638]', headerBar: 'bg-[#23B750]' },
       Lost: { border: 'border-t-red-500', bg: 'bg-red-50', text: 'text-red-600', headerBar: 'bg-red-500' },
       Archived: { border: 'border-t-slate-400', bg: 'bg-slate-100', text: 'text-slate-600', headerBar: 'bg-slate-400' }
     }
     ```
   - Standardized Token Recipe:
     ```ts
     const stageColors: Record<string, { border: string; bg: string; text: string; headerBar: string }> = {
       New: { border: 'border-t-tag-1', bg: 'bg-tag-1', text: 'text-tag-1-foreground', headerBar: 'bg-tag-1' },
       Acknowledged: { border: 'border-t-tag-6', bg: 'bg-tag-6', text: 'text-tag-6-foreground', headerBar: 'bg-tag-6' },
       Qualifying: { border: 'border-t-tag-3', bg: 'bg-tag-3', text: 'text-tag-3-foreground', headerBar: 'bg-tag-3' },
       'Proposal / Quotation': { border: 'border-t-tag-5', bg: 'bg-tag-5', text: 'text-tag-5-foreground', headerBar: 'bg-tag-5' },
       'Follow Up': { border: 'border-t-tag-2', bg: 'bg-tag-2', text: 'text-tag-2-foreground', headerBar: 'bg-tag-2' },
       Won: { border: 'border-t-success', bg: 'bg-success/10', text: 'text-success', headerBar: 'bg-success' },
       Lost: { border: 'border-t-destructive', bg: 'bg-destructive/10', text: 'text-destructive', headerBar: 'bg-destructive' },
       Archived: { border: 'border-t-muted-foreground', bg: 'bg-muted', text: 'text-muted-foreground', headerBar: 'bg-muted-foreground' }
     }
     ```
   - Header Bar & Column Drop Highlight:
     - In `DealsView.vue:1626` & `1631`, replace inline style string concatenations with token classes:
       - Header stripe: `:class="stageColors[stage]?.headerBar || 'bg-tag-1'"`
       - Dragged over indicator: `:class="draggedOverStage === stage ? ['border-2 border-dashed rounded-2xl', stageColors[stage]?.border, stageColors[stage]?.bg] : ''"`
3. **Calendar Event Categories (`CalendarView.vue:286-302`)**:
   - `work` -> `bg-tag-4 text-tag-4-foreground border-tag-4`
   - `personal` -> `bg-tag-2 text-tag-2-foreground border-tag-2`
   - `design` -> `bg-tag-1 text-tag-1-foreground border-tag-1`
   - `marketing` -> `bg-tag-6 text-tag-6-foreground border-tag-6`
   - `client` -> `bg-tag-5 text-tag-5-foreground border-tag-5`
   - `team` -> `bg-tag-3 text-tag-3-foreground border-tag-3`
   - Completely removes 18 manual `dark:*` overrides while ensuring crisp WCAG contrast in both themes.
4. **Lead Temperature & Priority Badges (`ContactDrawer.vue:130-175`)**:
   - `Hot` -> `bg-destructive/10 text-destructive border-destructive/20`
   - `Warm` -> `bg-warning/10 text-warning border-warning/20`
   - `Cold` -> `bg-info/10 text-info border-info/20`
   - `High / Urgent` -> `bg-destructive/10 text-destructive border-destructive/20`
   - `Medium` -> `bg-warning/10 text-warning border-warning/20`
   - `Low` -> `bg-muted text-muted-foreground border-border`

### 2.3 Modal & Drawer Scrim Tokenization
1. **Observation 1.5**: In Milestone 2, UI primitive overlays (`DialogContent.vue`, `DrawerOverlay.vue`, etc.) were migrated to `bg-background/80 backdrop-blur-sm`.
2. **Logic Step**: In Milestone 3, all 4 modal/drawer components (`FiltersModal.vue:379`, `OmnichannelTutorialModal.vue:246`, `TemplatePickerModal.vue:191`, `ContactDrawer.vue:891`):
   - Replace `bg-black/40 backdrop-blur-xs` and `bg-slate-900/40` with `bg-background/80 backdrop-blur-sm`.
   - Replace card containers `bg-white border-gray-200` with `bg-card border-border text-card-foreground shadow-2xl`.
   - Teleported floating popovers (`FiltersModal.vue:745`, emoji and file pickers) must use `bg-popover text-popover-foreground border-border shadow-xl`.

### 2.4 Chat Bubble Contrast & Omnichannel Composer States
1. **Observation 1.3 & 1.5**: `OmnichannelView.vue` and `ConversationItem.vue` currently have zero `dark:` classes and rely heavily on hardcoded white/slate backgrounds.
2. **Chat Bubble Logic**:
   - Outbound / Self Message (`msg.isSelf`):
     - Standard: `bg-primary text-primary-foreground border-transparent`
     - Delivery Failed / Expired: `bg-destructive/10 text-destructive border-destructive/20`
   - Inbound / Customer Message:
     - Standard: `bg-card text-card-foreground border-border`
   - Quoted WhatsApp Box:
     - Inside self bubble: `bg-primary-foreground/15 text-primary-foreground`
     - Inside inbound bubble: `bg-muted text-foreground`
   - Audio message waveform:
     - Played bars: `bg-primary`
     - Unplayed bars: `bg-muted`
     - Play button: `bg-primary text-primary-foreground hover:bg-primary/90`
3. **Composer Modes**:
   - Normal reply: `bg-card border-border text-foreground`
   - Internal Note: `bg-warning/10 border-warning/30 text-foreground`
   - AI drafting active: `border-info/50 ring-2 ring-info/10 bg-card`
   - Formatting toolbar: `bg-muted/40 border-b border-border`
   - Textarea: `bg-transparent text-foreground placeholder:text-muted-foreground`

### 2.5 Data Table Standard Specification
1. **Observation 1.2 & 1.5**: Tabular data across `CompaniesView.vue`, `ContactsView.vue`, and `EventsView.vue`:
2. **Unified Specification**:
   - Table wrapper: `bg-card rounded-2xl border border-border overflow-hidden`
   - Header `<thead>`: `bg-muted/50 text-muted-foreground border-b border-border text-xs font-semibold uppercase tracking-wide`
   - Row `<tr>`: `hover:bg-muted/30 transition-colors group divide-y divide-border`
   - Primary text: `font-semibold text-foreground`
   - Secondary text / IDs: `text-muted-foreground font-mono`
   - Actions: `text-muted-foreground hover:text-foreground`
   - Pagination bar: `border-t border-border bg-muted/20 text-muted-foreground text-xs`

### 2.6 Automation vs Manual Precision Boundary
- **Phase 1 (Automated Codemod)**: Run `node scripts/codemod-tokens.cjs --batch 3` and `--batch 4` to eliminate straightforward pairs (~707 violations).
- **Phase 2 (Manual Precision)**: Focus on the 5,414 violations requiring domain context:
  - `DealsView.vue`: Stage colors and column dynamic styles.
  - `CalendarView.vue`: Event category classes.
  - `ContactDrawer.vue` & `FiltersModal.vue`: Tag suggestion chips, drawer slide-over, teleported menus.
  - `PlatformIcon.vue`: Channel badge container styles and SVG fill bindings.
  - `OmnichannelView.vue` & `ConversationItem.vue`: Chat feed, transcript bubbles, composer states, unread counters.
  - `DashboardView.vue` & `EventsView.vue`: Metric cards, filter headers, table views, eliminating remaining `dark:` overrides.

---

## 3. Caveats

1. **ApexCharts Theming in `DashboardView.vue`**:
   - `DashboardView.vue` contains 18 ApexCharts instances. Milestone 6 specifically implements dynamic chart theming via `useChartTheme.ts`.
   - **Crucial Boundary**: For Milestone 3, all HTML elements, card containers, stat cards, metric pills, badges, and layout grids in `DashboardView.vue` must be tokenized to pass the token audit. Chart JavaScript configuration objects will be wired to CSS variable resolvers in Milestone 6.
2. **Platform Icons & Brand Compliance**:
   - In `PlatformIcon.vue`, brand colors (WhatsApp `#25D366`, Facebook `#1877F2`, etc.) are recognized platform identities. For the `badge` variant, the container background and text should map to semantic tokens (`success`, `info`, `tag-*`), while the standalone SVG icon fill can preserve normalized brand colors or fall back to `currentColor` / `var(--primary)`.
3. **No Component-Level `dark:` Overrides**:
   - The worker must strictly avoid introducing any `dark:*` classes. If a component looks poorly contrasted in dark mode, the fix belongs in `.dark` in `src/assets/index.css`, not the component.
4. **File Path Reference**:
   - Note that `ContactDrawer.vue` and `FiltersModal.vue` reside in `src/components/omnichannel/`, but are audited under Batch 3 (CRM Core) as designated in `scripts/audit-tokens.cjs` and `PROJECT.md`.

---

## 4. Conclusion & Implementation Blueprint

Milestone 3 analysis is complete. To migrate Batches 3 & 4 with zero regressions and achieve 100% audit compliance, the Worker should execute the following 5-phase blueprint:

### Phase 1: Automated Codemod Foundation Pass
1. Run `node scripts/codemod-tokens.cjs --batch 3` (replaces ~603 violations).
2. Run `node scripts/codemod-tokens.cjs --batch 4` (replaces ~104 violations).
3. Verify build sanity: `cmd.exe /c "npm run build"`.

### Phase 2: Shared Omnichannel Components Migration (Batch 4 Support Files)
Migrate the isolated support components first:
1. **`src/components/omnichannel/PlatformIcon.vue`** (41 violations):
   - Replace `badgeContainerClasses` raw status colors with `success/10`, `info/10`, `tag-*`, and `warning/10`.
   - Replace `border-white`, `text-gray-700` with `border-card`, `text-foreground`.
   - Replace fallback `#23B750` with `var(--primary)`.
2. **`src/views/webforms/ManageTemplatesView.vue`** (10 violations):
   - Replace `text-emerald-600` with `text-primary`.
   - Replace `bg-blue-500` with `bg-info`.
   - Tokenize template status pills (`bg-success/10 text-success border-success/20`).
3. **`src/components/omnichannel/OmnichannelTutorialModal.vue`** (127 violations):
   - Backdrop to `bg-background/80 backdrop-blur-sm`.
   - Container to `bg-card border-border text-foreground`.
   - Step tabs to `bg-primary/10 text-primary border-primary/25` (active) / `bg-muted text-muted-foreground border-border` (completed) / `bg-card text-muted-foreground border-border` (upcoming).
4. **`src/components/omnichannel/TemplatePickerModal.vue`** (92 violations):
   - Backdrop to `bg-background/80 backdrop-blur-sm`.
   - Card to `bg-card border-border text-card-foreground`.
   - Search input to `bg-muted/50 border-input text-foreground placeholder:text-muted-foreground`.
5. **`src/components/omnichannel/FiltersModal.vue`** (251 violations):
   - Backdrop to `bg-background/80 backdrop-blur-sm`.
   - Main dialog and teleported floating dropdowns to `bg-popover border-border text-popover-foreground`.
   - Filter pills to unselected `bg-card border-border text-foreground` / selected `bg-primary text-primary-foreground border-primary`.
6. **`src/components/omnichannel/ContactDrawer.vue`** (542 violations):
   - Drawer container: `border-l border-border bg-card text-card-foreground`.
   - Status, temperature, and priority options mapped to semantic tokens (`success`, `warning`, `destructive`, `info`).
   - Accordions and list/grid switchers to `text-muted-foreground hover:bg-muted`.

### Phase 3: CRM Core Views Migration (Batch 3)
1. **`src/views/CompaniesView.vue`** (21 violations):
   - Tokenize title (`text-foreground`), controls (`bg-card border-border`), search input (`bg-muted/50 border-input`), table header (`bg-muted/50 border-border`), and rows (`hover:bg-muted/30`).
2. **`src/views/CalendarView.vue`** (221 violations):
   - Replace `getCategoryClasses` with categorical tag tokens (`--tag-1` through `--tag-6`).
   - Replace calendar grid borders with `border-border`, cell hover `hover:bg-muted/50`, active day `bg-primary text-primary-foreground`.
   - Remove all 18 `dark:*` overrides.
3. **`src/views/DealsView.vue`** (742 violations):
   - Rebind `stageColors` to `--tag-1` through `--tag-6`, `--success`, `--destructive`, and `--muted`.
   - Replace inline style borders in Kanban columns with CSS token classes.
   - Tokenize deal cards: `bg-card border-border hover:border-primary/50 text-foreground`.
   - Value badge: `bg-muted border-border text-foreground`.
4. **`src/views/ContactsView.vue`** (476 violations):
   - Remove 177 `dark:*` overrides.
   - Tokenize customer status badges (`success/10`, `info/10`, `warning/10`, `muted`).
   - Align table header and row hovering with standard table layout.
5. **`src/views/EventsView.vue`** (1,036 violations):
   - Remove 403 `dark:*` overrides.
   - Tokenize event ticket status pills, scanner modal, and table views with `bg-card`, `bg-muted`, `border-border`.
6. **`src/views/DashboardView.vue`** (1,345 violations):
   - Tokenize metric cards (`bg-card border-border`), headers, tabs, and tables.
   - Remove 389 `dark:*` overrides.
   - Leave JS ApexCharts configs intact for Milestone 6.

### Phase 4: Omnichannel Feed & Message View Migration (Batch 4 Core)
1. **`src/components/omnichannel/ConversationItem.vue`** (335 violations):
   - Tokenize item container (`selected ? 'bg-muted/70 hover:bg-muted' : 'bg-card hover:bg-accent/50'`).
   - Left active bar: `bg-primary`.
   - Unread count pill: `bg-destructive text-destructive-foreground` or `bg-destructive/10 text-destructive`.
   - Contact name: `text-foreground font-semibold`; snippet/timestamp: `text-muted-foreground`.
2. **`src/views/OmnichannelView.vue`** (882 violations):
   - Root layout: `bg-background text-foreground`.
   - Conversation sidebar: `border-r border-border bg-card` (or `bg-sidebar`).
   - Chat transcript area: `bg-background/50`.
   - Chat bubbles: self `bg-primary text-primary-foreground` / customer `bg-card border-border text-foreground` / failed `bg-destructive/10 text-destructive border-destructive/20`.
   - Composer: `bg-card border-border` in reply mode, `bg-warning/10 border-warning/30` in note mode.
   - Email header inputs & typography toolbar: `border-border bg-muted/40 text-foreground`.
   - Popovers: emoji and attachment popovers to `bg-popover border-border shadow-xl`.

### Phase 5: Verification & Gate Pass
1. Audit Batch 3: `node scripts/audit-tokens.cjs --batch 3` -> Must return exit code `0` (0 violations).
2. Audit Batch 4: `node scripts/audit-tokens.cjs --batch 4` -> Must return exit code `0` (0 violations).
3. Production Build: `cmd.exe /c "npm run build"` -> Must pass with exit code `0` (0 TypeScript / Vite errors).

---

## 5. Verification Method

To independently reproduce and verify this investigation:

1. **Verify Current Baseline Build**:
   ```powershell
   cmd.exe /c "npm run build"
   ```
   *Expected output*: Exit code 0, 0 compilation errors.

2. **Verify Batch 3 Baseline Audit**:
   ```powershell
   node scripts/audit-tokens.cjs --batch 3
   ```
   *Expected output*: 4,634 violations across 8 files (Exit code 1).

3. **Verify Batch 4 Baseline Audit**:
   ```powershell
   node scripts/audit-tokens.cjs --batch 4
   ```
   *Expected output*: 1,487 violations across 6 files (Exit code 1).

4. **Verify Codemod Dry-Run Efficacy**:
   ```powershell
   node scripts/codemod-tokens.cjs --batch 3 --dry-run
   node scripts/codemod-tokens.cjs --batch 4 --dry-run
   ```
   *Expected output*: 603 replacements in Batch 3, 104 replacements in Batch 4.

5. **Milestone 3 Invalidation Conditions**:
   - Any raw color class (`text-white`, `bg-black`, `bg-gray-*`, `text-emerald-*`, `dark:*`) remaining in any of the 14 target files will invalidate the milestone audit gate.
   - Any build error (`vue-tsc` failure or Vite bundle failure) will invalidate the implementation.
