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
  FormHelperText,
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



const renderLocalizacionFields = (prefix, data = {}, handleInputChange, barrios, localidades, cpcs, errors = {}) => (
  <>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label={
          <>
            Calle <span style={{ color: "red" }}>*</span>
          </>
        }
        value={data.calle || ""} // Default to empty string if undefined
        onChange={(e) => handleInputChange(`${prefix}.calle`, e.target.value)}
        size="small"
        error={!!errors[`${prefix}.calle`]}
        helperText={errors[`${prefix}.calle`] ? "Este campo es obligatorio." : ""}
      />
    </Grid>
    <Grid item xs={6}>
      <FormControl fullWidth size="small" error={!!errors[`${prefix}.tipo_calle`]}>
        <InputLabel>
          Tipo de Calle <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={data.tipo_calle || "CALLE"} // Default to 'CALLE' if undefined
          onChange={(e) => handleInputChange(`${prefix}.tipo_calle`, e.target.value)}
          label="Tipo de Calle"
        >
          <MenuItem value="CALLE">CALLE</MenuItem>
          <MenuItem value="AVENIDA">AVENIDA</MenuItem>
          <MenuItem value="PASAJE">PASAJE</MenuItem>
          <MenuItem value="RUTA">RUTA</MenuItem>
          <MenuItem value="BOULEVARD">BOULEVARD</MenuItem>
          <MenuItem value="OTRO">OTRO</MenuItem>
        </Select>
        {errors[`${prefix}.tipo_calle`] && (
          <FormHelperText>Este campo es obligatorio.</FormHelperText>
        )}
      </FormControl>
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Piso/Depto"
        type="number"
        value={data.piso_depto || ""} // Default to empty string
        onChange={(e) => handleInputChange(`${prefix}.piso_depto`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Lote"
        type="number"
        value={data.lote || ""} // Default to empty string
        onChange={(e) => handleInputChange(`${prefix}.lote`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Manzana"
        type="number"
        value={data.mza || ""} // Default to empty string
        onChange={(e) => handleInputChange(`${prefix}.mza`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Número de Casa"
        type="number"
        value={data.casa_nro || ""} // Default to empty string
        onChange={(e) => handleInputChange(`${prefix}.casa_nro`, e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label={
          <>
            Referencia Geográfica <span style={{ color: "red" }}>*</span>
          </>
        }
        multiline
        rows={2}
        value={data.referencia_geo || ""} // Default to empty string
        onChange={(e) => handleInputChange(`${prefix}.referencia_geo`, e.target.value)}
        size="small"
        error={!!errors[`${prefix}.referencia_geo`]}
        helperText={
          errors[`${prefix}.referencia_geo`]
            ? "Este campo es obligatorio."
            : ""
        }
      />
    </Grid>
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>Barrio</InputLabel>
        <Select
          value={data.barrio || ""} // Default to empty string
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
      <FormControl fullWidth size="small" error={!!errors[`${prefix}.localidad`]}>
        <InputLabel>
          Localidad <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={data.localidad || ""} // Default to empty string
          onChange={(e) => handleInputChange(`${prefix}.localidad`, e.target.value)}
          label="Localidad"
        >
          {localidades.map((localidad) => (
            <MenuItem key={localidad.id} value={localidad.id}>
              {localidad.nombre}
            </MenuItem>
          ))}
        </Select>
        {errors[`${prefix}.localidad`] && (
          <FormHelperText>Este campo es obligatorio.</FormHelperText>
        )}
      </FormControl>
    </Grid>
    <Grid item xs={6}>
      <FormControl fullWidth size="small">
        <InputLabel>CPC</InputLabel>
        <Select
          value={data.cpc || ""} // Default to empty string
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

export const RenderStepContent = ({
  activeStep,
  formData,
  handleInputChange,
  addNinoAdolescente,
  addVulneraciontext,
  addAdultoConviviente,
  addAutor,
  informante,
  barrios,
  localidades,
  cpcs,
  motivosIntervencion,
  selectedMotivo,
  categoriaMotivos,
  categoriaSubmotivos,
  gravedadVulneraciones,
  urgenciaVulneraciones,
  condicionesVulnerabilidadNNyA,
  condicionesVulnerabilidadAdultos,
  addVulneracionApi,
  institucionesEducativas,
  institucionesSanitarias,
  addVinculacion,
  removeVinculacion,
  vinculoPersonas,
  addCondicionVulnerabilidad,
  removeCondicionVulnerabilidad,
  origenes,
  subOrigenes,
  institucionesDemanda,
  selectedInformante,
  localizacion,
  localizacionPersonas// Add localizacion here
}) => {

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

const handleBlur = (field) => {
  setTouched((prev) => ({ ...prev, [field]: true }));
};

  const validateFields = () => {
    const newErrors = {};
    if (!formData.fecha_y_hora_ingreso) newErrors.fecha_y_hora_ingreso = true;
    if (!formData.origen) newErrors.origen = true;
    if (!formData.sub_origen) newErrors.sub_origen = true;
    if (!formData.institucion) newErrors.institucion = true;
    if (!formData.presuntaVulneracion?.motivos)
      newErrors.presuntaVulneracion = { motivos: true };
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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
              label={
                <>
                  Fecha y hora de ingreso <span style={{ color: "red" }}>*</span>
                </>
              }
              value={formData.fecha_y_hora_ingreso}
              onChange={(newValue) =>
                handleInputChange("fecha_y_hora_ingreso", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  error={!!errors.fecha_y_hora_ingreso}
                  helperText={
                    errors.fecha_y_hora_ingreso ? "Este campo es obligatorio." : ""
                  }
                />
              )}
            />
          </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth size="small" error={!!errors.origen}>
      <InputLabel>
        Origen <span style={{ color: "red" }}>*</span>
      </InputLabel>
      <Select
        value={formData.origen || ""}
        onChange={(e) => handleInputChange("origen", e.target.value)}
        label="Origen"
      >
        {origenes.map((origen) => (
          <MenuItem key={origen.id} value={origen.id}>
            {origen.nombre}
          </MenuItem>
        ))}
      </Select>
      {errors.origen && (
        <FormHelperText>Este campo es obligatorio.</FormHelperText>
      )}
    </FormControl>


          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth size="small" error={!!errors.sub_origen}>
  <InputLabel>
    Sub Origen <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={formData.sub_origen || ""}
    onChange={(e) => handleInputChange("sub_origen", e.target.value)}
    label="Sub Origen"
  >
    {subOrigenes?.map((subOrigen) => (
      <MenuItem key={subOrigen.id} value={subOrigen.id}>
        {subOrigen.nombre}
      </MenuItem>
    )) || (
      <MenuItem value="" disabled>
        No data available
      </MenuItem>
    )}
  </Select>
  {errors.sub_origen && (
    <FormHelperText>Este campo es obligatorio.</FormHelperText>
  )}
</FormControl>

          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth size="small" error={!!errors.institucion}>
  <InputLabel>
    Institución <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={formData.institucion || ""}
    onChange={(e) => handleInputChange("institucion", e.target.value)}
    label="Institución"
  >
    {institucionesDemanda?.map((institucion) => (
      <MenuItem key={institucion.id} value={institucion.id}>
        {institucion.nombre}
      </MenuItem>
    )) || (
      <MenuItem value="" disabled>
        No data available
      </MenuItem>
    )}
  </Select>
  {errors.institucion && (
    <FormHelperText>Este campo es obligatorio.</FormHelperText>
  )}
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

          <FormControl
  fullWidth
  size="small"
  error={!!errors.presuntaVulneracion?.motivos}
>
  <InputLabel>
    Motivo de Intervención <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={formData.presuntaVulneracion?.motivos || selectedMotivo?.id || ""}
    onChange={(e) =>
      handleInputChange("presuntaVulneracion.motivos", e.target.value)
    }
    label="Motivo de Intervención"
  >
    {motivosIntervencion.map((motivo) => (
      <MenuItem key={motivo.id} value={motivo.id}>
        {motivo.nombre}
      </MenuItem>
    ))}
  </Select>
  {errors.presuntaVulneracion?.motivos && (
    <FormHelperText>Este campo es obligatorio.</FormHelperText>
  )}
</FormControl>

          </Grid>


          <Grid item xs={12}>
            <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Datos de Localización</Typography>
          </Grid>
          {renderLocalizacionFields('localizacion', formData.localizacion, handleInputChange, barrios, localidades, cpcs)}

          <Grid item xs={12}>
  <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Informante</Typography>
</Grid>
<Grid item xs={12}>
  <FormControlLabel
    control={
      <Switch
        checked={formData.createNewinformante}
        onChange={(e) => handleInputChange("createNewinformante", e.target.checked)}
      />
    }
    label="Crear nuevo Informante"
  />
</Grid>
{formData.createNewinformante ? (
  <>
    {/* Nombre */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        label={
          <>
            Nombre <span style={{ color: "red" }}>*</span>
          </>
        }
        value={formData.informante.nombre}
        onChange={(e) => handleInputChange("informante.nombre", e.target.value)}
        onBlur={() => handleBlur("informanteNombre")}
        size="small"
        error={touched.informanteNombre && !formData.informante.nombre}
        helperText={
          touched.informanteNombre && !formData.informante.nombre
            ? "Completa este campo"
            : ""
        }
      />
    </Grid>

    {/* Apellido */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        label={
          <>
            Apellido <span style={{ color: "red" }}>*</span>
          </>
        }
        value={formData.informante.apellido}
        onChange={(e) => handleInputChange("informante.apellido", e.target.value)}
        onBlur={() => handleBlur("informanteApellido")}
        size="small"
        error={touched.informanteApellido && !formData.informante.apellido}
        helperText={
          touched.informanteApellido && !formData.informante.apellido
            ? "Completa este campo"
            : ""
        }
      />
    </Grid>

    {/* Teléfono */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        label={
          <>
            Teléfono <span style={{ color: "red" }}>*</span>
          </>
        }
        type="number"
        value={formData.informante.telefono}
        onChange={(e) => handleInputChange("informante.telefono", e.target.value)}
        onBlur={() => handleBlur("informanteTelefono")}
        size="small"
        error={touched.informanteTelefono && !formData.informante.telefono}
        helperText={
          touched.informanteTelefono && !formData.informante.telefono
            ? "Completa este campo"
            : ""
        }
      />
    </Grid>

    {/* Email */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        label={
          <>
            Email <span style={{ color: "red" }}>*</span>
          </>
        }
        type="email"
        value={formData.informante.mail}
        onChange={(e) => handleInputChange("informante.mail", e.target.value)}
        onBlur={() => handleBlur("informanteMail")}
        size="small"
        error={touched.informanteMail && !formData.informante.mail}
        helperText={
          touched.informanteMail && !formData.informante.mail
            ? "Completa este campo"
            : ""
        }
      />
    </Grid>
  </>
) : (
  // Select Existing Informante
  <Grid item xs={12}>
<FormControl
  fullWidth
  size="small"
  error={touched.informante && !selectedInformante?.id} // Add error state
>
  <InputLabel>
    Informante <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={selectedInformante?.id || ""}
    onChange={(e) => handleInputChange("informante.id", e.target.value)}
    onBlur={() => handleBlur("informante")} // Mark the field as touched
    label="Informante"
  >
    {/* Add a placeholder option */}
    <MenuItem value="">
      <em>Seleccione un informante</em>
    </MenuItem>
    {informante.map((inf) => (
      <MenuItem key={inf.id} value={inf.id}>
        {`${inf.nombre} ${inf.apellido}`}
      </MenuItem>
    ))}
  </Select>
  {touched.informante && !selectedInformante?.id && (
    <FormHelperText>Este campo es obligatorio</FormHelperText>
  )}
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
          label={
            <>
              Nombre <span style={{ color: "red" }}>*</span>
            </>
          }
          value={nino.nombre}
          onChange={(e) =>
            handleInputChange(`ninosAdolescentes[${index}].nombre`, e.target.value)
          }
          onBlur={() => handleBlur(`ninosAdolescentes[${index}].nombre`)}
          size="small"
          error={touched[`ninosAdolescentes[${index}].nombre`] && !nino.nombre}
          helperText={
            touched[`ninosAdolescentes[${index}].nombre`] && !nino.nombre
              ? "Este campo es obligatorio"
              : ""
          }
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label={
            <>
              Apellido <span style={{ color: "red" }}>*</span>
            </>
          }
          value={nino.apellido}
          onChange={(e) =>
            handleInputChange(
              `ninosAdolescentes[${index}].apellido`,
              e.target.value
            )
          }
          onBlur={() => handleBlur(`ninosAdolescentes[${index}].apellido`)}
          size="small"
          error={touched[`ninosAdolescentes[${index}].apellido`] && !nino.apellido}
          helperText={
            touched[`ninosAdolescentes[${index}].apellido`] && !nino.apellido
              ? "Este campo es obligatorio"
              : ""
          }
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
    
    <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`ninosAdolescentes[${index}].situacionDni`] && !nino.situacionDni
        }
      >
        <InputLabel>
          Situación DNI <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={nino.situacionDni}
          onChange={(e) =>
            handleInputChange(
              `ninosAdolescentes[${index}].situacionDni`,
              e.target.value
            )
          }
          onBlur={() => handleBlur(`ninosAdolescentes[${index}].situacionDni`)}
          label="Situación DNI"
        >
          <MenuItem value="VALIDO">Válido</MenuItem>
          <MenuItem value="EN_TRAMITE">En Trámite</MenuItem>
          <MenuItem value="VENCIDO">Vencido</MenuItem>
          <MenuItem value="EXTRAVIADO">Extraviado</MenuItem>
          <MenuItem value="INEXISTENTE">Inexistente</MenuItem>
          <MenuItem value="OTRO">Otro</MenuItem>
        </Select>
        {touched[`ninosAdolescentes[${index}].situacionDni`] && !nino.situacionDni && (
          <FormHelperText>Este campo es obligatorio</FormHelperText>
        )}
      </FormControl>

    
      <FormControl
        fullWidth
        margin="normal"
        error={touched[`ninosAdolescentes[${index}].genero`] && !nino.genero}
      >
        <InputLabel>
          Género <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={nino.genero}
          onChange={(e) =>
            handleInputChange(`ninosAdolescentes[${index}].genero`, e.target.value)
          }
          onBlur={() => handleBlur(`ninosAdolescentes[${index}].genero`)}
          label="Género"
        >
          <MenuItem value="MASCULINO">Masculino</MenuItem>
          <MenuItem value="FEMENINO">Femenino</MenuItem>
          <MenuItem value="OTRO">Otro</MenuItem>
        </Select>
        {touched[`ninosAdolescentes[${index}].genero`] && !nino.genero && (
          <FormHelperText>Este campo es obligatorio</FormHelperText>
        )}
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
 {index !== 0 && (
        <FormControl
          fullWidth
          margin="normal"
          error={
            touched[`ninosAdolescentes[${index}].vinculacion.vinculo`] &&
            !nino.vinculacion?.vinculo
          }
        >
          <InputLabel>
          Vínculo con NNYA principal <span style={{ color: "red" }}>*</span>
          </InputLabel>
          <Select
            value={nino.vinculacion?.vinculo || ""}
            onChange={(e) =>
              handleInputChange(
                `ninosAdolescentes[${index}].vinculacion.vinculo`,
                e.target.value
              )
            }
            onBlur={() =>
              handleBlur(`ninosAdolescentes[${index}].vinculacion.vinculo`)
            }
            label="Vínculo"
          >
            {vinculoPersonas.map((vinculo) => (
              <MenuItem key={vinculo.id} value={vinculo.id}>
                {vinculo.nombre}
              </MenuItem>
            ))}
          </Select>
          {touched[`ninosAdolescentes[${index}].vinculacion.vinculo`] &&
            !nino.vinculacion?.vinculo && (
              <FormHelperText>Este campo es obligatorio</FormHelperText>
            )}
        </FormControl>
      )}
<FormControlLabel
  control={
    <Switch
      checked={nino.useDefaultLocalizacion}
      onChange={(e) => {
        const isChecked = e.target.checked;

        // Update the useDefaultLocalizacion in formData
        handleInputChange(`ninosAdolescentes[${index}].useDefaultLocalizacion`, isChecked);

        // Reset or clear the specific localización if using default
        if (isChecked) {
          handleInputChange(`ninosAdolescentes[${index}].localizacion`, {
            calle: '',
            tipo_calle: '',
            piso_depto: '',
            lote: '',
            mza: '',
            casa_nro: '',
            referencia_geo: '',
            barrio: '',
            localidad: '',
            cpc: '',
          });
        }
      }}
    />
  }
  label="Usar localización de la demanda"
/>
    
{!nino.useDefaultLocalizacion && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle1">Localización específica</Typography>
    {renderLocalizacionFields(
      `ninosAdolescentes[${index}].localizacion`,
      nino.localizacion || {}, // Pass default empty object if not set
      handleInputChange,
      barrios,
      localidades,
      cpcs,
      errors
    )}


        </Box>
      )}
    
                <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información Educativa</Typography>
                <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`ninosAdolescentes[${index}].educacion.institucion_educativa`] &&
          !nino.educacion?.institucion_educativa
        }
      >
        <InputLabel>
          Institución Educativa <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={nino.educacion?.institucion_educativa || ""}
          onChange={(e) =>
            handleInputChange(
              `ninosAdolescentes[${index}].educacion.institucion_educativa`,
              e.target.value
            )
          }
          onBlur={() =>
            handleBlur(`ninosAdolescentes[${index}].educacion.institucion_educativa`)
          }
          label="Institución Educativa"
        >
          {institucionesEducativas.map((institucion) => (
            <MenuItem key={institucion.id} value={institucion.id}>
              {institucion.nombre}
            </MenuItem>
          ))}
        </Select>
        {touched[`ninosAdolescentes[${index}].educacion.institucion_educativa`] &&
          !nino.educacion?.institucion_educativa && (
            <FormHelperText>Este campo es obligatorio</FormHelperText>
          )}
      </FormControl>
    
      <TextField
  fullWidth
  label={
    <>
      Curso <span style={{ color: "red" }}>*</span>
    </>
  }
  value={nino.educacion?.curso || ""}
  onChange={(e) =>
    handleInputChange(`ninosAdolescentes[${index}].educacion.curso`, e.target.value)
  }
  onBlur={() => handleBlur(`ninosAdolescentes[${index}].educacion.curso`)}
  margin="normal"
  error={touched[`ninosAdolescentes[${index}].educacion.curso`] && !nino.educacion?.curso}
  helperText={
    touched[`ninosAdolescentes[${index}].educacion.curso`] && !nino.educacion?.curso
      ? "Este campo es obligatorio"
      : ""
  }
/>
    
<FormControl
  fullWidth
  margin="normal"
  error={touched[`ninosAdolescentes[${index}].educacion.nivel`] && !nino.educacion?.nivel}
>
  <InputLabel>
    Nivel <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={nino.educacion?.nivel || ""}
    onChange={(e) =>
      handleInputChange(`ninosAdolescentes[${index}].educacion.nivel`, e.target.value)
    }
    onBlur={() => handleBlur(`ninosAdolescentes[${index}].educacion.nivel`)}
    label="Nivel"
  >
    <MenuItem value="PRIMARIO">Primario</MenuItem>
    <MenuItem value="SECUNDARIO">Secundario</MenuItem>
    <MenuItem value="TERCIARIO">Terciario</MenuItem>
    <MenuItem value="UNIVERSITARIO">Universitario</MenuItem>
    <MenuItem value="OTRO">Otro</MenuItem>
  </Select>
  {touched[`ninosAdolescentes[${index}].educacion.nivel`] && !nino.educacion?.nivel && (
    <FormHelperText>Este campo es obligatorio</FormHelperText>
  )}
</FormControl>
    
                <FormControl
  fullWidth
  margin="normal"
  error={touched[`ninosAdolescentes[${index}].educacion.turno`] && !nino.educacion?.turno}
>
  <InputLabel>
    Turno <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={nino.educacion?.turno || ""}
    onChange={(e) =>
      handleInputChange(`ninosAdolescentes[${index}].educacion.turno`, e.target.value)
    }
    onBlur={() => handleBlur(`ninosAdolescentes[${index}].educacion.turno`)}
    label="Turno"
  >
    <MenuItem value="MANIANA">Mañana</MenuItem>
    <MenuItem value="TARDE">Tarde</MenuItem>
    <MenuItem value="NOCHE">Noche</MenuItem>
    <MenuItem value="OTRO">Otro</MenuItem>
  </Select>
  {touched[`ninosAdolescentes[${index}].educacion.turno`] && !nino.educacion?.turno && (
    <FormHelperText>Este campo es obligatorio</FormHelperText>
  )}
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
                <FormControl
  fullWidth
  margin="normal"
  error={
    touched[`ninosAdolescentes[${index}].salud.institucion_sanitaria`] &&
    !nino.salud?.institucion_sanitaria
  }
>
  <InputLabel>
    Institución Sanitaria <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={nino.salud?.institucion_sanitaria || ""}
    onChange={(e) =>
      handleInputChange(
        `ninosAdolescentes[${index}].salud.institucion_sanitaria`,
        e.target.value
      )
    }
    onBlur={() =>
      handleBlur(`ninosAdolescentes[${index}].salud.institucion_sanitaria`)
    }
    label="Institución Sanitaria"
  >
    {institucionesSanitarias.map((institucion) => (
      <MenuItem key={institucion.id} value={institucion.id}>
        {institucion.nombre}
      </MenuItem>
    ))}
  </Select>
  {touched[`ninosAdolescentes[${index}].salud.institucion_sanitaria`] &&
    !nino.salud?.institucion_sanitaria && (
      <FormHelperText>Este campo es obligatorio</FormHelperText>
    )}
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
            label={
              <>
                Nombre <span style={{ color: "red" }}>*</span>
              </>
            }
            value={adulto.nombre}
            onChange={(e) =>
              handleInputChange(`adultosConvivientes[${index}].nombre`, e.target.value)
            }
            onBlur={() => handleBlur(`adultosConvivientes[${index}].nombre`)}
            margin="normal"
            error={touched[`adultosConvivientes[${index}].nombre`] && !adulto.nombre}
            helperText={
              touched[`adultosConvivientes[${index}].nombre`] && !adulto.nombre
                ? "Este campo es obligatorio"
                : ""
            }
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label={
              <>
                Apellido <span style={{ color: "red" }}>*</span>
              </>
            }
            value={adulto.apellido}
            onChange={(e) =>
              handleInputChange(`adultosConvivientes[${index}].apellido`, e.target.value)
            }
            onBlur={() => handleBlur(`adultosConvivientes[${index}].apellido`)}
            margin="normal"
            error={touched[`adultosConvivientes[${index}].apellido`] && !adulto.apellido}
            helperText={
              touched[`adultosConvivientes[${index}].apellido`] && !adulto.apellido
                ? "Este campo es obligatorio"
                : ""
            }
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
      
      <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`adultosConvivientes[${index}].situacionDni`] && !adulto.situacionDni
        }
      >
        <InputLabel>
          Situación DNI <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={adulto.situacionDni}
          onChange={(e) =>
            handleInputChange(
              `adultosConvivientes[${index}].situacionDni`,
              e.target.value
            )
          }
          onBlur={() => handleBlur(`adultosConvivientes[${index}].situacionDni`)}
          label="Situación DNI"
        >
          <MenuItem value="VALIDO">Válido</MenuItem>
          <MenuItem value="EN_TRAMITE">En Trámite</MenuItem>
          <MenuItem value="VENCIDO">Vencido</MenuItem>
          <MenuItem value="EXTRAVIADO">Extraviado</MenuItem>
          <MenuItem value="INEXISTENTE">Inexistente</MenuItem>
          <MenuItem value="OTRO">Otro</MenuItem>
        </Select>
        {touched[`adultosConvivientes[${index}].situacionDni`] && !adulto.situacionDni && (
          <FormHelperText>Este campo es obligatorio</FormHelperText>
        )}
      </FormControl>
      
      <FormControl
        fullWidth
        margin="normal"
        error={touched[`adultosConvivientes[${index}].genero`] && !adulto.genero}
      >
        <InputLabel>
          Género <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={adulto.genero}
          onChange={(e) =>
            handleInputChange(`adultosConvivientes[${index}].genero`, e.target.value)
          }
          onBlur={() => handleBlur(`adultosConvivientes[${index}].genero`)}
          label="Género"
        >
          <MenuItem value="MASCULINO">Masculino</MenuItem>
          <MenuItem value="FEMENINO">Femenino</MenuItem>
          <MenuItem value="OTRO">Otro</MenuItem>
        </Select>
        {touched[`adultosConvivientes[${index}].genero`] && !adulto.genero && (
          <FormHelperText>Este campo es obligatorio</FormHelperText>
        )}
      </FormControl>
    
      
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
                  <FormGroup row>
  <FormControlLabel
    control={
      <Checkbox
        checked={adulto.supuesto_autordv || false}
        onChange={(e) => {
          handleInputChange(`adultosConvivientes[${index}].supuesto_autordv`, e.target.checked);
          if (e.target.checked) {
            handleInputChange(`adultosConvivientes[${index}].garantiza_proteccion`, false);
          }
        }}
      />
    }
    label="Supuesto Autor DV"
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={adulto.garantiza_proteccion || false}
        onChange={(e) => {
          handleInputChange(`adultosConvivientes[${index}].garantiza_proteccion`, e.target.checked);
          if (e.target.checked) {
            handleInputChange(`adultosConvivientes[${index}].supuesto_autordv`, false);
          }
        }}
      />
    }
    label="Garantiza Protección"
  />
</FormGroup>
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
              <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Vinculación con NNyA Principal</Typography>
          <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`adultosConvivientes[${index}].vinculacion.vinculo`] &&
          !adulto.vinculacion?.vinculo
        }
      >
        <InputLabel>
          Vínculo con NNyA Principal <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={adulto.vinculacion?.vinculo || ""}
          onChange={(e) =>
            handleInputChange(
              `adultosConvivientes[${index}].vinculacion.vinculo`,
              e.target.value
            )
          }
          onBlur={() =>
            handleBlur(`adultosConvivientes[${index}].vinculacion.vinculo`)
          }
          label="Vínculo"
        >
          {vinculoPersonas.map((vinculo) => (
            <MenuItem key={vinculo.id} value={vinculo.id}>
              {vinculo.nombre}
            </MenuItem>
          ))}
        </Select>
        {touched[`adultosConvivientes[${index}].vinculacion.vinculo`] &&
          !adulto.vinculacion?.vinculo && (
            <FormHelperText>Este campo es obligatorio</FormHelperText>
          )}
      </FormControl>
        </Box>

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

              <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`vulneraciones[${index}].categoria_motivo`] &&
          !vulneracion.categoria_motivo
        }
      >
        <InputLabel>
          Categoría de Motivos <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={vulneracion.categoria_motivo}
          onChange={(e) =>
            handleInputChange(`vulneraciones[${index}].categoria_motivo`, e.target.value)
          }
          onBlur={() => handleBlur(`vulneraciones[${index}].categoria_motivo`)}
          label="Categoría de Motivos"
        >
          {categoriaMotivos.map((motivo) => (
            <MenuItem key={motivo.id} value={motivo.id}>
              {motivo.nombre}
            </MenuItem>
          ))}
        </Select>
        {touched[`vulneraciones[${index}].categoria_motivo`] &&
          !vulneracion.categoria_motivo && (
            <FormHelperText>Este campo es obligatorio</FormHelperText>
          )}
      </FormControl>


      <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`vulneraciones[${index}].categoria_submotivo`] &&
          !vulneracion.categoria_submotivo
        }
      >
        <InputLabel>
          Subcategoría <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={vulneracion.categoria_submotivo}
          onChange={(e) =>
            handleInputChange(
              `vulneraciones[${index}].categoria_submotivo`,
              e.target.value
            )
          }
          onBlur={() => handleBlur(`vulneraciones[${index}].categoria_submotivo`)}
          label="Subcategoría"
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
        {touched[`vulneraciones[${index}].categoria_submotivo`] &&
          !vulneracion.categoria_submotivo && (
            <FormHelperText>Este campo es obligatorio</FormHelperText>
          )}
      </FormControl>

      <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`vulneraciones[${index}].gravedad_vulneracion`] &&
          !vulneracion.gravedad_vulneracion
        }
      >
        <InputLabel>
          Gravedad de la Vulneración <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={vulneracion.gravedad_vulneracion}
          onChange={(e) =>
            handleInputChange(
              `vulneraciones[${index}].gravedad_vulneracion`,
              e.target.value
            )
          }
          onBlur={() => handleBlur(`vulneraciones[${index}].gravedad_vulneracion`)}
          label="Gravedad de la Vulneración"
        >
          {gravedadVulneraciones.map((gravedad) => (
            <MenuItem key={gravedad.id} value={gravedad.id}>
              {gravedad.nombre}
            </MenuItem>
          ))}
        </Select>
        {touched[`vulneraciones[${index}].gravedad_vulneracion`] &&
          !vulneracion.gravedad_vulneracion && (
            <FormHelperText>Este campo es obligatorio</FormHelperText>
          )}
      </FormControl>

      <FormControl
        fullWidth
        margin="normal"
        error={
          touched[`vulneraciones[${index}].urgencia_vulneracion`] &&
          !vulneracion.urgencia_vulneracion
        }
      >
        <InputLabel>
          Urgencia de la Vulneración <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          value={vulneracion.urgencia_vulneracion}
          onChange={(e) =>
            handleInputChange(
              `vulneraciones[${index}].urgencia_vulneracion`,
              e.target.value
            )
          }
          onBlur={() => handleBlur(`vulneraciones[${index}].urgencia_vulneracion`)}
          label="Urgencia de la Vulneración"
        >
          {urgenciaVulneraciones.map((urgencia) => (
            <MenuItem key={urgencia.id} value={urgencia.id}>
              {urgencia.nombre}
            </MenuItem>
          ))}
        </Select>
        {touched[`vulneraciones[${index}].urgencia_vulneracion`] &&
          !vulneracion.urgencia_vulneracion && (
            <FormHelperText>Este campo es obligatorio</FormHelperText>
          )}
      </FormControl>

      <FormControl
  fullWidth
  margin="normal"
  error={touched[`vulneraciones[${index}].nnya`] && (vulneracion.nnya === null || vulneracion.nnya === "")}
>
  <InputLabel>
    NNyA <span style={{ color: "red" }}>*</span>
  </InputLabel>
  <Select
    value={vulneracion.nnya ?? ""} // Ensure controlled value, handling null or undefined
    onChange={(e) =>
      handleInputChange(`vulneraciones[${index}].nnya`, e.target.value)
    }
    onBlur={() => handleBlur(`vulneraciones[${index}].nnya`)}
    label="NNyA"
  >
    <MenuItem value="">
      <em>Seleccione una opción</em>
    </MenuItem>
    {formData.ninosAdolescentes.map((nnya) => (
      <MenuItem key={nnya.id} value={nnya.id}>
        {`${nnya.nombre} ${nnya.apellido}`}
      </MenuItem>
    ))}
  </Select>
  {touched[`vulneraciones[${index}].nnya`] &&
    (vulneracion.nnya === null || vulneracion.nnya === "") && (
      <FormHelperText>Este campo es obligatorio</FormHelperText>
    )}
</FormControl>
<FormControl fullWidth margin="normal">
  <InputLabel>Autor DV</InputLabel>
  <Select
    value={vulneracion.autor_dv ?? ""} // Ensure controlled value, handling null or undefined
    onChange={(e) =>
      handleInputChange(`vulneraciones[${index}].autor_dv`, e.target.value)
    }
    onBlur={() => handleBlur(`vulneraciones[${index}].autor_dv`)}
    label="Autor DV"
  >
    <MenuItem value="">
      <em>Seleccione una opción</em>
    </MenuItem>
    {formData.adultosConvivientes.map((adulto) => (
      <MenuItem key={adulto.id} value={adulto.id}>
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
      <Typography color="primary" sx={{ mb: 2 }}>
        Condiciones de Vulnerabilidad
      </Typography>
      {formData.condicionesVulnerabilidad?.map((condicion, index) => {
const isAdulto = formData.adultosConvivientes.some((adulto) => adulto.id === condicion.persona);
const filteredCondiciones = isAdulto ? condicionesVulnerabilidadAdultos : condicionesVulnerabilidadNNyA;


        return (
          <Box
            key={index}
            sx={{
              mb: 4,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Condición de Vulnerabilidad {index + 1}
            </Typography>

            {/* Persona Selection */}
            <FormControl
              fullWidth
              margin="normal"
              error={
                touched[`condicionesVulnerabilidad[${index}].persona`] &&
                !condicion.persona
              }
            >
              <InputLabel>
                Persona <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <Select
                value={condicion.persona || ""}
                onChange={(e) =>
                  handleInputChange(
                    `condicionesVulnerabilidad[${index}].persona`,
                    e.target.value
                  )
                }
                onBlur={() =>
                  handleBlur(`condicionesVulnerabilidad[${index}].persona`)
                }
                label="Persona"
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {formData.ninosAdolescentes.map((nino) => (
                  <MenuItem key={nino.id} value={nino.id}>
                    {nino.nombre} {nino.apellido} (NNyA)
                  </MenuItem>
                ))}
                {formData.adultosConvivientes.map((adulto) => (
                  <MenuItem key={adulto.id} value={adulto.id}>
                    {adulto.nombre} {adulto.apellido} (Adulto)
                  </MenuItem>
                ))}
              </Select>
              {touched[`condicionesVulnerabilidad[${index}].persona`] &&
                !condicion.persona && (
                  <FormHelperText>Este campo es obligatorio</FormHelperText>
                )}
            </FormControl>

            {/* Condición de Vulnerabilidad Selection */}
            <FormControl
  fullWidth
  margin="normal"
  error={
    touched[`condicionesVulnerabilidad[${index}].condicion_vulnerabilidad`] &&
    !condicion.condicion_vulnerabilidad
  }
>
<InputLabel>
            Condición de Vulnerabilidad <span style={{ color: "red" }}>*</span>
          </InputLabel>
          <Select
            value={condicion.condicion_vulnerabilidad || ""}
            onChange={(e) =>
              handleInputChange(
                `condicionesVulnerabilidad[${index}].condicion_vulnerabilidad`,
                e.target.value
              )
            }
            onBlur={() =>
              handleBlur(
                `condicionesVulnerabilidad[${index}].condicion_vulnerabilidad`
              )
            }
            label="Condición de Vulnerabilidad"
          >
            <MenuItem value="">
              <em>Seleccione una opción</em>
            </MenuItem>
            {filteredCondiciones.map((cv) => (
              <MenuItem key={cv.id} value={cv.id}>
                {cv.nombre} - {cv.descripcion}
              </MenuItem>
            ))}
          </Select>
          {touched[`condicionesVulnerabilidad[${index}].condicion_vulnerabilidad`] &&
            !condicion.condicion_vulnerabilidad && (
              <FormHelperText>Este campo es obligatorio</FormHelperText>
            )}
        </FormControl>
      
                    <FormControl component="fieldset" margin="normal">
                      <Typography component="legend">¿Aplica esta condición?</Typography>
                      <RadioGroup
                        row
                        value={condicion.si_no ? 'si' : 'no'}
                        onChange={(e) => handleInputChange(`condicionesVulnerabilidad[${index}].si_no`, e.target.value === 'si')}
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
          )

      
    default:
      return null
  }
}

