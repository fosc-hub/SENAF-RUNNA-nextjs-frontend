import axios from 'axios';
  
export interface TDemanda {
    id?: number; // Optional for retrieval
    fecha_ingreso: string; // Required
    hora_ingreso: string; // Required
    origen: string; // Required
    localizacion: TLocalizacion | number; // Can be an object or a foreign key ID
    usuario_linea: TUsuarioLinea | number; // Can be an object or a foreign key ID
    
    nro_notificacion_102?: string; // Optional
    nro_sac?: string; // Optional
    nro_suac?: string; // Optional
    nro_historia_clinica?: string; // Optional
    nro_oficio_web?: string; // Optional
    descripcion?: string; // Optional
    ultima_actualizacion?: string; // Optional
  }
  
  export const createDemand = async (data: Partial<TDemanda>): Promise<TDemanda> => {
    const payload = {
      ...data,
      localizacion: typeof data.localizacion === 'object' ? data.localizacion.id : data.localizacion,
      usuario_linea: typeof data.usuario_linea === 'object' ? data.usuario_linea.id : data.usuario_linea,
    };
  
    try {
      const response = await axios.post<TDemanda>(`http://127.0.0.1:8000/api/demanda/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating demand:', error);
      throw new Error('Failed to create demand.');
    }
  };
  export const getDemands = async (): Promise<TDemanda[]> => {
    try {
      const response = await axios.get<TDemanda[]>(`http://127.0.0.1:8000/api/demanda/`);
      return response.data; // Assuming the API includes nested objects
    } catch (error) {
      console.error('Error fetching demands:', error);
      throw new Error('Failed to fetch demands.');
    }
  };
  