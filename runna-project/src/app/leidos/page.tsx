'use client';

import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { MainContent } from '../../components/ui/MainContent';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#333', // Change to your desired color
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          color: '#333', // Desired default color for h6
        },
      },
    },
  },
});
export default function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <MesaDeEntradas />
      </ThemeProvider>
    </AuthProvider>
  );
}


function MesaDeEntradas() {
  const [demands, setDemands] = useState([]);

  const { user, loading } = useAuth(); // Now wrapped by AuthProvider

  const handleUpdateDemands = (updatedDemands: any) => {
    setDemands(updatedDemands);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder
  }

  if (!user) {
    return <div>Please log in to access this page.</div>; // Handle unauthenticated state
  }

  return (
    <div className="flex flex-col h-screen">
      <Header user={
        {
          initials: user.initials || user.first_name.charAt(0) + user.last_name.charAt(0),
          name: user.username,
          role: user.is_superuser ? 'Administrador del Sistema' : user.groups.length > 0 ? user.groups[0]['name'] : 'Usuario',
          legajo: user.telefono,
        }
      } />
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Bienvenido a <span className="text-sky-500">Mesa de Entradas</span>
        </h1>
        <span className="text-gray-500">
          {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })} | {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    <div className="flex-1 flex">
      <Sidebar />
      <MainContent
        asignadoProp={null}
        constatacionProp={null}
        evaluacionProp={null}
        archivadoProp={false}
        completadoProp={false}
        recibidoProp={true}
      />
    </div>
    </div>
  );
}
