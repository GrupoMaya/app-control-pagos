import { useEffect } from 'react'
import { Modal } from 'antd'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'

const FormCapsule = ({ dataApp, send }) => {

  const onSubmit = (data) => {
    console.log(data)
    send('PATCH_SETTINGS_DATA', { data })
  }
  
  const { handleSubmit, register } = useForm({
    defaultValues: dataApp
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="modal__settings">
    <label htmlFor="razonSocial">
      Razón Social
      <div>
          <input 
            type="text"
            id="razonSocial"
            {...register('razonSocial', { required: true })}
          />
      </div>
    </label>
    <label htmlFor="razonSocial">
      RFC
      <div>
          <input 
            type="text"
            id="rfc"
            {...register('rfc', { required: true })}
          />
      </div>
    </label>
    <label htmlFor="direccion">
      Calle, Número y Código Postal
      <div>
          <input 
            type="text"
            id="direccion"
            {...register('direccion', { required: true })}
          />
      </div>
    </label>
    <label htmlFor="ciudad">
      Ciudad, Estado y Municipio
      <div>
          <input 
            type="text"
            id="ciudad"
            {...register('ciudad', { required: true })}
          />
      </div>
    </label>
    <div className="footer__form">
    <button type="submit">
      Guardar
    </button>
    </div>
  </form>
  )
}

const ModalSettings = ({ visible, onCancel }) => {

  const [state, send] = useMachine(BuscadorMachine)
  useEffect(() => {
    send('GET_SETTINGS_APP')
  }, [])

  const { appData } = state.context

  return (  
    <Modal
      title="Configuración de la Empresa"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      >
     { 
      state.matches('success') &&
        <FormCapsule dataApp={appData} send={send} />
      }
    </Modal>
  )
}

export default ModalSettings
