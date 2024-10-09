import React from 'react'
import { Plus } from 'lucide-react'

export default function Component({ children, onClick, icon = 'plus' }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors duration-300"
      onClick={onClick}
    >
      {icon === 'plus' && <Plus size={16} className="mr-2" />}
      {children}
    </button>
  )
}