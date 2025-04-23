'use client'

import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit, Trash} from "lucide-react";
import CrearUsuarioDialog from "../dialogs/usuarios/CrearUsuarioDialog";
import EditarUsuarioDialog from "../dialogs/usuarios/EditarUsuarioDialog";
import BorrarUsuarioDialog from "../dialogs/usuarios/BorrarUsuarioDialog";
import {IUsuario} from "@/interfaces/IUsuario";
import {toast} from 'sonner';

const UsuariosTable = () => {
  const [users, setUsers] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUsuario | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/usuarios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        toast.error(data.error || 'Error al cargar los usuarios');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers().then();
  }, []);

  const handleCreateUser = async (userData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return false;
    }

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prevUsers) => [...prevUsers, data]);
        return true;
      } else {
        toast.error(data.error || 'Error al crear el usuario');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión');
      return false;
    }
  };

  const handleEditUser = async (userData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.usuarioid === userData.usuarioid ? data : user
          )
        );
        toast.success('Usuario actualizado con éxito');
        setIsEditDialogOpen(false);
        return;
      } else {
        toast.error(data.error || 'Error al actualizar el usuario');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/usuarios', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({usuarioid: selectedUser.usuarioid}),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.usuarioid !== selectedUser.usuarioid)
        );
        toast.success('Usuario eliminado con éxito');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(data.error || 'Error al eliminar el usuario');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleGenerateReport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/reporte-usuarios', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_usuarios.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        toast.error('Error al generar el reporte');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <div className="flex gap-4">
          <Button variant='outline' onClick={handleGenerateReport}>Generar Reporte</Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Nuevo Usuario</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Nombre de Usuario</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">Cargando...</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.usuarioid}>
                  <TableCell>{user.usuarioid}</TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.apellido}</TableCell>
                  <TableCell>{user.nombreusuario}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>{user.rolid === 1 ? 'Admin' : 'Usuario'}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className='hover:text-neutral-950 cursor-pointer'
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={20}/>
                    </Button>

                    <Button
                      variant="link"
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
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
      <CrearUsuarioDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}
                          onCreate={handleCreateUser}/>
      <EditarUsuarioDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}
                           onUpdate={handleEditUser}
                           userData={selectedUser}/>
      <BorrarUsuarioDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                           onDelete={handleDeleteUser}/>
    </div>
  );
};

export default UsuariosTable;
