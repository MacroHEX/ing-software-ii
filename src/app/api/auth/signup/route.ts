import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const { username, email, password, nombre, apellido } = await request.json()

  // Verificar si el nombre de usuario o correo ya existen
  const existingUser = await prisma.usuario.findFirst({
    where: {
      OR: [
        { correo: email },
        { nombreusuario: username },
      ]
    }
  })

  if (existingUser) {
    return NextResponse.json({ message: 'El nombre de usuario o correo ya está en uso' }, { status: 400 })
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10)

  // Crear el nuevo usuario
  const newUser = await prisma.usuario.create({
    data: {
      nombreusuario: username,
      correo: email,
      password: hashedPassword,
      nombre,
      apellido,
      rolid: 2, // Rol por defecto: "Usuario"
    }
  })

  return NextResponse.json({ message: 'Usuario creado con éxito' })
}