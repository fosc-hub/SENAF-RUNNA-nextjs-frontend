import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleSection({ title, children, isOpen, onToggle }: CollapsibleSectionProps) {
  return (
    <Paper sx={{ mb: 3 }} elevation={3}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      {isOpen && <Box sx={{ p: 2 }}>{children}</Box>}
    </Paper>
  );
}

