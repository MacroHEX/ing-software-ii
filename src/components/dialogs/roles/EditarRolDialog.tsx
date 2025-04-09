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
import {IRoles} from "@/interfaces/IRoles"

const EditRoleFormSchema = z.object({
  rolid: z.number(),
  nombrerol: z.string().min(1, {message: 'El nombre del rol es requerido.'}),
})

interface EditRoleDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (roleData: any) => void
  roleData: IRoles | null
}

const EditarRolDialog = ({isOpen, onClose, onUpdate, roleData}: EditRoleDialogProps) => {
  const [initialValues, setInitialValues] = useState<IRoles | null>(roleData)

  useEffect(() => {
    if (roleData) {
      setInitialValues(roleData)
    }
  }, [isOpen, roleData])

  const form = useForm<z.infer<typeof EditRoleFormSchema>>({
    resolver: zodResolver(EditRoleFormSchema),
    defaultValues: initialValues
      ? {
        rolid: initialValues.rolid,
        nombrerol: initialValues.nombrerol,
      }
      : {
        rolid: 0,
        nombrerol: '',
      },
  })

  const {handleSubmit, control} = form

  const handleUpdateRole = async (data: z.infer<typeof EditRoleFormSchema>) => {
    try {
      onUpdate(data)
      onClose()
    } catch (error) {
      toast.error('Error al actualizar el rol. Intenta nuevamente')
    }
  }

  useEffect(() => {
    if (roleData) {
      form.reset({
        rolid: roleData.rolid,
        nombrerol: roleData.nombrerol,
      })
    }
  }, [isOpen, roleData, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar rol</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdateRole)} className="space-y-6">
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
            {/* Campo oculto para rolid */}
            <input type="hidden" value={form.getValues().rolid} {...form.register('rolid')} />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={!form.formState.isValid}>Actualizar Rol</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarRolDialog
