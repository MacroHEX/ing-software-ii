'use client'

import {useEffect, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {IEvento} from "@/interfaces/IEvento"

const EditEventoFormSchema = z.object({
  eventoid: z.number(),
  nombre: z.string().min(1, {message: 'El nombre del evento es requerido.'}),
  fecha: z.string().min(1, {message: 'La fecha es requerida.'}),
  ubicacion: z.string().min(1, {message: 'La ubicación es requerida.'}),
  imagen: z.string().min(1, {message: 'La imagen es requerida.'}),
  tipoeventoid: z.number().min(1, {message: 'El tipo de evento es requerido.'}),
})

interface EditEventoDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (eventoData: any) => void
  eventoData: IEvento | null
}

const EditarEventoDialog = ({isOpen, onClose, onUpdate, eventoData}: EditEventoDialogProps) => {
  const [initialValues, setInitialValues] = useState<IEvento | null>(eventoData)

  useEffect(() => {
    if (eventoData) {
      setInitialValues(eventoData)
    }
  }, [isOpen, eventoData])

  const form = useForm<z.infer<typeof EditEventoFormSchema>>({
    resolver: zodResolver(EditEventoFormSchema),
    defaultValues: initialValues
      ? {
        eventoid: initialValues.eventoid,
        nombre: initialValues.nombre,
        fecha: initialValues.fecha.toISOString().slice(0, 16), // Convertir a formato datetime-local
        ubicacion: initialValues.ubicacion,
        imagen: initialValues.imagen,
        tipoeventoid: initialValues.tipoeventoid,
      }
      : {
        eventoid: 0,
        nombre: '',
        fecha: '',
        ubicacion: '',
        imagen: '',
        tipoeventoid: 1,
      },
  })

  const {handleSubmit, control} = form

  const handleUpdateEvento = async (data: z.infer<typeof EditEventoFormSchema>) => {
    try {
      onUpdate(data)
      onClose()
    } catch (error) {
      toast.error('Error al actualizar el evento. Intenta nuevamente')
    }
  }

  useEffect(() => {
    if (eventoData) {
      form.reset({
        eventoid: eventoData.eventoid,
        nombre: eventoData.nombre,
        fecha: eventoData.fecha.toISOString().slice(0, 16), // Convertir a formato datetime-local
        ubicacion: eventoData.ubicacion,
        imagen: eventoData.imagen,
        tipoeventoid: eventoData.tipoeventoid,
      })
    }
  }, [isOpen, eventoData, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdateEvento)} className="space-y-6">
            <FormField
              control={control}
              name="nombre"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Evento de ejemplo" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="fecha"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="ubicacion"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ubicación del evento" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="imagen"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de la imagen" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="tipoeventoid"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Tipo de Evento</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            {/* Campo oculto para eventoid */}
            <input type="hidden" {...form.register('eventoid')} />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Actualizar Evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarEventoDialog
