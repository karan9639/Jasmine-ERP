import * as XLSX from "xlsx"

export const exportToCSV = (data, filename = "export.csv") => {
  if (!data || data.length === 0) {
    console.warn("No data to export")
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape commas and quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToExcel = (data, filename = "export.xlsx", sheetName = "Sheet1") => {
  if (!data || data.length === 0) {
    console.warn("No data to export")
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Auto-size columns
  const maxWidth = 50
  const colWidths = Object.keys(data[0]).map((key) => {
    const maxLength = Math.max(key.length, ...data.map((row) => String(row[key] || "").length))
    return { wch: Math.min(maxLength + 2, maxWidth) }
  })
  worksheet["!cols"] = colWidths

  XLSX.writeFile(workbook, filename)
}

export const printTable = (title, data, columns) => {
  const printWindow = window.open("", "_blank")

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              ${columns.map((col) => `<th>${col.header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${columns.map((col) => `<td>${row[col.key] || ""}</td>`).join("")}
              </tr>
            `,
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

export const generateLabel = (data, template = "default") => {
  const printWindow = window.open("", "_blank")

  const labelHTML =
    template === "barcode"
      ? `
    <div style="border: 2px solid #000; padding: 15px; width: 300px; font-family: Arial;">
      <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
        ${data.title || "Label"}
      </div>
      <div style="margin: 5px 0;">
        <strong>Item:</strong> ${data.itemCode || ""}
      </div>
      <div style="margin: 5px 0;">
        <strong>Lot No:</strong> ${data.lotNo || ""}
      </div>
      <div style="margin: 5px 0;">
        <strong>Quantity:</strong> ${data.quantity || ""} ${data.uom || ""}
      </div>
      <div style="margin: 5px 0;">
        <strong>Date:</strong> ${data.date || new Date().toLocaleDateString()}
      </div>
      <div style="text-align: center; margin-top: 10px; font-family: 'Courier New'; font-size: 24px;">
        ||||| ${data.barcode || data.lotNo || "000000"} |||||
      </div>
    </div>
  `
      : `
    <div style="border: 1px solid #000; padding: 10px; width: 250px; font-family: Arial; font-size: 12px;">
      ${Object.entries(data)
        .map(
          ([key, value]) => `
        <div style="margin: 3px 0;">
          <strong>${key}:</strong> ${value}
        </div>
      `,
        )
        .join("")}
    </div>
  `

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Label</title>
        <style>
          body { margin: 20px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${labelHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
