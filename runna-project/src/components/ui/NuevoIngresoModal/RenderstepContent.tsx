import React from 'react'
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
  addAdultoConviviente,
  addAutor,
  usuariosExternos,
  barrios,
  localidades,
  cpcs,
  motivosIntervencion,
  categoriaMotivos,
  filteredSubmotivos,
  gravedadVulneraciones,
  urgenciaVulneraciones,
  condicionesVulnerabilidad,
}) => {
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
              <FormControl fullWidth margin="normal">
            <InputLabel id="categoria-motivos-label">Categoría de Motivos</InputLabel>
            <Select
              labelId="categoria-motivos-label"
              multiple
              value={formData.presuntaVulneracion.categoriaMotivos}
              onChange={(e) => handleInputChange('presuntaVulneracion.categoriaMotivos', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={getCategoriaMotivosNombre(value, categoriaMotivos)} />
                  ))}
                </Box>
              )}
            >
              {categoriaMotivos.map((motivo) => (
                <MenuItem key={motivo.id} value={motivo.id}>
                  <Checkbox checked={formData.presuntaVulneracion.categoriaMotivos.indexOf(motivo.id) > -1} />
                  <ListItemText 
                    primary={motivo.nombre}
                    secondary={motivo.descripcion}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
              <InputLabel id="subcategorias-label">Subcategorías</InputLabel>
              <Select
                labelId="subcategorias-label"
                multiple
                value={formData.presuntaVulneracion.categoriaSubmotivos}
                onChange={(e) => handleInputChange('presuntaVulneracion.categoriaSubmotivos', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={filteredSubmotivos.find(sm => sm.id === value)?.nombre || 'Desconocido'} 
                      />
                    ))}
                  </Box>
                )}
              >
                {filteredSubmotivos.map((submotivo) => (
                  <MenuItem key={submotivo.id} value={submotivo.id}>
                    <Checkbox checked={formData.presuntaVulneracion.categoriaSubmotivos.indexOf(submotivo.id) > -1} />
                    <ListItemText 
                      primary={submotivo.nombre}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {getCategoriaMotivosNombre(submotivo.motivo, categoriaMotivos)}
                          </Typography>
                          <Typography variant="body2">{submotivo.descripcion}</Typography>
                        </>
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

