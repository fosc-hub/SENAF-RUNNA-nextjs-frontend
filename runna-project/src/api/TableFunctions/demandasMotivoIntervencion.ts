import { getAll, getOne, create, update, remove } from '../globals';
import { TDemandaMotivoIntervencion } from '../interfaces';

const endpoint = 'demanda-motivo-intervencion';

export const getTDemandaMotivoIntervencions = () => getAll<TDemandaMotivoIntervencion>(endpoint);
export const getTDemandaMotivoIntervencion = (id: number) => getOne<TDemandaMotivoIntervencion>(endpoint, id);
export const createTDemandaMotivoIntervencion = (data: Partial<TDemandaMotivoIntervencion>) => create<TDemandaMotivoIntervencion>(endpoint, data);
export const updateTDemandaMotivoIntervencion = (id: number, data: Partial<TDemandaMotivoIntervencion>) => update<TDemandaMotivoIntervencion>(endpoint, id, data);
export const deleteTDemandaMotivoIntervencion = (id: number) => remove(endpoint, id);
