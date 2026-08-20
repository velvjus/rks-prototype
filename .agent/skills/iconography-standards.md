---
name: iconography-standards
description: Enforces the correct libraries for system UI icons and brand logos.
---

### Goal
Prevent icon hallucination, maintain consistent stroke weights, and establish a reliable source for brand logos.

### Instructions
- For all standard system UI icons (e.g., navigation, actions, alerts), exclusively use `lucide-vue-next`.
- Do not use FontAwesome, Heroicons, or inject raw, unmanaged SVG strings for standard UI elements.
- `lucide-vue-next` does not contain brand logos. For brand icons (e.g., WhatsApp, Instagram, Telegram), you must install and use `@iconify/vue`.
- When rendering brand icons via Iconify, use the `simple-icons` or `logos` collections (e.g., `<Icon icon="simple-icons:whatsapp" />` or `<Icon icon="simple-icons:instagram" />`).
- Ensure all icons scale correctly by passing standard Tailwind sizing classes (e.g., `w-5 h-5` or `w-4 h-4`).
