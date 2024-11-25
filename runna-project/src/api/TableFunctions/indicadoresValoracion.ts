import { getAll, getOne, create, update, remove } from '../globals';
import { TIndicadoresValoracion } from '../interfaces';

const endpoint = 'tindicadoresvaloracion';

export const getTIndicadoresValoracions = () => getAll<TIndicadoresValoracion>(endpoint);
export const getTIndicadoresValoracion = (id: number) => getOne<TIndicadoresValoracion>(endpoint, id);
export const createTIndicadoresValoracion = (data: Partial<TIndicadoresValoracion>) => create<TIndicadoresValoracion>(endpoint, data);
export const updateTIndicadoresValoracion = (id: number, data: Partial<TIndicadoresValoracion>) => update<TIndicadoresValoracion>(endpoint, id, data);
export const deleteTIndicadoresValoracion = (id: number) => remove(endpoint, id);