import { baseApi } from '../BaseApi/BaseApi';

const IP_REGISTRY = 'https://api.ipregistry.co';

class UtilityApi {
  getCountryCode = async (): Promise<string> => {
    const response = await baseApi.get(IP_REGISTRY, {
      params: {
        key: import.meta.env.VITE_IP_REGISTRY_API_KEY,
      },
    });

    return response.data.location.country.code.toLowerCase();
  };
}

export const utilityApi = new UtilityApi();
