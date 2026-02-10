import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input/90 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border bg-input/70 px-3 py-2 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[border-color,box-shadow,background-color] duration-200 outline-none focus-visible:border-primary/55 focus-visible:ring-2 focus-visible:ring-primary/45 aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-45 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
