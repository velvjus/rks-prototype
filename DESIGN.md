# RakanSales CRM — Design System Reference & System Prompt (Nova v4.0)

> Use this document as the system prompt or design guideline when building new pages, features, or drafting UI mockups for RakanSales CRM.

---

## 1. Product Identity & Overview

- **Product Name**: RakanSales CRM
- **Design System Version**: Nova v4.0
- **Platform**: Web (Desktop-first SaaS with responsive tablet/mobile workflows)
- **Tech Stack**: Vue 3 SFC (`<script setup lang="ts">`), TypeScript, Tailwind CSS v4, Shadcn/Vue & Radix Vue primitives, Lucide & Iconify icons, Unovis/Recharts.
- **Aesthetic**: Modern, high-density B2B sales automation CRM. Clean, compact, action-oriented, with high-contrast accessibility (WCAG AA compliant) and subtle spring micro-interactions.

---

## 2. Segmented Hybrid Color Strategy

RakanSales uses a dual-green hierarchy to guarantee 4.5:1+ contrast on all text and actions:

| Token / Variable | Hex / Oklch Value | Role & Usage |
|---|---|---|
| **Base Primary** (`--primary`) | `oklch(0.527 0.154 150.069)` ≈ `#008236` | Solid primary action buttons, active navigation states, filled badges. Minimum 4.5:1 contrast against white text. |
| **Brand Accent** (`--rks-green`) | `#23B750` | Logomarks, active left border highlights, focus rings, hover indicators, glowing active pings, WhatsApp outgoing chat bubbles. |
| **Hover Brand** (`--rks-green-dark`) | `#1A943E` | Hover state for brand green buttons and interactive elements. |
| **Secondary Lime** (`--rks-lime`) | `#62D816` | Brand gradient endpoint: `linear-gradient(135deg, #23B750 0%, #62D816 100%)`. Never use for body text on white. |
| **Info Blue** (`--rks-blue`) | `#2E91E5` | Information alerts, timeline dots, sync notifications. |
| **Warning Amber** (`--rks-warning`) | `#F59E0B` | Pending states, 80%+ quota warnings, attention tags. |
| **Danger Red** (`--destructive`) | `#EF4444` | Destructive CTAs, errors, 90%+ critical thresholds. |
| **Outer Rail** (`--rks-gray-900`) | `#111827` | Dark expandable navigation rail. |
| **Outer Rail Active** (`--rks-gray-800`) | `#1F2937` | Active / hovered item background on outer rail. |
| **Page Canvas** (`--background`) | `#F9FAFB` (Light) / `#090D16` (Dark) | App canvas base background. |
| **Card Surface** (`--card`) | `#FFFFFF` (Light) / `#111827` (Dark) | Widget and table surface backgrounds. |
| **Dividers & Borders** (`--border`) | `#E9E9E9` (Light) / `#1F2937` (Dark) | Clean dividers and card borders. |
| **Muted Surfaces** (`--muted`) | `#F3F4F6` (Light) / `#1E293B` (Dark) | Form field backgrounds, table headers, inactive pills. |
| **Muted Text** (`--muted-foreground`) | `#6B7280` (Light) / `#94A3B8` (Dark) | Helper text, secondary metadata, timestamps. |
| **Body Text** (`--foreground`) | `#0F172A` (Light) / `#F8FAFC` (Dark) | Primary body text and headings. |

---

## 3. Typography & Sizing Hierarchy

- **Primary Font**: `Inter Variable` (`font-sans`).
- **Data / Metrics Font**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` (`font-mono`). Used for currency values (`RM XX,XXX`), timestamps, coordinates, phone numbers, and code.

| Style | Tailwind Classes | Usage |
|---|---|---|
| **Page Heading** | `text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground tracking-tight` | Top-level page titles |
| **Section Title** | `text-lg font-bold text-gray-900 dark:text-foreground tracking-tight` | Main card & drawer headers |
| **Card Subheading** | `text-sm font-semibold text-gray-800 dark:text-foreground` | Widget titles, modal headings |
| **Standard Body** | `text-sm text-gray-600 dark:text-muted-foreground leading-relaxed` | Default body copy, descriptions |
| **Dense Table / Data** | `text-xs text-gray-700 dark:text-foreground font-medium` | Table rows, input field values |
| **Micro Labels / Tags** | `text-[10px] font-bold uppercase tracking-wider text-gray-500` | Category badges, column headers |
| **Monospace Numbers** | `font-mono text-xs md:text-sm font-semibold` | Currency amounts (`RM 90,000`), timestamps, IDs |

---

## 4. App Shell & Layout Blueprint

RakanSales follows a **Dual-Rail + Content Canvas** architecture:

```
+-----------------------------------------------------------------------------------------+
| [Outer Rail: Dark w-16/w-56] | [Inner Sidebar: w-60] | [Top Nav Bar: h-16]              |
|                              |                       +----------------------------------+
| - Brand Logomark             | - Contextual Sub-nav  | Breadcrumb  / Bell / User Avatar |
| - Omnichannel                | - Filters & Categories+----------------------------------+
| - Companies                  | - Search field        | [Scrollable Canvas: flex-1]      |
| - Contacts (Accordion)       |                       |                                  |
| - Add-ons                    | (Dismissible)         |  <RouterView />                  |
| - Collapse Toggle / Theme    |                       |                                  |
+-----------------------------------------------------------------------------------------+
```

1. **Outer Rail (Dark `bg-gray-900`)**: Expandable between icon-only (`w-16`) and expanded with labels (`w-56`).
2. **Inner Sidebar (Light `w-60 bg-white dark:bg-card` border-r)**: Contextual sub-navigation for module views. Dismissible with collapse button.
3. **Top Header (`h-16 bg-white dark:bg-card` border-b)**: Contains dynamic breadcrumbs, quick sidebar re-opener, notifications with unread badge, and user avatar.
4. **Content Canvas**: `flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-background p-4 lg:p-6 scroll-smooth`.

---

## 5. UI Density & Corner Radius Standards

- **Default Border Radius**: `--radius: 0.625rem` (~10px) on standard cards, `rounded-xl` (12px) on buttons/inputs, `rounded-2xl` (16px) on major cards, `rounded-full` on chips/avatars.
- **Density Scaling**:
  - **Compact**: `p-4 space-y-4 text-xs`, inputs `h-8 text-xs`, table rows `py-1.5`. Best for high-volume data grids.
  - **Standard**: `p-6 space-y-6 text-sm`, inputs `h-9.5 text-xs`, table rows `py-2.5`. Default CRM layout.
  - **Comfortable**: `p-8 space-y-8 text-base`, inputs `h-11 text-sm`, table rows `py-3.5`. Best for onboarding/forms.

---

## 6. Canonical CRM View Specifications

### 1. Deals & Pipeline Kanban (`DealsView.vue` Specification)
- **5 Standard Stages**:
  - `New` (Top bar stripe: `#3b82f6`)
  - `Acknowledged` (Top bar stripe: `#00D2C4`)
  - `Qualifying` (Top bar stripe: `#FFCC00`)
  - `Proposal / Quotation` (Top bar stripe: `#FF8800`)
  - `Follow Up` (Top bar stripe: `#10B981`)
- **Deal Card Structure**:
  - Card Title: `font-bold text-xs text-gray-900 group-hover:text-[#23B750]`.
  - Hot Lead Pill: `<Flame />` icon with `text-amber-600 bg-amber-500/10 border-amber-500/20 text-[8px] font-bold`.
  - Client Name: `text-[10px] text-muted-foreground font-semibold -mt-1`.
  - Value Badge: `RM XX,XXX` in monospace format.
  - Footer Row: Agent avatar (`w-5 h-5 rounded-full`), paperclip attachments count, comments count, and days in pipeline clock (`Clock` icon).

### 2. Omnichannel 3-Pane Workspace & WhatsApp Simulator (`OmnichannelView.vue` Specification)
- **Pane 1: Conversation List (Sidebar)**:
  - Search field + status filter pills (`All`, `Late SLA`, `Unread`).
  - Conversation cards with contact avatar, WhatsApp icon badge on avatar corner, sender name, VIP crown badge, Late SLA badge, unread badge counter (`#EF4444`), and timestamp.
- **Pane 2: Active Chat Canvas**:
  - Header Profile: Contact avatar with green online pulse dot (`bg-[#23B750] animate-pulse-glow`), VIP badge, Late badge, `WhatsApp` channel tag, assigned agent dropdown (`Assigned to Ahmad Faizal`), and `Resolve` CTA button.
  - Human Response Alert Banner: Green-tinted SLA banner with `Reassign` and `Dismiss` actions.
  - Message Feed:
    - Customer incoming bubble: White surface with border (`bg-card border-border text-foreground rounded-2xl rounded-tl-xs p-3.5 shadow-2xs`).
    - Agent outgoing bubble: **Solid Brand Green** (`bg-[#23B750] text-white border-transparent rounded-2xl rounded-tr-xs p-3.5 text-xs`) with `✓✓` double read receipts.
    - WhatsApp Quoted Reply Box: Inset quote card with left vertical accent bar (`bg-[#23B750]`).
    - PDF Document Card: Inset document card with icon and download button.
    - System Audit Logs: Centered green pill (`bg-green-50 text-green-700 border-green-200`).
    - Private Notes: Tan/Yellow card (`bg-[#FEF9C3]/80 border-[#FEF08A] text-[#854D0E]`).
  - Rich Multi-Mode Composer:
    - Mode Switcher: `Reply` (green active tab) vs `Private Note` (yellow mode).
    - `AI Auto-Reply` toggle switch.
    - Toolbar with Quick Emojis (`😊`), File Attachments (`📎`), Typography (`T`), and AI Draft Generator (`✨`).
    - Quick Action Chips: *"💬 Follow Up"*, *"📄 Send Quote"*, *"📅 Book Demo"*.
- **Pane 3: Contact & CRM Context Drawer**:
  - Contact Details: Name, Company, Phone (`+6012 ...`), Email, Pipeline Value (`RM 90,000`), Lead Stage, Assigned Rep.
  - Associated Tags pill list.
  - Primary CTAs: `Generate Quotation PDF` and `Open Full Contact Drawer`.

### 3. Command Palette Spotlight (`Cmd+K` / `Ctrl+K`)
- Global floating command palette modal with quick actions, recent deals search, and navigation jump shortcuts.

---

## 7. New Page Checklist

When drafting or implementing any new RakanSales page:
- [ ] Registered in `src/router/index.ts` and visible in `Sidebar.vue` / `SecondaryPanel.vue` / `AppShell.vue`.
- [ ] Root container uses `h-full w-full overflow-y-auto scroll-smooth`.
- [ ] Primary buttons use RKS Primary Green (`bg-primary hover:bg-primary-dark`) with white text.
- [ ] Status badges use light-tint backgrounds with colored text (e.g., `bg-emerald-50 text-emerald-600 border border-emerald-200`).
- [ ] Supports both Light Mode and Dark Mode with semantic classes (`bg-card text-foreground border-border`).
- [ ] Clickable cards and rows have `cursor-pointer`, hover elevation or border highlight.
- [ ] Key metrics and timestamps use `font-mono`.
