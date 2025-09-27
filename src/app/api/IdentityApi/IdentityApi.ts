import { UrlTemplateUtil } from '@/shared/lib/utils/UrlTemplateUtil';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';

export enum SequenceName {
  FIELD = 'field_id_seq',
  FIELD_GROUP = 'field_group_id_seq',
  FIELD_OPTION = 'field_option_id_seq',
}

export interface IdentityPool {
  name: string;
  values: number[];
}

class IdentityApi {
  getAllIdPools = async (): Promise<IdentityPool[]> => {
    const response = await baseApi.get(ApiRoutes.GET_ALL_IDENTITY_POOLS);

    return response.data;
  };

  getIdPoolValues = async (name: SequenceName): Promise<number[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ApiRoutes.GET_IDENTITY_POOL, { name })
    );

    return response.data;
  };
}

export const identityApi = new IdentityApi();
