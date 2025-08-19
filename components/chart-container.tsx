"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BarChart3 } from "lucide-react"

interface ChartContainerProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
  variant?: "default" | "glass" | "accent" | "gradient"
  icon?: React.ReactNode
}

export function ChartContainer({
  title,
  subtitle,
  children,
  className,
  actions,
  variant = "default",
  icon,
}: ChartContainerProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 animate-slide-up",
        "hover:-translate-y-1 w-full min-w-0 dark-card dark-mode-transition",
        variant === "glass" && "glass-effect backdrop-blur-xl",
        variant === "accent" &&
          "bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 dark:from-primary/10 dark:to-accent/10 dark:border-primary/20",
        variant === "gradient" && "gradient-card",
        className,
      )}
      role="region"
      aria-labelledby={`chart-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 hidden sm:block">
        {icon || <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
      </div>

      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4 sm:pb-6 relative z-10 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse flex-shrink-0"
              aria-hidden="true"
            />
            <CardTitle
              id={`chart-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
              className="text-base sm:text-lg font-bold font-sans text-foreground group-hover:text-primary transition-colors duration-200 truncate"
            >
              {title}
            </CardTitle>
          </div>
          {subtitle && (
            <p
              className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed"
              id={`chart-subtitle-${title.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-1 sm:space-x-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 w-full sm:w-auto justify-end">
            {actions}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 relative z-10 px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="relative">
          <div className="chart-content chart-dark-mode [&_.recharts-wrapper]:!w-full [&_.recharts-surface]:drop-shadow-sm [&_.recharts-cartesian-axis-tick-value]:text-xs [&_.recharts-legend-wrapper]:text-xs [&_.recharts-tooltip-wrapper]:text-xs [&_.recharts-cartesian-axis-tick-value]:fill-current [&_.recharts-cartesian-axis-tick-value]:text-muted-foreground">
            <div className="w-full overflow-x-auto">
              <div
                className="min-w-[300px] sm:min-w-0"
                role="img"
                aria-labelledby={`chart-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
                aria-describedby={subtitle ? `chart-subtitle-${title.replace(/\s+/g, "-").toLowerCase()}` : undefined}
              >
                {children}
              </div>
            </div>
          </div>

          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardContent>
    </Card>
  )
}
