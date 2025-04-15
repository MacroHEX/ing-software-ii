  import {NextResponse} from 'next/server'

  import {prisma} from '@/lib/prisma'
  import {Usuario} from "@prisma/client";
  import bcrypt from "bcryptjs";

  // Hashear la contraseña
  const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };

  export async function POST(req: Request) {
    try {
      const {nombre, apellido, nombreusuario, correo, password, rolid}: Usuario = await req.json();

      // Validar si el nombre de usuario ya existe
      const usuarioExistente = await prisma.usuario.findFirst({
        where: {
          OR: [
            {correo: correo},
            {nombreusuario: nombreusuario}
          ]
        }
      });

      if (usuarioExistente) {
        return NextResponse.json({error: 'El correo o nombre de usuario ya está registrado.'}, {status: 400});
      }

      const hashedPassword = await hashPassword(password);

      // Crear el nuevo usuario
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
      return NextResponse.json({error: 'Ocurrió un error al crear el usuario. Por favor, intente nuevamente.'}, {status: 500});
    }
  }