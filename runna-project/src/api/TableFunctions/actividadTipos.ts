import { getAll, getOne, create, update, remove } from '../globals';
import { TActividadTipo } from '../interfaces';

const endpoint = 'tactividadtipo';

export const getTActividadTipos = () => getAll<TActividadTipo>(endpoint);
export const getTActividadTipo = (id: number) => getOne<TActividadTipo>(endpoint, id);
export const createTActividadTipo = (data: Partial<TActividadTipo>) => create<TActividadTipo>(endpoint, data);
export const updateTActividadTipo = (id: number, data: Partial<TActividadTipo>) => update<TActividadTipo>(endpoint, id, data);
export const deleteTActividadTipo = (id: number) => remove(endpoint, id);
