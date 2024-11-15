import { getAll, getOne, create, update, remove } from '../globals';
import { TDecision } from '../interfaces';

const endpoint = 'tdecision';

export const getTDecisiones = () => getAll<TDecision>(endpoint);
export const getTDecision = (id: number) => getOne<TDecision>(endpoint, id);
export const createTDecision = (data: Partial<TDecision>) => create<TDecision>(endpoint, data);
export const updateTDecision = (id: number, data: Partial<TDecision>) => update<TDecision>(endpoint, id, data);
export const deleteTDecision = (id: number) => remove(endpoint, id);
