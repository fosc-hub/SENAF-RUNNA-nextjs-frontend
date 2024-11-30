import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TActividad } from '../interfaces';

const endpoint = 'actividad';

export const getTActividades = (filters?: Record<string, any>) =>
    getAll<TActividad>(endpoint, filters);
export const getTActividad = (id: number) => getOne<TActividad>(endpoint, id);
export const createTActividad = (data: Partial<TActividad>) => create<TActividad>(endpoint, data);
export const updateTActividad = (id: number, data: Partial<TActividad>) => update<TActividad>(endpoint, id, data);
export const deleteTActividad = (id: number) => remove(endpoint, id);
