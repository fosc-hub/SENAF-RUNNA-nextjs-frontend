import React from 'react'
import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Buscar"
        className="pl-10 pr-4 py-2 bg-sky-400 text-white placeholder-sky-200 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-200" size={18} />
    </div>
  )
}