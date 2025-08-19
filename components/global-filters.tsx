"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Calendar, Building2, RotateCcw, Zap, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useState } from "react"

const dateRangeOptions = [
  { value: "HOY", label: "Hoy", icon: "📅" },
  { value: "SEMANA", label: "Esta semana", icon: "📊" },
  { value: "MES", label: "Este mes", icon: "📈" },
  { value: "ZAFRA", label: "Zafra actual", icon: "🌾" },
] as const

const storeOptions = [
  { value: "GUARANI", label: "Guaraní", status: "active" },
  { value: "PANAMBI", label: "Panambi", status: "active" },
  { value: "SECADERO 3", label: "Secadero 3", status: "active" },
]

export function GlobalFilters() {
  const { dateRange, store, setDateRange, setStore, reset } = useAppStore()
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    reset()
    setIsResetting(false)
  }

  return (
    <div className="border-b border-border/30 bg-gradient-to-r from-background via-background to-muted/10 glass-effect backdrop-blur-xl animate-slide-up">
      <div className="flex h-10 sm:h-12 items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8 hover:bg-primary/10 transition-colors duration-200"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 text-primary" />
            ) : (
              <ChevronUp className="h-4 w-4 text-primary" />
            )}
          </Button>
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <h2 className="text-sm sm:text-base font-semibold text-foreground">Filtros</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <Zap className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-600 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hidden sm:inline">Activo</span>
          </div>

          <div className="p-0.5 rounded-md bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100",
        )}
      >
        <div className="flex items-center justify-center px-3 sm:px-6 lg:px-8 pb-3 sm:pb-4">
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm border border-border/50 shadow-lg w-full max-w-6xl">
            {/* Período Toggle Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Período</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {dateRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={dateRange === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange(option.value)}
                    className={cn(
                      "transition-all duration-200 hover:scale-105",
                      dateRange === option.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-primary/10 hover:border-primary/30",
                    )}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Planta Toggle Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-accent uppercase tracking-wide">Planta</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!store ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStore(undefined)}
                  className={cn(
                    "transition-all duration-200 hover:scale-105",
                    !store ? "bg-accent text-accent-foreground shadow-md" : "hover:bg-accent/10 hover:border-accent/30",
                  )}
                >
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mr-2" />
                  Todas
                </Button>
                {storeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={store === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStore(option.value)}
                    className={cn(
                      "transition-all duration-200 hover:scale-105",
                      store === option.value
                        ? "bg-accent text-accent-foreground shadow-md"
                        : "hover:bg-accent/10 hover:border-accent/30",
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mr-2 animate-pulse",
                        option.status === "active" ? "bg-emerald-500" : "bg-red-500",
                      )}
                    />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Reset Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isResetting}
                className={cn(
                  "group relative overflow-hidden bg-gradient-to-r from-muted/50 to-muted/30 border-border/50 px-6 py-2.5",
                  "hover:from-destructive/10 hover:to-destructive/5 hover:border-destructive/30",
                  "transition-all duration-300 hover:shadow-md hover:scale-105",
                  isResetting && "animate-pulse",
                )}
              >
                <div className="flex items-center gap-2">
                  <RotateCcw
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isResetting ? "animate-spin" : "group-hover:rotate-180",
                    )}
                  />
                  <span className="font-semibold text-sm">{isResetting ? "Limpiando..." : "Limpiar Filtros"}</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
