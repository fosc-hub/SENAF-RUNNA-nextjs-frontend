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
} from '@mui/material'
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AttachFile as AttachFileIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from '@mui/icons-material'
import { X, MessageSquare, FileIcon as AttachFile, User } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { es } from 'date-fns/locale'
import { ArchivosAdjuntosModal } from '../ArchivosAdjuntosModal'
import { AsignarDemandaModal } from '../AsignarDemandaModal'
import { RegistrarActividadModal } from '../RegistrarActividadModal'
import { EnviarRespuestaModal } from '../EnviarRespuestaModal'
import { createTRespuesta } from '../../../api/TableFunctions/respuestas'

// Assume these are imported from their respective files
import { useFormData } from './useFormData'
import { useApiData } from './useApiData'
import { renderStepContent } from './RenderstepContent'
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

const steps = ['Carátula', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración', 'Vínculos']

export default function DemandaDetalleModal({ isOpen, onClose, demanda }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isArchivosModalOpen, setIsArchivosModalOpen] = useState(false)
  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false)
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false)
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false)
  const [usuariosExternos, setUsuariosExternos] = useState([])
  const [isStepContentOpen, setIsStepContentOpen] = useState(true)

  const handleArchivosSubmit = (data: { files: string[], comments: string }) => {
    console.log('Archivos adjuntos:', data)
    setIsArchivosModalOpen(false)
  }

  const handleAsignarSubmit = (data: { collaborator: string, comments: string }) => {
    console.log('Asignar demanda:', data)
    setIsAsignarModalOpen(false)
  }

  const handleRegistrarSubmit = (data: any) => {
    console.log('Registrar actividad:', data)
    setIsRegistrarModalOpen(false)
  }

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
  const { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addVulneraciontext,
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
      return
    }
    setIsSubmitting(true)

    try {
      // Save or update usuario externo
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

      // Save localizacion
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

      // Update demanda with new data
      const updatedDemanda = {
        ...demanda,
        usuarioExterno: formData.usuarioExterno.id,
        localizacion: savedLocalizacion.id,
        // Add other fields that need to be updated
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
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message to the user
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
          <Paper sx={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto', p: 3 }} onClick={handleDemandaClick}>
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
        adultosConvivientes: apiData.adultsList,
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

