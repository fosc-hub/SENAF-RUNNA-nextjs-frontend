'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
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
import { getTPersona } from '../../api/TableFunctions/personas';
import { getTSuggestDecisions } from '../../api/TableFunctions/suggestDecision';
import { TsuggestDecision } from '../../api/interfaces';
import { getTLegajos } from '../../api/TableFunctions/legajos';
import { createTDecision } from '../../api/TableFunctions/decisiones';
import { useRouter } from 'next/navigation';

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

  const handleDownloadReport = async () => {
    const data = {
      localidad: 'Buenos Aires',
      fecha: '04/12/2024',
      cargo: 'Director',
      nombreApellido: 'John Doe',
      familiares: [
        { nombre: 'Jane Doe', dni: '12345678' },
        { nombre: 'Jim Doe', dni: '87654321' },
      ],
      conclusiones: 'Caso cerrado satisfactoriamente.',
      refNumero: '1234/2024',
    };
  
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Informe.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      console.error('Error downloading the PDF');
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
    try {
      const data = {
        justificacion: justification,
        decision: decision,
        demanda: Number(id),
        nnya: Number(selectedNNYA),
      };
      console.log('Decision data:', data);
      await createTDecision(data);

      console.log('Decision successfully created!');
      router.push('/mesadeentrada');

    } catch (error) {
      alert('Error al enviar la decisión. Ya existe una decision tomada.');
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
      const allData = await getTDemandaPersonas({ demanda: id });

      const detailedData = await Promise.all(
        allData.map(async (nnya) => {
          const personaData = await getTPersona(nnya.persona);
          return { ...nnya, nombrePersona: personaData.nombre };
        })
      );

      setNnyaOptions(detailedData);

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

    for (const indicador of indicadores) {
      const siNo = selectedOptions[indicador.id] === 'yes';
      const demanda = parseInt(id as string, 10);

      const evaluationData = {
        si_no: siNo,
        demanda: demanda,
        indicador: indicador.id,
      };

      try {
        await createTEvaluacion(evaluationData);
        console.log(`Evaluación para el indicador ${indicador.id} enviada correctamente.`);
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
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadReport}>
          Descargar Informe
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
                {nnya.nombrePersona}
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

              {!tieneLegajo ? (
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
