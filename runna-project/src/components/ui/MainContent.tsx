'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Box, Typography, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { DataGrid, GridRowParams, GridRenderCellParams, GridColDef } from '@mui/x-data-grid'
import { Search, InfoOutlined } from '@mui/icons-material'
import DemandaDetalle from './DemandaDetalle'
import PostConstatacionModal from './PostConstatacionModal'
import NuevoIngresoModal from './NuevoIngresoModal/NuevoIngresoModal'
import EvaluacionModal from './EvaluacionModal'
import { getDemands, createDemand, updateDemand } from '../../api/TableFunctions/demands'
import { TDemanda, TLocalizacion, TUsuarioLinea } from '../../api/interfaces'

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

export function MainContent() {
  const [demands, setDemands] = useState<TDemanda[]>([])
  const [isNuevoIngresoModalOpen, setIsNuevoIngresoModalOpen] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<TDemanda | null>(null)
  const [showPostConstatacion, setShowPostConstatacion] = useState(false)
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false)
  const [showDemandaDetalle, setShowDemandaDetalle] = useState(false)
  const [origen, setOrigen] = useState('')
  const [estado, setEstado] = useState('')

  useEffect(() => {
    fetchDemands()
  }, [])

  const fetchDemands = async () => {
    try {
      const fetchedDemands = await getDemands()
      setDemands(fetchedDemands)
    } catch (error) {
      console.error('Error fetching demands:', error)
    }
  }

  const handleNuevoRegistro = useCallback(() => {
    setIsNuevoIngresoModalOpen(true)
  }, [])

  const handleCloseNuevoIngreso = useCallback(() => {
    setIsNuevoIngresoModalOpen(false)
  }, [])

  const handleSubmitNuevoIngreso = useCallback(async (formData: Partial<TDemanda>) => {
    try {
      const newDemand = await createDemand(formData)
      setDemands(prevDemands => [newDemand, ...prevDemands])
      setIsNuevoIngresoModalOpen(false)
    } catch (error) {
      console.error('Error creating new demand:', error)
    }
  }, [])

  const handleDemandClick = useCallback((params: GridRowParams<TDemanda>) => {
    setSelectedDemand(params.row)
    if (params.row.estado === 'Verificada') {
      setShowPostConstatacion(true)
    } else if (params.row.estado === 'En evaluación') {
      setShowEvaluacionModal(true)
    } else {
      setShowDemandaDetalle(true)
    }
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedDemand(null)
    setShowDemandaDetalle(false)
    setShowPostConstatacion(false)
    setShowEvaluacionModal(false)
  }, [])

  const handleConstatar = useCallback(async () => {
    if (selectedDemand) {
      try {
        const updatedDemand = await updateDemand(selectedDemand.id!, { ...selectedDemand, estado: 'Verificada' })
        setDemands(prevDemands => prevDemands.map(demand => 
          demand.id === updatedDemand.id ? updatedDemand : demand
        ))
        setShowDemandaDetalle(false)
        setShowPostConstatacion(true)
      } catch (error) {
        console.error('Error updating demand:', error)
      }
    }
  }, [selectedDemand])

  const handleEvaluate = useCallback(async () => {
    if (selectedDemand) {
      try {
        const updatedDemand = await updateDemand(selectedDemand.id!, { ...selectedDemand, estado: 'En evaluación' })
        setDemands(prevDemands => prevDemands.map(demand => 
          demand.id === updatedDemand.id ? updatedDemand : demand
        ))
        setShowPostConstatacion(false)
      } catch (error) {
        console.error('Error updating demand:', error)
      }
    }
  }, [selectedDemand])

  const getRowClassName = useCallback((params: GridRowParams<TDemanda>) => {
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

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'hora_ingreso',
      headerName: 'Hora de Ingreso',
      width: 180,
    },
    {
      field: 'origen',
      headerName: 'Origen',
      width: 130,
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 200,
    },
    {
      field: 'dni',
      headerName: 'DNI',
      width: 130,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
    },
    {
      field: 'ultima_actualizacion',
      headerName: 'Última Actualización',
      width: 180,
    },
  ], [])

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
        <Box>
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
        <Box>
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

      <NuevoIngresoModal
        isOpen={isNuevoIngresoModalOpen}
        onClose={handleCloseNuevoIngreso}
        onSubmit={handleSubmitNuevoIngreso}
      />
    </Box>
  )
}