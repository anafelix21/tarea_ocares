import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import authService from '../services/auth.service';
import storage from '../utils/storage';

interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    storage.getItem('auth_user').then((savedUser) => {
      if (savedUser) {
        setUser(savedUser);
      } else {
        const defaultUser: Usuario = {
          id: '1',
          nombre: 'Hugo',
          apellido: 'Fernandez',
          correo: 'hugo.fernandez@agropacayales.com',
          rol: 'ADMIN',
          estado: true,
        };
        setUser(defaultUser);
      }
    });
  }, []);

  const login = async (correo: string, password: string): Promise<boolean> => {
    try {
      const usuario = await authService.login(correo, password);
      setUser(usuario);
      await storage.setItem('auth_user', usuario);
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await storage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => useContext(AuthContext);
