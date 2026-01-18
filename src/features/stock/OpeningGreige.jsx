"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent } from "@/components/ui/Card"
import { FormField } from "@/components/forms/FormField"
import { DateInput } from "@/components/ui/DateInput"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { Printer } from "lucide-react"
import { formatDate } from "@/lib/formatters"

const mockData = [
  {
    id: 1,
    machineNo: "KM-05",
    mfgDate: "2024-01-10",
    lotNo: "LOT2024001",
    product: "Single Jersey",
    gsm: 180,
    width: 72,
    uom: "Kgs",
    qty: 500,
    qtyKgs: 500,
    operator: "John Doe",
  },
]

export function OpeningGreige() {
  const { addToast } = useAppStore()

  const defaultEntries = () => mockData
  const defaultDate = () => formatDate(new Date(), "YYYY-MM-DD")

  const [entries, setEntries] = useState(defaultEntries())
  const [date, setDate] = useState(defaultDate())

  const handleNew = () => {
    setEntries(defaultEntries())
    setDate(defaultDate())
    addToast({ type: "info", message: "New opening greige" })
  }

  const handleSave = () => {
    addToast({ type: "success", message: "Opening greige stock saved successfully" })
  }

  const handlePrintLabel = (id) => {
    addToast({ type: "info", message: `Printing label for entry ${id}` })
  }

  const handlePrintAll = () => {
    addToast({ type: "info", message: "Printing all labels" })
  }

  const columns = [
    { accessorKey: "machineNo", header: "Machine No" },
    { accessorKey: "mfgDate", header: "Mfg Date", cell: ({ row }) => formatDate(row.original.mfgDate) },
    { accessorKey: "lotNo", header: "Lot No" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "gsm", header: "GSM" },
    { accessorKey: "width", header: "Width" },
    { accessorKey: "uom", header: "UOM" },
    { accessorKey: "qty", header: "Qty" },
    { accessorKey: "qtyKgs", header: "Qty (Kgs)" },
    { accessorKey: "operator", header: "Operator" },
    {
      id: "actions",
      header: "Print",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => handlePrintLabel(row.original.id)}>
          <Printer className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  return (
    <PageShell
      title="Opening Greige Stock"
      toolbar={
        <Button onClick={handlePrintAll} variant="accent" size="sm">
          <Printer className="w-4 h-4" />
          Print All
        </Button>
      }
    >
      <ActionBar onNew={handleNew} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-4">
          <FormField label="Date" required>
            <DateInput value={date} onChange={(e) => setDate(e.target.value)} className="max-w-xs" />
          </FormField>

          <DataTable columns={columns} data={entries} pageSize={10} />
        </CardContent>
      </Card>
    </PageShell>
  )
}
