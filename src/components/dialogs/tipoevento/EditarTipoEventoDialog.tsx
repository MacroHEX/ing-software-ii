'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ITipoEvento } from "@/interfaces/ITipoEvento"

const EditTipoEventoFormSchema = z.object({
  tipoeventoid: z.number(),
  descripcion: z.string().min(1, { message: 'La descripción es requerida.' }),
})

interface EditTipoEventoDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (tipoEventoData: any) => void
  tipoEventoData: ITipoEvento | null
}

const EditarTipoEventoDialog = ({ isOpen, onClose, onUpdate, tipoEventoData }: EditTipoEventoDialogProps) => {
  const [initialValues, setInitialValues] = useState<ITipoEvento | null>(tipoEventoData)

  useEffect(() => {
    if (tipoEventoData) {
      setInitialValues(tipoEventoData)
    }
  }, [isOpen, tipoEventoData])

  const form = useForm<z.infer<typeof EditTipoEventoFormSchema>>({
    resolver: zodResolver(EditTipoEventoFormSchema),
    defaultValues: initialValues
      ? {
        tipoeventoid: initialValues.tipoeventoid,
        descripcion: initialValues.descripcion,
      }
      : {
        tipoeventoid: 0,
        descripcion: '',
      },
  })

  const { handleSubmit, control } = form

  const handleUpdateTipoEvento = async (data: z.infer<typeof EditTipoEventoFormSchema>) => {
    try {
      onUpdate(data)
      onClose()
    } catch (error) {
      toast.error('Error al actualizar el tipo de evento. Intenta nuevamente')
    }
  }

  useEffect(() => {
    if (tipoEventoData) {
      form.reset({
        tipoeventoid: tipoEventoData.tipoeventoid,
        descripcion: tipoEventoData.descripcion,
      })
    }
  }, [isOpen, tipoEventoData, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar tipo de evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdateTipoEvento)} className="space-y-6">
            <FormField
              control={control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción del tipo de evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo oculto para tipoeventoid */}
            <input type="hidden" {...form.register('tipoeventoid')} />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Actualizar Tipo de Evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarTipoEventoDialog
