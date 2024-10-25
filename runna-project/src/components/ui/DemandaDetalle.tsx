import React, { useState } from 'react'
import { X, ChevronDown, ChevronUp, Plus, Paperclip, UserPlus, MessageSquare } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'
import { Checkbox } from './Checkbox'
import { RadioGroup, RadioGroupItem } from './RadioGroup'
import { ScrollArea } from './ScrollArea'
import { RegistrarActividadModal } from './RegistrarActividadModal'
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
  [key: string]: any
}

interface DemandaDetalleProps {
  demanda: Demanda
  onClose: () => void
  onConstatar: () => void
}


export default function DemandaDetalle({ demanda, onClose, onConstatar }: DemandaDetalleProps) {
  const [sections, setSections] = useState({
    datosRequeridos: true,
    conexiones: false,
    derivar: false,
  })
  const [isRegistrarActividadOpen, setIsRegistrarActividadOpen] = useState(false)
  const [formData, setFormData] = useState({ ...demanda })
  const [isAsignarDemandaOpen, setIsAsignarDemandaOpen] = useState(false)
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false)
  const [isArchivosAdjuntosOpen, setIsArchivosAdjuntosOpen] = useState(false)


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

  const toggleSection = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }
  const handleOpenAsignarDemanda = () => {
    setIsAsignarDemandaOpen(true)
  }
  
  const handleCloseAsignarDemanda = () => {
    setIsAsignarDemandaOpen(false)
  }
  
  const handleAssignDemand = (assignmentData: any) => {
    console.log('Demand assigned:', assignmentData)
    // Here you would typically update the demand with the assignment data
    setIsAsignarDemandaOpen(false)
  }
  const handleRegistrarActividad = () => {
    setIsRegistrarActividadOpen(true)
  }

  const handleCloseRegistrarActividad = () => {
    setIsRegistrarActividadOpen(false)
  }

  const handleSubmitActividad = (activityData: any) => {
    console.log('Activity submitted:', activityData)
    setIsRegistrarActividadOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <ScrollArea className="h-[90vh] p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{demanda.nombre}</h2>
              <p className="text-gray-700">DNI {demanda.dni} - {demanda.edad} años</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Actualizado: {demanda.fechaActualizacion}</p>
            </div>
          </div>

          {!demanda.asociadoRegistro && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4">
              <p>La presente demanda no está asociada a un registro ni legajo.</p>
            </div>
          )}

          <h3 className="text-lg font-semibold mb-2 text-gray-900">Historial de la Demanda</h3>
          <ul className="mb-6 text-sm text-gray-700 border-l-2 border-gray-300 pl-4">
            {demanda.historial?.map((evento, index) => (
              <li key={index} className="mb-3">
                <p className="font-medium text-gray-900">{evento.fecha}</p>
                <p>{evento.descripcion}</p>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Archivos adjuntos ({demanda.archivosAdjuntos?.length || 0})
          </h3>
          <ul className="mb-6 text-sm text-gray-700">
            {demanda.archivosAdjuntos?.map((archivo, index) => (
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
          <Button onClick={handleRegistrarActividad} className="bg-blue-600 hover:bg-blue-700 text-white">
            Registrar actividad
          </Button>
        </div>

        <CollapsibleSection
            title="Datos requeridos del caso"
            isOpen={sections.datosRequeridos}
            onToggle={() => toggleSection('datosRequeridos')}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} />
                <InputField label="Hora" name="hora" value={formData.hora} onChange={handleInputChange} />
                <InputField label="ID Notificación manual" name="idNotificacion" value={formData.idNotificacion} onChange={handleInputChange} />
                <InputField label="Notificación Nro." name="notificacionNro" value={formData.notificacionNro} onChange={handleInputChange} />
              </div>

              <div>
                <h4 className="text-lg font-medium text-indigo-600 mb-2">Datos de Localización</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Calle" name="calle" value={formData.calle} onChange={handleInputChange} className="col-span-2" />
                  <InputField label="Número" name="numero" value={formData.numero} onChange={handleInputChange} />
                  <InputField label="Barrio" name="barrio" value={formData.barrio} onChange={handleInputChange} />
                  <InputField label="Localidad" name="localidad" value={formData.localidad} onChange={handleInputChange} />
                  <InputField label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} />
                  <InputField label="Referencias Geográficas" name="referenciasGeograficas" value={formData.referenciasGeograficas} onChange={handleInputChange} textarea className="col-span-2" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-indigo-600 mb-2">Niñas, niños y adolescentes convivientes</h4>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="Nombre y Apellido" name="nombreApellidoNNA" value={formData.nombreApellidoNNA} onChange={handleInputChange} className="col-span-3" />
                  <InputField label="Edad" name="edadNNA" value={formData.edadNNA} onChange={handleInputChange} />
                  <InputField label="Género" name="generoNNA" value={formData.generoNNA} onChange={handleInputChange} />
                  <InputField label="Institución educativa" name="institucionEducativa" value={formData.institucionEducativa} onChange={handleInputChange} className="col-span-3" />
                  <InputField label="Curso, nivel y Turno" name="cursoNivelTurno" value={formData.cursoNivelTurno} onChange={handleInputChange} />
                  <InputField label="Institución sanitaria" name="institucionSanitaria" value={formData.institucionSanitaria} onChange={handleInputChange} />
                  <div className="col-span-3 flex items-center">
                    <span className="mr-4 text-gray-600">Es un NNyA con DD vulnerados?</span>
                    <RadioGroup defaultValue={formData.ddVulnerados}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SI" id="ddVulnerados-si" />
                        <Label htmlFor="ddVulnerados-si" className="text-gray-600">SI</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NO" id="ddVulnerados-no" />
                        <Label htmlFor="ddVulnerados-no" className="text-gray-600">NO</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <InputField label="Comentarios" name="comentariosNNA" value={formData.comentariosNNA} onChange={handleInputChange} textarea className="col-span-3" />
                </div>
                <Button variant="outline" className="mt-2 text-blue-600">
                  <Plus className="h-4 w-4 mr-1" /> Añadir otro niño o adolescente
                </Button>
              </div>

              <div>
                <h4 className="text-lg font-medium text-indigo-600 mb-2">Autor de la vulneración de Derechos de NNyA</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Nombre y Apellido" name="nombreApellidoAutor" value={formData.nombreApellidoAutor} onChange={handleInputChange} className="col-span-2" />
                  <InputField label="Edad" name="edadAutor" value={formData.edadAutor} onChange={handleInputChange} />
                  <InputField label="Género" name="generoAutor" value={formData.generoAutor} onChange={handleInputChange} />
                  <InputField label="Vínculo" name="vinculoAutor" value={formData.vinculoAutor} onChange={handleInputChange} />
                  <div className="col-span-2 flex items-center">
                    <span className="mr-4 text-gray-600">Convive?</span>
                    <RadioGroup defaultValue={formData.conviveAutor}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SI" id="conviveAutor-si" />
                        <Label htmlFor="conviveAutor-si" className="text-gray-600">SI</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NO" id="conviveAutor-no" />
                        <Label htmlFor="conviveAutor-no" className="text-gray-600">NO</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <InputField label="Comentarios" name="comentariosAutor" value={formData.comentariosAutor} onChange={handleInputChange} textarea className="col-span-2" />
                </div>
                <Button variant="outline" className="mt-2 text-blue-600">
                  <Plus className="h-4 w-4 mr-1" /> Añadir otro autor
                </Button>
              </div>

              <div>
                <h4 className="text-lg font-medium text-indigo-600 mb-2">Descripción de la situación</h4>
                <InputField label="Comentarios" name="descripcionSituacion" value={formData.descripcionSituacion} onChange={handleInputChange} textarea />
              </div>

              <div>
                <h4 className="text-lg font-medium text-indigo-600 mb-2">Sobre el usuario de la línea</h4>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="Nombre y Apellido" name="nombreApellidoUsuario" value={formData.nombreApellidoUsuario} onChange={handleInputChange} className="col-span-3" />
                  <InputField label="Edad" name="edadUsuario" value={formData.edadUsuario} onChange={handleInputChange} />
                  <InputField label="Género" name="generoUsuario" value={formData.generoUsuario} onChange={handleInputChange} />
                  <InputField label="Vínculo" name="vinculoUsuario" value={formData.vinculoUsuario} onChange={handleInputChange} />
                  <InputField label="Teléfono" name="telefonoUsuario" value={formData.telefonoUsuario} onChange={handleInputChange} />
                  <InputField label="Institución o programa" name="institucionPrograma" value={formData.institucionPrograma} onChange={handleInputChange} className="col-span-3" />
                  <InputField label="Contacto Institución o programa" name="contactoInstitucion" value={formData.contactoInstitucion} onChange={handleInputChange} className="col-span-3" />
                  <InputField label="Nombre y cargo del responsable" name="nombreCargoResponsable" value={formData.nombreCargoResponsable} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-indigo-600 mb-2">Presunta Vulneración de Derechos informada</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Motivo" name="motivo" value={formData.motivo} onChange={handleInputChange} textarea className="col-span-2" />
                  <InputField label="Ámbito de vulneración" name="ambitoVulneracion" value={formData.ambitoVulneracion} onChange={handleInputChange} textarea />
                  <InputField label="Principal Derecho vulnerado" name="principalDerechoVulnerado" value={formData.principalDerechoVulnerado} onChange={handleInputChange} textarea />
                  <InputField label="Problemática Identificada" name="problematicaIdentificada" value={formData.problematicaIdentificada} onChange={handleInputChange} textarea />
                  <InputField label="Prioridad sugerida de intervención" name="prioridadIntervencion" value={formData.prioridadIntervencion} onChange={handleInputChange} textarea />
                  <InputField label="Nombre y cargo de Operador/a" name="nombreCargoOperador" value={formData.nombreCargoOperador} onChange={handleInputChange} className="col-span-2" />
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* ... (keep the other CollapsibleSections) */}

          <div className="mt-6">
            <Button onClick={onConstatar} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              A proceso de constatación
            </Button>
          </div>
        </ScrollArea>
        </div>

        <RegistrarActividadModal
        isOpen={isRegistrarActividadOpen}
        onClose={handleCloseRegistrarActividad}
        onSubmit={handleSubmitActividad}
      />

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