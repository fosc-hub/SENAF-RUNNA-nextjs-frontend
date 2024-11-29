'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CardHeader } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getUsers } from '../../api/TableFunctions/user_me';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Fix: Add explicit types for the parameters
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        { username, password },
        { withCredentials: true }
      );

      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Error during login:', error);
      setError('Login failed. Please check your credentials.');
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
      setError('Invalid credentials or server error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
      <Box component="header" sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 2, bgcolor: '#0EA5E9' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: 'white' }}>
          Runna
        </Typography>
      </Box>
      <Box component="main" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
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
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
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
