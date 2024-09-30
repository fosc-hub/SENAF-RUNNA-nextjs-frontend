import React from 'react'
import { ChevronDown, Search } from 'lucide-react'

export default function MainContent() {
  return (
    <main className="flex-1 bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded">
            + Nuevo Registro
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
            Reasignar
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
            No Leído
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
            Asignar
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Origen</span>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded flex items-center">
              Todos <ChevronDown className="ml-2" size={16} />
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Estado</span>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded flex items-center">
              Todos <ChevronDown className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="text-gray-400" size={64} />
        </div>
        <p className="text-gray-500">Nada por aquí...</p>
      </div>
    </main>
  )
}