import axios from 'axios';
import config from '../constants/config';
import { Insumo } from '../types';

export const insumoService = {
  listarTodos: async (): Promise<Insumo[]> => {
    const res = await axios.get(`${config.BASE_URL}/insumos`);
    return res.data;
  },
  crear: async (data: Partial<Insumo>): Promise<Insumo> => {
    const res = await axios.post(`${config.BASE_URL}/insumos`, data);
    return res.data;
  },
};

export default insumoService;
