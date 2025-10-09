"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Save, Printer, Search, Plus } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { ActionBar } from "@/components/layout/ActionBar"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { formatDate } from "@/lib/formatters"

export default function TestReport() {
  const [testResults, setTestResults] = useState({
    gsm: { value: "", standard: "", result: "Pass" },
    width: { value: "", standard: "", result: "Pass" },
    length: { value: "", standard: "", result: "Pass" },
    thickness: { value: "", standard: "", result: "Pass" },
    tensileStrength: { value: "", standard: "", result: "Pass" },
    tearStrength: { value: "", standard: "", result: "Pass" },
    colorFastness: { value: "", standard: "", result: "Pass" },
    shrinkage: { value: "", standard: "", result: "Pass" },
  })

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      reportNo: "",
      reportDate: formatDate(new Date()),
      itemCode: "",
      itemDescription: "",
      lotNo: "",
      sampleSize: "",
      testType: "Physical",
      testedBy: "",
      approvedBy: "",
      status: "Pending",
    },
  })

  const onSave = (data) => {
    console.log("Saving test report:", { ...data, testResults })
  }

  const actions = [
    { label: "Create", icon: Plus, onClick: () => reset(), variant: "default" },
    { label: "Save", icon: Save, onClick: handleSubmit(onSave), variant: "primary" },
    { label: "Print", icon: Printer, onClick: () => window.print(), variant: "default" },
    { label: "Query", icon: Search, onClick: () => {}, variant: "default" },
  ]

  const updateTestResult = (test, field, value) => {
    setTestResults({
      ...testResults,
      [test]: { ...testResults[test], [field]: value },
    })
  }

  return (
    <PageShell title="Test Report">
      <ActionBar actions={actions} />

      <div className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title>Report Details</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Report No" {...register("reportNo")} placeholder="Auto-generated" disabled />
              <Input label="Report Date" type="date" {...register("reportDate")} />
              <Select
                label="Test Type"
                {...register("testType")}
                options={[
                  { value: "Physical", label: "Physical" },
                  { value: "Chemical", label: "Chemical" },
                  { value: "Dimensional", label: "Dimensional" },
                  { value: "Color", label: "Color" },
                ]}
              />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Sample Details</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Item Code" {...register("itemCode")} placeholder="Enter item code" />
              <Input label="Item Description" {...register("itemDescription")} placeholder="Enter description" />
              <Input label="Lot No" {...register("lotNo")} placeholder="Enter lot number" />
              <Input label="Sample Size" {...register("sampleSize")} placeholder="Enter sample size" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Test Results</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {Object.entries(testResults).map(([test, data]) => (
                <div
                  key={test}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end pb-4 border-b last:border-b-0"
                >
                  <div className="font-medium capitalize">{test.replace(/([A-Z])/g, " $1").trim()}</div>
                  <Input
                    label="Actual Value"
                    value={data.value}
                    onChange={(e) => updateTestResult(test, "value", e.target.value)}
                    placeholder="Enter value"
                  />
                  <Input
                    label="Standard"
                    value={data.standard}
                    onChange={(e) => updateTestResult(test, "standard", e.target.value)}
                    placeholder="Enter standard"
                  />
                  <Select
                    label="Result"
                    value={data.result}
                    onChange={(e) => updateTestResult(test, "result", e.target.value)}
                    options={[
                      { value: "Pass", label: "Pass" },
                      { value: "Fail", label: "Fail" },
                      { value: "NA", label: "N/A" },
                    ]}
                  />
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Approval</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Tested By" {...register("testedBy")} placeholder="Enter tester name" />
              <Input label="Approved By" {...register("approvedBy")} placeholder="Enter approver name" />
              <Select
                label="Status"
                {...register("status")}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                ]}
              />
            </div>
          </Card.Content>
        </Card>
      </div>
    </PageShell>
  )
}
