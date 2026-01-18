'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

const defaultForm = {
  taxCode: "",
  taxName: "",
  cgst: 0,
  sgst: 0,
  igst: 0,
  active: true,
}

export function Taxation() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultForm)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.taxation.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load taxation data" })
    } finally {
      setLoading(false)
    }
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
    if (!formData.taxCode || !formData.taxName) {
      addToast({ type: "error", message: "Tax Code and Name are required" })
      return
    }

    setLoading(true)
    try {
      if (selectedId) {
        await api.taxation.update(selectedId, formData)
        addToast({ type: "success", message: "Tax updated successfully" })
      } else {
        await api.taxation.create(formData)
        addToast({ type: "success", message: "Tax created successfully" })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save tax" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this tax?")) return

    setLoading(true)
    try {
      await api.taxation.delete(selectedId)
      addToast({ type: "success", message: "Tax deleted successfully" })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete tax" })
    } finally {
      setLoading(false)
    }
  }

  const handleUndo = () => {
    if (selectedId) {
      const original = data.find(d => d.id === selectedId)
      if (original) setFormData(original)
    } else {
      setFormData(defaultForm)
    }
  }

  const columns = [
    { accessorKey: "taxCode", header: "Tax Code" },
    { accessorKey: "taxName", header: "Tax Name" },
    { accessorKey: "cgst", header: "CGST %", cell: ({ row }) => `${row.original.cgst}%` },
    { accessorKey: "sgst", header: "SGST %", cell: ({ row }) => `${row.original.sgst}%` },
    { accessorKey: "igst", header: "IGST %", cell: ({ row }) => `${row.original.igst}%` },
    { 
      accessorKey: "active", 
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "success" : "secondary"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
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
    item.taxCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="Taxation Master">
      <ActionBar
        onNew={handleNew}
        onSave={view === "form" ? handleSave : undefined}
        onUndo={view === "form" ? handleUndo : undefined}
        onQuery={() => setView("list")}
        onDelete={selectedId && view === "form" ? handleDelete : undefined}
      />

      {view === "list" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Taxation List</CardTitle>
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
            <CardTitle>{selectedId ? "Edit Tax" : "New Tax"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Tax Code"
                value={formData.taxCode}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                required
              />
              <Input
                label="Tax Name"
                value={formData.taxName}
                onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
                required
              />
              <Input
                label="CGST %"
                type="number"
                step="0.01"
                value={formData.cgst}
                onChange={(e) => setFormData({ ...formData, cgst: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="SGST %"
                type="number"
                step="0.01"
                value={formData.sgst}
                onChange={(e) => setFormData({ ...formData, sgst: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="IGST %"
                type="number"
                step="0.01"
                value={formData.igst}
                onChange={(e) => setFormData({ ...formData, igst: parseFloat(e.target.value) || 0 })}
              />
              <div className="flex items-center gap-2 pt-6">
                <Checkbox
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span className="text-sm">Active</span>
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

export default Taxation
