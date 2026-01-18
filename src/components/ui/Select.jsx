import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { ChevronDown } from "lucide-react"
import { Label } from "@/components/ui/Label"

export const Select = forwardRef(({ className, children, label, required, options, ...props }, ref) => {
  const optionNodes =
    children ??
    (Array.isArray(options)
      ? options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))
      : null)

  const control = (
    <div className="relative">
      <select
        className={cn(
          "flex h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 py-1 pr-8 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        required={required}
        {...props}
      >
        {optionNodes}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  )

  if (!label) return control

  return (
    <div className="space-y-1">
      <Label required={required}>{label}</Label>
      {control}
    </div>
  )
})

Select.displayName = "Select"

export default Select
