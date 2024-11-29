interface TBaseModel {
    deleted?: boolean;
}

interface TLocalizacionPersonaBase extends TBaseModel {
    persona: number;
    localizacion: number;
    principal: boolean;
}

export interface TLocalizacionPersona extends TLocalizacionPersonaBase {
}

interface TDemandaPersonaBase extends TBaseModel {
    conviviente: boolean;
    supuestoAutordv: boolean;
    supuestoAutordvPrincipal: boolean;
    nnyaPrincipal: boolean;
    demanda: number;
    persona: number;
}

export interface TDemandaPersona extends TDemandaPersonaBase {
}

interface TDemandaAsignadoBase {
    estaActivo: boolean;
    recibido: boolean;
    comentarios?: string;
    demanda: number;
    user: number;
}

export interface TDemandaAsignado extends TDemandaAsignadoBase {
}

interface TDemandaVinculadaBase extends TBaseModel {
    demanda1: number;
    demanda2: number;
}

export interface TDemandaVinculada extends TDemandaVinculadaBase {
}

export interface TLegajoAsignado {
    estaActivo: boolean;
    recibido: boolean;
    comentarios?: string;
    legajo: number;
    user: number;
}

export interface TVinculoPersona {
    nombre: string;
}

interface TVinculoPersonaPersonaBase extends TBaseModel {
    conviven: boolean;
    autordv: boolean;
    garantizaProteccion: boolean;
    persona1: number;
    persona2: number;
    vinculo?: number;
}

export interface TVinculoPersonaPersona extends TVinculoPersonaPersonaBase {
}

interface TPersonaCondicionesVulnerabilidadBase {
    siNo: boolean;
    persona: number;
    condicionVulnerabilidad: number;
    demanda?: number;
}

export interface TPersonaCondicionesVulnerabilidad extends TPersonaCondicionesVulnerabilidadBase {}

interface TDemandaMotivoIntervencionBase {
    siNo: boolean;
    demanda: number;
    motivoIntervencion: number;
}

export interface TDemandaMotivoIntervencion extends TDemandaMotivoIntervencionBase {}