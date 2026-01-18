'use client';

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"
import { exportToCSV, exportToExcel, printTable } from "@/utils/exportUtils"
import { formatDate, formatCurrency } from "@/lib/formatters"
import { Search, Download, Printer, FileSpreadsheet, RefreshCw } from "lucide-react"

const columns = [
  { accessorKey: "poNo", header: "PO No." },
  { accessorKey: "poDate", header: "PO Date", cell: ({ row }) => formatDate(row.original.poDate) },
  { accessorKey: "vendorName", header: "Vendor" },
  { accessorKey: "itemName", header: "Item" },
  { accessorKey: "orderedQty", header: "Ordered Qty", cell: ({ row }) => row.original.items?.[0]?.qty || 0 },
  { accessorKey: "receivedQty", header: "Received Qty" },
  { accessorKey: "pendingQty", header: "Pending Qty" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const variant = status === "Completed" ? "success" : status === "Partial" ? "warning" : "default"
      return <Badge variant={variant}>{status}</Badge>
    }
  },
]

export function SupplyStatus() {
  const { addToast } = useAppStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    vendorId: "",
    status: "",
  })
  const [vendors, setVendors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadVendors()
    loadData()
  }, [])

  const loadVendors = async () => {
    const vendorList = await api.vendors.getAll()
    setVendors(vendorList)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const poList = await api.purchaseOrders.getAll()
      const mrnList = await api.mrns.getAll()
      
      const supplyData = poList.map(po => {
        const relatedMrns = mrnList.filter(m => m.poNo === po.poNo)
        const receivedQty = relatedMrns.reduce((sum, m) => {
          return sum + (m.items?.[0]?.receivedQty || 0)
        }, 0)
        const orderedQty = po.items?.[0]?.qty || 0
        
        return {
          ...po,
          orderedQty,
          receivedQty,
          pendingQty: Math.max(0, orderedQty - receivedQty),
          itemName: po.items?.[0]?.itemName || "",
        }
      })
      
      setData(supplyData)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load supply status" })
    } finally {
      setLoading(false)
    }
  }

  const filteredData = data.filter(item => {
    if (filters.vendorId && item.vendorId !== Number(filters.vendorId)) return false
    if (filters.status && item.status !== filters.status) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        item.poNo?.toLowerCase().includes(search) ||
        item.vendorName?.toLowerCase().includes(search) ||
        item.itemName?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const handleExportCSV = () => {
    exportToCSV(filteredData, columns, "Supply_Status")
    addToast({ type: "success", message: "Exported to CSV" })
  }

  const handleExportExcel = () => {
    exportToExcel(filteredData, columns, "Supply_Status")
    addToast({ type: "success", message: "Exported to Excel" })
  }

  const handlePrint = () => {
    printTable(filteredData, columns, "Supply Status Report")
  }

  return (
    <PageShell title="Supply Status">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="From Date"
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
            <Input
              label="To Date"
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
            <Select
              label="Vendor"
              value={filters.vendorId}
              onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
              options={[
                { value: "", label: "All Vendors" },
                ...vendors.map(v => ({ value: v.id, label: v.vendorName }))
              ]}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: "", label: "All Status" },
                { value: "Open", label: "Open" },
                { value: "Partial", label: "Partial" },
                { value: "Completed", label: "Completed" },
              ]}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={loadData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Execute
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Supply Status ({filteredData.length} records)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-1" />CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-1" />Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" />Print
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
            <DataTable columns={columns} data={filteredData} />
          )}
        </CardContent>
      </Card>
    </PageShell>
  )
}

export default SupplyStatus
