import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import { createLocalizacion } from '../../../api/TableFunctions/localizacion'
import {createDemand} from '../../../api/TableFunctions/demands'
import {createTPersona} from '../../../api/TableFunctions/personas'
import { es } from 'date-fns/locale'
import { X } from 'lucide-react'
import { useFormData } from './useFormData'
import { useApiData } from './useApiData'
import { renderStepContent } from './RenderstepContent'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers'

const steps = ['Carátula', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración', 'Información Adicional']

export default function NuevoIngresoModal({ isOpen, onClose, onSubmit }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState([])
  const isSubmittingRef = useRef(false)

  const { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addAutor } = useFormData()
  const apiData = useApiData()

  const filteredSubmotivos = useMemo(() => {
    if (!formData.presuntaVulneracion.categoriaMotivos || formData.presuntaVulneracion.categoriaMotivos.length === 0) {
      return []
    }
    return apiData.categoriaSubmotivos.filter(submotivo => 
      formData.presuntaVulneracion.categoriaMotivos.includes(submotivo.motivo)
    )
  }, [apiData.categoriaSubmotivos, formData.presuntaVulneracion.categoriaMotivos])

  const handleNext = () => setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0))

  const addDebugInfo = (info) => setDebugInfo(prev => [...prev, info])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (activeStep !== steps.length - 1) {
      handleNext()
      return
    }
    
    if (isSubmittingRef.current) return
    
    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError(null)
    setDebugInfo([])
    
    try {
      addDebugInfo('Starting form submission')

      const requiredFields = ['origen', 'descripcion', 'usuario_externo']
      const missingFields = requiredFields.filter(field => !formData[field])
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      const localizacionData = {
        ...formData.localizacion,
        piso_depto: Number(formData.localizacion.piso_depto) || null,
        lote: Number(formData.localizacion.lote) || null,
        mza: Number(formData.localizacion.mza) || null,
        casa_nro: Number(formData.localizacion.casa_nro) || null,
        barrio: Number(formData.localizacion.barrio) || null,
        localidad: Number(formData.localizacion.localidad) || null,
        cpc: Number(formData.localizacion.cpc) || null,
      }

      addDebugInfo('Creating localizacion')
      const localizacionResponse = await createLocalizacion(localizacionData)
      addDebugInfo(`Localizacion created: ${JSON.stringify(localizacionResponse)}`)

      if (!localizacionResponse || !localizacionResponse.id) {
        throw new Error('Failed to create localizacion')
      }

      addDebugInfo('Creating personas for niños y adolescentes')
      const ninosAdolescentesPersonas = await Promise.all(
        formData.ninosAdolescentes.map((nino) =>
          createTPersona({
            ...nino,
            situacion_dni: nino.situacionDni || 'EN_TRAMITE',
            fecha_nacimiento: formatDate(nino.fechaNacimiento ? new Date(nino.fechaNacimiento) : null),
            edad_aproximada: nino.edadAproximada ? parseInt(nino.edadAproximada) : null,
            dni: nino.dni ? parseInt(nino.dni) : null,
            adulto: false,
            nnya: true,
          })
        )
      )

      const adultosConvivientesPersonas = await Promise.all(
        formData.adultosConvivientes.map((adulto) =>
          createTPersona({
            ...adulto,
            situacion_dni: adulto.situacionDni || 'EN_TRAMITE',
            fecha_nacimiento: formatDate(adulto.fechaNacimiento ? new Date(adulto.fechaNacimiento) : null),
            edad_aproximada: adulto.edadAproximada ? parseInt(adulto.edadAproximada) : null,
            dni: adulto.dni ? parseInt(adulto.dni) : null,
            adulto: true,
            nnya: false,
          })
        )
      )

      addDebugInfo('Preparing demanda data')
      const demandaData = {
        fecha_y_hora_ingreso: formData.fecha_y_hora_ingreso.toISOString(),
        origen: formData.origen,
        nro_notificacion_102: Number(formData.nro_notificacion_102) || null,
        nro_sac: Number(formData.nro_sac) || null,
        nro_suac: Number(formData.nro_suac) || null,
        nro_historia_clinica: Number(formData.nro_historia_clinica) || null,
        nro_oficio_web: Number(formData.nro_oficio_web) || null,
        descripcion: formData.descripcion,
        localizacion: localizacionResponse.id,
        usuario_externo: Number(formData.usuario_externo) || null,
        ninosAdolescentes: ninosAdolescentesPersonas.map((p) => p.id),
        adultosConvivientes: adultosConvivientesPersonas.map((p) => p.id),
        presuntaVulneracion: formData.presuntaVulneracion,
        autores: formData.autores,
        descripcionSituacion: formData.descripcionSituacion,
        usuarioLinea: formData.usuarioLinea,
      }

      addDebugInfo('Creating demanda')
      const demandaResponse = await createDemand(demandaData)
      addDebugInfo(`Demanda created: ${JSON.stringify(demandaResponse)}`)

      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(error.message || 'An error occurred while submitting the form')
      addDebugInfo(`Error submitting form: ${error.message}`)
    } finally {
      setIsSubmitting(false)
      isSubmittingRef.current = false
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '800px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        height: '90vh',
        overflowY: 'auto',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Nuevo Ingreso</Typography>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </Box>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
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
              addAutor,
              ...apiData,
              filteredSubmotivos,
            })}
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
      </Box>
    </Modal>
  )
}

const formatDate = (date) => {
  if (!date) return null
  return date.toISOString().split('T')[0]
}

