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
  usuario_externo: '',
  ninosAdolescentes: [],
  adultosConvivientes: [],
  vulneraciones: [],
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
    setFormData((prevData) => {
      const newData = { ...prevData }
      const keys = field.split('.')
      let current = newData

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i].includes('[') ? keys[i].split('[')[0] : keys[i]
        const index = keys[i].includes('[') ? parseInt(keys[i].match(/\d+/)?.[0] || '0', 10) : null

        if (index !== null && Array.isArray(current[key])) {
          if (!current[key][index]) {
            current[key][index] = {}
          }
          current = current[key][index]
        } else {
          if (!current[key]) {
            current[key] = {}
          }
          current = current[key]
        }
      }

      const lastKey = keys[keys.length - 1]
      current[lastKey] = value

      return newData
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
        },
      ],
    }))
  }

  const addAutor = () => {
    setFormData((prevData) => ({
      ...prevData,
      autores: [
        ...prevData.autores,
        {
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

  return { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addAutor, addVulneraciontext }
}

