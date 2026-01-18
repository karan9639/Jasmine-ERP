import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { Label } from "@/components/ui/Label"

export const Textarea = forwardRef(({ className, label, required, ...props }, ref) => {
  const control = (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      required={required}
      {...props}
    />
  )

  if (!label) return control

  return (
    <div className="space-y-1">
      <Label required={required}>{label}</Label>
      {control}
    </div>
  )
})

Textarea.displayName = "Textarea"
