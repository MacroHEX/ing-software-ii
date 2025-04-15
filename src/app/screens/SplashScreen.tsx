'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import jwt from 'jsonwebtoken'
import {toast} from 'sonner'

const SplashScreen = () => {
  const [show, setShow] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const decoded: any = jwt.decode(token)

        console.log('TOKEN: ', decoded);

        // Verificar si el rol es 1 o 2 y redirigir
        if (decoded?.rol === 1) {
          router.push('/dashboard')
        } else if (decoded?.rol === 2) {
          router.push('/user-dashboard')
        } else {
          toast.error('Rol no reconocido')
          router.push('/')  // O redirigir a una página de error o login
        }
      } catch (error) {
        toast.error('Error al decodificar el token')
        router.push('/')  // O redirigir a una página de error o login
      }
    } else {
      toast.error('No se encontró un token de sesión')
      router.push('/')  // O redirigir a la página de login
    }

    // Mostrar la pantalla por un breve periodo antes de redirigir
    const timer = setTimeout(() => {
      setShow(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 via-cyan-500 to-teal-500 animate-fadeIn text-white">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={120}
          className="animate-float drop-shadow-xl"
        />
        <h1 className="text-3xl font-bold tracking-wide animate-pulse">
          Bienvenid@ de nuevo
        </h1>
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-white h-12 w-12 animate-spin"/>
      </div>
    </div>
  )
}

export default SplashScreen