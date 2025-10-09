"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

export function Tabs({ defaultValue, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={cn("w-full", className)} data-active-tab={activeTab}>
      {typeof children === "function" ? children({ activeTab, setActiveTab }) : children}
    </div>
  )
}

export function TabsList({ children, className }) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 gap-1", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className, activeTab, setActiveTab }) {
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className, activeTab }) {
  if (activeTab !== value) return null

  return <div className={cn("mt-2", className)}>{children}</div>
}
