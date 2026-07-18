import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DateIntlFormat from '@/utils/DateIntlFormat'
import { useUserState } from '@/context/userContext'
import { usePatchPago } from '@/hooks/api/usePagos'
import FolioUpdate from '@/Modales/FolioUpdate'

export default function PagoTemplate ({ data, onClose }) {
  const { user } = useUserState()
  const patchPago = usePatchPago()
  const [openMensaje, setOpenMensaje] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...data,
      mensualidad: data.mensualidad?.$numberDecimal
        ? data.mensualidad.$numberDecimal
        : data.mensualidad,
      mes: data?.mes?.split('T')[0],
      fechaPago: data?.fechaPago?.split('T')[0]
    }
  })

  const onSubmit = (payload) => {
    patchPago.mutate(
      { id: data._id, payload },
      {
        onSuccess: () => {
          toast.success('Pago actualizado correctamente')
          onClose()
        },
        onError: () => {
          toast.error('No se pudo actualizar el pago')
        }
      }
    )
  }

  const isAdmin = user?.role === 'admin'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FolioUpdate document={data} onClose={onClose} />

      <div className="grid gap-2">
        <Label htmlFor="banco">Banco</Label>
        <Input id="banco" {...register('banco')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ctaBancaria">Cuenta Bancaria</Label>
        <Input id="ctaBancaria" {...register('ctaBancaria')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="mensualidad">Total pago</Label>
        <Input id="mensualidad" {...register('mensualidad')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="refPago">Referencia de pago</Label>
        <Input id="refPago" {...register('refPago')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="refBanco">Referencia Bancaria</Label>
        <Input id="refBanco" {...register('refBanco')} />
      </div>

      {data.extraSlug && (
        <div className="grid gap-2">
          <Label htmlFor="extraSlug">Referencia de documento Extra</Label>
          <Input id="extraSlug" {...register('extraSlug')} />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="fechaPago">Fecha de Depósito</Label>
        {data.fechaPago && (
          <p className="text-sm text-muted-foreground">
            Fecha guardada: <DateIntlFormat date={data.fechaPago} />
          </p>
        )}
        <Input id="fechaPago" type="date" {...register('fechaPago')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="mes">Fecha de Documento</Label>
        {data.mes && (
          <p className="text-sm text-muted-foreground">
            Fecha actual: <DateIntlFormat date={data.mes} />
          </p>
        )}
        <Input id="mes" type="date" {...register('mes')} />
      </div>

      <button
        type="button"
        className="text-sm text-primary underline"
        onClick={() => setOpenMensaje(prev => !prev)}
      >
        Modificar mensaje de recibo
      </button>

      {openMensaje && (
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            Este campo modificará todo el mensaje
          </p>
          <Label htmlFor="mensajeRecibo">Mensaje de recibo</Label>
          <Input
            id="mensajeRecibo"
            placeholder="Modificar mensaje del recibo"
            {...register('mensajeRecibo')}
          />
        </div>
      )}

      {isAdmin && (
        <div className="flex justify-end">
          <Button type="submit" disabled={patchPago.isPending}>Modificar</Button>
        </div>
      )}
    </form>
  )
}
