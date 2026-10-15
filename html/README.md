# Standalone HTML Prototypes (HTML / Tailwind CSS / Vanilla JS)

This directory contains standalone, zero-dependency, production-grade HTML versions of core **RakanSales** flows.

## 🚀 Quick Start
Simply double-click any `.html` file or open it in any modern browser. No build steps, Node.js, or local servers required!

## 📦 What's Included

### 1. `onboarding-wizard.html`
Complete self-contained onboarding wizard including:
- **Step 1**: Company Details & Type Selection (SME, Enterprise, Government).
- **Step 2**: Location & Operating Currency (dynamic auto-select based on country).
- **Step 3**: Team Size & Industry Multi-select Pills (with custom "Others" field reveal).
- **Step 4**: Subscription Plan Selection (Monthly/Yearly toggle with 25% discount logic & feature lists).
- **Workspace Provisioning**: 2-second simulated progress screen with spinner.
- **Step 5**: Minimal celebratory success screen with confetti bursts (`canvas-confetti`) and CTAs (**Launch Dashboard** and **Complete Setting Up**).
- **Continuation**: Clicking **Complete Setting Up** directly routes to `setup-wizard.html` and persists company name and onboarding data.

### 2. `setup-wizard.html`
Complete self-contained workspace setup wizard including:
- **Step 1: Setup Checklist**: Live progress tracker (0/3 to 3/3 completed), checklist cards for Sales Team, WhatsApp Channel, and LiveChat Widget with direct jump-in links.
- **Step 2: Sales Team Setup**: Multi-email chip input (tokenizing on Enter, comma, space, and paste), role assignment (Agent, Manager, Administrator), invite links with copy feedback, and member list management with in-line role editing and removal.
- **Step 3: WhatsApp Channel**:
  - Sub-step 1: Connection method selection (Fast QR code link vs Official Cloud API).
  - Sub-step 2: Channel name configuration, encrypted QR session generation, phone scan simulation, and verified linked state with +60 12-345 6789.
  - Sub-step 3: Routing rep assignments with toggle controls.
- **Step 4: Website LiveChat**:
  - Sub-step 1: Widget appearance customizer (Website name, domain, brand color presets + custom hex picker, greeting heading, auto-show toggle) with a real-time browser preview mockup.
  - Sub-step 2: Widget chat rep assignment with team toggles.
  - Sub-step 3: Embed code snippet with one-click copy and developer email option.
- **Provisioning & Success**: 1.5-second workspace provisioning screen followed by final celebration with dual confetti cannons.
- **Skip Confirmation**: Contextual modal warning before skipping unconfigured steps.
- **Secret Reset Button**: Hover top-left to reset setup progress to default state.

### 3. `partner-register.html`
Complete self-contained Partner Program registration wizard matching [`PartnerRegisterView.vue`](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/views/PartnerRegisterView.vue):
- **Branching Flows**:
  - **New Partner**: Step 1 (Account Type) → Step 2 (Track Selection: Referral vs Sales) → Step 3 (Account Details with live password security meter) → Step 4 (Celebratory Success with confetti).
  - **Existing Customer**: Step 1 (Account Type) → Step 2 (Link CRM Account with asynchronous account lookup simulation) → Step 3 (Track Selection with linked CRM email pill) → Step 4 (Account Linked Success).
- **Interactive Sales Partner Modal**: Explains unlock criteria (5 deals) and includes an expandable bypass code input.
- **Dynamic Password Security Meter**: Real-time score calculation (0–4) evaluating length, uppercase, lowercase, and password match with dynamic badges and progress track.
- **Split-Screen Desktop Presentation**: Interactive expanding hero canvas on right pane (widens to 50% on hover) with responsive mobile adaptation.
- **Prototype Stepper Switcher**: Hidden hover-activated header with direct step jump shortcuts for rapid prototype testing.

## 🛠️ Tech Stack & CDNs
- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **Lucide Icons**: `https://unpkg.com/lucide@latest`
- **Confetti Animation**: `https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js`
- **Font**: Google Fonts (Inter)
