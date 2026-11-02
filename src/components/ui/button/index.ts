import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90",
        outline: "border border-input bg-background text-foreground shadow-soft hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground border border-border/60 hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 font-semibold",
        brand: "bg-brand text-brand-foreground shadow-soft hover:bg-brand/90 font-semibold",
        gradient: "bg-gradient-to-r from-brand to-brand-secondary text-brand-foreground hover:opacity-95 font-bold",
        success: "bg-success text-success-foreground shadow-soft hover:bg-success/90 font-semibold",
        warning: "bg-warning text-warning-foreground shadow-soft hover:bg-warning/90 font-semibold",
        info: "bg-info text-info-foreground shadow-soft hover:bg-info/90 font-semibold",
        danger: "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 font-semibold",
        dark: "bg-rail text-rail-foreground hover:bg-rail-active border border-rail-border font-semibold",
        soft: "bg-muted text-foreground border border-border/50 hover:bg-muted/80 font-medium",
      },
      size: {
        "default": "h-9 px-3.5 py-2 text-xs",
        "xs": "h-7 px-2.5 py-1 text-[11px] rounded-md",
        "sm": "h-8 rounded-md px-3 text-xs",
        "lg": "h-10 rounded-md px-5 text-sm [&_svg]:size-4",
        "icon": "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-7",
        "icon-lg": "size-10 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
