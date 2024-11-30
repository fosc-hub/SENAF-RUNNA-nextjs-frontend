import React from 'react';
import { toast } from 'react-toastify';

interface ErrorToastProps {
  message: string;
  details: string;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, details }) => {
  const handleCopyDetails = () => {
    navigator.clipboard.writeText(details);
    toast.success('El codigo del error se copio al portapapeles.');
  };

  return (
    <div>
      <p>{message}</p>
      <button
        onClick={handleCopyDetails}
        style={{
          background: 'none',
          border: 'none',
          color: '#007BFF',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
          margin: 0,
        }}
      >
        Ver detalles
      </button>
    </div>
  );
};

export default ErrorToast;
