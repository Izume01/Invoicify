import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary/45 aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow,border-color,background-color] duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/20 text-primary [a&]:hover:bg-primary/28",
        secondary:
          "border-border/75 bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-destructive/45 bg-destructive/18 text-destructive [a&]:hover:bg-destructive/25 focus-visible:ring-destructive/35",
        outline:
          "border-border/85 bg-transparent text-muted-foreground [a&]:hover:border-primary/35 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
