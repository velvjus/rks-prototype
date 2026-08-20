# Deal popup design audit

## Scope

- Route: `/deals`
- State reviewed: deal popup open on the Deal Info and Notes tabs
- Reference: `codex-clipboard-57317e1c-dc28-436d-9b85-ff458121b281.png`
- Browser evidence: `03-deal-popup-desktop.png`

## Initial critique

- **P1 — Information hierarchy:** the prior compact modal and 10–12 px copy made the deal title, pipeline, metadata, and working content compete for attention.
- **P1 — Action hierarchy:** won/lost controls were visually prominent even though they are consequential, infrequent actions. The reference prioritizes inspection and editing.
- **P2 — Layout density:** sidebar metadata used placeholder values and tight spacing, while the main panel lacked the reference's clear insight, description, notes, and composer zones.
- **P2 — Navigation:** extra tabs diluted the four primary deal contexts shown in the reference.
- **P2 — Accessibility:** icon-only controls and custom toggles needed explicit names, semantic roles, focus states, and larger hit areas.
- **P2 — Responsiveness:** the original fixed proportions did not preserve the two-column desktop workflow at common laptop widths.

## Implemented fixes

- Rebuilt the popup as a large, responsive SaaS workspace with a 5-step pipeline, scroll-safe sidebar, and sticky note composer.
- Added the Rakan Insights surface and clearer Deal Info, Conversations, People, and Log navigation.
- Upgraded typography, spacing, contrast, card structure, and metadata legibility.
- Reused the application's real contact avatars and Lucide icon system; no new raster assets were needed.
- Added semantic dialog labeling, named icon controls, switch roles, focus rings, disabled composer state, and functional expand/collapse behavior.

## Verification

- Desktop visual comparison: `04-reference-comparison.png`
- Focused comparison: `05-focused-comparison.png`
- Browser checks passed for tab switching, note submission, expand/restore, and sidebar switch behavior.
- Production build passed. Screenshot review does not replace a dedicated screen-reader or full keyboard-only audit.

## Compact-scale iteration

- User feedback identified that the popup consumed too much of the in-app browser and concealed useful information at 890 x 810.
- The laptop presentation now uses a larger internal canvas rendered at a compact 82% scale, preserving the reference layout while exposing all primary cards, the insight panel, description, and composer at once.
- Evidence: `08-popup-compact.png` and `09-compact-reference-comparison.png`.

## Fullscreen screenshot correction

- The user's 1920 x 1054 capture exposed that the expanded state bypassed compact sizing and made the popup nearly edge-to-edge.
- Flex shrinking also compressed each sidebar card, hiding Deal Info rows and portions of the contact and company cards.
- Full-screen expansion has been removed, the large-screen modal is capped at 1320 x 748 rendered pixels, and sidebar cards now retain their intrinsic content height inside a scrollable rail.
- Evidence: `10-popup-fullscreen-fixed.png`, `11-fullscreen-before-after.png`, `12-fullscreen-modal-focused.png`, and `13-popup-normal-final.png`.
