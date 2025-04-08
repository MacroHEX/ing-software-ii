import {PrismaClient, Usuario} from '@prisma/client';
import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Hashear la contraseña
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// GET
export async function GET(req: Request) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        usuarioid: true,
        nombre: true,
        apellido: true,
        nombreusuario: true,
        correo: true,
        rolid: true,
      },
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({error: 'Error fetching users'}, {status: 500});
  }
}

// POST
export async function POST(req: Request) {
  try {
    const {nombre, apellido, nombreusuario, correo, password, rolid}: Usuario = await req.json();

    const hashedPassword = await hashPassword(password);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        nombreusuario,
        correo,
        password: hashedPassword, // Almacenamos la contraseña hasheada
        rolid,
      },
    });
    return NextResponse.json(nuevoUsuario, {status: 201});
  } catch (error) {
    return NextResponse.json({error: 'Error creating user'}, {status: 500});
  }
}

// PUT
export async function PUT(req: Request) {
  try {
    const {usuarioid, nombre, apellido, nombreusuario, correo, password, rolid}: Usuario = await req.json();

    let updatedPassword = password;
    if (password) {
      updatedPassword = await hashPassword(password);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: {usuarioid},
      data: {
        nombre,
        apellido,
        nombreusuario,
        correo,
        password: updatedPassword, // Actualizamos la contraseña hasheada
        rolid,
      },
    });
    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    return NextResponse.json({error: 'Error updating user'}, {status: 500});
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const {usuarioid}: { usuarioid: number } = await req.json();
    const usuarioEliminado = await prisma.usuario.delete({
      where: {usuarioid},
    });
    return NextResponse.json(usuarioEliminado);
  } catch (error) {
    return NextResponse.json({error: 'Error deleting user'}, {status: 500});
  }
}