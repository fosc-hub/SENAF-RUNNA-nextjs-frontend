interface TBaseModel {
    deleted?: boolean;
}

interface TLocalizacionPersonaBase extends TBaseModel {
    personaId: number;
    localizacionId: number;
    principal: boolean;
}

export interface TLocalizacionPersona extends TLocalizacionPersonaBase {
}

interface TDemandaPersonaBase extends TBaseModel {
    conviviente: boolean;
    supuestoAutordv: boolean;
    supuestoAutordvPrincipal: boolean;
    nnyaPrincipal: boolean;
    demandaId: number;
    personaId: number;
}

export interface TDemandaPersona extends TDemandaPersonaBase {
}

interface TDemandaAsignadoBase {
    estaActivo: boolean;
    recibido: boolean;
    comentarios?: string;
    demandaId: number;
    userId: number;
}

export interface TDemandaAsignado extends TDemandaAsignadoBase {
}

interface TDemandaVinculadaBase extends TBaseModel {
    demanda1Id: number;
    demanda2Id: number;
}

export interface TDemandaVinculada extends TDemandaVinculadaBase {
}

export interface TLegajoAsignado {
    estaActivo: boolean;
    recibido: boolean;
    comentarios?: string;
    legajoId: number;
    userId: number;
}

export interface TVinculoPersona {
    nombre: string;
}

interface TVinculoPersonaPersonaBase extends TBaseModel {
    conviven: boolean;
    autordv: boolean;
    garantizaProteccion: boolean;
    persona1Id: number;
    persona2Id: number;
    vinculoId?: number;
}

export interface TVinculoPersonaPersona extends TVinculoPersonaPersonaBase {
}

interface TPersonaCondicionesVulnerabilidadBase {
    siNo: boolean;
    personaId: number;
    condicionVulnerabilidadId: number;
    demandaId?: number;
}

export interface TPersonaCondicionesVulnerabilidad extends TPersonaCondicionesVulnerabilidadBase {}

interface TDemandaMotivoIntervencionBase {
    siNo: boolean;
    demandaId: number;
    motivoIntervencionId: number;
}

export interface TDemandaMotivoIntervencion extends TDemandaMotivoIntervencionBase {}