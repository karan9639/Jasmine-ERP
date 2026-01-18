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
import { api } from "@/services/api"
import { Trash2, Plus, Search, Edit, PlusCircle, X } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/formatters"

const defaultForm = {
  poNo: "",
  poDate: new Date().toISOString().split("T")[0],
  vendorId: "",
  vendorName: "",
  indentNo: "",
  deliveryDate: "",
  paymentTerms: "",
  status: "Open",
  remarks: "",
}

const defaultLine = { itemId: "", itemName: "", qty: 0, uom: "KG", rate: 0, taxRate: 5, amount: 0 }

export function PurchaseOrder() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("form")
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [vendors, setVendors] = useState([])
  const [items, setItems] = useState([])
  const [indents, setIndents] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState(defaultForm)
  const [lines, setLines] = useState([{ ...defaultLine }])

  useEffect(() => {
    loadVendors()
    loadItems()
    loadIndents()
    if (view === "list") loadPurchaseOrders()
  }, [view])

  const loadPurchaseOrders = async () => {
    setLoading(true)
    try {
      const data = await api.purchaseOrders.getAll()
      setPurchaseOrders(data)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load purchase orders" })
    } finally {
      setLoading(false)
    }
  }

  const loadVendors = async () => {
    const data = await api.vendors.getAll()
    setVendors(data)
  }

  const loadItems = async () => {
    const data = await api.items.getAll()
    setItems(data)
  }

  const loadIndents = async () => {
    const data = await api.indents.getAll()
    setIndents(data.filter(i => i.status === "Approved"))
  }

  const generatePONo = () => {
    const year = new Date().getFullYear()
    const count = purchaseOrders.length + 1
    return `PO-${year}-${String(count).padStart(3, "0")}`
  }

  const handleNew = () => {
    const poNo = generatePONo()
    setFormData({ ...defaultForm, poNo })
    setLines([{ ...defaultLine }])
    setSelectedId(null)
    setView("form")
    addToast({ type: "info", message: "New purchase order form initialized" })
  }

  const handleSave = async () => {
    if (!formData.vendorId || !formData.vendorName) {
      addToast({ type: "error", message: "Please select a vendor" })
      return
    }

    if (lines.every(l => !l.itemName && l.qty === 0)) {
      addToast({ type: "error", message: "Please add at least one item" })
      return
    }

    const totalAmount = lines.reduce((sum, l) => sum + l.amount, 0)
    const gstAmount = lines.reduce((sum, l) => sum + (l.amount * l.taxRate / 100), 0)

    setLoading(true)
    try {
      const poData = {
        ...formData,
        items: lines.filter(l => l.itemName && l.qty > 0),
        totalAmount,
        gstAmount,
        grandTotal: totalAmount + gstAmount,
      }

      if (selectedId) {
        await api.purchaseOrders.update(selectedId, poData)
        addToast({ type: "success", message: "Purchase Order updated successfully" })
      } else {
        await api.purchaseOrders.create(poData)
        addToast({ type: "success", message: "Purchase Order created successfully" })
      }
      handleNew()
      loadPurchaseOrders()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save purchase order" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this purchase order?")) return

    setLoading(true)
    try {
      await api.purchaseOrders.delete(selectedId)
      addToast({ type: "success", message: "Purchase Order deleted successfully" })
      handleNew()
      loadPurchaseOrders()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete purchase order" })
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
      poNo: row.poNo,
      poDate: row.poDate,
      vendorId: row.vendorId,
      vendorName: row.vendorName,
      indentNo: row.indentNo || "",
      deliveryDate: row.deliveryDate || "",
      paymentTerms: row.paymentTerms || "",
      status: row.status,
      remarks: row.remarks || "",
    })
    setLines(row.items?.length > 0 ? row.items : [{ ...defaultLine }])
    setView("form")
  }

  const handleVendorChange = (vendorId) => {
    const vendor = vendors.find(v => v.id === Number(vendorId))
    setFormData({
      ...formData,
      vendorId: Number(vendorId),
      vendorName: vendor?.vendorName || "",
      paymentTerms: vendor?.paymentTerms || ""
    })
  }

  const addLine = () => {
    setLines([...lines, { ...defaultLine }])
  }

  const removeLine = (index) => {
    if (lines.length === 1) {
      addToast({ type: "warning", message: "At least one line is required" })
      return
    }
    setLines(lines.filter((_, i) => i !== index))
  }

  const updateLine = (index, field, value) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }
    
    if (field === "itemId") {
      const selectedItem = items.find(i => i.id === Number(value))
      if (selectedItem) {
        newLines[index].itemName = selectedItem.itemName
        newLines[index].uom = selectedItem.uom
        newLines[index].rate = selectedItem.rate
        newLines[index].taxRate = selectedItem.gstRate || 5
        newLines[index].amount = newLines[index].qty * selectedItem.rate
      }
    }
    
    if (field === "qty" || field === "rate") {
      newLines[index].amount = newLines[index].qty * newLines[index].rate
    }
    
    setLines(newLines)
  }

  const listColumns = [
    { accessorKey: "poNo", header: "PO No." },
    { accessorKey: "poDate", header: "Date", cell: ({ row }) => formatDate(row.original.poDate) },
    { accessorKey: "vendorName", header: "Vendor" },
    { accessorKey: "indentNo", header: "Indent No." },
    { accessorKey: "grandTotal", header: "Amount", cell: ({ row }) => formatCurrency(row.original.grandTotal) },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === "Completed" ? "success" : status === "Partial" ? "warning" : "default"
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

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0)
  const totalTax = lines.reduce((sum, l) => sum + (l.amount * l.taxRate / 100), 0)
  const grandTotal = subtotal + totalTax

  const filteredPOs = purchaseOrders.filter(po =>
    po.poNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageShell title="Purchase Order">
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
              <CardTitle>Purchase Orders List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search POs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={handleNew}>
                  <Plus className="w-4 h-4 mr-2" />New PO
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
              <DataTable columns={listColumns} data={filteredPOs} onRowClick={handleRowClick} />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? "Edit Purchase Order" : "New Purchase Order"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="PO No."
                value={formData.poNo}
                disabled
                placeholder="Auto-generated"
              />
              <Input
                label="PO Date"
                type="date"
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                required
              />
              <Input
                label="Delivery Date"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: "Open", label: "Open" },
                  { value: "Partial", label: "Partial" },
                  { value: "Completed", label: "Completed" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Vendor"
                value={formData.vendorId}
                onChange={(e) => handleVendorChange(e.target.value)}
                options={[
                  { value: "", label: "Select Vendor" },
                  ...vendors.map(v => ({ value: v.id, label: `${v.vendorCode} - ${v.vendorName}` }))
                ]}
                required
              />
              <Input
                label="Vendor Name"
                value={formData.vendorName}
                disabled
              />
              <Select
                label="Against Indent"
                value={formData.indentNo}
                onChange={(e) => setFormData({ ...formData, indentNo: e.target.value })}
                options={[
                  { value: "", label: "Select Indent (Optional)" },
                  ...indents.map(i => ({ value: i.indentNo, label: `${i.indentNo} - ${i.department}` }))
                ]}
              />
            </div>

            <Input
              label="Payment Terms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              placeholder="e.g., Net 30 days"
            />

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">PO Items</h3>
                <Button size="sm" onClick={addLine}>
                  <PlusCircle className="w-4 h-4 mr-2" />Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {lines.map((line, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <Select
                        label={index === 0 ? "Item" : undefined}
                        value={line.itemId}
                        onChange={(e) => updateLine(index, "itemId", e.target.value)}
                        options={[
                          { value: "", label: "Select Item" },
                          ...items.map(i => ({ value: i.id, label: i.itemName }))
                        ]}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={index === 0 ? "Qty" : undefined}
                        type="number"
                        value={line.qty}
                        onChange={(e) => updateLine(index, "qty", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label={index === 0 ? "UOM" : undefined}
                        value={line.uom}
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={index === 0 ? "Rate" : undefined}
                        type="number"
                        value={line.rate}
                        onChange={(e) => updateLine(index, "rate", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label={index === 0 ? "Tax %" : undefined}
                        type="number"
                        value={line.taxRate}
                        onChange={(e) => updateLine(index, "taxRate", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={index === 0 ? "Amount" : undefined}
                        value={formatCurrency(line.amount)}
                        disabled
                      />
                    </div>
                    <div className="col-span-1 pb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLine(index)}
                        disabled={lines.length === 1}
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="w-72 space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Tax:</span>
                  <span className="font-medium">{formatCurrency(totalTax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save PO"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}

export default PurchaseOrder
