"use client"

// Compatibility wrapper over the tanstack-based DataTable in ./Table.
// Some screens use columns like { key, header, sortable, cell(row) }.
// Others use tanstack column defs ({ accessorKey, header, cell }).

import { DataTable as BaseDataTable } from "./Table"

export function DataTable({ columns = [], data = [], ...props }) {
  const normalizedColumns = Array.isArray(columns)
    ? columns.map((col) => {
        // Already a tanstack column
        if (col.accessorKey || col.id) return col

        const accessorKey = col.key
        const header = col.header ?? col.label ?? accessorKey

        const wrapped = {
          accessorKey,
          header,
          enableSorting: col.sortable ?? true,
        }

        if (typeof col.cell === "function") {
          // Legacy signature: cell(rowObject)
          wrapped.cell = ({ row }) => col.cell(row.original)
        }

        return wrapped
      })
    : []

  return <BaseDataTable columns={normalizedColumns} data={data} {...props} />
}

export default DataTable
