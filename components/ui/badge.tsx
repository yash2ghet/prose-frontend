import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-sm border border-transparent px-[9px] py-[3px] text-small font-semibold uppercase tracking-[0.04em] whitespace-nowrap transition-all",
  {
    variants: {
      variant: {
        published: "bg-success/10 text-success",
        draft: "bg-muted text-muted-foreground",
        featured: "bg-accent-soft text-accent-ink",
        error: "bg-error/10 text-error",
        warning: "bg-warning/10 text-warning",
      },
    },

    defaultVariants: {
      variant: "published",
    },
  }
)

function Badge({
  className,
  variant = "published",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
