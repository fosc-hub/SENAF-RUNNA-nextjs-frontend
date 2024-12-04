import React, { useEffect } from 'react';
import BaseModal from '../Shared/BaseModal';
import { useFormData } from '../Shared/useFormData';
import { useApiData } from '../Shared/useApiData';
import RenderStepContent from '../Shared/RenderstepContent';

const DemandaDetalleModal = ({ isOpen, onClose, demanda }) => {
  const apiData = useApiData(); // Fetch API data dynamically
  const {
    formData,
    setFormData,
    handleInputChange,
    addNinoAdolescente,
    addAdultoConviviente,
    addVulneraciontext,
    addCondicionVulnerabilidad,
    removeCondicionVulnerabilidad,
  } = useFormData(demanda, apiData);

  // Synchronize localizacion into formData
  useEffect(() => {
    if (apiData.localizacion) {
      handleInputChange('localizacion', {
        ...formData.localizacion,
        ...apiData.localizacion,
      });
    }
  }, [apiData.localizacion, handleInputChange]);

  // Synchronize ninosAdolescentes
  useEffect(() => {
    if (apiData.nnyaList) {
      handleInputChange('ninosAdolescentes', apiData.nnyaList);
    }
  }, [apiData.nnyaList, handleInputChange]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      formData={formData}
      setFormData={setFormData}
      renderStepContent={({ activeStep }) => (
        <RenderStepContent
          activeStep={activeStep}
          formData={formData}
          handleInputChange={handleInputChange}
          addNinoAdolescente={addNinoAdolescente}
          addAdultoConviviente={addAdultoConviviente}
          addVulneraciontext={addVulneraciontext}
          addCondicionVulnerabilidad={addCondicionVulnerabilidad}
          removeCondicionVulnerabilidad={removeCondicionVulnerabilidad}
          {...apiData} // Pass all API data to RenderStepContent
        />
      )}
    />
  );
};

export default DemandaDetalleModal;
