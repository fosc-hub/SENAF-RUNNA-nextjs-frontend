import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TDemanda } from '../interfaces';
import axiosInstance from '../utils/axiosInstance';

const endpoint = 'demanda';

export const getDemands = (filters?: Record<string, any>) =>
    getAll<TDemanda>(endpoint, filters);
export const getDemand = (id: number) => getOne<TDemanda>(endpoint, id);
export const createDemand = (data: Partial<TDemanda>, showToast: boolean = false, toastMessage: string = '¡Registro creado con exito!') => create<TDemanda>(endpoint, data, showToast, toastMessage);
export const updateDemand = (id: number, data: Partial<TDemanda>, showToast: boolean = false, toastMessage: string = '¡Registro modificado con exito!' ) => update<TDemanda>(endpoint, id, data, showToast, toastMessage);
export const deleteDemand = (id: number) => remove(endpoint, id);

/**
 * Interface for the comprehensive demanda response including valoraciones_seleccionadas
 */
export interface TDemandaFullDetail extends TDemanda {
  latest_evaluacion?: any;
  indicadores_valoracion?: Array<{
    id: number;
    nombre: string;
    descripcion: string | null;
    peso: number;
  }>;
  valoraciones_seleccionadas?: Array<{
    indicador: number;
    checked: boolean;
  }>;
  scores?: any[];
  evaluaciones?: any[];
  demandas_vinculadas?: any[];
  actividades?: any[];
  respuestas?: any[];
  codigos_demanda?: any[];
  localidad_usuario?: any;
  rol_usuario?: string;
  nombre_usuario?: string;
  apellido_usuario?: string;
  personas?: any[];
  [key: string]: any;
}

/**
 * Get comprehensive demanda details including previously saved indicator evaluations
 * @param id Demanda ID
 * @returns Complete demanda information with valoraciones_seleccionadas
 */
export const getDemandFullDetail = async (id: number): Promise<TDemandaFullDetail> => {
  const response = await axiosInstance.get<TDemandaFullDetail>(`${endpoint}/${id}/full-detail/`);
  return response.data;
};
