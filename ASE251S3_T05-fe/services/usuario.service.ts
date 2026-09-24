import axios from 'axios';
import config from '../constants/config';
import { Usuario } from '../types';

export const usuarioService = {
  listarTodos: async (): Promise<Usuario[]> => {
    const res = await axios.get(`${config.BASE_URL}/usuarios`);
    return res.data;
  },
  crear: async (data: Partial<Usuario>): Promise<Usuario> => {
    const res = await axios.post(`${config.BASE_URL}/usuarios`, data);
    return res.data;
  },
};

export default usuarioService;
