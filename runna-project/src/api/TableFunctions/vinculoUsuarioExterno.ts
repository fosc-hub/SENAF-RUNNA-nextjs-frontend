import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TVinculoUsuarioExterno } from '../interfaces';

const endpoint = 'vinculo-usuario-externo';

// Export CRUD functions for TVinculoUsuarioExterno
export const getVinculosUsuarioExterno = () => getAll<TVinculoUsuarioExterno>(endpoint);
export const getVinculoUsuarioExterno = (id: number) => getOne<TVinculoUsuarioExterno>(endpoint, id);
export const createVinculoUsuarioExterno = (data: Partial<TVinculoUsuarioExterno>) => create<TVinculoUsuarioExterno>(endpoint, data);
export const updateVinculoUsuarioExterno = (id: number, data: Partial<TVinculoUsuarioExterno>) => update<TVinculoUsuarioExterno>(endpoint, id, data);
export const deleteVinculoUsuarioExterno = (id: number) => remove(endpoint, id);