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
import { formatDate, formatCurrency } from "@/lib/formatters"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

const defaultForm = {
  customerId: "",
  customerName: "",
  itemId: "",
  itemName: "",
  rate: 0,
  effectiveFrom: "",
  effectiveTo: "",
}

export function PriceMaster() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultForm)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    loadData()
    loadCustomers()
    loadItems()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.priceMaster.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load price master" })
    } finally {
      setLoading(false)
    }
  }

  const loadCustomers = async () => {
    const custList = await api.customers.getAll()
    setCustomers(custList)
  }

  const loadItems = async () => {
    const itemList = await api.items.getAll()
    setItems(itemList)
  }

  const handleNew = () => {
    setFormData(defaultForm)
    setSelectedId(null)
    setView("form")
  }

  const handleEdit = (row) => {
    setFormData(row)
    setSelectedId(row.id)
    setView("form")
  }

  const handleSave = async () => {
    if (!formData.customerId || !formData.itemId || !formData.rate) {
      addToast({ type: "error", message: "Customer, Item and Rate are required" })
      return
    }

    setLoading(true)
    try {
      if (selectedId) {
        await api.priceMaster.update(selectedId, formData)
        addToast({ type: "success", message: "Price updated successfully" })
      } else {
        await api.priceMaster.create(formData)
        addToast({ type: "success", message: "Price created successfully" })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save price" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this price?")) return

    setLoading(true)
    try {
      await api.priceMaster.delete(selectedId)
      addToast({ type: "success", message: "Price deleted successfully" })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete price" })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerChange = (e) => {
    const customerId = e.target.value
    const customer = customers.find(c => c.id === Number(customerId))
    setFormData({
      ...formData,
      customerId: Number(customerId),
      customerName: customer?.customerName || ""
    })
  }

  const handleItemChange = (e) => {
    const itemId = e.target.value
    const item = items.find(i => i.id === Number(itemId))
    setFormData({
      ...formData,
      itemId: Number(itemId),
      itemName: item?.itemName || "",
      rate: item?.rate || 0
    })
  }

  const columns = [
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "itemName", header: "Item" },
    { accessorKey: "rate", header: "Rate", cell: ({ row }) => formatCurrency(row.original.rate) },
    { accessorKey: "effectiveFrom", header: "Effective From", cell: ({ row }) => formatDate(row.original.effectiveFrom) },
    { accessorKey: "effectiveTo", header: "Effective To", cell: ({ row }) => formatDate(row.original.effectiveTo) },
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
    item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="Price Master">
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
              <CardTitle>Price Master List</CardTitle>
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
            <CardTitle>{selectedId ? "Edit Price" : "New Price"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Customer"
                value={formData.customerId}
                onChange={handleCustomerChange}
                options={[
                  { value: "", label: "Select Customer" },
                  ...customers.map(c => ({ value: c.id, label: c.customerName }))
                ]}
                required
              />
              <Select
                label="Item"
                value={formData.itemId}
                onChange={handleItemChange}
                options={[
                  { value: "", label: "Select Item" },
                  ...items.map(i => ({ value: i.id, label: i.itemName }))
                ]}
                required
              />
              <Input
                label="Rate"
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                required
              />
              <Input
                label="Effective From"
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
              />
              <Input
                label="Effective To"
                type="date"
                value={formData.effectiveTo}
                onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
              />
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

export default PriceMaster
