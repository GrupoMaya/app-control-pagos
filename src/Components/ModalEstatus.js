import { useContext, useEffect } from 'react'
import { AppContext } from 'context/AppContextProvider'
import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'
import { Modal } from 'antd'
import { useToast } from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import SelectorBanco from 'utils/SelectorBanco'

const ModalEstatus = () => {

  const [state, send] = useMachine(ClienteMachine)
  const { idPago, modalPago, setModalPago } = useContext(AppContext)
  
  const { register, formState: { errors }, handleSubmit, reset } = useForm()
  
  const toast = useToast()
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
        reset()
        location.reload()
      }, 3000)
    }
  }, [state.value])

  const pagar = (data) => {
    const payload = {
      ...data, status: true
    }
    send('POST__PAGAR', { idPago, payload })
  }

  const resetModal = () => {
    setModalPago(false)
    location.reload()
  }

  return (
    <Modal
    visible={modalPago}
    footer={null}
    onCancel={resetModal}
    >
      <form onSubmit={handleSubmit(pagar)} className="form__liquid__pago">
      <label>Referencia de Bancaria
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

      <button type="submit">
        Liquidar Pago
      </button>
      </form>
    </Modal>
  )
}

export default ModalEstatus
