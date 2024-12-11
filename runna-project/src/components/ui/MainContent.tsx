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
  SelectChangeEvent,
  Popover,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Skeleton,
} from '@mui/material'
import { DataGrid, GridRowParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Search, FilterList } from '@mui/icons-material'
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
import { format, set } from 'date-fns';
import { getOrigens } from '../../api/TableFunctions/origenDemanda';
import { TOrigen } from '../../api/interfaces';
import { Check, Archive, ImageOffIcon as PersonOffIcon, UserCheckIcon as PersonCheckIcon, ClipboardCheck, Star, FileCheck, Mail, MailOpen } from 'lucide-react'
import { AlertCircle } from 'lucide-react'


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
  onEvaluacionClick?: (id: number) => void; 
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
      constatados: false,
      evaluados: false,
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
  const [assignDemandId, setAssignDemandId] = useState<number | null>(null); 
  const [allDemands, setAllDemands] = useState<TDemanda[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [origins, setOrigins] = useState<Record<string, TOrigen>>({});
  const [isLoading, setIsLoading] = useState(true);
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  const handleFilterChange = (filter: string) => {
    setFilterState(prevState => ({
      ...prevState,
      [filter]: !prevState[filter],
      todos: false, 
    }))
  }

  const handleTodosChange = () => {
    setFilterState({
      todos: true,
      sinAsignar: false,
      asignados: false,
      archivados: false,
      completados: false,
      sinLeer: false,
      leidos: false,
      constatados: false,
      evaluados: false,
    })
  }

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch origins first
      const originsData = await getOrigens();
      const originsMap = originsData.reduce((acc, origin) => {
        acc[origin.id] = origin;
        return acc;
      }, {} as Record<string, TOrigen>);
      setOrigins(originsMap);

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
          const principalNNYA = demandaPersonas.find((dp) => dp.nnya_principal); 
          if (principalNNYA && principalNNYA.persona) {
            const persona = await getTPersona(principalNNYA.persona); 
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
            )[0]; 
    
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
    }finally {
      setIsLoading(false);
    }
  }, [user]);
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])
  useEffect(() => {
    if (allDemands.length > 0) {
      const initialLeidoState = allDemands.reduce((acc, demand) => {
        acc[demand.id] = false; 
        return acc;
      }, {} as Record<number, boolean>);
      setLeidoState(initialLeidoState);
    }
  }, [allDemands]);
  const toggleLeido = (demandId: number) => {
    setLeidoState((prevState) => ({
      ...prevState,
      [demandId]: !prevState[demandId], 
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
    if (filterState.todos) return allDemands;

    return allDemands.filter((demand) => {
      const conditions = [];

      if (filterState.sinAsignar) conditions.push(!demand.asignado);
      if (filterState.asignados) conditions.push(demand.asignado);
      if (filterState.archivados) conditions.push(demand.archivado);
      if (filterState.completados) conditions.push(demand.completado);
      if (filterState.sinLeer) conditions.push(!leidoState[demand.id!]);
      if (filterState.leidos) conditions.push(leidoState[demand.id!]);
      if (filterState.constatados) conditions.push(demand.constatacion);
      if (filterState.evaluados) conditions.push(demand.evaluacion);

      // If no filters are active, show all demands
      if (conditions.length === 0) return true;

      // Return true only if ALL conditions are met (AND logic)
      return conditions.every(condition => condition);
    });
  }, [allDemands, filterState, leidoState]);
  
  

  const enrichedDemands = useMemo(() => {
    return filteredDemands.map((demand) => {
      const persona = personaData[demand.id!];
      const precalificacion = precalificacionData[demand.id!];
      return {
        ...demand,
        nombre: persona ? `${persona.nombre} ${persona.apellido}` : 'N/A', 
        dni: persona?.dni?.toString() || 'N/A',
        precalificacion: precalificacion?.estado_demanda || '',
      };

    });
  }, [filteredDemands, personaData, precalificacionData]);
  

  const handleNuevoRegistro = useCallback(() => {
    setIsNuevoIngresoModalOpen(true)
  }, [])

  const handleCloseNuevoIngreso = useCallback(() => {
    setIsNuevoIngresoModalOpen(false)
  }, [])

  const handleSubmitNuevoIngreso = useCallback(async (formData: Partial<TDemanda>) => {
    try {
      const newDemand = await createDemand(formData, true, '¡Demanda creada con éxito!')
      await fetchAllData() 
      setIsNuevoIngresoModalOpen(false)
    } catch (error) {
      
    }
  }, [fetchAllData])

  const handleDemandClick = useCallback((params: GridRowParams<TDemanda>) => {
    const demandId = params.row.id!;
    toggleLeido(demandId); 
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
        await fetchAllData() 
        setShowDemandaDetalle(false)
        setShowActividadesRegistradas(false)
        setShowPostConstatacion(true)
      } catch (error) {
        
      }
    }
  }, [selectedDemand, fetchAllData])

  const handleEvaluate = useCallback(async () => {
    if (selectedDemand) {
      try {
        const updatedDemand = await updateDemand(selectedDemand.id!, { ...selectedDemand, estado: 'En evaluación' }, true, '¡Demanda actualizada con éxito')
        await fetchAllData() 
        setShowPostConstatacion(false)
      } catch (error) {
        
      }
    }
  }, [selectedDemand, fetchAllData])

  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false)
  
  const handleAsignarSubmit = (data: { collaborator: string; comments: string; demandaId: number | undefined }) => {
    console.log('Assignment Data:', data);
    fetchAllData(); 
    setIsAsignarModalOpen(false);
  }; 


  const handlePrecalificacionChange = useCallback(
    async (demandId: number, newValue: string) => {
      try {
        const currentDate = new Date().toISOString();
        const existingPrecalificacion = precalificacionData[demandId];
  
        if (existingPrecalificacion && existingPrecalificacion.id) {
          
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
  
          
          setPrecalificacionData((prev) => ({
            ...prev,
            [demandId]: { ...existingPrecalificacion, ...updatedPrecalificacion },
          }));
        } else {
          
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
  
          
          setPrecalificacionData((prev) => ({
            ...prev,
            [demandId]: newPrecalificacion,
          }));
        }
      } catch (error) {
        console.error('Error updating precalificación:', error);
  
        
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: '100%',
            position: 'relative'
          }}>
            <Typography>{params.value}</Typography>
            {isUrgent && (
              <Box sx={{
                position: 'absolute',
                right: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pl: 4 
              }}>
                <AlertCircle 
                  className="h-4 w-4" 
                  style={{ 
                    color: 'var(--joy-palette-error-500, #DC2626)'
                  }} 
                />
              </Box>
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
      renderCell: (params: GridRenderCellParams<TDemanda>) => {
          const origin = origins[params.value];
          return <Typography>{origin?.nombre || 'N/A'}</Typography>;
        },
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
              disabled={!isEditable} 
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
        renderCell: (params: GridRenderCellParams<TDemanda>) => {
          if (!params.value) return <Typography>N/A</Typography>;
          
          const date = new Date(params.value);
          const formattedDate = format(date, 'dd/MM/yyyy HH:mm');
          return <Typography>{formattedDate}</Typography>;
        },
      },
  ];

  
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
            event.stopPropagation(); 
            setAssignDemandId(params.row.id); 
            setIsAsignarModalOpen(true); 
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
          id={params.row.id} 
          onClick={onEvaluacionClick} 
          disabled={!params.row.evaluacion} 
        />
      ),
    });
  }

  return baseColumns;
}, [user, handlePrecalificacionChange, origins]);
const getRowClassName = (params: GridRowParams) => {
  const { constatacion, evaluacion, asignado, archivado, completado } = params.row;

  return evaluacion ? 'row-green' : (constatacion ? 'row-purple' : ( (archivado || completado) ? '' : 'row-orange') );
};
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 3, overflow: 'auto' }}>
<Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 3, gap: 2 }}>
  
{isLoading ? (
        <>
          <Skeleton variant="rectangular" width={150} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </>
      ) : (
        <>
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
            onClick={handleFilterClick}
            variant="outlined"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 bg-white"
            sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
              borderRadius: '4px',
              '&:hover': {
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            <FilterList className="h-4 w-4" />
            <span>Filtros</span>
          </Button>
        </>
      )}

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              width: 280,
              maxHeight: 400,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              mt: 1,
            }
          }}
        >
          <Box 
            sx={{ 
              maxHeight: 400,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <List disablePadding>
              <ListItem sx={{ py: 1.5, px: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
              </ListItem>
              
              <ListItem
                button
                onClick={handleTodosChange}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Star className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText primary="Todos" />
                {filterState.todos && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </ListItem>

              <ListItem
                button
                onClick={() => handleFilterChange('sinAsignar')}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonOffIcon className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText primary="Sin Asignar" />
                {filterState.sinAsignar && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </ListItem>

              <ListItem
                button
                onClick={() => handleFilterChange('asignados')}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonCheckIcon className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText primary="Asignados" />
                {filterState.asignados && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </ListItem>

              <ListItem sx={{ py: 1.5, px: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Proceso
                </Typography>
              </ListItem>

              <ListItem
                button
                onClick={() => handleFilterChange('constatados')}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ClipboardCheck className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText primary="Constatados" />
                {filterState.constatados && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </ListItem>

              <ListItem
                button
                onClick={() => handleFilterChange('evaluados')}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FileCheck className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText primary="Evaluados" />
                {filterState.evaluados && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </ListItem>

              <ListItem sx={{ py: 1.5, px: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Archivo
                </Typography>
              </ListItem>

              <ListItem
                button
                onClick={() => handleFilterChange('archivados')}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Archive className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText primary="Archivados" />
                {filterState.archivados && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </ListItem>

              <ListItem
                button
                onClick={() => handleFilterChange('completados')}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FileCheck className="h-4 w-4" />
                </ListItemIcon>
                <ListItemText primary="Completados" />
                {filterState.completados && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </ListItem>

              {!user?.is_superuser && !user?.all_permissions.some((p) => p.codename === 'add_tdemandaasignado') && (
                <>
                  <ListItem sx={{ py: 1.5, px: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Lectura
                    </Typography>
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => handleFilterChange('sinLeer')}
                    sx={{
                      py: 1,
                      px: 2,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Mail className="h-4 w-4" />
                    </ListItemIcon>
                    <ListItemText primary="Sin Leer" />
                    {filterState.sinLeer && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => handleFilterChange('leidos')}
                    sx={{
                      py: 1,
                      px: 2,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MailOpen className="h-4 w-4" />
                    </ListItemIcon>
                    <ListItemText primary="Leídos" />
                    {filterState.leidos && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Popover>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
      {isLoading ? (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={100} height={40} />
                <Skeleton variant="rectangular" width={130} height={40} />
                <Skeleton variant="rectangular" width={130} height={40} />
                <Skeleton variant="rectangular" width={200} height={40} />
                <Skeleton variant="rectangular" width={130} height={40} />
                <Skeleton variant="rectangular" width={180} height={40} />
                <Skeleton variant="rectangular" width={180} height={40} />
              </Box>
            ))}
          </Box>
        ) : 
        filteredDemands.length > 0 ? (
      <DataGrid
      rows={enrichedDemands} 
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
          borderLeft: '6px solid rgba(0, 255, 0, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.05)',
          },
        },
        '& .row-purple': {
          borderLeft: '6px solid rgba(128, 0, 128, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(128, 0, 128, 0.05)',
          },
        },
        '& .row-orange': {
          borderLeft: '6px solid rgba(255, 165, 0, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(255, 165, 0, 0.05)',
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
                  fetchAllData={fetchAllData} 
                />
              )}
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
        demandaId={assignDemandId} 
        isOpen={isAsignarModalOpen}
        onClose={() => {
          setIsAsignarModalOpen(false);
          setAssignDemandId(null); 
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

