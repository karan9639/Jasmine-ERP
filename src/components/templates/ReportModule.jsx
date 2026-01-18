'use client';

import { useState, useEffect, useCallback } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { exportToCSV, exportToExcel, printTable } from "@/utils/exportUtils"
import { Search, Download, Printer, FileSpreadsheet, RefreshCw } from "lucide-react"

export function ReportModule({
  title,
  columns,
  filters = [],
  dataLoader,
  exportFileName,
}) {
  const { addToast } = useAppStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterValues, setFilterValues] = useState({})
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await dataLoader(filterValues)
      setData(result || [])
    } catch (error) {
      addToast({ type: "error", message: "Failed to load report data" })
      setData([])
    } finally {
      setLoading(false)
    }
  }, [dataLoader, filterValues, addToast])

  useEffect(() => {
    loadData()
  }, [])

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleExecute = () => {
    loadData()
  }

  const handleExportCSV = () => {
    if (data.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToCSV(data, columns, exportFileName || title)
    addToast({ type: "success", message: "Exported to CSV" })
  }

  const handleExportExcel = () => {
    if (data.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToExcel(data, columns, exportFileName || title)
    addToast({ type: "success", message: "Exported to Excel" })
  }

  const handlePrint = () => {
    if (data.length === 0) {
      addToast({ type: "warning", message: "No data to print" })
      return
    }
    printTable(data, columns, title)
  }

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <PageShell title={title}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.name}>
                {filter.type === "select" ? (
                  <Select
                    label={filter.label}
                    value={filterValues[filter.name] || ""}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                    options={filter.options}
                  />
                ) : (
                  <Input
                    label={filter.label}
                    type={filter.type || "text"}
                    value={filterValues[filter.name] || ""}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                    placeholder={filter.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleExecute} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Execute
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Data ({filteredData.length} records)</CardTitle>
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
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data found. Try adjusting filters and clicking Execute.
            </div>
          ) : (
            <DataTable columns={columns} data={filteredData} />
          )}
        </CardContent>
      </Card>
    </PageShell>
  )
}
