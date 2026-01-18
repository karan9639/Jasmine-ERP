import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { ToastContainer } from "@/components/ui/Toast"
import { useAppStore } from "@/state/useAppStore"
import { Suspense, lazy } from "react"

// Layout
import { MainLayout } from "@/components/layout/MainLayout"

// Auth pages (eager load)
import { Login } from "@/features/auth/Login"
import { CompanySelection } from "@/features/company/CompanySelection"

// Dashboard (eager load)
import { Dashboard } from "@/features/dashboard/Dashboard"

// Lazy load all feature modules
// Order Processing
const Order = lazy(() => import("@/features/orderProcessing/Order"))
const Approval = lazy(() => import("@/features/orderProcessing/Approval"))

// Procurement
const Indent = lazy(() => import("@/features/procurement/Indent"))
const PurchaseOrder = lazy(() => import("@/features/procurement/PurchaseOrder"))
const MRN = lazy(() => import("@/features/procurement/MRN"))
const IndentStatus = lazy(() => import("@/features/procurement/IndentStatus"))
const SupplyStatus = lazy(() => import("@/features/procurement/SupplyStatus"))
const MRNRegister = lazy(() => import("@/features/procurement/MRNRegister"))
const PurchaseRegister = lazy(() => import("@/features/procurement/PurchaseRegister"))

// Inventory
const IssueInventory = lazy(() => import("@/features/inventory/IssueInventory"))
const IssueInventoryItem = lazy(() => import("@/features/inventory/IssueInventoryItem"))

// Production
const WarpingEntry = lazy(() => import("@/features/production/WarpingEntry"))
const KnittingEntry = lazy(() => import("@/features/production/KnittingEntry"))

// Dyeing
const DyeingSchedule = lazy(() => import("@/features/dyeing/Schedule"))
const DyeingJobcard = lazy(() => import("@/features/dyeing/Jobcard"))

// Lamination
const LaminationSchedule = lazy(() => import("@/features/lamination/Schedule"))
const LaminationSlip = lazy(() => import("@/features/lamination/Slip"))
const LaminationStock = lazy(() => import("@/features/lamination/Stock"))

// Stock
const OpeningGreige = lazy(() => import("@/features/stock/OpeningGreige"))
const FinishStock = lazy(() => import("@/features/stock/FinishStock"))

// Shipping
const Challan = lazy(() => import("@/features/shipping/Challan"))
const Invoice = lazy(() => import("@/features/shipping/Invoice"))

// Quality
const InspectionEntry = lazy(() => import("@/features/quality/InspectionEntry"))
const TestReport = lazy(() => import("@/features/quality/TestReport"))

// Master Data
const Company = lazy(() => import("@/features/masterData/Company"))
const Customer = lazy(() => import("@/features/masterData/Customer"))
const Vendor = lazy(() => import("@/features/masterData/Vendor"))
const Item = lazy(() => import("@/features/masterData/Item"))
const Employee = lazy(() => import("@/features/masterData/Employee"))
const Brand = lazy(() => import("@/features/masterData/Brand"))
const Taxation = lazy(() => import("@/features/masterData/Taxation"))
const NPD = lazy(() => import("@/features/masterData/NPD"))
const BOM = lazy(() => import("@/features/masterData/BOM"))
const PriceMaster = lazy(() => import("@/features/masterData/PriceMaster"))

// Reports
const StockReport = lazy(() => import("@/features/reports/StockReport"))
const OrderPendencyReport = lazy(() => import("@/features/reports/OrderPendencyReport"))
const ProductionReport = lazy(() => import("@/features/reports/ProductionReport"))
const SalesReport = lazy(() => import("@/features/reports/SalesReport"))

// Utility
const ChangePassword = lazy(() => import("@/features/utility/ChangePassword"))
const LoginUnit = lazy(() => import("@/features/utility/LoginUnit"))

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

// Not Found component
function NotFound() {
  return (
    <div className="p-6">
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <h2 className="text-6xl font-bold mb-4 text-primary">404</h2>
        <h3 className="text-2xl font-semibold mb-2">Page Not Found</h3>
        <p className="text-muted-foreground mb-6">The page you are looking for does not exist or has been moved.</p>
        <a href="/" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}

// Protected route wrapper
function ProtectedRoute() {
  const { user } = useAppStore()
  if (!user) return <Navigate to="/login" replace />
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/company-selection" element={<CompanySelection />} />

        {/* Protected routes with layout */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          
          {/* Order Processing */}
          <Route path="order-processing">
            <Route path="order" element={<Order />} />
            <Route path="approval-1" element={<Approval />} />
            <Route path="approval-2" element={<Approval />} />
            <Route path="reports/order-pendency" element={<OrderPendencyReport />} />
          </Route>

          {/* Procurement */}
          <Route path="procurement">
            <Route path="indent" element={<Indent />} />
            <Route path="purchase-order" element={<PurchaseOrder />} />
            <Route path="mrn" element={<MRN />} />
            <Route path="reports/indent-status" element={<IndentStatus />} />
            <Route path="reports/supply-status" element={<SupplyStatus />} />
            <Route path="reports/mrn-register" element={<MRNRegister />} />
            <Route path="reports/purchase-register" element={<PurchaseRegister />} />
            <Route path="reports/mrn-status" element={<IndentStatus />} />
          </Route>

          {/* Inventory */}
          <Route path="inventory">
            <Route path="issue-inventory" element={<IssueInventory />} />
            <Route path="issue-inventory-item" element={<IssueInventoryItem />} />
            <Route path="reports/issue-inventory-stock" element={<StockReport />} />
            <Route path="reports/inventory-stock-analysis" element={<StockReport />} />
          </Route>

          {/* Production */}
          <Route path="production">
            <Route path="warping-jobcard" element={<WarpingEntry />} />
            <Route path="warping-entry" element={<WarpingEntry />} />
            <Route path="knitting-jobcard" element={<KnittingEntry />} />
            <Route path="knitting-entry" element={<KnittingEntry />} />
            <Route path="reports/daily-production" element={<ProductionReport />} />
            <Route path="reports/yarn-requirement" element={<ProductionReport />} />
            <Route path="reports/material-forecasting" element={<ProductionReport />} />
          </Route>

          {/* Dyeing */}
          <Route path="dyeing">
            <Route path="schedule" element={<DyeingSchedule />} />
            <Route path="inventory-system" element={<IssueInventory />} />
            <Route path="jobcard" element={<DyeingJobcard />} />
            <Route path="jobcard-approval" element={<DyeingJobcard />} />
            <Route path="color-chemical-request" element={<DyeingSchedule />} />
            <Route path="jobwork" element={<DyeingJobcard />} />
            <Route path="receipts-mrn" element={<MRN />} />
            <Route path="slip" element={<LaminationSlip />} />
            <Route path="internal-challan" element={<Challan />} />
            <Route path="stock" element={<StockReport />} />
            <Route path="apc-status" element={<DyeingSchedule />} />
            <Route path="weighing-color-issue" element={<IssueInventory />} />
            <Route path="stenter-feeding" element={<DyeingSchedule />} />
            <Route path="reports/jobcard-reports" element={<ProductionReport />} />
            <Route path="reports/outstanding-orders" element={<OrderPendencyReport />} />
            <Route path="reports/internal-challan-report" element={<SalesReport />} />
          </Route>

          {/* Lamination */}
          <Route path="lamination">
            <Route path="schedule" element={<LaminationSchedule />} />
            <Route path="slip" element={<LaminationSlip />} />
            <Route path="stock" element={<LaminationStock />} />
            <Route path="reports/lamination-reports" element={<ProductionReport />} />
            <Route path="reports/jobcard-report" element={<ProductionReport />} />
            <Route path="reports/outstanding-schedules" element={<OrderPendencyReport />} />
          </Route>

          {/* Finish Stock */}
          <Route path="sku-finish-stock" element={<FinishStock />} />

          {/* Stock */}
          <Route path="stock">
            <Route path="opening-greige" element={<OpeningGreige />} />
            <Route path="mrn" element={<MRN />} />
            <Route path="issue" element={<IssueInventory />} />
            <Route path="greige-issue" element={<IssueInventory />} />
            <Route path="reports/stock-ledger" element={<StockReport />} />
          </Route>

          {/* Shipping & Invoicing */}
          <Route path="shipping-invoicing">
            <Route path="issue-challan" element={<Challan />} />
            <Route path="jobwork-challan" element={<Challan />} />
            <Route path="challan" element={<Challan />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="invoice-receipt-reconcile" element={<Invoice />} />
            <Route path="reports/despatch-detail" element={<SalesReport />} />
            <Route path="reports/goods-vehicle-out-gate-pass" element={<SalesReport />} />
          </Route>

          {/* Quality */}
          <Route path="quality">
            <Route path="inspection-entry" element={<InspectionEntry />} />
            <Route path="test-report" element={<TestReport />} />
            <Route path="checking" element={<InspectionEntry />} />
            <Route path="check" element={<InspectionEntry />} />
            <Route path="reports/daily-quality" element={<TestReport />} />
            <Route path="reports/quality" element={<TestReport />} />
          </Route>

          {/* Master Data */}
          <Route path="master-data">
            <Route path="company" element={<Company />} />
            <Route path="customer" element={<Customer />} />
            <Route path="vendor" element={<Vendor />} />
            <Route path="item" element={<Item />} />
            <Route path="employee" element={<Employee />} />
            <Route path="brand" element={<Brand />} />
            <Route path="taxation" element={<Taxation />} />
            <Route path="sfl-texnet-mapping" element={<Item />} />
            <Route path="npd" element={<NPD />} />
            <Route path="bom" element={<BOM />} />
            <Route path="inventory-item" element={<Item />} />
            <Route path="item-description" element={<Item />} />
            <Route path="price-master" element={<PriceMaster />} />
            <Route path="reports/price" element={<SalesReport />} />
          </Route>

          {/* Reports */}
          <Route path="reports">
            <Route path="stock" element={<StockReport />} />
            <Route path="production" element={<ProductionReport />} />
            <Route path="sales" element={<SalesReport />} />
            <Route path="production-detail" element={<ProductionReport />} />
            <Route path="despatches-on-challan" element={<SalesReport />} />
            <Route path="dyed-but-djc-open" element={<ProductionReport />} />
            <Route path="lamination-production" element={<ProductionReport />} />
          </Route>

          {/* Utility */}
          <Route path="utility">
            <Route path="login-unit" element={<LoginUnit />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
