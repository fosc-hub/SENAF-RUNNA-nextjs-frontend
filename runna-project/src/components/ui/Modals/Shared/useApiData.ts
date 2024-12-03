import { useState, useEffect } from 'react'
import { createLocalizacion } from '../../../../api/TableFunctions/localizacion'
import { createTUsuarioExterno } from '../../../../api/TableFunctions/usuarioExterno'
import { createDemand } from '../../../../api/TableFunctions/demands'
import { getTBarrios } from '../../../../api/TableFunctions/barrios'
import { getTLocalidads } from '../../../../api/TableFunctions/localidades'
import { getTProvincias } from '../../../../api/TableFunctions/provincias'
import { getTCPCs } from '../../../../api/TableFunctions/cpcs'
import { createTPersona } from '../../../../api/TableFunctions/personas'
import { getTMotivoIntervencions } from '../../../../api/TableFunctions/motivoIntervencion'
import { getTCategoriaMotivos } from '../../../../api/TableFunctions/categoriasMotivos'
import { getTCategoriaSubmotivos } from '../../../../api/TableFunctions/categoriaSubmotivos'
import { getTGravedadVulneracions } from '../../../../api/TableFunctions/gravedadVulneraciones'
import { getTUrgenciaVulneracions } from '../../../../api/TableFunctions/urgenciaVulneraciones'
import { getTCondicionesVulnerabilidads } from '../../../../api/TableFunctions/condicionesVulnerabilidad'
import {getTVulneracions} from '../../../../api/TableFunctions/vulneraciones'
import {createTVulneracion} from '../../../../api/TableFunctions/vulneraciones'
import {getTInstitucionEducativas} from '../../../../api/TableFunctions/institucionesEducativas'
import {getTInstitucionSanitarias} from '../../../../api/TableFunctions/institucionesSanitarias'
import { getTUsuariosExternos } from '../../../../api/TableFunctions/usuarioExterno'
import {getTVinculos} from '../../../../api/TableFunctions/vinculos'
import { createTVinculoPersonaPersona } from '../../../../api/TableFunctions/vinculospersonaspersonas'
import {getTInstitucionDemands} from '../../../../api/TableFunctions/institucionDemanda'
import { getOrigens } from '../../../../api/TableFunctions/origenDemanda'
import { getSubOrigens } from '../../../../api/TableFunctions/subOrigen'// Adjust the path as necessary

export const useApiData = () => {
  const [apiData, setApiData] = useState({
    usuariosExternos: [],
    barrios: [],
    localidades: [],
    provincias: [],
    cpcs: [],
    motivosIntervencion: [],
    categoriaMotivos: [],
    categoriaSubmotivos: [],
    gravedadVulneraciones: [],
    urgenciaVulneraciones: [],
    condicionesVulnerabilidadNNyA: [],
    condicionesVulnerabilidadAdultos: [],
    vulneraciones: [],
    institucionesEducativas: [],
    institucionesSanitarias: [],
    vinculoPersonas: [],
    origenes: [],
    subOrigenes: [],
    institucionesDemanda: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          fetchedUsuarios,
          fetchedBarrios,
          fetchedLocalidades,
          fetchedProvincias,
          fetchedCPCs,
          fetchedMotivos,
          fetchedCategoriaMotivos,
          fetchedCategoriaSubmotivos,
          fetchedGravedades,
          fetchedUrgencias,
          fetchedCondicionesNNyA,
          fetchedCondicionesAdultos,
          fetchedVulneraciones,
          fetchedInstitucionesEducativas,
          fetchedInstitucionesSanitarias,
          fetchedVinculosPersonas,
          fetchedOrigens,
          fetchedSubOrigens,
          fetchedInstitucionesDemands,
        ] = await Promise.all([
          getTUsuariosExternos(),
          getTBarrios(),
          getTLocalidads(),
          getTProvincias(),
          getTCPCs(),
          getTMotivoIntervencions(),
          getTCategoriaMotivos(),
          getTCategoriaSubmotivos(),
          getTGravedadVulneracions(),
          getTUrgenciaVulneracions(),
          getTCondicionesVulnerabilidads({ nnya: true }),
          getTCondicionesVulnerabilidads({ adulto: true }),
          getTVulneracions(),
          getTInstitucionEducativas(),
          getTInstitucionSanitarias(),
          getTVinculos(),
          getOrigens(),
          getSubOrigens(),
          getTInstitucionDemands(),
        ]);

        setApiData({
          usuariosExternos: fetchedUsuarios,
          barrios: fetchedBarrios,
          localidades: fetchedLocalidades,
          provincias: fetchedProvincias,
          cpcs: fetchedCPCs,
          motivosIntervencion: fetchedMotivos,
          categoriaMotivos: fetchedCategoriaMotivos,
          categoriaSubmotivos: fetchedCategoriaSubmotivos,
          gravedadVulneraciones: fetchedGravedades,
          urgenciaVulneraciones: fetchedUrgencias,
          condicionesVulnerabilidadNNyA: fetchedCondicionesNNyA,
          condicionesVulnerabilidadAdultos: fetchedCondicionesAdultos,
          vulneraciones: fetchedVulneraciones,
          institucionesEducativas: fetchedInstitucionesEducativas,
          institucionesSanitarias: fetchedInstitucionesSanitarias,
          vinculoPersonas: fetchedVinculosPersonas,
          origenes: fetchedOrigens,
          subOrigenes: fetchedSubOrigens,
          institucionesDemanda: fetchedInstitucionesDemands,
        });
      } catch (err) {
        setError(err.message || 'Error fetching API data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addVulneracion = async (vulneracionData) => {
    try {
      const newVulneracion = await createTVulneracion(vulneracionData);
      setApiData((prev) => ({
        ...prev,
        vulneraciones: [...prev.vulneraciones, newVulneracion],
      }));
      return newVulneracion;
    } catch (err) {
      console.error('Error creating vulneracion:', err);
      throw new Error('Failed to create vulneracion.');
    }
  };

  const addUsuarioExterno = async (usuarioExternoData) => {
    try {
      const newUsuarioExterno = await createTUsuarioExterno(usuarioExternoData);
      setApiData((prev) => ({
        ...prev,
        usuariosExternos: [...prev.usuariosExternos, newUsuarioExterno],
      }));
      return newUsuarioExterno;
    } catch (err) {
      console.error('Error creating usuario externo:', err);
      throw err;
    }
  };

  const addVinculoPersonaPersona = async (vinculoPersonaPersonaData) => {
    try {
      const newVinculo = await createTVinculoPersonaPersona(vinculoPersonaPersonaData);
      return newVinculo;
    } catch (err) {
      console.error('Error creating vinculo persona persona:', err);
      throw err;
    }
  };

  return { ...apiData, isLoading, error, addVulneracion, addUsuarioExterno, addVinculoPersonaPersona };
};
