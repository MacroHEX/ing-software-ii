'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {IUsuario} from "@/interfaces/IUsuario";
import {IEvento} from "@/interfaces/IEvento";

const CreateOrganizerFormSchema = z.object({
  usuarioid: z.number().min(1, {message: 'El usuario es requerido.'}),
  eventoid: z.number().min(1, {message: 'El evento es requerido.'}),
})

interface CreateOrganizerDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (organizerData: any) => Promise<boolean>
  usuarios: IUsuario[]
  eventos: IEvento[]
}

const CrearOrganizadorDialog = ({isOpen, onClose, onCreate, usuarios, eventos}: CreateOrganizerDialogProps) => {
  const form = useForm<z.infer<typeof CreateOrganizerFormSchema>>({
    resolver: zodResolver(CreateOrganizerFormSchema),
    defaultValues: {
      usuarioid: 0,
      eventoid: 0,
    },
  })

  const {handleSubmit, control} = form

  const handleCreateOrganizer = async (data: z.infer<typeof CreateOrganizerFormSchema>) => {
    try {
      const success = await onCreate(data)
      if (success) {
        toast.success('Organizador creado con éxito')
        form.reset()
        onClose()
      }
    } catch (error) {
      toast.error('Error al crear el organizador. Intenta nuevamente')
    }
  }

  // Evitar que los select se muestren si no hay datos disponibles
  if (!usuarios.length || !eventos.length) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo organizador</DialogTitle>
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
          <DialogTitle>Crear nuevo organizador</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleCreateOrganizer)} className="space-y-6">
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

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Crear Organizador</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CrearOrganizadorDialog
