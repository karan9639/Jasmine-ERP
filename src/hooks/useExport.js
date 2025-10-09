"use client"

import * as XLSX from "xlsx"
import { useAppStore } from "@/state/useAppStore"

export function useExport() {
  const { addToast } = useAppStore()

  const exportToCSV = (data, filename = "export.csv") => {
    try {
      const ws = XLSX.utils.json_to_sheet(data)
      const csv = XLSX.utils.sheet_to_csv(ws)
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      addToast({ type: "success", message: "Exported to CSV successfully" })
    } catch (error) {
      addToast({ type: "error", message: "Failed to export CSV" })
    }
  }

  const exportToExcel = (data, filename = "export.xlsx") => {
    try {
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
      XLSX.writeFile(wb, filename)
      addToast({ type: "success", message: "Exported to Excel successfully" })
    } catch (error) {
      addToast({ type: "error", message: "Failed to export Excel" })
    }
  }

  return { exportToCSV, exportToExcel }
}
