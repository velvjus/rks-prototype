# Contacts Page Design Spec

This document specifies the design guidelines, brand tokens, and spacing conventions for the Contacts page in RakanSales.

## Typography
- **Page Header**: Inter, 24px (text-2xl), Font Weight 700 (font-bold), tracking-tight.
- **Section Headers**: Inter, 16px (text-base), Font Weight 700 (font-bold).
- **Table Headers**: Inter, 12px (text-xs), Font Weight 700 (font-bold), uppercase tracking-wider.
- **Body Text**: Inter, 14px (text-sm) for description, 12px (text-xs) for list contents.

## Color Tokens
- **Brand Primary**: `#23B750` (RKS Green), used for primary call to actions, badges, active states, active pagination.
- **Brand Primary Hover**: `#1a943e` (Deep Green).
- **Lead Status**: Purple (`#7C3AED`) representing potential clients.
- **Background Grid**: Solid white (`#FFFFFF`) with border `#E5E7EB` (gray-200) in light mode, `#1F2937` (gray-800) in dark mode.
- **Secondary Actions**: Clean borders (`border-gray-200`) with hover backgrounds (`hover:bg-gray-50`).

## Interactive States & Micro-interactions
- **Row Selection**:
  - Checkboxes use smooth `transition-all`.
  - Selected rows highlight with `#F0FDF4` (emerald-50) opacity `0.3` background in light mode, and transparent emerald in dark mode.
- **Row Hover**:
  - Highlighted table rows shift to `bg-gray-50/50` (or `bg-muted/20` in dark mode) with `duration-150`.
  - Actions column (edit, delete) transitions from `opacity-0` to `opacity-100` smoothly on row hover.
- **Stats Card Hover**:
  - Cards lift with transition and soft shadow `hover:shadow-md`.
- **Slide-over Drawer**:
  - Uses `lucide-vue-next` icons, transition slides in from the right edge with absolute focus.
  - Form edits and note saving trigger instant lightweight toast alerts.

## Accessibility Guidelines
- **Contrast**: Muted body text must not go below `#4B5563` (gray-600) to ensure a minimum of 4.5:1 contrast against white backgrounds.
- **Focus**: Interactive buttons and inputs must have visible focus rings (`focus-visible:ring-1 focus-visible:ring-primary`).
- **Icons**: No standard emojis should be used as user interface icons. All icons must be unified using SVG via `lucide-vue-next`.
