'use client'
import axios from 'axios';

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Button, 
  Box, 
  Typography, 
  Modal, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  SelectChangeEvent 
} from '@mui/material'
import { DataGrid, GridRowParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Search } from '@mui/icons-material'
import DemandaDetalle from './DemandaDetalle'
import PostConstatacionModal from './PostConstatacionModal'
import NuevoIngresoModal from './NuevoIngresoModal/NuevoIngresoModal'
import EvaluacionModal from './EvaluacionModal'
import { getDemands, createDemand, updateDemand } from '../../api/TableFunctions/demands'
import { TDemanda, TDemandaPersona, TPersona, TPrecalificacionDemanda } from '../../api/interfaces'
import { getTDemandaPersona } from '../../api/TableFunctions/demandaPersonas'
import { getTPersona } from '../../api/TableFunctions/personas'
import { getTPrecalificacionDemanda, createTPrecalificacionDemanda, updateTPrecalificacionDemanda } from '../../api/TableFunctions/precalificacionDemanda'

const origenOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'web', label: 'Web' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'presencial', label: 'Presencial' },
]

const precalificacionOptions = [
  { value: 'URGENTE', label: 'Urgente' },
  { value: 'NO_URGENTE', label: 'No Urgente' },
  { value: 'COMPLETAR', label: 'Completar' },
]

export function MainContent() {
  const [demands, setDemands] = useState<TDemanda[]>([])
  const [personaData, setPersonaData] = useState<Record<number, TPersona>>({})
  const [precalificacionData, setPrecalificacionData] = useState<Record<number, TPrecalificacionDemanda>>({})
  const [isNuevoIngresoModalOpen, setIsNuevoIngresoModalOpen] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<TDemanda | null>(null)
  const [showPostConstatacion, setShowPostConstatacion] = useState(false)
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false)
  const [showDemandaDetalle, setShowDemandaDetalle] = useState(false)
  const [origen, setOrigen] = useState('todos')

  const fetchAllData = useCallback(async () => {
    try {
      const demandsData = await getDemands();
      console.log('Fetched demands:', demandsData);
      setDemands(demandsData);
  
      const allPrecalificaciones = await getAll<TPrecalificacionDemanda>('precalificacion-demanda');
      console.log('Fetched all precalificaciones:', allPrecalificaciones);
      const precalificacionMap = allPrecalificaciones.reduce<Record<number, TPrecalificacionDemanda>>(
        (acc, precalificacion) => {
          acc[precalificacion.demanda] = precalificacion;
          return acc;
        },
        {}
      );
      setPrecalificacionData(precalificacionMap);
  
      const personaPromises = demandsData.map(async (demand) => {
        try {
          const demandaPersona = await getTDemandaPersona(demand.id!);
          console.log(`Fetched demandaPersona for demand ${demand.id}:`, demandaPersona);
          if (demandaPersona && demandaPersona.persona) {
            const persona = await getTPersona(demandaPersona.persona);
            console.log(`Fetched persona for demand ${demand.id}:`, persona);
            return { id: demand.id!, persona };
          }
        } catch (error) {
          console.error(`Error fetching data for demand ${demand.id}:`, error);
        }
        return null;
      });
  
      const personaResults = await Promise.all(personaPromises);
      const newPersonaData: Record<number, TPersona> = {};
      personaResults.forEach((result) => {
        if (result) {
          newPersonaData[result.id] = result.persona;
        }
      });
      setPersonaData(newPersonaData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
  

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const getPersonaData = useCallback((demandId: number | undefined) => {
    if (demandId === undefined) return undefined;
    return personaData[demandId];
  }, [personaData])

  const getPrecalificacionData = useCallback((demandId: number | undefined) => {
    if (demandId === undefined) return undefined;
    return precalificacionData[demandId];
  }, [precalificacionData])

  const enrichedDemands = useMemo(() => {
    console.log('Enriching demands with persona and precalificacion data:', demands, personaData, precalificacionData)
    return demands.map(demand => {
      const persona = personaData[demand.id!];
      const precalificacion = precalificacionData[demand.id!];
      const enrichedDemand = {
        ...demand,
        nombre: persona?.nombre || '',
        dni: persona?.dni?.toString() || '',
        precalificacion: precalificacion?.estado_demanda || '',
      }
      console.log(`Enriched demand ${demand.id}:`, enrichedDemand)
      return enrichedDemand
    })
  }, [demands, personaData, precalificacionData])

  const filteredDemands = useMemo(() => {
    return enrichedDemands.filter(demand => {
      const origenMatch = origen === 'todos' || demand.origen === origen
      return origenMatch
    })
  }, [enrichedDemands, origen])

  const handleNuevoRegistro = useCallback(() => {
    setIsNuevoIngresoModalOpen(true)
  }, [])

  const handleCloseNuevoIngreso = useCallback(() => {
    setIsNuevoIngresoModalOpen(false)
  }, [])

  const handleSubmitNuevoIngreso = useCallback(async (formData: Partial<TDemanda>) => {
    try {
      const newDemand = await createDemand(formData)
      await fetchAllData() // Refresh all data to get updated relationships
      setIsNuevoIngresoModalOpen(false)
    } catch (error) {
      console.error('Error creating new demand:', error)
    }
  }, [fetchAllData])

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
        await fetchAllData() // Refresh all data
        setShowDemandaDetalle(false)
        setShowPostConstatacion(true)
      } catch (error) {
        console.error('Error updating demand:', error)
      }
    }
  }, [selectedDemand, fetchAllData])

  const handleEvaluate = useCallback(async () => {
    if (selectedDemand) {
      try {
        const updatedDemand = await updateDemand(selectedDemand.id!, { ...selectedDemand, estado: 'En evaluación' })
        await fetchAllData() // Refresh all data
        setShowPostConstatacion(false)
      } catch (error) {
        console.error('Error updating demand:', error)
      }
    }
  }, [selectedDemand, fetchAllData])
// Function to update PrecalificacionDemanda without 'demanda' in payload
const updatePrecalificacionDemanda = async (id: number, payload: Partial<TPrecalificacionDemanda>) => {
  const { demanda, ...filteredPayload } = payload;
  const url = `http://localhost:8000/api/precalificacion-demanda/${id}/`; // Correct URL

  console.log('Sending PATCH request to:', url); // Debug log
  console.log('Payload:', filteredPayload); // Debug log

  try {
    const response = await axios.patch(url, filteredPayload);
    console.log('Update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating precalificacion-demanda:', error);
    throw error;
  }
};


const handlePrecalificacionChange = useCallback(
  async (demandId: number, newValue: string) => {
    try {
      const currentDate = new Date().toISOString();
      let descripcion = '';

      if (precalificacionData[demandId]) {
        const updatedPrecalificacion = {
          ...precalificacionData[demandId],
          estado_demanda: newValue,
          descripcion: `Cambio de precalificación de ${precalificacionData[demandId].estado_demanda || 'Sin precalificación'} a ${newValue}`,
          fecha_y_hora: currentDate,
          ultima_actualizacion: currentDate,
        };

        await updatePrecalificacionDemanda(precalificacionData[demandId].id!, updatedPrecalificacion);

        // Update local state
        setPrecalificacionData((prev) => ({
          ...prev,
          [demandId]: updatedPrecalificacion,
        }));
      } else {
        const newPrecalificacion = {
          demanda: demandId,
          estado_demanda: newValue,
          descripcion: `Nueva precalificación: ${newValue}`,
          fecha_y_hora: currentDate,
          ultima_actualizacion: currentDate,
        };

        const createdPrecalificacion = await createTPrecalificacionDemanda(newPrecalificacion);

        // Update local state
        setPrecalificacionData((prev) => ({
          ...prev,
          [demandId]: createdPrecalificacion,
        }));
      }
    } catch (error) {
      console.error('Error updating precalificacion:', error);
    }
  },
  [precalificacionData]
);


  

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
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
      field: 'precalificacion',
      headerName: 'Precalificación',
      width: 180,
      renderCell: (params: GridRenderCellParams<TDemanda>) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.value || ''}
            onChange={(e: SelectChangeEvent) => handlePrecalificacionChange(params.row.id!, e.target.value as string)}
          >
            {precalificacionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'ultima_actualizacion',
      headerName: 'Última Actualización',
      width: 180,
    },
  ], [handlePrecalificacionChange])

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
        </Box>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        {filteredDemands.length > 0 ? (
          <DataGrid
            rows={filteredDemands}
            columns={columns}
            onRowClick={handleDemandClick}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
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
          {
selectedDemand && (
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

