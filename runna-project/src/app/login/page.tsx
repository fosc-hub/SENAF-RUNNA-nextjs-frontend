import React from 'react'
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader 
} from '@mui/material'

export default function LoginPage() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.paper', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      <Box 
        component="header" 
        sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          py: 2,
          bgcolor: '#0EA5E9', // MUI primary blue color
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold"
          sx={{ color: 'white' }}
        >
          Runna
        </Typography>
      </Box>
      
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          px: 2 
        }}
      >
        <Card 
          sx={{ 
            width: '100%', 
            maxWidth: 400,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)' // Enhanced shadow
          }}
        >
          <CardHeader 
            title="Iniciar sesión" 
            titleTypographyProps={{ align: 'center', variant: 'h5' }}
          />
          <CardContent>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}
              >
                INGRESAR
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  component="a" 
                  href="#" 
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

