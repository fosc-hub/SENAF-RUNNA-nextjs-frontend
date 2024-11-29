import { useState, useEffect } from 'react';
// import { getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion';
import { createLocalizacion, getLocalizacions, getLocalizacion } from '../../../api/TableFunctions/localizacion'
import { createTUsuarioExterno } from '../../../api/TableFunctions/usuarioExterno'
import { createDemand } from '../../../api/TableFunctions/demands'
import { getTBarrio, getTBarrios } from '../../../api/TableFunctions/barrios'
import { getTLocalidads, getTLocalidad } from '../../../api/TableFunctions/localidades'
import { getTProvincias } from '../../../api/TableFunctions/provincias'
import { getTCPC, getTCPCs } from '../../../api/TableFunctions/cpcs'
import { createTPersona, getTPersona, getTPersonas } from '../../../api/TableFunctions/personas'
import { getLocalizacionPersonas, getLocalizacionPersona } from '../../../api/TableFunctions/localizacionPersona'
import { getTMotivoIntervencion, getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion'
import { getTCategoriaMotivos } from '../../../api/TableFunctions/categoriasMotivos'
import { getTCategoriaSubmotivos } from '../../../api/TableFunctions/categoriaSubmotivos'
import { getTGravedadVulneracions } from '../../../api/TableFunctions/gravedadVulneraciones'
import { getTUrgenciaVulneracions } from '../../../api/TableFunctions/urgenciaVulneraciones'
import { getTCondicionesVulnerabilidads } from '../../../api/TableFunctions/condicionesVulnerabilidad'
import { getTVulneracions, getTVulneracion} from '../../../api/TableFunctions/vulneraciones'
import { createTVulneracion} from '../../../api/TableFunctions/vulneraciones'
import { getTInstitucionEducativas} from '../../../api/TableFunctions/institucionesEducativas'
import { getTInstitucionSanitarias} from '../../../api/TableFunctions/institucionesSanitarias'
import { getInstitucionesUsuarioExterno } from '../../../api/TableFunctions/institucionUsuarioExterno' 
import { getVinculosUsuarioExterno } from '../../../api/TableFunctions/vinculoUsuarioExterno'
import { getTUsuariosExternos, getTUsuarioExterno } from '../../../api/TableFunctions/usuarioExterno'
import { getTVinculos} from '../../../api/TableFunctions/vinculos'
import { createTVinculoPersonaPersona } from '../../../api/TableFunctions/vinculospersonaspersonas'
import { getTVinculoUsuarioLinea, getTVinculoUsuarioLineas } from '../../../api/TableFunctions/vinculoUsuarioLinea'
import { getTDemandaPersonas, getTDemandaPersona } from '../../../api/TableFunctions/demandaPersonas';
import { getTNNyASalud, getTNNyASaluds } from '../../../api/TableFunctions/nnyaSalud';
import { getTNNyAEducacion, getTNNyAEducacions } from '../../../api/TableFunctions/nnyaeducacion';
import { getTDemandaMotivoIntervencion, getTDemandaMotivoIntervencions } from '../../../api/TableFunctions/demandasMotivoIntervencion';



export const useApiData = (demandaId, localizacionId, usuarioExternoId) => {
  

  const [apiData, setApiData] = useState({
    motivosIntervencion: [],
    demandaMotivoIntervencion: null,
    currentMotivoIntervencion: null,
    localizacion: {},
    barrios: [],
    localidades: [],
    cpcs: [],
    vulneraciones: [], // Add this
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
        const categoriaSubmotivos = await getTCategoriaSubmotivos();
        const categoriaMotivos = await getTCategoriaMotivos();
        const fetchedMotivos = await getTMotivoIntervencions();
        const gravedadVulneraciones = await getTGravedadVulneracions();
        const urgenciaVulneraciones = await getTUrgenciaVulneracions();
        const vulneraciones = await getTVulneracions({ demanda: demandaId });
        const detailedVulneraciones = vulneraciones.length
          ? await Promise.all(
              vulneraciones.map(async (vulneracion) => {
                try {
                  const details = await getTVulneracion(vulneracion.id);
                  return { ...vulneracion, ...details };
                } catch (error) {
                  console.error(`Error fetching details for vulneracion ${vulneracion.id}:`, error);
                  return vulneracion; // Return base vulneracion if details fail
                }
              })
            )
          : [];
      

        
        
        

        let usuarioExternoData = null;
        if (usuarioExternoId) {
          const usuarioExternoData = await getTUsuarioExterno(usuarioExternoId);
        }

        // Fetch vinculos usuario externo
        const vinculosData = await getTVinculoUsuarioLineas();

        // Fetch instituciones usuario externo
        const institucionesData = await getInstitucionesUsuarioExterno();

        // Fetch demanda-persona data
        const demandaPersonaData = await getTDemandaPersonas({ demanda: demandaId });

        const nnyaList = [];
        const adultsList = []; // Separate list for adults
        const institucionesEducativas = await getTInstitucionEducativas();
        
        const institucionesSanitarias = await getTInstitucionSanitarias();

        for (const demandaPersona of demandaPersonaData) {
          const personaData = await getTPersona(demandaPersona.persona);
        
          const personaFields = {
            id: personaData.id,
            nombre: personaData.nombre || '',
            apellido: personaData.apellido || '',
            fechaNacimiento: personaData.fecha_nacimiento || null,
            edadAproximada: personaData.edad_aproximada || null,
            dni: personaData.dni || '',
            situacionDni: personaData.situacion_dni || '',
            genero: personaData.genero || '',
            botonAntipanico: personaData.boton_anti_panico || false,
            observaciones: personaData.observaciones || '',
            conviviente: personaData.conviviente || false,
            supuesto_autordv: personaData.supuesto_autordv || false, // Specific to adults
            localizacion: {}, // Placeholder for localization
            demandaPersonaId: demandaPersona.id,
          };
        
          // Fetch localization for adults and NNYA
          try {
            const localizacionPersonaData = await getLocalizacionPersonas({ persona: personaData.id });
        
            if (localizacionPersonaData.length > 0) {
              personaFields.localizacion = await getLocalizacion(localizacionPersonaData[0].localizacion);
            }
          } catch (error) {
            console.error(`Error fetching localization for persona ${personaData.id}:`, error);
          }
        
          if (personaData.adulto) {
            adultsList.push(personaFields);
          }
        }
        
        for (const demandaPersona of demandaPersonaData) {
          const personaData = await getTPersona(demandaPersona.persona);

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
    const localizacionPersonaData = await getLocalizacionPersonas({ persona: personaData.id });

    if (localizacionPersonaData.length > 0) {
      localizacionPersona = localizacionPersonaData[0];
      
      // Fetch the localización details
      localizacionDetails = await getLocalizacion(localizacionPersona.localizacion);
    }
  } catch (error) {
    console.error(`Error fetching localizacion for persona ${personaData.id}:`, error);
  }
          if (personaData.nnya) {
            const educacionResults = await getTNNyAEducacions({ nnya: personaData.id });
            const educacionData = educacionResults.length > 0 ? educacionResults[0] : null;
          
            const saludResults = await getTNNyASaluds({ nnya: personaData.id });
            const saludData = saludResults.length > 0 ? saludResults[0] : null;
          // Fetch educational and health institutions


            nnyaList.push({
              ...personaFields,
              educacion: educacionData,
              salud: saludData,
              localizacion: localizacionDetails || {}, // Include localización details

            });
          }
        }

        // Fetch demanda-motivo-intervencion data
        const demandaMotivoData = await getTDemandaMotivoIntervencions();

        const demandaIdNumber = Number(demandaId);
        const currentDemandaMotivo = demandaMotivoData.find(
          (dm) => dm.demanda === demandaIdNumber
        );

        let currentMotivoIntervencion = null;
        if (currentDemandaMotivo) {
          const currentMotivoIntervencion = await getTMotivoIntervencion(currentDemandaMotivo.motivo_intervencion);
        }

        // Fetch localizacion details
        let localizacionData = null;
        let selectedBarrio = null;
        let selectedLocalidad = null;
        let selectedCpc = null;

        if (localizacionId) {
          localizacionData = await getLocalizacion(localizacionId);

          // Fetch specific barrio, localidad, and cpc
          if (localizacionData.barrio) {
            selectedBarrio = await getTBarrio(localizacionData.barrio);
          }

          if (localizacionData.localidad) {
            selectedLocalidad = await getTLocalidad(localizacionData.localidad);
          }

          if (localizacionData.cpc) {
            selectedCpc = await getTCPC(localizacionData.cpc);
          }
        }

        // Fetch all barrios, localidades, and CPCs
        const barriosData = await getTBarrios();
        // const barriosData = barriosResponse;

        const localidadesData = await getTLocalidads();
        // const localidadesData = await localidadesResponse.json();

        const cpcsData = await getTCPCs();
        // const cpcsData = await cpcsResponse.json();

        // Prepare and set final API data
        setApiData((prevData) => ({
          ...prevData,
          categoriaSubmotivos, // Add fetched submotivos to the state
          categoriaMotivos, // Add fetched data to apiData state
          vulneraciones: detailedVulneraciones,
          gravedadVulneraciones, // Add fetched data to the state
          urgenciaVulneraciones, // Add fetched data to the state
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
      return await getTMotivoIntervencion(id);
    } catch (error) {
      console.error('Error fetching motivo intervencion:', error);
      return null;
    }
  };

  return { ...apiData, getMotivoIntervencion };
};
