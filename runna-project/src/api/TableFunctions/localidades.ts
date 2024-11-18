import { getAll, getOne, create, update, remove } from '../globals';
import { TLocalidad } from '../interfaces';

const endpoint = 'localidad';

export const getTLocalidads = () => getAll<TLocalidad>(endpoint);
export const getTLocalidad = (id: number) => getOne<TLocalidad>(endpoint, id);
export const createTLocalidad = (data: Partial<TLocalidad>) => create<TLocalidad>(endpoint, data);
export const updateTLocalidad = (id: number, data: Partial<TLocalidad>) => update<TLocalidad>(endpoint, id, data);
export const deleteTLocalidad = (id: number) => remove(endpoint, id);
