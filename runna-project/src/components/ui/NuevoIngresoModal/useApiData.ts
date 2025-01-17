import { useState, useEffect } from 'react'
import { createLocalizacion } from '../../../api/TableFunctions/localizacion'
import { createTUsuarioExterno } from '../../../api/TableFunctions/usuarioExterno'
import { createDemand } from '../../../api/TableFunctions/demands'
import { getTBarrios } from '../../../api/TableFunctions/barrios'
import { getTLocalidads } from '../../../api/TableFunctions/localidades'
import { getTProvincias } from '../../../api/TableFunctions/provincias'
import { getTCPCs } from '../../../api/TableFunctions/cpcs'
import { createTPersona } from '../../../api/TableFunctions/personas'
import { getTMotivoIntervencions } from '../../../api/TableFunctions/motivoIntervencion'
import { getTCategoriaMotivos } from '../../../api/TableFunctions/categoriasMotivos'
import { getTCategoriaSubmotivos } from '../../../api/TableFunctions/categoriaSubmotivos'
import { getTGravedadVulneracions } from '../../../api/TableFunctions/gravedadVulneraciones'
import { getTUrgenciaVulneracions } from '../../../api/TableFunctions/urgenciaVulneraciones'
import { getTCondicionesVulnerabilidads } from '../../../api/TableFunctions/condicionesVulnerabilidad'
import {getTVulneracions} from '../../../api/TableFunctions/vulneraciones'
import {createTVulneracion} from '../../../api/TableFunctions/vulneraciones'
import {getTInstitucionEducativas} from '../../../api/TableFunctions/institucionesEducativas'
import {getTInstitucionSanitarias} from '../../../api/TableFunctions/institucionesSanitarias'
import { getTUsuariosExternos } from '../../../api/TableFunctions/usuarioExterno'
import {getTVinculos} from '../../../api/TableFunctions/vinculos'
import { createTVinculoPersonaPersona } from '../../../api/TableFunctions/vinculospersonaspersonas'
import {getTInstitucionDemands} from '../../../api/TableFunctions/institucionDemanda'
import { getOrigens } from '../../../api/TableFunctions/origenDemanda'
import { getSubOrigens } from '../../../api/TableFunctions/subOrigen'
import { get } from 'http'

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
    })
  
    useEffect(() => {
      const fetchData = async () => {
          try {
              const [
                  fetchedUsuariosExternos,
                  fetchedBarrios,
                  fetchedLocalidades,
                  fetchedProvincias,
                  fetchedCpcs,
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
                  fetchedOrigenes,
                  fetchedSubOrigenes,
                  fetchedInstitucionesDemanda,
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
                  usuariosExternos: fetchedUsuariosExternos,
                  barrios: fetchedBarrios,
                  localidades: fetchedLocalidades,
                  provincias: fetchedProvincias,
                  cpcs: fetchedCpcs,
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
                  origenes: fetchedOrigenes,
                  subOrigenes: fetchedSubOrigenes,
                  institucionesDemanda: fetchedInstitucionesDemanda,
              });
          } catch (error) {
              console.error('Error fetching API data:', error);
          }
      };

      fetchData();
  }, []);
    const addVulneracion = async (vulneracionData) => {
        try {
          // Create a new object with only the necessary data
          const serializableVulneracionData = {
            principal_demanda: vulneracionData.principal_demanda,
            transcurre_actualidad: vulneracionData.transcurre_actualidad,
            categoria_motivo: vulneracionData.categoria_motivo,
            categoria_submotivo: vulneracionData.categoria_submotivo,
            gravedad_vulneracion: vulneracionData.gravedad_vulneracion,
            urgencia_vulneracion: vulneracionData.urgencia_vulneracion,
            nnya: vulneracionData.nnya,
            autor_dv: vulneracionData.autor_dv,
            demanda: vulneracionData.demanda,
          }
    
          const newVulneracion = await createTVulneracion(serializableVulneracionData)
          setApiData(prevData => ({
            ...prevData,
            vulneraciones: [...prevData.vulneraciones, newVulneracion]
          }))
          return newVulneracion
        } catch (error) {
          console.error('Error creating vulneracion:', error)
          throw new Error('Failed to create data in vulneracion.')
        }
      }
      const addUsuarioExterno = async (usuarioExternoData) => {
        try {
          const newUsuarioExterno = await createTUsuarioExterno(usuarioExternoData)
          setApiData(prevData => ({
            ...prevData,
            usuariosExternos: [...prevData.usuariosExternos, newUsuarioExterno]
          }))
          return newUsuarioExterno
        } catch (error) {
          console.error('Error creating usuario externo:', error)
          throw error
        }
      }
      const addVinculoPersonaPersona = async (vinculoPersonaPersonaData) => {
        try {
          const newVinculoPersonaPersona = await createTVinculoPersonaPersona(vinculoPersonaPersonaData)
          return newVinculoPersonaPersona
        } catch (error) {
          console.error('Error creating vinculo persona persona:', error)
          throw error
        }
      }
      return { ...apiData, addVulneracion, addUsuarioExterno, addVinculoPersonaPersona }
    }
