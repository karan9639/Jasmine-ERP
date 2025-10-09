"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/state/useAppStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Radio } from "@/components/ui/Radio"
import { FormField } from "@/components/forms/FormField"

const unitTypes = [
  { value: "HO", label: "HO" },
  { value: "Foaming", label: "Foaming Unit" },
  { value: "Processing", label: "Processing Unit" },
  { value: "RDC", label: "RDC" },
  { value: "COCO", label: "COCO" },
]

export function CompanySelection() {
  const [selectedType, setSelectedType] = useState("HO")
  const [financialYear, setFinancialYear] = useState("2024-25")
  const { setUnit, setFinancialYear: setFY, addToast } = useAppStore()
  const navigate = useNavigate()

  const handleFinish = () => {
    setUnit({ name: selectedType, type: selectedType })
    setFY(financialYear)
    addToast({ type: "success", message: "Company selection completed" })
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Company Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField label="Unit Type">
            <div className="grid grid-cols-2 gap-3">
              {unitTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Radio
                    name="unitType"
                    value={type.value}
                    checked={selectedType === type.value}
                    onChange={(e) => setSelectedType(e.target.value)}
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Financial Year" required>
            <Select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </Select>
          </FormField>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleFinish} className="flex-1" size="lg">
              Finish
            </Button>
            <Button variant="outline" onClick={() => navigate("/login")} className="flex-1" size="lg">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
