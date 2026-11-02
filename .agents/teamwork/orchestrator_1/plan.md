# Orchestration Plan — Dark Mode Migration

## Objective
Implement end-to-end dark mode across every page and component of the codebase following the token-based architecture and migration plan for production.

## Strategy: Project Pattern
1. **Phase 0: Survey (3 Parallel Explorers)**
   - Explorer 1 (Foundation): Inspect `src/assets/index.css`, `tailwind.config.js`, theming mechanisms, and existing CSS variables.
   - Explorer 2 (Component Batches): Enumerate files across all 9 batches, check existing color usages, and map out file paths.
   - Explorer 3 (Charts & Audit Tools): Investigate ApexCharts / Unovis charts, DESIGN.md / AGENTS.md rules, and audit script / codemod approach.
2. **Phase 1: Project Blueprint (PROJECT.md)**
   - Synthesize survey findings into Feature Inventory, Architecture, Interface Contracts, and Milestones.
3. **Phase 2: Milestone Iterations (Explorer -> Worker -> Reviewers -> Challengers -> Auditor)**
   - Enforce zero hardcoded colors, semantic tokens only, rail tokens, tag tokens, theme composable, chart dynamic CSS reading, and audit clean.
4. **Phase 3: Final Verification & Audit**
   - Zero violations reported by audit script, TypeScript and build clean, all tests passing.
