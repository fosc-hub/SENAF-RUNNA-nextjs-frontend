import React, { useEffect, useState } from 'react';
import BaseModal from '../Shared/BaseModal';
import RenderStepContent from '../Shared/RenderStepContent';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { es } from 'date-fns/locale'
import { useFormData } from '../Shared/useFormData';
import { useApiData } from '../Shared/useApiData';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Stepper,
  StepLabel,
  Step,
} from '@mui/material';
import { Modal } from '@mui/material'; // Ensure you're using MUI's Modal
import { X } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers';
const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];

const DemandaDetalle = ({ isOpen, onClose, demanda }) => {
  const { formData, handleInputChange,setFormData, addNinoAdolescente, addAdultoConviviente, addVulneraciontext, addCondicionVulnerabilidad, removeCondicionVulnerabilidad } = useFormData()
  const { apiData, isLoading } = useApiData();
  const [activeStep, setActiveStep] = useState(0);
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false);
  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting updated Demanda:', formData);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error updating demanda:', error);
    }
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
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
        }}
      >
        <Paper sx={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto', p: 3 }}>
          {/* Header Section */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h4" component="h2">
                {formData.nombre || 'Detalle de la Demanda'}
              </Typography>
              {formData.dni && (
                <Typography variant="subtitle1" color="text.secondary">
                  DNI {formData.dni} - {formData.edad} años
                </Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center">
              {formData.calificacion === 'urgente' && (
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    mr: 2,
                  }}
                >
                  URGENTE
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" mr={2}>
                Actualizado:{' '}
                {formData.fechaActualizacion &&
                  new Date(formData.fechaActualizacion).toLocaleDateString()}
              </Typography>
              <IconButton onClick={onClose} size="small">
                <X />
              </IconButton>
            </Box>
          </Box>

          {/* Step Content Section */}
          <Box>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <RenderStepContent
                    activeStep={activeStep}
                    formData={{
                      ...formData,
                      ninosAdolescentes: apiData.nnyaList,
                    }}
                    handleInputChange={handleInputChange}
                    motivosIntervencion={apiData.motivosIntervencion}
                    currentMotivoIntervencion={apiData.currentMotivoIntervencion}
                    demandaMotivoIntervencion={apiData.demandaMotivoIntervencion}
                    barrios={apiData.barrios}
                    localidades={apiData.localidades}
                    cpcs={apiData.cpcs}
                    localizacion={apiData.localizacion}
                    usuarioExterno={apiData.usuarioExterno}
                    vinculosUsuarioExterno={apiData.vinculosUsuarioExterno}
                    institucionesUsuarioExterno={apiData.institucionesUsuarioExterno}
                    usuariosExternos={apiData.usuariosExternos}
                    demanda={demanda}
                    getMotivoIntervencion={apiData.getMotivoIntervencion}
                    institucionesEducativas={apiData.institucionesEducativas}
                    institucionesSanitarias={apiData.institucionesSanitarias}
                    addNinoAdolescente={apiData.addNinoAdolescente}
                    addAdultoConviviente={apiData.addAdultoConviviente}
                    addVulneraciontext={apiData.addVulneraciontext}
                    categoriaMotivos={apiData.categoriaMotivos}
                    categoriaSubmotivos={apiData.categoriaSubmotivos}
                    gravedadVulneraciones={apiData.gravedadVulneraciones}
                    urgenciaVulneraciones={apiData.urgenciaVulneraciones}
                  />
              </LocalizationProvider>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack} disabled={activeStep === 0}>
                  Anterior
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default DemandaDetalle;