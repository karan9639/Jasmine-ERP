import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { ToastContainer } from "@/components/ui/Toast"
import { useAppStore } from "@/state/useAppStore"

// Auth
import { Login } from "@/features/auth/Login"
import { CompanySelection } from "@/features/company/CompanySelection"

// Dashboard
import { Dashboard } from "@/features/dashboard/Dashboard"

// Order Processing
import { Order } from "@/features/orderProcessing/Order"
import { Approval } from "@/features/orderProcessing/Approval"

// Procurement
import { Indent } from "@/features/procurement/Indent"
import { PurchaseOrder } from "@/features/procurement/PurchaseOrder"
import { MRN } from "@/features/procurement/MRN"

// Production
import { WarpingEntry } from "@/features/production/WarpingEntry"
import { KnittingEntry } from "@/features/production/KnittingEntry"

// Dyeing
import { DyeingSchedule } from "@/features/dyeing/Schedule"
import { DyeingJobcard } from "@/features/dyeing/Jobcard"

// Lamination
import { LaminationSchedule } from "@/features/lamination/Schedule"
import { LaminationSlip } from "@/features/lamination/Slip"
import { LaminationStock } from "@/features/lamination/Stock"

// Inventory
import { IssueInventory } from "@/features/inventory/IssueInventory"

// Stock
import { OpeningGreige } from "@/features/stock/OpeningGreige"

// Shipping
import { Challan } from "@/features/shipping/Challan"
import { Invoice } from "@/features/shipping/Invoice"

// Quality
import InspectionEntry from "@/features/quality/InspectionEntry"
import TestReport from "@/features/quality/TestReport"

// Master Data
import Company from "@/features/masterData/Company"
import Customer from "@/features/masterData/Customer"
import Vendor from "@/features/masterData/Vendor"
import Item from "@/features/masterData/Item"

// Reports
import StockReport from "@/features/reports/StockReport"
import OrderPendencyReport from "@/features/reports/OrderPendencyReport"
import ProductionReport from "@/features/reports/ProductionReport"
import SalesReport from "@/features/reports/SalesReport"

function Placeholder({ title }) {
  return (
    <div className="p-6">
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">This module is under development</p>
      </div>
    </div>
  )
}

function PublicOnly({ children }) {
  const { user } = useAppStore()
  if (user) return <Navigate to="/" replace />
  return children
}

function ProtectedRoute() {
  const { user } = useAppStore()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

function RequireCompanySelection() {
  const { unit, financialYear } = useAppStore()
  const location = useLocation()

  // If unit/FY isn't selected yet, force the selection screen (but don't loop).
  if ((!unit || !financialYear) && location.pathname !== "/company-selection") {
    return <Navigate to="/company-selection" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/company-selection" element={<CompanySelection />} />

        <Route element={<RequireCompanySelection />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />

            {/* Order Processing */}
            <Route path="order-processing/order" element={<Order />} />
            <Route path="order-processing/approval-1" element={<Approval level={1} />} />
            <Route path="order-processing/approval-2" element={<Approval level={2} />} />
            <Route path="order-processing/reports/order-pendency" element={<OrderPendencyReport />} />

            {/* Procurement */}
            <Route path="procurement/indent" element={<Indent />} />
            <Route path="procurement/purchase-order" element={<PurchaseOrder />} />
            <Route path="procurement/mrn" element={<MRN />} />
            <Route path="procurement/reports/*" element={<Placeholder title="Procurement Reports" />} />

            {/* Inventory */}
            <Route path="inventory/issue-inventory" element={<IssueInventory />} />
            <Route path="inventory/*" element={<Placeholder title="Inventory Module" />} />

            {/* Production */}
            <Route path="production/warping-entry" element={<WarpingEntry />} />
            <Route path="production/knitting-entry" element={<KnittingEntry />} />
            <Route path="production/*" element={<Placeholder title="Production Module" />} />

            {/* Dyeing */}
            <Route path="dyeing/schedule" element={<DyeingSchedule />} />
            <Route path="dyeing/jobcard" element={<DyeingJobcard />} />
            <Route path="dyeing/*" element={<Placeholder title="Dyeing Module" />} />

            {/* Lamination */}
            <Route path="lamination/schedule" element={<LaminationSchedule />} />
            <Route path="lamination/slip" element={<LaminationSlip />} />
            <Route path="lamination/stock" element={<LaminationStock />} />
            <Route path="lamination/*" element={<Placeholder title="Lamination Module" />} />

            {/* Stock */}
            <Route path="stock/opening-greige" element={<OpeningGreige />} />
            <Route path="stock/*" element={<Placeholder title="Stock Module" />} />
            <Route path="sku-finish-stock" element={<Placeholder title="Finish Stock" />} />

            {/* Shipping & Invoicing */}
            <Route path="shipping-invoicing/challan" element={<Challan />} />
            <Route path="shipping-invoicing/invoice" element={<Invoice />} />
            <Route path="shipping-invoicing/*" element={<Placeholder title="Shipping & Invoicing Module" />} />

            {/* Quality */}
            <Route path="quality/inspection-entry" element={<InspectionEntry />} />
            <Route path="quality/test-report" element={<TestReport />} />
            <Route path="quality/*" element={<Placeholder title="Quality Module" />} />

            {/* Master Data */}
            <Route path="master-data/company" element={<Company />} />
            <Route path="master-data/customer" element={<Customer />} />
            <Route path="master-data/vendor" element={<Vendor />} />
            <Route path="master-data/item" element={<Item />} />
            <Route path="master-data/*" element={<Placeholder title="Master Data Module" />} />

            {/* Reports */}
            <Route path="reports/stock" element={<StockReport />} />
            <Route path="reports/production" element={<ProductionReport />} />
            <Route path="reports/sales" element={<SalesReport />} />
            <Route path="reports/*" element={<Placeholder title="Reports" />} />

            {/* Utility */}
            <Route path="utility/*" element={<Placeholder title="Utility" />} />

            <Route path="*" element={<Placeholder title="Page Not Found" />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  )
}
