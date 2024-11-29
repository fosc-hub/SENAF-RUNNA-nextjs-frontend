'use client'

import React, { useState, useEffect } from 'react'
import { getDemands, createDemand } from '../../api/TableFunctions/demands'
import { getAll } from '../../api/services/apiService' // Generic fetcher for related data.
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import TextField from '@mui/material/TextField';

export default function DemandasPage() {
  const [demandas, setDemandas] = useState<any[]>([])
  const [newDemanda, setNewDemanda] = useState<Record<string, any>>({})
  const [relatedData, setRelatedData] = useState<Record<string, { value: number; label: string }[]>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDemandas()
  }, [])

  const fetchDemandas = async () => {
    try {
      const fetchedDemandas = await getDemands()
      setDemandas(fetchedDemandas)

      if (fetchedDemandas.length > 0) {
        const initialDemanda = fetchedDemandas[0]
        setNewDemanda(inferDefaultValues(initialDemanda))

        for (const [key, value] of Object.entries(initialDemanda)) {
          if (typeof value === 'number' && key !== 'id') {
            fetchRelatedData(key)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching demandas:', error)
      setError('Failed to fetch demandas. Please try again later.')
    }
  }

  const fetchRelatedData = async (key: string) => {
    try {
      const formattedKey = key.replace(/_/g, '-'); // Adjust to match endpoint naming
      const data = await getAll(formattedKey);
      setRelatedData((prev) => ({
        ...prev,
        [key]: data.map((item: any) => ({
          value: item.id,
          label: item.nombre || item.name || item.calle || item.direccion || `ID: ${item.id}`,
        })),
      }))
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
    }
  }

  const inferDefaultValues = (obj: Record<string, any>) => {
    const defaultValues: Record<string, any> = {}
    Object.keys(obj).forEach((key) => {
      if (key === 'fecha_y_hora_ingreso' || key === 'ultima_actualizacion') {
        defaultValues[key] = key === 'fecha_y_hora_ingreso' ? '' : new Date().toISOString()
      } else if (typeof obj[key] === 'boolean') {
        defaultValues[key] = false
      } else if (typeof obj[key] === 'number') {
        defaultValues[key] = key.startsWith('nro_') ? -9223372036854776000 : 0
      } else {
        defaultValues[key] = ''
      }
    })
    return defaultValues
  }

  const handleInputChange = (name: string, value: any) => {
    setNewDemanda((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const payload = {
        ...newDemanda,
        ultima_actualizacion: new Date().toISOString(), // Automatically set current date and time
        localizacion: newDemanda.localizacion || undefined, // Ensure `null` is converted to `undefined`
        usuario_externo: newDemanda.usuario_externo || undefined, // Same here
      }

      await createDemand(payload)
      fetchDemandas()
      resetForm()
    } catch (error) {
      console.error('Error creating demanda:', error)
      setError('Failed to create demanda. Please check your input and try again.')
    }
  }

  const resetForm = () => {
    if (demandas.length > 0) {
      setNewDemanda(inferDefaultValues(demandas[0]))
    } else {
      setNewDemanda({})
    }
  }

  const renderField = (key: string, value: any) => {
    if (key === 'fecha_y_hora_ingreso') {
      const dateValue = value ? new Date(value) : null;

      const handleDateTimeChange = (newDate: Date | null, newTime: Date | null) => {
        if (newDate) {
          const updatedDate = new Date(newDate);
          if (newTime) {
            updatedDate.setHours(newTime.getHours(), newTime.getMinutes());
          }
          handleInputChange(key, updatedDate.toISOString());
        }
      };

      return (
        <LocalizationProvider dateAdapter={AdapterDateFns} key={key}>
          <div>
            <label>{key}</label>
            <DatePicker
              label="Fecha de Ingreso"
              value={dateValue}
              onChange={(newDate) => handleDateTimeChange(newDate, dateValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="Hora de Ingreso"
              value={dateValue}
              onChange={(newTime) => handleDateTimeChange(dateValue, newTime)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>
      )
    }

    if (relatedData[key]) {
      return (
        <div key={key}>
          <label>{key}</label>
          <select value={value} onChange={(e) => handleInputChange(key, Number(e.target.value))}>
            <option value="">Select {key}</option>
            {relatedData[key].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <div key={key}>
          <label>{key}</label>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleInputChange(key, e.target.checked)}
          />
        </div>
      )
    }

    if (key === 'ultima_actualizacion') {
      return null; // Don't render this field
    }

    return (
      <div key={key}>
        <label>{key}</label>
        <input
          type={typeof value === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) =>
            handleInputChange(key, typeof value === 'number' ? Number(e.target.value) : e.target.value)
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demandas Management</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {Object.entries(newDemanda).map(([key, value]) => renderField(key, value))}
        <button type="submit" className="btn-primary">
          Create Demanda
        </button>
      </form>

      <h2>Demandas List</h2>
      <ul>
        {demandas.map((demanda, index) => (
          <li key={index}>
            {demanda.title || demanda.id} - {demanda.fecha_creacion}
          </li>
        ))}
      </ul>
    </div>
  )
}
