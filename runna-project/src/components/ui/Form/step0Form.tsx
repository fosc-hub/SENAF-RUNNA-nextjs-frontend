import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Grid, Typography, FormControlLabel, Switch } from '@mui/material';
import { FormField } from './FormField';
import { LocalizacionFields } from './LocalizacionFields';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { es } from 'date-fns/locale';

const step0Schema = z.object({
  fecha_y_hora_ingreso: z.date().nullable(),
  origen: z.string().nonempty('Este campo es requerido'),
  sub_origen: z.string().nonempty('Este campo es requerido'),
  institucion: z.string().nonempty('Este campo es requerido'),
  nro_notificacion_102: z.string().optional(),
  nro_sac: z.string().optional(),
  nro_suac: z.string().optional(),
  nro_historia_clinica: z.string().optional(),
  nro_oficio_web: z.string().optional(),
  descripcion: z.string().optional(),
  presuntaVulneracion: z.object({
    motivos: z.string().nonempty('Este campo es requerido'),
  }),
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
  }),
  createNewUsuarioExterno: z.boolean(),
  usuarioExterno: z.object({
    id: z.string().optional(),
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    telefono: z.string().optional(),
    mail: z.string().email().optional(),
  }),
});

type Step0FormData = z.infer<typeof step0Schema>;

interface Step0FormProps {
  onSubmit: (data: Step0FormData) => void;
  apiData: any;
  initialData?: Step0FormData;
}

export const Step0Form: React.FC<Step0FormProps> = ({ onSubmit, apiData, initialData }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<Step0FormData>({
    resolver: zodResolver(step0Schema),
    defaultValues: initialData || {
      fecha_y_hora_ingreso: null,
      origen: '',
      sub_origen: '',
      institucion: '',
      nro_notificacion_102: '',
      nro_sac: '',
      nro_suac: '',
      nro_historia_clinica: '',
      nro_oficio_web: '',
      descripcion: '',
      presuntaVulneracion: { motivos: '' },
      localizacion: {
        tipo_calle: '',
        calle: '',
        piso_depto: '',
        lote: '',
        mza: '',
        casa_nro: '',
        referencia_geo: '',
        barrio: '',
        localidad: '',
        cpc: '',
      },
      createNewUsuarioExterno: false,
      usuarioExterno: {
        id: '',
        nombre: '',
        apellido: '',
        telefono: '',
        mail: '',
      },
    },
  });

  const createNewUsuarioExterno = watch('createNewUsuarioExterno');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Controller
              name="fecha_y_hora_ingreso"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  {...field}
                  label="Fecha y hora de ingreso *"
                  renderInput={(params) => (
                    <FormField
                      {...params}
                      name="fecha_y_hora_ingreso"
                      control={control}
                      label="Fecha y hora de ingreso"
                      type="text"
                      required
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <FormField
            name="origen"
            control={control}
            label="Origen"
            type="select"
            options={(apiData) => apiData.origenes.map((origen) => ({ id: origen.id, label: origen.nombre }))}
            required
            apiData={apiData}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            name="sub_origen"
            control={control}
            label="Sub Origen"
            type="select"
            options={(apiData) => apiData.subOrigenes.map((subOrigen) => ({ id: subOrigen.id, label: subOrigen.nombre }))}
            required
            apiData={apiData}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            name="institucion"
            control={control}
            label="Institución"
            type="select"
            options={(apiData) => apiData.institucionesDemanda.map((institucion) => ({ id: institucion.id, label: institucion.nombre }))}
            required
            apiData={apiData}
          />
        </Grid>
        <Grid item xs={6}>
          <FormField
            name="nro_notificacion_102"
            control={control}
            label="Nro. Notificación 102"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <FormField
            name="nro_sac"
            control={control}
            label="Nro. SAC"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <FormField
            name="nro_suac"
            control={control}
            label="Nro. SUAC"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <FormField
            name="nro_historia_clinica"
            control={control}
            label="Nro. Historia Clínica"
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            name="nro_oficio_web"
            control={control}
            label="Nro. Oficio Web"
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            name="descripcion"
            control={control}
            label="Descripción"
            type="text"
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            name="presuntaVulneracion.motivos"
            control={control}
            label="Motivo de Intervención"
            type="select"
            options={(apiData) => apiData.motivosIntervencion.map((motivo) => ({ id: motivo.id, label: motivo.nombre }))}
            required
            apiData={apiData}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Datos de Localización</Typography>
        </Grid>
        <LocalizacionFields control={control} prefix="localizacion" apiData={apiData} errors={errors} />
        <Grid item xs={12}>
          <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Informante</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Controller
                name="createNewUsuarioExterno"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Crear nuevo Informante"
          />
        </Grid>
        {createNewUsuarioExterno ? (
          <>
            <Grid item xs={6}>
              <FormField
                name="usuarioExterno.nombre"
                control={control}
                label="Nombre"
                type="text"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                name="usuarioExterno.apellido"
                control={control}
                label="Apellido"
                type="text"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                name="usuarioExterno.telefono"
                control={control}
                label="Teléfono"
                type="text"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                name="usuarioExterno.mail"
                control={control}
                label="Email"
                type="email"
                required
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <FormField
              name="usuarioExterno.id"
              control={control}
              label="Informante"
              type="select"
              options={(apiData) => apiData.usuariosExternos.map((usuario) => ({ id: usuario.id, label: `${usuario.nombre} ${usuario.apellido}` }))}
              required
              apiData={apiData}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};

