"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled className="w-9 h-9 bg-transparent">
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    const announcement = `Tema cambiado a ${newTheme === "light" ? "claro" : "oscuro"}`
    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", "polite")
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    setTimeout(() => document.body.removeChild(announcer), 1000)

    document.documentElement.style.setProperty("--theme-transition", "all 0.3s ease-in-out")
    setTimeout(() => {
      document.documentElement.style.removeProperty("--theme-transition")
    }, 300)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 relative overflow-hidden hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200 hover:scale-105 bg-transparent border-border/50 dark:border-border/30"
      aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
      title={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-foreground" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-foreground" />
    </Button>
  )
}
