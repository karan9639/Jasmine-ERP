"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { Card } from "@/components/ui/Card"
import { DataTable } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { SearchInput } from "@/components/ui/SearchInput"
import { DateInput } from "@/components/ui/DateInput"
import { useAppStore } from "@/state/useAppStore"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import { formatDate, formatMoney } from "@/lib/formatters"

const mockOrders = [
  {
    id: 1,
    orderNo: "SO/2024/001",
    orderDate: "2024-01-15",
    customer: "ABC Textiles Ltd",
    totalAmount: 125000,
    status: "pending",
  },
  {
    id: 2,
    orderNo: "SO/2024/002",
    orderDate: "2024-01-16",
    customer: "XYZ Fabrics",
    totalAmount: 89500,
    status: "pending",
  },
  {
    id: 3,
    orderNo: "SO/2024/003",
    orderDate: "2024-01-17",
    customer: "Global Textiles",
    totalAmount: 156000,
    status: "pending",
  },
]

export function Approval({ level = 1 }) {
  const { addToast } = useAppStore()
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const handleApprove = (orderId) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "approved" } : order)))
    addToast({ type: "success", message: `Order approved at level ${level}` })
  }

  const handleReject = (orderId) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "rejected" } : order)))
    addToast({ type: "error", message: "Order rejected" })
  }

  const columns = [
    {
      accessorKey: "orderNo",
      header: "Order No",
      cell: ({ row }) => <span className="font-medium">{row.original.orderNo}</span>,
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => formatDate(row.original.orderDate),
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => formatMoney(row.original.totalAmount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === "approved" ? "success" : status === "rejected" ? "danger" : "warning"
        return <Badge variant={variant}>{status.toUpperCase()}</Badge>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="View">
            <Eye className="w-4 h-4" />
          </Button>
          {row.original.status === "pending" && (
            <>
              <Button variant="ghost" size="icon" onClick={() => handleApprove(row.original.id)} title="Approve">
                <CheckCircle className="w-4 h-4 text-chart-3" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleReject(row.original.id)} title="Reject">
                <XCircle className="w-4 h-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <PageShell title={`Order Approval - Level ${level}`}>
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Search orders..."
          />
          <DateInput value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From Date" />
          <DateInput value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To Date" />
        </div>

        <DataTable columns={columns} data={orders} pageSize={10} />
      </Card>
    </PageShell>
  )
}
