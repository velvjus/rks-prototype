---
name: theming-guidelines
description: Enforces strict Light and Dark mode using Tailwind and shadcn-vue CSS variables, maintaining a flat UI.
---

### Goal
Maintain visual consistency, ensure proper dark mode toggling without hardcoded hex colors, and apply a strictly flat aesthetic.

### Instructions
- This application must support both Light and Dark modes seamlessly.
- Always use Tailwind CSS utility classes linked to CSS variables (e.g., `bg-background`, `text-foreground`, `bg-primary`) rather than hardcoded hex values in the markup.
- Ensure borders and shadows adapt to the theme using Tailwind's `dark:` modifier (e.g., `border-gray-200 dark:border-gray-800`).
- Use the primary accent color `#23B750` (or its designated CSS variable equivalent) for interactive elements, primary buttons, and active states.
- Enforce a "Compact" layout density by defaulting to tighter padding (`p-3`, `p-4`) and `text-sm` for standard data.
- Enforce a strictly flat UI. All components (including Kanban cards, dropdowns, inputs, dialogs, and buttons) must be flat by default using subtle borders. No drop shadows should be used under any circumstances, not even for hover states. Interactivity should be indicated solely via color changes, border styling, or subtle scale transitions.

