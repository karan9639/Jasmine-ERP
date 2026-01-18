"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent } from "@/components/ui/Card"
import { FormField } from "@/components/forms/FormField"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { DateInput } from "@/components/ui/DateInput"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { Trash2, Plus } from "lucide-react"
import { formatDate } from "@/lib/formatters"

export function Indent() {
  const { addToast } = useAppStore()

  const defaultFormData = () => ({
    indentNo: "",
    indentDate: formatDate(new Date(), "YYYY-MM-DD"),
    department: "",
    requester: "",
    priority: "Normal",
  })

  const defaultLines = () => [{ id: 1, item: "", specification: "", uom: "Kgs", qty: 0, requiredDate: "", purpose: "" }]

  const [formData, setFormData] = useState(defaultFormData())
  const [lines, setLines] = useState(defaultLines())

  const handleNew = () => {
    setFormData(defaultFormData())
    setLines(defaultLines())
    addToast({ type: "info", message: "New indent" })
  }

  const handleSave = () => {
    addToast({ type: "success", message: "Indent saved successfully" })
  }

  const addLine = () => {
    setLines([
      ...lines,
      { id: lines.length + 1, item: "", specification: "", uom: "Kgs", qty: 0, requiredDate: "", purpose: "" },
    ])
  }

  const removeLine = (id) => {
    setLines(lines.filter((line) => line.id !== id))
  }

  const updateLine = (id, field, value) => {
    setLines(lines.map((line) => (line.id === id ? { ...line, [field]: value } : line)))
  }

  const columns = [
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => (
        <Input
          value={row.original.item}
          onChange={(e) => updateLine(row.original.id, "item", e.target.value)}
          placeholder="Select item"
          className="min-w-[200px]"
        />
      ),
    },
    {
      accessorKey: "specification",
      header: "Specification",
      cell: ({ row }) => (
        <Input
          value={row.original.specification}
          onChange={(e) => updateLine(row.original.id, "specification", e.target.value)}
          placeholder="Specification"
          className="min-w-[200px]"
        />
      ),
    },
    {
      accessorKey: "uom",
      header: "UOM",
      cell: ({ row }) => (
        <Select value={row.original.uom} onChange={(e) => updateLine(row.original.id, "uom", e.target.value)}>
          <option value="Kgs">Kgs</option>
          <option value="Mtr">Mtr</option>
          <option value="Pcs">Pcs</option>
          <option value="Ltr">Ltr</option>
        </Select>
      ),
    },
    {
      accessorKey: "qty",
      header: "Quantity",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.qty}
          onChange={(e) => updateLine(row.original.id, "qty", Number.parseFloat(e.target.value) || 0)}
          className="w-28"
        />
      ),
    },
    {
      accessorKey: "requiredDate",
      header: "Required Date",
      cell: ({ row }) => (
        <DateInput
          value={row.original.requiredDate}
          onChange={(e) => updateLine(row.original.id, "requiredDate", e.target.value)}
          className="w-40"
        />
      ),
    },
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: ({ row }) => (
        <Input
          value={row.original.purpose}
          onChange={(e) => updateLine(row.original.id, "purpose", e.target.value)}
          placeholder="Purpose"
          className="min-w-[150px]"
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => removeLine(row.original.id)}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      ),
    },
  ]

  return (
    <PageShell title="Material Indent">
      <ActionBar onNew={handleNew} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Indent No">
              <Input value={formData.indentNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="Indent Date" required>
              <DateInput
                value={formData.indentDate}
                onChange={(e) => setFormData({ ...formData, indentDate: e.target.value })}
              />
            </FormField>

            <FormField label="Department" required>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                <option value="Production">Production</option>
                <option value="Dyeing">Dyeing</option>
                <option value="Lamination">Lamination</option>
                <option value="Maintenance">Maintenance</option>
              </Select>
            </FormField>

            <FormField label="Priority">
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Requester" required>
            <Input
              value={formData.requester}
              onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
              placeholder="Enter requester name"
            />
          </FormField>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Indent Lines</h3>
              <Button onClick={addLine} size="sm" variant="accent">
                <Plus className="w-4 h-4" />
                Add Line
              </Button>
            </div>
            <DataTable columns={columns} data={lines} pageSize={10} />
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
