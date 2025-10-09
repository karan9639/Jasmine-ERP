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
import { Trash2, Plus } from "lucide-react"
import { formatDate, formatMoney } from "@/lib/formatters"

export function PurchaseOrder() {
  const { addToast } = useAppStore()
  const [formData, setFormData] = useState({
    poNo: "",
    poDate: formatDate(new Date(), "YYYY-MM-DD"),
    vendorId: "",
    vendorName: "",
    deliveryDate: "",
    paymentTerms: "",
    remarks: "",
  })

  const [lines, setLines] = useState([
    { id: 1, item: "", specification: "", uom: "Kgs", qty: 0, rate: 0, taxRate: 18, amount: 0 },
  ])

  const handleSave = () => {
    addToast({ type: "success", message: "Purchase Order saved successfully" })
  }

  const addLine = () => {
    setLines([
      ...lines,
      { id: lines.length + 1, item: "", specification: "", uom: "Kgs", qty: 0, rate: 0, taxRate: 18, amount: 0 },
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
      accessorKey: "taxRate",
      header: "Tax %",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.taxRate}
          onChange={(e) => updateLine(row.original.id, "taxRate", Number.parseFloat(e.target.value) || 0)}
          className="w-20"
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

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0)
  const totalTax = lines.reduce((sum, line) => sum + (line.amount * line.taxRate) / 100, 0)
  const grandTotal = subtotal + totalTax

  return (
    <PageShell title="Purchase Order">
      <ActionBar onNew={() => {}} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="PO No">
              <Input value={formData.poNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="PO Date" required>
              <DateInput
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
              />
            </FormField>

            <FormField label="Delivery Date" required>
              <DateInput
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <FormField label="Payment Terms">
            <Input
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              placeholder="e.g., Net 30 days"
            />
          </FormField>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">PO Lines</h3>
              <Button onClick={addLine} size="sm" variant="accent">
                <Plus className="w-4 h-4" />
                Add Line
              </Button>
            </div>
            <DataTable columns={columns} data={lines} pageSize={10} />
          </div>

          <div className="flex justify-end">
            <div className="w-80 space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Tax:</span>
                <span className="font-medium">{formatMoney(totalTax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Grand Total:</span>
                <span>{formatMoney(grandTotal)}</span>
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
