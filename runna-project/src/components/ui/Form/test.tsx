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
    // Add localizacion fields here
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
});

const childrenAdolescentsSchema = z.array(childAdolescentSchema);

type ChildAdolescentFormData = z.infer<typeof childrenAdolescentsSchema>;

interface ChildAdolescentFormProps {
  onSubmit: (data: ChildAdolescentFormData) => void;
  apiData: any;
}

export const ChildAdolescentForm: React.FC<ChildAdolescentFormProps> = ({ onSubmit, apiData }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<{ ninosAdolescentes: ChildAdolescentFormData }>({
    resolver: zodResolver(z.object({ ninosAdolescentes: childrenAdolescentsSchema })),
    defaultValues: {
      ninosAdolescentes: [{ vulneraciones: [{}] }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "ninosAdolescentes",
  });

  const addNinoAdolescente = () => {
    append({ vulneraciones: [{}] });
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

            {/* Existing fields */}
            {/* ... */}

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
                        options={(apiData) => apiData.adultosConvivientes.map((adulto, adultoIndex) => ({ id: adultoIndex.toString(), label: `${adulto.nombre} ${adulto.apellido}` }))}
                        apiData={apiData}
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

