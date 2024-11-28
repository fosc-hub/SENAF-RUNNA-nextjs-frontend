
export interface TUser {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  fecha_nacimiento: string;
  genero: string,
  telefono: number,
  localidad: TLocalidad | number,
  is_staff: boolean,
  is_active: boolean,
  is_superuser: boolean,
  groups: [],
  user_permissions: [],
  all_permissions: []
}

export interface TProvincia {
    id: number;
    nombre: string;
  }
  export interface TDepartamento {
    id: number;
    nombre: string;
  }
  export interface TLocalidad {
    id: number;
    nombre: string;
    provincia: string;
    departamento: string;
  }
  export interface TBarrio {
    id: number;
    nombre: string;
  }
  export interface TCPC {
    id: number;
    nombre: string;
    localidad: string;
  }
  
  export interface TVinculoUsuarioLinea {
    id: number;
    nombre: string;
  }
  export interface TInstitucionUsuarioLinea {
    id: number;
    nombre: string;
    mail: string;
    telefono: string;
  }
  export interface TCargo {
    id: number;
    nombre: string;
  }
  export interface TInstitucionEducativa {
    id: number;
    nombre: string;
    mail: string;
    telefono: string;
  }
  export interface TInstitucionSanitaria {
    id: number;
    nombre: string;
    mail: string;
    telefono: string;
  }
  export interface TCategoriaMotivo {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
  }
  export interface TCategoriaSubmotivo {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
    motivo: string;
  }
  export interface TGravedadVulneracion {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
  }
  export interface TUrgenciaVulneracion {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
  }
  export interface TVulneracion {
    id: number;
    principal_demanda?: string; // Opcional
    transcurre_actualidad?: string; // Opcional
    demanda: number; // Relación con demanda
    persona: number; // Relación con persona (antes nnña)
    autor_dv?: number; // Opcional, ID de autor
    categoria_motivo: TCategoriaMotivo | number; // Relación con TCategoriaMotivo
    categoria_submotivo: TCategoriaSubmotivo | number; // Relación con TCategoriaSubmotivo
    gravedad_vulneracion: TGravedadVulneracion | number; // Relación con TGravedadVulneracion
    urgencia_vulneracion: TUrgenciaVulneracion | number; // Relación con TUrgenciaVulneracion
  }
  export interface TInstitucionRespuesta {
    id: number;
    nombre: string;
    mail: string;
    telefono: string;
  }
  export interface TActividadTipo {
    id: number;
    nombre: string;
    descripcion: string;
  }
  export interface TInstitucionActividad {
    id: number;
    nombre: string;
    mail: string;
    telefono: string;
  }
  export interface TIndicadoresValoracion {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
  }
  export interface TVinculo {
    id: number;
    nombre: string;
  }
  export interface TMotivoIntervencion {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
  }
  
export interface TLocalizacion {
    referenciasGeograficas: unknown;
    provincia: unknown;
    numero: unknown;
    id: number;
    calle: string;
    tipo_calle: string;
    piso_depto?: string;
    barrio: string;
    localidad: string;
  }

  export interface Localizacion {
    id: any;
    calle: string;
    tipo_calle: string;
    piso_depto?: string; // Opcional
    lote?: string; // Opcional
    mza?: string; // Opcional
    casa_nro?: string; // Opcional
    referencia_geo?: string; // Opcional
    barrio: TBarrio | number; // Relación con TBarrio
    localidad: TLocalidad | number; // Relación con TLocalidad
    cpc?: TCPC | number; // Relación opcional con TCPC
  }
  export interface LocalizacionPersona {
    persona: TPersona | number; // Relación con TPersona
    localizacion: Localizacion | number; // Relación con Localizacion
    principal: boolean; // Campo booleano para indicar si es la localización principal
  }
  export interface TResponsable {
    nombre: string;
    apellido: string;
    telefono: string;
    mail: string;
    cargo: string; // Relación con una tabla de cargos
  }
  
  export interface TUsuarioLinea {
    nombreCargoResponsable: unknown;
    institucionPrograma: unknown;
    vinculo: unknown;
    edad: unknown;
    nombreApellido: unknown;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string; // Opcional según contexto, lo podemos ajustar más adelante
    genero: string;
    telefono: string;
    mail: string;
    vinculo_usuario_linea: string; // Relación con TVinculoUsuarioLinea
    institucion_usuario_linea: string; // Relación con TInstitucionUsuarioLinea
    responsable: string; // Opcional, referencia a TResponsable
  }
  
  
  
export interface TDemanda {

    id: number;
  
    fecha_y_hora_ingreso: string;
  
    origen: string;
  
    nro_notificacion_102?: string;
  
    nro_sac?: string;
  
    nro_suac?: string;
  
    nro_historia_clinica?: string;
  
    nro_oficio_web?: string;
  
    descripcion: string;
  
    localizacion: number;
  
    usuario_externo: string;
  
  }
  
  export interface TPrecalificacionDemanda {
    fecha: string;
    hora: string;
    descipcion: string;
    estado_demanda: string; // Relación con tabla de estados
    demanda: number; // Relación con TDemanda
  }
  export interface TPersona {
    nombre: string;
    apellido: string;
    fecha_nacimiento?: string; // Opcional
    edad_aproximada: number;
    dni?: string; // Opcional
    situacion_dni: string;
    genero: string;
    boton_antipanico?: boolean; // Solo si adulto
    observaciones?: string; // Opcional
    adulto: boolean;
    nnya: boolean; // Relación lógica con adulto
  }
  export interface TNNyASalud {
    institucion_sanitaria: string; // Assuming this is a string, adjust as needed
    observaciones?: string; // Optional
}
  export interface TDemandaPersona {
    conviviente?: boolean; // Opcional
    supuesto_autordv?: boolean; // Opcional
    supuesto_autordv_principal?: boolean; // Opcional
    nnya_principal?: boolean; // Opcional, lógica relacionada con persona
    demanda: number; // Relación con TDemanda
    persona: number; // Relación con TPersona
  }
  export interface TNNyAEducacion {
    curso: string; // Relación con tabla de cursos
    nivel: string; // Relación con niveles
    turno: string; // Relación con turnos
    comentarios?: string; // Opcional
    institucion_educativa: TInstitucionEducativa | number; // Relación con TInstitucionEducativa
    nnya: TPersona | number; // Relación con TPersona, validando que persona.nnya = true
  }
  export interface TRespuesta {
    fecha: string;
    hora: string;
    mail: string;
    mensaje?: string; // Opcional
    demanda: TDemanda | number; // Relación con TDemanda
    institucion?: TInstitucionRespuesta | number; // Relación opcional con TInstitucionRespuesta
    }
  export interface TDemandaAsignado {
    esta_activo?: boolean; // Opcional
    recibido?: boolean; // Opcional
    comentarios?: string; // Opcional
    demanda: TDemanda | number; // Relación con TDemanda
    user: TUser | number; // Relación con TUsuarioLinea
  }

export interface TActividad {
  fecha: string;
  hora: string;
  descripcion: string;
  demanda: TDemanda | number; // Relación con TDemanda
  tipo: TActividadTipo | number; // Relación con TActividadTipo
  institucion?: TInstitucionActividad | number; // Relación opcional con TInstitucionActividad
}

export interface TDemandaVinculada {
  demanda_1: TDemanda | number; // Relación con TDemanda
  demanda_2: TDemanda | number; // Relación con TDemanda
}

export interface TLegajo {
    persona: TPersona | number; // Relación 1 a 1 con TPersona, validando persona.nnya = true
    info_legajo: string;
  }
  export interface TLegajoAsignado {
    comentarios?: string; // Opcional
    legajo: TLegajo | number; // Relación con TLegajo
    user: TUsuarioLinea | number; // Relación con TUsuarioLinea
  }
  export interface TEvaluaciones {
    si_no: boolean;
    demanda: TDemanda | number; // Relación con TDemanda
    indicador: TIndicadoresValoracion | number; // Relación con TIndicadoresValoracion
  }
  export interface TDecision {
    justificacion: string;
    decision: string; // Relación con tabla de decisiones
    demanda: TDemanda | number; // Relación con TDemanda
  }export interface TVinculoPersonaPersona {
    conviven?: boolean; // Opcional
    autordv?: boolean; // Opcional
    garantiza_proteccion?: boolean; // Opcional
    vinculo: TVinculo | number; // Relación con TVinculo
    persona_1: TPersona | number; // Relación con TPersona
    persona_2: TPersona | number; // Relación con TPersona
  }export interface TNNyAScore {
    score_vulneracion: number;
    score_condiciones_vulnerabilidad: number;
    score_motivo_intervencion: number;
    nnya: TPersona | number; // Relación con TPersona, validando que persona.nnya = true
  }
  export interface TDemandaScore {
    score_vulneracion: number; // Score general de vulneración
    score_vulneracion_detallado: number; // Detalle específico de vulneración (renombrado)
    score_condiciones_vulnerabilidad: number;
    score_motivo_intervencion: number;
  }
  
  export interface TCondicionesVulnerabilidad {
    id: number;
    nombre: string;
    descripcion: string;
    peso: string;
    adulto: boolean;
    nnya: boolean; // Debe cumplir que adulto || nnya === true
  }
  export interface TPersonaCondicionesVulnerabilidad {
    si_no: boolean;
    persona: TPersona | number; // Relación con TPersona
    demanda?: TDemanda | number; // Opcional, relación con TDemanda
    condicion: TCondicionesVulnerabilidad | number; // Relación con TCondicionesVulnerabilidad
  }
  export interface TDemandaMotivoIntervencion {
    si_no: boolean;
    demanda: TDemanda | number; // Relación con TDemanda
    motivo: TMotivoIntervencion | number; // Relación con TMotivoIntervencion
  }
  export interface TUsuarioExterno {
    id: number; // ID único del usuario externo
    nombre: string;
    apellido: string;
    fecha_nacimiento: string; // Formato de fecha (ISO)
    genero: 'MASCULINO' | 'FEMENINO' | 'OTRO'; // Enum para género
    telefono: number; // Número de teléfono
    mail: string; // Correo electrónico
    vinculo: number; // Relación con la tabla de vínculos
    institucion: number; // Relación con la tabla de instituciones
    responsable: number; // Relación con TResponsable
  }
  export interface TVinculoUsuarioExterno {
    id: number;
    nombre: string;
    descripcion?: string; // Optional description field
  }
  export interface TInstitucionUsuarioExterno {
    id: number;
    nombre: string;
    mail: string;
    telefono: number;
    localizacion: number; // Relación con la tabla de localización
  }