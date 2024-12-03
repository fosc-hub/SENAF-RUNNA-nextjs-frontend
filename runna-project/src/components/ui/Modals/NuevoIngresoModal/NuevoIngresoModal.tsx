import React from 'react';
import BaseModal from '../Shared/BaseModal';
import { useFormData } from '../Shared/useFormData';
import { useApiData } from '../Shared/useApiData';
import RenderStepContent from '../Shared/RenderstepContent';

interface NuevoIngresoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const NuevoIngresoModal: React.FC<NuevoIngresoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { formData, handleInputChange,setFormData, addNinoAdolescente, addAdultoConviviente, addVulneraciontext, addCondicionVulnerabilidad, removeCondicionVulnerabilidad } = useFormData()
  const apiData = useApiData();

  console.log('NuevoIngresoModal formData:', formData); // Log here

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      formData={formData}
      setFormData={setFormData}
      renderStepContent={({ activeStep, formData, handleInputChange }) => (
        <RenderStepContent
          addAutor={undefined} addVulneracionApi={undefined} institucionesUsuarioExterno={undefined} vinculosUsuarioExterno={undefined} activeStep={activeStep}
          formData={formData}
          handleInputChange={handleInputChange}
          addNinoAdolescente={addNinoAdolescente}
          addAdultoConviviente={addAdultoConviviente}
          addVulneraciontext={addVulneraciontext}
          addCondicionVulnerabilidad={addCondicionVulnerabilidad}
          removeCondicionVulnerabilidad={removeCondicionVulnerabilidad}
          {...apiData} />
      )} apiMethods={undefined} onSuccess={function (): void {
        throw new Error('Function not implemented.');
      } }    />
  );
};

export default NuevoIngresoModal;
