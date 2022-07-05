import { useState, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'
import { useForm } from 'react-hook-form'

import ModalUserSearch from 'Modales/ModalUserSearch'
import ModalRefPago from 'Modales/ModalRefPago'

const Buscador = () => {

  const [state, send] = useMachine(BuscadorMachine)
  const { handleSubmit, register } = useForm()
  
  const onSubmitForm = (data) => {
    // regex numbers only
    const regex = /^[0-9]*$/
    if (regex.test(data.keyword)) {
      send('USER_SEARCH_PAGO', { keyword: data.keyword })
    } else {
      send('USER_SEARCH', { keyword: data.keyword })
    }

  }

  const [openResults, setOpenResult] = useState(false)
  const toogleResult = () => setOpenResult(!openResults)

  const [openRefPago, setOpenRefPago] = useState(false)
  const toogleRefPago = () => setOpenRefPago(!openRefPago)

  useEffect(() => {
    if (state.matches('success') && openResults === false) {
      return setOpenResult(true)
    }

    if (state.matches('successRefPago') && openRefPago === false) {
      return setOpenRefPago(true)
    }
  }, [state])

  return (
  <>
    { state.matches('error') && <p className="error__message">No hay usuario que coincidan con tu búsqueda</p>}
    <form className="proyecto__input" onSubmit={handleSubmit(onSubmitForm)}>
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
    <ModalUserSearch
      visible={openResults}
      onCancel={toogleResult}
      dataResult={state}
    />
    <ModalRefPago
      visible={openRefPago}
      onCancel={toogleRefPago}
      dataResult={state}
    />
  </>
  )
}

export default Buscador
