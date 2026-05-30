import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';

const defaultConfig: CreateAxiosDefaults = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
};

export const apiClient: AxiosInstance = axios.create(defaultConfig);

export function createApiClient(config?: CreateAxiosDefaults): AxiosInstance {
  return axios.create({ ...defaultConfig, ...config });
}
