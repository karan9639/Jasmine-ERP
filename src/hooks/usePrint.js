"use client"

export function usePrint() {
  const printElement = (elementId) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const printContent = (content) => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  return { printElement, printContent }
}
