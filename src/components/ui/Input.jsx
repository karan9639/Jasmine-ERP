import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { Label } from "@/components/ui/Label"

export const Input = forwardRef(({ className, type = "text", label, required, ...props }, ref) => {
  const control = (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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

Input.displayName = "Input"

export default Input
