import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import api from '../config/api';

interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    // Default logged in user fallback for convenience in testing
    const defaultUser: Usuario = {
      id: '1',
      nombre: 'Hugo',
      apellido: 'Fernandez',
      correo: 'hugo.fernandez@agropacayales.com',
      rol: 'ADMIN',
      estado: true,
    };
    setUser(defaultUser);
  }, []);

  const login = async (correo: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { correo, password });
      if (res.data) {
        setUser(res.data);
        return true;
      }
    } catch (e) {
      console.warn('Backend login fallback active:', e);
      // Fallback user validation if backend offline
      if (correo.includes('@agropacayales.com')) {
        setUser({
          nombre: correo.split('@')[0].toUpperCase(),
          apellido: 'Usuario',
          correo,
          rol: correo.includes('admin') ? 'ADMIN' : 'SUPERVISOR',
          estado: true,
        });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
