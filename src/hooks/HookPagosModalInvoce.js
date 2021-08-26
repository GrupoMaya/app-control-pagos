import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'

import Notify from 'utils/Notify'

const HookPagosModalInvoce = ({ lote }) => {

  const [state, send] = useMachine(ClienteMachine)

  const [notifyHandled, setNotifyHandled] = useState(false)
  const setNotify = useCallback(() => {
    setNotifyHandled(true)
    setTimeout(() => {
      setNotifyHandled(false)
    }, 2000)

  })

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      lote: lote?.lote,
      mensualidad: lote?.mensualidad
    }
  })

  const onSubmit = (data) => {
    const payload = {
      cliente: lote.cliente,
      proyecto: lote.proyecto,
      lote: lote._id,
      mes: new Date(data.mes),
      refPago: data.refPago,
      mensualidad: data.mensualidad,     
      tipoPago: data.tipoPago 
    }
    send('ADD_PAGO_LOTE', { data: payload })
    setNotify()
  }

  useEffect(() => {
    if (state.matches('success')) {
      return reset()
    }
  }, [state.value])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="hook__pagos">

      <label>Numero de Lote</label>
      <input placeholder="lote" id="lote" {...register('lote')} />

      <label>Fecha de Pago</label>
      <input type="date" required placeholder="Ingresar Mes de pago" id="mes" {...register('mes', { required: true })} />

      <label>Tipo de Pago</label>
      <select defaultValues="normal" name="tipoPago" {...register('tipoPago')} >
        <option value="mensualidad">Pago Mensual</option>
        <option value="extra">Pago Extraordinario</option>
        <option value="acreditado">Acreditado</option>
      </select>

      <label>Referencia de Pago</label>
      <input placeholder="Referencia de Pago" id="refPago" {...register('refPago')} />

      <label>Mensualidad</label>
      <input type="number" placeholder="cantidad" id="cantidad" {...register('mensualidad')} />

      <div>
        <button type="submit">Generar Pago</button>
        { notifyHandled && <Notify errorType="success" msg="Pago Generado" /> }
      </div>
    </form>
  )
}

export default HookPagosModalInvoce
