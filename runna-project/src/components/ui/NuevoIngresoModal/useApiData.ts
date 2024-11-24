import { useState, useEffect } from 'react'
import { createLocalizacion } from '../../../api/TableFunctions/localizacion'
import { getTUsuariosExternos } from '../../../api/TableFunctions/usuarioExterno'
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
      condicionesVulnerabilidad: [],
      vulneraciones: [],
      institucionesEducativas: [],
      institucionesSanitarias: []
    })
  
    useEffect(() => {
      const fetchData = async () => {
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
            fetchedCondiciones,
            fetchedVulneraciones,
            fetchedInstitucionesEducativas,
            fetchedInstitucionesSanitarias
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
            getTCondicionesVulnerabilidads(),
            getTVulneracions(),
            getTInstitucionEducativas(),
            getTInstitucionSanitarias()
          ])
  
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
            condicionesVulnerabilidad: fetchedCondiciones,
            vulneraciones: fetchedVulneraciones,
            institucionesEducativas: fetchedInstitucionesEducativas,
            institucionesSanitarias: fetchedInstitucionesSanitarias
          })
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
  
      fetchData()
    }, [])
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
    
      return { ...apiData, addVulneracion }
    }
  