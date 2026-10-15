# Design Critique Snapshot: AI Assistants Inner Pages Suite
**Target**: `src/components/settings/AIAssistantsTab.vue`  
**Date**: 2026-10-02T05:00:00Z  
**Method**: dual-agent (A: 11a74ccc · B: 1891e6b3)  
**Score**: 24/40  

---

## Heuristics Scorecard

| Heuristic | Score | Key Finding |
|---|:---:|---|
| 1. Visibility of System Status | 3 | Live/Draft pills, training badges, real-time simulated chat. Lacks granular vector indexing progress bar. |
| 2. Match Between System & Real World | 3 | Authentic HoReCa foodservice wholesale terminology (JAKIM Halal, MOQ, Reefer routes, 30-day net credit). Generic credit warning. |
| 3. User Control and Freedom | 1 | Destructive tool & inbox deletion occurs instantly without confirmation or undo. |
| 4. Consistency and Standards | 2 | Inconsistent deletion patterns (Assistants/Docs have safety modal; Tools/Inboxes do not). Debug toggles exposed in production header. |
| 5. Error Prevention | 2 | Missing API endpoint protocol validation and ping/test connection. Static pre-flight checklist. |
| 6. Recognition Rather Than Recall | 3 | Excellent pre-built templates, adoptable guardrail presets, and quick prompt chips. |
| 7. Flexibility and Efficiency of Use | 2 | No tab keyboard shortcuts; escalation triggers are hardcoded as readonly. |
| 8. Aesthetic and Minimalist Design | 3 | Polished card elevation, balanced spacing. Cluttered header actions from developer debug toggle. |
| 9. Error Recovery | 2 | Missing input retention on accidental backdrop dismiss. No undo toast for deleted tools. |
| 10. Help and Documentation | 3 | In-depth AI Assistant Playbook modal, clear contextual hints under inputs. |

---

## Priority Issues (P0–P3)
- **P0**: Destructive Inline Deletion on Custom Tools & Connected Inboxes without confirmation modal or undo.
- **P1**: Developer debug toggle buttons (`Preview Empty State` / `Preview Empty View`) exposed in production interface.
- **P2**: Information Architecture mismatch — all 7 peer tabs grouped under `SETUP`, obscuring Playground (Testing) and Report (Analytics).
- **P3**: Hardcoded escalation keywords (`readonly`) and stale mock identifiers (`_MainSg`, `+stale_166_1790913343`, `api.example.com`).
