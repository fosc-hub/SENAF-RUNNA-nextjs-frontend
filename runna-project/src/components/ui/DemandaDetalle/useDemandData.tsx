import { useState, useEffect } from 'react';
import { getOrigens } from '../../../api/TableFunctions/origenDemanda';
import { getSubOrigens } from '../../../api/TableFunctions/subOrigen';
import { getTInstitucionDemands } from '../../../api/TableFunctions/institucionDemanda';
import { TOrigen, TSubOrigen, TInstitucionDemanda, TUsuarioExterno } from '../../../api/interfaces';
import { getTUsuariosExternos } from '../../../api/TableFunctions/usuarioExterno';
import { getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion';
import { getTDemandaMotivoIntervencions } from '../../../api/TableFunctions/demandasMotivoIntervencion';

const useDemandData = (demanda) => {
  const [origenes, setOrigenes] = useState<TOrigen[]>([]);
  const [subOrigenes, setSubOrigenes] = useState<TSubOrigen[]>([]);
  const [instituciones, setInstituciones] = useState<TInstitucionDemanda[]>([]);
  const [informante, setInformante] = useState<TUsuarioExterno[]>([]);
  const [motivosIntervencion, setMotivosIntervencion] = useState([]);
  const [selectedMotivo, setSelectedMotivo] = useState(null);

  const [selectedData, setSelectedData] = useState({
    origen: null,
    subOrigen: null,
    institucion: null,
  });
  const [selectedInformante, setSelectedInformante] = useState<TUsuarioExterno | null>(null);

  useEffect(() => {
    const fetchDemandData = async () => {
      try {
        // Fetch general data
        const [
          origenData,
          subOrigenData,
          institucionData,
          informanteData,
          motivoData,
        ] = await Promise.all([
          getOrigens(),
          getSubOrigens(),
          getTInstitucionDemands(),
          getTUsuariosExternos(),
          getTMotivoIntervencions(),
        ]);

        setOrigenes(origenData);
        setSubOrigenes(subOrigenData);
        setInstituciones(institucionData);
        setInformante(informanteData);
        setMotivosIntervencion(motivoData);

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
  };
};

export default useDemandData;
