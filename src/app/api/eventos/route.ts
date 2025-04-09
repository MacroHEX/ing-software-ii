import {PrismaClient, Evento} from '@prisma/client';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

// GET (Obtener todos los eventos)
export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        tipoevento: true,
      },
    });
    return NextResponse.json(eventos);
  } catch (error) {
    return NextResponse.json({error: 'Error fetching eventos'}, {status: 500});
  }
}

// POST (Crear un nuevo evento)
export async function POST(req: Request) {
  const {nombre, fecha, ubicacion, imagen, tipoeventoid}: Evento = await req.json();

  try {
    const parsedFecha = new Date(fecha);

    if (isNaN(parsedFecha.getTime())) {
      return NextResponse.json({error: 'Fecha inválida'}, {status: 400});
    }

    const evento = await prisma.evento.create({
      data: {
        nombre,
        fecha: parsedFecha,
        ubicacion,
        imagen,
        tipoeventoid,
      },
      include: {
        tipoevento: true,
      },
    });
    return NextResponse.json(evento, {status: 201});
  } catch (error) {
    return NextResponse.json({error: 'Error creating evento'}, {status: 500});
  }
}

// PUT (Actualizar un evento)
export async function PUT(req: Request) {
  const {eventoid, nombre, fecha, ubicacion, imagen, tipoeventoid}: Evento = await req.json();

  try {
    const updatedEvento = await prisma.evento.update({
      where: {eventoid},
      data: {
        nombre,
        fecha,
        ubicacion,
        imagen,
        tipoeventoid,
      },
    });
    return NextResponse.json(updatedEvento);
  } catch (error) {
    return NextResponse.json({error: 'Error updating evento'}, {status: 500});
  }
}

// DELETE (Eliminar un evento)
export async function DELETE(req: Request) {
  const {eventoid}: { eventoid: number } = await req.json();

  try {
    const eventoEliminado = await prisma.evento.delete({
      where: {eventoid},
    });
    return NextResponse.json(eventoEliminado);
  } catch (error) {
    return NextResponse.json({error: 'Error deleting evento'}, {status: 500});
  }
}