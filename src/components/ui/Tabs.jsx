'use client';

import { cn } from "@/lib/utils"
import { useState, createContext, useContext, Children, cloneElement, isValidElement } from "react"

// Context for sharing tab state
const TabsContext = createContext(null)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

export function Tabs({ defaultValue, tabs, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue || (tabs?.[0]?.id))

  // Support the simple tabs prop pattern
  if (tabs && Array.isArray(tabs)) {
    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div className={cn("w-full", className)}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-4">
            {Children.map(children, (child) => {
              if (isValidElement(child) && child.type === TabsPanel) {
                return cloneElement(child)
              }
              return child
            })}
          </div>
        </div>
      </TabsContext.Provider>
    )
  }

  // Standard compound component pattern
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>
        {children}
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
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      type="button"
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

export function TabsContent({ value, children, className }) {
  const { activeTab } = useTabs()
  if (activeTab !== value) return null

  return <div className={cn("mt-2", className)}>{children}</div>
}

// Alias for backward compatibility with Tabs.Panel pattern
export function TabsPanel({ id, children, className }) {
  const { activeTab } = useTabs()
  if (activeTab !== id) return null

  return <div className={cn("", className)}>{children}</div>
}

// Add sub-component syntax support
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent
Tabs.Panel = TabsPanel

export default Tabs
