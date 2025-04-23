import {useEffect, useState} from "react";
import {toast} from "sonner";
import {IEvento} from "@/interfaces/IEvento";
import EventoCard from "@/components/cards/EventoCard";

const EventosDashboard = () => {
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-6">
      {/* Cuadrícula responsiva con espacio adecuado entre las tarjetas */}
      <div className="flex gap-6">
        {eventos && eventos.map((evento) => (
          <EventoCard key={evento.eventoid} evento={evento}/>
        ))}
      </div>

      {loading && <div className="text-center text-gray-600 mt-4">Cargando...</div>}
    </div>
  );
};

export default EventosDashboard;