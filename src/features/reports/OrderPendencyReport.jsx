'use client';

import { useState } from "react"
import { Search, Download, Printer, FileSpreadsheet } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/ui/DataTable"
import { exportToCSV, exportToExcel, printTable } from "@/utils/exportUtils"
import { formatDate, formatCurrency } from "@/lib/formatters"

export function OrderPendencyReport() {
  const [filters, setFilters] = useState({
    customerName: "",
    status: "",
    fromDate: "",
    toDate: "",
  })

  const [reportData] = useState([
    {
      id: 1,
      orderNo: "SO-2024-001",
      orderDate: "2024-01-15",
      customerName: "XYZ Industries",
      itemCode: "ITEM001",
      itemName: "Cotton Yarn 30s",
      orderedQty: 1000,
      deliveredQty: 600,
      pendingQty: 400,
      rate: 250,
      pendingValue: 100000,
      deliveryDate: "2024-02-15",
      status: "Partial",
      agingDays: 15,
    },
    {
      id: 2,
      orderNo: "SO-2024-002",
      orderDate: "2024-01-20",
      customerName: "ABC Textiles",
      itemCode: "ITEM002",
      itemName: "Polyester Fabric",
      orderedQty: 2000,
      deliveredQty: 0,
      pendingQty: 2000,
      rate: 150,
      pendingValue: 300000,
      deliveryDate: "2024-02-20",
      status: "Pending",
      agingDays: 10,
    },
  ])

  const columns = [
    { key: "orderNo", header: "Order No", sortable: true },
    { key: "orderDate", header: "Order Date", sortable: true, cell: (row) => formatDate(row.orderDate) },
    { key: "customerName", header: "Customer", sortable: true },
    { key: "itemCode", header: "Item Code", sortable: true },
    { key: "itemName", header: "Item Name", sortable: true },
    { key: "orderedQty", header: "Ordered", sortable: true, align: "right" },
    { key: "deliveredQty", header: "Delivered", sortable: true, align: "right" },
    { key: "pendingQty", header: "Pending", sortable: true, align: "right" },
    {
      key: "pendingValue",
      header: "Value",
      sortable: true,
      align: "right",
      cell: (row) => formatCurrency(row.pendingValue),
    },
    { key: "deliveryDate", header: "Delivery Date", sortable: true, cell: (row) => formatDate(row.deliveryDate) },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row) => <Badge variant={row.status === "Pending" ? "warning" : "info"}>{row.status}</Badge>,
    },
    { key: "agingDays", header: "Aging (Days)", sortable: true, align: "right" },
  ]

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
  }

  const handleExportCSV = () => {
    exportToCSV(reportData, `order-pendency-${formatDate(new Date())}.csv`)
  }

  const handleExportExcel = () => {
    exportToExcel(reportData, `order-pendency-${formatDate(new Date())}.xlsx`, "Order Pendency")
  }

  const handlePrint = () => {
    printTable("Order Pendency Report", reportData, columns)
  }

  const actions = [
    { label: "Search", icon: Search, onClick: handleSearch, variant: "primary" },
    { label: "CSV", icon: Download, onClick: handleExportCSV, variant: "default" },
    { label: "Excel", icon: FileSpreadsheet, onClick: handleExportExcel, variant: "default" },
    { label: "Print", icon: Printer, onClick: handlePrint, variant: "default" },
  ]

  const totals = reportData.reduce(
    (acc, row) => ({
      orderedQty: acc.orderedQty + row.orderedQty,
      deliveredQty: acc.deliveredQty + row.deliveredQty,
      pendingQty: acc.pendingQty + row.pendingQty,
      pendingValue: acc.pendingValue + row.pendingValue,
    }),
    { orderedQty: 0, deliveredQty: 0, pendingQty: 0, pendingValue: 0 },
  )

  return (
    <PageShell title="Order Pendency Report">
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
              <Select
                label="Status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                  { value: "", label: "All" },
                  { value: "Pending", label: "Pending" },
                  { value: "Partial", label: "Partial" },
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <DataTable data={reportData} columns={columns} />

            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-4 gap-4 text-sm font-semibold">
                <div className="text-right">Total Ordered: {totals.orderedQty.toFixed(2)}</div>
                <div className="text-right">Total Delivered: {totals.deliveredQty.toFixed(2)}</div>
                <div className="text-right">Total Pending: {totals.pendingQty.toFixed(2)}</div>
                <div className="text-right">Total Value: {formatCurrency(totals.pendingValue)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default OrderPendencyReport
