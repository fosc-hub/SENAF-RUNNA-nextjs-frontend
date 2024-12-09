import { add } from 'date-fns';
import { useState, useEffect } from 'react'
import { getLocalizacionPersonas } from '../../../api/TableFunctions/localizacionPersona';
import { getLocalizacion } from '../../../api/TableFunctions/localizacion';
import { log } from 'console';
import { getTVinculo } from '../../../api/TableFunctions/vinculos';
import { getTVinculoPersonaPersonas } from '../../../api/TableFunctions/vinculospersonaspersonas';
import { getTVulneracions } from '../../../api/TableFunctions/vulneraciones';
import { getTPersonaCondicionesVulnerabilidads } from '../../../api/TableFunctions/personaCondicionesVulnerabilidad';

const initialFormData = (demanda) => ({
  fecha_y_hora_ingreso: demanda?.fecha_y_hora_ingreso ? new Date(demanda.fecha_y_hora_ingreso) : new Date(),
  origen: demanda?.origen || '',
  sub_origen: demanda?.sub_origen || '', // Use `sub_origen` to match dropdown field
  institucion: demanda?.institucion || '',
  nro_notificacion_102: demanda?.nro_notificacion_102 || '',
  nro_sac: demanda?.nro_sac || '',
  nro_suac: demanda?.nro_suac || '',
  nro_historia_clinica: demanda?.nro_historia_clinica || '',
  nro_oficio_web: demanda?.nro_oficio_web || '',
  descripcion: demanda?.descripcion || '',
  condicionesVulnerabilidad: demanda?.condicionesVulnerabilidad || [],
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
  informante: demanda?.informante || {
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
  createNewinformante: demanda?.informante ? false : true, // Set to false if an informante exists
  ninosAdolescentes: demanda?.ninosAdolescentes || [],
  vulneraciones: demanda?.vulneraciones || [],
  vinculaciones: demanda?.vinculaciones || [],
  presuntaVulneracion: demanda?.presuntaVulneracion || {
    motivos: '',
  },
  adultosConvivientes: (demanda?.adultosConvivientes || []).map((adult) => ({
    ...adult,
    vinculacion: {
      vinculo: adult.vinculacion?.vinculo || '', // Ensure `vinculo` is prefilled
      conviven: adult.vinculacion?.conviven || false,
      autordv: adult.vinculacion?.autordv || false,
      garantiza_proteccion: adult.vinculacion?.garantiza_proteccion || false,
    },
  })),
  

  calificacion: demanda?.calificacion || '',
  fechaActualizacion: demanda?.fechaActualizacion || new Date(),
  historial: demanda?.historial || [],
  archivosAdjuntos: demanda?.archivosAdjuntos || [],
  asociadoRegistro: demanda?.asociadoRegistro || false,
})


export const useFormData = (demanda, apiData) => {
  const [formData, setFormData] = useState(initialFormData(demanda));
  useEffect(() => {
    const fetchCondicionesVulnerabilidad = async () => {
      if (demanda?.id) {
        const personaIds = [
          ...formData.ninosAdolescentes.map((nnya) => nnya.id),
          ...formData.adultosConvivientes.map((adulto) => adulto.id),
        ];
  
        try {
          const condicionesData = await getTPersonaCondicionesVulnerabilidads({
            demanda: demanda.id,
            persona: personaIds,
          });
  
          console.log('Fetched Condiciones de Vulnerabilidad:', condicionesData);
  
          // Merge fetched data into formData
          setFormData((prevData) => ({
            ...prevData,
            condicionesVulnerabilidad: condicionesData.map((condicion) => ({
              ...condicion,
              persona: condicion.persona,
              condicion_vulnerabilidad: condicion.condicion_vulnerabilidad,
              si_no: condicion.si_no,
            })),
          }));
        } catch (error) {
          console.error('Error fetching condiciones de vulnerabilidad:', error);
        }
      }
    };
  
    fetchCondicionesVulnerabilidad();
  }, [demanda, formData.ninosAdolescentes, formData.adultosConvivientes]);
  

  
  useEffect(() => {
    const fetchVulneraciones = async () => {
      if (demanda?.id) {
        try {
          const filteredVulneraciones = await getTVulneracions({ demanda: demanda.id });
          console.log('Filtered vulneraciones:', filteredVulneraciones);
  
          setFormData((prevData) => {
            const updatedVulneraciones = filteredVulneraciones.map((vulneracion) => {
              const matchedNnya = prevData.ninosAdolescentes.find(
                (nnya) => nnya.id === vulneracion.nnya
              );
              const matchedAdult = prevData.adultosConvivientes.find(
                (adult) => adult.id === vulneracion.autor_dv
              );
  
              return {
                ...vulneracion,
                nnya: matchedNnya ? matchedNnya.id : '', // Ensure preselection for nnya
                autor_dv: matchedAdult ? matchedAdult.id : '', // Ensure preselection for autor
              };
            });
  
            return {
              ...prevData,
              vulneraciones: updatedVulneraciones,
            };
          });
        } catch (error) {
          console.error('Error fetching vulneraciones:', error);
        }
      }
    };
  
    fetchVulneraciones();
  }, [demanda, formData.ninosAdolescentes, formData.adultosConvivientes]);
  
  
  useEffect(() => {
    if (apiData?.nnyaList && apiData.nnyaList.length > 0) {
      const fetchDetailsForNnya = async () => {
        const demandaLocalizacionId = demanda?.localizacion?.id || demanda?.localizacion;
  
        const updatedNnyaList = await Promise.all(
          apiData.nnyaList.map(async (nnya) => {
            // Fetch localizacion-persona data
            const localizacionPersonaData = await getLocalizacionPersonas({ persona: nnya.id }).catch(() => null);
            console.log('Fetched localizacionPersonaData:', localizacionPersonaData, 'For persona ID:', nnya.id);
  
            // Extract the localizacion ID
            const localizacionId = Array.isArray(localizacionPersonaData) && localizacionPersonaData.length > 0
              ? localizacionPersonaData[0].localizacion
              : null;
  
            // Fetch the full localizacion data
            let fetchedLocalizacion = null;
            if (localizacionId) {
              fetchedLocalizacion = await getLocalizacion(localizacionId).catch(() => null);
              console.log('Fetched localizacion data:', fetchedLocalizacion);
            }
  
            // Compare with demanda localizacion
            const useDefaultLocalizacion = fetchedLocalizacion?.id === Number(demandaLocalizacionId);
  
            // Fetch vinculo-persona-persona data
            const vinculoPersonaData = await getTVinculoPersonaPersonas({ persona_2: nnya.id }).catch(() => null);
            console.log('Fetched vinculoPersonaData for nnya:', vinculoPersonaData, 'For persona ID:', nnya.id);
  
            // Extract vinculo details
            let fetchedVinculo = null;
            if (vinculoPersonaData && vinculoPersonaData.length > 0) {
              fetchedVinculo = await getTVinculo(vinculoPersonaData[0].vinculo).catch(() => null);
              console.log('Fetched vinculo data for nnya:', fetchedVinculo);
            }
  
            return {
              ...nnya,
              localizacion: fetchedLocalizacion || {
                calle: '',
                tipo_calle: '',
                piso_depto: '',
                lote: '',
                mza: '',
                casa_nro: '',
                referencia_geo: '',
                barrio: '',
                localidad: '',
                cpc: '',
              },
              useDefaultLocalizacion,
              vinculo: {
                vinculo: fetchedVinculo?.id || '', // Preselect vinculo by ID
                conviven: vinculoPersonaData?.[0]?.conviven || false,
                autordv: vinculoPersonaData?.[0]?.autordv || false,
                garantiza_proteccion: vinculoPersonaData?.[0]?.garantiza_proteccion || false,
                nombre: fetchedVinculo?.nombre || 'Sin vínculo',
              },
            };
          })
        );
  
        setFormData((prevData) => ({
          ...prevData,
          ninosAdolescentes: updatedNnyaList,
        }));
      };
  
      fetchDetailsForNnya();
    }
  }, [apiData?.nnyaList, demanda?.localizacion]);
  
  
  
  useEffect(() => {
    if (apiData?.adultsList && apiData.adultsList.length > 0) {
      const fetchDetailsForAdults = async () => {
        const demandaLocalizacionId = demanda?.localizacion?.id || demanda?.localizacion;
  
        const updatedAdultsList = await Promise.all(
          apiData.adultsList.map(async (adult) => {
            // Fetch vinculo-persona-persona data
            const vinculoPersonaData = await getTVinculoPersonaPersonas({ persona_2: adult.id }).catch(() => null);
            console.log('Fetched vinculoPersonaData for adult:', vinculoPersonaData, 'For persona ID:', adult.id);
  
            // Extract vinculo details
            let fetchedVinculo = null;
            if (vinculoPersonaData && vinculoPersonaData.length > 0) {
              fetchedVinculo = await getTVinculo(vinculoPersonaData[0].vinculo).catch(() => null);
              console.log('Fetched vinculo data for adult:', fetchedVinculo);
            }
  
            // Fetch localizacion-persona data
            const localizacionPersonaData = await getLocalizacionPersonas({ persona: adult.id }).catch(() => null);
            console.log('Fetched localizacionPersonaData for adult:', localizacionPersonaData, 'For persona ID:', adult.id);
  
            // Extract the localizacion ID
            const localizacionId = Array.isArray(localizacionPersonaData) && localizacionPersonaData.length > 0
              ? localizacionPersonaData[0].localizacion
              : null;
            console.log('Extracted localizacionId for adult:', localizacionId);
  
            // Fetch the full localizacion data
            let fetchedLocalizacion = null;
            if (localizacionId) {
              fetchedLocalizacion = await getLocalizacion(localizacionId).catch(() => null);
              console.log('Fetched localizacion data for adult:', fetchedLocalizacion);
            }
  
            // Compare with demanda localizacion
            const useDefault = fetchedLocalizacion?.id === Number(demandaLocalizacionId);
            console.log('Adultos Localizacion Check:', {
              localizacionPersonaId: localizacionId,
              fetchedLocalizacionId: fetchedLocalizacion?.id,
              demandaLocalizacionId: demandaLocalizacionId,
              useDefault,
            });
  
            // Return the updated adult object with vinculo and localizacion
            return {
              ...adult,
              vinculacion: {
                vinculo: fetchedVinculo?.id || '', // Set the `id` for preselection
                conviven: vinculoPersonaData?.[0]?.conviven || false,
                autordv: vinculoPersonaData?.[0]?.autordv || false,
                garantiza_proteccion: vinculoPersonaData?.[0]?.garantiza_proteccion || false,
                nombre: fetchedVinculo?.nombre || 'Sin vínculo',
              },
              localizacion: fetchedLocalizacion || {
                calle: '',
                tipo_calle: '',
                piso_depto: '',
                lote: '',
                mza: '',
                casa_nro: '',
                referencia_geo: '',
                barrio: '',
                localidad: '',
                cpc: '',
              },
              useDefaultLocalizacion: useDefault,
            };
          })
        );
  
        setFormData((prevData) => ({
          ...prevData,
          adultosConvivientes: updatedAdultsList,
        }));
      };
  
      fetchDetailsForAdults();
    }
  }, [apiData?.adultsList, demanda?.localizacion]);
  
  
  
  
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
          edadAproximada: nnya.edadAproximada || '',
          dni: nnya.dni || '',
          situacionDni: nnya.situacionDni || '',
          botonAntipanico: nnya.boton_antipanico || false,
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
          id: adult.id,
          nombre: adult.nombre || '',
          apellido: adult.apellido || '',
          fechaNacimiento: adult.fechaNacimiento || null,
          genero: adult.genero || '',
          edadAproximada: adult.edadAproximada || '',
          dni: adult.dni || '',
          situacionDni: adult.situacionDni || '',
          botonAntipanico: adult.botonAntipanico || false,
          supuesto_autordv: adult.supuestoAutordv || false,
          conviviente: true,
          observaciones: adult.observaciones || '',
          demandaPersonaId: adult.demandaPersonaId,
          localizacionPersonas: [],
        })),
      }));
    }
  }, [apiData?.adultsList]);
  useEffect(() => {
    if (apiData?.localizacion) {
      setFormData((prevData) => ({
        ...prevData,
        localizacion: {
          ...prevData.localizacion,
          ...apiData.localizacion, // Merge API data
        },
      }));
    }
  }, [apiData.localizacion]);
  const handleInputChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const fieldParts = field.split('.');
      let current = updatedData;
  
      for (let i = 0; i < fieldParts.length - 1; i++) {
        const part = fieldParts[i];
  
        if (part.includes('[')) {
          // Handle array indexing
          const [arrayName, indexStr] = part.split('[');
          const index = parseInt(indexStr.replace(']', ''), 10);
  
          // Ensure the array exists
          if (!Array.isArray(current[arrayName])) {
            current[arrayName] = [];
          }
  
          // Ensure the object at the array index exists
          if (!current[arrayName][index]) {
            current[arrayName][index] = {};
          }
  
          current = current[arrayName][index];
        } else {
          // Ensure the nested object exists
          if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
          }
  
          current = current[part];
        }
      }
  
      const lastField = fieldParts[fieldParts.length - 1];
      if (current) {
        current[lastField] = value; // Safely set the value
      } else {
        console.warn(`Unable to set value for field "${field}" as "current" is null`);
      }
  
      console.log('Updated formData:', updatedData); // Debugging log
      return updatedData;
    });
  };
  
  
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
  const addCondicionVulnerabilidad = () => {
    setFormData(prevData => ({
      ...prevData,
      condicionesVulnerabilidad: [
        ...prevData.condicionesVulnerabilidad,
        { persona: '', condicion_vulnerabilidad: '', si_no: false }
      ]
    }))
  }  
  const removeCondicionVulnerabilidad = (index) => {
    setFormData(prevData => ({
      ...prevData,
      condicionesVulnerabilidad: prevData.condicionesVulnerabilidad.filter((_, i) => i !== index)
    }))
  }
  return { formData, handleInputChange, addNinoAdolescente, addAdultoConviviente, addVulneraciontext, addVinculacion, removeVinculacion, addCondicionVulnerabilidad, removeCondicionVulnerabilidad };
};

