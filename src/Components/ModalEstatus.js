import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useAppContext } from '@/context/AppContextProvider'
import { usePostPago } from '@/hooks/api/usePagos'
import SelectorBanco from '@/utils/SelectorBanco'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { notifySuccess } from '@/utils/Notify'

export default function ModalEstatus ({ openModal, handledStatusPago }) {
  const { idPago } = useAppContext()
  const postPago = usePostPago()
  const [openMensajeRecibo, setOpenMensajeRecibo] = useState(false)

  const { register, control, formState: { errors }, handleSubmit, reset } = useForm()

  const closeModal = () => {
    reset()
    handledStatusPago(false)
  }

  useEffect(() => {
    if (postPago.isSuccess) {
      notifySuccess('Pago actualizado', 'El pago se ha actualizado correctamente')
      setTimeout(() => closeModal(), 1000)
    }
  }, [postPago.isSuccess])

  const pagar = (data) => {
    postPago.mutate({ id: idPago, payload: { ...data, status: true } })
  }

  return (
    <Dialog open={openModal} onOpenChange={handledStatusPago}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Liquidar Pago</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(pagar)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Referencia Bancaria</Label>
            <Input {...register('refBanco', { required: true })} />
            {errors.refBanco && <span className="text-xs text-destructive">Obligatorio</span>}
          </div>

          <div className="space-y-2">
            <Label>Fecha de Depósito</Label>
            <Input type="date" {...register('fechaPago', { required: true })} />
            {errors.fechaPago && <span className="text-xs text-destructive">Obligatorio</span>}
          </div>

          <div className="space-y-2">
            <Label>Cuenta Bancaria</Label>
            <Input {...register('ctaBancaria', { required: true })} />
            {errors.ctaBancaria && <span className="text-xs text-destructive">Obligatorio</span>}
          </div>

          <div className="space-y-2">
            <Label>Banco</Label>
            <Controller
              control={control}
              name="banco"
              rules={{ required: true }}
              render={({ field }) => <SelectorBanco value={field.value} onChange={field.onChange} />}
            />
            {errors.banco && <span className="text-xs text-destructive">Obligatorio</span>}
          </div>

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Input {...register('textoObservaciones')} />
          </div>

          <p className="texto-button cursor-pointer" onClick={() => setOpenMensajeRecibo(!openMensajeRecibo)}>
            Modificar mensaje de recibo
          </p>

          {openMensajeRecibo && (
            <div className="space-y-2">
              <Input type="text" {...register('mensajeRecibo')} placeholder="Modificar mensaje del recibo" />
              <small className="mensaje-recibo">Este campo modificará el mensaje completo predeterminado del recibo</small>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={postPago.isPending}>
            {postPago.isPending ? 'Guardando...' : 'Liquidar Pago'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
