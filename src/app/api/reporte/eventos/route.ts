// api/reporte/eventos/route.ts

import {PrismaClient} from '@prisma/client';
import puppeteer from 'puppeteer';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        tipoevento: true,
      },
    });

    const fechaHoraGeneracion = new Date().toLocaleString('es-PY', {
      timeZone: 'America/Sao_Paulo',
    });

    const htmlContent = `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex justify-center items-start min-h-screen p-5">
          <div class="container w-full max-w-3xl p-5 bg-white shadow-lg rounded-lg flex flex-col justify-between">
            <h1 class="text-3xl font-bold text-center mb-4">Reporte de Eventos - Sistema de Invitaciones</h1>
            <h3 class="text-xl font-semibold text-center mb-6">Módulo: Gestión de Eventos</h3>
            <table class="min-w-full table-auto mb-6">
              <thead>
                <tr class="bg-gray-200">
                  <th class="px-4 py-2 text-left w-12">ID</th>
                  <th class="px-4 py-2 text-left">Nombre</th>
                  <th class="px-4 py-2 text-left">Fecha</th>
                  <th class="px-4 py-2 text-left">Ubicación</th>
                  <th class="px-4 py-2 text-left">Tipo de Evento</th>
                </tr>
              </thead>
              <tbody>
                ${eventos
      .map(
        (evento) => `
                  <tr class="border-t hover:bg-gray-100">
                    <td class="px-4 py-2">${evento.eventoid}</td>
                    <td class="px-4 py-2">${evento.nombre}</td>
                    <td class="px-4 py-2">${new Date(evento.fecha).toLocaleString()}</td>
                    <td class="px-4 py-2">${evento.ubicacion}</td>
                    <td class="px-4 py-2">${evento.tipoevento.descripcion}</td>
                  </tr>`
      )
      .join('')}
              </tbody>
            </table>
            <div class="text-center text-sm text-gray-600 mt-auto">
              <p>Generado el: ${fechaHoraGeneracion}</p>
              <div class="text-xs text-gray-500 mt-2">Trabajo de Ing. de Software 2 - Desarrollado por Martin Medina</div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Iniciar Puppeteer y generar el PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {top: 30, right: 30, bottom: 60, left: 30},
    });

    await browser.close();

    // Devuelve el PDF como una respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="reporte_eventos.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generando el reporte:', error);
    return new NextResponse('Error generando el reporte', {status: 500});
  }
}