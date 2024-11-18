import { getAll, getOne, create, update, remove } from '../globals';
import { TCPC } from '../interfaces';

const endpoint = 'cpc';

export const getTCPCs = () => getAll<TCPC>(endpoint);
export const getTCPC = (id: number) => getOne<TCPC>(endpoint, id);
export const createTCPC = (data: Partial<TCPC>) => create<TCPC>(endpoint, data);
export const updateTCPC = (id: number, data: Partial<TCPC>) => update<TCPC>(endpoint, id, data);
export const deleteTCPC = (id: number) => remove(endpoint, id);
