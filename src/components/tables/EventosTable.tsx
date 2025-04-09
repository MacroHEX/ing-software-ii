'use client'

import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit, Trash} from "lucide-react";
import {toast} from 'sonner';
import CrearEventoDialog from "@/components/dialogs/eventos/CrearEventoDialog";
import EditarEventoDialog from "@/components/dialogs/eventos/EditarEventoDialog";
import BorrarEventoDialog from "@/components/dialogs/eventos/BorrarEventoDialog";
import {IEvento} from "@/interfaces/IEvento";

const EventoTable = () => {
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<IEvento | null>(null);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/eventos');
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      toast.error('Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos().then();
  }, []);

  const handleCreateEvento = async (eventoData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return false;
    }

    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventoData),
      });

      const data = await response.json();

      if (response.ok) {
        setEventos((prevEventos) => [...prevEventos, data]);
        return true;
      } else {
        toast.error(data.error || 'Error al crear el evento');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión');
      return false;
    }
  };

  const handleEditEvento = async (eventoData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/eventos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventoData),
      });

      const data = await response.json();

      if (response.ok) {
        setEventos((prevEventos) =>
          prevEventos.map((evento) =>
            evento.eventoid === eventoData.eventoid ? data : evento
          )
        );
        toast.success('Evento actualizado con éxito');
        setIsEditDialogOpen(false);
        return;
      } else {
        toast.error(data.error || 'Error al actualizar el evento');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleDeleteEvento = async () => {
    if (!selectedEvento) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/eventos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({eventoid: selectedEvento.eventoid}),
      });

      const data = await response.json();

      if (response.ok) {
        setEventos((prevEventos) =>
          prevEventos.filter((evento) => evento.eventoid !== selectedEvento.eventoid)
        );
        toast.success('Evento eliminado con éxito');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(data.error || 'Error al eliminar el evento');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Eventos</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Nuevo Evento</Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center p-4">Cargando...</TableCell>
              </TableRow>
            ) : (
              eventos.map((evento) => (
                <TableRow key={evento.eventoid}>
                  <TableCell>{evento.eventoid}</TableCell>
                  <TableCell>{evento.nombre}</TableCell>
                  <TableCell>{new Date(evento.fecha).toLocaleString()}</TableCell>
                  <TableCell>{evento.ubicacion}</TableCell>
                  <TableCell>{evento.tipoevento.descripcion}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className='hover:text-neutral-950 cursor-pointer'
                      onClick={() => {
                        setSelectedEvento(evento);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={20}/>
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedEvento(evento);
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
      <CrearEventoDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}
                         onCreate={handleCreateEvento}/>
      <EditarEventoDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}
                          onUpdate={handleEditEvento} eventoData={selectedEvento}/>
      <BorrarEventoDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                          onDelete={handleDeleteEvento}/>
    </div>
  );
};

export default EventoTable;
