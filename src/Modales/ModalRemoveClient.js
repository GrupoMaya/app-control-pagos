import { useState, useEffect } from 'react'
import { useMachine } from '@xstate/react'

import BuscadorMachine from 'context/BuscadorMachine'
import { useForm } from 'react-hook-form'

import { Modal } from 'antd'

const ModalRemoveClient = ({ visible, onCancel }) => {

  const [state, send] = useMachine(BuscadorMachine)
  const { handleSubmit, register } = useForm()
  
  const onSubmitForm = (data) => {
    send('USER_SEARCH', { keyword: data.keyword })
  }

  const [openResults, setOpenResult] = useState(false)
  const toogleResult = () => setOpenResult(!openResults)
  console.log(toogleResult)

  useEffect(() => {
    if (state.matches('success') && openResults === false) {
      return setOpenResult(true)
    }
  }, [state])

  return (
  <>
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="¡Remover Ciente de lote!"
      style={{ background: 'red' }}
      >
    { state.matches('error') && <p className="error__message">No hay usuario que coincidan con tu búsqueda</p>}
    <form 
      className="modal__remove__user"
      onSubmit={handleSubmit(onSubmitForm)}>
      <input 
        id="input__search__proyecto" 
        placeholder="Buscar por nombre" 
        { ...register('keyword') }
      />              
      <button 
        htmlFor="input__search__proyecto">
          Buscar
      </button>
    </form>
      {
        state.matches('success') && JSON.stringify(state.context)
      }
    </Modal>
  </>
  )
}

export default ModalRemoveClient
