'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import { DataTable } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { Search, Plus, Edit } from "lucide-react"

const defaultValues = { brandCode: "", brandName: "", description: "", active: true }

export function Brand() {
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
      const result = await api.brands.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load brands" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleNew = () => { setFormData(defaultValues); setSelectedId(null); setView("form") }
  const handleEdit = (row) => { setFormData(row); setSelectedId(row.id); setView("form") }

  const handleSave = async () => {
    if (!formData.brandCode || !formData.brandName) {
      addToast({ type: "error", message: "Brand Code and Name are required" })
      return
    }
    setLoading(true)
    try {
      if (selectedId) {
        await api.brands.update(selectedId, formData)
        addToast({ type: "success", message: "Brand updated successfully" })
      } else {
        await api.brands.create(formData)
        addToast({ type: "success", message: "Brand created successfully" })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save brand" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId || !window.confirm("Delete this brand?")) return
    setLoading(true)
    try {
      await api.brands.delete(selectedId)
      addToast({ type: "success", message: "Brand deleted" })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete" })
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "brandCode", header: "Code", enableSorting: true },
    { accessorKey: "brandName", header: "Name", enableSorting: true },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "active", header: "Active", cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs ${row.original.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{row.original.active ? "Yes" : "No"}</span> },
    { id: "actions", header: "Actions", cell: ({ row }) => <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}><Edit className="w-4 h-4" /></Button> },
  ]

  const filteredData = data.filter((item) => Object.values(item).some((val) => String(val || "").toLowerCase().includes(searchTerm.toLowerCase())))

  return (
    <PageShell title="Brand Master">
      <ActionBar onNew={handleNew} onSave={view === "form" ? handleSave : undefined} onQuery={() => setView("list")} onDelete={selectedId && view === "form" ? handleDelete : undefined} />
      {view === "list" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Brand List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64" /></div>
                <Button onClick={handleNew}><Plus className="w-4 h-4 mr-2" />Add New</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div> : <DataTable columns={columns} data={filteredData} onRowClick={handleEdit} />}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>{selectedId ? "Edit Brand" : "New Brand"}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Brand Code" value={formData.brandCode} onChange={(e) => setFormData({ ...formData, brandCode: e.target.value })} placeholder="BRD001" required />
              <Input label="Brand Name" value={formData.brandName} onChange={(e) => setFormData({ ...formData, brandName: e.target.value })} placeholder="Brand Name" required />
              <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" className="md:col-span-2" />
              <Checkbox label="Active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
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

export default Brand
