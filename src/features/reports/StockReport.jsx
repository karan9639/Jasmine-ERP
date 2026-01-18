'use client';

import { useState, useEffect } from "react"
import { Search, Download, Printer, FileSpreadsheet } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { DataTable } from "@/components/ui/Table"
import { exportToCSV, exportToExcel, printTable } from "@/utils/exportUtils"
import { formatDate, formatMoney } from "@/lib/formatters"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"

export function StockReport() {
  const { addToast } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    itemType: "",
    category: "",
    fromDate: "",
    toDate: "",
    warehouse: "",
  })

  const [reportData, setReportData] = useState([])

  useEffect(() => {
    loadReport()
  }, [])

  const loadReport = async () => {
    setLoading(true)
    try {
      const data = await api.stock.getAll()
      setReportData(data)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load stock report" })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadReport()
    addToast({ type: "info", message: "Report refreshed" })
  }

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToCSV(reportData, `stock-report-${formatDate(new Date(), "YYYY-MM-DD")}.csv`)
    addToast({ type: "success", message: "CSV exported successfully" })
  }

  const handleExportExcel = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToExcel(reportData, `stock-report-${formatDate(new Date(), "YYYY-MM-DD")}.xlsx`, "Stock Report")
    addToast({ type: "success", message: "Excel exported successfully" })
  }

  const handlePrint = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to print" })
      return
    }
    printTable("Stock Report", reportData, columns)
  }

  const columns = [
    { accessorKey: "itemCode", header: "Item Code", enableSorting: true },
    { accessorKey: "itemName", header: "Item Name", enableSorting: true },
    { accessorKey: "category", header: "Category", enableSorting: true },
    { accessorKey: "uom", header: "UOM" },
    { 
      accessorKey: "openingStock", 
      header: "Opening", 
      enableSorting: true,
      cell: ({ row }) => <span className="text-right block">{row.original.openingStock?.toFixed(2)}</span>
    },
    { 
      accessorKey: "received", 
      header: "Received", 
      enableSorting: true,
      cell: ({ row }) => <span className="text-right block text-green-600">{row.original.received?.toFixed(2)}</span>
    },
    { 
      accessorKey: "issued", 
      header: "Issued", 
      enableSorting: true,
      cell: ({ row }) => <span className="text-right block text-red-600">{row.original.issued?.toFixed(2)}</span>
    },
    { 
      accessorKey: "closingStock", 
      header: "Closing", 
      enableSorting: true,
      cell: ({ row }) => <span className="text-right block font-semibold">{row.original.closingStock?.toFixed(2)}</span>
    },
    { 
      accessorKey: "rate", 
      header: "Rate", 
      enableSorting: true,
      cell: ({ row }) => <span className="text-right block">{formatMoney(row.original.rate)}</span>
    },
    { 
      accessorKey: "value", 
      header: "Value", 
      enableSorting: true,
      cell: ({ row }) => <span className="text-right block font-semibold">{formatMoney(row.original.value)}</span>
    },
  ]

  const totals = reportData.reduce(
    (acc, row) => ({
      openingStock: acc.openingStock + (row.openingStock || 0),
      received: acc.received + (row.received || 0),
      issued: acc.issued + (row.issued || 0),
      closingStock: acc.closingStock + (row.closingStock || 0),
      value: acc.value + (row.value || 0),
    }),
    { openingStock: 0, received: 0, issued: 0, closingStock: 0, value: 0 }
  )

  const actions = [
    { label: "Search", icon: Search, onClick: handleSearch, variant: "primary" },
    { label: "CSV", icon: Download, onClick: handleExportCSV },
    { label: "Excel", icon: FileSpreadsheet, onClick: handleExportExcel },
    { label: "Print", icon: Printer, onClick: handlePrint },
  ]

  return (
    <PageShell title="Stock Report">
      <ActionBar actions={actions} />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select
                label="Item Type"
                value={filters.itemType}
                onChange={(e) => setFilters({ ...filters, itemType: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "Raw Material", label: "Raw Material" },
                  { value: "Semi Finished", label: "Semi Finished" },
                  { value: "Finished Goods", label: "Finished Goods" },
                ]}
              />
              <Input
                label="Category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                placeholder="Enter category"
              />
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
                label="Warehouse"
                value={filters.warehouse}
                onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "WH001", label: "Main Warehouse" },
                  { value: "WH002", label: "Factory Warehouse" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <DataTable columns={columns} data={reportData} />

                {reportData.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-muted-foreground">Total Opening</div>
                        <div className="font-semibold">{totals.openingStock.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600">Total Received</div>
                        <div className="font-semibold text-green-700">{totals.received.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-red-600">Total Issued</div>
                        <div className="font-semibold text-red-700">{totals.issued.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600">Total Closing</div>
                        <div className="font-semibold text-blue-700">{totals.closingStock.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <div className="text-primary">Total Value</div>
                        <div className="font-semibold">{formatMoney(totals.value)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default StockReport
