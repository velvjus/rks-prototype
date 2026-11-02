# DISPATCH — explorer_m4_2

## Mission: Batch 6 (Forms & Booking) Deep Exploration for Milestone 4
Your working directory is: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_2`

You MUST read:
1. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md`
2. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\AGENTS.md`

### Scope (Batch 6 - Forms, Tools & Booking):
1. `src/views/FormBuilderView.vue`
2. `src/views/WebFormsDashboardView.vue`
3. `src/views/FormDetailView.vue`
4. `src/views/SubmissionsView.vue`
5. `src/views/BookingPagesView.vue`
6. `src/views/ScanNameCardView.vue`
7. `src/views/AddonsView.vue`

### Tasks:
1. Run `node scripts/audit-tokens.cjs --batch 6` to catalog all current token violations in Batch 6.
2. Inspect each file in detail: identify all raw grays, hex values, raw status colors, and `dark:` overrides.
3. Formulate exact semantic token replacements adhering to `AGENTS.md` and `PROJECT.md` (e.g. `bg-card`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-brand`, `bg-primary`, `bg-success/10`, etc.).
4. Verify FormBuilder drag-and-drop canvas, interactive previews, and modal overlays to ensure no contrast degradation in dark mode.
5. Check for double-slash opacity classes or syntax risks (`token/x/y`).
6. Write your findings and drop-in recipes to `handoff.md` in your working directory. Send a message to orchestrator when finished.
