import { PrismaClient, TipoEvento } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET (Obtener todos los tipos de evento)
export async function GET() {
  try {
    const tipoEventos = await prisma.tipoEvento.findMany();
    return NextResponse.json(tipoEventos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tipoEventos' }, { status: 500 });
  }
}

// POST (Crear un nuevo tipo de evento)
export async function POST(req: Request) {
  const { descripcion }: TipoEvento = await req.json();

  try {
    const tipoEvento = await prisma.tipoEvento.create({
      data: { descripcion },
    });
    return NextResponse.json(tipoEvento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating tipoEvento' }, { status: 500 });
  }
}

// PUT (Actualizar un tipo de evento)
export async function PUT(req: Request) {
  const { tipoeventoid, descripcion }: TipoEvento = await req.json();

  try {
    const updatedTipoEvento = await prisma.tipoEvento.update({
      where: { tipoeventoid },
      data: { descripcion },
    });
    return NextResponse.json(updatedTipoEvento);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating tipoEvento' }, { status: 500 });
  }
}

// DELETE (Eliminar un tipo de evento)
export async function DELETE(req: Request) {
  const { tipoeventoid }: { tipoeventoid: number } = await req.json();

  try {
    const tipoEventoEliminado = await prisma.tipoEvento.delete({
      where: { tipoeventoid },
    });
    return NextResponse.json(tipoEventoEliminado);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting tipoEvento' }, { status: 500 });
  }
}