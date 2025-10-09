import { PageShell } from "@/components/layout/PageShell"
import { StatCard } from "@/components/ui/StatCard"
import { ShoppingCart, Package, Factory, Truck } from "lucide-react"

export function Dashboard() {
  return (
    <PageShell title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Orders" value="1,234" icon={ShoppingCart} trend="up" trendValue="12% from last month" />
        <StatCard title="Pending Procurement" value="56" icon={Package} trend="down" trendValue="8% from last month" />
        <StatCard title="Production Units" value="8" icon={Factory} />
        <StatCard title="Shipments Today" value="23" icon={Truck} trend="up" trendValue="5% from yesterday" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">New Order Created</p>
                <p className="text-xs text-muted-foreground">Order #12345</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Production Completed</p>
                <p className="text-xs text-muted-foreground">Batch #789</p>
              </div>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Shipment Dispatched</p>
                <p className="text-xs text-muted-foreground">Invoice #INV-456</p>
              </div>
              <span className="text-xs text-muted-foreground">6 hours ago</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
              <ShoppingCart className="w-5 h-5 mb-2 text-accent" />
              <p className="text-sm font-medium">New Order</p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
              <Package className="w-5 h-5 mb-2 text-accent" />
              <p className="text-sm font-medium">Create Indent</p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
              <Factory className="w-5 h-5 mb-2 text-accent" />
              <p className="text-sm font-medium">Production Entry</p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
              <Truck className="w-5 h-5 mb-2 text-accent" />
              <p className="text-sm font-medium">Create Challan</p>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
