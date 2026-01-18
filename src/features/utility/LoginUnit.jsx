'use client';

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PageShell } from "@/components/layout/PageShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { useAppStore } from "@/state/useAppStore"
import { Building2, Calendar, Check } from "lucide-react"

const units = [
  { value: "UNIT1", label: "Unit 1 - Weaving" },
  { value: "UNIT2", label: "Unit 2 - Dyeing" },
  { value: "UNIT3", label: "Unit 3 - Processing" },
  { value: "UNIT4", label: "Unit 4 - Finishing" },
]

const financialYears = [
  { value: "2024-25", label: "2024-25" },
  { value: "2023-24", label: "2023-24" },
  { value: "2022-23", label: "2022-23" },
]

export function LoginUnit() {
  const navigate = useNavigate()
  const { unit, financialYear, setUnit, setFinancialYear, addToast } = useAppStore()
  const [selectedUnit, setSelectedUnit] = useState(unit || "")
  const [selectedFY, setSelectedFY] = useState(financialYear || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUnit || !selectedFY) {
      addToast({ type: "error", message: "Please select both Unit and Financial Year" })
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUnit(selectedUnit)
    setFinancialYear(selectedFY)
    addToast({ type: "success", message: `Switched to ${selectedUnit} - ${selectedFY}` })
    setLoading(false)
    navigate("/")
  }

  return (
    <PageShell title="Change Login Unit">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Select Unit & Financial Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 bg-muted rounded-lg mb-4">
                <h4 className="font-medium mb-2">Current Selection:</h4>
                <p className="text-sm text-muted-foreground">
                  Unit: <span className="font-medium text-foreground">{unit || "Not selected"}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Financial Year: <span className="font-medium text-foreground">{financialYear || "Not selected"}</span>
                </p>
              </div>

              <Select
                label="Select Unit"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                options={[{ value: "", label: "-- Select Unit --" }, ...units]}
                required
              />

              <Select
                label="Financial Year"
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
                options={[{ value: "", label: "-- Select Financial Year --" }, ...financialYears]}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Switching..." : "Switch Unit"}
              </Button>
            </form>

            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-2">Available Units:</h4>
              <div className="space-y-2">
                {units.map((u) => (
                  <div key={u.value} className={`p-3 rounded-lg border ${selectedUnit === u.value ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center justify-between">
                      <span>{u.label}</span>
                      {selectedUnit === u.value && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default LoginUnit
