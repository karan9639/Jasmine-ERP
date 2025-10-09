import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export const Radio = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="radio"
      className={cn(
        "h-4 w-4 shrink-0 rounded-full border border-border bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

Radio.displayName = "Radio"
