"use client"

import { useState } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/Table"
import { Checkbox } from "@/components/ui/Checkbox"
import { Badge } from "@/components/ui/Badge"
import { useAppStore } from "@/state/useAppStore"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"

const mockStock = [
  {
    id: 1,
    label: "LBL001",
    product: "Laminated Fabric",
    gsm: 200,
    width: 72,
    color: "White",
    lotNo: "LOT2024001",
    qty: 100,
    qtyKgs: 200,
    rackNo: "R-15",
    tagged: true,
  },
  {
    id: 2,
    label: "LBL002",
    product: "Laminated Fabric",
    gsm: 180,
    width: 60,
    color: "Blue",
    lotNo: "LOT2024002",
    qty: 150,
    qtyKgs: 270,
    rackNo: "R-16",
    tagged: false,
  },
]

export function LaminationStock() {
  const { addToast } = useAppStore()
  const [stock, setStock] = useState(mockStock)
  const [selectedRows, setSelectedRows] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  const handleUntagRolls = () => {
    if (selectedRows.length === 0) {
      addToast({ type: "warning", message: "Please select rolls to untag" })
      return
    }
    addToast({ type: "success", message: `Untagged ${selectedRows.length} rolls` })
    setSelectedRows([])
  }

  const filteredStock = stock.filter((item) => {
    if (activeTab === "tagged") return item.tagged
    if (activeTab === "untagged") return !item.tagged
    return true
  })

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={selectedRows.length === filteredStock.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(filteredStock.map((item) => item.id))
            } else {
              setSelectedRows([])
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, row.original.id])
            } else {
              setSelectedRows(selectedRows.filter((id) => id !== row.original.id))
            }
          }}
        />
      ),
    },
    { accessorKey: "label", header: "Label" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "gsm", header: "GSM" },
    { accessorKey: "width", header: "Width" },
    { accessorKey: "color", header: "Color" },
    { accessorKey: "lotNo", header: "Lot No" },
    { accessorKey: "qty", header: "Qty" },
    { accessorKey: "qtyKgs", header: "Qty (Kgs)" },
    { accessorKey: "rackNo", header: "Rack No" },
    {
      accessorKey: "tagged",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.tagged ? "success" : "secondary"}>
          {row.original.tagged ? "Tagged" : "Untagged"}
        </Badge>
      ),
    },
  ]

  return (
    <PageShell
      title="Lamination Stock"
      toolbar={
        <Button onClick={handleUntagRolls} variant="destructive" size="sm" disabled={selectedRows.length === 0}>
          Untag Rolls ({selectedRows.length})
        </Button>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <Tabs defaultValue="all">
            {({ activeTab, setActiveTab }) => (
              <>
                <TabsList>
                  <TabsTrigger value="all" activeTab={activeTab} setActiveTab={setActiveTab}>
                    All
                  </TabsTrigger>
                  <TabsTrigger value="tagged" activeTab={activeTab} setActiveTab={setActiveTab}>
                    Tagged
                  </TabsTrigger>
                  <TabsTrigger value="untagged" activeTab={activeTab} setActiveTab={setActiveTab}>
                    Untagged
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" activeTab={activeTab}>
                  <DataTable columns={columns} data={filteredStock} pageSize={10} />
                </TabsContent>
                <TabsContent value="tagged" activeTab={activeTab}>
                  <DataTable columns={columns} data={filteredStock} pageSize={10} />
                </TabsContent>
                <TabsContent value="untagged" activeTab={activeTab}>
                  <DataTable columns={columns} data={filteredStock} pageSize={10} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </PageShell>
  )
}
