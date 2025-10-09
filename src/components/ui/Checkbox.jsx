import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { forwardRef } from "react"

export const Checkbox = forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <div className="relative inline-flex">
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded border border-border bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary",
          className,
        )}
        ref={ref}
        checked={checked}
        {...props}
      />
      {checked && (
        <Check className="absolute left-0 top-0 w-4 h-4 text-primary-foreground pointer-events-none" strokeWidth={3} />
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"
