import {NextResponse} from 'next/server'

import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export async function POST(request: Request) {
  const {username, password} = await request.json()

  // Buscar el usuario por correo o nombre de usuario
  const user = await prisma.usuario.findFirst({
    where: {
      OR: [
        {correo: username},
        {nombreusuario: username}
      ]
    }
  })

  if (!user) {
    return NextResponse.json({message: 'Usuario no encontrado'}, {status: 404})
  }

  // Verificar la contraseña
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return NextResponse.json({message: 'Contraseña incorrecta'}, {status: 401})
  }

  // Crear el token JWT
  const token = jwt.sign(
    {id: user.usuarioid, nombreusuario: user.nombreusuario, rol: user.rolid},
    process.env.JWT_SECRET!,
    {expiresIn: '1h'}
  )

  // Devolver el token en la respuesta
  return NextResponse.json({token})
}