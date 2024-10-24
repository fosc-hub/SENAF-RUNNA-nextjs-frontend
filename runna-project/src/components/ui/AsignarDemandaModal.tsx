import React, { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'
import { Paperclip } from 'lucide-react'

interface AsignarDemandaModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (data: AssignmentData) => void
}

interface AssignmentData {
  collaborator: string
  comments: string
}

export function AsignarDemandaModal({ isOpen, onClose, onAssign }: AsignarDemandaModalProps) {
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    collaborator: '',
    comments: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAssignmentData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAssign(assignmentData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Demanda">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="collaborator" className="font-bold text-gray-700">Asignar a un colaborador</Label>
          <Input
            id="collaborator"
            name="collaborator"
            value={assignmentData.collaborator}
            onChange={handleInputChange}
            placeholder="Buscar colaborador"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comments" className="font-bold text-gray-700">Comentarios</Label>
          <Textarea
            id="comments"
            name="comments"
            value={assignmentData.comments}
            onChange={handleInputChange}
            placeholder="Comentarios"
            rows={4}
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
              Asignar
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}