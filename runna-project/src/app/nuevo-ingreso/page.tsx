'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  createTheme,
  ThemeProvider
} from '@mui/material'
import { MultiStepForm } from '../../components/ui/Form/MultiStepForm'
import { useApiData } from '../../components/ui/NuevoIngresoModal/useApiData'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const theme = createTheme({
  components: {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#333',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: '#333',
        },
        h6: {
          color: '#333',
        },
        subtitle1: {
          color: '#333',
        },
      },
    },
  },
})

export default function NuevoIngresoPage() {
  const apiData = useApiData()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)
    try {
      console.log('Form submitted:', formData)
      toast.success('¡Se agregó el registro con éxito!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      })
      router.push('/')
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Ocurrió un error al guardar el registro. Por favor, intente nuevamente.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Nuevo Registro
        </Typography>
        <MultiStepForm onSubmit={handleSubmit} apiData={apiData} />
      </Box>
    </ThemeProvider>
  )
}
