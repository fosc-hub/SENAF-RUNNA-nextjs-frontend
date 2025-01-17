import React, { useState, useEffect } from 'react';
import { getTInstitucionRespuestas } from '../../api/TableFunctions/institucionRespuestas';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Label } from './Label';
import { Paperclip, X } from 'lucide-react';
import { Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale';

interface EnviarRespuestaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: ResponseData) => void;
  idDemanda: number;
}

interface InstitutionOption {
  value: string;
  label: string;
  mail: string;
}

interface ResponseData {
  institucion: number;
  mail: string;
  mensaje: string;
  attachments: string[];
  // fecha_y_hora: Date | null;
  demanda: number;
}

export function EnviarRespuestaModal({ isOpen, onClose, onSend, idDemanda }: EnviarRespuestaModalProps) {
  const [responseData, setResponseData] = useState<ResponseData>({
    institucion: 0,
    mail: '',
    mensaje: '',
    attachments: [],
    // fecha_y_hora: null,
    demanda: idDemanda,
  });

  const [institutionOptions, setInstitutionOptions] = useState<InstitutionOption[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchInstitutions = async () => {
        try {
          const data = await getTInstitucionRespuestas();
          const formattedData = data.map((inst: any) => ({
            value: inst.id.toString(),
            label: inst.nombre,
            mail: inst.mail,
          }));
          setInstitutionOptions(formattedData);
        } catch (error) {
          console.error('Error al cargar instituciones:', error);
        }
      };

      fetchInstitutions();
    }
  }, [isOpen]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResponseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInstitutionChange = (event: SelectChangeEvent<string>) => {
    const institutionId = Number(event.target.value);
    const selectedInstitution = institutionOptions.find(
      (option) => option.value === event.target.value
    );
    const institutionEmail = selectedInstitution ? selectedInstitution.mail : '';

    setResponseData((prev) => ({
      ...prev,
      institucion: institutionId,
      mail: institutionEmail,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setResponseData((prev) => ({ ...prev, fecha_y_hora: date }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };


  const handleRemoveAttachment = (fileName: string) => {
    setResponseData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((name) => name !== fileName),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setResponseData((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          ...Array.from(newFiles).map((file) => file.name),
        ],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(responseData.mail)) {
      window.alert('El correo electrónico no tiene un formato válido.');
      return;
    }

    const { attachments, institucion, ...dataToSend } = responseData;

    const dataToSendWithInstitutionAsNumber = {
      ...dataToSend,
      institucion: Number(institucion),
      attachments: attachments,
      idDemanda,
    };

    onSend(dataToSendWithInstitutionAsNumber);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Respuesta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="institution" className="font-bold text-gray-700">
            Institución
          </Label>
          <FormControl fullWidth>
            <InputLabel id="institution-label">Seleccionar Institución</InputLabel>
            <Select
              labelId="institution-label"
              id="institution"
              value={responseData.institucion.toString()}
              onChange={handleInstitutionChange}
              label="Seleccionar Institución"
            >
              {institutionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* 
        <div className="space-y-2">
          <Label htmlFor="fecha_y_hora" className="font-bold text-gray-700">
            Fecha y Hora
          </Label>
          <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
              <DateTimePicker
                label="Seleccionar Fecha y Hora"
                value={responseData.fecha_y_hora ? new Date(responseData.fecha_y_hora) : null}
                onChange={handleDateChange}
                ampm={false}
                renderInput={(params) => <Input {...params} fullWidth />}
              />
            </LocalizationProvider>
          </div>
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="mail" className="font-bold text-gray-700">
            Mail
          </Label>
          <Input
            id="mail"
            name="mail"
            type="mail"
            value={responseData.mail}
            onChange={handleInputChange}
            placeholder="Correo electrónico"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mensaje" className="font-bold text-gray-700">
            Mensaje
          </Label>
          <Textarea
            id="mensaje"
            name="mensaje"
            value={responseData.mensaje}
            onChange={handleInputChange}
            placeholder="Escriba su mensaje aquí"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-gray-700">Archivos adjuntos</Label>
          <div className="flex flex-wrap gap-2">
            {responseData.attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-md p-2">
                <span className="text-sm text-gray-600">{file}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleRemoveAttachment(file)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <div className="space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Enviar
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
