export interface TInstitucionUsuarioExterno {
    nombre: string;
    mail?: string | null;
    telefono?: number | null;
    localizacion?: number | null;
}

export interface TVinculoUsuarioExterno {
    nombre: string;
    descripcion?: string | null;
}

export interface TUsuarioExterno {
    nombre: string;
    apellido: string;
    fecha_nacimiento?: Date | null;
    genero: 'MASCULINO' | 'FEMENINO' | 'OTRO';
    telefono: number;
    mail: string;
    vinculo: number;
    institucion: number;
}

interface TDemandaBase {
    fecha_y_hora_ingreso: Date;
    origen: 'WEB' | 'TELEFONO' | 'MAIL' | 'PERSONAL' | 'OTRO';
    nro_notificacion_102?: number | null;
    nro_sac?: number | null;
    nro_suac?: number | null;
    nro_historia_clinica?: number | null;
    nro_oficio_web?: number | null;
    descripcion?: string | null;
    ultima_actualizacion: Date;
    constatacion: boolean;
    evaluacion: boolean;
    decision: boolean;
    archivado: boolean;
    completado: boolean;
    localizacion: number;
    usuario_externo?: number | null;
}

export interface TDemanda extends TDemandaBase {
}

interface TPrecalificacionDemandaBase {
    fecha_y_hora: Date;
    descripcion: string;
    estado_demanda: 'URGENTE' | 'NO_URGENTE' | 'COMPLETAR';
    ultima_actualizacion: Date;
    demanda: number;
}

export interface TPrecalificacionDemanda extends TPrecalificacionDemandaBase {}

interface TDemandaScoreBase {
    ultima_actualizacion: Date;
    score: number;
    score_condiciones_vulnerabilidad: number;
    score_vulneracion: number;
    score_motivos_intervencion: number;
    score_indicadores_valoracion: number;
    demanda: number;
}

export interface TDemandaScore extends TDemandaScoreBase {}
