import React, { useState } from 'react'
import { X } from 'lucide-react'
import PurpleOutlineButton from './PurpleOutlineButton'
import { RadioGroup } from './RadioGroup'

const InputField = ({ label, ...props }) => (
    <div className="mb-4">
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-900"
        placeholder={label}
        {...props}
      />
    </div>
  )
  
  const TextArea = ({ label, ...props }) => (
    <div className="mb-4">
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-900"
        rows="3"
        placeholder={label}
        {...props}
      />
    </div>
  )



export default function NuevoIngresoModal({ isOpen, onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const currentDate = new Date()
    const newDemand = {
      ...formData,
      ultimaActualizacion: `Actualizado el ${currentDate.toLocaleDateString('es-AR')}`,
      recibido: currentDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    }
    onSubmit(newDemand)
    setFormData({})
    setStep(1)
  }

  const handleNext = (e) => {
    e.preventDefault() // Prevent form submission
    setStep((prevStep) => Math.min(prevStep + 1, 3))
  }

  const handlePrevious = (e) => {
    e.preventDefault() // Prevent form submission
    setStep((prevStep) => Math.max(prevStep - 1, 1))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nuevo Ingreso</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium text-purple-600 mb-4">Carátula</h3>
              <InputField label="Nombre" name="nombre" onChange={handleInputChange} />
              <InputField label="DNI" name="dni" onChange={handleInputChange} />

              <h3 className="text-lg font-medium text-purple-600 mt-6 mb-4">Datos requeridos del ingreso</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Fecha" name="fecha" type="date" onChange={handleInputChange} />
                <InputField label="Hora" name="hora" type="time" onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="ID Notificación manual" name="idNotificacion" onChange={handleInputChange} />
                <InputField label="Notificación Nro." name="notificacionNro" onChange={handleInputChange} />
              </div>

              <h3 className="text-lg font-medium text-purple-600 mt-6 mb-4">Datos de Localización</h3>
              <InputField label="Calle" name="calle" onChange={handleInputChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Número" name="numero" onChange={handleInputChange} />
                <InputField label="Barrio" name="barrio" onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Localidad" name="localidad" onChange={handleInputChange} />
                <InputField label="Provincia" name="provincia" onChange={handleInputChange} />
              </div>
              <TextArea label="Referencias Geográficas (entre calles - indicaciones para llegar)" name="referenciasGeograficas" onChange={handleInputChange} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium text-purple-600 mb-4">Niñas, niños y adolescentes convivientes</h3>
              <InputField label="Nombre y Apellido" name="nombreApellidoNNA" onChange={handleInputChange} />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Edad" name="edadNNA" onChange={handleInputChange} />
                <InputField label="Género" name="generoNNA" onChange={handleInputChange} />
                <InputField label="Institución educativa" name="institucionEducativa" onChange={handleInputChange} />
              </div>
              <InputField label="Curso, nivel y Turno" name="cursoNivelTurno" onChange={handleInputChange} />
              <InputField label="Institución sanitaria" name="institucionSanitaria" onChange={handleInputChange} />
              <RadioGroup
                label="Es un NNyA con DD vulnerados?"
                name="ddVulnerados"
                options={['SI', 'NO']}
                onChange={handleInputChange}
              />
              <TextArea label="Comentarios" name="comentariosNNA" onChange={handleInputChange} />
              <PurpleOutlineButton onClick={() => console.log('Add another child')}>
                Añadir otro niño o adolescente
              </PurpleOutlineButton>

              <hr className="my-6 border-gray-200" />

              <h3 className="text-lg font-medium text-purple-600 mt-6 mb-4">Adultos convivientes</h3>
              <InputField label="Nombre y Apellido" name="nombreApellidoAdulto" onChange={handleInputChange} />
              <InputField label="Vínculo" name="vinculoAdulto" onChange={handleInputChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Edad" name="edadAdulto" onChange={handleInputChange} />
                <InputField label="Género" name="generoAdulto" onChange={handleInputChange} />
              </div>
              <TextArea label="Observaciones" name="observacionesAdulto" onChange={handleInputChange} />
              <PurpleOutlineButton onClick={() => console.log('Add another adult')}>
                Añadir otro adulto
              </PurpleOutlineButton>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium text-purple-600 mb-4">Presunta Vulneración de Derechos informada</h3>
              <TextArea label="Motivo" name="motivo" onChange={handleInputChange} />
              <TextArea label="Ámbito de vulneración" name="ambitoVulneracion" onChange={handleInputChange} />
              <TextArea label="Principal Derecho vulnerado" name="principalDerechoVulnerado" onChange={handleInputChange} />
              <TextArea label="Problemática Identificada" name="problematicaIdentificada" onChange={handleInputChange} />
              <TextArea label="Prioridad sugerida de intervención" name="prioridadIntervencion" onChange={handleInputChange} />
              <InputField label="Nombre y cargo de Operador/a" name="operador" onChange={handleInputChange} />

              <hr className="my-6 border-gray-200" />

              <h3 className="text-lg font-medium text-purple-600 mt-6 mb-4">Autor de la vulneración de Derechos de NNyA</h3>
              <InputField label="Nombre y Apellido" name="nombreApellidoAutor" onChange={handleInputChange} />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Edad" name="edadAutor" onChange={handleInputChange} />
                <InputField label="Género" name="generoAutor" onChange={handleInputChange} />
                <InputField label="Vínculo" name="vinculoAutor" onChange={handleInputChange} />
              </div>
              <RadioGroup
                label="Convive?"
                name="conviveAutor"
                options={['SI', 'NO']}
                onChange={handleInputChange}
              />
              <TextArea label="Comentarios" name="comentariosAutor" onChange={handleInputChange} />
              <PurpleOutlineButton onClick={() => console.log('Add another author')}>
                Añadir otro autor
              </PurpleOutlineButton>

              <hr className="my-6 border-gray-200" />

              <h3 className="text-lg font-medium text-purple-600 mt-6 mb-4">Descripción de la situación</h3>
              <TextArea label="Comentarios" name="descripcionSituacion" onChange={handleInputChange} />

              <hr className="my-6 border-gray-200" />

              <h3 className="text-lg font-medium text-purple-600 mt-6 mb-4">Sobre el usuario de la línea</h3>
              <InputField label="Nombre y Apellido" name="nombreApellidoUsuario" onChange={handleInputChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Edad" name="edadUsuario" onChange={handleInputChange} />
                <InputField label="Género" name="generoUsuario" onChange={handleInputChange} />
              </div>
              <InputField label="Vínculo" name="vinculoUsuario" onChange={handleInputChange} />
              <InputField label="Teléfono" name="telefonoUsuario" onChange={handleInputChange} />
              <InputField label="Institución o programa" name="institucionUsuario" onChange={handleInputChange} />
              <InputField label="Contacto Institución o programa" name="contactoInstitucionUsuario" onChange={handleInputChange} />
              <InputField label="Nombre y cargo del responsable" name="responsableUsuario" onChange={handleInputChange} />
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
              >
                Anterior
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Ingresar Entrada
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}