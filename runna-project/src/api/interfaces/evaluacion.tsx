export interface TActividadTipo {
    nombre: string;
}

export interface TInstitucionActividad {
    nombre: string;
    mail?: string | null;
    telefono?: number | null;
    localizacion?: number | null;
}

interface TActividadBase {
    fecha_y_hora: Date;
    descripcion: string;
    demanda: number;
    tipo?: number | null;
    institucion?: number | null;
}

export interface TActividad extends TActividadBase {}

export interface TInstitucionRespuesta {
    nombre: string;
    mail?: string | null;
    telefono?: number | null;
    localizacion?: number | null;
}

export interface TRespuesta {
    fecha_y_hora: Date;
    mail: string;
    mensaje: string;
    demanda: number;
    institucion?: number | null;
}

export interface TIndicadoresValoracion {
    nombre: string;
    descripcion?: string | null;
    peso: number;
}

interface TEvaluacionesBase {
    demanda: number;
    indicador: number;
    si_no: boolean;
}

export interface TEvaluaciones extends TEvaluacionesBase {}

export interface TDecision {
    fecha_y_hora: Date;
    justificacion: string;
    decision: 'APERTURA DE LEGAJO' | 'RECHAZAR CASO';
    demanda: number;
}