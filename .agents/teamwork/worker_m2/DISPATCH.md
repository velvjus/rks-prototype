## 2026-10-31T08:43:28Z
You are the Milestone 2 Implementation Worker (worker_m2).
Your working directory is: c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m2

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Context to Read
1. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\ORIGINAL_REQUEST.md` (Read first)
2. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m2_1\handoff.md` (Batch 1 line-by-line recipes)
4. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m2_2\handoff.md` (Batch 2 line-by-line recipes)
5. `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m2_3\handoff.md` (Holistic blueprint)

## Objective & Scope Boundaries
Your task is to implement the end-to-end token migration for Milestone 2: App Shell & UI Components (Batches 1 & 2), bringing all 15 affected files to 0 token audit violations and ensuring clean production build.

Exclusive Write Ownership:
### Batch 2 (UI Components — 7 files):
1. `src/components/ui/button/index.ts`: Update CVA button variants to semantic tokens (`destructive` -> `text-destructive-foreground`, `primary` -> `bg-primary text-primary-foreground`, `brand` -> `bg-brand text-brand-foreground`, `gradient` -> `from-brand to-brand-secondary text-brand-foreground`, `success` -> `bg-success text-success-foreground`, `danger` -> `bg-destructive text-destructive-foreground`, `dark` -> `bg-rail text-rail-foreground hover:bg-rail-active border border-rail-border`). Preserve full backwards compatibility.
2. `src/components/ui/alert/index.ts`: Remove redundant `dark:border-destructive`.
3. `src/components/ui/alert-dialog/AlertDialogContent.vue`: Replace `bg-black/80` with `bg-background/80 backdrop-blur-sm`.
4. `src/components/ui/dialog/DialogContent.vue`: Replace `bg-black/80` with `bg-background/80 backdrop-blur-sm`.
5. `src/components/ui/dialog/DialogScrollContent.vue`: Replace `bg-black/80` with `bg-background/80 backdrop-blur-sm`.
6. `src/components/ui/drawer/DrawerOverlay.vue`: Replace `bg-black/80` with `bg-background/80 backdrop-blur-sm`.
7. `src/components/ui/sheet/SheetContent.vue`: Replace `bg-black/80` with `bg-background/80 backdrop-blur-sm`.
8. `src/components/ui/chart/index.ts`: Ensure Unovis chart tokens link to CSS variables.

### Batch 1 (App Shell — 8 files):
9. `src/components/layout/AppShell.vue`: Replace `bg-gray-50` with `bg-background`.
10. `src/components/layout/Sidebar.vue`: Tokenize navigation rail using dedicated rail tokens (`bg-rail`, `border-rail-border`). Note: The rail remains dark neutral in both light and dark modes per token definitions.
11. `src/components/layout/SidebarItem.vue`: Tokenize items using `bg-rail-active`, `text-rail-foreground`, `text-rail-muted-foreground`, etc.
12. `src/components/layout/SecondaryPanel.vue`: Migrate from raw grays and hexes to `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, and `bg-primary/10 text-primary` for active route.
13. `src/components/layout/TopNav.vue`:
    - Mount theme toggle button with `Sun` and `Moon` icons from `lucide-vue-next` importing `useTheme` from `@/composables/useTheme`.
    - Tokenize header to `bg-card text-card-foreground border-border`.
    - Tokenize search input to `bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background`.
    - Tokenize dropdowns, dialogs, badges (`bg-success/10 text-success`, `bg-info/10 text-info`, etc.).
14. `src/components/omnichannel/InboxDropdown.vue`: Tokenize button filter, dropdown container (`bg-popover text-popover-foreground border-border`), active option (`bg-primary/10 text-primary`), channel status dots.
15. `src/components/omnichannel/ToastNotifications.vue`: Tokenize toast card (`bg-card text-card-foreground border-border`), type borders (`border-l-success`, `border-l-info`, `border-l-warning`), status icon colors.
16. `src/layouts/MainLayout.vue`: Tokenize entire shell, replace local theme logic with `useTheme()`, eliminate all 33 `dark:` overrides.

## Verification Requirements
You MUST run the following commands and include their exact output in your handoff report:
1. `node scripts/audit-tokens.cjs --batch 1` -> Must report 0 violations.
2. `node scripts/audit-tokens.cjs --batch 2` -> Must report 0 violations.
3. `cmd.exe /c "npm run build"` -> Must succeed with exit code 0 and 0 errors.

## Output Requirements
1. Record your steps and liveness in `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m2\progress.md`.
2. Write a comprehensive, self-contained handoff report at `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\worker_m2\handoff.md`.
3. Send a message to parent orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`) with your completion summary and verification results.
