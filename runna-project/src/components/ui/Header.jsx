import React from 'react'
import { Bell } from 'lucide-react'
import UserAvatar from './UserAvatar'
import SearchBar from './SearchBar'

export default function Header({ user }) {
  return (
    <header className="bg-sky-500 text-white p-4 flex justify-between items-center">
      <UserAvatar
        initials={user.initials}
        name={user.name}
        role={user.role}
        legajo={user.legajo}
      />
      <div className="flex items-center space-x-4">
        <SearchBar />
        <Bell size={24} />
      </div>
    </header>
  )
}
