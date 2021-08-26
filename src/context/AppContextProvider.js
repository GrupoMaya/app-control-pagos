import { createContext, useState } from 'react'

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const [modalPago, setModalPago] = useState(false)
  const [idPago, setIdPago] = useState(undefined)
  
  const [openModalPago, SetOpenModalPago] = useState(false)
  const handleModalPago = () => SetOpenModalPago(!openModalPago)

  return (
    <AppContext.Provider value={{
      modalPago,
      setModalPago,
      idPago, 
      setIdPago,
      openModalPago,
      handleModalPago
    }}>
      { props.children }
    </AppContext.Provider>
  )
}

export default AppContextProvider
