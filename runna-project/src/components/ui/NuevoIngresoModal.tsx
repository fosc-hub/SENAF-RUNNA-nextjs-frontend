import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  Checkbox,
  ListItemText,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers'
import { es } from 'date-fns/locale'
import { createLocalizacion } from '../../api/TableFunctions/localizacion'
import { getTUsuariosExternos } from '../../api/TableFunctions/usuarioExterno'
import { createDemand } from '../../api/TableFunctions/demands'
import { getTBarrios } from '../../api/TableFunctions/barrios'
import { getTLocalidads } from '../../api/TableFunctions/localidades'
import { getTProvincias } from '../../api/TableFunctions/provincias'
import { getTCPCs } from '../../api/TableFunctions/cpcs'
import { createTPersona } from '../../api/TableFunctions/personas'
import { X, ImportIcon as AddIcon } from 'lucide-react'
import { getTMotivoIntervencions } from '../../api/TableFunctions/motivoIntervencion'
import { getTCategoriaMotivos } from '../../api/TableFunctions/categoriasMotivos'
import { getTCategoriaSubmotivos } from '../../api/TableFunctions/categoriaSubmotivos'
import { getTGravedadVulneracions } from '../../api/TableFunctions/gravedadVulneraciones'
import { getTUrgenciaVulneracions } from '../../api/TableFunctions/urgenciaVulneraciones'
import { getTCondicionesVulnerabilidads } from '../../api/TableFunctions/condicionesVulnerabilidad'

// ... (previous code remains the same)


const formatDate = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString().split('T')[0];
};

interface NuevoIngresoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: any) => void
}

const steps = [
  'Carátula',
  'Niños y Adolescentes',
  'Adultos Convivientes',
  'Presunta Vulneración',
  'Información Adicional',
]

export default function NuevoIngresoModal({ isOpen, onClose, onSubmit }: NuevoIngresoModalProps) {
  const [activeStep, setActiveStep] = useState(0)
  interface FormData {
    fecha_y_hora_ingreso: Date;
    origen: string;
    nro_notificacion_102: string;
    nro_sac: string;
    nro_suac: string;
    nro_historia_clinica: string;
    nro_oficio_web: string;
    descripcion: string;
    localizacion: {
      calle: string;
      tipo_calle: string;
      piso_depto: string;
      lote: string;
      mza: string;
      casa_nro: string;
      referencia_geo: string;
      barrio: string;
      localidad: string;
      cpc: string;
    };
    usuario_externo: string;
    ninosAdolescentes: Array<{
      nombre: string;
      apellido: string;
      fechaNacimiento: string | null;
      edadAproximada: string;
      dni: string;
      situacionDni: string;
      genero: string;
      botonAntipanico: boolean;
      observaciones: string;
    }>;
    adultosConvivientes: Array<{
      nombre: string;
      apellido: string;
      fechaNacimiento: string | null;
      edadAproximada: string;
      dni: string;
      situacionDni: string;
      genero: string;
      botonAntipanico: boolean;
      observaciones: string;
    }>;
    presuntaVulneracion: {
      condicionesVulnerabilidad: any
      urgenciaVulneracion: any
      gravedadVulneracion: any
      motivo: string;
      ambitoVulneracion: string;
      principalDerechoVulnerado: string;
      problematicaIdentificada: string;
      prioridadIntervencion: string;
      nombreCargoOperador: string;
      motivos: number[];
      categoriaMotivos: number[];
      categoriaSubmotivos: number[];
    };
    autores: Array<{
      nombreApellido: string;
      edad: string;
      genero: string;
      vinculo: string;
      convive: boolean;
      comentarios: string;
    }>;
    descripcionSituacion: string;
    usuarioLinea: {
      nombreApellido: string;
      edad: string;
      genero: string;
      vinculo: string;
      telefono: string;
      institucionPrograma: string;
      contactoInstitucion: string;
      nombreCargoResponsable: string;
    };
  }
  
  const [formData, setFormData] = useState<FormData>({
    fecha_y_hora_ingreso: new Date(),
    origen: '',
    nro_notificacion_102: '',
    nro_sac: '',
    nro_suac: '',
    nro_historia_clinica: '',
    nro_oficio_web: '',
    descripcion: '',
    localizacion: {
      calle: '',
      tipo_calle: 'CALLE',
      piso_depto: '',
      lote: '',
      mza: '',
      casa_nro: '',
      referencia_geo: '',
      barrio: '',
      localidad: '',
      cpc: '',
    },
    usuario_externo: '',
    ninosAdolescentes: [],
    adultosConvivientes: [],
    presuntaVulneracion: {
      motivo: '',
      ambitoVulneracion: '',
      principalDerechoVulnerado: '',
      problematicaIdentificada: '',
      prioridadIntervencion: '',
      nombreCargoOperador: '',
      motivos: [],
      categoriaMotivos: [],
      categoriaSubmotivos: [],
      gravedadVulneracion: '',
      urgenciaVulneracion: '',
      condicionesVulnerabilidadNNyA: [],
      condicionesVulnerabilidadAdulto: [],
    },
    autores: [],
    descripcionSituacion: '',
    usuarioLinea: {
      nombreApellido: '',
      edad: '',
      genero: '',
      vinculo: '',
      telefono: '',
      institucionPrograma: '',
      contactoInstitucion: '',
      nombreCargoResponsable: '',
    },
  })
  const [usuariosExternos, setUsuariosExternos] = useState<any[]>([])
  const [barrios, setBarrios] = useState<any[]>([])
  const [localidades, setLocalidades] = useState<any[]>([])
  const [provincias, setProvincias] = useState<any[]>([])
  const [cpcs, setCPCs] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [motivosIntervencion, setMotivosIntervencion] = useState<any[]>([])
  const [categoriaMotivos, setCategoriaMotivos] = useState<any[]>([])
  const [categoriaSubmotivos, setCategoriaSubmotivos] = useState<any[]>([])
  const [gravedadVulneraciones, setGravedadVulneraciones] = useState<any[]>([])
  const [urgenciaVulneraciones, setUrgenciaVulneraciones] = useState<any[]>([])
  const [condicionesVulnerabilidad, setCondicionesVulnerabilidad] = useState<any[]>([])

  const filteredSubmotivos = useMemo(() => {
    if (!formData.presuntaVulneracion.categoriaMotivos || formData.presuntaVulneracion.categoriaMotivos.length === 0) {
      return [];
    }
    return categoriaSubmotivos.filter(submotivo => 
      formData.presuntaVulneracion.categoriaMotivos.includes(submotivo.motivo)
    );
  }, [categoriaSubmotivos, formData.presuntaVulneracion.categoriaMotivos]);

  const getCategoriaMotivosNombre = (motivoId: number) => {
    const categoria = categoriaMotivos.find(cat => cat.id === motivoId);
    return categoria ? categoria.nombre : 'Desconocido';
  };
  
  
  useEffect(() => {
    fetchUsuariosExternos()
    fetchBarrios()
    fetchLocalidades()
    fetchProvincias()
    fetchCPCs()
    fetchMotivosIntervencion()
    fetchCategoriaMotivos()
    fetchCategoriaSubmotivos()
    fetchGravedadVulneraciones()
    fetchUrgenciaVulneraciones()
    fetchCondicionesVulnerabilidad()
  }, [])
  const fetchUsuariosExternos = async () => {
    try {
      const fetchedUsuarios = await getTUsuariosExternos()
      setUsuariosExternos(fetchedUsuarios)
    } catch (error) {
      console.error('Error fetching usuarios externos:', error)
    }
  }
  const fetchCategoriaMotivos = async () => {
    try {
      const fetchedCategoriaMotivos = await getTCategoriaMotivos()
      setCategoriaMotivos(fetchedCategoriaMotivos)
    } catch (error) {
      console.error('Error fetching categoria motivos:', error)
    }
  }
  const fetchCategoriaSubmotivos = async () => {
    try {
      const fetchedCategoriaSubmotivos = await getTCategoriaSubmotivos()
      setCategoriaSubmotivos(fetchedCategoriaSubmotivos)
    } catch (error) {
      console.error('Error fetching categoria submotivos:', error)
    }
  }
  const fetchGravedadVulneraciones = async () => {
    try {
      const fetchedGravedades = await getTGravedadVulneracions()
      setGravedadVulneraciones(fetchedGravedades)
    } catch (error) {
      console.error('Error fetching gravedad vulneraciones:', error)
    }
  }

  const fetchUrgenciaVulneraciones = async () => {
    try {
      const fetchedUrgencias = await getTUrgenciaVulneracions()
      setUrgenciaVulneraciones(fetchedUrgencias)
    } catch (error) {
      console.error('Error fetching urgencia vulneraciones:', error)
    }
  }

  const fetchCondicionesVulnerabilidad = async () => {
    try {
      const fetchedCondiciones = await getTCondicionesVulnerabilidads()
      setCondicionesVulnerabilidad(fetchedCondiciones)
    } catch (error) {
      console.error('Error fetching condiciones de vulnerabilidad:', error)
    }
  }

  const fetchBarrios = async () => {
    try {
      const fetchedBarrios = await getTBarrios()
      setBarrios(fetchedBarrios)
    } catch (error) {
      console.error('Error fetching barrios:', error)
    }
  }

  const fetchLocalidades = async () => {
    try {
      const fetchedLocalidades = await getTLocalidads()
      setLocalidades(fetchedLocalidades)
    } catch (error) {
      console.error('Error fetching localidades:', error)
    }
  }

  const fetchProvincias = async () => {
    try {
      const fetchedProvincias = await getTProvincias()
      setProvincias(fetchedProvincias)
    } catch (error) {
      console.error('Error fetching provincias:', error)
    }
  }

  const fetchCPCs = async () => {
    try {
      const fetchedCPCs = await getTCPCs()
      setCPCs(fetchedCPCs)
    } catch (error) {
      console.error('Error fetching CPCs:', error)
    }
  }

  const fetchMotivosIntervencion = async () => {
    try {
      const fetchedMotivos = await getTMotivoIntervencions()
      setMotivosIntervencion(fetchedMotivos)
    } catch (error) {
      console.error('Error fetching motivos de intervención:', error)
    }
  }

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, info])
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData: any) => {
      const newData = { ...prevData };
      const keys = field.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i].includes('[')
          ? keys[i].split('[')[0]
          : keys[i];
        const index = keys[i].includes('[')
          ? parseInt(keys[i].match(/\d+/)?.[0] || '0', 10)
          : null;

        if (index !== null && Array.isArray(current[key])) {
          if (!current[key][index]) {
            current[key][index] = {};
          }
          current = current[key][index];
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;

      return newData;
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
  }

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  const createPersona = async (personaData: any, isNNyA: boolean) => {
    try {
      addDebugInfo(`Attempting to create persona: ${JSON.stringify(personaData)}`)
      const response = await createTPersona({
        ...personaData,
        adulto: !isNNyA,
        nnya: isNNyA,
      })
      addDebugInfo(`Persona created successfully: ${JSON.stringify(response)}`)
      return response
    } catch (error) {
      addDebugInfo(`Error creating persona: ${error.message}`)
      console.error('Error creating persona:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeStep !== steps.length - 1) {
      handleNext()
      return
    }
    
    if (isSubmittingRef.current) {
      return
    }
    
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
        formData.ninosAdolescentes.map((nino: any) =>
          createTPersona({
            ...nino,
            fecha_nacimiento: formatDate(nino.fechaNacimiento ? new Date(nino.fechaNacimiento) : null),
            edad_aproximada: parseInt(nino.edadAproximada),
            dni: parseInt(nino.dni),
            adulto: false,
            nnya: true,
          })
        )
      );

      addDebugInfo('Creating personas for adultos convivientes')
      const adultosConvivientesPersonas = await Promise.all(
        formData.adultosConvivientes.map((adulto: any) =>
          createTPersona({
            ...adulto,
            fecha_nacimiento: formatDate(adulto.fechaNacimiento ? new Date(adulto.fechaNacimiento) : null),
            edad_aproximada: parseInt(adulto.edadAproximada),
            dni: parseInt(adulto.dni),
            adulto: true,
            nnya: false,
          })
        )
      );

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
        ninosAdolescentes: ninosAdolescentesPersonas.map((p: any) => p.id),
        adultosConvivientes: adultosConvivientesPersonas.map((p: any) => p.id),
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

  const addNinoAdolescente = () => {
    setFormData((prevData) => ({
      ...prevData,
      ninosAdolescentes: [
        ...prevData.ninosAdolescentes,
        {
          nombre: '',
          apellido: '',
          fechaNacimiento: null,
          edadAproximada: '',
          dni: '',
          situacionDni: 'EN_TRAMITE',
          genero: 'MASCULINO',
          botonAntipanico: false,
          observaciones: '',
        },
      ],
    }))
  }

  const addAdultoConviviente = () => {
    setFormData((prevData) => ({
      ...prevData,
      adultosConvivientes: [
        ...prevData.adultosConvivientes,
        {
          nombre: '',
          apellido: '',
          fechaNacimiento: null,
          edadAproximada: '',
          dni: '',
          situacionDni: 'EN_TRAMITE',
          genero: 'MASCULINO',
          botonAntipanico: false,
          observaciones: '',
        },
      ],
    }))
  }

  const addAutor = () => {
    setFormData((prevData) => ({
      ...prevData,
      autores: [
        ...prevData.autores,
        {
          nombreApellido: '',
          edad: '',
          genero: '',
          vinculo: '',
          convive: false,
          comentarios: '',
        },
      ],
    }))
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DateTimePicker
                  label="Fecha y hora de ingreso"
                  value={formData.fecha_y_hora_ingreso}
                  onChange={(newValue) => handleInputChange('fecha_y_hora_ingreso', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Origen</InputLabel>
                <Select
                  value={formData.origen}
                  onChange={(e) => handleInputChange('origen', e.target.value)}
                  label="Origen"
                >
                  <MenuItem value="WEB">WEB</MenuItem>
                  <MenuItem value="TELEFONO">TELEFONO</MenuItem>
                  <MenuItem value="PRESENCIAL">PRESENCIAL</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nro. Notificación 102"
                type="number"
                value={formData.nro_notificacion_102}
                onChange={(e) => handleInputChange('nro_notificacion_102', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nro. SAC"
                type="number"
                value={formData.nro_sac}
                onChange={(e) => handleInputChange('nro_sac', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nro. SUAC"
                type="number"
                value={formData.nro_suac}
                onChange={(e) => handleInputChange('nro_suac', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nro. Historia Clínica"
                type="number"
                value={formData.nro_historia_clinica}
                onChange={(e) => handleInputChange('nro_historia_clinica', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nro. Oficio Web"
                type="number"
                value={formData.nro_oficio_web}
                onChange={(e) => handleInputChange('nro_oficio_web', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={4}
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Datos de Localización</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Calle"
                value={formData.localizacion.calle}
                onChange={(e) => handleInputChange('localizacion.calle', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Calle</InputLabel>
                <Select
                  value={formData.localizacion.tipo_calle}
                  onChange={(e) => handleInputChange('localizacion.tipo_calle', e.target.value)}
                  label="Tipo de Calle"
                >
                  <MenuItem value="CALLE">CALLE</MenuItem>
                  <MenuItem value="AVENIDA">AVENIDA</MenuItem>
                  <MenuItem value="PASAJE">PASAJE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Piso/Depto"
                type="number"
                value={formData.localizacion.piso_depto}
                onChange={(e) => handleInputChange('localizacion.piso_depto', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Lote"
                type="number"
                value={formData.localizacion.lote}
                onChange={(e) => handleInputChange('localizacion.lote', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Manzana"
                type="number"
                value={formData.localizacion.mza}
                onChange={(e) => handleInputChange('localizacion.mza', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Número de Casa"
                type="number"
                value={formData.localizacion.casa_nro}
                onChange={(e) => handleInputChange('localizacion.casa_nro', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Referencia Geográfica"
                multiline
                rows={2}
                value={formData.localizacion.referencia_geo}
                onChange={(e) => handleInputChange('localizacion.referencia_geo', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Barrio</InputLabel>
                <Select
                  value={formData.localizacion.barrio}
                  onChange={(e) => handleInputChange('localizacion.barrio', e.target.value)}
                  label="Barrio"
                >
                  {barrios.map((barrio) => (
                    <MenuItem key={barrio.id} value={barrio.id}>
                      {barrio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Localidad</InputLabel>
                <Select
                  value={formData.localizacion.localidad}
                  onChange={(e) => handleInputChange('localizacion.localidad', e.target.value)}
                  label="Localidad"
                >
                  {localidades.map((localidad) => (
                    <MenuItem key={localidad.id} value={localidad.id}>
                      {localidad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>CPC</InputLabel>
                <Select
                  value={formData.localizacion.cpc}
                  onChange={(e) => handleInputChange('localizacion.cpc', e.target.value)}
                  label="CPC"
                >
                  {cpcs.map((cpc) => (
                    <MenuItem key={cpc.id} value={cpc.id}>
                      {cpc.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Usuario Externo</InputLabel>
                <Select
                  value={formData.usuario_externo}
                  onChange={(e) => handleInputChange('usuario_externo', e.target.value)}
                  label="Usuario Externo"
                >
                  {usuariosExternos.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Box>
            <Typography color="primary" sx={{ mb: 2 }}>Niñas, niños y adolescentes convivientes</Typography>
            {formData.ninosAdolescentes.map((nino, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={nino.nombre}
                      onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].nombre`, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={nino.apellido}
                      onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].apellido`, e.target.value)}
                    />
                  </Grid>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={nino.fechaNacimiento ? new Date(nino.fechaNacimiento) : null}
                    onChange={(newValue) => {
                      handleInputChange(`ninosAdolescentes[${index}].fechaNacimiento`, newValue ? formatDate(newValue) : null);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    inputFormat="yyyy-MM-dd"
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  label="Edad Aproximada"
                  type="number"
                  value={nino.edadAproximada}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].edadAproximada`, e.target.value)}
                />
                <TextField
                  fullWidth
                  label="DNI"
                  type="number"
                  value={nino.dni}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].dni`, e.target.value)}
                />
                <FormControl fullWidth>
                  <InputLabel>Situación DNI</InputLabel>
                  <Select
                    value={nino.situacionDni}
                    onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].situacionDni`, e.target.value)}
                    label="Situación DNI"
                  >
                    <MenuItem value="EN_TRAMITE">En Trámite</MenuItem>
                    <MenuItem value="TIENE">Tiene</MenuItem>
                    <MenuItem value="NO_TIENE">No Tiene</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Género</InputLabel>
                  <Select
                    value={nino.genero}
                    onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].genero`, e.target.value)}
                    label="Género"
                  >
                    <MenuItem value="MASCULINO">Masculino</MenuItem>
                    <MenuItem value="FEMENINO">Femenino</MenuItem>
                    <MenuItem value="NO_BINARIO">No Binario</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={nino.botonAntipanico}
                      onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].botonAntipanico`, e.target.checked)}
                    />
                  }
                  label="Botón Antipánico"
                />
                <TextField
                  fullWidth
                  label="Observaciones"
                  multiline
                  rows={4}
                  value={nino.observaciones}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].observaciones`, e.target.value)}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addNinoAdolescente}
              sx={{ color: 'primary.main' }}
            >
              Añadir otro niño o adolescente
            </Button>
          </Box>
        )
      case 2:
        return (
          <Box>
            <Typography color="primary" sx={{ mb: 2 }}>Adultos convivientes</Typography>
            {formData.adultosConvivientes.map((adulto, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={adulto.nombre}
                      onChange={(e) => handleInputChange(`adultosConvivientes[${index}].nombre`, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={adulto.apellido}
                      onChange={(e) => handleInputChange(`adultosConvivientes[${index}].apellido`, e.target.value)}
                    />
                  </Grid>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={adulto.fechaNacimiento ? new Date(adulto.fechaNacimiento) : null}
                    onChange={(newValue) => {
                      handleInputChange(`adultosConvivientes[${index}].fechaNacimiento`, newValue ? formatDate(newValue) : null);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    inputFormat="yyyy-MM-dd"
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  label="Edad Aproximada"
                  type="number"
                  value={adulto.edadAproximada}
                  onChange={(e) => handleInputChange(`adultosConvivientes[${index}].edadAproximada`, e.target.value)}
                />
                <TextField
                  fullWidth
                  label="DNI"
                  type="number"
                  value={adulto.dni}
                  onChange={(e) => handleInputChange(`adultosConvivientes[${index}].dni`, e.target.value)}
                />
                <FormControl fullWidth>
                  <InputLabel>Situación DNI</InputLabel>
                  <Select
                    value={adulto.situacionDni}
                    onChange={(e) => handleInputChange(`adultosConvivientes[${index}].situacionDni`, e.target.value)}
                    label="Situación DNI"
                  >
                    <MenuItem value="EN_TRAMITE">En Trámite</MenuItem>
                    <MenuItem value="TIENE">Tiene</MenuItem>
                    <MenuItem value="NO_TIENE">No Tiene</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Género</InputLabel>
                  <Select
                    value={adulto.genero}
                    onChange={(e) => handleInputChange(`adultosConvivientes[${index}].genero`, e.target.value)}
                    label="Género"
                  >
                    <MenuItem value="MASCULINO">Masculino</MenuItem>
                    <MenuItem value="FEMENINO">Femenino</MenuItem>
                    <MenuItem value="NO_BINARIO">No Binario</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={adulto.botonAntipanico}
                      onChange={(e) => handleInputChange(`adultosConvivientes[${index}].botonAntipanico`, e.target.checked)}
                    />
                  }
                  label="Botón Antipánico"
                />
                <TextField
                  fullWidth
                  label="Observaciones"
                  multiline
                  rows={4}
                  value={adulto.observaciones}
                  onChange={(e) => handleInputChange(`adultosConvivientes[${index}].observaciones`, e.target.value)}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addAdultoConviviente}
              sx={{ color: 'primary.main' }}
            >
              Añadir otro adulto conviviente
            </Button>
          </Box>
        )
        case 3:
          return (
            <Box>
              <Typography color="primary" sx={{ mb: 2 }}>Presunta Vulneración de Derechos informada</Typography>
              <FormControl fullWidth>
                <InputLabel>Motivos de Intervención</InputLabel>
                <Select
                  multiple
                  value={formData.presuntaVulneracion.motivos || []}
                  onChange={(e) => handleInputChange('presuntaVulneracion.motivos', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={motivosIntervencion.find(m => m.id === value)?.nombre} />
                      ))}
                    </Box>
                  )}
                >
                  {motivosIntervencion.map((motivo) => (
                    <MenuItem key={motivo.id} value={motivo.id}>
                      <Checkbox checked={(formData.presuntaVulneracion.motivos || []).indexOf(motivo.id) > -1} />
                      <ListItemText 
                        primary={motivo.nombre} 
                        secondary={`Descripción: ${motivo.descripcion}, Peso: ${motivo.peso}`} 
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Categorías de Motivo</InputLabel>
                <Select
                  multiple
                  value={formData.presuntaVulneracion.categoriaMotivos || []}
                  onChange={(e) => handleInputChange('presuntaVulneracion.categoriaMotivos', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={categoriaMotivos.find(m => m.id === value)?.nombre} />
                      ))}
                    </Box>
                  )}
                >
                  {categoriaMotivos.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      <Checkbox checked={(formData.presuntaVulneracion.categoriaMotivos || []).indexOf(categoria.id) > -1} />
                      <ListItemText 
                        primary={categoria.nombre} 
                        secondary={`Descripción: ${categoria.descripcion}, Peso: ${categoria.peso}`} 
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Subcategorías de Motivo</InputLabel>
                <Select
                  multiple
                  value={formData.presuntaVulneracion.categoriaSubmotivos || []}
                  onChange={(e) => handleInputChange('presuntaVulneracion.categoriaSubmotivos', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={categoriaSubmotivos.find(m => m.id === value)?.nombre} />
                      ))}
                    </Box>
                  )}
                >
                  {filteredSubmotivos.map((submotivo) => (
                    <MenuItem key={submotivo.id} value={submotivo.id}>
                      <Checkbox checked={(formData.presuntaVulneracion.categoriaSubmotivos || []).indexOf(submotivo.id) > -1} />
                      <ListItemText 
                        primary={submotivo.nombre} 
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2">Descripción: {submotivo.descripcion}</Typography>
                            <Typography variant="body2">Peso: {submotivo.peso}</Typography>
                            <Typography variant="body2">Categoría: {getCategoriaMotivosNombre(submotivo.motivo)}</Typography>
                          </React.Fragment>
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Gravedad de la Vulneración</InputLabel>
              <Select
                value={formData.presuntaVulneracion.gravedadVulneracion}
                onChange={(e) => handleInputChange('presuntaVulneracion.gravedadVulneracion', e.target.value)}
                label="Gravedad de la Vulneración"
              >
                {gravedadVulneraciones.map((gravedad) => (
                  <MenuItem key={gravedad.id} value={gravedad.id}>
                    <ListItemText
                      primary={gravedad.nombre}
                      secondary={`Descripción: ${gravedad.descripcion}, Peso: ${gravedad.peso}`}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Urgencia de la Vulneración</InputLabel>
              <Select
                value={formData.presuntaVulneracion.urgenciaVulneracion}
                onChange={(e) => handleInputChange('presuntaVulneracion.urgenciaVulneracion', e.target.value)}
                label="Urgencia de la Vulneración"
              >
                {urgenciaVulneraciones.map((urgencia) => (
                  <MenuItem key={urgencia.id} value={urgencia.id}>
                    <ListItemText
                      primary={urgencia.nombre}
                      secondary={`Descripción: ${urgencia.descripcion}, Peso: ${urgencia.peso}`}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Condiciones de Vulnerabilidad (NNyA)</InputLabel>
              <Select
                multiple
                value={formData.presuntaVulneracion.condicionesVulnerabilidadNNyA}
                onChange={(e) => handleInputChange('presuntaVulneracion.condicionesVulnerabilidadNNyA', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={condicionesVulnerabilidad.find(c => c.id === value)?.nombre} />
                    ))}
                  </Box>
                )}
              >
                {condicionesVulnerabilidad.filter(c => c.nnya).map((condicion) => (
                  <MenuItem key={condicion.id} value={condicion.id}>
                    <Checkbox checked={(formData.presuntaVulneracion.condicionesVulnerabilidadNNyA || []).indexOf(condicion.id) > -1} />
                    <ListItemText primary={condicion.nombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Condiciones de Vulnerabilidad (Adulto)</InputLabel>
              <Select
                multiple
                value={formData.presuntaVulneracion.condicionesVulnerabilidadAdulto}
                onChange={(e) => handleInputChange('presuntaVulneracion.condicionesVulnerabilidadAdulto', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={condicionesVulnerabilidad.find(c => c.id === value)?.nombre} />
                    ))}
                  </Box>
                )}
              >
                {condicionesVulnerabilidad.filter(c => c.adulto).map((condicion) => (
                  <MenuItem key={condicion.id} value={condicion.id}>
                    <Checkbox checked={(formData.presuntaVulneracion.condicionesVulnerabilidadAdulto || []).indexOf(condicion.id) > -1} />
                    <ListItemText primary={condicion.nombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Ámbito de vulneración"
              value={formData.presuntaVulneracion.ambitoVulneracion}
              onChange={(e) => handleInputChange('presuntaVulneracion.ambitoVulneracion', e.target.value)}
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Principal Derecho vulnerado"
              value={formData.presuntaVulneracion.principalDerechoVulnerado}
              onChange={(e) => handleInputChange('presuntaVulneracion.principalDerechoVulnerado', e.target.value)}
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Problemática Identificada"
              value={formData.presuntaVulneracion.problematicaIdentificada}
              onChange={(e) => handleInputChange('presuntaVulneracion.problematicaIdentificada', e.target.value)}
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Prioridad sugerida de intervención"
              value={formData.presuntaVulneracion.prioridadIntervencion}
              onChange={(e) => handleInputChange('presuntaVulneracion.prioridadIntervencion', e.target.value)}
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Nombre y cargo de Operador/a"
              value={formData.presuntaVulneracion.nombreCargoOperador}
              onChange={(e) => handleInputChange('presuntaVulneracion.nombreCargoOperador', e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
          )
        case 4:
        return (
          <Box>
            <Typography color="primary" sx={{ mb: 2 }}>Autor de la vulneración de Derechos de NNyA</Typography>
            {formData.autores.map((autor: any, index: number) => (
              <Box key={index} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre y Apellido"
                  value={autor.nombreApellido}
                  onChange={(e) => handleInputChange(`autores[${index}].nombreApellido`, e.target.value)}
                />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Edad"
                      value={autor.edad}
                      onChange={(e) => handleInputChange(`autores[${index}].edad`, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Género"
                      value={autor.genero}
                      onChange={(e) => handleInputChange(`autores[${index}].genero`, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Vínculo"
                      value={autor.vinculo}
                      onChange={(e) => handleInputChange(`autores[${index}].vinculo`, e.target.value)}
                    />
                  </Grid>
                </Grid>
                <FormControl component="fieldset">
                  <Typography variant="body2">Convive?</Typography>
                  <RadioGroup
                    row
                    value={autor.convive}
                    onChange={(e) => handleInputChange(`autores[${index}].convive`, e.target.value === 'true')}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="SI" />
                    <FormControlLabel value={false} control={<Radio />} label="NO" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  label="Comentarios"
                  value={autor.comentarios}
                  onChange={(e) => handleInputChange(`autores[${index}].comentarios`, e.target.value)}
                  multiline
                  rows={4}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addAutor}
              sx={{ color: 'primary.main' }}
            >
              Añadir otro autor
            </Button>

            <Typography color="primary" sx={{ mt: 4, mb: 2 }}>Descripción de la situación</Typography>
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcionSituacion}
              onChange={(e) => handleInputChange('descripcionSituacion', e.target.value)}
              multiline
              rows={4}
            />

            <Typography color="primary" sx={{ mt: 4, mb: 2 }}>Sobre el usuario de la línea</Typography>
            <TextField
              fullWidth
              label="Nombre y Apellido"
              value={formData.usuarioLinea.nombreApellido}
              onChange={(e) => handleInputChange('usuarioLinea.nombreApellido', e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Edad"
                  value={formData.usuarioLinea.edad}
                  onChange={(e) => handleInputChange('usuarioLinea.edad', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Género"
                  value={formData.usuarioLinea.genero}
                  onChange={(e) => handleInputChange('usuarioLinea.genero', e.target.value)}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Vínculo"
              value={formData.usuarioLinea.vinculo}
              onChange={(e) => handleInputChange('usuarioLinea.vinculo', e.target.value)}
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.usuarioLinea.telefono}
              onChange={(e) => handleInputChange('usuarioLinea.telefono', e.target.value)}
            />
            <TextField
              fullWidth
              label="Institución o programa"
              value={formData.usuarioLinea.institucionPrograma}
              onChange={(e) => handleInputChange('usuarioLinea.institucionPrograma', e.target.value)}
            />
            <TextField
              fullWidth
              label="Contacto Institución o programa"
              value={formData.usuarioLinea.contactoInstitucion}
              onChange={(e) => handleInputChange('usuarioLinea.contactoInstitucion', e.target.value)}
            />
            <TextField
              fullWidth
              label="Nombre y cargo del responsable"
              value={formData.usuarioLinea.nombreCargoResponsable}
              onChange={(e) => handleInputChange('usuarioLinea.nombreCargoResponsable', e.target.value)}
            />
          </Box>
        )
      default:
        return null
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
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Anterior
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : (activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente')}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}