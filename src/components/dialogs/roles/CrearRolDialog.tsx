'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {useEffect} from "react";

const CreateRoleFormSchema = z.object({
  nombrerol: z.string().min(1, {message: 'El nombre del rol es requerido.'}),
})

interface CreateRoleDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (roleData: any) => Promise<boolean>
}

const CrearRolDialog = ({isOpen, onClose, onCreate}: CreateRoleDialogProps) => {
  const form = useForm<z.infer<typeof CreateRoleFormSchema>>({
    resolver: zodResolver(CreateRoleFormSchema),
    defaultValues: {
      nombrerol: '',
    },
  })

  useEffect(() => {
    form.setValue('nombrerol', '')
  }, [isOpen]);

  const {handleSubmit, control} = form

  const handleCreateRole = async (data: z.infer<typeof CreateRoleFormSchema>) => {
    try {
      const success = await onCreate(data)
      if (success) {
        toast.success('Rol creado con éxito')
        form.reset()
        onClose()
      }
    } catch (error) {
      toast.error('Error al crear el rol. Intenta nuevamente')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo rol</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleCreateRole)} className="space-y-6">
            <FormField
              control={control}
              name="nombrerol"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Nombre del Rol</FormLabel>
                  <FormControl>
                    <Input placeholder="Admin" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Crear Rol</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CrearRolDialog
