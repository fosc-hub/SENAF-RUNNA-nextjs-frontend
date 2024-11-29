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
import { ArchivosAdjuntosModal } from './ArchivosAdjuntosModal';

interface EnviarRespuestaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: ResponseData) => void;
  idDemanda: number;
}

interface ResponseData {
  institucion: number;  // Cambiar a number en lugar de string
  mail: string;
  mensaje: string;
  attachments: string[];
  fecha_y_hora: Date | null;
  demanda: number;
}

export function EnviarRespuestaModal({ isOpen, onClose, onSend, idDemanda }: EnviarRespuestaModalProps) {
  const [responseData, setResponseData] = useState<ResponseData>({
    institucion: 0,  // Inicializa como número (0 o algún valor por defecto)
    mail: '',
    mensaje: '',
    attachments: [],
    fecha_y_hora: null,
    demanda: idDemanda, // Asegurar que el demanda se guarde en el estado
  });


  const [institutionOptions, setInstitutionOptions] = useState<{ value: string; label: string }[]>([]);
  const [isArchivosModalOpen, setIsArchivosModalOpen] = useState(false);

  const openArchivosModal = () => {
    setIsArchivosModalOpen(true);
  };

  const closeArchivosModal = () => {
    setIsArchivosModalOpen(false);
  };

  const handleArchivosSave = (data: { files: string[], comments: string }) => {
    setResponseData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...data.files],
    }));
    closeArchivosModal();
  };


  useEffect(() => {
    if (isOpen) {
      const fetchInstitutions = async () => {
        try {
          const data = await getTInstitucionRespuestas();
          const formattedData = data.map((inst: any) => ({
            value: inst.id.toString(),
            label: inst.nombre,
          }));
          setInstitutionOptions(formattedData);
        } catch (error) {
          console.error('Error al cargar instituciones:', error);
        }
      };
      fetchInstitutions();
    }
  }, [isOpen]);
  const selectedInstitution = institutionOptions.find(
    (option) => option.value === responseData.institucion.toString()
  )?.label;


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResponseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInstitutionChange = (event: SelectChangeEvent<string>) => {
    const institutionId = Number(event.target.value); // Convierte el valor a número
    setResponseData((prev) => ({ ...prev, institucion: institutionId }));
  };



  const handleDateChange = (date: Date | null) => {
    setResponseData((prev) => ({ ...prev, fecha_y_hora: date }));
  };

  const handleRemoveAttachment = (fileName: string) => {
    setResponseData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((name) => name !== fileName),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { attachments, institucion, ...dataToSend } = responseData;

    const dataToSendWithInstitutionAsNumber = {
      ...dataToSend,
      institucion: Number(institucion),  // Mantén 'institution' y convierte a número
      attachments: attachments,  // Incluir los archivos adjuntos
      idDemanda,  // Aseguramos que demanda esté incluido
    };

    // Llamar a onSend con los datos correctos
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
        </div>

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
            <Button type="button" variant="outline" size="icon" onClick={openArchivosModal}>
              <Paperclip className="h-4 w-4" />
            </Button>
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

      {/* Modal para archivos adjuntos */}
      <ArchivosAdjuntosModal
        isOpen={isArchivosModalOpen}
        onClose={closeArchivosModal}
        onSave={handleArchivosSave}
        initialFiles={responseData.attachments}
      />
    </Modal>
  );
}
