import React, { useEffect } from 'react';
import BaseModal  from '../Shared/BaseModal';
import { useApiData } from '../Shared/useApiData';

const DemandaDetalle = ({ isOpen, onClose, demanda }) => {
  const { apiData, isLoading } = useApiData();

  useEffect(() => {
    // Fetch data related to the selected demanda, if necessary
  }, [demanda]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Demanda"
    >
      <RenderStepContent
        activeStep={0} // Pass appropriate step for demanda details
        formData={demanda} // Pass the demand data
        handleInputChange={() => {}} // Handle changes if edit is allowed
        {...apiData}
      />
    </BaseModal>
  );
};

export default DemandaDetalle;
