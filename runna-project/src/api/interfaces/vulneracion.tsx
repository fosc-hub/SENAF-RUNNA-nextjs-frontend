interface TBaseModel {
    
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TCategoriaMotivo extends TBaseModel {
    nombre: string;
    descripcion?: string | null;
    peso: number;
}

export interface TCategoriaSubmotivo extends TBaseModel {
    nombre: string;
    descripcion?: string | null;
    peso: number;
    motivo: number;
}

export interface TGravedadVulneracion extends TBaseModel {
    nombre: string;
    descripcion?: string | null;
    peso: number;
}

export interface TUrgenciaVulneracion extends TBaseModel {
    nombre: string;
    descripcion?: string | null;
    peso: number;
}

export interface TCondicionesVulnerabilidad extends TBaseModel {
    nombre: string;
    descripcion?: string | null;
    peso: number;
    nnya: boolean;
    adulto: boolean;
}

export interface TMotivoIntervencion extends TBaseModel {
    nombre: string;
    descripcion?: string | null;
    peso: number;
}

interface TVulneracionBase extends TBaseModel {
    principalDemanda: boolean;
    transcurreActualidad: boolean;
    deleted: boolean;
    sumatoriaDePesos: number;
    demanda?: any; // Replace with actual type
    nnya: any; // Replace with actual type
    autorDv?: any; // Replace with actual type
    categoriaMotivo: number;
    categoriaSubmotivo: number;
    gravedadVulneracion: number;
    urgenciaVulneracion: number;
}

export interface TVulneracion extends TVulneracionBase {
}
