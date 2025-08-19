import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  changePercent?: number
  icon?: React.ReactNode
  className?: string
  variant?: "default" | "gradient" | "accent"
}

export function DashboardCard({
  title,
  value,
  subtitle,
  change,
  changePercent,
  icon,
  className,
  variant = "default",
}: DashboardCardProps) {
  const formatChange = (change: number, percent: number) => {
    const isPositive = change > 0
    const isNegative = change < 0
    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

    return (
      <div
        className={cn(
          "flex items-center gap-1 sm:gap-1.5 text-caption font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-scale-in",
          isPositive && "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/20",
          isNegative && "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/20",
          !isPositive && !isNegative && "text-muted-foreground bg-muted/50",
        )}
      >
        <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span className="text-caption">{Math.abs(percent).toFixed(1)}%</span>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
        "card-responsive w-full min-w-0 h-auto",
        variant === "gradient" && "gradient-card",
        variant === "accent" && "bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10",
        className,
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 sm:pb-2 p-responsive-sm">
        <CardTitle className="text-caption font-semibold text-muted-foreground uppercase tracking-wide truncate pr-2">
          {title}
        </CardTitle>
        {icon && (
          <div
            className={cn(
              "p-1 sm:p-1.5 rounded-lg transition-all duration-200 group-hover:scale-110 flex-shrink-0",
              variant === "accent"
                ? "bg-primary/10 text-primary"
                : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
            )}
          >
            <div className="w-3 h-3 sm:w-4 sm:h-4">{icon}</div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-responsive-sm p-responsive-sm pt-0">
        <div className="text-subheading font-bold font-numbers text-foreground group-hover:text-primary transition-colors duration-200 truncate">
          {typeof value === "number" ? value.toLocaleString("es-AR") : value}
        </div>

        <div className="flex items-center justify-between gap-2 min-w-0">
          {subtitle && <p className="text-caption text-muted-foreground font-medium truncate flex-1">{subtitle}</p>}
          {change !== undefined && changePercent !== undefined && (
            <div className="flex-shrink-0">{formatChange(change, changePercent)}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
