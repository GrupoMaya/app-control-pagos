import { createContext, useContext, useState, useCallback } from 'react'
import { useSettings } from '@/hooks/api/useSettings'

export const AppContext = createContext(null)

export function AppContextProvider ({ children }) {
  const [modalPago, setModalPago] = useState(false)
  const [idPago, setIdPago] = useState(undefined)
  const [openDrawerNewUser, setOpenDrawerNewUser] = useState(false)
  const [openDrawerNewLote, setOpenDrawerNewLote] = useState(false)

  const { data: settings, isLoading: settingsLoading } = useSettings()

  const toggleDrawerNewUser = useCallback(() => {
    setOpenDrawerNewUser(prev => !prev)
  }, [])

  const toggleDrawerNewLote = useCallback(() => {
    setOpenDrawerNewLote(prev => !prev)
  }, [])

  const handleModalPago = useCallback(() => {
    setModalPago(prev => !prev)
  }, [])

  const value = {
    modalPago,
    setModalPago,
    idPago,
    setIdPago,
    openDrawerNewUser,
    setOpenDrawerNewUser,
    toggleDrawerNewUser,
    openDrawerNewLote,
    setOpenDrawerNewLote,
    toggleDrawerNewLote,
    handleModalPago,
    plataformName: settings?.razonSocial,
    settingsLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext () {
  return useContext(AppContext)
}
