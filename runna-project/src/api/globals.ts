import axiosInstance from './TableFunctions/axiosInstance';

const API_BASE_URL = 'http://localhost:8000/api';

// Operación GET para obtener todos
export const getAll = async <T>(
  endpoint: string,
  filters?: Record<string, any> // Optional filters parameter
): Promise<T[]> => {
  try {
    // Construct query string from filters, if provided
    const queryString = filters
      ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
      : '';

    // Make the request with optional query parameters
    const response = await axiosInstance.get<T[]>(`${endpoint}/${queryString}`);
    console.log(`endpoint ${endpoint}`, `${endpoint}/${queryString}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}.`);
  }
};

// Operación GET para un solo recurso
export const getOne = async <T>(endpoint: string, id: number): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(`${API_BASE_URL}/${endpoint}/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} with id ${id}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}/${id}.`);
  }
};

// Operación POST para crear
export const create = async <T>(endpoint: string, data: Partial<T>): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(`${API_BASE_URL}/${endpoint}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating in ${endpoint}:`, error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw new Error(`Failed to create data in ${endpoint}.`);
  }
};

// Operación PUT para actualizar
export const update = async <T>(endpoint: string, id: number, data: Partial<T>): Promise<T> => {
  try {
    const response = await axiosInstance.patch<T>(`${API_BASE_URL}/${endpoint}/${id}/`, data); // Use PATCH instead of PUT
    return response.data;
    
  } catch (error) {
    console.error(`Error updating ${endpoint} with id ${id}:`, error);
    throw new Error(`Failed to update data in ${endpoint}/${id}.`);
  }
};

// Operación DELETE para eliminar
export const remove = async (endpoint: string, id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${endpoint}/${id}/`);
  } catch (error) {
    console.error(`Error deleting in ${endpoint} with id ${id}:`, error);
    throw new Error(`Failed to delete data in ${endpoint}/${id}.`);
  }
};
