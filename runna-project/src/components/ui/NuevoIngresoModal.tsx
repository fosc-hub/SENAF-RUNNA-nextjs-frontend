import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextareaAutosize,
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface NuevoIngresoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface NinoAdolescente {
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
  nombreApellido: string;
  vinculo: string;
  edad: string;
  genero: string;
  observaciones: string;
}

interface Autor {
  nombreApellido: string;
  edad: string;
  genero: string;
  vinculo: string;
  convive: boolean;
  comentarios: string;
}

interface FormData {
  // Carátula
  caratula: {
    nombre: string;
    dni: string;
    fecha: string;
    hora: string;
    idNotificacion: string;
    notificacionNro: string;
    calle: string;
    numero: string;
    barrio: string;
    localidad: string;
    provincia: string;
    referenciasGeograficas: string;
  };
  // Niños y adolescentes
  ninosAdolescentes: NinoAdolescente[];
  // Adultos convivientes
  adultosConvivientes: Adulto[];
  // Presunta Vulneración
  presuntaVulneracion: {
    motivo: string;
    ambitoVulneracion: string;
    principalDerechoVulnerado: string;
    problematicaIdentificada: string;
    prioridadIntervencion: string;
    nombreCargoOperador: string;
  };
  // Autor
  autores: Autor[];
  // Descripción
  descripcionSituacion: string;
  // Usuario de línea
  usuarioLinea: {
    nombreApellido: string;
    edad: string;
    genero: string;
    vinculo: string;
    telefono: string;
    institucionPrograma: string;
    contactoInstitucion: string;
    nombreCargoResponsable: string;
  };
}

const initialFormData: FormData = {
  caratula: {
    nombre: '',
    dni: '',
    fecha: '',
    hora: '',
    idNotificacion: '',
    notificacionNro: '',
    calle: '',
    numero: '',
    barrio: '',
    localidad: '',
    provincia: '',
    referenciasGeograficas: '',
  },
  ninosAdolescentes: [{
    nombreApellido: '',
    edad: '',
    genero: '',
    institucionEducativa: '',
    cursoNivelTurno: '',
    institucionSanitaria: '',
    esNNyA: false,
    comentarios: '',
  }],
  adultosConvivientes: [{
    nombreApellido: '',
    vinculo: '',
    edad: '',
    genero: '',
    observaciones: '',
  }],
  presuntaVulneracion: {
    motivo: '',
    ambitoVulneracion: '',
    principalDerechoVulnerado: '',
    problematicaIdentificada: '',
    prioridadIntervencion: '',
    nombreCargoOperador: '',
  },
  autores: [{
    nombreApellido: '',
    edad: '',
    genero: '',
    vinculo: '',
    convive: false,
    comentarios: '',
  }],
  descripcionSituacion: '',
  usuarioLinea: {
    nombreApellido: '',
    edad: '',
    genero: '',
    vinculo: '',
    telefono: '',
    institucionPrograma: '',
    contactoInstitucion: '',
    nombreCargoResponsable: '',
  },
};

const steps = [
  'Carátula',
  'Niños y Adolescentes',
  'Adultos Convivientes',
  'Presunta Vulneración',
  'Información Adicional',
];

export default function NuevoIngresoModal({ isOpen, onClose, onSubmit }: NuevoIngresoModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addNinoAdolescente = () => {
    setFormData(prev => ({
      ...prev,
      ninosAdolescentes: [
        ...prev.ninosAdolescentes,
        {
          nombreApellido: '',
          edad: '',
          genero: '',
          institucionEducativa: '',
          cursoNivelTurno: '',
          institucionSanitaria: '',
          esNNyA: false,
          comentarios: '',
        }
      ]
    }));
  };

  const addAdulto = () => {
    setFormData(prev => ({
      ...prev,
      adultosConvivientes: [
        ...prev.adultosConvivientes,
        {
          nombreApellido: '',
          vinculo: '',
          edad: '',
          genero: '',
          observaciones: '',
        }
      ]
    }));
  };

  const addAutor = () => {
    setFormData(prev => ({
      ...prev,
      autores: [
        ...prev.autores,
        {
          nombreApellido: '',
          edad: '',
          genero: '',
          vinculo: '',
          convive: false,
          comentarios: '',
        }
      ]
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography color="primary" sx={{ mb: 2 }}>Carátula</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.caratula.nombre}
                onChange={(e) => handleInputChange('caratula', 'nombre', e.target.value)}
                size="small"
              />
              <TextField
                fullWidth
                label="DNI"
                value={formData.caratula.dni}
                onChange={(e) => handleInputChange('caratula', 'dni', e.target.value)}
                size="small"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="date"
                  label="Fecha"
                  value={formData.caratula.fecha}
                  onChange={(e) => handleInputChange('caratula', 'fecha', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  type="time"
                  label="Hora"
                  value={formData.caratula.hora}
                  onChange={(e) => handleInputChange('caratula', 'hora', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </Box>
              <TextField
                fullWidth
                label="ID Notificación manual"
                value={formData.caratula.idNotificacion}
                onChange={(e) => handleInputChange('caratula', 'idNotificacion', e.target.value)}
                size="small"
              />
              <TextField
                fullWidth
                label="Notificación Nro."
                value={formData.caratula.notificacionNro}
                onChange={(e) => handleInputChange('caratula', 'notificacionNro', e.target.value)}
                size="small"
              />
              <Typography color="primary" sx={{ mt: 2, mb: 1 }}>Datos de Localización</Typography>
              <TextField
                fullWidth
                label="Calle"
                value={formData.caratula.calle}
                onChange={(e) => handleInputChange('caratula', 'calle', e.target.value)}
                size="small"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Número"
                  value={formData.caratula.numero}
                  onChange={(e) => handleInputChange('caratula', 'numero', e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Barrio"
                  value={formData.caratula.barrio}
                  onChange={(e) => handleInputChange('caratula', 'barrio', e.target.value)}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Localidad"
                  value={formData.caratula.localidad}
                  onChange={(e) => handleInputChange('caratula', 'localidad', e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Provincia"
                  value={formData.caratula.provincia}
                  onChange={(e) => handleInputChange('caratula', 'provincia', e.target.value)}
                  size="small"
                />
              </Box>
              <TextField
                fullWidth
                label="Referencias Geográficas"
                value={formData.caratula.referenciasGeograficas}
                onChange={(e) => handleInputChange('caratula', 'referenciasGeograficas', e.target.value)}
                multiline
                rows={4}
                size="small"
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography color="primary" sx={{ mb: 2 }}>Niñas, niños y adolescentes convivientes</Typography>
            {formData.ninosAdolescentes.map((nino, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre y Apellido"
                  value={nino.nombreApellido}
                  onChange={(e) => {
                    const newNinos = [...formData.ninosAdolescentes];
                    newNinos[index].nombreApellido = e.target.value;
                    setFormData({ ...formData, ninosAdolescentes: newNinos });
                  }}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Edad"
                    value={nino.edad}
                    onChange={(e) => {
                      const newNinos = [...formData.ninosAdolescentes];
                      newNinos[index].edad = e.target.value;
                      setFormData({ ...formData, ninosAdolescentes: newNinos });
                    }}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Género"
                    value={nino.genero}
                    onChange={(e) => {
                      const newNinos = [...formData.ninosAdolescentes];
                      newNinos[index].genero = e.target.value;
                      setFormData({ ...formData, ninosAdolescentes: newNinos });
                    }}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Institución educativa"
                    value={nino.institucionEducativa}
                    onChange={(e) => {
                      const newNinos = [...formData.ninosAdolescentes];
                      newNinos[index].institucionEducativa = e.target.value;
                      setFormData({ ...formData, ninosAdolescentes: newNinos });
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Curso, nivel y Turno"
                  value={nino.cursoNivelTurno}
                  onChange={(e) => {
                    const newNinos = [...formData.ninosAdolescentes];
                    newNinos[index].cursoNivelTurno = e.target.value;
                    setFormData({ ...formData, ninosAdolescentes: newNinos });
                  }}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Institución sanitaria"
                  value={nino.institucionSanitaria}
                  onChange={(e) => {
                    const newNinos = [...formData.ninosAdolescentes];
                    newNinos[index].institucionSanitaria = e.target.value;
                    setFormData({ ...formData, ninosAdolescentes: newNinos });
                  }}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Es un NNyA con DD vulnerados?</Typography>
                  <RadioGroup
                    row
                    value={nino.esNNyA}
                    onChange={(e) => {
                      const newNinos = [...formData.ninosAdolescentes];
                      newNinos[index].esNNyA = e.target.value === 'true';
                      setFormData({ ...formData, ninosAdolescentes: newNinos });
                    }}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="SI" />
                    <FormControlLabel value={false} control={<Radio />} label="NO" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  label="Comentarios"
                  value={nino.comentarios}
                  onChange={(e) => {
                    const newNinos = [...formData.ninosAdolescentes];
                    newNinos[index].comentarios = e.target.value;
                    setFormData({ ...formData, ninosAdolescentes: newNinos });
                  }}
                  multiline
                  rows={4}
                  size="small"
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addNinoAdolescente}
              sx={{ color: 'primary.main' }}
            >
              Añadir otro niño o adolescente
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography color="primary" sx={{ mb: 2 }}>Adultos convivientes</Typography>
            {formData.adultosConvivientes.map((adulto, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre y Apellido"
                  value={adulto.nombreApellido}
                  onChange={(e) => {
                    const newAdultos = [...formData.adultosConvivientes];
                    newAdultos[index].nombreApellido = e.target.value;
                    setFormData({ ...formData, adultosConvivientes: newAdultos });
                  }}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Vínculo"
                  value={adulto.vinculo}
                  onChange={(e) => {
                    const newAdultos = [...formData.adultosConvivientes];
                    newAdultos[index].vinculo = e.target.value;
                    setFormData({ ...formData, adultosConvivientes: newAdultos });
                  }}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Edad"
                    value={adulto.edad}
                    onChange={(e) => {
                      const newAdultos = [...formData.adultosConvivientes];
                      newAdultos[index].edad = e.target.value;
                      setFormData({ ...formData, adultosConvivientes: newAdultos });
                    }}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Género"
                    value={adulto.genero}
                    onChange={(e) => {
                      const newAdultos = [...formData.adultosConvivientes];
                      newAdultos[index].genero = e.target.value;
                      setFormData({ ...formData, adultosConvivientes: newAdultos });
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Observaciones"
                  value={adulto.observaciones}
                  onChange={(e) => {
                    const newAdultos = [...formData.adultosConvivientes];
                    newAdultos[index].observaciones = e.target.value;
                    setFormData({ ...formData, adultosConvivientes: newAdultos });
                  }}
                  multiline
                  rows={4}
                  size="small"
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addAdulto}
              sx={{ color: 'primary.main' }}
            >
              Añadir otro adulto
            </Button>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography color="primary" sx={{ mb: 2 }}>Presunta Vulneración de Derechos informada</Typography>
            <TextField
              fullWidth
              label="Motivo"
              value={formData.presuntaVulneracion.motivo}
              onChange={(e) => handleInputChange('presuntaVulneracion', 'motivo', e.target.value)}
              multiline
              rows={4}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Ámbito de vulneración"
              value={formData.presuntaVulneracion.ambitoVulneracion}
              onChange={(e) => handleInputChange('presuntaVulneracion', 'ambitoVulneracion', e.target.value)}
              multiline
              rows={4}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Principal Derecho vulnerado"
              value={formData.presuntaVulneracion.principalDerechoVulnerado}
              onChange={(e) => handleInputChange('presuntaVulneracion', 'principalDerechoVulnerado', e.target.value)}
              multiline
              rows={4}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Problemática Identificada"
              value={formData.presuntaVulneracion.problematicaIdentificada}
              onChange={(e) => handleInputChange('presuntaVulneracion', 'problematicaIdentificada', e.target.value)}
              multiline
              rows={4}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Prioridad sugerida de intervención"
              value={formData.presuntaVulneracion.prioridadIntervencion}
              onChange={(e) => handleInputChange('presuntaVulneracion', 'prioridadIntervencion', e.target.value)}
              multiline
              rows={4}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nombre y cargo de Operador/a"
              value={formData.presuntaVulneracion.nombreCargoOperador}
              onChange={(e) => handleInputChange('presuntaVulneracion', 'nombreCargoOperador', e.target.value)}
              size="small"
            />
          </Box>
        );

      case 4:
        return (
          <Box sx={{ p: 2 }}>
            <Typography color="primary" sx={{ mb: 2 }}>Autor de la vulneración de Derechos de NNyA</Typography>
            {formData.autores.map((autor, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre y Apellido"
                  value={autor.nombreApellido}
                  onChange={(e) => {
                    const newAutores = [...formData.autores];
                    newAutores[index].nombreApellido = e.target.value;
                    setFormData({ ...formData, autores: newAutores });
                  }}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Edad"
                    value={autor.edad}
                    onChange={(e) => {
                      const newAutores = [...formData.autores];
                      newAutores[index].edad = e.target.value;
                      setFormData({ ...formData, autores: newAutores });
                    }}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Género"
                    value={autor.genero}
                    onChange={(e) => {
                      const newAutores = [...formData.autores];
                      newAutores[index].genero = e.target.value;
                      setFormData({ ...formData, autores: newAutores });
                    }}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Vínculo"
                    value={autor.vinculo}
                    onChange={(e) => {
                      const newAutores = [...formData.autores];
                      newAutores[index].vinculo = e.target.value;
                      setFormData({ ...formData, autores: newAutores });
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Convive?</Typography>
                  <RadioGroup
                    row
                    value={autor.convive}
                    onChange={(e) => {
                      const newAutores = [...formData.autores];
                      newAutores[index].convive = e.target.value === 'true';
                      setFormData({ ...formData, autores: newAutores });
                    }}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="SI" />
                    <FormControlLabel value={false} control={<Radio />} label="NO" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  label="Comentarios"
                  value={autor.comentarios}
                  onChange={(e) => {
                    const newAutores = [...formData.autores];
                    newAutores[index].comentarios = e.target.value;
                    setFormData({ ...formData, autores: newAutores });
                  }}
                  multiline
                  rows={4}
                  size="small"
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addAutor}
              sx={{ color: 'primary.main' }}
            >
              Añadir otro autor
            </Button>

            <Typography color="primary" sx={{ mt: 4, mb: 2 }}>Descripción de la situación</Typography>
            <TextField
              fullWidth
              label="Comentarios"
              value={formData.descripcionSituacion}
              onChange={(e) => handleInputChange('descripcionSituacion', '', e.target.value)}
              multiline
              rows={4}
              size="small"
              sx={{ mb: 4 }}
            />

            <Typography color="primary" sx={{ mb: 2 }}>Sobre el usuario de la línea</Typography>
            <TextField
              fullWidth
              label="Nombre y Apellido"
              value={formData.usuarioLinea.nombreApellido}
              onChange={(e) => handleInputChange('usuarioLinea', 'nombreApellido', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Edad"
                value={formData.usuarioLinea.edad}
                onChange={(e) => handleInputChange('usuarioLinea', 'edad', e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Género"
                value={formData.usuarioLinea.genero}
                onChange={(e) => handleInputChange('usuarioLinea', 'genero', e.target.value)}
                size="small"
                fullWidth
              />
            </Box>
            <TextField
              fullWidth
              label="Vínculo"
              value={formData.usuarioLinea.vinculo}
              onChange={(e) => handleInputChange('usuarioLinea', 'vinculo', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.usuarioLinea.telefono}
              onChange={(e) => handleInputChange('usuarioLinea', 'telefono', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Institución o programa"
              value={formData.usuarioLinea.institucionPrograma}
              onChange={(e) => handleInputChange('usuarioLinea', 'institucionPrograma', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Contacto Institución o programa"
              value={formData.usuarioLinea.contactoInstitucion}
              onChange={(e) => handleInputChange('usuarioLinea', 'contactoInstitucion', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nombre y cargo del responsable"
              value={formData.usuarioLinea.nombreCargoResponsable}
              onChange={(e) => handleInputChange('usuarioLinea', 'nombreCargoResponsable', e.target.value)}
              size="small"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        <Typography variant="h6">Nuevo Ingreso</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Stepper activeStep={activeStep} sx={{ px: 2, py: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              sx={{ color: 'grey.700' }}
            >
              Anterior
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: 'primary.main' }}
                >
                  Ingresar Entrada
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{ bgcolor: 'primary.main' }}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}