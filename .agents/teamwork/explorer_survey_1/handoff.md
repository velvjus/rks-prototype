# Technical Survey Report: R1 Foundation & Token System

**Author**: Explorer 1  
**Working Directory**: `.agents/teamwork/explorer_survey_1/`  
**Date**: 2026-10-30T10:05:00Z  
**Target Milestone**: Survey Phase — R1 Foundation & Token System  

---

## 1. Observation

### 1.1 `src/assets/index.css` Structure & Duplication
Direct inspection of `src/assets/index.css` (390 lines) revealed the following architecture:
- **Lines 1–6**:
  ```css
  @import "tailwindcss";
  @import "tw-animate-css";
  @import "shadcn/tailwind.css";

  @custom-variant dark (&:is(.dark *));
  @config "../../tailwind.config.js";
  ```
- **Lines 8–73**: First `:root` definition inside `@layer base`:
  - Contains core shadcn tokens in `oklch(...)`: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--chart-1` through `--chart-5`, `--radius`, and `--sidebar-*`.
  - Lines 44–56: Defines custom RKS Brand Tokens (`--rks-green: #23B750;`, `--rks-green-dark: #1a943e;`, `--rks-lime: #62D816;`, `--rks-danger: #EF4444;`, `--rks-danger-dark: #DC2626;`, `--rks-gray-900: #111827;`, `--rks-gray-800: #1F2937;`, `--rks-gray-100: #F3F4F6;`).
  - Lines 57–73: Defines `--rks-shadow-*` system (sm through 3xl, inner) and state-colored toast shadows (`--rks-shadow-success`, `--rks-shadow-danger`, `--rks-shadow-warning`, `--rks-shadow-info`).
- **Lines 75–124**: First `.dark` definition inside `@layer base`:
  - Contains dark theme overrides for shadcn core tokens in `oklch(...)`.
  - Contains dark theme overrides for `--rks-shadow-*` tokens.
  - **Does not redefine** brand tokens (`--rks-green`, `--rks-lime`, `--rks-danger`, `--rks-gray-*`).
- **Lines 143–185**: `@theme inline` block:
  - Exposes CSS variables to Tailwind v4 as utility tokens (`--color-sidebar-*`, `--color-chart-*`, `--color-ring`, `--color-input`, `--color-border`, `--color-destructive`, `--color-accent-*`, `--color-muted-*`, `--color-secondary-*`, `--color-primary-*`, `--color-popover-*`, `--color-card-*`, `--color-foreground`, `--color-background`, `--radius-*`).
  - **Missing**: `--color-destructive-foreground` is not mapped in `@theme inline`.
  - **Missing**: No semantic status tokens (`success`, `warning`, `info`, `brand`).
  - **Missing**: No rail tokens (`rail`, `rail-foreground`, `rail-muted-foreground`, `rail-border`, `rail-active`).
  - **Missing**: No categorical tag tokens (`tag-1` through `tag-6`).
- **Lines 187–220**: **Duplicate second `:root` block outside `@layer base`**:
  - Repeats lines 9–42 verbatim, **except** line 25 (`--destructive-foreground: oklch(0.985 0 0);`) is omitted!
  - Omits all `--rks-*` variables and shadow tokens.
  - Because it is unlayered, it has higher CSS specificity than the `@layer base` block, overriding the first `:root`.
- **Lines 222–254**: **Duplicate second `.dark` block outside `@layer base`**:
  - Repeats lines 76–107 verbatim.
  - Omits all `--rks-shadow-*` tokens defined in the first `.dark` block.
- **Lines 356–390**: Scrollbar styles:
  - Hardcoded raw hex colors: light mode uses `#cbd5e1` and hover `#94a3b8`; dark mode uses `#334155` and hover `#475569`.

### 1.2 Variable Inventory & Light vs Dark Comparison
| Variable | `:root` (Light) | `.dark` (Dark) | Status / Notes |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Present in both |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Present in both |
| `--card` / `--card-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Present in both |
| `--popover` / `--popover-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Present in both |
| `--primary` / `--primary-foreground` | `oklch(0.527 0.154 150.069)` / `oklch(0.982 0.018 155.826)` | `oklch(0.448 0.119 151.328)` / `oklch(0.982 0.018 155.826)` | Present in both |
| `--secondary` / `--secondary-foreground` | `oklch(0.967 0.001 286.375)` / `oklch(0.21 0.006 285.885)` | `oklch(0.274 0.006 286.033)` / `oklch(0.985 0 0)` | Present in both |
| `--muted` / `--muted-foreground` | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` | Present in both |
| `--accent` / `--accent-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | Present in both |
| `--destructive` / `--destructive-foreground` | `oklch(0.577 0.245 27.325)` / `oklch(0.985 0 0)` | `oklch(0.704 0.191 22.216)` / `oklch(0.985 0 0)` | Missing `--destructive-foreground` in 2nd `:root` |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Present in both |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | Present in both |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Present in both |
| `--chart-1` through `--chart-5` | `oklch(0.871..0.448 ...)` | `oklch(0.871..0.448 ...)` | Identical values in light and dark |
| `--sidebar` through `--sidebar-ring` | `oklch(0.985 0 0)` ... | `oklch(0.205 0 0)` ... | Standard shadcn sidebar (light in root, dark in dark) |
| **`--success` / `--success-foreground`** | **MISSING** | **MISSING** | Needed for status and alerts |
| **`--warning` / `--warning-foreground`** | **MISSING** | **MISSING** | Needed for status and alerts |
| **`--info` / `--info-foreground`** | **MISSING** | **MISSING** | Needed for status and alerts |
| **`--brand` / `--brand-foreground` / `--brand-secondary`** | **MISSING** (only raw `--rks-green`) | **MISSING** | Needed for brand identity |
| **`--rail` / `--rail-foreground` / `--rail-muted-foreground` / `--rail-border` / `--rail-active`** | **MISSING** | **MISSING** | Needed to keep rail dark in both light & dark |
| **`--tag-1` through `--tag-6` (bg & fg)** | **MISSING** | **MISSING** | Needed for CRM categories & badges |

### 1.3 `tailwind.config.js` Inspection
Direct view of `tailwind.config.js`:
- Lines 19–57 (`theme.extend.colors`):
  ```javascript
  colors: {
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: {
      DEFAULT: '#23B750', // HARDCODED RAW HEX OVERRIDE!
      foreground: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      DEFAULT: '#62D816', // HARDCODED RAW HEX OVERRIDE!
      foreground: 'hsl(var(--secondary-foreground))',
    },
    destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))',
    },
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))',
    },
    accent: {
      DEFAULT: '#2E91E5', // HARDCODED RAW HEX OVERRIDE!
      foreground: 'hsl(var(--accent-foreground))',
    },
    cyan: {
      DEFAULT: '#2EE1E5', // HARDCODED RAW HEX OVERRIDE!
      foreground: 'hsl(var(--accent-foreground))',
    },
    popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))',
    },
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))',
    },
  }
  ```
- **Flaws Identified**:
  1. `primary.DEFAULT: '#23B750'` and `secondary.DEFAULT: '#62D816'` and `accent.DEFAULT: '#2E91E5'` hardcode hex values in the Tailwind color map. In dark mode, `--primary` is `oklch(0.448 0.119 151.328)` and `--secondary` is `oklch(0.274 0.006 286.033)`. Any utility using the config's `primary.DEFAULT` is locked to `#23B750` and cannot adapt dynamically.
  2. The `hsl(var(--...))` wrapper format wraps CSS variables in `hsl()`. In `src/assets/index.css`, variables are defined in OKLCH (e.g. `--background: oklch(1 0 0)`). Generating `hsl(oklch(...))` is invalid CSS syntax.
  3. No entries exist for `success`, `warning`, `info`, `brand`, `rail`, or `tag-*`.

### 1.4 Theming Mechanisms & App Shell State
- **Grep for `rks-dark` and `toggleDark`**:
  Found only in `src/layouts/MainLayout.vue` lines 41–60:
  ```typescript
  const isDark = ref(localStorage.getItem('rks-dark') === 'true')
  const applyDark = (val: boolean) => {
    if (val) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('rks-dark', String(val))
  }
  applyDark(isDark.value)
  const toggleDark = () => {
    isDark.value = !isDark.value
    applyDark(isDark.value)
  }
  ```
- **Active Layout Investigation**:
  `src/App.vue` renders:
  ```vue
  <template>
    <AppShell>
      <RouterView />
    </AppShell>
    <Toaster position="bottom-right" richColors />
  </template>
  ```
  `src/components/layout/AppShell.vue` renders `TopNav.vue`, `Sidebar.vue`, and `SecondaryPanel.vue`.
  `src/layouts/MainLayout.vue` is **not imported anywhere** in `App.vue` or `AppShell.vue` (it was an earlier standalone layout).
- **Finding**: The active application currently has **no theme toggle button anywhere** in `TopNav.vue` or `Sidebar.vue`, no active theme composable, and no system preference listener (`window.matchMedia('(prefers-color-scheme: dark)')`).

### 1.5 Build & Environment Check
- Command: `npm.cmd run build` (PowerShell requires `.cmd` because script execution policy restricts `.ps1` files).
- Script: `"build": "vue-tsc -b && vite build"`.
- Result: **Exited with code 0 in 15.79s**. 2960 modules transformed, 0 TypeScript errors, 0 build errors.
- Packages: `tailwindcss: ^4.3.0`, `@tailwindcss/postcss: ^4.3.0`, `@vueuse/core: ^14.3.0`, `vue: ^3.5.34`, `vue-tsc: ^3.2.8`.

---

## 2. Logic Chain

### 2.1 CSS Layer Specificity & Duplication Conflict
1. In `src/assets/index.css`, lines 8–124 define `:root` and `.dark` inside `@layer base`.
2. Lines 187–254 define a second set of `:root` and `.dark` outside `@layer base`.
3. In CSS Cascade Layers (CSS spec), unlayered styles always override layered styles regardless of selector specificity. Therefore, lines 187–254 override lines 8–124.
4. However, lines 187–220 omit `--destructive-foreground` and omit all `--rks-shadow-*` and `--rks-*` variables.
5. In addition, having duplicate blocks causes maintenance drift (as already proven by `--destructive-foreground` missing in the second block).
6. **Inference**: Deduplicating into a single canonical `:root` and single `.dark` block inside `@layer base` resolves the override conflict, restores missing variables, and eliminates maintenance drift.

### 2.2 Dedicated Rail Token Necessity
1. In `src/components/layout/Sidebar.vue` and `TopNav.vue`, the navigation rail and top header are styled with `bg-gray-950`, `border-gray-800`, `text-white`, and `bg-gray-800`.
2. Standard shadcn `--sidebar` is `oklch(0.985 0 0)` in light mode (pure white/light gray) and `oklch(0.205 0 0)` in dark mode.
3. If the outer rail were changed to `bg-sidebar` or `bg-background`, it would become bright white in light mode, breaking the product's signature dark outer rail design.
4. If developers keep raw `bg-gray-950` and `text-white`, it violates the core rule: *"No raw palette grays/neutrals: bg-white, bg-black, text-gray-\*, bg-slate-\*, border-zinc-\*"*.
5. **Inference**: Introducing dedicated rail tokens (`--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-border`, `--rail-active`) that resolve to dark neutral values in *both* `:root` and `.dark` satisfies both constraints: the rail remains dark in all themes, and all styling is 100% token-driven.

### 2.3 Categorical Tag Tokens Structure
1. Across CRM views (webforms, contacts, deals, omnichannel), tags and badges currently use scattered raw color classes like `bg-blue-50 text-blue-700`, `bg-emerald-50 text-emerald-600`, `bg-purple-50 text-purple-700`, `bg-orange-50 text-orange-600`.
2. In dark mode, light background tags (e.g. `bg-blue-50`) cause harsh glare, while dark text (`text-blue-700`) is illegible against dark backgrounds.
3. To provide semantic categorization, 6 distinct color channels are required:
   - Tag 1: Blue / Sky
   - Tag 2: Emerald / Brand Green
   - Tag 3: Amber / Warm Orange
   - Tag 4: Purple / Violet
   - Tag 5: Rose / Red
   - Tag 6: Cyan / Teal
4. Each tag needs a paired background (`--tag-N`) and foreground (`--tag-N-foreground`) token in OKLCH:
   - Light mode: High lightness background (e.g. L=0.95), low lightness text (L=0.40) ensuring WCAG AA contrast (>4.5:1).
   - Dark mode: Low lightness background (e.g. L=0.25), high lightness text (L=0.85) ensuring WCAG AA contrast.
5. In `@theme inline`: Expose `--color-tag-1: var(--tag-1);` and `--color-tag-1-foreground: var(--tag-1-foreground);`.
6. **Inference**: Developers can use `bg-tag-1 text-tag-1-foreground` or opacity variants `bg-tag-1/20 text-tag-1-foreground` across all views with guaranteed legibility in both light and dark modes.

### 2.4 `tailwind.config.js` Decoupling from Raw Hex
1. `tailwind.config.js` currently overrides `primary.DEFAULT` with `'#23B750'`, `secondary.DEFAULT` with `'#62D816'`, and `accent.DEFAULT` with `'#2E91E5'`.
2. When Tailwind utilities are evaluated against the config, raw hex values prevent dark mode token switching.
3. Wrapping OKLCH variables with `hsl(var(--...))` produces invalid CSS.
4. **Inference**: In `tailwind.config.js`, all colors in `theme.extend.colors` must reference CSS variables directly: `var(--<token>)`. All raw hex overrides must be removed.

### 2.5 Centralized Theme Composable (`useTheme.ts`)
1. Currently theme state is isolated in an unmounted component (`MainLayout.vue`), and the app cannot toggle themes.
2. The acceptance criteria specify `useTheme.ts` managing theme state, persisting to localStorage, and detecting system preference.
3. `@vueuse/core` 14.3.0 is installed, but a bespoke composable providing explicit controls (`light`, `dark`, `system`), clean class toggling on `document.documentElement`, backwards-compatible `localStorage` sync (`rks-theme` and `rks-dark`), and event listeners for `matchMedia('(prefers-color-scheme: dark)')` will provide a robust, dependency-minimal single source of truth.
4. A theme toggle button can then be mounted in `TopNav.vue` (header utility bar) and `Sidebar.vue` (nav rail footer) to enable immediate switching.

---

## 3. Caveats

1. **Standalone HTML Prototype Pages**:
   The repository contains three static HTML files (`html/setup-wizard.html`, `html/partner-register.html`, `html/onboarding-wizard.html`) with inline Tailwind CDN scripts. These are standalone prototypes and not part of the Vue/Vite build bundle.
2. **`MainLayout.vue` Role**:
   `MainLayout.vue` is currently unused in `App.vue` (which uses `AppShell.vue`), but is listed in Batch 1 of the migration plan. It should be retained, tokenized, and connected to `useTheme.ts` to ensure full prototype integrity.
3. **Tailwind v4 `@theme inline` vs `tailwind.config.js`**:
   Tailwind CSS v4 primarily generates utility classes from `@theme inline` in `index.css`. The `@config "../../tailwind.config.js"` directive enables backwards compatibility with tools like shadcn-vue CLI. Keeping both in exact synchronization is mandatory.

---

## 4. Conclusion & Recommendations

The survey confirms that R1 (Foundation & Token System) requires five coordinated changes:
1. **Deduplicate `src/assets/index.css`**: Remove duplicate unlayered lines 187–254. Consolidate all tokens in `@layer base`:
   - Add status tokens: `--success`, `--warning`, `--info`, `--brand`, and their foregrounds.
   - Add rail tokens: `--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-border`, `--rail-active` (dark values in both light and dark mode).
   - Add categorical tag tokens: `--tag-1` through `--tag-6` with paired background and foreground in OKLCH.
   - Map all new tokens in `@theme inline`.
   - Tokenize scrollbar styles.
2. **Clean `tailwind.config.js`**:
   - Remove raw hex overrides (`#23B750`, `#62D816`, `#2E91E5`, `#2EE1E5`).
   - Remove `hsl()` wrappers; use `var(--<token>)` directly.
   - Add `success`, `warning`, `info`, `brand`, `rail`, and `tag` color mappings.
3. **Implement `src/composables/useTheme.ts`** (and alias in `src/hooks/useTheme.ts`):
   - Reactive `mode` (`'light' | 'dark' | 'system'`), `isDark` boolean computed.
   - Synchronous document class manipulation (`classList.add('dark')` / `classList.remove('dark')`).
   - LocalStorage persistence (`'rks-theme'` with fallback to `'rks-dark'`).
   - System preference detection via `window.matchMedia`.
   - Add anti-FOUC script in `index.html`.
4. **Integrate Theme Toggle in App Shell**:
   - Add theme toggle button in `TopNav.vue` (next to Help and Notifications) and `Sidebar.vue`.
5. **Tooling & Audit Script**:
   - Create `scripts/audit-tokens.cjs` to enforce zero raw color violations across migrated batches.

---

## 5. Concrete Implementation Plan for R1

### Phase 1: Canonical Token Definitions (`src/assets/index.css`)

#### Proposed `:root` Token Additions (inside `@layer base`):
```css
    /* Semantic Status Tokens (Light Mode) */
    --success: oklch(0.627 0.194 149.214);
    --success-foreground: oklch(0.985 0 0);
    --warning: oklch(0.769 0.188 70.08);
    --warning-foreground: oklch(0.145 0 0);
    --info: oklch(0.623 0.188 250.3);
    --info-foreground: oklch(0.985 0 0);

    /* Brand Tokens (Light Mode) */
    --brand: oklch(0.627 0.194 149.214);
    --brand-foreground: oklch(0.985 0 0);
    --brand-secondary: oklch(0.81 0.22 135);

    /* Dedicated Rail Tokens (Light Mode - Dark Outer Rail Aesthetic) */
    --rail: oklch(0.13 0.028 261.692);
    --rail-foreground: oklch(0.985 0 0);
    --rail-muted-foreground: oklch(0.708 0 0);
    --rail-border: oklch(0.269 0 0);
    --rail-active: oklch(0.269 0 0);

    /* Categorical Tag Tokens (Light Mode: subtle bg + high-contrast text) */
    --tag-1: oklch(0.95 0.04 240);
    --tag-1-foreground: oklch(0.42 0.16 245);
    --tag-2: oklch(0.95 0.05 150);
    --tag-2-foreground: oklch(0.38 0.15 150);
    --tag-3: oklch(0.95 0.06 75);
    --tag-3-foreground: oklch(0.45 0.16 65);
    --tag-4: oklch(0.95 0.05 300);
    --tag-4-foreground: oklch(0.42 0.18 300);
    --tag-5: oklch(0.95 0.05 25);
    --tag-5-foreground: oklch(0.45 0.18 25);
    --tag-6: oklch(0.95 0.05 195);
    --tag-6-foreground: oklch(0.42 0.14 195);
```

#### Proposed `.dark` Token Additions (inside `@layer base`):
```css
    /* Semantic Status Tokens (Dark Mode) */
    --success: oklch(0.69 0.17 150);
    --success-foreground: oklch(0.985 0 0);
    --warning: oklch(0.78 0.16 70);
    --warning-foreground: oklch(0.145 0 0);
    --info: oklch(0.68 0.16 250);
    --info-foreground: oklch(0.985 0 0);

    /* Brand Tokens (Dark Mode) */
    --brand: oklch(0.65 0.18 149.2);
    --brand-foreground: oklch(0.985 0 0);
    --brand-secondary: oklch(0.78 0.20 135);

    /* Dedicated Rail Tokens (Dark Mode - Consistent Outer Rail Aesthetic) */
    --rail: oklch(0.12 0.02 260);
    --rail-foreground: oklch(0.985 0 0);
    --rail-muted-foreground: oklch(0.708 0 0);
    --rail-border: oklch(1 0 0 / 10%);
    --rail-active: oklch(0.269 0 0);

    /* Categorical Tag Tokens (Dark Mode: rich dark bg + light legible text) */
    --tag-1: oklch(0.25 0.06 245);
    --tag-1-foreground: oklch(0.85 0.10 240);
    --tag-2: oklch(0.25 0.07 150);
    --tag-2-foreground: oklch(0.85 0.12 150);
    --tag-3: oklch(0.27 0.07 70);
    --tag-3-foreground: oklch(0.86 0.14 75);
    --tag-4: oklch(0.26 0.08 300);
    --tag-4-foreground: oklch(0.85 0.12 300);
    --tag-5: oklch(0.26 0.08 25);
    --tag-5-foreground: oklch(0.85 0.12 25);
    --tag-6: oklch(0.25 0.06 195);
    --tag-6-foreground: oklch(0.85 0.10 195);
```

#### Proposed `@theme inline` Additions:
```css
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-brand-secondary: var(--brand-secondary);
  --color-rail: var(--rail);
  --color-rail-foreground: var(--rail-foreground);
  --color-rail-muted-foreground: var(--rail-muted-foreground);
  --color-rail-border: var(--rail-border);
  --color-rail-active: var(--rail-active);
  --color-tag-1: var(--tag-1);
  --color-tag-1-foreground: var(--tag-1-foreground);
  --color-tag-2: var(--tag-2);
  --color-tag-2-foreground: var(--tag-2-foreground);
  --color-tag-3: var(--tag-3);
  --color-tag-3-foreground: var(--tag-3-foreground);
  --color-tag-4: var(--tag-4);
  --color-tag-4-foreground: var(--tag-4-foreground);
  --color-tag-5: var(--tag-5);
  --color-tag-5-foreground: var(--tag-5-foreground);
  --color-tag-6: var(--tag-6);
  --color-tag-6-foreground: var(--tag-6-foreground);
```

#### Proposed Scrollbar Tokenization in `index.css`:
```css
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: color-mix(in oklch, var(--muted-foreground) 40%, transparent);
}
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
```

---

### Phase 2: Clean `tailwind.config.js`
Replace lines 19–57 of `tailwind.config.js` with:
```javascript
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          foreground: 'var(--brand-foreground)',
          secondary: 'var(--brand-secondary)',
        },
        rail: {
          DEFAULT: 'var(--rail)',
          foreground: 'var(--rail-foreground)',
          muted: 'var(--rail-muted-foreground)',
          border: 'var(--rail-border)',
          active: 'var(--rail-active)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        tag: {
          1: { DEFAULT: 'var(--tag-1)', foreground: 'var(--tag-1-foreground)' },
          2: { DEFAULT: 'var(--tag-2)', foreground: 'var(--tag-2-foreground)' },
          3: { DEFAULT: 'var(--tag-3)', foreground: 'var(--tag-3-foreground)' },
          4: { DEFAULT: 'var(--tag-4)', foreground: 'var(--tag-4-foreground)' },
          5: { DEFAULT: 'var(--tag-5)', foreground: 'var(--tag-5-foreground)' },
          6: { DEFAULT: 'var(--tag-6)', foreground: 'var(--tag-6-foreground)' },
        },
      },
```

---

### Phase 3: Extract `src/composables/useTheme.ts`
Create `src/composables/useTheme.ts` (and re-export in `src/hooks/useTheme.ts`):
```typescript
import { ref, computed, watch, onMounted } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'rks-theme'
const LEGACY_STORAGE_KEY = 'rks-dark'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved
  }
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
  if (legacy === 'true') return 'dark'
  if (legacy === 'false') return 'light'
  return 'system'
}

const mode = ref<ThemeMode>(getInitialMode())
const systemPrefersDark = ref(false)

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = mediaQuery.matches
  mediaQuery.addEventListener('change', (e) => {
    systemPrefersDark.value = e.matches
    if (mode.value === 'system') {
      applyTheme(e.matches)
    }
  })
}

const isDark = computed(() => {
  if (mode.value === 'system') return systemPrefersDark.value
  return mode.value === 'dark'
})

function applyTheme(dark: boolean) {
  if (typeof document === 'undefined') return
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

watch(isDark, (val) => {
  applyTheme(val)
}, { immediate: true })

export function useTheme() {
  function setMode(newMode: ThemeMode) {
    mode.value = newMode
    localStorage.setItem(STORAGE_KEY, newMode)
    localStorage.setItem(LEGACY_STORAGE_KEY, String(isDark.value))
    applyTheme(isDark.value)
  }

  function toggleTheme() {
    setMode(isDark.value ? 'light' : 'dark')
  }

  return {
    mode,
    isDark,
    setMode,
    toggleTheme,
  }
}
```

Add anti-FOUC script inside `<head>` of `index.html`:
```html
<script>
  (function() {
    try {
      var theme = localStorage.getItem('rks-theme');
      var legacy = localStorage.getItem('rks-dark');
      var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || (!theme && legacy === 'true');
      if (isDark) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
</script>
```

---

### Phase 4: App Shell Integration
1. In `src/components/layout/TopNav.vue`:
   - Import `useTheme` and `Sun`, `Moon` icons from `lucide-vue-next`.
   - Add a theme toggle button in the right cluster next to notifications.
2. In `src/components/layout/Sidebar.vue`:
   - Replace raw classes (`bg-gray-950`, `border-gray-800`) with `bg-rail`, `border-rail-border`.
   - In `SidebarItem.vue`, replace raw classes (`bg-gray-800`, `text-white`, `text-gray-400`) with `bg-rail-active`, `text-rail-foreground`, `text-rail-muted-foreground`.
3. In `src/layouts/MainLayout.vue`:
   - Replace local `isDark` / `toggleDark` with `const { isDark, toggleDark } = useTheme()`.

---

### Phase 5: Token Audit Script (`scripts/audit-tokens.cjs`)
Create `scripts/audit-tokens.cjs` to scan files for:
- Raw palette grays (`gray-`, `slate-`, `zinc-`, `neutral-`)
- Raw hex codes in classes or styles (`#...`, `bg-[#...]`, `text-[#...]`)
- Raw status colors (`bg-green-`, `text-red-`, `bg-amber-`, `text-blue-`)
- Redundant `dark:` overrides (e.g. `dark:bg-...`)
Add `"audit:tokens": "node scripts/audit-tokens.cjs"` to `package.json`.

---

## 6. Verification Method

### 6.1 Independent Verification Steps
1. **Build Validation**:
   Run the project build command:
   ```powershell
   npm.cmd run build
   ```
   **Pass Condition**: Command exits with code 0 and 0 TypeScript errors.

2. **Deduplication Check in `src/assets/index.css`**:
   Verify that only one `:root` and one `.dark` block exist in the file:
   ```powershell
   Select-String -Path "src/assets/index.css" -Pattern "^:root"
   Select-String -Path "src/assets/index.css" -Pattern "^\.dark"
   ```
   **Pass Condition**: Exactly 0 unlayered `:root` / `.dark` blocks outside `@layer base`.

3. **Tailwind Config Hex Check**:
   Verify no raw hex values exist in `tailwind.config.js`:
   ```powershell
   Select-String -Path "tailwind.config.js" -Pattern "#[0-9a-fA-F]{3,8}"
   ```
   **Pass Condition**: 0 matches in `colors`.

4. **Theme Toggling in Browser**:
   - Serve app via `npm.cmd run dev` or `npm.cmd run preview`.
   - Click theme toggle button in `TopNav`.
   - Inspect `document.documentElement`: verify `.dark` class toggles smoothly.
   - Verify localStorage key `rks-theme` is updated.
   - Reload page: verify theme persists without white flash (FOUC).
   - Inspect outer navigation rail (`Sidebar` and `TopNav`): verify it remains sleek dark in both light and dark mode.

5. **Invalidation Conditions**:
   - Any raw hex value remains in `theme.extend.colors` in `tailwind.config.js`.
   - `index.css` retains duplicate `:root` or `.dark` blocks.
   - Outer rail becomes white in light mode.
   - `npm.cmd run build` fails with type or CSS errors.
