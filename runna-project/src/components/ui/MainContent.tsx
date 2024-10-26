import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Button } from './Button'
import { Select } from './Select'
import { Modal } from './Modal'
import { Table } from './Table'
import DemandaDetalle from './DemandaDetalle'
import PostConstatacionModal from './PostConstatacionModal'
import NuevoIngresoModal from './NuevoIngresoModal'
import EvaluacionModal from './EvaluacionModal'
import { formatDate, formatTime } from './utils'
import { PrecalificarModal } from './PrecalificarModal'
import { CustomSelect } from './CustomSelect'


interface Demand {
  id: string
  nombre: string
  dni: string
  edad: number
  estado: 'No verificada' | 'Verificada' | 'En evaluación'
  fechaActualizacion: string // Add this property
  legajo?: string
  ultimaActualizacion: string
  colaboradorAsignado?: string
  recibido: string
}

interface MainContentProps {
  initialDemands: Demand[]
  onUpdateDemands: (demands: Demand[]) => void
}

export default function MainContent({ initialDemands, onUpdateDemands }: MainContentProps) {
  const [demands, setDemands] = useState<Demand[]>(initialDemands)
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null)
  const [showPostConstatacion, setShowPostConstatacion] = useState(false)
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false)
  const [isPrecalificarModalOpen, setIsPrecalificarModalOpen] = useState(false)
  const [isNuevoIngresoModalOpen, setIsNuevoIngresoModalOpen] = useState(false)
  const [origen, setOrigen] = useState('todos')
  const [estado, setEstado] = useState('todos')

  const origenOptions = [
    { value: 'todos', label: 'Todos' },
    // Add more options as needed
  ]

  const estadoOptions = [
    { value: 'todos', label: 'Todos' },
    // Add more options as needed
  ]

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
      setDemands(prevDemands => {
        const updatedDemands = prevDemands.map(d => 
          d.id === selectedDemand.id ? { ...d, estado: 'Verificada' as const } : d
        )
        onUpdateDemands(updatedDemands)
        return updatedDemands
      })
      handleCloseDetail()
    }
  }, [selectedDemand, onUpdateDemands])

  const handleEvaluate = useCallback(() => {
    if (selectedDemand) {
      setDemands(prevDemands => {
        const updatedDemands = prevDemands.map(d => 
          d.id === selectedDemand.id ? { ...d, estado: 'En evaluación' as const } : d
        )
        onUpdateDemands(updatedDemands)
        return updatedDemands
      })
      setShowPostConstatacion(false)
      setSelectedDemand(null)
    }
  }, [selectedDemand, onUpdateDemands])

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
    setDemands(prevDemands => {
      const updatedDemands = [demandWithState, ...prevDemands]
      onUpdateDemands(updatedDemands)
      return updatedDemands
    })
    setIsNuevoIngresoModalOpen(false)
  }, [onUpdateDemands])

  const getRowColor = useCallback((estado: Demand['estado']) => {
    switch (estado) {
      case 'Verificada':
        return 'bg-green-100'
      case 'No verificada':
        return 'bg-yellow-100'
      case 'En evaluación':
        return 'bg-purple-100'
      default:
        return ''
    }
  }, [])
  const handlePrecalificar = useCallback(() => {
    setIsPrecalificarModalOpen(true)
  }, [])

  const handleClosePrecalificar = useCallback(() => {
    setIsPrecalificarModalOpen(false)
  }, [])
  const handleSavePrecalificar = useCallback((data: { estado: string; comentarios: string }) => {
    // Here you would typically update the demand with the new estado and comentarios
    console.log('Precalificar data:', data)
    // For now, we'll just close the modal
    setIsPrecalificarModalOpen(false)
  }, [])
  const columns = useMemo(() => [
    {
      header: '',
      accessor: 'id' as const,
      render: () => (
        <input 
          type="checkbox" 
          className="form-checkbox h-4 w-4 text-sky-600" 
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      header: 'Demanda',
      accessor: 'nombre' as const,
      render: (demand: Demand) => (
        <>
          {demand.legajo && (
            <span className="text-sky-700 font-medium mr-2">{demand.legajo}</span>
          )}
          {demand.nombre}
        </>
      ),
    },
    { header: 'Última actualización', accessor: 'ultimaActualizacion' as const },
    {
      header: 'Colaborador asignado',
      accessor: 'colaboradorAsignado' as const,
      render: (demand: Demand) => (
        demand.colaboradorAsignado ? (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-medium mr-2" aria-hidden="true">
              {demand.colaboradorAsignado.charAt(0)}
            </div>
            {demand.colaboradorAsignado}
          </div>
        ) : (
          <span className="text-gray-700">No asignado</span>
        )
      ),
    },
    { header: 'Recibido', accessor: 'recibido' as const },
  ], [])

  return (
    <main className="flex-1 bg-white p-6 overflow-auto">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleNuevoRegistro} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-6 py-3 text-base"
        >
          + Nuevo Registro
        </Button>
        <Button 
            variant="secondary" 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-4 py-2"
            onClick={handlePrecalificar}
          >
            Precalificar
          </Button>
        <Button 
          variant="secondary" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-6 py-3 text-base"
        >
          No Leído
        </Button>
        <Button 
          variant="secondary" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-6 py-3 text-base"
        >
          Asignar
        </Button>
        <CustomSelect
          label="Origen"
          options={origenOptions}
          value={origen}
          onChange={setOrigen}
          placeholder="Todos"
        />
        <CustomSelect
          label="Estado"
          options={estadoOptions}
          value={estado}
          onChange={setEstado}
          placeholder="Todos"
        />
      </div>
    </div>
      {demands.length > 0 ? (
        <Table 
          data={demands}
          columns={columns}
          onRowClick={handleDemandClick}
          getRowClassName={(item) => getRowColor(item.estado)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="text-gray-600" size={64} />
          </div>
          <p className="text-gray-700">Nada por aquí...</p>
        </div>
      )}
      
      {selectedDemand && !showPostConstatacion && !showEvaluacionModal && (
        <Modal isOpen={true} onClose={handleCloseDetail} title="Detalle de Demanda">
          <DemandaDetalle 
            demanda={selectedDemand} 
            onClose={handleCloseDetail} 
            onConstatar={handleConstatar}
          />
        </Modal>
      )}
      
      {showPostConstatacion && selectedDemand && (
        <Modal isOpen={true} onClose={handleCloseDetail} title="Post Constatación">
          <PostConstatacionModal
            demanda={selectedDemand}
            onClose={handleCloseDetail}
            onEvaluate={handleEvaluate}
          />
        </Modal>
      )}

      {showEvaluacionModal && selectedDemand && (
        <Modal isOpen={true} onClose={handleCloseDetail} title="Evaluación">
          <EvaluacionModal
            isOpen={showEvaluacionModal}
            onClose={handleCloseDetail}
            demanda={selectedDemand}
          />
        </Modal>
      )}

      <Modal isOpen={isNuevoIngresoModalOpen} onClose={handleCloseNuevoIngreso} title="Nuevo Ingreso">
        <NuevoIngresoModal
          isOpen={isNuevoIngresoModalOpen}
          onClose={handleCloseNuevoIngreso}
          onSubmit={handleSubmitNuevoIngreso}
        />
      </Modal>
      <PrecalificarModal
        isOpen={isPrecalificarModalOpen}
        onClose={handleClosePrecalificar}
        onSave={handleSavePrecalificar}
      />
    </main>
  )
}