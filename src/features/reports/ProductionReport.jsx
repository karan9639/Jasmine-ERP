"use client"

import { useState } from "react"
import { Search, Download, Printer, FileSpreadsheet } from "lucide-react"
import PageShell from "../../components/layout/PageShell"
import ActionBar from "../../components/layout/ActionBar"
import Card from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import DataTable from "../../components/ui/DataTable"
import { exportToCSV, exportToExcel, printTable } from "../../lib/exportUtils"
import { formatDate } from "../../lib/formatters"

export default function ProductionReport() {
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
    { key: "date", header: "Date", sortable: true, cell: (row) => formatDate(row.date) },
    { key: "processType", header: "Process", sortable: true },
    { key: "machineNo", header: "Machine", sortable: true },
    { key: "operatorName", header: "Operator", sortable: true },
    { key: "itemCode", header: "Item Code", sortable: true },
    { key: "itemName", header: "Item Name", sortable: true },
    { key: "lotNo", header: "Lot No", sortable: true },
    { key: "targetQty", header: "Target", sortable: true, align: "right" },
    { key: "actualQty", header: "Actual", sortable: true, align: "right" },
    { key: "rejectedQty", header: "Rejected", sortable: true, align: "right" },
    { key: "efficiency", header: "Efficiency %", sortable: true, align: "right", cell: (row) => `${row.efficiency}%` },
    { key: "shift", header: "Shift", sortable: true },
  ]

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
  }

  const handleExportCSV = () => {
    exportToCSV(reportData, `production-report-${formatDate(new Date())}.csv`)
  }

  const handleExportExcel = () => {
    exportToExcel(reportData, `production-report-${formatDate(new Date())}.xlsx`, "Production Report")
  }

  const handlePrint = () => {
    printTable("Production Report", reportData, columns)
  }

  const actions = [
    { label: "Search", icon: Search, onClick: handleSearch, variant: "primary" },
    { label: "CSV", icon: Download, onClick: handleExportCSV, variant: "default" },
    { label: "Excel", icon: FileSpreadsheet, onClick: handleExportExcel, variant: "default" },
    { label: "Print", icon: Printer, onClick: handlePrint, variant: "default" },
  ]

  const totals = reportData.reduce(
    (acc, row) => ({
      targetQty: acc.targetQty + row.targetQty,
      actualQty: acc.actualQty + row.actualQty,
      rejectedQty: acc.rejectedQty + row.rejectedQty,
    }),
    { targetQty: 0, actualQty: 0, rejectedQty: 0 },
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
          <Card.Header>
            <Card.Title>Filters</Card.Title>
          </Card.Header>
          <Card.Content>
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
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <DataTable data={reportData} columns={columns} />

            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-4 gap-4 text-sm font-semibold">
                <div className="text-right">Total Target: {totals.targetQty.toFixed(2)}</div>
                <div className="text-right">Total Actual: {totals.actualQty.toFixed(2)}</div>
                <div className="text-right">Total Rejected: {totals.rejectedQty.toFixed(2)}</div>
                <div className="text-right">Avg Efficiency: {avgEfficiency}%</div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </PageShell>
  )
}
