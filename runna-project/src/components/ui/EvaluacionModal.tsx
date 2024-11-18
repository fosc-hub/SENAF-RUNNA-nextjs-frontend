import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Modal,
  Paper,
  Divider,
} from '@mui/material'
import { X } from 'lucide-react'
import { TDemanda } from '../../api/interfaces'

interface EvaluacionModalProps {
  isOpen: boolean
  onClose: () => void
  demanda: TDemanda
}

export default function EvaluacionModal({ isOpen, onClose, demanda }: EvaluacionModalProps) {
  const [formData, setFormData] = useState({
    informacionVeridica: '',
    informacionCorroborada: '',
    actividadesVeridicas: '',
    actividadesCorroboradas: '',
    gravedadSituacion: '',
    urgenciaSituacion: '',
    aperturaLegajo: '',
    accionesMPIMPE: '',
    archivarCaso: '',
    rechazarCaso: '',
    comentarios: '',
    motivosAperturaLegajo: '',
    motivosAccionesMPIMPE: '',
    motivosArchivarCaso: '',
    motivosRechazarCaso: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    onClose()
  }

  const RadioGroupComponent = ({ label, name, options }: { label: string, name: string, options: string[] }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>{label}</Typography>
      <RadioGroup row name={name} value={formData[name as keyof typeof formData]} onChange={handleInputChange}>
        {options.map((option) => (
          <FormControlLabel 
            key={option} 
            value={option} 
            control={<Radio size="small" />} 
            label={option}
            sx={{ 
              mr: 4,
              '.MuiFormControlLabel-label': {
                fontSize: '0.875rem',
                color: 'text.primary'
              }
            }} 
          />
        ))}
      </RadioGroup>
    </Box>
  )
  const SectionBox = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500, color: 'text.primary' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  )
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="evaluacion-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        p: 4,
        overflow: 'auto',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            id="evaluacion-modal-title" 
            variant="h6" 
            component="h2"
            sx={{ 
              color: 'text.primary',
              fontWeight: 500,
              fontSize: '1.125rem'
            }}
          >
            Estás a punto de evaluar el siguiente caso:
          </Typography>
          <Button 
            onClick={onClose} 
            sx={{ 
              minWidth: 'auto', 
              p: 1,
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'text.primary'
              }
            }}
          >
            <X size={20} />
          </Button>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            p: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'error.main',
                bgcolor: 'error.light',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600
              }}
            >
              URGENTE
            </Typography>
            <Typography variant="body1" color="text.primary">{demanda.nombre}</Typography>
            <Typography variant="body2" color="text.primary">
              DNI {demanda.dni}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ ml: 'auto' }}>
              {demanda.fecha}
            </Typography>
          </Box>
        </Paper>

        <form onSubmit={handleSubmit}>
          <SectionBox title="Sobre los Datos del caso">
            <RadioGroupComponent
              label="1. La información es verídica?"
              name="informacionVeridica"
              options={['SI', 'NO']}
            />
            <RadioGroupComponent
              label="2. La información fue corroborada?"
              name="informacionCorroborada"
              options={['SI', 'NO']}
            />
          </SectionBox>

          <SectionBox title="Sobre las Actividades Registradas">
            <RadioGroupComponent
              label="1. La información es verídica?"
              name="actividadesVeridicas"
              options={['SI', 'NO']}
            />
            <RadioGroupComponent
              label="2. La información fue corroborada?"
              name="actividadesCorroboradas"
              options={['SI', 'NO']}
            />
          </SectionBox>

          <SectionBox title="Valoración del Caso">
            <RadioGroupComponent
              label="1. Gravedad de la situación"
              name="gravedadSituacion"
              options={['Baja', 'Media', 'Alta']}
            />
            <RadioGroupComponent
              label="2. Urgencia de la situación"
              name="urgenciaSituacion"
              options={['Baja', 'Media', 'Alta']}
            />
          </SectionBox>

          <SectionBox title="Acciones que considera necesarias">
            <Box sx={{ mb: 3 }}>
              <RadioGroupComponent
                label="1. Apertura de legajo"
                name="aperturaLegajo"
                options={['SI', 'NO']}
              />
              <TextField
                fullWidth
                placeholder="Motivos"
                name="motivosAperturaLegajo"
                value={formData.motivosAperturaLegajo}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ 
                  mt: 1,
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <RadioGroupComponent
                label="2. Acciones MPI / MPE"
                name="accionesMPIMPE"
                options={['SI', 'NO']}
              />
              <TextField
                fullWidth
                placeholder="Motivos"
                name="motivosAccionesMPIMPE"
                value={formData.motivosAccionesMPIMPE}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ 
                  mt: 1,
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <RadioGroupComponent
                label="3. Archivar el caso"
                name="archivarCaso"
                options={['SI', 'NO']}
              />
              <TextField
                fullWidth
                placeholder="Motivos"
                name="motivosArchivarCaso"
                value={formData.motivosArchivarCaso}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ 
                  mt: 1,
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <RadioGroupComponent
                label="4. Rechazar el caso"
                name="rechazarCaso"
                options={['SI', 'NO']}
              />
              <TextField
                fullWidth
                placeholder="Motivos"
                name="motivosRechazarCaso"
                value={formData.motivosRechazarCaso}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ 
                  mt: 1,
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Box>
          </SectionBox>

          <SectionBox title="Comentarios">
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Motivos"
              name="comentarios"
              value={formData.comentarios}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              sx={{ 
                '& .MuiInputBase-input': {
                  color: 'text.primary'
                }
              }}
            />
          </SectionBox>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ 
                bgcolor: 'grey.800',
                color: 'white',
                borderColor: 'grey.800',
                '&:hover': {
                  bgcolor: 'grey.900',
                  borderColor: 'grey.900'
                }
              }}
            >
              Rechazar caso
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Apertura de Legajo
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}