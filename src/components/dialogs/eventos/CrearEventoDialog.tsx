'use client'

import {useEffect, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {ITipoEvento} from "@/interfaces/ITipoEvento";

const CreateEventoFormSchema = z.object({
  nombre: z.string().min(1, {message: 'El nombre del evento es requerido.'}),
  fecha: z.string().min(1, {message: 'La fecha es requerida.'}),
  ubicacion: z.string().min(1, {message: 'La ubicación es requerida.'}),
  imagen: z.string().min(1, {message: 'La imagen es requerida.'}),
  tipoeventoid: z.number().min(1, {message: 'El tipo de evento es requerido.'}),
})

interface CreateEventoDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (eventoData: any) => Promise<boolean>
}

const CrearEventoDialog = ({isOpen, onClose, onCreate}: CreateEventoDialogProps) => {
  const [tiposDeEvento, setTiposDeEvento] = useState<ITipoEvento[]>([])

  // Obtener tipos de evento desde la API
  useEffect(() => {
    const fetchTiposDeEvento = async () => {
      try {
        const response = await fetch('/api/tipoeventos')
        if (!response.ok) {
          throw new Error('Error fetching tipos de evento')
        }
        const tiposData = await response.json()
        setTiposDeEvento(tiposData)
      } catch (error) {
        toast.error('Error al obtener los tipos de evento')
      }
    }

    fetchTiposDeEvento().then()
  }, [])

  const form = useForm<z.infer<typeof CreateEventoFormSchema>>({
    resolver: zodResolver(CreateEventoFormSchema),
    defaultValues: {
      nombre: '',
      fecha: '',
      ubicacion: '',
      imagen: '',
      tipoeventoid: 1,
    },
  })

  useEffect(() => {
    form.setValue('nombre', '');
    form.setValue('fecha', '');
    form.setValue('ubicacion', '');
    form.setValue('imagen', '');
    form.setValue('tipoeventoid', 1);
  }, [isOpen]);

  const {handleSubmit, control} = form

  const handleCreateEvento = async (data: z.infer<typeof CreateEventoFormSchema>) => {
    try {
      const success = await onCreate(data)
      if (success) {
        toast.success('Evento creado con éxito')
        form.reset()
        onClose()
      }
    } catch (error) {
      toast.error('Error al crear el evento. Intenta nuevamente')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleCreateEvento)} className="space-y-6">
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
                    <Select value={field.value?.toString() ?? ""}
                            onValueChange={(value) => field.onChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de evento"/>
                      </SelectTrigger>
                      <SelectContent>
                        {tiposDeEvento.map((tipo) => (
                          <SelectItem key={tipo.tipoeventoid} value={tipo.tipoeventoid.toString()}>
                            {tipo.descripcion}
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
              <Button type="submit" disabled={!form.formState.isValid}>Crear Evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CrearEventoDialog
