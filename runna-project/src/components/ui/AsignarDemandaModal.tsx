import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { Label } from './Label';
import { Paperclip } from 'lucide-react';
import { getUsers } from '../../api/TableFunctions/users';
import { TUser } from '../../api/interfaces';

interface AsignarDemandaModalProps {
  demandaId: number;
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

  // Fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const userList = await getUsers();
          setUsers(userList); // Set the user list
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({ ...assignmentData, demandaId }); // Include demandaId in the assignment data
    console.log('demandaId:', demandaId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Demanda">
      <form onSubmit={handleSubmit} className="space-y-4">
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
                  {user.id} {user.username}
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
