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

export default function SalesReport() {
  const [filters, setFilters] = useState({
    customerName: "",
    fromDate: "",
    toDate: "",
    itemType: "",
  })

  const [reportData] = useState([
    {
      id: 1,
      invoiceNo: "INV-2024-001",
      invoiceDate: "2024-01-15",
      customerName: "XYZ Industries",
      itemCode: "ITEM001",
      itemName: "Cotton Yarn 30s",
      quantity: 1000,
      rate: 250,
      amount: 250000,
      cgst: 12500,
      sgst: 12500,
      totalAmount: 275000,
    },
    {
      id: 2,
      invoiceNo: "INV-2024-002",
      invoiceDate: "2024-01-20",
      customerName: "ABC Textiles",
      itemCode: "ITEM002",
      itemName: "Polyester Fabric",
      quantity: 500,
      rate: 150,
      amount: 75000,
      cgst: 3750,
      sgst: 3750,
      totalAmount: 82500,
    },
  ])

  const columns = [
    { key: "invoiceNo", header: "Invoice No", sortable: true },
    { key: "invoiceDate", header: "Date", sortable: true, cell: (row) => formatDate(row.invoiceDate) },
    { key: "customerName", header: "Customer", sortable: true },
    { key: "itemCode", header: "Item Code", sortable: true },
    { key: "itemName", header: "Item Name", sortable: true },
    { key: "quantity", header: "Quantity", sortable: true, align: "right" },
    { key: "rate", header: "Rate", sortable: true, align: "right", cell: (row) => formatCurrency(row.rate) },
    { key: "amount", header: "Amount", sortable: true, align: "right", cell: (row) => formatCurrency(row.amount) },
    { key: "cgst", header: "CGST", sortable: true, align: "right", cell: (row) => formatCurrency(row.cgst) },
    { key: "sgst", header: "SGST", sortable: true, align: "right", cell: (row) => formatCurrency(row.sgst) },
    {
      key: "totalAmount",
      header: "Total",
      sortable: true,
      align: "right",
      cell: (row) => formatCurrency(row.totalAmount),
    },
  ]

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
  }

  const handleExportCSV = () => {
    exportToCSV(reportData, `sales-report-${formatDate(new Date())}.csv`)
  }

  const handleExportExcel = () => {
    exportToExcel(reportData, `sales-report-${formatDate(new Date())}.xlsx`, "Sales Report")
  }

  const handlePrint = () => {
    printTable("Sales Report", reportData, columns)
  }

  const actions = [
    { label: "Search", icon: Search, onClick: handleSearch, variant: "primary" },
    { label: "CSV", icon: Download, onClick: handleExportCSV, variant: "default" },
    { label: "Excel", icon: FileSpreadsheet, onClick: handleExportExcel, variant: "default" },
    { label: "Print", icon: Printer, onClick: handlePrint, variant: "default" },
  ]

  const totals = reportData.reduce(
    (acc, row) => ({
      quantity: acc.quantity + row.quantity,
      amount: acc.amount + row.amount,
      cgst: acc.cgst + row.cgst,
      sgst: acc.sgst + row.sgst,
      totalAmount: acc.totalAmount + row.totalAmount,
    }),
    { quantity: 0, amount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
  )

  return (
    <PageShell title="Sales Report">
      <ActionBar actions={actions} />

      <div className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title>Filters</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Customer Name"
                value={filters.customerName}
                onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                placeholder="Enter customer name"
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
                label="Item Type"
                value={filters.itemType}
                onChange={(e) => setFilters({ ...filters, itemType: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "Raw Material", label: "Raw Material" },
                  { value: "Finished Goods", label: "Finished Goods" },
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
                <div className="text-right">Total Qty: {totals.quantity.toFixed(2)}</div>
                <div className="text-right">Total Amount: {formatCurrency(totals.amount)}</div>
                <div className="text-right">Total CGST: {formatCurrency(totals.cgst)}</div>
                <div className="text-right">Total SGST: {formatCurrency(totals.sgst)}</div>
                <div className="text-right">Grand Total: {formatCurrency(totals.totalAmount)}</div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </PageShell>
  )
}
