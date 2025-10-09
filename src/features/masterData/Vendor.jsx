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

export default function Vendor() {
  const [view, setView] = useState("form")
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      vendorCode: "",
      vendorName: "",
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
      vendorType: "Material",
      paymentTerms: "",
      active: true,
    },
  })

  const columns = [
    { key: "vendorCode", header: "Code", sortable: true },
    { key: "vendorName", header: "Vendor Name", sortable: true },
    { key: "vendorType", header: "Type", sortable: true },
    { key: "city", header: "City", sortable: true },
    { key: "phone", header: "Phone" },
    { key: "active", header: "Active", cell: (row) => (row.active ? "Yes" : "No") },
  ]

  const mockData = [
    {
      id: 1,
      vendorCode: "VEND001",
      vendorName: "ABC Suppliers",
      vendorType: "Material",
      city: "Surat",
      phone: "0261-1234567",
      active: true,
    },
  ]

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "contact", label: "Contact Details" },
    { id: "terms", label: "Terms & Conditions" },
  ]

  const onSave = (data) => {
    console.log("Saving vendor:", data)
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
    <PageShell title="Vendor Master">
      <ActionBar actions={actions} />

      {view === "form" ? (
        <Card>
          <Card.Content>
            <Tabs tabs={tabs}>
              <Tabs.Panel id="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Vendor Code" {...register("vendorCode")} placeholder="Enter vendor code" required />
                  <Input label="Vendor Name" {...register("vendorName")} placeholder="Enter vendor name" required />
                  <Select
                    label="Vendor Type"
                    {...register("vendorType")}
                    options={[
                      { value: "Material", label: "Material" },
                      { value: "Service", label: "Service" },
                      { value: "Job Work", label: "Job Work" },
                    ]}
                  />
                  <Input label="Contact Person" {...register("contactPerson")} placeholder="Enter contact person" />
                  <Checkbox label="Active" {...register("active")} />
                  <div></div>
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

              <Tabs.Panel id="terms">
                <div className="grid grid-cols-1 gap-4">
                  <Textarea
                    label="Payment Terms"
                    {...register("paymentTerms")}
                    placeholder="Enter payment terms"
                    rows={4}
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
