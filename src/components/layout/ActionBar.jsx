"use client"

import { Save, Undo, Search, Play, Trash2, Printer, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function ActionBar({
  actions,
  onNew,
  onSave,
  onUndo,
  onQuery,
  onExecute,
  onDelete,
  onPrint,
  disableNew,
  disableSave,
  disableUndo,
  disableQuery,
  disableExecute,
  disableDelete,
  disablePrint,
}) {
  // Compatibility: some screens pass a dynamic `actions` array.
  // Format: { label, icon: IconComponent, onClick, variant }
  if (Array.isArray(actions) && actions.length) {
    const normalizeVariant = (v) => {
      // Button supports: primary, secondary, accent, destructive, outline, ghost
      if (!v) return "secondary"
      if (v === "default") return "secondary"
      return v
    }

    return (
      <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg mb-4">
        {actions.map((a, idx) => {
          const Icon = a.icon
          return (
            <Button
              key={idx}
              onClick={a.onClick}
              variant={normalizeVariant(a.variant)}
              size="sm"
              title={a.label}
              disabled={a.disabled}
            >
              {Icon ? <Icon className="w-4 h-4" /> : null}
              <span>{a.label}</span>
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg mb-4">
      {onNew && (
        <Button onClick={onNew} disabled={disableNew} variant="primary" size="sm" title="Create (Alt+N)">
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </Button>
      )}
      {onSave && (
        <Button onClick={onSave} disabled={disableSave} variant="primary" size="sm" title="Save (Alt+S)">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </Button>
      )}
      {onUndo && (
        <Button onClick={onUndo} disabled={disableUndo} variant="secondary" size="sm" title="Undo (Alt+U)">
          <Undo className="w-4 h-4" />
          <span>Undo</span>
        </Button>
      )}
      {onQuery && (
        <Button onClick={onQuery} disabled={disableQuery} variant="secondary" size="sm" title="Query (Alt+Q)">
          <Search className="w-4 h-4" />
          <span>Query</span>
        </Button>
      )}
      {onExecute && (
        <Button onClick={onExecute} disabled={disableExecute} variant="accent" size="sm" title="Execute (Alt+E)">
          <Play className="w-4 h-4" />
          <span>Execute</span>
        </Button>
      )}
      {onDelete && (
        <Button onClick={onDelete} disabled={disableDelete} variant="destructive" size="sm" title="Delete">
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      )}
      {onPrint && (
        <Button onClick={onPrint} disabled={disablePrint} variant="secondary" size="sm" title="Print (Ctrl+P)">
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </Button>
      )}
    </div>
  )
}

export default ActionBar
