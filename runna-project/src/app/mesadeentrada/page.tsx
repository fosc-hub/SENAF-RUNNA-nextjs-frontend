'use client';

import { useEffect } from 'react';
import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { MainContent } from '../../components/ui/MainContent';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

// Configuración del tema de Material UI
const theme = createTheme({
  components: {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#333', // Color personalizado para las etiquetas
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          color: '#333', // Color por defecto deseado para h6
        },
      },
    },
  },
});

// Componente principal que envuelve la aplicación con los proveedores de contexto
export default function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <MesaDeEntradas />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Componente MesaDeEntradas que contiene la lógica principal
function MesaDeEntradas() {
  const [demands, setDemands] = useState([]); // Estado para almacenar las demandas
  const router = useRouter(); // Hook useRouter para la navegación
  const { user, loading } = useAuth(); // Hook useAuth para obtener el usuario y el estado de carga
  const [isClient, setIsClient] = useState(false); // Estado para verificar si el componente está en el cliente

  // Función para manejar la actualización de las demandas
  const handleUpdateDemands = (updatedDemands: any) => {
    setDemands(updatedDemands);
  };

  // Función para manejar el clic en la evaluación
  const evaluacionClicked = (id: number) => {
    if (isClient) { // Solo permitir navegación si estamos en el cliente
      router.push(`/evaluaciones/${id}`);
    }
  };

  // useEffect para establecer que el componente está montado en el cliente
  useEffect(() => {
    setIsClient(true); // Marca que estamos en el cliente para evitar problemas con useRouter
  }, []);

  // Mostrar un spinner o indicador de carga mientras se obtienen los datos del usuario
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si no hay un usuario autenticado, mostrar un mensaje de login requerido
  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  // Renderizado del componente principal
  return (
    <div className="flex flex-col h-screen">
      {/* Componente de cabecera con información del usuario */}
      <Header
        user={{
          initials: user.initials || user.first_name.charAt(0) + user.last_name.charAt(0),
          name: user.username,
          role: user.is_superuser
            ? 'Administrador del Sistema'
            : user.groups.length > 0
            ? user.groups[0]['name']
            : 'Usuario',
          legajo: user.telefono,
        }}
      />
      
      {/* Sección de bienvenida y la fecha/hora */}
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Bienvenido a <span className="text-sky-500">Mesa de Entradas</span>
        </h1>
        <span className="text-gray-500">
          {new Date().toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
          })} |{' '}
          {new Date().toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Layout principal con Sidebar y el contenido */}
      <div className="flex-1 flex">
        <Sidebar />
      <MainContent
            asignadoProp={null}
            constatacionProp={null}
            evaluacionProp={null}
            archivadoProp={null}
            completadoProp={null}
            recibidoProp={null}
            onEvaluacionClick={evaluacionClicked}
          />
      </div>
    </div>
  );
}