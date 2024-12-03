'use client';
import axios from 'axios';
import EvaluarButton from './EvaluarButton';
import {
  Person as PersonIcon,
} from '@mui/icons-material'
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
import { PDFDocument } from 'pdf-lib';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid, GridRowParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Search } from '@mui/icons-material'
import { getDemands, createDemand, updateDemand } from '../../api/TableFunctions/demands'
import { TDemanda, TDemandaPersona, TPersona, TPrecalificacionDemanda } from '../../api/interfaces'
import { getTDemandaPersona } from '../../api/TableFunctions/demandaPersonas'
import { getTPersona } from '../../api/TableFunctions/personas'
import { getTPrecalificacionDemanda, createTPrecalificacionDemanda, updateTPrecalificacionDemanda } from '../../api/TableFunctions/precalificacionDemanda'
import { useAuth } from '../../context/AuthContext';


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

export function EvaluacionesContent() {
  const [demands, setDemands] = useState<TDemanda[]>([])
  const [personaData, setPersonaData] = useState<Record<number, TPersona>>({})
  const [precalificacionData, setPrecalificacionData] = useState<Record<number, TPrecalificacionDemanda>>({})
  const [origen, setOrigen] = useState('todos')
  const { user, loading } = useAuth();
  const [assignDemandId, setAssignDemandId] = useState<number | null>(null); // State for Assign Demand

  const handleDownloadReport = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '100 - MPI - INFORME TECNICO.pdf';
    link.click();
  };


  const fetchAllData = useCallback(async () => {
    try {
      const demandsData = await getDemands()
      console.log('Fetched demands:', demandsData)
      setDemands(demandsData)
      console.log('User:', user, 'Loading:', loading);

      const personaPromises = demandsData.map(async (demand) => {
        try {
          const demandaPersona = await getTDemandaPersona(demand.id!)
          // console.log(`Fetched demandaPersona for demand ${demand.id}:`, demandaPersona)
          if (demandaPersona && demandaPersona.persona) {
            const persona = await getTPersona(demandaPersona.persona)
            // console.log(`Fetched persona for demand ${demand.id}:`, persona)
            return { id: demand.id!, persona }
          }
        } catch (error) {
          console.error(`Error fetching data for demand ${demand.id}:`, error)
        }
        return null
      })

      const precalificacionPromises = demandsData.map(async (demand) => {
        try {
          const precalificacion = await getTPrecalificacionDemanda(demand.id!)
          // console.log(`Fetched precalificacion for demand ${demand.id}:`, precalificacion)
          return { id: demand.id!, precalificacion }
        } catch (error) {
          console.error(`Error fetching precalificacion for demand ${demand.id}:`, error)
        }
        return null
      })

      const [personaResults, precalificacionResults] = await Promise.all([
        Promise.all(personaPromises),
        Promise.all(precalificacionPromises)
      ])

      const newPersonaData: Record<number, TPersona> = {}
      personaResults.forEach((result) => {
        if (result) {
          newPersonaData[result.id] = result.persona
        }
      })
      // console.log('New persona data:', newPersonaData)
      setPersonaData(newPersonaData)

      const newPrecalificacionData: Record<number, TPrecalificacionDemanda> = {}
      precalificacionResults.forEach((result) => {
        if (result) {
          newPrecalificacionData[result.id] = result.precalificacion
        }
      })
      // console.log('New precalificacion data:', newPrecalificacionData)
      setPrecalificacionData(newPrecalificacionData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])



  const enrichedDemands = useMemo(() => {
    // console.log('Enriching demands with persona and precalificacion data:', demands, personaData, precalificacionData)
    return demands.map(demand => {
      const persona = personaData[demand.id!];
      const precalificacion = precalificacionData[demand.id!];
      const enrichedDemand = {
        ...demand,
        nombre: persona?.nombre || '',
        dni: persona?.dni?.toString() || '',
        precalificacion: precalificacion?.estado_demanda || '',
      }
      // console.log(`Enriched demand ${demand.id}:`, enrichedDemand)
      return enrichedDemand
    })
  }, [demands, personaData, precalificacionData])

  const filteredDemands = useMemo(() => {
    return enrichedDemands.filter(demand => {
      const origenMatch = origen === 'todos' || demand.origen === origen
      return origenMatch
    })
  }, [enrichedDemands, origen])



  const handleDemandClick = useCallback((params: GridRowParams<TDemanda>) => {
    setSelectedDemand(params.row)
    setShowDemandaDetalle(true)
    setShowActividadesRegistradas(true)
  }, [])


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
        let updatedPrecalificacion;

        if (precalificacionData[demandId]) {
          // Update existing precalificacion
          updatedPrecalificacion = {
            ...precalificacionData[demandId],
            estado_demanda: newValue,
            descripcion: `Cambio de precalificación de ${precalificacionData[demandId].estado_demanda} a ${newValue}`,
            ultima_actualizacion: currentDate,
          };

          await updatePrecalificacionDemanda(precalificacionData[demandId].id!, updatedPrecalificacion);
        } else {
          // Create a new precalificacion
          updatedPrecalificacion = await createTPrecalificacionDemanda({
            demanda: demandId,
            estado_demanda: newValue,
            descripcion: `Nueva precalificación: ${newValue}`,
            fecha_y_hora: currentDate,
            ultima_actualizacion: currentDate,
          });
        }

        // Update the state locally
        setPrecalificacionData((prev) => ({
          ...prev,
          [demandId]: updatedPrecalificacion,
        }));
      } catch (error) {
        console.error('Error updating precalificacion:', error);
      }
    },
    [precalificacionData]
  );



  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
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
        renderCell: (params: GridRenderCellParams<TDemanda>) => {
          const isEditable = (user?.is_superuser || user?.all_permissions.some((p) => p.codename === 'add_tprecalificaciondemanda'));
          return (
            <FormControl fullWidth size="small">
              <Select
                value={params.value || ''}
                onChange={(e: SelectChangeEvent) => handlePrecalificacionChange(params.row.id!, e.target.value as string)}
                disabled={!isEditable} // Disable dropdown if permission is missing
              >
                {precalificacionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
      },
      {
        field: 'ultima_actualizacion',
        headerName: 'Última Actualización',
        width: 180,
      },
    ];

    // Add "Asignar" column only if the user has the permission
    if (user?.is_superuser || user?.all_permissions.some((p) => p.codename === 'add_tdemandaasignado')) {
      baseColumns.push({
        field: 'Asignar',
        headerName: 'Asignar',
        width: 160,
        renderCell: (params: GridRenderCellParams<TDemanda>) => (
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click event
              setAssignDemandId(params.row.id); // Set the demand ID for assignment
              setIsAsignarModalOpen(true); // Open Assign Demand modal
            }}
          >
            Asignar
          </Button>
        ),
      });
    }
    if (user) {
      baseColumns.push({
        field: 'Evaluar',
        headerName: 'Evaluar',
        width: 160,
        renderCell: (params: GridRenderCellParams<TDemanda>) => (
          <EvaluarButton
            onClick={() => {
              setAssignDemandId(params.row.id);
              handleEvaluarRedirect(params.row.id); // Si quieres seguir con la lógica adicional
            }}
          />
        ),
      });
    }

    return baseColumns;
  }, [user, handlePrecalificacionChange]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 3, overflow: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadReport}
        >
          Descargar Informe
        </Button>
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
    </Box>
  )
}
