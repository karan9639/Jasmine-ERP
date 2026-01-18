'use client';

import { useState, useEffect, useMemo } from "react"
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
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/",
  },
  {
    id: "order-processing",
    label: "Order Processing",
    icon: ShoppingCart,
    children: [
      { id: "order", label: "Order", path: "/order-processing/order" },
      { id: "approval-1", label: "Approval 1", path: "/order-processing/approval-1" },
      { id: "approval-2", label: "Approval 2", path: "/order-processing/approval-2" },
      { id: "order-pendency", label: "Order Pendency Report", path: "/order-processing/reports/order-pendency" },
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    icon: Package,
    children: [
      { id: "indent", label: "Indent", path: "/procurement/indent" },
      { id: "purchase-order", label: "Purchase Order", path: "/procurement/purchase-order" },
      { id: "mrn", label: "MRN", path: "/procurement/mrn" },
      { id: "indent-status", label: "Indent Status", path: "/procurement/reports/indent-status" },
      { id: "supply-status", label: "Supply Status", path: "/procurement/reports/supply-status" },
      { id: "mrn-register", label: "MRN Register", path: "/procurement/reports/mrn-register" },
      { id: "purchase-register", label: "Purchase Register", path: "/procurement/reports/purchase-register" },
      { id: "mrn-status", label: "MRN Status", path: "/procurement/reports/mrn-status" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Warehouse,
    children: [
      { id: "issue-inventory", label: "Issue Inventory", path: "/inventory/issue-inventory" },
      { id: "issue-inventory-item", label: "Issue Inventory Item", path: "/inventory/issue-inventory-item" },
      { id: "issue-inventory-stock", label: "Issue Inventory Stock", path: "/inventory/reports/issue-inventory-stock" },
      { id: "inventory-stock-analysis", label: "Inventory Stock Analysis", path: "/inventory/reports/inventory-stock-analysis" },
    ],
  },
  {
    id: "production",
    label: "Production",
    icon: Factory,
    children: [
      { id: "warping-jobcard", label: "Warping Jobcard", path: "/production/warping-jobcard" },
      { id: "warping-entry", label: "Warping Entry", path: "/production/warping-entry" },
      { id: "knitting-jobcard", label: "Knitting Jobcard", path: "/production/knitting-jobcard" },
      { id: "knitting-entry", label: "Knitting Entry", path: "/production/knitting-entry" },
      { id: "daily-production", label: "Daily Production", path: "/production/reports/daily-production" },
      { id: "yarn-requirement", label: "Yarn Requirement", path: "/production/reports/yarn-requirement" },
      { id: "material-forecasting", label: "Material Forecasting", path: "/production/reports/material-forecasting" },
    ],
  },
  {
    id: "dyeing",
    label: "Dyeing",
    icon: Droplet,
    children: [
      { id: "dyeing-schedule", label: "Schedule", path: "/dyeing/schedule" },
      { id: "dyeing-inventory", label: "Inventory System", path: "/dyeing/inventory-system" },
      { id: "dyeing-jobcard", label: "Jobcard", path: "/dyeing/jobcard" },
      { id: "dyeing-jobcard-approval", label: "Jobcard Approval", path: "/dyeing/jobcard-approval" },
      { id: "color-chemical", label: "Color Chemical Request", path: "/dyeing/color-chemical-request" },
      { id: "dyeing-jobwork", label: "Jobwork", path: "/dyeing/jobwork" },
      { id: "dyeing-mrn", label: "Receipts MRN", path: "/dyeing/receipts-mrn" },
      { id: "dyeing-slip", label: "Slip", path: "/dyeing/slip" },
      { id: "dyeing-internal-challan", label: "Internal Challan", path: "/dyeing/internal-challan" },
      { id: "dyeing-stock", label: "Stock", path: "/dyeing/stock" },
      { id: "apc-status", label: "APC Status", path: "/dyeing/apc-status" },
      { id: "weighing-color", label: "Weighing Color Issue", path: "/dyeing/weighing-color-issue" },
      { id: "stenter-feeding", label: "Stenter Feeding", path: "/dyeing/stenter-feeding" },
      { id: "dyeing-jobcard-reports", label: "Jobcard Reports", path: "/dyeing/reports/jobcard-reports" },
      { id: "dyeing-outstanding", label: "Outstanding Orders", path: "/dyeing/reports/outstanding-orders" },
      { id: "dyeing-challan-report", label: "Internal Challan Report", path: "/dyeing/reports/internal-challan-report" },
    ],
  },
  {
    id: "lamination",
    label: "Lamination",
    icon: Layers,
    children: [
      { id: "lamination-schedule", label: "Schedule", path: "/lamination/schedule" },
      { id: "lamination-slip", label: "Slip", path: "/lamination/slip" },
      { id: "lamination-stock", label: "Stock", path: "/lamination/stock" },
      { id: "lamination-reports", label: "Lamination Reports", path: "/lamination/reports/lamination-reports" },
      { id: "lamination-jobcard-report", label: "Jobcard Report", path: "/lamination/reports/jobcard-report" },
      { id: "lamination-outstanding", label: "Outstanding Schedules", path: "/lamination/reports/outstanding-schedules" },
    ],
  },
  {
    id: "finish-stock",
    label: "Finish Stock",
    icon: Box,
    path: "/sku-finish-stock",
  },
  {
    id: "stock",
    label: "Stock",
    icon: Box,
    children: [
      { id: "opening-greige", label: "Opening Greige", path: "/stock/opening-greige" },
      { id: "stock-mrn", label: "MRN", path: "/stock/mrn" },
      { id: "stock-issue", label: "Issue", path: "/stock/issue" },
      { id: "greige-issue", label: "Greige Issue", path: "/stock/greige-issue" },
      { id: "stock-ledger", label: "Stock Ledger", path: "/stock/reports/stock-ledger" },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Invoicing",
    icon: Truck,
    children: [
      { id: "issue-challan", label: "Issue Challan", path: "/shipping-invoicing/issue-challan" },
      { id: "jobwork-challan", label: "Jobwork Challan", path: "/shipping-invoicing/jobwork-challan" },
      { id: "challan", label: "Challan", path: "/shipping-invoicing/challan" },
      { id: "invoice", label: "Invoice", path: "/shipping-invoicing/invoice" },
      { id: "invoice-reconcile", label: "Invoice Receipt Reconcile", path: "/shipping-invoicing/invoice-receipt-reconcile" },
      { id: "despatch-detail", label: "Despatch Detail", path: "/shipping-invoicing/reports/despatch-detail" },
      { id: "gate-pass", label: "Goods Vehicle Out Gate Pass", path: "/shipping-invoicing/reports/goods-vehicle-out-gate-pass" },
    ],
  },
  {
    id: "quality",
    label: "Quality",
    icon: ClipboardCheck,
    children: [
      { id: "inspection-entry", label: "Inspection Entry", path: "/quality/inspection-entry" },
      { id: "test-report", label: "Test Report", path: "/quality/test-report" },
      { id: "quality-checking", label: "Quality Checking", path: "/quality/checking" },
      { id: "quality-check", label: "Quality Check", path: "/quality/check" },
      { id: "daily-quality", label: "Daily Quality", path: "/quality/reports/daily-quality" },
      { id: "quality-report", label: "Quality Report", path: "/quality/reports/quality" },
    ],
  },
  {
    id: "master-data",
    label: "Master Data",
    icon: Database,
    children: [
      { id: "company", label: "Company", path: "/master-data/company" },
      { id: "customer", label: "Customer", path: "/master-data/customer" },
      { id: "vendor", label: "Vendor", path: "/master-data/vendor" },
      { id: "item", label: "Item", path: "/master-data/item" },
      { id: "employee", label: "Employee", path: "/master-data/employee" },
      { id: "brand", label: "Brand", path: "/master-data/brand" },
      { id: "taxation", label: "Taxation", path: "/master-data/taxation" },
      { id: "sfl-mapping", label: "SFL/TEX-N-NET Mapping", path: "/master-data/sfl-texnet-mapping" },
      { id: "npd", label: "NPD", path: "/master-data/npd" },
      { id: "bom", label: "BOM", path: "/master-data/bom" },
      { id: "inventory-item", label: "Inventory Item", path: "/master-data/inventory-item" },
      { id: "item-description", label: "Item Description", path: "/master-data/item-description" },
      { id: "price-master", label: "Price Master", path: "/master-data/price-master" },
      { id: "price-report", label: "Price Report", path: "/master-data/reports/price" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    children: [
      { id: "stock-report", label: "Stock Report", path: "/reports/stock" },
      { id: "production-report", label: "Production Report", path: "/reports/production" },
      { id: "sales-report", label: "Sales Report", path: "/reports/sales" },
      { id: "production-detail", label: "Production Detail", path: "/reports/production-detail" },
      { id: "despatches-challan", label: "Despatches on Challan", path: "/reports/despatches-on-challan" },
      { id: "dyed-djc", label: "Dyed but DJC Open", path: "/reports/dyed-but-djc-open" },
      { id: "lamination-production", label: "Lamination Production", path: "/reports/lamination-production" },
    ],
  },
  {
    id: "utility",
    label: "Utility",
    icon: Settings,
    children: [
      { id: "login-unit", label: "Login Unit", path: "/utility/login-unit" },
      { id: "change-password", label: "Change Password", path: "/utility/change-password" },
    ],
  },
]

const SIDEBAR_STATE_KEY = "jasmine_erp_sidebar_state"

function MenuItem({ item, level = 0, expandedMenus, toggleMenu }) {
  const location = useLocation()
  const { sidebarCollapsed } = useAppStore()

  const isActive = item.path && location.pathname === item.path
  const hasActiveChild = item.children?.some((child) =>
    location.pathname === child.path || location.pathname.startsWith(child.path + "/")
  )
  const isExpanded = expandedMenus.includes(item.id)

  useEffect(() => {
    if (hasActiveChild && !sidebarCollapsed && !isExpanded) {
      toggleMenu(item.id)
    }
  }, [hasActiveChild, sidebarCollapsed])

  const Icon = item.icon

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => toggleMenu(item.id)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            hasActiveChild
              ? "bg-sidebar-accent/20 text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/10"
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </button>
        {isExpanded && !sidebarCollapsed && (
          <div className="mt-1">
            {item.children.map((child) => (
              <MenuItem
                key={child.id}
                item={child}
                level={level + 1}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
              />
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
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/10"
      }`}
      style={{ paddingLeft: `${12 + level * 16}px` }}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const [expandedMenus, setExpandedMenus] = useState(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(expandedMenus))
  }, [expandedMenus])

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    )
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <h1 className="text-lg font-semibold text-sidebar-foreground">Jasmine ERP</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent/10 text-sidebar-foreground transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-2 overflow-y-auto h-[calc(100vh-65px)]">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
            />
          ))}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
