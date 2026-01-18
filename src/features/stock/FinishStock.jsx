'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { DataTable } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { exportToCSV, exportToExcel, printTable } from "@/utils/exportUtils"
import { Search, Plus, Edit, Download, Printer, FileSpreadsheet, RefreshCw } from "lucide-react"
import { formatMoney } from "@/lib/formatters"

const defaultValues = { skuCode: "", itemName: "", color: "", width: "", gsm: "", stockQty: 0, uom: "MTR", rate: 0, location: "" }

export function FinishStock() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("list")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(defaultValues)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ color: "", location: "" })

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.finishStock.getAll()
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load finish stock" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleNew = () => { setFormData(defaultValues); setSelectedId(null); setView("form") }
  const handleEdit = (row) => { setFormData(row); setSelectedId(row.id); setView("form") }

  const handleSave = async () => {
    if (!formData.skuCode || !formData.itemName) {
      addToast({ type: "error", message: "SKU Code and Item Name are required" })
      return
    }
    const calculatedData = { ...formData, value: formData.stockQty * formData.rate }
    setLoading(true)
    try {
      if (selectedId) {
        await api.finishStock.update(selectedId, calculatedData)
        addToast({ type: "success", message: "Stock updated successfully" })
      } else {
        await api.finishStock.create(calculatedData)
        addToast({ type: "success", message: "Stock created successfully" })
      }
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save stock" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId || !window.confirm("Delete this stock entry?")) return
    setLoading(true)
    try {
      await api.finishStock.delete(selectedId)
      addToast({ type: "success", message: "Stock deleted" })
      setView("list")
      loadData()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete" })
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "skuCode", header: "SKU Code", enableSorting: true },
    { accessorKey: "itemName", header: "Item Name", enableSorting: true },
    { accessorKey: "color", header: "Color" },
    { accessorKey: "width", header: "Width" },
    { accessorKey: "gsm", header: "GSM" },
    { accessorKey: "stockQty", header: "Stock Qty", cell: ({ row }) => <span className="font-medium">{row.original.stockQty}</span> },
    { accessorKey: "uom", header: "UOM" },
    { accessorKey: "rate", header: "Rate", cell: ({ row }) => formatMoney(row.original.rate) },
    { accessorKey: "value", header: "Value", cell: ({ row }) => <span className="font-medium">{formatMoney(row.original.value)}</span> },
    { accessorKey: "location", header: "Location" },
    { id: "actions", header: "", cell: ({ row }) => <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}><Edit className="w-4 h-4" /></Button> },
  ]

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val) => String(val || "").toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesColor = !filters.color || item.color?.toLowerCase().includes(filters.color.toLowerCase())
    const matchesLocation = !filters.location || item.location?.toLowerCase().includes(filters.location.toLowerCase())
    return matchesSearch && matchesColor && matchesLocation
  })

  const totalValue = filteredData.reduce((sum, item) => sum + (item.value || 0), 0)
  const totalQty = filteredData.reduce((sum, item) => sum + (item.stockQty || 0), 0)

  return (
    <PageShell title="Finish Stock">
      <ActionBar onNew={handleNew} onSave={view === "form" ? handleSave : undefined} onQuery={() => setView("list")} onDelete={selectedId && view === "form" ? handleDelete : undefined} />
      
      {view === "list" ? (
        <>
          <Card className="mb-4">
            <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Color" value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })} placeholder="Filter by color" />
                <Input label="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="Filter by location" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Finish Stock ({filteredData.length} items)</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-48" /></div>
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredData, columns, "FinishStock")}><Download className="w-4 h-4 mr-1" />CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => exportToExcel(filteredData, columns, "FinishStock")}><FileSpreadsheet className="w-4 h-4 mr-1" />Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => printTable(filteredData, columns, "Finish Stock Report")}><Printer className="w-4 h-4 mr-1" />Print</Button>
                  <Button onClick={handleNew}><Plus className="w-4 h-4 mr-2" />Add New</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
              ) : (
                <>
                  <DataTable columns={columns} data={filteredData} onRowClick={handleEdit} />
                  <div className="mt-4 p-4 bg-muted rounded-lg flex justify-between">
                    <div><span className="text-muted-foreground">Total Qty:</span> <span className="font-semibold ml-2">{totalQty.toLocaleString()}</span></div>
                    <div><span className="text-muted-foreground">Total Value:</span> <span className="font-semibold ml-2">{formatMoney(totalValue)}</span></div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader><CardTitle>{selectedId ? "Edit Finish Stock" : "New Finish Stock Entry"}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="SKU Code" value={formData.skuCode} onChange={(e) => setFormData({ ...formData, skuCode: e.target.value })} placeholder="SKU001" required />
              <Input label="Item Name" value={formData.itemName} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} placeholder="Item Name" required />
              <Input label="Color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="Color" />
              <Input label="Width" value={formData.width} onChange={(e) => setFormData({ ...formData, width: e.target.value })} placeholder="Width" />
              <Input label="GSM" type="number" value={formData.gsm} onChange={(e) => setFormData({ ...formData, gsm: e.target.value })} placeholder="GSM" />
              <Input label="Stock Qty" type="number" value={formData.stockQty} onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })} placeholder="0" />
              <Select label="UOM" value={formData.uom} onChange={(e) => setFormData({ ...formData, uom: e.target.value })} options={[{ value: "MTR", label: "MTR" }, { value: "KG", label: "KG" }, { value: "PCS", label: "PCS" }]} />
              <Input label="Rate" type="number" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })} placeholder="0.00" />
              <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="FS-01" />
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">Calculated Value:</span>
              <span className="font-semibold ml-2">{formatMoney(formData.stockQty * formData.rate)}</span>
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

export default FinishStock
