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

export function MRN() {
  const { addToast } = useAppStore()

  const defaultFormData = () => ({
    mrnNo: "",
    mrnDate: formatDate(new Date(), "YYYY-MM-DD"),
    vendorId: "",
    vendorName: "",
    challanNo: "",
    challanDate: "",
    poNo: "",
  })

  const defaultLines = () => [
    { id: 1, item: "", uom: "Kgs", orderedQty: 0, receivedQty: 0, lotNo: "", mfgDate: "", rackNo: "" },
  ]

  const [formData, setFormData] = useState(defaultFormData())
  const [lines, setLines] = useState(defaultLines())

  const handleNew = () => {
    setFormData(defaultFormData())
    setLines(defaultLines())
    addToast({ type: "info", message: "New MRN" })
  }

  const handleSave = () => {
    addToast({ type: "success", message: "MRN saved successfully" })
  }

  const addLine = () => {
    setLines([
      ...lines,
      { id: lines.length + 1, item: "", uom: "Kgs", orderedQty: 0, receivedQty: 0, lotNo: "", mfgDate: "", rackNo: "" },
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
      accessorKey: "uom",
      header: "UOM",
      cell: ({ row }) => (
        <Select value={row.original.uom} onChange={(e) => updateLine(row.original.id, "uom", e.target.value)}>
          <option value="Kgs">Kgs</option>
          <option value="Mtr">Mtr</option>
          <option value="Pcs">Pcs</option>
        </Select>
      ),
    },
    {
      accessorKey: "orderedQty",
      header: "Ordered Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.orderedQty}
          onChange={(e) => updateLine(row.original.id, "orderedQty", Number.parseFloat(e.target.value) || 0)}
          className="w-28"
        />
      ),
    },
    {
      accessorKey: "receivedQty",
      header: "Received Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.receivedQty}
          onChange={(e) => updateLine(row.original.id, "receivedQty", Number.parseFloat(e.target.value) || 0)}
          className="w-28"
        />
      ),
    },
    {
      accessorKey: "lotNo",
      header: "Lot No",
      cell: ({ row }) => (
        <Input
          value={row.original.lotNo}
          onChange={(e) => updateLine(row.original.id, "lotNo", e.target.value)}
          placeholder="Lot No"
          className="w-32"
        />
      ),
    },
    {
      accessorKey: "mfgDate",
      header: "Mfg Date",
      cell: ({ row }) => (
        <DateInput
          value={row.original.mfgDate}
          onChange={(e) => updateLine(row.original.id, "mfgDate", e.target.value)}
          className="w-40"
        />
      ),
    },
    {
      accessorKey: "rackNo",
      header: "Rack No",
      cell: ({ row }) => (
        <Input
          value={row.original.rackNo}
          onChange={(e) => updateLine(row.original.id, "rackNo", e.target.value)}
          placeholder="Rack"
          className="w-24"
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
    <PageShell title="Material Receipt Note (MRN)">
      <ActionBar onNew={handleNew} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="MRN No">
              <Input value={formData.mrnNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="MRN Date" required>
              <DateInput
                value={formData.mrnDate}
                onChange={(e) => setFormData({ ...formData, mrnDate: e.target.value })}
              />
            </FormField>

            <FormField label="Challan No">
              <Input
                value={formData.challanNo}
                onChange={(e) => setFormData({ ...formData, challanNo: e.target.value })}
                placeholder="Challan No"
              />
            </FormField>

            <FormField label="Challan Date">
              <DateInput
                value={formData.challanDate}
                onChange={(e) => setFormData({ ...formData, challanDate: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Vendor ID" required>
              <Input
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                placeholder="Enter vendor ID"
              />
            </FormField>

            <FormField label="Vendor Name" required>
              <Input
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                placeholder="Vendor name"
              />
            </FormField>

            <FormField label="PO No">
              <Input
                value={formData.poNo}
                onChange={(e) => setFormData({ ...formData, poNo: e.target.value })}
                placeholder="PO reference"
              />
            </FormField>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">MRN Lines</h3>
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
