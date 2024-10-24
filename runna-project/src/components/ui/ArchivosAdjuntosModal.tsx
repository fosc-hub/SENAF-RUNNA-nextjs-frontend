import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'

interface ArchivosAdjuntosModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { files: string[], comments: string }) => void
  initialFiles?: string[]
  initialComments?: string
}

export function ArchivosAdjuntosModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialFiles = [], 
  initialComments = '' 
}: ArchivosAdjuntosModalProps) {
  const [files, setFiles] = useState<string[]>(initialFiles)
  const [comments, setComments] = useState(initialComments)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (newFiles) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(newFiles).map(file => file.name)])
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileName))
  }

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
  }

  const handleSave = () => {
    onSave({ files, comments })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Archivos adjuntos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Adjuntar archivo
          </Button>
          <Input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium text-gray-700">Comentarios</Label>
            <Textarea
              id="comments"
              name="comments"
              value={comments}
              onChange={handleCommentsChange}
              placeholder="Comentarios"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 resize-none"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Archivos de la demanda</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">{file}</span>
                  <button
                    onClick={() => handleRemoveFile(file)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="text-gray-700 border-gray-300">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}