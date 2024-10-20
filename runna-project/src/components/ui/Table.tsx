import React from 'react'

interface Column<T> {
  header: string
  accessor: keyof T
  render?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  getRowClassName?: (item: T) => string
}

export function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick,
  getRowClassName
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th key={column.accessor as string} className="py-2 px-4 text-left text-gray-700">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`cursor-pointer hover:bg-gray-100 ${getRowClassName ? getRowClassName(item) : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column) => (
                <td key={column.accessor as string} className="py-2 px-4 text-gray-900">
                  {column.render ? column.render(item) : item[column.accessor] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}