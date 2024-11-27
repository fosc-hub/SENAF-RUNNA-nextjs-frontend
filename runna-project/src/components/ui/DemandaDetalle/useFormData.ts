import { useState } from 'react'

const initialFormData = {
  fecha_y_hora_ingreso: new Date(),
  origen: '',
  nro_notificacion_102: '',
  nro_sac: '',
  nro_suac: '',
  nro_historia_clinica: '',
  nro_oficio_web: '',
  descripcion: '',
  localizacion: {
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
  usuarioExterno: {
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
  ninosAdolescentes: [],
  adultosConvivientes: [],
  vulneraciones: [],
  vinculaciones: [],
  presuntaVulneracion: {
    motivo: '',
    ambitoVulneracion: '',
    principalDerechoVulnerado: '',
    problematicaIdentificada: '',
    prioridadIntervencion: '',
    nombreCargoOperador: '',
    motivos: [],
    categoriaMotivos: [],
    categoriaSubmotivos: [],
    gravedadVulneracion: '',
    urgenciaVulneracion: '',
    condicionesVulnerabilidadNNyA: [],
    condicionesVulnerabilidadAdulto: [],
  },
  autores: [],
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
}

export const useFormData = () => {
  const [formData, setFormData] = useState(initialFormData)
  
  const handleInputChange = (field, value) => {
    setFormData(prevData => {
      const updatedData = { ...prevData }
      const fieldParts = field.split('.')
      let current = updatedData
      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (fieldParts[i].includes('[')) {
          const [arrayName, indexStr] = fieldParts[i].split('[')
          const index = parseInt(indexStr.replace(']', ''))
          current = current[arrayName][index]
        } else {
          current = current[fieldParts[i]]
        }
      }
      current[fieldParts[fieldParts.length - 1]] = value
      return updatedData
    })
  }

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

  const addVinculacion = () => {
    setFormData(prevData => ({
      ...prevData,
      vinculaciones: [
        ...prevData.vinculaciones,
        {
          persona_1: '',
          persona_2: '',
          vinculo: '',
          conviven: false,
          autordv: false,
          garantiza_proteccion: false,
        }
      ]
    }))
  }

  const removeVinculacion = (index) => {
    setFormData(prevData => ({
      ...prevData,
      vinculaciones: prevData.vinculaciones.filter((_, i) => i !== index)
    }))
  }


  return { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addVulneraciontext, addVinculacion, removeVinculacion
  }
}

