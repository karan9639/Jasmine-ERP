// API Service Layer with Complete Mock Data Store
// Supports all ERP modules with localStorage persistence

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"
const STORAGE_KEY = "jasmine_erp_data"

// Simulate network delay
const simulateDelay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// Initialize or load mock store from localStorage
function initMockStore() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fall through to default
    }
  }
  return getDefaultStore()
}

function getDefaultStore() {
  return {
    // Orders
    orders: [
      { id: 1, orderNo: "SO-2024-001", orderDate: "2024-01-15", customerId: 1, customerName: "XYZ Industries", status: "Pending", totalAmount: 150000, series: "SO", remarks: "" },
      { id: 2, orderNo: "SO-2024-002", orderDate: "2024-01-16", customerId: 2, customerName: "ABC Textiles", status: "Approved", totalAmount: 250000, series: "SO", remarks: "" },
      { id: 3, orderNo: "SO-2024-003", orderDate: "2024-01-17", customerId: 3, customerName: "PQR Fabrics", status: "Processing", totalAmount: 180000, series: "EO", remarks: "" },
    ],
    
    // Customers
    customers: [
      { id: 1, customerCode: "CUST001", customerName: "XYZ Industries", contactPerson: "John Doe", address1: "123 Industrial Area", city: "Delhi", state: "Delhi", pincode: "110001", country: "India", phone: "011-12345678", mobile: "9876543210", email: "xyz@example.com", gstin: "07AABCU9603R1ZM", pan: "AABCU9603R", creditLimit: 500000, creditDays: 30, paymentTerms: "Net 30", active: true },
      { id: 2, customerCode: "CUST002", customerName: "ABC Textiles", contactPerson: "Jane Smith", address1: "456 Textile Hub", city: "Mumbai", state: "Maharashtra", pincode: "400001", country: "India", phone: "022-87654321", mobile: "9876543211", email: "abc@example.com", gstin: "27AABCT9603R1ZN", pan: "AABCT9603R", creditLimit: 750000, creditDays: 45, paymentTerms: "Net 45", active: true },
      { id: 3, customerCode: "CUST003", customerName: "PQR Fabrics", contactPerson: "Bob Wilson", address1: "789 Fabric Lane", city: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India", phone: "079-11223344", mobile: "9876543212", email: "pqr@example.com", gstin: "24AABCP9603R1ZO", pan: "AABCP9603R", creditLimit: 300000, creditDays: 30, paymentTerms: "Net 30", active: true },
    ],
    
    // Vendors
    vendors: [
      { id: 1, vendorCode: "VEN001", vendorName: "Raw Materials Co", contactPerson: "Mike Johnson", address1: "100 Supplier Street", city: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India", phone: "044-55667788", mobile: "9876543213", email: "rawmat@example.com", gstin: "33AABCV9603R1ZP", pan: "AABCV9603R", creditLimit: 1000000, paymentTerms: "Advance", active: true },
      { id: 2, vendorCode: "VEN002", vendorName: "Yarn Suppliers Ltd", contactPerson: "Sarah Brown", address1: "200 Yarn Avenue", city: "Coimbatore", state: "Tamil Nadu", pincode: "641001", country: "India", phone: "0422-99887766", mobile: "9876543214", email: "yarn@example.com", gstin: "33AABCY9603R1ZQ", pan: "AABCY9603R", creditLimit: 800000, paymentTerms: "Net 15", active: true },
      { id: 3, vendorCode: "VEN003", vendorName: "Dye Works Inc", contactPerson: "Tom Davis", address1: "300 Color Street", city: "Surat", state: "Gujarat", pincode: "395001", country: "India", phone: "0261-11223344", mobile: "9876543215", email: "dye@example.com", gstin: "24AABCD9603R1ZR", pan: "AABCD9603R", creditLimit: 500000, paymentTerms: "Net 30", active: true },
    ],
    
    // Items
    items: [
      { id: 1, itemCode: "ITEM001", itemName: "Cotton Yarn 30s", category: "Yarn", uom: "KG", rate: 250, hsnCode: "52051200", gstRate: 5, active: true },
      { id: 2, itemCode: "ITEM002", itemName: "Polyester Fabric", category: "Fabric", uom: "MTR", rate: 150, hsnCode: "54077100", gstRate: 5, active: true },
      { id: 3, itemCode: "ITEM003", itemName: "Nylon Thread", category: "Accessories", uom: "KG", rate: 180, hsnCode: "54023200", gstRate: 12, active: true },
      { id: 4, itemCode: "ITEM004", itemName: "Cotton Fabric Grey", category: "Greige", uom: "MTR", rate: 120, hsnCode: "52081100", gstRate: 5, active: true },
      { id: 5, itemCode: "ITEM005", itemName: "Reactive Dye Red", category: "Dye", uom: "KG", rate: 450, hsnCode: "32041200", gstRate: 18, active: true },
    ],
    
    // Indents
    indents: [
      { id: 1, indentNo: "IND-2024-001", indentDate: "2024-01-10", department: "Production", requestedBy: "John Doe", status: "Pending", remarks: "Urgent requirement", items: [{ itemId: 1, itemName: "Cotton Yarn 30s", qty: 100, uom: "KG" }] },
      { id: 2, indentNo: "IND-2024-002", indentDate: "2024-01-11", department: "Dyeing", requestedBy: "Jane Smith", status: "Approved", remarks: "", items: [{ itemId: 5, itemName: "Reactive Dye Red", qty: 50, uom: "KG" }] },
      { id: 3, indentNo: "IND-2024-003", indentDate: "2024-01-12", department: "Weaving", requestedBy: "Bob Wilson", status: "Pending", remarks: "For order SO-2024-001", items: [{ itemId: 3, itemName: "Nylon Thread", qty: 25, uom: "KG" }] },
    ],
    
    // Purchase Orders
    purchaseOrders: [
      { id: 1, poNo: "PO-2024-001", poDate: "2024-01-12", vendorId: 1, vendorName: "Raw Materials Co", indentNo: "IND-2024-001", status: "Open", totalAmount: 25000, gstAmount: 1250, grandTotal: 26250, items: [{ itemId: 1, itemName: "Cotton Yarn 30s", qty: 100, rate: 250, amount: 25000 }] },
      { id: 2, poNo: "PO-2024-002", poDate: "2024-01-13", vendorId: 2, vendorName: "Yarn Suppliers Ltd", indentNo: "IND-2024-002", status: "Partial", totalAmount: 22500, gstAmount: 4050, grandTotal: 26550, items: [{ itemId: 5, itemName: "Reactive Dye Red", qty: 50, rate: 450, amount: 22500 }] },
    ],
    
    // MRNs
    mrns: [
      { id: 1, mrnNo: "MRN-2024-001", mrnDate: "2024-01-14", vendorId: 1, vendorName: "Raw Materials Co", poNo: "PO-2024-001", status: "Completed", challanNo: "CH-001", challanDate: "2024-01-14", items: [{ itemId: 1, itemName: "Cotton Yarn 30s", orderedQty: 100, receivedQty: 100, rate: 250 }] },
      { id: 2, mrnNo: "MRN-2024-002", mrnDate: "2024-01-15", vendorId: 2, vendorName: "Yarn Suppliers Ltd", poNo: "PO-2024-002", status: "Partial", challanNo: "CH-002", challanDate: "2024-01-15", items: [{ itemId: 5, itemName: "Reactive Dye Red", orderedQty: 50, receivedQty: 30, rate: 450 }] },
    ],
    
    // Stock
    stock: [
      { id: 1, itemCode: "ITEM001", itemName: "Cotton Yarn 30s", category: "Yarn", uom: "KG", openingStock: 1000, received: 500, issued: 300, closingStock: 1200, rate: 250, value: 300000, location: "WH-01", rackNo: "R-001" },
      { id: 2, itemCode: "ITEM002", itemName: "Polyester Fabric", category: "Fabric", uom: "MTR", openingStock: 2000, received: 1000, issued: 800, closingStock: 2200, rate: 150, value: 330000, location: "WH-01", rackNo: "R-002" },
      { id: 3, itemCode: "ITEM003", itemName: "Nylon Thread", category: "Accessories", uom: "KG", openingStock: 500, received: 200, issued: 150, closingStock: 550, rate: 180, value: 99000, location: "WH-02", rackNo: "R-003" },
      { id: 4, itemCode: "ITEM004", itemName: "Cotton Fabric Grey", category: "Greige", uom: "MTR", openingStock: 3000, received: 1500, issued: 1200, closingStock: 3300, rate: 120, value: 396000, location: "WH-01", rackNo: "R-004" },
      { id: 5, itemCode: "ITEM005", itemName: "Reactive Dye Red", category: "Dye", uom: "KG", openingStock: 100, received: 30, issued: 40, closingStock: 90, rate: 450, value: 40500, location: "WH-02", rackNo: "R-005" },
    ],
    
    // Production - Warping
    warpingJobcards: [
      { id: 1, jobcardNo: "WJC-2024-001", jobcardDate: "2024-01-15", orderNo: "SO-2024-001", machineNo: "WM-01", item: "Cotton Fabric", design: "Plain", width: 58, totalEnds: 2400, beams: 4, status: "In Progress" },
      { id: 2, jobcardNo: "WJC-2024-002", jobcardDate: "2024-01-16", orderNo: "SO-2024-002", machineNo: "WM-02", item: "Polyester Fabric", design: "Twill", width: 60, totalEnds: 2800, beams: 5, status: "Completed" },
    ],
    
    warpingEntries: [
      { id: 1, entryNo: "WE-2024-001", entryDate: "2024-01-15", jobcardNo: "WJC-2024-001", machineNo: "WM-01", beamNo: "B-001", yarnLot: "YL-001", meters: 1500, kgs: 45, operator: "Ram Kumar", shift: "A" },
      { id: 2, entryNo: "WE-2024-002", entryDate: "2024-01-16", jobcardNo: "WJC-2024-002", machineNo: "WM-02", beamNo: "B-002", yarnLot: "YL-002", meters: 2000, kgs: 60, operator: "Shyam Singh", shift: "B" },
    ],
    
    // Production - Knitting
    knittingJobcards: [
      { id: 1, jobcardNo: "KJC-2024-001", jobcardDate: "2024-01-15", orderNo: "SO-2024-001", machineNo: "KM-01", item: "Cotton Jersey", gsm: 180, width: 72, status: "In Progress" },
      { id: 2, jobcardNo: "KJC-2024-002", jobcardDate: "2024-01-16", orderNo: "SO-2024-003", machineNo: "KM-02", item: "Interlock", gsm: 220, width: 68, status: "Pending" },
    ],
    
    knittingEntries: [
      { id: 1, entryNo: "KE-2024-001", entryDate: "2024-01-15", jobcardNo: "KJC-2024-001", machineNo: "KM-01", rollNo: "RL-001", meters: 500, kgs: 30, gsm: 180, operator: "Vijay", shift: "A" },
    ],
    
    // Dyeing
    dyeingSchedules: [
      { id: 1, scheduleNo: "DS-2024-001", scheduleDate: "2024-01-17", orderNo: "SO-2024-001", item: "Cotton Fabric", color: "Navy Blue", qty: 1000, machineNo: "DM-01", status: "Scheduled" },
      { id: 2, scheduleNo: "DS-2024-002", scheduleDate: "2024-01-18", orderNo: "SO-2024-002", item: "Polyester Fabric", color: "Red", qty: 800, machineNo: "DM-02", status: "In Progress" },
    ],
    
    dyeingJobcards: [
      { id: 1, jobcardNo: "DJC-2024-001", jobcardDate: "2024-01-17", scheduleNo: "DS-2024-001", machineNo: "DM-01", batchNo: "DB-001", color: "Navy Blue", loadKgs: 200, status: "Processing" },
      { id: 2, jobcardNo: "DJC-2024-002", jobcardDate: "2024-01-18", scheduleNo: "DS-2024-002", machineNo: "DM-02", batchNo: "DB-002", color: "Red", loadKgs: 180, status: "Completed" },
    ],
    
    // Lamination
    laminationSchedules: [
      { id: 1, scheduleNo: "LS-2024-001", scheduleDate: "2024-01-19", orderNo: "SO-2024-001", item: "Laminated Cotton", baseItem: "Cotton Fabric", filmType: "PE Film", qty: 500, status: "Scheduled" },
    ],
    
    laminationSlips: [
      { id: 1, slipNo: "LSP-2024-001", slipDate: "2024-01-19", scheduleNo: "LS-2024-001", machineNo: "LM-01", rollNo: "LR-001", meters: 250, kgs: 35, operator: "Mohan" },
    ],
    
    laminationStock: [
      { id: 1, itemCode: "LAM001", itemName: "Laminated Cotton Blue", category: "Laminated", uom: "MTR", stockQty: 500, rate: 180, value: 90000 },
    ],
    
    // Shipping
    challans: [
      { id: 1, challanNo: "DC-2024-001", challanDate: "2024-01-20", customerId: 1, customerName: "XYZ Industries", orderNo: "SO-2024-001", vehicleNo: "MH-12-AB-1234", driverName: "Raju", status: "Dispatched", items: [{ item: "Cotton Fabric", qty: 200, uom: "MTR" }] },
    ],
    
    invoices: [
      { id: 1, invoiceNo: "INV-2024-001", invoiceDate: "2024-01-20", customerId: 1, customerName: "XYZ Industries", challanNo: "DC-2024-001", totalAmount: 30000, gstAmount: 1500, grandTotal: 31500, status: "Pending" },
    ],
    
    // Quality
    qualityChecks: [
      { id: 1, checkNo: "QC-2024-001", checkDate: "2024-01-18", item: "Cotton Fabric Navy Blue", batch: "DB-001", parameter: "Color Fastness", result: "Pass", grade: "A", inspector: "Ramesh" },
      { id: 2, checkNo: "QC-2024-002", checkDate: "2024-01-18", item: "Cotton Fabric Navy Blue", batch: "DB-001", parameter: "Shrinkage", result: "Pass", grade: "A", inspector: "Ramesh" },
    ],
    
    testReports: [
      { id: 1, reportNo: "TR-2024-001", reportDate: "2024-01-18", item: "Cotton Fabric Navy Blue", batch: "DB-001", tests: ["Color Fastness", "Shrinkage", "Tensile Strength"], overallResult: "Pass", remarks: "All parameters within limits" },
    ],
    
    // Master Data
    employees: [
      { id: 1, empCode: "EMP001", empName: "Rajesh Kumar", department: "Production", designation: "Supervisor", joinDate: "2020-01-15", phone: "9876543210", email: "rajesh@example.com", active: true },
      { id: 2, empCode: "EMP002", empName: "Priya Sharma", department: "Quality", designation: "Inspector", joinDate: "2021-03-01", phone: "9876543211", email: "priya@example.com", active: true },
      { id: 3, empCode: "EMP003", empName: "Amit Patel", department: "Dyeing", designation: "Operator", joinDate: "2019-06-15", phone: "9876543212", email: "amit@example.com", active: true },
    ],
    
    brands: [
      { id: 1, brandCode: "BRD001", brandName: "Premium", description: "Premium quality products", active: true },
      { id: 2, brandCode: "BRD002", brandName: "Standard", description: "Standard quality products", active: true },
      { id: 3, brandCode: "BRD003", brandName: "Economy", description: "Economy range products", active: true },
    ],
    
    companies: [
      { id: 1, companyCode: "JASMINE", companyName: "Jasmine Textiles Pvt Ltd", address: "Industrial Area, Phase 1", city: "Surat", state: "Gujarat", pincode: "395003", phone: "0261-1234567", email: "info@jasminetextiles.com", gstin: "24AABCJ1234R1ZS", pan: "AABCJ1234R" },
    ],
    
    taxation: [
      { id: 1, taxCode: "GST5", taxName: "GST 5%", cgst: 2.5, sgst: 2.5, igst: 5, active: true },
      { id: 2, taxCode: "GST12", taxName: "GST 12%", cgst: 6, sgst: 6, igst: 12, active: true },
      { id: 3, taxCode: "GST18", taxName: "GST 18%", cgst: 9, sgst: 9, igst: 18, active: true },
    ],
    
    bom: [
      { id: 1, bomCode: "BOM001", productName: "Cotton Fabric Finished", items: [{ itemId: 1, itemName: "Cotton Yarn 30s", qty: 1.2, uom: "KG" }, { itemId: 5, itemName: "Reactive Dye Red", qty: 0.05, uom: "KG" }] },
    ],
    
    priceMaster: [
      { id: 1, customerId: 1, customerName: "XYZ Industries", itemId: 2, itemName: "Polyester Fabric", rate: 145, effectiveFrom: "2024-01-01", effectiveTo: "2024-12-31" },
      { id: 2, customerId: 2, customerName: "ABC Textiles", itemId: 2, itemName: "Polyester Fabric", rate: 148, effectiveFrom: "2024-01-01", effectiveTo: "2024-12-31" },
    ],
    
    // Issue Inventory
    issueInventory: [
      { id: 1, issueNo: "ISS-2024-001", issueDate: "2024-01-16", department: "Dyeing", issuedTo: "Amit Patel", status: "Issued", items: [{ itemId: 5, itemName: "Reactive Dye Red", qty: 10, uom: "KG" }] },
    ],
    
    // Greige Stock
    greigeStock: [
      { id: 1, lotNo: "GL-2024-001", itemCode: "ITEM004", itemName: "Cotton Fabric Grey", meters: 2500, kgs: 150, width: 58, rackNo: "GR-001", status: "Available" },
      { id: 2, lotNo: "GL-2024-002", itemCode: "ITEM004", itemName: "Cotton Fabric Grey", meters: 1800, kgs: 108, width: 60, rackNo: "GR-002", status: "In Process" },
    ],
    
    // Finish Stock
    finishStock: [
      { id: 1, skuCode: "SKU001", itemName: "Cotton Fabric Navy Blue", color: "Navy Blue", width: 58, gsm: 150, stockQty: 500, uom: "MTR", rate: 180, value: 90000, location: "FS-01" },
      { id: 2, skuCode: "SKU002", itemName: "Cotton Fabric Red", color: "Red", width: 60, gsm: 160, stockQty: 350, uom: "MTR", rate: 185, value: 64750, location: "FS-02" },
    ],
  }
}

let mockStore = initMockStore()

// Persist to localStorage
function persistStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStore))
}

// Generic CRUD operations
function createCrudOperations(resource) {
  return {
    getAll: async (filters = {}) => {
      await simulateDelay()
      let data = mockStore[resource] || []
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          data = data.filter((item) => 
            String(item[key] || "").toLowerCase().includes(String(value).toLowerCase())
          )
        }
      })
      return data
    },
    
    getById: async (id) => {
      await simulateDelay()
      return mockStore[resource]?.find((item) => item.id === Number(id)) || null
    },
    
    create: async (data) => {
      await simulateDelay()
      const newItem = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      }
      if (!mockStore[resource]) mockStore[resource] = []
      mockStore[resource].push(newItem)
      persistStore()
      return newItem
    },
    
    update: async (id, data) => {
      await simulateDelay()
      const index = mockStore[resource]?.findIndex((item) => item.id === Number(id))
      if (index !== -1) {
        mockStore[resource][index] = {
          ...mockStore[resource][index],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        persistStore()
        return mockStore[resource][index]
      }
      return null
    },
    
    delete: async (id) => {
      await simulateDelay()
      const index = mockStore[resource]?.findIndex((item) => item.id === Number(id))
      if (index !== -1) {
        const deleted = mockStore[resource].splice(index, 1)
        persistStore()
        return deleted[0]
      }
      return null
    },
  }
}

// Export API object with all modules
export const api = {
  // Order Processing
  orders: createCrudOperations("orders"),
  
  // Procurement
  indents: createCrudOperations("indents"),
  purchaseOrders: createCrudOperations("purchaseOrders"),
  mrns: createCrudOperations("mrns"),
  
  // Master Data
  customers: createCrudOperations("customers"),
  vendors: createCrudOperations("vendors"),
  items: createCrudOperations("items"),
  employees: createCrudOperations("employees"),
  brands: createCrudOperations("brands"),
  companies: createCrudOperations("companies"),
  taxation: createCrudOperations("taxation"),
  bom: createCrudOperations("bom"),
  priceMaster: createCrudOperations("priceMaster"),
  
  // Inventory
  stock: createCrudOperations("stock"),
  issueInventory: createCrudOperations("issueInventory"),
  greigeStock: createCrudOperations("greigeStock"),
  finishStock: createCrudOperations("finishStock"),
  
  // Production
  warpingJobcards: createCrudOperations("warpingJobcards"),
  warpingEntries: createCrudOperations("warpingEntries"),
  knittingJobcards: createCrudOperations("knittingJobcards"),
  knittingEntries: createCrudOperations("knittingEntries"),
  
  // Dyeing
  dyeingSchedules: createCrudOperations("dyeingSchedules"),
  dyeingJobcards: createCrudOperations("dyeingJobcards"),
  
  // Lamination
  laminationSchedules: createCrudOperations("laminationSchedules"),
  laminationSlips: createCrudOperations("laminationSlips"),
  laminationStock: createCrudOperations("laminationStock"),
  
  // Shipping
  challans: createCrudOperations("challans"),
  invoices: createCrudOperations("invoices"),
  
  // Quality
  qualityChecks: createCrudOperations("qualityChecks"),
  testReports: createCrudOperations("testReports"),
  
  // Utility to reset data
  resetData: () => {
    mockStore = getDefaultStore()
    persistStore()
    return true
  },
  
  // Get all data for export
  exportAllData: () => mockStore,
  
  // Import data
  importData: (data) => {
    mockStore = { ...mockStore, ...data }
    persistStore()
    return true
  },
}

export default api
