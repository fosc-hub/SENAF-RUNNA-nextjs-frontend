import { useState, useEffect } from 'react';
import { getOrigens } from '../../../api/TableFunctions/origenDemanda';
import { getSubOrigens } from '../../../api/TableFunctions/subOrigen';
import { getTInstitucionDemands } from '../../../api/TableFunctions/institucionDemanda';
import { TOrigen, TSubOrigen, TInstitucionDemanda } from '../../../api/interfaces';
const useDemandData = (demandaId: number) => {
  const [origenes, setOrigenes] = useState<TOrigen[]>([]);
  const [subOrigenes, setSubOrigenes] = useState<TSubOrigen[]>([]);
  const [instituciones, setInstituciones] = useState<TInstitucionDemanda[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [origenData, subOrigenData, institucionData] = await Promise.all([
          getOrigens(),
          getSubOrigens(),
          getTInstitucionDemands(),
        ]);
  
        console.log("Origenes:", origenData); // Check API response for origenes
        console.log("SubOrigenes:", subOrigenData); // Check API response for subOrigenes
        console.log("Instituciones:", institucionData); // Check API response for instituciones
  
        setOrigenes(origenData);
        setSubOrigenes(subOrigenData);
        setInstituciones(institucionData);
      } catch (error) {
        console.error('Error fetching demand-related data:', error);
      }
    };
  
    if (demandaId) {
      fetchData();
    }
  }, [demandaId]);
  

  return { origenes, subOrigenes, instituciones };
};

export default useDemandData;
