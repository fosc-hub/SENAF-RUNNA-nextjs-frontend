'use client'

import React, { useState } from 'react'
import Header from '../../components/ui/Header'
import Sidebar from '../../components/ui/Sidebar'
import MainContent from '../../components/ui/MainContent'
import NuevoIngresoModal from '../../components/ui/NuevoIngresoModal'

export default function MesaDeEntradas() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = {
    initials: 'VF',
    name: 'Verónica Fernandez Wagner',
    role: 'Admin 27-27255110-9',
    legajo: '29731'
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="flex flex-col h-screen">
      <Header user={user} />
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Bienvenido a <span className="text-sky-500">Mesa de Entradas</span>
        </h1>
        <span className="text-gray-500">13 de Sept | 17:30 hs.</span>
      </div>
      <div className="flex-1 flex">
        <Sidebar />
        <MainContent onNuevoRegistro={openModal} />
      </div>
      <NuevoIngresoModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}