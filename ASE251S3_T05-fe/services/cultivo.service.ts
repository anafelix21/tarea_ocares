import axios from 'axios';
import config from '../constants/config';
import { Cultivo } from '../types';

export const cultivoService = {
  listarTodos: async (): Promise<Cultivo[]> => {
    const res = await axios.get(`${config.BASE_URL}/cultivos`);
    return res.data;
  },
  crear: async (data: Partial<Cultivo>): Promise<Cultivo> => {
    const res = await axios.post(`${config.BASE_URL}/cultivos`, data);
    return res.data;
  },
};

export default cultivoService;
