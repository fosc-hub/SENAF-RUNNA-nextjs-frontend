'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Button, Box, Typography, Modal } from '@mui/material'
import { 
  DataGrid, 
  GridRowParams,
  GridCallbackDetails,
  GridRenderCellParams,
  GridColDef 
} from '@mui/x-data-grid'
import { Search } from '@mui/icons-material'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import DemandaDetalle from './DemandaDetalle'
import PostConstatacionModal from './PostConstatacionModal'
import NuevoIngresoModal from './NuevoIngresoModal'
import EvaluacionModal from './EvaluacionModal'

interface Demand {
  id: string
  nombre: string
  legajo?: string
  ultimaActualizacion: string
  colaboradorAsignado?: string
  recibido: string
  estado: string
  calificacion?: string
  dni: string
  edad: number
  fechaActualizacion: string
}

interface MainContentProps {
  demands: Demand[]
  onUpdateDemands: (demands: Demand[]) => void
}

const origenOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'web', label: 'Web' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'presencial', label: 'Presencial' },
]

const estadoOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'no_verificada', label: 'No verificada' },
  { value: 'verificada', label: 'Verificada' },
  { value: 'en_evaluacion', label: 'En evaluación' },
]

const calificacionOptions = [
  { value: 'sin_calificar', label: 'Sin calificar' },
  { value: 'urgente', label: 'Urgente' },
  { value: 'grave', label: 'Grave' },
  { value: 'normal', label: 'Normal' },
]

export function MainContent({ demands: initialDemands, onUpdateDemands }: MainContentProps) {
  const [demands, setDemands] = useState<Demand[]>(initialDemands)
  const [isNuevoIngresoModalOpen, setIsNuevoIngresoModalOpen] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null)
  const [showPostConstatacion, setShowPostConstatacion] = useState(false)
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false)
  const [origen, setOrigen] = useState('')
  const [estado, setEstado] = useState('')

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
      estado: 'No verificada',
      calificacion: 'Sin calificar',
      ultimaActualizacion: new Date().toISOString(),
      recibido: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }
    setDemands(prevDemands => {
      const updatedDemands = [demandWithState, ...prevDemands]
      onUpdateDemands(updatedDemands)
      return updatedDemands
    })
    setIsNuevoIngresoModalOpen(false)
  }, [onUpdateDemands])

  const handleDemandClick = useCallback((params: GridRowParams<Demand>) => {
    setSelectedDemand(params.row)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedDemand(null)
    setShowPostConstatacion(false)
    setShowEvaluacionModal(false)
  }, [])

  const handleConstatar = useCallback(() => {
    setShowPostConstatacion(true)
  }, [])

  const handleEvaluate = useCallback(() => {
    setShowEvaluacionModal(true)
  }, [])

  const getRowClassName = useCallback((params: GridRowParams<Demand>) => {
    switch (params.row.estado) {
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

  const handleCalificacionChange = useCallback((demandId: string, newCalificacion: string) => {
    setDemands(prevDemands => {
      const updatedDemands = prevDemands.map(demand => 
        demand.id === demandId ? { ...demand, calificacion: newCalificacion } : demand
      )
      onUpdateDemands(updatedDemands)
      return updatedDemands
    })
  }, [onUpdateDemands])

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'nombre',
      headerName: 'Demanda',
      flex: 1,
      renderCell: (params: GridRenderCellParams<Demand>) => (
        <Box>
          {params.row.legajo && (
            <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'medium', marginRight: 1 }}>
              {params.row.legajo}
            </Typography>
          )}
          {params.row.nombre}
        </Box>
      ),
    },
    { 
      field: 'ultimaActualizacion', 
      headerName: 'Última actualización', 
      flex: 1,
      valueFormatter: (params: { value: string }) => {
        return new Date(params.value).toLocaleString('es-AR')
      }
    },
    {
      field: 'colaboradorAsignado',
      headerName: 'Colaborador asignado',
      flex: 1,
      renderCell: (params: GridRenderCellParams<Demand>) => (
        params.value ? (
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 'medium',
                marginRight: 1,
              }}
            >
              {params.value.charAt(0)}
            </Box>
            {params.value}
          </Box>
        ) : (
          <Typography color="text.secondary">No asignado</Typography>
        )
      ),
    },
    { 
      field: 'recibido', 
      headerName: 'Recibido', 
      flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString('es-AR')
      }
    },
    {
      field: 'calificacion',
      headerName: 'Calificación',
      flex: 1,
      renderCell: (params: GridRenderCellParams<Demand>) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.row.calificacion || 'sin_calificar'}
            onChange={(e) => handleCalificacionChange(params.row.id, e.target.value as string)}
            onClick={(e) => e.stopPropagation()}
            sx={{ minWidth: 120 }}
          >
            {calificacionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
  ], [handleCalificacionChange])

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 3, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleNuevoRegistro}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            + Nuevo Registro
          </Button>
          <Button
            variant="outlined"
            sx={{ color: 'text.primary', borderColor: 'grey.300', '&:hover': { bgcolor: 'grey.100' } }}
          >
            No Leído
          </Button>
          <Button
            variant="outlined"
            sx={{ color: 'text.primary', borderColor: 'grey.300', '&:hover': { bgcolor: 'grey.100' } }}
          >
            Asignar
          </Button>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Origen</InputLabel>
            <Select
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              label="Origen"
            >
              {origenOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              label="Estado"
            >
              {estadoOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Box sx={{ height: 400, width: '100%' }}>
        {demands.length > 0 ? (
          <DataGrid
            rows={demands}
            columns={columns}
            onRowClick={handleDemandClick}
            getRowClassName={getRowClassName}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            sx={{
              '& .bg-green-100': {
                backgroundColor: '#dcfce7',
              },
              '& .bg-yellow-100': {
                backgroundColor: '#fef9c3',
              },
              '& .bg-purple-100': {
                backgroundColor: '#f3e8ff',
              },
            }}
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%' 
          }}>
            <Box sx={{ 
              width: 128, 
              height: 128, 
              bgcolor: 'grey.100', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 2 
            }}>
              <Search sx={{ fontSize: 64, color: 'text.secondary' }} />
            </Box>
            <Typography color="text.secondary">Nada por aquí...</Typography>
          </Box>
        )}
      </Box>

      <Modal 
        open={!!selectedDemand && !showPostConstatacion && !showEvaluacionModal} 
        onClose={handleCloseDetail}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 1,
        }}>
          {selectedDemand && (
            <DemandaDetalle 
              demanda={selectedDemand} 
              onClose={handleCloseDetail} 
              onConstatar={handleConstatar}
            />
          )}
        </Box>
      </Modal>
      
      <Modal 
        open={showPostConstatacion && !!selectedDemand} 
        onClose={handleCloseDetail}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 1,
        }}>
          {selectedDemand && (
            <PostConstatacionModal
              demanda={selectedDemand}
              onClose={handleCloseDetail}
              onEvaluate={handleEvaluate}
            />
          )}
        </Box>
      </Modal>

      <Modal 
        open={showEvaluacionModal && !!selectedDemand} 
        onClose={handleCloseDetail}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 1,
        }}>
          {selectedDemand && (
            <EvaluacionModal
              isOpen={showEvaluacionModal}
              onClose={handleCloseDetail}
              demanda={selectedDemand}
            />
          )}
        </Box>
      </Modal>

      <Modal 
        open={isNuevoIngresoModalOpen} 
        onClose={handleCloseNuevoIngreso}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 1,
        }}>
          <NuevoIngresoModal
            isOpen={isNuevoIngresoModalOpen}
            onClose={handleCloseNuevoIngreso}
            onSubmit={handleSubmitNuevoIngreso}
          />
        </Box>
      </Modal>
    </Box>
  )
}