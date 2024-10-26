import React, { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Textarea } from './Textarea'
import { CustomSelect } from './CustomSelect'

interface PrecalificarModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { estado: string; comentarios: string }) => void
}

const estadoOptions = [
  { value: 'urgente', label: 'Urgente' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'grave', label: 'Grave (Default)' },
]

export function PrecalificarModal({ isOpen, onClose, onSave }: PrecalificarModalProps) {
  const [estado, setEstado] = useState('')
  const [comentarios, setComentarios] = useState('')

  const handleSave = () => {
    onSave({ estado, comentarios })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Precalificar Demanda">
      <div className="space-y-4">
        <div>
          <CustomSelect
            label="Precalificar como"
            options={estadoOptions}
            value={estado}
            onChange={setEstado}
            placeholder="Seleccione"
            renderOption={(option) => (
              <div className={option.value === 'urgente' ? 'text-red-500 bg-red-50' : ''}>
                {option.label}
              </div>
            )}
          />
        </div>
        <div>
          <Textarea
            label="Comentarios"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            className="w-full resize-none"
            rows={4}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-600">
          Guardar
        </Button>
      </div>
    </Modal>
  )
}