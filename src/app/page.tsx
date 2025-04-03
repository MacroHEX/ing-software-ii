'use client'

import {useEffect} from "react";

import Image from "next/image";
import {useRouter} from "next/navigation";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    // Verifica si el token existe en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Si el token existe, redirige a una página diferente
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="App Logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Bienvenido a nuestro sistema de invitaciones
        </h1>
        <p className="text-muted-foreground text-center sm:text-left">
          Aquí podrás encontrar los eventos disponibles y registrarte a ellos. Solo necesitas iniciar sesión para
          comenzar.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/login"
          >
            Iniciar sesión
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/signup"
          >
            Registrarme
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-center text-sm sm:text-base">
          Trabajo de Ing. de Software 2 - Desarrollado por Martin Medina
        </p>
      </footer>
    </div>
  );
}