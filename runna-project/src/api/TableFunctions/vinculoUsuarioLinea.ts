import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TVinculoUsuarioLinea } from '../interfaces';

const endpoint = 'vinculo-usuario-externo';

export const getTVinculoUsuarioLineas = () => getAll<TVinculoUsuarioLinea>(endpoint);
export const getTVinculoUsuarioLinea = (id: number) => getOne<TVinculoUsuarioLinea>(endpoint, id);
export const createTVinculoUsuarioLinea = (data: Partial<TVinculoUsuarioLinea>) => create<TVinculoUsuarioLinea>(endpoint, data);
export const updateTVinculoUsuarioLinea = (id: number, data: Partial<TVinculoUsuarioLinea>) => update<TVinculoUsuarioLinea>(endpoint, id, data);
export const deleteTVinculoUsuarioLinea = (id: number) => remove(endpoint, id);