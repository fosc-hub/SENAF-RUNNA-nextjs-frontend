
'use client'
import axios from 'axios';
import WarningIcon from '@mui/icons-material/Warning';
import { AsignarDemandaModal } from './AsignarDemandaModal'
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
import { DataGrid, GridRowParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Search } from '@mui/icons-material'
import DemandaDetalle from '../ui/DemandaDetalle/DemandaDetalle'
import ActividadesRegistradas from '../ui/ActividadesRegistradas/ActividadesRegistradas'
import PostConstatacionModal from './PostConstatacionModal'
import NuevoIngresoModal from './NuevoIngresoModal/NuevoIngresoModal'
import EvaluacionModal from './EvaluacionModal'
import { getDemands, createDemand, updateDemand, getDemand } from '../../api/TableFunctions/demands'
import { TDemanda, TDemandaPersona, TPersona, TPrecalificacionDemanda, TDemandaAsignado } from '../../api/interfaces'
import { getTDemandaPersona, getTDemandaPersonas } from '../../api/TableFunctions/demandaPersonas'
import { getTPersona, getTPersonas } from '../../api/TableFunctions/personas'
import { getTDemandaAsignados } from '../../api/TableFunctions/DemandaAsignados'
import { getTPrecalificacionDemanda, createTPrecalificacionDemanda, updateTPrecalificacionDemanda, getTPrecalificacionDemandas } from '../../api/TableFunctions/precalificacionDemanda'
import { getTDemandaScores } from '../../api/TableFunctions/demandaScores'

import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/utils/axiosInstance';
import { Slide, toast } from 'react-toastify';
import { get } from 'axios';
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

interface MainContentProps {
  asignadoProp?: boolean;
  constatacionProp?: boolean;
  evaluacionProp?: boolean;
  archivadoProp?: boolean;
  completadoProp?: boolean;
  recibidoProp?: boolean;
  onEvaluacionClick?: (id: number) => void; // Add this line
}

export function MainContent({
  asignadoProp = false,
  constatacionProp = false,
  evaluacionProp = false,
  archivadoProp = false,
  completadoProp = false,
  recibidoProp = false,
  onEvaluacionClick,
  }: MainContentProps) {
    const [filterState, setFilterState] = useState({
      todos: true,
      sinAsignar: false,
      asignados: false,
      archivados: false,
      completados: false,
      sinLeer: false,
      leidos: false,
    })
    const [leidoState, setLeidoState] = useState<Record<number, boolean>>({});
  const [demands, setDemands] = useState<TDemanda[]>([])
  const [personaData, setPersonaData] = useState<Record<number, TPersona>>({})
  const [precalificacionData, setPrecalificacionData] = useState<Record<number, TPrecalificacionDemanda>>({})
  const [isNuevoIngresoModalOpen, setIsNuevoIngresoModalOpen] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<TDemanda | null>(null)
  const [showPostConstatacion, setShowPostConstatacion] = useState(false)
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false)
  const [showDemandaDetalle, setShowDemandaDetalle] = useState(false)
  const [showActividadesRegistradas, setShowActividadesRegistradas] = useState(false)
  const [origen, setOrigen] = useState('todos')
  const { user, loading } = useAuth();
  const [assignDemandId, setAssignDemandId] = useState<number | null>(null); // State for Assign Demand
  const [allDemands, setAllDemands] = useState<TDemanda[]>([])

  const handleFilterChange = useCallback((filter: string) => {
    setFilterState(prevState => ({
      ...Object.fromEntries(Object.keys(prevState).map(key => [key, false])),
      [filter]: true,
    }));
  }, []);
  const fetchAllData = useCallback(async () => {
    try {
      let demandsData: TDemanda[] = [];

      if (user?.is_superuser || user?.all_permissions.some((p) => p.codename === 'add_tdemandaasignado')) {
        demandsData = await getDemands({});
      } else {
        const assignedDemands = await getTDemandaAsignados({ user: user.id });
        demandsData = await getDemands({});
        demandsData = demandsData.filter((demand) => assignedDemands.some((a) => a.demanda === demand.id));
      }

      setAllDemands(demandsData);

      const personaPromises = demandsData.map(async (demand) => {
        try {
          const demandaPersonas = await getTDemandaPersonas({ demanda: demand.id });
          const principalNNYA = demandaPersonas.find((dp) => dp.nnya_principal); // Filter for nnyaprincipal=true
          if (principalNNYA && principalNNYA.persona) {
            const persona = await getTPersona(principalNNYA.persona); // Fetch related persona
            return { id: demand.id!, persona };
          }
        } catch (error) {
          console.error(`Error fetching persona for demand ${demand.id}:`, error);
        }
        return null;
      });

      const precalificacionPromises = demandsData.map(async (demand) => {
        try {
            const precalificaciones = await getTPrecalificacionDemandas({ demanda: demand.id });
            const latestPrecalificacion = precalificaciones?.sort(
                (a, b) => new Date(b.ultima_actualizacion).getTime() - new Date(a.ultima_actualizacion).getTime()
            )[0]; // Get the latest precalificacion based on ultima_actualizacion
    
            if (latestPrecalificacion) {
                return { id: demand.id!, precalificacion: latestPrecalificacion };
            }
        } catch (error) {
            console.error(`Error fetching precalificacion for demand ${demand.id}:`, error);
        }
        return null;
    });
    

      const [personaResults, precalificacionResults] = await Promise.all([
        Promise.all(personaPromises),
        Promise.all(precalificacionPromises)
      ]);

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
      setPrecalificacionData(newPrecalificacionData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user]);
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])
  useEffect(() => {
    if (allDemands.length > 0) {
      const initialLeidoState = allDemands.reduce((acc, demand) => {
        acc[demand.id] = false; // Initially, all demands are "no leido"
        return acc;
      }, {} as Record<number, boolean>);
      setLeidoState(initialLeidoState);
    }
  }, [allDemands]);
  const toggleLeido = (demandId: number) => {
    setLeidoState((prevState) => ({
      ...prevState,
      [demandId]: !prevState[demandId], // Toggle the current state
    }));
  };
  
  const getPersonaData = useCallback((demandId: number | undefined) => {
    if (demandId === undefined) return undefined;
    return personaData[demandId];
  }, [personaData])

  const getPrecalificacionData = useCallback((demandId: number | undefined) => {
    if (demandId === undefined) return undefined;
    return precalificacionData[demandId];
  }, [precalificacionData])




  const filteredDemands = useMemo(() => {
    return allDemands.filter((demand) => {
      if (filterState.todos) return true;
      if (filterState.sinAsignar) return !demand.asignado;
      if (filterState.asignados) return demand.asignado;
      if (filterState.archivados) return demand.archivado;
      if (filterState.completados) return demand.completado;
      if (filterState.sinLeer) return !leidoState[demand.id!]; // Show only "no leídos"
      if (filterState.leidos) return leidoState[demand.id!];   // Show only "leídos"
      return true;
    });
  }, [allDemands, filterState, leidoState]);
  
  

  const enrichedDemands = useMemo(() => {
    return filteredDemands.map((demand) => {
      const persona = personaData[demand.id!];
      const precalificacion = precalificacionData[demand.id!];
      return {
        ...demand,
        nombre: persona ? `${persona.nombre} ${persona.apellido}` : 'N/A', // Combine nombre and apellido
        dni: persona?.dni?.toString() || 'N/A',
        precalificacion: precalificacion?.estado_demanda || '',
      };

    });
  }, [filteredDemands, personaData, precalificacionData]);
  console.log("Enriched Demands:", enrichedDemands);

  const handleNuevoRegistro = useCallback(() => {
    setIsNuevoIngresoModalOpen(true)
  }, [])

  const handleCloseNuevoIngreso = useCallback(() => {
    setIsNuevoIngresoModalOpen(false)
  }, [])

  const handleSubmitNuevoIngreso = useCallback(async (formData: Partial<TDemanda>) => {
    try {
      const newDemand = await createDemand(formData, true, '¡Demanda creada con éxito!')
      await fetchAllData() // Refresh all data to get updated relationships
      setIsNuevoIngresoModalOpen(false)
    } catch (error) {
      // console.error('Error creating new demand:', error)
    }
  }, [fetchAllData])

  const handleDemandClick = useCallback((params: GridRowParams<TDemanda>) => {
    const demandId = params.row.id!;
    toggleLeido(demandId); // Toggle the "leido" state
    setSelectedDemand(params.row);
    setShowDemandaDetalle(true);
    setShowActividadesRegistradas(true);
  }, []);
  
  const handleCloseDetail = useCallback(() => {
    setSelectedDemand(null)
    setShowDemandaDetalle(false)
    setShowActividadesRegistradas(false)
    setShowPostConstatacion(false)
    setShowEvaluacionModal(false)
  }, [])

  const handleConstatar = useCallback(async () => {
    if (selectedDemand) {
      try {
        const updatedDemand = await updateDemand(selectedDemand.id!, { ...selectedDemand, estado: 'Verificada' }, true, '¡Demanda actualizada con éxito!')
        await fetchAllData() // Refresh all data
        setShowDemandaDetalle(false)
        setShowActividadesRegistradas(false)
        setShowPostConstatacion(true)
      } catch (error) {
        // console.error('Error updating demand:', error)
      }
    }
  }, [selectedDemand, fetchAllData])

  const handleEvaluate = useCallback(async () => {
    if (selectedDemand) {
      try {
        const updatedDemand = await updateDemand(selectedDemand.id!, { ...selectedDemand, estado: 'En evaluación' }, true, '¡Demanda actualizada con éxito')
        await fetchAllData() // Refresh all data
        setShowPostConstatacion(false)
      } catch (error) {
        // console.error('Error updating demand:', error)
      }
    }
  }, [selectedDemand, fetchAllData])

  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false)
  
  const handleAsignarSubmit = (data: { collaborator: string; comments: string; demandaId: number | undefined }) => {
    console.log('Assignment Data:', data);
    fetchAllData(); // Refresh all data
    // You can now use data.demandaId along with collaborator and comments
    setIsAsignarModalOpen(false);
  }; 


  const handlePrecalificacionChange = useCallback(
    async (demandId: number, newValue: string) => {
      try {
        const currentDate = new Date().toISOString();
        const existingPrecalificacion = precalificacionData[demandId];
  
        if (existingPrecalificacion && existingPrecalificacion.id) {
          // Update existing precalificación
          const updatedPrecalificacion = {
            estado_demanda: newValue,
            descripcion: `Cambio de precalificación de ${existingPrecalificacion.estado_demanda} a ${newValue}`,
            ultima_actualizacion: currentDate,
          };
  
          console.log('Updating Precalificación:', updatedPrecalificacion);
          await updateTPrecalificacionDemanda(
            existingPrecalificacion.id,
            updatedPrecalificacion,
            true,
            '¡Precalificación actualizada con éxito!'
          );
  
          // Update state with updated precalificación
          setPrecalificacionData((prev) => ({
            ...prev,
            [demandId]: { ...existingPrecalificacion, ...updatedPrecalificacion },
          }));
        } else {
          // Create a new precalificación
          const newPrecalificacion = await createTPrecalificacionDemanda(
            {
              demanda: demandId,
              estado_demanda: newValue,
              descripcion: `Nueva precalificación: ${newValue}`,
              fecha_y_hora: currentDate,
              ultima_actualizacion: currentDate,
            },
            true,
            '¡Precalificación creada con éxito!'
          );
  
          // Update state with the new precalificación
          setPrecalificacionData((prev) => ({
            ...prev,
            [demandId]: newPrecalificacion,
          }));
        }
      } catch (error) {
        console.error('Error updating precalificación:', error);
  
        // Debugging details
        console.error('Demand ID:', demandId);
        console.error('Precalificación Data:', precalificacionData[demandId]);
        console.error('New Value:', newValue);
      }
    },
    [precalificacionData]
  );
  
  

  

const columns: GridColDef[] = useMemo(() => {
  const baseColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      renderCell: (params: GridRenderCellParams<TDemanda>) => {
        const isUrgent = params.row.precalificacion === 'URGENTE';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography>{params.value}</Typography>
            {isUrgent && (
              <WarningIcon sx={{ color: 'warning.main', ml: 1 }} fontSize="small" />
            )}
          </Box>
        );
      },
    },
    {
      field: 'score',
      headerName: 'Score',
      width: 130,
      renderCell: (params: GridRenderCellParams<TDemanda>) => {
        const [score, setScore] = useState<number | null>(null);

        useEffect(() => {
          const fetchScore = async () => {
            try {
              const scoreData = await getTDemandaScores({ demanda: params.row.id });
              setScore(scoreData[0].score);
            } catch (error) {
              console.error('Error fetching score:', error);
            }
          };

          fetchScore();
        }, [params.row.id]);
        return (
          <Typography>{score}</Typography>
        );
      },
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
      width: 180,
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
      renderCell: (params: GridRenderCellParams) => (
        <EvaluarButton
          id={params.row.id} // Pasa el id de la fila
          onClick={onEvaluacionClick} // Asegúrate de que esta función sea pasada como prop
          disabled={!params.row.evaluacion} // Deshabilita el botón si evaluación es false
        />
      ),
    });
  }

  return baseColumns;
}, [user, handlePrecalificacionChange]);
const getRowClassName = (params: GridRowParams) => {
  const { constatacion, evaluacion, asignado, archivado, completado } = params.row;

  return evaluacion ? 'row-green' : (constatacion ? 'row-purple' : ( (archivado || completado) ? '' : 'row-orange') );
};
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 3, overflow: 'auto' }}>
<Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 3, gap: 2 }}>
        {(user?.is_superuser || user?.all_permissions.some((p) => p.codename === 'add_tdemanda')) && (
          <Button
            variant="contained"
            onClick={handleNuevoRegistro}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            + Nuevo Registro
          </Button>
        )}
        <Button
          variant={filterState.todos ? "contained" : "outlined"}
          onClick={() => handleFilterChange('todos')}
        >
          Todos
        </Button>
        {user?.is_superuser || user?.all_permissions.some((p) => p.codename === 'add_tdemandaasignado') ? (
          <>
            <Button
              variant={filterState.sinAsignar ? "contained" : "outlined"}
              onClick={() => handleFilterChange('sinAsignar')}
            >
              Sin Asignar
            </Button>
            <Button
              variant={filterState.asignados ? "contained" : "outlined"}
              onClick={() => handleFilterChange('asignados')}
            >
              Asignados
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={filterState.sinLeer ? "contained" : "outlined"}
              onClick={() => handleFilterChange('sinLeer')}
            >
              Sin Leer
            </Button>
            <Button
              variant={filterState.leidos ? "contained" : "outlined"}
              onClick={() => handleFilterChange('leidos')}
            >
              Leidos
            </Button>
          </>
        )}
        <Button
          variant={filterState.archivados ? "contained" : "outlined"}
          onClick={() => handleFilterChange('archivados')}
        >
          Archivados
        </Button>
        <Button
          variant={filterState.completados ? "contained" : "outlined"}
          onClick={() => handleFilterChange('completados')}
        >
          Completados
        </Button>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        {filteredDemands.length > 0 ? (
      <DataGrid
      rows={enrichedDemands} // Use enrichedDemands here
      columns={columns}
      onRowClick={handleDemandClick}
      disableRowSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: { pageSize: 5, page: 0 },
        },
      }}
      pageSizeOptions={[5, 10, 20]}
      getRowClassName={getRowClassName}
      sx={{
        '& .row-green': {
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
          },
        },
        '& .row-purple': {
          backgroundColor: 'rgba(128, 0, 128, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(128, 0, 128, 0.2)',
          },
        },
        '& .row-orange': {
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
          },
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
        open={(showDemandaDetalle || showActividadesRegistradas) && !!selectedDemand} 
        onClose={handleCloseDetail} 
        BackdropProps={{ invisible: true }}
      >
        <Box>
          {selectedDemand && (
            <>
              {showDemandaDetalle && (
                <DemandaDetalle 
                  demanda={selectedDemand} 
                  isOpen={showDemandaDetalle} 
                  onClose={handleCloseDetail} 
                  fetchAllData={fetchAllData} // Pass fetchAllData as a prop
                />
              )}
              {/* {showActividadesRegistradas && (
                <ActividadesRegistradas 
                  demanda={selectedDemand} 
                  isOpen={showActividadesRegistradas} 
                  onClose={handleCloseDetail} 
                  onConstatar={handleConstatar} 
                />
              )} */}
            </>
          )}
        </Box>
      </Modal>

      <Modal open={showPostConstatacion && !!selectedDemand} onClose={handleCloseDetail} BackdropProps={{ invisible: true }}
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

      <Modal open={showEvaluacionModal && !!selectedDemand} onClose={handleCloseDetail} BackdropProps={{ invisible: true }}
      >
        <Box >
          {selectedDemand && (
            <EvaluacionModal
              isOpen={showEvaluacionModal}
              onClose={handleCloseDetail}
              demanda={selectedDemand}
            />
          )}
        </Box>
      </Modal>

      <AsignarDemandaModal
          demandaId={assignDemandId} // Pass the demand ID for assignment
          isOpen={isAsignarModalOpen}
          onClose={() => {
            setIsAsignarModalOpen(false);
            setAssignDemandId(null); // Reset assignDemandId when modal closes
          }}
          onAssign={handleAsignarSubmit}
        />

      <NuevoIngresoModal
        isOpen={isNuevoIngresoModalOpen}
        onClose={handleCloseNuevoIngreso}
        onSubmit={handleSubmitNuevoIngreso}
      />
    </Box>
  )
}
