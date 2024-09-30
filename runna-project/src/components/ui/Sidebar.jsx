import React from 'react'

const menuItems = [
  { name: 'Principal', count: 24 },
  { name: 'Sin Leer', count: 10 },
  { name: 'Borradores', count: 5 },
  { name: 'Derivados' },
  { name: 'Asignados' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`flex justify-between items-center py-2 px-4 rounded ${
            item.name === 'Principal' ? 'bg-sky-100 text-sky-600' : 'text-gray-700'
          }`}
        >
          <span>{item.name}</span>
          {item.count && (
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
              {item.count}
            </span>
          )}
        </div>
      ))}
    </aside>
  )
}