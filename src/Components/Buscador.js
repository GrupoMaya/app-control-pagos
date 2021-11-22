import { useState, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'
import { useForm } from 'react-hook-form'

import ModalUserSearch from 'Modales/ModalUserSearch'

const Buscador = () => {

  const [state, send] = useMachine(BuscadorMachine)
  const { handleSubmit, register } = useForm()
  
  const onSubmitForm = (data) => {
    send('USER_SEARCH', { keyword: data.keyword })
  }

  const [openResults, setOpenResult] = useState(false)
  const toogleResult = () => setOpenResult(!openResults)

  useEffect(() => {
    if (state.matches('success') && openResults === false) {
      return setOpenResult(true)
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
  </>
  )
}

export default Buscador
