import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import { Step0Form } from './step0Form'
import { ChildAdolescentForm } from './step1Form';
import { useApiData } from '../NuevoIngresoModal/useApiData';
import { AdultosConvivientesForm } from './step2Formt';

const steps = ['Ingreso', 'Adultos Convivientes', 'Niños y Adolescentes', 'Presunta Vulneración', 'Condiciones de Vulnerabilidad'];

export const MultiStepForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<{
    ingreso?: any;
    adultosConvivientes?: any[];
    ninosAdolescentes?: any[];
  }>({});
  const apiData = useApiData();

  const handleNext = () => {
    // Save current step data without validation
    const currentStepData = getCurrentStepData();
    setFormData((prevData) => ({
      ...prevData,
      ...currentStepData,
    }));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepSubmit = (stepData: any) => {
    setFormData((prevData) => {
      const newData = { ...prevData };
      switch (activeStep) {
        case 0:
          newData.ingreso = stepData;
          break;
        case 1:
          newData.adultosConvivientes = stepData;
          break;
        case 2:
          newData.ninosAdolescentes = stepData;
          break;
        // Add cases for other steps as needed
      }
      return newData;
    });
    // Move to the next step after successful submission
    handleNext();
  };

  const getCurrentStepData = () => {
    // This function should return the current form data without validation
    // You may need to implement this based on your form structure
    switch (activeStep) {
      case 0:
        return { ingreso: formData.ingreso };
      case 1:
        return { adultosConvivientes: formData.adultosConvivientes };
      case 2:
        return { ninosAdolescentes: formData.ninosAdolescentes };
      // Add cases for other steps as needed
      default:
        return {};
    }
  };

  const handleFinalSubmit = () => {
    // Here you would submit the entire formData to your backend
    console.log('Final form data:', formData);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step0Form onSubmit={handleStepSubmit} apiData={apiData} initialData={formData.ingreso} />;
      case 1:
        return <AdultosConvivientesForm onSubmit={handleStepSubmit} apiData={apiData} initialData={formData.adultosConvivientes} />;
      case 2:
        return (
          <ChildAdolescentForm 
            onSubmit={handleStepSubmit} 
            apiData={apiData} 
            adultosConvivientes={formData.adultosConvivientes || []}
            initialData={formData.ninosAdolescentes}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        {activeStep === steps.length ? (
          <Box>
            <p>All steps completed - you&apos;re finished</p>
            <Button onClick={handleFinalSubmit}>Submit</Button>
          </Box>
        ) : (
          <Box>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

