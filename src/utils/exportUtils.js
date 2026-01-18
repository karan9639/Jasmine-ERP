import * as XLSX from "xlsx"
import { formatDate } from "@/lib/formatters"

// Export data to CSV format - supports both (data, filename) and (data, columns, filename)
export function exportToCSV(data, columnsOrFilename, maybeFilename) {
  if (!data || data.length === 0) {
    console.warn("No data to export")
    return
  }

  let filename = maybeFilename || columnsOrFilename
  if (typeof filename === "object") {
    filename = "export"
  }
  if (!filename.endsWith(".csv")) {
    filename += ".csv"
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ""
        })
        .join(",")
    ),
  ].join("\n")

  downloadFile(csvContent, filename, "text/csv;charset=utf-8;")
}

// Export data to Excel format - supports both (data, filename) and (data, columns, filename)
export function exportToExcel(data, columnsOrFilename, maybeFilename, sheetName = "Sheet1") {
  if (!data || data.length === 0) {
    console.warn("No data to export")
    return
  }

  let filename = maybeFilename || columnsOrFilename
  if (typeof filename === "object") {
    filename = "export"
  }
  if (!filename.endsWith(".xlsx")) {
    filename += ".xlsx"
  }

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Auto-size columns
  const maxWidth = 50
  const colWidths = Object.keys(data[0]).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...data.map((row) => String(row[key] || "").length)
    )
    return { wch: Math.min(maxLen + 2, maxWidth) }
  })
  worksheet["!cols"] = colWidths

  XLSX.writeFile(workbook, filename)
}

// Print table data - supports both (title, data, columns) and (data, columns, title)
export function printTable(dataOrTitle, columnsOrData, titleOrColumns) {
  let title, data, columns
  
  // Detect which signature is being used
  if (typeof dataOrTitle === "string") {
    // Old format: (title, data, columns)
    title = dataOrTitle
    data = columnsOrData
    columns = titleOrColumns
  } else if (Array.isArray(dataOrTitle)) {
    // New format: (data, columns, title)
    data = dataOrTitle
    columns = Array.isArray(columnsOrData) ? columnsOrData : []
    title = typeof titleOrColumns === "string" ? titleOrColumns : "Report"
  } else {
    console.error("Invalid arguments to printTable")
    return
  }

  if (!data || data.length === 0) {
    console.warn("No data to print")
    return
  }

  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    console.error("Failed to open print window")
    return
  }

  // Extract headers and keys from columns or data
  let headers, keys
  if (columns && columns.length > 0) {
    headers = columns.map((col) => col.header || col.accessorKey || col.key || "")
    keys = columns.map((col) => col.accessorKey || col.key || col.header || "")
  } else {
    keys = Object.keys(data[0])
    headers = keys
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
          font-size: 12px;
        }
        h1 { 
          text-align: center; 
          margin-bottom: 20px;
          font-size: 18px;
        }
        .print-date {
          text-align: right;
          margin-bottom: 10px;
          font-size: 10px;
          color: #666;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 10px;
        }
        th, td { 
          border: 1px solid #ccc; 
          padding: 8px; 
          text-align: left;
        }
        th { 
          background-color: #f5f5f5; 
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #fafafa;
        }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="print-date">Printed on: ${formatDate(new Date(), "DD/MM/YYYY HH:mm")}</div>
      <table>
        <thead>
          <tr>
            ${headers.map((h) => `<th>${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) =>
                `<tr>${keys
                  .map((key) => `<td>${row[key] ?? ""}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

// Helper function to download file
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate PDF (using jspdf)
export async function exportToPDF(title, data, columns) {
  const { jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")

  const doc = new jsPDF()
  
  doc.setFontSize(16)
  doc.text(title, 14, 20)
  
  doc.setFontSize(10)
  doc.text(`Generated: ${formatDate(new Date(), "DD/MM/YYYY HH:mm")}`, 14, 28)

  const headers = columns.map((col) => col.header || col.accessorKey || col.key)
  const keys = columns.map((col) => col.accessorKey || col.key)
  const rows = data.map((row) => keys.map((key) => row[key] ?? ""))

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
  })

  doc.save(`${title.replace(/\s+/g, "_")}_${formatDate(new Date(), "YYYY-MM-DD")}.pdf`)
}
