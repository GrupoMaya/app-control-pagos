import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAddPagoToLote } from '@/hooks/api/usePagos'
import { usePagosByProject } from '@/hooks/api/usePagos'
import DateIntlFormat from '@/utils/DateIntlFormat'
import NumberFormat from '@/utils/NumberFormat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { notifySuccess } from '@/utils/Notify'

export default function HookPagosModalInvoce ({ lote, onClose }) {
  const addPago = useAddPagoToLote()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [payload, setPayload] = useState(null)

  const idProject = lote.proyecto.toString()
  const clientID = lote.cliente.toString()
  const loteID = lote._id.toString()

  const { refetch } = usePagosByProject({ idProject, clientID, loteID })

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      lote: lote?.lote,
      mensualidad: lote?.mensualidad
    }
  })

  const saldoInicialWatch = watch('tipoPago')
  const tipoPago = watch('tipoPago')

  useEffect(() => {
    if (addPago.isSuccess) {
      notifySuccess('Pago guardado', 'El pago ha sido guardado correctamente')
      refetch()
      reset()
      setConfirmOpen(false)
      onClose()
    }
  }, [addPago.isSuccess])

  const onSubmit = (data) => {
    const dataLote = {
      cliente: lote.cliente,
      proyecto: lote.proyecto,
      lote: lote._id,
      mes: new Date(data.mes),
      refPago: data.refPago,
      mensualidad: data.mensualidad,
      tipoPago: data.tipoPago,
      folio: data.folio,
      folioincial: data.folioIncial,
      extraSlug: data.extraSlug
    }
    setPayload(dataLote)
    setConfirmOpen(true)
  }

  const sendConfirmData = () => {
    if (payload) {
      addPago.mutate(payload)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="hook__pagos space-y-4">
        <div className="space-y-2">
          <Label>Número de Lote</Label>
          <Input disabled {...register('lote')} />
        </div>

        <div className="space-y-2">
          <Label>Fecha mes correspondiente</Label>
          <Input type="date" {...register('mes', { required: true })} />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Pago</Label>
          <select className="w-full border rounded-md p-2" {...register('tipoPago')}>
            <option value="mensualidad">Pago Mensual</option>
            <option value="extra">Pago Extraordinario</option>
            <option value="acreditado">Acreditado</option>
            <option value="saldoinicial">Saldo inicial</option>
          </select>
        </div>

        {saldoInicialWatch === 'saldoinicial' && (
          <div className="space-y-2">
            <Label>Folio Inicial</Label>
            <Input type="number" placeholder="Ingresar Folio Inicial" {...register('folioIncial')} />
          </div>
        )}

        {tipoPago === 'extra' && (
          <div className="space-y-2">
            <Label>Descripción para el pago extraordinario</Label>
            <Input type="text" {...register('extraSlug')} />
          </div>
        )}

        <div className="space-y-2">
          <Label>Referencia de Pago</Label>
          <Input {...register('refPago')} />
        </div>

        <div className="space-y-2">
          <Label>Mensualidad</Label>
          <Input type="number" step="0.01" {...register('mensualidad')} />
        </div>

        <Button type="submit" className="w-full">Agregar Pago</Button>
      </form>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar pago</DialogTitle>
          </DialogHeader>
          <div className="modal__confirm space-y-4 py-4">
            <h3>Confirma tus datos</h3>
            <div>
              <small>Mensualidad Correspondiente</small>
              <p>{payload?.mes && <DateIntlFormat date={payload.mes} />}</p>
            </div>
            <div>
              <small>Referencia de Pago</small>
              <p>{payload?.refPago || '¿Te faltó la referencia?'}</p>
            </div>
            <div>
              <small>Mensualidad</small>
              <p><NumberFormat number={payload?.mensualidad} /></p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={sendConfirmData} disabled={addPago.isPending}>Enviar</Button>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Regresar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
