import React, { useState, useEffect, useRef } from 'react'
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
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
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
import 'dayjs/locale/zh-cn';

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
const formatDate = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // This will return YYYY-MM-DD
};
export default function NuevoIngresoModal({ isOpen, onClose, onSubmit }: NuevoIngresoModalProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<any>({
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

  useEffect(() => {
    fetchUsuariosExternos()
    fetchBarrios()
    fetchLocalidades()
    fetchProvincias()
    fetchCPCs()
  }, [])

  const fetchUsuariosExternos = async () => {
    try {
      const fetchedUsuarios = await getTUsuariosExternos()
      setUsuariosExternos(fetchedUsuarios)
    } catch (error) {
      console.error('Error fetching usuarios externos:', error)
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData: any) => {
      const newData = { ...prevData };
      const keys = field.split('.'); // Handles nested keys

      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i].includes('[')
          ? keys[i].split('[')[0]
          : keys[i];
        const index = keys[i].includes('[')
          ? parseInt(keys[i].match(/\d+/)?.[0] || '0', 10)
          : null;

        if (index !== null && Array.isArray(current[key])) {
          current = current[key][index];
        } else {
          current = current[key];
        }
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = value; // Set the new value for the specified field.

      return newData;
    });
  };



  const handleLocalizacionChange = (field: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      localizacion: {
        ...prevData.localizacion,
        [field]: value,
      },
    }))
  }

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
  }

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0))
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
    try {
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
      console.log('Localizacion data:', localizacionData)
      const localizacionResponse = await createLocalizacion(localizacionData)
      console.log('Localizacion response:', localizacionResponse)

      if (!localizacionResponse || !localizacionResponse.id) {
        throw new Error('Failed to create localizacion')
      }

      // Create personas for niños y adolescentes
      const ninosAdolescentesPersonas = await Promise.all(
        formData.ninosAdolescentes.map((nino: any) =>
          createTPersona({
            nombre: nino.nombre,
            apellido: nino.apellido,
            fecha_nacimiento: nino.fechaNacimiento,
            edad_aproximada: parseInt(nino.edadAproximada),
            dni: parseInt(nino.dni),
            situacion_dni: nino.situacionDni,
            genero: nino.genero,
            boton_antipanico: nino.botonAntipanico,
            observaciones: nino.observaciones,
            adulto: false,
            nnya: true,
          })
        )
      )

      // Create personas for adultos convivientes
      const adultosConvivientesPersonas = await Promise.all(
        formData.adultosConvivientes.map((adulto: any) =>
          createTPersona({
            nombre: adulto.nombre,
            apellido: adulto.apellido,
            fecha_nacimiento: adulto.fechaNacimiento,
            edad_aproximada: parseInt(adulto.edadAproximada),
            dni: parseInt(adulto.dni),
            situacion_dni: adulto.situacionDni,
            genero: adulto.genero,
            boton_antipanico: adulto.botonAntipanico,
            observaciones: adulto.observaciones,
            adulto: true,
            nnya: false,
          })
        )
      )

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

      console.log('Demanda data:', demandaData)
      const demandaResponse = await createDemand(demandaData)
      console.log('Demanda response:', demandaResponse)

      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(error.message || 'An error occurred while submitting the form')
    } finally {
      setIsSubmitting(false)
      isSubmittingRef.current = false
    }
  }

  const addNinoAdolescente = () => {
    setFormData((prevData: any) => ({
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
    setFormData((prevData: any) => ({
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
    setFormData((prevData: any) => ({
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
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
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
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nro. SAC"
                type="number"
                value={formData.nro_sac}
                onChange={(e) => handleInputChange('nro_sac', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nro. SUAC"
                type="number"
                value={formData.nro_suac}
                onChange={(e) => handleInputChange('nro_suac', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nro. Historia Clínica"
                type="number"
                value={formData.nro_historia_clinica}
                onChange={(e) => handleInputChange('nro_historia_clinica', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nro. Oficio Web"
                type="number"
                value={formData.nro_oficio_web}
                onChange={(e) => handleInputChange('nro_oficio_web', e.target.value)}
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
                onChange={(e) => handleLocalizacionChange('calle', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Calle</InputLabel>
                <Select
                  value={formData.localizacion.tipo_calle}
                  onChange={(e) => handleLocalizacionChange('tipo_calle', e.target.value)}
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
                onChange={(e) => handleLocalizacionChange('piso_depto', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Lote"
                type="number"
                value={formData.localizacion.lote}
                onChange={(e) => handleLocalizacionChange('lote', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Manzana"
                type="number"
                value={formData.localizacion.mza}
                onChange={(e) => handleLocalizacionChange('mza', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Número de Casa"
                type="number"
                value={formData.localizacion.casa_nro}
                onChange={(e) => handleLocalizacionChange('casa_nro', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Referencia Geográfica"
                multiline
                rows={2}
                value={formData.localizacion.referencia_geo}
                onChange={(e) => handleLocalizacionChange('referencia_geo', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Barrio</InputLabel>
                <Select
                  value={formData.localizacion.barrio}
                  onChange={(e) => handleLocalizacionChange('barrio', e.target.value)}
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
              <FormControl fullWidth>
                <InputLabel>Localidad</InputLabel>
                <Select
                  value={formData.localizacion.localidad}
                  onChange={(e) => handleLocalizacionChange('localidad', e.target.value)}
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
              <FormControl fullWidth>
                <InputLabel>CPC</InputLabel>
                <Select
                  value={formData.localizacion.cpc}
                  onChange={(e) => handleLocalizacionChange('cpc', e.target.value)}
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
              <FormControl fullWidth>
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
            {formData.ninosAdolescentes.map((nino: any, index: number) => (
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
                      if (newValue) {
                        const formattedDate = newValue.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
                        handleInputChange(`ninosAdolescentes[${index}].fechaNacimiento`, formattedDate);
                      } else {
                        handleInputChange(`ninosAdolescentes[${index}].fechaNacimiento`, '');
                      }
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
            {formData.adultosConvivientes.map((adulto: any, index: number) => (
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
                      if (newValue) {
                        const formattedDate = newValue.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
                        handleInputChange(`adultosConvivientes[${index}].fechaNacimiento`, formattedDate);
                      } else {
                        handleInputChange(`adultosConvivientes[${index}].fechaNacimiento`, '');
                      }
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
            <TextField
              fullWidth
              label="Motivo"
              value={formData.presuntaVulneracion.motivo}
              onChange={(e) => handleInputChange('presuntaVulneracion.motivo', e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Ámbito de vulneración"
              value={formData.presuntaVulneracion.ambitoVulneracion}
              onChange={(e) => handleInputChange('presuntaVulneracion.ambitoVulneracion', e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Principal Derecho vulnerado"
              value={formData.presuntaVulneracion.principalDerechoVulnerado}
              onChange={(e) => handleInputChange('presuntaVulneracion.principalDerechoVulnerado', e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Problemática Identificada"
              value={formData.presuntaVulneracion.problematicaIdentificada}
              onChange={(e) => handleInputChange('presuntaVulneracion.problematicaIdentificada', e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Prioridad sugerida de intervención"
              value={formData.presuntaVulneracion.prioridadIntervencion}
              onChange={(e) => handleInputChange('presuntaVulneracion.prioridadIntervencion', e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Nombre y cargo de Operador/a"
              value={formData.presuntaVulneracion.nombreCargoOperador}
              onChange={(e) => handleInputChange('presuntaVulneracion.nombreCargoOperador', e.target.value)}
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