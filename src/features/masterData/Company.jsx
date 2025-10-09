"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Save, Search, Plus, List } from "lucide-react"
import { PageShell } from "../../components/layout/PageShell"
import { ActionBar } from "../../components/layout/ActionBar"
import { Card, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Select } from "../../components/ui/Select"
import { Textarea } from "../../components/ui/Textarea"
import { Tabs, TabsContent } from "../../components/ui/Tabs"
import DataTable from "../../components/ui/DataTable"

export default function Company() {
  const [view, setView] = useState("form")
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
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
    },
  })

  const onSave = (data) => {
    console.log("Saving company:", data)
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

  const columns = [
    { key: "companyCode", header: "Code", sortable: true },
    { key: "companyName", header: "Company Name", sortable: true },
    { key: "city", header: "City", sortable: true },
    { key: "state", header: "State", sortable: true },
    { key: "gstin", header: "GSTIN", sortable: true },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
  ]

  const mockData = [
    {
      id: 1,
      companyCode: "C001",
      companyName: "ABC Textiles Ltd",
      city: "Mumbai",
      state: "Maharashtra",
      gstin: "27AAAAA0000A1Z5",
      phone: "022-12345678",
      email: "info@abc.com",
    },
  ]

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "contact", label: "Contact Details" },
    { id: "statutory", label: "Statutory Info" },
    { id: "bank", label: "Bank Details" },
  ]

  return (
    <PageShell title="Company Master">
      <ActionBar actions={actions} />

      {view === "form" ? (
        <Card>
          <CardContent>
            <Tabs tabs={tabs}>
              <TabsContent id="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Company Code" {...register("companyCode")} placeholder="Enter company code" required />
                  <Input label="Company Name" {...register("companyName")} placeholder="Enter company name" required />
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

              <TabsContent id="contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Phone" {...register("phone")} placeholder="Enter phone number" />
                  <Input label="Email" type="email" {...register("email")} placeholder="Enter email" />
                  <Input label="Website" {...register("website")} placeholder="Enter website URL" />
                </div>
              </TabsContent>

              <TabsContent id="statutory">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="GSTIN" {...register("gstin")} placeholder="Enter GSTIN" />
                  <Input label="PAN" {...register("pan")} placeholder="Enter PAN" />
                  <Input label="CIN" {...register("cin")} placeholder="Enter CIN" />
                </div>
              </TabsContent>

              <TabsContent id="bank">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <CardContent>
            <DataTable
              data={mockData}
              columns={columns}
              onRowClick={(row) => {
                console.log("Edit:", row)
                setView("form")
              }}
            />
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}
