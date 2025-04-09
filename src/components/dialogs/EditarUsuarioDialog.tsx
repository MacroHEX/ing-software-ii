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
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'

import {IUsuario} from '@/interfaces/IUsuario'

const EditUserFormSchema = z.object({
  usuarioid: z.number(),
  nombreusuario: z.string().min(1, {message: 'El usuario es requerido.'}),
  nombre: z.string().min(1, {message: 'El nombre es requerido.'}),
  apellido: z.string().min(1, {message: 'El apellido es requerido.'}),
  correo: z.string().email({message: 'El correo debe ser válido.'}),
  rolid: z.number().min(1, {message: 'El rol es requerido.'}),
})

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (userData: any) => void
  userData: IUsuario | null
}

const EditarUsuarioDialog = ({isOpen, onClose, onUpdate, userData}: EditUserDialogProps) => {
  const [roles, setRoles] = useState<IRoles[]>([])
  const [initialValues, setInitialValues] = useState<IUsuario | null>(userData)

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
  }, [isOpen])

  const form = useForm<z.infer<typeof EditUserFormSchema>>({
    resolver: zodResolver(EditUserFormSchema),
    defaultValues: initialValues
      ? {
        usuarioid: initialValues.usuarioid,
        nombreusuario: initialValues.nombreusuario,
        nombre: initialValues.nombre,
        apellido: initialValues.apellido,
        correo: initialValues.correo,
        rolid: initialValues.rolid,
      }
      : {
        usuarioid: 0,
        nombreusuario: '',
        nombre: '',
        apellido: '',
        correo: '',
        rolid: 1,
      },
  })

  useEffect(() => {
    if (userData) {
      form.reset({
        usuarioid: userData.usuarioid,
        nombreusuario: userData.nombreusuario,
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo: userData.correo,
        rolid: userData.rolid,
      })
    }
  }, [isOpen, userData, form])

  const {handleSubmit, control} = form

  const handleUpdateUser = async (data: z.infer<typeof EditUserFormSchema>) => {
    try {
      onUpdate(data)
      onClose()
    } catch (error) {
      toast.error('Error al actualizar el usuario. Intenta nuevamente')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-6">
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
                  <FormLabel>Nombre de Usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="juanperez"
                      value={userData?.nombreusuario || ''}
                      readOnly
                      disabled
                    />
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
              name="rolid"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ''}
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

            {/* Hidden field for usuarioid */}
            <input type="hidden" {...form.register('usuarioid')} />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                Actualizar Usuario
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarUsuarioDialog
