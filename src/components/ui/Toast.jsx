"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/state/useAppStore"
import { cn } from "@/lib/utils"

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const variants = {
  success: "bg-chart-3 text-white",
  error: "bg-destructive text-destructive-foreground",
  warning: "bg-chart-4 text-white",
  info: "bg-chart-1 text-white",
}

function ToastItem({ toast, onRemove }) {
  const Icon = icons[toast.type] || Info

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md animate-in slide-in-from-right",
        variants[toast.type] || variants.info,
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
        {toast.message && <div className="text-sm opacity-90">{toast.message}</div>}
      </div>
      <button onClick={() => onRemove(toast.id)} className="p-0.5 rounded hover:bg-black/10 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}
