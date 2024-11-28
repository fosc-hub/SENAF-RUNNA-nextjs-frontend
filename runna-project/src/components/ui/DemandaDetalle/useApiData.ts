import { useState, useEffect } from 'react';
import { getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion';

export const useApiData = (demandaId, localizacionId, usuarioExternoId) => {
  

  const [apiData, setApiData] = useState({
    motivosIntervencion: [],
    demandaMotivoIntervencion: null,
    currentMotivoIntervencion: null,
    localizacion: {},
    barrios: [],
    localidades: [],
    cpcs: [],
    selectedBarrio: null,
    selectedLocalidad: null,
    selectedCpc: null,
    usuarioExterno: null,
    vinculosUsuarioExterno: [],
    institucionesUsuarioExterno: [],
    nnyaList: [], // List for NNYA personas
    adultsList: [],// Optional: List for adult personas
    institucionesEducativas : [],
    institucionesSanitarias : [], 
  });

  useEffect(() => {
    if (!demandaId && !localizacionId) return;

    const fetchData = async () => {
      const institucionesEducativas = [];
const institucionesSanitarias = [];

      try {

        const fetchedMotivos = await getTMotivoIntervencions();

        let usuarioExternoData = null;
        if (usuarioExternoId) {
          const usuarioExternoResponse = await fetch(`http://localhost:8000/api/usuario-externo/${usuarioExternoId}/`);
          usuarioExternoData = await usuarioExternoResponse.json();
        }

        // Fetch vinculos usuario externo
        const vinculosResponse = await fetch('http://localhost:8000/api/vinculo-usuario-externo/');
        const vinculosData = await vinculosResponse.json();

        // Fetch instituciones usuario externo
        const institucionesResponse = await fetch('http://localhost:8000/api/institucion-usuario-externo/');
        const institucionesData = await institucionesResponse.json();

        // Fetch demanda-persona data
        const demandaPersonaResponse = await fetch(`http://localhost:8000/api/demanda-persona/?demanda=${demandaId}`);
        const demandaPersonaData = await demandaPersonaResponse.json();

        const nnyaList = [];
        const adultsList = []; // Separate list for adults
        const educacionInstitucionesResponse = await fetch('http://localhost:8000/api/institucion-educativa/');
        const institucionesEducativas = await educacionInstitucionesResponse.json();
        
        const sanitariaInstitucionesResponse = await fetch('http://localhost:8000/api/institucion-sanitaria/');
        const institucionesSanitarias = await sanitariaInstitucionesResponse.json();
        for (const demandaPersona of demandaPersonaData) {
          const personaResponse = await fetch(`http://localhost:8000/api/persona/${demandaPersona.persona}/`);
          const personaData = await personaResponse.json();

          const personaFields = {
            id: personaData.id,
            nombre: personaData.nombre || '',
            apellido: personaData.apellido || '',
            fechaNacimiento: personaData.fecha_nacimiento || null,
            edadAproximada: personaData.edad_aproximada || null, // Fetch Edad Aproximada
            dni: personaData.dni || '', // Fetch DNI
            situacionDni: personaData.situacion_dni || '', // Fetch Situación DNI
            genero: personaData.genero || '', // Fetch Género
            botonAntipanico: personaData.boton_anti_panico || false, // Fetch Botón Antipánico
            observaciones: personaData.observaciones || '', // Fetch Observaciones
            localizacion: personaData.localizacion || {},
            demandaPersonaId: demandaPersona.id,
          };
          // Fetch localización-persona
  let localizacionPersona = null;
  let localizacionDetails = null;

  try {
    const localizacionPersonaResponse = await fetch(`http://localhost:8000/api/localizacion-persona/?persona=${personaData.id}`);
    const localizacionPersonaData = await localizacionPersonaResponse.json();

    if (localizacionPersonaData.length > 0) {
      localizacionPersona = localizacionPersonaData[0];
      
      // Fetch the localización details
      const localizacionResponse = await fetch(`http://localhost:8000/api/localizacion/${localizacionPersona.localizacion}/`);
      localizacionDetails = await localizacionResponse.json();
    }
  } catch (error) {
    console.error(`Error fetching localizacion for persona ${personaData.id}:`, error);
  }
          if (personaData.nnya) {
            const educacionResponse = await fetch(`http://localhost:8000/api/nnya-educacion/?nnya=${personaData.id}`);
            const educacionResults = await educacionResponse.json();
            const educacionData = educacionResults.length > 0 ? educacionResults[0] : null;
          
            const saludResponse = await fetch(`http://localhost:8000/api/nnya-salud/?nnya=${personaData.id}`);
            const saludResults = await saludResponse.json();
            const saludData = saludResults.length > 0 ? saludResults[0] : null;
          // Fetch educational and health institutions


            nnyaList.push({
              ...personaFields,
              educacion: educacionData,
              salud: saludData,
              localizacion: localizacionDetails || {}, // Include localización details

            });
          }
          
           else {
            // Add to adults list
            adultsList.push(personaFields);

          }
        }

        // Fetch demanda-motivo-intervencion data
        const demandaMotivoResponse = await fetch('http://localhost:8000/api/demanda-motivo-intervencion/');
        const demandaMotivoData = await demandaMotivoResponse.json();

        const demandaIdNumber = Number(demandaId);
        const currentDemandaMotivo = demandaMotivoData.find(
          (dm) => dm.demanda === demandaIdNumber
        );

        let currentMotivoIntervencion = null;
        if (currentDemandaMotivo) {
          const motivoResponse = await fetch(
            `http://localhost:8000/api/motivo-intervencion/${currentDemandaMotivo.motivo_intervencion}/`
          );
          currentMotivoIntervencion = await motivoResponse.json();
        }

        // Fetch localizacion details
        let localizacionData = null;
        let selectedBarrio = null;
        let selectedLocalidad = null;
        let selectedCpc = null;

        if (localizacionId) {
          const localizacionResponse = await fetch(
            `http://localhost:8000/api/localizacion/${localizacionId}/`
          );
          localizacionData = await localizacionResponse.json();

          // Fetch specific barrio, localidad, and cpc
          if (localizacionData.barrio) {
            const barrioResponse = await fetch(
              `http://localhost:8000/api/barrio/${localizacionData.barrio}/`
            );
            selectedBarrio = await barrioResponse.json();
          }

          if (localizacionData.localidad) {
            const localidadResponse = await fetch(
              `http://localhost:8000/api/localidad/${localizacionData.localidad}/`
            );
            selectedLocalidad = await localidadResponse.json();
          }

          if (localizacionData.cpc) {
            const cpcResponse = await fetch(
              `http://localhost:8000/api/cpc/${localizacionData.cpc}/`
            );
            selectedCpc = await cpcResponse.json();
          }
        }

        // Fetch all barrios, localidades, and CPCs
        const barriosResponse = await fetch('http://localhost:8000/api/barrio/');
        const barriosData = await barriosResponse.json();

        const localidadesResponse = await fetch('http://localhost:8000/api/localidad/');
        const localidadesData = await localidadesResponse.json();

        const cpcsResponse = await fetch('http://localhost:8000/api/cpc/');
        const cpcsData = await cpcsResponse.json();

        // Prepare and set final API data
        setApiData((prevData) => ({
          ...prevData,
          motivosIntervencion: fetchedMotivos,
          demandaMotivoIntervencion: demandaMotivoData,
          currentMotivoIntervencion,
          usuarioExterno: usuarioExternoData,
          vinculosUsuarioExterno: vinculosData,
          institucionesUsuarioExterno: institucionesData,
          localizacion: {
            ...localizacionData,
            barrio: selectedBarrio?.id || localizacionData?.barrio || '',
            localidad: selectedLocalidad?.id || localizacionData?.localidad || '',
            cpc: selectedCpc?.id || localizacionData?.cpc || '',
            calle: localizacionData.calle || '', // Ensure all fields are included
            tipo_calle: localizacionData.tipo_calle || '',
            piso_depto: localizacionData.piso_depto || '',
            lote: localizacionData.lote || '',
            mza: localizacionData.mza || '',
            casa_nro: localizacionData.casa_nro || '',
            referencia_geo: localizacionData.referencia_geo || '',
          },
          barrios: barriosData,
          localidades: localidadesData,
          cpcs: cpcsData,
          nnyaList,
          adultsList,
          institucionesEducativas, // Include fetched institutions
          institucionesSanitarias, // Include fetched institutions
        }));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [demandaId, localizacionId, usuarioExternoId]);

  const getMotivoIntervencion = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/motivo-intervencion/${id}/`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching motivo intervencion:', error);
      return null;
    }
  };

  return { ...apiData, getMotivoIntervencion };
};
