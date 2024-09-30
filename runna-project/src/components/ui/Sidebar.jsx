import React from 'react'

const menuItems = [
    { name: 'Recepción de Demandas', isHeader: true },
    { name: 'Principal', count: 24 },
    { name: 'Sin Leer', count: 10 },
    { name: 'Borradores', count: 5, hasSeparator: true },
    { name: 'Derivados', },
    { name: 'Asignados', belowSeparator: true },
  ]
  
  export default function Sidebar() {
    return (
      <aside className="w-64 bg-white border-r border-gray-200">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.isHeader ? (
              <h2 className="px-4 py-2 text-sm font-semibold text-gray-600">{item.name}</h2>
            ) : (
              <>
                {index === 1 && <hr className="my-2 border-gray-200" />}
                <div
                  className={`
                    flex justify-between items-center px-4 py-2 text-sm text-gray-700
                    hover:bg-sky-50 hover:text-sky-600 cursor-pointer transition-colors duration-150
                  `}
                >
                  <span>{item.name}</span>
                  {item.count !== undefined && (
                    <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-xs">
                      {item.count}
                    </span>
                  )}
                </div>
              </>
            )}
          {item.hasSeparator && <hr className="my-2 border-gray-200" />}
          </React.Fragment>
        ))}
      </aside>
    )
  }