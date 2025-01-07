'use client'

import React, { useState } from 'react'
import { Box, Typography, Button, CircularProgress} from '@mui/material'
import { MultiStepForm } from '../../components/ui/Form/MultiStepForm'
import { useApiData } from '../../components/ui/NuevoIngresoModal/useApiData'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

  

export default function NuevoIngresoPage() {
    const apiData = useApiData()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
  
    const handleSubmit = async (formData: any) => {
      setIsSubmitting(true)
      try {
        // Implement the form submission logic here
        // This should be similar to the handleSubmit function in the NuevoIngresoModal
        console.log('Form submitted:', formData)
        // Add your form submission logic here
  
        // Assuming the submission is successful:
        toast.success('¡Se agregó el registro con éxito!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        })
  
        // Navigate back to the main page
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
        
      <Box sx={{ p: 4, bgcolor: 'background.paper', minHeight: '100vh' }}>

        <Typography variant="h4" sx={{ mb: 4, color: '#000' }}>Nuevo Registro</Typography>
        <MultiStepForm onSubmit={handleSubmit} apiData={apiData} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        </Box>
      </Box>
    )
  }
  
  
