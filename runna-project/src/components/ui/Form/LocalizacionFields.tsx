import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Control } from 'react-hook-form';
import { FormField } from './FormField';

interface LocalizacionFieldsProps {
  control: Control<any>;
  prefix: string;
  apiData: any;
  errors: Record<string, any>;
}

export const LocalizacionFields: React.FC<LocalizacionFieldsProps> = ({ control, prefix, apiData, errors }) => {
  return (
    <>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.calle`}
          control={control}
          label="Calle"
          type="text"
          required
          error={!!errors[`${prefix}.calle`]}
          helperText={errors[`${prefix}.calle`]?.message}
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.tipo_calle`}
          control={control}
          label="Tipo de Calle"
          type="select"
          options={[
            { id: "CALLE", label: "CALLE" },
            { id: "AVENIDA", label: "AVENIDA" },
            { id: "PASAJE", label: "PASAJE" },
          ]}
          required
          error={!!errors[`${prefix}.tipo_calle`]}
          helperText={errors[`${prefix}.tipo_calle`]?.message}
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.piso_depto`}
          control={control}
          label="Piso/Depto"
          type="number"
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.lote`}
          control={control}
          label="Lote"
          type="number"
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.mza`}
          control={control}
          label="Manzana"
          type="number"
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.casa_nro`}
          control={control}
          label="Número de Casa"
          type="number"
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          name={`${prefix}.referencia_geo`}
          control={control}
          label="Referencia Geográfica"
          type="text"
          multiline
          rows={2}
          required
          error={!!errors[`${prefix}.referencia_geo`]}
          helperText={errors[`${prefix}.referencia_geo`]?.message}
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.barrio`}
          control={control}
          label="Barrio"
          type="select"
          options={(apiData) => apiData.barrios.map((barrio) => ({ id: barrio.id, label: barrio.nombre }))}
          apiData={apiData}
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.localidad`}
          control={control}
          label="Localidad"
          type="select"
          options={(apiData) => apiData.localidades.map((localidad) => ({ id: localidad.id, label: localidad.nombre }))}
          required
          apiData={apiData}
          error={!!errors[`${prefix}.localidad`]}
          helperText={errors[`${prefix}.localidad`]?.message}
        />
      </Grid>
      <Grid item xs={6}>
        <FormField
          name={`${prefix}.cpc`}
          control={control}
          label="CPC"
          type="select"
          options={(apiData) => apiData.cpcs.map((cpc) => ({ id: cpc.id, label: cpc.nombre }))}
          apiData={apiData}
        />
      </Grid>
    </>
  );
};

