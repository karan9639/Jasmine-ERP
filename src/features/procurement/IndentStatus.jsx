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
import { Search, Download, Printer, FileSpreadsheet, RefreshCw } from "lucide-react"
import { formatDate } from "@/lib/formatters"

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Closed", label: "Closed" },
]

export function IndentStatus() {
  const { addToast } = useAppStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", status: "", department: "" })
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.indents.getAll(filters)
      setData(result)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load indent status" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns = [
    { accessorKey: "indentNo", header: "Indent No", enableSorting: true },
    { accessorKey: "indentDate", header: "Date", cell: ({ row }) => formatDate(row.original.indentDate) },
    { accessorKey: "department", header: "Department", enableSorting: true },
    { accessorKey: "requestedBy", header: "Requested By" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Approved" ? "success" : row.original.status === "Rejected" ? "destructive" : "warning"}>
          {row.original.status}
        </Badge>
      )
    },
    { accessorKey: "remarks", header: "Remarks" },
  ]

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <PageShell title="Indent Status">
      <Card className="mb-4">
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="From Date" type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
            <Input label="To Date" type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
            <Select label="Status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} options={statusOptions} />
            <Input label="Department" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} placeholder="Department" />
          </div>
          <div className="flex justify-end mt-4">
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
            <CardTitle>Indent Status ({filteredData.length} records)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-48" />
              </div>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredData, columns, "IndentStatus")}>
                <Download className="w-4 h-4 mr-1" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportToExcel(filteredData, columns, "IndentStatus")}>
                <FileSpreadsheet className="w-4 h-4 mr-1" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => printTable(filteredData, columns, "Indent Status Report")}>
                <Printer className="w-4 h-4 mr-1" /> Print
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

export default IndentStatus
