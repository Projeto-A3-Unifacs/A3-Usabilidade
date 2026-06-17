import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL:
    'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1',
  timeout: 30000
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.error(
        'Token ausente, expirado ou recusado pela API.'
      );
    }

    return Promise.reject(error);
  }
);

export default api;