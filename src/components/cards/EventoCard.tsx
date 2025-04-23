'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {IEvento} from '@/interfaces/IEvento';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Calendar, Info, MapPin} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {toast} from 'sonner';

interface Props {
  evento: IEvento;
}

const EventoCard = ({evento}: Props) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isInscrito, setIsInscrito] = useState(false);
  const [inscripcionId, setInscripcionId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Obtener el userId desde el token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      } catch (error) {
        console.error('Error al decodificar token:', error);
      }
    }
  }, []);

  // Verificar si ya está inscrito
  useEffect(() => {
    const verificarInscripcion = async () => {
      if (!userId) return;

      try {
        const response = await fetch('/api/inscripciones');
        const data = await response.json();

        const yaInscripto = data.find(
          (insc: any) => insc.usuarioid === userId && insc.eventoid === evento.eventoid
        );

        if (yaInscripto) {
          setIsInscrito(true);
          setInscripcionId(yaInscripto.inscripcionid);
        }
      } catch (error) {
        console.error('Error verificando inscripción:', error);
      }
    };

    verificarInscripcion();
  }, [userId, evento.eventoid]);

  const inscribirse = async () => {
    try {
      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usuarioid: userId, eventoid: evento.eventoid}),
      });

      if (response.ok) {
        const data = await response.json();
        setIsInscrito(true);
        setInscripcionId(data.inscripcionid);
        toast.success('Inscripción realizada con éxito');
      } else {
        toast.error('Error al inscribirse');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al inscribirse');
    } finally {
      setDialogOpen(false);
    }
  };

  const desinscribirse = async () => {
    try {
      const response = await fetch('/api/inscripciones', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({inscripcionId}),
      });

      if (response.ok) {
        setIsInscrito(false);
        setInscripcionId(null);
        toast.success('Desinscripción realizada con éxito');
      } else {
        toast.error('Error al desinscribirse');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al desinscribirse');
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <Card className="w-64 h-80 shadow-lg rounded-lg overflow-hidden flex flex-col">
      {/* Imagen */}
      <div className="relative w-full h-40">
        <Image
          src={evento.imagen}
          alt={evento.nombre}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-between flex-grow bg-white">
        <CardContent className="p-4 flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{evento.nombre}</h3>

          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Calendar size={16} className="mr-2"/>
            <span>{new Date(evento.fecha).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-700 mb-1">
            <Info size={16} className="mr-2"/>
            <span>{evento.tipoevento.descripcion}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2"/>
            <span>{evento.ubicacion}</span>
          </div>
        </CardContent>

        {/* Botón + Diálogo */}
        <CardFooter className="p-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {isInscrito ? 'Desinscribirse' : 'Inscribirse'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isInscrito ? '¿Desinscribirse del evento?' : '¿Inscribirse al evento?'}
                </DialogTitle>
                <DialogDescription>
                  {isInscrito
                    ? 'Esta acción cancelará tu inscripción.'
                    : 'Serás agregado a la lista de participantes.'}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={isInscrito ? desinscribirse : inscribirse}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </div>
    </Card>
  );
};

export default EventoCard;