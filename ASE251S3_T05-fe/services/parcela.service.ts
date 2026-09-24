import axios from 'axios';
import config from '../constants/config';
import { Parcela } from '../types';

export const parcelaService = {
  listarTodas: async (): Promise<Parcela[]> => {
    const res = await axios.get(`${config.BASE_URL}/parcelas`);
    return res.data;
  },
  crear: async (data: Partial<Parcela>): Promise<Parcela> => {
    const res = await axios.post(`${config.BASE_URL}/parcelas`, data);
    return res.data;
  },
};

export default parcelaService;
