'use client';

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Save, Search, Plus, List, Trash2 } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { DataTable } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { useAppStore } from "@/state/useAppStore"
import { api } from "@/services/api"

const defaultValues = {
  customerCode: "",
  customerName: "",
  contactPerson: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  phone: "",
  mobile: "",
  email: "",
  gstin: "",
  pan: "",
  creditLimit: "",
  creditDays: "",
  paymentTerms: "",
  active: true,
}

export default function Customer() {
  const { addToast } = useAppStore()
  const [view, setView] = useState("form")
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({ defaultValues })

  const activeValue = watch("active")

  // Load customers on list view
  useEffect(() => {
    if (view === "list") {
      loadCustomers()
    }
  }, [view])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await api.customers.getAll()
      setCustomers(data)
    } catch (error) {
      addToast({ type: "error", message: "Failed to load customers" })
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    reset(defaultValues)
    setSelectedId(null)
    setView("form")
    addToast({ type: "info", message: "New customer form" })
  }

  const handleSave = async (data) => {
    setLoading(true)
    try {
      if (selectedId) {
        await api.customers.update(selectedId, data)
        addToast({ type: "success", message: "Customer updated successfully" })
      } else {
        await api.customers.create(data)
        addToast({ type: "success", message: "Customer created successfully" })
      }
      handleNew()
    } catch (error) {
      addToast({ type: "error", message: "Failed to save customer" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm("Are you sure you want to delete this customer?")) return

    setLoading(true)
    try {
      await api.customers.delete(selectedId)
      addToast({ type: "success", message: "Customer deleted successfully" })
      handleNew()
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete customer" })
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
    { accessorKey: "customerCode", header: "Code", enableSorting: true },
    { accessorKey: "customerName", header: "Customer Name", enableSorting: true },
    { accessorKey: "city", header: "City", enableSorting: true },
    { accessorKey: "state", header: "State", enableSorting: true },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "creditLimit", header: "Credit Limit", enableSorting: true },
    { 
      accessorKey: "active", 
      header: "Active", 
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.original.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.original.active ? "Yes" : "No"}
        </span>
      )
    },
  ]

  return (
    <PageShell title="Customer Master">
      <ActionBar
        onNew={handleNew}
        onSave={handleSubmit(handleSave)}
        onQuery={() => setView("list")}
        onDelete={selectedId ? handleDelete : undefined}
        disableSave={!isDirty || loading}
        disableDelete={!selectedId || loading}
      />

      {view === "form" ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedId ? "Edit Customer" : "New Customer"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Details</TabsTrigger>
                <TabsTrigger value="financial">Financial Info</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Customer Code"
                    {...register("customerCode", { required: "Customer code is required" })}
                    placeholder="Enter customer code"
                    error={errors.customerCode?.message}
                    required
                  />
                  <Input
                    label="Customer Name"
                    {...register("customerName", { required: "Customer name is required" })}
                    placeholder="Enter customer name"
                    error={errors.customerName?.message}
                    required
                  />
                  <Input
                    label="Contact Person"
                    {...register("contactPerson")}
                    placeholder="Enter contact person"
                  />
                  <div className="flex items-end">
                    <Checkbox
                      label="Active"
                      checked={activeValue}
                      onChange={(e) => setValue("active", e.target.checked, { shouldDirty: true })}
                    />
                  </div>
                  <Textarea
                    label="Address Line 1"
                    {...register("address1")}
                    placeholder="Enter address"
                    rows={2}
                  />
                  <Textarea
                    label="Address Line 2"
                    {...register("address2")}
                    placeholder="Enter address"
                    rows={2}
                  />
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
                  <Input label="Mobile" {...register("mobile")} placeholder="Enter mobile number" />
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
                </div>
              </TabsContent>

              <TabsContent value="financial">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Credit Limit"
                    type="number"
                    {...register("creditLimit", { min: { value: 0, message: "Must be positive" } })}
                    placeholder="0.00"
                    error={errors.creditLimit?.message}
                  />
                  <Input
                    label="Credit Days"
                    type="number"
                    {...register("creditDays", { min: { value: 0, message: "Must be positive" } })}
                    placeholder="0"
                    error={errors.creditDays?.message}
                  />
                  <Textarea
                    label="Payment Terms"
                    {...register("paymentTerms")}
                    placeholder="Enter payment terms"
                    rows={3}
                    className="md:col-span-2"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={customers}
                onRowClick={handleRowClick}
              />
            )}
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}
