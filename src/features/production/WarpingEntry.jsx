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
    gb: "GB001",
    warpingMcNo: "WM-01",
    knittingMcNo: "KM-05",
    lotNo: "LOT2024001",
    yarn: "30s Cotton",
    warpingLength: 5000,
    round: 10,
    noOfBeam: 2,
    weightPerBeam: 45.5,
    qty: 100,
    qtyKgs: 91,
    ends: 1200,
    setNo: "SET-01",
    innerDia: 18,
    outerDia: 24,
    operator: "John Doe",
    labelPrinted: false,
  },
]

export function WarpingEntry() {
  const { addToast } = useAppStore()

  const defaultEntries = () => mockData
  const defaultDate = () => formatDate(new Date(), "YYYY-MM-DD")

  const [entries, setEntries] = useState(defaultEntries())
  const [date, setDate] = useState(defaultDate())

  const handleNew = () => {
    setEntries(defaultEntries())
    setDate(defaultDate())
    addToast({ type: "info", message: "New warping entry" })
  }

  const handleSave = () => {
    addToast({ type: "success", message: "Warping entry saved successfully" })
  }

  const handlePrintLabel = (id) => {
    addToast({ type: "info", message: `Printing label for entry ${id}` })
  }

  const handlePrintAll = () => {
    addToast({ type: "info", message: "Printing all labels" })
  }

  const columns = [
    { accessorKey: "gb", header: "GB" },
    { accessorKey: "warpingMcNo", header: "Warping Mc No" },
    { accessorKey: "knittingMcNo", header: "Knitting Mc No" },
    { accessorKey: "lotNo", header: "Lot No" },
    { accessorKey: "yarn", header: "Yarn" },
    { accessorKey: "warpingLength", header: "Warping Length" },
    { accessorKey: "round", header: "Round" },
    { accessorKey: "noOfBeam", header: "No of Beam" },
    { accessorKey: "weightPerBeam", header: "Weight/Beam" },
    { accessorKey: "qty", header: "Qty" },
    { accessorKey: "qtyKgs", header: "Qty (Kgs)" },
    { accessorKey: "ends", header: "Ends" },
    { accessorKey: "setNo", header: "Set No" },
    { accessorKey: "innerDia", header: "Inner Dia" },
    { accessorKey: "outerDia", header: "Outer Dia" },
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
      title="Warping Production Entry"
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
