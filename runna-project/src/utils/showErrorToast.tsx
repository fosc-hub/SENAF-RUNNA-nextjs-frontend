import React from 'react';
import { toast } from 'react-toastify';
import ErrorToast from '../components/ui/ErrorToast';


export const showErrorToast = (message: string, details: string): void => {
  toast.error(<ErrorToast message={message} details={details} />, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
  
};
