'use client'

import {ComponentProps, FormEvent, useState} from 'react'

import Image from 'next/image'
import {useRouter} from 'next/navigation'

import {cn} from "@/lib/utils"

import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

export function SignupForm({
                             className,
                             imageUrl,
                             ...props
                           }: ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const body = {
      username,
      email,
      password,
      nombre,
      apellido,
    }

    try {
      // Hacer el POST a la API de signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        // Si la respuesta es exitosa, hacer login automáticamente
        const loginResponse = await fetch('/api/auth', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, password})
        })

        const loginData = await loginResponse.json()

        if (loginResponse.ok) {
          // Si el login es exitoso, guardar el token en localStorage
          localStorage.setItem('token', loginData.token)

          // Redirigir a la página principal
          router.push('/')
        } else {
          setError(loginData.message || 'Ocurrió un error en el login')
        }
      } else {
        setError(data.message || 'Ocurrió un error en el registro')
      }
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error en el registro')
    } finally {
      setLoading(false)
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
                <h1 className="text-2xl font-bold">Regístrate</h1>
                <p className="text-muted-foreground text-balance">
                  Crea una cuenta nueva
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarme'}
              </Button>

              {error && (
                <div className="text-red-500 text-center mt-2">
                  {error}
                </div>
              )}

              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?&nbsp;
                <a href="/login" className="underline underline-offset-4">
                  Inicia sesión
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