import React, { useState } from 'react'
import { X, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import EvaluacionModal from './EvaluacionModal'

const CollapsibleSection = ({ title, children, isOpen, onToggle }) => (
  <div className="border-t pt-6 mt-6">
    <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={onToggle}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {isOpen ? (
        <ChevronUp size={20} className="text-gray-900" />
      ) : (
        <ChevronDown size={20} className="text-gray-900" />
      )}
    </div>
    {isOpen && children}
  </div>
)

const InputField = ({ label, value, textarea = false, onChange, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {textarea ? (
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        value={value || ''}
        onChange={onChange}
        rows={3}
      />
    ) : (
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        value={value || ''}
        onChange={onChange}
      />
    )}
  </div>
)
export default function PostConstatacionModal({ demanda, onClose, onEvaluate }) {
  const [sections, setSections] = useState({
    datosRequeridos: true,
    conexiones: false,
    derivar: false,
  })

  const toggleSection = (section) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const [formData, setFormData] = useState({
    ...demanda,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEvaluate = () => {
    setShowEvaluacionModal(true)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{demanda.nombre}</h2>
              <p className="text-gray-700">DNI {demanda.dni} - {demanda.edad} años</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="text-gray-700">{demanda.ultimaActualizacion}</p>
            </div>
          </div>

          <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 mb-4">
            <p>Demanda en Proceso de Constatación</p>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-900">Historial de la Demanda</h3>
          <ul className="mb-6 text-sm text-gray-700 border-l-2 border-gray-300 pl-4">
            {demanda.historial && demanda.historial.map((evento, index) => (
              <li key={index} className="mb-3">
                <p className="font-medium text-gray-900">{evento.fecha}</p>
                <p>{evento.descripcion}</p>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Archivos adjuntos ({demanda.archivosAdjuntos ? demanda.archivosAdjuntos.length : 0})
          </h3>
          <ul className="mb-6 text-sm text-gray-700">
            {demanda.archivosAdjuntos && demanda.archivosAdjuntos.map((archivo, index) => (
              <li key={index} className="mb-1">{archivo}</li>
            ))}
          </ul>

          <div className="flex space-x-2 mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
              Enviar Respuesta
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm">
              Archivos adjuntos
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm">
              Asignar
            </button>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-blue-600 mb-2">Evaluación de la Demanda</h4>
            <p className="text-sm text-gray-600 mb-2">Asegúrate de chequear estos puntos antes de continuar</p>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700">Formulario Completo</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700">Conexiones de la Demanda</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700">Archivos Adjuntos</span>
              </label>
            </div>
          </div>

          <CollapsibleSection
            title="Datos requeridos de la Demanda"
            isOpen={sections.datosRequeridos}
            onToggle={() => toggleSection('datosRequeridos')}
          >
            <p className="text-sm text-green-600 mb-4">En proceso de Constatación desde el {demanda.fechaConstatacion}, a la espera de Evaluación</p>
            
            <h5 className="font-medium mb-2 text-indigo-600">Datos requeridos del caso</h5>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InputField label="Fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} />
              <InputField label="Hora" name="hora" value={formData.hora} onChange={handleInputChange} />
              <InputField label="ID Notificación manual" name="idNotificacion" value={formData.idNotificacion} onChange={handleInputChange} />
              <InputField label="Notificación Nro." name="notificacionNro" value={formData.notificacionNro} onChange={handleInputChange} />
            </div>

            <h5 className="font-medium mb-2 text-indigo-600">Datos de Localización</h5>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InputField label="Calle" name="calle" value={formData.calle} onChange={handleInputChange} className="col-span-2" />
              <InputField label="Número" name="numero" value={formData.numero} onChange={handleInputChange} />
              <InputField label="Barrio" name="barrio" value={formData.barrio} onChange={handleInputChange} />
              <InputField label="Localidad" name="localidad" value={formData.localidad} onChange={handleInputChange} />
              <InputField label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} />
              <InputField label="Referencias Geográficas" name="referenciasGeograficas" value={formData.referenciasGeograficas} onChange={handleInputChange} textarea className="col-span-2" />
            </div>

            <h5 className="font-medium mb-2 text-indigo-600">Niñas, niños y adolescentes convivientes</h5>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <InputField label="Nombre y Apellido" name="nombreApellidoNNA" value={formData.nombreApellidoNNA} onChange={handleInputChange} className="col-span-3" />
              <InputField label="Edad" name="edadNNA" value={formData.edadNNA} onChange={handleInputChange} />
              <InputField label="Género" name="generoNNA" value={formData.generoNNA} onChange={handleInputChange} />
              <InputField label="Institución educativa" name="institucionEducativa" value={formData.institucionEducativa} onChange={handleInputChange} className="col-span-3" />
              <InputField label="Curso, nivel y Turno" name="cursoNivelTurno" value={formData.cursoNivelTurno} onChange={handleInputChange} />
              <InputField label="Institución sanitaria" name="institucionSanitaria" value={formData.institucionSanitaria} onChange={handleInputChange} />
              <div className="col-span-3 flex items-center mb-4">
                <span className="mr-4">Es un NNyA con DD vulnerados?</span>
                <label className="inline-flex items-center mr-4">
                  <input type="radio" name="ddVulnerados" value="SI" className="form-radio" />
                  <span className="ml-2">SI</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="ddVulnerados" value="NO" className="form-radio" />
                  <span className="ml-2">NO</span>
                </label>
              </div>
              <InputField label="Comentarios" name="comentariosNNA" value={formData.comentariosNNA} onChange={handleInputChange} textarea className="col-span-3" />
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <Plus size={16} className="mr-1" /> Añadir otro niño o adolescente
            </button>

            <h5 className="font-medium mb-2 mt-6 text-indigo-600">Adultos convivientes</h5>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InputField label="Nombre y Apellido" name="nombreApellidoAdulto" value={formData.nombreApellidoAdulto} onChange={handleInputChange} className="col-span-2" />
              <InputField label="Vínculo" name="vinculoAdulto" value={formData.vinculoAdulto} onChange={handleInputChange} />
              <InputField label="Edad" name="edadAdulto" value={formData.edadAdulto} onChange={handleInputChange} />
              <InputField label="Género" name="generoAdulto" value={formData.generoAdulto} onChange={handleInputChange} />
              <InputField label="Observaciones" name="observacionesAdulto" value={formData.observacionesAdulto} onChange={handleInputChange} textarea className="col-span-2" />
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <Plus size={16} className="mr-1" /> Añadir otro adulto
            </button>

            <h5 className="font-medium mb-2 mt-6 text-indigo-600">Autor de la vulneración de Derechos de NNyA</h5>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <InputField label="Nombre y Apellido" name="nombreApellidoAutor" value={formData.nombreApellidoAutor} onChange={handleInputChange} className="col-span-2" />
              <InputField label="Edad" name="edadAutor" value={formData.edadAutor} onChange={handleInputChange} />
              <InputField label="Género" name="generoAutor" value={formData.generoAutor} onChange={handleInputChange} />
              <InputField label="Vínculo" name="vinculoAutor" value={formData.vinculoAutor} onChange={handleInputChange} />
              <div className="col-span-2 flex items-center">
                <span className="mr-4">Convive?</span>
                <label className="inline-flex items-center mr-4">
                  <input type="radio" name="conviveAutor" value="SI" className="form-radio" />
                  <span className="ml-2">SI</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="conviveAutor" value="NO" className="form-radio" />
                  <span className="ml-2">NO</span>
                </label>
              </div>
              <InputField label="Comentarios" name="comentariosAutor" value={formData.comentariosAutor} onChange={handleInputChange} textarea className="col-span-4" />
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <Plus size={16} className="mr-1" /> Añadir otro autor
            </button>

            <h5 className="font-medium mb-2 mt-6 text-indigo-600">Descripción de la situación</h5>
            <InputField label="Comentarios" name="descripcionSituacion" value={formData.descripcionSituacion} onChange={handleInputChange} textarea />

            <h5 className="font-medium mb-2 mt-6 text-indigo-600">Sobre el usuario de la línea</h5>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <InputField label="Nombre y Apellido" name="nombreApellidoUsuario" value={formData.nombreApellidoUsuario} onChange={handleInputChange} className="col-span-3" />
              <InputField label="Edad" name="edadUsuario" value={formData.edadUsuario} onChange={handleInputChange} />
              <InputField label="Género" name="generoUsuario" value={formData.generoUsuario} onChange={handleInputChange} />
              <InputField label="Vínculo" name="vinculoUsuario" value={formData.vinculoUsuario} onChange={handleInputChange} />
              <InputField label="Teléfono" name="telefonoUsuario" value={formData.telefonoUsuario} onChange={handleInputChange} />
              <InputField label="Institución o programa" name="institucionPrograma" value={formData.institucionPrograma} onChange={handleInputChange} className="col-span-3" />
              <InputField label="Contacto Institución o programa" name="contactoInstitucion" value={formData.contactoInstitucion} onChange={handleInputChange} className="col-span-3" />
              <InputField label="Nombre y cargo del responsable" name="nombreCargoResponsable" value={formData.nombreCargoResponsable} onChange={handleInputChange} className="col-span-3" />
            </div>

            <h5 className="font-medium mb-2 mt-6 text-indigo-600">Presunta Vulneración de Derechos informada</h5>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InputField label="Motivo" name="motivo" value={formData.motivo} onChange={handleInputChange} textarea className="col-span-2" />
              <InputField label="Ámbito de vulneración" name="ambitoVulneracion" value={formData.ambitoVulneracion} onChange={handleInputChange} textarea />
              <InputField label="Principal Derecho vulnerado" name="principalDerechoVulnerado" value={formData.principalDerechoVulnerado} onChange={handleInputChange} textarea />
              <InputField label="Problemática Identificada"   name="problematicaIdentificada" value={formData.problematicaIdentificada} onChange={handleInputChange} textarea />
              <InputField label="Prioridad sugerida de intervención" name="prioridadIntervencion" value={formData.prioridadIntervencion} onChange={handleInputChange} textarea />
              <InputField label="Nombre y cargo de Operador/a" name="nombreCargoOperador" value={formData.nombreCargoOperador} onChange={handleInputChange} className="col-span-2" />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Conexiones de la Demanda"
            isOpen={sections.conexiones}
            onToggle={() => toggleSection('conexiones')}
          >
            <div className="mb-4">
              <p className="font-medium">{demanda.nombreCompleto}</p>
              <p className="text-sm text-gray-600">Actualizado el {demanda.fechaActualizacion} por {demanda.actualizadoPor}</p>
            </div>
            <div className="mb-4">
              <h5 className="font-medium mb-2">Vincular con otro caso</h5>
              <div className="flex items-center">
                <input type="text" placeholder="33.333.333" className="border rounded-md px-2 py-1 mr-2" />
                <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md">Vincular</button>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Derivar Demanda"
            isOpen={sections.derivar}
            onToggle={() => toggleSection('derivar')}
          >
            <div className="mb-4">
              <h5 className="font-medium mb-2">Asignar a un colaborador</h5>
              <input type="text" placeholder="Buscar colaborador" className="border rounded-md px-2 py-1 w-full mb-2" />
              <textarea placeholder="Comentarios" className="border rounded-md px-2 py-1 w-full h-20"></textarea>
            </div>
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md">Derivar</button>
          </CollapsibleSection>

          <div className="mt-6">
            <button 
              onClick={onEvaluate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              Evaluar Demanda
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}