'use client';

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PageShell } from "@/components/layout/PageShell"
import { StatCard } from "@/components/ui/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { api } from "@/services/api"
import { formatDate, formatCurrency } from "@/lib/formatters"
import {
  ShoppingCart,
  Package,
  Factory,
  Truck,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react"

export function Dashboard() {
  const [stats, setStats] = useState({
    orders: [],
    indents: [],
    challans: [],
    customers: [],
    stock: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [orders, indents, challans, customers, stock] = await Promise.all([
        api.orders.getAll(),
        api.indents.getAll(),
        api.challans.getAll(),
        api.customers.getAll(),
        api.stock.getAll(),
      ])
      setStats({ orders, indents, challans, customers, stock })
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const pendingOrders = stats.orders.filter(o => o.status === "Pending").length
  const pendingIndents = stats.indents.filter(i => i.status === "Pending").length
  const totalStockValue = stats.stock.reduce((sum, s) => sum + (s.value || 0), 0)

  const recentOrders = stats.orders.slice(-5).reverse()
  const recentIndents = stats.indents.slice(-5).reverse()

  return (
    <PageShell title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Orders"
          value={stats.orders.length}
          icon={ShoppingCart}
          trend="up"
          trendValue={`${pendingOrders} pending`}
        />
        <StatCard
          title="Pending Indents"
          value={pendingIndents}
          icon={Package}
          trend={pendingIndents > 5 ? "down" : "up"}
          trendValue={`of ${stats.indents.length} total`}
        />
        <StatCard
          title="Active Customers"
          value={stats.customers.length}
          icon={Users}
        />
        <StatCard
          title="Stock Value"
          value={formatCurrency(totalStockValue)}
          icon={TrendingUp}
          trend="up"
          trendValue={`${stats.stock.length} items`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recent Orders
              </CardTitle>
              <Link to="/order-processing/order" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        order.status === "Approved" ? "bg-green-100" :
                        order.status === "Processing" ? "bg-yellow-100" :
                        "bg-blue-100"
                      }`}>
                        {order.status === "Approved" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : order.status === "Processing" ? (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.orderNo}</p>
                        <p className="text-xs text-muted-foreground">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(order.totalAmount)}</p>
                      <Badge variant={
                        order.status === "Approved" ? "success" :
                        order.status === "Processing" ? "warning" : "default"
                      } className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/order-processing/order"
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-center"
              >
                <ShoppingCart className="w-6 h-6 mb-2 text-primary mx-auto" />
                <p className="text-sm font-medium">New Order</p>
              </Link>
              <Link
                to="/procurement/indent"
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-center"
              >
                <Package className="w-6 h-6 mb-2 text-primary mx-auto" />
                <p className="text-sm font-medium">Create Indent</p>
              </Link>
              <Link
                to="/production/warping-entry"
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-center"
              >
                <Factory className="w-6 h-6 mb-2 text-primary mx-auto" />
                <p className="text-sm font-medium">Production</p>
              </Link>
              <Link
                to="/shipping-invoicing/challan"
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-center"
              >
                <Truck className="w-6 h-6 mb-2 text-primary mx-auto" />
                <p className="text-sm font-medium">Challan</p>
              </Link>
              <Link
                to="/master-data/customer"
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-center"
              >
                <Users className="w-6 h-6 mb-2 text-primary mx-auto" />
                <p className="text-sm font-medium">Customers</p>
              </Link>
              <Link
                to="/reports/stock"
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-center"
              >
                <TrendingUp className="w-6 h-6 mb-2 text-primary mx-auto" />
                <p className="text-sm font-medium">Stock Report</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Indents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Pending Indents
              </CardTitle>
              <Link to="/procurement/indent" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : stats.indents.filter(i => i.status === "Pending").length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending indents</p>
            ) : (
              <div className="space-y-3">
                {stats.indents.filter(i => i.status === "Pending").slice(0, 5).map((indent) => (
                  <div
                    key={indent.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{indent.indentNo}</p>
                      <p className="text-xs text-muted-foreground">
                        {indent.department} - {indent.requestedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatDate(indent.indentDate)}</p>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                {stats.stock.filter(s => s.closingStock < 200).slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.itemName}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-red-600">
                        {item.closingStock} {item.uom}
                      </p>
                      <p className="text-xs text-muted-foreground">Low Stock</p>
                    </div>
                  </div>
                ))}
                {stats.stock.filter(s => s.closingStock < 200).length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No low stock alerts</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default Dashboard
