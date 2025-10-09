"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Save, Search, Plus, List } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import { Tabs } from "@/components/ui/Tabs"
import { DataTable } from "@/components/ui/DataTable"

export default function Item() {
  const [view, setView] = useState("form")
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      itemCode: "",
      itemName: "",
      itemDescription: "",
      itemCategory: "",
      itemType: "Raw Material",
      uom: "KG",
      hsnCode: "",
      gstRate: "18",
      reorderLevel: "",
      reorderQty: "",
      standardRate: "",
      active: true,
    },
  })

  const onSave = (data) => {
    console.log("Saving item:", data)
  }

  const actions = [
    {
      label: "Create",
      icon: Plus,
      onClick: () => {
        reset()
        setView("form")
      },
      variant: "default",
    },
    { label: "Save", icon: Save, onClick: handleSubmit(onSave), variant: "primary" },
    { label: "Query", icon: Search, onClick: () => setView("list"), variant: "default" },
    { label: "List", icon: List, onClick: () => setView("list"), variant: "default" },
  ]

  const columns = [
    { key: "itemCode", header: "Code", sortable: true },
    { key: "itemName", header: "Item Name", sortable: true },
    { key: "itemType", header: "Type", sortable: true },
    { key: "uom", header: "UOM" },
    { key: "hsnCode", header: "HSN Code" },
    { key: "gstRate", header: "GST %", sortable: true },
    { key: "active", header: "Active", cell: (row) => (row.active ? "Yes" : "No") },
  ]

  const mockData = [
    {
      id: 1,
      itemCode: "ITEM001",
      itemName: "Cotton Yarn 30s",
      itemType: "Raw Material",
      uom: "KG",
      hsnCode: "52051100",
      gstRate: "5",
      active: true,
    },
  ]

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "inventory", label: "Inventory" },
    { id: "taxation", label: "Taxation" },
  ]

  return (
    <PageShell title="Item Master">
      <ActionBar actions={actions} />

      {view === "form" ? (
        <Card>
          <Card.Content>
            <Tabs tabs={tabs}>
              <Tabs.Panel id="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Item Code" {...register("itemCode")} placeholder="Enter item code" required />
                  <Input label="Item Name" {...register("itemName")} placeholder="Enter item name" required />
                  <Textarea
                    label="Description"
                    {...register("itemDescription")}
                    placeholder="Enter description"
                    rows={2}
                  />
                  <Input label="Category" {...register("itemCategory")} placeholder="Enter category" />
                  <Select
                    label="Item Type"
                    {...register("itemType")}
                    options={[
                      { value: "Raw Material", label: "Raw Material" },
                      { value: "Semi Finished", label: "Semi Finished" },
                      { value: "Finished Goods", label: "Finished Goods" },
                      { value: "Consumable", label: "Consumable" },
                    ]}
                  />
                  <Select
                    label="UOM"
                    {...register("uom")}
                    options={[
                      { value: "KG", label: "KG" },
                      { value: "MTR", label: "MTR" },
                      { value: "PCS", label: "PCS" },
                      { value: "SET", label: "SET" },
                    ]}
                  />
                  <Checkbox label="Active" {...register("active")} />
                </div>
              </Tabs.Panel>

              <Tabs.Panel id="inventory">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Reorder Level" type="number" {...register("reorderLevel")} placeholder="0.00" />
                  <Input label="Reorder Quantity" type="number" {...register("reorderQty")} placeholder="0.00" />
                  <Input label="Standard Rate" type="number" {...register("standardRate")} placeholder="0.00" />
                </div>
              </Tabs.Panel>

              <Tabs.Panel id="taxation">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="HSN Code" {...register("hsnCode")} placeholder="Enter HSN code" />
                  <Select
                    label="GST Rate"
                    {...register("gstRate")}
                    options={[
                      { value: "0", label: "0%" },
                      { value: "5", label: "5%" },
                      { value: "12", label: "12%" },
                      { value: "18", label: "18%" },
                      { value: "28", label: "28%" },
                    ]}
                  />
                </div>
              </Tabs.Panel>
            </Tabs>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content>
            <DataTable
              data={mockData}
              columns={columns}
              onRowClick={(row) => {
                console.log("Edit:", row)
                setView("form")
              }}
            />
          </Card.Content>
        </Card>
      )}
    </PageShell>
  )
}
