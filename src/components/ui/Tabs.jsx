"use client"

import { cn } from "@/lib/utils"
import { createContext, useContext, useMemo, useState } from "react"

const TabsContext = createContext(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  return ctx
}

// Supports both patterns:
// 1) <Tabs tabs={[{id,label}]}><TabsContent id="..." /></Tabs>
// 2) <Tabs defaultValue="..."><TabsList>...<TabsTrigger value="..." />...</TabsList><TabsContent value="..." /></Tabs>
export function Tabs({ defaultValue, tabs, children, className }) {
  const initial = defaultValue ?? (Array.isArray(tabs) && tabs[0]?.id ? tabs[0].id : undefined)
  const [activeTab, setActiveTab] = useState(initial)

  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab])

  return (
    <TabsContext.Provider value={value}>
      <div className={cn("w-full", className)}>
        {Array.isArray(tabs) && tabs.length ? (
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        ) : null}
        <div className={cn(Array.isArray(tabs) && tabs.length ? "mt-2" : "")}>{children}</div>
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 gap-1", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }) {
  const ctx = useTabsContext()
  const isActive = ctx ? ctx.activeTab === value : false

  return (
    <button
      type="button"
      onClick={() => ctx?.setActiveTab(value)}
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

export function TabsContent({ value, id, children, className }) {
  const ctx = useTabsContext()
  const tabId = value ?? id
  if (!ctx) return <div className={cn(className)}>{children}</div>
  if (ctx.activeTab !== tabId) return null
  return <div className={cn(className)}>{children}</div>
}
