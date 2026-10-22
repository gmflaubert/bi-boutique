import { createContext, useContext, useState } from 'react'
import { readStorage, writeStorage } from '../utils'
import { ADMIN_CREDENTIALS } from '../config'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readStorage('bi_auth', false))

  function login(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      writeStorage('bi_auth', true)
      return true
    }
    return false
  }

  function logout() {
    setIsAuthenticated(false)
    writeStorage('bi_auth', false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
