import { useState } from 'react'

const initialFormData = (demanda) => ({
  fecha_y_hora_ingreso: demanda?.fecha_y_hora_ingreso ? new Date(demanda.fecha_y_hora_ingreso) : new Date(),
  origen: demanda?.origen || '',
  nro_notificacion_102: demanda?.nro_notificacion_102 || '',
  nro_sac: demanda?.nro_sac || '',
  nro_suac: demanda?.nro_suac || '',
  nro_historia_clinica: demanda?.nro_historia_clinica || '',
  nro_oficio_web: demanda?.nro_oficio_web || '',
  descripcion: demanda?.descripcion || '',
  localizacion: demanda?.localizacion || {
    calle: '',
    tipo_calle: 'CALLE',
    piso_depto: '',
    lote: '',
    mza: '',
    casa_nro: '',
    referencia_geo: '',
    barrio: '',
    localidad: '',
    cpc: '',
  },
  usuarioExterno: demanda?.usuarioExterno || {
    id: null,
    nombre: '',
    apellido: '',
    fecha_nacimiento: null,
    genero: 'MASCULINO',
    telefono: '',
    mail: '',
    vinculo: '',
    institucion: '',
  },
  createNewUsuarioExterno: false,
  ninosAdolescentes: demanda?.ninosAdolescentes || [],
  adultosConvivientes: demanda?.adultosConvivientes || [],
  vulneraciones: demanda?.vulneraciones || [],
  vinculaciones: demanda?.vinculaciones || [],
  presuntaVulneracion: demanda?.presuntaVulneracion || {
    motivos: '',
  },
  calificacion: demanda?.calificacion || '',
  fechaActualizacion: demanda?.fechaActualizacion || new Date(),
  historial: demanda?.historial || [],
  archivosAdjuntos: demanda?.archivosAdjuntos || [],
  asociadoRegistro: demanda?.asociadoRegistro || false,
})

export const useFormData = (demanda) => {
  const [formData, setFormData] = useState(initialFormData(demanda))

  const handleInputChange = (field, value) => {
    setFormData(prevData => {
      const updatedData = JSON.parse(JSON.stringify(prevData)); // Deep copy to avoid mutation
      const fieldParts = field.split('.');
      let current = updatedData;
      for (let i = 0; i < fieldParts.length - 1; i++) {
        current = current[fieldParts[i]];
      }
      current[fieldParts[fieldParts.length - 1]] = value;
      return updatedData;
    });
  };
  

  return { formData, handleInputChange }
}

