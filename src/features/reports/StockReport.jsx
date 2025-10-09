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
import { formatDate, formatCurrency } from "../../lib/formatters"

export default function StockReport() {
  const [filters, setFilters] = useState({
    itemType: "",
    category: "",
    fromDate: "",
    toDate: "",
    warehouse: "",
  })

  const [reportData, setReportData] = useState([
    {
      id: 1,
      itemCode: "ITEM001",
      itemName: "Cotton Yarn 30s",
      itemType: "Raw Material",
      category: "Yarn",
      uom: "KG",
      openingStock: 1000,
      received: 500,
      issued: 300,
      closingStock: 1200,
      rate: 250,
      value: 300000,
    },
    {
      id: 2,
      itemCode: "ITEM002",
      itemName: "Polyester Fabric",
      itemType: "Finished Goods",
      category: "Fabric",
      uom: "MTR",
      openingStock: 2000,
      received: 1000,
      issued: 800,
      closingStock: 2200,
      rate: 150,
      value: 330000,
    },
  ])

  const columns = [
    { key: "itemCode", header: "Item Code", sortable: true },
    { key: "itemName", header: "Item Name", sortable: true },
    { key: "itemType", header: "Type", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "uom", header: "UOM" },
    { key: "openingStock", header: "Opening", sortable: true, align: "right" },
    { key: "received", header: "Received", sortable: true, align: "right" },
    { key: "issued", header: "Issued", sortable: true, align: "right" },
    { key: "closingStock", header: "Closing", sortable: true, align: "right" },
    { key: "rate", header: "Rate", sortable: true, align: "right", cell: (row) => formatCurrency(row.rate) },
    { key: "value", header: "Value", sortable: true, align: "right", cell: (row) => formatCurrency(row.value) },
  ]

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
  }

  const handleExportCSV = () => {
    exportToCSV(reportData, `stock-report-${formatDate(new Date())}.csv`)
  }

  const handleExportExcel = () => {
    exportToExcel(reportData, `stock-report-${formatDate(new Date())}.xlsx`, "Stock Report")
  }

  const handlePrint = () => {
    printTable("Stock Report", reportData, columns)
  }

  const actions = [
    { label: "Search", icon: Search, onClick: handleSearch, variant: "primary" },
    { label: "CSV", icon: Download, onClick: handleExportCSV, variant: "default" },
    { label: "Excel", icon: FileSpreadsheet, onClick: handleExportExcel, variant: "default" },
    { label: "Print", icon: Printer, onClick: handlePrint, variant: "default" },
  ]

  const totals = reportData.reduce(
    (acc, row) => ({
      openingStock: acc.openingStock + row.openingStock,
      received: acc.received + row.received,
      issued: acc.issued + row.issued,
      closingStock: acc.closingStock + row.closingStock,
      value: acc.value + row.value,
    }),
    { openingStock: 0, received: 0, issued: 0, closingStock: 0, value: 0 },
  )

  return (
    <PageShell title="Stock Report">
      <ActionBar actions={actions} />

      <div className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title>Filters</Card.Title>
          </Card.Header>
          <Card.Content>
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
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <DataTable data={reportData} columns={columns} />

            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-5 gap-4 text-sm font-semibold">
                <div className="col-span-5 md:col-span-1 text-right md:col-start-2">
                  Total Opening: {totals.openingStock.toFixed(2)}
                </div>
                <div className="text-right">Total Received: {totals.received.toFixed(2)}</div>
                <div className="text-right">Total Issued: {totals.issued.toFixed(2)}</div>
                <div className="text-right">Total Closing: {totals.closingStock.toFixed(2)}</div>
                <div className="text-right">Total Value: {formatCurrency(totals.value)}</div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </PageShell>
  )
}
