"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Save, Printer, Search, Plus, Trash2 } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { formatDate } from "@/lib/formatters"

export default function InspectionEntry() {
  const [defects, setDefects] = useState([])
  const [currentDefect, setCurrentDefect] = useState({
    defectType: "",
    severity: "",
    quantity: "",
    description: "",
  })

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      inspectionNo: "",
      inspectionDate: formatDate(new Date()),
      challanNo: "",
      supplierName: "",
      itemCode: "",
      itemDescription: "",
      lotNo: "",
      receivedQty: "",
      inspectedQty: "",
      acceptedQty: "",
      rejectedQty: "",
      remarks: "",
      inspectorName: "",
      status: "Pending",
    },
  })

  const onSave = (data) => {
    console.log("Saving inspection:", { ...data, defects })
  }

  const handlePrint = () => {
    window.print()
  }

  const addDefect = () => {
    if (currentDefect.defectType && currentDefect.quantity) {
      setDefects([...defects, { ...currentDefect, id: Date.now() }])
      setCurrentDefect({ defectType: "", severity: "", quantity: "", description: "" })
    }
  }

  const removeDefect = (id) => {
    setDefects(defects.filter((d) => d.id !== id))
  }

  const actions = [
    { label: "Create", icon: Plus, onClick: () => reset(), variant: "default" },
    { label: "Save", icon: Save, onClick: handleSubmit(onSave), variant: "primary" },
    { label: "Print", icon: Printer, onClick: handlePrint, variant: "default" },
    { label: "Query", icon: Search, onClick: () => {}, variant: "default" },
  ]

  const defectColumns = [
    { key: "defectType", header: "Defect Type", sortable: true },
    { key: "severity", header: "Severity", sortable: true },
    { key: "quantity", header: "Quantity", sortable: true },
    { key: "description", header: "Description" },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <Button size="sm" variant="ghost" onClick={() => removeDefect(row.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <PageShell title="Quality Inspection Entry">
      <ActionBar actions={actions} />

      <div className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title>Inspection Details</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Inspection No" {...register("inspectionNo")} placeholder="Auto-generated" disabled />
              <Input label="Inspection Date" type="date" {...register("inspectionDate")} />
              <Select
                label="Status"
                {...register("status")}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                ]}
              />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Material Details</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Challan No" {...register("challanNo")} placeholder="Enter challan number" />
              <Input label="Supplier Name" {...register("supplierName")} placeholder="Enter supplier name" />
              <Input label="Item Code" {...register("itemCode")} placeholder="Enter item code" />
              <Input label="Item Description" {...register("itemDescription")} placeholder="Enter description" />
              <Input label="Lot No" {...register("lotNo")} placeholder="Enter lot number" />
              <Input label="Inspector Name" {...register("inspectorName")} placeholder="Enter inspector name" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Quantity Details</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Received Qty" type="number" {...register("receivedQty")} placeholder="0.00" />
              <Input label="Inspected Qty" type="number" {...register("inspectedQty")} placeholder="0.00" />
              <Input label="Accepted Qty" type="number" {...register("acceptedQty")} placeholder="0.00" />
              <Input label="Rejected Qty" type="number" {...register("rejectedQty")} placeholder="0.00" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Defects</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select
                  label="Defect Type"
                  value={currentDefect.defectType}
                  onChange={(e) => setCurrentDefect({ ...currentDefect, defectType: e.target.value })}
                  options={[
                    { value: "", label: "Select..." },
                    { value: "Hole", label: "Hole" },
                    { value: "Stain", label: "Stain" },
                    { value: "Color Variation", label: "Color Variation" },
                    { value: "Measurement", label: "Measurement" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                <Select
                  label="Severity"
                  value={currentDefect.severity}
                  onChange={(e) => setCurrentDefect({ ...currentDefect, severity: e.target.value })}
                  options={[
                    { value: "", label: "Select..." },
                    { value: "Critical", label: "Critical" },
                    { value: "Major", label: "Major" },
                    { value: "Minor", label: "Minor" },
                  ]}
                />
                <Input
                  label="Quantity"
                  type="number"
                  value={currentDefect.quantity}
                  onChange={(e) => setCurrentDefect({ ...currentDefect, quantity: e.target.value })}
                  placeholder="0"
                />
                <Input
                  label="Description"
                  value={currentDefect.description}
                  onChange={(e) => setCurrentDefect({ ...currentDefect, description: e.target.value })}
                  placeholder="Enter details"
                />
                <div className="flex items-end">
                  <Button onClick={addDefect} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <DataTable data={defects} columns={defectColumns} searchable={false} pagination={false} />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Remarks</Card.Title>
          </Card.Header>
          <Card.Content>
            <Textarea {...register("remarks")} placeholder="Enter inspection remarks" rows={4} />
          </Card.Content>
        </Card>
      </div>
    </PageShell>
  )
}
