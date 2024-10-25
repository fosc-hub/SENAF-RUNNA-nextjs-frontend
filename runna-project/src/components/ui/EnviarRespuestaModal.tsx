import React, { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'
import { CustomSelect } from './CustomSelect'
import { Paperclip } from 'lucide-react'

interface EnviarRespuestaModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (data: ResponseData) => void
}

interface ResponseData {
  institution: string
  search: string
  email: string
  message: string
}

const institutionOptions = [
  { value: 'institucion1', label: 'Institución 1' },
  { value: 'institucion2', label: 'Institución 2' },
  { value: 'institucion3', label: 'Institución 3' },
]

export function EnviarRespuestaModal({ isOpen, onClose, onSend }: EnviarRespuestaModalProps) {
  const [responseData, setResponseData] = useState<ResponseData>({
    institution: '',
    search: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResponseData(prev => ({ ...prev, [name]: value }))
  }

  const handleInstitutionChange = (value: string) => {
    setResponseData(prev => ({ ...prev, institution: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend(responseData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Respuesta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomSelect
          label="Institución"
          options={institutionOptions}
          value={responseData.institution}
          onChange={handleInstitutionChange}
          placeholder="Seleccionar institución"
        />
        <div className="space-y-2">
          <Label htmlFor="search" className="font-bold text-gray-700">Buscar</Label>
          <Input
            id="search"
            name="search"
            value={responseData.search}
            onChange={handleInputChange}
            placeholder="Buscar"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-gray-700">Mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={responseData.email}
            onChange={handleInputChange}
            placeholder="Correo electrónico"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" className="font-bold text-gray-700">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            value={responseData.message}
            onChange={handleInputChange}
            placeholder="Escriba su mensaje aquí"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 resize-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" size="icon" className="rounded-full">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Enviar Respuesta
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}