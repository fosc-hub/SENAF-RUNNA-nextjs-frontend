import React, { useState } from 'react'
import { TDemanda } from '../../api/interfaces'

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  Close as CloseIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from '@mui/icons-material'
import { ArchivosAdjuntosModal } from './ArchivosAdjuntosModal'
import { AsignarDemandaModal } from './AsignarDemandaModal'
import { RegistrarActividadModal } from './RegistrarActividadModal'
import { EnviarRespuestaModal } from './EnviarRespuestaModal'

interface NinoAdolescente {
  nombreApellido: string
  edad: string
  genero: string
  institucionEducativa: string
  cursoNivelTurno: string
  institucionSanitaria: string
  esNNyA: boolean
  comentarios: string
}

interface Adulto {
  nombreApellido: string
  vinculo: string
  edad: string
  genero: string
  observaciones: string
}

interface Autor {
  nombreApellido: string
  edad: string
  genero: string
  vinculo: string
  convive: boolean
  comentarios: string
}

interface Demanda {
  id: string
  nombre: string
  dni: string
  edad: number
  calificacion?: string
  fechaActualizacion: string
  asociadoRegistro?: boolean
  historial?: Array<{ fecha: string; descripcion: string }>
  archivosAdjuntos?: string[]
  datosRequeridos?: {
    fecha: string
    hora: string
    idNotificacion: string
    notificacionNro: string
  }
  localizacion?: {
    calle: string
    numero: string
    barrio: string
    localidad: string
    provincia: string
    referenciasGeograficas: string
  }
  ninosAdolescentes: NinoAdolescente[]
  adultosConvivientes: Adulto[]
  autores: Autor[]
  usuarioLinea?: {
    nombreApellido: string
    edad: string
    genero: string
    vinculo: string
    telefono: string
    institucionPrograma: string
    contactoInstitucionPrograma: string
    nombreCargoResponsable: string
  }
  vulneracionDerechos?: {
    motivo: string
    ambitoVulneracion: string
    principalDerechoVulnerado: string
    problematicaIdentificada: string
    prioridadIntervencion: string
    nombreCargoOperador: string
  }
  descripcionSituacion?: string
}

interface DemandaDetalleProps {
  demanda: TDemanda
  onClose: () => void
  onConstatar: () => void
}

export default function DemandaDetalle({ demanda, onClose, onConstatar }: DemandaDetalleProps) {
  const [formData, setFormData] = useState<TDemanda>({
    ...demanda,
    calificacion: demanda.calificacion || 'Sin calificar',
    fechaActualizacion: demanda.fechaActualizacion || new Date().toISOString(),
    ninosAdolescentes: demanda.ninosAdolescentes || [],
    adultosConvivientes: demanda.adultosConvivientes || [],
    autores: demanda.autores || [],
  })

  const [isArchivosModalOpen, setIsArchivosModalOpen] = useState(false)
  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false)
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false)
  const [isEnviarRespuestaOpen, setIsEnviarRespuestaOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, section?: keyof Demanda) => {
    const { name, value } = e.target
    if (section && index !== undefined) {
      setFormData((prev) => ({
        ...prev,
        [section]: (prev[section] as any[]).map((item, i) => 
          i === index ? { ...item, [name]: value } : item
        ),
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, section: keyof Demanda) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section] as any[]).map((item, i) => 
        i === index ? { ...item, [name]: checked } : item
      ),
    }))
  }

  const handleAddEntry = (section: 'ninosAdolescentes' | 'adultosConvivientes' | 'autores') => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === 'ninosAdolescentes'
          ? {
              nombreApellido: '',
              edad: '',
              genero: '',
              institucionEducativa: '',
              cursoNivelTurno: '',
              institucionSanitaria: '',
              esNNyA: false,
              comentarios: '',
            }
          : section === 'adultosConvivientes'
          ? {
              nombreApellido: '',
              vinculo: '',
              edad: '',
              genero: '',
              observaciones: '',
            }
          : {
              nombreApellido: '',
              edad: '',
              genero: '',
              vinculo: '',
              convive: false,
              comentarios: '',
            },
      ],
    }))
  }

  const handleArchivosSubmit = (data: { files: string[], comments: string }) => {
    console.log('Archivos adjuntos:', data)
    setIsArchivosModalOpen(false)
  }

  const handleAsignarSubmit = (data: { collaborator: string, comments: string }) => {
    console.log('Asignar demanda:', data)
    setIsAsignarModalOpen(false)
  }

  const handleRegistrarSubmit = (data: any) => {
    console.log('Registrar actividad:', data)
    setIsRegistrarModalOpen(false)
  }

  const handleEnviarRespuestaSubmit = (data: { institution: string; search: string; email: string; message: string; attachments: string[] }) => {
    console.log('Enviar respuesta:', data)
    setIsEnviarRespuestaOpen(false)
  }

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', pt: 5, overflowY: 'auto', zIndex: 1000 }}>
      <Paper sx={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto', p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h2">{demanda.nombre}</Typography>
            <Typography variant="subtitle1" color="text.secondary">DNI {demanda.dni} - {demanda.edad} años</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {formData.calificacion === 'urgente' && (
              <Typography variant="caption" sx={{ bgcolor: 'error.main', color: 'error.contrastText', px: 1, py: 0.5, borderRadius: 1, mr: 2 }}>
                URGENTE
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" mr={2}>Actualizado: {new Date(formData.fechaActualizacion).toLocaleDateString()}</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {!demanda.asociadoRegistro && (
          <Paper sx={{ bgcolor: 'warning.light', p: 2, mb: 3 }} elevation={0}>
            <Typography color="warning.dark">La presente demanda no está asociada a un registro ni legajo.</Typography>
          </Paper>
        )}

        <Typography variant="h6" gutterBottom>Historial de la Demanda</Typography>
        <Box sx={{ mb: 3 }}>
          {formData.historial?.map((item, index) => (
            <Box key={index} sx={{ mb: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
              <Typography variant="body2" fontWeight="bold">{item.fecha}</Typography>
              <Typography variant="body2">{item.descripcion}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="h6" gutterBottom>Archivos adjuntos ({formData.archivosAdjuntos?.length || 0})</Typography>
        <Box component="ul" sx={{ mb: 3, pl: 2 }}>
          {formData.archivosAdjuntos?.map((archivo, index) => (
            <Typography component="li" key={index}>{archivo}</Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" startIcon={<MessageIcon />} onClick={() => setIsEnviarRespuestaOpen(true)}>
            Enviar Respuesta
          </Button>
          <Button variant="outlined" startIcon={<AttachFileIcon />} onClick={() => setIsArchivosModalOpen(true)}>
            Archivos adjuntos
          </Button>
          <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => setIsAsignarModalOpen(true)}>
            Asignar
          </Button>
          <Button variant="contained" onClick={() => setIsRegistrarModalOpen(true)}>
            Registrar actividad
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>Datos requeridos del caso</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha"
              name="fecha"
              value={formData.datosRequeridos?.fecha || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hora"
              name="hora"
              value={formData.datosRequeridos?.hora || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID Notificación manual"
              name="idNotificacion"
              value={formData.datosRequeridos?.idNotificacion || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Notificación Nro."
              name="notificacionNro"
              value={formData.datosRequeridos?.notificacionNro || ''}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>Datos de Localización</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Calle"
              name="calle"
              value={formData.localizacion?.calle || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número"
              name="numero"
              value={formData.localizacion?.numero || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Barrio"
              name="barrio"
              value={formData.localizacion?.barrio || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Localidad"
              name="localidad"
              value={formData.localizacion?.localidad || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Provincia"
              name="provincia"
              value={formData.localizacion?.provincia || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Referencias Geográficas"
              name="referenciasGeograficas"
              value={formData.localizacion?.referenciasGeograficas || ''}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>Niñas, niños y adolescentes convivientes</Typography>
        {formData.ninosAdolescentes.map((nino, index) => (
          <Grid container spacing={3} key={index} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre y Apellido"
                name="nombreApellido"
                value={nino.nombreApellido}
                onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Edad"
                name="edad"
                value={nino.edad}
                onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Género"
                name="genero"
                value={nino.genero}
                onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Institución educativa"
                name="institucionEducativa"
                value={nino.institucionEducativa}
                onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Curso, nivel y Turno"
                name="cursoNivelTurno"
                value={nino.cursoNivelTurno}
                onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Institución sanitaria"
                name="institucionSanitaria"
                value={nino.institucionSanitaria}
                onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')}
              />
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
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comentarios"
                name="comentarios"
                value={nino.comentarios}
                onChange={(e) => handleInputChange(e, index, 'ninosAdolescentes')}
              />
            </Grid>
          </Grid>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddEntry('ninosAdolescentes')}
          sx={{ mt: 2, mb: 3 }}
        >
          Añadir otro niño o adolescente
        </Button>

        <Typography variant="h6" gutterBottom>Adultos convivientes</Typography>
        {formData.adultosConvivientes.map((adulto, index) => (
          <Grid container spacing={3} key={index} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre y Apellido"
                name="nombreApellido"
                value={adulto.nombreApellido}
                onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vínculo"
                name="vinculo"
                value={adulto.vinculo}
                onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Edad"
                name="edad"
                value={adulto.edad}
                onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Género"
                name="genero"
                value={adulto.genero}
                onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observaciones"
                name="observaciones"
                value={adulto.observaciones}
                onChange={(e) => handleInputChange(e, index, 'adultosConvivientes')}
              />
            </Grid>
          </Grid>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddEntry('adultosConvivientes')}
          sx={{ mt: 2, mb: 3 }}
        >
          Añadir otro adulto
        </Button>

        <Typography variant="h6" gutterBottom>Autor de la vulneración de Derechos de NNyA</Typography>
        {formData.autores.map((autor, index) => (
          <Grid container spacing={3} key={index} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre y Apellido"
                name="nombreApellido"
                value={autor.nombreApellido}
                onChange={(e) => handleInputChange(e, index, 'autores')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Edad"
                name="edad"
                value={autor.edad}
                onChange={(e) => handleInputChange(e, index, 'autores')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Género"
                name="genero"
                value={autor.genero}
                onChange={(e) => handleInputChange(e, index, 'autores')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vínculo"
                name="vinculo"
                value={autor.vinculo}
                onChange={(e) => handleInputChange(e, index, 'autores')}
              />
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
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comentarios"
                name="comentarios"
                value={autor.comentarios}
                onChange={(e) => handleInputChange(e, index, 'autores')}
              />
            </Grid>
          </Grid>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddEntry('autores')}
          sx={{ mt: 2, mb: 3 }}
        >
          Añadir otro autor
        </Button>

        <Typography variant="h6" gutterBottom>Descripción de la situación</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Comentarios"
          name="descripcionSituacion"
          value={formData.descripcionSituacion || ''}
          onChange={handleInputChange}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>Sobre el usuario de la línea</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre y Apellido"
              name="usuarioLinea.nombreApellido"
              value={formData.usuarioLinea?.nombreApellido || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Edad"
              name="usuarioLinea.edad"
              value={formData.usuarioLinea?.edad || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Género"
              name="usuarioLinea.genero"
              value={formData.usuarioLinea?.genero || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Vínculo"
              name="usuarioLinea.vinculo"
              value={formData.usuarioLinea?.vinculo || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Teléfono"
              name="usuarioLinea.telefono"
              value={formData.usuarioLinea?.telefono || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Institución o programa"
              name="usuarioLinea.institucionPrograma"
              value={formData.usuarioLinea?.institucionPrograma || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contacto Institución o programa"
              name="usuarioLinea.contactoInstitucionPrograma"
              value={formData.usuarioLinea?.contactoInstitucionPrograma || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre y cargo del responsable"
              name="usuarioLinea.nombreCargoResponsable"
              value={formData.usuarioLinea?.nombreCargoResponsable || ''}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>Presunta Vulneración de Derechos informada</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Motivo"
              name="vulneracionDerechos.motivo"
              value={formData.vulneracionDerechos?.motivo || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ámbito de vulneración"
              name="vulneracionDerechos.ambitoVulneracion"
              value={formData.vulneracionDerechos?.ambitoVulneracion || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Principal Derecho vulnerado"
              name="vulneracionDerechos.principalDerechoVulnerado"
              value={formData.vulneracionDerechos?.principalDerechoVulnerado || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Problemática identificada"
              name="vulneracionDerechos.problematicaIdentificada"
              value={formData.vulneracionDerechos?.problematicaIdentificada || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Prioridad sugerida de intervención"
              name="vulneracionDerechos.prioridadIntervencion"
              value={formData.vulneracionDerechos?.prioridadIntervencion || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre y cargo del Operador/a"
              name="vulneracionDerechos.nombreCargoOperador"
              value={formData.vulneracionDerechos?.nombreCargoOperador || ''}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onConstatar}
          >
            A proceso de constatación
          </Button>
        </Box>

        <ArchivosAdjuntosModal
          isOpen={isArchivosModalOpen}
          onClose={() => setIsArchivosModalOpen(false)}
          onSave={handleArchivosSubmit}
          initialFiles={formData.archivosAdjuntos || []}
          initialComments=""
        />

        <AsignarDemandaModal
          isOpen={isAsignarModalOpen}
          onClose={() => setIsAsignarModalOpen(false)}
          onAssign={handleAsignarSubmit}
        />

        <RegistrarActividadModal
          isOpen={isRegistrarModalOpen}
          onClose={() => setIsRegistrarModalOpen(false)}
          onSubmit={handleRegistrarSubmit}
        />

        <EnviarRespuestaModal
          isOpen={isEnviarRespuestaOpen}
          onClose={() => setIsEnviarRespuestaOpen(false)}
          onSend={handleEnviarRespuestaSubmit}
        />
      </Paper>
    </Box>
  )
}