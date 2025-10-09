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
import { Printer } from "lucide-react"
import { formatDate } from "@/lib/formatters"

const mockData = [
  {
    id: 1,
    label: "LBL001",
    product: "Laminated Fabric",
    gsm: 200,
    width: 72,
    color: "White",
    lotNo: "LOT2024001",
    qty: 100,
    qtyKgs: 200,
    rackNo: "R-15",
  },
]

export function LaminationSlip() {
  const { addToast } = useAppStore()
  const [formData, setFormData] = useState({
    docType: "Packing Slip",
    series: "PS",
    packingSlipNo: "",
    packingSlipDate: formatDate(new Date(), "YYYY-MM-DD"),
    machine: "",
    operator: "",
    lotScheduleNo: "",
    storeLocation: "",
  })

  const [lines, setLines] = useState(mockData)

  const handleSave = () => {
    addToast({ type: "success", message: "Lamination slip saved successfully" })
  }

  const handlePrintLabel = (id) => {
    addToast({ type: "info", message: `Printing label for ${id}` })
  }

  const handleBulkPrint = () => {
    addToast({ type: "info", message: "Bulk printing labels" })
  }

  const columns = [
    { accessorKey: "label", header: "Label" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "gsm", header: "GSM" },
    { accessorKey: "width", header: "Width" },
    { accessorKey: "color", header: "Color" },
    { accessorKey: "lotNo", header: "Lot No" },
    { accessorKey: "qty", header: "Qty" },
    { accessorKey: "qtyKgs", header: "Qty (Kgs)" },
    { accessorKey: "rackNo", header: "Rack No" },
    {
      id: "actions",
      header: "Print Label",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => handlePrintLabel(row.original.id)}>
          <Printer className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  return (
    <PageShell
      title="Lamination Packing Slip"
      toolbar={
        <Button onClick={handleBulkPrint} variant="accent" size="sm">
          <Printer className="w-4 h-4" />
          Bulk Print
        </Button>
      }
    >
      <ActionBar onNew={() => {}} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Doc Type">
              <Select value={formData.docType} onChange={(e) => setFormData({ ...formData, docType: e.target.value })}>
                <option value="Packing Slip">Packing Slip</option>
                <option value="Production Slip">Production Slip</option>
              </Select>
            </FormField>

            <FormField label="Series">
              <Select value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value })}>
                <option value="PS">PS - Packing Slip</option>
              </Select>
            </FormField>

            <FormField label="Packing Slip No">
              <Input value={formData.packingSlipNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="Packing Slip Date" required>
              <DateInput
                value={formData.packingSlipDate}
                onChange={(e) => setFormData({ ...formData, packingSlipDate: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Machine">
              <Input
                value={formData.machine}
                onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                placeholder="Machine No"
              />
            </FormField>

            <FormField label="Operator">
              <Input
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                placeholder="Operator name"
              />
            </FormField>

            <FormField label="Lot Schedule No">
              <Input
                value={formData.lotScheduleNo}
                onChange={(e) => setFormData({ ...formData, lotScheduleNo: e.target.value })}
                placeholder="Manual Print"
              />
            </FormField>

            <FormField label="Store Location">
              <Input
                value={formData.storeLocation}
                onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                placeholder="Store location"
              />
            </FormField>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Slip Lines</h3>
            <DataTable columns={columns} data={lines} pageSize={10} />
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
