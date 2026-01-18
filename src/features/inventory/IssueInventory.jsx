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
import { formatDate } from "@/lib/formatters"

export function IssueInventory() {
  const { addToast } = useAppStore()
  const [formData, setFormData] = useState({
    issueNo: "",
    issueDate: formatDate(new Date(), "YYYY-MM-DD"),
    department: "",
    jobReference: "",
    issuedTo: "",
    purpose: "",
    remarks: "",
  })

  const [lines, setLines] = useState([
    { id: 1, item: "", specification: "", uom: "Kgs", requestedQty: 0, issuedQty: 0, lotNo: "", rackNo: "" },
  ])

  const handleSave = () => {
    addToast({ type: "success", message: "Issue inventory saved successfully" })
  }

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: lines.length + 1,
        item: "",
        specification: "",
        uom: "Kgs",
        requestedQty: 0,
        issuedQty: 0,
        lotNo: "",
        rackNo: "",
      },
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
          <option value="Ltr">Ltr</option>
        </Select>
      ),
    },
    {
      accessorKey: "requestedQty",
      header: "Requested Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.requestedQty}
          onChange={(e) => updateLine(row.original.id, "requestedQty", Number.parseFloat(e.target.value) || 0)}
          className="w-28"
        />
      ),
    },
    {
      accessorKey: "issuedQty",
      header: "Issued Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.issuedQty}
          onChange={(e) => updateLine(row.original.id, "issuedQty", Number.parseFloat(e.target.value) || 0)}
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
    <PageShell title="Issue Inventory">
      <ActionBar onNew={() => {}} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Issue No">
              <Input value={formData.issueNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="Issue Date" required>
              <DateInput
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </FormField>

            <FormField label="Department" required>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                <option value="Production">Production</option>
                <option value="Dyeing">Dyeing</option>
                <option value="Lamination">Lamination</option>
                <option value="Maintenance">Maintenance</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Job Reference">
              <Input
                value={formData.jobReference}
                onChange={(e) => setFormData({ ...formData, jobReference: e.target.value })}
                placeholder="Job/Order reference"
              />
            </FormField>

            <FormField label="Issued To" required>
              <Input
                value={formData.issuedTo}
                onChange={(e) => setFormData({ ...formData, issuedTo: e.target.value })}
                placeholder="Person name"
              />
            </FormField>

            <FormField label="Purpose">
              <Input
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Purpose"
              />
            </FormField>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Issue Lines</h3>
              <Button onClick={addLine} size="sm" variant="accent">
                <Plus className="w-4 h-4" />
                Add Line
              </Button>
            </div>
            <DataTable columns={columns} data={lines} pageSize={10} />
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

export default IssueInventory
