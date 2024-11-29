import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TInstitucionUsuarioExterno } from '../interfaces';

const endpointInstitucion = 'institucion-usuario-externo';

// Export CRUD functions for TInstitucionUsuarioExterno
export const getInstitucionesUsuarioExterno = () => getAll<TInstitucionUsuarioExterno>(endpointInstitucion);
export const getInstitucionUsuarioExterno = (id: number) => getOne<TInstitucionUsuarioExterno>(endpointInstitucion, id);
export const createInstitucionUsuarioExterno = (data: Partial<TInstitucionUsuarioExterno>) => create<TInstitucionUsuarioExterno>(endpointInstitucion, data);
export const updateInstitucionUsuarioExterno = (id: number, data: Partial<TInstitucionUsuarioExterno>) => update<TInstitucionUsuarioExterno>(endpointInstitucion, id, data);
export const deleteInstitucionUsuarioExterno = (id: number) => remove(endpointInstitucion, id);