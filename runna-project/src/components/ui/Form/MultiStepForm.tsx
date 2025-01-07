import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import { Step0Form } from './step0Form'
import { ChildAdolescentForm } from './step1Form';
import { AdultosConvivientesForm } from './step2Formt';
import { useApiData } from '../NuevoIngresoModal/useApiData';

const steps = [
  'Ingreso',
  'Adultos Convivientes',
  'Niños y Adolescentes',
];

export const MultiStepForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Centralized form state
  const [formData, setFormData] = useState<{
    ingreso: any;
    adultosConvivientes: any[];
    ninosAdolescentes: any[];
  }>({
    ingreso: {},
    adultosConvivientes: [],
    ninosAdolescentes: []
  });

  const apiData = useApiData();

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepSubmit = (stepKey: string, stepData: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [stepKey]: stepData
    }));
    handleNext();
  };

  const handleFinalSubmit = () => {
    // Here you would submit the entire formData to your backend
    console.log('Final form data:', formData);
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
          // If all steps completed
          <Box>
            <p>All steps completed - you&apos;re finished</p>
            <Button onClick={handleFinalSubmit}>Submit</Button>
          </Box>
        ) : (
          <>
            {/* 
              STEP 0: 
              Keep it mounted, but hide if not active. 
              Notice we pass 'ingreso' as stepKey to handleStepSubmit.
            */}
            <Box
              sx={{
                display: activeStep === 0 ? 'block' : 'none'
              }}
            >
              <Step0Form
                onSubmit={(data: any) => handleStepSubmit('ingreso', data)}
                apiData={apiData}
                initialData={formData.ingreso}
              />
            </Box>

            {/* STEP 1 */}
            <Box
              sx={{
                display: activeStep === 1 ? 'block' : 'none'
              }}
            >
              <AdultosConvivientesForm
                onSubmit={(data: any) => handleStepSubmit('adultosConvivientes', data)}
                apiData={apiData}
                initialData={formData.adultosConvivientes}
              />
            </Box>

            {/* STEP 2 */}
            <Box
              sx={{
                display: activeStep === 2 ? 'block' : 'none'
              }}
            >
              <ChildAdolescentForm
                onSubmit={(data: any) => handleStepSubmit('ninosAdolescentes', data)}
                apiData={apiData}
                adultosConvivientes={formData.adultosConvivientes || []}
                initialData={formData.ninosAdolescentes}
              />
            </Box>

            {/* 
              You can continue this pattern for steps 3, 4, etc.
              Keep each step's component mounted, but hide when not active.
            */}

            {/* Step navigation buttons */}
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
          </>
        )}
      </Box>
    </Box>
  );
};
