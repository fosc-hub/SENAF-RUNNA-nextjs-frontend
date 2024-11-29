import { getAll, getOne, create, update, remove } from '../services/apiService';
import { Localizacion } from '../interfaces';

const endpoint = 'localizacion';

export const getLocalizacions = (filters?: Record<string, any>) =>
    getAll<Localizacion>(endpoint, filters);
export const getLocalizacion = (id: number) => getOne<Localizacion>(endpoint, id);
export const createLocalizacion = async (data: Partial<Localizacion>): Promise<Localizacion> => {
    const response = await create<Localizacion>(endpoint, data);
    console.log('Create localizacion response:', response);
    return response;
  };export const updateLocalizacion = (id: number, data: Partial<Localizacion>) => update<Localizacion>(endpoint, id, data);
export const deleteLocalizacion = (id: number) => remove(endpoint, id);
