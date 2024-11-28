import { useState, useEffect } from 'react'

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


export const useFormData = (demanda, apiData) => {
  const [formData, setFormData] = useState(initialFormData(demanda));

  useEffect(() => {
    if (apiData?.nnyaList && apiData.nnyaList.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        ninosAdolescentes: apiData.nnyaList.map((nnya) => ({
          id: nnya.id,
          nombre: nnya.nombre || '',
          apellido: nnya.apellido || '',
          fechaNacimiento: nnya.fechaNacimiento || null,
          genero: nnya.genero || '',
          localizacion: nnya.localizacion || {}, // Safeguard for null values
          educacion: nnya.educacion || {},       // Ensure structure is consistent
          salud: nnya.salud || {},               // Include health data
          observaciones: nnya.observaciones || '',
          demandaPersonaId: nnya.demandaPersonaId,
        })),
      }));
    }
  }, [apiData?.nnyaList]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const fieldParts = field.split('.');
      let current = updatedData;

      for (let i = 0; i < fieldParts.length - 1; i++) {
        current = current[fieldParts[i]];
      }

      current[fieldParts[fieldParts.length - 1]] = value;
      return updatedData;
    });
  };

  const addNinoAdolescente = () => {
    setFormData((prevData) => ({
      ...prevData,
      ninosAdolescentes: [...prevData.ninosAdolescentes, initialFormData(null).ninosAdolescentes[0]],
    }));
  };

  const addAdultoConviviente = () => {
    setFormData((prevData) => ({
      ...prevData,
      adultosConvivientes: [...prevData.adultosConvivientes, initialFormData(null).adultosConvivientes[0]],
    }));
  };

  return { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente };
};

