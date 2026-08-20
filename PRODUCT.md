# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Business Owners:** Seeking clear operational visibility over lead flows, response times, conversion rates, and sales agent metrics.
- **Corporate Sales Teams:** Managing high-volume messaging across fragmented communication channels (WhatsApp, Facebook Messenger, Instagram, Email, Webforms, Website Live Chat).
- **Sales Agents:** Requiring smart workspace tools (AI auto-responders, name card scanner wizards, quick CRM action triggers, conversation assignment) to qualify leads and close deals faster.

## Product Purpose

RakanSales is a high-performance, AI-powered sales automation CRM. It bridges the gap between customer conversations and tangible pipeline actions, transforming chaotic multi-channel messaging into structured deals, qualified contacts, and closed revenue.

## Positioning

Unlike traditional static CRM contact databases or generic helpdesk software, RakanSales connects conversational channels directly to AI-assisted pipeline progression—enabling instant physical-event lead scanning, contextual deal creation from live chats, and unified omnichannel communication in a high-density, action-oriented workspace.

## Operating Context

- High-volume, fast-paced sales operations, roadshows, and physical exhibitions.
- Multi-channel communication hubs (WhatsApp Business, Meta Messenger, Instagram Direct, Email, Webforms).
- Desktop-first high-density dashboard workflows with dual sidebars (outer collapsible rail + inner contextual secondary panel) and responsive modal workflows.

## Capabilities and Constraints

- **Omnichannel Inbox:** Unified communication from WhatsApp, Messenger, Instagram, Email, Webforms, and Chat with agent assignment, custom tagging, and quick deal creation.
- **Deals Pipeline Board:** Drag-and-drop Kanban view synchronized with conversation-driven deal triggers and customizable deal stages.
- **Contacts Directory:** High-capacity contact list (2,500+ records) with live search, advanced filtering, multi-row bulk actions, and activity drawers.
- **Events & AI Copilot Wizards:** Roadshow lead capture, AI Name Card Scanner wizard, AI Auto-messaging templates with tone adjustment, and event conversion analytics.
- **Technical Stack:** Vue 3 SFC (`<script setup lang="ts">`), TypeScript, Vite, Tailwind CSS v4, Shadcn/Vue & Radix Vue / Reka UI primitives, Pinia for layout state, Lucide & Iconify icons, Unovis charts.

## Brand Commitments

- **Design System:** Governed by the Nova v4.0 design specification.
- **Color Identity:** Segmented Hybrid Color Strategy — Primary Brand Green (`oklch(0.527 0.154 150.069)` / `#008236`), Highlight Green (`#23B750`), Secondary Lime (`#62D816`), Dark Outer Rail (`#111827`), Neutral Light Background (`#F9FAFB` / `bg-gray-50`), Clean Divider Borders (`#E9E9E9`).
- **Typography:** `Inter Variable` with clean hierarchy, monospace numbers/timestamps, and crisp contrast.
- **Aesthetic Tone:** Modern, compact corporate look with low radius corners (`--radius: 0.3rem` / ~5px), subtle shadows, and snappy spring micro-interactions.

## Evidence on Hand

- Project specification & handover documentation: [docs/project_context.md](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/docs/project_context.md)
- Design system token & component guide: [docs/design_system_prompt.md](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/docs/design_system_prompt.md)
- Deterministic mock dataset of 2,500 contacts: [src/data/contactsData.ts](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/data/contactsData.ts)
- Comprehensive interactive views for Contacts, Deals Kanban, Omnichannel, and Events in `src/views/`.

## Product Principles

1. **Conversation to Action:** Every chat thread, scan, or inquiry should have a frictionless path to becoming a qualified deal or updated contact record.
2. **High-Density Usability:** Present rich sales metadata cleanly without clutter; prioritize scanability, keyboard accessibility, and rapid data entry.
3. **Responsive Tactility:** Provide instantaneous visual feedback, snappy micro-interactions, and real-time state synchronization across views.
4. **Accessible Contrast:** Guarantee WCAG AA contrast (4.5:1+) for all core functional elements, labels, and CTAs.

## Accessibility & Inclusion

- Adhere to WCAG AA color contrast standards across all functional states and interactive controls.
- Keyboard navigable dialogs, comboboxes, dropdowns, and drawers powered by accessible Radix Vue / Reka UI primitives.
