'use client';

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"

const defaultValues = {
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
}

export default function Item() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("form")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({ defaultValues })

  const activeValue = watch("active")

  useEffect(() => {
    if (view === "list") {
      loadItems()
    }
  }, [view])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await api.items.getAll()
      setItems(data)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load items" })
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    reset(defaultValues)
    setSelectedId(null)
    setView("form")
    addToast({ type: "info", message: "New item form" })
  }

  const handleSave = async (data) => {
    setLoading(true)
    try {
      if (selectedId) {
        await api.items.update(selectedId, data)
        addToast({ type: "success", message: "Item updated successfully" })
      } else {
        await api.items.create(data)
        addToast({ type: "success", message: "Item created successfully" })
      }
      handleNew()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save item" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this item?")) return

    setLoading(true)
    try {
      await api.items.delete(selectedId)
      addToast({ type: "success", message: "Item deleted successfully" })
      handleNew()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete item" })
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (row) => {
    setSelectedId(row.id)
    reset(row)
    setView("form")
  }

  const columns = [
    { accessorKey: "itemCode", header: "Code", enableSorting: true },
    { accessorKey: "itemName", header: "Item Name", enableSorting: true },
    { accessorKey: "category", header: "Category", enableSorting: true },
    { accessorKey: "uom", header: "UOM" },
    { accessorKey: "rate", header: "Rate", enableSorting: true },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.original.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.original.active ? "Yes" : "No"}
        </span>
      ),
    },
  ]

  return (
    <PageShell title="Item Master">
      <ActionBar
        onNew={handleNew}
        onSave={handleSubmit(handleSave)}
        onQuery={() => setView("list")}
        onDelete={selectedId ? handleDelete : undefined}
        disableSave={!isDirty || loading}
        disableDelete={!selectedId || loading}
      />

      {view === "form" ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? "Edit Item" : "New Item"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="taxation">Taxation</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Item Code"
                    {...register("itemCode", { required: "Item code is required" })}
                    placeholder="Enter item code"
                    error={errors.itemCode?.message}
                    required
                  />
                  <Input
                    label="Item Name"
                    {...register("itemName", { required: "Item name is required" })}
                    placeholder="Enter item name"
                    error={errors.itemName?.message}
                    required
                  />
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
                  <div className="flex items-end">
                    <Checkbox
                      label="Active"
                      checked={activeValue}
                      onChange={(e) => setValue("active", e.target.checked, { shouldDirty: true })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inventory">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Reorder Level"
                    type="number"
                    {...register("reorderLevel", { min: { value: 0, message: "Must be positive" } })}
                    placeholder="0.00"
                    error={errors.reorderLevel?.message}
                  />
                  <Input
                    label="Reorder Quantity"
                    type="number"
                    {...register("reorderQty", { min: { value: 0, message: "Must be positive" } })}
                    placeholder="0.00"
                    error={errors.reorderQty?.message}
                  />
                  <Input
                    label="Standard Rate"
                    type="number"
                    {...register("standardRate", { min: { value: 0, message: "Must be positive" } })}
                    placeholder="0.00"
                    error={errors.standardRate?.message}
                  />
                </div>
              </TabsContent>

              <TabsContent value="taxation">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Item List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DataTable columns={columns} data={items} onRowClick={handleRowClick} />
            )}
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}
