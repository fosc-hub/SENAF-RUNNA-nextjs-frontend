import React, { useEffect } from 'react'
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
  Paper,
  FormGroup,
} from '@mui/material'
import { ImportIcon as AddIcon } from 'lucide-react'

import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { es } from 'date-fns/locale'

const formatDate = (date) => date ? date.toISOString().split('T')[0] : null

const renderLocalizacionFields = (prefix, data, handleInputChange, barrios, localidades, cpcs) => (
  <>
    {/* Calle */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Calle"
        value={data.calle || ''} // Safeguard for missing values
        onChange={(e) => handleInputChange(`${prefix}.calle`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>Tipo de Calle</InputLabel>
        <Select
          value={data.tipo_calle || ''} // Safeguard for missing values
          onChange={(e) => handleInputChange(`${prefix}.tipo_calle`, e.target.value)}
          label="Tipo de Calle"
        >
          <MenuItem value="CALLE">CALLE</MenuItem>
          <MenuItem value="AVENIDA">AVENIDA</MenuItem>
          <MenuItem value="PASAJE">PASAJE</MenuItem>
        </Select>
      </FormControl>
    </Grid>


    {/* Additional fields */}
    {[
      { label: 'Piso/Depto', name: 'piso_depto' },
      { label: 'Lote', name: 'lote' },
      { label: 'Manzana', name: 'mza' },
      { label: 'Número de Casa', name: 'casa_nro' },
    ].map((field) => (
      <Grid item xs={6} key={field.name}>
        <TextField
          fullWidth
          label={field.label}
          type="number"
          value={data[field.name] || ''}
          onChange={(e) => handleInputChange(`${prefix}.${field.name}`, e.target.value)}
          size="small"
        />
      </Grid>
    ))}

    {/* Referencia Geográfica */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Referencia Geográfica"
        multiline
        rows={2}
        value={data.referencia_geo || ''}
        onChange={(e) => handleInputChange(`${prefix}.referencia_geo`, e.target.value)}
        size="small"
      />
    </Grid>

    {/* Barrio */}
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>Barrio</InputLabel>
        <Select
          value={data.barrio || ''}
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

    {/* Localidad */}
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>Localidad</InputLabel>
        <Select
          value={data.localidad || ''}
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

    {/* CPC */}
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>CPC</InputLabel>
        <Select
          value={data.cpc || ''}
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
);



export const renderStepContent = ({
  activeStep,
  formData,
  handleInputChange,
  motivosIntervencion,
  barrios,
  localidades,
  cpcs,
  vinculosUsuarioExterno,
  institucionesUsuarioExterno,
  usuarioExterno,
  usuariosExternos, // Add this new prop
  demandaMotivoIntervencion,
  demanda,
  getMotivoIntervencion,
  currentMotivoIntervencion,
  localizacion,
  addNinoAdolescente,
  addAdultoConviviente,
  addVinculacion,
  removeVinculacion,
  addCondicionVulnerabilidad,
  removeCondicionVulnerabilidad,
  institucionesEducativas,
  institucionesSanitarias,
  addVulneraciontext,
  addVulneracion,
  categoriaMotivos, // Receive it as a prop
  categoriaSubmotivos, // Receive submotivos as a prop
  gravedadVulneraciones, // Receive gravedadVulneraciones as a prop
  urgenciaVulneraciones,
  condicionesVulnerabilidadNNyA,
  condicionesVulnerabilidadAdultos,
  vinculoPersonas, // Add this here
  condicionesVulnerabilidad,
  personasWithCondiciones,



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
    {formData.ninosAdolescentes.map((nino, i) => (
      <MenuItem key={`nnya-${nino.id}`} value={nino.id}>
        {nino.nombre} {nino.apellido} (NNyA)
      </MenuItem>
    ))}
    {formData.adultosConvivientes.map((adulto, i) => (
      <MenuItem key={`adulto-${adulto.id}`} value={adulto.id}>
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Motivos de Intervención</InputLabel>
              <Select
                value={formData.presuntaVulneracion.motivos || ''}
                onChange={async (e) => {
                  const selectedMotivoId = e.target.value
                  handleInputChange('presuntaVulneracion.motivos', selectedMotivoId)

                  const existingDemandaMotivo = demandaMotivoIntervencion.find(
                    dm => dm.demanda === demanda?.id && dm.motivo_intervencion === selectedMotivoId
                  )

                  if (!existingDemandaMotivo) {
                    console.log('No existing demanda-motivo-intervencion found for this combination')
                  } else {
                    console.log('Existing demanda-motivo-intervencion:', existingDemandaMotivo)
                  }

                  const motivoDetails = await getMotivoIntervencion(selectedMotivoId)
                  if (motivoDetails) {
                    console.log('Motivo details:', motivoDetails)
                  }
                }}
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
          </Grid>
          <Grid item xs={12}>
            <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Datos de Localización</Typography>
          </Grid>
          <Grid item xs={12}>

          </Grid>

          {renderLocalizacionFields(

            'localizacion',
            formData.localizacion, // Ensure this contains all fetched data
            handleInputChange,
            barrios,
            localidades,
            cpcs
          )}


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
              {/* Fields for creating a new usuario externo */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.usuarioExterno.nombre}
                  onChange={(e) => handleInputChange('usuarioExterno.nombre', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.usuarioExterno.apellido}
                  onChange={(e) => handleInputChange('usuarioExterno.apellido', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={formData.usuarioExterno.fecha_nacimiento ? new Date(formData.usuarioExterno.fecha_nacimiento) : null}
                    onChange={(newValue) => handleInputChange('usuarioExterno.fecha_nacimiento', newValue ? newValue.toISOString().split('T')[0] : null)}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" required />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" required>
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
                  type="tel"
                  value={formData.usuarioExterno.telefono}
                  onChange={(e) => handleInputChange('usuarioExterno.telefono', e.target.value)}
                  size="small"
                  required
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
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Vínculo</InputLabel>
                  <Select
                    value={formData.usuarioExterno.vinculo}
                    onChange={(e) => handleInputChange('usuarioExterno.vinculo', e.target.value)}
                    label="Vínculo"
                  >
                    {vinculosUsuarioExterno.map((vinculo) => (
                      <MenuItem key={vinculo.id} value={vinculo.id}>
                        {vinculo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Institución</InputLabel>
                  <Select
                    value={formData.usuarioExterno.institucion}
                    onChange={(e) => handleInputChange('usuarioExterno.institucion', e.target.value)}
                    label="Institución"
                  >
                    {institucionesUsuarioExterno.map((institucion) => (
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
                  value={formData.usuarioExterno.id || ''}
                  onChange={(e) => {
                    const selectedUser = usuariosExternos.find(user => user.id === e.target.value);
                    handleInputChange('usuarioExterno', selectedUser || initialFormData(null).usuarioExterno);
                  }}
                  label="Usuario Externo"
                >
                  {usuariosExternos.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {`${usuario.nombre} ${usuario.apellido}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {/* Display selected usuario externo details */}
          {!formData.createNewUsuarioExterno && formData.usuarioExterno.id && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.usuarioExterno.nombre || ''}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.usuarioExterno.apellido || ''}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  value={formData.usuarioExterno.fecha_nacimiento || ''}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Género"
                  value={formData.usuarioExterno.genero || ''}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.usuarioExterno.telefono || ''}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.usuarioExterno.mail || ''}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Grid>
            </>
          )}
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
            value={nino.situacionDni || ''}
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

                <TextField
                  fullWidth
                  label="Observaciones"
                  multiline
                  rows={4}
                  value={nino.observaciones}
                  onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].observaciones`, e.target.value)}
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
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Localización específica</Typography>
                    </Grid>
                    {renderLocalizacionFields(
        `ninosAdolescentes[${index}].localizacion`,
        nino.localizacion || {}, // Fetched localización data
        handleInputChange,
        barrios,
        localidades,
        cpcs
      )}                  </Grid>
                )}
<Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información Educativa</Typography>
<FormControl fullWidth>
  <InputLabel>Institución Educativa</InputLabel>
  <Select
    value={nino.educacion?.institucion_educativa || ''}
    onChange={(e) =>
      handleInputChange(
        `ninosAdolescentes[${index}].educacion.institucion_educativa`,
        e.target.value
      )
    }
    label="Institución Educativa"
  >
    {(institucionesEducativas || []).length > 0 ? (
      institucionesEducativas.map((inst) => (
        <MenuItem key={inst.id} value={inst.id}>
          {inst.nombre}
        </MenuItem>
      ))
    ) : (
      <MenuItem value="" disabled>
        No hay instituciones disponibles
      </MenuItem>
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
                <FormControl fullWidth>
  <InputLabel>Institución Sanitaria</InputLabel>
  <Select
    value={nino.salud?.institucion_sanitaria || ''}
    onChange={(e) => handleInputChange(`ninosAdolescentes[${index}].salud.institucion_sanitaria`, e.target.value)}
    label="Institución Sanitaria"
  >
    {institucionesSanitarias && institucionesSanitarias.length > 0 ? (
      institucionesSanitarias.map((inst) => (
        <MenuItem key={inst.id} value={inst.id}>
          {inst.nombre}
        </MenuItem>
      ))
    ) : (
      <MenuItem value="" disabled>No hay instituciones disponibles</MenuItem>
    )}
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
            value={adulto.nombre || ''}
            onChange={(e) => handleInputChange(`adultosConvivientes[${index}].nombre`, e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Apellido"
            value={adulto.apellido || ''}
            onChange={(e) => handleInputChange(`adultosConvivientes[${index}].apellido`, e.target.value)}
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
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>
      <TextField
        fullWidth
        label="Edad Aproximada"
        type="number"
        value={adulto.edadAproximada || ''}
        onChange={(e) => handleInputChange(`adultosConvivientes[${index}].edadAproximada`, e.target.value)}
      />
      <TextField
        fullWidth
        label="DNI"
        type="number"
        value={adulto.dni || ''}
        onChange={(e) => handleInputChange(`adultosConvivientes[${index}].dni`, e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel>Situación DNI</InputLabel>
        <Select
          value={adulto.situacionDni || ''}
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
          value={adulto.genero || ''}
          onChange={(e) => handleInputChange(`adultosConvivientes[${index}].genero`, e.target.value)}
          label="Género"
        >
          <MenuItem value="MASCULINO">Masculino</MenuItem>
          <MenuItem value="FEMENINO">Femenino</MenuItem>
          <MenuItem value="OTRO">Otro</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={adulto.supuesto_autordv || false}
            onChange={(e) => handleInputChange(`adultosConvivientes[${index}].supuesto_autordv`, e.target.checked)}
          />
        }
        label="Supuesto autor DV"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={adulto.conviviente || false}
            onChange={(e) => handleInputChange(`adultosConvivientes[${index}].conviviente`, e.target.checked)}
          />
        }
        label="Conviviente"
      />
      <FormControlLabel
        control={
          <Switch
            checked={adulto.botonAntipanico || false}
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
        value={adulto.observaciones || ''}
        onChange={(e) => handleInputChange(`adultosConvivientes[${index}].observaciones`, e.target.value)}
      />
      <FormControlLabel
        control={
          <Switch
            checked={adulto.useDefaultLocalizacion || false}
            onChange={(e) => handleInputChange(`adultosConvivientes[${index}].useDefaultLocalizacion`, e.target.checked)}
          />
        }
        label="Usar localización de la demanda"
      />
      {!adulto.useDefaultLocalizacion && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {!adulto.useDefaultLocalizacion && (
  <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid item xs={12}>
      <Typography variant="subtitle1">Localización específica</Typography>
    </Grid>
    {renderLocalizacionFields(
      `adultosConvivientes[${index}].localizacion`,
      adulto.localizacion || {}, // Ensure safe access
      handleInputChange,
      barrios,
      localidades,
      cpcs
    )}
  </Grid>
)}

        </Grid>
      )}
    </Box>
  ))}
  <Button startIcon={<AddIcon />} onClick={addAdultoConviviente} sx={{ color: 'primary.main' }}>
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
                  <InputLabel>Categoría de Motivo</InputLabel>
                  <Select
                    value={vulneracion.categoria_motivo || ''}
                    onChange={(e) => handleInputChange(`vulneraciones[${index}].categoria_motivo`, e.target.value)}
                  >
                    {categoriaMotivos.map((motivo) => (
                      <MenuItem key={motivo.id} value={motivo.id}>
                        {motivo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
        
                  {/* Subcategoría */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Subcategoría</InputLabel>
                    <Select
                      value={vulneracion.categoria_submotivo || ''}
                      onChange={(e) =>
                        handleInputChange(`vulneraciones[${index}].categoria_submotivo`, e.target.value)
                      }
                      disabled={!vulneracion.categoria_motivo}
                    >
                      {categoriaSubmotivos
                        .filter((submotivo) => submotivo.motivo === vulneracion.categoria_motivo)
                        .map((submotivo) => (
                          <MenuItem key={submotivo.id} value={submotivo.id}>
                            {submotivo.nombre}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
        
                  {/* Gravedad de la Vulneración */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Gravedad de la Vulneración</InputLabel>
                    <Select
                      value={vulneracion.gravedad_vulneracion || ''}
                      onChange={(e) =>
                        handleInputChange(`vulneraciones[${index}].gravedad_vulneracion`, e.target.value)
                      }
                    >
                      {gravedadVulneraciones.map((gravedad) => (
                        <MenuItem key={gravedad.id} value={gravedad.id}>
                          {gravedad.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
        
                  {/* Urgencia de la Vulneración */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Urgencia de la Vulneración</InputLabel>
                    <Select
                      value={vulneracion.urgencia_vulneracion || ''}
                      onChange={(e) =>
                        handleInputChange(`vulneraciones[${index}].urgencia_vulneracion`, e.target.value)
                      }
                    >
                      {urgenciaVulneraciones.map((urgencia) => (
                        <MenuItem key={urgencia.id} value={urgencia.id}>
                          {urgencia.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
        
                  {/* NNyA */}
                  <FormControl fullWidth margin="normal">
  <InputLabel>NNyA</InputLabel>
  <Select
    value={vulneracion.nnya || ''}
    onChange={(e) => handleInputChange(`vulneraciones[${index}].nnya`, e.target.value)}
  >
    {formData.ninosAdolescentes.map((nino, index) => (
      <MenuItem key={nino.id} value={nino.id}>
        {`${nino.nombre} ${nino.apellido}`}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        
                  {/* Autor DV */}
                  <FormControl fullWidth margin="normal">
  <InputLabel>Autor DV</InputLabel>
  <Select
    value={vulneracion.autor_dv || ''}
    onChange={(e) => handleInputChange(`vulneraciones[${index}].autor_dv`, e.target.value)}
  >
    {formData.adultosConvivientes.map((adulto, index) => (
      <MenuItem key={adulto.id} value={adulto.id}>
        {`${adulto.nombre} ${adulto.apellido}`}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        
                  {/* Principal Demanda */}
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={vulneracion.principal_demanda || false}
                          onChange={(e) =>
                            handleInputChange(`vulneraciones[${index}].principal_demanda`, e.target.checked)
                          }
                        />
                      }
                      label="Principal Demanda"
                    />
        
                    {/* Transcurre en Actualidad */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={vulneracion.transcurre_actualidad || false}
                          onChange={(e) =>
                            handleInputChange(
                              `vulneraciones[${index}].transcurre_actualidad`,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Transcurre en Actualidad"
                    />
                  </Box>
                </Box>
              ))}
        
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  handleInputChange('vulneraciones', [
                    ...formData.vulneraciones,
                    { categoria_motivo: '', categoria_submotivo: '' },
                  ])
                }
                sx={{ mt: 2, color: 'primary.main' }}
              >
                Añadir otra vulneración
              </Button>
        
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
                Vulneraciones Añadidas: {formData.vulneraciones.length}
              </Typography>
            </Box>
          );
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
            case 5:
              return (
                <Box>
                  <Typography color="primary" sx={{ mb: 2 }}>
                    Condiciones de Vulnerabilidad
                  </Typography>
                  {formData.condicionesVulnerabilidad.map((condicion, index) => {
                    const isAdulto = condicion.persona.startsWith('adulto-');
                    const filteredCondiciones = isAdulto
                      ? condicionesVulnerabilidadAdultos
                      : condicionesVulnerabilidadNNyA;
            
                    return (
                      <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                        <Typography variant="h6" gutterBottom>
                          Condición de Vulnerabilidad {index + 1}
                        </Typography>
            
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Persona</InputLabel>
                          <Select
                            value={condicion.persona}
                            onChange={(e) => handleInputChange(`condicionesVulnerabilidad[${index}].persona`, e.target.value)}
                            label="Persona"
                          >
                            {formData.ninosAdolescentes.map((nino, ninoIndex) => (
                              <MenuItem key={`nino-${ninoIndex}`} value={`nino-${ninoIndex}`}>
                                {nino.nombre} {nino.apellido} (NNyA)
                              </MenuItem>
                            ))}
                            {formData.adultosConvivientes.map((adulto, adultoIndex) => (
                              <MenuItem key={`adulto-${adultoIndex}`} value={`adulto-${adultoIndex}`}>
                                {adulto.nombre} {adulto.apellido} (Adulto)
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
            
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Condición de Vulnerabilidad</InputLabel>
                          <Select
                            value={condicion.condicion_vulnerabilidad}
                            onChange={(e) =>
                              handleInputChange(`condicionesVulnerabilidad[${index}].condicion_vulnerabilidad`, e.target.value)
                            }
                            label="Condición de Vulnerabilidad"
                          >
                            {filteredCondiciones.map((cv) => (
                              <MenuItem key={cv.id} value={cv.id}>
                                {cv.nombre} - {cv.descripcion}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
            
                        <FormControl component="fieldset" margin="normal">
                          <Typography component="legend">¿Aplica esta condición?</Typography>
                          <RadioGroup
                            row
                            value={condicion.si_no ? 'si' : 'no'}
                            onChange={(e) =>
                              handleInputChange(`condicionesVulnerabilidad[${index}].si_no`, e.target.value === 'si')
                            }
                          >
                            <FormControlLabel value="si" control={<Radio />} label="Sí" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
            
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => removeCondicionVulnerabilidad(index)}
                          >
                            Eliminar Condición de Vulnerabilidad
                          </Button>
                        </Box>
                      </Box>
                    );
                  })}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addCondicionVulnerabilidad}
                    sx={{ color: 'primary.main', mt: 2 }}
                  >
                    Añadir otra Condición de Vulnerabilidad
                  </Button>
                </Box>
              );
            
    default:
      return null
  }

  
}

