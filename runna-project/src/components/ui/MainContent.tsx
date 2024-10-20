import React, { useState, useEffect, useCallback } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import DemandaDetalle from './DemandaDetalle'
import PostConstatacionModal from './PostConstatacionModal'
import NuevoIngresoModal from './NuevoIngresoModal'
import EvaluacionModal from './EvaluacionModal'
import { formatDate, formatTime } from './utils'

interface Demand {
  id: string
  nombre: string
  dni: string
  edad: number
  estado: 'No verificada' | 'Verificada' | 'En evaluación'
  legajo?: string
  ultimaActualizacion: string
  colaboradorAsignado?: string
  recibido: string
}

interface MainContentProps {
  initialDemands: Demand[]
  onUpdateDemands: (demands: Demand[]) => void
}

const DemandRow: React.FC<{ demand: Demand; isEven: boolean; onClick: () => void }> = React.memo(
  ({ demand, isEven, onClick }) => {
    const getRowColor = () => {
      switch (demand.estado) {
        case 'Verificada':
          return 'bg-green-100'
        case 'No verificada':
          return 'bg-yellow-100'
        case 'En evaluación':
          return 'bg-purple-100'
        default:
          return isEven ? 'bg-white' : 'bg-gray-50'
      }
    }

    return (
      <tr className={`${getRowColor()} cursor-pointer hover:bg-gray-100`} onClick={onClick}>
        <td className="py-2 px-4">
          <input 
            type="checkbox" 
            className="form-checkbox h-4 w-4 text-sky-600" 
            onClick={(e) => e.stopPropagation()}
            aria-label={`Seleccionar demanda de ${demand.nombre}`}
          />
        </td>
        <td className="py-2 px-4 text-gray-900">
          {demand.legajo && (
            <span className="text-sky-700 font-medium mr-2">{demand.legajo}</span>
          )}
          {demand.nombre}
        </td>
        <td className="py-2 px-4 text-gray-700">{demand.ultimaActualizacion}</td>
        <td className="py-2 px-4">
          {demand.colaboradorAsignado ? (
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-medium mr-2" aria-hidden="true">
                {demand.colaboradorAsignado.charAt(0)}
              </div>
              {demand.colaboradorAsignado}
            </div>
          ) : (
            <span className="text-gray-700">No asignado</span>
          )}
        </td>
        <td className="py-2 px-4 text-gray-700">{demand.recibido}</td>
      </tr>
    )
  }
)

DemandRow.displayName = 'DemandRow'

export default function MainContent({ initialDemands, onUpdateDemands }: MainContentProps) {
  const [demands, setDemands] = useState<Demand[]>(initialDemands)
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null)
  const [showPostConstatacion, setShowPostConstatacion] = useState(false)
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false)
  const [isNuevoIngresoModalOpen, setIsNuevoIngresoModalOpen] = useState(false)

  useEffect(() => {
    setDemands(initialDemands)
  }, [initialDemands])

  const handleDemandClick = useCallback((demand: Demand) => {
    setSelectedDemand(demand)
    if (demand.estado === 'Verificada') {
      setShowPostConstatacion(true)
      setShowEvaluacionModal(false)
    } else if (demand.estado === 'En evaluación') {
      setShowEvaluacionModal(true)
      setShowPostConstatacion(false)
    } else {
      setShowPostConstatacion(false)
      setShowEvaluacionModal(false)
    }
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedDemand(null)
    setShowPostConstatacion(false)
    setShowEvaluacionModal(false)
  }, [])

  const handleConstatar = useCallback(() => {
    if (selectedDemand) {
      const updatedDemands = demands.map(d => 
        d.id === selectedDemand.id ? { ...d, estado: 'Verificada' as const } : d
      )
      setDemands(updatedDemands)
      onUpdateDemands(updatedDemands)
      handleCloseDetail()
    }
  }, [demands, selectedDemand, onUpdateDemands])

  const handleEvaluate = useCallback(() => {
    if (selectedDemand) {
      const updatedDemands = demands.map(d => 
        d.id === selectedDemand.id ? { ...d, estado: 'En evaluación' as const } : d
      )
      setDemands(updatedDemands)
      onUpdateDemands(updatedDemands)
      setShowPostConstatacion(false)
      setSelectedDemand(null)
    }
  }, [demands, selectedDemand, onUpdateDemands])

  const handleNuevoRegistro = useCallback(() => {
    setIsNuevoIngresoModalOpen(true)
  }, [])

  const handleCloseNuevoIngreso = useCallback(() => {
    setIsNuevoIngresoModalOpen(false)
  }, [])

  const handleSubmitNuevoIngreso = useCallback((newDemand: Omit<Demand, 'id' | 'estado'>) => {
    const demandWithState: Demand = {
      ...newDemand,
      id: Date.now().toString(),
      estado: 'No verificada'
    }
    const updatedDemands = [demandWithState, ...demands]
    setDemands(updatedDemands)
    onUpdateDemands(updatedDemands)
    setIsNuevoIngresoModalOpen(false)
  }, [demands, onUpdateDemands])

  return (
    <main className="flex-1 bg-white p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full"
            onClick={handleNuevoRegistro}
          >
            + Nuevo Registro
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded">
            Reasignar
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded">
            No Leído
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded">
            Asignar
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Origen</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option>Todos</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Estado</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option>Todos</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {demands.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left"></th>
                <th className="py-2 px-4 text-left text-gray-700">Demanda</th>
                <th className="py-2 px-4 text-left text-gray-700">Última actualización</th>
                <th className="py-2 px-4 text-left text-gray-700">Colaborador asignado</th>
                <th className="py-2 px-4 text-left text-gray-700">Recibido</th>
              </tr>
            </thead>
            <tbody>
              {demands.map((demand, index) => (
                <DemandRow 
                  key={demand.id} 
                  demand={demand} 
                  isEven={index % 2 === 0} 
                  onClick={() => handleDemandClick(demand)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="text-gray-600" size={64} />
          </div>
          <p className="text-gray-700">Nada por aquí...</p>
        </div>
      )}
      
      {selectedDemand && !showPostConstatacion && !showEvaluacionModal && (
        <DemandaDetalle 
          demanda={selectedDemand} 
          onClose={handleCloseDetail} 
          onConstatar={handleConstatar}
        />
      )}
      
      {showPostConstatacion && selectedDemand && (
        <PostConstatacionModal
          demanda={selectedDemand}
          onClose={handleCloseDetail}
          onEvaluate={handleEvaluate}
        />
      )}

      {showEvaluacionModal && selectedDemand && (
        <EvaluacionModal
          isOpen={showEvaluacionModal}
          onClose={handleCloseDetail}
          demanda={selectedDemand}
        />
      )}

      <NuevoIngresoModal
        isOpen={isNuevoIngresoModalOpen}
        onClose={handleCloseNuevoIngreso}
        onSubmit={handleSubmitNuevoIngreso}
      />
    </main>
  )
}