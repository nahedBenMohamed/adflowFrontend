import type { DadataBankRequisitesSuggestion, DadataOrgRequisitesSuggestion } from '@/shared';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';

export class DadataApi {
  // proxy on https://dadata.ru/api/suggest/bank/
  getBankRequisites = async (query: string): Promise<DadataBankRequisitesSuggestion[]> => {
    const response = await baseApi.get(ApiRoutes.GET_BANK_REQUISITES, {
      params: {
        query,
      },
    });

    return response.data;
  };

  // proxy on https://dadata.ru/api/suggest/party/
  getOrgRequisites = async (query: string): Promise<DadataOrgRequisitesSuggestion[]> => {
    const response = await baseApi.get(ApiRoutes.GET_ORG_REQUISITES, {
      params: {
        query,
      },
    });

    return response.data;
  };
}

export const dadataApi = new DadataApi();
