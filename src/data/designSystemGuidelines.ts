export const rakanSalesGuidelinesMarkdown = `# RakanSales CRM — Design System Reference & System Prompt (Nova v4.0)

> Use this document as the system prompt or design guideline when building new pages, features, or drafting UI mockups for RakanSales CRM.

---

## 1. Product Identity & Overview

- **Product Name**: RakanSales CRM
- **Design System Version**: Nova v4.0
- **Platform**: Web (Desktop-first SaaS with responsive tablet/mobile workflows)
- **Tech Stack**: Vue 3 SFC (\`<script setup lang="ts">\`), TypeScript, Tailwind CSS v4 (\`@theme inline\`), Shadcn/Vue & Radix Vue primitives, Lucide & Iconify icons, ApexCharts & Unovis.
- **Aesthetic**: Modern, high-density B2B sales automation CRM. Clean, compact, action-oriented, with high-contrast accessibility (WCAG AA compliant) and subtle spring micro-interactions.
- **Theme Support**: First-class Light and Dark Mode via a 56-token architecture with instant dual-mode reactivity.

---

## 2. Core Theming Architecture & Single Source of Truth

All styling in RakanSales must flow from a single source of truth: the CSS variables in \`src/assets/index.css\` (\`:root\` for light mode, \`.dark\` for dark mode) mapped via Tailwind CSS v4 \`@theme inline\` and \`tailwind.config.js\`.

### Strict Theming Rules
1. **Semantic Token Classes Only**: Always use semantic tokens (e.g. \`bg-background\`, \`bg-card\`, \`bg-muted\`, \`bg-popover\`, \`text-foreground\`, \`text-muted-foreground\`, \`border-border\`, \`border-input\`, \`ring-ring\`, \`bg-primary\`, \`text-primary-foreground\`, \`bg-destructive\`, \`bg-rail\`).
2. **Zero Raw Colors**:
   - **No raw palette grays/neutrals**: Never use raw white, black, gray-*, slate-*, zinc-*, neutral-*, or stone-* classes.
   - **No hex/rgb values in classes or inline styles**: Never use hardcoded hex classes, inline hex styles, or rgba values.
   - **No raw status colors**: Never use raw status color classes (e.g. green-100, red-600, amber-50, blue-500). Use semantic status tokens with opacity modifiers (e.g. \`bg-success/10 text-success border-success/20\`).
3. **No \`dark:\` Color Overrides**: Never write dark: modifier classes in components. The semantic token itself adapts automatically between light and dark modes in \`index.css\`.
4. **JS & Chart Theming**: Charts (ApexCharts, Unovis) and canvas elements must read colors from CSS variables (e.g. via \`getComputedStyle\` / \`useChartTheme.ts\`) and reactively update on theme change — never hardcode hex values in chart options.

### Canonical Token Catalog (56 Semantic Tokens)

| Token / Variable | Utility Classes | Role & Usage |
|---|---|---|
| **Base Primary** (\`--primary\`) | \`bg-primary text-primary-foreground hover:bg-primary/90\` | Solid primary action buttons, active navigation states, filled badges. Guaranteed 4.5:1+ contrast. |
| **Brand Accent** (\`--brand\`) | \`bg-brand text-brand-foreground\` | Logomarks, active left border highlights, focus rings, hover indicators, WhatsApp outgoing chat bubbles. |
| **Brand Secondary** (\`--brand-secondary\`) | \`bg-brand-secondary text-brand-secondary-foreground\` | Brand gradient endpoint and secondary accent accents. |
| **Success** (\`--success\`) | \`bg-success/10 text-success border-success/20\` | Positive trends, deal won states, SLA met, active online indicators. |
| **Warning** (\`--warning\`) | \`bg-warning/10 text-warning border-warning/20\` | Pending states, 80%+ quota warnings, attention tags, internal private notes. |
| **Info** (\`--info\`) | \`bg-info/10 text-info border-info/20\` | Information alerts, timeline dots, system sync notifications. |
| **Destructive** (\`--destructive\`) | \`bg-destructive text-destructive-foreground\` | Destructive CTAs, delete confirmations, critical SLA breaches, unread count badges. |
| **Outer Rail** (\`--rail\`) | \`bg-rail text-rail-foreground\` | Invariant dark navigation rail & top nav (retains dark aesthetic in both light and dark modes). |
| **Outer Rail Active** (\`--rail-active\`) | \`bg-rail-active text-rail-foreground\` | Active and hovered item background on outer navigation rail. |
| **Outer Rail Muted** (\`--rail-muted-foreground\`) | \`text-rail-muted-foreground\` | Inactive icons and secondary labels on outer navigation rail. |
| **Outer Rail Border** (\`--rail-border\`) | \`border-rail-border\` | Subtle divider between rail sections. |
| **Page Canvas** (\`--background\`) | \`bg-background text-foreground\` | Application canvas base background (Slate 50 in light, Zinc 950 in dark). |
| **Card Surface** (\`--card\`) | \`bg-card text-card-foreground border-border\` | Widget and table surface backgrounds, modals, dropdowns. |
| **Dividers & Borders** (\`--border\`) | \`border-border\` | Clean dividers and card borders. |
| **Muted Surfaces** (\`--muted\`) | \`bg-muted text-muted-foreground\` | Form field backgrounds, table headers, inactive pills. |
| **Muted Text** (\`--muted-foreground\`) | \`text-muted-foreground\` | Helper text, secondary metadata, timestamps, subtitles. |
| **Body Text** (\`--foreground\`) | \`text-foreground\` | Primary body text and headings. |
| **Pipeline Stage 1–8** (\`--stage-1\` to \`--stage-8\`) | \`border-t-[var(--stage-1)]\`, \`text-[var(--stage-1)]\` | 8 dedicated stage accent tokens for Kanban column top bars and pipeline stage indicators. |
| **Chart Series 1–8** (\`--chart-1\` to \`--chart-8\`) | \`var(--chart-1)\` to \`var(--chart-8)\` | 8 accessible, theme-reactive data visualization series colors for ApexCharts & Unovis. |
| **Vibrant Accents** (\`--accent-purple\`, \`--accent-blue\`, etc.) | \`text-[var(--accent-purple)]\` | 8 crisp icon & metric accents for feature callouts and integrations. |

### 4-Tier Badge System (Anti-Clutter Standard)

To prevent visual noise across dense tables and cards, badges follow strict hierarchy rules:
1. **Tier 1: Soft Status Badges** (\`bg-success/10 text-success border-success/20\`, etc.): Standard for table rows and KPI cards. Never competes with primary buttons.
2. **Tier 2: Categorical Stage Tags** (\`bg-tag-1 text-tag-1-foreground\` to \`bg-tag-6 text-tag-6-foreground\`): Used for pipeline stages, lead sources, and categories without good/bad judgment.
3. **Tier 3: Structural Metadata** (\`variant="secondary"\`, \`variant="outline"\`, \`variant="muted"\`): Low-emphasis UI chrome (e.g., *"50 Seats"*, *"v4.0"*).
4. **Tier 4: Solid-Filled Counters** (\`variant="default"\`, \`variant="destructive-solid"\`): Reserved strictly for high-urgency counters (e.g., unread message count on the nav rail).

---

## 3. Typography & Sizing Hierarchy

- **Primary Font**: \`Inter Variable\` (\`font-sans\`).
- **Data / Metrics Font**: \`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace\` (\`font-mono\`). Used for currency values (\`RM XX,XXX\`), timestamps, coordinates, phone numbers, and code.
- **Maximum Font Weight Ceiling**: \`font-bold\` (700). Never use \`font-extrabold\` or \`font-black\`.

| Style | Tailwind Classes | Usage |
|---|---|---|
| **Page Heading** | \`text-2xl md:text-3xl font-bold text-foreground tracking-tight\` | Top-level page titles |
| **Section Title** | \`text-lg font-bold text-foreground tracking-tight\` | Main card & drawer headers |
| **Card Subheading** | \`text-sm font-semibold text-foreground\` | Widget titles, modal headings |
| **Standard Body** | \`text-sm text-muted-foreground leading-relaxed\` | Default body copy, descriptions |
| **Dense Table / Data** | \`text-xs text-foreground font-medium\` | Table rows, input field values |
| **Micro Labels / Tags** | \`text-[10px] font-bold uppercase tracking-wider text-muted-foreground\` | Category badges, column headers |
| **Monospace Numbers** | \`font-mono text-xs md:text-sm font-semibold tabular-nums text-foreground\` | Currency amounts (\`RM 90,000\`), timestamps, IDs |

---

## 4. App Shell & Layout Blueprint

RakanSales follows an **Invariant Dark Rail + TopNav + Content Canvas** architecture:

\`\`\`
+-----------------------------------------------------------------------------------------+
| [Outer Rail: bg-rail w-16/w-56] | [Inner Sidebar: w-60 bg-sidebar] | [Top Nav: h-14 bg-rail]   |
|                                 |                                  +---------------------------+
| - Brand Logomark                | - Contextual Sub-nav             | Breadcrumb / Notifications|
| - Omnichannel                   | - Filters & Categories           +---------------------------+
| - Companies                     | - Search field                   | [Scrollable Canvas: flex-1|
| - Contacts                      |                                  |  h-full overflow-y-auto   |
| - Add-ons                       | (Dismissible)                    |  bg-background]           |
| - Settings / Theme Toggle       |                                  |  <RouterView />           |
+-----------------------------------------------------------------------------------------+
\`\`\`

1. **Outer Rail & TopNav (\`bg-rail text-rail-foreground border-rail-border\`)**: Invariant dark framing that grounds the workspace across both Light and Dark modes.
2. **Inner Sidebar (\`w-60 bg-sidebar border-r border-sidebar-border\`)**: Contextual sub-navigation for module views. Dismissible with collapse button.
3. **Content Canvas**: \`flex-1 h-full overflow-y-auto bg-background p-4 lg:p-6 scroll-smooth\`.

---

## 5. UI Density & Corner Radius Standards

- **Default Border Radius**: \`--radius: 0.3rem\` (4.8px base) on standard controls, \`rounded-xl\` (12px) on cards, \`rounded-full\` on chips/avatars.
- **Density Scaling**:
  - **Compact**: \`p-4 space-y-4 text-xs\`, inputs \`h-8 text-xs\`, table rows \`py-1.5\`. Best for high-volume data grids.
  - **Standard**: \`p-6 space-y-6 text-sm\`, inputs \`h-9 text-xs\`, table rows \`py-2.5\`. Default CRM layout.
  - **Comfortable**: \`p-8 space-y-8 text-base\`, inputs \`h-10 text-sm\`, table rows \`py-3.5\`. Best for onboarding/forms.

---

## 6. Canonical CRM View Specifications

### 1. Deals & Pipeline Kanban (\`DealsView.vue\` Specification)
- **Pipeline Stage Stripes**: Accent top bars use dedicated \`--stage-1\` through \`--stage-8\` tokens.
- **Deal Card Structure**:
  - Card Title: \`font-bold text-xs text-foreground group-hover:text-primary\`.
  - Hot Lead Pill: \`<Flame />\` icon with \`text-warning bg-warning/10 border-warning/20 text-[8px] font-bold\`.
  - Client Name: \`text-[10px] text-muted-foreground font-semibold\`.
  - Value Badge: \`RM XX,XXX\` in monospace format with \`tabular-nums\`.
  - Footer Row: Agent avatar (\`w-5 h-5 rounded-full\`), paperclip attachments count, comments count, and days in pipeline clock.

### 2. Omnichannel 3-Pane Workspace & WhatsApp Simulator (\`OmnichannelView.vue\` Specification)
- **Message Feed**:
  - Customer incoming bubble: Surface with border (\`bg-card border-border text-foreground rounded-2xl rounded-tl-xs p-3.5 shadow-soft\`).
  - Agent outgoing bubble: **Solid Brand Green** (\`bg-primary text-primary-foreground rounded-2xl rounded-tr-xs p-3.5 text-xs\`) with \`✓✓\` double read receipts.
  - Private Notes: Inset warning card (\`bg-warning/10 border-warning/20 text-warning\`).
- **Rich Multi-Mode Composer**: Mode Switcher between \`WhatsApp Reply\` (primary active tab) vs \`Private Note\` (warning mode).

---

## 7. New Page Checklist & Quality Gate

When drafting or implementing any new RakanSales page:
- [ ] Registered in \`src/router/index.ts\` and visible in \`Sidebar.vue\` / \`SecondaryPanel.vue\` / \`AppShell.vue\`.
- [ ] Root container uses \`h-full flex-1 min-h-0 overflow-y-auto bg-background text-foreground\`.
- [ ] Primary buttons use RKS Primary Green (\`bg-primary hover:bg-primary/90 text-primary-foreground\`).
- [ ] Status badges use soft tint backgrounds with colored text (e.g., \`bg-success/10 text-success border border-success/20\`).
- [ ] **Zero raw colors**: No \`gray-*\`, \`slate-*\`, \`zinc-*\`, \`white\`, \`black\`, \`#hex\`, \`rgb()\`, or \`dark:\` overrides in templates.
- [ ] **Chart dynamic theming**: ApexCharts and Unovis charts query tokens dynamically via \`useChartTheme.ts\` or \`getComputedStyle\`.
- [ ] Clickable cards and rows have \`cursor-pointer\`, hover elevation or border highlight.
- [ ] Key metrics and timestamps use \`font-mono tabular-nums\`.
- [ ] **Maximum font weight**: No \`font-extrabold\` or \`font-black\`; max is \`font-bold\`.
- [ ] **Dual-mode verification**: Verified visually in both Light Mode and Dark Mode with legible contrast.
- [ ] **Audit script pass**: \`node scripts/audit-tokens.cjs --file <path>\` returns 0 violations.
`;
