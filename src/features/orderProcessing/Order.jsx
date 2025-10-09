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
import { useHotkeys } from "@/hooks/useHotkeys"
import { Trash2, Plus } from "lucide-react"
import { formatDate, formatMoney } from "@/lib/formatters"

export function Order() {
  const { addToast } = useAppStore()
  const [formData, setFormData] = useState({
    series: "SO",
    orderNo: "",
    orderDate: formatDate(new Date(), "YYYY-MM-DD"),
    customerId: "",
    customerName: "",
    remarks: "",
  })

  const [lines, setLines] = useState([
    { id: 1, item: "", color: "", width: "", uom: "Mtr", qty: 0, kgs: 0, rate: 0, amount: 0 },
  ])

  const handleSave = () => {
    addToast({ type: "success", message: "Order saved successfully" })
  }

  const handleNew = () => {
    setFormData({
      series: "SO",
      orderNo: "",
      orderDate: formatDate(new Date(), "YYYY-MM-DD"),
      customerId: "",
      customerName: "",
      remarks: "",
    })
    setLines([{ id: 1, item: "", color: "", width: "", uom: "Mtr", qty: 0, kgs: 0, rate: 0, amount: 0 }])
    addToast({ type: "info", message: "New order form" })
  }

  const addLine = () => {
    setLines([
      ...lines,
      { id: lines.length + 1, item: "", color: "", width: "", uom: "Mtr", qty: 0, kgs: 0, rate: 0, amount: 0 },
    ])
  }

  const removeLine = (id) => {
    setLines(lines.filter((line) => line.id !== id))
  }

  const updateLine = (id, field, value) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updated = { ...line, [field]: value }
          if (field === "qty" || field === "rate") {
            updated.amount = updated.qty * updated.rate
          }
          return updated
        }
        return line
      }),
    )
  }

  useHotkeys({
    "alt+n": handleNew,
    "alt+s": handleSave,
  })

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
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <Input
          value={row.original.color}
          onChange={(e) => updateLine(row.original.id, "color", e.target.value)}
          placeholder="Color"
          className="min-w-[120px]"
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
      accessorKey: "uom",
      header: "UOM",
      cell: ({ row }) => (
        <Select value={row.original.uom} onChange={(e) => updateLine(row.original.id, "uom", e.target.value)}>
          <option value="Mtr">Mtr</option>
          <option value="Kgs">Kgs</option>
          <option value="Pcs">Pcs</option>
        </Select>
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
      accessorKey: "kgs",
      header: "Kgs",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.kgs}
          onChange={(e) => updateLine(row.original.id, "kgs", Number.parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      ),
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.rate}
          onChange={(e) => updateLine(row.original.id, "rate", Number.parseFloat(e.target.value) || 0)}
          className="w-28"
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-medium">{formatMoney(row.original.amount)}</span>,
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

  const totalAmount = lines.reduce((sum, line) => sum + line.amount, 0)

  return (
    <PageShell title="Sales Order">
      <ActionBar onNew={handleNew} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Series" required>
              <Select value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value })}>
                <option value="SO">SO - Sales Order</option>
                <option value="EO">EO - Export Order</option>
              </Select>
            </FormField>

            <FormField label="Order No">
              <Input
                value={formData.orderNo}
                onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                placeholder="Auto-generated"
                disabled
              />
            </FormField>

            <FormField label="Order Date" required>
              <DateInput
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Customer ID" required>
              <Input
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                placeholder="Enter customer ID"
              />
            </FormField>

            <FormField label="Customer Name" required>
              <Input
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Customer name"
              />
            </FormField>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Order Lines</h3>
              <Button onClick={addLine} size="sm" variant="accent">
                <Plus className="w-4 h-4" />
                Add Line
              </Button>
            </div>
            <DataTable columns={columns} data={lines} pageSize={10} />
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Lines:</span>
                <span className="font-medium">{lines.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Qty:</span>
                <span className="font-medium">{lines.reduce((sum, line) => sum + line.qty, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Kgs:</span>
                <span className="font-medium">{lines.reduce((sum, line) => sum + line.kgs, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Total Amount:</span>
                <span>{formatMoney(totalAmount)}</span>
              </div>
            </div>
          </div>

          <FormField label="Remarks">
            <Textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Enter any remarks"
              rows={3}
            />
          </FormField>
        </CardContent>
      </Card>
    </PageShell>
  )
}
