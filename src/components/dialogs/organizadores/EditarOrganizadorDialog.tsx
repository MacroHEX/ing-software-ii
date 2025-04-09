'use client'

import {useEffect, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {IOrganizador} from '@/interfaces/IOrganizador'
import {IUsuario} from "@/interfaces/IUsuario";
import {IEvento} from "@/interfaces/IEvento";

const EditOrganizerFormSchema = z.object({
  organizadorid: z.number(),
  usuarioid: z.number().min(1, {message: 'El usuario es requerido.'}),
  eventoid: z.number().min(1, {message: 'El evento es requerido.'}),
})

interface EditOrganizerDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (organizerData: any) => void
  organizadorData: IOrganizador | null
  usuarios: IUsuario[]
  eventos: IEvento[]
}

const EditarOrganizadorDialog = ({
                                   isOpen,
                                   onClose,
                                   onUpdate,
                                   organizadorData,
                                   usuarios,
                                   eventos
                                 }: EditOrganizerDialogProps) => {
  const [initialValues, setInitialValues] = useState<IOrganizador | null>(organizadorData)

  useEffect(() => {
    if (organizadorData) {
      setInitialValues(organizadorData)
    }
  }, [isOpen, organizadorData])

  const form = useForm<z.infer<typeof EditOrganizerFormSchema>>({
    resolver: zodResolver(EditOrganizerFormSchema),
    defaultValues: initialValues
      ? {
        organizadorid: initialValues.organizadorid,
        usuarioid: initialValues.usuarioid,
        eventoid: initialValues.eventoid,
      }
      : {
        organizadorid: 0,
        usuarioid: 0,
        eventoid: 0,
      },
  })

  const {handleSubmit, control} = form

  const handleUpdateOrganizer = async (data: z.infer<typeof EditOrganizerFormSchema>) => {
    try {
      onUpdate(data)
      onClose()
    } catch (error) {
      toast.error('Error al actualizar el organizador. Intenta nuevamente')
    }
  }

  useEffect(() => {
    if (organizadorData) {
      form.reset({
        organizadorid: organizadorData.organizadorid,
        usuarioid: organizadorData.usuarioid,
        eventoid: organizadorData.eventoid,
      })
    }
  }, [isOpen, organizadorData, form])

  // Evitar que los select se muestren si no hay datos disponibles
  if (!usuarios.length || !eventos.length) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar organizador</DialogTitle>
          </DialogHeader>
          <div className="text-center p-4">Cargando datos de usuarios y eventos...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar organizador</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdateOrganizer)} className="space-y-6">
            <FormField
              control={control}
              name="usuarioid"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Select value={field.value?.toString() ?? ''}
                            onValueChange={(value) => field.onChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario"/>
                      </SelectTrigger>
                      <SelectContent>
                        {usuarios.map((usuario) => (
                          <SelectItem key={usuario.usuarioid} value={usuario.usuarioid.toString()}>
                            {usuario.nombreusuario}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="eventoid"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Evento</FormLabel>
                  <FormControl>
                    <Select value={field.value?.toString() ?? ''}
                            onValueChange={(value) => field.onChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un evento"/>
                      </SelectTrigger>
                      <SelectContent>
                        {eventos.map((evento) => (
                          <SelectItem key={evento.eventoid} value={evento.eventoid.toString()}>
                            {evento.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            {/* Campo oculto para organizadorid */}
            <input type="hidden" {...form.register('organizadorid')} />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Actualizar Organizador</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarOrganizadorDialog
