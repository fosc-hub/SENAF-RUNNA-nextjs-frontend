import axiosInstance from '../utils/axiosInstance';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Generic function to fetch all resources from an API endpoint.
 * @param endpoint API endpoint to fetch data from.
 * @param filters Optional filters for query parameters.
 * @returns Array of resources of type T.
 */
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

    return response.data;

  } catch (error) {
    handleApiError(error, endpoint);
    throw new Error(`Failed to fetch data from ${endpoint}.`);
  }
};

/**
 * Generic function to fetch a single resource by ID.
 * @param endpoint API endpoint to fetch data from.
 * @param id Resource ID.
 * @returns Resource of type T.
 */
export const getOne = async <T>(endpoint: string, id: number): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(`${API_BASE_URL}/${endpoint}/${id}/`);
    return response.data;
  } catch (error) {
    handleApiError(error, `${endpoint}/${id}`);
    throw new Error(`Failed to fetch data from ${endpoint}/${id}.`);
  }
};

/**
 * Generic function to create a new resource.
 * @param endpoint API endpoint to send data to.
 * @param data Data to create a new resource.
 * @returns Newly created resource of type T.
 */
export const create = async <T>(endpoint: string, data: Partial<T>): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(`${API_BASE_URL}/${endpoint}/`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, endpoint);
    throw new Error(`Failed to create data in ${endpoint}.`);
  }
};

/**
 * Generic function to update an existing resource.
 * @param endpoint API endpoint to send data to.
 * @param id Resource ID.
 * @param data Data to update the resource.
 * @returns Updated resource of type T.
 */
export const update = async <T>(endpoint: string, id: number, data: Partial<T>): Promise<T> => {
  try {
    const response = await axiosInstance.patch<T>(`${API_BASE_URL}/${endpoint}/${id}/`, data); // Use PATCH instead of PUT
    return response.data;
  } catch (error) {
    handleApiError(error, `${endpoint}/${id}`);
    throw new Error(`Failed to update data in ${endpoint}/${id}.`);
  }
};

/**
 * Generic function to delete a resource by ID.
 * @param endpoint API endpoint to send delete request to.
 * @param id Resource ID.
 * @returns void.
 */
export const remove = async (endpoint: string, id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${endpoint}/${id}/`);
  } catch (error) {
    handleApiError(error, `${endpoint}/${id}`);
    throw new Error(`Failed to delete data in ${endpoint}/${id}.`);
  }
};
