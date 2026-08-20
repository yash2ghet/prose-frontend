import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary hover:bg-primary/90",
        outline:
          "border border-strong bg-surface text-foreground hover:bg-surface-alt aria-expanded:bg-surface-alt",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-secondary",
        ghost:
          "bg-transparent text-body aria-expanded:bg-muted",
        destructive:
          "bg-error text-white hover:bg-error/90 border-error",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-[2rem] px-3 text-[0.8125rem] rounded-md", // 32px height, 12px px, 13px text, 6px radius
        default: "h-[2.375rem] px-4 text-sm rounded-md", // md: 38px height, 16px px, 14px text, 6px radius
        md: "h-[2.375rem] px-4 text-sm rounded-md", // md alias
        lg: "h-[2.75rem] px-[1.375rem] text-[0.9375rem] rounded-md", // 44px height, 22px px, 15px text, 6px radius
        icon: "size-8 rounded-md",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }