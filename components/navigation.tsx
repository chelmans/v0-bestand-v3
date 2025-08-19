"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Package, Layers, Warehouse, Scale, FileText, Settings, ChevronRight, Menu, X, Users } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Vista general del sistema",
  },
  {
    name: "BigBags",
    href: "/bigbags",
    icon: Package,
    description: "Producción de BigBags",
  },
  {
    name: "Lotes",
    href: "/lotes",
    icon: Layers,
    description: "Gestión de lotes",
  },
  {
    name: "Stock",
    href: "/stock",
    icon: Warehouse,
    description: "Control de inventario",
  },
  {
    name: "Báscula",
    href: "/bascula",
    icon: Scale,
    description: "Registro de pesaje",
  },
  {
    name: "Proveedores",
    href: "/proveedores",
    icon: Users,
    description: "Gestión de proveedores",
  },
  {
    name: "Documentos",
    href: "/docs",
    icon: FileText,
    description: "Documentación del sistema",
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    description: "Ajustes del sistema",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-3 left-3 z-50 lg:hidden w-10 h-10 rounded-xl bg-sidebar/90 backdrop-blur-xl border border-sidebar-border/50 flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors shadow-lg"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <nav
        className={cn(
          "flex h-full flex-col bg-sidebar/50 backdrop-blur-xl border-r border-sidebar-border/50 glass-effect transition-transform duration-300",
          "w-64 sm:w-72 md:w-80 lg:w-72", // Responsive width scaling
          "hidden lg:flex", // Hidden on mobile/tablet by default
          "fixed lg:relative z-50 lg:z-auto", // Fixed positioning on mobile
          isMobileMenuOpen ? "flex w-80 sm:w-96" : "hidden lg:flex", // Mobile overlay sizing
        )}
      >
        <div className="flex h-16 sm:h-20 items-center px-4 sm:px-6 border-b border-sidebar-border/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-emerald flex items-center justify-center">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-sidebar-foreground font-serif">Sistema Bestand</h1>
              <p className="text-xs text-sidebar-foreground/60 hidden sm:block">Hedman Ingeniería</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 sm:gap-4 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200 animate-fade-in",
                      "hover:bg-sidebar-accent/10 hover:translate-x-1",
                      isActive
                        ? "bg-gradient-to-r from-sidebar-accent/20 to-sidebar-accent/10 text-sidebar-accent border-l-4 border-sidebar-accent shadow-lg"
                        : "text-sidebar-foreground hover:text-sidebar-accent",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "bg-sidebar-primary group-hover:bg-sidebar-accent/20",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-sidebar-foreground/50 group-hover:text-sidebar-accent/70 hidden sm:block truncate">
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sidebar-accent animate-scale-in flex-shrink-0" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-t border-sidebar-border/30 p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sidebar-accent to-sidebar-accent/70 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">HI</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Usuario</p>
                <p className="text-xs text-sidebar-foreground/60 hidden sm:block">Administrador</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <div className="text-center">
            <p className="text-xs text-sidebar-foreground/40">v2.0.0 • Sistema Bestand</p>
          </div>
        </div>
      </nav>
    </>
  )
}
