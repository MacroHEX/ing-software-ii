'use client'

import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit, Trash} from "lucide-react";
import {toast} from 'sonner';
import {ITipoEvento} from "@/interfaces/ITipoEvento";
import CrearTipoEventoDialog from "@/components/dialogs/tipoevento/CrearTipoEventoDialog";
import EditarTipoEventoDialog from "@/components/dialogs/tipoevento/EditarTipoEventoDialog";
import BorrarTipoEventoDialog from "@/components/dialogs/tipoevento/BorrarTipoEventoDialog";


const TipoEventoTable = () => {
  const [tipoEventos, setTipoEventos] = useState<ITipoEvento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedTipoEvento, setSelectedTipoEvento] = useState<ITipoEvento | null>(null);

  const fetchTipoEventos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tipoeventos');
      const data = await response.json();
      setTipoEventos(data);
    } catch (error) {
      toast.error('Error al cargar los tipos de eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipoEventos().then();
  }, []);

  const handleCreateTipoEvento = async (tipoEventoData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return false;
    }

    try {
      const response = await fetch('/api/tipoeventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tipoEventoData),
      });

      const data = await response.json();

      if (response.ok) {
        setTipoEventos((prevTipoEventos) => [...prevTipoEventos, data]);
        return true;
      } else {
        toast.error(data.error || 'Error al crear el tipo de evento');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión');
      return false;
    }
  };

  const handleEditTipoEvento = async (tipoEventoData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/tipoeventos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tipoEventoData),
      });

      const data = await response.json();

      if (response.ok) {
        setTipoEventos((prevTipoEventos) =>
          prevTipoEventos.map((tipoEvento) =>
            tipoEvento.tipoeventoid === tipoEventoData.tipoeventoid ? data : tipoEvento
          )
        );
        toast.success('Tipo de evento actualizado con éxito');
        setIsEditDialogOpen(false);
        return;
      } else {
        toast.error(data.error || 'Error al actualizar el tipo de evento');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleDeleteTipoEvento = async () => {
    if (!selectedTipoEvento) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/tipoeventos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({tipoeventoid: selectedTipoEvento.tipoeventoid}),
      });

      const data = await response.json();

      if (response.ok) {
        setTipoEventos((prevTipoEventos) =>
          prevTipoEventos.filter((tipoEvento) => tipoEvento.tipoeventoid !== selectedTipoEvento.tipoeventoid)
        );
        toast.success('Tipo de evento eliminado con éxito');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(data.error || 'Error al eliminar el tipo de evento');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tipos de Evento</h2>
      <Button onClick={() => setIsCreateDialogOpen(true)}>Nuevo Tipo de Evento</Button>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center p-4">Cargando...</TableCell>
              </TableRow>
            ) : (
              tipoEventos.map((tipoEvento) => (
                <TableRow key={tipoEvento.tipoeventoid}>
                  <TableCell>{tipoEvento.tipoeventoid}</TableCell>
                  <TableCell>{tipoEvento.descripcion}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className='hover:text-neutral-950 cursor-pointer'
                      onClick={() => {
                        setSelectedTipoEvento(tipoEvento);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={20}/>
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedTipoEvento(tipoEvento);
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
      <CrearTipoEventoDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}
                             onCreate={handleCreateTipoEvento}/>
      <EditarTipoEventoDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}
                              onUpdate={handleEditTipoEvento} tipoEventoData={selectedTipoEvento}/>
      <BorrarTipoEventoDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                              onDelete={handleDeleteTipoEvento}/>
    </div>
  );
};

export default TipoEventoTable;
