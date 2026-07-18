import { useForm } from 'react-hook-form'
import { useCreateProject } from '@/hooks/api/useProjects'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { notifySuccess, notifyError } from '@/utils/Notify'

export default function NuevoProject ({ visible, onCancel }) {
  const createProject = useCreateProject()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async (data) => {
    try {
      await createProject.mutateAsync({
        title: data.title.toLowerCase(),
        address: data.address.toLowerCase()
      })
      notifySuccess('Proyecto creado', 'El proyecto se ha creado correctamente')
      reset()
      onCancel(false)
    } catch {
      notifyError('Error', 'No se pudo crear el proyecto')
    }
  }

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Datos del Proyecto</DialogTitle>
        </DialogHeader>

        {createProject.isError && (
          <p className="text-destructive text-sm">El Proyecto ya está Activo</p>
        )}

        {createProject.isPending && <span className="spinner" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nombre</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
            />
            {errors.title && <span className="text-xs text-destructive">Campo Obligatorio</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              {...register('address', { required: true })}
            />
            {errors.address && <span className="text-xs text-destructive">Campo Obligatorio</span>}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="submit" disabled={createProject.isPending}>Guardar</Button>
            <Button type="button" variant="outline" onClick={() => onCancel(false)}>Cerrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
