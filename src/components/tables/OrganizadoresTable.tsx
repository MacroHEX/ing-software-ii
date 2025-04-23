'use client'

import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit, Trash} from "lucide-react";
import {toast} from 'sonner';
import {IOrganizador} from "@/interfaces/IOrganizador";
import CrearOrganizadorDialog from "@/components/dialogs/organizadores/CrearOrganizadorDialog";
import EditarOrganizadorDialog from "@/components/dialogs/organizadores/EditarOrganizadorDialog";
import BorrarOrganizadorDialog from "@/components/dialogs/organizadores/BorrarOrganizadorDialog";
import {IUsuario} from "@/interfaces/IUsuario";
import {IEvento} from "@/interfaces/IEvento";

const OrganizadoresTable = () => {
  const [organizadores, setOrganizadores] = useState<IOrganizador[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedOrganizador, setSelectedOrganizador] = useState<IOrganizador | null>(null);

  const fetchOrganizadores = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/organizadores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOrganizadores(data);
      } else {
        toast.error(data.error || 'Error al cargar los organizadores');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
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
        setUsuarios(data);
      } else {
        toast.error(data.error || 'Error al cargar los usuarios');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const fetchEventos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/eventos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEventos(data);
      } else {
        toast.error(data.error || 'Error al cargar los eventos');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  useEffect(() => {
    fetchOrganizadores().then();
    fetchUsuarios().then();
    fetchEventos().then();
  }, []);

  const handleCreateOrganizador = async (organizadorData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return false;
    }

    try {
      const response = await fetch('/api/organizadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(organizadorData),
      });

      const data = await response.json();

      if (response.ok) {
        setOrganizadores((prevOrganizadores) => [...prevOrganizadores, data]);
        return true;
      } else {
        toast.error(data.error || 'Error al crear el organizador');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión');
      return false;
    }
  };

  const handleEditOrganizador = async (organizadorData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/organizadores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(organizadorData),
      });

      const data = await response.json();

      if (response.ok) {
        setOrganizadores((prevOrganizadores) =>
          prevOrganizadores.map((organizador) =>
            organizador.organizadorid === organizadorData.organizadorid ? data : organizador
          )
        );
        toast.success('Organizador actualizado con éxito');
        setIsEditDialogOpen(false);
        return;
      } else {
        toast.error(data.error || 'Error al actualizar el organizador');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleDeleteOrganizador = async () => {
    if (!selectedOrganizador) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/organizadores', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({organizadorid: selectedOrganizador.organizadorid}),
      });

      const data = await response.json();

      if (response.ok) {
        setOrganizadores((prevOrganizadores) =>
          prevOrganizadores.filter((organizador) => organizador.organizadorid !== selectedOrganizador.organizadorid)
        );
        toast.success('Organizador eliminado con éxito');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(data.error || 'Error al eliminar el organizador');
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
      const response = await fetch('/api/reporte/organizadores', {
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
        a.download = 'reporte_organizadores.pdf';
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
        <h2 className="text-xl font-semibold">Organizadores</h2>
        <div className="flex gap-4">
          <Button variant='outline' onClick={handleGenerateReport}>Generar Reporte</Button>
          <Button className='cursor-pointer' onClick={() => setIsCreateDialogOpen(true)}>Nuevo Organizador</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center p-4">Cargando...</TableCell>
              </TableRow>
            ) : (
              organizadores.map((organizador) => (
                <TableRow key={organizador.organizadorid}>
                  <TableCell>{organizador.organizadorid}</TableCell>
                  <TableCell>{organizador.usuario.nombreusuario}</TableCell>
                  <TableCell>{organizador.evento.nombre}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="hover:text-neutral-950 cursor-pointer"
                      onClick={() => {
                        setSelectedOrganizador(organizador);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={20}/>
                    </Button>

                    <Button
                      variant="link"
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedOrganizador(organizador);
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
      <CrearOrganizadorDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreateOrganizador}
        usuarios={usuarios}
        eventos={eventos}
      />
      <EditarOrganizadorDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={handleEditOrganizador}
        organizadorData={selectedOrganizador}
        usuarios={usuarios}
        eventos={eventos}
      />
      <BorrarOrganizadorDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteOrganizador}
      />
    </div>
  );
};

export default OrganizadoresTable;
