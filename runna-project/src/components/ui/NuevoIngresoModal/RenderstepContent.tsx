import React, { useEffect, useState } from 'react'
import {
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Checkbox,
  ListItemText,
  Chip,
  Box,
  Button,
  Radio,
  RadioGroup,
} from '@mui/material'
import { ImportIcon as AddIcon } from 'lucide-react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers'
import { es } from 'date-fns/locale'
import { getTCategoriaMotivo } from '../../../api/TableFunctions/categoriasMotivos'
const formatDate = (date) => date ? date.toISOString().split('T')[0] : null
const getCategoriaMotivosNombre = (motivoId: number, categoriaMotivos: any[]) => {
  const categoria = categoriaMotivos.find(cat => cat.id === motivoId)
  return categoria ? categoria.nombre : 'Desconocido'
}

export const renderStepContent = ({
  activeStep,
  formData,
  handleInputChange,
  addNinoAdolescente,
  addVulneraciontext,
  addAdultoConviviente,
  addAutor,
  usuariosExternos,
  barrios,
  localidades,
  cpcs,
  motivosIntervencion,
  categoriaMotivos,
  categoriaSubmotivos,
  gravedadVulneraciones,
  urgenciaVulneraciones,
  condicionesVulnerabilidad,
  addVulneracionApi,
  institucionesEducativas,
  institucionesSanitarias,


}) => {
  const [newVulneracion, setNewVulneracion] = useState({
    principal_demanda: false,
    transcurre_actualidad: false,
    categoria_motivo: '',
    categoria_submotivo: '',
    gravedad_vulneracion: '',
    urgencia_vulneracion: '',
    nnya: '',
    autor_dv: '',
  })

  const [localFilteredSubmotivos, setLocalFilteredSubmotivos] = useState([])

  useEffect(() => {
    if (newVulneracion.categoria_motivo) {
      const filtered = categoriaSubmotivos.filter(submotivo =>
        submotivo.motivo === newVulneracion.categoria_motivo
      )
      setLocalFilteredSubmotivos(filtered)
    } else {
      setLocalFilteredSubmotivos([])
    }
  }, [newVulneracion.categoria_motivo, categoriaSubmotivos])

  const handleVulneracionChange = (field, value) => {
    setNewVulneracion(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'categoria_motivo') {
        updated.categoria_submotivo = ''
      }
      return updated
    })
  }


  switch (activeStep) {
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

          <FormControl fullWidth>
            <InputLabel>Motivos de Intervención</InputLabel>
            <Select
              value={formData.presuntaVulneracion.motivos || ''}  // Assuming 'motivos' is now a single value
              onChange={(e) => handleInputChange('presuntaVulneracion.motivos', e.target.value)}
            >
              {motivosIntervencion.map((motivo) => (
                <MenuItem key={motivo.id} value={motivo.id}>
                  <ListItemText
                    primary={motivo.nombre}
                    secondary={`Descripción: ${motivo.descripcion}, Peso: ${motivo.peso}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>


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
                  <MenuItem value="VENCIDO">Vencido</MenuItem>
                  <MenuItem value="EXTRAVIADO">Extraviado</MenuItem>
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
                  <MenuItem value="OTRO">Otro</MenuItem>
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

              <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información Educativa</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Institución Educativa</InputLabel>
                <Select
                  value={nino.educacion?.institucion_educativa || ''}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].educacion.institucion_educativa`, e.target.value)}
                  label="Institución Educativa"
                >
                  {institucionesEducativas && institucionesEducativas.length > 0 ? (
                    institucionesEducativas.map((institucion) => (
                      <MenuItem key={institucion.id} value={institucion.id}>
                        {institucion.nombre}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>No hay instituciones disponibles</MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Curso"
                value={nino.educacion?.curso || ''}
                onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].educacion.curso`, e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Nivel</InputLabel>
                <Select
                  value={nino.educacion?.nivel || ''}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].educacion.nivel`, e.target.value)}
                  label="Nivel"
                >
                  <MenuItem value="PRIMARIO">Primario</MenuItem>
                  <MenuItem value="SECUNDARIO">Secundario</MenuItem>
                  <MenuItem value="TERCIARIO">Terciario</MenuItem>
                  <MenuItem value="UNIVERSITARIO">Universitario</MenuItem>
                  <MenuItem value="OTRO">Otro</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Turno</InputLabel>
                <Select
                  value={nino.educacion?.turno || ''}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].educacion.turno`, e.target.value)}
                  label="Turno"
                >
                  <MenuItem value="MANIANA">Mañana</MenuItem>
                  <MenuItem value="TARDE">Tarde</MenuItem>
                  <MenuItem value="NOCHE">Noche</MenuItem>
                  <MenuItem value="OTRO">Otro</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Comentarios Educativos"
                multiline
                rows={2}
                value={nino.educacion?.comentarios || ''}
                onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].educacion.comentarios`, e.target.value)}
              />
                           <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información de Salud</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Institución Sanitaria</InputLabel>
                <Select
                  value={nino.salud?.institucion_sanitaria || ''}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].salud.institucion_sanitaria`, e.target.value)}
                  label="Institución Sanitaria"
                >
                  {institucionesSanitarias.map((institucion) => (
                    <MenuItem key={institucion.id} value={institucion.id}>
                      {institucion.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Observaciones de Salud"
                multiline
                rows={2}
                value={nino.salud?.observaciones || ''}
                onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].salud.observaciones`, e.target.value)}
              />
            </Box>

          )
          )
          }
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
                  <Checkbox
                    checked={adulto.supuesto_autordv}
                    onChange={(e) => handleInputChange(`adultosConvivientes[${index}].supuesto_autordv`, e.target.checked)}
                  />
                }
                label="Supuesto autor DV"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={adulto.conviviente}
                    onChange={(e) => handleInputChange(`adultosConvivientes[${index}].conviviente`, e.target.checked)}
                  />
                }
                label="Conviviente"
              />
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
          <Typography variant="h6" color="primary" gutterBottom>
            Presunta Vulneración de Derechos informada
          </Typography>

          {formData.vulneraciones.map((vulneracion, index) => (
            <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
              <Typography variant="h6" gutterBottom>Vulneración {index + 1}</Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id={`categoria-motivos-label-${index}`}>Categoría de Motivos</InputLabel>
                <Select
                  labelId={`categoria-motivos-label-${index}`}
                  value={vulneracion.categoria_motivo}
                  onChange={(e) => handleInputChange(`vulneraciones[${index}].categoria_motivo`, e.target.value)}
                >
                  {categoriaMotivos.map((motivo) => (
                    <MenuItem key={motivo.id} value={motivo.id}>
                      {motivo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Subcategoría</InputLabel>
                <Select
                  value={vulneracion.categoria_submotivo}
                  onChange={(e) => handleInputChange(`vulneraciones[${index}].categoria_submotivo`, e.target.value)}
                  disabled={!vulneracion.categoria_motivo}
                >
                  {categoriaSubmotivos
                    .filter(submotivo => submotivo.motivo === vulneracion.categoria_motivo)
                    .map((submotivo) => (
                      <MenuItem key={submotivo.id} value={submotivo.id}>
                        {submotivo.nombre}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Gravedad de la Vulneración</InputLabel>
                <Select
                  value={vulneracion.gravedad_vulneracion}
                  onChange={(e) => handleInputChange(`vulneraciones[${index}].gravedad_vulneracion`, e.target.value)}
                >
                  {gravedadVulneraciones.map((gravedad) => (
                    <MenuItem key={gravedad.id} value={gravedad.id}>
                      {gravedad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Urgencia de la Vulneración</InputLabel>
                <Select
                  value={vulneracion.urgencia_vulneracion}
                  onChange={(e) => handleInputChange(`vulneraciones[${index}].urgencia_vulneracion`, e.target.value)}
                >
                  {urgenciaVulneraciones.map((urgencia) => (
                    <MenuItem key={urgencia.id} value={urgencia.id}>
                      {urgencia.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>NNyA</InputLabel>
                <Select
                  value={vulneracion.nnya}
                  onChange={(e) => handleInputChange(`vulneraciones[${index}].nnya`, e.target.value)}
                >
                  {formData.ninosAdolescentes.map((nnya, nnyaIndex) => (
                    <MenuItem key={nnyaIndex} value={nnyaIndex}>
                      {`${nnya.nombre} ${nnya.apellido}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Autor DV</InputLabel>
                <Select
                  value={vulneracion.autor_dv}
                  onChange={(e) => handleInputChange(`vulneraciones[${index}].autor_dv`, e.target.value)}
                >
                  {formData.adultosConvivientes.map((adulto, adultoIndex) => (
                    <MenuItem key={adultoIndex} value={adultoIndex}>
                      {`${adulto.nombre} ${adulto.apellido}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vulneracion.principal_demanda}
                      onChange={(e) => handleInputChange(`vulneraciones[${index}].principal_demanda`, e.target.checked)}
                    />
                  }
                  label="Principal Demanda"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vulneracion.transcurre_actualidad}
                      onChange={(e) => handleInputChange(`vulneraciones[${index}].transcurre_actualidad`, e.target.checked)}
                    />
                  }
                  label="Transcurre Actualidad"
                />
              </Box>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={addVulneraciontext}
            sx={{ mt: 2, color: 'primary.main' }}
          >
            Añadir otra vulneración
          </Button>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Vulneraciones Añadidas: {formData.vulneraciones.length}
          </Typography>
        </Box>
      )

    case 4:
      return (
        <Box>
          <Typography color="primary" sx={{ mb: 2 }}>Vulneracion</Typography>
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

