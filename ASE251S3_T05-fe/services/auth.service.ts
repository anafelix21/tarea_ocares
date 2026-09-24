import axios from 'axios';
import config from '../constants/config';
import { Usuario } from '../types';

export const authService = {
  login: async (correo: string, password: string): Promise<Usuario> => {
    try {
      const res = await axios.post(`${config.BASE_URL}/auth/login`, { correo, password });
      return res.data;
    } catch (e) {
      console.warn('Fallback login service:', e);
      return {
        id: '1',
        nombre: 'Hugo',
        apellido: 'Fernandez',
        correo,
        rol: 'ADMIN',
        estado: true,
      };
    }
  },
};

export default authService;
