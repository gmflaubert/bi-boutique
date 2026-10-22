import { createContext, useContext, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { adminCredentials } from '../data/initialProducts';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => loadFromStorage('bi_auth', false)
  );

  function login(username, password) {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true);
      saveToStorage('bi_auth', true);
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    saveToStorage('bi_auth', false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
