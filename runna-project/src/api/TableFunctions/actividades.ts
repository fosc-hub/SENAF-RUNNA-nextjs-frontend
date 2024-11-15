import { getAll, getOne, create, update, remove } from '../globals';
import { TActividad } from '../interfaces';

const endpoint = 'tactividad';

export const getTActividades = () => getAll<TActividad>(endpoint);
export const getTActividad = (id: number) => getOne<TActividad>(endpoint, id);
export const createTActividad = (data: Partial<TActividad>) => create<TActividad>(endpoint, data);
export const updateTActividad = (id: number, data: Partial<TActividad>) => update<TActividad>(endpoint, id, data);
export const deleteTActividad = (id: number) => remove(endpoint, id);
