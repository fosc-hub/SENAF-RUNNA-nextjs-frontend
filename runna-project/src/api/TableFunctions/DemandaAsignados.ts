import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TDemandaAsignado } from '../interfaces';

const endpoint = 'demanda-asignado';

export const getTDemandaAsignados = () => getAll<TDemandaAsignado>(endpoint);
export const getTDemandaAsignado = (id: number) => getOne<TDemandaAsignado>(endpoint, id);
export const createTDemandaAsignado = (data: Partial<TDemandaAsignado>) => create<TDemandaAsignado>(endpoint, data);
export const updateTDemandaAsignado = (id: number, data: Partial<TDemandaAsignado>) => update<TDemandaAsignado>(endpoint, id, data);
export const deleteTDemandaAsignado = (id: number) => remove(endpoint, id);
