import {PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

// Obtener un usuario por su ID
export async function GET(req: Request, {params}: { params: { id: string } }) {
  try {
    // Esperar para obtener el valor del id
    const {id} = await params; // Usar await aquí

    if (!id) {
      return NextResponse.json({error: 'ID no proporcionado'}, {status: 400});
    }

    const usuario = await prisma.usuario.findUnique({
      where: {usuarioid: parseInt(id)},
      select: {
        usuarioid: true,
        nombre: true,
        apellido: true,
        nombreusuario: true,
        correo: true,
        rolid: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({error: 'Usuario no encontrado'}, {status: 404});
    }

    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json({error: 'Error al obtener los datos del usuario'}, {status: 500});
  }
}