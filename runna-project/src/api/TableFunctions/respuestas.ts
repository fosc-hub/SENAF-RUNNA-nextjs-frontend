import { getAll, getOne, create, update, remove } from '../globals';
import { TRespuesta } from '../interfaces';

const endpoint = 'respuesta';

export const getTRespuestas = () => getAll<TRespuesta>(endpoint);
export const getTRespuesta = (id: number) => getOne<TRespuesta>(endpoint, id);
export const createTRespuesta = (data: Partial<TRespuesta>) => create<TRespuesta>(endpoint, data);
export const updateTRespuesta = (id: number, data: Partial<TRespuesta>) => update<TRespuesta>(endpoint, id, data);
export const deleteTRespuesta = (id: number) => remove(endpoint, id);
