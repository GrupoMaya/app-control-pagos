import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DateIntlFormat from '@/utils/DateIntlFormat'
import { useUserState } from '@/context/userContext'
import { usePatchLote } from '@/hooks/api/useLotes'

export default function LoteTemplate ({ data, onClose }) {
  const { user } = useUserState()
  const patchLote = usePatchLote()

  const { register, handleSubmit } = useForm({
    defaultValues: { ...data }
  })

  const onSubmit = (payload) => {
    patchLote.mutate(
      { id: data._id, payload },
      {
        onSuccess: () => {
          toast.success('Lote actualizado correctamente')
          onClose()
        },
        onError: () => {
          toast.error('No se pudo actualizar el lote')
        }
      }
    )
  }

  const isAdmin = user?.role === 'admin'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="lote">Lote</Label>
        <Input id="lote" {...register('lote')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="inicioContrato">Inicio Contrato</Label>
        {data.inicioContrato && (
          <p className="text-sm text-muted-foreground">
            Fecha almacenada: <DateIntlFormat date={data.inicioContrato} />
          </p>
        )}
        <Input id="inicioContrato" type="date" {...register('inicioContrato')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="mensualidad">Mensualidad</Label>
        <Input id="mensualidad" {...register('mensualidad')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="plazo">Plazo</Label>
        <Input id="plazo" {...register('plazo')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="precioTotal">Precio Total</Label>
        <Input id="precioTotal" {...register('precioTotal')} />
      </div>

      {isAdmin && (
        <div className="flex justify-end">
          <Button type="submit" disabled={patchLote.isPending}>Modificar</Button>
        </div>
      )}
    </form>
  )
}
