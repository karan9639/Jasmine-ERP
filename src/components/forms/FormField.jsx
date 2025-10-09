import { Label } from "@/components/ui/Label"
import { cn } from "@/lib/utils"

export function FormField({ label, required, error, children, className, horizontal }) {
  if (horizontal) {
    return (
      <div className={cn("flex items-start gap-4", className)}>
        <Label required={required} className="w-32 pt-2 flex-shrink-0">
          {label}
        </Label>
        <div className="flex-1">
          {children}
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
