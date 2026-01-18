"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent } from "@/components/ui/Card"
import { FormField } from "@/components/forms/FormField"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { DateInput } from "@/components/ui/DateInput"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { Eye, Settings, Plus, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/formatters"

const defaultHeader = () => ({
  document: "Lamination Schedule",
  scheduleDate: formatDate(new Date(), "YYYY-MM-DD"),
  series: "LS",
  scheduleNo: "",
  scheduleType: "Regular",
  orderNo: "",
  remark: "",
})

const defaultLine = (id) => ({
  id,
  product: "",
  gsm: "",
  width: "",
  foamType: "",
  adhesive: "",
  qty: 0,
  qtyKgs: 0,
  deliveryDate: "",
})

export function LaminationSchedule() {
  const { addToast } = useAppStore()
  const [formData, setFormData] = useState(defaultHeader())
  const [lines, setLines] = useState([defaultLine(1)])

  const handleSave = () => addToast({ type: "success", message: "Lamination schedule saved successfully" })

  const handleNew = () => {
    setFormData(defaultHeader())
    setLines([defaultLine(1)])
    addToast({ type: "info", message: "New lamination schedule" })
  }

  const handleViewStock = () => addToast({ type: "info", message: "Opening stock view" })
  const handleAutoAdjust = () => addToast({ type: "info", message: "Auto adjusting stock" })

  const addLine = () => {
    const nextId = Math.max(0, ...lines.map((l) => l.id)) + 1
    setLines([...lines, defaultLine(nextId)])
  }

  const removeLine = (id) => {
    const updated = lines.filter((l) => l.id !== id)
    setLines(updated.length ? updated : [defaultLine(1)])
  }

  const updateLine = (id, field, value) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  const columns = [
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <Input
          value={row.original.product}
          onChange={(e) => updateLine(row.original.id, "product", e.target.value)}
          placeholder="Select product"
          className="min-w-[200px]"
        />
      ),
    },
    {
      accessorKey: "gsm",
      header: "GSM",
      cell: ({ row }) => (
        <Input
          value={row.original.gsm}
          onChange={(e) => updateLine(row.original.id, "gsm", e.target.value)}
          placeholder="GSM"
          className="w-24"
        />
      ),
    },
    {
      accessorKey: "width",
      header: "Width",
      cell: ({ row }) => (
        <Input
          value={row.original.width}
          onChange={(e) => updateLine(row.original.id, "width", e.target.value)}
          placeholder="Width"
          className="w-24"
        />
      ),
    },
    {
      accessorKey: "foamType",
      header: "Foam Type",
      cell: ({ row }) => (
        <Input
          value={row.original.foamType}
          onChange={(e) => updateLine(row.original.id, "foamType", e.target.value)}
          placeholder="Foam type"
          className="min-w-[150px]"
        />
      ),
    },
    {
      accessorKey: "adhesive",
      header: "Adhesive",
      cell: ({ row }) => (
        <Input
          value={row.original.adhesive}
          onChange={(e) => updateLine(row.original.id, "adhesive", e.target.value)}
          placeholder="Adhesive"
          className="w-32"
        />
      ),
    },
    {
      accessorKey: "qty",
      header: "Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.qty}
          onChange={(e) => updateLine(row.original.id, "qty", Number.parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      ),
    },
    {
      accessorKey: "qtyKgs",
      header: "Qty (Kgs)",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.qtyKgs}
          onChange={(e) => updateLine(row.original.id, "qtyKgs", Number.parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      ),
    },
    {
      accessorKey: "deliveryDate",
      header: "Delivery Date",
      cell: ({ row }) => (
        <DateInput
          value={row.original.deliveryDate}
          onChange={(e) => updateLine(row.original.id, "deliveryDate", e.target.value)}
          className="w-40"
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => removeLine(row.original.id)} title="Remove line">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      ),
    },
  ]

  return (
    <PageShell
      title="Lamination Schedule"
      toolbar={
        <div className="flex gap-2">
          <Button onClick={handleViewStock} variant="outline" size="sm">
            <Eye className="w-4 h-4" />
            View Stock
          </Button>
          <Button onClick={handleAutoAdjust} variant="accent" size="sm">
            <Settings className="w-4 h-4" />
            Auto Adjust Stock
          </Button>
        </div>
      }
    >
      <ActionBar onNew={handleNew} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Document">
              <Input value={formData.document} disabled />
            </FormField>

            <FormField label="Schedule Date" required>
              <DateInput
                value={formData.scheduleDate}
                onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
              />
            </FormField>

            <FormField label="Series">
              <Select value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value })}>
                <option value="LS">LS - Lamination Schedule</option>
              </Select>
            </FormField>

            <FormField label="Schedule No">
              <Input value={formData.scheduleNo} placeholder="Auto-generated" disabled />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Schedule Type">
              <Select
                value={formData.scheduleType}
                onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
              >
                <option value="Regular">Regular</option>
                <option value="Urgent">Urgent</option>
              </Select>
            </FormField>

            <FormField label="Order No">
              <Input
                value={formData.orderNo}
                onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                placeholder="Order reference"
              />
            </FormField>

            <FormField label="Search">
              <Input placeholder="Search..." />
            </FormField>
          </div>

          <FormField label="Remark">
            <Textarea
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              placeholder="Enter remarks"
              rows={2}
            />
          </FormField>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Schedule Lines</h3>
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

export default LaminationSchedule
