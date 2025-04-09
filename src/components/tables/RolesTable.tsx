'use client'

import { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Edit, Trash } from "lucide-react";

import { toast } from 'sonner';

import CrearRolDialog from "@/components/dialogs/roles/CrearRolDialog";

import {IRoles} from "@/interfaces/IRoles";
import EditarRolDialog from "@/components/dialogs/roles/EditarRolDialog";
import BorrarRolDialog from "@/components/dialogs/roles/BorrarRolDialog";

const RolesTable = () => {
  const [roles, setRoles] = useState<IRoles[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<IRoles | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRoles(data);
      } else {
        toast.error(data.error || 'Error al cargar los roles');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles().then();
  }, []);

  const handleCreateRole = async (roleData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return false;
    }

    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });

      const data = await response.json();

      if (response.ok) {
        setRoles((prevRoles) => [...prevRoles, data]);
        return true;
      } else {
        toast.error(data.error || 'Error al crear el rol');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión');
      return false;
    }
  };

  const handleEditRole = async (roleData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/roles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });

      const data = await response.json();

      if (response.ok) {
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.rolid === roleData.rolid ? data : role
          )
        );
        toast.success('Rol actualizado con éxito');
        setIsEditDialogOpen(false);
        return;
      } else {
        toast.error(data.error || 'Error al actualizar el rol');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/roles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rolid: selectedRole.rolid }),
      });

      const data = await response.json();

      if (response.ok) {
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.rolid !== selectedRole.rolid)
        );
        toast.success('Rol eliminado con éxito');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(data.error || 'Error al eliminar el rol');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Roles</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Nuevo Rol</Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center p-4">Cargando...</TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.rolid}>
                  <TableCell>{role.rolid}</TableCell>
                  <TableCell>{role.nombrerol}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className='hover:text-neutral-950 cursor-pointer'
                      onClick={() => {
                        setSelectedRole(role);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={20}/>
                    </Button>

                    <Button
                      variant="link"
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedRole(role);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash size={20}/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogos */}
      <CrearRolDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}
                      onCreate={handleCreateRole} />
      <EditarRolDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} onUpdate={handleEditRole}
                       roleData={selectedRole} />
      <BorrarRolDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                       onDelete={handleDeleteRole} />
    </div>
  );
};

export default RolesTable;
