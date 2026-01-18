'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { formatDate } from "@/lib/formatters"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

const defaultForm = {
  npdCode: "",
  productName: "",
  category: "",
  description: "",
  targetDate: "",
  status: "Draft",
  assignedTo: "",
  remarks: "",
}

export function NPD() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultForm)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    loadData()
    loadEmployees()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Using a custom key for NPD data
      const stored = localStorage.getItem("jasmine_erp_npd")
      setData(stored ? JSON.parse(stored) : [
        { id: 1, npdCode: "NPD-2024-001", productName: "Eco-Friendly Cotton Blend", category: "Fabric", description: "Sustainable cotton blend fabric", targetDate: "2024-06-30", status: "In Progress", assignedTo: "Rajesh Kumar", remarks: "Sample approved" },
        { id: 2, npdCode: "NPD-2024-002", productName: "Quick-Dry Polyester", category: "Fabric", description: "Sports performance fabric", targetDate: "2024-08-15", status: "Draft", assignedTo: "Priya Sharma", remarks: "" },
      ])
    } catch (error) {
      addToast({ type: "error", message: "Failed to load NPD data" })
    } finally {
      setLoading(false)
    }
  }

  const loadEmployees = async () => {
    const empList = await api.employees.getAll()
    setEmployees(empList)
  }

  const saveData = (newData) => {
    localStorage.setItem("jasmine_erp_npd", JSON.stringify(newData))
    setData(newData)
  }

  const handleNew = () => {
    setFormData({ ...defaultForm, npdCode: `NPD-${new Date().getFullYear()}-${String(data.length + 1).padStart(3, "0")}` })
    setSelectedId(null)
    setView("form")
  }

  const handleEdit = (row) => {
    setFormData(row)
    setSelectedId(row.id)
    setView("form")
  }

  const handleSave = async () => {
    if (!formData.npdCode || !formData.productName) {
      addToast({ type: "error", message: "NPD Code and Product Name are required" })
      return
    }

    setLoading(true)
    try {
      if (selectedId) {
        const newData = data.map(d => d.id === selectedId ? { ...formData, updatedAt: new Date().toISOString() } : d)
        saveData(newData)
        addToast({ type: "success", message: "NPD updated successfully" })
      } else {
        const newData = [...data, { ...formData, id: Date.now(), createdAt: new Date().toISOString() }]
        saveData(newData)
        addToast({ type: "success", message: "NPD created successfully" })
      }
      setView("list")
    } catch (error) {
      addToast({ type: "error", message: "Failed to save NPD" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this NPD?")) return

    setLoading(true)
    try {
      const newData = data.filter(d => d.id !== selectedId)
      saveData(newData)
      addToast({ type: "success", message: "NPD deleted successfully" })
      setView("list")
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete NPD" })
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "npdCode", header: "NPD Code" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "targetDate", header: "Target Date", cell: ({ row }) => formatDate(row.original.targetDate) },
    { accessorKey: "assignedTo", header: "Assigned To" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === "Completed" ? "success" : status === "In Progress" ? "warning" : "default"
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
    item.npdCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="New Product Development (NPD)">
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
              <CardTitle>NPD List</CardTitle>
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
            <CardTitle>{selectedId ? "Edit NPD" : "New NPD"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="NPD Code"
                value={formData.npdCode}
                onChange={(e) => setFormData({ ...formData, npdCode: e.target.value })}
                required
              />
              <Input
                label="Product Name"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: "", label: "Select Category" },
                  { value: "Fabric", label: "Fabric" },
                  { value: "Yarn", label: "Yarn" },
                  { value: "Accessories", label: "Accessories" },
                  { value: "Other", label: "Other" },
                ]}
              />
              <Input
                label="Target Date"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: "Draft", label: "Draft" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Testing", label: "Testing" },
                  { value: "Approved", label: "Approved" },
                  { value: "Completed", label: "Completed" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
              />
              <Select
                label="Assigned To"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                options={[
                  { value: "", label: "Select Employee" },
                  ...employees.map(e => ({ value: e.empName, label: e.empName }))
                ]}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Textarea
                  label="Remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={2}
                />
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

export default NPD
