'use client'

import React, { useState } from 'react'
import Header from '../../components/ui/Header'
import Sidebar from '../../components/ui/Sidebar'
import { MainContent } from '../../components/ui/MainContent'

interface User {
  initials: string
  name: string
  role: string
  legajo: string
}

export default function MesaDeEntradas() {
  const [demands, setDemands] = useState([])

  const user: User = {
    initials: 'VF',
    name: 'Verónica Fernandez Wagner',
    role: 'Admin 27-27255110-9',
    legajo: '29731'
  }

  const handleUpdateDemands = (updatedDemands: any) => {
    setDemands(updatedDemands)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header user={user} />
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Bienvenido a <span className="text-sky-500">Mesa de Entradas</span>
        </h1>
        <span className="text-gray-500">
          {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })} | {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className="flex-1 flex">
        <Sidebar />
        <MainContent demands={demands} onUpdateDemands={handleUpdateDemands} />
      </div>
    </div>
  )
}