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
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { formatDate } from "@/lib/formatters"

export function DyeingJobcard() {
  const { addToast } = useAppStore()

  const defaultFormData = () => ({
    jobcardNo: "",
    jobcardDate: formatDate(new Date(), "YYYY-MM-DD"),
    scheduleNo: "",
    machineNo: "",
    operator: "",
    shift: "Day",
    processType: "Dyeing",
    remarks: "",
  })

  const defaultLines = () => [
    {
      id: 1,
      label: "",
      product: "",
      gsm: "",
      width: "",
      color: "",
      lotNo: "",
      qty: 0,
      qtyKgs: 0,
      status: "Pending",
    },
  ]

  const [formData, setFormData] = useState(defaultFormData())
  const [lines, setLines] = useState(defaultLines())

  const handleNew = () => {
    setFormData(defaultFormData())
    setLines(defaultLines())
    addToast({ type: "info", message: "New dyeing jobcard" })
  }

  const handleSave = () => {
    addToast({ type: "success", message: "Dyeing jobcard saved successfully" })
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
    { accessorKey: "status", header: "Status" },
  ]

  return (
    <PageShell title="Dyeing Jobcard">
      <ActionBar onNew={handleNew} onSave={handleSave} onPrint={() => {}} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Jobcard No">
              <Input value={formData.jobcardNo} placeholder="Auto-generated" disabled />
            </FormField>

            <FormField label="Jobcard Date" required>
              <DateInput
                value={formData.jobcardDate}
                onChange={(e) => setFormData({ ...formData, jobcardDate: e.target.value })}
              />
            </FormField>

            <FormField label="Schedule No" required>
              <Input
                value={formData.scheduleNo}
                onChange={(e) => setFormData({ ...formData, scheduleNo: e.target.value })}
                placeholder="Schedule reference"
              />
            </FormField>

            <FormField label="Machine No" required>
              <Input
                value={formData.machineNo}
                onChange={(e) => setFormData({ ...formData, machineNo: e.target.value })}
                placeholder="Machine No"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Operator" required>
              <Input
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                placeholder="Operator name"
              />
            </FormField>

            <FormField label="Shift">
              <Select value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })}>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </Select>
            </FormField>

            <FormField label="Process Type">
              <Select
                value={formData.processType}
                onChange={(e) => setFormData({ ...formData, processType: e.target.value })}
              >
                <option value="Dyeing">Dyeing</option>
                <option value="Bleaching">Bleaching</option>
                <option value="Printing">Printing</option>
              </Select>
            </FormField>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Jobcard Lines</h3>
            <DataTable columns={columns} data={lines} pageSize={10} />
          </div>

          <FormField label="Remarks">
            <Textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Enter remarks"
              rows={3}
            />
          </FormField>
        </CardContent>
      </Card>
    </PageShell>
  )
}
