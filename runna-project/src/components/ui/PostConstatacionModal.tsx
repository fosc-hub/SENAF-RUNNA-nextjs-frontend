import React, { useState } from 'react'
import { X, ChevronDown, ChevronUp, Plus, Paperclip, UserPlus, MessageSquare } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'
import { Checkbox } from './Checkbox'
import { RadioGroup, RadioGroupItem } from './RadioGroup'
import { ScrollArea } from './ScrollArea'
import { AsignarDemandaModal } from './AsignarDemandaModal'
import { EnviarRespuestaModal } from './EnviarRespuestaModal'
import { ArchivosAdjuntosModal } from './ArchivosAdjuntosModal'

interface Demanda {
  id: string
  nombre: string
  dni: string
  edad: number
  urgente?: boolean
  fechaActualizacion: string
  asociadoRegistro?: boolean
  historial?: Array<{ fecha: string; descripcion: string }>
  archivosAdjuntos?: string[]
  fechaConstatacion?: string
  [key: string]: any
}

interface PostConstatacionModalProps {
  demanda: Demanda
  onClose: () => void
  onEvaluate: () => void
}

export default function PostConstatacionModal({ demanda, onClose, onEvaluate }: PostConstatacionModalProps) {
  const [sections, setSections] = useState({
    datosRequeridos: true,
    conexiones: false,
    derivar: false,
  })
  const [isAsignarDemandaOpen, setIsAsignarDemandaOpen] = useState(false)
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false)
  const [formData, setFormData] = useState({ ...demanda })
  const [isArchivosAdjuntosOpen, setIsArchivosAdjuntosOpen] = useState(false)
  const [derivarData, setDerivarData] = useState({
    colaborador: '',
    comentarios: ''
  })

  const toggleSection = (section: 'datosRequeridos' | 'conexiones' | 'derivar') => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }))
  }
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleDerivarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDerivarData(prev => ({ ...prev, [name]: value }))
  }

  const handleDerivar = () => {
    console.log('Derivar demanda:', derivarData)
    // Here you would typically send the data to your backend
  }

  const handleOpenAsignarDemanda = () => {
    setIsAsignarDemandaOpen(true)
  }

  const handleCloseAsignarDemanda = () => {
    setIsAsignarDemandaOpen(false)
  }
  const handleOpenArchivosAdjuntos = () => {
    setIsArchivosAdjuntosOpen(true)
  }

  const handleCloseArchivosAdjuntos = () => {
    setIsArchivosAdjuntosOpen(false)
  }

  const handleSaveArchivosAdjuntos = (data: { files: string[], comments: string }) => {
    console.log('Archivos adjuntos saved:', data)
    // Here you would typically update the demand with the new files and comments
    setIsArchivosAdjuntosOpen(false)
  }

  const handleAssignDemand = (assignmentData: any) => {
    console.log('Demand assigned:', assignmentData)
    // Here you would typically update the demand with the assignment data
    setIsAsignarDemandaOpen(false)
  }

  const handleOpenEnviarRespuesta = () => {
    setIsEnviarRespuestaOpen(true)
  }

  const handleCloseEnviarRespuesta = () => {
    setIsEnviarRespuestaOpen(false)
  }

  const handleSendResponse = (responseData: any) => {
    console.log('Response sent:', responseData)
    // Here you would typically send the response data to your backend
    setIsEnviarRespuestaOpen(false)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        <ScrollArea className="h-[90vh] p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{demanda.nombre}</h2>
              <p className="text-gray-700">DNI {demanda.dni} - {demanda.edad} años</p>
            </div>
            <div className="flex items-center space-x-2">
              {demanda.urgente && (
                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  URGENTE
                </span>
              )}
              <p className="text-sm text-gray-500">Actualizado: {demanda.fechaActualizacion}</p>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleOpenEnviarRespuesta}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Respuesta
          </Button>
          <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={handleOpenArchivosAdjuntos}>
            <Paperclip className="mr-2 h-4 w-4" />
            Archivos adjuntos
          </Button>
          <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={handleOpenAsignarDemanda}>
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar
          </Button>
        </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-blue-600 mb-2">Evaluación de la Demanda</h4>
            <p className="text-sm text-gray-600 mb-2">Asegúrate de chequear estos puntos antes de continuar</p>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <Checkbox id="formularioCompleto" />
                <span className="ml-2 text-gray-700">Formulario Completo</span>
              </label>
              <label className="flex items-center">
                <Checkbox id="conexionesDemanda" />
                <span className="ml-2 text-gray-700">Conexiones de la Demanda</span>
              </label>
              <label className="flex items-center">
                <Checkbox id="archivosAdjuntos" />
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
                <RadioGroup defaultValue={formData.ddVulnerados} label={''} options={[]}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SI" id="ddVulnerados-si" />
                    <Label htmlFor="ddVulnerados-si">SI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="ddVulnerados-no" />
                    <Label htmlFor="ddVulnerados-no">NO</Label>
                  </div>
                </RadioGroup>
              </div>
              <InputField label="Comentarios" name="comentariosNNA" value={formData.comentariosNNA} onChange={handleInputChange} textarea className="col-span-3" />
            </div>
            <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
              <Plus className="h-4 w-4 mr-1" /> Añadir otro niño o adolescente
            </Button>

            <h5 className="font-medium mb-2 mt-6 text-indigo-600">Adultos convivientes</h5>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InputField label="Nombre y Apellido" name="nombreApellidoAdulto" value={formData.nombreApellidoAdulto} onChange={handleInputChange} className="col-span-2" />
              <InputField label="Vínculo" name="vinculoAdulto" value={formData.vinculoAdulto} onChange={handleInputChange} />
              <InputField label="Edad" name="edadAdulto" value={formData.edadAdulto} onChange={handleInputChange} />
              <InputField label="Género" name="generoAdulto" value={formData.generoAdulto} onChange={handleInputChange} />
              <InputField label="Observaciones" name="observacionesAdulto" value={formData.observacionesAdulto} onChange={handleInputChange} textarea className="col-span-2" />
            </div>
            <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
              <Plus className="h-4 w-4 mr-1" /> Añadir otro adulto
            </Button>

            <h5 className="font-medium mb-2 mt-6 text-indigo-600">Autor de la vulneración de Derechos de NNyA</h5>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <InputField label="Nombre y Apellido" name="nombreApellidoAutor" value={formData.nombreApellidoAutor} onChange={handleInputChange} className="col-span-2" />
              <InputField label="Edad" name="edadAutor" value={formData.edadAutor} onChange={handleInputChange} />
              <InputField label="Género" name="generoAutor" value={formData.generoAutor} onChange={handleInputChange} />
              <InputField label="Vínculo" name="vinculoAutor" value={formData.vinculoAutor} onChange={handleInputChange} />
              <div className="col-span-2 flex items-center">
                <span className="mr-4">Convive?</span>
                <RadioGroup defaultValue={formData.conviveAutor} label={''} options={[]}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SI" id="conviveAutor-si" />
                    <Label htmlFor="conviveAutor-si">SI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="conviveAutor-no" />
                    <Label htmlFor="conviveAutor-no">NO</Label>
                  </div>
                </RadioGroup>
              </div>
              <InputField label="Comentarios" name="comentariosAutor"    value={formData.comentariosAutor} onChange={handleInputChange} textarea className="col-span-4" />
            </div>
            <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
              <Plus className="h-4 w-4 mr-1" /> Añadir otro autor
            </Button>

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
              <InputField label="Problemática Identificada" name="problematicaIdentificada" value={formData.problematicaIdentificada} onChange={handleInputChange} textarea />
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
              <p className="font-medium">{formData.nombreCompleto}</p>
              <p className="text-sm text-gray-600">Actualizado el {formData.fechaActualizacion} por {formData.actualizadoPor}</p>
            </div>
            <div className="mb-4">
              <h5 className="font-medium mb-2 text-gray-700">Vincular con otro caso</h5>
              <div className="flex items-center">
                <Input 
                  type="text" 
                  placeholder="33.333.333" 
                  className="mr-2 bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                />
                <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                  Vincular
                </Button>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Derivar Demanda"
            isOpen={sections.derivar}
            onToggle={() => toggleSection('derivar')}
          >
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="colaborador"
                  placeholder="Buscar colaborador"
                  value={derivarData.colaborador}
                  onChange={handleDerivarInputChange}
                  className="w-full bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Textarea
                  name="comentarios"
                  placeholder="Comentarios"
                  value={derivarData.comentarios}
                  onChange={handleDerivarInputChange}
                  rows={4}
                  className="w-full bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button onClick={handleDerivar} className="bg-blue-500 hover:bg-blue-600 text-white">
                Derivar
              </Button>
            </div>
          </CollapsibleSection>

          <div className="mt-6">
            <Button 
              onClick={onEvaluate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              Evaluar Demanda
            </Button>
          </div>
        </ScrollArea>
      </div>

      <AsignarDemandaModal
        isOpen={isAsignarDemandaOpen}
        onClose={handleCloseAsignarDemanda}
        onAssign={handleAssignDemand}
      />

      <EnviarRespuestaModal
        isOpen={isEnviarRespuestaOpen}
        onClose={handleCloseEnviarRespuesta}
        onSend={handleSendResponse}
      />

      <ArchivosAdjuntosModal
        isOpen={isArchivosAdjuntosOpen}
        onClose={handleCloseArchivosAdjuntos}
        onSave={handleSaveArchivosAdjuntos}
        initialFiles={demanda.archivosAdjuntos || []}
      />
    </div>
  )
}

interface InputFieldProps {
  label: string
  name: string
  value: string | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  textarea?: boolean
  className?: string
}

function InputField({ label, name, value, onChange, textarea = false, className = "" }: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</Label>
      {textarea ? (
        <Textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-400"
          placeholder={label}
        />
      ) : (
        <Input
          type="text"
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-400"
          placeholder={label}
        />
      )}
    </div>
  )
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function CollapsibleSection({ title, children, isOpen, onToggle }: CollapsibleSectionProps) {
  return (
    <div className="border-t pt-6 mt-6">
      <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={onToggle}>
        <h3 className="text-lg font-semibold text-indigo-600">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-indigo-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-indigo-600" />
        )}
      </div>
      {isOpen && children}
    </div>
  )
}