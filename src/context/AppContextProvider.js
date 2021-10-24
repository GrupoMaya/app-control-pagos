import { createContext, useState } from 'react'
import { baseURL } from 'context/controllers'

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const [modalPago, setModalPago] = useState(false)
  const [idPago, setIdPago] = useState(undefined)
  
  const [openModalPago, SetOpenModalPago] = useState(false)
  const handleModalPago = () => SetOpenModalPago(!openModalPago)

  const [plataformName, setPlataformName] = useState(undefined)
  const GetInfoData = async () => {    
    const promise = new Promise((resolve) => {
      resolve(fetch(`${baseURL}/settingsapp/get`))
    })
      .then(response => response.json())
      .then(data => {        
        return data.message
      })

    return Promise.all([promise])
      .then(res => {
        const name = Object.values(res[0])[0]?.razonSocial
        setPlataformName(name)
      })
    
  }

  return (
    <AppContext.Provider value={{
      modalPago,
      setModalPago,
      idPago, 
      setIdPago,
      openModalPago,
      handleModalPago,
      plataformName,
      setPlataformName,
      GetInfoData
    }}>
      { props.children }
    </AppContext.Provider>
  )
}

export default AppContextProvider
