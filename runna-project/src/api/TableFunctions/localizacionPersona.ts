import { getAll, getOne, create, update, remove } from '../globals';
import { LocalizacionPersona } from '../interfaces';

const endpoint = 'localizacionpersona';

export const getLocalizacionPersonas = () => getAll<LocalizacionPersona>(endpoint);
export const getLocalizacionPersona = (id: number) => getOne<LocalizacionPersona>(endpoint, id);
export const createLocalizacionPersona = (data: Partial<LocalizacionPersona>) => create<LocalizacionPersona>(endpoint, data);
export const updateLocalizacionPersona = (id: number, data: Partial<LocalizacionPersona>) => update<LocalizacionPersona>(endpoint, id, data);
export const deleteLocalizacionPersona = (id: number) => remove(endpoint, id);
