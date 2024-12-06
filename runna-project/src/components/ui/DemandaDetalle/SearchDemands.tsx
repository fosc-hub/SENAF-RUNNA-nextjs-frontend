import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
interface NnyaPrincipalData {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    demandaId: number;
  }
interface SearchDemandsProps {
  demandaId: number;
  nnyaPrincipales: NnyaPrincipalData[];
  selectedNnya: string;
  setSelectedNnya: (value: string) => void;
  vinculacionError: string;
  handleVincular: () => void;
  loadingConexiones: boolean;
}

export default function SearchDemands({
  demandaId,
  nnyaPrincipales,
  selectedNnya,
  setSelectedNnya,
  vinculacionError,
  handleVincular,
  loadingConexiones,
}: SearchDemandsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NnyaPrincipalData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = () => {
    setIsSearching(true);
  
    // Filter by matching either full name or DNI
    const filteredNnya = nnyaPrincipales.filter((nnya) =>
      `${nnya.nombre} ${nnya.apellido}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nnya.dni?.toString().includes(searchQuery)
    );
  
    setSearchResults(filteredNnya);
    setIsSearching(false);
  };
  

  const handleResultSelect = (nnya: NnyaPrincipalData) => {
    setSelectedNnya(nnya.id.toString());
    setSearchQuery(`${nnya.nombre} ${nnya.apellido} - DNI: ${nnya.dni}`);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Buscar NNYA Principal</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar NNYA..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          error={!!vinculacionError}
          helperText={vinculacionError}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleVincular}
          disabled={!selectedNnya || loadingConexiones}
          startIcon={<ChildCareIcon />}
        >
          Vincular
        </Button>
      </Box>

      {isSearching ? (
        <CircularProgress />
      ) : searchResults.length > 0 && (
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Resultados de búsqueda</Typography>
          <List>
            {searchResults.map((nnya) => (
              <ListItem
                key={nnya.id}
                button
                onClick={() => handleResultSelect(nnya)}
                selected={selectedNnya === nnya.id.toString()}
              >
                <ListItemText
                  primary={`${nnya.nombre} ${nnya.apellido}`}
                  secondary={`DNI: ${nnya.dni} - Demanda ID: ${nnya.demandaId}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
}

