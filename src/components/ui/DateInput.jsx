"use client"

import { Input } from "./Input"
import { Calendar } from "lucide-react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export const DateInput = forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <Input type="date" className={cn("pr-9", className)} ref={ref} {...props} />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  )
})

DateInput.displayName = "DateInput"
