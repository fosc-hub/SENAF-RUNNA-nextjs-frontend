import { getAll, getOne, create, update, remove } from '../globals';
import { TCondicionesVulnerabilidad } from '../interfaces';

const endpoint = 'tcondicionesvulnerabilidad';

export const getTCondicionesVulnerabilidads = () => getAll<TCondicionesVulnerabilidad>(endpoint);
export const getTCondicionesVulnerabilidad = (id: number) => getOne<TCondicionesVulnerabilidad>(endpoint, id);
export const createTCondicionesVulnerabilidad = (data: Partial<TCondicionesVulnerabilidad>) => create<TCondicionesVulnerabilidad>(endpoint, data);
export const updateTCondicionesVulnerabilidad = (id: number, data: Partial<TCondicionesVulnerabilidad>) => update<TCondicionesVulnerabilidad>(endpoint, id, data);
export const deleteTCondicionesVulnerabilidad = (id: number) => remove(endpoint, id);
