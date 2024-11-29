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
  FormGroup,
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
const renderLocalizacionFields = (prefix, data, handleInputChange, barrios, localidades, cpcs) => (
  <>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Calle"
        value={data.calle}
        onChange={(e) => handleInputChange(`${prefix}.calle`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>Tipo de Calle</InputLabel>
        <Select
          value={data.tipo_calle}
          onChange={(e) => handleInputChange(`${prefix}.tipo_calle`, e.target.value)}
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
        value={data.piso_depto}
        onChange={(e) => handleInputChange(`${prefix}.piso_depto`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Lote"
        type="number"
        value={data.lote}
        onChange={(e) => handleInputChange(`${prefix}.lote`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Manzana"
        type="number"
        value={data.mza}
        onChange={(e) => handleInputChange(`${prefix}.mza`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Número de Casa"
        type="number"
        value={data.casa_nro}
        onChange={(e) => handleInputChange(`${prefix}.casa_nro`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Referencia Geográfica"
        multiline
        rows={2}
        value={data.referencia_geo}
        onChange={(e) => handleInputChange(`${prefix}.referencia_geo`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>Barrio</InputLabel>
        <Select
          value={data.barrio}
          onChange={(e) => handleInputChange(`${prefix}.barrio`, e.target.value)}
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
          value={data.localidad}
          onChange={(e) => handleInputChange(`${prefix}.localidad`, e.target.value)}
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
          value={data.cpc}
          onChange={(e) => handleInputChange(`${prefix}.cpc`, e.target.value)}
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
  </>
)
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
  institucionesUsuarioExterno,
  vinculosUsuarioExterno,
  addVinculacion,
  removeVinculacion,
  vinculoPersonas,
}) => {

  const renderVinculacion = (vinculacion, index) => (
    <Grid container spacing={2} key={index} sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Vinculación {index + 1}</Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>
          Persona 1 (NNyA Principal):
        </Typography>
        <Typography>
          {formData.ninosAdolescentes[0].nombre} {formData.ninosAdolescentes[0].apellido}
        </Typography>
      </Grid>
  
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Persona 2</InputLabel>
          <Select
            value={vinculacion.persona_2}
            onChange={(e) => handleInputChange(`vinculaciones[${index}].persona_2`, e.target.value)}
            label="Persona 2"
          >
            {formData.ninosAdolescentes.slice(1).map((nnya, i) => (
              <MenuItem key={`nnya-${i+1}`} value={i+1}>
                {nnya.nombre} {nnya.apellido} (NNyA)
              </MenuItem>
            ))}
            {formData.adultosConvivientes.map((adulto, i) => (
              <MenuItem key={`adulto-${i}`} value={formData.ninosAdolescentes.length + i}>
                {adulto.nombre} {adulto.apellido} (Adulto)
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
  
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Vínculo</InputLabel>
          <Select
            value={vinculacion.vinculo}
            onChange={(e) => handleInputChange(`vinculaciones[${index}].vinculo`, e.target.value)}
            label="Vínculo"
          >
            {vinculoPersonas.map((vinculo) => (
              <MenuItem key={vinculo.id} value={vinculo.id}>
                {vinculo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
  
      <Grid item xs={12} md={6}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={vinculacion.conviven}
                onChange={(e) => handleInputChange(`vinculaciones[${index}].conviven`, e.target.checked)}
              />
            }
            label="Conviven"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={vinculacion.autordv}
                onChange={(e) => handleInputChange(`vinculaciones[${index}].autordv`, e.target.checked)}
              />
            }
            label="Autor DV"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={vinculacion.garantiza_proteccion}
                onChange={(e) => handleInputChange(`vinculaciones[${index}].garantiza_proteccion`, e.target.checked)}
              />
            }
            label="Garantiza Protección"
          />
        </FormGroup>
      </Grid>
  
      <Grid item xs={12}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => removeVinculacion(index)}
        >
          Eliminar Vinculación
        </Button>
      </Grid>
    </Grid>
  )
  
  



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
          {renderLocalizacionFields('localizacion', formData.localizacion, handleInputChange, barrios, localidades, cpcs)}

          <Grid item xs={12}>
            <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Usuario Externo</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.createNewUsuarioExterno}
                  onChange={(e) => handleInputChange('createNewUsuarioExterno', e.target.checked)}
                />
              }
              label="Crear nuevo usuario externo"
            />
          </Grid>
          {formData.createNewUsuarioExterno ? (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.usuarioExterno.nombre}
                  onChange={(e) => handleInputChange('usuarioExterno.nombre', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.usuarioExterno.apellido}
                  onChange={(e) => handleInputChange('usuarioExterno.apellido', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={formData.usuarioExterno.fecha_nacimiento ? new Date(formData.usuarioExterno.fecha_nacimiento) : null}
                    onChange={(newValue) => handleInputChange('usuarioExterno.fecha_nacimiento', formatDate(newValue))}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    inputFormat="yyyy-MM-dd"
                  />
                </LocalizationProvider>
                
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Género</InputLabel>
                  <Select
                    value={formData.usuarioExterno.genero}
                    onChange={(e) => handleInputChange('usuarioExterno.genero', e.target.value)}
                    label="Género"
                  >
                    <MenuItem value="MASCULINO">Masculino</MenuItem>
                    <MenuItem value="FEMENINO">Femenino</MenuItem>
                    <MenuItem value="OTRO">Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  type="number"
                  value={formData.usuarioExterno.telefono}
                  onChange={(e) => handleInputChange('usuarioExterno.telefono', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.usuarioExterno.mail}
                  onChange={(e) => handleInputChange('usuarioExterno.mail', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Vínculo</InputLabel>
                  <Select
                    value={formData.usuarioExterno.vinculo}
                    onChange={(e) => handleInputChange('usuarioExterno.vinculo', e.target.value)}
                    label="Vínculo"
                  >
                    {vinculosUsuarioExterno && vinculosUsuarioExterno.map((vinculo) => (
                      <MenuItem key={vinculo.id} value={vinculo.id}>
                        {vinculo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Institución</InputLabel>
                  <Select
                    value={formData.usuarioExterno.institucion}
                    onChange={(e) => handleInputChange('usuarioExterno.institucion', e.target.value)}
                    label="Institución"
                  >
                    {institucionesUsuarioExterno && institucionesUsuarioExterno.map((institucion) => (
                      <MenuItem key={institucion.id} value={institucion.id}>
                        {institucion.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Usuario Externo</InputLabel>
                <Select
                  value={formData.usuarioExterno.id}
                  onChange={(e) => handleInputChange('usuarioExterno.id', e.target.value)}
                  label="Usuario Externo"
                >
                  {usuariosExternos && usuariosExternos.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {`${usuario.nombre} ${usuario.apellido}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      )
      case 1:
        return (
          <Box>
            <Typography color="primary" sx={{ mb: 2 }}>Niñas, niños y adolescentes convivientes</Typography>
            {formData.ninosAdolescentes.map((nino, index) => (
              <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>
                  {index === 0 ? "Niño, Niña o Adolescente Principal" : `Niño, Niña o Adolescente ${index + 1}`}
                </Typography>
    
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
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    inputFormat="yyyy-MM-dd"
                  />
                </LocalizationProvider>
    
                <TextField
                  fullWidth
                  label="Edad Aproximada"
                  type="number"
                  value={nino.edadAproximada}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].edadAproximada`, e.target.value)}
                  margin="normal"
                />
    
                <TextField
                  fullWidth
                  label="DNI"
                  type="number"
                  value={nino.dni}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].dni`, e.target.value)}
                  margin="normal"
                />
    
                <FormControl fullWidth margin="normal">
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
    
                <FormControl fullWidth margin="normal">
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
    
                <TextField
                  fullWidth
                  label="Observaciones"
                  multiline
                  rows={4}
                  value={nino.observaciones}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].observaciones`, e.target.value)}
                  margin="normal"
                />
    
                <FormControlLabel
                  control={
                    <Switch
                      checked={nino.useDefaultLocalizacion}
                      onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].useDefaultLocalizacion`, e.target.checked)}
                    />
                  }
                  label="Usar localización de la demanda"
                />
    
                {!nino.useDefaultLocalizacion && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Localización específica</Typography>
                    {renderLocalizacionFields(`ninosAdolescentes[${index}].localizacion`, nino.localizacion, handleInputChange, barrios, localidades, cpcs)}
                  </Box>
                )}
    
                <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información Educativa</Typography>
                <FormControl fullWidth margin="normal">
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
                  margin="normal"
                />
    
                <FormControl fullWidth margin="normal">
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
    
                <FormControl fullWidth margin="normal">
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
                  margin="normal"
                />
    
                <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información de Salud</Typography>
                <FormControl fullWidth margin="normal">
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
                  margin="normal"
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addNinoAdolescente}
              sx={{ color: 'primary.main', mt: 2 }}
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
                <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                  <Typography variant="h6" gutterBottom>
                    Adulto Conviviente {index + 1}
                  </Typography>
      
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={adulto.nombre}
                        onChange={(e) => handleInputChange(`adultosConvivientes[${index}].nombre`, e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Apellido"
                        value={adulto.apellido}
                        onChange={(e) => handleInputChange(`adultosConvivientes[${index}].apellido`, e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
      
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha de Nacimiento"
                      value={adulto.fechaNacimiento ? new Date(adulto.fechaNacimiento) : null}
                      onChange={(newValue) =>
                        handleInputChange(`adultosConvivientes[${index}].fechaNacimiento`, newValue ? formatDate(newValue) : null)
                      }
                      renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                      inputFormat="yyyy-MM-dd"
                    />
                  </LocalizationProvider>
      
                  <TextField
                    fullWidth
                    label="Edad Aproximada"
                    type="number"
                    value={adulto.edadAproximada}
                    onChange={(e) => handleInputChange(`adultosConvivientes[${index}].edadAproximada`, e.target.value)}
                    margin="normal"
                  />
      
                  <TextField
                    fullWidth
                    label="DNI"
                    type="number"
                    value={adulto.dni}
                    onChange={(e) => handleInputChange(`adultosConvivientes[${index}].dni`, e.target.value)}
                    margin="normal"
                  />
      
                  <FormControl fullWidth margin="normal">
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
      
                  <FormControl fullWidth margin="normal">
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
      
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={adulto.supuesto_autordv}
                          onChange={(e) => handleInputChange(`adultosConvivientes[${index}].supuesto_autordv`, e.target.checked)}
                        />
                      }
                      label="Supuesto autor DV"
                    />
                  </Box>
      
                  <Box sx={{ mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={adulto.conviviente}
                          onChange={(e) => handleInputChange(`adultosConvivientes[${index}].conviviente`, e.target.checked)}
                        />
                      }
                      label="Conviviente"
                    />
                  </Box>
      
                  <Box sx={{ mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={adulto.botonAntipanico}
                          onChange={(e) => handleInputChange(`adultosConvivientes[${index}].botonAntipanico`, e.target.checked)}
                        />
                      }
                      label="Botón Antipánico"
                    />
                  </Box>
      
                  <TextField
                    fullWidth
                    label="Observaciones"
                    multiline
                    rows={4}
                    value={adulto.observaciones}
                    onChange={(e) => handleInputChange(`adultosConvivientes[${index}].observaciones`, e.target.value)}
                    margin="normal"
                  />
      
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={adulto.useDefaultLocalizacion}
                          onChange={(e) => handleInputChange(`adultosConvivientes[${index}].useDefaultLocalizacion`, e.target.checked)}
                        />
                      }
                      label="Usar localización de la demanda"
                    />
                  </Box>
      
                  {!adulto.useDefaultLocalizacion && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Localización específica</Typography>
                      {renderLocalizacionFields(
                        `adultosConvivientes[${index}].localizacion`,
                        adulto.localizacion,
                        handleInputChange,
                        barrios,
                        localidades,
                        cpcs
                      )}
                    </Box>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addAdultoConviviente}
                sx={{ color: 'primary.main', mt: 2 }}
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
            <Typography variant="h6" gutterBottom>
              Vínculos
            </Typography>
            {formData.vinculaciones.map((vinculacion, index) => renderVinculacion(vinculacion, index))}
            <Button variant="contained" color="primary" onClick={addVinculacion} sx={{ mt: 2 }}>
              Agregar Vinculación
            </Button>
          </Box>
        )
  
    default:
      return null
  }
}

