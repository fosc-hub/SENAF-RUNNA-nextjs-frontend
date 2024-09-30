import React from 'react'
import { Bell } from 'lucide-react'
import UserAvatar from './UserAvatar'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className="bg-sky-500 text-white p-4 flex justify-between items-center">
      <UserAvatar
        initials="VF"
        name="Verónica Fernandez Wagner"
        role="Admin 27-27255110-9"
        legajo="29731"
      />
      <div className="flex items-center space-x-4">
        <SearchBar />
        <Bell size={24} />
      </div>
    </header>
  )
}