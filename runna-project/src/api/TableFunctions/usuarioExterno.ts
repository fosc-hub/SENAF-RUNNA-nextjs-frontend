import { getAll, getOne, create, update } from '../globals';
import { TUsuarioExterno } from '../interfaces';

const endpoint = 'usuario-externo';

export const getTUsuariosExternos = () => getAll<TUsuarioExterno>(endpoint);
export const getTUsuarioExterno = (id: number) => getOne<TUsuarioExterno>(endpoint, id);
export const createTUsuarioExterno = (data: Partial<TUsuarioExterno>) => create<TUsuarioExterno>(endpoint, data);
export const updateTUsuarioExterno = (id: number, data: Partial<TUsuarioExterno>) => update<TUsuarioExterno>(endpoint, id, data);
