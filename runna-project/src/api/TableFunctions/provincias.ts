import { getAll, getOne, create, update, remove } from '../globals';
import { TProvincia } from '../interfaces';

const endpoint = 'provincia';

export const getTProvincias = () => getAll<TProvincia>(endpoint);
export const getTProvincia = (id: number) => getOne<TProvincia>(endpoint, id);
export const createTProvincia = (data: Partial<TProvincia>) => create<TProvincia>(endpoint, data);
export const updateTProvincia = (id: number, data: Partial<TProvincia>) => update<TProvincia>(endpoint, id, data);
export const deleteTProvincia = (id: number) => remove(endpoint, id);