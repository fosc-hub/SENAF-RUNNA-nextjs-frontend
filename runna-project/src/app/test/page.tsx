'use client'

import React, { useState, useEffect } from 'react'
import { getDemands, createDemand } from '../../api/TableFunctions/demands'
import { getAll } from '../../api/services/apiService' // Generic fetcher for related data.

export default function LocalizacionPage() {
  const [localizacions, setLocalizacions] = useState<any[]>([])
  const [newLocalizacion, setNewLocalizacion] = useState<Record<string, any>>({})
  const [relatedData, setRelatedData] = useState<Record<string, { value: number; label: string }[]>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLocalizacions()
  }, [])

  const fetchLocalizacions = async () => {
    try {
      const fetchedLocalizacions = await getDemands()
      setLocalizacions(fetchedLocalizacions)

      if (fetchedLocalizacions.length > 0) {
        const initialLocalizacion = fetchedLocalizacions[0]
        setNewLocalizacion(inferDefaultValues(initialLocalizacion))

        // Detect numeric foreign keys and fetch related data
        for (const [key, value] of Object.entries(initialLocalizacion)) {
          if (typeof value === 'number' && key !== 'id') {
            fetchRelatedData(key)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching localizacions:', error)
      setError('Failed to fetch localizacions. Please try again later.')
    }
  }

  const fetchRelatedData = async (key: string) => {
    try {
      const data = await getAll(key) // Dynamically fetch related data based on key
      setRelatedData((prev) => ({
        ...prev,
        [key]: data.map((item: any) => ({ value: item.id, label: item.nombre || item.name })),
      }))
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
    }
  }

  const inferDefaultValues = (obj: Record<string, any>) => {
    const defaultValues: Record<string, any> = {}
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        defaultValues[key] = null
      } else if (typeof obj[key] === 'boolean') {
        defaultValues[key] = false
      } else {
        defaultValues[key] = ''
      }
    })
    return defaultValues
  }

  const handleInputChange = (name: string, value: any) => {
    setNewLocalizacion((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createDemand(newLocalizacion)
      fetchLocalizacions()
      resetForm()
    } catch (error) {
      console.error('Error creating localizacion:', error)
      setError('Failed to create localizacion. Please check your input and try again.')
    }
  }

  const resetForm = () => {
    if (localizacions.length > 0) {
      setNewLocalizacion(inferDefaultValues(localizacions[0]))
    } else {
      setNewLocalizacion({})
    }
  }

  const renderField = (key: string, value: any) => {
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

    return (
      <div key={key}>
        <label>{key}</label>
        <input
          type="text"
          name={key}
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Localizacion Management</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {Object.entries(newLocalizacion).map(([key, value]) => renderField(key, value))}
        <button type="submit" className="btn-primary">
          Create Localizacion
        </button>
      </form>

      <h2>Localizacions List</h2>
      <ul>
        {localizacions.map((localizacion, index) => (
          <li key={index}>
            {localizacion.calle} - {localizacion.tipo_calle}
          </li>
        ))}
      </ul>
    </div>
  )
}
