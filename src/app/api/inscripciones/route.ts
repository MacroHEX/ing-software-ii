// src/app/api/inscripciones/route.ts
import {Inscripcion, PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

// GET (Obtener todas las inscripciones)
export async function GET() {
  try {
    const inscripciones = await prisma.inscripcion.findMany();
    return NextResponse.json(inscripciones);
  } catch (error) {
    return NextResponse.json({error: 'Error fetching inscripciones'}, {status: 500});
  }
}

// POST (Crear una nueva inscripción)
export async function POST(req: Request) {
  const {usuarioid, eventoid}: Inscripcion = await req.json();

  try {
    const inscripcion = await prisma.inscripcion.create({
      data: {
        usuarioid,
        eventoid,
      },
    });
    return NextResponse.json(inscripcion, {status: 201});
  } catch (error) {
    return NextResponse.json({error: 'Error creating inscripcion'}, {status: 500});
  }
}

// DELETE (Eliminar una inscripción)
export async function DELETE(req: Request) {
  const {inscripcionid}: { inscripcionid: number } = await req.json();

  try {
    const inscripcionEliminada = await prisma.inscripcion.delete({
      where: {inscripcionid},
    });
    return NextResponse.json(inscripcionEliminada);
  } catch (error) {
    return NextResponse.json({error: 'Error deleting inscripcion'}, {status: 500});
  }
}