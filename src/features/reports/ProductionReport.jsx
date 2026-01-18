'use client';

import { useState } from "react"
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

export function ProductionReport() {
  const { addToast } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    processType: "",
    fromDate: "",
    toDate: "",
    shift: "",
  })

  const [reportData] = useState([
    {
      id: 1,
      date: "2024-01-15",
      processType: "Warping",
      machineNo: "WM-01",
      operatorName: "John Doe",
      itemCode: "ITEM001",
      itemName: "Cotton Yarn 30s",
      lotNo: "LOT-001",
      targetQty: 1000,
      actualQty: 950,
      rejectedQty: 50,
      efficiency: 95,
      shift: "Day",
    },
    {
      id: 2,
      date: "2024-01-15",
      processType: "Knitting",
      machineNo: "KM-02",
      operatorName: "Jane Smith",
      itemCode: "ITEM002",
      itemName: "Polyester Fabric",
      lotNo: "LOT-002",
      targetQty: 500,
      actualQty: 480,
      rejectedQty: 20,
      efficiency: 96,
      shift: "Night",
    },
  ])

  const columns = [
    { accessorKey: "date", header: "Date", enableSorting: true, cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: "processType", header: "Process", enableSorting: true },
    { accessorKey: "machineNo", header: "Machine", enableSorting: true },
    { accessorKey: "operatorName", header: "Operator", enableSorting: true },
    { accessorKey: "itemCode", header: "Item Code", enableSorting: true },
    { accessorKey: "itemName", header: "Item Name", enableSorting: true },
    { accessorKey: "lotNo", header: "Lot No", enableSorting: true },
    { accessorKey: "targetQty", header: "Target", enableSorting: true, cell: ({ row }) => <span className="text-right block">{row.original.targetQty}</span> },
    { accessorKey: "actualQty", header: "Actual", enableSorting: true, cell: ({ row }) => <span className="text-right block text-green-600">{row.original.actualQty}</span> },
    { accessorKey: "rejectedQty", header: "Rejected", enableSorting: true, cell: ({ row }) => <span className="text-right block text-red-600">{row.original.rejectedQty}</span> },
    { accessorKey: "efficiency", header: "Efficiency %", enableSorting: true, cell: ({ row }) => <span className={`text-right block font-semibold ${row.original.efficiency >= 95 ? "text-green-600" : row.original.efficiency >= 85 ? "text-yellow-600" : "text-red-600"}`}>{row.original.efficiency}%</span> },
    { accessorKey: "shift", header: "Shift", enableSorting: true },
  ]

  const handleSearch = () => {
    addToast({ type: "info", message: "Report refreshed" })
  }

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToCSV(reportData, `production-report-${formatDate(new Date(), "YYYY-MM-DD")}.csv`)
    addToast({ type: "success", message: "CSV exported successfully" })
  }

  const handleExportExcel = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToExcel(reportData, `production-report-${formatDate(new Date(), "YYYY-MM-DD")}.xlsx`, "Production Report")
    addToast({ type: "success", message: "Excel exported successfully" })
  }

  const handlePrint = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to print" })
      return
    }
    printTable("Production Report", reportData, columns)
  }

  const actions = [
    { label: "Search", icon: Search, onClick: handleSearch, variant: "primary" },
    { label: "CSV", icon: Download, onClick: handleExportCSV },
    { label: "Excel", icon: FileSpreadsheet, onClick: handleExportExcel },
    { label: "Print", icon: Printer, onClick: handlePrint },
  ]

  const totals = reportData.reduce(
    (acc, row) => ({
      targetQty: acc.targetQty + row.targetQty,
      actualQty: acc.actualQty + row.actualQty,
      rejectedQty: acc.rejectedQty + row.rejectedQty,
    }),
    { targetQty: 0, actualQty: 0, rejectedQty: 0 }
  )

  const avgEfficiency =
    reportData.length > 0
      ? (reportData.reduce((acc, row) => acc + row.efficiency, 0) / reportData.length).toFixed(2)
      : 0

  return (
    <PageShell title="Production Report">
      <ActionBar actions={actions} />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Process Type"
                value={filters.processType}
                onChange={(e) => setFilters({ ...filters, processType: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "Warping", label: "Warping" },
                  { value: "Knitting", label: "Knitting" },
                  { value: "Dyeing", label: "Dyeing" },
                  { value: "Lamination", label: "Lamination" },
                ]}
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
                label="Shift"
                value={filters.shift}
                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "Day", label: "Day" },
                  { value: "Night", label: "Night" },
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-muted-foreground">Total Target</div>
                        <div className="font-semibold">{totals.targetQty.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600">Total Actual</div>
                        <div className="font-semibold text-green-700">{totals.actualQty.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-red-600">Total Rejected</div>
                        <div className="font-semibold text-red-700">{totals.rejectedQty.toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <div className="text-primary">Avg Efficiency</div>
                        <div className="font-semibold">{avgEfficiency}%</div>
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

export default ProductionReport
