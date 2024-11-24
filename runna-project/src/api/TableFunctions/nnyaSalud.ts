import { getAll, getOne, create, update, remove } from '../globals';
import { TNNyASalud } from '../interfaces';

const endpoint = 'nnya-salud';

export const getTNNyASaluds = () => getAll<TNNyASalud>(endpoint);
export const getTNNyASalud = (id: number) => getOne<TNNyASalud>(endpoint, id);
export const createTNNyASalud = (data: Partial<TNNyASalud>) => create<TNNyASalud>(endpoint, data);
export const updateTNNyASalud = (id: number, data: Partial<TNNyASalud>) => update<TNNyASalud>(endpoint, id, data);
export const deleteTNNyASalud = (id: number) => remove(endpoint, id);
