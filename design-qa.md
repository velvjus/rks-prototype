# Design QA - Constrained deal popup

## Comparison setup

- Source visual truth: `C:\Users\justi\AppData\Local\Temp\codex-clipboard-70073993-b754-4062-ae57-35257bebb49b.png`
- Fullscreen implementation: `design-audit/10-popup-fullscreen-fixed.png`
- Normal in-app implementation: `design-audit/13-popup-normal-final.png`
- Fullscreen viewport: 1920 x 1054, matching the user's screenshot
- Normal in-app viewport: 890 x 810
- State: Inovasi Digital Sdn Bhd popup, Deal Info and Notes selected
- Full-view comparison: `design-audit/11-fullscreen-before-after.png`
- Focused modal comparison: `design-audit/12-fullscreen-modal-focused.png`

## Findings

- P0: none.
- P1: none after remediation. The popup no longer uses the expanded near-fullscreen state, and the sidebar cards no longer shrink and clip their fields.
- P2: none. The constrained modal preserves the reference structure, readable information hierarchy, composer, and independent content scrolling.
- P3: Company Info is below the fold at the shorter in-app viewport and is available through the sidebar's intentional scroll region.

## Required fidelity surfaces

- Fonts and typography: passed. The existing Inter hierarchy is preserved at an intentionally more compact rendered scale.
- Spacing and layout rhythm: passed. The fullscreen modal is now 1320 x 748 within the 1920 x 1054 viewport, leaving clear surrounding context. The normal in-app modal is 748 x 681 within 890 x 810.
- Colors and tokens: passed. Blue pipeline, green active states, violet insight surface, slate text, borders, and elevation remain unchanged.
- Image quality and assets: passed. Existing contact avatars and Lucide icons remain crisp; no substitute artwork was introduced.
- Copy and content: passed. Deal fields, owner, contact, company, insight, description, and note composer retain their selected-deal data.
- Interaction and accessibility: passed. Close, tabs, toggles, selects, note input, and independently scrollable content remain functional. The confusing full-screen expansion control was removed.

## Patches made since the previous QA pass

- Removed the full-screen expansion mode that produced the user's near-edge-to-edge screenshot.
- Constrained large-screen presentation to a maximum rendered size of 1320 x 748.
- Reduced the normal in-app presentation to 84% of viewport width and height.
- Added `shrink-0` to all sidebar cards so their content determines card height instead of being clipped by flexbox.
- Preserved scrolling on the sidebar and main content regions.

final result: passed
