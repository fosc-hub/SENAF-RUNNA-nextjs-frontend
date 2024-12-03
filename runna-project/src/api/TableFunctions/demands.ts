import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TDemanda } from '../interfaces';

const endpoint = 'demanda';

export const getDemands = () => getAll<TDemanda>(endpoint);
export const getDemand = (id: number) => getOne<TDemanda>(endpoint, id);
export const createDemand = (data: Partial<TDemanda>, showToast: boolean = false, toastMessage: string = '¡Registro modificado con exito!') => create<TDemanda>(endpoint, data, showToast, toastMessage);
export const updateDemand = (id: number, data: Partial<TDemanda>) => update<TDemanda>(endpoint, id, data);
export const deleteDemand = (id: number) => remove(endpoint, id);
