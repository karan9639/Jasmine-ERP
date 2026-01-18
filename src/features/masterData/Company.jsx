'use client';

import { useState } from "react"
import { useForm } from "react-hook-form"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { DataTable } from "@/components/ui/Table"
import { useAppStore } from "@/state/useAppStore"

const defaultValues = {
  companyCode: "",
  companyName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  phone: "",
  email: "",
  website: "",
  gstin: "",
  pan: "",
  cin: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
  branch: "",
  active: true,
}

const mockData = [
  {
    id: 1,
    companyCode: "C001",
    companyName: "Jasmine Textiles Ltd",
    city: "Mumbai",
    state: "Maharashtra",
    gstin: "27AAAAA0000A1Z5",
    phone: "022-12345678",
    email: "info@jasmine.com",
  },
]

export default function Company() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("form")
  const [companies, setCompanies] = useState(mockData)
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ defaultValues })

  const handleNew = () => {
    reset(defaultValues)
    setSelectedId(null)
    setView("form")
    addToast({ type: "info", message: "New company form" })
  }

  const handleSave = async (data) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (selectedId) {
        setCompanies(companies.map((c) => (c.id === selectedId ? { ...c, ...data } : c)))
        addToast({ type: "success", message: "Company updated successfully" })
      } else {
        setCompanies([...companies, { id: Date.now(), ...data }])
        addToast({ type: "success", message: "Company created successfully" })
      }
      handleNew()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save company" })
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (row) => {
    setSelectedId(row.id)
    reset(row)
    setView("form")
  }

  const columns = [
    { accessorKey: "companyCode", header: "Code", enableSorting: true },
    { accessorKey: "companyName", header: "Company Name", enableSorting: true },
    { accessorKey: "city", header: "City", enableSorting: true },
    { accessorKey: "state", header: "State", enableSorting: true },
    { accessorKey: "gstin", header: "GSTIN", enableSorting: true },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
  ]

  return (
    <PageShell title="Company Master">
      <ActionBar
        onNew={handleNew}
        onSave={handleSubmit(handleSave)}
        onQuery={() => setView("list")}
        disableSave={!isDirty || loading}
      />

      {view === "form" ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? "Edit Company" : "New Company"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Details</TabsTrigger>
                <TabsTrigger value="statutory">Statutory Info</TabsTrigger>
                <TabsTrigger value="bank">Bank Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Company Code"
                    {...register("companyCode", { required: "Company code is required" })}
                    placeholder="Enter company code"
                    error={errors.companyCode?.message}
                    required
                  />
                  <Input
                    label="Company Name"
                    {...register("companyName", { required: "Company name is required" })}
                    placeholder="Enter company name"
                    error={errors.companyName?.message}
                    required
                  />
                  <Textarea label="Address Line 1" {...register("address1")} placeholder="Enter address" rows={2} />
                  <Textarea label="Address Line 2" {...register("address2")} placeholder="Enter address" rows={2} />
                  <Input label="City" {...register("city")} placeholder="Enter city" />
                  <Input label="State" {...register("state")} placeholder="Enter state" />
                  <Input label="Pincode" {...register("pincode")} placeholder="Enter pincode" />
                  <Select
                    label="Country"
                    {...register("country")}
                    options={[
                      { value: "India", label: "India" },
                      { value: "USA", label: "USA" },
                      { value: "UK", label: "UK" },
                    ]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input label="Phone" {...register("phone")} placeholder="Enter phone number" />
                  <Input
                    label="Email"
                    type="email"
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Enter email"
                    error={errors.email?.message}
                  />
                  <Input label="Website" {...register("website")} placeholder="Enter website URL" />
                </div>
              </TabsContent>

              <TabsContent value="statutory">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="GSTIN"
                    {...register("gstin", {
                      pattern: {
                        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                        message: "Invalid GSTIN format",
                      },
                    })}
                    placeholder="Enter GSTIN"
                    error={errors.gstin?.message}
                  />
                  <Input
                    label="PAN"
                    {...register("pan", {
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: "Invalid PAN format",
                      },
                    })}
                    placeholder="Enter PAN"
                    error={errors.pan?.message}
                  />
                  <Input label="CIN" {...register("cin")} placeholder="Enter CIN" />
                </div>
              </TabsContent>

              <TabsContent value="bank">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input label="Bank Name" {...register("bankName")} placeholder="Enter bank name" />
                  <Input label="Account Number" {...register("accountNo")} placeholder="Enter account number" />
                  <Input label="IFSC Code" {...register("ifscCode")} placeholder="Enter IFSC code" />
                  <Input label="Branch" {...register("branch")} placeholder="Enter branch name" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Company List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DataTable columns={columns} data={companies} onRowClick={handleRowClick} />
            )}
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}
