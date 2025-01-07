import React from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Typography, Grid, FormControlLabel, Switch, Button, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { FormField } from './FormField';
import { LocalizacionFields } from './LocalizacionFields';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale';

const vulneracionSchema = z.object({
  categoria_motivo: z.string().nonempty('Este campo es obligatorio'),
  categoria_submotivo: z.string().nonempty('Este campo es obligatorio'),
  gravedad_vulneracion: z.string().nonempty('Este campo es obligatorio'),
  urgencia_vulneracion: z.string().nonempty('Este campo es obligatorio'),
  autor_dv: z.string().optional(),
  principal_demanda: z.boolean(),
  transcurre_actualidad: z.boolean(),
});

const condicionVulnerabilidadSchema = z.object({
  condicion_vulnerabilidad: z.array(z.string()).nonempty('Seleccione al menos una condición de vulnerabilidad'),
});

const childAdolescentSchema = z.object({
  nombre: z.string().nonempty('Este campo es obligatorio'),
  apellido: z.string().nonempty('Este campo es obligatorio'),
  fechaNacimiento: z.date().nullable(),
  edadAproximada: z.string().optional(),
  dni: z.string().optional(),
  situacionDni: z.string().nonempty('Este campo es obligatorio'),
  genero: z.string().nonempty('Este campo es obligatorio'),
  observaciones: z.string().optional(),
  vinculacion: z.object({
    vinculo: z.string().optional(),
  }).optional(),
  useDefaultLocalizacion: z.boolean(),
  localizacion: z.object({
    tipo_calle: z.string().nonempty('Este campo es requerido'),
    calle: z.string().nonempty('Este campo es requerido'),
    piso_depto: z.string().optional(),
    lote: z.string().optional(),
    mza: z.string().optional(),
    casa_nro: z.string().optional(),
    referencia_geo: z.string().nonempty('Este campo es requerido'),
    barrio: z.string().optional(),
    localidad: z.string().nonempty('Este campo es requerido'),
    cpc: z.string().optional(),
  }).optional(),
  educacion: z.object({
    institucion_educativa: z.string().nonempty('Este campo es obligatorio'),
    curso: z.string().nonempty('Este campo es obligatorio'),
    nivel: z.string().nonempty('Este campo es obligatorio'),
    turno: z.string().nonempty('Este campo es obligatorio'),
    comentarios: z.string().optional(),
  }),
  salud: z.object({
    institucion_sanitaria: z.string().nonempty('Este campo es obligatorio'),
    observaciones: z.string().optional(),
  }),
  vulneraciones: z.array(vulneracionSchema),
  condicionesVulnerabilidad: condicionVulnerabilidadSchema,
});

const childrenAdolescentsSchema = z.array(childAdolescentSchema);

type ChildAdolescentFormData = z.infer<typeof childrenAdolescentsSchema>;

interface ChildAdolescentFormProps {
  onSubmit: (data: ChildAdolescentFormData) => void;
  apiData: any;
  adultosConvivientes: { id: string; nombre: string; apellido: string }[];
  initialData?: ChildAdolescentFormData;
}

export const ChildAdolescentForm: React.FC<ChildAdolescentFormProps> = ({ onSubmit, apiData, adultosConvivientes = [], initialData }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<{ ninosAdolescentes: ChildAdolescentFormData }>({
    resolver: zodResolver(z.object({ ninosAdolescentes: childrenAdolescentsSchema })),
    defaultValues: {
      ninosAdolescentes: initialData || [{ vulneraciones: [{}], condicionesVulnerabilidad: { condicion_vulnerabilidad: [] } }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "ninosAdolescentes",
  });

  const addNinoAdolescente = () => {
    append({ vulneraciones: [{}], condicionesVulnerabilidad: { condicion_vulnerabilidad: [] } });
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data.ninosAdolescentes))}>
      <Box>
        <Typography color="primary" sx={{ mb: 2 }}>Niñas, niños y adolescentes convivientes</Typography>
        {fields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6" gutterBottom>
              {index === 0 ? "Niño, Niña o Adolescente Principal" : `Niño, Niña o Adolescente ${index + 1}`}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormField
                  name={`ninosAdolescentes.${index}.nombre`}
                  control={control}
                  label="Nombre"
                  type="text"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormField
                  name={`ninosAdolescentes.${index}.apellido`}
                  control={control}
                  label="Apellido"
                  type="text"
                  required
                />
              </Grid>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <Controller
                name={`ninosAdolescentes.${index}.fechaNacimiento`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    renderInput={(params) => <FormField {...params} name={field.name} control={control} />}
                  />
                )}
              />
            </LocalizationProvider>

            <FormField
              name={`ninosAdolescentes.${index}.edadAproximada`}
              control={control}
              label="Edad Aproximada"
              type="number"
            />

            <FormField
              name={`ninosAdolescentes.${index}.dni`}
              control={control}
              label="DNI"
              type="number"
            />

            <FormField
              name={`ninosAdolescentes.${index}.situacionDni`}
              control={control}
              label="Situación DNI"
              type="select"
              options={[
                { id: "VALIDO", label: "Válido" },
                { id: "EN_TRAMITE", label: "En Trámite" },
                { id: "VENCIDO", label: "Vencido" },
                { id: "EXTRAVIADO", label: "Extraviado" },
                { id: "INEXISTENTE", label: "Inexistente" },
                { id: "OTRO", label: "Otro" },
              ]}
              required
            />

            <FormField
              name={`ninosAdolescentes.${index}.genero`}
              control={control}
              label="Género"
              type="select"
              options={[
                { id: "MASCULINO", label: "Masculino" },
                { id: "FEMENINO", label: "Femenino" },
                { id: "OTRO", label: "Otro" },
              ]}
              required
            />

            <FormField
              name={`ninosAdolescentes.${index}.observaciones`}
              control={control}
              label="Observaciones"
              type="text"
              multiline
              rows={4}
            />

            {index !== 0 && (
              <FormField
                name={`ninosAdolescentes.${index}.vinculacion.vinculo`}
                control={control}
                label="Vínculo con NNYA principal"
                type="select"
                options={(apiData) => apiData.vinculoPersonas.map((vinculo) => ({ id: vinculo.id, label: vinculo.nombre }))}
                required
                apiData={apiData}
              />
            )}

            <FormControlLabel
              control={
                <Controller
                  name={`ninosAdolescentes.${index}.useDefaultLocalizacion`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label="Usar localización de la demanda"
            />

            {!watch(`ninosAdolescentes.${index}.useDefaultLocalizacion`) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Localización específica
                </Typography>
                <LocalizacionFields
                  control={control}
                  prefix={`ninosAdolescentes.${index}.localizacion`}
                  apiData={apiData}
                  errors={errors.ninosAdolescentes?.[index]?.localizacion}
                />
              </Box>
            )}

            <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información Educativa</Typography>
            <FormField
              name={`ninosAdolescentes.${index}.educacion.institucion_educativa`}
              control={control}
              label="Institución Educativa"
              type="select"
              options={(apiData) => apiData.institucionesEducativas.map((institucion) => ({ id: institucion.id, label: institucion.nombre }))}
              required
              apiData={apiData}
            />

            <FormField
              name={`ninosAdolescentes.${index}.educacion.curso`}
              control={control}
              label="Curso"
              type="text"
              required
            />

            <FormField
              name={`ninosAdolescentes.${index}.educacion.nivel`}
              control={control}
              label="Nivel"
              type="select"
              options={[
                { id: "PRIMARIO", label: "Primario" },
                { id: "SECUNDARIO", label: "Secundario" },
                { id: "TERCIARIO", label: "Terciario" },
                { id: "UNIVERSITARIO", label: "Universitario" },
                { id: "OTRO", label: "Otro" },
              ]}
              required
            />

            <FormField
              name={`ninosAdolescentes.${index}.educacion.turno`}
              control={control}
              label="Turno"
              type="select"
              options={[
                { id: "MANIANA", label: "Mañana" },
                { id: "TARDE", label: "Tarde" },
                { id: "NOCHE", label: "Noche" },
                { id: "OTRO", label: "Otro" },
              ]}
              required
            />

            <FormField
              name={`ninosAdolescentes.${index}.educacion.comentarios`}
              control={control}
              label="Comentarios Educativos"
              type="text"
              multiline
              rows={2}
            />

            <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Información de Salud</Typography>
            <FormField
              name={`ninosAdolescentes.${index}.salud.institucion_sanitaria`}
              control={control}
              label="Institución Sanitaria"
              type="select"
              options={(apiData) => apiData.institucionesSanitarias.map((institucion) => ({ id: institucion.id, label: institucion.nombre }))}
              required
              apiData={apiData}
            />

            <FormField
              name={`ninosAdolescentes.${index}.salud.observaciones`}
              control={control}
              label="Observaciones de Salud"
              type="text"
              multiline
              rows={2}
            />

            <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Condiciones de Vulnerabilidad</Typography>
            <FormField
              name={`ninosAdolescentes.${index}.condicionesVulnerabilidad.condicion_vulnerabilidad`}
              control={control}
              label="Condiciones de Vulnerabilidad"
              type="multiselect"
              options={(apiData) => apiData.condicionesVulnerabilidadNNyA.map((cv) => ({ id: cv.id, label: `${cv.nombre} - ${cv.descripcion}` }))}
              required
              apiData={apiData}
            />

            <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Presunta Vulneración de Derechos informada</Typography>
            <Controller
              name={`ninosAdolescentes.${index}.vulneraciones`}
              control={control}
              render={({ field }) => (
                <>
                  {field.value.map((vulneracion, vulIndex) => (
                    <Box key={vulIndex} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                      <Typography variant="subtitle1" gutterBottom>Vulneración {vulIndex + 1}</Typography>

                      <FormField
                        name={`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.categoria_motivo`}
                        control={control}
                        label="Categoría de Motivos"
                        type="select"
                        options={(apiData) => apiData.categoriaMotivos.map((motivo) => ({ id: motivo.id, label: motivo.nombre }))}
                        required
                        apiData={apiData}
                      />

                      <FormField
                        name={`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.categoria_submotivo`}
                        control={control}
                        label="Subcategoría"
                        type="select"
                        options={(apiData) => apiData.categoriaSubmotivos
                          .filter((submotivo) => submotivo.motivo === watch(`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.categoria_motivo`))
                          .map((submotivo) => ({ id: submotivo.id, label: submotivo.nombre }))}
                        required
                        apiData={apiData}
                      />

                      <FormField
                        name={`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.gravedad_vulneracion`}
                        control={control}
                        label="Gravedad de la Vulneración"
                        type="select"
                        options={(apiData) => apiData.gravedadVulneraciones.map((gravedad) => ({ id: gravedad.id, label: gravedad.nombre }))}
                        required
                        apiData={apiData}
                      />

                      <FormField
                        name={`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.urgencia_vulneracion`}
                        control={control}
                        label="Urgencia de la Vulneración"
                        type="select"
                        options={(apiData) => apiData.urgenciaVulneraciones.map((urgencia) => ({ id: urgencia.id, label: urgencia.nombre }))}
                        required
                        apiData={apiData}
                      />

                      <FormField
                        name={`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.autor_dv`}
                        control={control}
                        label="Autor DV"
                        type="select"
                        options={adultosConvivientes.length > 0
                          ? adultosConvivientes.map((adulto) => ({ id: adulto.id, label: `${adulto.nombre} ${adulto.apellido}` }))
                          : [{ id: '', label: 'No hay adultos convivientes registrados' }]
                        }
                      />

                      <FormControlLabel
                        control={
                          <Controller
                            name={`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.principal_demanda`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                              />
                            )}
                          />
                        }
                        label="Principal Demanda"
                      />

                      <FormControlLabel
                        control={
                          <Controller
                            name={`ninosAdolescentes.${index}.vulneraciones.${vulIndex}.transcurre_actualidad`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                              />
                            )}
                          />
                        }
                        label="Transcurre Actualidad"
                      />
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => field.onChange([...field.value, {}])}
                    sx={{ mt: 1, color: 'primary.main' }}
                  >
                    Añadir otra vulneración
                  </Button>
                </>
              )}
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
    </form>
  );
};

