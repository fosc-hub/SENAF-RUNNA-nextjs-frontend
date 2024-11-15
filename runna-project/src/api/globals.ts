import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Operación GET para obtener todos
export const getAll = async <T>(endpoint: string): Promise<T[]> => {
  try {
    const response = await axios.get<T[]>(`${API_BASE_URL}/${endpoint}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}.`);
  }
};

// Operación GET para un solo recurso
export const getOne = async <T>(endpoint: string, id: number): Promise<T> => {
  try {
    const response = await axios.get<T>(`${API_BASE_URL}/${endpoint}/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} with id ${id}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}/${id}.`);
  }
};

// Operación POST para crear
export const create = async <T>(endpoint: string, data: Partial<T>): Promise<T> => {
  try {
    const response = await axios.post<T>(`${API_BASE_URL}/${endpoint}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating in ${endpoint}:`, error);
    throw new Error(`Failed to create data in ${endpoint}.`);
  }
};

// Operación PUT para actualizar
export const update = async <T>(endpoint: string, id: number, data: Partial<T>): Promise<T> => {
  try {
    const response = await axios.put<T>(`${API_BASE_URL}/${endpoint}/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${endpoint} with id ${id}:`, error);
    throw new Error(`Failed to update data in ${endpoint}/${id}.`);
  }
};

// Operación DELETE para eliminar
export const remove = async (endpoint: string, id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${endpoint}/${id}/`);
  } catch (error) {
    console.error(`Error deleting in ${endpoint} with id ${id}:`, error);
    throw new Error(`Failed to delete data in ${endpoint}/${id}.`);
  }
};
