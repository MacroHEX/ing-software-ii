'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Input} from "@/components/ui/input";

const CreateInscripcionFormSchema = z.object({
  usuarioid: z.number(),
  eventoid: z.number(),
})

interface CreateInscripcionDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (inscripcionData: any) => Promise<boolean>
}

const CrearInscripcionDialog = ({isOpen, onClose, onCreate}: CreateInscripcionDialogProps) => {
  const form = useForm<z.infer<typeof CreateInscripcionFormSchema>>({
    resolver: zodResolver(CreateInscripcionFormSchema),
    defaultValues: {
      usuarioid: 0,
      eventoid: 0,
    },
  })

  const {handleSubmit, control} = form

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
              render={({field}) => (
                <FormItem>
                  <FormLabel>ID Usuario</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                  <FormLabel>ID Evento</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage/>
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
