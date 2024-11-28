import { useState, useEffect } from 'react'
import { getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion'

export const useApiData = (demandaId) => {
  const [apiData, setApiData] = useState({
    motivosIntervencion: [],
    demandaMotivoIntervencion: null,
    currentMotivoIntervencion: null,
  })

  useEffect(() => {
    if (!demandaId) return;
  
    const fetchData = async () => {
      try {
        const fetchedMotivos = await getTMotivoIntervencions();
        const demandaMotivoResponse = await fetch('http://localhost:8000/api/demanda-motivo-intervencion/');
        const demandaMotivoData = await demandaMotivoResponse.json();
  
        const demandaIdNumber = Number(demandaId);
        const currentDemandaMotivo = demandaMotivoData.find(dm => dm.demanda === demandaIdNumber);
        let currentMotivoIntervencion = null;
  
        if (currentDemandaMotivo) {
          const motivoResponse = await fetch(`http://localhost:8000/api/motivo-intervencion/${currentDemandaMotivo.motivo_intervencion}/`);
          currentMotivoIntervencion = await motivoResponse.json();
        }
  
        setApiData(prevData => {
          if (
            JSON.stringify(prevData) !== JSON.stringify({
              motivosIntervencion: fetchedMotivos,
              demandaMotivoIntervencion: demandaMotivoData,
              currentMotivoIntervencion,
            })
          ) {
            return {
              motivosIntervencion: fetchedMotivos,
              demandaMotivoIntervencion: demandaMotivoData,
              currentMotivoIntervencion,
            };
          }
          return prevData; // Avoid state updates if data hasn't changed
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [demandaId]);
  

  const getMotivoIntervencion = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/motivo-intervencion/${id}/`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching motivo intervencion:', error)
      return null
    }
  }

  return { ...apiData, getMotivoIntervencion }
}

