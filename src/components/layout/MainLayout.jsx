'use client';

import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { useAppStore } from "@/state/useAppStore"
import { useEffect } from "react"

export function MainLayout({ children }) {
  const { sidebarCollapsed, theme } = useAppStore()

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <Topbar />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
      </div>
    </div>
  )
}
