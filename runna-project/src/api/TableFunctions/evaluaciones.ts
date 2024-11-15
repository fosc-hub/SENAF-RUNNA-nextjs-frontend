import { getAll, getOne, create, update, remove } from '../globals';
import { TEvaluaciones } from '../interfaces';

const endpoint = 'tevaluaciones';

export const getTEvaluaciones = () => getAll<TEvaluaciones>(endpoint);
export const getTEvaluacion = (id: number) => getOne<TEvaluaciones>(endpoint, id);
export const createTEvaluacion = (data: Partial<TEvaluaciones>) => create<TEvaluaciones>(endpoint, data);
export const updateTEvaluacion = (id: number, data: Partial<TEvaluaciones>) => update<TEvaluaciones>(endpoint, id, data);
export const deleteTEvaluacion = (id: number) => remove(endpoint, id);
