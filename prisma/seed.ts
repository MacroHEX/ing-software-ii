import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Crear el rol "Administrador" si no existe
  let rolAdmin = await prisma.rol.findFirst({
    where: {nombrerol: 'Administrador'},
  })

  if (!rolAdmin) {
    rolAdmin = await prisma.rol.create({
      data: {
        nombrerol: 'Administrador',
      },
    })
  }

  // Hashear la contraseña "admin"
  const hashedPassword = await bcrypt.hash('admin', 10)

  // Crear usuario admin si no existe
  const admin = await prisma.usuario.upsert({
    where: {nombreusuario: 'admin'},
    update: {},
    create: {
      nombre: 'Admin',
      apellido: '',
      nombreusuario: 'admin',
      correo: 'admin@example.com',
      password: hashedPassword,
      rolid: rolAdmin.rolid,
    },
  })

  console.log('Usuario administrador creado:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })