import { getAll, getOne, create, update, remove } from '../globals';
import { TDemandaVinculada } from '../interfaces';

const endpoint = 'tdemandavinculada';

export const getTDemandaVinculadas = () => getAll<TDemandaVinculada>(endpoint);
export const getTDemandaVinculada = (id: number) => getOne<TDemandaVinculada>(endpoint, id);
export const createTDemandaVinculada = (data: Partial<TDemandaVinculada>) => create<TDemandaVinculada>(endpoint, data);
export const updateTDemandaVinculada = (id: number, data: Partial<TDemandaVinculada>) => update<TDemandaVinculada>(endpoint, id, data);
export const deleteTDemandaVinculada = (id: number) => remove(endpoint, id);
