import { useContext, useEffect, useState } from 'react'
import { AppContext } from 'context/AppContextProvider'
import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'
import { Modal } from 'antd'

import { useForm } from 'react-hook-form'
import Notify from 'utils/Notify'
import SelectorBanco from 'utils/SelectorBanco'

const ModalEstatus = ({ pagos }) => {

  const [state, send] = useMachine(ClienteMachine)
  const { idPago, modalPago, setModalPago } = useContext(AppContext)
  
  const { register, formState: { errors }, handleSubmit } = useForm()
  const [notify, setNotify] = useState(false)

  useEffect(() => {
    if (state.matches('success')) {
      setNotify(true)

      setTimeout(() => {
        setNotify(false)
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

      <button type="submit">
        Liquidar Pago
      </button>
      </form>
      { notify && <Notify msg="Documento Pagado" errorType="success" />}
    </Modal>
  )
}

export default ModalEstatus
