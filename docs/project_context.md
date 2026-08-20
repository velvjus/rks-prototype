# RakanSales CRM — Project Handover & Context Directory

This document serves as a comprehensive handover and context reference for developers and agentic coding assistants (such as Antigravity) working on the **RakanSales CRM** workspace. It outlines the core vision of the project, details the tech stack, outlines the visual design system, summarizes the history of implemented features, and provides guidelines for running, developing, and extending this codebase.

---

## 🚀 1. Project Vision & Overview

### What is RakanSales?
RakanSales is a high-performance, AI-powered sales automation CRM. Unlike standard CRM databases that act primarily as static repositories of contact records, RakanSales focuses on the transition from **conversations to next actions**. It unifies multi-channel customer communications, AI-driven assistant tools, lead qualification, and pipeline deals tracking into a single, high-density dashboard environment.

### Target Audience
*   **Business Owners:** Seeking clear operational visibility over lead flows, response times, and sales metrics.
*   **Corporate Sales Teams:** Managing high-volume messaging across fragmented communication channels.
*   **Sales Agents:** Requiring smart workspace tools (e.g., AI auto-responders, name card scanner wizards, quick CRM action triggers) to close deals faster.

### Key Functional Areas
1.  **Omnichannel Inbox:** Unifies communications from WhatsApp, Facebook Messenger, Instagram, Email, Webforms, and Website Chat into a single multi-column workspace layout.
2.  **Deals Pipeline Board:** A drag-and-drop Kanban interface for sales opportunities with high-fidelity detail modals.
3.  **Contacts Dashboard:** A directory supporting scalable operations, advanced client-side search, filtering, and activity logging.
4.  **Events & Leads Capture:** Physical event lead capture tooling powered by AI scanning helpers and event conversion metrics.
5.  **Analytics & Performance Dashboard:** Live visualization of response speeds, active conversations, pipeline conversions, and agent efficiency.
6.  **Integrated Appointments Calendar:** Meeting schedules and booking page configurations.

---

## 🛠️ 2. Technology Stack

The application is built on a modern, fast frontend foundation:
*   **Core Framework:** [Vue 3](https://vuejs.org/) using `<script setup lang="ts">` Single File Components (SFCs).
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for type-safe components, props, and data modeling.
*   **Build Tool:** [Vite](https://vite.dev/) for fast hot-module replacement (HMR) and optimized build bundling.
*   **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/) with native CSS-first configuration and `@import` directives.
*   **Component Architecture:** [Shadcn/Vue](https://www.shadcn-vue.com/) built over [Radix Vue / Reka UI](https://www.radix-vue.com/) primitives.
*   **State Management:** [Pinia](https://pinia.vuejs.org/) for cross-component global UI states (e.g., sidebar toggling).
*   **Icon Libraries:** [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next) for standard layout/functional icons; [@Iconify/Vue](https://iconify.design/) for third-party platform channels (WhatsApp, Messenger, Instagram).
*   **Charts & Visualization:** [@Unovis/ts](https://unovis.dev/) and [@Unovis/vue](https://unovis.dev/) for custom dashboard pipelines, ROI calculations, and conversion metrics.
*   **Validation:** [Zod](https://zod.dev/) combined with [Vee-Validate](https://vee-validate.logaretm.com/v4/) for schema validation on dialog forms.

---

## 🎨 3. Visual Design System (Nova v4.0)

RakanSales is governed by the **Nova v4.0 Design System**. All developers and agents must maintain visual fidelity in compliance with [docs/design_system_prompt.md](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/docs/design_system_prompt.md).

### Theme & Colors
RakanSales uses a **Segmented Hybrid Color Strategy** to balance brand recognition with high-contrast accessibility (WCAG AA):
*   **Primary Brand Green (`--primary`):** A deep, readable green `oklch(0.527 0.154 150.069)` ≈ `#008236` or `#15803d` for solid CTAs and primary states to guarantee a **4.5:1+ contrast ratio** against light backgrounds.
*   **Brand Highlight Green (`--rks-green`):** A bright green `#23B750` used for active border indicators, logo marks, focus states, and text links.
*   **Secondary Lime (`--rks-lime`):** `#62D816` used exclusively in linear gradients: `linear-gradient(135deg, #23B750 0%, #62D816 100%)`.
*   **Dark Outer Rail Background (`--rks-gray-900`):** `#111827` to anchor the layout hierarchy.
*   **Aesthetic Divider Borders (`--border`):** `oklch(0.922 0 0)` ≈ `#E9E9E9` for thin card splits and inline grids.

### Typography
*   **Base Sans Font:** `Inter Variable` via `@fontsource-variable/inter` for clean readability.
*   **Base Mono Font:** Default Tailwind monospace stack. Used for system numbers, timestamps, coordinates, and statistics.
*   **Sizing Hierarchy:** Standard baseline uses `text-sm` (14px) for content dense views. Metadata, tags, timestamps, and column labels drop to `text-xs` (12px). Card headings use `text-base` (16px), and page titles use `text-xl` or `text-2xl`.
*   **Font Weights:** `font-medium` (500) for form controls and labels, `font-semibold` (600) for column headers, `font-bold` (700) for section titles, and `font-extrabold` / `font-black` for major numbers in KPI cards.

### Layout Shell Structure
The layout is defined in [AppShell.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/components/layout/AppShell.vue):
1.  **Outer Sidebar Rail (Dark, Left):** Collapses smoothly from `w-[210px]` (expanded with text labels) to `w-[58px]` (collapsed icon-only). Toggled by Chevron controls at the bottom.
2.  **Inner Secondary Sidebar (Light, Center-Left):** Width `w-60` with section filters and sub-navigations. User-dismissible; when closed, a `PanelLeftOpen` icon is injected into the Top Header Bar to allow reinstatement.
3.  **Top Header Bar:** Contains context titles/breadcrumbs, notification indicators, and user profiles.
4.  **Main Content Canvas:** Autoscrolling background canvas (`bg-gray-50`) with layout padding. Full-width/bleed routes override padding (e.g., Omnichannel).

### Density, Corners & Motion
*   **Low Radius Corners:** Conformed to `--radius: 0.3rem` (≈ 5px) to achieve a modern, compact corporate appearance.
*   **Toggleable Shadows:** Uses custom variables `--rks-shadow-...` featuring wide blur radii and low opacities. All shadows can be flat-lined by toggling the shadow disabler block in `index.css`.
*   **Snappy Interactions:** Button hovers scale up slightly (`scale-[1.02]`) and scale down on click (`scale-[0.96]`) using custom spring deceleration curves: `cubic-bezier(0.34, 1.56, 0.64, 1)`.

---

## 🛠️ 4. What Has Been Done So Far

This project has undergone several architectural iterations to build out high-fidelity dashboard views:

### 1. Contacts Dashboard Rework
*   **Deterministic Mock Dataset:** Created [contactsData.ts](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/data/contactsData.ts) containing **2,500 contacts** using a seeded pseudo-random generator, including lifecycle stages (`Lead`, `Subscriber`, `Opportunity`, `Customer`), custom tags, notes, and activity history.
*   **Interactive Controls & Table:** Rebuilt [ContactsView.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/views/ContactsView.vue) with:
    *   Four top KPI cards featuring hover transitions.
    *   Toolbar supporting live query search and category selection dropdowns.
    *   Floating bulk operations action bar for multi-row operations (CSV exports, status updates, bulk deletion).
    *   Sortable and paginated tables (10, 25, 50, 100 rows).
    *   Detail slide-out drawer containing inline logs for activities (Calls, Emails, Discovery) and editable profiles.
    *   Add and Edit validation modals using Zod schemas.

### 2. Omnichannel Context Panel Redesign
*   **Agent Assignment Mapping:** Synchronized conversation assignees and watchers with specific sales team agents (Ahmad Faizal, Siti Nur Aisyah, Rajesh Kumar, Lim Wei Jie, Nurul Huda, Mohd Hafiz) using matching avatar illustrations.
*   **Advanced Autocomplete Participant Selector:** Built a keyboard-supported multi-select combobox for conversation assignees/participants, filtering out existing selections and supporting autocomplete suggestions.
*   **Borderless Tag Manager:** Rebuilt the tag system under the profile section to render as an inline list of borderless chips with floating text fields and auto-suggestions.
*   **Contextual Deal Empty State:** Taught the deals side panel to transition from a flat empty message into a highlighted `+ Create Deal` button on hover.
*   **Inter-Page Synchronization:** Added a local storage pipeline key (`rakansales_created_deals`) that syncs deals generated from the Omnichannel popup back to the main Kanban board on [DealsView.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/views/DealsView.vue) in real-time.

### 3. Events details & AI Copilot Wizards
*   **Navigation Restructuring:** Promoted **Events** to the main sidebar rail and redesigned [EventsView.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/views/EventsView.vue).
*   **Dropdown Modals Migration:** Moved AI copilot panels (AI Name Card Scanner, AI Auto Message, Event Analytics) into modal dialog dialogs triggered by a standard top-right kebab dropdown.
*   **Name Card Scanner Wizard:** Implemented a two-step dialog workflow:
    1.  *Scan Viewport:* Simulates scanning with animations and populates extracted metadata.
    2.  *Qualifiers Selector:* Form fields to assign temperature levels, priority markers, and VIP tags.
    *   *Real-time Sync:* Captures lead metadata and inserts them into the Captured Leads table, updating KPI totals instantly.
*   **AI Auto Message:** Form for templating emails/WhatsApp messages based on tone sliders. Auto-populates targets when triggered from row actions.
*   **Event Redirection:** Auto Message completion triggers an Omnichannel redirect option, allowing agents to instantly view the active chat conversation thread.

### 4. Design QA Remediation
*   **Modal Constraints:** Remedied a layout clipping issue by constraining the Deal Popup Modal dimensions to fixed max widths (`1320px` for fullscreen and `748px` for in-app views). Removed the confusing fullscreen-expansion toggle.
*   **Flexbox Scaling Patches:** Added `shrink-0` bounds to sidebar info cards to prevent flexbox clipping card heights when displaying complex contact profiles.

---

## 🏃 5. How to Run & Develop Locally

Follow these instructions to run the development server and verify code changes:

### Prerequisites
Make sure you have **Node.js** installed on your workstation.
*   Check installation:
    ```bash
    node -v
    npm -v
    ```

### Installation & Launch
1.  Navigate to the project root directory:
    ```bash
    cd "c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales C4"
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite local development server:
    ```bash
    npm run dev
    ```
4.  Open the prototype in your browser using the URL printed in the terminal (typically `http://localhost:5173`).

### Quality Assurance & Compiling Checks
Always test the TypeScript compilation and CSS bundling before delivering code changes. Run:
```bash
npm run build
```
Ensure the build succeeds with no errors and outputs target artifacts in the `dist` folder.

---

## 🤝 6. Antigravity AI Pair Programming & Handover Guidelines

When transferring this project to a new development workspace or a new instance of **Antigravity**, pass the following prompt parameters to preserve context:

### Codebase Organization Reference
*   `src/views/`: Contains page-level views corresponding to router paths (e.g., [ContactsView.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/views/ContactsView.vue), [OmnichannelView.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/views/OmnichannelView.vue), [EventsView.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/views/EventsView.vue)).
*   `src/components/layout/`: Holds the application framework components like [AppShell.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/components/layout/AppShell.vue), [Sidebar.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/components/layout/Sidebar.vue), and `TopNav.vue`.
*   `src/components/ui/`: Standard reusable UI controls (buttons, badges, inputs).
*   `src/data/`: Static assets and seeded CRM databases.
*   `src/stores/`: Pinia global states (e.g., `ui.ts`).
*   `docs/`: Product Requirements Documents (PRDs), design prompts, and roadshow scripts.

### Guidelines for AI Agent Prompts
When prompting Antigravity for future additions, instruct it to:
1.  **Consult the Design Prompt:** Always read [docs/design_system_prompt.md](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/docs/design_system_prompt.md) before writing styling classes.
2.  **Respect Vue 3 Conventions:** Keep Single File Components clean. Use `<script setup lang="ts">`. Avoid mixing layout logic with inline global styles; leverage Tailwind CSS v4 class compositions.
3.  **Run Build Verification:** Explicitly instruct the agent to run `npm run build` after changes to prevent TypeScript type errors from leaking into the repository.
4.  **Preserve Comments & Seed Data:** Maintain seeded helper data generators and document functions clearly so subsequent developers can build upon them.
