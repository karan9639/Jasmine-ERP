'use client';

import { useState } from "react"
import { Search, Download, Printer, FileSpreadsheet } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { DataTable } from "@/components/ui/Table"
import { exportToCSV, exportToExcel, printTable } from "@/utils/exportUtils"
import { formatDate, formatCurrency } from "@/lib/formatters"
import { useAppStore } from "@/state/useAppStore"

export function SalesReport() {
  const { addToast } = useAppStore()
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
    { accessorKey: "invoiceNo", header: "Invoice No", enableSorting: true },
    { accessorKey: "invoiceDate", header: "Date", enableSorting: true, cell: ({ row }) => formatDate(row.original.invoiceDate) },
    { accessorKey: "customerName", header: "Customer", enableSorting: true },
    { accessorKey: "itemCode", header: "Item Code", enableSorting: true },
    { accessorKey: "itemName", header: "Item Name", enableSorting: true },
    { accessorKey: "quantity", header: "Quantity", enableSorting: true, cell: ({ row }) => <span className="text-right block">{row.original.quantity}</span> },
    { accessorKey: "rate", header: "Rate", enableSorting: true, cell: ({ row }) => <span className="text-right block">{formatCurrency(row.original.rate)}</span> },
    { accessorKey: "amount", header: "Amount", enableSorting: true, cell: ({ row }) => <span className="text-right block">{formatCurrency(row.original.amount)}</span> },
    { accessorKey: "cgst", header: "CGST", enableSorting: true, cell: ({ row }) => <span className="text-right block">{formatCurrency(row.original.cgst)}</span> },
    { accessorKey: "sgst", header: "SGST", enableSorting: true, cell: ({ row }) => <span className="text-right block">{formatCurrency(row.original.sgst)}</span> },
    { accessorKey: "totalAmount", header: "Total", enableSorting: true, cell: ({ row }) => <span className="text-right block font-semibold">{formatCurrency(row.original.totalAmount)}</span> },
  ]

  const handleSearch = () => {
    addToast({ type: "info", message: "Report refreshed" })
  }

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToCSV(reportData, `sales-report-${formatDate(new Date())}.csv`)
    addToast({ type: "success", message: "CSV exported successfully" })
  }

  const handleExportExcel = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to export" })
      return
    }
    exportToExcel(reportData, `sales-report-${formatDate(new Date())}.xlsx`, "Sales Report")
    addToast({ type: "success", message: "Excel exported successfully" })
  }

  const handlePrint = () => {
    if (reportData.length === 0) {
      addToast({ type: "warning", message: "No data to print" })
      return
    }
    printTable("Sales Report", reportData, columns)
  }

  const actions = [
    { label: "Search", icon: Search, onClick: handleSearch, variant: "primary" },
    { label: "CSV", icon: Download, onClick: handleExportCSV },
    { label: "Excel", icon: FileSpreadsheet, onClick: handleExportExcel },
    { label: "Print", icon: Printer, onClick: handlePrint },
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
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DataTable data={reportData} columns={columns} />

            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-muted-foreground">Total Qty</div>
                  <div className="font-semibold">{totals.quantity.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-muted-foreground">Total Amount</div>
                  <div className="font-semibold">{formatCurrency(totals.amount)}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-muted-foreground">Total CGST</div>
                  <div className="font-semibold">{formatCurrency(totals.cgst)}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-muted-foreground">Total SGST</div>
                  <div className="font-semibold">{formatCurrency(totals.sgst)}</div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="text-primary">Grand Total</div>
                  <div className="font-semibold">{formatCurrency(totals.totalAmount)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default SalesReport
