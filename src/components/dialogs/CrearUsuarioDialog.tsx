'use client'

import {useEffect, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'

import {IRoles} from '@/interfaces/IRoles'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

const CreateUserFormSchema = z.object({
  nombre: z.string().min(1, {message: 'El nombre es requerido.'}),
  apellido: z.string().min(1, {message: 'El apellido es requerido.'}),
  nombreusuario: z.string().min(1, {message: 'El nombre de usuario es requerido.'}),
  correo: z.string().email({message: 'El correo debe ser válido.'}),
  password: z.string().min(6, {message: 'La contraseña debe tener al menos 6 caracteres.'}),
  rolid: z.number().min(1, {message: 'El rol es requerido.'}),
})

interface CreateUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (userData: any) => Promise<boolean>
}

const CrearUsuarioDialog = ({isOpen, onClose, onCreate}: CreateUserDialogProps) => {
  const [roles, setRoles] = useState<IRoles[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles')
        if (!response.ok) {
          throw new Error('Error fetching roles')
        }
        const rolesData = await response.json()
        setRoles(rolesData)
      } catch (error) {
        toast.error('Error al obtener los roles')
      }
    }

    fetchRoles().then()
  }, [])

  const form = useForm<z.infer<typeof CreateUserFormSchema>>({
    resolver: zodResolver(CreateUserFormSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      nombreusuario: '',
      correo: '',
      password: '',
      rolid: 2,
    },
  })

  useEffect(() => {
    form.setValue('nombre', '');
    form.setValue('apellido', '');
    form.setValue('nombreusuario', '');
    form.setValue('correo', '');
    form.setValue('password', '');
    form.setValue('rolid', 2);
  }, [isOpen]);

  const {handleSubmit, control} = form

  const handleCreateUser = async (data: z.infer<typeof CreateUserFormSchema>) => {
    try {
      const success = await onCreate(data)
      if (success) {
        toast.success('Usuario creado con éxito')
        form.reset()
        onClose()
      }
    } catch (error) {
      toast.error('Error al crear el usuario. Intenta nuevamente')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo usuario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-6">
            <FormField
              control={control}
              name="nombre"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="apellido"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="nombreusuario"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="juanperez" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="correo"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="juan@correo.com" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="rolid"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol"/>
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.rolid} value={role.rolid.toString()}>
                            {role.nombrerol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                Crear Usuario
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CrearUsuarioDialog
