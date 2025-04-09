'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Input} from "@/components/ui/input";

const CreateOrganizerFormSchema = z.object({
  usuarioid: z.number(),
  eventoid: z.number(),
})

interface CreateOrganizerDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (organizerData: any) => Promise<boolean>
}

const CrearOrganizadorDialog = ({isOpen, onClose, onCreate}: CreateOrganizerDialogProps) => {
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
                  <FormLabel>ID Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="ID Usuario" type="number" {...field} />
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
                    <Input placeholder="ID Evento" type="number" {...field} />
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
