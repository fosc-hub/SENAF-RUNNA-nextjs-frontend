import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Typography,
  ListItemText,
} from '@mui/material';

interface FormFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  type: string;
  options?: { id: string | number; label: string }[] | ((apiData: any) => { id: string | number; label: string }[]);
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  apiData?: any;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  control,
  label,
  type,
  options,
  required,
  multiline,
  rows,
  apiData,
}) => {
  const getOptions = () => {
    if (typeof options === 'function') {
      return options(apiData);
    }
    return options || [];
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field, fieldState: { error } }) => {
        switch (type) {
          case 'text':
          case 'number':
          case 'date':
          case 'datetime-local':
            return (
              <TextField
                {...field}
                label={label}
                type={type}
                fullWidth
                error={!!error}
                helperText={error?.message}
                multiline={multiline}
                rows={rows}
              />
            );
          case 'select':
            return (
              <FormControl fullWidth error={!!error}>
                <InputLabel>{label}</InputLabel>
                <Select {...field} label={label}>
                  {getOptions().map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            );
          case 'multiselect':
            return (
              <FormControl fullWidth error={!!error}>
                <InputLabel>{label}</InputLabel>
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) return '';
                    return getOptions()
                      .filter((option) => selected.includes(option.id))
                      .map((option) => option.label)
                      .join(', ');
                  }}
                >
                  {getOptions().map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      <Checkbox checked={field.value?.includes(option.id)} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            );
          case 'checkbox':
            return (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={label}
              />
            );
          case 'switch':
            return (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label={label}
              />
            );
          case 'radio':
            return (
              <FormControl component="fieldset">
                <Typography component="legend">{label}</Typography>
                <RadioGroup {...field}>
                  {getOptions().map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          default:
            return null;
        }
      }}
    />
  );
};

