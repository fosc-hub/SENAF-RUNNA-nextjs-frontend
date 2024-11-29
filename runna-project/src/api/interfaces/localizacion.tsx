export interface TProvincia {
    
    nombre: string;
}

export interface TDepartamento {
    
    nombre: string;
    provincia: number;
}

export interface TLocalidad {
    
    nombre: string;
    departamento: number;
}

export interface TBarrio {
    
    nombre: string;
    localidad: number;
}

export interface TCPC {
    
    nombre: string;
    localidad: number;
}

interface TLocalizacionBase {
    deleted?: boolean;
    calle: string;
    tipo_calle: 'CALLE' | 'AVENIDA' | 'PASAJE' | 'RUTA' | 'BOULEVARD' | 'OTRO';
    piso_depto?: number | null;
    lote?: number | null;
    mza?: number | null;
    casa_nro?: number | null;
    referencia_geo: string;
    barrio?: number | null;
    localidad: number;
    cpc?: number | null;
}

export interface TLocalizacion extends TLocalizacionBase {
    
}
