import { getAll, getOne, create, update, remove } from '../globals';
import { TPrecalificacionDemanda } from '../interfaces';

const endpoint = 'precalificacion-demanda';

export const getTPrecalificacionDemandas = () => getAll<TPrecalificacionDemanda>(endpoint);
export const getTPrecalificacionDemanda = (id: number) => getOne<TPrecalificacionDemanda>(endpoint, id);
export const createTPrecalificacionDemanda = (data: Partial<TPrecalificacionDemanda>) => create<TPrecalificacionDemanda>(endpoint, data);
export const updateTPrecalificacionDemanda = (id: number, data: Partial<TPrecalificacionDemanda>) => update<TPrecalificacionDemanda>('precalificacion-demanda', id, data);
export const deleteTPrecalificacionDemanda = (id: number) => remove(endpoint, id);
