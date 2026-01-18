import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { Label } from "./Label"

export const Input = forwardRef(({ className, type = "text", label, required, error, ...props }, ref) => {
  const inputElement = (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus-visible:ring-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  )

  if (label) {
    return (
      <div className="space-y-1.5">
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {inputElement}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return inputElement
})

Input.displayName = "Input"

export default Input
