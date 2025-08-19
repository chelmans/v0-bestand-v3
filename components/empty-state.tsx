"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="w-16 h-16 mb-6 rounded-full bg-muted/50 flex items-center justify-center animate-float">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">{description}</p>

      {action && (
        <Button onClick={action.onClick} className="animate-bounce-subtle">
          {action.label}
        </Button>
      )}
    </div>
  )
}
