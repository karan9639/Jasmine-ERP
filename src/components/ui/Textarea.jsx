import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { Label } from "./Label"

export const Textarea = forwardRef(({ className, label, required, error, ...props }, ref) => {
  const textareaElement = (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
        {textareaElement}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return textareaElement
})

Textarea.displayName = "Textarea"

export default Textarea
