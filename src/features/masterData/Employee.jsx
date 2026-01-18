'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox"
import { DataTable } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

const defaultValues = {
  empCode: "",
  empName: "",
  department: "",
  designation: "",
  joinDate: "",
  phone: "",
  email: "",
  address: "",
  active: true,
}

const departmentOptions = [
  { value: "Production", label: "Production" },
  { value: "Dyeing", label: "Dyeing" },
  { value: "Quality", label: "Quality" },
  { value: "Warehouse", label: "Warehouse" },
  { value: "Admin", label: "Admin" },
  { value: "Accounts", label: "Accounts" },
]

export function Employee() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultValues)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.employees.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load employees" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleNew = () => {
    setFormData(defaultValues)
    setSelectedId(null)
    setView("form")
  }

  const handleEdit = (row) => {
    setFormData(row)
    setSelectedId(row.id)
    setView("form")
  }

  const handleSave = async () => {
    if (!formData.empCode || !formData.empName) {
      addToast({ type: "error", message: "Employee Code and Name are required" })
      return
    }
    setLoading(true)
    try {
      if (selectedId) {
        await api.employees.update(selectedId, formData)
        addToast({ type: "success", message: "Employee updated successfully" })
      } else {
        await api.employees.create(formData)
        addToast({ type: "success", message: "Employee created successfully" })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save employee" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this employee?")) return
    setLoading(true)
    try {
      await api.employees.delete(selectedId)
      addToast({ type: "success", message: "Employee deleted successfully" })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete employee" })
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "empCode", header: "Code", enableSorting: true },
    { accessorKey: "empName", header: "Name", enableSorting: true },
    { accessorKey: "department", header: "Department", enableSorting: true },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    { 
      accessorKey: "active", 
      header: "Active",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.original.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.original.active ? "Yes" : "No"}
        </span>
      )
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

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <PageShell title="Employee Master">
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
              <CardTitle>Employee List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64" />
                </div>
                <Button onClick={handleNew}>
                  <Plus className="w-4 h-4 mr-2" /> Add New
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
            <CardTitle>{selectedId ? "Edit Employee" : "New Employee"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Employee Code" value={formData.empCode} onChange={(e) => setFormData({ ...formData, empCode: e.target.value })} placeholder="EMP001" required />
              <Input label="Employee Name" value={formData.empName} onChange={(e) => setFormData({ ...formData, empName: e.target.value })} placeholder="Full Name" required />
              <Select label="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} options={departmentOptions} />
              <Input label="Designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} placeholder="Designation" />
              <Input label="Join Date" type="date" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} />
              <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone Number" />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
              <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" className="md:col-span-2" />
              <div className="flex items-center">
                <Checkbox label="Active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}

export default Employee
