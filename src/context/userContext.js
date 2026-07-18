import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { login as apiLogin, validateToken, decodeToken, logout as apiLogout } from '@/api/auth'

export const UserStateContext = createContext(null)
export const UserDispatchContext = createContext(null)

export function UserContextProvider ({ children }) {
  const [user, setUser] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('tokenUserSite')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    validateToken(token)
      .then(data => {
        if (data?.message === 'authentication error') {
          throw new Error('Credenciales no válidas')
        }
        setUser(data)
      })
      .catch(() => {
        apiLogout()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials) => {
    setError(null)
    setLoading(true)
    try {
      const data = await apiLogin(credentials)
      const token = data?.login?.token
      if (!token) throw new Error('Login inválido')
      const userData = await validateToken(token)
      setUser(userData)
      return userData
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user)
  }

  return (
    <UserStateContext.Provider value={value}>
      <UserDispatchContext.Provider value={{ login, logout }}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

export function useUserState () {
  return useContext(UserStateContext)
}

export function useUserDispatch () {
  return useContext(UserDispatchContext)
}

export { decodeToken }
