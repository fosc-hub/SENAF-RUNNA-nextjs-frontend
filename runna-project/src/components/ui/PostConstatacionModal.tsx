import React, { useState } from 'react'
import { TDemanda } from '../../api/interfaces'

import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab'
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { AsignarDemandaModal } from './AsignarDemandaModal'
import { EnviarRespuestaModal } from './EnviarRespuestaModal'
import { ArchivosAdjuntosModal } from './ArchivosAdjuntosModal'

interface NinoAdolescente {
  id: string;
  nombreApellido: string;
  edad: string;
  genero: string;
  institucionEducativa: string;
  cursoNivelTurno: string;
  institucionSanitaria: string;
  esNNyA: boolean;
  comentarios: string;
}

interface Adulto {
  id: string;
  nombreApellido: string;
  vinculo: string;
  edad: string;
  genero: string;
  observaciones: string;
}

interface Autor {
  id: string;
  nombreApellido: string;
  edad: string;
  genero: string;
  vinculo: string;
  convive: boolean;
  comentarios: string;
}

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
  ninosAdolescentes: NinoAdolescente[]
  adultosConvivientes: Adulto[]
  autores: Autor[]
  [key: string]: any
}

interface PostConstatacionModalProps {
  demanda: TDemanda
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => {
    const { name, value } = e.target
    if (index !== undefined && field) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item: any, i: number) =>
          i === index ? { ...item, [name]: value } : item
        )
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) =>
        i === index ? { ...item, [name]: checked } : item
      )
    }))
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
  const handleEvaluateClick = () => {
    onEvaluate()
    onClose()
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

  const addNinoAdolescente = () => {
    const newNino: NinoAdolescente = {
      id: Date.now().toString(),
      nombreApellido: '',
      edad: '',
      genero: '',
      institucionEducativa: '',
      cursoNivelTurno: '',
      institucionSanitaria: '',
      esNNyA: false,
      comentarios: '',
    }
    setFormData(prev => ({
      ...prev,
      ninosAdolescentes: [...prev.ninosAdolescentes, newNino]
    }))
  }

  const addAdultoConviviente = () => {
    const newAdulto: Adulto = {
      id: Date.now().toString(),
      nombreApellido: '',
      vinculo: '',
      edad: '',
      genero: '',
      observaciones: '',
    }
    setFormData(prev => ({
      ...prev,
      adultosConvivientes: [...prev.adultosConvivientes, newAdulto]
    }))
  }

  const addAutor = () => {
    const newAutor: Autor = {
      id: Date.now().toString(),
      nombreApellido: '',
      edad: '',
      genero: '',
      vinculo: '',
      convive: false,
      comentarios: '',
    }
    setFormData(prev => ({
      ...prev,
      autores: [...prev.autores, newAutor]
    }))
  }

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'start', pt: 5, overflowY: 'auto' }}>
      <Paper sx={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto', p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h2">{demanda.nombre}</Typography>
            <Typography variant="subtitle1" color="text.secondary">DNI {demanda.dni} - {demanda.edad} años</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {demanda.urgente && (
              <Typography variant="caption" sx={{ bgcolor: 'error.main', color: 'error.contrastText', px: 1, py: 0.5, borderRadius: 1, mr: 2 }}>
                URGENTE
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" mr={2}>Actualizado: {demanda.fechaActualizacion}</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Paper sx={{ bgcolor: 'success.light', p: 2, mb: 3 }} elevation={0}>
          <Typography color="success.contrastText">Demanda en Proceso de Constatación</Typography>
        </Paper>

        <Typography variant="h6" gutterBottom>Historial de la Demanda</Typography>
        <Timeline>
          {demanda.historial?.map((evento, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot />
                {index !== demanda.historial!.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="body2" fontWeight="bold">{evento.fecha}</Typography>
                <Typography variant="body2">{evento.descripcion}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <Typography variant="h6" gutterBottom>
          Archivos adjuntos ({demanda.archivosAdjuntos ? demanda.archivosAdjuntos.length : 0})
        </Typography>
        <Box component="ul" sx={{ mb: 3, pl: 2 }}>
          {demanda.archivosAdjuntos?.map((archivo, index) => (
            <Typography component="li" key={index}>{archivo}</Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" startIcon={<MessageIcon />} onClick={handleOpenEnviarRespuesta}>
            Enviar Respuesta
          </Button>
          <Button variant="outlined" startIcon={<AttachFileIcon />} onClick={handleOpenArchivosAdjuntos}>
            Archivos adjuntos
          </Button>
          <Button variant="outlined" startIcon={<PersonIcon />} onClick={handleOpenAsignarDemanda}>
            Asignar
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Evaluación de la Demanda</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>Asegúrate de chequear estos puntos antes de continuar</Typography>
          <FormControlLabel control={<Checkbox />} label="Formulario Completo" />
          <FormControlLabel control={<Checkbox />} label="Conexiones de la Demanda" />
          <FormControlLabel control={<Checkbox />} label="Archivos Adjuntos" />
        </Box>

        <CollapsibleSection
          title="Datos requeridos de la Demanda"
          isOpen={sections.datosRequeridos}
          onToggle={() => toggleSection('datosRequeridos')}
        >
          <Typography variant="body2" color="success.main" gutterBottom>
            En proceso de Constatación desde el {demanda.fechaConstatacion}, a la espera de Evaluación
          </Typography>
          
          <Typography variant="subtitle1" color="primary" gutterBottom>Datos requeridos del caso</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="Fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Hora" name="hora" value={formData.hora} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="ID Notificación manual" name="idNotificacion" value={formData.idNotificacion} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Notificación Nro." name="notificacionNro" value={formData.notificacionNro} onChange={handleInputChange} />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" color="primary" gutterBottom>Datos de Localización</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Calle" name="calle" value={formData.calle} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Número" name="numero" value={formData.numero} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Barrio" name="barrio" value={formData.barrio} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Localidad" name="localidad" value={formData.localidad} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Referencias Geográficas" name="referenciasGeograficas" value={formData.referenciasGeograficas} onChange={handleInputChange} />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" color="primary" gutterBottom>Niñas, niños y adolescentes convivientes</Typography>
          {formData.ninosAdolescentes.map((nino, index) => (
            <Grid container spacing={2} sx={{ mb: 3 }} key={nino.id}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nombre y Apellido" name="nombreApellido" value={nino.nombreApellido} onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Edad" name="edad" value={nino.edad} onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Género" name="genero" value={nino.genero} onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Institución educativa" name="institucionEducativa" value={nino.institucionEducativa} onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Curso, nivel y Turno" name="cursoNivelTurno" value={nino.cursoNivelTurno} onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Institución sanitaria" name="institucionSanitaria" value={nino.institucionSanitaria} onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nino.esNNyA}
                      onChange={(e) => handleCheckboxChange(e, index, 'ninosAdolescentes')}
                      name="esNNyA"
                    />
                  }
                  label="Es un NNyA con DD vulnerados?"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Comentarios" name="comentarios" value={nino.comentarios} onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')} />
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addNinoAdolescente} sx={{ mb: 3 }}>
            Añadir otro niño o adolescente
          </Button>

          <Typography variant="subtitle1" color="primary" gutterBottom>Adultos convivientes</Typography>
          {formData.adultosConvivientes.map((adulto, index) => (
            <Grid container spacing={2} sx={{ mb: 3 }} key={adulto.id}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nombre y Apellido" name="nombreApellido" value={adulto.nombreApellido} onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Vínculo" name="vinculo" value={adulto.vinculo} onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Edad" name="edad" value={adulto.edad} onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Género" name="genero" value={adulto.genero} onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Observaciones" name="observaciones" value={adulto.observaciones} onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')} />
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addAdultoConviviente} sx={{ mb: 3 }}>
            Añadir otro adulto
          </Button>

          <Typography variant="subtitle1" color="primary" gutterBottom>Autor de la vulneración de Derechos de NNyA</Typography>
          {formData.autores.map((autor, index) => (
            <Grid container spacing={2} sx={{ mb: 3 }} key={autor.id}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nombre y Apellido" name="nombreApellido" value={autor.nombreApellido} onChange={(e) => handleInputChange(e, index, 'autores')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Edad" name="edad" value={autor.edad} onChange={(e) => handleInputChange(e, index, 'autores')} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Género" name="genero" value={autor.genero} onChange={(e) => handleInputChange(e, index, 'autores')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Vínculo" name="vinculo" value={autor.vinculo} onChange={(e) => handleInputChange(e, index, 'autores')} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={autor.convive}
                      onChange={(e) => handleCheckboxChange(e, index, 'autores')}
                      name="convive"
                    />
                  }
                  label="Convive?"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Comentarios" name="comentarios" value={autor.comentarios} onChange={(e) => handleInputChange(e, index, 'autores')} />
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addAutor} sx={{ mb: 3 }}>
            Añadir otro autor
          </Button>

          <Typography variant="subtitle1" color="primary" gutterBottom>Descripción de la situación</Typography>
          <TextField fullWidth multiline rows={4} label="Comentarios" name="descripcionSituacion" value={formData.descripcionSituacion} onChange={handleInputChange} sx={{ mb: 3 }} />

          <Typography variant="subtitle1" color="primary" gutterBottom>Sobre el usuario de la línea</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre y Apellido" name="nombreApellidoUsuario" value={formData.nombreApellidoUsuario} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Edad" name="edadUsuario" value={formData.edadUsuario} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Género" name="generoUsuario" value={formData.generoUsuario} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Vínculo" name="vinculoUsuario" value={formData.vinculoUsuario} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Teléfono" name="telefonoUsuario" value={formData.telefonoUsuario} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Institución o programa" name="institucionPrograma" value={formData.institucionPrograma} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Contacto Institución o programa" name="contactoInstitucion" value={formData.contactoInstitucion} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre y cargo del responsable" name="nombreCargoResponsable" value={formData.nombreCargoResponsable} onChange={handleInputChange} />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" color="primary" gutterBottom>Presunta Vulneración de Derechos informada</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Motivo" name="motivo" value={formData.motivo} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth multiline rows={3} label="Ámbito de vulneración" name="ambitoVulneracion" value={formData.ambitoVulneracion} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth multiline rows={3} label="Principal Derecho vulnerado" name="principalDerechoVulnerado" value={formData.principalDerechoVulnerado} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth multiline rows={3} label="Problemática Identificada" name="problematicaIdentificada" value={formData.problematicaIdentificada} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth multiline rows={3} label="Prioridad sugerida de intervención" name="prioridadIntervencion" value={formData.prioridadIntervencion} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre y cargo de Operador/a" name="nombreCargoOperador" value={formData.nombreCargoOperador} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </CollapsibleSection>

        <CollapsibleSection
          title="Conexiones de la Demanda"
          isOpen={sections.conexiones}
          onToggle={() => toggleSection('conexiones')}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">{formData.nombreCompleto}</Typography>
            <Typography variant="body2" color="text.secondary">Actualizado el {formData.fechaActualizacion} por {formData.actualizadoPor}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>Vincular con otro caso</Typography>
            <Box display="flex" alignItems="center">
              <TextField 
                placeholder="33.333.333" 
                sx={{ mr: 2 }}
              />
              <Button variant="contained" color="secondary">
                Vincular
              </Button>
            </Box>
          </Box>
        </CollapsibleSection>

        <Box sx={{ mt: 3 }}>
        <Button 
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleEvaluateClick}
          >
            Evaluar Demanda
          </Button>
        </Box>
      </Paper>

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
    </Box>
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
    <Paper sx={{ mb: 3 }} elevation={3}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={onToggle}>
        <Typography variant="h6" color="primary">{title}</Typography>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      {isOpen && <Box sx={{ p: 2 }}>{children}</Box>}
    </Paper>
  )
}