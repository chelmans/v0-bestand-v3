"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Keyboard, X } from "lucide-react"

const shortcuts = [
  { key: "?", description: "Mostrar atajos de teclado" },
  { key: "Ctrl + K", description: "Búsqueda rápida" },
  { key: "Ctrl + D", description: "Cambiar tema" },
  { key: "Ctrl + R", description: "Actualizar datos" },
  { key: "Esc", description: "Cerrar diálogos" },
  { key: "Tab", description: "Navegar entre elementos" },
  { key: "Enter", description: "Activar elemento seleccionado" },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts with ?
      if (e.key === "?" && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault()
        setIsOpen(true)
      }

      // Close with Escape
      if (e.key === "Escape") {
        setIsOpen(false)
      }

      // Theme toggle with Ctrl+D
      if (e.key === "d" && e.ctrlKey) {
        e.preventDefault()
        const themeToggle = document.querySelector('[aria-label*="Cambiar a tema"]') as HTMLButtonElement
        themeToggle?.click()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card"
        aria-label="Mostrar atajos de teclado"
        title="Atajos de teclado (?)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect animate-scale-in" role="dialog" aria-labelledby="shortcuts-title">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle id="shortcuts-title" className="text-lg font-semibold">
            Atajos de Teclado
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label="Cerrar atajos de teclado">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">{shortcut.key}</kbd>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Presiona <kbd className="px-1 py-0.5 text-xs font-mono bg-muted rounded">?</kbd> en cualquier momento para
              ver estos atajos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
