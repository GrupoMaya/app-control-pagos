import { useContext, useEffect, useState } from 'react'
import { AppContext } from 'context/AppContextProvider'
import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'
import { Modal } from 'antd'
import { useToast } from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import SelectorBanco from 'utils/SelectorBanco'
import { useMayaState } from 'context/MayaMachine'

const ModalEstatus = () => {
  
  const [state, send] = useMachine(ClienteMachine)
  const { idPago, modalPago, setModalPago } = useContext(AppContext)
  
  const { register, formState: { errors }, handleSubmit, reset } = useForm()
  const { xstateMutate, xstateQuery } = useMayaState()
  const toast = useToast()

  const resetModal = () => {
    reset()
    setModalPago(false)
  }

  useEffect(() => {
    if (state.matches('success')) {
      toast({
        title: 'Pago actualizado',
        description: 'El pago se ha actualizado correctamente',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      
      setTimeout(() => {
        xstateMutate('GET_PAGOS_BY_PROJECT', { query: xstateQuery.query })
        resetModal()
      }, 1000)
    }
  }, [state.value])

  const pagar = (data) => {
    const payload = {
      ...data, status: true
    }
    send('POST__PAGAR', { idPago, payload })
  }

  const [openMensajeRecibo, setOpenMensajeRecibo] = useState(false)
  const handledOpenMensajeRecibo = () => setOpenMensajeRecibo(!openMensajeRecibo)
  
  return (
    <Modal
    visible={modalPago}
    footer={null}
    onCancel={resetModal}
    >
      <form onSubmit={handleSubmit(pagar)} className="form__liquid__pago">
      <label>Referencia Bancaria
      <input
        required={errors.refBanco && true }
        id="refBanco"
        type="text"
        placeHolder="Referencia bancaria"
        {...register('refBanco', { required: true })}
        />
      <small>Obligatorio</small>
      </label>

      <label>Fecha de Deposito
      <input
        required={errors.fechaPago && true }
        id="fechaPago"
        type="date"
        placeHolder="Fecha de depostio"
        {...register('fechaPago', { required: true })}
        />
      <small>Obligatorio</small>
      </label>

      <label>
        Cuenta Bancaria
      <input
        required={errors.ctaBancaria && true }
        type="text"
        placeholder="CTA o CABLE" {...register('ctaBancaria', { required: true })}
        />
        <small>Obligatorio</small>
      </label>

      <label>
        Banco
      <SelectorBanco register={register} />
        <small>Obligatorio</small>
      </label>

      <label>
        <input type="text" placeholder="Observaciones del documento" {...register('textoObservaciones')} />
        <small>Obligatorio</small>
      </label>
      <p className='texto-button' onClick={() => handledOpenMensajeRecibo()}>
        Modificar mensaje de recibo
      </p>
      {
        openMensajeRecibo && (
          <>
          <label>
            <input
                type="mensajeRecibo"
                placeholder="Modificar mensaje del recibo"
                {...register('mensajeRecibo')}
              />
              <small className='mensaje-recibo'>Este campo modificara el mensaje completo, predeterminado del recibo</small>
          </label>
          </>
        )
      }
      <button type="submit">
        Liquidar Pago
      </button>
      </form>
    </Modal>
  )
}

export default ModalEstatus
