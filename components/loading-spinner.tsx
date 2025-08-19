import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} role="status" aria-live="polite">
      <div className="relative">
        <div
          className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size])}
          aria-hidden="true"
        />
        <div
          className={cn("absolute inset-0 animate-ping rounded-full border border-primary/20", sizeClasses[size])}
          aria-hidden="true"
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {text}
          <span className="loading-dots" aria-hidden="true" />
        </p>
      )}
      <span className="sr-only">{text || "Cargando contenido, por favor espere"}</span>
    </div>
  )
}
