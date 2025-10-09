"use client"

import { useAppStore } from "@/state/useAppStore"
import { formatDate } from "@/lib/formatters"
import { User, Sun, Moon, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Topbar() {
  const { user, unit, financialYear, theme, toggleTheme, logout } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="text-sm">
          <span className="text-muted-foreground">Date:</span>{" "}
          <span className="font-medium">{formatDate(new Date())}</span>
        </div>
        {unit && (
          <div className="text-sm">
            <span className="text-muted-foreground">Unit:</span> <span className="font-medium">{unit.name}</span>
          </div>
        )}
        {financialYear && (
          <div className="text-sm">
            <span className="text-muted-foreground">FY:</span> <span className="font-medium">{financialYear}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Toggle theme">
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
