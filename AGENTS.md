# Project Rules & Guidelines

## Page Addition & Navigation
Whenever adding a new page into our prototype:
- Make sure it reflects on the navigation bar.
- Update [AppShell.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/components/layout/AppShell.vue), which renders:
  - [Sidebar.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/components/layout/Sidebar.vue)
  - [SecondaryPanel.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/components/layout/SecondaryPanel.vue)
  - [MainLayout.vue](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/layouts/MainLayout.vue)


## Theming & Colors (Light / Dark Mode)
All styling must flow from a single source of truth: the CSS variables in [index.css](file:///c:/Users/justi/Documents/VeecoTech/Rakansales/Antigravity/RakanSales%20C4/src/assets/index.css) (`:root` for light, `.dark` for dark). Whenever writing or editing UI code:
- **Use semantic token classes only**, e.g. `bg-background`, `bg-card`, `bg-muted`, `bg-popover`, `text-foreground`, `text-muted-foreground`, `border-border`, `border-input`, `ring-ring`, `bg-primary`, `text-primary-foreground`, `bg-destructive`, `bg-sidebar`.
- **Do NOT use raw colors** in new or edited code:
  - No raw palette grays/neutrals: `bg-white`, `bg-black`, `text-gray-*`, `bg-slate-*`, `border-zinc-*`, etc.
  - No hex/rgb values in classes or inline styles: `bg-[#23B750]`, `text-[#111827]`, `style="color: #..."`, `rgba(...)`.
  - No raw status colors (`bg-green-100`, `text-red-600`, `bg-amber-50`…) — use the status tokens (`success`, `warning`, `info`, `destructive`) and opacity modifiers (e.g. `bg-success/10 text-success`).
- **Do NOT add `dark:` color overrides** (e.g. `bg-white dark:bg-gray-900`). If a token doesn't look right in dark mode, fix the token value under `.dark` in `index.css` — not the component.
- **Need a color that has no token?** Add a new semantic variable to both `:root` and `.dark` in `index.css` (and map it in `@theme inline`), then use it. Never hardcode it in the component.
- **Charts / JS-configured colors** (ApexCharts, Unovis, canvas) must read colors from CSS variables (e.g. via `getComputedStyle`) and react to theme changes — never hardcode hex values in chart options.
- **Verify every new or edited page in both light and dark mode** before considering it done.
