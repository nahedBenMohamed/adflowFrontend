import { UrlUtil } from '@/shared';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export const determineApiHost = (): string => {
  const hostname = UrlUtil.getCurrentHostname();

  // for testing local backend
  if (hostname.includes('.loc')) return `http://${hostname}:8000`;

  return import.meta.env.VITE_BASE_API_URL || `https://${hostname}`;
};

class BaseApi {
  private _axios = axios.create({
    baseURL: determineApiHost(),
    headers: {
      'X-Api-Key': import.meta.env.VITE_BASE_API_KEY,
    },
  });

  get = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return this._axios.get(url, config);
  };

  post = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return this._axios.post(url, data, config);
  };

  put = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return this._axios.put(url, data, config);
  };

  patch = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return this._axios.patch(url, data, config);
  };

  delete = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return this._axios.delete(url, config);
  };

  setAuthToken = (token: string): void => {
    this.setRequestHeader({ Authorization: `Bearer ${token}` });
  };

  setRequestHeader = (data: Record<string, string>): void => {
    for (const key in data) {
      this._axios.defaults.headers.common[key] = data[key] as string;
    }
  };
}

export const baseApi = new BaseApi();
