import type React from "react"
import type { Metadata } from "next"
import { Roboto, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { ErrorBoundary } from "@/components/error-boundary"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Sistema Bestand - Hedman Ingeniería",
  description: "Sistema de visualización de producción y stock",
  generator: "v0.app",
  keywords: "producción, stock, bigbags, lotes, báscula, hedman ingeniería",
  authors: [{ name: "Hedman Ingeniería" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#10b981" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${roboto.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
              {/* Skip to main content link for screen readers */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
              >
                Saltar al contenido principal
              </a>

              {/* Sidebar Navigation */}
              <Navigation />

              {/* Main Content Area */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Page Content */}
                <main
                  id="main-content"
                  className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 animate-fade-in"
                  role="main"
                >
                  <div className="max-w-full sm:max-w-6xl md:max-w-7xl mx-auto w-full">{children}</div>
                </main>
              </div>
            </div>

            {/* Keyboard Shortcuts Helper */}
            <KeyboardShortcuts />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
