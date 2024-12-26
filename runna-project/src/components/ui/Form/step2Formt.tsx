import React from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Typography, Grid, FormControlLabel, Switch, Checkbox, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { FormField } from './FormField';
import { LocalizacionFields } from './LocalizacionFields';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale';

const adultoConvivienteSchema = z.object({
  nombre: z.string().nonempty('Este campo es obligatorio'),
  apellido: z.string().nonempty('Este campo es obligatorio'),
  fechaNacimiento: z.date().nullable(),
  edadAproximada: z.string().optional(),
  dni: z.string().optional(),
  situacionDni: z.string().nonempty('Este campo es obligatorio'),
  genero: z.string().nonempty('Este campo es obligatorio'),
  conviviente: z.boolean(),
  supuesto_autordv: z.boolean(),
  garantiza_proteccion: z.boolean(),
  botonAntipanico: z.boolean(),
  observaciones: z.string().optional(),
  useDefaultLocalizacion: z.boolean(),
  localizacion: z.object({
    // Add localizacion fields here
  }).optional(),
  vinculacion: z.object({
    vinculo: z.string().nonempty('Este campo es obligatorio'),
  }),
});

const adultosConvivientesSchema = z.array(adultoConvivienteSchema);

type AdultosConvivientesFormData = z.infer<typeof adultosConvivientesSchema>;

interface AdultosConvivientesFormProps {
  onSubmit: (data: AdultosConvivientesFormData) => void;
  apiData: any;
}

export const AdultosConvivientesForm: React.FC<AdultosConvivientesFormProps> = ({ onSubmit, apiData }) => {
  const { control, handleSubmit, watch, setValue } = useForm<{ adultosConvivientes: AdultosConvivientesFormData }>({
    resolver: zodResolver(z.object({ adultosConvivientes: adultosConvivientesSchema })),
    defaultValues: {
      adultosConvivientes: [{}],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "adultosConvivientes",
  });

  const addAdultoConviviente = () => {
    append({});
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data.adultosConvivientes))}>
      <Box>
        <Typography color="primary" sx={{ mb: 2 }}>Adultos convivientes</Typography>
        {fields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6" gutterBottom>
              Adulto Conviviente {index + 1}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormField
                  name={`adultosConvivientes.${index}.nombre`}
                  control={control}
                  label="Nombre"
                  type="text"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormField
                  name={`adultosConvivientes.${index}.apellido`}
                  control={control}
                  label="Apellido"
                  type="text"
                  required
                />
              </Grid>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <Controller
                name={`adultosConvivientes.${index}.fechaNacimiento`}
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
              name={`adultosConvivientes.${index}.edadAproximada`}
              control={control}
              label="Edad Aproximada"
              type="number"
            />

            <FormField
              name={`adultosConvivientes.${index}.dni`}
              control={control}
              label="DNI"
              type="number"
            />

            <FormField
              name={`adultosConvivientes.${index}.situacionDni`}
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
              name={`adultosConvivientes.${index}.genero`}
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

            <FormControlLabel
              control={
                <Controller
                  name={`adultosConvivientes.${index}.conviviente`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label="Conviviente"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Controller
                      name={`adultosConvivientes.${index}.supuesto_autordv`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(e) => {
                            onChange(e.target.checked);
                            if (e.target.checked) {
                              setValue(`adultosConvivientes.${index}.garantiza_proteccion`, false);
                            }
                          }}
                        />
                      )}
                    />
                  }
                  label="Supuesto Autor DV"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Controller
                      name={`adultosConvivientes.${index}.garantiza_proteccion`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(e) => {
                            onChange(e.target.checked);
                            if (e.target.checked) {
                              setValue(`adultosConvivientes.${index}.supuesto_autordv`, false);
                            }
                          }}
                        />
                      )}
                    />
                  }
                  label="Garantiza Protección"
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Controller
                  name={`adultosConvivientes.${index}.botonAntipanico`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label="Botón Antipánico"
            />

            <FormField
              name={`adultosConvivientes.${index}.observaciones`}
              control={control}
              label="Observaciones"
              type="text"
              multiline
              rows={4}
            />

            <FormControlLabel
              control={
                <Controller
                  name={`adultosConvivientes.${index}.useDefaultLocalizacion`}
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

            {!watch(`adultosConvivientes.${index}.useDefaultLocalizacion`) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Localización específica
                </Typography>
                <LocalizacionFields
                  control={control}
                  prefix={`adultosConvivientes.${index}.localizacion`}
                  apiData={apiData}
                />
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Vinculación con NNyA Principal</Typography>
              <FormField
                name={`adultosConvivientes.${index}.vinculacion.vinculo`}
                control={control}
                label="Vínculo con NNyA Principal"
                type="select"
                options={(apiData) => apiData.vinculoPersonas.map((vinculo) => ({ id: vinculo.id, label: vinculo.nombre }))}
                required
                apiData={apiData}
              />
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
    </form>
  );
};

