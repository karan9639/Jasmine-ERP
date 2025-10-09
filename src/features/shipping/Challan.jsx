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
import { Trash2, Plus, Mail } from "lucide-react"
import { formatDate, formatMoney } from "@/lib/formatters"

export function Challan() {
  const { addToast } = useAppStore()
  const [formData, setFormData] = useState({
    series: "CH",
    challanNo: "",
    challanDate: formatDate(new Date(), "YYYY-MM-DD"),
    customerGroup: "",
    customerId: "",
    customerName: "",
    consignee: "",
    vehicleNo: "",
    driverName: "",
    driverPhone: "",
    entryForm: "",
    remarks: "",
  })

  const [lines, setLines] = useState([
    { id: 1, label: "", product: "", gsm: "", width: "", color: "", qty: 0, qtyKgs: 0, rate: 0, amount: 0 },
  ])

  const handleSave = () => {
    addToast({ type: "success", message: "Challan saved successfully" })
  }

  const handleSendEmail = () => {
    addToast({ type: "info", message: "Sending challan via email" })
  }

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: lines.length + 1,
        label: "",
        product: "",
        gsm: "",
        width: "",
        color: "",
        qty: 0,
        qtyKgs: 0,
        rate: 0,
        amount: 0,
      },
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
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => (
        <Input
          value={row.original.label}
          onChange={(e) => updateLine(row.original.id, "label", e.target.value)}
          placeholder="Label"
          className="w-32"
        />
      ),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <Input
          value={row.original.product}
          onChange={(e) => updateLine(row.original.id, "product", e.target.value)}
          placeholder="Product"
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
    <PageShell
      title="Delivery Challan"
      toolbar={
        <Button onClick={handleSendEmail} variant="outline" size="sm">
          <Mail className="w-4 h-4" />
          Send Email
        </Button>
      }
    >
      <ActionBar onNew={() => {}} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Series">
              <Select value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value })}>
                <option value="CH">CH - Challan</option>
                <option value="DC">DC - Delivery Challan</option>
              </Select>
            </FormField>

            <FormField label="Challan No">
              <Input value={formData.challanNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="Challan Date" required>
              <DateInput
                value={formData.challanDate}
                onChange={(e) => setFormData({ ...formData, challanDate: e.target.value })}
              />
            </FormField>

            <FormField label="Entry Form">
              <Input
                value={formData.entryForm}
                onChange={(e) => setFormData({ ...formData, entryForm: e.target.value })}
                placeholder="Entry form no"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Customer Group">
              <Input
                value={formData.customerGroup}
                onChange={(e) => setFormData({ ...formData, customerGroup: e.target.value })}
                placeholder="Customer group"
              />
            </FormField>

            <FormField label="Customer ID" required>
              <Input
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                placeholder="Customer ID"
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

          <FormField label="Consignee">
            <Input
              value={formData.consignee}
              onChange={(e) => setFormData({ ...formData, consignee: e.target.value })}
              placeholder="Consignee details"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Vehicle No">
              <Input
                value={formData.vehicleNo}
                onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                placeholder="Vehicle number"
              />
            </FormField>

            <FormField label="Driver Name">
              <Input
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                placeholder="Driver name"
              />
            </FormField>

            <FormField label="Driver Phone">
              <Input
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                placeholder="Driver phone"
              />
            </FormField>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Challan Lines</h3>
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
