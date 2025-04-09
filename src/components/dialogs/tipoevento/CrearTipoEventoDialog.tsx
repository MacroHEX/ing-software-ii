'use client'

import {useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'

const CreateTipoEventoFormSchema = z.object({
  descripcion: z.string().min(1, {message: 'La descripción del tipo de evento es requerida.'}),
})

interface CreateTipoEventoDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (tipoEventoData: any) => Promise<boolean>
}

const CrearTipoEventoDialog = ({isOpen, onClose, onCreate}: CreateTipoEventoDialogProps) => {
  const form = useForm<z.infer<typeof CreateTipoEventoFormSchema>>({
    resolver: zodResolver(CreateTipoEventoFormSchema),
    defaultValues: {
      descripcion: '',
    },
  })

  const {handleSubmit, control} = form

  const handleCreateTipoEvento = async (data: z.infer<typeof CreateTipoEventoFormSchema>) => {
    try {
      const success = await onCreate(data)
      if (success) {
        toast.success('Tipo de evento creado con éxito')
        form.reset()
        onClose()
      }
    } catch (error) {
      toast.error('Error al crear el tipo de evento. Intenta nuevamente')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo tipo de evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleCreateTipoEvento)} className="space-y-6">
            <FormField
              control={control}
              name="descripcion"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción del tipo de evento" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Crear Tipo de Evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CrearTipoEventoDialog
