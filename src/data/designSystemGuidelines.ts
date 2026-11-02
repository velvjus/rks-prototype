export const rakanSalesGuidelinesMarkdown = `# RakanSales CRM — Design System Reference & System Prompt (Nova v4.0)

> Use this document as the system prompt or design guideline when building new pages, features, or drafting UI mockups for RakanSales CRM.

---

## 1. Product Identity & Overview

- **Product Name**: RakanSales CRM
- **Design System Version**: Nova v4.0
- **Platform**: Web (Desktop-first SaaS with responsive tablet/mobile workflows)
- **Tech Stack**: Vue 3 SFC (\`<script setup lang="ts">\`), TypeScript, Tailwind CSS v4 (\`@theme inline\`), Shadcn/Vue & Radix Vue primitives, Lucide & Iconify icons, ApexCharts & Unovis.
- **Aesthetic**: Modern, high-density B2B sales automation CRM. Clean, compact, action-oriented, with high-contrast accessibility (WCAG AA compliant) and subtle spring micro-interactions.
- **Theme Support**: First-class Light and Dark Mode via token-based architecture.

---

## 2. Core Theming Architecture & Single Source of Truth

All styling in RakanSales must flow from a single source of truth: the CSS variables in \`src/assets/index.css\` (\`:root\` for light mode, \`.dark\` for dark mode) mapped via Tailwind CSS v4 \`@theme inline\` and \`tailwind.config.js\`.

### Strict Theming Rules
1. **Semantic Token Classes Only**: Always use semantic tokens (e.g. \`bg-background\`, \`bg-card\`, \`bg-muted\`, \`bg-popover\`, \`text-foreground\`, \`text-muted-foreground\`, \`border-border\`, \`border-input\`, \`ring-ring\`, \`bg-primary\`, \`text-primary-foreground\`, \`bg-destructive\`, \`bg-rail\`).
2. **Zero Raw Colors**:
   - **No raw palette grays/neutrals**: Never use raw white, black, gray-*, slate-*, zinc-*, neutral-*, or stone-* classes.
   - **No hex/rgb values in classes or inline styles**: Never use hardcoded hex classes (e.g. #23B750, #111827), inline hex styles, or rgba values.
   - **No raw status colors**: Never use raw status color classes (e.g. green-100, red-600, amber-50, blue-500). Use semantic status tokens with opacity modifiers (e.g. \`bg-success/10 text-success border-success/20\`).
3. **No \`dark:\` Color Overrides**: Never write dark: modifier classes in components. The semantic token itself adapts automatically between light and dark modes in \`index.css\`.
4. **JS & Chart Theming**: Charts (ApexCharts, Unovis) and canvas elements must read colors from CSS variables (e.g. via \`getComputedStyle\` / \`useChartTheme.ts\`) and reactively update on theme change — never hardcode hex values in chart options.

### Canonical Token Catalog

| Token / Variable | Utility Classes | Role & Usage |
|---|---|---|
| **Base Primary** (\`--primary\`) | \`bg-primary text-primary-foreground hover:bg-primary/90\` | Solid primary action buttons, active navigation states, filled badges. Guaranteed 4.5:1+ contrast. |
| **Brand Accent** (\`--brand\`) | \`bg-brand text-brand-foreground\` | Logomarks, active left border highlights, focus rings, hover indicators, WhatsApp outgoing chat bubbles. |
| **Brand Secondary** (\`--brand-secondary\`) | \`bg-brand-secondary text-brand-secondary-foreground\` | Brand gradient endpoint and secondary accent accents. |
| **Success** (\`--success\`) | \`bg-success/10 text-success border-success/20\` | Positive trends, deal won states, SLA met, active online indicators. |
| **Warning** (\`--warning\`) | \`bg-warning/10 text-warning border-warning/20\` | Pending states, 80%+ quota warnings, attention tags, internal private notes. |
| **Info** (\`--info\`) | \`bg-info/10 text-info border-info/20\` | Information alerts, timeline dots, system sync notifications. |
| **Destructive** (\`--destructive\`) | \`bg-destructive text-destructive-foreground\` | Destructive CTAs, delete confirmations, critical SLA breaches, unread count badges. |
| **Outer Rail** (\`--rail\`) | \`bg-rail text-rail-foreground\` | Invariant dark navigation rail (retains dark aesthetic in both light and dark modes). |
| **Outer Rail Active** (\`--rail-active\`) | \`bg-rail-active text-rail-foreground\` | Active and hovered item background on outer navigation rail. |
| **Outer Rail Muted** (\`--rail-muted-foreground\`) | \`text-rail-muted-foreground\` | Inactive icons and secondary labels on outer navigation rail. |
| **Outer Rail Border** (\`--rail-border\`) | \`border-rail-border\` | Subtle divider between rail sections. |
| **Page Canvas** (\`--background\`) | \`bg-background text-foreground\` | Application canvas base background. |
| **Card Surface** (\`--card\`) | \`bg-card text-foreground border-border\` | Widget and table surface backgrounds, modals, dropdowns. |
| **Dividers & Borders** (\`--border\`) | \`border-border\` | Clean dividers and card borders. |
| **Muted Surfaces** (\`--muted\`) | \`bg-muted text-muted-foreground\` | Form field backgrounds, table headers, inactive pills. |
| **Muted Text** (\`--muted-foreground\`) | \`text-muted-foreground\` | Helper text, secondary metadata, timestamps, subtitles. |
| **Body Text** (\`--foreground\`) | \`text-foreground\` | Primary body text and headings. |

### Categorical Pipeline Tag Tokens
For CRM pipeline stages, categorical badges, and status chips, use paired background and foreground tag tokens:
- **Stage 1 (New)**: \`bg-tag-1 text-tag-1-foreground border-t-tag-1\`
- **Stage 2 (Acknowledged)**: \`bg-tag-2 text-tag-2-foreground border-t-tag-2\`
- **Stage 3 (Qualifying)**: \`bg-tag-3 text-tag-3-foreground border-t-tag-3\`
- **Stage 4 (Proposal / Quotation)**: \`bg-tag-4 text-tag-4-foreground border-t-tag-4\`
- **Stage 5 (Follow Up)**: \`bg-tag-5 text-tag-5-foreground border-t-tag-5\`
- **Stage 6 (Custom / Other)**: \`bg-tag-6 text-tag-6-foreground border-t-tag-6\`

---

## 3. Typography & Sizing Hierarchy

- **Primary Font**: \`Inter Variable\` (\`font-sans\`).
- **Data / Metrics Font**: \`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace\` (\`font-mono\`). Used for currency values (\`RM XX,XXX\`), timestamps, coordinates, phone numbers, and code.

| Style | Tailwind Classes | Usage |
|---|---|---|
| **Page Heading** | \`text-2xl md:text-3xl font-bold text-foreground tracking-tight\` | Top-level page titles |
| **Section Title** | \`text-lg font-bold text-foreground tracking-tight\` | Main card & drawer headers |
| **Card Subheading** | \`text-sm font-semibold text-foreground\` | Widget titles, modal headings |
| **Standard Body** | \`text-sm text-muted-foreground leading-relaxed\` | Default body copy, descriptions |
| **Dense Table / Data** | \`text-xs text-foreground font-medium\` | Table rows, input field values |
| **Micro Labels / Tags** | \`text-[10px] font-bold uppercase tracking-wider text-muted-foreground\` | Category badges, column headers |
| **Monospace Numbers** | \`font-mono text-xs md:text-sm font-semibold text-foreground\` | Currency amounts (\`RM 90,000\`), timestamps, IDs |

---

## 4. App Shell & Layout Blueprint

RakanSales follows a **Dual-Rail + Content Canvas** architecture:

\`\`\`
+-----------------------------------------------------------------------------------------+
| [Outer Rail: bg-rail w-16/w-56] | [Inner Sidebar: w-60 bg-card] | [Top Nav Bar: h-16 bg-card]   |
|                                 |                               +-------------------------------+
| - Brand Logomark                | - Contextual Sub-nav          | Breadcrumb / Bell / User Avatar |
| - Omnichannel                   | - Filters & Categories        +-------------------------------+
| - Companies                     | - Search field                | [Scrollable Canvas: flex-1]   |
| - Contacts (Accordion)          |                               |                               |
| - Add-ons                       | (Dismissible)                 |  <RouterView />               |
| - Collapse Toggle / Theme       |                               |                               |
+-----------------------------------------------------------------------------------------+
\`\`\`

1. **Outer Rail (\`bg-rail text-rail-foreground\`)**: Expandable between icon-only (\`w-16\`) and expanded with labels (\`w-56\`). Uses dedicated rail tokens so it maintains a sleek dark aesthetic in both light and dark themes.
2. **Inner Sidebar (\`w-60 bg-card border-r border-border\`)**: Contextual sub-navigation for module views. Dismissible with collapse button.
3. **Top Header (\`h-16 bg-card border-b border-border\`)**: Contains dynamic breadcrumbs, quick sidebar re-opener, notifications with unread badge, theme toggle, and user avatar.
4. **Content Canvas**: \`flex-1 h-full overflow-y-auto bg-background p-4 lg:p-6 scroll-smooth\`.

---

## 5. UI Density & Corner Radius Standards

- **Default Border Radius**: \`--radius: 0.625rem\` (~10px) on standard cards, \`rounded-xl\` (12px) on buttons/inputs, \`rounded-2xl\` (16px) on major cards, \`rounded-full\` on chips/avatars.
- **Density Scaling**:
  - **Compact**: \`p-4 space-y-4 text-xs\`, inputs \`h-8 text-xs\`, table rows \`py-1.5\`. Best for high-volume data grids.
  - **Standard**: \`p-6 space-y-6 text-sm\`, inputs \`h-9.5 text-xs\`, table rows \`py-2.5\`. Default CRM layout.
  - **Comfortable**: \`p-8 space-y-8 text-base\`, inputs \`h-11 text-sm\`, table rows \`py-3.5\`. Best for onboarding/forms.

---

## 6. Canonical CRM View Specifications

### 1. Deals & Pipeline Kanban (\`DealsView.vue\` Specification)
- **5 Standard Stages**:
  - \`New\` (Top bar stripe: \`border-t-tag-1\` / \`bg-tag-1\`)
  - \`Acknowledged\` (Top bar stripe: \`border-t-tag-2\` / \`bg-tag-2\`)
  - \`Qualifying\` (Top bar stripe: \`border-t-tag-3\` / \`bg-tag-3\`)
  - \`Proposal / Quotation\` (Top bar stripe: \`border-t-tag-4\` / \`bg-tag-4\`)
  - \`Follow Up\` (Top bar stripe: \`border-t-tag-5\` / \`bg-tag-5\`)
- **Deal Card Structure**:
  - Card Title: \`font-bold text-xs text-foreground group-hover:text-primary\`.
  - Hot Lead Pill: \`<Flame />\` icon with \`text-warning bg-warning/10 border-warning/20 text-[8px] font-bold\`.
  - Client Name: \`text-[10px] text-muted-foreground font-semibold -mt-1\`.
  - Value Badge: \`RM XX,XXX\` in monospace format.
  - Footer Row: Agent avatar (\`w-5 h-5 rounded-full\`), paperclip attachments count, comments count, and days in pipeline clock (\`Clock\` icon).

### 2. Omnichannel 3-Pane Workspace & WhatsApp Simulator (\`OmnichannelView.vue\` Specification)
- **Pane 1: Conversation List (Sidebar)**:
  - Search field + status filter pills (\`All\`, \`Late SLA\`, \`Unread\`).
  - Conversation cards with contact avatar, WhatsApp icon badge on avatar corner, sender name, VIP crown badge, Late SLA badge, unread badge counter (\`bg-destructive text-destructive-foreground\`), and timestamp.
- **Pane 2: Active Chat Canvas**:
  - Header Profile: Contact avatar with green online pulse dot (\`bg-primary animate-pulse-glow\`), VIP badge, Late badge, \`WhatsApp\` channel tag, assigned agent dropdown (\`Assigned to Ahmad Faizal\`), and \`Resolve\` CTA button.
  - Human Response Alert Banner: Green-tinted SLA banner (\`bg-success/10 text-success border-success/20\`) with \`Reassign\` and \`Dismiss\` actions.
  - Message Feed:
    - Customer incoming bubble: Surface with border (\`bg-card border-border text-foreground rounded-2xl rounded-tl-xs p-3.5 shadow-2xs\`).
    - Agent outgoing bubble: **Solid Brand Green** (\`bg-primary text-primary-foreground border-transparent rounded-2xl rounded-tr-xs p-3.5 text-xs\`) with \`✓✓\` double read receipts.
    - WhatsApp Quoted Reply Box: Inset quote card with left vertical accent bar (\`bg-primary\`).
    - PDF Document Card: Inset document card with icon and download button (\`bg-muted/50 border border-border\`).
    - System Audit Logs: Centered green pill (\`bg-success/10 text-success border-success/20\`).
    - Private Notes: Inset warning card (\`bg-warning/10 border-warning/20 text-warning\`).
  - Rich Multi-Mode Composer:
    - Mode Switcher: \`Reply\` (primary active tab) vs \`Private Note\` (warning mode).
    - \`AI Auto-Reply\` toggle switch.
    - Toolbar with Quick Emojis (\`😊\`), File Attachments (\`📎\`), Typography (\`T\`), and AI Draft Generator (\`✨\`).
    - Quick Action Chips: *"💬 Follow Up"*, *"📄 Send Quote"*, *"📅 Book Demo"*.
- **Pane 3: Contact & CRM Context Drawer**:
  - Contact Details: Name, Company, Phone (\`+6012 ...\`), Email, Pipeline Value (\`RM 90,000\`), Lead Stage, Assigned Rep.
  - Associated Tags pill list (\`bg-tag-1 text-tag-1-foreground\` etc.).
  - Primary CTAs: \`Generate Quotation PDF\` and \`Open Full Contact Drawer\`.

### 3. Command Palette Spotlight (\`Cmd+K\` / \`Ctrl+K\`)
- Global floating command palette modal with quick actions, recent deals search, and navigation jump shortcuts (\`bg-card text-foreground border-border\`).

---

## 7. New Page Checklist & Quality Gate

When drafting or implementing any new RakanSales page:
- [ ] Registered in \`src/router/index.ts\` and visible in \`Sidebar.vue\` / \`SecondaryPanel.vue\` / \`AppShell.vue\`.
- [ ] Root container uses \`h-full w-full overflow-y-auto scroll-smooth bg-background text-foreground\`.
- [ ] Primary buttons use RKS Primary Green (\`bg-primary hover:bg-primary/90 text-primary-foreground\`).
- [ ] Status badges use token-based tint backgrounds with colored text (e.g., \`bg-success/10 text-success border border-success/20\`).
- [ ] **Zero raw colors**: No \`gray-*\`, \`slate-*\`, \`zinc-*\`, \`white\`, \`black\`, \`#hex\`, \`rgb()\`, or \`dark:\` overrides.
- [ ] **Chart dynamic theming**: ApexCharts and Unovis charts query tokens dynamically via \`useChartTheme.ts\` or \`getComputedStyle\`.
- [ ] Clickable cards and rows have \`cursor-pointer\`, hover elevation or border highlight.
- [ ] Key metrics and timestamps use \`font-mono\`.
- [ ] **Dual-mode verification**: Verified visually in both Light Mode and Dark Mode with legible contrast.
- [ ] **Audit script pass**: \`node scripts/audit-tokens.cjs --file <path>\` returns 0 violations.
`;
