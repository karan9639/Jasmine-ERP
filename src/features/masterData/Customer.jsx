"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Save, Search, Plus, List } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import { Tabs } from "@/components/ui/Tabs"
import { DataTable } from "@/components/ui/DataTable"

export default function Customer() {
  const [view, setView] = useState("form")
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
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
    },
  })

  const columns = [
    { key: "customerCode", header: "Code", sortable: true },
    { key: "customerName", header: "Customer Name", sortable: true },
    { key: "city", header: "City", sortable: true },
    { key: "state", header: "State", sortable: true },
    { key: "phone", header: "Phone" },
    { key: "creditLimit", header: "Credit Limit", sortable: true },
    { key: "active", header: "Active", cell: (row) => (row.active ? "Yes" : "No") },
  ]

  const mockData = [
    {
      id: 1,
      customerCode: "CUST001",
      customerName: "XYZ Industries",
      city: "Delhi",
      state: "Delhi",
      phone: "011-12345678",
      creditLimit: "500000",
      active: true,
    },
  ]

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "contact", label: "Contact Details" },
    { id: "financial", label: "Financial Info" },
  ]

  const onSave = (data) => {
    console.log("Saving customer:", data)
  }

  const actions = [
    {
      label: "Create",
      icon: Plus,
      onClick: () => {
        reset()
        setView("form")
      },
      variant: "default",
    },
    { label: "Save", icon: Save, onClick: handleSubmit(onSave), variant: "primary" },
    { label: "Query", icon: Search, onClick: () => setView("list"), variant: "default" },
    { label: "List", icon: List, onClick: () => setView("list"), variant: "default" },
  ]

  return (
    <PageShell title="Customer Master">
      <ActionBar actions={actions} />

      {view === "form" ? (
        <Card>
          <Card.Content>
            <Tabs tabs={tabs}>
              <Tabs.Panel id="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Customer Code"
                    {...register("customerCode")}
                    placeholder="Enter customer code"
                    required
                  />
                  <Input
                    label="Customer Name"
                    {...register("customerName")}
                    placeholder="Enter customer name"
                    required
                  />
                  <Input label="Contact Person" {...register("contactPerson")} placeholder="Enter contact person" />
                  <Checkbox label="Active" {...register("active")} />
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
              </Tabs.Panel>

              <Tabs.Panel id="contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Phone" {...register("phone")} placeholder="Enter phone number" />
                  <Input label="Mobile" {...register("mobile")} placeholder="Enter mobile number" />
                  <Input label="Email" type="email" {...register("email")} placeholder="Enter email" />
                  <Input label="GSTIN" {...register("gstin")} placeholder="Enter GSTIN" />
                  <Input label="PAN" {...register("pan")} placeholder="Enter PAN" />
                </div>
              </Tabs.Panel>

              <Tabs.Panel id="financial">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Credit Limit" type="number" {...register("creditLimit")} placeholder="0.00" />
                  <Input label="Credit Days" type="number" {...register("creditDays")} placeholder="0" />
                  <Textarea
                    label="Payment Terms"
                    {...register("paymentTerms")}
                    placeholder="Enter payment terms"
                    rows={3}
                  />
                </div>
              </Tabs.Panel>
            </Tabs>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content>
            <DataTable
              data={mockData}
              columns={columns}
              onRowClick={(row) => {
                console.log("Edit:", row)
                setView("form")
              }}
            />
          </Card.Content>
        </Card>
      )}
    </PageShell>
  )
}
