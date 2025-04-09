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
import {IOrganizador} from "@/interfaces/IOrganizador"

const EditOrganizerFormSchema = z.object({
  organizadorid: z.number(),
  usuarioid: z.number(),
  eventoid: z.number(),
})

interface EditOrganizerDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (organizerData: any) => void
  organizadorData: IOrganizador | null
}

const EditarOrganizadorDialog = ({isOpen, onClose, onUpdate, organizadorData}: EditOrganizerDialogProps) => {
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
