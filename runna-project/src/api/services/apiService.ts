import axiosInstance from '../utils/axiosInstance';
import { Slide, toast } from 'react-toastify'; // Importar Toastify

/**
 * Generic function to fetch all resources from an API endpoint.
 * @param endpoint API endpoint to fetch data from.
 * @param filters Optional filters for query parameters.
 * @returns Array of resources of type T.
 */
export const getAll = async <T>(
  endpoint: string,
  filters?: Record<string, any>
): Promise<T[]> => {
  const queryString = filters
    ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
    : '';
  const response = await axiosInstance.get<T[]>(`${endpoint}/${queryString}`);
  return response.data;
};

/**
 * Generic function to fetch a single resource by ID.
 * @param endpoint API endpoint to fetch data from.
 * @param id Resource ID.
 * @returns Resource of type T.
 */
export const getOne = async <T>(endpoint: string, id: number): Promise<T> => {
  const response = await axiosInstance.get<T>(`${endpoint}/${id}/`);
  return response.data;
};

/**
 * Generic function to create a new resource.
 * @param endpoint API endpoint to send data to.
 * @param data Data to create a new resource.
 * @returns Newly created resource of type T.
 */
export const create = async <T>(endpoint: string, data: Partial<T>, showToast: boolean = false, toastMessage: string = '¡Registro asignado con exito!'): Promise<T> => {
  const response = await axiosInstance.post<T>(`${endpoint}/`, data);
  if (response.status === 201 && showToast) {
    // success toast
    toast.success(toastMessage, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  }
  return response.data;
};

/**
 * Generic function to update an existing resource.
 * @param endpoint API endpoint to send data to.
 * @param id Resource ID.
 * @param data Data to update the resource.
 * @returns Updated resource of type T.
 */
export const update = async <T>(endpoint: string, id: number, data: Partial<T>, showToast: boolean = false, toastMessage: string = '¡Registro modificado con exito!'): Promise<T> => {
  const response = await axiosInstance.patch<T>(`${endpoint}/${id}/`, data);
  if (response.status === 200 && showToast) {
    // success toast
    toast.success(toastMessage, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  }
  return response.data;
};

/**
 * Generic function to partially update a resource.
 * @param endpoint API endpoint to send data to.
 * @param id Resource ID.
 * @param data Partial data to update the resource.
 * @returns Updated resource of type T.
 */
export const patch = async <T>(endpoint: string, id: number, data: Partial<T>): Promise<T> => {
  const response = await axiosInstance.patch<T>(`${endpoint}/${id}/`, data);
  return response.data;
};

/**
 * Generic function to delete a resource by ID.
 * @param endpoint API endpoint to send delete request to.
 * @param id Resource ID.
 * @returns void.
 */
export const remove = async (endpoint: string, id: number): Promise<void> => {
  await axiosInstance.delete(`${endpoint}/${id}/`);
};
