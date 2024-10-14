import React, { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

export default function DemandaDetalle({ demanda, onClose, onConstatar }) {
  const [sections, setSections] = useState({
      datosRequeridos: true,
      datosLocalizacion: true,
      ninasNinos: true,
      adultosConvivientes: true,
      autorVulneracion: true,
      descripcionSituacion: true,
      usuarioLinea: true,
      presuntaVulneracion: true
    });
  
    const toggleSection = (section) => {
      setSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-800 hover:text-gray-900">
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{demanda.nombre}</h2>
              <p className="text-gray-700">DNI {demanda.dni} - {demanda.edad} años</p>
            </div>
            <div className="text-right">
              {demanda.urgente && (
                <div className="bg-red-500 text-white px-2 py-1 rounded-md mb-2 inline-block">
                  URGENTE
                </div>
              )}
              <p className="text-gray-700">Actualizado: {demanda.fechaActualizacion}</p>
            </div>
          </div>

          {!demanda.asociadoRegistro && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4">
              <p>La presente demanda no está asociada a un registro ni legajo.</p>
            </div>
          )}

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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
              Registrar actividad
            </button>
          </div>

          <CollapsibleSection
            title="Datos requeridos del caso"
            isOpen={sections.datosRequeridos}
            onToggle={() => toggleSection('datosRequeridos')}
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InputField label="Fecha" value={demanda.fecha} />
              <InputField label="Hora" value={demanda.hora} />
              <InputField label="ID Notificación manual" value={demanda.idNotificacion} />
              <InputField label="Notificación Nro." value={demanda.notificacionNro} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Datos de Localización"
            isOpen={sections.datosLocalizacion}
            onToggle={() => toggleSection('datosLocalizacion')}
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <InputField label="Calle" value={demanda.calle} />
              </div>
              <InputField label="Número" value={demanda.numero} />
              <InputField label="Barrio" value={demanda.barrio} />
              <InputField label="Localidad" value={demanda.localidad} />
              <InputField label="Provincia" value={demanda.provincia} />
              <div className="col-span-2">
                <InputField label="Referencias Geográficas (entre calles - indicaciones para llegar)" value={demanda.referenciasGeograficas} textarea />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Niñas, niños y adolescentes convivientes"
            isOpen={sections.ninasNinos}
            onToggle={() => toggleSection('ninasNinos')}
          >
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-3">
                <InputField label="Nombre y Apellido" value={demanda.nombreApellidoNNA} />
              </div>
              <InputField label="Edad" value={demanda.edadNNA} />
              <InputField label="Género" value={demanda.generoNNA} />
              <div className="col-span-3">
                <InputField label="Institución educativa" value={demanda.institucionEducativa} />
              </div>
              <InputField label="Curso, nivel y Turno" value={demanda.cursoNivelTurno} />
              <InputField label="Institución sanitaria" value={demanda.institucionSanitaria} />
              <div className="col-span-3 flex items-center">
                <span className="mr-4">Es un NNyA con DD vulnerados?</span>
                <label className="mr-4">
                  <input type="radio" name="ddVulnerados" value="SI" /> SI
                </label>
                <label>
                  <input type="radio" name="ddVulnerados" value="NO" /> NO
                </label>
              </div>
              <div className="col-span-3">
                <InputField label="Comentarios" value={demanda.comentariosNNA} textarea />
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              + Añadir otro niño o adolescente
            </button>
          </CollapsibleSection>

          <CollapsibleSection
            title="Adultos convivientes"
            isOpen={sections.adultosConvivientes}
            onToggle={() => toggleSection('adultosConvivientes')}
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <InputField label="Nombre y Apellido" value={demanda.nombreApellidoAdulto} />
              </div>
              <InputField label="Vínculo" value={demanda.vinculoAdulto} />
              <div className="col-span-2">
                <InputField label="Observaciones" value={demanda.observacionesAdulto} textarea />
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              + Añadir otro adulto
            </button>
          </CollapsibleSection>

          <CollapsibleSection
            title="Autor de la vulneración de Derechos de NNyA"
            isOpen={sections.autorVulneracion}
            onToggle={() => toggleSection('autorVulneracion')}
          >
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-2">
                <InputField label="Nombre y Apellido" value={demanda.nombreApellidoAutor} />
              </div>
              <InputField label="Edad" value={demanda.edadAutor} />
              <InputField label="Género" value={demanda.generoAutor} />
              <InputField label="Vínculo" value={demanda.vinculoAutor} />
              <div className="col-span-2 flex items-center">
                <span className="mr-4">Convive?</span>
                <label className="mr-4">
                  <input type="radio" name="convive" value="SI" /> SI
                </label>
                <label>
                  <input type="radio" name="convive" value="NO" /> NO
                </label>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Descripción de la situación de vulneración de Derechos"
            isOpen={sections.descripcionSituacion}
            onToggle={() => toggleSection('descripcionSituacion')}
          >
            <div className="mb-6">
              <InputField label="Descripción" value={demanda.descripcion} textarea />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Usuario de la línea"
            isOpen={sections.usuarioLinea}
            onToggle={() => toggleSection('usuarioLinea')}
          >
            <div className="mb-6">
              <InputField label="Datos del Usuario" value={demanda.usuario} textarea />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Sobre el usuario de la línea"
            isOpen={sections.usuarioLinea}
            onToggle={() => toggleSection('usuarioLinea')}
          >
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-3">
                <InputField label="Nombre y Apellido" value={demanda.nombreApellidoUsuario} />
              </div>
              <InputField label="Edad" value={demanda.edadUsuario} />
              <InputField label="Género" value={demanda.generoUsuario} />
              <InputField label="Vínculo" value={demanda.vinculoUsuario} />
              <InputField label="Teléfono" value={demanda.telefonoUsuario} />
              <div className="col-span-3">
                <InputField label="Institución o programa" value={demanda.institucionPrograma} />
              </div>
              <div className="col-span-3">
                <InputField label="Contacto Institución o programa" value={demanda.contactoInstitucion} />
              </div>
              <div className="col-span-3">
                <InputField label="Nombre y cargo del responsable" value={demanda.nombreCargoResponsable} />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Presunta Vulneración de Derechos informada"
            isOpen={sections.presuntaVulneracion}
            onToggle={() => toggleSection('presuntaVulneracion')}
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <InputField label="Motivo" value={demanda.motivo} textarea />
              </div>
              <div className="col-span-2">
                <InputField label="Ámbito de vulneración" value={demanda.ambitoVulneracion} textarea />
              </div>
              <div className="col-span-2">
                <InputField label="Principal Derecho vulnerado" value={demanda.principalDerechoVulnerado} textarea />
              </div>
              <div className="col-span-2">
                <InputField label="Problemática identificada" value={demanda.problematicaIdentificada} textarea />
              </div>
              <div className="col-span-2">
                <InputField label="Prioridad sugerida de intervención" value={demanda.prioridadIntervencion} textarea />
              </div>
              <div className="col-span-2">
                <InputField label="Nombre y cargo de Operador/a" value={demanda.nombreCargoOperador} />
              </div>
            </div>
          </CollapsibleSection>

          <div className="mt-6">
          <button 
            onClick={onConstatar} 
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
          >
            A proceso de constatación
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, value, textarea = false }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
        {textarea ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
            value={value || ''}
            readOnly
            rows={3}
          />
        ) : (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
            value={value || ''}
            readOnly
          />
        )}
      </div>
    );
  }

  function CollapsibleSection({ title, children, isOpen, onToggle }) {
    return (
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
    );
  }