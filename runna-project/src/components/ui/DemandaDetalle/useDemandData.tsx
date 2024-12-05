import { useState, useEffect } from 'react';
import { getOrigens } from '../../../api/TableFunctions/origenDemanda';
import { getSubOrigens } from '../../../api/TableFunctions/subOrigen';
import { getTInstitucionDemands } from '../../../api/TableFunctions/institucionDemanda';
import { TOrigen, TSubOrigen, TInstitucionDemanda, TUsuarioExterno } from '../../../api/interfaces';
import { getTUsuariosExternos } from '../../../api/TableFunctions/usuarioExterno';
import { getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion';
import { getTDemandaMotivoIntervencions } from '../../../api/TableFunctions/demandasMotivoIntervencion';
import { getTBarrios } from '../../../api/TableFunctions/barrios';
import { getTCPCs } from '../../../api/TableFunctions/cpcs';
import { getTLocalidads } from '../../../api/TableFunctions/localidades';
import { getLocalizacion } from '../../../api/TableFunctions/localizacion';
import { getTDemandaPersonas } from '../../../api/TableFunctions/demandaPersonas';
import { getTPersona } from '../../../api/TableFunctions/personas';
import { getLocalizacionPersona } from '../../../api/TableFunctions/localizacionPersona';

const useDemandData = (demanda) => {
  const [origenes, setOrigenes] = useState<TOrigen[]>([]);
  const [subOrigenes, setSubOrigenes] = useState<TSubOrigen[]>([]);
  const [instituciones, setInstituciones] = useState<TInstitucionDemanda[]>([]);
  const [informante, setInformante] = useState<TUsuarioExterno[]>([]);
  const [motivosIntervencion, setMotivosIntervencion] = useState([]);
  const [selectedMotivo, setSelectedMotivo] = useState(null);
  const [localizacion, setLocalizacion] = useState(null);
  const [barrios, setBarrios] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [cpcs, setCpcs] = useState([]);
  const [nnyaList, setNnyaList] = useState([]); // NNYA data
  const [adultsList, setAdultsList] = useState([]); // Adultos convivientes
  const [localizacionesPersonas, setLocalizacionesPersonas] = useState({}); // Keyed by persona ID
  const [selectedData, setSelectedData] = useState({
    origen: null,
    subOrigen: null,
    institucion: null,
  });
  const [selectedInformante, setSelectedInformante] = useState<TUsuarioExterno | null>(null);
  useEffect(() => {
    const fetchPersonaData = async () => {
      try {
        if (demanda?.id) {
          // Fetch demanda-persona data
          const demandaPersonaData = await getTDemandaPersonas({ demanda: demanda.id });

          // Split into NNYA and adultos convivientes
          const nnyaEntries = demandaPersonaData.filter((entry) => entry.nnya_principal);
          const adultEntries = demandaPersonaData.filter((entry) => entry.conviviente);

          // Fetch full persona data for NNYA
          const fetchedNnya = await Promise.all(
            nnyaEntries.map(async (entry) => {
              const personaData = await getTPersona(entry.persona);

              // Fetch `localizacion-persona` for the persona
              const localizacionPersona = await getLocalizacionPersona(entry.persona).catch(() => null);

              return {
                ...personaData,
                demandaPersonaId: entry.id,
                localizacionPersona,
              };
            })
          );

          // Fetch full persona data for adultos convivientes
          const fetchedAdults = await Promise.all(
            adultEntries.map(async (entry) => {
              const personaData = await getTPersona(entry.persona);

              // Fetch `localizacion-persona` for the persona
              const localizacionPersona = await getLocalizacionPersona(entry.persona).catch(() => null);

              return {
                ...personaData,
                demandaPersonaId: entry.id,
                localizacionPersona,
              };
            })
          );

          setNnyaList(fetchedNnya);
          setAdultsList(fetchedAdults);
        }
      } catch (error) {
        console.error('Error fetching persona-related data:', error);
      }
    };

    fetchPersonaData();
  }, [demanda]);
  useEffect(() => {
    const fetchDemandData = async () => {
      try {

        const [
          origenData,
          subOrigenData,
          institucionData,
          informanteData,
          motivoData,
          barrioData,
          localidadData,
          cpcData,
        ] = await Promise.all([
          getOrigens(),
          getSubOrigens(),
          getTInstitucionDemands(),
          getTUsuariosExternos(),
          getTMotivoIntervencions(),
          getTBarrios(),
          getTLocalidads(),
          getTCPCs(),
        ]);

        setOrigenes(origenData);
        setSubOrigenes(subOrigenData);
        setInstituciones(institucionData);
        setInformante(informanteData);
        setMotivosIntervencion(motivoData);
        setBarrios(barrioData);
        setLocalidades(localidadData);
        setCpcs(cpcData);

        // Preselect dropdown values based on demanda
        setSelectedData({
          origen: origenData.find((origen) => origen.id === demanda?.origen) || null,
          subOrigen: subOrigenData.find((subOrigen) => subOrigen.id === demanda?.sub_origen) || null,
          institucion: institucionData.find((institucion) => institucion.id === demanda?.institucion) || null,
        });

        setSelectedInformante(
          informanteData.find((inf) => inf.id === demanda?.informante) || null
        );

        // Fetch associated motivoIntervencion for the given demanda ID
        if (demanda?.id) {
          const demandaMotivoData = await getTDemandaMotivoIntervencions({ demanda: demanda.id });
          if (demandaMotivoData.length > 0) {
            const motivoId = demandaMotivoData[0].motivo_intervencion;
            setSelectedMotivo(motivoData.find((motivo) => motivo.id === motivoId) || null);
          }
        }


        if (demanda?.localizacion) {
            console.log("Fetching localizacion with ID:", demanda.localizacion);
            const localizacionData = await getLocalizacion(demanda.localizacion);
            console.log("Fetched localizacion data:", localizacionData);
            setLocalizacion(localizacionData);
            
          } else {
            
            console.log("No localizacion ID provided in demanda");
          }
          
      } catch (error) {
        console.error('Error fetching demand-related data:', error);
      }
    };

    if (demanda) {
      fetchDemandData();
    }
  }, [demanda]);

  return {
    nnyaList,
    adultsList,
    origenes,
    subOrigenes,
    instituciones,
    informante,
    motivosIntervencion,
    selectedData,
    selectedInformante,
    selectedMotivo,
    localizacion,
    barrios,
    localidades,
    cpcs,
    localizacionesPersonas 
  };
};

export default useDemandData;
