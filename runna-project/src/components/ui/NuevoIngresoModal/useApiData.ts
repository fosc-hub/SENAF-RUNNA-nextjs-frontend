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
          })
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
  
      fetchData()
    }, [])
  
    return apiData
  }
  
  