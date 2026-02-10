"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "border border-border/80 bg-popover/95 text-popover-foreground shadow-[0_20px_60px_-38px_hsl(var(--app-shadow)/0.98)] backdrop-blur-xl rounded-xl",
          title: "text-sm font-semibold tracking-tight",
          description: "text-xs text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground rounded-md border border-primary/30 hover:bg-primary/92",
          cancelButton:
            "bg-secondary text-secondary-foreground rounded-md border border-border/70 hover:bg-secondary",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
