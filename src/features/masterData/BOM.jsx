'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { Search, Plus, Edit, Trash2, PlusCircle, X } from "lucide-react"

const defaultForm = {
  bomCode: "",
  productName: "",
  items: [],
}

export function BOM() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultForm)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [items, setItems] = useState([])

  useEffect(() => {
    loadData()
    loadItems()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.bom.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load BOM data" })
    } finally {
      setLoading(false)
    }
  }

  const loadItems = async () => {
    const itemList = await api.items.getAll()
    setItems(itemList)
  }

  const handleNew = () => {
    setFormData({ ...defaultForm, items: [{ itemId: "", itemName: "", qty: 0, uom: "KG" }] })
    setSelectedId(null)
    setView("form")
  }

  const handleEdit = (row) => {
    setFormData(row)
    setSelectedId(row.id)
    setView("form")
  }

  const handleSave = async () => {
    if (!formData.bomCode || !formData.productName) {
      addToast({ type: "error", message: "BOM Code and Product Name are required" })
      return
    }

    setLoading(true)
    try {
      if (selectedId) {
        await api.bom.update(selectedId, formData)
        addToast({ type: "success", message: "BOM updated successfully" })
      } else {
        await api.bom.create(formData)
        addToast({ type: "success", message: "BOM created successfully" })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save BOM" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this BOM?")) return

    setLoading(true)
    try {
      await api.bom.delete(selectedId)
      addToast({ type: "success", message: "BOM deleted successfully" })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete BOM" })
    } finally {
      setLoading(false)
    }
  }

  const addBomLine = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: "", itemName: "", qty: 0, uom: "KG" }]
    })
  }

  const removeBomLine = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const updateBomLine = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === "itemId") {
      const selectedItem = items.find(i => i.id === Number(value))
      if (selectedItem) {
        newItems[index].itemName = selectedItem.itemName
        newItems[index].uom = selectedItem.uom
      }
    }
    
    setFormData({ ...formData, items: newItems })
  }

  const columns = [
    { accessorKey: "bomCode", header: "BOM Code" },
    { accessorKey: "productName", header: "Product Name" },
    { 
      accessorKey: "items", 
      header: "Components",
      cell: ({ row }) => `${row.original.items?.length || 0} items`
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            setSelectedId(row.original.id)
            handleDelete()
          }}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredData = data.filter(item =>
    item.bomCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="Bill of Materials (BOM)">
      <ActionBar
        onNew={handleNew}
        onSave={view === "form" ? handleSave : undefined}
        onQuery={() => setView("list")}
        onDelete={selectedId && view === "form" ? handleDelete : undefined}
      />

      {view === "list" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>BOM List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={handleNew}>
                  <Plus className="w-4 h-4 mr-2" />Add New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredData} onRowClick={handleEdit} />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? "Edit BOM" : "New BOM"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="BOM Code"
                value={formData.bomCode}
                onChange={(e) => setFormData({ ...formData, bomCode: e.target.value })}
                required
              />
              <Input
                label="Product Name"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Components</h3>
                <Button size="sm" onClick={addBomLine}>
                  <PlusCircle className="w-4 h-4 mr-2" />Add Component
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.items?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Select
                        label={index === 0 ? "Item" : undefined}
                        value={item.itemId}
                        onChange={(e) => updateBomLine(index, "itemId", e.target.value)}
                        options={[
                          { value: "", label: "Select Item" },
                          ...items.map(i => ({ value: i.id, label: i.itemName }))
                        ]}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        label={index === 0 ? "Quantity" : undefined}
                        type="number"
                        step="0.01"
                        value={item.qty}
                        onChange={(e) => updateBomLine(index, "qty", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        label={index === 0 ? "UOM" : undefined}
                        value={item.uom}
                        onChange={(e) => updateBomLine(index, "uom", e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 pb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBomLine(index)}
                        disabled={formData.items.length === 1}
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}

export default BOM
