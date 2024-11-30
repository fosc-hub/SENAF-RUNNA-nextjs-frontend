'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CardHeader, IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material'; // Icono para copiar texto
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Slide, toast } from 'react-toastify'; // Importar Toastify
import { getUsers } from '../../api/TableFunctions/user_me';
import { errorMessages } from '../../utils/errorMessages';
import { handleApiError } from '../../api/utils/errorHandler';
import axiosInstance from '../../api/utils/axiosInstance';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorDetails, setErrorDetails] = useState(''); // Para los detalles del error
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('¡Texto copiado al portapapeles!', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      theme: 'light',
    });
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response =  await axiosInstance.post('/login/', { username, password },
        { withCredentials: true }
      );

      toast.success('¡Inicio de sesión exitoso!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        transition: Slide,
      });

      console.log('Login successful:', response.data);
    } catch (error: any) {
      console.error('Error during login:', error);


      const statusCode = error?.response?.status || 'Desconocido';
      const message = errorMessages[statusCode] || 'Ocurrio un error';
      // Guardar los detalles del error
      const errorCode = error?.response?.status || 'Desconocido';
      const errorMessage = error?.response?.data?.message || 'Sin detalles adicionales.';
      const errorDetails = `Código de error: ${errorCode}\nRespuesta del servidor: ${JSON.stringify(error?.response?.data)}`;
      setErrorDetails(errorDetails);
      
      // Mostrar notificación con botón para ver detalles
      
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('username', username);
      console.log('password', password);

      // Log in
      await login(username, password);

      const userData = await getUsers();
      console.log('UserData:', userData);

      // Save user data to localStorage or a global context
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect to the main page
      router.push('/mesadeentrada');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box component="header" sx={{ width: '100%', py: 2, bgcolor: '#0EA5E9' }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            textAlign: 'center',
            color: 'white',
            paddingBottom: 2,
          }}
        >
          Runna
        </Typography>
      </Box>
      <Box component="main" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, bgcolor: '#E5E5E5' }}>
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)' }}>
          <CardHeader title="Iniciar sesión" titleTypographyProps={{ align: 'center', variant: 'h5' }} />
          <CardContent>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nombre de usuario"
                name="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}>
                INGRESAR
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
