import React, { useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  Paper,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material'

export default function ActividadesRegistradasModal({ isOpen, onClose, demanda }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => setIsExpanded(!isExpanded)

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '600px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Paper sx={{ mb: 3 }} elevation={3}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleToggle}
          >
            <Typography variant="h6" color="primary">
              Actividades Registradas
            </Typography>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          {isExpanded && (
            <Box sx={{ p: 2 }}>
              <Typography>
                Este es el contenido que se muestra al descolapsarlo. Puedes personalizar este texto según tus necesidades.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Modal>
  )
}
