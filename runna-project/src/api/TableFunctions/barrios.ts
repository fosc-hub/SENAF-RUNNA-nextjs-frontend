import { getAll, getOne, create, update, remove } from '../globals';
import { TBarrio } from '../interfaces';

const endpoint = 'barrio';

export const getTBarrios = () => getAll<TBarrio>(endpoint);
export const getTBarrio = (id: number) => getOne<TBarrio>(endpoint, id);
export const createTBarrio = (data: Partial<TBarrio>) => create<TBarrio>(endpoint, data);
export const updateTBarrio = (id: number, data: Partial<TBarrio>) => update<TBarrio>(endpoint, id, data);
export const deleteTBarrio = (id: number) => remove(endpoint, id);
