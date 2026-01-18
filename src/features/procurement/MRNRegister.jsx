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
  { accessorKey: "mrnNo", header: "MRN No." },
  { accessorKey: "mrnDate", header: "MRN Date", cell: ({ row }) => formatDate(row.original.mrnDate) },
  { accessorKey: "vendorName", header: "Vendor" },
  { accessorKey: "poNo", header: "PO No." },
  { accessorKey: "challanNo", header: "Challan No." },
  { accessorKey: "itemName", header: "Item", cell: ({ row }) => row.original.items?.[0]?.itemName || "" },
  { accessorKey: "receivedQty", header: "Received Qty", cell: ({ row }) => row.original.items?.[0]?.receivedQty || 0 },
  { accessorKey: "rate", header: "Rate", cell: ({ row }) => formatCurrency(row.original.items?.[0]?.rate || 0) },
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => {
    const item = row.original.items?.[0]
    return formatCurrency((item?.receivedQty || 0) * (item?.rate || 0))
  }},
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

export function MRNRegister() {
  const { addToast } = useAppStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    vendorId: "",
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
      const mrnList = await api.mrns.getAll()
      setData(mrnList)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load MRN register" })
    } finally {
      setLoading(false)
    }
  }

  const filteredData = data.filter(item => {
    if (filters.vendorId && item.vendorId !== Number(filters.vendorId)) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        item.mrnNo?.toLowerCase().includes(search) ||
        item.vendorName?.toLowerCase().includes(search) ||
        item.poNo?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const totalAmount = filteredData.reduce((sum, item) => {
    const qty = item.items?.[0]?.receivedQty || 0
    const rate = item.items?.[0]?.rate || 0
    return sum + (qty * rate)
  }, 0)

  const handleExportCSV = () => {
    exportToCSV(filteredData, columns, "MRN_Register")
    addToast({ type: "success", message: "Exported to CSV" })
  }

  const handleExportExcel = () => {
    exportToExcel(filteredData, columns, "MRN_Register")
    addToast({ type: "success", message: "Exported to Excel" })
  }

  const handlePrint = () => {
    printTable(filteredData, columns, "MRN Register")
  }

  return (
    <PageShell title="MRN Register">
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
            <div>
              <CardTitle>MRN Register ({filteredData.length} records)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Total Amount: {formatCurrency(totalAmount)}</p>
            </div>
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

export default MRNRegister
