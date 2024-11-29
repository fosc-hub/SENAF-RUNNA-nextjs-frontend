import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TLegajo } from '../interfaces';

const endpoint = 'tlegajo';

export const getTLegajos = () => getAll<TLegajo>(endpoint);
export const getTLegajo = (id: number) => getOne<TLegajo>(endpoint, id);
export const createTLegajo = (data: Partial<TLegajo>) => create<TLegajo>(endpoint, data);
export const updateTLegajo = (id: number, data: Partial<TLegajo>) => update<TLegajo>(endpoint, id, data);
export const deleteTLegajo = (id: number) => remove(endpoint, id);
