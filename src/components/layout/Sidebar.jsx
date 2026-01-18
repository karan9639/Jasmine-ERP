"use client"

import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ShoppingCart,
  Package,
  Warehouse,
  Factory,
  Droplet,
  Layers,
  Box,
  Truck,
  ClipboardCheck,
  Database,
  Settings,
  FileText,
  BarChart3,
} from "lucide-react"
import { useAppStore } from "@/state/useAppStore"

const menuItems = [
  {
    label: "Dashboard",
    icon: BarChart3,
    path: "/",
  },
  {
    label: "Order Processing",
    icon: ShoppingCart,
    children: [
      { label: "Order", path: "/order-processing/order" },
      { label: "Approval 1", path: "/order-processing/approval-1" },
      { label: "Approval 2", path: "/order-processing/approval-2" },
      { label: "Order Pendency Report", path: "/order-processing/reports/order-pendency" },
    ],
  },
  {
    label: "Procurement",
    icon: Package,
    children: [
      { label: "Indent", path: "/procurement/indent" },
      { label: "Purchase Order", path: "/procurement/purchase-order" },
      { label: "MRN", path: "/procurement/mrn" },
      { label: "Indent Status", path: "/procurement/reports/indent-status" },
      { label: "Supply Status", path: "/procurement/reports/supply-status" },
      { label: "MRN Register", path: "/procurement/reports/mrn-register" },
      { label: "Purchase Register", path: "/procurement/reports/purchase-register" },
      { label: "MRN Status", path: "/procurement/reports/mrn-status" },
    ],
  },
  {
    label: "Inventory",
    icon: Warehouse,
    children: [
      { label: "Issue Inventory", path: "/inventory/issue-inventory" },
      { label: "Issue Inventory Item", path: "/inventory/issue-inventory-item" },
      { label: "Issue Inventory Stock", path: "/inventory/reports/issue-inventory-stock" },
      { label: "Inventory Stock Analysis", path: "/inventory/reports/inventory-stock-analysis" },
    ],
  },
  {
    label: "Production",
    icon: Factory,
    children: [
      { label: "Warping Jobcard", path: "/production/warping-jobcard" },
      { label: "Warping Entry", path: "/production/warping-entry" },
      { label: "Knitting Jobcard", path: "/production/knitting-jobcard" },
      { label: "Knitting Entry", path: "/production/knitting-entry" },
      { label: "Daily Production", path: "/production/reports/daily-production" },
      { label: "Yarn Requirement", path: "/production/reports/yarn-requirement" },
      { label: "Material Forecasting", path: "/production/reports/material-forecasting" },
    ],
  },
  {
    label: "Dyeing",
    icon: Droplet,
    children: [
      { label: "Schedule", path: "/dyeing/schedule" },
      { label: "Inventory System", path: "/dyeing/inventory-system" },
      { label: "Jobcard", path: "/dyeing/jobcard" },
      { label: "Jobcard Approval", path: "/dyeing/jobcard-approval" },
      { label: "Color Chemical Request", path: "/dyeing/color-chemical-request" },
      { label: "Jobwork", path: "/dyeing/jobwork" },
      { label: "Receipts MRN", path: "/dyeing/receipts-mrn" },
      { label: "Slip", path: "/dyeing/slip" },
      { label: "Internal Challan", path: "/dyeing/internal-challan" },
      { label: "Stock", path: "/dyeing/stock" },
      { label: "APC Status", path: "/dyeing/apc-status" },
      { label: "Weighing Color Issue", path: "/dyeing/weighing-color-issue" },
      { label: "Stenter Feeding", path: "/dyeing/stenter-feeding" },
      { label: "Jobcard Reports", path: "/dyeing/reports/jobcard-reports" },
      { label: "Outstanding Orders", path: "/dyeing/reports/outstanding-orders" },
      { label: "Internal Challan Report", path: "/dyeing/reports/internal-challan-report" },
    ],
  },
  {
    label: "Lamination",
    icon: Layers,
    children: [
      { label: "Schedule", path: "/lamination/schedule" },
      { label: "Slip", path: "/lamination/slip" },
      { label: "Stock", path: "/lamination/stock" },
      { label: "Lamination Reports", path: "/lamination/reports/lamination-reports" },
      { label: "Jobcard Report", path: "/lamination/reports/jobcard-report" },
      { label: "Outstanding Schedules", path: "/lamination/reports/outstanding-schedules" },
    ],
  },
  {
    label: "Finish Stock",
    icon: Box,
    path: "/sku-finish-stock",
  },
  {
    label: "Stock",
    icon: Box,
    children: [
      { label: "Opening Greige", path: "/stock/opening-greige" },
      { label: "MRN", path: "/stock/mrn" },
      { label: "Issue", path: "/stock/issue" },
      { label: "Greige Issue", path: "/stock/greige-issue" },
      { label: "Stock Ledger", path: "/stock/reports/stock-ledger" },
    ],
  },
  {
    label: "Shipping & Invoicing",
    icon: Truck,
    children: [
      { label: "Issue Challan", path: "/shipping-invoicing/issue-challan" },
      { label: "Jobwork Challan", path: "/shipping-invoicing/jobwork-challan" },
      { label: "Challan", path: "/shipping-invoicing/challan" },
      { label: "Invoice", path: "/shipping-invoicing/invoice" },
      { label: "Invoice Receipt Reconcile", path: "/shipping-invoicing/invoice-receipt-reconcile" },
      { label: "Despatch Detail", path: "/shipping-invoicing/reports/despatch-detail" },
      { label: "Goods Vehicle Out Gate Pass", path: "/shipping-invoicing/reports/goods-vehicle-out-gate-pass" },
    ],
  },
  {
    label: "Quality",
    icon: ClipboardCheck,
    children: [
      { label: "Inspection Entry", path: "/quality/inspection-entry" },
      { label: "Test Report", path: "/quality/test-report" },
      { label: "Daily Quality", path: "/quality/reports/daily-quality" },
      { label: "Quality Report", path: "/quality/reports/quality" },
    ],
  },
  {
    label: "Master Data",
    icon: Database,
    children: [
      { label: "Company", path: "/master-data/company" },
      { label: "Employee", path: "/master-data/employee" },
      { label: "Brand", path: "/master-data/brand" },
      { label: "Customer", path: "/master-data/customer" },
      { label: "Vendor", path: "/master-data/vendor" },
      { label: "Item", path: "/master-data/item" },
      { label: "Taxation", path: "/master-data/taxation" },
      { label: "SFL/TEX-N-NET Mapping", path: "/master-data/sfl-texnet-mapping" },
      { label: "NPD", path: "/master-data/npd" },
      { label: "BOM", path: "/master-data/bom" },
      { label: "Inventory Item", path: "/master-data/inventory-item" },
      { label: "Item Description", path: "/master-data/item-description" },
      { label: "Price Master", path: "/master-data/price-master" },
      { label: "Price Report", path: "/master-data/reports/price" },
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    children: [
      { label: "Stock Report", path: "/reports/stock" },
      { label: "Production Report", path: "/reports/production" },
      { label: "Sales Report", path: "/reports/sales" },
      { label: "Other Reports", path: "/reports/other" },
    ],
  },
  {
    label: "Utility",
    icon: Settings,
    children: [
      { label: "Login Unit", path: "/utility/login-unit" },
      { label: "Change Password", path: "/utility/change-password" },
    ],
  },
]

function MenuItem({ item, level = 0 }) {
  const location = useLocation()
  const { sidebarCollapsed } = useAppStore()

  const isActive = item.path && location.pathname === item.path
  const hasActiveChild = item.children?.some((child) => location.pathname === child.path)

  const [expanded, setExpanded] = useState(() => Boolean(hasActiveChild))

  useEffect(() => {
    if (hasActiveChild) setExpanded(true)
  }, [hasActiveChild])

  const Icon = item.icon

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            hasActiveChild
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </button>
        {expanded && !sidebarCollapsed && (
          <div className="mt-1">
            {item.children.map((child, idx) => (
              <MenuItem key={idx} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
      style={{ paddingLeft: `${12 + level * 16}px` }}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {!sidebarCollapsed && <span>{item.label}</span>}
    </Link>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!sidebarCollapsed && <h1 className="text-lg font-semibold text-sidebar-foreground">ERP System</h1>}
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-sidebar-accent/50 text-sidebar-foreground">
          {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-2 overflow-y-auto h-[calc(100vh-65px)]">
        <div className="space-y-1">
          {menuItems.map((item, idx) => (
            <MenuItem key={idx} item={item} />
          ))}
        </div>
      </nav>
    </aside>
  )
}
