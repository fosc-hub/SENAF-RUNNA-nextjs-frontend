import React, { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'
import { CustomSelect } from './CustomSelect'
import { Paperclip, X } from 'lucide-react'
import { createTRespuesta } from '../../api/TableFunctions/respuestas'
import { getTInstitucionRespuestas } from '../../api/TableFunctions/institucionRespuestas'
import { TInstitucionRespuesta, TRespuesta } from '../../api/interfaces'
import {
  Box,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem
} from '@mui/material'
interface EnviarRespuestaModalProps {
  isOpen: boolean
  onClose: () => void
  demandaId: number
}

export default function EnviarRespuestaModal({ isOpen, onClose, demandaId }: EnviarRespuestaModalProps) {
  console.log('EnviarRespuestaModal rendered, isOpen:', isOpen);
  const [responseData, setResponseData] = useState<TRespuesta>({
    mail: '',
    mensaje: '',
    demanda: demandaId,
    institucion: 0
  })
  const [institutionOptions, setInstitutionOptions] = useState<TInstitucionRespuesta[]>([])
  const [attachments, setAttachments] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const institutions = await getTInstitucionRespuestas()
        setInstitutionOptions(institutions)
      } catch (error) {
        console.error('Error fetching institutions:', error)
        setError('Failed to load institutions. Please try again.')
      }
    }

    fetchInstitutions()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResponseData(prev => ({ ...prev, [name]: value }))
  }

  const handleInstitutionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setResponseData(prev => ({ ...prev, institucion: event.target.value as number }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newAttachments = Array.from(files).map(file => file.name)
      setAttachments(prev => [...prev, ...newAttachments])
    }
  }

  const handleRemoveAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(name => name !== fileName))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createTRespuesta(responseData)
      onClose()
    } catch (error) {
      console.error('Error creating response:', error)
      setError('Failed to send response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: 5,
        overflowY: 'auto',
        zIndex: 1000,
      }}>
        <Paper sx={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Enviar Respuesta</Typography>
            <IconButton onClick={onClose} size="small">
              <X />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="institution-label">Institución</InputLabel>
              <Select
                labelId="institution-label"
                value={responseData.institucion}
                onChange={handleInstitutionChange}
                label="Institución"
              >
                {institutionOptions.map((inst) => (
                  <MenuItem key={inst.id} value={inst.id}>{inst.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Mail"
              name="mail"
              type="email"
              value={responseData.mail}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mensaje"
              name="mensaje"
              multiline
              rows={4}
              value={responseData.mensaje}
              onChange={handleInputChange}
            />
            <Box sx={{ mt: 2 }}>
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                multiple
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Paperclip />}
                >
                  Adjuntar archivos
                </Button>
              </label>
            </Box>
            <Box sx={{ mt: 2 }}>
              {attachments.map((file, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">{file}</Typography>
                  <IconButton size="small" onClick={() => handleRemoveAttachment(file)}>
                    <X />
                  </IconButton>
                </Box>
              ))}
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={onClose} sx={{ mr: 2 }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Enviar Respuesta'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Modal>
  )
}
