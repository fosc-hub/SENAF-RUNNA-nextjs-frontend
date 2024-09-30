import React from 'react'
import { ChevronDown, Search } from 'lucide-react'

export default function MainContent() {
  return (
    <main className="flex-1 bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded">
          + Nuevo Registro
        </button>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="text-white mr-2">Origen</span>
            <button className="bg-transparent border border-gray-600 text-white px-3 py-1 rounded flex items-center">
              Todos <ChevronDown className="ml-2" size={16} />
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-2">Estado</span>
            <button className="bg-transparent border border-gray-600 text-white px-3 py-1 rounded flex items-center">
              Todos <ChevronDown className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Search className="text-gray-600" size={64} />
        </div>
        <p className="text-gray-500">Nada por aquí...</p>
      </div>
    </main>
  )
}