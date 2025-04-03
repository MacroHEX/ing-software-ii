'use client'

import {useState, ComponentProps, FormEvent} from 'react'

import Image from 'next/image'
import {useRouter} from 'next/navigation'

import {cn} from "@/lib/utils"

import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

export function LoginForm({
                            className,
                            imageUrl,
                            ...props
                          }: ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const body = {

    }

    // Hacer el POST a la API de login
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    })

    const data = await response.json()

    if (response.ok) {
      // Si la respuesta es exitosa, guardar el token en localStorage
      localStorage.setItem('token', data.token)

      // Redirigir a la página principal
      router.push('/')
    } else {
      // Si ocurre un error, mostrarlo
      setError(data.message || 'Ocurrió un error en el login')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 h-full", className)} {...props}>
      <Card className="overflow-hidden p-0 h-full">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <form
            className="p-6 md:p-8 h-full flex flex-col justify-between"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido</h1>
                <p className="text-muted-foreground text-balance">
                  Inicia Sesión
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="login">Usuario o Correo</Label>
                <Input
                  id="login"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>

              {error && (
                <div className="text-red-500 text-center mt-2">
                  {error}
                </div>
              )}

              <div className="text-center text-sm">
                ¿No tienes una cuenta?&nbsp;
                <a href="#" className="underline underline-offset-4">
                  Regístrate
                </a>
              </div>
            </div>
          </form>
          <div className="bg-primary/50 relative hidden md:block">
            {imageUrl && (
              <Image
                fill
                src={imageUrl}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}