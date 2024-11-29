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
  const initialAdult = () => ({
    id: null,
    nombre: '',
    apellido: '',
    fechaNacimiento: null,
    genero: 'MASCULINO',
    edadAproximada: null,
    dni: '',
    situacionDni: '',
    botonAntipanico: false,
    supuesto_autordv: false,
    conviviente: false,
    observaciones: '',
    useDefaultLocalizacion: true,
    localizacion: {}, // Initialize with an empty localization object
  });
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
  useEffect(() => {
    if (apiData?.adultsList) {
      setFormData((prevData) => ({
        ...prevData,
        adultosConvivientes: apiData.adultsList.map((adult) => ({
          ...adult,
          localizacion: adult.localizacion || {}, // Ensure structure
        })),
      }));
    }
  }, [apiData.adultsList]);
  
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
    setFormData(prevData => ({
      ...prevData,
      ninosAdolescentes: [
        ...prevData.ninosAdolescentes,
        {
          nombre: '',
          apellido: '',
          fechaNacimiento: null,
          edadAproximada: '',
          dni: '',
          situacionDni: 'EN_TRAMITE',
          genero: 'MASCULINO',
          botonAntipanico: false,
          observaciones: '',
          useDefaultLocalizacion: true,
          localizacion: { ...initialFormData.localizacion },
          educacion: {
            institucion_educativa: '',
            curso: '',
            nivel: '',
            turno: '',
            comentarios: '',
          },
          salud: {
            institucion_sanitaria: '',
            observaciones: '',
          },
        },
      ],
    }))
  }
  const addAdultoConviviente = () => {
    setFormData((prevData) => ({
      ...prevData,
      adultosConvivientes: [
        ...prevData.adultosConvivientes,
        {
          nombre: '',
          apellido: '',
          fechaNacimiento: null,
          edadAproximada: '',
          dni: '',
          situacionDni: 'EN_TRAMITE',
          genero: 'MASCULINO',
          botonAntipanico: false,
          observaciones: '',
          supuesto_autordv: false,
          conviviente: true,
          useDefaultLocalizacion: true,
          localizacion: { ...initialFormData.localizacion },
        },
      ],
    }))
  }

  const addVulneraciontext = () => {
    setFormData((prevData) => ({
      ...prevData,
      vulneraciones: [
        ...prevData.vulneraciones,
        {
          principal_demanda: false,
          transcurre_actualidad: false,
          categoria_motivo: '',
          categoria_submotivo: '',
          gravedad_vulneracion: '',
          urgencia_vulneracion: '',
          nnya: '',
          autor_dv: '',
        },
      ],
    }))
  }
  return { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addVulneraciontext };
};

