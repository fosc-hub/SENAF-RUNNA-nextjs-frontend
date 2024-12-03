import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { X } from 'lucide-react';
import { createTDemandaMotivoIntervencion } from '../../../../api/TableFunctions/demandasMotivoIntervencion';
import { createTVulneracion } from '../../../../api/TableFunctions/vulneraciones';
import { createTVinculoPersonaPersona } from '../../../../api/TableFunctions/vinculospersonaspersonas';
import { createTDemandaPersona } from '../../../../api/TableFunctions/demandaPersonas';
import { createTPersonaCondicionesVulnerabilidad } from '../../../../api/TableFunctions/personaCondicionesVulnerabilidad';
import { createLocalizacion } from '../../../../api/TableFunctions/localizacion';
import { createLocalizacionPersona } from '../../../../api/TableFunctions/localizacionPersona';
import { createTNNyASalud } from '../../../../api/TableFunctions/nnyaSalud';
import { createTNNyAEducacion } from '../../../../api/TableFunctions/nnyaeducacion';
import { createTPersona } from '../../../../api/TableFunctions/personas';
import { createDemand } from '../../../../api/TableFunctions/demands';

const steps = ['Ingreso', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración', 'Condiciones de Vulnerabilidad']

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  renderStepContent: (props: {
    activeStep: number;
    formData: any;
    
    handleInputChange: (field: string, value: any) => void;
  }) => JSX.Element;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  initialStep?: number;
  apiMethods: any;
  onSuccess: () => void;
}

const BaseModal: React.FC<BaseModalProps> = ({
  
  isOpen,
  onClose,
  onSubmit,
  renderStepContent,
  formData,
  setFormData,
  initialStep = 0,
  apiMethods, // Contains all API calls for submission
  onSuccess, // Callback after successful submission
}) => {
  console.log('BaseModal formData:', formData); // Log here
  const [activeStep, setActiveStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => [...prev, info]);
  };
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
      addDebugInfo(`Form Data: ${JSON.stringify(formData, null, 2)}`)

      // Validate required fields
      const requiredFields = ['origen', 'descripcion', 'usuarioExterno']
      const missingFields = requiredFields.filter(field => !formData[field])
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Handle usuario externo
      let usuarioExternoId
      if (formData.createNewUsuarioExterno) {
        addDebugInfo('Creating new usuario externo')
        const newUsuarioExterno = await apiData.addUsuarioExterno({
          nombre: formData.usuarioExterno.nombre,
          apellido: formData.usuarioExterno.apellido,
          fecha_nacimiento: formData.usuarioExterno.fecha_nacimiento,
          genero: formData.usuarioExterno.genero,
          telefono: formData.usuarioExterno.telefono,
          mail: formData.usuarioExterno.mail,
          vinculo: formData.usuarioExterno.vinculo,
          institucion: formData.usuarioExterno.institucion,
        })
        usuarioExternoId = newUsuarioExterno.id
        addDebugInfo(`New usuario externo created with ID: ${usuarioExternoId}`)
      } else {
        usuarioExternoId = formData.usuarioExterno.id
        addDebugInfo(`Using existing usuario externo with ID: ${usuarioExternoId}`)
      }

      if (!usuarioExternoId) {
        throw new Error('Usuario externo ID is missing')
      }

      // Create localizacion
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

      // Create personas for niños y adolescentes
      addDebugInfo('Creating personas for niños y adolescentes')
      const ninosAdolescentesPersonas = await Promise.all(
        formData.ninosAdolescentes.map(async (nino) => {
          const personaResponse = await createTPersona({
            ...nino,
            situacion_dni: nino.situacionDni,
            fecha_nacimiento: formatDate(nino.fechaNacimiento ? new Date(nino.fechaNacimiento) : null),
            edad_aproximada: nino.edadAproximada ? parseInt(nino.edadAproximada) : null,
            dni: nino.dni ? parseInt(nino.dni) : null,
            adulto: false,
            nnya: true,
          })

          // Create nnya-educacion entry
          if (personaResponse && personaResponse.id && nino.educacion) {
            const educacionData = {
              ...nino.educacion,
              nnya: personaResponse.id
            }
            await createTNNyAEducacion(educacionData)
          }
          // Create nnya-salud entry
          if (personaResponse && personaResponse.id && nino.salud) {
            const saludData = {
              ...nino.salud,
              nnya: personaResponse.id
            }
            await createTNNyASalud(saludData)
          }
          // Associate persona with localizacion
          await createLocalizacionPersona({
            principal: true,
            persona: personaResponse.id,
            localizacion: nino.useDefaultLocalizacion
              ? localizacionResponse.id
              : (await createLocalizacion(nino.localizacion)).id,
          });
          return personaResponse
        })
      )

      // Create personas for adultos convivientes
      addDebugInfo('Creating personas for adultos convivientes');
      const adultosConvivientesPersonas = await Promise.all(
        formData.adultosConvivientes.map(async (adulto) => {
          const personaResponse = await createTPersona({
            ...adulto,
            situacion_dni: adulto.situacionDni,
            fecha_nacimiento: formatDate(adulto.fechaNacimiento ? new Date(adulto.fechaNacimiento) : null),
            edad_aproximada: adulto.edadAproximada ? parseInt(adulto.edadAproximada) : null,
            dni: adulto.dni ? parseInt(adulto.dni) : null,
            adulto: true,
            nnya: false,
          });

          // Associate persona with localizacion
          await createLocalizacionPersona({
            principal: true,
            persona: personaResponse.id,
            localizacion: adulto.useDefaultLocalizacion
              ? localizacionResponse.id
              : (await createLocalizacion(adulto.localizacion)).id,
          });

          return personaResponse;
        })
      );

      // Create demanda
      addDebugInfo('Preparing demanda data')
      const demandaData = {
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
        localizacion: localizacionResponse.id, // Pass only the ID, not the entire object
        usuario_externo: usuarioExternoId,
        ninosAdolescentes: ninosAdolescentesPersonas.map((p) => p.id),
        adultosConvivientes: adultosConvivientesPersonas.map((p) => p.id),
        presuntaVulneracion: formData.presuntaVulneracion,
        autores: formData.autores,
        descripcionSituacion: formData.descripcionSituacion,
      };
      

      addDebugInfo('Creating demanda')
      const demandaResponse = await createDemand(demandaData)
      addDebugInfo(`Demanda created: ${JSON.stringify(demandaResponse)}`)

      if (!demandaResponse || !demandaResponse.id) {
        throw new Error('Failed to create demanda')
      }

      // Create persona-condiciones-vulnerabilidad entries
addDebugInfo('Creating persona-condiciones-vulnerabilidad entries')
const condicionesVulnerabilidadPromises = formData.condicionesVulnerabilidad.map(condicion => {
  const [type, index] = condicion.persona.split('-')
  const personaId = type === 'nino' 
    ? ninosAdolescentesPersonas[parseInt(index)].id 
    : adultosConvivientesPersonas[parseInt(index)].id

  return createTPersonaCondicionesVulnerabilidad({
    si_no: condicion.si_no,
    persona: personaId,
    condicion_vulnerabilidad: condicion.condicion_vulnerabilidad,
    demanda: demandaResponse.id
  })
})

const condicionesVulnerabilidadResponses = await Promise.all(condicionesVulnerabilidadPromises)
addDebugInfo(`Created ${condicionesVulnerabilidadResponses.length} persona-condiciones-vulnerabilidad entries`)

// Create vinculaciones and demanda-persona entries
addDebugInfo('Creating vinculaciones and demanda-persona entries');
const vinculacionesPromises = [];
const demandaPersonaPromises = [];

// For niños y adolescentes
formData.ninosAdolescentes.forEach((nino, index) => {
  const personaId = ninosAdolescentesPersonas[index].id;

  // Create demanda-persona entry
  demandaPersonaPromises.push(
    createTDemandaPersona({
      conviviente: nino.conviviente || false,
      supuesto_autordv: false,
      supuesto_autordv_principal: false,
      nnya_principal: index === 0,
      demanda: demandaResponse.id,
      persona: personaId,
    })
  );

  // Create vinculacion if not the principal NNyA
  if (index !== 0) {
    vinculacionesPromises.push(
      createTVinculoPersonaPersona({
        conviven: nino.conviviente || false,
        autordv: false,
        garantiza_proteccion: nino.garantiza_proteccion || false,
        persona_1: ninosAdolescentesPersonas[0].id, // Principal NNyA
        persona_2: personaId,
        vinculo: nino.vinculo,
      })
    );
  }
});

// For adultos convivientes
formData.adultosConvivientes.forEach((adulto, index) => {
  const personaId = adultosConvivientesPersonas[index].id;

  // Create demanda-persona entry
  demandaPersonaPromises.push(
    createTDemandaPersona({
      conviviente: adulto.conviviente || false,
      supuesto_autordv: adulto.supuesto_autordv || false,
      supuesto_autordv_principal: index === 0 && adulto.supuesto_autordv,
      nnya_principal: false,
      demanda: demandaResponse.id,
      persona: personaId,
    })
  );

  // Create vinculacion
  vinculacionesPromises.push(
    createTVinculoPersonaPersona({
      conviven: adulto.conviviente || false,
      autordv: adulto.supuesto_autordv || false,
      garantiza_proteccion: adulto.garantiza_proteccion || false,
      persona_1: ninosAdolescentesPersonas[0].id, // Principal NNyA
      persona_2: personaId,
      vinculo: adulto.vinculacion?.vinculo || null,
    })
  );
});

const [vinculacionesResponses, demandaPersonaResponses] = await Promise.all([
  Promise.all(vinculacionesPromises),
  Promise.all(demandaPersonaPromises),
]);

addDebugInfo(`Created ${vinculacionesResponses.length} vinculaciones`);
addDebugInfo(`Created ${demandaPersonaResponses.length} demanda-persona entries`);



      // Create vulneraciones
      addDebugInfo('Creating vulneraciones')
      const vulneracionesPromises = formData.vulneraciones.map(vulneracion => {
        const vulneracionData = {
          principal_demanda: vulneracion.principal_demanda,
          transcurre_actualidad: vulneracion.transcurre_actualidad,
          categoria_motivo: vulneracion.categoria_motivo,
          categoria_submotivo: vulneracion.categoria_submotivo,
          gravedad_vulneracion: vulneracion.gravedad_vulneracion,
          urgencia_vulneracion: vulneracion.urgencia_vulneracion,
          nnya: ninosAdolescentesPersonas[vulneracion.nnya]?.id,
          autor_dv: adultosConvivientesPersonas[vulneracion.autor_dv]?.id,
          demanda: demandaResponse.id
        }
        return createTVulneracion(vulneracionData)
      })

      const vulneracionesResponses = await Promise.all(vulneracionesPromises)
      addDebugInfo(`Created ${vulneracionesResponses.length} vulneraciones`)

      // Create demanda-motivo-intervencion entries
      addDebugInfo('Creating demanda-motivo-intervencion entries')
      addDebugInfo(`presuntaVulneracion: ${JSON.stringify(formData.presuntaVulneracion, null, 2)}`)

      const motivo = formData.presuntaVulneracion.motivos
      if (motivo) {
        const demandaMotivoIntervencionData = {
          si_no: true,
          demanda: demandaResponse.id,
          motivo_intervencion: motivo
        }
        
        try {
          const demandaMotivoIntervencionResponse = await createTDemandaMotivoIntervencion(demandaMotivoIntervencionData)
          addDebugInfo(`Created demanda-motivo-intervencion entry: ${JSON.stringify(demandaMotivoIntervencionResponse)}`)
        } catch (error) {
          addDebugInfo(`Error creating demanda-motivo-intervencion entry: ${error.message}`)
          console.error('Error creating demanda-motivo-intervencion entry:', error)
        }
      } else {
        addDebugInfo('No motivo selected, skipping demanda-motivo-intervencion creation')
      }



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
  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData: any) => {
      const updatedData = { ...prevData }
      const fieldParts = field.split('.')
      let current = updatedData
      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (fieldParts[i].includes('[')) {
          const [arrayName, indexStr] = fieldParts[i].split('[')
          const index = parseInt(indexStr.replace(']', ''))
          current = current[arrayName][index]
        } else {
          current = current[fieldParts[i]]
        }
      }
      current[fieldParts[fieldParts.length - 1]] = value
      return updatedData
    })
  }
  const handleNext = () => setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0));



  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
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
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Form Modal</Typography>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </Box>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent({ activeStep, formData, handleInputChange })}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default BaseModal;
function addDebugInfo(arg0: string) {
  throw new Error('Function not implemented.');
}

function setDebugInfo(arg0: never[]) {
  throw new Error('Function not implemented.');
}

const formatDate = (date) => {
  if (!date) return null
  return date.toISOString().split('T')[0]
}
