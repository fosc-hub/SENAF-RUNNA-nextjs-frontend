import React, { useState, useEffect, useRef } from 'react'
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
import { createTDemandaVinculada, getTDemandaVinculadas } from '../../../api/TableFunctions/demandasVinculadas';
import { getTDemandaPersonas } from '../../../api/TableFunctions/demandaPersonas';
import { getTPersona, getTPersonas, updateTPersona } from '../../../api/TableFunctions/personas';
import { createTActividad, getTActividades, updateTActividad, deleteTActividad } from '../../../api/TableFunctions/actividades';
// Assume these are imported from their respective files
import { useFormData } from './useFormData'
import { useApiData } from './useApiData'
import { renderStepContent } from './RenderstepContent'
import { getTActividadTipo } from '../../../api/TableFunctions/actividadTipos';
import { getTInstitucionActividad } from '../../../api/TableFunctions/institucionActividades';
import { getDemand, updateDemand } from '../../../api/TableFunctions/demands';
import useDemandData from './useDemandData';
import SearchDemands from './SearchDemands';
import { toast } from 'react-toastify';
import { createTUsuarioExterno } from '../../../api/TableFunctions/usuarioExterno';
import { updateLocalizacion } from '../../../api/TableFunctions/localizacion';
import { updateTNNyAEducacion } from '../../../api/TableFunctions/nnyaeducacion';
import { updateTNNyASalud } from '../../../api/TableFunctions/nnyaSalud';
import { updateTVinculoPersonaPersona } from '../../../api/TableFunctions/vinculospersonaspersonas';

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
interface NnyaPrincipalData {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  demandaId: number;
}

interface ConexionData {
  id: number;
  demanda_1: number;
  demanda_2: number;
  deleted: boolean;
  nnyaInfo?: {
    nombre: string;
    apellido: string;
    dni: string;
  };
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


const steps = ['Ingreso', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración',  'Condiciones de Vulnerabilidad']

export default function DemandaDetalleModal({ isOpen, onClose, demanda, fetchAllData }) {
  const {
    origenes,
    subOrigenes,
    instituciones,
    informante,
    motivosIntervencion,
    selectedMotivo,
    selectedData,
    selectedInformante,
    localizacion,
    barrios,
    localidades,
    cpcs,
  } = useDemandData(demanda);
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
  const [nnyaPrincipales, setNnyaPrincipales] = useState<NnyaPrincipalData[]>([]);
  const [selectedNnya, setSelectedNnya] = useState<string>('');
  const [vinculacionError, setVinculacionError] = useState('');
  const [conexiones, setConexiones] = useState<ConexionData[]>([]);
  const [loadingConexiones, setLoadingConexiones] = useState(false);
  const isSubmittingRef = useRef(false);

  const fetchNnyaPrincipales = async () => {
    try {
      const demandaPersonaData = await getTDemandaPersonas({ nnya_principal: true });
      const nnyaPrincipalesInfo = demandaPersonaData
        .filter(dp => dp.nnya_principal === true)
        .map(dp => ({ personaId: dp.persona, demandaId: dp.demanda }));

      if (nnyaPrincipalesInfo.length === 0) {
        console.warn('No NNYA principales found.');
        setNnyaPrincipales([]);
        return;
      }

      const allPersonaData = await getTPersonas();
      const nnyaPrincipalesData = nnyaPrincipalesInfo.map(info => {
        const persona = allPersonaData.find(p => p.id === info.personaId);
        return persona ? {
          id: persona.id,
          nombre: persona.nombre,
          apellido: persona.apellido,
          dni: persona.dni,
          demandaId: info.demandaId
        } : null;
      }).filter((p): p is NnyaPrincipalData => p !== null);

      setNnyaPrincipales(nnyaPrincipalesData);
    } catch (error) {
      console.error('Error fetching NNYA principales:', error);
      setVinculacionError('Error al cargar los datos de NNYA principales');
    }
  };
  const fetchConexiones = async () => {
    setLoadingConexiones(true);
    try {
      const conexionesData = await getTDemandaVinculadas({ demanda_1: demanda.id });
      const conexionesWithInfo = await Promise.all(conexionesData.map(async (conexion) => {
        const demandaVinculada = await getDemand(conexion.demanda_2);
        const demandaPersona = await getTDemandaPersonas({ demanda: conexion.demanda_2, nnya_principal: true });
        if (demandaPersona.length > 0) {
          const persona = await getTPersona(demandaPersona[0].persona);
          return {
            ...conexion,
            nnyaInfo: {
              nombre: persona.nombre,
              apellido: persona.apellido,
              dni: persona.dni
            }
          };
        }
        return conexion;
      }));
      setConexiones(conexionesWithInfo);
    } catch (error) {
      console.error('Error fetching conexiones:', error);
    } finally {
      setLoadingConexiones(false);
    }
  };

  useEffect(() => {


    
    fetchNnyaPrincipales();
    fetchConexiones();
  }, [demanda.id]);
  const handleSaveEditDemanda = async () => {
    if (isSubmittingRef.current) return; // Prevent duplicate submissions
  
    isSubmittingRef.current = true;
    setIsSubmitting(true);
  
    try {
      console.log("Starting demand update process");
  
      // Update the localizacion if it exists
      if (formData.localizacion?.id) {
        const updatedLocalizacion = {
          calle: formData.localizacion.calle,
          tipo_calle: formData.localizacion.tipo_calle,
          piso_depto: formData.localizacion.piso_depto
            ? parseInt(formData.localizacion.piso_depto, 10)
            : null,
          lote: formData.localizacion.lote
            ? parseInt(formData.localizacion.lote, 10)
            : null,
          mza: formData.localizacion.mza
            ? parseInt(formData.localizacion.mza, 10)
            : null,
          casa_nro: formData.localizacion.casa_nro
            ? parseInt(formData.localizacion.casa_nro, 10)
            : null,
          referencia_geo: formData.localizacion.referencia_geo,
          barrio: formData.localizacion.barrio,
          localidad: formData.localizacion.localidad,
          cpc: formData.localizacion.cpc,
        };
  
        console.log("Updating localizacion:", formData.localizacion.id, updatedLocalizacion);
  
        await updateLocalizacion(formData.localizacion.id, updatedLocalizacion);
        console.log("Localizacion updated successfully");
      } else {
        console.warn("No localizacion ID provided. Skipping localizacion update.");
      }
  
      // Update ninosAdolescentes (children)
      for (const nino of formData.ninosAdolescentes) {
        if (nino.id) {
            const updatedNino = {
                nombre: nino.nombre,
                apellido: nino.apellido,
                fechaNacimiento: nino.fechaNacimiento,
                genero: nino.genero,
                dni: nino.dni ? parseInt(nino.dni, 10) : null,
                situacionDni: nino.situacionDni,
                botonAntipanico: nino.botonAntipanico,
                observaciones: nino.observaciones,
            };
            console.log("Updating nino:", nino.id, updatedNino);

            try {
                await updateTPersona(nino.id, updatedNino);
                console.log(`Nino ID ${nino.id} updated successfully`);
            } catch (error) {
                console.error(`Error updating nino ID ${nino.id}:`, error);
            }

            // Update educational information if it exists
            if (nino.educacion?.id) {
                const updatedEducacion = {
                    institucion_educativa: nino.educacion.institucion_educativa,
                    curso: nino.educacion.curso,
                    nivel: nino.educacion.nivel,
                    turno: nino.educacion.turno,
                    comentarios: nino.educacion.comentarios,
                };

                console.log("Updating educacion for nino:", nino.id, updatedEducacion);

                try {
                    await updateTNNyAEducacion(nino.educacion.id, updatedEducacion);
                    console.log(`Educational information for nino ID ${nino.id} updated successfully`);
                } catch (error) {
                    console.error(`Error updating educational information for nino ID ${nino.id}:`, error);
                }
            }

            // Update health information if it exists
            if (nino.salud?.id) {
                const updatedSalud = {
                    institucion_sanitaria: nino.salud.institucion_sanitaria,
                    observaciones: nino.salud.observaciones,
                };

                console.log("Updating salud for nino:", nino.id, updatedSalud);

                try {
                    await updateTNNyASalud(nino.salud.id, updatedSalud);
                    console.log(`Health information for nino ID ${nino.id} updated successfully`);
                } catch (error) {
                    console.error(`Error updating health information for nino ID ${nino.id}:`, error);
                }
            }
        }
    }
    for (const vinculo of formData.vinculaciones) {
      if (vinculo.id) {
          const updatedVinculo = {
              conviven: vinculo.conviven,
              autordv: vinculo.autordv,
              garantiza_proteccion: vinculo.garantiza_proteccion,
              persona_1: vinculo.persona_1,
              persona_2: vinculo.persona_2,
              vinculo: vinculo.vinculo,
          };
          console.log("Updating vinculo:", vinculo.id, updatedVinculo);

          try {
              await updateTVinculoPersonaPersona(vinculo.id, updatedVinculo);
              console.log(`Vinculo ID ${vinculo.id} updated successfully`);
          } catch (error) {
              console.error(`Error updating vinculo ID ${vinculo.id}:`, error);
          }
      } else {
          console.warn("Vinculo ID is missing, skipping update.");
      }
  }
    // Update adultosConvivientes (adults)
    for (const adulto of formData.adultosConvivientes) {
        if (adulto.id) {
            const updatedAdulto = {
                nombre: adulto.nombre,
                apellido: adulto.apellido,
                fechaNacimiento: adulto.fechaNacimiento,
                genero: adulto.genero,
                dni: adulto.dni ? parseInt(adulto.dni, 10) : null,
                situacionDni: adulto.situacionDni,
                botonAntipanico: adulto.botonAntipanico,
                supuesto_autordv: adulto.supuesto_autordv,
                observaciones: adulto.observaciones,
            };
            console.log("Updating adulto:", adulto.id, updatedAdulto);

            try {
                await updateTPersona(adulto.id, updatedAdulto);
                console.log(`Adulto ID ${adulto.id} updated successfully`);
            } catch (error) {
                console.error(`Error updating adulto ID ${adulto.id}:`, error);
            }

            // Update health information if it exists
            if (adulto.salud?.id) {
                const updatedSalud = {
                    institucion_sanitaria: adulto.salud.institucion_sanitaria,
                    observaciones: adulto.salud.observaciones,
                };

                console.log("Updating salud for adulto:", adulto.id, updatedSalud);

                try {
                    await updateTNNyASalud(adulto.salud.id, updatedSalud);
                    console.log(`Health information for adulto ID ${adulto.id} updated successfully`);
                } catch (error) {
                    console.error(`Error updating health information for adulto ID ${adulto.id}:`, error);
                }
            }
        }
    }
  
      // Update adultosConvivientes (adults)
      for (const adulto of formData.adultosConvivientes) {
        if (adulto.id) {
          const updatedAdulto = {
            nombre: adulto.nombre,
            apellido: adulto.apellido,
            fechaNacimiento: adulto.fechaNacimiento,
            genero: adulto.genero,
            dni: adulto.dni ? parseInt(adulto.dni, 10)
            : null,
            situacionDni: adulto.situacionDni,
            botonAntipanico: adulto.botonAntipanico,
            supuesto_autordv: adulto.supuesto_autordv,
            observaciones: adulto.observaciones,
          };
          console.log("Updating adulto:", adulto.id, updatedAdulto);
  
          try {
            await updateTPersona(adulto.id, updatedAdulto);
            console.log(`Adulto ID ${adulto.id} updated successfully`);
          } catch (error) {
            console.error(`Error updating adulto ID ${adulto.id}:`, error);
          }
        }
      }
  
      // Collect the current form data for the demanda
      const updatedData = {
        fecha_y_hora_ingreso: formData.fecha_y_hora_ingreso.toISOString(),
        origen: formData.origen,
        sub_origen: formData.sub_origen,
        institucion: formData.institucion,
        nro_notificacion_102: Number(formData.nro_notificacion_102) || null,
        nro_sac: Number(formData.nro_sac) || null,
        nro_suac: Number(formData.nro_suac) || null,
        nro_historia_clinica: Number(formData.nro_historia_clinica) || null,
        nro_oficio_web: Number(formData.nro_oficio_web) || null,
        descripcion: formData.descripcion,
        localizacion: formData.localizacion?.id || null, // Ensure you pass the localizacion ID
        informante: formData.createNewinformante
          ? await createInformante(formData.informante) // Handle new informante creation
          : formData.informante?.id,
      };
  
      // Update the demand with the collected data
      await updateDemand(demanda.id, updatedData);
      console.log("Demand updated successfully");
  
      // Show success notification
      toast.success("Demanda actualizada con éxito", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
  
      // Optional: Refresh parent data if necessary
      if (typeof fetchAllData === "function") {
        fetchAllData();
      }
  
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating demand or localizacion:", error);
      toast.error("Error al actualizar la demanda o la localización", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false; // Reset submission state
    }
  };
  
  
  
  

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


  const handleVincular = async () => {
    if (!selectedNnya) {
      setVinculacionError('Por favor, seleccione un NNYA principal');
      return;
    }

    try {
      const selectedPersona = nnyaPrincipales.find(p => p.id.toString() === selectedNnya);
      if (!selectedPersona) {
        setVinculacionError('NNYA principal no encontrado');
        return;
      }

      const demandaPersonaData = await getTDemandaPersonas({ persona: selectedPersona.id });

      if (demandaPersonaData.length === 0) {
        setVinculacionError('No se encontró ninguna demanda asociada a este NNYA principal');
        return;
      }

      const demandaToLink = demandaPersonaData[0].demanda;

      await createTDemandaVinculada({
        demanda_1: demanda.id,
        demanda_2: demandaToLink,
        deleted: false
      });

      setSelectedNnya('');
      setVinculacionError('');
      fetchConexiones();
      // You might want to refresh the list of linked demands here
    } catch (error) {
      console.error('Error al vincular demandas:', error);
      setVinculacionError('Error al vincular demandas');
    }
  };

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
        await updateTActividad(editingActividad.id, updatedActividad, true, '¡Actividad actualizada con éxito!');
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
  const [sections, setSections] = useState({
    datosRequeridos: true,
    conexiones: false,
    derivar: false,
  });
  
  const toggleSection = (section: 'datosRequeridos' | 'conexiones' | 'derivar') => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
      const newActividad = await createTActividad(actividadData, true, '¡Actividad registrada con éxito!');
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
    createTRespuesta(dataToSend, true, '¡Respuesta enviada con éxito!');

    setIsEnviarRespuestaOpen(false);
  };

  const apiData = useApiData(demanda?.id, demanda?.localizacion, demanda?.usuarioExterno);
  const { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addVulneraciontext, addVinculacion, removeVinculacion, addCondicionVulnerabilidad, removeCondicionVulnerabilidad
  } = useFormData(demanda, apiData);

  
  









  const handleOpenEnviarRespuesta = () => setIsEnviarRespuestaOpen(true)
  const handleCloseEnviarRespuesta = () => setIsEnviarRespuestaOpen(false)


  const handleNextStep = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };
  
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0))
  const handleEnviarAEvaluacion = async () => {
    try {
      const updatedData = {
        ...demanda,
        constatacion: false,
        evaluacion: true,
      };
  
      await updateDemand(demanda.id, updatedData);
  
      setDemandState('evaluacion');
      console.log('Demanda enviada a proceso de evaluación');
      onClose(); // Close the modal
      if (typeof fetchAllData === 'function') {
        fetchAllData(); // Trigger data refresh if passed as prop
      }
    } catch (error) {
      console.error('Error al enviar a evaluación:', error);
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
      



  
      console.log('Form submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

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

          {/* <Typography variant="h6" gutterBottom>Archivos adjuntos ({formData.archivosAdjuntos?.length || 0})</Typography>
          <Box component="ul" sx={{ mb: 3, pl: 2 }}>
            {formData.archivosAdjuntos?.map((archivo, index) => (
              <Typography component="li" key={index}>{archivo}</Typography>
            ))}
          </Box> */}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button variant="contained" startIcon={<MessageIcon />} onClick={() => setIsEnviarRespuestaOpen(true)}>
                Enviar Respuesta
              </Button>
              {/* <Button variant="outlined" startIcon={<AttachFileIcon />} onClick={() => setIsArchivosModalOpen(true)}>
                Archivos adjuntos
              </Button> */}
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
  {renderStepContent({
    activeStep,
    formData,
    handleInputChange,
    addNinoAdolescente,
    addAdultoConviviente,
    addVinculacion,
    removeVinculacion,
    addVulneraciontext,
    addCondicionVulnerabilidad,
    removeCondicionVulnerabilidad,
    ...apiData,
    addVulneracionApi: apiData.addVulneracion,
    origenes,
    subOrigenes,
    institucionesDemanda: instituciones,
    informante,
    selectedInformante, // Pass pre-selected informante
    motivosIntervencion, // Pass all motivosIntervencion
    selectedMotivo, // Pass pre-selected motivo
    localizacion: formData.localizacion, // Pass updated localizacion
    barrios,
    localidades,
    cpcs,
    nnyaList: formData.ninosAdolescentes, // Updated NNYA with localizacion
    adultsList: formData.adultosConvivientes, // Updated adultos with localizacion
  })}
</LocalizationProvider>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack} disabled={activeStep === 0}>
                    Anterior
                  </Button>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>

  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
  {/* Back Button */}


  {/* Conditional Buttons */}
  {activeStep === steps.length - 1 ? (
    // Guardar Button
    <Button
      type="button"
      variant="contained"
      color="primary"
      onClick={handleSaveEditDemanda} // Call handleSaveEditDemanda here
      disabled={isSubmitting} // Disable during submission
    >
      Guardar
    </Button>
  ) : (
    // Siguiente Button
    <Button
      type="button"
      variant="contained"
      color="primary"
      onClick={handleNextStep} // Call handleNextStep for navigation
    >
      Siguiente
    </Button>
  )}
</Box>

</Box>

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
<CollapsibleSection
        title="Conexiones de la Demanda"
        isOpen={sections.conexiones}
        onToggle={() => toggleSection('conexiones')}
      >
        <SearchDemands
          demandaId={demanda.id}
          conexiones={conexiones}
          nnyaPrincipales={nnyaPrincipales}
          selectedNnya={selectedNnya}
          setSelectedNnya={setSelectedNnya}
          vinculacionError={vinculacionError}
          handleVincular={handleVincular}
          loadingConexiones={loadingConexiones}
        />
        <Typography variant="subtitle1" color="primary" gutterBottom>Conexiones existentes</Typography>
        {loadingConexiones ? (
          <CircularProgress />
        ) : (
          <List>
            {conexiones.map((conexion) => (
              <ListItem key={conexion.id}>
                <ListItemText 
                  primary={`Demanda ID: ${conexion.demanda_2}`}
                  secondary={
                    conexion.nnyaInfo
                      ? `${conexion.nnyaInfo.nombre} ${conexion.nnyaInfo.apellido} - DNI: ${conexion.nnyaInfo.dni}`
                      : 'Información no disponible'
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CollapsibleSection>

    {demanda.constatacion && (
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnviarAEvaluacion} // Attach your existing function
          >
            Enviar a Proceso de Evaluación
          </Button>
        </Box>
      )}
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

      {/* <ArchivosAdjuntosModal
        isOpen={isArchivosModalOpen}
        onClose={() => setIsArchivosModalOpen(false)}
        onSave={handleArchivosSubmit}
        initialFiles={formData.archivosAdjuntos || []}
        initialComments=""
      /> */}

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

function createInformante(informante: any) {
  throw new Error('Function not implemented.');
}

