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
import { X, MessageSquare, FileIcon as AttachFile, User } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { es } from 'date-fns/locale'
import EnviarRespuestaModal from '../EnviarRespuestaModal'

// Assume these are imported from their respective files
import { useFormData } from './useFormData'
import { useApiData } from './useApiData'
import { renderStepContent } from './RenderstepContent'

const steps = ['Carátula', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración', 'Vínculos']

export default function DemandaDetalleModal({ isOpen, onClose, demanda }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false)

  const { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addVulneracion, addVinculacion, removeVinculacion } = useFormData(demanda)
  const apiData = useApiData(demanda?.id, demanda?.localizacion);
  useEffect(() => {
    console.log('Localización ID:', demanda?.localizacion);
  }, [demanda?.localizacion]);
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
    // Submit logic here
    setIsSubmitting(false)
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

            <Typography variant="h6" gutterBottom>Historial de la Demanda</Typography>
            <Box sx={{ mb: 3 }}>
              {formData.historial?.map((item, index) => (
                <Box key={index} sx={{ mb: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="bold">{item.fecha}</Typography>
                  <Typography variant="body2">{item.descripcion}</Typography>
                </Box>
              ))}
            </Box>

            <Typography variant="h6" gutterBottom>Archivos adjuntos ({formData.archivosAdjuntos?.length || 0})</Typography>
            <Box component="ul" sx={{ mb: 3, pl: 2 }}>
              {formData.archivosAdjuntos?.map((archivo, index) => (
                <Typography component="li" key={index}>{archivo}</Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button variant="contained" startIcon={<MessageSquare />} onClick={handleOpenEnviarRespuesta}>
                Enviar Respuesta
              </Button>
              <Button variant="outlined" startIcon={<AttachFile />}>
                Archivos adjuntos
              </Button>
              <Button variant="outlined" startIcon={<User />}>
                Asignar
              </Button>
              <Button variant="contained">
                Registrar actividad
              </Button>
            </Box>
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
      formData,
      handleInputChange,
      motivosIntervencion: apiData.motivosIntervencion,
      currentMotivoIntervencion: apiData.currentMotivoIntervencion,
      demandaMotivoIntervencion: apiData.demandaMotivoIntervencion,
      barrios: apiData.barrios,
      localidades: apiData.localidades,
      cpcs: apiData.cpcs,
      localizacion: apiData.localizacion,
      demanda,
      getMotivoIntervencion: apiData.getMotivoIntervencion,
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
          </Paper>
        </Box>
      </Modal>

      <EnviarRespuestaModal
        isOpen={isEnviarRespuestaOpen}
        onClose={handleCloseEnviarRespuesta}
        demandaId={demanda?.id || 0}
      />
    </>
  )
}

