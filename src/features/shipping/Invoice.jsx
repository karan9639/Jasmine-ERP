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
import { Trash2, Plus, FileText } from "lucide-react"
import { formatDate, formatMoney } from "@/lib/formatters"

export function Invoice() {
  const { addToast } = useAppStore()
  const [formData, setFormData] = useState({
    series: "INV",
    invoiceNo: "",
    invoiceDate: formatDate(new Date(), "YYYY-MM-DD"),
    removalTime: "",
    customerId: "",
    customerName: "",
    billingAddress: "",
    deliveryLocation: "",
    vehicleNo: "",
    driverName: "",
    permitNo: "",
    cgst: 9,
    sgst: 9,
    igst: 0,
    tcsPercent: 0.1,
    surcharge: 0,
    jwCharges: 0,
  })

  const [lines, setLines] = useState([{ id: 1, product: "", hsn: "", qty: 0, rate: 0, amount: 0 }])

  const handleSave = () => {
    addToast({ type: "success", message: "Invoice saved successfully" })
  }

  const handleGenerateIRN = () => {
    addToast({ type: "info", message: "Generating IRN..." })
  }

  const handleGenerateEWay = () => {
    addToast({ type: "info", message: "Generating E-Way Bill JSON..." })
  }

  const addLine = () => {
    setLines([...lines, { id: lines.length + 1, product: "", hsn: "", qty: 0, rate: 0, amount: 0 }])
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
      accessorKey: "hsn",
      header: "HSN",
      cell: ({ row }) => (
        <Input
          value={row.original.hsn}
          onChange={(e) => updateLine(row.original.id, "hsn", e.target.value)}
          placeholder="HSN Code"
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

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0)
  const cgstAmount = (subtotal * formData.cgst) / 100
  const sgstAmount = (subtotal * formData.sgst) / 100
  const igstAmount = (subtotal * formData.igst) / 100
  const taxTotal = cgstAmount + sgstAmount + igstAmount
  const assessableValue = subtotal + taxTotal + formData.surcharge + formData.jwCharges
  const tcsAmount = (assessableValue * formData.tcsPercent) / 100
  const grandTotal = assessableValue + tcsAmount

  return (
    <PageShell
      title="Tax Invoice"
      toolbar={
        <div className="flex gap-2">
          <Button onClick={handleGenerateIRN} variant="accent" size="sm">
            <FileText className="w-4 h-4" />
            Generate IRN
          </Button>
          <Button onClick={handleGenerateEWay} variant="outline" size="sm">
            <FileText className="w-4 h-4" />
            Generate E-Way Bill
          </Button>
        </div>
      }
    >
      <ActionBar onNew={() => {}} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Series">
              <Select value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value })}>
                <option value="INV">INV - Tax Invoice</option>
                <option value="EXP">EXP - Export Invoice</option>
              </Select>
            </FormField>

            <FormField label="Invoice No">
              <Input value={formData.invoiceNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="Invoice Date" required>
              <DateInput
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
              />
            </FormField>

            <FormField label="Removal Time">
              <Input
                type="time"
                value={formData.removalTime}
                onChange={(e) => setFormData({ ...formData, removalTime: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Billing Address" required>
              <Input
                value={formData.billingAddress}
                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                placeholder="Billing address"
              />
            </FormField>

            <FormField label="Delivery Location">
              <Input
                value={formData.deliveryLocation}
                onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                placeholder="Delivery location"
              />
            </FormField>
          </div>

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

            <FormField label="Permit No">
              <Input
                value={formData.permitNo}
                onChange={(e) => setFormData({ ...formData, permitNo: e.target.value })}
                placeholder="Permit number"
              />
            </FormField>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Invoice Lines</h3>
              <Button onClick={addLine} size="sm" variant="accent">
                <Plus className="w-4 h-4" />
                Add Line
              </Button>
            </div>
            <DataTable columns={columns} data={lines} pageSize={10} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">GST Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="CGST %">
                  <Input
                    type="number"
                    value={formData.cgst}
                    onChange={(e) => setFormData({ ...formData, cgst: Number.parseFloat(e.target.value) || 0 })}
                  />
                </FormField>
                <FormField label="SGST %">
                  <Input
                    type="number"
                    value={formData.sgst}
                    onChange={(e) => setFormData({ ...formData, sgst: Number.parseFloat(e.target.value) || 0 })}
                  />
                </FormField>
                <FormField label="IGST %">
                  <Input
                    type="number"
                    value={formData.igst}
                    onChange={(e) => setFormData({ ...formData, igst: Number.parseFloat(e.target.value) || 0 })}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="TCS %">
                  <Input
                    type="number"
                    value={formData.tcsPercent}
                    onChange={(e) => setFormData({ ...formData, tcsPercent: Number.parseFloat(e.target.value) || 0 })}
                  />
                </FormField>
                <FormField label="Surcharge">
                  <Input
                    type="number"
                    value={formData.surcharge}
                    onChange={(e) => setFormData({ ...formData, surcharge: Number.parseFloat(e.target.value) || 0 })}
                  />
                </FormField>
                <FormField label="JW Charges">
                  <Input
                    type="number"
                    value={formData.jwCharges}
                    onChange={(e) => setFormData({ ...formData, jwCharges: Number.parseFloat(e.target.value) || 0 })}
                  />
                </FormField>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-semibold mb-3">Invoice Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>CGST ({formData.cgst}%):</span>
                <span className="font-medium">{formatMoney(cgstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>SGST ({formData.sgst}%):</span>
                <span className="font-medium">{formatMoney(sgstAmount)}</span>
              </div>
              {formData.igst > 0 && (
                <div className="flex justify-between text-sm">
                  <span>IGST ({formData.igst}%):</span>
                  <span className="font-medium">{formatMoney(igstAmount)}</span>
                </div>
              )}
              {formData.surcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Surcharge:</span>
                  <span className="font-medium">{formatMoney(formData.surcharge)}</span>
                </div>
              )}
              {formData.jwCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span>JW Charges:</span>
                  <span className="font-medium">{formatMoney(formData.jwCharges)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span>Assessable Value:</span>
                <span className="font-medium">{formatMoney(assessableValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TCS ({formData.tcsPercent}%):</span>
                <span className="font-medium">{formatMoney(tcsAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Grand Total:</span>
                <span>{formatMoney(grandTotal)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}

export default Invoice
