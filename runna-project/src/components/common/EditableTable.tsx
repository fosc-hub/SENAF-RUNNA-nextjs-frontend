import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const EditableTable = ({ data, onDataChange }) => {
  const [rows, setRows] = useState(data || []);

  const handleInputChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    onDataChange(updatedRows); // Notify parent of data change
  };

  const handleAddRow = () => {
    setRows([...rows, { nombre: '', dni: '' }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    onDataChange(updatedRows);
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={row.nombre}
                    onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                    placeholder="Nombre"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.dni}
                    onChange={(e) => handleInputChange(index, 'dni', e.target.value)}
                    placeholder="DNI"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button startIcon={<AddIcon />} onClick={handleAddRow} sx={{ mt: 2 }}>
        Agregar Fila
      </Button>
    </Box>
  );
};

export default EditableTable;
