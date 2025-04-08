import {Organizador, PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

// GET (Obtener todos los organizadores)
export async function GET() {
  try {
    const organizadores = await prisma.organizador.findMany();
    return NextResponse.json(organizadores);
  } catch (error) {
    return NextResponse.json({error: 'Error fetching organizadores'}, {status: 500});
  }
}

// POST (Crear un nuevo organizador)
export async function POST(req: Request) {
  const {usuarioid, eventoid}: Organizador = await req.json();

  try {
    const organizador = await prisma.organizador.create({
      data: {
        usuarioid,
        eventoid,
      },
    });
    return NextResponse.json(organizador, {status: 201});
  } catch (error) {
    return NextResponse.json({error: 'Error creating organizador'}, {status: 500});
  }
}

// DELETE (Eliminar un organizador)
export async function DELETE(req: Request) {
  const {organizadorid}: { organizadorid: number } = await req.json();

  try {
    const organizadorEliminado = await prisma.organizador.delete({
      where: {organizadorid},
    });
    return NextResponse.json(organizadorEliminado);
  } catch (error) {
    return NextResponse.json({error: 'Error deleting organizador'}, {status: 500});
  }
}