import { getAll, getOne, create, update, remove } from '../services/apiService';
import { TPersonaCondicionesVulnerabilidad } from '../interfaces';

const endpoint = 'tpersonacondicionesvulnerabilidad';

export const getTPersonaCondicionesVulnerabilidads = () => getAll<TPersonaCondicionesVulnerabilidad>(endpoint);
export const getTPersonaCondicionesVulnerabilidad = (id: number) => getOne<TPersonaCondicionesVulnerabilidad>(endpoint, id);
export const createTPersonaCondicionesVulnerabilidad = (data: Partial<TPersonaCondicionesVulnerabilidad>) => create<TPersonaCondicionesVulnerabilidad>(endpoint, data);
export const updateTPersonaCondicionesVulnerabilidad = (id: number, data: Partial<TPersonaCondicionesVulnerabilidad>) => update<TPersonaCondicionesVulnerabilidad>(endpoint, id, data);
export const deleteTPersonaCondicionesVulnerabilidad = (id: number) => remove(endpoint, id);
