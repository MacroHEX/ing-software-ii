import {PrismaClient} from '@prisma/client';
import puppeteer from 'puppeteer';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener los usuarios y sus roles
    const usuarios = await prisma.usuario.findMany({
      where: {
        usuarioid: {
          not: 1, // Excluye al usuario con usuarioid = 1
        }
      },
      include: {
        rol: true,
      }
    });

    // Crear el contenido HTML para el reporte
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Usuarios - Sistema de Invitaciones</h1>
          <h3>Módulo: Gestión de Usuarios</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Nombre de Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              ${usuarios.map((usuario) => `
                <tr>
                  <td>${usuario.usuarioid}</td>
                  <td>${usuario.nombre}</td>
                  <td>${usuario.apellido}</td>
                  <td>${usuario.nombreusuario}</td>
                  <td>${usuario.correo}</td>
                  <td>${usuario.rol.nombrerol}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Iniciar Puppeteer y generar el PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({format: 'A4'});

    await browser.close();

    // Devuelve el PDF como una respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="reporte_usuarios.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generando el reporte:', error);
    return new NextResponse('Error generando el reporte', {status: 500});
  }
}