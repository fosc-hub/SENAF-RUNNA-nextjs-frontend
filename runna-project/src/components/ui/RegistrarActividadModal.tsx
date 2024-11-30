import React, { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'
import { Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { Camera, Paperclip } from 'lucide-react'
import { ArchivosAdjuntosModal } from './ArchivosAdjuntosModal'
import { getTActividadTipos } from '../../api/TableFunctions/actividadTipos'
import { getTInstitucionActividads } from '../../api/TableFunctions/institucionActividades'

interface RegistrarActividadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (activityData: ActivityData) => void
}

interface ActivityData {
  date: string
  time: string
  activity: string | null
  institution: string | null
  observations: string
  files: string[]
  fileComments: string
  demanda: number | null
}

interface TActividadTipo {
  id: number
  nombre: string
}

interface TInstitucionActividad {
  id: number
  nombre: string
}


export function RegistrarActividadModal({ isOpen, onClose, onSubmit }: RegistrarActividadModalProps) {
  const [activityData, setActivityData] = useState<ActivityData>({
    date: '',
    time: '',
    activity: null,
    institution: null,
    observations: '',
    files: [],
    fileComments: '',
    demanda: null,
  })

  const [isArchivosModalOpen, setIsArchivosModalOpen] = useState(false)
  const [activityTypes, setActivityTypes] = useState<TActividadTipo[]>([])
  const [institutions, setInstitutions] = useState<TInstitucionActividad[]>([])

  useEffect(() => {
    if (isOpen) {
      getTActividadTipos()
        .then((data) => {
          console.log('Tipos de actividad:', data)
          setActivityTypes(data)
        })
        .catch((error) => {
          console.error('Error al obtener tipos de actividad:', error)
        })

      getTInstitucionActividads()
        .then((data) => {
          console.log('Instituciones:', data)
          setInstitutions(data)
        })
        .catch((error) => {
          console.error('Error al obtener instituciones:', error)
        })
    }
  }, [isOpen])



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActivityData(prev => ({ ...prev, [name]: value }))
  }

  const handleActivityChange = (e: SelectChangeEvent<string>) => {
    console.log('Actividad seleccionada:', e.target.value)
    setActivityData(prev => ({ ...prev, activity: e.target.value || null }))
  }

  const handleInstitutionChange = (e: SelectChangeEvent<string>) => {
    console.log('Institución seleccionada:', e.target.value)
    setActivityData(prev => ({ ...prev, institution: e.target.value || null }))
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!activityData.date || !activityData.time || !activityData.observations) {
      alert('Por favor, complete todos los campos obligatorios.')
      return
    }

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
          <div className="space-y-2">
            <Label htmlFor="activity" className="font-bold text-gray-700">Actividad</Label>
            <Select
              id="activity"
              value={activityData.activity || ''}
              onChange={handleActivityChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Seleccionar actividad</MenuItem>
              {activityTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.nombre}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution" className="font-bold text-gray-700">Institución</Label>
            <Select
              id="institution"
              value={activityData.institution || ''}
              onChange={handleInstitutionChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Seleccionar institución</MenuItem>
              {institutions.map((institution) => (
                <MenuItem key={institution.id} value={institution.id}>
                  {institution.nombre}
                </MenuItem>
              ))}
            </Select>
          </div>
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
