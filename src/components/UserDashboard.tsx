'use client'

import {useEffect, useState} from 'react';
import Image from "next/image";

export default function UserDashboard() {
  const [userName, setUserName] = useState<string>('');
  const [eventCount, setEventCount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded.id;
        setUserName(decoded.nombreusuario);

        // Obtener todas las inscripciones y contar las del usuario actual
        fetch('/api/inscripciones')
          .then(res => res.json())
          .then(data => {
            const userInscripciones = data.filter((i: any) => i.usuarioid === userId);
            setEventCount(userInscripciones.length);
          })
          .catch(err => {
            console.error('Error al obtener inscripciones:', err);
          });
      } catch (error) {
        console.error('Error al decodificar token:', error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 sm:px-20 gap-16">
      {/* Header */}
      <header className="flex flex-col items-center sm:items-start gap-4 w-full text-center sm:text-left">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="App Logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold text-primary">
          ¡Bienvenido, {userName}!
        </h1>
        <p className="text-muted-foreground">
          Tienes {eventCount} evento{eventCount !== 1 ? 's' : ''} pendiente{eventCount !== 1 ? 's' : ''}.
        </p>
      </header>

      {/* Main actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start w-full">
        <a
          className="rounded-full border border-transparent bg-foreground text-background flex items-center justify-center gap-2 py-3 px-6 sm:px-8 text-sm sm:text-base font-medium transition-colors hover:bg-muted"
          href="/events"
        >
          Ver eventos
        </a>
        <a
          className="rounded-full border border-black/[.08] dark:border-white/[.145] flex items-center justify-center gap-2 py-3 px-6 sm:px-8 text-sm sm:text-base font-medium transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent"
          href="/logout"
        >
          Cerrar sesión
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-16 flex items-center justify-center w-full">
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Trabajo de Ing. de Software 2 - Desarrollado por Martin Medina
        </p>
      </footer>
    </div>
  );
}