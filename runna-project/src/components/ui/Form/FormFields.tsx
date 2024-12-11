export const formFields = {
    step_0: {
      fecha_y_hora_ingreso: { name: "fecha_y_hora_ingreso", label: "Fecha y hora de ingreso", type: "datetime-local", required: true },
      origen: {
        name: "origen",
        label: "Origen",
        type: "select",
        options: (apiData) => apiData.origenes.map((origen) => ({ id: origen.id, label: origen.nombre })), // Dynamic options
        required: true,
      },
      sub_origen: {
        name: "sub_origen",
        label: "Sub Origen",
        type: "select",
        options: (apiData) => apiData.subOrigenes.map((subOrigen) => ({ id: subOrigen.id, label: subOrigen.nombre })), // Dynamic options
        required: true,
      },
      institucion: {
        name: "institucion",
        label: "Institución",
        type: "select",
        options: (apiData) => apiData.institucionesDemanda.map((institucion) => ({ id: institucion.id, label: institucion.nombre })), // Dynamic options
        required: true,
      },
      nro_notificacion_102: {
        name: "nro_notificacion_102",
        label: "Nro. Notificación 102",
        type: "number",
        required: false,
      },
      nro_sac: { name: "nro_sac", label: "Nro. SAC", type: "number", required: false },
      nro_suac: { name: "nro_suac", label: "Nro. SUAC", type: "number", required: false },
      nro_historia_clinica: {
        name: "nro_historia_clinica",
        label: "Nro. Historia Clínica",
        type: "number",
        required: false,
      },
      nro_oficio_web: {
        name: "nro_oficio_web",
        label: "Nro. Oficio Web",
        type: "number",
        required: false,
      },
      descripcion: {
        name: "descripcion",
        label: "Descripción",
        type: "textarea",
        rows: 4,
        required: false,
      },
      motivo_intervencion: {
        name: "presuntaVulneracion.motivos",
        label: "Motivo de Intervención",
        type: "select",
        options: (apiData) => apiData.motivosIntervencion.map((motivo) => ({ id: motivo.id, label: motivo.nombre })), // Dynamic options
        required: true,
      },
informante: {
    createNewUsuarioExterno: {
      name: "createNewUsuarioExterno",
      label: "Crear nuevo Informante",
      type: "switch",
      required: false,
    },
    usuarioExterno: {
      nombre: { name: "usuarioExterno.nombre", label: "Nombre", type: "text", required: true },
      apellido: { name: "usuarioExterno.apellido", label: "Apellido", type: "text", required: true },
      telefono: { name: "usuarioExterno.telefono", label: "Teléfono", type: "number", required: true },
      mail: { name: "usuarioExterno.mail", label: "Email", type: "email", required: true },
    },
    existingUsuarioExterno: {
      id: {
        name: "usuarioExterno.id",
        label: "Informante",
        type: "select",
        options: (apiData) => apiData.usuariosExternos.map((usuario) => ({ id: usuario.id, label: `${usuario.nombre} ${usuario.apellido}` })), // Dynamic options
        required: true,
      },
    },
  },
  localizacion: {
    calle: { name: "calle", label: "Calle", type: "text", required: true },
    tipo_calle: {
      name: "tipo_calle",
      label: "Tipo de Calle",
      type: "select",
      options: [
        { id: "CALLE", label: "CALLE" },
        { id: "AVENIDA", label: "AVENIDA" },
        { id: "PASAJE", label: "PASAJE" },
      ],
      required: true,
    },
    piso_depto: { name: "piso_depto", label: "Piso/Depto", type: "number", required: false },
    lote: { name: "lote", label: "Lote", type: "number", required: false },
    mza: { name: "mza", label: "Manzana", type: "number", required: false },
    casa_nro: { name: "casa_nro", label: "Número de Casa", type: "number", required: false },
    referencia_geo: {
      name: "referencia_geo",
      label: "Referencia Geográfica",
      type: "textarea",
      rows: 2,
      required: true,
    },
    barrio: {
      name: "barrio",
      label: "Barrio",
      type: "select",
      options: (apiData) => apiData.barrios.map((barrio) => ({ id: barrio.id, label: barrio.nombre })), // Dynamic options
      required: false,
    },
    localidad: {
      name: "localidad",
      label: "Localidad",
      type: "select",
      options: (apiData) => apiData.localidades.map((localidad) => ({ id: localidad.id, label: localidad.nombre })), // Dynamic options
      required: true,
    },
    cpc: {
      name: "cpc",
      label: "CPC",
      type: "select",
      options: (apiData) => apiData.cpcs.map((cpc) => ({ id: cpc.id, label: cpc.nombre })), // Dynamic options
      required: false,
    },
  },
    },
    
    ninosAdolescentes: {
      nombre: { name: "nombre", label: "Nombre", type: "text", required: true },
      apellido: { name: "apellido", label: "Apellido", type: "text", required: true },
      fechaNacimiento: { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date", required: false },
      edadAproximada: {
        name: "edadAproximada",
        label: "Edad Aproximada",
        type: "number",
        required: false,
      },
      dni: { name: "dni", label: "DNI", type: "number", required: false },
      situacionDni: {
        name: "situacionDni",
        label: "Situación DNI",
        type: "select",
        options: [
          { id: "VALIDO", label: "Válido" },
          { id: "EN_TRAMITE", label: "En Trámite" },
          { id: "VENCIDO", label: "Vencido" },
          { id: "EXTRAVIADO", label: "Extraviado" },
          { id: "INEXISTENTE", label: "Inexistente" },
          { id: "OTRO", label: "Otro" },
        ],
        required: true,
      },
      genero: {
        name: "genero",
        label: "Género",
        type: "select",
        options: [
          { id: "MASCULINO", label: "Masculino" },
          { id: "FEMENINO", label: "Femenino" },
          { id: "OTRO", label: "Otro" },
        ],
        required: true,
      },
      observaciones: {
        name: "observaciones",
        label: "Observaciones",
        type: "textarea",
        rows: 4,
        required: false,
      },
    },
    conviviente: { name: "conviviente", label: "Conviviente", type: "checkbox", required: false },
    vinculacionVinculo: {
        name: "vinculacion.vinculo",
        label: "Vínculo con NNyA principal",
        type: "select",
        options: [], // Populate dynamically (vinculoPersonas)
        required: true,
      },
      useDefaultLocalizacion: {
        name: "useDefaultLocalizacion",
        label: "Usar localización de la demanda",
        type: "switch",
        required: false,
      },
      educacion: {
        institucionEducativa: {
          name: "educacion.institucion_educativa",
          label: "Institución Educativa",
          type: "select",
          options: [], // Populate dynamically
          required: true,
        },
        curso: {
          name: "educacion.curso",
          label: "Curso",
          type: "text",
          required: true,
        },
        nivel: {
          name: "educacion.nivel",
          label: "Nivel",
          type: "select",
          options: [
            { id: "PRIMARIO", label: "Primario" },
            { id: "SECUNDARIO", label: "Secundario" },
            { id: "TERCIARIO", label: "Terciario" },
            { id: "UNIVERSITARIO", label: "Universitario" },
            { id: "OTRO", label: "Otro" },
          ],
          required: true,
        },
        turno: {
          name: "educacion.turno",
          label: "Turno",
          type: "select",
          options: [
            { id: "MANIANA", label: "Mañana" },
            { id: "TARDE", label: "Tarde" },
            { id: "NOCHE", label: "Noche" },
            { id: "OTRO", label: "Otro" },
          ],
          required: true,
        },
        comentarios: {
          name: "educacion.comentarios",
          label: "Comentarios Educativos",
          type: "textarea",
          rows: 2,
          required: false,
        },
      },
      salud: {
        institucionSanitaria: {
          name: "salud.institucion_sanitaria",
          label: "Institución Sanitaria",
          type: "select",
          options: [], // Populate dynamically
          required: true,
        },
        observaciones: {
          name: "salud.observaciones",
          label: "Observaciones de Salud",
          type: "textarea",
          rows: 2,
          required: false,
        },
      },
      adultosConvivientes: {
        nombre: { name: "nombre", label: "Nombre", type: "text", required: true },
        apellido: { name: "apellido", label: "Apellido", type: "text", required: true },
        fechaNacimiento: {
          name: "fechaNacimiento",
          label: "Fecha de Nacimiento",
          type: "date",
          required: false,
        },
        edadAproximada: {
          name: "edadAproximada",
          label: "Edad Aproximada",
          type: "number",
          required: false,
        },
        dni: { name: "dni", label: "DNI", type: "number", required: false },
        situacionDni: {
            name: "situacionDni",
            label: "Situación DNI",
            type: "select",
            options: [
              { id: "VALIDO", label: "Válido" },
              { id: "EN_TRAMITE", label: "En Trámite" },
              { id: "VENCIDO", label: "Vencido" },
              { id: "EXTRAVIADO", label: "Extraviado" },
              { id: "INEXISTENTE", label: "Inexistente" },
              { id: "OTRO", label: "Otro" },
            ],
            required: true,
          },
        genero: {
          name: "genero",
          label: "Género",
          type: "select",
          options: [
            { id: "MASCULINO", label: "Masculino" },
            { id: "FEMENINO", label: "Femenino" },
            { id: "OTRO", label: "Otro" },
          ],
          required: true,
        },
        supuesto_autordv: {
          name: "supuesto_autordv",
          label: "Supuesto Autor DV",
          type: "checkbox",
          required: false,
        },
        conviviente: { name: "conviviente", label: "Conviviente", type: "checkbox", required: false },
        garantiza_proteccion: {
          name: "garantiza_proteccion",
          label: "Garantiza Protección",
          type: "checkbox",
          required: false,
        },
        botonAntipanico: {
          name: "botonAntipanico",
          label: "Botón Antipánico",
          type: "switch",
          required: false,
        },
        cautelar: {
          name: "cautelar",
          label: "Cautelar",
          type: "switch",
          required: false,
        },
        observaciones: {
          name: "observaciones",
          label: "Observaciones",
          type: "textarea",
          rows: 4,
          required: false,
        },
        useDefaultLocalizacion: {
          name: "useDefaultLocalizacion",
          label: "Usar localización de la demanda",
          type: "switch",
          required: false,
        },
        vinculacionVinculo: {
            name: "vinculacion.vinculo",
            label: "Vínculo con NNyA Principal",
            type: "select",
            options: [], // Populate dynamically (vinculoPersonas)
            required: true,
          },
        },
          vulneraciones: {
            categoria_motivo: {
              name: "categoria_motivo",
              label: "Categoría de Motivos",
              type: "select",
              options: [], // Populate dynamically (categoriaMotivos)
              required: true,
            },
            categoria_submotivo: {
              name: "categoria_submotivo",
              label: "Subcategoría",
              type: "select",
              options: [], // Dynamically filter based on selected `categoria_motivo`
              required: true,
              dependentOn: "categoria_motivo", // Logic to enable/disable
            },
            gravedad_vulneracion: {
              name: "gravedad_vulneracion",
              label: "Gravedad de la Vulneración",
              type: "select",
              options: [], // Populate dynamically (gravedadVulneraciones)
              required: true,
            },
            urgencia_vulneracion: {
              name: "urgencia_vulneracion",
              label: "Urgencia de la Vulneración",
              type: "select",
              options: [], // Populate dynamically (urgenciaVulneraciones)
              required: true,
            },
            nnya: {
              name: "nnya",
              label: "NNyA",
              type: "select",
              options: [], // Dynamically populate from `formData.ninosAdolescentes`
              required: true,
            },
            autor_dv: {
              name: "autor_dv",
              label: "Autor DV",
              type: "select",
              options: [], // Populate dynamically from `formData.adultosConvivientes`
              required: false,
            },
            principal_demanda: {
              name: "principal_demanda",
              label: "Principal Demanda",
              type: "checkbox",
              required: false,
            },
            transcurre_actualidad: {
              name: "transcurre_actualidad",
              label: "Transcurre Actualidad",
              type: "checkbox",
              required: false,
            },
          },
          condicionesVulnerabilidad: {
            persona: {
              name: "persona",
              label: "Persona",
              type: "select",
              options: [], // Dynamically populate from NNyA and Adultos Convivientes
              required: true,
            },
            condicion_vulnerabilidad: {
              name: "condicion_vulnerabilidad",
              label: "Condición de Vulnerabilidad",
              type: "select",
              options: [], // Dynamically filtered based on persona (adult/child)
              required: true,
            },
            si_no: {
              name: "si_no",
              label: "¿Aplica esta condición?",
              type: "radio",
              options: [
                { id: "si", label: "Sí" },
                { id: "no", label: "No" },
              ],
              required: true,
            },
          },
        };