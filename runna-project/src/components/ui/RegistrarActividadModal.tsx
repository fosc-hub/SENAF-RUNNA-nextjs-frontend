import React, { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'
import { CustomSelect } from './CustomSelect'
import { Camera, Paperclip } from 'lucide-react'
import { ArchivosAdjuntosModal } from './ArchivosAdjuntosModal'

interface RegistrarActividadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (activityData: ActivityData) => void
}

interface ActivityData {
  date: string
  time: string
  activity: string
  observations: string
  files: string[]
  fileComments: string
}

const activityOptions = [
  { value: 'llamada', label: 'Llamada' },
  { value: 'visita', label: 'Visita' },
  { value: 'email', label: 'Email' },
]

export function RegistrarActividadModal({ isOpen, onClose, onSubmit }: RegistrarActividadModalProps) {
  const [activityData, setActivityData] = useState<ActivityData>({
    date: '',
    time: '',
    activity: '',
    observations: '',
    files: [],
    fileComments: ''
  })
  const [isArchivosModalOpen, setIsArchivosModalOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActivityData(prev => ({ ...prev, [name]: value }))
  }

  const handleActivityChange = (value: string) => {
    setActivityData(prev => ({ ...prev, activity: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(activityData)
    onClose()
  }

  const handleOpenArchivosModal = () => {
    setIsArchivosModalOpen(true)
  }

  const handleCloseArchivosModal = () => {
    setIsArchivosModalOpen(false)
  }

  const handleSaveArchivos = (data: { files: string[], comments: string }) => {
    setActivityData(prev => ({
      ...prev,
      files: data.files,
      fileComments: data.comments
    }))
    setIsArchivosModalOpen(false)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Registrar actividad">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="font-bold text-gray-700">Fecha</Label>
              <Input
                id="date"
                type="date"
                name="date"
                value={activityData.date}
                onChange={handleInputChange}
                required
                className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="font-bold text-gray-700">Hora</Label>
              <Input
                id="time"
                type="time"
                name="time"
                value={activityData.time}
                onChange={handleInputChange}
                required
                className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
          <CustomSelect
            label="Actividad"
            options={activityOptions}
            value={activityData.activity}
            onChange={handleActivityChange}
            placeholder="Seleccionar actividad"
          />
          <div className="space-y-2">
            <Label htmlFor="observations" className="font-bold text-gray-700">Observaciones</Label>
            <Textarea
              id="observations"
              name="observations"
              value={activityData.observations}
              onChange={handleInputChange}
              placeholder="Observaciones"
              rows={4}
              className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500 resize-none"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button type="button" variant="outline" size="icon" className="rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={handleOpenArchivosModal}>
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Registrar
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      <ArchivosAdjuntosModal
        isOpen={isArchivosModalOpen}
        onClose={handleCloseArchivosModal}
        onSave={handleSaveArchivos}
        initialFiles={activityData.files}
        initialComments={activityData.fileComments}
      />
    </>
  )
}