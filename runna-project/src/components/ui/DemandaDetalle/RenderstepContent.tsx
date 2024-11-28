import React, { useEffect } from 'react'
import {
    Typography,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    ListItemText,
} from '@mui/material'
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
    usuariosExternos,
    demandaMotivoIntervencion,
    demanda,
    getMotivoIntervencion,
    currentMotivoIntervencion,
    localizacion,
}) => {
    useEffect(() => {
        if (localizacion) {
          handleInputChange('localizacion', {
            ...formData.localizacion,
            ...localizacion, // Merge fetched data
          });
        }
      }, [localizacion]);
      



    // Synchronize currentMotivoIntervencion into formData
    useEffect(() => {
        if (
            currentMotivoIntervencion &&
            formData.presuntaVulneracion.motivos !== currentMotivoIntervencion.id
        ) {
            handleInputChange(
                'presuntaVulneracion.motivos',
                currentMotivoIntervencion.id
            );
        }
    }, [currentMotivoIntervencion, formData.presuntaVulneracion.motivos, handleInputChange]);
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
  <Typography color="primary" sx={{ mt: 2, mb: 1 }}>
    Datos de Localización
  </Typography>
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
        // Other cases...
        default:
            return null
    }
}

