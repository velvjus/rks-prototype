import { cva } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex gap-1.5 items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Tier 1: Soft-Tinted Semantic Status (Canonical CRM Table & Card Standard)
        success: "border-success/20 bg-success/10 text-success hover:bg-success/15",
        warning: "border-warning/25 bg-warning/10 text-warning hover:bg-warning/15",
        info: "border-info/20 bg-info/10 text-info hover:bg-info/15",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15",

        // Tier 2: Categorical Pipeline Stage & Classification Tags (No good/bad connotation)
        "tag-1": "border-transparent bg-tag-1 text-tag-1-foreground",
        "tag-2": "border-transparent bg-tag-2 text-tag-2-foreground",
        "tag-3": "border-transparent bg-tag-3 text-tag-3-foreground",
        "tag-4": "border-transparent bg-tag-4 text-tag-4-foreground",
        "tag-5": "border-transparent bg-tag-5 text-tag-5-foreground",
        "tag-6": "border-transparent bg-tag-6 text-tag-6-foreground",

        // Tier 3: Structural & Neutral UI Metadata
        secondary: "border-border/60 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border-border bg-background text-foreground",
        muted: "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15",

        // Tier 4: Solid-Filled High-Urgency Counters (Reserved for unread badges & focal alerts)
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        "destructive-solid": "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        vibrant: "border-success/20 bg-success/10 text-success hover:bg-success/15",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);
