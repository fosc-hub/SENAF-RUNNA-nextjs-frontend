import { getAll, getOne, create, update, remove } from '../globals';
import { Localizacion } from '../interfaces';

const endpoint = 'localizacion';

export const getLocalizacions = () => getAll<Localizacion>(endpoint);
export const getLocalizacion = (id: number) => getOne<Localizacion>(endpoint, id);
export const createLocalizacion = (data: Partial<Localizacion>) => create<Localizacion>(endpoint, data);
export const updateLocalizacion = (id: number, data: Partial<Localizacion>) => update<Localizacion>(endpoint, id, data);
export const deleteLocalizacion = (id: number) => remove(endpoint, id);
