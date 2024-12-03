import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { Label } from './Label';
import { Paperclip } from 'lucide-react';
import { getUsers } from '../../api/TableFunctions/users';
import { createTDemandaAsignado } from '../../api/TableFunctions/DemandaAsignados';
import { TUser } from '../../api/interfaces';
import { toast } from 'react-toastify';

interface AsignarDemandaModalProps {
  demanda: number;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: AssignmentData) => void;
}

interface AssignmentData {
  collaborator: number;
  comments: string;
}

export function AsignarDemandaModal({ demandaId, isOpen, onClose, onAssign }: AsignarDemandaModalProps) {
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    collaborator: 0,
    comments: '',
  });
  const [users, setUsers] = useState<TUser[]>([]); // State to store users
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const userList = await getUsers();
          setUsers(userList); // Set the user list
          setAssignmentData((prev) => ({ ...prev, collaborator: userList[0].id })); // Set the default collaborator
        } catch (error) {
          // console.error('Error fetching users:', error);
          setError('Hubo un error en el servidor, intente mas tarde.');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: name === 'collaborator' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newTDemandaAsignado = {
        demanda: demandaId,
        user: assignmentData.collaborator,
        comentarios: assignmentData.comments
      };
      console.log('Creating TDemandaAsignado:', newTDemandaAsignado);

      // Call the method to create the TDemandaAsignado object
      const response = await createTDemandaAsignado(newTDemandaAsignado, true, '¡Demanda asignada con éxito!');
      console.log('TDemandaAsignado created:', response);

      // Trigger the onAssign callback with the assignment data
      onAssign(assignmentData);

      // Close the modal
      onClose();

    } catch (err) {
      // console.error('Error creating TDemandaAsignado:', err);
      setError('Hubo un problema al asignar la demanda.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Demanda">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>} {/* Show error message */}
        <div className="space-y-2">
          <Label htmlFor="collaborator" className="font-bold text-gray-700">
            Asignar a un colaborador
          </Label>
          {loading ? (
            <p>Cargando colaboradores...</p>
          ) : (
            <select
              id="collaborator"
              name="collaborator"
              value={assignmentData.collaborator}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
            >
              <option value="" disabled>
                Selecciona un colaborador
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} - {user.username}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="comments" className="font-bold text-gray-700">
            Comentarios
          </Label>
          <Textarea
            id="comments"
            name="comments"
            value={assignmentData.comments}
            onChange={handleInputChange}
            placeholder="Comentarios"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 resize-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" size="icon" className="rounded-full">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Asignar
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
