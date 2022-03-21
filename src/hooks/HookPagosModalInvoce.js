import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from 'antd'

import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'
import { useMayaState } from 'context/MayaMachine'

import DateIntlFormat from 'utils/DateIntlFormat'
import NumberFormat from 'utils/NumberFormat'
import './StylesModales.scss'
import { useToast } from '@chakra-ui/react'

const HookPagosModalInvoce = ({ lote }) => {

  const [isOpen, setIsOpen] = useState(false)
  const handelOpenModal = () => setIsOpen(!isOpen)

  const [state, send] = useMachine(ClienteMachine)

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      lote: lote?.lote,
      mensualidad: lote?.mensualidad
    }
  })

  const saldoInicialWatch = watch('tipoPago')
  const tipoPago = watch('tipoPago')

  const [payload, setPayload] = useState({})
  const sendConfirmData = () => {
    send('ADD_PAGO_LOTE', { data: payload })
    handelOpenModal()
  }
  
  const { xstateQuery } = useMayaState()
  const toast = useToast()
  useEffect(() => {
    if (state.matches('success')) {
      toast({
        title: 'Pago guardado',
        description: 'El pago ha sido guardado correctamente',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      xstateQuery.send('GET_PAGOS_BY_PROJECT', { query: xstateQuery.query })
    }

  }, [state.value])

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
    setIsOpen(true)
  }

  useEffect(() => {
    if (state.matches('success')) {
      return reset()
    }
  }, [state.value])

  return (
  <>
    <form onSubmit={handleSubmit(onSubmit)} className="hook__pagos">

      <label>Numero de Lote</label>
      <input disabled placeholder="lote" id="lote" {...register('lote')} />

      <label>Fecha mes correspondiente</label>
      <input type="date" required id="mes" {...register('mes', { required: true })} />

      <label>Tipo de Pago</label>
      <select defaultValues="normal" name="tipoPago" {...register('tipoPago')} >
        <option value="mensualidad">Pago Mensual</option>
        <option value="extra">Pago Extraordinario</option>
        <option value="acreditado">Acreditado</option>
        <option value="saldoinicial">Saldo inicial</option>
      </select>
      {
        saldoInicialWatch === 'saldoinicial' && (
          <label>
            Folio Actual
            <br />
            <input type="number" placeholder="Ingresar Folio Inicial" id="folioIncial" {...register('folioIncial')} />
          </label>
        )
      }
      {
        tipoPago === 'extra' && (
          <>
            <label>Descripción para el pago extraordinario</label>
            <input type="text" name="extraSlug" {...register('extraSlug')} />
          </>
        )
      }

      <label>Referencia de Pago</label>
      <input placeholder="Referencia de Pago" id="refPago" {...register('refPago')} />

      <label>Mensualidad</label>
      <input type="number" placeholder="cantidad" id="cantidad" {...register('mensualidad')} />

      <div>
        <button type="submit">Agregar Pago</button>
      </div>
      {/* modal de confirmacion  */}
    </form>
      <Modal
          title="Confirmar pago"
          visible={isOpen}
          onCancel={handelOpenModal}
          footer={[
            <button className="btn__send-ok" key="send" onClick={() => sendConfirmData()}>
              Enviar
            </button>,
            <button className="btn__outline" key="cancel" onClick={() => handelOpenModal()}>
              Regresar
            </button>
          ]}
          >
          <div className="modal__confirm">
          <h3>Confirma tus datos</h3>
          <hr/>
            <span>
              <small>Mensualidad Correspondiente</small>
              { payload.mes && <DateIntlFormat date={payload.mes} dateStyle='medium' />}
            </span>
            <span>
              <small>Referencia de Pago</small>
              {payload.refPago || <h4>¿Te falto la referencia?</h4> }
            </span>
            <span>
              <small>Mensualidad</small>
              <NumberFormat number={payload?.mensualidad} />
            </span>
          </div>
      </Modal>
    </>
  )
}

export default HookPagosModalInvoce
