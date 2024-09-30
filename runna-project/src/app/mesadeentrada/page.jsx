import React from 'react'
import Header from '../../components/ui/Header'
import Sidebar from '../../components/ui/Sidebar'
import MainContent from '../../components/ui/MainContent'

export default function MesaDeEntradas() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Bienvenido a <span className="text-sky-500">Mesa de Entradas</span>
        </h1>
        <span className="text-gray-500">13 de Sept | 17:30 hs.</span>
      </div>
      <div className="flex-1 flex">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}