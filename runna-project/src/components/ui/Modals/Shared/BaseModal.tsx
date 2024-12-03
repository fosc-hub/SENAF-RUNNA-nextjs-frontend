import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { X } from 'lucide-react';

const steps = ['Ingreso', 'Niños y Adolescentes', 'Adultos Convivientes', 'Presunta Vulneración', 'Condiciones de Vulnerabilidad']

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  renderStepContent: (props: {
    activeStep: number;
    formData: any;
    
    handleInputChange: (field: string, value: any) => void;
  }) => JSX.Element;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  initialStep?: number;
}

const BaseModal: React.FC<BaseModalProps> = ({
  
  isOpen,
  onClose,
  onSubmit,
  renderStepContent,
  formData,
  setFormData,
  initialStep = 0,
}) => {
  console.log('BaseModal formData:', formData); // Log here
  const [activeStep, setActiveStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);
  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData: any) => {
      const updatedData = { ...prevData }
      const fieldParts = field.split('.')
      let current = updatedData
      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (fieldParts[i].includes('[')) {
          const [arrayName, indexStr] = fieldParts[i].split('[')
          const index = parseInt(indexStr.replace(']', ''))
          current = current[arrayName][index]
        } else {
          current = current[fieldParts[i]]
        }
      }
      current[fieldParts[fieldParts.length - 1]] = value
      return updatedData
    })
  }
  const handleNext = () => setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0));



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('BaseModal formData:', formData);
       onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '800px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          height: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Form Modal</Typography>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </Box>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent({ activeStep, formData, handleInputChange })}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default BaseModal;
