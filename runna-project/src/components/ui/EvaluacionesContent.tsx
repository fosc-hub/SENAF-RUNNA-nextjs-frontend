'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Tabs, 
  Tab,
  Radio,
  RadioGroup,
  IconButton, Select, MenuItem, InputLabel, SelectChangeEvent, TextField,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { PDFDocument } from 'pdf-lib';
import { getTIndicadoresValoracions } from '../../api/TableFunctions/indicadoresValoracion';
import { TIndicadoresValoracion } from '../../api/interfaces';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'next/navigation';
import { createTEvaluacion } from '../../api/TableFunctions/evaluaciones';
import { getTDemandaPersonas } from '../../api/TableFunctions/demandaPersonas';
import { TDemandaPersona } from '../../api/interfaces';
import { getTSuggestDecisions } from '../../api/TableFunctions/suggestDecision';
import { TsuggestDecision } from '../../api/interfaces';
import { createTDecision } from '../../api/TableFunctions/decisiones';
import { useRouter } from 'next/navigation';
import EditableTable from '../common/EditableTable';
import CircularProgress from '@mui/material/CircularProgress';

import { getDemand, getDemands } from '../../api/TableFunctions/demands';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { getTPersona, getTPersonas } from '../../api/TableFunctions/personas';
import { getTLegajos, getTLegajo } from '../../api/TableFunctions/legajos';
import { getTVinculoPersonaPersona, getTVinculoPersonaPersonas } from '../../api/TableFunctions/vinculospersonaspersonas';
import { getTMotivoIntervencion, getTMotivoIntervencions } from '../../api/TableFunctions/motivoIntervencion';
import { getTDemandaMotivoIntervencion, getTDemandaMotivoIntervencions } from '../../api/TableFunctions/demandasMotivoIntervencion';
import { getTActividad, getTActividades } from '../../api/TableFunctions/actividades';
import { el } from 'date-fns/locale';
import { getLocalizacion } from '../../api/TableFunctions/localizacion';
import { getTActividadTipo } from '../../api/TableFunctions/actividadTipos';
import { getLocalizacionPersonas } from '../../api/TableFunctions/localizacionPersona';
import { getTDemandaVinculadas } from '../../api/TableFunctions/demandasVinculadas';


const dataGroups = {
  generalInfo: {
    title: "Información General",
    multiRow: false, // Single row only
    fields: [
      { key: "localidad", label: "Localidad" },
      { key: "fecha", label: "Fecha" },
      { key: "cargo", label: "Cargo/Función" },
      { key: "nombreApellido", label: "Nombre y Apellido" },
      { key: "refNumero", label: "N° de Sticker SUAC" },
      { key: "sac", label: "N° de Sticker sac" },
      { key: "oficio", label: "N° de Oficio Web" },
      { key: "origen", label: "Origen" },
      { key: "subOrigen", label: "Suborigen" },
      { key: "Institucion", label: "Institucion" },
    ],
  },
  Domicilio: {
    title: "Datos de Localización",
    multiRow: false, // Allows multiple rows
    fields: [
      { key: "callePrincipal", label: "Calle *" },
      { key: "tipoCalle", label: "Tipo de Calle" },
      { key: "pisoDepto", label: "Piso/Depto" },
      { key: "lote", label: "Lote" },
      { key: "manzana", label: "Manzana" },
      { key: "numeroCasa", label: "Número de Casa" },
      { key: "referenciaGeografica", label: "Referencia Geográfica *" },
      { key: "barrio", label: "Barrio" },
      { key: "localidad", label: "Localidad *" },
      { key: "cpc", label: "CPC" },
    ],
  },
  descripcionSituacion: {
    title: "Descripción de la Situación Inicial",
    multiRow: false, // Single row only
    fields: [
      { key: "descripcion", label: "Descripción de la situación inicial" },
    ],
  },
  Actividades: {
    title: "Actividades",
    multiRow: true, // Allows multiple rows
    fields: [
      { key: "actividadTipo", label: "Actividad" },
      { key: "fecha", label: "Fecha" },
      { key: "institucion", label: "Institucion" },
      { key: "observacion", label: "Observaciones" },
    ],
  },
  NNyAConvivientes: {
    title: "NNyA Convivientes",
    multiRow: true,
    fields: [
      { key: "apellidoNombre", label: "Apellido y Nombre" },
      { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
      { key: "dni", label: "N° de DNI" },
      { key: "vinculo", label: "Vinculo con NNyA principal" },
      { key: "legajoRunna", label: "N° de Legajo RUNNA" },
    ],
  },
  NNyANoConvivientes: {
    title: "NNyA No Convivientes",
    multiRow: true,
    fields: [
      { key: "apellidoNombre", label: "Apellido y Nombre" },
      { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
      { key: "dni", label: "N° de DNI" },
      { key: "vinculo", label: "Vinculo con NNyA principal" },
      { key: "legajoRunna", label: "N° de Legajo RUNNA" },
      { key: "domicilio", label: "Domicilio relacionado" },
    ],
  },
  AdultosConvivientes: {
    title: "Adultos Convivientes",
    multiRow: true,
    fields: [
      { key: "apellidoNombre", label: "Apellido y Nombre" },
      { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
      { key: "dni", label: "N° de DNI" },
      { key: "vinculo", label: "Vinculo con NNyA principal" },
      { key: "domicilio", label: "Domicilio" },
    ],
  },
  AdultosNoConvivientes: {
    title: "Adultos No Convivientes",
    multiRow: true,
    fields: [
      { key: "apellidoNombre", label: "Apellido y Nombre" },
      { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
      { key: "dni", label: "N° de DNI" },
      { key: "vinculo", label: "Vinculo con NNyA principal" },
      { key: "domicilio", label: "Domicilio relacionado" },
    ],
  },
  Antecedentes: {
    title: "Antecedentes de la demanda",
    multiRow: true, // Single row only
    fields: [
      { key: "IdDemanda", label: "Id de la demanda vinculada" },
      { key: "refNumero", label: "N° de Sticker SUAC" },
      { key: "sac", label: "N° de Sticker sac" },
      { key: "oficio", label: "N° de Oficio Web" },
    ],
  },
  Motivos: {
    title: "Motivos de la actuacion",
    multiRow: false, // Single row only
    fields: [
      { key: "Nombre y Apellido", label: "Nombre y Apellido del niño" },
      { key: "Motivo", label: "Motivo de la actuacion" },
      { key: "subMotivo", label: "subMotivo de la actuacion" },
    ],
  },





  indicadores: {
    title: "Indicadores de vulneracion de la evaluacion",
    multiRow: true, // Allows multiple rows
    fields: [{ key: "indicador", label: "Indicadores" }],
  },
  valoracionProfesional: {
    title: "Valoración Profesional/ Conclusiones",
    multiRow: false, // Allows multiple rows
    fields: [
      { key: "decisionSugerida", label: "Decision sugerida" },
      { key: "razon", label: "Razon" },
    ],
  },

};


export function EvaluacionesContent() {
  const [indicadores, setIndicadores] = useState<TIndicadoresValoracion[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [tieneLegajo, setTieneLegajo] = useState(false);
  const params = useParams();
  const id = params.id;
  const [justification, setJustification] = useState('');
  const router = useRouter();
  const [loadingTableData, setLoadingTableData] = useState(true); // Add loading state
  const { user, loading } = useAuth(); // Now wrapped by AuthProvider

  const [formData, setFormData] = useState({
    generalInfo: {},
    Domicilio: {},
    Actividades: {},
    nnyaInfo: [],
    AdultosInfo: {},
    NNyAConvivientes: {},
    NNyANoConvivientes: {},
    AdultosConvivientes: {},
    AdultosNoConvivientes: {},
    Antecedentes: {},
    motivoActuacion: {},
    medidasProteccion: [],
    resenaActuado: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTableData(true); // Set loading to true

      try {
        const demandaId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);

        const currentDate = new Date().toISOString().split('T')[0];

        // Fetching general info
        const demandaInfo = await getDemand(demandaId); // Assume `id` is available from `useParams`

        const demandaVinculadas = await getTDemandaVinculadas({});

      const antecedentesArray = [];

      for (const vinculada of demandaVinculadas) {
        let linkedDemandaId;

        if (vinculada.demanda_1 === demandaId) {
          linkedDemandaId = vinculada.demanda_2;
        } else if (vinculada.demanda_2 === demandaId) {
          linkedDemandaId = vinculada.demanda_1;
        }

        // Fetch details of the related demand if it exists
        if (linkedDemandaId) {
          const linkedDemandaInfo = await getDemand(linkedDemandaId);

          antecedentesArray.push({
            IdDemanda: vinculada.id,
            refNumero: linkedDemandaInfo.nro_suac || "N/A",
            sac: linkedDemandaInfo.nro_sac || "N/A",
            oficio: linkedDemandaInfo.nro_oficio_web || "N/A",
          });
        }
      }

      console.log("Antecedentes Data:", antecedentesArray);

      formData.Antecedentes = antecedentesArray;

        const mainLocalizacion = demandaInfo.localizacion;
        const demandaPersonas = await getTDemandaPersonas({ demanda: demandaId });
        const nnyaConvivientes = [];
        const nnyaNoConvivientes = [];
  
        for (const personaData of demandaPersonas) {
          const personaDetails = await getTPersona(personaData.persona);
          if (personaDetails.nnya) {
            // Fetch NNyA localization
            const localizacionPersona = await getLocalizacionPersonas({ persona: personaDetails.id });
            const hasMatchingLocalization = localizacionPersona.some(
              (loc) => loc.localizacion === mainLocalizacion
            );
  
            // Categorize based on localization match
            if (hasMatchingLocalization) {
              nnyaConvivientes.push({
                apellidoNombre: `${personaDetails.nombre} ${personaDetails.apellido}`,
                fechaNacimiento: personaDetails.fecha_nacimiento || "",
                dni: personaDetails.dni || "",
                vinculo: personaData.vinculo || "N/A",
                legajoRunna: "", // Add RUNNA data if available
                domicilio: "Principal", // Default main location
              });
            } else {
              nnyaNoConvivientes.push({
                apellidoNombre: `${personaDetails.nombre} ${personaDetails.apellido}`,
                fechaNacimiento: personaDetails.fecha_nacimiento || "",
                dni: personaDetails.dni || "",
                vinculo: personaData.vinculo || "N/A",
                legajoRunna: "", // Add RUNNA data if available
                domicilio: localizacionPersona[0]?.localizacion || "Otro",
              });
            }
          }
        }
        console.log('NNyA Convivientes:', nnyaConvivientes);
        console.log('NNyA No Convivientes:', nnyaNoConvivientes);
        formData.NNyAConvivientes = nnyaConvivientes;
        formData.NNyANoConvivientes = nnyaNoConvivientes;
        const adultosConvivientes = [];
        const adultosNoConvivientes = [];
  
        for (const personaData of demandaPersonas) {
          const personaDetails = await getTPersona(personaData.persona);
  
          if (!personaDetails.nnya) {
            // Fetch Adult's localization
            const localizacionPersona = await getLocalizacionPersonas({ persona: personaDetails.id });
            const hasMatchingLocalization = localizacionPersona.some(
              (loc) => loc.localizacion === mainLocalizacion
            );
  
            // Categorize based on localization match
            if (hasMatchingLocalization) {
              adultosConvivientes.push({
                apellidoNombre: `${personaDetails.nombre} ${personaDetails.apellido}`,
                fechaNacimiento: personaDetails.fecha_nacimiento || "",
                dni: personaDetails.dni || "",
                vinculo: personaData.vinculo || "N/A",
                domicilio: "Principal", // Default main location
              });
            } else {
              adultosNoConvivientes.push({
                apellidoNombre: `${personaDetails.nombre} ${personaDetails.apellido}`,
                fechaNacimiento: personaDetails.fecha_nacimiento || "",
                dni: personaDetails.dni || "",
                vinculo: personaData.vinculo || "N/A",
                domicilio: localizacionPersona[0]?.localizacion || "Otro",
              });
            }
          }
        }
  
        console.log("Adultos Convivientes:", adultosConvivientes);
        console.log("Adultos No Convivientes:", adultosNoConvivientes);
        
        formData.AdultosConvivientes = adultosConvivientes;
        formData.AdultosNoConvivientes = adultosNoConvivientes;
        formData.generalInfo = {
          localidad: user.localidad || "",
          fecha: currentDate || "",
          cargo: user.is_superuser ? "superuser" : ( user.groups[0] || ""),
          nombreApellido: user.first_name + ' ' + user.last_name || "",
          refNumero: demandaInfo.nro_suac || "",
          sac: demandaInfo.nro_sac || "",
          oficio: demandaInfo.nro_oficio_web || "",
          origen: demandaInfo.origen || "",
          subOrigen: demandaInfo.sub_origen || "",
          Institucion: demandaInfo.institucion || "",
        };
        const localizacionInfo = await getLocalizacion(demandaInfo.localizacion);
        console.log('Localizacion:', demandaInfo.localizacion);
        console.log('LocalizacionInfo:', localizacionInfo);
        formData.Domicilio = {
          callePrincipal: localizacionInfo.calle || "",
          tipoCalle: localizacionInfo.tipo_calle || "",
          pisoDepto: localizacionInfo.piso_depto || "",
          lote: localizacionInfo.lote || "",
          manzana: localizacionInfo.mza || "",
          numeroCasa: localizacionInfo.casa_nro || "",
          referenciaGeografica: localizacionInfo.referencia_geo || "",
          barrio: localizacionInfo.barrio || "",
          localidad: localizacionInfo.localidad || "",
          cpc: localizacionInfo.cpc || "",
        }; 
        console.log('General Info:', formData.generalInfo);
        console.log('Domicilio:', formData.Domicilio);

        const actividades = await getTActividades({ demanda: id });
        const actividadesArray = [];
        for (const actividad of actividades) {
          const actividadTipo = await getTActividadTipo(actividad.tipo); // Fetch activity type name
          actividadesArray.push({
            actividadTipo: actividadTipo?.nombre || "N/A", // Map activity type name
            fecha: actividad.fecha_y_hora?.split('T')[0] || "", // Format the date
            institucion: actividad.institucion, // Replace with institution name if needed
            observacion: actividad.descripcion || "",
          });
        }
        formData.Actividades = actividadesArray;
        
        console.log("Final Actividades Data:", formData.Actividades);
        


        const demandaMotivos = await getTDemandaMotivoIntervencions({ demanda: demandaId });
        const motivosArray = [];
        for (const motivo of demandaMotivos) {
          const motivoData = await getTMotivoIntervencion(motivo.motivo_intervencion);
          motivosArray.push({
            motivo: motivoData.nombre}
          );
        }


        // Fetch all related personas

        // Initialize arrays for categorization
        const nnyaInfoArray = [];
        const grupoFamiliarNNyAArray = [];
        const grupoFamiliarProgenitorArray = [];

        // Iterate over demandaPersonas
        for (const personaData of demandaPersonas) {
          // Fetch detailed persona data
          const personaDetails = await getTPersona(personaData.persona);

          // Categorize based on conditions
          if (personaDetails.nnya === true && personaData.nnya_principal === true) {
            nnyaInfoArray.push({
              apellidoNombre: personaDetails.nombre + ' ' + personaDetails.apellido || "",
              fechaNacimiento: personaDetails.fecha_nacimiento || "",
              dni: personaDetails.dni || "",
              legajoRunna: "",
            });
          } else if (personaDetails.nnya === true && personaData.nnya_principal === false) {
            grupoFamiliarNNyAArray.push({
              apellidoNombre: personaDetails.nombre + ' ' + personaDetails.apellido || "",
              fechaNacimiento: personaDetails.fecha_nacimiento || "",
              dni: personaDetails.dni || "",
            });
          } else if (personaDetails.nnya === false) {
            grupoFamiliarProgenitorArray.push({
              apellidoNombre: personaDetails.nombre + ' ' + personaDetails.apellido || "",
              fechaNacimiento: personaDetails.fecha_nacimiento || "",
              dni: personaDetails.dni || "",
              domicilio: personaDetails.domicilio || "",
              telefono: personaDetails.telefono || "",
            });
          }
        }

        formData.AdultosInfo = grupoFamiliarProgenitorArray;
        formData.motivoActuacion = motivosArray;
        formData.entrevistas = entrevistasArray;

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingTableData(false); // Set loading to false
      }
    };
  
    if (id) {
      fetchData();
    }
  }, [id]);  

  const [activeTab, setActiveTab] = useState(Object.keys(dataGroups)[0]);
  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };
  const handleDataChange = (groupKey, updatedData) => {
    setFormData((prev) => ({ ...prev, [groupKey]: updatedData }));
  };

  const handleDownloadReport = async () => {
    try {
      // Send formData to the webhook
      const response = await fetch("https://hook.us1.make.com/4i15ke3vtipnd9m6na287lm9q5nuagx9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Form data to be sent
      });

      if (!response.ok) {
        throw new Error("Failed to send data to webhook.");
      }
  
      // Parse the response to get the download link
      const responseData = await response.json();
      const downloadLink = responseData.downloadUrl; // Adjust this key based on webhook response
  
      if (!downloadLink) {
        throw new Error("No download link received from the webhook.");
      }
  
      // Trigger the download
      const link = document.createElement("a");
      link.href = downloadLink;
      link.download = "Informe.pdf";
      link.click();
  
      // Optionally, inform the user
      alert("Your download has started!");
    } catch (error) {
      console.error("Error in handleDownloadReport:", error);
      alert("There was an error generating the report. Please try again.");
    }
  };
  


  const fetchTIndicadoresValoracions = useCallback(async () => {
    try {
      const data = await getTIndicadoresValoracions();
      setIndicadores(data);
      setLoadingData(false);
    } catch (error) {
      console.error('Error fetching TIndicadoresValoracions:', error);
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchTIndicadoresValoracions();
  }, [fetchTIndicadoresValoracions]);

  const handleOptionChange = (id: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < indicadores.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const [selectedNNYA, setSelectedNNYA] = useState('');
  const [decisionSuggestions, setDecisionSuggestions] = useState<TsuggestDecision[]>([]);

  const handleNNYAChange = async (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;

    setSelectedNNYA(selectedId);

    try {
      const demandaId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
      const nnyaId = parseInt(selectedId);

      if (demandaId && nnyaId) {
        const data = await getTSuggestDecisions(demandaId, nnyaId);

        const legajosData = await getTLegajos({ nnya: selectedId });

        if (legajosData && legajosData.length > 0) {
          setTieneLegajo(true);
        } else {
          setTieneLegajo(false);
        }
        console.log('Legajos:', tieneLegajo);
      }
    } catch (error) {
      console.error('Error al obtener sugerencias de decisión o legajos:', error);
    }
  };

  const handleDecision = (decision: 'APERTURA DE LEGAJO' | 'RECHAZAR CASO' | 'MPI_MPE') => async () => {
    if (!justification.trim()) {
      alert("Por favor, ingrese una justificación antes de continuar.");
      return;
    }

    try {
      const data = {
        justificacion: justification,
        decision: decision,
        demanda: Number(id),
        nnya: Number(selectedNNYA),
      };
      console.log('Decision data:', data);
      await createTDecision(data, true, 'Decision tomada con exito !');

      // router.push('/mesadeentrada');

    } catch (error) {
      console.error('Error al enviar la decisión:', error.response.data);
      // alert('Error al enviar la decisión. Ya existe una decision tomada.');
    }
  };



  useEffect(() => {
    const fetchDecisionSuggestions = async () => {
      try {
        if (id && selectedNNYA) {
          const demandaId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
          const nnyaId = parseInt(selectedNNYA, 10);

          if (!isNaN(demandaId) && !isNaN(nnyaId)) {
            const data = await getTSuggestDecisions(demandaId, nnyaId);

            const suggestionsArray = Array.isArray(data) ? data : [data];
            setDecisionSuggestions(suggestionsArray);
          } else {
            console.error('ID o NNYA no válidos para parseInt.');
          }
        }
      } catch (error) {
        console.error('Error al obtener sugerencias de decisión al cargar:', error);
      }
    };

    fetchDecisionSuggestions();
  }, [id, selectedNNYA]);


  const [nnyaOptions, setNnyaOptions] = useState<TDemandaPersona[]>([]);

  const fetchNNYAData = useCallback(async () => {
    try {
      const allData = await getTDemandaPersonas({ 
        demanda: id
      });

      const PersonaData = await Promise.all(
        allData.map(async (persona) => {
          const persona_n = await getTPersona(persona.persona);
          return {
            ...persona_n,
            nnya_principal: allData.find(item => item.nnya_principal === true && item.persona === persona_n.id) ? true : false,
          }
        }
        )
      );

      console.log('PersonaData:', PersonaData);

      const nnyaData = PersonaData.filter((persona) => persona.nnya === true);

      console.log('NNYA Data:', nnyaData);

      setNnyaOptions(nnyaData);

      const principalData = detailedData.find(item => item.nnya_principal === true);
      if (principalData) {
        setSelectedNNYA(String(principalData.id));
      } else if (detailedData.length > 0) {
        setSelectedNNYA(String(detailedData[0].id));
      }
    } catch (error) {
      console.error('Error fetching NNYA data:', error);
    }
  }, [id]);


  useEffect(() => {
    if (id) fetchNNYAData();
  }, [fetchNNYAData, id]);



  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIndicadores = indicadores.slice(startIndex, endIndex);
  const totalPages = Math.ceil(indicadores.length / itemsPerPage);

  const handleEvaluate = async () => {
    const allSelected = indicadores.every((indicador) => selectedOptions[indicador.id]);

    if (!allSelected) {
      alert('Por favor, completa todos los indicadores antes de valorar.');
      return;
    }

    if (!id) {
      alert('No se ha encontrado el ID de la demanda.');
      return;
    }

    var count = 1;
    for (const indicador of indicadores) {
      const siNo = selectedOptions[indicador.id] === 'yes';
      const demanda = parseInt(id as string, 10);

      const evaluationData = {
        si_no: siNo,
        demanda: demanda,
        indicador: indicador.id,
      };

      try {
        if (count === indicadores.length) {
          await createTEvaluacion(evaluationData, true, 'Valoracion registrada con éxito!');
        } else {
          await createTEvaluacion(evaluationData);
        }
        console.log(`Evaluación para el indicador ${indicador.id} enviada correctamente.`);
        count++;
      } catch (error) {
        const errorMessage = error.message || error.toString();
        if (errorMessage.includes('Failed to create data')) {
          alert(`El indicador ${indicador.nombre} ya ha sido valorado.`);
        } else {
          alert(`Error inesperado en el indicador ${indicador.nombre}.`);
          console.error(`Error al enviar evaluación para el indicador ${indicador.id}:`, error);
        }
      }
    }
  };
  useEffect(() => {
    if (id) {
      fetchNNYAData();
    }
  }, [fetchNNYAData, id]);
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 3, overflow: 'auto' }}>
      <Box
        sx={{
          mt: 3,
          maxHeight: 400,
          overflowY: 'auto',
          borderRadius: 2,
          border: '1px solid #ddd',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        {loadingTableData ? (
          // Show a spinner or loading message while data is being fetched
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          // Render the tabs and EditableTable when data is ready
          <>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ mb: 4 }}
              variant="scrollable"
            >
              {Object.entries(dataGroups).map(([key, group]) => (
                <Tab key={key} label={group.title} value={key} />
              ))}
            </Tabs>
            {Object.entries(dataGroups).map(
              ([key, group]) =>
                activeTab === key && (
                  <EditableTable
                    key={key}
                    groupKey={key}
                    group={group}
                    data={formData}
                    onDataChange={handleDataChange}
                  />
                )
            )}
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontSize: '1.1rem',
          padding: '6px 50px',
        }}
        onClick={handleDownloadReport}
      >
        Generar Informe
      </Button>
      </Box>

      <Box
        sx={{
          mt: 3,
          maxHeight: 400,
          overflowY: 'auto',
          borderRadius: 2,
          border: '1px solid #ddd',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
          Sobre los datos del caso
        </Typography>

        {loadingData ? (
          <Typography>Cargando datos...</Typography>
        ) : (
          <>
            {currentIndicadores.map((indicador, index) => (
              <Box key={indicador.id} sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: '500',
                    color: 'text.primary',
                    fontSize: '1.1rem',
                    mb: 0.5,
                  }}
                >
                  {startIndex + index + 1}. {indicador.nombre}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={selectedOptions[indicador.id] || ''}
                    onChange={(e) => handleOptionChange(indicador.id, e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="SI" />
                    <FormControlLabel value="no" control={<Radio />} label="NO" />
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ mr: 2, color: 'text.primary' }}>
            Página {currentPage} de {totalPages}
          </Typography>
          <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            fontSize: '1.1rem',
            padding: '6px 50px',
          }}
          onClick={handleEvaluate}
        >
          Valorar
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3, p: 3, backgroundColor: '#f0f0f0', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="body1" sx={{ mr: 2, fontWeight: '500', color: 'text.primary' }}>
          Tomar decisión sobre NNYA:
        </Typography>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel id="nnya-select-label" shrink>
            Seleccionar NNYA
          </InputLabel>
          <Select
            labelId="nnya-select-label"
            value={selectedNNYA}
            onChange={handleNNYAChange}
            displayEmpty
            label="Seleccionar NNYA"
          >
            {nnyaOptions.map((nnya) => (
              <MenuItem key={nnya.id} value={String(nnya.id)}>
                {nnya.id} {nnya.nombre} {nnya.apellido} {nnya.nnya_principal ? '(principal) ' : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {decisionSuggestions.length > 0 && (
        <Box sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            Sugerencias de decisión
          </Typography>
          {decisionSuggestions.map((suggestion, index) => (
            <Box key={index} sx={{ mb: 3, p: 3, border: '1px solid #ddd', borderRadius: 1, backgroundColor: 'background.default' }}>
              <Typography variant="body1" sx={{ fontWeight: '500', color: 'primary.main', mb: 1 }}>
                Decisión sugerida:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                {suggestion.decision}
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: '500', color: 'primary.main', mb: 1 }}>
                Razón:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                {suggestion.reason}
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: '500', color: 'primary.main', mb: 1 }}>
                Scores de Demanda:
              </Typography>
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '2px solid #ddd', padding: '8px', textAlign: 'left', color: 'black' }}>Score</th>
                      <th style={{ borderBottom: '2px solid #ddd', padding: '8px', textAlign: 'left', color: 'black' }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(suggestion['Demanda Scores']).map(([key, value]) => (
                      <tr key={key}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', color: 'black' }}>{key}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', color: 'black' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              <Typography variant="body1" sx={{ fontWeight: '500', color: 'primary.main', mb: 1 }}>
                Scores de NNyA:
              </Typography>
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '2px solid #ddd', padding: '8px', textAlign: 'left', color: 'black' }}>Score</th>
                      <th style={{ borderBottom: '2px solid #ddd', padding: '8px', textAlign: 'left', color: 'black' }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(suggestion['NNyA Scores']).map(([key, value]) => (
                      <tr key={key}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', color: 'black' }}>{key}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', color: 'black' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              <TextField
                fullWidth
                label="Justificación"
                multiline
                rows={4}
                sx={{
                  mb: 3,
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                  },
                }}
                onChange={(e) => setJustification(e.target.value)}
              />

              {tieneLegajo ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      fontSize: '1rem',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: '#f8d7da',
                        borderColor: '#d32f2f',
                      },
                    }}
                    onClick={handleDecision('RECHAZAR CASO')}
                  >
                    Archivar caso
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      fontSize: '1rem',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        borderColor: '#1976d2',
                      },
                    }}
                    onClick={handleDecision('MPI_MPE')}
                  >
                    Abrir MPI-MPE
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      fontSize: '1rem',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: '#f8d7da',
                        borderColor: '#d32f2f',
                      },
                    }}
                    onClick={handleDecision('RECHAZAR CASO')}
                  >
                    Archivar caso
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      fontSize: '1rem',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        borderColor: '#1976d2',
                      },
                    }}
                    onClick={handleDecision('APERTURA DE LEGAJO')}
                  >
                    Abrir Legajo
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}


