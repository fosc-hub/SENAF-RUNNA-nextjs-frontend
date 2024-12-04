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
  const [selectedData, setSelectedData] = useState({
    origen: null,
    subOrigen: null,
    institucion: null,
  });
  const [selectedInformante, setSelectedInformante] = useState<TUsuarioExterno | null>(null);

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
  };
};

export default useDemandData;
