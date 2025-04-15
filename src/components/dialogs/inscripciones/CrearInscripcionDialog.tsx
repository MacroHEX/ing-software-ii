'use client'

import {useEffect, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Select, SelectContent, SelectItem} from '@/components/ui/select'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {IUsuario} from '@/interfaces/IUsuario'
import {IEvento} from '@/interfaces/IEvento'

const CreateInscripcionFormSchema = z.object({
  usuarioid: z.number().min(1, { message: 'El usuario es requerido.' }),
  eventoid: z.number().min(1, { message: 'El evento es requerido.' }),
})

interface CreateInscripcionDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (inscripcionData: any) => Promise<boolean>
}

const CrearInscripcionDialog = ({ isOpen, onClose, onCreate }: CreateInscripcionDialogProps) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([])
  const [eventos, setEventos] = useState<IEvento[]>([])

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('/api/usuarios')
        if (!response.ok) throw new Error('Error fetching usuarios')
        const usuariosData = await response.json()
        // Excluir usuario con ID 1 (admin)
        setUsuarios(usuariosData.filter((usuario: IUsuario) => usuario.usuarioid !== 1))
      } catch (error) {
        toast.error('Error al obtener los usuarios')
      }
    }

    const fetchEventos = async () => {
      try {
        const response = await fetch('/api/eventos')
        if (!response.ok) throw new Error('Error fetching eventos')
        const eventosData = await response.json()
        setEventos(eventosData)
      } catch (error) {
        toast.error('Error al obtener los eventos')
      }
    }

    fetchUsuarios().then()
    fetchEventos().then()
  }, [])

  const form = useForm<z.infer<typeof CreateInscripcionFormSchema>>({
    resolver: zodResolver(CreateInscripcionFormSchema),
    defaultValues: {
      usuarioid: 1,
      eventoid: 1,
    },
  })

  const { handleSubmit, control } = form

  const handleCreateInscripcion = async (data: z.infer<typeof CreateInscripcionFormSchema>) => {
    try {
      const success = await onCreate(data)
      if (success) {
        toast.success('Inscripción creada con éxito')
        form.reset()
        onClose()
      }
    } catch (error) {
      toast.error('Error al crear la inscripción. Intenta nuevamente')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nueva inscripción</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleCreateInscripcion)} className="space-y-6">
            <FormField
              control={control}
              name="usuarioid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectContent>
                        {usuarios.map((usuario) => (
                          <SelectItem key={usuario.usuarioid} value={usuario.usuarioid.toString()}>
                            {usuario.nombre} {usuario.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="eventoid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evento</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectContent>
                        {eventos.map((evento) => (
                          <SelectItem key={evento.eventoid} value={evento.eventoid.toString()}>
                            {evento.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Crear Inscripción</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CrearInscripcionDialog