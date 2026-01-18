'use client';

import { useState, useEffect, useCallback } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"

export function CrudModule({
  title,
  columns,
  formFields,
  defaultValues,
  apiService,
  searchFields = ["name", "code"],
}) {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultValues)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await apiService.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: `Failed to load ${title.toLowerCase()}` })
    } finally {
      setLoading(false)
    }
  }, [apiService, addToast, title])

  useEffect(() => {
    loadData()
  }, [loadData])

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
    setLoading(true)
    try {
      if (selectedId) {
        await apiService.update(selectedId, formData)
        addToast({ type: "success", message: `${title} updated successfully` })
      } else {
        await apiService.create(formData)
        addToast({ type: "success", message: `${title} created successfully` })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: `Failed to save ${title.toLowerCase()}` })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return

    setLoading(true)
    try {
      await apiService.delete(selectedId)
      addToast({ type: "success", message: `${title} deleted successfully` })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: `Failed to delete ${title.toLowerCase()}` })
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const filteredData = data.filter((item) =>
    searchFields.some((field) =>
      String(item[field] || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const tableColumns = [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedId(row.original.id)
              handleDelete()
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <PageShell title={title}>
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
              <CardTitle>{title} List</CardTitle>
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
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
              <DataTable
                columns={tableColumns}
                data={filteredData}
                onRowClick={handleEdit}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? `Edit ${title}` : `New ${title}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields.map((field) => (
                <div key={field.name} className={field.fullWidth ? "md:col-span-2 lg:col-span-3" : ""}>
                  <Input
                    label={field.label}
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={field.disabled}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setView("list")}>
                Cancel
              </Button>
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
