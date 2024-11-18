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
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { es } from 'date-fns/locale'
import { createLocalizacion } from '../../api/TableFunctions/localizacion'
import { getTUsuariosExternos } from '../../api/TableFunctions/usuarioExterno'
import { createDemand } from '../../api/TableFunctions/demands'
import { getTBarrios } from '../../api/TableFunctions/barrios'
import { getTLocalidads } from '../../api/TableFunctions/localidades'
import { getTProvincias } from '../../api/TableFunctions/provincias'
import { getTCPCs } from '../../api/TableFunctions/cpcs'
import { X } from 'lucide-react'

interface NuevoIngresoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: any) => void
}

export default function NuevoIngresoModal({ isOpen, onClose, onSubmit }: NuevoIngresoModalProps) {
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
  })
  const [usuariosExternos, setUsuariosExternos] = useState<any[]>([])
  const [barrios, setBarrios] = useState<any[]>([])
  const [localidades, setLocalidades] = useState<any[]>([])
  const [provincias, setProvincias] = useState<any[]>([])
  const [cpcs, setCPCs] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSubmittingRef = useRef(false);

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
    setFormData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }))
  }

  const handleLocalizacionChange = (field: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      localizacion: {
        ...prevData.localizacion,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isSubmittingRef.current) {
      return;
    }
    
    isSubmittingRef.current = true;
    setIsSubmitting(true)
    setError(null)
    try {
      // Validate required fields
      const requiredFields = ['origen', 'descripcion', 'usuario_externo']
      const missingFields = requiredFields.filter(field => !formData[field])
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // First, create the localizacion
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

      // Then, create the demanda with the localizacion ID
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
      isSubmittingRef.current = false;
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
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
        <form onSubmit={handleSubmit}>
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
                onChange={(e) => handleLocalizacionChange('calle', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
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
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Lote"
                type="number"
                value={formData.localizacion.lote}
                onChange={(e) => handleLocalizacionChange('lote', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Manzana"
                type="number"
                value={formData.localizacion.mza}
                onChange={(e) => handleLocalizacionChange('mza', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Número de Casa"
                type="number"
                value={formData.localizacion.casa_nro}
                onChange={(e) => handleLocalizacionChange('casa_nro', e.target.value)}
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
                onChange={(e) => handleLocalizacionChange('referencia_geo', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
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
              <FormControl fullWidth size="small">
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
              <FormControl fullWidth size="small">
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

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}