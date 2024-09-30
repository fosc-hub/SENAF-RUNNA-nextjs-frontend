import React from 'react'

export default function UserAvatar({ initials, name, role, legajo }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-white text-sky-500 rounded-full flex items-center justify-center font-bold text-xl">
        {initials}
      </div>
      <div className="text-white">
        <h2 className="font-semibold">{name}</h2>
        <p className="text-sm">{role} | Legajos: {legajo}</p>
      </div>
    </div>
  )
}