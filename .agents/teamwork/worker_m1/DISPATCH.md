## 2026-10-30T10:04:47Z
You are Worker 1 for Milestone 1: Foundation, Token System & Tooling (R1).

Your working directory: c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m1\

Read the original user request at:
c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md

Read the project blueprint at:
c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md

Read Explorer 1's detailed technical survey & implementation plan at:
c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_survey_1\handoff.md

Read Explorer 3's tooling survey at:
c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_survey_3\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You exclusively own and may edit or create these files:
- `src/assets/index.css`
- `tailwind.config.js`
- `src/composables/useTheme.ts`
- `src/hooks/useTheme.ts`
- `index.html`
- `scripts/audit-tokens.cjs`
- `scripts/codemod-tokens.cjs`
- `package.json`

YOUR IMPLEMENTATION MISSION:
1. `src/assets/index.css`:
   - Remove the redundant unlayered duplicate `:root` (lines ~187–220) and `.dark` (lines ~222–254) blocks that currently override `@layer base`.
   - In `:root` inside `@layer base`:
     * Add semantic status tokens: `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--info`, `--info-foreground`.
     * Add brand tokens: `--brand`, `--brand-foreground`, `--brand-secondary`.
     * Add dedicated rail tokens: `--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-border`, `--rail-active` (using dark OKLCH values so the navigation rail stays dark in light mode).
     * Add categorical tag tokens: `--tag-1` through `--tag-6` with paired background and foreground tokens in OKLCH (high contrast in both themes).
   - In `.dark` inside `@layer base`:
     * Add dark theme counterparts for status, brand, rail, and categorical tag tokens.
     * Ensure `--destructive-foreground` is preserved.
   - In `@theme inline`:
     * Expose all new tokens as Tailwind utility classes (`--color-success*`, `--color-warning*`, `--color-info*`, `--color-brand*`, `--color-rail*`, `--color-tag-1*` through `--color-tag-6*`, `--color-destructive-foreground`).
   - Tokenize scrollbar styles to use semantic variables (`var(--border)` and `color-mix(...)`) instead of raw hex values (`#cbd5e1`, `#334155`).

2. `tailwind.config.js`:
   - In `theme.extend.colors`:
     * Remove all raw hex overrides (`primary.DEFAULT: '#23B750'`, `secondary.DEFAULT: '#62D816'`, `accent.DEFAULT: '#2E91E5'`, `cyan`).
     * Remove invalid `hsl(var(--...))` wrappers around OKLCH variables; map all color tokens directly to `var(--<token>)`.
     * Add mappings for `success`, `warning`, `info`, `brand`, `rail`, and `tag` (1..6).

3. `src/composables/useTheme.ts` & `src/hooks/useTheme.ts`:
   - Create a robust Vue 3 composable managing:
     * `mode: Ref<'light' | 'dark' | 'system'>`
     * `isDark: ComputedRef<boolean>`
     * `setMode: (mode: 'light' | 'dark' | 'system') => void`
     * `toggleTheme: () => void`
     * Synchronous `.dark` class toggling on `document.documentElement`
     * `localStorage` persistence with `'rks-theme'` and legacy fallback `'rks-dark'`
     * `window.matchMedia('(prefers-color-scheme: dark)')` listener for system preference
   - In `src/hooks/useTheme.ts`, re-export `useTheme` and types for compatibility.

4. `index.html`:
   - Add inline anti-FOUC script inside `<head>` to immediately apply `.dark` to `document.documentElement` before first paint based on localStorage / system preference.

5. Tooling:
   - Create `scripts/audit-tokens.cjs`: a fast, standalone Node.js audit script scanning `.vue`, `.ts`, and `.css` files for:
     * Palette grays (`gray-`, `slate-`, `zinc-`, `neutral-`, `white`, `black`)
     * Arbitrary hex/rgb classes (`bg-[#...]`, `text-[#...]`, etc.)
     * Raw status colors (`bg-green-`, `text-red-`, etc.)
     * `dark:` overrides
     Support CLI args: `--batch <1..9>`, `--file <path>`. Exit with code 0 on clean, 1 on violations.
   - Create `scripts/codemod-tokens.cjs`: an automated migration helper script for batch transforms.
   - Update `package.json` to add script `"audit:tokens": "node scripts/audit-tokens.cjs"`.

6. Build Verification:
   - Run `npm run build` (or `cmd.exe /c "npm run build"`) and verify it compiles with 0 TypeScript and build errors.
   - Run `node scripts/audit-tokens.cjs --file src/assets/index.css` to verify the audit script works.
