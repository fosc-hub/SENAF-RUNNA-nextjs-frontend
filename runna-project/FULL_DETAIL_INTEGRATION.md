# Full-Detail Endpoint Integration

## Overview
This document describes the integration of the `full-detail` endpoint to handle previously saved indicator evaluations (`valoraciones_seleccionadas`) in the SENAF-RUNNA frontend application.

## Changes Made

### 1. API Layer - `demands.ts`
- **Added interface**: `TDemandaFullDetail` extends `TDemanda` with additional properties:
  - `valoraciones_seleccionadas`: Array of indicator evaluations with `indicador` (ID) and `checked` (boolean) status
  - `indicadores_valoracion`: Array of available indicators
  - `latest_evaluacion`, `scores`, `evaluaciones`, `demandas_vinculadas`, `actividades`, `respuestas`, etc.
- **Added function**: `getDemandFullDetail(id)` - Calls `${endpoint}/${id}/full-detail/` endpoint

### 2. EvaluacionesContent Component
- **Enhanced data fetching**: Primary attempt to fetch from `full-detail` endpoint, falls back to individual API calls
- **Improved state management**: Added `fullDetailData` state to store comprehensive demanda information
- **Better evaluation handling**: When `valoraciones_seleccionadas` is available, uses it to:
  - Pre-populate `selectedOptions` state with previously saved values (`checked: true` → `'yes'`, `checked: false` → `'no'`)
  - Display evaluation status in indicators table
- **Fallback compatibility**: Maintains backward compatibility with existing individual API calls

### 3. MainContent Component
- **Added full-detail support**: Imports and uses `getDemandFullDetail` and `TDemandaFullDetail`
- **Enhanced demand click handler**: When a demand is clicked, attempts to fetch full-detail data
- **State management**: Added `fullDetailData` state and proper cleanup in `handleCloseDetail`
- **Component integration**: Passes `fullDetailData` to `DemandaDetalle` component

### 4. DemandaDetalle Component
- **Updated interface**: Added optional `fullDetailData` parameter to component props
- **Future enhancement ready**: Component now accepts full-detail data for potential optimization

## Expected Payload Structure

Based on the provided example, the `full-detail` endpoint should return:

```json
{
  "id": 32,
  "latest_evaluacion": { /* evaluation data */ },
  "indicadores_valoracion": [
    {
      "id": 1,
      "nombre": "Indicator name",
      "descripcion": "Description",
      "peso": 3
    }
    // ... more indicators
  ],
  "valoraciones_seleccionadas": [
    {
      "indicador": 1,
      "checked": false
    },
    {
      "indicador": 10,
      "checked": true
    }
    // ... all indicators with their evaluation status
  ],
  "scores": [],
  "evaluaciones": [],
  "demandas_vinculadas": [],
  "actividades": [],
  "respuestas": [],
  // ... other standard demanda fields
}
```

## Benefits

1. **Performance**: Single API call instead of multiple requests for comprehensive data
2. **Previously saved values**: Automatically loads and displays previously selected indicator evaluations
3. **User experience**: No need to re-evaluate indicators that were already assessed
4. **Backward compatibility**: Falls back gracefully if full-detail endpoint is not available
5. **Extensibility**: Easy to add more comprehensive data to the full-detail response

## Error Handling

- If `full-detail` endpoint is not available, the application gracefully falls back to individual API calls
- Console logging provides clear indication of which data source is being used
- No breaking changes to existing functionality

## Future Enhancements

- Can extend `fullDetailData` usage to other components (DemandaDetalle, etc.)
- Can optimize other data fetching patterns using the comprehensive response
- Can reduce API call overhead across the application
