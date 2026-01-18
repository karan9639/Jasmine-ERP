'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { formatDate, formatCurrency } from "@/lib/formatters"
import { Search, Plus, Edit, Trash2, PlusCircle, X, Printer } from "lucide-react"

const defaultForm = {
  issueNo: "",
  issueDate: new Date().toISOString().split("T")[0],
  department: "",
  issuedTo: "",
  status: "Draft",
  items: [{ itemId: "", itemName: "", qty: 0, uom: "", rate: 0 }],
  remarks: "",
}

export function IssueInventoryItem() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultForm)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [items, setItems] = useState([])
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    loadData()
    loadItems()
    loadEmployees()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.issueInventory.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load issue inventory" })
    } finally {
      setLoading(false)
    }
  }

  const loadItems = async () => {
    const itemList = await api.items.getAll()
    setItems(itemList)
  }

  const loadEmployees = async () => {
    const empList = await api.employees.getAll()
    setEmployees(empList)
  }

  const generateIssueNo = () => {
    const year = new Date().getFullYear()
    const count = data.length + 1
    return `ISS-${year}-${String(count).padStart(3, "0")}`
  }

  const handleNew = () => {
    setFormData({ ...defaultForm, issueNo: generateIssueNo() })
    setSelectedId(null)
    setView("form")
  }

  const handleEdit = (row) => {
    setFormData(row)
    setSelectedId(row.id)
    setView("form")
  }

  const handleSave = async () => {
    if (!formData.department || !formData.issuedTo) {
      addToast({ type: "error", message: "Department and Issued To are required" })
      return
    }

    setLoading(true)
    try {
      if (selectedId) {
        await api.issueInventory.update(selectedId, formData)
        addToast({ type: "success", message: "Issue updated successfully" })
      } else {
        await api.issueInventory.create(formData)
        addToast({ type: "success", message: "Issue created successfully" })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save issue" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this issue?")) return

    setLoading(true)
    try {
      await api.issueInventory.delete(selectedId)
      addToast({ type: "success", message: "Issue deleted successfully" })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete issue" })
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (!selectedId) {
      addToast({ type: "warning", message: "Please save the issue first" })
      return
    }
    window.print()
    addToast({ type: "success", message: "Print dialog opened" })
  }

  const addLine = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: "", itemName: "", qty: 0, uom: "", rate: 0 }]
    })
  }

  const removeLine = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const updateLine = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === "itemId") {
      const selectedItem = items.find(i => i.id === Number(value))
      if (selectedItem) {
        newItems[index].itemName = selectedItem.itemName
        newItems[index].uom = selectedItem.uom
        newItems[index].rate = selectedItem.rate
      }
    }
    
    setFormData({ ...formData, items: newItems })
  }

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.qty * item.rate), 0)

  const columns = [
    { accessorKey: "issueNo", header: "Issue No." },
    { accessorKey: "issueDate", header: "Date", cell: ({ row }) => formatDate(row.original.issueDate) },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "issuedTo", header: "Issued To" },
    { accessorKey: "items", header: "Items", cell: ({ row }) => `${row.original.items?.length || 0} items` },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === "Issued" ? "success" : status === "Partial" ? "warning" : "default"
        return <Badge variant={variant}>{status}</Badge>
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredData = data.filter(item =>
    item.issueNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="Issue Inventory - Item Wise">
      <ActionBar
        onNew={handleNew}
        onSave={view === "form" ? handleSave : undefined}
        onQuery={() => setView("list")}
        onDelete={selectedId && view === "form" ? handleDelete : undefined}
        onPrint={view === "form" ? handlePrint : undefined}
      />

      {view === "list" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Issue Inventory List</CardTitle>
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
                  <Plus className="w-4 h-4 mr-2" />New Issue
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
            <CardTitle>{selectedId ? "Edit Issue" : "New Issue"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                label="Issue No."
                value={formData.issueNo}
                onChange={(e) => setFormData({ ...formData, issueNo: e.target.value })}
                disabled
              />
              <Input
                label="Issue Date"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={[
                  { value: "", label: "Select Department" },
                  { value: "Production", label: "Production" },
                  { value: "Dyeing", label: "Dyeing" },
                  { value: "Weaving", label: "Weaving" },
                  { value: "Finishing", label: "Finishing" },
                  { value: "Maintenance", label: "Maintenance" },
                ]}
                required
              />
              <Select
                label="Issued To"
                value={formData.issuedTo}
                onChange={(e) => setFormData({ ...formData, issuedTo: e.target.value })}
                options={[
                  { value: "", label: "Select Employee" },
                  ...employees.map(e => ({ value: e.empName, label: e.empName }))
                ]}
                required
              />
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Issue Items</h3>
                <Button size="sm" onClick={addLine}>
                  <PlusCircle className="w-4 h-4 mr-2" />Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.items?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Select
                        label={index === 0 ? "Item" : undefined}
                        value={item.itemId}
                        onChange={(e) => updateLine(index, "itemId", e.target.value)}
                        options={[
                          { value: "", label: "Select Item" },
                          ...items.map(i => ({ value: i.id, label: i.itemName }))
                        ]}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={index === 0 ? "Qty" : undefined}
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateLine(index, "qty", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={index === 0 ? "UOM" : undefined}
                        value={item.uom}
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={index === 0 ? "Rate" : undefined}
                        type="number"
                        value={item.rate}
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label={index === 0 ? "Amount" : undefined}
                        value={formatCurrency(item.qty * item.rate)}
                        disabled
                      />
                    </div>
                    <div className="col-span-1 pb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLine(index)}
                        disabled={formData.items.length === 1}
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Total Amount: </span>
                  <span className="text-lg font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
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

export default IssueInventoryItem
