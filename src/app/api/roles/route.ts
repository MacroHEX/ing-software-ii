import {PrismaClient, Rol} from '@prisma/client';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

// GET (Obtener todos los roles)
export async function GET() {
  try {
    const roles = await prisma.rol.findMany({
      orderBy: {
        rolid: 'asc'
      }
    });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({error: 'Error fetching roles'}, {status: 500});
  }
}

// POST (Crear un nuevo rol)
export async function POST(req: Request) {
  const {nombrerol}: Rol = await req.json();

  try {
    const rol = await prisma.rol.create({
      data: {
        nombrerol,
      },
    });
    return NextResponse.json(rol, {status: 201});
  } catch (error) {
    return NextResponse.json({error: 'Error creating role'}, {status: 500});
  }
}

// PUT (Actualizar un rol)
export async function PUT(req: Request) {
  const {rolid, nombrerol}: Rol = await req.json();

  try {
    const updatedRol = await prisma.rol.update({
      where: {rolid},
      data: {nombrerol},
    });
    return NextResponse.json(updatedRol);
  } catch (error) {
    return NextResponse.json({error: 'Error updating role'}, {status: 500});
  }
}

// DELETE (Eliminar un rol)
export async function DELETE(req: Request) {
  const {rolid}: { rolid: number } = await req.json();

  try {
    const deletedRol = await prisma.rol.delete({
      where: {rolid},
    });
    return NextResponse.json(deletedRol);
  } catch (error) {
    return NextResponse.json({error: 'Error deleting role'}, {status: 500});
  }
}