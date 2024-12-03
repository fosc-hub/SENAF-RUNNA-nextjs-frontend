import React, { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale';
import { useFormData } from '../Shared/useFormData';
import { useApiData } from '../Shared/useApiData';
import {
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  MenuItem,
  Grid,
  Divider,
  Paper,
  Stepper,
  StepLabel,
  Step,
  CircularProgress,
} from '@mui/material';
import { X, MessageSquare, FileIcon as AttachFile, User } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import BaseModal from '../Shared/BaseModal';
import RenderStepContent from '../Shared/RenderstepContent';
import { CollapsibleSection } from '../Shared/CollapsibleSection';
import { RegistrarActividadModal } from '../../RegistrarActividadModal';
import { EnviarRespuestaModal } from '../../EnviarRespuestaModal';
import { createTRespuesta } from '../../../../api/TableFunctions/respuestas';
import { createTDemandaVinculada, getTDemandaVinculadas } from '../../../../api/TableFunctions/demandasVinculadas';
import { getTDemandaPersonas } from '../../../../api/TableFunctions/demandaPersonas';
import { getTPersona, getTPersonas } from '../../../../api/TableFunctions/personas';
import { createTActividad, getTActividades, updateTActividad } from '../../../../api/TableFunctions/actividades';
import { getTActividadTipo } from '../../../../api/TableFunctions/actividadTipos';
import { getTInstitucionActividad } from '../../../../api/TableFunctions/institucionActividades';
import { getDemand } from '../../../../api/TableFunctions/demands';
import Modal from '@mui/material/Modal';


const steps = ['Ingreso', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración', 'Vinculos', 'Condiciones de Vulnerabilidad'];

export default function DemandaDetalle({ isOpen, onClose, demanda }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [editingActividad, setEditingActividad] = useState(null);
  const [editedDescripcion, setEditedDescripcion] = useState('');
  const [editedTipo, setEditedTipo] = useState('');
  const [editedInstitucion, setEditedInstitucion] = useState('');
  const [editedFechaHora, setEditedFechaHora] = useState('');
  const [tipoNames, setTipoNames] = useState({});
  const [institucionNames, setInstitucionNames] = useState({});
  const [nnyaPrincipales, setNnyaPrincipales] = useState([]);
  const [selectedNnya, setSelectedNnya] = useState('');
  const [vinculacionError, setVinculacionError] = useState('');
  const [conexiones, setConexiones] = useState([]);
  const [loadingConexiones, setLoadingConexiones] = useState(false);

  const {
    formData,
    handleInputChange,
    setFormData,
    addNinoAdolescente,
    addAdultoConviviente,
    addVulneraciontext,
    addCondicionVulnerabilidad,
    removeCondicionVulnerabilidad
  } = useFormData();
  
  const { apiData, isLoading } = useApiData();

  useEffect(() => {
    if (demanda) {
      setFormData(demanda);
    }
  }, [demanda, setFormData]);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting updated Demanda:', formData);
      onClose();
    } catch (error) {
      console.error('Error updating demanda:', error);
    }
  };

  const renderModalContent = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h2">{formData.nombre || 'Detalle de la Demanda'}</Typography>
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

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<MessageSquare />} onClick={() => setIsEnviarRespuestaOpen(true)}>
          Enviar Respuesta
        </Button>
        <Button variant="contained" onClick={() => setIsRegistrarModalOpen(true)}>
          Registrar actividad
        </Button>
      </Box>

      <CollapsibleSection title="Detalle de la Demanda" isOpen={true} onToggle={() => {}}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <RenderStepContent
            activeStep={activeStep}
            formData={formData}
            handleInputChange={handleInputChange}
            addNinoAdolescente={addNinoAdolescente}
            addAdultoConviviente={addAdultoConviviente}
            addVulneraciontext={addVulneraciontext}
            addCondicionVulnerabilidad={addCondicionVulnerabilidad}
            removeCondicionVulnerabilidad={removeCondicionVulnerabilidad}
            mode="demandaDetalle"
            readOnly={false}
            origenes={apiData.origenes}
            {...apiData}
          />
        </LocalizationProvider>
      </CollapsibleSection>

      <CollapsibleSection title="Actividades Registradas" isOpen={true} onToggle={() => {}}>
        {/* Activities section would go here */}
      </CollapsibleSection>

      <CollapsibleSection title="Conexiones de la Demanda" isOpen={true} onToggle={() => {}}>
        {/* Connections section would go here */}
      </CollapsibleSection>
    </>
  );

  if (isLoading) {
    return (
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Modal>
    );
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        renderStepContent={renderModalContent}
        formData={formData}
        setFormData={setFormData}
        apiMethods={{}}
        onSuccess={() => {}}
      />

      <RegistrarActividadModal
        isOpen={isRegistrarModalOpen}
        onClose={() => setIsRegistrarModalOpen(false)}
        onSubmit={() => {}}
        idDemanda={demanda?.id}
      />

      <EnviarRespuestaModal
        isOpen={isEnviarRespuestaOpen}
        onClose={() => setIsEnviarRespuestaOpen(false)}
        onSend={() => {}}
        idDemanda={demanda?.id}
      />
    </>
  );
}