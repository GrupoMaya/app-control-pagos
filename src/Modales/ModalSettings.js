import { useForm } from 'react-hook-form'
import { useSettings, usePatchSettings } from '@/hooks/api/useSettings'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { notifySuccess } from '@/utils/Notify'

function FormCapsule ({ dataApp, onSuccess }) {
  const patchSettings = usePatchSettings()
  const { register, handleSubmit } = useForm({ defaultValues: dataApp })

  const onSubmit = async (data) => {
    await patchSettings.mutateAsync(data)
    notifySuccess('Configuración guardada', 'Los datos de la empresa se actualizaron')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="razonSocial">Razón Social</Label>
        <Input id="razonSocial" {...register('razonSocial', { required: true })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rfc">RFC</Label>
        <Input id="rfc" {...register('rfc', { required: true })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Calle, Número y Código Postal</Label>
        <Input id="direccion" {...register('direccion', { required: true })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ciudad">Ciudad, Estado y Municipio</Label>
        <Input id="ciudad" {...register('ciudad', { required: true })} />
      </div>

      <Button type="submit" disabled={patchSettings.isPending}>Guardar</Button>
    </form>
  )
}

export default function ModalSettings ({ visible, onCancel }) {
  const { data: appData, isLoading } = useSettings()

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuración de la Empresa</DialogTitle>
        </DialogHeader>

        {isLoading && <Skeleton className="h-48 w-full" />}

        {!isLoading && appData && (
          <FormCapsule dataApp={appData} onSuccess={() => onCancel(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
