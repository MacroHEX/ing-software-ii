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
import { IInscripcion } from "@/interfaces/IInscripcion"

const EditInscripcionFormSchema = z.object({
  inscripcionid: z.number(),
  usuarioid: z.number(),
  eventoid: z.number(),
})

interface EditInscripcionDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (inscripcionData: any) => void
  inscripcionData: IInscripcion | null
}

const EditarInscripcionDialog = ({ isOpen, onClose, onUpdate, inscripcionData }: EditInscripcionDialogProps) => {
  const [initialValues, setInitialValues] = useState<IInscripcion | null>(inscripcionData)

  useEffect(() => {
    if (inscripcionData) {
      setInitialValues(inscripcionData)
    }
  }, [isOpen, inscripcionData])

  const form = useForm<z.infer<typeof EditInscripcionFormSchema>>({
    resolver: zodResolver(EditInscripcionFormSchema),
    defaultValues: initialValues
      ? {
        inscripcionid: initialValues.inscripcionid,
        usuarioid: initialValues.usuarioid,
        eventoid: initialValues.eventoid,
      }
      : {
        inscripcionid: 0,
        usuarioid: 0,
        eventoid: 0,
      },
  })

  const { handleSubmit, control } = form

  const handleUpdateInscripcion = async (data: z.infer<typeof EditInscripcionFormSchema>) => {
    try {
      onUpdate(data)
      onClose()
    } catch (error) {
      toast.error('Error al actualizar la inscripción. Intenta nuevamente')
    }
  }

  useEffect(() => {
    if (inscripcionData) {
      form.reset({
        inscripcionid: inscripcionData.inscripcionid,
        usuarioid: inscripcionData.usuarioid,
        eventoid: inscripcionData.eventoid,
      })
    }
  }, [isOpen, inscripcionData, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar inscripción</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdateInscripcion)} className="space-y-6">
            <FormField
              control={control}
              name="usuarioid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Usuario</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ID Usuario" {...field} />
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
                  <FormLabel>ID Evento</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ID Evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo oculto para inscripcionid */}
            <input type="hidden" {...form.register('inscripcionid')} />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Actualizar Inscripción</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarInscripcionDialog
