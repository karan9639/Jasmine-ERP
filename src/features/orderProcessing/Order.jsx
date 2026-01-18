"use client"

import { useState, useEffect } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"
import { useHotkeys } from "@/hooks/useHotkeys"
import { api } from "@/services/api"
import { Trash2, Plus, Search, Edit } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/formatters"

const defaultForm = {
  series: "SO",
  orderNo: "",
  orderDate: new Date().toISOString().split("T")[0],
  customerId: "",
  customerName: "",
  status: "Pending",
  remarks: "",
}

const defaultLine = { id: 1, item: "", color: "", width: "", uom: "Mtr", qty: 0, kgs: 0, rate: 0, amount: 0 }

export function Order() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("form")
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState(defaultForm)
  const [lines, setLines] = useState([{ ...defaultLine }])

  useEffect(() => {
    loadCustomers()
    loadItems()
    if (view === "list") loadOrders()
  }, [view])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await api.orders.getAll()
      setOrders(data)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load orders" })
    } finally {
      setLoading(false)
    }
  }

  const loadCustomers = async () => {
    const data = await api.customers.getAll()
    setCustomers(data)
  }

  const loadItems = async () => {
    const data = await api.items.getAll()
    setItems(data)
  }

  const generateOrderNo = () => {
    const year = new Date().getFullYear()
    const count = orders.length + 1
    return `${formData.series}-${year}-${String(count).padStart(3, "0")}`
  }

  const handleNew = () => {
    const orderNo = generateOrderNo()
    setFormData({ ...defaultForm, orderNo })
    setLines([{ ...defaultLine }])
    setSelectedId(null)
    setView("form")
    addToast({ type: "info", message: "New order form initialized" })
  }

  const handleSave = async () => {
    if (!formData.customerId || !formData.customerName) {
      addToast({ type: "error", message: "Please select a customer" })
      return
    }

    if (lines.every(l => !l.item && l.qty === 0)) {
      addToast({ type: "error", message: "Please add at least one order line" })
      return
    }

    const totalAmount = lines.reduce((sum, line) => sum + line.amount, 0)

    setLoading(true)
    try {
      const orderData = {
        ...formData,
        lines,
        totalAmount,
      }

      if (selectedId) {
        await api.orders.update(selectedId, orderData)
        addToast({ type: "success", message: "Order updated successfully" })
      } else {
        await api.orders.create(orderData)
        addToast({ type: "success", message: "Order created successfully" })
      }
      handleNew()
      loadOrders()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save order" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this order?")) return

    setLoading(true)
    try {
      await api.orders.delete(selectedId)
      addToast({ type: "success", message: "Order deleted successfully" })
      handleNew()
      loadOrders()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete order" })
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
    addToast({ type: "success", message: "Print dialog opened" })
  }

  const handleRowClick = (row) => {
    setSelectedId(row.id)
    setFormData({
      series: row.series || "SO",
      orderNo: row.orderNo,
      orderDate: row.orderDate,
      customerId: row.customerId,
      customerName: row.customerName,
      status: row.status,
      remarks: row.remarks || "",
    })
    setLines(row.lines || [{ ...defaultLine }])
    setView("form")
  }

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.id === Number(customerId))
    setFormData({
      ...formData,
      customerId: Number(customerId),
      customerName: customer?.customerName || ""
    })
  }

  const addLine = () => {
    setLines([...lines, { ...defaultLine, id: lines.length + 1 }])
  }

  const removeLine = (id) => {
    if (lines.length === 1) {
      addToast({ type: "warning", message: "At least one line is required" })
      return
    }
    setLines(lines.filter((line) => line.id !== id))
  }

  const updateLine = (id, field, value) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updated = { ...line, [field]: value }
          if (field === "qty" || field === "rate") {
            updated.amount = updated.qty * updated.rate
          }
          if (field === "item") {
            const selectedItem = items.find(i => i.itemName === value)
            if (selectedItem) {
              updated.rate = selectedItem.rate
              updated.uom = selectedItem.uom
            }
          }
          return updated
        }
        return line
      }),
    )
  }

  useHotkeys({
    "alt+n": handleNew,
    "alt+s": handleSave,
  })

  const lineColumns = [
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => (
        <Select
          value={row.original.item}
          onChange={(e) => updateLine(row.original.id, "item", e.target.value)}
          options={[
            { value: "", label: "Select Item" },
            ...items.map(i => ({ value: i.itemName, label: i.itemName }))
          ]}
          className="min-w-[200px]"
        />
      ),
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <Input
          value={row.original.color}
          onChange={(e) => updateLine(row.original.id, "color", e.target.value)}
          placeholder="Color"
          className="min-w-[100px]"
        />
      ),
    },
    {
      accessorKey: "width",
      header: "Width",
      cell: ({ row }) => (
        <Input
          value={row.original.width}
          onChange={(e) => updateLine(row.original.id, "width", e.target.value)}
          placeholder="Width"
          className="w-20"
        />
      ),
    },
    {
      accessorKey: "uom",
      header: "UOM",
      cell: ({ row }) => (
        <Select
          value={row.original.uom}
          onChange={(e) => updateLine(row.original.id, "uom", e.target.value)}
          options={[
            { value: "Mtr", label: "Mtr" },
            { value: "Kgs", label: "Kgs" },
            { value: "Pcs", label: "Pcs" },
          ]}
          className="w-20"
        />
      ),
    },
    {
      accessorKey: "qty",
      header: "Qty",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.qty}
          onChange={(e) => updateLine(row.original.id, "qty", parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      ),
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.rate}
          onChange={(e) => updateLine(row.original.id, "rate", parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => removeLine(row.original.id)}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      ),
    },
  ]

  const orderListColumns = [
    { accessorKey: "orderNo", header: "Order No." },
    { accessorKey: "orderDate", header: "Date", cell: ({ row }) => formatDate(row.original.orderDate) },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "totalAmount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.totalAmount) },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === "Approved" ? "success" : status === "Processing" ? "warning" : "default"
        return <Badge variant={variant}>{status}</Badge>
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => handleRowClick(row.original)}>
          <Edit className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  const totalAmount = lines.reduce((sum, line) => sum + line.amount, 0)
  const totalQty = lines.reduce((sum, line) => sum + line.qty, 0)

  const filteredOrders = orders.filter(order =>
    order.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="Sales Order">
      <ActionBar
        onNew={handleNew}
        onSave={view === "form" ? handleSave : undefined}
        onQuery={() => setView("list")}
        onDelete={selectedId && view === "form" ? handleDelete : undefined}
        onPrint={view === "form" ? handlePrint : undefined}
      />

      {view === "list" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Orders List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={handleNew}>
                  <Plus className="w-4 h-4 mr-2" />New Order
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
              <DataTable columns={orderListColumns} data={filteredOrders} onRowClick={handleRowClick} />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? "Edit Order" : "New Order"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Series"
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                options={[
                  { value: "SO", label: "SO - Sales Order" },
                  { value: "EO", label: "EO - Export Order" },
                ]}
                required
              />
              <Input
                label="Order No."
                value={formData.orderNo}
                disabled
                placeholder="Auto-generated"
              />
              <Input
                label="Order Date"
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                required
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Processing", label: "Processing" },
                  { value: "Completed", label: "Completed" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Customer"
                value={formData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                options={[
                  { value: "", label: "Select Customer" },
                  ...customers.map(c => ({ value: c.id, label: `${c.customerCode} - ${c.customerName}` }))
                ]}
                required
              />
              <Input
                label="Customer Name"
                value={formData.customerName}
                disabled
              />
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Order Lines</h3>
                <Button size="sm" onClick={addLine}>
                  <Plus className="w-4 h-4 mr-2" />Add Line
                </Button>
              </div>
              <DataTable columns={lineColumns} data={lines} />
            </div>

            <div className="flex justify-between items-start">
              <div className="flex-1 max-w-md">
                <Textarea
                  label="Remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Enter any remarks"
                  rows={3}
                />
              </div>
              <div className="w-64 space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Lines:</span>
                  <span className="font-medium">{lines.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Qty:</span>
                  <span className="font-medium">{totalQty.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Order"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}

export default Order
