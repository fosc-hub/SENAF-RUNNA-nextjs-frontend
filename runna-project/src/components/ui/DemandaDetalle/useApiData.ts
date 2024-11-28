import { useState, useEffect } from 'react';
import { getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion';

export const useApiData = (demandaId, localizacionId) => {
  const [apiData, setApiData] = useState({
    motivosIntervencion: [],
    demandaMotivoIntervencion: null,
    currentMotivoIntervencion: null,
    localizacion: {}, // Ensure localizacion contains all fields
    barrios: [],
    localidades: [],
    cpcs: [],
    selectedBarrio: null,
    selectedLocalidad: null,
    selectedCpc: null,
  });

  useEffect(() => {
    if (!demandaId && !localizacionId) return;
  
    const fetchData = async () => {
      try {
        const fetchedMotivos = await getTMotivoIntervencions();
    
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
    
        // Fetch localizacion
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
    
        // Prepare new data object
        const newData = {
          motivosIntervencion: fetchedMotivos,
          demandaMotivoIntervencion: demandaMotivoData,
          currentMotivoIntervencion,
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
        };
        
    
        // Update state with optimized comparison
        setApiData((prevData) => {
          const isDataChanged = JSON.stringify(prevData.localizacion) !== JSON.stringify(newData.localizacion) ||
                                JSON.stringify(prevData) !== JSON.stringify(newData);
        
          if (isDataChanged) {
            return {
              ...prevData,
              ...newData,
              localizacion: {
                ...prevData.localizacion, // Keep previous data
                ...newData.localizacion, // Overwrite with new data
              },
            };
          }
          return prevData; // Return previous state if nothing has changed
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
  
    fetchData();
  }, [demandaId, localizacionId]);
  

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
