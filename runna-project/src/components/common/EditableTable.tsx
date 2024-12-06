import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const EditableTable = ({ groupKey, group, data, onDataChange }) => {
  const handleInputChange = (rowIndex, fieldKey, value) => {
    const updatedGroupData = group.multiRow
      ? data[groupKey].map((row, i) =>
          i === rowIndex ? { ...row, [fieldKey]: value } : row
        )
      : { ...data[groupKey], [fieldKey]: value };

    onDataChange(groupKey, updatedGroupData);
  };

  const handleAddRow = () => {
    const newRow = group.fields.reduce((acc, field) => {
      acc[field.key] = ""; // Initialize empty fields
      return acc;
    }, {});
    onDataChange(groupKey, [...data[groupKey], newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedRows = data[groupKey].filter((_, i) => i !== rowIndex);
    onDataChange(groupKey, updatedRows);
  };

  const groupData = data[groupKey] || (group.multiRow ? [] : {});

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {group.title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {group.fields.map((field) => (
                <TableCell key={field.key}>{field.label}</TableCell>
              ))}
              {group.multiRow && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {group.multiRow
              ? groupData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {group.fields.map((field) => (
                      <TableCell key={field.key}>
                        <TextField
                          value={row[field.key] || ""}
                          onChange={(e) =>
                            handleInputChange(rowIndex, field.key, e.target.value)
                          }
                          fullWidth
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton onClick={() => handleDeleteRow(rowIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  {group.fields.map((field) => (
                    <TableCell key={field.key}>
                      <TextField
                        value={groupData[field.key] || ""}
                        onChange={(e) =>
                          handleInputChange(null, field.key, e.target.value)
                        }
                        fullWidth
                      />
                    </TableCell>
                  ))}
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
      {group.multiRow && (
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddRow}
          sx={{ mt: 2 }}
        >
          Agregar Fila
        </Button>
      )}
    </Box>
  );
};

export default EditableTable;
