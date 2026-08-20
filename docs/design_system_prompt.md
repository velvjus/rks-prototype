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
| **Brand Accent** (`--rks-green`) | `#23B750` | Logomarks, active left border highlights, focus rings, hover indicators, glowing active pings. |
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
- **Data / Metrics Font**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` (`font-mono`). Used for currency values, timestamps, coordinates, phone numbers, and code.

| Style | Tailwind Classes | Usage |
|---|---|---|
| **Page Heading** | `text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground tracking-tight` | Top-level page titles |
| **Section Title** | `text-lg font-bold text-gray-900 dark:text-foreground tracking-tight` | Main card & drawer headers |
| **Card Subheading** | `text-sm font-semibold text-gray-800 dark:text-foreground` | Widget titles, modal headings |
| **Standard Body** | `text-sm text-gray-600 dark:text-muted-foreground leading-relaxed` | Default body copy, descriptions |
| **Dense Table / Data** | `text-xs text-gray-700 dark:text-foreground font-medium` | Table rows, input field values |
| **Micro Labels / Tags** | `text-[10px] font-bold uppercase tracking-wider text-gray-500` | Category badges, column headers |
| **Monospace Numbers** | `font-mono text-xs md:text-sm font-semibold` | Currency amounts, timestamps, IDs |

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

## 6. Diffused Shadow System (Nova v4.0)

Diffused soft shadows for modern depth without heavy borders:

- `shadow-soft`: `0 2px 10px -2px rgba(0, 0, 0, 0.04), 0 1px 4px -1px rgba(0, 0, 0, 0.02)` (Buttons, inputs).
- `shadow-md`: `0 8px 30px -4px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)` (Card hovers).
- `shadow-xl`: `0 20px 48px -8px rgba(0, 0, 0, 0.12)` (Floating dropdowns, sheets, modals).

---

## 7. Component Rules for New CRM Pages

### 1. Form Inputs & Actions
- Every input must have a clear label, placeholder, and focus ring: `focus:ring-2 focus:ring-primary/20 focus:border-primary`.
- All buttons must have explicit `cursor-pointer`, `transition-all duration-150`, and `active:scale-[0.98]`.
- Always use SVG icons (Lucide / Iconify) with fixed sizes (`w-4 h-4` or `size-4`). Never use raw emojis as UI icons.

### 2. High-Density Tables & Lists
- Table header: `bg-gray-50 dark:bg-muted text-gray-500 uppercase text-[10px] font-bold tracking-wider`.
- Table row: `border-b border-gray-100 dark:border-border hover:bg-gray-50/70 dark:hover:bg-muted/40 transition-colors`.
- Always include an empty state with an icon, descriptive heading, helper sentence, and a reset/create button.

### 3. Modals, Sheets & Drawers
- Use Radix Vue / Shadcn accessible components (`Dialog`, `Sheet`, `Drawer`).
- Side sheets (`Sheet`) are preferred for full contact/deal inspection drawers.
- Center modals (`Dialog`) are preferred for short creation workflows (e.g. New Lead, Add Task).

### 4. Interactive Feedback
- Use `vue-sonner` toast notifications for all async feedback:
  - `toast.success(title, { description })`
  - `toast.error(title, { description })`
  - `toast.info(title, { description })`
  - `toast.warning(title, { description })`

---

## 8. New Page Checklist

When drafting or implementing any new RakanSales page:
- [ ] Registered in `src/router/index.ts` and visible in `Sidebar.vue` / `SecondaryPanel.vue` / `AppShell.vue`.
- [ ] Root container uses `h-full w-full overflow-y-auto scroll-smooth`.
- [ ] Primary buttons use RKS Primary Green (`bg-primary hover:bg-primary-dark`) with white text.
- [ ] Status badges use light-tint backgrounds with colored text (e.g., `bg-emerald-50 text-emerald-600 border border-emerald-200`).
- [ ] Supports both Light Mode and Dark Mode with semantic classes (`bg-card text-foreground border-border`).
- [ ] Clickable cards and rows have `cursor-pointer`, hover elevation or border highlight.
- [ ] Key metrics and timestamps use `font-mono`.
