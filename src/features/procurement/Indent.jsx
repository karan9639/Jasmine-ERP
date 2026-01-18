"use client"

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
import { Trash2, Plus, Search, Edit, PlusCircle, X } from "lucide-react"
import { formatDate } from "@/lib/formatters"

const defaultForm = {
  indentNo: "",
  indentDate: new Date().toISOString().split("T")[0],
  department: "",
  requestedBy: "",
  priority: "Normal",
  status: "Pending",
  remarks: "",
}

const defaultLine = { itemId: "", itemName: "", qty: 0, uom: "KG", requiredDate: "", purpose: "" }

export function Indent() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("form")
  const [indents, setIndents] = useState([])
  const [items, setItems] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState(defaultForm)
  const [lines, setLines] = useState([{ ...defaultLine }])

  useEffect(() => {
    loadItems()
    loadEmployees()
    if (view === "list") loadIndents()
  }, [view])

  const loadIndents = async () => {
    setLoading(true)
    try {
      const data = await api.indents.getAll()
      setIndents(data)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load indents" })
    } finally {
      setLoading(false)
    }
  }

  const loadItems = async () => {
    const data = await api.items.getAll()
    setItems(data)
  }

  const loadEmployees = async () => {
    const data = await api.employees.getAll()
    setEmployees(data)
  }

  const generateIndentNo = () => {
    const year = new Date().getFullYear()
    const count = indents.length + 1
    return `IND-${year}-${String(count).padStart(3, "0")}`
  }

  const handleNew = () => {
    const indentNo = generateIndentNo()
    setFormData({ ...defaultForm, indentNo })
    setLines([{ ...defaultLine }])
    setSelectedId(null)
    setView("form")
    addToast({ type: "info", message: "New indent form initialized" })
  }

  const handleSave = async () => {
    if (!formData.department || !formData.requestedBy) {
      addToast({ type: "error", message: "Department and Requested By are required" })
      return
    }

    if (lines.every(l => !l.itemName && l.qty === 0)) {
      addToast({ type: "error", message: "Please add at least one item" })
      return
    }

    setLoading(true)
    try {
      const indentData = {
        ...formData,
        items: lines.filter(l => l.itemName && l.qty > 0),
      }

      if (selectedId) {
        await api.indents.update(selectedId, indentData)
        addToast({ type: "success", message: "Indent updated successfully" })
      } else {
        await api.indents.create(indentData)
        addToast({ type: "success", message: "Indent created successfully" })
      }
      handleNew()
      loadIndents()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save indent" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this indent?")) return

    setLoading(true)
    try {
      await api.indents.delete(selectedId)
      addToast({ type: "success", message: "Indent deleted successfully" })
      handleNew()
      loadIndents()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete indent" })
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (row) => {
    setSelectedId(row.id)
    setFormData({
      indentNo: row.indentNo,
      indentDate: row.indentDate,
      department: row.department,
      requestedBy: row.requestedBy,
      priority: row.priority || "Normal",
      status: row.status,
      remarks: row.remarks || "",
    })
    setLines(row.items?.length > 0 ? row.items : [{ ...defaultLine }])
    setView("form")
  }

  const addLine = () => {
    setLines([...lines, { ...defaultLine }])
  }

  const removeLine = (index) => {
    if (lines.length === 1) {
      addToast({ type: "warning", message: "At least one line is required" })
      return
    }
    setLines(lines.filter((_, i) => i !== index))
  }

  const updateLine = (index, field, value) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }
    
    if (field === "itemId") {
      const selectedItem = items.find(i => i.id === Number(value))
      if (selectedItem) {
        newLines[index].itemName = selectedItem.itemName
        newLines[index].uom = selectedItem.uom
      }
    }
    
    setLines(newLines)
  }

  const listColumns = [
    { accessorKey: "indentNo", header: "Indent No." },
    { accessorKey: "indentDate", header: "Date", cell: ({ row }) => formatDate(row.original.indentDate) },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "requestedBy", header: "Requested By" },
    { accessorKey: "items", header: "Items", cell: ({ row }) => `${row.original.items?.length || 0} items` },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === "Approved" ? "success" : status === "Pending" ? "warning" : "default"
        return <Badge variant={variant}>{status}</Badge>
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => handleRowClick(row.original)}>
          <Edit className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  const filteredIndents = indents.filter(indent =>
    indent.indentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="Material Indent">
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
              <CardTitle>Indents List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search indents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={handleNew}>
                  <Plus className="w-4 h-4 mr-2" />New Indent
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
              <DataTable columns={listColumns} data={filteredIndents} onRowClick={handleRowClick} />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? "Edit Indent" : "New Indent"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Indent No."
                value={formData.indentNo}
                disabled
                placeholder="Auto-generated"
              />
              <Input
                label="Indent Date"
                type="date"
                value={formData.indentDate}
                onChange={(e) => setFormData({ ...formData, indentDate: e.target.value })}
                required
              />
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={[
                  { value: "", label: "Select Department" },
                  { value: "Production", label: "Production" },
                  { value: "Dyeing", label: "Dyeing" },
                  { value: "Lamination", label: "Lamination" },
                  { value: "Weaving", label: "Weaving" },
                  { value: "Maintenance", label: "Maintenance" },
                ]}
                required
              />
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                options={[
                  { value: "Normal", label: "Normal" },
                  { value: "Urgent", label: "Urgent" },
                  { value: "Critical", label: "Critical" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Requested By"
                value={formData.requestedBy}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                options={[
                  { value: "", label: "Select Employee" },
                  ...employees.map(e => ({ value: e.empName, label: e.empName }))
                ]}
                required
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                  { value: "Closed", label: "Closed" },
                ]}
              />
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Indent Items</h3>
                <Button size="sm" onClick={addLine}>
                  <PlusCircle className="w-4 h-4 mr-2" />Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {lines.map((line, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <Select
                        label={index === 0 ? "Item" : undefined}
                        value={line.itemId}
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
                        value={line.qty}
                        onChange={(e) => updateLine(index, "qty", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label={index === 0 ? "UOM" : undefined}
                        value={line.uom}
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={index === 0 ? "Required Date" : undefined}
                        type="date"
                        value={line.requiredDate}
                        onChange={(e) => updateLine(index, "requiredDate", e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        label={index === 0 ? "Purpose" : undefined}
                        value={line.purpose}
                        onChange={(e) => updateLine(index, "purpose", e.target.value)}
                        placeholder="Purpose"
                      />
                    </div>
                    <div className="col-span-1 pb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLine(index)}
                        disabled={lines.length === 1}
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              label="Remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Enter any remarks"
              rows={3}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Indent"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}

export default Indent
