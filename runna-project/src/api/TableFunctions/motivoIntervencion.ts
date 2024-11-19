import { getAll, getOne, create, update, remove } from '../globals';
import { TMotivoIntervencion } from '../interfaces';

const endpoint = 'motivo-intervencion';

export const getTMotivoIntervencions = () => getAll<TMotivoIntervencion>(endpoint);
export const getTMotivoIntervencion = (id: number) => getOne<TMotivoIntervencion>(endpoint, id);
export const createTMotivoIntervencion = (data: Partial<TMotivoIntervencion>) => create<TMotivoIntervencion>(endpoint, data);
export const updateTMotivoIntervencion = (id: number, data: Partial<TMotivoIntervencion>) => update<TMotivoIntervencion>(endpoint, id, data);
export const deleteTMotivoIntervencion = (id: number) => remove(endpoint, id);
