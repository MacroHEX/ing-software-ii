'use client'

import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit, Trash} from "lucide-react";
import {toast} from 'sonner';
import {IInscripcion} from "@/interfaces/IInscripcion";
import CrearInscripcionDialog from "@/components/dialogs/inscripciones/CrearInscripcionDialog";
import BorrarInscripcionDialog from "@/components/dialogs/inscripciones/BorrarInscripcionDialog";
import EditarInscripcionDialog from "@/components/dialogs/inscripciones/EditarInscripcionDialog";

const InscripcionesTable = () => {
  const [inscripciones, setInscripciones] = useState<IInscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState<IInscripcion | null>(null);

  const fetchInscripciones = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inscripciones');
      const data = await response.json();
      setInscripciones(data);
    } catch (error) {
      toast.error('Error al cargar las inscripciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscripciones().then();
  }, []);

  const handleCreateInscripcion = async (inscripcionData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return false;
    }

    try {
      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(inscripcionData),
      });

      const data = await response.json();

      if (response.ok) {
        setInscripciones((prevInscripciones) => [...prevInscripciones, data]);
        return true;
      } else {
        toast.error(data.error || 'Error al crear la inscripción');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión');
      return false;
    }
  };

  const handleDeleteInscripcion = async () => {
    if (!selectedInscripcion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/inscripciones', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({inscripcionid: selectedInscripcion.inscripcionid}),
      });

      const data = await response.json();

      if (response.ok) {
        setInscripciones((prevInscripciones) =>
          prevInscripciones.filter((inscripcion) => inscripcion.inscripcionid !== selectedInscripcion.inscripcionid)
        );
        toast.success('Inscripción eliminada con éxito');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(data.error || 'Error al eliminar la inscripción');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleEditInscripcion = async (inscripcionData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/inscripciones', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(inscripcionData),
      });

      const data = await response.json();

      if (response.ok) {
        setInscripciones((prevInscripciones) =>
          prevInscripciones.map((inscripcion) =>
            inscripcion.inscripcionid === inscripcionData.inscripcionid ? data : inscripcion
          )
        );
        toast.success('Inscripción actualizada con éxito');
        setIsEditDialogOpen(false); // Cerrar el diálogo de edición
      } else {
        toast.error(data.error || 'Error al actualizar la inscripción');
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
      const response = await fetch('/api/reporte/inscripciones', {
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
        a.download = 'reporte_inscripciones.pdf';
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
        <h2 className="text-xl font-semibold">Inscripciones</h2>
        <div className="flex gap-4">
          <Button variant='outline' onClick={handleGenerateReport}>Generar Reporte</Button>
          {/*<Button className='cursor-pointer' onClick={() => setIsCreateDialogOpen(true)}>Nueva Inscripción</Button>*/}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Fecha de Inscripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-4">Cargando...</TableCell>
              </TableRow>
            ) : (
              inscripciones.map((inscripcion) => (
                <TableRow key={inscripcion.inscripcionid}>
                  <TableCell>{inscripcion.inscripcionid}</TableCell>
                  <TableCell>{inscripcion.usuario.nombreusuario}</TableCell>
                  <TableCell>{inscripcion.evento.nombre}</TableCell>
                  <TableCell>{new Date(inscripcion.fechainscripcion).toLocaleString()}</TableCell>
                  <TableCell>
                    {/*<Button*/}
                    {/*  variant="link"*/}
                    {/*  className='hover:text-neutral-950 cursor-pointer'*/}
                    {/*  onClick={() => {*/}
                    {/*    setSelectedInscripcion(inscripcion);*/}
                    {/*    setIsEditDialogOpen(true);*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  <Edit size={20}/>*/}
                    {/*</Button>*/}
                    <Button
                      variant="link"
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedInscripcion(inscripcion);
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
      <CrearInscripcionDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}
                              onCreate={handleCreateInscripcion}/>
      <EditarInscripcionDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}
                               onUpdate={handleEditInscripcion} inscripcionData={selectedInscripcion}/>
      <BorrarInscripcionDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                               onDelete={handleDeleteInscripcion}/>
    </div>
  );
};

export default InscripcionesTable;
