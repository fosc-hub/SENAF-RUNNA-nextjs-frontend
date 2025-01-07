import React from "react";
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
  Box,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";

/**
 * Render form fields dynamically based on the provided field configuration.
 * @param {Object} fields - The configuration for form fields.
 * @param {Object} formData - Current form data state.
 * @param {Function} handleInputChange - Function to handle input changes.
 * @param {Object} errors - Validation errors.
 * @param {Function} handleBlur - Function to handle blur events (optional).
 */
export function renderFormFields(
  fields,
  formData,
  handleInputChange,
  errors = {},
  handleBlur = () => {},
  apiData,
) {
  return Object.entries(fields).map(([key, field]) => {
    if (field.type === "text" || field.type === "number" || field.type === "date" || field.type === "datetime-local") {
      return (
        <TextField
          key={key}
          fullWidth
          label={field.label}
          type={field.type}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          onBlur={() => handleBlur(field.name)}
          error={!!errors[field.name]}
          helperText={errors[field.name] || ""}
          margin="normal"
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <TextField
          key={key}
          fullWidth
          label={field.label}
          multiline
          rows={field.rows || 2}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          onBlur={() => handleBlur(field.name)}
          error={!!errors[field.name]}
          helperText={errors[field.name] || ""}
          margin="normal"
        />
      );
    }

    if (field.type === 'select') {
      const options = typeof field.options === 'function' ? field.options(apiData) : field.options;
    
      return (
        <FormControl key={key} fullWidth margin="normal" error={!!errors[field.name]}>
        <InputLabel>{field.label}</InputLabel>
        <Select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
        >
            {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
        {!!errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
    </FormControl>
      );
    }
    if (field.type === "multiselect") {
      const options =
        typeof field.options === "function" ? field.options(apiData) : field.options;

      // Para asegurarnos de que sea array al menos
      const value = Array.isArray(formData[field.name])
        ? formData[field.name]
        : [];

      return (
        <FormControl
          key={key}
          fullWidth
          margin="normal"
          error={!!errors[field.name]}
        >
          <InputLabel>{field.label}</InputLabel>
          <Select
            name={field.name}
            multiple
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            renderValue={(selected) => {
              // selected es un array de IDs, usamos su label
              // para mostrarlo en la "etiqueta" del Select
              if (!selected.length) return "";
              const labels = selected.map(
                (val) => options.find((opt) => opt.id === val)?.label || val
              );
              return labels.join(", ");
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Checkbox checked={value.includes(option.id)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
          {!!errors[field.name] && (
            <FormHelperText>{errors[field.name]}</FormHelperText>
          )}
        </FormControl>
      );
    }
    if (field.type === "checkbox") {
      return (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={!!formData[field.name]}
              onChange={(e) =>
                handleInputChange(field.name, e.target.checked)
              }
              name={field.name}
            />
          }
          label={field.label}
        />
      );
    }

    if (field.type === "switch") {
      return (
        <FormControlLabel
          key={key}
          control={
            <Switch
              checked={!!formData[field.name]}
              onChange={(e) =>
                handleInputChange(field.name, e.target.checked)
              }
              name={field.name}
            />
          }
          label={field.label}
        />
      );
    }

    if (field.type === "radio") {
      return (
        <FormControl component="fieldset" margin="normal" key={key}>
          <Typography component="legend">{field.label}</Typography>
          <RadioGroup
            row
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          >
            {field.options.map((option) => (
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
    }

    // Recursively render nested objects
    if (typeof field === "object" && !field.type) {
      return (
        <Box key={key} sx={{ mb: 2, pl: 2, borderLeft: "2px solid #ccc" }}>
          <Typography variant="subtitle1" gutterBottom>
            {key}
          </Typography>
          {renderFormFields(field, formData[key] || {}, (name, value) => {
            const updatedData = { ...formData, [key]: { ...formData[key], [name]: value } };
            handleInputChange(updatedData);
          }, errors[key] || {}, handleBlur)}
        </Box>
      );
    }

    return null;
  });
}
