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
    knittingJcNo: "KJC-001",
    machineNo: "KM-05",
    date: "2024-01-15",
    lotNo: "LOT2024001",
    product: "Single Jersey",
    gsm: 180,
    width: 72,
    uom: "Kgs",
    qty: 500,
    qtyKgs: 500,
    rackNo: "R-12",
    operator: "Mike Smith",
    labelPrinted: false,
  },
]

export function KnittingEntry() {
  const { addToast } = useAppStore()

  const defaultEntries = () => mockData
  const defaultDate = () => formatDate(new Date(), "YYYY-MM-DD")

  const [entries, setEntries] = useState(defaultEntries())
  const [date, setDate] = useState(defaultDate())

  const handleNew = () => {
    setEntries(defaultEntries())
    setDate(defaultDate())
    addToast({ type: "info", message: "New knitting entry" })
  }

  const handleSave = () => {
    addToast({ type: "success", message: "Knitting entry saved successfully" })
  }

  const handlePrintLabel = (id) => {
    addToast({ type: "info", message: `Printing label for entry ${id}` })
  }

  const handlePrintAll = () => {
    addToast({ type: "info", message: "Printing all labels" })
  }

  const columns = [
    { accessorKey: "knittingJcNo", header: "Knitting JC No" },
    { accessorKey: "machineNo", header: "Machine No" },
    { accessorKey: "date", header: "Date", cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: "lotNo", header: "Lot No" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "gsm", header: "GSM" },
    { accessorKey: "width", header: "Width" },
    { accessorKey: "uom", header: "UOM" },
    { accessorKey: "qty", header: "Qty" },
    { accessorKey: "qtyKgs", header: "Qty (Kgs)" },
    { accessorKey: "rackNo", header: "Rack No" },
    { accessorKey: "operator", header: "Operator" },
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
      title="Knitting Production Entry"
      toolbar={
        <Button onClick={handlePrintAll} variant="accent" size="sm">
          <Printer className="w-4 h-4" />
          Print All Labels
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
