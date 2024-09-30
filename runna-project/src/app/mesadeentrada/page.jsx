import React from 'react'
import Header from '../../components/ui/Header'
import Sidebar from '../../components/ui/Sidebar'
import MainContent from '../../components/ui/MainContent'

export default function MesaDeEntradas() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              Bienvenido a <span className="text-sky-500">Mesa de Entradas</span>
            </h1>
            <span className="text-black-900">13 de Sept | 17:30 hs.</span>
          </div>
          <MainContent />
        </div>
      </div>
    </div>
  )
}