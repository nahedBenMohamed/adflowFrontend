import { baseApi } from '@/app';
import type { Nullable } from '@/shared';
import { AccountApiAccess } from '../../shared';
import { SettingsApiRoutes } from '../SettingsApiRoutes';

class AccountApiAccessApi {
  createAccountApiAccess = async (): Promise<AccountApiAccess> => {
    const response = await baseApi.post(SettingsApiRoutes.CREATE_API_ACCESS);

    return AccountApiAccess.fromDto(response.data);
  };

  getAccountApiAccess = async (): Promise<Nullable<AccountApiAccess>> => {
    const response = await baseApi.get(SettingsApiRoutes.GET_API_ACCESS);

    return response.data ? AccountApiAccess.fromDto(response.data) : null;
  };

  recreateAccountApiAccess = async (): Promise<AccountApiAccess> => {
    const response = await baseApi.put(SettingsApiRoutes.RECREATE_API_ACCESS);

    return AccountApiAccess.fromDto(response.data);
  };
}

export const accountApiAccessApi = new AccountApiAccessApi();
