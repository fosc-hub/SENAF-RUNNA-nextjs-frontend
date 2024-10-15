import React, { useState } from 'react'
import { X } from 'lucide-react'

const RadioGroup = ({ label, name, options, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
    <div className="flex space-x-4">
      {options.map((option) => (
        <label key={option} className="inline-flex items-center">
          <input type="radio" className="form-radio" name={name} value={option} onChange={onChange} />
          <span className="ml-2 text-gray-900">{option}</span>
        </label>
      ))}
    </div>
  </div>
)

const TextArea = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      rows="3"
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md text-gray-900"
      value={value}
      onChange={onChange}
    />
  </div>
)

export default function EvaluacionModal({ isOpen, onClose, demanda }) {
  const [formData, setFormData] = useState({
    informacionVeridica: '',
    informacionCorroborada: '',
    actividadesVeridicas: '',
    actividadesCorroboradas: '',
    gravedadSituacion: '',
    urgenciaSituacion: '',
    aperturaLegajo: '',
    accionesMPIMPE: '',
    archivarCaso: '',
    rechazarCaso: '',
    comentarios: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // Here you would handle the form submission
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Estás a punto de evaluar el siguiente caso:</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 p-4 border border-red-200 rounded-md bg-red-50">
          <span className="text-red-600 font-semibold mr-2">URGENTE</span>
          <span className="text-gray-900">{demanda.nombre}</span>
          <span className="ml-2 text-gray-700">{demanda.dni}</span>
          <span className="ml-2 text-gray-700">{demanda.fecha}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sobre los Datos del caso</h3>
            <RadioGroup
              label="1. La información es verídica?"
              name="informacionVeridica"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="2. La información fue corroborada?"
              name="informacionCorroborada"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
          </div>

          <hr className="border-gray-200" />

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sobre las Actividades Registradas</h3>
            <RadioGroup
              label="1. La información es verídica?"
              name="actividadesVeridicas"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="2. La información fue corroborada?"
              name="actividadesCorroboradas"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
          </div>

          <hr className="border-gray-200" />

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Valoración del Caso</h3>
            <RadioGroup
              label="1. Gravedad de la situación"
              name="gravedadSituacion"
              options={['Baja', 'Media', 'Alta']}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="2. Urgencia de la situación"
              name="urgenciaSituacion"
              options={['Baja', 'Media', 'Alta']}
              onChange={handleInputChange}
            />
          </div>

          <hr className="border-gray-200" />

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones que considera necesarias</h3>
            <RadioGroup
              label="1. Apertura de legajo"
              name="aperturaLegajo"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
            <TextArea
              label="Motivos"
              name="motivosAperturaLegajo"
              value={formData.motivosAperturaLegajo}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="2. Acciones MPI / MPE"
              name="accionesMPIMPE"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
            <TextArea
              label="Motivos"
              name="motivosAccionesMPIMPE"
              value={formData.motivosAccionesMPIMPE}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="3. Archivar el caso"
              name="archivarCaso"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
            <TextArea
              label="Motivos"
              name="motivosArchivarCaso"
              value={formData.motivosArchivarCaso}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="4. Rechazar el caso"
              name="rechazarCaso"
              options={['SI', 'NO']}
              onChange={handleInputChange}
            />
            <TextArea
              label="Motivos"
              name="motivosRechazarCaso"
              value={formData.motivosRechazarCaso}
              onChange={handleInputChange}
            />
          </div>

          <hr className="border-gray-200" />

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comentarios</h3>
            <TextArea
              label="Comentarios generales"
              name="comentarios"
              value={formData.comentarios}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Rechazar caso
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Apertura de Legajo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}