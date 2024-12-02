import React, { useState, useEffect } from 'react'
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Divider,
  List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Grid
} from '@mui/material'
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AttachFile as AttachFileIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { X, MessageSquare, FileIcon as AttachFile, User } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { es } from 'date-fns/locale'
import { ArchivosAdjuntosModal } from '../ArchivosAdjuntosModal'
import { RegistrarActividadModal } from '../RegistrarActividadModal'
import { EnviarRespuestaModal } from '../EnviarRespuestaModal'
import { createTRespuesta } from '../../../api/TableFunctions/respuestas'

import { createTActividad, getTActividades, updateTActividad, deleteTActividad } from '../../../api/TableFunctions/actividades';
// Assume these are imported from their respective files
import { useFormData } from './useFormData'
import { useApiData } from './useApiData'
import { renderStepContent } from './RenderstepContent'
import { getTActividadTipo } from '../../../api/TableFunctions/actividadTipos';
import { getTInstitucionActividad } from '../../../api/TableFunctions/institucionActividades';

interface Actividad {
  id: number;
  fecha_y_hora: String;
  descripcion: string;
  demanda: number;
  tipo?: number | null;
  institucion?: number | null;
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}  


function CollapsibleSection({ title, children, isOpen, onToggle }: CollapsibleSectionProps) {
  return (
    <Paper sx={{ mb: 3 }} elevation={3}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      {isOpen && <Box sx={{ p: 2 }}>{children}</Box>}
    </Paper>
  );
}

const steps = ['Ingreso', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración', 'Vinculos', 'Condiciones de Vulnerabilidad']

export default function DemandaDetalleModal({ isOpen, onClose, demanda }) {
  const [demandState, setDemandState] = useState('constatacion');
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isArchivosModalOpen, setIsArchivosModalOpen] = useState(false)
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false)
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false)
  const [usuariosExternos, setUsuariosExternos] = useState([])
  const [isStepContentOpen, setIsStepContentOpen] = useState(true)
  const [isActividadesOpen, setIsActividadesOpen] = useState(true);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);
  const [editedDescripcion, setEditedDescripcion] = useState<string>('');
  const [editedTipo, setEditedTipo] = useState<number | string>('');
  const [editedInstitucion, setEditedInstitucion] = useState<number | string>('');
  const [editedFechaHora, setEditedFechaHora] = useState<String>('');
  const [tipoNames, setTipoNames] = useState<Record<number, string>>({});
  const [institucionNames, setInstitucionNames] = useState<Record<number, string>>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  // const [actividadToDelete, setActividadToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchActividades = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTActividades({ demanda: demanda.id });

        // Map through the data to convert 'fecha_y_hora' from String to string
        const mappedData = data.map((actividad: Actividad) => ({
          ...actividad,
          fecha_y_hora: actividad.fecha_y_hora.toString(), // Convert to string
        }));

        setActividades(mappedData);
      } catch (err) {
        setError('Error al cargar las actividades');
        console.error('Error fetching actividades:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchActividades();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchNames = async () => {
      const tipoPromises = actividades.map((actividad) =>
        actividad.tipo ? getTActividadTipo(actividad.tipo) : Promise.resolve(null)
      );
      const institucionPromises = actividades.map((actividad) =>
        actividad.institucion ? getTInstitucionActividad(actividad.institucion) : Promise.resolve(null)
      );

      const tipos = await Promise.all(tipoPromises);
      const instituciones = await Promise.all(institucionPromises);

      const newTipoNames = tipos.reduce((acc, tipo, idx) => {
        if (tipo) acc[actividades[idx].tipo!] = tipo.nombre;
        return acc;
      }, {} as Record<number, string>);

      const newInstitucionNames = instituciones.reduce((acc, institucion, idx) => {
        if (institucion) acc[actividades[idx].institucion!] = institucion.nombre;
        return acc;
      }, {} as Record<number, string>);

      setTipoNames(newTipoNames);
      setInstitucionNames(newInstitucionNames);
    };

    if (actividades.length > 0) {
      fetchNames();
    }
  }, [actividades]);

  const handleEditClick = (actividad: Actividad) => {
    setEditingActividad(actividad);
    setEditedDescripcion(actividad.descripcion);
    setEditedTipo(actividad.tipo ?? '');
    setEditedInstitucion(actividad.institucion ?? '');
    const localDate = new Date(actividad.fecha_y_hora as string);
    const offset = localDate.getTimezoneOffset() * 60000;
    const localISODate = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
    setEditedFechaHora(localISODate);
  };

  // const handleDeleteClick = (actividadId: number) => {
  //   setActividadToDelete(actividadId);
  //   setOpenConfirmDialog(true);
  // };

  // const handleConfirmDelete = async () => {
  //   if (actividadToDelete === null) return;

  //   try {
  //     await deleteTActividad(actividadToDelete);
  //     setActividades(actividades.filter((actividad) => actividad.id !== actividadToDelete));
  //   } catch (error) {
  //     console.error('Error eliminando la actividad:', error);
  //   }
  //   setOpenConfirmDialog(false);
  //   setActividadToDelete(null);
  //   setEditingActividad(null);
  // };

  // const handleCancelDelete = () => {
  //   setOpenConfirmDialog(false);
  //   setActividadToDelete(null);
  // };

  const handleCancelEdit = () => {
    setEditingActividad(null);
    setEditedDescripcion('');
    setEditedTipo('');
    setEditedInstitucion('');
    setEditedFechaHora('');
  };

  const handleSaveEdit = async () => {
    if (editingActividad) {
      const updatedActividad = {
        descripcion: editedDescripcion,
        tipo: editedTipo ? Number(editedTipo) : null,
        institucion: editedInstitucion ? Number(editedInstitucion) : null,
        fecha_y_hora: editedFechaHora,
      };

      try {
        console.log('Actualizando actividad:', editingActividad.id, updatedActividad);
        await updateTActividad(editingActividad.id, updatedActividad);
        setActividades(
          actividades.map((actividad) =>
            actividad.id === editingActividad.id
              ? { ...actividad, ...updatedActividad }
              : actividad
          )
        );
        setEditingActividad(null);
      } catch (error) {
        console.error('Error actualizando la actividad:', error);
      }
    }
  };

  const toggleActividades = () => setIsActividadesOpen(!isActividadesOpen);

  const handleArchivosSubmit = (data: { files: string[], comments: string }) => {
    console.log('Archivos adjuntos:', data)
    setIsArchivosModalOpen(false)
  }

  const handleAsignarSubmit = (data: { collaborator: string, comments: string }) => {
    console.log('Asignar demanda:', data)
    setIsAsignarModalOpen(false)
  }

  const handleRegistrarSubmit = async (data: any) => {
    try {
      console.log('Registrar actividad:', data);
      const fechaHoraISO = new Date(`${data.date}T${data.time}`).toISOString();

      const actividadData = {
        fecha_y_hora: fechaHoraISO,
        descripcion: data.observations,
        demanda: data.demanda,
        tipo: data.activity ? Number(data.activity) : null,
        institucion: data.institution ? Number(data.institution) : null,
      };
      const newActividad = await createTActividad(actividadData);
      console.log('Actividad registrada:', newActividad);
      setActividades(prev => [...prev, newActividad]);
    } catch (error) {
      console.error('Error al registrar actividad:', error);
    }

    setIsRegistrarModalOpen(false);
  };

  const handleEnviarRespuestaSubmit = (data: {
    institucion: number;
    mail: string;
    mensaje: string;
    demanda: number;
    fecha_y_hora: Date | null
  }) => {
    const dataToSend = {
      mail: data.mail,
      mensaje: data.mensaje,
      // fecha_y_hora: data.fecha_y_hora,
      demanda: data.demanda,
      institucion: data.institucion,
    };
    console.log('Enviar:', dataToSend);
    createTRespuesta(dataToSend);

    setIsEnviarRespuestaOpen(false);
  };

  const apiData = useApiData(demanda?.id, demanda?.localizacion, demanda?.usuarioExterno);
  const { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addVulneraciontext, addVinculacion, removeVinculacion, addCondicionVulnerabilidad, removeCondicionVulnerabilidad
  } = useFormData(demanda, apiData);
  useEffect(() => {
    if (apiData.localizacion) {
      handleInputChange('localizacion', {
        ...formData.localizacion,
        ...apiData.localizacion,
      })
    }
  }, [apiData.localizacion])
  useEffect(() => {
    if (apiData.vinculaciones) {
      handleInputChange('vinculaciones', apiData.vinculaciones);
    }
  }, [apiData.vinculaciones]);
  
  useEffect(() => {
    if (apiData.vinculoPersonas) {
      handleInputChange('vinculoPersonas', apiData.vinculoPersonas);
    }
  }, [apiData.vinculoPersonas]);
  
  
  useEffect(() => {
    if (apiData.nnyaList) {
      handleInputChange('ninosAdolescentes', apiData.nnyaList);
    }
  }, [apiData.nnyaList]);

  // Synchronize currentMotivoIntervencion into formData
  useEffect(() => {
    if (
      apiData.currentMotivoIntervencion &&
      formData.presuntaVulneracion.motivos !== apiData.currentMotivoIntervencion.id
    ) {
      handleInputChange(
        'presuntaVulneracion.motivos',
        apiData.currentMotivoIntervencion.id
      )
    }
  }, [apiData.currentMotivoIntervencion, formData.presuntaVulneracion.motivos])
  useEffect(() => {
    console.log('Localización ID:', demanda?.localizacion);
  }, [demanda?.localizacion]);
  useEffect(() => {
    if (apiData.vulneraciones?.length) {
      handleInputChange('vulneraciones', apiData.vulneraciones);
    }
  }, [apiData.vulneraciones]);




  useEffect(() => {
    const fetchUsuariosExternos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/usuario-externo/');
        const data = await response.json();
        setUsuariosExternos(data);
      } catch (error) {
        console.error('Error fetching usuarios externos:', error);
      }
    };

    fetchUsuariosExternos();
  }, []);

  const handleOpenEnviarRespuesta = () => setIsEnviarRespuestaOpen(true)
  const handleCloseEnviarRespuesta = () => setIsEnviarRespuestaOpen(false)

  const handleDemandaClick = () => {
    if (!demanda?.id) {
      console.error('Demanda ID is undefined');
      return;
    }
    console.log('Clicked demanda ID:', demanda.id);
  };

  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0))
  const handleEnviarAEvaluacion = async () => {
    try {
      const updatedDemanda = {
        ...demanda,
        constatacion: false,
        evaluacion: true,
      };

      const response = await fetch(`http://localhost:8000/api/demanda/${demanda.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDemanda),
      });

      if (!response.ok) {
        throw new Error('Failed to update demanda');
      }

      setDemandState('evaluacion');
      console.log('Demanda enviada a proceso de evaluación');
    } catch (error) {
      console.error('Error al enviar a evaluación:', error);
    }
  };

  const handleEnviarADecision = async () => {
    try {
      const updatedDemanda = {
        ...demanda,
        evaluacion: false,
        decision: true,
      };

      const response = await fetch(`http://localhost:8000/api/demanda/${demanda.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDemanda),
      });

      if (!response.ok) {
        throw new Error('Failed to update demanda');
      }

      setDemandState('decision');
      console.log('Demanda enviada a proceso de toma de decisión');
    } catch (error) {
      console.error('Error al enviar a toma de decisión:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
      return
    }
    setIsSubmitting(true)

    try {
      if (formData.createNewUsuarioExterno || (formData.usuarioExterno.id && formData.usuarioExterno.nombre)) {
        const usuarioExternoResponse = await fetch(
          formData.usuarioExterno.id
            ? `http://localhost:8000/api/usuario-externo/${formData.usuarioExterno.id}/`
            : 'http://localhost:8000/api/usuario-externo/',
          {
            method: formData.usuarioExterno.id ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData.usuarioExterno),
          }
        );

        if (!usuarioExternoResponse.ok) {
          throw new Error('Failed to save usuario externo');
        }

        const savedUsuarioExterno = await usuarioExternoResponse.json();
        handleInputChange('usuarioExterno', savedUsuarioExterno);
      }

      const localizacionResponse = await fetch(
        formData.localizacion.id
          ? `http://localhost:8000/api/localizacion/${formData.localizacion.id}/`
          : 'http://localhost:8000/api/localizacion/',
        {
          method: formData.localizacion.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.localizacion),
        }
      );

      if (!localizacionResponse.ok) {
        throw new Error('Failed to save localizacion');
      }

      const savedLocalizacion = await localizacionResponse.json();
      handleInputChange('localizacion', savedLocalizacion);

      const updatedDemanda = {
        ...demanda,
        usuarioExterno: formData.usuarioExterno.id,
        localizacion: savedLocalizacion.id,
      };

      const demandaResponse = await fetch(`http://localhost:8000/api/demanda/${demanda.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDemanda),
      });

      if (!demandaResponse.ok) {
        throw new Error('Failed to update demanda');
      }

      console.log('Form submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
        <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: 5,
        overflowY: 'auto',
        zIndex: 1000,
      }}>
        <Paper sx={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto', p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h4" component="h2">{demanda.nombre}</Typography>
              <Typography variant="subtitle1" color="text.secondary">DNI {demanda.dni} - {demanda.edad} años</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              {formData.calificacion === 'urgente' && (
                <Typography variant="caption" sx={{ bgcolor: 'error.main', color: 'error.contrastText', px: 1, py: 0.5, borderRadius: 1, mr: 2 }}>
                  URGENTE
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" mr={2}>Actualizado: {new Date(formData.fechaActualizacion).toLocaleDateString()}</Typography>
              <IconButton onClick={onClose} size="small">
                <X />
              </IconButton>
            </Box>
          </Box>

          {!demanda.asociadoRegistro && (
            <Paper sx={{ bgcolor: 'warning.light', p: 2, mb: 3 }} elevation={0}>
              <Typography color="warning.dark">La presente demanda no está asociada a un registro ni legajo.</Typography>
            </Paper>
          )}

          <Typography variant="h6" gutterBottom>Archivos adjuntos ({formData.archivosAdjuntos?.length || 0})</Typography>
          <Box component="ul" sx={{ mb: 3, pl: 2 }}>
            {formData.archivosAdjuntos?.map((archivo, index) => (
              <Typography component="li" key={index}>{archivo}</Typography>
            ))}
          </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button variant="contained" startIcon={<MessageIcon />} onClick={() => setIsEnviarRespuestaOpen(true)}>
                Enviar Respuesta
              </Button>
              <Button variant="outlined" startIcon={<AttachFileIcon />} onClick={() => setIsArchivosModalOpen(true)}>
                Archivos adjuntos
              </Button>
              <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => setIsAsignarModalOpen(true)}>
                Asignar
              </Button>
              <Button variant="contained" onClick={() => setIsRegistrarModalOpen(true)}>
                Registrar actividad
              </Button>
            </Box>
            <CollapsibleSection
              title={`Detalle de la Demanda `}
              isOpen={isStepContentOpen}
              onToggle={() => setIsStepContentOpen(!isStepContentOpen)}
            >
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <form onSubmit={handleSubmit}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  {apiData.barrios && apiData.localidades && apiData.cpcs ? (
                    renderStepContent({
                      activeStep,
                      formData: {
                        ...formData,
                        ninosAdolescentes: apiData.nnyaList,
                      },
                      handleInputChange,
                      motivosIntervencion: apiData.motivosIntervencion,
                      currentMotivoIntervencion: apiData.currentMotivoIntervencion,
                      demandaMotivoIntervencion: apiData.demandaMotivoIntervencion,
                      barrios: apiData.barrios,
                      localidades: apiData.localidades,
                      cpcs: apiData.cpcs,
                      localizacion: apiData.localizacion,
                      usuarioExterno: apiData.usuarioExterno,
                      vinculosUsuarioExterno: apiData.vinculosUsuarioExterno,
                      institucionesUsuarioExterno: apiData.institucionesUsuarioExterno,
                      usuariosExternos,
                      demanda,
                      getMotivoIntervencion: apiData.getMotivoIntervencion,
                      institucionesEducativas: apiData.institucionesEducativas,
                      institucionesSanitarias: apiData.institucionesSanitarias,
                      addNinoAdolescente,
                      addAdultoConviviente,
                      addVulneraciontext,
                      categoriaMotivos: apiData.categoriaMotivos,
                      categoriaSubmotivos: apiData.categoriaSubmotivos,
                      gravedadVulneraciones: apiData.gravedadVulneraciones,
                      urgenciaVulneraciones: apiData.urgenciaVulneraciones,
                    })
                  ) : (
                    <Typography>Loading data...</Typography>
                  )}
                </LocalizationProvider>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack} disabled={activeStep === 0}>
                    Anterior
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : (activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente')}
                  </Button>
                </Box>
              </form>
            </CollapsibleSection>
            <CollapsibleSection title="Actividades Registradas" isOpen={isActividadesOpen} onToggle={() => setIsActividadesOpen(!isActividadesOpen)}>
  {isLoading ? (
    <CircularProgress />
  ) : error ? (
    <Typography color="error">{error}</Typography>
  ) : actividades.length === 0 ? (
    <Typography>No hay actividades registradas.</Typography>
  ) : (
    <List>
      {actividades.map((actividad) => (
        <div key={actividad.id}>
          <ListItem>
            {editingActividad?.id !== actividad.id ? (
              <ListItemText
                primary={actividad.descripcion}
                secondary={`${new Date(actividad.fecha_y_hora).toLocaleString()} - ${tipoNames[actividad.tipo ?? 0] ?? 'Sin tipo'} - ${institucionNames[actividad.institucion ?? 0] ?? 'Sin institución'}`}
              />
            ) : (
              <div style={{ width: '100%' }}>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Descripción"
                      value={editedDescripcion}
                      onChange={(e) => setEditedDescripcion(e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} md={3}>
                    <TextField
                      label="Tipo"
                      value={editedTipo}
                      onChange={(e) => setEditedTipo(e.target.value)}
                      fullWidth
                      margin="normal"
                      select
                      size="small"
                    >
                      {Object.entries(tipoNames).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={3} md={3}>
                    <TextField
                      label="Institución"
                      value={editedInstitucion}
                      onChange={(e) => setEditedInstitucion(e.target.value)}
                      fullWidth
                      margin="normal"
                      select
                      size="small"
                    >
                      {Object.entries(institucionNames).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Campo para fecha y hora */}
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Fecha y Hora"
                      type="datetime-local"
                      value={editedFechaHora}
                      onChange={(e) => setEditedFechaHora(e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Button variant="contained" onClick={handleSaveEdit}>
                    Confirmar
                  </Button>
                  <Button variant="outlined" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                </Box>
              </div>
            )}

            {editingActividad?.id !== actividad.id && (
              <IconButton onClick={() => handleEditClick(actividad)}>
                <EditIcon />
              </IconButton>
            )}
          </ListItem>
          
          {/* Agregar un Divider después de cada ListItem */}
          <Divider />
        </div>
      ))}
    </List>
  )}
</CollapsibleSection>

            {/* <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
              <DialogTitle>¿Estás seguro de que deseas eliminar esta actividad?</DialogTitle>
              <DialogContent>
                <Typography>Una vez eliminada, no podrás recuperar esta actividad.</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Cancelar
                </Button>
                <Button onClick={handleConfirmDelete} color="error">
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog> */}
          </Paper>
        </Box>
      </Modal >

      <ArchivosAdjuntosModal
        isOpen={isArchivosModalOpen}
        onClose={() => setIsArchivosModalOpen(false)}
        onSave={handleArchivosSubmit}
        initialFiles={formData.archivosAdjuntos || []}
        initialComments=""
      />

      <AsignarDemandaModal
        isOpen={isAsignarModalOpen}
        onClose={() => setIsAsignarModalOpen(false)}
        onAssign={handleAsignarSubmit}
      />

      <RegistrarActividadModal
        isOpen={isRegistrarModalOpen}
        onClose={() => setIsRegistrarModalOpen(false)}
        onSubmit={handleRegistrarSubmit}
        idDemanda={demanda.id}
      />

        <EnviarRespuestaModal
          isOpen={isEnviarRespuestaOpen}
          onClose={() => setIsEnviarRespuestaOpen(false)}
          onSend={handleEnviarRespuestaSubmit}
          idDemanda={demanda.id}
        />
    </>
  )
}

